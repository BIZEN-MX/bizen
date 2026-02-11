"use client"

import React, { useReducer, useEffect, useCallback, useRef } from "react"
import { LessonStep } from "@/types/lessonTypes"
import { lessonReducer, LessonState } from "./lessonReducer"
import { LessonScreen, StickyFooterButton } from "./index"
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
    hasBuiltReviewSteps: false,
    isContinueEnabled: false,
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
    (stepId: string, result: { isCompleted: boolean; isCorrect?: boolean; answerData?: any }) => {
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
        } else {
          dispatch({ type: "DISABLE_CONTINUE" })
        }
      } else if (result.isCompleted) {
        dispatch({ type: "ENABLE_CONTINUE" })
      } else {
        dispatch({ type: "DISABLE_CONTINUE" })
      }
    },
    [state.allSteps]
  )

  // Compute streak and stars from state (must be before handleContinue so stars is in scope)
  const originalQuizStepIds = state.originalSteps
    .filter((s) => s.stepType === "mcq" && (s as { isAssessment?: boolean }).isAssessment)
    .map((s) => s.id)
  let streak = 0
  for (const stepId of originalQuizStepIds) {
    const result = state.answersByStepId[stepId]
    if (result?.isCorrect) streak++
    else break
  }
  // Stars 0–3 by mistake count: based on TOTAL initial mistakes (tracked in state.totalMistakes)
  // 0 mistakes = 3 stars
  // 1 mistake = 2 stars
  // 2 mistakes = 1 star
  // 3+ mistakes = 0 stars
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

  const handleContinue = useCallback(() => {
    const isLastStep = state.currentStepIndex >= state.allSteps.length - 1
    const currentStepForContinue = state.allSteps[state.currentStepIndex]
    const isOnSummaryStep = currentStepForContinue?.stepType === "summary"
    const isOnReviewStep = !!currentStepForContinue?.reviewSourceStepId

    if (isLastStep && isOnSummaryStep) {
      onCompleteRef.current?.(stars)
      return
    }
    if (isLastStep && isOnReviewStep && state.incorrectSteps.length === 0) {
      dispatch({ type: "GO_TO_SUMMARY_AFTER_REVIEW" })
      return
    }
    if (!state.isContinueEnabled) return

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
      dispatch({ type: "NEXT_STEP" })
    }
  }, [state.isContinueEnabled, state.currentStepIndex, state.allSteps, state.originalSteps, state.hasBuiltReviewSteps, state.incorrectSteps.length, stars])

  const currentStep = state.allSteps[state.currentStepIndex]
  const pendingReviewOrSummary = state.currentStepIndex >= state.originalSteps.length && !state.hasBuiltReviewSteps
  if (!currentStep && !pendingReviewOrSummary) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-3xl md:text-4xl font-bold text-slate-900">¡Lección completada!</p>
          {onComplete && (
            <button
              type="button"
              onClick={() => onCompleteRef.current?.(stars)}
              className="mt-4 px-6 py-3 text-xl md:text-2xl bg-slate-800 text-white rounded-xl hover:bg-slate-900"
            >
              Finalizar
            </button>
          )}
        </div>
      </div>
    )
  }
  if (!currentStep) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-xl md:text-2xl text-slate-600">Cargando...</p>
      </div>
    )
  }

  const isReviewStep = !!currentStep.reviewSourceStepId
  const previousAnswer = currentStep.reviewSourceStepId
    ? state.answersByStepId[currentStep.reviewSourceStepId]
    : state.answersByStepId[currentStep.id]

  const isLastStepInEngine = state.currentStepIndex >= state.allSteps.length - 1
  const isSummaryStepType = currentStep.stepType === "summary"
  const shouldPassFullScreenProps = currentStep.fullScreen || isSummaryStepType
  // Match and order steps always get nav props so they can show the same Salir/Continuar buttons as other slides
  const shouldPassNavProps = shouldPassFullScreenProps || currentStep.stepType === "match" || currentStep.stepType === "order"

  const renderStep = () => {
    const stepProps = {
      step: currentStep,
      onAnswered: (result: { isCompleted: boolean; isCorrect?: boolean; answerData?: any }) => {
        handleAnswered(currentStep.id, result)
      },
      // For fullScreen steps, summary, and match steps: pass navigation so Salir/Continuar buttons show
      // Order steps: Continuar disabled until user clicks Comprobar first (then enabled only if correct)
      ...(shouldPassNavProps
        ? {
          onExit: onExit,
          onContinue: handleContinue,
          isContinueEnabled: state.isContinueEnabled,
          isLastStep: isLastStepInEngine,
          currentStepIndex: state.currentStepIndex,
          totalSteps: state.allSteps.length,
          streak,
          stars,
        }
        : {}),
    }

    // Add previous answer data for review steps
    const reviewProps = isReviewStep && previousAnswer ? { ...stepProps } : stepProps

    switch (currentStep.stepType) {
      case "info":
        return <InfoStep {...stepProps} />

      case "mcq":
        return (
          <MCQStep
            key={currentStep.id}
            {...stepProps}
            selectedOptionId={undefined}
          />
        )

      case "multi_select":
        return (
          <MultiSelectStep
            {...reviewProps}
            selectedOptionIds={
              isReviewStep && previousAnswer?.answerData?.selectedOptionIds
                ? previousAnswer.answerData.selectedOptionIds
                : undefined
            }
          />
        )

      case "true_false":
        return (
          <TrueFalseStep
            {...reviewProps}
            isReviewStep={isReviewStep}
            selectedValue={
              isReviewStep && previousAnswer?.answerData?.selectedValue !== undefined
                ? previousAnswer.answerData.selectedValue
                : undefined
            }
          />
        )

      case "order":
        return (
          <OrderStep
            {...reviewProps}
            isReviewStep={isReviewStep}
            orderedItemIds={
              isReviewStep && previousAnswer?.answerData?.orderedItemIds
                ? previousAnswer.answerData.orderedItemIds
                : undefined
            }
          />
        )

      case "match":
        return (
          <MatchStep
            {...reviewProps}
            matches={
              isReviewStep && previousAnswer?.answerData?.matches
                ? previousAnswer.answerData.matches
                : undefined
            }
          />
        )

      case "fill_blanks":
        return (
          <FillBlanksStep
            {...reviewProps}
            blankAnswers={
              isReviewStep && previousAnswer?.answerData?.blankAnswers
                ? previousAnswer.answerData.blankAnswers
                : undefined
            }
          />
        )

      case "image_choice":
        return (
          <ImageChoiceStep
            {...reviewProps}
            selectedImageId={
              isReviewStep && previousAnswer?.answerData?.selectedImageId
                ? previousAnswer.answerData.selectedImageId
                : undefined
            }
          />
        )

      case "summary":
        return <SummaryStep {...stepProps} />

      case "review":
        // Review type is virtual - review steps reuse the original step's type
        // This case should rarely be hit, but if it is, render a message
        return (
          <div className="text-center p-8">
            <p className="text-lg text-slate-300">
              Review step - this should be handled by the step type above
            </p>
          </div>
        )

      default:
        return <div>Unknown step type: {(currentStep as any).stepType}</div>
    }
  }

  const isLastStep = state.currentStepIndex >= state.allSteps.length - 1
  const isSummaryStep = currentStep.stepType === "summary"

  // Full-screen mode: render step inside a single centered container (same width/padding on all slides)
  if (shouldPassFullScreenProps) {
    return (
      <div
        className="flex flex-col bg-white text-slate-900 relative w-full flex-1 min-h-0"
        style={{
          paddingTop: "env(safe-area-inset-top)",
          minHeight: 0,
          height: "100%",
          overflow: "hidden",
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
            justifyContent: "center",
            alignItems: "center",
            paddingTop: CONTENT_PADDING_Y,
            paddingBottom: CONTENT_PADDING_Y,
            boxSizing: "border-box",
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
              height: "100%",
              minHeight: 0,
              display: isSummaryStepType ? "flex" : "flex",
              flexDirection: "column",
              boxSizing: "border-box",
            }}
          >
            {renderStep()}
          </div>
        </div>
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
      footerContent={
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
          }}
        >
          {onExit ? (
            <StickyFooterButton
              variant="outline"
              onClick={onExit}
              style={{
                minHeight: 56,
                minWidth: 140,
                padding: "14px 24px",
                fontSize: "1.125rem",
              }}
              className="rounded-xl"
            >
              Salir
            </StickyFooterButton>
          ) : (
            <span style={{ minWidth: 0 }} aria-hidden />
          )}
          <StickyFooterButton
            variant={isLastStep || isSummaryStep ? "success" : "blue"}
            onClick={handleContinue}
            disabled={!state.isContinueEnabled}
            style={{
              minHeight: 56,
              minWidth: 160,
              padding: "14px 24px",
              fontSize: "1.125rem",
            }}
            className="rounded-xl"
          >
            {isSummaryStep || isLastStep ? "Siguiente lección" : ((currentStep as { continueLabel?: string }).continueLabel ?? "Continuar")}
          </StickyFooterButton>
        </div>
      }
    >
      {isReviewStep && (
        <div className="mb-4 p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
          <p className="text-xl md:text-2xl font-semibold text-indigo-900">
            Otra oportunidad
          </p>
        </div>
      )}
      {renderStep()}
    </LessonScreen>
  )
}

