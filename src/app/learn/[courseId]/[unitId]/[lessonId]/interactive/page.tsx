"use client"

import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { LessonEngine } from "@/components/lessons"
import { getStepsForLesson } from "@/data/lessons/registry"

/**
 * Interactive Lesson Page
 *
 * Route: /learn/[courseId]/[unitId]/[lessonId]/interactive
 *
 * Lesson content is registered in src/data/lessons/registry.ts.
 * Add new lessons in src/data/lessons/lessonN.ts and register them in registry.ts.
 */
export default function InteractiveLessonPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const { lessonId } = params
  const lessonIdStr = lessonId as string

  const lessonSteps = getStepsForLesson(lessonIdStr)

  const handleComplete = async () => {
    if (lessonIdStr) {
      if (user) {
        const { createClient } = await import("@/lib/supabase/client")
        const supabase = createClient()
        const existing = (user.user_metadata?.completedLessons as string[] | undefined) || []
        if (!existing.includes(lessonIdStr)) {
          const completedLessons = [...existing, lessonIdStr]
          await supabase.auth.updateUser({
            data: { ...user.user_metadata, completedLessons },
          })
          // Refresh session so /courses sees updated completedLessons and progress bar updates
          await supabase.auth.refreshSession()
        }
      } else {
        const stored = typeof window !== "undefined" ? localStorage.getItem("guestCompletedLessons") : null
        const existing: string[] = stored ? JSON.parse(stored) : []
        if (!existing.includes(lessonIdStr)) {
          const completedLessons = [...existing, lessonIdStr]
          if (typeof window !== "undefined") {
            localStorage.setItem("guestCompletedLessons", JSON.stringify(completedLessons))
          }
        }
      }
    }
    router.push("/courses")
  }

  const handleExit = () => {
    router.push("/courses")
  }

  return (
    <>
      <style>{`
        /* Mobile - full width */
        @media (max-width: 767px) {
          .lesson-interactive-outer {
            margin-left: 0 !important;
            width: 100% !important;
            padding-bottom: 65px !important;
          }
        }
        /* Tablet (768px–1160px) - sidebar 220px */
        @media (min-width: 768px) and (max-width: 1160px) {
          .lesson-interactive-outer {
            margin-left: 220px !important;
            width: calc(100% - 220px) !important;
          }
        }
        /* Desktop (1161px+) - sidebar 280px */
        @media (min-width: 1161px) {
          .lesson-interactive-outer {
            margin-left: 280px !important;
            width: calc(100% - 280px) !important;
          }
        }
      `}</style>
      <div className="lesson-interactive-outer" style={{ minHeight: "100vh", boxSizing: "border-box" }}>
        <LessonEngine
          lessonSteps={lessonSteps}
          onComplete={handleComplete}
          onExit={handleExit}
        />
      </div>
    </>
  )
}
