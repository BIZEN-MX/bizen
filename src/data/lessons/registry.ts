import type { LessonStep } from "@/types/lessonTypes"
import { lesson1Steps } from "./lesson1"
import { lesson2Steps } from "./lesson2"

/**
 * Maps lesson ID (e.g. "l1-1", "l1-2") to the lesson's steps.
 * Add new lessons here when you create lesson2.ts, lesson3.ts, etc.
 *
 * ID format: l{courseOrder}-{lessonIndex}
 * - course-1 → l1-1, l1-2, l1-3, ...
 * - course-2 → l2-1, l2-2, ...
 */
export const lessonRegistry: Record<string, LessonStep[]> = {
  "l1-1": lesson1Steps,
  "l1-2": lesson2Steps,
  // "l1-3": lesson3Steps,
  // "l2-1": lesson2Course2Steps,
}

/** Get steps for a lesson ID, or fallback (e.g. lesson1) if not found. */
export function getStepsForLesson(lessonId: string | undefined): LessonStep[] {
  if (!lessonId) return lesson1Steps
  return lessonRegistry[lessonId] ?? lesson1Steps
}
