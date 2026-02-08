"use client"

import { useEffect, useCallback, useRef } from "react"
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

  // Hide app mobile footer on this page (CSS in globals.css hides via data-lesson-interactive)
  useEffect(() => {
    if (typeof document === "undefined") return
    document.body.setAttribute("data-lesson-interactive", "true")
    return () => document.body.removeAttribute("data-lesson-interactive")
  }, [])

  const redirectToCoursesRef = useRef(false)
  const handleComplete = useCallback((stars?: number) => {
    if (redirectToCoursesRef.current) return
    redirectToCoursesRef.current = true

    const starsEarned = typeof stars === "number" && stars >= 1 && stars <= 3 ? stars : 2
    if (lessonIdStr && typeof window !== "undefined" && !user) {
      const stored = localStorage.getItem("guestCompletedLessons")
      const existing: string[] = stored ? JSON.parse(stored) : []
      const completedLessons = existing.includes(lessonIdStr) ? existing : [...existing, lessonIdStr]
      localStorage.setItem("guestCompletedLessons", JSON.stringify(completedLessons))
      const starsStored = localStorage.getItem("guestLessonStars")
      const starsObj: Record<string, number> = starsStored ? JSON.parse(starsStored) : {}
      starsObj[lessonIdStr] = starsEarned
      localStorage.setItem("guestLessonStars", JSON.stringify(starsObj))
    }
    if (user && lessonIdStr) {
      import("@/lib/supabase/client").then(({ createClient }) => {
        const supabase = createClient()
        const existing = (user.user_metadata?.completedLessons as string[] | undefined) || []
        const lessonStars = (user.user_metadata?.lessonStars as Record<string, number> | undefined) || {}
        const completedLessons = existing.includes(lessonIdStr) ? existing : [...existing, lessonIdStr]
        const newLessonStars = { ...lessonStars, [lessonIdStr]: starsEarned }
        supabase.auth.updateUser({
          data: { ...user.user_metadata, completedLessons, lessonStars: newLessonStars },
        }).then(() => supabase.auth.refreshSession())
      })
    }
    // Force full-page redirect so user always reaches courses
    if (typeof window !== "undefined") {
      window.location.href = "/courses"
    } else {
      router.replace("/courses")
    }
  }, [lessonIdStr, user, router])

  const handleExit = () => {
    router.push("/courses")
  }

  return (
    <>
      <style>{`
        .lesson-interactive-outer {
          min-height: 100vh;
          min-height: 100dvh;
          height: 100dvh;
          box-sizing: border-box;
        }
        @media (min-width: 768px) and (max-width: 1160px) {
          .lesson-interactive-outer {
            margin-left: 220px !important;
            width: calc(100% - 220px) !important;
          }
        }
        @media (min-width: 1161px) {
          .lesson-interactive-outer {
            margin-left: 280px !important;
            width: calc(100% - 280px) !important;
          }
        }
        @media (max-width: 767px) {
          .lesson-interactive-outer {
            margin-left: 0 !important;
            width: 100% !important;
          }
        }
        /* Fixed footer: always at bottom of viewport, aligned with lesson content */
        .lesson-footer-fixed {
          position: fixed !important;
          bottom: 0 !important;
          left: 0 !important;
          right: 0 !important;
          z-index: 100;
          background: #f1f5f9;
          border-top: 2px solid #cbd5e1;
        }
        @media (max-width: 767px) {
          .lesson-footer-fixed {
            bottom: 0 !important;
          }
        }
        @media (min-width: 768px) and (max-width: 1160px) {
          .lesson-footer-fixed {
            left: 220px !important;
            width: calc(100% - 220px) !important;
          }
        }
        @media (min-width: 1161px) {
          .lesson-footer-fixed {
            left: 280px !important;
            width: calc(100% - 280px) !important;
          }
        }
      `}</style>
      <div className="lesson-interactive-outer" style={{ minHeight: "100dvh", height: "100dvh", display: "flex", flexDirection: "column" }}>
        <LessonEngine
          lessonSteps={lessonSteps}
          onComplete={handleComplete}
          onExit={handleExit}
        />
      </div>
    </>
  )
}
