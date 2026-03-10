"use client"

import React, { useEffect, useCallback, useRef, useState, useMemo } from "react"
import { useRouter, useParams, useSearchParams } from "next/navigation"
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
  const searchParams = useSearchParams()
  const { user, dbProfile, loading, setDbProfile, refreshUser } = useAuth()

  const topicIdStr = params.topicId as string
  const courseIdStr = params.courseId as string
  const lessonIdStr = params.lessonId as string
  const initialStepIndex = searchParams.get("step")


  const [dbLesson, setDbLesson] = useState<any>(null)
  const [loadingLesson, setLoadingLesson] = useState(true)

  useEffect(() => {
    async function fetchLessonData() {
      if (!lessonIdStr) return
      try {
        setLoadingLesson(true)
        const res = await fetch(`/api/lessons/${lessonIdStr}`)
        if (res.ok) {
          const data = await res.json()
          setDbLesson(data)
        }
      } catch (e) {
        console.error("Error fetching lesson from DB:", e)
      } finally {
        setLoadingLesson(false)
      }
    }
    fetchLessonData()
  }, [lessonIdStr])

  const registrySteps = getStepsForLesson(lessonIdStr)

  // Use DB steps if available, otherwise fallback to registry
  const lessonSteps = React.useMemo(() => {
    if (dbLesson?.steps?.length > 0) {
      return dbLesson.steps.map((s: any) => ({
        ...s.data, // original format is stored in 'data' field
        id: s.id,
        stepType: s.type,
        title: s.title,
        body: s.body,
        xpReward: s.xpReward
      }))
    }
    return registrySteps
  }, [dbLesson, registrySteps])

  const [progress, setProgress] = useState({
    currentStepIndex: initialStepIndex ? parseInt(initialStepIndex) : 0,
    totalSteps: 1,
    streak: 0,
    mistakes: 0,
    stars: 3 as 0 | 1 | 2 | 3,
    xpEarned: 0,
  })

  // Update total steps when lessonSteps changes
  useEffect(() => {
    if (lessonSteps.length > 0) {
      setProgress(prev => ({ ...prev, totalSteps: lessonSteps.length }))
    }
  }, [lessonSteps.length])

  // Access derived state after all hooks
  const isRepeated = (user?.user_metadata?.completedLessons as string[] | undefined)?.includes(lessonIdStr) || false

  // Hide app mobile footer on this page (CSS in globals.css hides via data-lesson-interactive)
  useEffect(() => {
    if (typeof document === "undefined") return
    document.documentElement.setAttribute("data-lesson-interactive", "true")
    return () => document.documentElement.removeAttribute("data-lesson-interactive")
  }, [])

  const hasCompletedRef = useRef(false)
  const handleComplete = useCallback(async (stars?: number) => {
    if (hasCompletedRef.current) return
    hasCompletedRef.current = true

    const prevStars = (user?.user_metadata?.lessonStars?.[lessonIdStr] ?? 0) as 0 | 1 | 2 | 3
    const starsEarned = typeof stars === "number" && stars >= 0 && stars <= 3 ? (stars as 0 | 1 | 2 | 3) : (2 as 0 | 1 | 2 | 3)
    const isFirstTime = !isRepeated

    // XP only awarded for new stars (Max 15 total per lesson)
    // First time: stars * 5
    // Improved stars: (newStars - oldStars) * 5
    const xpToBeAwarded = isFirstTime
      ? (starsEarned * 5)
      : Math.max(0, (starsEarned - prevStars) * 5)

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
        body: JSON.stringify({ lessonId: lessonIdStr, starsEarned, xpEarned: xpToBeAwarded }),
        keepalive: true,
      }).then(res => {
        if (res.ok) refreshUser() // Thorough refresh after API success
      }).catch((e) => console.error("Error saving progress:", e))

      // 1.5 Optimistic update for DB profile in context
      setDbProfile((prev: any) => prev ? ({
        ...prev,
        xp: (prev.xp || 0) + xpToBeAwarded
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

  const handleExit = useCallback(() => {
    // Helper for redirect (Legacy support: '1' -> 'tema-01')
    const getRedirectUrl = (id: string) => {
      if (!id) return "/courses"
      if (!id.startsWith("tema-") && !isNaN(parseInt(id))) {
        return `/courses/tema-${id.padStart(2, "0")}`
      }
      return `/courses/${id}`
    }
    router.push(getRedirectUrl(topicIdStr))
  }, [topicIdStr, router])

  const handleProgressChange = useCallback((p: any) => {
    setProgress(prev => ({ ...prev, ...p }))
  }, [])

  // Lesson is loading
  if (loadingLesson) {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FBFAF5", gap: 16, flexDirection: "column" }}>
        <div style={{ width: 40, height: 40, border: "4px solid #E2E8F0", borderTopColor: "#0B71FE", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <p style={{ fontWeight: 500, color: "#64748B" }}>Cargando lección...</p>
        <style>{`
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </div>
    )
  }

  // Lesson has no content yet (not in registry or slug typo)
  if (!lessonSteps.length) {
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
        }}
      >
        <p style={{ fontSize: 20, fontWeight: 500, color: "#334155", textAlign: "center" }}>
          Esta lección aún no tiene contenido.
        </p>
        <button
          type="button"
          onClick={() => {
            const getRedirectUrl = (id: string) => {
              if (!id) return "/courses"
              if (!id.startsWith("tema-") && !isNaN(parseInt(id))) {
                return `/courses/tema-${id.padStart(2, "0")}`
              }
              return `/courses/${id}`
            }
            router.push(getRedirectUrl(topicIdStr))
          }}
          style={{
            padding: "14px 24px",
            background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
            color: "white",
            border: "none",
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 500,
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
          onProgressChange={handleProgressChange}
        />
      </div>
    </>
  )
}
