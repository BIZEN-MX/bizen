"use client"

import { useEffect, useCallback, useRef, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { LessonEngine, LessonProgressHeader } from "@/components/lessons"
import { motion, AnimatePresence } from "framer-motion"

export default function LessonPage() {
    const router = useRouter()
    const params = useParams()
    const { user } = useAuth()

    const courseIdStr = (params.courseId as string) || "1"
    const lessonIdStr = params.lessonId as string
    const unitIdStr = params.unitId as string

    const [lessonData, setLessonData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [showExitDialog, setShowExitDialog] = useState(false)
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
        document.body.setAttribute("data-lesson-interactive", "true")
        return () => document.body.removeAttribute("data-lesson-interactive")
    }, [])

    const redirectToCoursesRef = useRef(false)

    const handleComplete = useCallback((stars?: number) => {
        if (redirectToCoursesRef.current) return
        redirectToCoursesRef.current = true

        const starsEarned = typeof stars === "number" && stars >= 0 && stars <= 3 ? stars : 2

        // Save progress logic (same as interactive page)
        if (lessonIdStr) {
            if (user) {
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

        // Redirect to course page
        const courseNum = courseIdStr.replace(/^course-/, "") || "1"
        router.replace(`/courses/${courseNum}`)
    }, [lessonIdStr, user, router, courseIdStr])

    const handleExit = () => setShowExitDialog(true)
    const confirmExitLesson = () => {
        setShowExitDialog(false)
        router.push(`/courses/${courseIdStr.replace(/^course-/, "") || "1"}`)
    }
    const cancelExitLesson = () => setShowExitDialog(false)

    // Loading State
    if (loading) {
        return (
            <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FBFAF5", gap: 16, flexDirection: "column" }}>
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    style={{ width: 40, height: 40, border: "4px solid #E2E8F0", borderTopColor: "#0B71FE", borderRadius: "50%" }}
                />
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, color: "#64748B" }}>Cargando lección...</p>
            </div>
        )
    }

    // Error State
    if (error || !lessonData || !lessonData.steps?.length) {
        return (
            <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, padding: 24, background: "#f1f5f9", fontFamily: "'Montserrat', sans-serif" }}>
                <p style={{ fontSize: 20, fontWeight: 600, color: "#334155", textAlign: "center" }}>
                    {error || "Esta lección no tiene contenido disponible."}
                </p>
                <button
                    onClick={() => router.push(`/courses/${courseIdStr.replace(/^course-/, "") || "1"}`)}
                    style={{ padding: "14px 24px", background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)", color: "white", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: "pointer" }}
                >
                    Volver al curso
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
                    />
                </div>
            </div>

            {/* Exit Dialog */}
            <AnimatePresence>
                {showExitDialog && (
                    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0, 0, 0, 0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100, padding: 20, fontFamily: "'Montserrat', sans-serif" }}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            style={{ background: "white", borderRadius: 16, padding: "32px", maxWidth: 450, width: "100%", boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)" }}
                        >
                            <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 16, background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                ¿Deseas salir?
                            </div>
                            <p style={{ fontSize: 16, color: "#374151", lineHeight: 1.6, marginBottom: 24 }}>
                                Si sales ahora, perderás todo el progreso de esta lección. ¡Estás haciendo un gran trabajo, te animamos a terminarla!
                            </p>
                            <div style={{ display: "flex", gap: 12, flexDirection: "column" }}>
                                <button onClick={cancelExitLesson} style={{ padding: "14px 24px", background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)", color: "white", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 12px rgba(11, 113, 254, 0.3)" }}>
                                    Continuar con la lección
                                </button>
                                <button onClick={confirmExitLesson} style={{ padding: "14px 24px", background: "white", color: "#DC2626", border: "1px solid rgba(220, 38, 38, 0.3)", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
                                    Salir de la lección
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}
