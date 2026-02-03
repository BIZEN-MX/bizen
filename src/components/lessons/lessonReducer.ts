import { LessonStep } from "@/types/lessonTypes"

export interface AnswerResult {
  stepId: string
  isCorrect: boolean
  answerData?: any // Store the actual answer for review steps
}

export interface LessonState {
  originalSteps: LessonStep[]
  allSteps: LessonStep[] // originalSteps + reviewSteps
  currentStepIndex: number
  answersByStepId: Record<string, AnswerResult>
  incorrectSteps: string[]
  hasBuiltReviewSteps: boolean
  isContinueEnabled: boolean
}

export type LessonAction =
  | { type: "INIT"; steps: LessonStep[] }
  | { type: "ANSWER_STEP"; stepId: string; isCorrect: boolean; answerData?: any }
  | { type: "ENABLE_CONTINUE" }
  | { type: "DISABLE_CONTINUE" }
  | { type: "NEXT_STEP" }
  | { type: "BUILD_REVIEW_STEPS" }
  | { type: "GO_TO_SUMMARY" }

export function lessonReducer(state: LessonState, action: LessonAction): LessonState {
  switch (action.type) {
    case "INIT": {
      const firstStep = action.steps[0]
      const firstStepAutoComplete =
        firstStep?.stepType === "info" || firstStep?.stepType === "summary"
      return {
        originalSteps: action.steps,
        allSteps: action.steps,
        currentStepIndex: 0,
        answersByStepId: {},
        incorrectSteps: [],
        hasBuiltReviewSteps: false,
        isContinueEnabled: !!firstStepAutoComplete,
      }
    }

    case "ANSWER_STEP": {
      const { stepId, isCorrect, answerData } = action
      const step = state.allSteps.find((s) => s.id === stepId)
      const isReviewStep = !!step?.reviewSourceStepId
      
      // Only record incorrect for non-review steps
      // Review steps that are answered incorrectly don't get added to incorrectSteps again
      const shouldRecordIncorrect =
        !isReviewStep && step?.isAssessment && !isCorrect && (step.recordIncorrect ?? true)

      const newIncorrectSteps = shouldRecordIncorrect
        ? [...new Set([...state.incorrectSteps, stepId])]
        : state.incorrectSteps

      return {
        ...state,
        answersByStepId: {
          ...state.answersByStepId,
          [stepId]: { stepId, isCorrect, answerData },
        },
        incorrectSteps: newIncorrectSteps,
      }
    }

    case "ENABLE_CONTINUE":
      return {
        ...state,
        isContinueEnabled: true,
      }

    case "DISABLE_CONTINUE":
      return {
        ...state,
        isContinueEnabled: false,
      }

    case "NEXT_STEP": {
      const nextIndex = state.currentStepIndex + 1
      const nextStep = state.allSteps[nextIndex]
      const nextStepAutoComplete =
        nextStep?.stepType === "info" || nextStep?.stepType === "summary"
      const isLastOriginalStep = nextIndex >= state.originalSteps.length

      // If we're at the end of original steps and haven't built review steps yet
      if (isLastOriginalStep && !state.hasBuiltReviewSteps) {
        // Will be handled by BUILD_REVIEW_STEPS or GO_TO_SUMMARY
        return {
          ...state,
          currentStepIndex: nextIndex,
          isContinueEnabled: false,
        }
      }

      return {
        ...state,
        currentStepIndex: nextIndex,
        isContinueEnabled: !!nextStepAutoComplete,
      }
    }

    case "BUILD_REVIEW_STEPS": {
      if (state.hasBuiltReviewSteps || state.incorrectSteps.length === 0) {
        return state
      }

      // Find the summary step (if any)
      const summaryStepIndex = state.originalSteps.findIndex((s) => s.stepType === "summary")
      const stepsBeforeSummary =
        summaryStepIndex >= 0
          ? state.originalSteps.slice(0, summaryStepIndex)
          : state.originalSteps
      const summaryStep =
        summaryStepIndex >= 0 ? state.originalSteps[summaryStepIndex] : null

      // Build review steps from incorrect steps
      const reviewSteps: LessonStep[] = state.incorrectSteps
        .map((incorrectStepId) => {
          const originalStep = state.originalSteps.find((s) => s.id === incorrectStepId)
          if (!originalStep) return null

          // Create a review step that reuses the original step's content
          // but with a review indicator
          return {
            ...originalStep,
            id: `review-${originalStep.id}`,
            reviewSourceStepId: originalStep.id,
            title: originalStep.title
              ? `Review: ${originalStep.title}`
              : "Review Question",
            description: "Try this question again",
          } as LessonStep
        })
        .filter((step): step is LessonStep => step !== null)

      // Combine: original steps (except summary) + review steps + summary
      const newAllSteps = [
        ...stepsBeforeSummary,
        ...reviewSteps,
        ...(summaryStep ? [summaryStep] : []),
      ]

      // Update current step index to point to first review step
      const firstReviewIndex = stepsBeforeSummary.length

      return {
        ...state,
        allSteps: newAllSteps,
        currentStepIndex: firstReviewIndex,
        hasBuiltReviewSteps: true,
        isContinueEnabled: false,
      }
    }

    case "GO_TO_SUMMARY": {
      const summaryStepIndex = state.allSteps.findIndex((s) => s.stepType === "summary")
      if (summaryStepIndex >= 0) {
        return {
          ...state,
          currentStepIndex: summaryStepIndex,
          isContinueEnabled: true,
        }
      }
      return state
    }

    default:
      return state
  }
}

/**
 * Helper function to build review steps from incorrect step IDs
 */
export function buildReviewSteps(
  originalSteps: LessonStep[],
  incorrectStepIds: string[]
): LessonStep[] {
  return incorrectStepIds
    .map((stepId) => {
      const originalStep = originalSteps.find((s) => s.id === stepId)
      if (!originalStep) return null

      return {
        ...originalStep,
        id: `review-${originalStep.id}`,
        reviewSourceStepId: originalStep.id,
        title: originalStep.title ? `Review: ${originalStep.title}` : "Review Question",
        description: "Try this question again",
      } as LessonStep
    })
    .filter((step): step is LessonStep => step !== null)
}

