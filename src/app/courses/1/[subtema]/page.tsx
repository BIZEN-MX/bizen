"use client"

import React, { useMemo, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import Button from "@/components/ui/button"
import { TEMA1_SUBTEMAS } from "../../tema1-data"
import type { Tema1Lesson } from "../../tema1-data"

const LEVEL_COLORS: Record<string, { bg: string; text: string }> = {
  Básico: { bg: "#dcfce7", text: "#166534" },
  Intermedio: { bg: "#fef3c7", text: "#92400e" },
  Avanzado: { bg: "#ede9fe", text: "#5b21b6" },
}

export default function Tema1SubtemaPage() {
  const router = useRouter()
  const params = useParams()
  const { user, loading } = useAuth()
  const subtemaIndex = useMemo(() => {
    const n = Number(params?.subtema)
    return Number.isFinite(n) && n >= 1 && n <= 5 ? n - 1 : null
  }, [params?.subtema])

  const [lessonModal, setLessonModal] = useState<Tema1Lesson | null>(null)

  const subtema = subtemaIndex != null ? TEMA1_SUBTEMAS[subtemaIndex] : null

  React.useEffect(() => {
    if (!loading && !user) {
      window.open("/login", "_blank")
    }
  }, [loading, user])

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

  if (subtemaIndex == null || !subtema) {
    return (
      <div style={{ padding: 24, fontFamily: "'Montserrat', sans-serif", maxWidth: 800, margin: "0 auto" }}>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/courses/1")}
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
        <p style={{ marginTop: 16 }}>Subtema no encontrado.</p>
      </div>
    )
  }

  const unitTitle = subtema.title

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
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
          paddingLeft: 16,
          paddingRight: 16,
          fontFamily: "'Montserrat', sans-serif",
          background: "transparent",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          boxSizing: "border-box",
          width: "100%",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 800,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          {/* Regresar button */}
          <div style={{ marginBottom: 0 }}>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/courses/1")}
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

          <h1
            style={{
              fontSize: "clamp(20px, 3.5vw, 26px)",
              fontWeight: 800,
              color: "#1e293b",
              lineHeight: 1.2,
            }}
          >
            {unitTitle}
          </h1>

          {/* Lesson cards - same style as course lesson cards (horizontal scroll) */}
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
            {subtema.lessons.map((lesson, lessonIdx) => {
              const colors = LEVEL_COLORS[lesson.level]
              return (
                <div
                  key={lesson.slug}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      setLessonModal(lesson)
                    }
                  }}
                  onClick={() => setLessonModal(lesson)}
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
                        fontSize: 15,
                        fontWeight: 600,
                        color: "#6B7280",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        width: "100%",
                      }}
                    >
                      {unitTitle}
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
                    <div
                      style={{
                        marginTop: 8,
                        flexShrink: 0,
                      }}
                    >
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
      </main>

      {/* Lesson modal - same as courses page: Iniciar opens lesson, Regresar closes */}
      {lessonModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="tema1-lesson-modal-title"
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
            id="tema1-lesson-modal-title"
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
            <div style={{ fontSize: 18, fontWeight: 600, color: "#6B7280" }}>{unitTitle}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#111", lineHeight: 1.3 }}>{lessonModal.title}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Button
                onClick={() => {
                  // Placeholder: open first existing lesson until Tema 1 learn routes exist
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
          .courses-main-content { padding-left: 220px !important; }
        }
        @media (min-width: 1161px) {
          .courses-main-content { padding-left: 280px !important; }
        }
        .lesson-square-card:hover {
          border-color: rgba(59, 130, 246, 0.6) !important;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
        }
      `}</style>
    </div>
  )
}

