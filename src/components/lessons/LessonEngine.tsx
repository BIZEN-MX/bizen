"use client"

import React, { useReducer, useEffect, useCallback } from "react"
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
  onComplete?: () => void
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

  // Initialize on mount
  useEffect(() => {
    dispatch({ type: "INIT", steps: lessonSteps })
  }, [lessonSteps])

  // Check if we need to build review steps or go to summary
  // This happens when we've completed the last original step
  useEffect(() => {
    const isLastOriginalStep = state.currentStepIndex >= state.originalSteps.length
    const hasCompletedLastOriginal = state.currentStepIndex === state.originalSteps.length

    if (hasCompletedLastOriginal && !state.hasBuiltReviewSteps) {
      if (state.incorrectSteps.length > 0) {
        dispatch({ type: "BUILD_REVIEW_STEPS" })
      } else {
        // No incorrect steps, go directly to summary
        dispatch({ type: "GO_TO_SUMMARY" })
      }
    }
  }, [state.currentStepIndex, state.originalSteps.length, state.hasBuiltReviewSteps, state.incorrectSteps.length])

  const handleAnswered = useCallback(
    (stepId: string, result: { isCompleted: boolean; isCorrect?: boolean; answerData?: any }) => {
      if (result.isCompleted) {
        dispatch({ type: "ENABLE_CONTINUE" })
        if (result.isCorrect !== undefined) {
          // For review steps, don't track incorrect again (they've already been reviewed)
          const currentStep = state.allSteps.find(s => s.id === stepId)
          const isReviewStep = !!currentStep?.reviewSourceStepId
          
          // Only track if not a review step, or if it's correct (to remove from incorrect list)
          if (!isReviewStep || result.isCorrect) {
            dispatch({ 
              type: "ANSWER_STEP", 
              stepId, 
              isCorrect: result.isCorrect, 
              answerData: result.answerData 
            })
          } else {
            // Review step answered incorrectly - just enable continue but don't track
            // (we don't want infinite review loops)
          }
        }
      } else {
        dispatch({ type: "DISABLE_CONTINUE" })
      }
    },
    [state.allSteps]
  )

  const handleContinue = useCallback(() => {
    if (!state.isContinueEnabled) return

    const nextIndex = state.currentStepIndex + 1
    const nextStep = state.originalSteps[nextIndex]
    const nextStepIsSummary = nextStep?.stepType === "summary"
    const isLastStep = state.currentStepIndex >= state.allSteps.length - 1

    if (isLastStep) {
      // Lesson complete (e.g. finished summary or last review step)
      onComplete?.()
    } else if (nextStepIsSummary && !state.hasBuiltReviewSteps) {
      // One step before summary: show review steps or jump to summary (don't advance past array)
      if (state.incorrectSteps.length > 0) {
        dispatch({ type: "BUILD_REVIEW_STEPS" })
      } else {
        dispatch({ type: "GO_TO_SUMMARY" })
      }
    } else {
      dispatch({ type: "NEXT_STEP" })
    }
  }, [state.isContinueEnabled, state.currentStepIndex, state.allSteps, state.originalSteps, state.hasBuiltReviewSteps, state.incorrectSteps.length, onComplete])

  const currentStep = state.allSteps[state.currentStepIndex]
  // Transient state: we're past last original step but haven't built review/summary yet (should not happen after fix above)
  const pendingReviewOrSummary = state.currentStepIndex >= state.originalSteps.length && !state.hasBuiltReviewSteps
  if (!currentStep && !pendingReviewOrSummary) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-3xl md:text-4xl font-bold text-slate-900">¡Lección completada!</p>
          {onComplete && (
            <button
              onClick={onComplete}
              className="mt-4 px-6 py-3 text-xl md:text-2xl bg-slate-800 text-white rounded-xl hover:bg-slate-900"
            >
              Finalizar
            </button>
          )}
        </div>
      </div>
    )
  }
  // Brief loading while effect/state catches up (should be rare)
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

  const renderStep = () => {
    const stepProps = {
      step: currentStep,
      onAnswered: (result: { isCompleted: boolean; isCorrect?: boolean; answerData?: any }) => {
        handleAnswered(currentStep.id, result)
      },
    }

    // Add previous answer data for review steps
    const reviewProps = isReviewStep && previousAnswer ? { ...stepProps } : stepProps

    switch (currentStep.stepType) {
      case "info":
        return <InfoStep {...stepProps} />

      case "mcq":
        return (
          <MCQStep
            {...reviewProps}
            selectedOptionId={
              isReviewStep && previousAnswer?.answerData?.selectedOptionId
                ? previousAnswer.answerData.selectedOptionId
                : undefined
            }
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

  return (
    <LessonScreen
      currentStep={state.currentStepIndex + 1}
      totalSteps={state.allSteps.length}
      footerContent={
        <div className="flex gap-3 md:gap-4">
          {onExit && (
            <StickyFooterButton variant="secondary" onClick={onExit} className="flex-1 max-w-none">
              Exit
            </StickyFooterButton>
          )}
          <StickyFooterButton
            variant={isLastStep || isSummaryStep ? "success" : "primary"}
            onClick={handleContinue}
            disabled={!state.isContinueEnabled}
            className={onExit ? "flex-1 max-w-none" : "w-full"}
          >
            {isLastStep || isSummaryStep ? "Complete Lesson" : "Continue"}
          </StickyFooterButton>
        </div>
      }
    >
      {isReviewStep && (
        <div className="mb-4 p-3 bg-amber-100 border border-amber-400 rounded-lg">
          <p className="text-xl md:text-2xl font-semibold text-amber-900">
            📚 Review: Try this question again
          </p>
        </div>
      )}
      {renderStep()}
    </LessonScreen>
  )
}

