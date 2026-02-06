"use client"

import React, { useReducer, useEffect, useCallback, useState } from "react"
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
  const [showExitConfirm, setShowExitConfirm] = useState(false)
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
      // For fullScreen steps, pass navigation + progress for functional bar
      ...(currentStep.fullScreen ? {
        onExit: () => setShowExitConfirm(true),
        onContinue: handleContinue,
        isContinueEnabled: state.isContinueEnabled,
        currentStepIndex: state.currentStepIndex,
        totalSteps: state.allSteps.length,
      } : {}),
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

  // Full-screen mode: render step directly without chrome
  if (currentStep.fullScreen) {
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
        {showExitConfirm && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="exit-dialog-title"
            onClick={() => setShowExitConfirm(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 md:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 id="exit-dialog-title" className="text-xl md:text-2xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                ⚠️ ¿Estás seguro?
              </h2>
              <p className="text-base md:text-lg text-slate-600 mb-6 leading-relaxed">
                Si sales ahora, se perderá tu progreso de la lección actual. ¿Deseas continuar?
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setShowExitConfirm(false)}
                  className="flex-1 px-5 py-3 rounded-xl font-semibold text-white bg-blue-500 hover:bg-blue-600 transition-colors shadow-md"
                >
                  Continuar con la lección
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowExitConfirm(false)
                    onExit?.()
                  }}
                  className="flex-1 px-5 py-3 rounded-xl font-semibold text-red-600 bg-white border border-red-300 hover:bg-red-50 transition-colors"
                >
                  Salir de la lección
                </button>
              </div>
            </div>
          </div>
        )}
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
              onClick={() => setShowExitConfirm(true)}
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
      {showExitConfirm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="exit-dialog-title"
          onClick={() => setShowExitConfirm(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="exit-dialog-title" className="text-xl md:text-2xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              ⚠️ ¿Estás seguro?
            </h2>
            <p className="text-base md:text-lg text-slate-600 mb-6 leading-relaxed">
              Si sales ahora, se perderá tu progreso de la lección actual. ¿Deseas continuar?
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 px-5 py-3 rounded-xl font-semibold text-white bg-blue-500 hover:bg-blue-600 transition-colors shadow-md"
              >
                Continuar con la lección
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowExitConfirm(false)
                  onExit?.()
                }}
                className="flex-1 px-5 py-3 rounded-xl font-semibold text-red-600 bg-white border border-red-300 hover:bg-red-50 transition-colors"
              >
                Salir de la lección
              </button>
            </div>
          </div>
        </div>
      )}
    </LessonScreen>
  )
}

