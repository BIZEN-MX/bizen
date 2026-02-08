"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import Button from "@/components/ui/button"
import { TEMA11_SUBTEMAS } from "../tema11-data"
import type { Tema11Lesson } from "../tema11-data"

const LEVEL_COLORS: Record<string, { bg: string; text: string }> = {
  Básico: { bg: "#dcfce7", text: "#166534" },
  Intermedio: { bg: "#fef3c7", text: "#92400e" },
  Avanzado: { bg: "#ede9fe", text: "#5b21b6" },
}

const SUBTEMA_BAR_GRADIENTS = [
  "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
  "linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)",
  "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
  "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
  "linear-gradient(135deg, #1D4ED8 0%, #1E40AF 100%)",
  "linear-gradient(135deg, #1E40AF 0%, #1E3A8A 100%)",
]

const SUBTEMA_BAR_SHADOWS = [
  "0 4px 14px rgba(59, 130, 246, 0.35)",
  "0 4px 14px rgba(14, 165, 233, 0.35)",
  "0 4px 14px rgba(99, 102, 241, 0.35)",
  "0 4px 14px rgba(37, 99, 235, 0.35)",
  "0 4px 14px rgba(29, 78, 216, 0.35)",
  "0 4px 14px rgba(30, 64, 175, 0.35)",
]

export default function Tema11Page() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [lessonModal, setLessonModal] = useState<Tema11Lesson | null>(null)
  const [lessonModalUnitTitle, setLessonModalUnitTitle] = useState("")

  React.useEffect(() => {
    if (!loading && !user) {
      window.open("/login", "_blank")
    }
  }, [loading, user])

  const openLesson = (lesson: Tema11Lesson, unitTitle: string) => {
    setLessonModalUnitTitle(unitTitle)
    setLessonModal(lesson)
  }

  if (loading || !user) {
    return (
      <div
        style={{
          minHeight: "50vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Montserrat', sans-serif",
        }}
      />
    )
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "100%",
        flex: 1,
        background: "#ffffff",
        boxSizing: "border-box",
      }}
    >
      <main
        className="courses-main-content"
        style={{
          flex: 1,
          paddingTop: "clamp(8px, 1.5vw, 16px)",
          paddingBottom: "clamp(40px, 8vw, 80px)",
          paddingLeft: "16px",
          paddingRight: "16px",
          fontFamily: "'Montserrat', sans-serif",
          background: "transparent",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          marginBottom: 0,
          boxSizing: "border-box",
          width: "100%",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "800px",
            margin: "0 auto",
            position: "relative",
            zIndex: 1,
            padding: "0",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            gap: 0,
          }}
        >
          <div style={{ marginBottom: 16 }}>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/courses")}
              style={{
                fontFamily: "inherit",
                fontSize: 15,
                fontWeight: 600,
                padding: "10px 18px",
                border: "2px solid #E5E7EB",
                color: "#374151",
                background: "#fff",
                borderRadius: 10,
                cursor: "pointer",
              }}
            >
              Regresar
            </Button>
          </div>

          {TEMA11_SUBTEMAS.map((sub, subIdx) => {
            const barBg = SUBTEMA_BAR_GRADIENTS[subIdx % SUBTEMA_BAR_GRADIENTS.length]
            const barShadow = SUBTEMA_BAR_SHADOWS[subIdx % SUBTEMA_BAR_SHADOWS.length]
            return (
              <div
                key={subIdx}
                id={`tema11-subtema-${subIdx + 1}`}
                style={{
                  marginBottom: "clamp(32px, 6vw, 48px)",
                  marginTop: 0,
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "stretch",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    padding: "clamp(16px, 3vw, 24px)",
                    paddingBottom: 14,
                    background: barBg,
                    borderRadius: 12,
                    boxShadow: barShadow,
                    border: "2px solid rgba(255,255,255,0.3)",
                    marginBottom: 16,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 10 }}>
                    <div
                      style={{
                        width: "clamp(48px, 10vw, 64px)",
                        height: "clamp(48px, 10vw, 64px)",
                        minWidth: "clamp(48px, 10vw, 64px)",
                        minHeight: "clamp(48px, 10vw, 64px)",
                        borderRadius: 10,
                        background: "rgba(255,255,255,0.25)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "clamp(18px, 4vw, 24px)",
                        fontWeight: 800,
                        color: "#fff",
                      }}
                    >
                      {subIdx + 1}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "clamp(16px, 3.5vw, 20px)", fontWeight: 800, color: "#fff", lineHeight: 1.2 }}>
                        {sub.title}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: 8,
                      borderRadius: 4,
                      background: "rgba(255,255,255,0.35)",
                      overflow: "hidden",
                    }}
                  >
                    <div style={{ width: "0%", height: "100%", borderRadius: 4, background: "rgba(255,255,255,0.95)", transition: "width 0.3s ease" }} />
                  </div>
                </div>

                <div
                  className="lessons-scroll-container"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 16,
                    overflowX: "auto",
                    overflowY: "hidden",
                    paddingBottom: 8,
                    paddingTop: 4,
                    scrollSnapType: "x mandatory",
                    WebkitOverflowScrolling: "touch",
                    scrollbarWidth: "thin",
                  }}
                >
                  {sub.lessons.map((lesson, lessonIdx) => {
                    const colors = LEVEL_COLORS[lesson.level]
                    return (
                      <div
                        key={lesson.slug}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault()
                            openLesson(lesson, sub.title)
                          }
                        }}
                        onClick={() => openLesson(lesson, sub.title)}
                        className="lesson-square-card"
                        style={{
                          width: 260,
                          minWidth: 260,
                          aspectRatio: "1",
                          flexShrink: 0,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: 20,
                          background: "#F0F9FF",
                          borderRadius: 20,
                          border: "2px solid rgba(59, 130, 246, 0.3)",
                          boxSizing: "border-box",
                          scrollSnapAlign: "start",
                          cursor: "pointer",
                        }}
                      >
                        <div
                          style={{
                            textAlign: "center",
                            width: "100%",
                            minWidth: 0,
                            flex: "1 1 auto",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-start",
                            overflow: "hidden",
                            gap: 4,
                          }}
                        >
                          <div
                            style={{
                              width: 44,
                              height: 44,
                              borderRadius: 14,
                              background: "#3B82F6",
                              color: "white",
                              fontSize: 20,
                              fontWeight: 800,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              margin: "0 auto 6px",
                              flexShrink: 0,
                            }}
                          >
                            {lessonIdx + 1}
                          </div>
                          <div
                            style={{
                              fontSize: 17,
                              fontWeight: 700,
                              color: "#111",
                              lineHeight: 1.3,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "-webkit-box",
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: "vertical",
                              width: "100%",
                              wordBreak: "break-word",
                            }}
                          >
                            {lesson.title}
                          </div>
                          <div style={{ marginTop: 8, flexShrink: 0 }}>
                            <span
                              style={{
                                fontSize: 11,
                                fontWeight: 700,
                                padding: "4px 8px",
                                borderRadius: 6,
                                background: colors.bg,
                                color: colors.text,
                              }}
                            >
                              {lesson.level}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </main>

      {lessonModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="tema11-lesson-modal-title"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            background: "rgba(0,0,0,0.5)",
            boxSizing: "border-box",
          }}
          onClick={() => setLessonModal(null)}
        >
          <div
            id="tema11-lesson-modal-title"
            style={{
              background: "white",
              borderRadius: 20,
              padding: "24px 28px",
              maxWidth: 360,
              width: "100%",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: 18, fontWeight: 600, color: "#6B7280" }}>{lessonModalUnitTitle}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#111", lineHeight: 1.3 }}>{lessonModal.title}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Button
                onClick={() => {
                  router.push("/learn/course-1/unit-1/l3-fisico-vs-digital")
                  setLessonModal(null)
                }}
                style={{
                  width: "100%",
                  fontSize: 17,
                  fontWeight: 700,
                  padding: "14px 20px",
                  background: "#3B82F6",
                  color: "white",
                  border: "none",
                  borderRadius: 12,
                  cursor: "pointer",
                }}
              >
                Iniciar
              </Button>
              <Button
                variant="outline"
                onClick={() => setLessonModal(null)}
                style={{
                  width: "100%",
                  fontSize: 16,
                  fontWeight: 600,
                  padding: "12px 20px",
                  background: "transparent",
                  color: "#6B7280",
                  border: "2px solid #E5E7EB",
                  borderRadius: 12,
                  cursor: "pointer",
                }}
              >
                Regresar
              </Button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) and (max-width: 1160px) {
          .courses-main-content { padding-left: 220px !important; padding-right: 16px !important; display: flex !important; justify-content: center !important; }
          .courses-main-content > div { max-width: calc(100vw - 220px - 32px) !important; width: 100% !important; margin: 0 auto !important; }
        }
        @media (min-width: 1161px) {
          .courses-main-content { padding-left: 280px !important; padding-right: 16px !important; display: flex !important; justify-content: center !important; }
          .courses-main-content > div { max-width: calc(100vw - 280px - 48px) !important; width: 100% !important; margin: 0 auto !important; }
        }
        .lesson-square-card:hover {
          border-color: rgba(59, 130, 246, 0.6) !important;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
        }
      `}</style>
    </div>
  )
}
