"use client"

import { useMemo } from "react"
import { useAuth } from "@/contexts/AuthContext"

/**
 * Lesson progress for interactive lessons (learn/.../interactive).
 * Stored in user_metadata.completedLessons + user_metadata.lessonStars (logged-in)
 * or localStorage guestCompletedLessons + guestLessonStars (guest).
 *
 * Use this to:
 * - Drive progress bars (e.g. completedCount / totalLessons per course/subtema)
 * - Show earned stars (0–3) per lesson on course pages
 */
export function useLessonProgress() {
  const { user } = useAuth()

  return useMemo(() => {
    if (typeof window === "undefined") {
      return { completedLessons: [] as string[], lessonStars: {} as Record<string, number> }
    }
    if (user) {
      const completedLessons = (user.user_metadata?.completedLessons as string[] | undefined) || []
      const lessonStars = (user.user_metadata?.lessonStars as Record<string, number> | undefined) || {}
      return { completedLessons, lessonStars }
    }
    try {
      const stored = localStorage.getItem("guestCompletedLessons")
      const existing: string[] = stored ? JSON.parse(stored) : []
      const starsStored = localStorage.getItem("guestLessonStars")
      const lessonStars: Record<string, number> = starsStored ? JSON.parse(starsStored) : {}
      return { completedLessons: existing, lessonStars }
    } catch {
      return { completedLessons: [] as string[], lessonStars: {} as Record<string, number> }
    }
  }, [user])
}
