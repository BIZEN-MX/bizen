"use client"

import React, { useReducer, useEffect, useCallback, useRef, useState } from "react"
import { LessonStep } from "@/types/lessonTypes"
import { lessonReducer, LessonState } from "./lessonReducer"
import { LessonScreen, StickyFooterButton, StickyFooter, LessonExitModal } from "./index"
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
} from "./steps"
import { haptic } from "@/utils/hapticFeedback"

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

  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

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

  const isLastStep = state.currentStepIndex >= state.allSteps.length - 1
  const isSummaryStep = currentStep?.stepType === "summary"
  const isAssessment = ["mcq", "true_false", "multi_select", "order", "match", "fill_blanks", "image_choice"].includes(currentStep?.stepType || "")

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
    if (currentStep) {
      handleAnswered(currentStep.id, res)
    }
  }, [currentStep?.id, handleAnswered])

  if (!currentStep) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBFAF5]">
        <div className="text-center">
          <p className="text-3xl md:text-4xl font-bold text-slate-900">¡Lección completada!</p>
        </div>
      </div>
    )
  }

  const stepProps = {
    step: currentStep as any,
    onAnswered: onStepAnswered,
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
      case "summary":
        return <SummaryStep {...stepProps} step={{ ...stepProps.step, starsEarned: stars, isRepeat }} />
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
    if (isSummaryStep || (isLastStep && isCorrect)) return "Avanzar"
    if (!state.isContinueEnabled) {
      if (currentStep.stepType === "info") return "Continuar"
      if (isAssessment) return "Comprobar"
    }
    return (currentStep as any).continueLabel || "Continuar"
  })()

  const footerButtonDisabled = !state.isContinueEnabled && !state.isActionEnabled && !isSummaryStep && !isLastStep

  const renderFooter = (isFixed: boolean = true) => {
    const isTrueFalse = currentStep.stepType === "true_false"

    // Specifically hide explanation (feedbackBody) for true_false per request
    const feedbackBody = (!isTrueFalse && hasFeedback)
      ? (currentStep as any).options?.find((o: any) => o.id === currentAnswer?.answerData?.selectedOptionId)?.explanation
      : undefined

    return (
      <StickyFooter
        fixed={isFixed}
        feedbackColor={hasFeedback ? (isCorrect ? "correct" : "incorrect") : null}
        feedbackTitle={hasFeedback ? (isCorrect ? "¡Muy bien hecho!" : "¡Sigue intentando!") : undefined}
        feedbackBody={feedbackBody}
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
              fontWeight: 800,
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
          background: "#FFFFFF",
          paddingTop: "env(safe-area-inset-top)",
          fontFamily: "'Montserrat', sans-serif",
        }}
      >
        {/* Header - Lowered and Thickened */}
        <div style={{ flexShrink: 0, padding: "32px clamp(16px, 4vw, 48px) 20px", display: "flex", justifyContent: "center" }}>
          <div style={{ width: "100%", maxWidth: 980 }}>
            <LessonProgressHeader
              currentStepIndex={state.currentStepIndex}
              totalSteps={state.allSteps.length}
              streak={streak}
              stars={stars}
              onExit={handleAttemptExit}
            />
          </div>
        </div>

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
              ? "12px clamp(16px, 4vw, 48px) 120px"
              : "24px clamp(16px, 4vw, 48px) 120px",
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
