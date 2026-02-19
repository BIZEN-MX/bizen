"use client"

import React, { useReducer, useEffect, useCallback, useRef, useState } from "react"
import { LessonStep } from "@/types/lessonTypes"
import { lessonReducer, LessonState } from "./lessonReducer"
import { LessonScreen, StickyFooterButton, StickyFooter } from "./index"
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
}

/**
 * Main lesson engine component that manages state and renders appropriate step components
 */
export function LessonEngine({ lessonSteps, onComplete, onExit, onProgressChange }: LessonEngineProps) {
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
        // Only enable Continue when correct (or not a review step). Review: user must get it right before advancing.
        if (result.isCorrect || !isReviewStep) {
          dispatch({ type: "ENABLE_CONTINUE" })
          if (result.isCorrect) haptic.success()
        } else {
          dispatch({ type: "DISABLE_CONTINUE" })
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
    mistakeCount === 0 ? 3 : mistakeCount === 1 ? 2 : mistakeCount === 2 ? 1 : 0

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

  const handleContinue = useCallback(() => {
    if (!currentStep) return

    if (isLastStep && isSummaryStep) {
      onCompleteRef.current?.(stars)
      return
    }

    // If step is not completed, trigger the action (Reveal or Check)
    if (!state.isContinueEnabled && !isSummaryStep && !isLastStep) {
      if (state.isActionEnabled) {
        haptic.light()
        dispatch({ type: "TRIGGER_ACTION" })
      }
      return
    }

    const isOnReviewStep = !!currentStep?.reviewSourceStepId
    if (isLastStep && isOnReviewStep && state.incorrectSteps.length === 0) {
      dispatch({ type: "GO_TO_SUMMARY_AFTER_REVIEW" })
      return
    }

    const nextIndex = state.currentStepIndex + 1
    const nextStep = state.originalSteps[nextIndex]
    const nextStepIsSummary = nextStep?.stepType === "summary"

    if (nextStepIsSummary && !state.hasBuiltReviewSteps) {
      if (state.incorrectSteps.length > 0) {
        dispatch({ type: "BUILD_REVIEW_STEPS" })
      } else {
        dispatch({ type: "GO_TO_SUMMARY" })
      }
    } else {
      haptic.light()
      dispatch({ type: "NEXT_STEP" })
    }
  }, [state.isContinueEnabled, state.currentStepIndex, state.allSteps, state.originalSteps, state.hasBuiltReviewSteps, state.incorrectSteps.length, stars, currentStep, state.isActionEnabled, isLastStep, isSummaryStep])

  const handleBack = useCallback(() => {
    if (state.currentStepIndex > 0) {
      haptic.light()
      dispatch({ type: "PREV_STEP" })
    }
  }, [state.currentStepIndex])

  if (!currentStep) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-3xl md:text-4xl font-bold text-slate-900">¡Lección completada!</p>
        </div>
      </div>
    )
  }

  // Stabilize the onAnswered callback to prevent infinite render loops in steps
  const onStepAnswered = useCallback((res: any) => {
    if (currentStep) {
      handleAnswered(currentStep.id, res)
    }
  }, [currentStep?.id, handleAnswered])

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
        return <SummaryStep {...stepProps} />
      default:
        return <div>Unknown step type: {currentStep.stepType}</div>
    }
  }

  const shouldPassFullScreenProps = currentStep.fullScreen || isSummaryStep

  const footerButtonLabel = (() => {
    if (isSummaryStep || isLastStep) return "Finalizar lección"
    if (!state.isContinueEnabled) {
      if (currentStep.stepType === "info") return "QUIERO VER"
      if (isAssessment) return "Comprobar"
    }
    return (currentStep as any).continueLabel || "Continuar"
  })()

  const footerButtonDisabled = !state.isContinueEnabled && !state.isActionEnabled && !isSummaryStep && !isLastStep

  const renderFooter = () => (
    <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
      {/* Back button - only shown if not on first step, not on summary, and not during review building */}
      {!isSummaryStep && state.currentStepIndex > 0 ? (
        <StickyFooterButton
          variant="secondary"
          onClick={handleBack}
          style={{ minWidth: 100, fontSize: "1rem", fontWeight: 700, padding: "16px 24px" }}
        >
          Anterior
        </StickyFooterButton>
      ) : (
        onExit && (
          <StickyFooterButton
            variant="outline"
            onClick={onExit}
            style={{ minWidth: 100, fontSize: "1rem", fontWeight: 700, padding: "16px 24px" }}
          >
            Salir
          </StickyFooterButton>
        )
      )}

      {/* Main Action Button */}
      <StickyFooterButton
        variant={isLastStep || isSummaryStep ? "success" : "blue"}
        onClick={handleContinue}
        disabled={footerButtonDisabled}
        style={{ minWidth: 180, fontSize: "1.1rem", fontWeight: 700, padding: "16px 32px", flex: 1 }}
      >
        {footerButtonLabel}
      </StickyFooterButton>
    </div>
  )

  if (shouldPassFullScreenProps) {
    return (
      <div
        className="flex flex-col bg-white text-slate-900 relative w-full flex-1 min-h-0"
        style={{
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "max(0px, env(safe-area-inset-bottom))",
          minHeight: 0,
          height: "100%",
          overflow: "hidden",
          background: "#f1f5f9"
        }}
      >
        <div
          key={state.currentStepIndex}
          className="lesson-step-transition"
          style={{
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "stretch",
            paddingTop: CONTENT_PADDING_Y,
            paddingBottom: 110, // ROOM FOR FIXED FOOTER
            boxSizing: "border-box",
            overflowY: "auto"
          }}
        >
          <div
            className="lesson-slide-content-center"
            style={{
              width: "100%",
              maxWidth: CONTENT_MAX_WIDTH,
              marginLeft: "auto",
              marginRight: "auto",
              paddingLeft: CONTENT_PADDING_X,
              paddingRight: CONTENT_PADDING_X,
              flex: 1,
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
              boxSizing: "border-box",
            }}
          >
            {renderStep()}
          </div>
        </div>

        <StickyFooter>
          {renderFooter()}
        </StickyFooter>
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
      footerContent={renderFooter()}
    >
      {renderStep()}
    </LessonScreen>
  )
}
