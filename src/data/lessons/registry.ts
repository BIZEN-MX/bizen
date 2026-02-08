import type { LessonStep } from "@/types/lessonTypes"
import { lesson1Steps } from "./lesson1"
import { lesson2Steps } from "./lesson2"
import { lessonQueEsElDineroParaMiSteps } from "./lesson-que-es-el-dinero-para-mi"

/**
 * Maps lesson ID to steps. Add entries when you add lesson content.
 * Lesson ID should match the slug used in course tema data (e.g. que-es-el-dinero-para-mi-hoy).
 */
export const lessonRegistry: Record<string, LessonStep[]> = {
  "l1-1": lesson1Steps,
  "l1-2": lesson2Steps,
  "que-es-el-dinero-para-mi-hoy": lessonQueEsElDineroParaMiSteps,
}

/** Get steps for a lesson ID. Returns empty array if none. */
export function getStepsForLesson(lessonId: string | undefined): LessonStep[] {
  if (!lessonId) return []
  return lessonRegistry[lessonId] ?? []
}
