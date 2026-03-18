"use client"

import React, { useReducer, useEffect, useCallback, useRef, useState } from "react"
import { LessonStep } from "@/types/lessonTypes"
import { lessonReducer, LessonState } from "./lessonReducer"
import { LessonScreen } from "./LessonScreen"
import { StickyFooterButton, StickyFooter } from "./StickyFooter"
import { LessonExitModal } from "./LessonExitModal"
import { LessonProgressHeader } from "./LessonProgressHeader"
import { CONTENT_MAX_WIDTH, CONTENT_PADDING_X, CONTENT_PADDING_Y } from "./layoutConstants"
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
import { playFlipSound } from "./lessonSounds"
import { SmartText } from "./SmartText"
import { motion, AnimatePresence } from "framer-motion"

interface LessonEngineProps {
  lessonSteps: LessonStep[]
  /** Called when lesson is completed; receives stars earned (0–3, based on mistakes). */
  onComplete?: (stars?: number) => void
  onExit?: () => void
  /** Called when progress changes (progress bar = currentStep/totalSteps; stars = by mistakes). */
  onProgressChange?: (progress: { currentStep: number; totalSteps: number; streak: number; stars: 0 | 1 | 2 | 3 }) => void
  isRepeat?: boolean
}

/**
 * Extracts readable text from a LessonStep for Text-to-Speech playback.
 */
function getTTSContent(step: any): string {
  if (!step) return ""
  const parts: string[] = []

  // ONLY return content if there is an AI Insight or Clue.
  // This makes the voice exclusive to Billy's messages.
  if (step.aiInsight) {
    parts.push(step.aiInsight)
  } else if (step.clue) {
    parts.push(`¡Pista! ${step.clue}`)
  } else if (step.stepType === "billy_talks" && step.body) {
    parts.push(step.body)
  }

  // clean out markdown symbols
  const text = parts.join(". ")
  return text.replace(/[*_#`]/g, "")
}

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

  // ── Billy Empático (Feature 2) ───────────────────────────────────────────
  const [showBillyEmpathy, setShowBillyEmpathy] = useState(false)
  const billyEmpathyShownAt = useRef<number>(-1) // mistake count when last shown

  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  const [startTime] = useState(() => Date.now())

  // Initialize on mount
  useEffect(() => {
    dispatch({ type: "INIT", steps: lessonSteps })
  }, [lessonSteps])


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
  const isAssessment = ["mcq", "true_false", "multi_select", "order", "match", "fill_blanks", "image_choice", "blitz_challenge"].includes(currentStep?.stepType || "")

  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const [isAudioLoading, setIsAudioLoading] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
    setIsAudioPlaying(false)
    setIsAudioLoading(false)
  }, [])

  const playFallbackSpeech = useCallback((text: string) => {
    console.warn("[TTS] Using browser fallback speech (Google TTS API failed)")
    if (typeof window === "undefined" || !window.speechSynthesis) return

    const utterance = new SpeechSynthesisUtterance(text)
    const voices = window.speechSynthesis.getVoices()
    const mxVoice = voices.find(v => v.lang === "es-MX" || v.lang === "es-US")
    const esVoice = voices.find(v => v.lang.startsWith("es"))
    
    if (mxVoice) utterance.voice = mxVoice
    else if (esVoice) utterance.voice = esVoice
    else utterance.lang = "es-MX"

    utterance.rate = 1.1   // Sped up per user request
    utterance.pitch = 1.0  // Natural pitch

    utterance.onstart = () => {
      setIsAudioPlaying(true)
      setIsAudioLoading(false)
    }
    utterance.onend = () => setIsAudioPlaying(false)
    utterance.onerror = () => {
      setIsAudioPlaying(false)
      setIsAudioLoading(false)
    }

    window.speechSynthesis.speak(utterance)
  }, [])

  const playAudio = useCallback(async () => {
    if (!currentStep) return
    if (typeof window === "undefined") return

    stopAudio()

    const content = getTTSContent(currentStep)
    if (!content) return

    try {
      setIsAudioLoading(true)
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: content }),
      })

      if (!response.ok) {
        const errBody = await response.text().catch(() => "unknown")
        console.error(`[TTS] Google API returned ${response.status}:`, errBody)
        throw new Error(`TTS API error: ${response.status}`)
      }

      console.log("[TTS] Using Google Cloud TTS (es-US-Studio-B)")
      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)

      const audio = new Audio(audioUrl)
      audioRef.current = audio

      audio.onplay = () => {
        setIsAudioPlaying(true)
        setIsAudioLoading(false)
      }

      audio.onended = () => {
        setIsAudioPlaying(false)
        URL.revokeObjectURL(audioUrl)
      }

      audio.onerror = () => {
        console.error("Audio playback error")
        setIsAudioPlaying(false)
        setIsAudioLoading(false)
        URL.revokeObjectURL(audioUrl)
      }

      audio.play()
    } catch (error) {
      console.warn("TTS API failed, falling back to browser speech:", error)
      playFallbackSpeech(content)
    }
  }, [currentStep, stopAudio, playFallbackSpeech])

  const toggleAudio = useCallback(() => {
    if (isAudioPlaying) {
      stopAudio()
    } else {
      playAudio()
    }
  }, [isAudioPlaying, playAudio, stopAudio])

  // Stop audio on unmount or step change
  useEffect(() => {
    return () => stopAudio()
  }, [currentStep?.id, stopAudio])

  // Find the last theoretical step seen before the current step
  const lastInfoStep = React.useMemo(() => {
    for (let i = state.currentStepIndex - 1; i >= 0; i--) {
      const step = state.allSteps[i]
      if (step?.stepType === "info" || step?.stepType === "billy_talks") return step
    }
    return null
  }, [state.currentStepIndex, state.allSteps])

  const showRecallButton = isAssessment && lastInfoStep != null && !state.isContinueEnabled

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
  for (const stepId of originalQuizStepIds) {
    const result = state.answersByStepId[stepId]
    if (result?.isCorrect) streak++
    else break
  }
  const mistakeCount = state.totalMistakes
  const stars: 0 | 1 | 2 | 3 =
    mistakeCount <= 2 ? 3 : mistakeCount <= 5 ? 2 : 1

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
      onCompleteRef.current?.(stars)
    }
  }, [isSummaryStep, stars])

  const handleContinue = useCallback(() => {
    if (!currentStep) return

    // Final completion - exit immediately since completion was triggered on mount
    if (isLastStep && isSummaryStep) {
      onExit?.()
      return
    }

    const currentAnswer = state.answersByStepId[currentStep.id]
    const isCorrect = currentAnswer?.isCorrect === true

    // If step is not completed, trigger the action (Reveal or Check)
    // removed !isLastStep check to prevent getting stuck on the final assessment
    if (!state.isContinueEnabled && !isSummaryStep) {
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
    onPlayAudio: playAudio,
    actionTrigger: state.actionTrigger,
    isContinueEnabled: state.isContinueEnabled,
  }

  const renderStep = () => {
    switch (currentStep.stepType) {
      case "info":
        return <InfoStep {...stepProps} />
      case "mcq":
        return <MCQStep {...stepProps} />
      case "multi_select":
        return <MultiSelectStep {...stepProps} />
      case "true_false":
        return <TrueFalseStep {...stepProps} />
      case "order":
        return <OrderStep {...stepProps} />
      case "match":
        return <MatchStep {...stepProps} />
      case "fill_blanks":
        return <FillBlanksStep {...stepProps} />
      case "image_choice":
        return <ImageChoiceStep {...stepProps} />
      case "summary": {
        const assessmentSteps = state.originalSteps.filter(s => s.isAssessment)
        const accuracy = assessmentSteps.length > 0 
          ? Math.max(0, Math.round(((assessmentSteps.length - state.totalMistakes) / assessmentSteps.length) * 100))
          : 100
        const totalTime = Math.floor((Date.now() - startTime) / 1000)

        return (
          <SummaryStep 
            {...stepProps} 
            step={{ 
              ...stepProps.step, 
              starsEarned: stars, 
              isRepeat,
              accuracy,
              totalTime
            }} 
          />
        )
      }
      case "mini_sim":
        return <MiniSimStep {...stepProps} />
      case "billy_talks":
        return <BillyTalksStep {...stepProps} />
      case "blitz_challenge":
        return <BlitzChallengeStep {...stepProps} />
      case "impulse_meter":
        return <ImpulseMeterStep {...stepProps} />
      case "mindset_translator":
        return <MindsetTranslatorStep {...stepProps} />
      case "influence_detective":
        return <InfluenceDetectiveStep {...stepProps} />
      case "swipe_sorter":
        return <SwipeSorterStep {...(stepProps as any)} />
      case "narrative_check":
        return <NarrativeCheckStep {...(stepProps as any)} />
      default:
        return <div>Unknown step type: {currentStep.stepType}</div>
    }
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
      return state.isContinueEnabled ? "Finalizar" : "Continuar"
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

  if (shouldPassFullScreenProps) {
    return (
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
                onExit={handleAttemptExit}
                onToggleAudio={getTTSContent(currentStep) ? toggleAudio : undefined}
                isAudioPlaying={isAudioPlaying}
                isAudioLoading={isAudioLoading}
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
                  BILLY DICE
                </p>
                <p style={{ margin: "2px 0 0", fontSize: 14, fontWeight: 600, color: "white", lineHeight: 1.4 }}>
                  {(currentStep as any)?.aiInsight ||
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

                {/* Pill header — SVG icon instead of emoji */}
                <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#eff6ff", border: "1.5px solid #BFDBFE", padding: "5px 14px", borderRadius: 999, marginBottom: 24 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                  <span style={{ fontSize: 11, fontWeight: 500, color: "#2563eb", letterSpacing: "0.06em", textTransform: "uppercase" as const, }}>Nota de clase</span>
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
              padding: clamp(4px, 2vw, 8px) 16px 100px !important;
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

        {renderFooter(true)}
      </div>
    )
  }

  return (
    <LessonScreen
      currentStep={state.currentStepIndex + 1}
      totalSteps={state.allSteps.length}
      streak={streak}
      stars={stars}
      showProgressBar={!onProgressChange}
      footerContent={renderFooter(false)}
    >
      {renderStep()}
    </LessonScreen>
  )
}
