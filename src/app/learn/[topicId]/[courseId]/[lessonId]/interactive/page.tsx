"use client"

import React, { useEffect, useCallback, useRef, useState, useMemo, Suspense } from "react"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { LessonEngine, LessonProgressHeader } from "@/components/lessons"
import { getStepsForLesson } from "@/data/lessons/registry"
import { useLessonProgress } from "@/hooks/useLessonProgress"
import { SUBTEMAS_BY_COURSE } from "@/data/lessons/courseLessonsOrder"
import PageLoader from "@/components/PageLoader"

function InteractiveLessonContent() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const { user, dbProfile, loading, setDbProfile, refreshUser } = useAuth()

  const topicIdStr = (params?.topicId as string) || ""
  const courseIdStr = (params?.courseId as string) || ""
  const lessonIdStr = (params?.lessonId as string) || ""
  const initialStepIndex = searchParams?.get("step")

  // Redirect legacy 'course-1' topic format to 'tema-01'
  useEffect(() => {
    if (topicIdStr.startsWith('course-')) {
      const num = topicIdStr.replace('course-', '').padStart(2, '0')
      router.replace(`/learn/tema-${num}/${courseIdStr}/${lessonIdStr}/interactive`)
    }
  }, [topicIdStr, courseIdStr, lessonIdStr, router])

  const [dbLesson, setDbLesson] = useState<any>(null)
  const [loadingLesson, setLoadingLesson] = useState(true)
  const { completedLessons } = useLessonProgress()

  // Fetch Lesson Data from DB with fallback
  useEffect(() => {
    if (!lessonIdStr) {
      setLoadingLesson(false)
      return
    }

    async function fetchLesson() {
      try {
        setLoadingLesson(true)
        const res = await fetch(`/api/lessons/${lessonIdStr}`)
        if (!res.ok) throw new Error("API failed to fetch lesson")
        const data = await res.json()

        // Map DB/Static steps to Engine format
        const formattedSteps = (data.steps || []).map((step: any) => {
          const mainType = step.stepType || step.type; // Fallback to DB 'type' if stepType missing
          const extraData = typeof step.data === 'string' ? JSON.parse(step.data) : (step.data || {});
          
          return {
            ...step,
            ...extraData,
            stepType: mainType, // Standardize as stepType for the Engine
            mood: extraData.mood || step.mood || (mainType === "billy_talks" ? "thinking" : undefined),
          }
        })

        setDbLesson({ ...data, steps: formattedSteps })
        setProgress(prev => ({ ...prev, totalSteps: formattedSteps.length || 1 }))
      } catch (err: any) {
        console.error("Error fetching lesson:", err)
      } finally {
        setLoadingLesson(false)
      }
    }

    fetchLesson()
  }, [lessonIdStr])

  // Get steps from registry as fallback if DB fails or is still loading
  const registrySteps = useMemo(() => getStepsForLesson(lessonIdStr), [lessonIdStr])

  // Final lesson steps with fallback (Curriculum Design > Database)
  const lessonSteps = useMemo(() => {
    if (registrySteps && registrySteps.length > 0) return registrySteps
    return dbLesson?.steps || []
  }, [dbLesson, registrySteps])

  // ── Access & Locking Check ────────────────────────────────────────────────
  const topicNum = useMemo(() => {
    const s = String(topicIdStr || "").trim()
    const match = s.match(/tema-(\d+)/i) || s.match(/^(\d+)$/)
    if (match) return parseInt(match[1], 10)
    return 1
  }, [topicIdStr])

  const hasActiveStripe = dbProfile?.subscriptionStatus === 'active'
  const hasActiveLicense = !!(dbProfile?.school?.licenses?.length)
  const isInstitutional = !!dbProfile?.schoolId || (dbProfile?.role && dbProfile.role !== 'particular')
  const hasPremiumAccess = hasActiveStripe || hasActiveLicense || isInstitutional

  // Check if topic is locked by sequence
  const nextTopicId = useMemo(() => {
    try {
      if (!SUBTEMAS_BY_COURSE) return 1
      for (let i = 0; i < SUBTEMAS_BY_COURSE.length; i++) {
          const tId = i + 1;
          const subthemes = SUBTEMAS_BY_COURSE[i];
          if (!subthemes) continue;
          const topicLessons = subthemes.flatMap((s: any) => s.lessons || []);
          const allDone = topicLessons.every((l: any) => completedLessons.includes(l.slug));
          if (!allDone) return tId;
      }
    } catch (e) {
      console.error("Error in nextTopicId calculation:", e)
    }
    return 1;
  }, [completedLessons]);

  const isTopicLocked = topicNum > nextTopicId;

  // Check if lesson is locked by sequence or paywall
  const allLessonsInTopic = useMemo(() => {
    try {
      const topicIndex = topicNum - 1;
      const subthemes = SUBTEMAS_BY_COURSE[topicIndex];
      if (!subthemes) return [];
      return subthemes.flatMap(s => (s.lessons || []).map((l: any) => l.slug)) || []
    } catch (e) {
      console.error("Error in allLessonsInTopic calculation:", e)
      return []
    }
  }, [topicNum])
  
  const currentLessonIdx = allLessonsInTopic.indexOf(lessonIdStr)
  const isFirstLessonOfTopic = currentLessonIdx <= 0
  const previousLessonSlug = !isFirstLessonOfTopic && allLessonsInTopic[currentLessonIdx - 1] ? allLessonsInTopic[currentLessonIdx - 1] : null
  const isSequenceLocked = !isFirstLessonOfTopic && previousLessonSlug && !completedLessons.includes(previousLessonSlug)

  const isPremiumLesson = topicNum > 1 || (currentLessonIdx + 1) > 3
  const isPaywalled = isPremiumLesson && !hasPremiumAccess

  const isLocked = !loading && !loadingLesson && (isTopicLocked || isPaywalled || isSequenceLocked)

  useEffect(() => {
    if (isLocked) {
      if (isPaywalled) {
        router.push('/payment')
      } else {
        router.push(`/courses/${topicIdStr}`)
      }
    }
  }, [isLocked, isPaywalled, router, topicIdStr])

  const [progress, setProgress] = useState({
    currentStepIndex: initialStepIndex ? parseInt(initialStepIndex) : 0,
    totalSteps: 1,
    streak: 0,
    mistakes: 0,
    stars: 3 as 0 | 1 | 2 | 3,
    xpEarned: 0,
  })

  // Stable callback to prevent infinite re-renders in LessonEngine
  const handleProgressChange = useCallback((p: any) => {
    setProgress(prev => ({ ...prev, ...p }))
  }, [])

  // Update total steps when lessonSteps changes
  useEffect(() => {
    if (lessonSteps.length > 0) {
      setProgress(prev => ({ ...prev, totalSteps: lessonSteps.length }))
    }
  }, [lessonSteps.length])

  // Access derived state after all hooks
  const isRepeated = (user?.user_metadata?.completedLessons as string[] | undefined)?.includes(lessonIdStr) || false

  // Hide app mobile footer on this page
  useEffect(() => {
    if (typeof document === "undefined") return
    document.documentElement.setAttribute("data-lesson-interactive", "true")
    return () => document.documentElement.removeAttribute("data-lesson-interactive")
  }, [])

  const hasCompletedRef = useRef(false)
  const handleComplete = useCallback(async (stars: number, answers: Record<string, any>) => {
    if (hasCompletedRef.current) return
    hasCompletedRef.current = true

    const prevStars = (user?.user_metadata?.lessonStars?.[lessonIdStr] ?? 0) as 0 | 1 | 2 | 3
    const starsEarned = typeof stars === "number" && stars >= 0 && stars <= 3 ? (stars as 0 | 1 | 2 | 3) : (2 as 0 | 1 | 2 | 3)
    const isFirstTime = !isRepeated
    const xpToBeAwarded = isFirstTime ? (starsEarned * 5) : Math.max(0, (starsEarned - prevStars) * 5)

    if (user && lessonIdStr) {
      fetch("/api/lesson/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: lessonIdStr, starsEarned, xpEarned: xpToBeAwarded, answers }),
        keepalive: true,
      }).then(res => {
        if (res.ok) refreshUser()
      }).catch((e) => console.error("Error saving progress:", e))

      setDbProfile((prev: any) => prev ? ({ ...prev, xp: (prev.xp || 0) + xpToBeAwarded }) : prev)

      try {
        const { createClient } = await import("@/lib/supabase/client")
        const supabase = createClient()
        const existing = (user.user_metadata?.completedLessons as string[] | undefined) || []
        const lessonStars = (user.user_metadata?.lessonStars as Record<string, number> | undefined) || {}
        const completedLessons = existing.includes(lessonIdStr) ? existing : [...existing, lessonIdStr]
        const newLessonStars = { ...lessonStars, [lessonIdStr]: starsEarned }

        supabase.auth.updateUser({
          data: { ...user.user_metadata, completedLessons, lessonStars: newLessonStars },
        }).then(() => supabase.auth.refreshSession())
      } catch (e) {}
    }
  }, [lessonIdStr, user, isRepeated, refreshUser, setDbProfile])

  const handleExit = useCallback(() => {
    // TRIGGER: If finishing Tema 05 final lesson, go to DNA Evolution
    if (topicIdStr === "tema-05") {
      router.push("/dna-evolution")
    } else {
      router.push(`/courses/${topicIdStr || 'tema-01'}`)
    }
  }, [topicIdStr, router])

  if (loading || loadingLesson) return <PageLoader />
  if (isLocked) return null

  if (!lessonSteps.length) {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, padding: 24, background: "#f1f5f9" }}>
        <p style={{ fontSize: 20, fontWeight: 500, color: "#334155", textAlign: "center" }}>Esta lección no tiene contenido disponible.</p>
        <button onClick={handleExit} style={{ padding: "14px 24px", background: "#0B71FE", color: "white", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 500, cursor: "pointer" }}>Volver al curso</button>
      </div>
    )
  }

  return (
    <div className="lesson-interactive-outer" style={{ height: "100dvh", overflow: "hidden" }}>
        <style>{`
            .lesson-interactive-outer { margin-left: 0 !important; width: 100% !important; background: white !important; }
            .lesson-screen-root, .lesson-container-no-scroll { overflow: hidden !important; flex: 1 !important; display: flex; flex-direction: column; }
        `}</style>
        <LessonEngine
          lessonSteps={lessonSteps}
          onComplete={handleComplete}
          onExit={handleExit}
          isRepeat={isRepeated}
          onProgressChange={handleProgressChange}
        />
    </div>
  )
}

export default function InteractiveLessonPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <InteractiveLessonContent />
    </Suspense>
  )
}
