/**
 * Lesson UI Components
 * 
 * Fully responsive lesson engine UI shell for Duolingo-style interactive lessons.
 * Mobile-first design with desktop optimization.
 */

export { LessonScreen } from "./LessonScreen"
export { LessonContainer } from "./LessonContainer"
export { ProgressBar } from "./ProgressBar"
export { LessonProgressHeader } from "./LessonProgressHeader"
export type { LessonProgressHeaderProps } from "./LessonProgressHeader"
export { StickyFooter, StickyFooterButton } from "./StickyFooter"
export { sharedStyles, textSizes, spacing } from "./sharedStyles"
export {
  CONTENT_MAX_WIDTH,
  CONTENT_PADDING_X,
  CONTENT_PADDING_Y,
  CONTENT_GAP,
  CENTERED_CONTAINER_STYLE,
} from "./layoutConstants"
export { LessonEngine } from "./LessonEngine"
export { LessonExitModal } from "./LessonExitModal"
export { lessonReducer, buildReviewSteps } from "./lessonReducer"
export type { LessonState, LessonAction, AnswerResult } from "./lessonReducer"
export { SmartText } from "./SmartText"
export { TopicCompletionSplash } from "./TopicCompletionSplash"
