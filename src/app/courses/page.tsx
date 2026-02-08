"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

interface Lesson {
  id: string
  title: string
  unitTitle: string
  order: number
  courseId: string
  [key: string]: unknown
}

interface Course {
  id: string
  title: string
  description: string
  level: string
  order: number
  isLocked: boolean
  isCompleted: boolean
  lessons: Lesson[]
}

export default function CoursesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  // Redirect unauthenticated users
  useEffect(() => {
    if (!loading && !user) {
      window.open("/login", "_blank")
    }
  }, [loading, user, router])

  useEffect(() => {
    // Only fetch data if user is authenticated
    if (loading) return
    if (!user) return

    const fetchCoursesData = async () => {
      try {
        setLoadingData(true)
        // No legacy courses — only 30 temas principales (topic pages)
        setCourses([])
        
      } catch (error) {
        console.error("Error fetching courses:", error)
      } finally {
        setLoadingData(false)
      }
    }

    fetchCoursesData()
  }, [user, loading, router, refreshKey])

  // Refetch when user returns to tab so progress bar reflects latest completions
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "visible" && user && !loading) {
        setRefreshKey((k) => k + 1)
      }
    }
    document.addEventListener("visibilitychange", onVisibility)
    return () => document.removeEventListener("visibilitychange", onVisibility)
  }, [user, loading])

  // Set body and html background for this page
  useEffect(() => {
    const htmlEl = document.documentElement
    const bodyEl = document.body
    
    htmlEl.style.background = "#ffffff"
    htmlEl.style.backgroundAttachment = "scroll"
    bodyEl.style.background = "#ffffff"
    bodyEl.style.backgroundAttachment = "scroll"
    
    return () => {
      htmlEl.style.background = ""
      htmlEl.style.backgroundAttachment = ""
      bodyEl.style.background = "#fff"
      bodyEl.style.backgroundAttachment = "scroll"
    }
  }, [])


  // Show loading or redirect if not authenticated - minimal placeholder in usable content area
  if (loading || loadingData || !user) {
    return (
      <div
        style={{
          minHeight: "50vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Montserrat', sans-serif",
          paddingLeft: 16,
          paddingRight: 16,
          marginLeft: 0,
          boxSizing: "border-box",
        }}
        className="courses-loading-placeholder"
      >
        <style>{`
          @media (min-width: 768px) and (max-width: 1160px) {
            .courses-loading-placeholder { margin-left: 220px; }
          }
          @media (min-width: 1161px) {
            .courses-loading-placeholder { margin-left: 280px; }
          }
        `}</style>
        {/* No spinner - blank or redirect handles it */}
      </div>
    )
  }

  return (
      <div style={{
        position: "relative",
        top: 0,
        left: 0,
        width: "100%",
        maxWidth: "100%",
        flex: 1,
        background: "#ffffff",
        overflow: "visible",
        boxSizing: "border-box",
        paddingBottom: 0,
        marginBottom: 0,
        margin: 0,
        padding: 0
      }}>
      {/* Decorative Orbs */}
        <div style={{
        position: "fixed",
        top: "15%",
        right: "8%",
        width: "400px",
        height: "400px",
        background: "radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(60px)",
        pointerEvents: "none"
        }} />
        <div style={{
        position: "fixed",
        bottom: "15%",
        left: "8%",
        width: "450px",
        height: "450px",
        background: "radial-gradient(circle, rgba(34, 197, 94, 0.15) 0%, transparent 70%)",
          borderRadius: "50%",
        filter: "blur(70px)",
        pointerEvents: "none"
        }} />
        <div style={{
        position: "fixed",
          top: "40%",
          left: "50%",
        width: "500px",
        height: "500px",
        background: "radial-gradient(circle, rgba(147, 197, 253, 0.12) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(80px)",
        pointerEvents: "none"
      }} />

      {/* Hide MobileBottomNav on courses page */}
      <style>{`
        @media (max-width: 767px) {
          [data-mobile-bottom-nav] {
            display: none !important;
          }
        }
      `}</style>

    <main 
      data-bizen-tour="courses"
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
        width: "100%"
      }} className="courses-main-content">
        {/* Same width as course bars (800px) - streak right-aligned, then course list */}
            <div style={{
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
          gap: 0
        }}>
          {/* 30 main topics */}
          <section
            style={{
              width: "100%",
              marginBottom: "clamp(32px, 6vw, 48px)",
            }}
            aria-label="Temas principales"
          >
            <h2
              style={{
                fontSize: "clamp(20px, 4vw, 26px)",
                fontWeight: 800,
                color: "#1e293b",
                marginBottom: "clamp(16px, 3vw, 24px)",
                lineHeight: 1.2,
              }}
            >
              Temas principales
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 260px), 1fr))",
                gap: "clamp(10px, 2vw, 14px)",
              }}
            >
              {/* Tema 1: click goes to /courses/1 (separate screen with 5 subtopics) */}
              <button
                type="button"
                onClick={() => router.push("/courses/1")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "clamp(12px, 2.5vw, 16px) clamp(14px, 2.5vw, 18px)",
                  background: "#f8fafc",
                  border: "2px solid #e2e8f0",
                  borderRadius: 12,
                  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                  width: "100%",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "inherit",
                }}
                className="course-topic-item"
              >
                <span
                  style={{
                    flexShrink: 0,
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  1
                </span>
                <span
                  style={{
                    flex: 1,
                    fontSize: "clamp(14px, 2.5vw, 16px)",
                    fontWeight: 600,
                    color: "#334155",
                    lineHeight: 1.35,
                  }}
                >
                  Mi relación con el dinero
                </span>
                <span style={{ flexShrink: 0, fontSize: 18, color: "#64748b" }} aria-hidden>→</span>
              </button>
              {/* Tema 2: click goes to /courses/2 */}
              <button
                type="button"
                onClick={() => router.push("/courses/2")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "clamp(12px, 2.5vw, 16px) clamp(14px, 2.5vw, 18px)",
                  background: "#f8fafc",
                  border: "2px solid #e2e8f0",
                  borderRadius: 12,
                  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                  width: "100%",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "inherit",
                }}
                className="course-topic-item"
              >
                <span
                  style={{
                    flexShrink: 0,
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  2
                </span>
                <span
                  style={{
                    flex: 1,
                    fontSize: "clamp(14px, 2.5vw, 16px)",
                    fontWeight: 600,
                    color: "#334155",
                    lineHeight: 1.35,
                  }}
                >
                  Qué es el dinero y por qué existe
                </span>
                <span style={{ flexShrink: 0, fontSize: 18, color: "#64748b" }} aria-hidden>→</span>
              </button>
              {/* Tema 3: click goes to /courses/3 */}
              <button
                type="button"
                onClick={() => router.push("/courses/3")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "clamp(12px, 2.5vw, 16px) clamp(14px, 2.5vw, 18px)",
                  background: "#f8fafc",
                  border: "2px solid #e2e8f0",
                  borderRadius: 12,
                  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                  width: "100%",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "inherit",
                }}
                className="course-topic-item"
              >
                <span
                  style={{
                    flexShrink: 0,
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  3
                </span>
                <span
                  style={{
                    flex: 1,
                    fontSize: "clamp(14px, 2.5vw, 16px)",
                    fontWeight: 600,
                    color: "#334155",
                    lineHeight: 1.35,
                  }}
                >
                  Cómo entra y sale el dinero de mi vida
                </span>
                <span style={{ flexShrink: 0, fontSize: 18, color: "#64748b" }} aria-hidden>→</span>
              </button>
              {/* Tema 4: click goes to /courses/4 */}
              <button
                type="button"
                onClick={() => router.push("/courses/4")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "clamp(12px, 2.5vw, 16px) clamp(14px, 2.5vw, 18px)",
                  background: "#f8fafc",
                  border: "2px solid #e2e8f0",
                  borderRadius: 12,
                  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                  width: "100%",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "inherit",
                }}
                className="course-topic-item"
              >
                <span
                  style={{
                    flexShrink: 0,
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  4
                </span>
                <span
                  style={{
                    flex: 1,
                    fontSize: "clamp(14px, 2.5vw, 16px)",
                    fontWeight: 600,
                    color: "#334155",
                    lineHeight: 1.35,
                  }}
                >
                  Presupuesto: tomar control sin ahogarme
                </span>
                <span style={{ flexShrink: 0, fontSize: 18, color: "#64748b" }} aria-hidden>→</span>
              </button>
              {/* Tema 5: click goes to /courses/5 */}
              <button
                type="button"
                onClick={() => router.push("/courses/5")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "clamp(12px, 2.5vw, 16px) clamp(14px, 2.5vw, 18px)",
                  background: "#f8fafc",
                  border: "2px solid #e2e8f0",
                  borderRadius: 12,
                  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                  width: "100%",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "inherit",
                }}
                className="course-topic-item"
              >
                <span
                  style={{
                    flexShrink: 0,
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  5
                </span>
                <span
                  style={{
                    flex: 1,
                    fontSize: "clamp(14px, 2.5vw, 16px)",
                    fontWeight: 600,
                    color: "#334155",
                    lineHeight: 1.35,
                  }}
                >
                  Ahorro con propósito
                </span>
                <span style={{ flexShrink: 0, fontSize: 18, color: "#64748b" }} aria-hidden>→</span>
              </button>
              {/* Tema 6: click goes to /courses/6 */}
              <button
                type="button"
                onClick={() => router.push("/courses/6")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "clamp(12px, 2.5vw, 16px) clamp(14px, 2.5vw, 18px)",
                  background: "#f8fafc",
                  border: "2px solid #e2e8f0",
                  borderRadius: 12,
                  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                  width: "100%",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "inherit",
                }}
                className="course-topic-item"
              >
                <span
                  style={{
                    flexShrink: 0,
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  6
                </span>
                <span
                  style={{
                    flex: 1,
                    fontSize: "clamp(14px, 2.5vw, 16px)",
                    fontWeight: 600,
                    color: "#334155",
                    lineHeight: 1.35,
                  }}
                >
                  Deuda: cuándo ayuda y cuándo destruye
                </span>
                <span style={{ flexShrink: 0, fontSize: 18, color: "#64748b" }} aria-hidden>→</span>
              </button>
              {/* Tema 7: click goes to /courses/7 */}
              <button
                type="button"
                onClick={() => router.push("/courses/7")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "clamp(12px, 2.5vw, 16px) clamp(14px, 2.5vw, 18px)",
                  background: "#f8fafc",
                  border: "2px solid #e2e8f0",
                  borderRadius: 12,
                  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                  width: "100%",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "inherit",
                }}
                className="course-topic-item"
              >
                <span
                  style={{
                    flexShrink: 0,
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  7
                </span>
                <span
                  style={{
                    flex: 1,
                    fontSize: "clamp(14px, 2.5vw, 16px)",
                    fontWeight: 600,
                    color: "#334155",
                    lineHeight: 1.35,
                  }}
                >
                  Sistema financiero explicado fácil
                </span>
                <span style={{ flexShrink: 0, fontSize: 18, color: "#64748b" }} aria-hidden>→</span>
              </button>
              {/* Tema 8: click goes to /courses/8 */}
              <button
                type="button"
                onClick={() => router.push("/courses/8")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "clamp(12px, 2.5vw, 16px) clamp(14px, 2.5vw, 18px)",
                  background: "#f8fafc",
                  border: "2px solid #e2e8f0",
                  borderRadius: 12,
                  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                  width: "100%",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "inherit",
                }}
                className="course-topic-item"
              >
                <span
                  style={{
                    flexShrink: 0,
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  8
                </span>
                <span
                  style={{
                    flex: 1,
                    fontSize: "clamp(14px, 2.5vw, 16px)",
                    fontWeight: 600,
                    color: "#334155",
                    lineHeight: 1.35,
                  }}
                >
                  Impuestos en la vida real
                </span>
                <span style={{ flexShrink: 0, fontSize: 18, color: "#64748b" }} aria-hidden>→</span>
              </button>
              {/* Tema 9: click goes to /courses/9 */}
              <button
                type="button"
                onClick={() => router.push("/courses/9")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "clamp(12px, 2.5vw, 16px) clamp(14px, 2.5vw, 18px)",
                  background: "#f8fafc",
                  border: "2px solid #e2e8f0",
                  borderRadius: 12,
                  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                  width: "100%",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "inherit",
                }}
                className="course-topic-item"
              >
                <span
                  style={{
                    flexShrink: 0,
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  9
                </span>
                <span
                  style={{
                    flex: 1,
                    fontSize: "clamp(14px, 2.5vw, 16px)",
                    fontWeight: 600,
                    color: "#334155",
                    lineHeight: 1.35,
                  }}
                >
                  Inflación y poder adquisitivo
                </span>
                <span style={{ flexShrink: 0, fontSize: 18, color: "#64748b" }} aria-hidden>→</span>
              </button>
              {/* Tema 10: click goes to /courses/10 */}
              <button
                type="button"
                onClick={() => router.push("/courses/10")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "clamp(12px, 2.5vw, 16px) clamp(14px, 2.5vw, 18px)",
                  background: "#f8fafc",
                  border: "2px solid #e2e8f0",
                  borderRadius: 12,
                  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                  width: "100%",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "inherit",
                }}
                className="course-topic-item"
              >
                <span
                  style={{
                    flexShrink: 0,
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  10
                </span>
                <span
                  style={{
                    flex: 1,
                    fontSize: "clamp(14px, 2.5vw, 16px)",
                    fontWeight: 600,
                    color: "#334155",
                    lineHeight: 1.35,
                  }}
                >
                  Introducción a la inversión
                </span>
                <span style={{ flexShrink: 0, fontSize: 18, color: "#64748b" }} aria-hidden>→</span>
              </button>
              {/* Tema 11: click goes to /courses/11 */}
              <button
                type="button"
                onClick={() => router.push("/courses/11")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "clamp(12px, 2.5vw, 16px) clamp(14px, 2.5vw, 18px)",
                  background: "#f8fafc",
                  border: "2px solid #e2e8f0",
                  borderRadius: 12,
                  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                  width: "100%",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "inherit",
                }}
                className="course-topic-item"
              >
                <span
                  style={{
                    flexShrink: 0,
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  11
                </span>
                <span
                  style={{
                    flex: 1,
                    fontSize: "clamp(14px, 2.5vw, 16px)",
                    fontWeight: 600,
                    color: "#334155",
                    lineHeight: 1.35,
                  }}
                >
                  Instrumentos de inversión básicos
                </span>
                <span style={{ flexShrink: 0, fontSize: 18, color: "#64748b" }} aria-hidden>→</span>
              </button>
              {/* Tema 12: click goes to /courses/12 */}
              <button
                type="button"
                onClick={() => router.push("/courses/12")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "clamp(12px, 2.5vw, 16px) clamp(14px, 2.5vw, 18px)",
                  background: "#f8fafc",
                  border: "2px solid #e2e8f0",
                  borderRadius: 12,
                  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                  width: "100%",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "inherit",
                }}
                className="course-topic-item"
              >
                <span
                  style={{
                    flexShrink: 0,
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  12
                </span>
                <span
                  style={{
                    flex: 1,
                    fontSize: "clamp(14px, 2.5vw, 16px)",
                    fontWeight: 600,
                    color: "#334155",
                    lineHeight: 1.35,
                  }}
                >
                  Psicología del inversionista
                </span>
                <span style={{ flexShrink: 0, fontSize: 18, color: "#64748b" }} aria-hidden>→</span>
              </button>
              {/* Tema 13: click goes to /courses/13 */}
              <button
                type="button"
                onClick={() => router.push("/courses/13")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "clamp(12px, 2.5vw, 16px) clamp(14px, 2.5vw, 18px)",
                  background: "#f8fafc",
                  border: "2px solid #e2e8f0",
                  borderRadius: 12,
                  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                  width: "100%",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "inherit",
                }}
                className="course-topic-item"
              >
                <span
                  style={{
                    flexShrink: 0,
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  13
                </span>
                <span
                  style={{
                    flex: 1,
                    fontSize: "clamp(14px, 2.5vw, 16px)",
                    fontWeight: 600,
                    color: "#334155",
                    lineHeight: 1.35,
                  }}
                >
                  Construcción de patrimonio a largo plazo
                </span>
                <span style={{ flexShrink: 0, fontSize: 18, color: "#64748b" }} aria-hidden>→</span>
              </button>
              {/* Tema 14: click goes to /courses/14 */}
              <button
                type="button"
                onClick={() => router.push("/courses/14")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "clamp(12px, 2.5vw, 16px) clamp(14px, 2.5vw, 18px)",
                  background: "#f8fafc",
                  border: "2px solid #e2e8f0",
                  borderRadius: 12,
                  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                  width: "100%",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "inherit",
                }}
                className="course-topic-item"
              >
                <span
                  style={{
                    flexShrink: 0,
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  14
                </span>
                <span
                  style={{
                    flex: 1,
                    fontSize: "clamp(14px, 2.5vw, 16px)",
                    fontWeight: 600,
                    color: "#334155",
                    lineHeight: 1.35,
                  }}
                >
                  Errores financieros comunes
                </span>
                <span style={{ flexShrink: 0, fontSize: 18, color: "#64748b" }} aria-hidden>→</span>
              </button>
              {/* Tema 15: click goes to /courses/15 */}
              <button
                type="button"
                onClick={() => router.push("/courses/15")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "clamp(12px, 2.5vw, 16px) clamp(14px, 2.5vw, 18px)",
                  background: "#f8fafc",
                  border: "2px solid #e2e8f0",
                  borderRadius: 12,
                  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                  width: "100%",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "inherit",
                }}
                className="course-topic-item"
              >
                <span
                  style={{
                    flexShrink: 0,
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  15
                </span>
                <span
                  style={{
                    flex: 1,
                    fontSize: "clamp(14px, 2.5vw, 16px)",
                    fontWeight: 600,
                    color: "#334155",
                    lineHeight: 1.35,
                  }}
                >
                  Tomar decisiones financieras conscientes
                </span>
                <span style={{ flexShrink: 0, fontSize: 18, color: "#64748b" }} aria-hidden>→</span>
              </button>
              {/* Tema 16: click goes to /courses/16 */}
              <button
                type="button"
                onClick={() => router.push("/courses/16")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "clamp(12px, 2.5vw, 16px) clamp(14px, 2.5vw, 18px)",
                  background: "#f8fafc",
                  border: "2px solid #e2e8f0",
                  borderRadius: 12,
                  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                  width: "100%",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "inherit",
                }}
                className="course-topic-item"
              >
                <span
                  style={{
                    flexShrink: 0,
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  16
                </span>
                <span
                  style={{
                    flex: 1,
                    fontSize: "clamp(14px, 2.5vw, 16px)",
                    fontWeight: 600,
                    color: "#334155",
                    lineHeight: 1.35,
                  }}
                >
                  Mentalidad emprendedora
                </span>
                <span style={{ flexShrink: 0, fontSize: 18, color: "#64748b" }} aria-hidden>→</span>
              </button>
              {/* Tema 17 */}
              <button type="button" onClick={() => router.push("/courses/17")} style={{ display: "flex", alignItems: "center", gap: 12, padding: "clamp(12px, 2.5vw, 16px) clamp(14px, 2.5vw, 18px)", background: "#f8fafc", border: "2px solid #e2e8f0", borderRadius: 12, transition: "border-color 0.2s ease, box-shadow 0.2s ease", width: "100%", cursor: "pointer", textAlign: "left", fontFamily: "inherit" }} className="course-topic-item">
                <span style={{ flexShrink: 0, width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", color: "#fff", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>17</span>
                <span style={{ flex: 1, fontSize: "clamp(14px, 2.5vw, 16px)", fontWeight: 600, color: "#334155", lineHeight: 1.35 }}>Identificar problemas y oportunidades de negocio</span>
                <span style={{ flexShrink: 0, fontSize: 18, color: "#64748b" }} aria-hidden>→</span>
              </button>
              {/* Tema 18 */}
              <button type="button" onClick={() => router.push("/courses/18")} style={{ display: "flex", alignItems: "center", gap: 12, padding: "clamp(12px, 2.5vw, 16px) clamp(14px, 2.5vw, 18px)", background: "#f8fafc", border: "2px solid #e2e8f0", borderRadius: 12, transition: "border-color 0.2s ease, box-shadow 0.2s ease", width: "100%", cursor: "pointer", textAlign: "left", fontFamily: "inherit" }} className="course-topic-item">
                <span style={{ flexShrink: 0, width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", color: "#fff", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>18</span>
                <span style={{ flex: 1, fontSize: "clamp(14px, 2.5vw, 16px)", fontWeight: 600, color: "#334155", lineHeight: 1.35 }}>Validar ideas sin gastar dinero</span>
                <span style={{ flexShrink: 0, fontSize: 18, color: "#64748b" }} aria-hidden>→</span>
              </button>
              {/* Tema 19 */}
              <button type="button" onClick={() => router.push("/courses/19")} style={{ display: "flex", alignItems: "center", gap: 12, padding: "clamp(12px, 2.5vw, 16px) clamp(14px, 2.5vw, 18px)", background: "#f8fafc", border: "2px solid #e2e8f0", borderRadius: 12, transition: "border-color 0.2s ease, box-shadow 0.2s ease", width: "100%", cursor: "pointer", textAlign: "left", fontFamily: "inherit" }} className="course-topic-item">
                <span style={{ flexShrink: 0, width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", color: "#fff", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>19</span>
                <span style={{ flex: 1, fontSize: "clamp(14px, 2.5vw, 16px)", fontWeight: 600, color: "#334155", lineHeight: 1.35 }}>Modelo de negocio explicado simple</span>
                <span style={{ flexShrink: 0, fontSize: 18, color: "#64748b" }} aria-hidden>→</span>
              </button>
              {/* Tema 20 */}
              <button type="button" onClick={() => router.push("/courses/20")} style={{ display: "flex", alignItems: "center", gap: 12, padding: "clamp(12px, 2.5vw, 16px) clamp(14px, 2.5vw, 18px)", background: "#f8fafc", border: "2px solid #e2e8f0", borderRadius: 12, transition: "border-color 0.2s ease, box-shadow 0.2s ease", width: "100%", cursor: "pointer", textAlign: "left", fontFamily: "inherit" }} className="course-topic-item">
                <span style={{ flexShrink: 0, width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", color: "#fff", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>20</span>
                <span style={{ flex: 1, fontSize: "clamp(14px, 2.5vw, 16px)", fontWeight: 600, color: "#334155", lineHeight: 1.35 }}>Ingresos, costos y utilidad en un negocio</span>
                <span style={{ flexShrink: 0, fontSize: 18, color: "#64748b" }} aria-hidden>→</span>
              </button>
              {/* Tema 21 */}
              <button type="button" onClick={() => router.push("/courses/21")} style={{ display: "flex", alignItems: "center", gap: 12, padding: "clamp(12px, 2.5vw, 16px) clamp(14px, 2.5vw, 18px)", background: "#f8fafc", border: "2px solid #e2e8f0", borderRadius: 12, transition: "border-color 0.2s ease, box-shadow 0.2s ease", width: "100%", cursor: "pointer", textAlign: "left", fontFamily: "inherit" }} className="course-topic-item">
                <span style={{ flexShrink: 0, width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", color: "#fff", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>21</span>
                <span style={{ flex: 1, fontSize: "clamp(14px, 2.5vw, 16px)", fontWeight: 600, color: "#334155", lineHeight: 1.35 }}>Flujo de efectivo</span>
                <span style={{ flexShrink: 0, fontSize: 18, color: "#64748b" }} aria-hidden>→</span>
              </button>
              {/* Tema 22 */}
              <button type="button" onClick={() => router.push("/courses/22")} style={{ display: "flex", alignItems: "center", gap: 12, padding: "clamp(12px, 2.5vw, 16px) clamp(14px, 2.5vw, 18px)", background: "#f8fafc", border: "2px solid #e2e8f0", borderRadius: 12, transition: "border-color 0.2s ease, box-shadow 0.2s ease", width: "100%", cursor: "pointer", textAlign: "left", fontFamily: "inherit" }} className="course-topic-item">
                <span style={{ flexShrink: 0, width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", color: "#fff", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>22</span>
                <span style={{ flex: 1, fontSize: "clamp(14px, 2.5vw, 16px)", fontWeight: 600, color: "#334155", lineHeight: 1.35 }}>Precios y valor</span>
                <span style={{ flexShrink: 0, fontSize: 18, color: "#64748b" }} aria-hidden>→</span>
              </button>
              {/* Tema 23 */}
              <button type="button" onClick={() => router.push("/courses/23")} style={{ display: "flex", alignItems: "center", gap: 12, padding: "clamp(12px, 2.5vw, 16px) clamp(14px, 2.5vw, 18px)", background: "#f8fafc", border: "2px solid #e2e8f0", borderRadius: 12, transition: "border-color 0.2s ease, box-shadow 0.2s ease", width: "100%", cursor: "pointer", textAlign: "left", fontFamily: "inherit" }} className="course-topic-item">
                <span style={{ flexShrink: 0, width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", color: "#fff", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>23</span>
                <span style={{ flex: 1, fontSize: "clamp(14px, 2.5vw, 16px)", fontWeight: 600, color: "#334155", lineHeight: 1.35 }}>Contabilidad básica para no contadores</span>
                <span style={{ flexShrink: 0, fontSize: 18, color: "#64748b" }} aria-hidden>→</span>
              </button>
              {/* Tema 24 */}
              <button type="button" onClick={() => router.push("/courses/24")} style={{ display: "flex", alignItems: "center", gap: 12, padding: "clamp(12px, 2.5vw, 16px) clamp(14px, 2.5vw, 18px)", background: "#f8fafc", border: "2px solid #e2e8f0", borderRadius: 12, transition: "border-color 0.2s ease, box-shadow 0.2s ease", width: "100%", cursor: "pointer", textAlign: "left", fontFamily: "inherit" }} className="course-topic-item">
                <span style={{ flexShrink: 0, width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", color: "#fff", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>24</span>
                <span style={{ flex: 1, fontSize: "clamp(14px, 2.5vw, 16px)", fontWeight: 600, color: "#334155", lineHeight: 1.35 }}>Errores comunes al emprender</span>
                <span style={{ flexShrink: 0, fontSize: 18, color: "#64748b" }} aria-hidden>→</span>
              </button>
              {/* Tema 25 */}
              <button type="button" onClick={() => router.push("/courses/25")} style={{ display: "flex", alignItems: "center", gap: 12, padding: "clamp(12px, 2.5vw, 16px) clamp(14px, 2.5vw, 18px)", background: "#f8fafc", border: "2px solid #e2e8f0", borderRadius: 12, transition: "border-color 0.2s ease, box-shadow 0.2s ease", width: "100%", cursor: "pointer", textAlign: "left", fontFamily: "inherit" }} className="course-topic-item">
                <span style={{ flexShrink: 0, width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", color: "#fff", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>25</span>
                <span style={{ flex: 1, fontSize: "clamp(14px, 2.5vw, 16px)", fontWeight: 600, color: "#334155", lineHeight: 1.35 }}>Escalar un negocio</span>
                <span style={{ flexShrink: 0, fontSize: 18, color: "#64748b" }} aria-hidden>→</span>
              </button>
              {/* Tema 26 */}
              <button type="button" onClick={() => router.push("/courses/26")} style={{ display: "flex", alignItems: "center", gap: 12, padding: "clamp(12px, 2.5vw, 16px) clamp(14px, 2.5vw, 18px)", background: "#f8fafc", border: "2px solid #e2e8f0", borderRadius: 12, transition: "border-color 0.2s ease, box-shadow 0.2s ease", width: "100%", cursor: "pointer", textAlign: "left", fontFamily: "inherit" }} className="course-topic-item">
                <span style={{ flexShrink: 0, width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", color: "#fff", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>26</span>
                <span style={{ flex: 1, fontSize: "clamp(14px, 2.5vw, 16px)", fontWeight: 600, color: "#334155", lineHeight: 1.35 }}>Dinero y estilo de vida</span>
                <span style={{ flexShrink: 0, fontSize: 18, color: "#64748b" }} aria-hidden>→</span>
              </button>
              {/* Tema 27 */}
              <button type="button" onClick={() => router.push("/courses/27")} style={{ display: "flex", alignItems: "center", gap: 12, padding: "clamp(12px, 2.5vw, 16px) clamp(14px, 2.5vw, 18px)", background: "#f8fafc", border: "2px solid #e2e8f0", borderRadius: 12, transition: "border-color 0.2s ease, box-shadow 0.2s ease", width: "100%", cursor: "pointer", textAlign: "left", fontFamily: "inherit" }} className="course-topic-item">
                <span style={{ flexShrink: 0, width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", color: "#fff", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>27</span>
                <span style={{ flex: 1, fontSize: "clamp(14px, 2.5vw, 16px)", fontWeight: 600, color: "#334155", lineHeight: 1.35 }}>Dinero y decisiones importantes</span>
                <span style={{ flexShrink: 0, fontSize: 18, color: "#64748b" }} aria-hidden>→</span>
              </button>
              {/* Tema 28 */}
              <button type="button" onClick={() => router.push("/courses/28")} style={{ display: "flex", alignItems: "center", gap: 12, padding: "clamp(12px, 2.5vw, 16px) clamp(14px, 2.5vw, 18px)", background: "#f8fafc", border: "2px solid #e2e8f0", borderRadius: 12, transition: "border-color 0.2s ease, box-shadow 0.2s ease", width: "100%", cursor: "pointer", textAlign: "left", fontFamily: "inherit" }} className="course-topic-item">
                <span style={{ flexShrink: 0, width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", color: "#fff", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>28</span>
                <span style={{ flex: 1, fontSize: "clamp(14px, 2.5vw, 16px)", fontWeight: 600, color: "#334155", lineHeight: 1.35 }}>Dinero en crisis</span>
                <span style={{ flexShrink: 0, fontSize: 18, color: "#64748b" }} aria-hidden>→</span>
              </button>
              {/* Tema 29 */}
              <button type="button" onClick={() => router.push("/courses/29")} style={{ display: "flex", alignItems: "center", gap: 12, padding: "clamp(12px, 2.5vw, 16px) clamp(14px, 2.5vw, 18px)", background: "#f8fafc", border: "2px solid #e2e8f0", borderRadius: 12, transition: "border-color 0.2s ease, box-shadow 0.2s ease", width: "100%", cursor: "pointer", textAlign: "left", fontFamily: "inherit" }} className="course-topic-item">
                <span style={{ flexShrink: 0, width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", color: "#fff", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>29</span>
                <span style={{ flex: 1, fontSize: "clamp(14px, 2.5vw, 16px)", fontWeight: 600, color: "#334155", lineHeight: 1.35 }}>Dinero, estrés y bienestar personal</span>
                <span style={{ flexShrink: 0, fontSize: 18, color: "#64748b" }} aria-hidden>→</span>
              </button>
              {/* Tema 30 */}
              <button type="button" onClick={() => router.push("/courses/30")} style={{ display: "flex", alignItems: "center", gap: 12, padding: "clamp(12px, 2.5vw, 16px) clamp(14px, 2.5vw, 18px)", background: "#f8fafc", border: "2px solid #e2e8f0", borderRadius: 12, transition: "border-color 0.2s ease, box-shadow 0.2s ease", width: "100%", cursor: "pointer", textAlign: "left", fontFamily: "inherit" }} className="course-topic-item">
                <span style={{ flexShrink: 0, width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", color: "#fff", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>30</span>
                <span style={{ flex: 1, fontSize: "clamp(14px, 2.5vw, 16px)", fontWeight: 600, color: "#334155", lineHeight: 1.35 }}>Diseñar mi vida financiera a futuro</span>
                <span style={{ flexShrink: 0, fontSize: 18, color: "#64748b" }} aria-hidden>→</span>
              </button>
            </div>
          </section>

        </div>
      </main>

      <style>{`
        /* Course title separator - use full usable width */
        div[style*="gap: clamp(16px, 3vw, 24px)"][style*="marginBottom: clamp(10px"] {
          width: 100% !important;
          max-width: 100% !important;
        }
        
        /* On tablet/iPad - account for left sidebar only (220px) */
        @media (min-width: 768px) and (max-width: 1160px) {
          div[style*="gap: clamp(16px, 3vw, 24px)"][style*="marginBottom: clamp(10px"] {
            width: calc(100vw - 220px - 32px) !important;
            max-width: calc(100vw - 220px - 32px) !important;
          }
        }
        
        /* On desktop - account for left sidebar only (280px) */
        @media (min-width: 1161px) {
          div[style*="gap: clamp(16px, 3vw, 24px)"][style*="marginBottom: clamp(10px"] {
            width: calc(100vw - 280px - 48px) !important;
            max-width: calc(100vw - 280px - 48px) !important;
          }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        /* Lesson action buttons - hover effect */
        .lesson-btn:hover {
          transform: scale(1.02);
          box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4);
        }
        .lesson-btn:active {
          transform: scale(0.98);
        }
        .lesson-btn-start:hover {
          background: #2563EB !important;
        }
        .lesson-btn-signup:hover {
          background: linear-gradient(135deg, #0A5FD4 0%, #3A8EF7 100%) !important;
        }

        .course-topic-item:hover {
          border-color: #93c5fd !important;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.12);
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-8px); }
        }
        
        @keyframes softRotate {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
        
        /* Tablet (768px–1160px): content to the right of left sidebar (220px) */
        @media (min-width: 768px) and (max-width: 1160px) {
          .courses-main-content {
            padding-left: 220px !important;
            padding-right: 16px !important;
            display: flex !important;
            justify-content: center !important;
          }
          .courses-main-content > div {
            max-width: calc(100vw - 220px - 32px) !important;
            width: 100% !important;
            margin: 0 auto !important;
          }
        }
        
        /* Desktop (1161px+): content to the right of left sidebar (280px) */
        @media (min-width: 1161px) {
          .courses-main-content {
            padding-left: 280px !important;
            padding-right: 16px !important;
            display: flex !important;
            justify-content: center !important;
          }
          .courses-main-content > div {
            max-width: calc(100vw - 280px - 48px) !important;
            width: 100% !important;
            margin: 0 auto !important;
          }
        }
        
        @media (max-width: 768px) {
          /* Ensure app-shell and app-scroll use full width on mobile */
          .app-shell,
          .app-scroll,
          .app-main {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow-x: hidden !important;
            background-color: #ffffff !important;
          }
          
          /* Ensure root container uses full width */
          div[style*="position: relative"][style*="width: 100%"] {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            left: 0 !important;
            right: 0 !important;
          }
          
          /* Fix main container for mobile scrolling */
          div[style*="position: relative"][style*="minHeight: 100vh"] {
            position: relative !important;
            height: auto !important;
            min-height: 100vh !important;
            overflow-y: visible !important;
            overflow-x: hidden !important;
            -webkit-overflow-scrolling: touch !important;
          }
          
          /* Adjust main content padding on mobile - no left padding since panel is hidden */
          main[style*="paddingLeft"],
          main[style*="padding-left"],
          .courses-main-content {
            padding-left: 0 !important;
            padding-right: 0 !important;
            padding-top: 80px !important; /* Space for hamburger button + course bar */
            padding-bottom: calc(65px + env(safe-area-inset-bottom)) !important; /* Space for mobile footer + safe area */
            background: #ffffff !important;
          }
          
          /* Remove extra margin from last course section on mobile */
          .courses-main-content > div > div:last-child {
            margin-bottom: 0 !important;
          }
          
          /* Ensure body/html keep white background without changing scroll behavior */
          body,
          html {
            background: #ffffff !important;
            overflow-x: clip !important; /* Use clip instead of hidden to allow child overflow */
          }
          
          /* Ensure main container doesn't cause horizontal scroll */
          div[style*="width: 100%"],
          div[style*="width: 100vw"] {
            width: 100% !important;
            max-width: 100% !important;
            overflow-x: clip !important; /* Use clip instead of hidden */
            box-sizing: border-box !important;
          }
          
          /* Ensure island path container fits in available space on mobile - centered */
          div[style*="maxWidth: 800px"],
          div[style*="maxWidth: 800"] {
            max-width: 100% !important;
            width: 100% !important;
            margin: 0 auto !important;
            padding: 0 !important;
            box-sizing: border-box !important;
            overflow: visible !important; /* Allow START label and preview panels to show */
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
          }
          
          /* Container for course/lesson list */
          div[style*="flexDirection: column"][style*="alignItems: center"] {
            overflow: visible !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          
          /* Ensure main container allows overflow */
          main {
            overflow: visible !important;
            padding-left: 16px !important;
            padding-right: 16px !important;
          }
          
          
          /* Desktop (1161px and up) - left fixed sidebar only */
          @media (min-width: 1161px) {
            main {
              padding-left: 280px !important;
              padding-right: 16px !important;
              display: flex !important;
              justify-content: center !important;
              align-items: flex-start !important;
            }
            
            .courses-main-content {
              padding-left: 280px !important;
              padding-right: 16px !important;
            }
            .courses-main-content > div {
              max-width: calc(100vw - 280px - 48px) !important;
              width: 100% !important;
              margin: 0 auto !important;
            }
            
            div[style*="flexDirection: column"][style*="alignItems: center"] {
              overflow-x: hidden !important;
              overflow-y: visible !important;
              width: 100% !important;
              max-width: 100% !important;
            }
          }
          
          /* iPad (768px to 1160px) - left fixed sidebar only */
          @media (min-width: 768px) and (max-width: 1160px) {
            main {
              padding-left: 220px !important;
              padding-right: 16px !important;
              display: flex !important;
              justify-content: center !important;
              align-items: flex-start !important;
            }
            
            .courses-main-content {
              padding-left: 220px !important;
              padding-right: 16px !important;
            }
            .courses-main-content > div {
              max-width: calc(100vw - 220px - 32px) !important;
              width: 100% !important;
              margin: 0 auto !important;
            }
            
            div[style*="flexDirection: column"][style*="alignItems: center"] {
              overflow-x: hidden !important;
              overflow-y: visible !important;
              width: 100% !important;
              max-width: 100% !important;
            }
          }
        }
      `}</style>
    </div>
  )
}
