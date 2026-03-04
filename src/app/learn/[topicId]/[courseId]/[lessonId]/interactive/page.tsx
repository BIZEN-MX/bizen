"use client"

import { useEffect, useCallback, useRef, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { LessonEngine, LessonProgressHeader } from "@/components/lessons"
import { getStepsForLesson } from "@/data/lessons/registry"
import { FooterNav } from "@/components/FooterNav"

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
  const { user, setDbProfile, refreshUser } = useAuth()
  const { topicId, courseId, lessonId } = params
  const lessonIdStr = lessonId as string
  const topicIdStr = (topicId as string) || "1"
  const courseIdStr = (courseId as string) || "1"


  const lessonSteps = getStepsForLesson(lessonIdStr)

  const [progress, setProgress] = useState({
    currentStep: 1,
    totalSteps: lessonSteps.length || 1,
    streak: 0,
    stars: 3 as 0 | 1 | 2 | 3,
  })

  // Hide app mobile footer on this page (CSS in globals.css hides via data-lesson-interactive)
  useEffect(() => {
    if (typeof document === "undefined") return
    document.body.setAttribute("data-lesson-interactive", "true")
    return () => document.body.removeAttribute("data-lesson-interactive")
  }, [])

  const isRepeated = (user?.user_metadata?.completedLessons as string[] | undefined)?.includes(lessonIdStr) || false

  const hasCompletedRef = useRef(false)
  const handleComplete = useCallback(async (stars?: number) => {
    if (hasCompletedRef.current) return
    hasCompletedRef.current = true

    const starsEarned = typeof stars === "number" && stars >= 0 && stars <= 3 ? stars : 2
    const xpEarned = isRepeated ? (starsEarned > 0 ? 5 : 0) : (starsEarned * 5)

    // Guest user: save to localStorage
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

    // Logged-in user: Call API first to ensure XP is saved, then update frontend session
    if (user && lessonIdStr) {
      // 1. Issue the API call decoupled from UI blocking. keepalive helps if tab closes.
      fetch("/api/lesson/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: lessonIdStr, starsEarned, xpEarned }),
        keepalive: true,
      }).then(res => {
        if (res.ok) refreshUser() // Thorough refresh after API success
      }).catch((e) => console.error("Error saving progress:", e))

      // 1.5 Optimistic update for DB profile in context
      setDbProfile((prev: any) => prev ? ({
        ...prev,
        xp: (prev.xp || 0) + xpEarned
      }) : prev)

      // 2. Refresh local session for instant UI reflect without blocking
      try {
        const { createClient } = await import("@/lib/supabase/client")
        const supabase = createClient()
        const existing = (user.user_metadata?.completedLessons as string[] | undefined) || []
        const lessonStars = (user.user_metadata?.lessonStars as Record<string, number> | undefined) || {}
        const completedLessons = existing.includes(lessonIdStr) ? existing : [...existing, lessonIdStr]
        const newLessonStars = { ...lessonStars, [lessonIdStr]: starsEarned }

        supabase.auth.updateUser({
          data: { ...user.user_metadata, completedLessons, lessonStars: newLessonStars },
        }).then(() => supabase.auth.refreshSession()).catch(() => { })
      } catch (e) {
        // Ignore session refresh errors
      }
    }
  }, [lessonIdStr, user, isRepeated, topicIdStr])

  const handleExit = () => {
    const topicNum = topicIdStr.replace(/^course-/, "") || "1"
    router.push(`/courses/${topicNum}`)
  }

  // Lesson has no content yet (not in registry or slug typo)
  if (!lessonSteps.length) {
    const courseNum = courseIdStr.replace(/^course-/, "") || "1"
    return (
      <div
        style={{
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          padding: 24,
          background: "#f1f5f9",
          fontFamily: "'Montserrat', sans-serif",
        }}
      >
        <p style={{ fontSize: 20, fontWeight: 600, color: "#334155", textAlign: "center" }}>
          Esta lección aún no tiene contenido.
        </p>
        <button
          type="button"
          onClick={() => router.push(`/courses/${courseNum}`)}
          style={{
            padding: "14px 24px",
            background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
            color: "white",
            border: "none",
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Volver al curso
        </button>
      </div>
    )
  }

  return (
    <>
      <style>{`
        /* LOCKED: one viewport, no scroll inside lesson */
        .lesson-interactive-outer {
          height: 100dvh !important;
          max-height: 100dvh !important;
          min-height: 100dvh !important;
          overflow: hidden !important;
          box-sizing: border-box;
          background: #FFFFFF !important;
        }
        /* Full width on all screen sizes when sidebar is hidden (lesson view) */
        .lesson-interactive-outer {
          margin-left: 0 !important;
          width: 100% !important;
        }
        /* LOCKED: no scroll inside - content area is fixed, overflow hidden */
        .lesson-screen-root {
          overflow: hidden !important;
          min-height: 0 !important;
          flex: 1 !important;
        }
        .lesson-container-no-scroll {
          overflow: hidden !important;
          min-height: 0 !important;
          flex: 1 !important;
        }
        /* Nav buttons at bottom of slide - in flow so bottom doesn't look empty */
        .lesson-footer-in-flow {
          width: 100%;
          flex-shrink: 0;
          background: #f1f5f9;
          border-top: 2px solid #cbd5e1;
          padding-top: 16px;
          padding-bottom: max(16px, env(safe-area-inset-bottom));
        }
      `}</style>
      <div className="lesson-interactive-outer">
        <LessonEngine
          lessonSteps={lessonSteps}
          onComplete={handleComplete}
          onExit={handleExit}
          isRepeat={isRepeated}
          onProgressChange={setProgress}
        />
      </div>

    </>
  )
}
