"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useLessonProgress } from "@/hooks/useLessonProgress"

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

// Approximate total lessons across 30 topics (for progress bar cap)
const APPROX_TOTAL_LESSONS = 150

export default function CoursesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { completedLessons } = useLessonProgress()
  const [courses, setCourses] = useState<Course[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  const completedCount = completedLessons.length
  const progressPct = Math.min(100, Math.round((completedCount / APPROX_TOTAL_LESSONS) * 100))

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
        {/* Same width as course bars (800px) - progress at top, then course list */}
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
          {/* Progress indicator – lessons completed across all 30 topics */}
          <div
            style={{
              width: "100%",
              marginBottom: "clamp(20px, 4vw, 28px)",
              padding: "clamp(14px, 2.5vw, 18px) clamp(16px, 2.5vw, 20px)",
              background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
              border: "2px solid rgba(59, 130, 246, 0.25)",
              borderRadius: 12,
              boxSizing: "border-box",
            }}
            aria-label={`Progreso: ${completedCount} lecciones completadas`}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              <span
                style={{
                  fontSize: "clamp(14px, 2.5vw, 16px)",
                  fontWeight: 700,
                  color: "#1e40af",
                }}
              >
                {completedCount} lecciones completadas
              </span>
              <span
                style={{
                  fontSize: "clamp(13px, 2.2vw, 15px)",
                  fontWeight: 600,
                  color: "#64748b",
                }}
              >
                {progressPct}%
              </span>
            </div>
            <div
              style={{
                width: "100%",
                height: 10,
                borderRadius: 10,
                background: "rgba(59, 130, 246, 0.2)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${progressPct}%`,
                  height: "100%",
                  borderRadius: 10,
                  background: "linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)",
                  transition: "width 0.5s ease",
                }}
              />
            </div>
          </div>

          {/* 30 topics – single column, scroll down (no stars on course/topic covers) */}
          <section
            style={{
              width: "100%",
              marginBottom: "clamp(32px, 6vw, 48px)",
              display: "flex",
              flexDirection: "column",
              gap: "clamp(12px, 2vw, 16px)",
              overflowY: "auto",
              maxHeight: "none",
            }}
            aria-label="Temas"
          >
            {[
                  { id: 1, title: "Mi relación con el dinero" },
              { id: 2, title: "¿Qué es el dinero y por qué existe?" },
              { id: 3, title: "¿Cómo entra y sale el dinero de mi vida?" },
                  { id: 4, title: "Presupuesto: tomar control sin ahogarme" },
                  { id: 5, title: "Ahorro con propósito" },
              { id: 6, title: "¿Deuda: cuándo ayuda y cuándo destruye?" },
                  { id: 7, title: "Sistema financiero explicado fácil" },
                  { id: 8, title: "Impuestos en la vida real" },
                  { id: 9, title: "Inflación y poder adquisitivo" },
                  { id: 10, title: "Introducción a la inversión" },
                  { id: 11, title: "Instrumentos de inversión básicos" },
                  { id: 12, title: "Psicología del inversionista" },
                  { id: 13, title: "Construcción de patrimonio a largo plazo" },
                  { id: 14, title: "Errores financieros comunes" },
                  { id: 15, title: "Tomar decisiones financieras conscientes" },
                  { id: 16, title: "Mentalidad emprendedora" },
                  { id: 17, title: "Identificar problemas y oportunidades de negocio" },
                  { id: 18, title: "Validar ideas sin gastar dinero" },
                  { id: 19, title: "Modelo de negocio explicado simple" },
                  { id: 20, title: "Ingresos, costos y utilidad en un negocio" },
                  { id: 21, title: "Flujo de efectivo" },
                  { id: 22, title: "Precios y valor" },
                  { id: 23, title: "Contabilidad básica para no contadores" },
                  { id: 24, title: "Errores comunes al emprender" },
                  { id: 25, title: "Escalar un negocio" },
                  { id: 26, title: "Dinero y estilo de vida" },
                  { id: 27, title: "Dinero y decisiones importantes" },
                  { id: 28, title: "Dinero en crisis" },
                  { id: 29, title: "Dinero, estrés y bienestar personal" },
                  { id: 30, title: "Diseñar mi vida financiera a futuro" },
            ].map((topic) => (
                        <button
                          key={topic.id}
                type="button"
                          onClick={() => router.push(`/courses/${topic.id}`)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "clamp(14px, 2.5vw, 18px) clamp(16px, 2.5vw, 20px)",
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
                  {topic.id}
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
                  {topic.title}
                </span>
                <span style={{ flexShrink: 0, fontSize: 18, color: "#64748b" }} aria-hidden>→</span>
              </button>
            ))}
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
              display: "flex" !important;
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
