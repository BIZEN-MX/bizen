"use client"

import { useEffect, useCallback, useRef, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { LessonEngine, LessonProgressHeader } from "@/components/lessons"
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
  const { courseId, lessonId } = params
  const lessonIdStr = lessonId as string
  const courseIdStr = (courseId as string) || "1"

  const [showExitDialog, setShowExitDialog] = useState(false)

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

  const redirectToCoursesRef = useRef(false)
  const handleComplete = useCallback((stars?: number) => {
    if (redirectToCoursesRef.current) return
    redirectToCoursesRef.current = true

    const starsEarned = typeof stars === "number" && stars >= 0 && stars <= 3 ? stars : 2
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
    // Redirect to lessons menu (course page) after finishing the lesson
    const courseNum = courseIdStr.replace(/^course-/, "") || "1"
    const coursePagePath = `/courses/${courseNum}`
    if (typeof window !== "undefined") {
      window.location.href = coursePagePath
    } else {
      router.replace(coursePagePath)
    }
  }, [lessonIdStr, user, router, courseIdStr])

  const handleExit = () => {
    setShowExitDialog(true)
  }

  const confirmExitLesson = () => {
    setShowExitDialog(false)
    router.push("/courses")
  }

  const cancelExitLesson = () => {
    setShowExitDialog(false)
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
          background: #f1f5f9 !important;
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
          background: #f1f5f9;
          border-top: 2px solid #cbd5e1;
          padding-top: 16px;
          padding-bottom: max(16px, env(safe-area-inset-bottom));
        }
      `}</style>
      <div className="lesson-interactive-outer" style={{ height: "100dvh", maxHeight: "100dvh", overflow: "hidden", display: "flex", flexDirection: "column", background: "#f1f5f9" }}>
        {/* Progress bar - FIRST element, always visible at top */}
        <div
          style={{
            flexShrink: 0,
            minHeight: 90,
            padding: "12px 16px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#f1f5f9",
            borderBottom: "2px solid #cbd5e1",
            boxSizing: "border-box",
          }}
        >
          <LessonProgressHeader
            currentStepIndex={progress.currentStep - 1}
            totalSteps={progress.totalSteps}
            streak={progress.streak}
            stars={progress.stars}
          />
        </div>
        <LessonEngine
          lessonSteps={lessonSteps}
          onComplete={handleComplete}
          onExit={handleExit}
          onProgressChange={setProgress}
        />
      </div>

      {/* Exit confirmation – same as sidebar when leaving lesson via "Courses" */}
      {showExitDialog && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1100,
            padding: 20,
            fontFamily: "'Montserrat', sans-serif",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: 16,
              padding: "32px",
              maxWidth: 450,
              width: "100%",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
            }}
          >
            <div
              style={{
                fontSize: 24,
                fontWeight: 800,
                marginBottom: 16,
                background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              ¿Deseas salir?
            </div>
            <p
              style={{
                fontSize: 16,
                color: "#374151",
                lineHeight: 1.6,
                marginBottom: 24,
              }}
            >
              Si sales ahora, perderás todo el progreso de esta lección. ¡Estás haciendo un gran trabajo, te animamos a terminarla!
            </p>
            <div
              style={{
                display: "flex",
                gap: 12,
                flexDirection: "column",
              }}
            >
              <button
                type="button"
                onClick={cancelExitLesson}
                style={{
                  padding: "14px 24px",
                  background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "transform 0.2s ease",
                  boxShadow: "0 4px 12px rgba(11, 113, 254, 0.3)",
                  fontFamily: "'Montserrat', sans-serif",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)" }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)" }}
              >
                Continuar con la lección
              </button>
              <button
                type="button"
                onClick={confirmExitLesson}
                style={{
                  padding: "14px 24px",
                  background: "white",
                  color: "#DC2626",
                  border: "1px solid rgba(220, 38, 38, 0.3)",
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontFamily: "'Montserrat', sans-serif",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#FEF2F2"
                  e.currentTarget.style.transform = "scale(1.02)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "white"
                  e.currentTarget.style.transform = "scale(1)"
                }}
              >
                Salir de la lección
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
