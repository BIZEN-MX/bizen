"use client"

import React, { useReducer, useEffect, useCallback, useRef } from "react"
import { LessonStep } from "@/types/lessonTypes"
import { lessonReducer, LessonState } from "./lessonReducer"
import { LessonScreen, StickyFooterButton } from "./index"
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
  /** Called when lesson is completed; receives stars earned (1–3). */
  onComplete?: (stars?: number) => void
  onExit?: () => void
}

/**
 * Main lesson engine component that manages state and renders appropriate step components
 */
export function LessonEngine({ lessonSteps, onComplete, onExit }: LessonEngineProps) {
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
  const totalQuiz = originalQuizStepIds.length
  const correctCount = originalQuizStepIds.filter(
    (id) => state.answersByStepId[id]?.isCorrect
  ).length
  const answeredCount = originalQuizStepIds.filter(
    (id) => state.answersByStepId[id] !== undefined
  ).length
  // Start with 3 stars; then by % correct: >66% = 3, 34–66% = 2, <34% = 1
  const percentage = totalQuiz > 0 ? (correctCount / totalQuiz) * 100 : 100
  const stars: 1 | 2 | 3 =
    answeredCount === 0
      ? 3
      : percentage > 66
        ? 3
        : percentage >= 34
          ? 2
          : 1

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

  const renderStep = () => {
    const stepProps = {
      step: currentStep,
      onAnswered: (result: { isCompleted: boolean; isCorrect?: boolean; answerData?: any }) => {
        handleAnswered(currentStep.id, result)
      },
      // For fullScreen steps (and always for summary), pass navigation + progress so "Completar misión" is shown
      ...(shouldPassFullScreenProps
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

  // Full-screen mode: render step directly (summary always gets this so its "Completar misión" button is visible)
  if (shouldPassFullScreenProps) {
    return (
      <div
        className="flex flex-col bg-white text-slate-900 relative w-full flex-1 min-h-0"
        style={{
          paddingTop: "env(safe-area-inset-top)",
          minHeight: "100dvh",
          height: "100dvh",
          overflow: "hidden",
        }}
      >
        <div className="flex-1 overflow-y-auto">
          {renderStep()}
        </div>
      </div>
    )
  }

  return (
    <LessonScreen
      currentStep={state.currentStepIndex + 1}
      totalSteps={state.allSteps.length}
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
            {(currentStep as { continueLabel?: string }).continueLabel ?? (isSummaryStep ? "Siguiente lección" : isLastStep ? "Completar misión" : "Continuar")}
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

