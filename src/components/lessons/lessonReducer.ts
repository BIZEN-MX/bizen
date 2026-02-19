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
  totalMistakes: number // Track unique initial mistakes for scoring
  hasBuiltReviewSteps: boolean
  isContinueEnabled: boolean
  isActionEnabled: boolean
  actionTrigger: number
}

export type LessonAction =
  | { type: "INIT"; steps: LessonStep[] }
  | { type: "ANSWER_STEP"; stepId: string; isCorrect: boolean; answerData?: any }
  | { type: "ENABLE_CONTINUE" }
  | { type: "DISABLE_CONTINUE" }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "BUILD_REVIEW_STEPS" }
  | { type: "GO_TO_SUMMARY" }
  | { type: "APPEND_REVIEW_STEP"; sourceStepId: string }
  | { type: "GO_TO_SUMMARY_AFTER_REVIEW" }
  | { type: "SET_ACTION_ENABLED"; enabled: boolean }
  | { type: "TRIGGER_ACTION" }

export function lessonReducer(state: LessonState, action: LessonAction): LessonState {
  switch (action.type) {
    case "INIT": {
      const firstStep = action.steps[0]
      const firstStepAutoComplete =
        (firstStep?.stepType === "info" && !firstStep?.fullScreen) || firstStep?.stepType === "summary"
      const firstStepIsInfoFullScreen = firstStep?.stepType === "info" && firstStep?.fullScreen
      return {
        originalSteps: action.steps,
        allSteps: action.steps,
        currentStepIndex: 0,
        answersByStepId: {},
        incorrectSteps: [],
        totalMistakes: 0,
        hasBuiltReviewSteps: false,
        isContinueEnabled: !!firstStepAutoComplete,
        isActionEnabled: !!firstStepIsInfoFullScreen,
        actionTrigger: 0,
      }
    }

    case "ANSWER_STEP": {
      const { stepId, isCorrect, answerData } = action
      const step = state.allSteps.find((s) => s.id === stepId)
      const isReviewStep = !!step?.reviewSourceStepId
      const sourceStepId = step?.reviewSourceStepId

      let newIncorrectSteps = state.incorrectSteps
      let newTotalMistakes = state.totalMistakes

      if (isReviewStep && isCorrect && sourceStepId) {
        newIncorrectSteps = state.incorrectSteps.filter((id) => id !== sourceStepId)
      } else if (!isReviewStep && step?.isAssessment && !isCorrect) {
        // Record mistake if this step wasn't already marked incorrect (avoid double counting retries if allowed)
        if (!state.incorrectSteps.includes(stepId) && (step.recordIncorrect ?? true)) {
          newTotalMistakes = state.totalMistakes + 1
        }
        if (step.recordIncorrect ?? true) {
          newIncorrectSteps = [...new Set([...state.incorrectSteps, stepId])]
        }
      }

      const newAnswersByStepId = {
        ...state.answersByStepId,
        [stepId]: { stepId, isCorrect, answerData },
      }
      if (isReviewStep && isCorrect && sourceStepId) {
        newAnswersByStepId[sourceStepId] = { stepId: sourceStepId, isCorrect: true, answerData }
      }

      return {
        ...state,
        answersByStepId: newAnswersByStepId,
        incorrectSteps: newIncorrectSteps,
        totalMistakes: newTotalMistakes,
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
        (nextStep?.stepType === "info" && !nextStep?.fullScreen) || nextStep?.stepType === "summary"
      const isLastOriginalStep = nextIndex >= state.originalSteps.length

      // If we're at the end of original steps and haven't built review steps yet
      if (isLastOriginalStep && !state.hasBuiltReviewSteps) {
        // Will be handled by BUILD_REVIEW_STEPS or GO_TO_SUMMARY
        return {
          ...state,
          currentStepIndex: nextIndex,
          isContinueEnabled: false,
          isActionEnabled: false,
          actionTrigger: 0,
        }
      }

      const nextStepIsInfoFullScreen = nextStep?.stepType === "info" && nextStep?.fullScreen

      return {
        ...state,
        currentStepIndex: nextIndex,
        isContinueEnabled: !!nextStepAutoComplete,
        isActionEnabled: !!nextStepIsInfoFullScreen,
        actionTrigger: 0,
      }
    }

    case "PREV_STEP": {
      if (state.currentStepIndex <= 0) return state
      const nextIndex = state.currentStepIndex - 1

      // When going back, continue is almost always enabled because they've already been there
      return {
        ...state,
        currentStepIndex: nextIndex,
        isContinueEnabled: true,
        isActionEnabled: false,
        actionTrigger: 0,
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

      // Combine: original steps (except summary) + review steps only (no summary until all correct)
      const newAllSteps = [...stepsBeforeSummary, ...reviewSteps]

      const firstReviewIndex = stepsBeforeSummary.length

      return {
        ...state,
        allSteps: newAllSteps,
        currentStepIndex: firstReviewIndex,
        hasBuiltReviewSteps: true,
        isContinueEnabled: false,
      }
    }

    case "APPEND_REVIEW_STEP": {
      const { sourceStepId } = action
      const originalStep = state.originalSteps.find((s) => s.id === sourceStepId)
      if (!originalStep) return state

      const reviewCount = state.allSteps.filter((s) => s.reviewSourceStepId === sourceStepId).length
      const newReviewStep: LessonStep = {
        ...originalStep,
        id: `review-${sourceStepId}-${reviewCount}`,
        reviewSourceStepId: originalStep.id,
        title: originalStep.title ? `Review: ${originalStep.title}` : "Review Question",
        description: "Try this question again",
      } as LessonStep

      return {
        ...state,
        allSteps: [...state.allSteps, newReviewStep],
        isContinueEnabled: true,
      }
    }

    case "GO_TO_SUMMARY_AFTER_REVIEW": {
      const summaryStepIndex = state.originalSteps.findIndex((s) => s.stepType === "summary")
      const summaryStep = summaryStepIndex >= 0 ? state.originalSteps[summaryStepIndex] : null
      if (!summaryStep) return state

      return {
        ...state,
        allSteps: [...state.allSteps, summaryStep],
        currentStepIndex: state.allSteps.length,
        isContinueEnabled: true,
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

    case "SET_ACTION_ENABLED":
      return {
        ...state,
        isActionEnabled: action.enabled,
      }

    case "TRIGGER_ACTION":
      return {
        ...state,
        actionTrigger: state.actionTrigger + 1,
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

