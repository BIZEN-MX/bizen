"use client"

import React, { useReducer, useEffect, useCallback, useRef, useState } from "react"
import { LessonStep } from "@/types/lessonTypes"
import { lessonReducer, LessonState } from "./lessonReducer"
import { LessonScreen } from "./LessonScreen"
import { StickyFooterButton, StickyFooter } from "./StickyFooter"
import { LessonExitModal } from "./LessonExitModal"
import { LessonProgressHeader } from "./LessonProgressHeader"
import { CONTENT_MAX_WIDTH, CONTENT_PADDING_X, CONTENT_PADDING_Y } from "./layoutConstants"
import { Zap, Book, ChevronRight, X, AlertCircle } from "lucide-react"
import {
  InfoStep,
  MCQStep,
  MultiSelectStep,
  TrueFalseStep,
  OrderStep,
  MatchStep,
  FillBlanksStep,
  ImageChoiceStep,
  SummaryStep,
  MiniSimStep,
  BillyTalksStep,
  BlitzChallengeStep,
  ImpulseMeterStep,
  MindsetTranslatorStep,
  InfluenceDetectiveStep,
  NarrativeCheckStep,
} from "./steps"
import { SwipeSorterStep } from "./steps/SwipeSorterStep"
import { haptic } from "@/utils/hapticFeedback"
import { playCorrectSound, playIncorrectSound, playFlipSound, initAudioContext } from "./lessonSounds"
import { SmartText } from "./SmartText"
import { motion, AnimatePresence } from "framer-motion"
import { GlossaryProvider } from "@/contexts/GlossaryContext"

interface LessonEngineProps {
  lessonSteps: LessonStep[]
  /** Called when lesson is completed; receives stars earned and all answers collected. */
  onComplete?: (stars: number, answers: Record<string, { isCorrect: boolean, answerData?: any }>) => void
  onExit?: () => void
  /** Called when progress changes (progress bar = currentStep/totalSteps; stars = by mistakes). */
  onProgressChange?: (progress: { currentStep: number; totalSteps: number; streak: number; stars: 0 | 1 | 2 | 3 }) => void
  isRepeat?: boolean
}

/**
 * Extracts readable text from a LessonStep for Text-to-Speech playback.
 */


/**
 * Main lesson engine component that manages state and renders appropriate step components
 */
export function LessonEngine({ lessonSteps, onComplete, onExit, onProgressChange, isRepeat }: LessonEngineProps) {
  const [state, dispatch] = useReducer(lessonReducer, {
    originalSteps: lessonSteps,
    allSteps: lessonSteps,
    currentStepIndex: 0,
    answersByStepId: {},
    incorrectSteps: [],
    totalMistakes: 0,
    hasBuiltReviewSteps: false,
    isContinueEnabled: false,
    isActionEnabled: false,
    actionTrigger: 0,
  })

  const [isExitModalOpen, setIsExitModalOpen] = useState(false)
  const [showRecallOverlay, setShowRecallOverlay] = useState(false)
  const hasShownRecallHint = useRef(false)
  const [showBlitzSplash, setShowBlitzSplash] = useState(false)
  const blitzSplashShownFor = useRef<string | null>(null)
  
  const [showMissionStartSplash, setShowMissionStartSplash] = useState(false)
  const missionSplashTriggered = useRef(false)
  
  useEffect(() => {
    if (isRepeat === false && !missionSplashTriggered.current) {
      setShowMissionStartSplash(true)
      missionSplashTriggered.current = true
    }
  }, [isRepeat])
  const [showStreakSplash, setShowStreakSplash] = useState(false)
  const hasShownStreakSplash = useRef(false)

  // ── Billy Insight Splash ─────────────────────────────────────────────────
  const [showBillyInsightSplash, setShowBillyInsightSplash] = useState(false)
  const [billyInsightText, setBillyInsightText] = useState("")
  const [billyInsightDuration, setBillyInsightDuration] = useState(7000)
  const billyInsightShownFor = useRef<string | null>(null)
  const billyInsightsCount = useRef(0)
  
  // ── Lesson Glossary ──────────────────────────────────────────────────────
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false)
  const [showReviewSplash, setShowReviewSplash] = useState(false)
  
  // Trigger Review Splash when review steps are built
  useEffect(() => {
    if (state.hasBuiltReviewSteps && state.currentStepIndex === state.originalSteps.length - (state.originalSteps.some(s => s.stepType === 'summary') ? 1 : 0)) {
        setShowReviewSplash(true)
    }
  }, [state.hasBuiltReviewSteps])
  const [lessonGlossary, setLessonGlossary] = useState<{ word: string, definition: string }[]>([])
  const [interactiveTermsByOrder, setInteractiveTermsByOrder] = useState<Map<number, { word: string, definition: string }[]>>(new Map())

  // Collect terms and calculate FIRST OCCURRENCES per step (Feature: highlight once)
  useEffect(() => {
    if (!lessonSteps.length) return
    const allTermsMap: Record<string, string> = {}
    
    // 1. Gather ALL available definitions first (from glossary data)
    lessonSteps.forEach(s => {
      const step = s as any
      if (step.data && step.data.glossary && Array.isArray(step.data.glossary)) {
        step.data.glossary.forEach((term: { word: string; definition: string }) => {
          if (term.word && term.definition) allTermsMap[term.word] = term.definition
        })
      }
      if (step.stepType === 'info' && step.title && step.title.length < 40) {
        if (!allTermsMap[step.title]) {
           const bodySnippet = (step.body || "").split('\n')[0].replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$1").slice(0, 80)
           if (bodySnippet) allTermsMap[step.title] = bodySnippet
        }
      }
    })

    const finalGlossary = Object.entries(allTermsMap).map(([word, definition]) => ({ word, definition }))
    setLessonGlossary(finalGlossary.sort((a,b) => a.word.localeCompare(b.word)))

    // 2. Determine which terms appear for the FIRST time in which step
    const seenWords = new Set<string>()
    const map = new Map<number, { word: string, definition: string }[]>()
    
    const sortedSteps = [...lessonSteps].sort((a,b) => (a as any).order - (b as any).order)
    
    sortedSteps.forEach(s => {
      const step = s as any
      const stepWords: { word: string; definition: string }[] = []
      
      const fullText = (step.title + " " + step.body + " " + (step.aiInsight || "") + " " + (step.clue || "")).toLowerCase()
      
      finalGlossary.forEach(term => {
        // Use a simple word boundary check
        const escaped = term.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const re = new RegExp(`\\b${escaped}\\b`, 'i')
        
        if (re.test(fullText) && !seenWords.has(term.word)) {
          stepWords.push(term)
          seenWords.add(term.word)
        }
      })

      
      if (stepWords.length > 0) {
        map.set(step.order, stepWords)
      }
    })

    setInteractiveTermsByOrder(map)
  }, [lessonSteps])

  // ── Billy Empático (Feature 2) ───────────────────────────────────────────
  const [showBillyEmpathy, setShowBillyEmpathy] = useState(false)
  const billyEmpathyShownAt = useRef<number>(-1) // mistake count when last shown

  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  const [startTime] = useState(() => Date.now())

  // Initialize on mount
  useEffect(() => {
    console.log("[LessonEngine] Initializing with steps:", lessonSteps?.length);
    if (lessonSteps && lessonSteps.length > 0) {
      dispatch({ type: "INIT", steps: lessonSteps })
    } else {
      console.warn("[LessonEngine] Received empty lessonSteps array");
    }
  }, [lessonSteps])

  // Track phase changes
  useEffect(() => {
    console.log("[LessonEngine] Current Step Index:", state.currentStepIndex, "All Steps:", state.allSteps?.length);
  }, [state.currentStepIndex, state.allSteps])


  // After last original step: build review steps for wrong answers, or go to summary if all correct
  useEffect(() => {
    const hasCompletedLastOriginal = state.currentStepIndex === state.originalSteps.length

    if (hasCompletedLastOriginal && !state.hasBuiltReviewSteps) {
      if (state.incorrectSteps.length > 0) {
        dispatch({ type: "BUILD_REVIEW_STEPS" })
      } else {
        dispatch({ type: "GO_TO_SUMMARY" })
      }
    }
  }, [state.currentStepIndex, state.originalSteps.length, state.hasBuiltReviewSteps, state.incorrectSteps.length])

  // ── Billy Empático: show after 3rd mistake (Feature 2) ───────────────────
  useEffect(() => {
    if (
      state.totalMistakes >= 3 &&
      state.totalMistakes !== billyEmpathyShownAt.current
    ) {
      billyEmpathyShownAt.current = state.totalMistakes
      setShowBillyEmpathy(true)
      setTimeout(() => setShowBillyEmpathy(false), 4000)
    }
  }, [state.totalMistakes])

  const handleAnswered = useCallback(
    (stepId: string, result: { isCompleted: boolean; isCorrect?: boolean; answerData?: any; canAction?: boolean }) => {
      // Update action enabled state in reducer
      if (result.canAction !== undefined) {
        dispatch({ type: "SET_ACTION_ENABLED", enabled: !!result.canAction })
      } else {
        dispatch({ type: "SET_ACTION_ENABLED", enabled: true })
      }

      if (result.isCompleted && result.isCorrect !== undefined) {
        const currentStep = state.allSteps.find((s) => s.id === stepId)
        const isReviewStep = !!currentStep?.reviewSourceStepId

        dispatch({
          type: "ANSWER_STEP",
          stepId,
          isCorrect: result.isCorrect,
          answerData: result.answerData,
        })
        if (result.isCorrect || !isReviewStep) {
          dispatch({ type: "ENABLE_CONTINUE" })
          if (result.isCorrect) haptic.success()
        } else {
          // If a review step is failed, we append it again so it repeats
          dispatch({ type: "APPEND_REVIEW_STEP", sourceStepId: currentStep!.reviewSourceStepId! })
          dispatch({ type: "ENABLE_CONTINUE" }) // Allow moving to the appended retry
          haptic.error()
        }
      } else if (result.isCompleted) {
        dispatch({ type: "ENABLE_CONTINUE" })
      } else {
        dispatch({ type: "DISABLE_CONTINUE" })
      }
    },
    [state.allSteps]
  )

  const currentStep = state.allSteps[state.currentStepIndex]
  const isLastStep = state.currentStepIndex >= state.allSteps.length - 1
  const isSummaryStep = currentStep?.stepType === "summary"
  const isAssessment = ["mcq", "true_false", "multi_select", "order", "match", "fill_blanks", "image_choice", "blitz_challenge", "swipe_sorter", "influence_detective", "impulse_meter", "narrative_check"].includes(currentStep?.stepType || "")
  // Check if current lesson/step is part of a final evaluation (exam)
  const isExam = lessonSteps.some(s => s.id.startsWith("eval-")) || currentStep?.id.startsWith("eval-") || currentStep?.id.toLowerCase().includes("examen") || currentStep?.id.toLowerCase().includes("evaluacion")

  // Blitz Splash: fullscreen warning when entering a blitz_challenge step
  useEffect(() => {
    if (!currentStep || showMissionStartSplash) return
    if (currentStep.stepType === "blitz_challenge" && blitzSplashShownFor.current !== currentStep.id) {
      blitzSplashShownFor.current = currentStep.id
      setShowBlitzSplash(true)
      const t = setTimeout(() => setShowBlitzSplash(false), 2600)
      return () => clearTimeout(t)
    }
  }, [currentStep?.id, currentStep?.stepType, showMissionStartSplash])

  // Billy Insight Splash: show fullscreen when entering a step with aiInsight
  // Per user request, don't show it before a Blitz Challenge to avoid overlay fatigue
  // Maximum 3 Billy Insights per lesson. HIDE DURING EXAMS.
  useEffect(() => {
    if (!currentStep || isExam || showMissionStartSplash) return
    const insight = (currentStep as any).aiInsight
    if (insight && currentStep.stepType !== "blitz_challenge" && billyInsightShownFor.current !== currentStep.id) {
      // Check for limit
      if (billyInsightsCount.current >= 3) return

      billyInsightShownFor.current = currentStep.id
      billyInsightsCount.current += 1
      setBillyInsightText(insight)

      // Calculate dynamic duration: min 8s, max 10s. Reading speed approx 3.5 words/sec.
      const calculatedDuration = 7000
      
      setBillyInsightDuration(calculatedDuration)
      setShowBillyInsightSplash(true)
      
      const t = setTimeout(() => setShowBillyInsightSplash(false), calculatedDuration)
      return () => clearTimeout(t)
    }
  }, [currentStep?.id, currentStep?.stepType, showMissionStartSplash, isExam])





  // Stop audio on unmount or step change


  // Find the last theoretical step seen before the current step
  const lastInfoStep = React.useMemo(() => {
    for (let i = state.currentStepIndex - 1; i >= 0; i--) {
      const step = state.allSteps[i]
      if (step?.stepType === "info" || step?.stepType === "billy_talks") return step
    }
    return null
  }, [state.currentStepIndex, state.allSteps])

  const showRecallButton = isAssessment && lastInfoStep != null && !state.isContinueEnabled && !isExam

  // Animate hint bounce once per session when the button first becomes visible
  const [recallHintBounce, setRecallHintBounce] = useState(false)
  const [isMobileScreen, setIsMobileScreen] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobileScreen(window.innerWidth <= 1024)
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (showRecallButton && !hasShownRecallHint.current) {
      hasShownRecallHint.current = true
      setRecallHintBounce(true)
      const t = setTimeout(() => setRecallHintBounce(false), 1200)
      return () => clearTimeout(t)
    }
  }, [showRecallButton])

  // Compute streak and stars from state
  const originalQuizStepIds = state.originalSteps
    .filter((s) => s.stepType === "mcq" && (s as { isAssessment?: boolean }).isAssessment)
    .map((s) => s.id)
  let streak = 0
  let currentCorrectChain = 0
  for (const stepId of originalQuizStepIds) {
    const result = state.answersByStepId[stepId]
    if (result?.isCorrect) {
        streak++
        currentCorrectChain++
    } else if (result) {
        currentCorrectChain = 0
        break
    } else {
        break
    }
  }

  // Trigger Streak Splash
  useEffect(() => {
    if (!showMissionStartSplash && streak >= 5 && !hasShownStreakSplash.current) {
        hasShownStreakSplash.current = true
        setShowStreakSplash(true)
    }
  }, [streak, showMissionStartSplash])

  const mistakeCount = state.totalMistakes
  const stars: 0 | 1 | 2 | 3 =
    mistakeCount === 0 ? 3 : mistakeCount <= 2 ? 2 : 1

  useEffect(() => {
    onProgressChange?.({
      currentStep: state.currentStepIndex + 1,
      totalSteps: state.allSteps.length,
      streak,
      stars,
    })
  }, [state.currentStepIndex, state.allSteps.length, streak, stars, onProgressChange])

  // Close recall overlay when advancing to a new step
  useEffect(() => {
    setShowRecallOverlay(false)
  }, [state.currentStepIndex])

  useEffect(() => {
    if (isSummaryStep) {
      onCompleteRef.current?.(stars, state.answersByStepId)
    }
  }, [isSummaryStep, stars, state.answersByStepId])

  const handleContinue = useCallback(() => {
    initAudioContext() // Sync unlock context on click
    if (!currentStep) return

    // For Summary Step, handle its two phases (celebration -> xp)
    if (isSummaryStep) {
      if (!state.isContinueEnabled) {
        haptic.light()
        dispatch({ type: "TRIGGER_ACTION" })
      } else {
        onExit?.()
      }
      return
    }

    // If step is not completed, trigger the action (Reveal or Check)
    if (!state.isContinueEnabled) {
      if (state.isActionEnabled) {
        haptic.light()
        dispatch({ type: "TRIGGER_ACTION" })
      }
      return
    }

    // If it's a review step and it was wrong, we've already appended a new retry.
    // Moving next will take us to that retry.

    // Check if we should transition to summary from a review step
    const isOnReviewStep = !!currentStep?.reviewSourceStepId
    if (isLastStep && isOnReviewStep && state.incorrectSteps.length === 0) {
      dispatch({ type: "GO_TO_SUMMARY_AFTER_REVIEW" })
      return
    }

    const nextIndex = state.currentStepIndex + 1
    const nextStep = state.allSteps[nextIndex]
    const nextStepIsSummary = nextStep?.stepType === "summary"

    // Transition logic for original flow
    // If next is summary OR we've reached the end of original steps, check if we need to build review pool
    const isAtEndOfOriginals = nextIndex >= state.originalSteps.length

    if ((nextStepIsSummary || isAtEndOfOriginals) && !state.hasBuiltReviewSteps) {
      if (state.incorrectSteps.length > 0) {
        dispatch({ type: "BUILD_REVIEW_STEPS" })
      } else if (nextIndex < state.allSteps.length) {
        dispatch({ type: "NEXT_STEP" })
      } else {
        dispatch({ type: "GO_TO_SUMMARY" })
      }
    } else if (nextIndex < state.allSteps.length) {
      haptic.light()
      dispatch({ type: "NEXT_STEP" })
    }
  }, [state.isContinueEnabled, state.currentStepIndex, state.allSteps, state.originalSteps, state.hasBuiltReviewSteps, state.incorrectSteps.length, stars, currentStep, state.isActionEnabled, isLastStep, isSummaryStep, state.answersByStepId])

  const handleBack = useCallback(() => {
    if (state.currentStepIndex > 0) {
      haptic.light()
      dispatch({ type: "PREV_STEP" })
    }
  }, [state.currentStepIndex])

  const handleAttemptExit = useCallback(() => {
    if (isSummaryStep) {
      onExit?.()
    } else {
      setIsExitModalOpen(true)
    }
  }, [isSummaryStep, onExit])

  // Stabilize the onAnswered callback to prevent infinite render loops in steps
  const onStepAnswered = useCallback((res: any) => {
    if (!currentStep) return
    handleAnswered(currentStep.id, res)
  }, [currentStep?.id, handleAnswered])

  if (!currentStep) return null

  const stepProps = {
    step: currentStep as any,
    onAnswered: onStepAnswered,
    actionTrigger: state.actionTrigger,
    isContinueEnabled: state.isContinueEnabled,
  }

  const currentStepInteractiveTerms = interactiveTermsByOrder.get((currentStep as any).order) || []

  const renderStep = () => {
    let content;
    switch (currentStep.stepType) {
      case "info":
        content = <InfoStep {...stepProps} />
        break;
      case "mcq":
        content = <MCQStep {...stepProps} />
        break;
      case "multi_select":
        content = <MultiSelectStep {...stepProps} />
        break;
      case "true_false":
        content = <TrueFalseStep {...stepProps} />
        break;
      case "order":
        content = <OrderStep {...stepProps} />
        break;
      case "match":
        content = <MatchStep {...stepProps} />
        break;
      case "fill_blanks":
        content = <FillBlanksStep {...stepProps} />
        break;
      case "image_choice":
        content = <ImageChoiceStep {...stepProps} />
        break;
      case "summary": {
        const assessmentTypes = ["mcq", "multi_select", "true_false", "order", "match", "fill_blanks", "image_choice", "blitz_challenge", "mindset_translator", "influence_detective", "swipe_sorter", "impulse_meter", "mindset_translator", "influence_detective", "swipe_sorter", "narrative_check", "swipe_sorter"]
        const assessmentSteps = state.originalSteps.filter(s => {
          const step = s as any
          return step.isAssessment ?? assessmentTypes.includes(step.stepType)
        })
        const accuracy = assessmentSteps.length > 0 
          ? Math.max(0, Math.round(((assessmentSteps.length - state.totalMistakes) / assessmentSteps.length) * 100))
          : 100
        const totalTime = Math.floor((Date.now() - startTime) / 1000)

        const isExamStep = currentStep.id.startsWith("eval-") || currentStep.id.toLowerCase().includes("examen") || currentStep.id.toLowerCase().includes("evaluacion")
        content = (
          <SummaryStep 
            {...stepProps} 
            step={{ 
              ...stepProps.step, 
              starsEarned: stars, 
              isRepeat,
              accuracy,
              totalTime,
              isExam: isExamStep
            }} 
            onRestart={() => dispatch({ type: "RESTART_LESSON" })}
          />
        )
        break;
      }
      case "mini_sim":
        content = <MiniSimStep {...stepProps} />
        break;
      case "billy_talks":
        content = <BillyTalksStep {...stepProps} />
        break;
      case "blitz_challenge":
        content = <BlitzChallengeStep {...stepProps} />
        break;
      case "impulse_meter":
        content = <ImpulseMeterStep {...stepProps} />
        break;
      case "mindset_translator":
        content = <MindsetTranslatorStep {...stepProps} />
        break;
      case "influence_detective":
        content = <InfluenceDetectiveStep {...stepProps} />
        break;
      case "swipe_sorter":
        content = <SwipeSorterStep {...(stepProps as any)} />
        break;
      case "narrative_check":
        content = <NarrativeCheckStep {...(stepProps as any)} />
        break;
      default:
        console.warn("[LessonEngine] Unknown step type:", currentStep?.stepType);
        content = (
          <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>
            <p style={{ fontSize: 18, fontWeight: 500 }}>Ups, no pudimos cargar este paso.</p>
            <p style={{ fontSize: 14 }}>Tipo: {(currentStep as any)?.stepType || "indefinido"}</p>
          </div>
        )
    }

    return (
      <GlossaryProvider terms={currentStepInteractiveTerms}>
        {content}
      </GlossaryProvider>
    )
  }

  const shouldPassFullScreenProps = true // Always use full screen layout for all steps to ensure consistent footer/header behavior

  const currentAnswer = state.answersByStepId[currentStep.id]
  const isCorrect = currentAnswer?.isCorrect === true
  const hasFeedback = state.isContinueEnabled && isAssessment

  const footerButtonLabel = (() => {
    if (hasFeedback && !isCorrect) {
      // Per user request: If incorrect, show "Siguiente" unless it's the last slide (where we must retry)
      return isLastStep ? "Intentar de nuevo" : "Siguiente"
    }
    if (isSummaryStep) {
      const accuracy = (stepProps.step as any).accuracy ?? 100
      const isExam = currentStep.id.startsWith("eval-")
      const isFailed = isExam && accuracy < 50
      
      if (!state.isContinueEnabled) {
        return isFailed ? "Repetir Examen" : "Continuar"
      }
      return "Finalizar"
    }
    if (isLastStep && isCorrect) return "Finalizar"
    if (!state.isContinueEnabled) {
      if (currentStep.stepType === "info") return "Continuar"
      if (isAssessment) return "Comprobar"
    }
    return (currentStep as any).continueLabel || "Continuar"
  })()

  const footerButtonDisabled = !state.isContinueEnabled && !state.isActionEnabled && !isSummaryStep && !isLastStep

  const renderFooter = (isFixed: boolean = true) => {
    const isTrueFalse = currentStep.stepType === "true_false"
    const isBlitz = currentStep.stepType === "blitz_challenge"
    const blitzCorrect = isBlitz && isCorrect

    // Specifically hide explanation (feedbackBody) for true_false per request
    // For blitz, show special message if correct
    const feedbackBody = (!isTrueFalse && !isBlitz && hasFeedback)
      ? (currentStep as any).options?.find((o: any) => o.id === currentAnswer?.answerData?.selectedOptionId)?.explanation
      : (blitzCorrect ? "Respondiste correctamente a tiempo." : undefined)

    const feedbackTitle = hasFeedback
      ? (blitzCorrect ? "¡Buen trabajo relámpago!" : (isCorrect ? "¡Muy bien hecho!" : "¡Sigue intentando!"))
      : undefined

    return (
      <StickyFooter
        fixed={isFixed}
        feedbackColor={hasFeedback ? (isCorrect ? "correct" : "incorrect") : null}
        feedbackTitle={feedbackTitle}
        feedbackBody={feedbackBody}
        isDark={isSummaryStep}
      >
        <div style={{ display: "flex", width: "100%", justifyContent: "center", alignItems: "center" }}>
          {/* Primary Action Button */}
          <StickyFooterButton
            variant={hasFeedback ? (isCorrect ? "blue" : "danger") : "blue"}
            onClick={handleContinue}
            disabled={footerButtonDisabled}
            style={{
              minWidth: "220px",
              fontSize: "0.95rem",
              fontWeight: 500,
              padding: "10px 40px",
              height: "45px"
            }}
          >
            {footerButtonLabel}
          </StickyFooterButton>
        </div>
      </StickyFooter>
    )
  }




  return (
    <GlossaryProvider terms={lessonGlossary}>
      {shouldPassFullScreenProps ? (
        <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          minHeight: "100dvh",
          maxHeight: "100dvh",
          height: "100dvh",
          overflow: "hidden",
          background: isSummaryStep ? "linear-gradient(135deg, #020e27 0%, #041640 40%, #061a4a 70%, #020e27 100%)" : "#FFFFFF",
        }}
      >
        {/* Header - Hidden on Summary Step for maximum immersion */}
        {!isSummaryStep && (
          <div style={{ flexShrink: 0, padding: "clamp(12px, 4vw, 32px) clamp(16px, 4vw, 48px) clamp(8px, 2vw, 20px)", display: "flex", justifyContent: "center" }}>
            <div style={{ width: "100%", maxWidth: 980 }}>
              <LessonProgressHeader
                currentStepIndex={state.currentStepIndex}
                totalSteps={state.allSteps.length}
                streak={streak}
                stars={stars}
                isExam={isExam}
                onExit={handleAttemptExit}
                hasGlossary={lessonGlossary.length > 0}
                onOpenGlossary={() => {
                  haptic.light()
                  setIsGlossaryOpen(true)
                }}
              />
            </div>
          </div>
        )}

        <LessonExitModal
          isOpen={isExitModalOpen}
          onClose={() => setIsExitModalOpen(false)}
          onExit={() => {
            setIsExitModalOpen(false)
            onExit?.()
          }}
        />

        {/* Overlays */}
        <BlitzSplashOverlay isOpen={showBlitzSplash} />
        <BillyInsightSplashOverlay 
          isOpen={showBillyInsightSplash} 
          text={billyInsightText} 
          duration={billyInsightDuration} 
          onClose={() => setShowBillyInsightSplash(false)} 
        />
        <ReviewSplashOverlay 
          isOpen={showReviewSplash} 
          onClose={() => {
            initAudioContext()
            playFlipSound()
            haptic.medium()
            setShowReviewSplash(false)
          }} 
        />
        <MissionStartSplashOverlay 
          isOpen={showMissionStartSplash} 
          onClose={() => {
            initAudioContext()
            playFlipSound()
            haptic.success()
            setShowMissionStartSplash(false)
          }} 
        />
        <StreakMilestoneSplashOverlay 
          isOpen={showStreakSplash} 
          streak={streak} 
          onClose={() => {
            playFlipSound()
            haptic.medium()
            setShowStreakSplash(false)
          }} 
        />

        {/* Content Area - Scrollable */}
        <div
          key={state.currentStepIndex}
          className="lesson-step-transition"
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: isSummaryStep
              ? "clamp(10px, 2vw, 12px) clamp(16px, 4vw, 48px) 120px"
              : "clamp(8px, 3vw, 24px) clamp(16px, 4vw, 48px) 120px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 980,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              flex: 1,
            }}
          >
            {renderStep()}
          </div>
        </div>

        {renderFooter(true)}

        {/* ── Billy Empático Overlay (Feature 2) ─────────────────────────── */}
        <AnimatePresence>
          {showBillyEmpathy && (
            <motion.div
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 80 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              style={{
                position: "fixed",
                bottom: 90,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 9000,
                background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
                borderRadius: 20,
                padding: "14px 20px",
                display: "flex",
                alignItems: "center",
                gap: 14,
                boxShadow: "0 12px 40px rgba(37,99,235,0.45)",
                maxWidth: 370,
                width: "calc(100% - 48px)",
              }}
            >
              <img
                src="/billy_chatbot.png"
                alt="Billy"
                style={{ width: 48, height: 48, objectFit: "contain", flexShrink: 0 }}
              />
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: "#93c5fd", letterSpacing: "0.04em" }}>
                  BILLY INSIGHTS
                </p>
                <p style={{ margin: "2px 0 0", fontSize: 14, fontWeight: 600, color: "white", lineHeight: 1.4 }}>
                  {((currentStep as any)?.aiInsight && (billyInsightsCount.current < 3 || billyInsightShownFor.current === currentStep?.id)) ? (currentStep as any).aiInsight :
                    "¡Tranquilo! Cada error que cometes es un concepto que se graba mejor. ¡Tú puedes!"}
                </p>
              </div>
              <button
                onClick={() => setShowBillyEmpathy(false)}
                style={{
                  background: "none", border: "none", color: "rgba(255,255,255,0.6)",
                  cursor: "pointer", fontSize: 18, flexShrink: 0, padding: 4,
                }}
              >✕</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Recall Button */}
        {showRecallButton && (

          <div className="recall-widget-container" style={{
            position: "fixed",
            bottom: "clamp(75px, 12vh, 88px)",
            left: "clamp(12px, 4vw, 48px)",
            zIndex: 8000,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}>
            {/* Animated blue arrow pointing down */}
            <svg
              className="recall-arrow"
              width="24" height="24" viewBox="0 0 24 24" fill="none"
              style={{
                filter: "drop-shadow(0 4px 6px rgba(37,99,235,0.3))"
              }}
            >
              <path d="M12 3v16M18 13l-6 6-6-6" stroke="#2563eb" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            {/* The BIG Button — opacity effect on hover */}
            <button
              className="recall-button"
              onClick={() => { playFlipSound(); setShowRecallOverlay(true) }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "clamp(6px, 1vw, 10px)",
                padding: "clamp(10px, 1.5vw, 14px) clamp(16px, 2.5vw, 24px)",
                background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
                border: "none",
                borderRadius: 999,
                boxShadow: "0 8px 24px rgba(37,99,235,0.4), inset 0 2px 0 rgba(255,255,255,0.2)",
                cursor: "pointer",
                fontSize: "clamp(13px, 1.8vw, 16px)",
                fontWeight: 500,
                color: "#ffffff",
                whiteSpace: "nowrap",
                animation: recallHintBounce ? "recallBounce 0.4s ease 2" : "none",
                opacity: 1,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.75" }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1" }}
            >
              {/* Custom SVG Flashcard/Notebook Icon */}
              <svg
                width="clamp(18px, 2vw, 22px)"
                height="clamp(18px, 2vw, 22px)"
                viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M6 2H18C19.1046 2 20 2.89543 20 4V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V4C4 2.89543 4.89543 2 6 2Z" stroke="white" strokeWidth="2.5" strokeLinejoin="round" />
                <path d="M4 7H20" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <path d="M9 11H15" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <path d="M9 15H13" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <path d="M6 2V22" stroke="white" strokeWidth="2" opacity="0.4" />
              </svg>
              <span>Repasar flashcard</span>
            </button>

          </div>
        )}

        {/* Flashcard Recall Overlay */}
        {showRecallOverlay && lastInfoStep && (
          <div
            onClick={() => { playFlipSound(); setShowRecallOverlay(false) }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(15, 23, 42, 0.7)",
              backdropFilter: "blur(4px)",
              zIndex: 9000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "24px 16px",
              animation: "recallFadeIn 0.2s ease",
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "#fff",
                borderRadius: 28,
                width: "100%",
                maxWidth: 640,
                maxHeight: "80vh",
                overflowY: "auto",
                position: "relative",
                // Synced with InfoStep flashcard border + glow
                border: "2px solid rgba(15, 98, 254, 0.22)",
                boxShadow: [
                  "0 0 0 4px rgba(15, 98, 254, 0.06)",
                  "0 2px 6px rgba(15,98,254,0.08)",
                  "0 10px 28px rgba(15,98,254,0.14)",
                  "0 32px 64px rgba(15,23,42,0.25)",
                ].join(", "),
                animation: "recallSlideUp 0.25s cubic-bezier(0.4,0,0.2,1)",
              }}
            >
              {/* Shimmer top bar — synced with InfoStep */}
              <div style={{
                height: 6,
                background: "linear-gradient(90deg, #1e40af 0%, #2563eb 35%, #3b82f6 65%, #60a5fa 100%)",
                borderRadius: "26px 26px 0 0",
                position: "relative",
                overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                  width: "50%",
                  animation: "shimmerSlide 2.5s linear 1s infinite",
                }} />
              </div>

              {/* Close button */}
              <button
                onClick={() => { playFlipSound(); setShowRecallOverlay(false) }}
                style={{
                  position: "absolute",
                  top: 18,
                  right: 18,
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "#EFF6FF",
                  border: "1.5px solid #BFDBFE",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#2563EB",
                  fontWeight: 500,
                  transition: "opacity 0.2s ease",
                  opacity: 1,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.7" }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = "1" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              {/* Content */}
              <div style={{ padding: "32px 32px 40px" }}>

                {/* Key Concept Label */}
                <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#eff6ff", border: "1.5px solid #BFDBFE", padding: "5px 14px", borderRadius: 999, marginBottom: 24 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                  <span style={{ fontSize: 11, fontWeight: 500, color: "#2563eb", letterSpacing: "0.06em", textTransform: "uppercase" as const, }}>Concepto Clave</span>
                </div>

                {(lastInfoStep as any).title && (
                  <h2 style={{
                    fontSize: "clamp(20px, 4vw, 26px)",
                    fontWeight: 500,
                    marginBottom: 16,
                    lineHeight: 1.2,
                    background: "linear-gradient(135deg, #0f172a 0%, #1e40af 55%, #3b82f6 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    letterSpacing: "-0.02em",
                  }}>
                    {(lastInfoStep as any).title}
                  </h2>
                )}

                {/* Gradient divider under title */}
                {(lastInfoStep as any).title && (
                  <div style={{ height: 2, width: 200, background: "linear-gradient(90deg, #3b82f6, #BFDBFE, transparent)", borderRadius: 999, marginBottom: 20 }} />
                )}

                {/* SmartText for formatted body content */}
                {(lastInfoStep as any).body && (
                  <SmartText
                    text={(lastInfoStep as any).body}
                    fontSize="clamp(15px, 2.2vw, 18px)"
                    align="left"
                  />
                )}
                {/* Bottom vignette — synced with InfoStep */}
                <div style={{
                  position: "sticky",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "40px",
                  background: "linear-gradient(to top, rgba(239,246,255,0.3), transparent)",
                  pointerEvents: "none",
                  marginTop: 16,
                }} />
              </div>
            </div>
          </div>
        )}

        <style>{`
          @keyframes arrowBounceLoop {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(6px); }
          }
          @keyframes recallBounce {
            0%, 100% { transform: translateY(0); }
            40% { transform: translateY(-6px); }
            70% { transform: translateY(-3px); }
          }
          @keyframes recallFadeIn {
            from { opacity: 0; } to { opacity: 1; }
          }
          @keyframes recallSlideUp {
            from { opacity: 0; transform: translateY(24px) scale(0.97); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes shimmerSlide {
            from { transform: translateX(-200%); }
            to   { transform: translateX(300%); }
          }
          
          .recall-widget-container {
            gap: clamp(4px, 1vw, 8px);
          }

          .recall-arrow {
            animation: arrowBounceLoop 1.2s infinite ease-in-out;
          }

          @media (max-width: 1024px) {
            .recall-mascot-wrap {
              display: none !important;
            }
            .recall-widget-container {
              flex-direction: row !important;
              align-items: center !important;
              gap: 8px !important;
              bottom: clamp(75px, 10vh, 82px) !important;
              left: 10px !important;
              width: auto !important;
            }
            .recall-button {
              margin-bottom: 0 !important;
              padding: 10px 18px !important;
              font-size: 14px !important;
            }
            .recall-arrow {
              display: block !important;
              transform: rotate(-90deg) !important;
              animation: arrowBounceSide 1.2s infinite ease-in-out !important;
              margin-right: -4px !important;
              flex-shrink: 0;
            }
          }

          @media (max-width: 640px) {
            .lesson-step-transition {
              padding: clamp(4px, 2vw, 8px) 16px 82px !important;
            }
            .recall-widget-container {
              bottom: 82px !important;
            }
            .recall-button span {
              display: none;
            }
            .recall-button {
              padding: 12px !important;
              border-radius: 50% !important;
            }
          }

          @keyframes arrowBounceSide {
            0%, 100% { transform: rotate(-90deg) translateX(0); }
            50% { transform: rotate(-90deg) translateX(6px); }
          }
        `}</style>

        </div>
      ) : (
        <LessonScreen
          currentStep={state.currentStepIndex + 1}
          totalSteps={state.allSteps.length}
          streak={streak}
          stars={stars}
          showProgressBar={!onProgressChange}
          onExit={() => setIsExitModalOpen(true)}
          onOpenGlossary={() => setIsGlossaryOpen(true)}
          hasGlossary={lessonGlossary.length > 0}
          footerContent={renderFooter(true)}
        >
          {renderStep()}
        </LessonScreen>
      )}

      {/* ── Lesson Glossary Overlay ── */}
      <AnimatePresence>
        {isGlossaryOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1100,
              background: "rgba(15, 23, 42, 0.4)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 16,
            }}
            onClick={() => setIsGlossaryOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 30, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                maxWidth: 500,
                maxHeight: "85vh",
                background: "#FFFFFF",
                borderRadius: 28,
                boxShadow: "0 25px 60px -12px rgba(0,0,0,0.25)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                border: "1px solid rgba(15, 98, 254, 0.1)",
              }}
            >
              {/* Header */}
              <div style={{
                padding: "24px 28px",
                borderBottom: "1px solid #F1F5F9",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "linear-gradient(to bottom, #FFFFFF, #F8FAFC)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ 
                    padding: 10, 
                    background: "rgba(15, 98, 254, 0.08)", 
                    borderRadius: 14, 
                    color: "#0F62FE",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 8px rgba(15, 98, 254, 0.1)",
                  }}>
                    <Book size={22} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 19, fontWeight: 800, color: "#1E293B", letterSpacing: "-0.01em" }}>Glosario de la Lección</h3>
                    <p style={{ margin: "2px 0 0", fontSize: 12, color: "#64748B", fontWeight: 500 }}>{lessonGlossary.length} términos encontrados</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsGlossaryOpen(false)}
                  style={{ 
                    border: "none", 
                    background: "#F1F5F9", 
                    padding: 8, 
                    borderRadius: "50%", 
                    cursor: "pointer", 
                    color: "#64748B",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#E2E8F0")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#F1F5F9")}
                >
                  <X size={20} strokeWidth={2.5} />
                </button>
              </div>

              {/* List */}
              <div style={{ 
                flex: 1, 
                overflowY: "auto", 
                padding: "16px 28px 32px",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}>
                {lessonGlossary.map((term, i) => (
                  <motion.div
                    key={term.word}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    style={{
                      padding: "18px 20px",
                      background: "#F8FAFC",
                      borderRadius: 20,
                      border: "1px solid #F1F5F9",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                       <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#0F62FE" }} />
                       <div style={{ fontWeight: 800, color: "#0F62FE", fontSize: 16, letterSpacing: "-0.01em" }}>
                        {term.word}
                      </div>
                    </div>
                    <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, fontWeight: 500 }}>
                      {term.definition}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div style={{ padding: "24px 28px", background: "#FFFFFF", borderTop: "1px solid #F1F5F9" }}>
                <button
                  onClick={() => setIsGlossaryOpen(false)}
                  style={{
                    width: "100%",
                    padding: "16px",
                    background: "linear-gradient(135deg, #0F62FE 0%, #3B82F6 100%)",
                    color: "white",
                    borderRadius: 16,
                    border: "none",
                    fontWeight: 700,
                    fontSize: 15,
                    cursor: "pointer",
                    boxShadow: "0 10px 20px -5px rgba(15, 98, 254, 0.4)",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                >
                  Continuar Aprendiendo
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <BlitzSplashOverlay isOpen={showBlitzSplash} />
      <BillyInsightSplashOverlay 
        isOpen={showBillyInsightSplash} 
        text={billyInsightText} 
        duration={billyInsightDuration} 
        onClose={() => setShowBillyInsightSplash(false)} 
      />
      <ReviewSplashOverlay 
        isOpen={showReviewSplash} 
        onClose={() => {
          initAudioContext()
          playFlipSound()
          haptic.medium()
          setShowReviewSplash(false)
        }} 
      />
      <MissionStartSplashOverlay 
        isOpen={showMissionStartSplash} 
        onClose={() => {
          initAudioContext()
          playFlipSound()
          haptic.success()
          setShowMissionStartSplash(false)
        }} 
      />
      <StreakMilestoneSplashOverlay 
        isOpen={showStreakSplash} 
        streak={streak} 
        onClose={() => {
          playFlipSound()
          haptic.medium()
          setShowStreakSplash(false)
        }} 
      />
      </GlossaryProvider>
  )
}

// ── Shared Overlay Components (Defined outside to prevent re-mounting glitches) ──

const BlitzSplashOverlay = ({ isOpen }: { isOpen: boolean }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        key="blitz-splash"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.4 } }}
        transition={{ duration: 0.25 }}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 14000,
          background: "linear-gradient(135deg, #0f0c29, #1a0533, #09130f)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          overflow: "hidden",
        }}
      >
        <motion.div
          animate={{ scale: [1, 2.5], opacity: [0.18, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
          style={{ position: "absolute", width: 280, height: 280, borderRadius: "50%", border: "2px solid #fbbf24", pointerEvents: "none" }}
        />
        <motion.div
          animate={{ scale: [1, 2.8], opacity: [0.12, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut", delay: 0.3 }}
          style={{ position: "absolute", width: 280, height: 280, borderRadius: "50%", border: "2px solid #f59e0b", pointerEvents: "none" }}
        />
        <motion.div
          animate={{ scale: [1, 1.18, 1], rotate: [-4, 4, -4] }}
          transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: 90, height: 90, borderRadius: 28,
            background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 60px #fbbf2480, 0 0 120px #f59e0b40",
          }}
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="#1a0533"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
        </motion.div>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15, duration: 0.4 }} style={{ textAlign: "center", padding: "0 32px" }}>
          <div style={{ fontSize: "clamp(28px, 6vw, 40px)", fontWeight: 900, color: "#fbbf24", letterSpacing: "0.04em", textTransform: "uppercase", lineHeight: 1.1 }}>Pregunta Relámpago</div>
          <div style={{ fontSize: "clamp(14px, 3vw, 18px)", fontWeight: 600, color: "rgba(255,255,255,0.85)", marginTop: 12, lineHeight: 1.4 }}>¡Contesta lo más rápido que puedas!</div>
        </motion.div>
        <motion.div initial={{ width: "60%" }} animate={{ width: 0 }} transition={{ duration: 2.5, ease: "linear" }} style={{ height: 4, width: 200, background: "#fbbf24", borderRadius: 999 }} />
      </motion.div>
    )}
  </AnimatePresence>
)

const BillyInsightSplashOverlay = ({ isOpen, text, duration, onClose }: { isOpen: boolean, text: string, duration: number, onClose: () => void }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        key="billy-insight-splash"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.5 } }}
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 14000,
          background: "linear-gradient(135deg, #0a1628 0%, #0f2044 40%, #1a3a6e 80%, #0a1628 100%)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px", cursor: "pointer",
        }}
      >
        <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ width: 100, height: 100, borderRadius: "50%", background: "linear-gradient(135deg, #1e3a8a, #2563eb)", display: "flex", alignItems: "center", justifyContent: "center", border: "3px solid rgba(147,197,253,0.4)" }}>
          <img src="/billy_chatbot.png" alt="Billy" style={{ width: 80, height: 80, objectFit: "contain" }} />
        </motion.div>
        <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ marginTop: 24, fontSize: "clamp(18px, 4vw, 26px)", fontWeight: 700, color: "#ffffff", textAlign: "center", maxWidth: 480 }}>{text}</motion.div>
        <motion.div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "rgba(255,255,255,0.06)" }}>
          <motion.div initial={{ width: "100%" }} animate={{ width: 0 }} transition={{ duration: duration / 1000, ease: "linear" }} style={{ height: "100%", background: "linear-gradient(90deg, #3b82f6, #60a5fa)" }} />
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
)

const ReviewSplashOverlay = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div key="review-splash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "fixed", inset: 0, zIndex: 14000, background: "rgba(10, 20, 40, 0.96)", backdropFilter: "blur(16px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: "center", maxWidth: 420 }}>
          <img src="/billy_chatbot.png" alt="Billy" style={{ width: 140, height: 140, marginBottom: 32 }} />
          <h2 style={{ fontSize: 32, fontWeight: 800, color: "#fff", marginBottom: 12 }}>Zona de Repaso</h2>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.75)", marginBottom: 40 }}>¡Momento de maestría! Vamos a perfeccionar esos conceptos antes de terminar.</p>
          <button onClick={onClose} style={{ width: "100%", padding: "20px", background: "linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)", color: "white", borderRadius: 20, border: "none", fontWeight: 800, fontSize: 18, cursor: "pointer" }}>¡ESTOY LISTO!</button>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
)

const MissionStartSplashOverlay = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div key="mission-start-splash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.1 }} style={{ position: "fixed", inset: 0, zIndex: 14000, background: "linear-gradient(135deg, #0F62FE 0%, #1E40AF 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: "center", maxWidth: 460 }}>
          <img src="/thumbs up.png" alt="Billy Start" style={{ width: 180, height: 180, marginBottom: 24 }} />
          <h1 style={{ fontSize: "clamp(32px, 6vw, 44px)", fontWeight: 900, color: "#fff", marginBottom: 16 }}>¡INICIO DE MISIÓN!</h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.85)", marginBottom: 40 }}>Billy te guiará en este camino.<br/>¿Estamos listos para aprender?</p>
          <button onClick={onClose} style={{ padding: "20px 48px", background: "#fff", color: "#0F62FE", borderRadius: 20, border: "none", fontWeight: 800, fontSize: 18, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 12 }}>
            ¡VAMOS POR ELLO! <ChevronRight size={24} strokeWidth={3} />
          </button>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
)

const StreakMilestoneSplashOverlay = ({ isOpen, streak, onClose }: { isOpen: boolean, streak: number, onClose: () => void }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div key="streak-splash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "fixed", inset: 0, zIndex: 14000, background: "rgba(10, 20, 40, 0.96)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: "center", maxWidth: 400 }}>
          <Zap size={90} fill="#FFD700" color="#FFD700" style={{ marginBottom: 32 }} />
          <div style={{ fontSize: 52, fontWeight: 900, color: "#fbbf24", marginBottom: 12 }}>{streak} en racha</div>
          <button onClick={onClose} style={{ width: "100%", padding: "18px", background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)", color: "#451a03", borderRadius: 16, border: "none", fontWeight: 800, cursor: "pointer" }}>¡CONTINUAR!</button>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
)
