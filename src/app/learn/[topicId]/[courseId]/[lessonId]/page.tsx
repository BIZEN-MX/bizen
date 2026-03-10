"use client"

import { useEffect, useCallback, useRef, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { LessonEngine, LessonProgressHeader } from "@/components/lessons"
import { motion, AnimatePresence } from "framer-motion"

export default function LessonPage() {
    const { user, refreshUser } = useAuth()
    const router = useRouter()
    const params = useParams()

    const topicIdStr = (params.topicId as string) || "1"
    const courseIdStr = (params.courseId as string) || "1"
    const lessonIdStr = params.lessonId as string

    const [lessonData, setLessonData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [progress, setProgress] = useState({
        currentStep: 1,
        totalSteps: 1,
        streak: 0,
        stars: 3 as 0 | 1 | 2 | 3,
    })

    // 1. Fetch Lesson Data from DB
    useEffect(() => {
        if (!lessonIdStr) return

        async function fetchLesson() {
            try {
                setLoading(true)
                const res = await fetch(`/api/lessons/${lessonIdStr}`)
                if (!res.ok) {
                    if (res.status === 404) throw new Error("Lección no encontrada")
                    throw new Error("Error al cargar la lección")
                }
                const data = await res.json()

                // Map DB steps to Engine format
                const formattedSteps = (data.steps || []).map((step: any) => ({
                    ...step,
                    stepType: step.type, // Map 'type' from DB to 'stepType' for Engine
                    ...(typeof step.data === 'string' ? JSON.parse(step.data) : step.data) // Spread JSONB data
                }))

                setLessonData({ ...data, steps: formattedSteps })
                setProgress(prev => ({ ...prev, totalSteps: formattedSteps.length || 1 }))
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchLesson()
    }, [lessonIdStr])

    // 2. Hide app mobile footer
    useEffect(() => {
        if (typeof document === "undefined") return
        document.documentElement.setAttribute("data-lesson-interactive", "true")
        return () => document.documentElement.removeAttribute("data-lesson-interactive")
    }, [])

    const redirectToCoursesRef = useRef(false)

    const handleComplete = useCallback(async (stars?: number) => {
        if (redirectToCoursesRef.current) return
        redirectToCoursesRef.current = true

        const starsEarned = typeof stars === "number" && stars >= 0 && stars <= 3 ? stars : 0
        const xpEarned = starsEarned * 5

        // Save progress logic
        if (lessonIdStr) {
            if (user) {
                try {
                    // 1. Save to Supabase auth metadata (legacy fallback)
                    const { createClient } = await import("@/lib/supabase/client")
                    const supabase = createClient()
                    const existing = (user.user_metadata?.completedLessons as string[] | undefined) || []
                    const lessonStars = (user.user_metadata?.lessonStars as Record<string, number> | undefined) || {}
                    const completedLessons = existing.includes(lessonIdStr) ? existing : [...existing, lessonIdStr]
                    const newLessonStars = { ...lessonStars, [lessonIdStr]: starsEarned }

                    await supabase.auth.updateUser({
                        data: { ...user.user_metadata, completedLessons, lessonStars: newLessonStars },
                    })
                    await supabase.auth.refreshSession()

                    // 2. Call our API to award XP, bizcoins, and update Prisma progress
                    await fetch("/api/lesson/complete", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ lessonId: lessonIdStr, starsEarned, xpEarned }),
                    })

                    // 3. Sync the global AuthContext state so XP shows up immediately
                    await refreshUser()
                } catch (err) {
                    console.error("Error in completion save:", err)
                }
            } else {
                // Guest mode
                const stored = localStorage.getItem("guestCompletedLessons")
                const existing: string[] = stored ? JSON.parse(stored) : []
                localStorage.setItem("guestCompletedLessons", JSON.stringify(existing.includes(lessonIdStr) ? existing : [...existing, lessonIdStr]))

                const starsStored = localStorage.getItem("guestLessonStars")
                const starsObj: Record<string, number> = starsStored ? JSON.parse(starsStored) : {}
                starsObj[lessonIdStr] = starsEarned
                localStorage.setItem("guestLessonStars", JSON.stringify(starsObj))
            }
        }

        // Helper for redirect (Legacy support: '1' -> 'tema-01')
        const getRedirectUrl = (id: string) => {
            if (!id) return "/courses"
            if (!id.startsWith("tema-") && !isNaN(parseInt(id))) {
                return `/courses/tema-${id.padStart(2, "0")}`
            }
            return `/courses/${id}`
        }

        router.push(getRedirectUrl(topicIdStr))
    }, [lessonIdStr, user, refreshUser, router, topicIdStr])

    const handleExit = () => {
        const getRedirectUrl = (id: string) => {
            if (!id) return "/courses"
            if (!id.startsWith("tema-") && !isNaN(parseInt(id))) {
                return `/courses/tema-${id.padStart(2, "0")}`
            }
            return `/courses/${id}`
        }
        router.push(getRedirectUrl(topicIdStr))
    }

    // Loading State
    if (loading) {
        return (
            <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FBFAF5", gap: 16, flexDirection: "column" }}>
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    style={{ width: 40, height: 40, border: "4px solid #E2E8F0", borderTopColor: "#0B71FE", borderRadius: "50%" }}
                />
                <p style={{ fontWeight: 500, color: "#64748B" }}>Cargando lección...</p>
            </div>
        )
    }

    // Error State
    if (error || !lessonData || !lessonData.steps?.length) {
        return (
            <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, padding: 24, background: "#f1f5f9", }}>
                <p style={{ fontSize: 20, fontWeight: 500, color: "#334155", textAlign: "center" }}>
                    {error || "Esta lección no tiene contenido disponible."}
                </p>
                <button
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
                    style={{ padding: "14px 24px", background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)", color: "white", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 500, cursor: "pointer" }}
                >
                    Volver al tema
                </button>
            </div>
        )
    }

    return (
        <>
            <style>{`
        .lesson-interactive-outer {
          height: 100dvh !important;
          max-height: 100dvh !important;
          min-height: 100dvh !important;
          overflow: hidden !important;
          display: flex;
          flex-direction: column;
          background: #f1f5f9 !important;
          margin-left: 0 !important;
          width: 100% !important;
        }
        .lesson-screen-root, .lesson-container-no-scroll {
          overflow: hidden !important;
          min-height: 0 !important;
          flex: 1 !important;
        }
      `}</style>

            <div className="lesson-interactive-outer">
                {/* Progress Header */}
                <div style={{ flexShrink: 0, minHeight: 90, padding: "12px 16px", display: "flex", justifyContent: "center", alignItems: "center", background: "#f1f5f9", borderBottom: "2px solid #cbd5e1", boxSizing: "border-box" }}>
                    <LessonProgressHeader
                        currentStepIndex={progress.currentStep - 1}
                        totalSteps={progress.totalSteps}
                        streak={progress.streak}
                        stars={progress.stars}
                    />
                </div>

                {/* Engine */}
                <div style={{ flex: 1, minHeight: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                    <LessonEngine
                        lessonSteps={lessonData.steps}
                        onComplete={handleComplete}
                        onExit={handleExit}
                        onProgressChange={setProgress}
                        isRepeat={(user?.user_metadata?.completedLessons as string[] | undefined)?.includes(lessonIdStr)}
                    />
                </div>
            </div>

        </>
    )
}
