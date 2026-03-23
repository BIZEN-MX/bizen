import type { LessonStep } from "@/types/lessonTypes"

/**
 * Maps lesson ID to steps. Add entries when you add lesson content.
 * Lesson ID should match the slug used in course tema data.
 */
export const lessonRegistry: Record<string, LessonStep[]> = {
  // Static content can be added here as fallback/dev-override
  // "que-es-el-dinero-para-mi": [...],
}

/** Get steps for a lesson ID. Returns empty array if none. */
export function getStepsForLesson(lessonId: string | undefined): LessonStep[] {
  if (!lessonId) return []
  return lessonRegistry[lessonId] ?? []
}
