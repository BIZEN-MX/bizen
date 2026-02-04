import type { LessonStep } from "@/types/lessonTypes"
import { lesson1Steps } from "./lesson1"
import { lesson2Steps } from "./lesson2"

/**
 * Maps lesson ID to steps. Add entries when you add lesson content.
 */
export const lessonRegistry: Record<string, LessonStep[]> = {
  "l1-1": lesson1Steps,
  "l1-2": lesson2Steps,
}

/** Get steps for a lesson ID. Returns empty array if none. */
export function getStepsForLesson(lessonId: string | undefined): LessonStep[] {
  if (!lessonId) return []
  return lessonRegistry[lessonId] ?? []
}
