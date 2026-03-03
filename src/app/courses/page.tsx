"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useLessonProgress } from "@/hooks/useLessonProgress"
import {
  BookOpen,
  ChevronRight,
  Wallet,
  Coins,
  PiggyBank,
  Receipt,
  HandCoins,
  CreditCard,
  Landmark,
  TrendingUp,
  Presentation,
  BarChart4,
  Briefcase,
  Brain,
  LineChart,
  AlertTriangle,
  Lightbulb,
  Rocket,
  Search,
  ShieldCheck,
  FileText,
  Calculator,
  RefreshCw,
  BadgeDollarSign,
  Skull,
  Smile,
  Heart,
  ShieldAlert,
  Coffee,
  Target,
  CheckCircle2,
  Clock,
  Zap,
  Layout
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

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
      background: "#FBFAF5",
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
          [data-mobile-bottom-nav], .progress-card-mobile-hide {
            display: none !important;
          }
        }
      `}</style>

      <div
        style={{
          flex: 1,
          paddingTop: "clamp(8px, 1.5vw, 16px)",
          paddingBottom: "clamp(40px, 8vw, 80px)",
          paddingLeft: "280px", // Desktop default offset
          paddingRight: "16px",
          fontFamily: "'Montserrat', sans-serif",
          background: "transparent",
          position: "relative",
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          marginBottom: 0,
          boxSizing: "border-box",
          width: "100%"
        }} className="courses-main-content">
        {/* Same width as course bars (800px) - progress at top, then course list */}
        <section style={{
          width: "100%",
          maxWidth: "100%",
          margin: "0",
          position: "relative",
          zIndex: 1,
          padding: "0",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          gap: 0
        }}>
          {/* Hero Header */}
          <div
            className="courses-hero"
            style={{
              background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #1d4ed8 100%)",
              borderRadius: 28,
              padding: "clamp(32px, 5vw, 52px) clamp(28px, 5vw, 48px)",
              marginBottom: "clamp(28px, 5vw, 40px)",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(15, 98, 254, 0.25)"
            }}
          >
            {/* Glowing orbs inside hero */}
            <div style={{ position: "absolute", top: "-30%", right: "-5%", width: 300, height: 300, background: "radial-gradient(circle, rgba(96,165,250,0.25) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: "-20%", left: "5%", width: 250, height: 250, background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 999, padding: "4px 14px", display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <Zap size={13} color="#60a5fa" />
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#93c5fd", letterSpacing: "0.05em", textTransform: "uppercase" }}>30 Temas</span>
                </div>
              </div>
              <h1 style={{ fontSize: "clamp(26px, 5vw, 42px)", fontWeight: 900, color: "#ffffff", margin: "0 0 10px", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
                Tu Camino Financiero
              </h1>
              <p style={{ fontSize: "clamp(14px, 2vw, 17px)", color: "#93c5fd", margin: "0 0 32px", lineHeight: 1.6, maxWidth: 500 }}>
                Domina el dinero paso a paso. Desde las bases hasta invertir y emprender con confianza.
              </p>

              {/* Stats row */}
              <div style={{ display: "flex", gap: "clamp(16px, 4vw, 32px)", flexWrap: "wrap" }}>
                {[
                  { label: "Temas", value: "30", icon: BookOpen },
                  { label: "Lecciones", value: `${APPROX_TOTAL_LESSONS}+`, icon: CheckCircle2 },
                  { label: "Completadas", value: completedCount.toString(), icon: Zap },
                ].map((stat) => {
                  const StatIcon = stat.icon
                  return (
                    <div key={stat.label} style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "12px 18px" }}>
                      <StatIcon size={18} color="#60a5fa" />
                      <div>
                        <div style={{ fontSize: "clamp(18px, 3vw, 24px)", fontWeight: 900, color: "#fff", lineHeight: 1 }}>{stat.value}</div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: "#93c5fd", textTransform: "uppercase", letterSpacing: "0.05em" }}>{stat.label}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Progress indicator – lessons completed across all 30 topics */}
          <div
            className="progress-card-responsive progress-card-mobile-hide"
            style={{
              width: "100%",
              marginBottom: "clamp(28px, 5vw, 44px)",
              padding: "clamp(20px, 3vw, 28px) clamp(24px, 4vw, 32px)",
              background: "white",
              border: "1px solid #e2e8f0",
              borderRadius: 20,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
              boxSizing: "border-box",
              position: "relative",
              overflow: "hidden"
            }}
            aria-label={`Progreso: ${completedCount} lecciones completadas`}
          >
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #3b82f6, #2563eb, #6366f1)", borderRadius: "20px 20px 0 0" }} />
            <div style={{ position: "absolute", top: -30, right: -30, width: 150, height: 150, background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)", borderRadius: "50%" }} />

            <div
              className="progress-flex-container"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
                position: "relative",
                zIndex: 1
              }}
            >
              <div>
                <h2 style={{ fontSize: "clamp(15px, 3vw, 20px)", fontWeight: 800, color: "#1e3a5f", margin: "0 0 3px" }} className="progress-title">
                  <span className="full-text">Tu Viaje BIZEN</span>
                  <span className="short-text">Mi Viaje</span>
                </h2>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#64748b" }} className="progress-subtitle">
                  <span className="full-text">{completedCount} de {APPROX_TOTAL_LESSONS} lecciones dominadas</span>
                  <span className="short-text">{completedCount} / {APPROX_TOTAL_LESSONS}</span>
                </div>
              </div>
              <div style={{ textAlign: "right", display: "flex", alignItems: "center", gap: 12 }}>
                <span
                  style={{
                    fontSize: "clamp(22px, 5vw, 34px)",
                    fontWeight: 900,
                    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                  }}
                >
                  {progressPct}%
                </span>
              </div>
            </div>
            <div
              style={{
                width: "100%",
                height: 10,
                borderRadius: 10,
                background: "#f1f5f9",
                overflow: "hidden",
                position: "relative",
                zIndex: 1
              }}
            >
              <div
                style={{
                  width: `${progressPct}%`,
                  height: "100%",
                  borderRadius: 10,
                  background: "linear-gradient(90deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%)",
                  transition: "width 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  boxShadow: "0 0 12px rgba(59, 130, 246, 0.5)"
                }}
              />
            </div>
          </div>

          {/* Topics Path — 2-per-row snake/zigzag layout */}
          <section
            style={{
              width: "100%",
              maxWidth: "100%",
              margin: "0 auto",
              marginBottom: "clamp(32px, 6vw, 48px)",
              paddingBottom: 40,
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
            }}
            aria-label="Temas"
          >
            {(() => {
              const topics = [
                { id: 1, title: "Mi relación con el dinero", icon: Wallet, category: "Fundamentos", catColor: "#3b82f6", lessons: 4 },
                { id: 2, title: "¿Qué es el dinero y por qué existe?", icon: Coins, category: "Fundamentos", catColor: "#3b82f6", lessons: 5 },
                { id: 3, title: "¿Cómo entra y sale el dinero de mi vida?", icon: RefreshCw, category: "Fundamentos", catColor: "#3b82f6", lessons: 6 },
                { id: 4, title: "Presupuesto: tomar control sin ahogarme", icon: Receipt, category: "Presupuesto", catColor: "#0ea5e9", lessons: 8 },
                { id: 5, title: "Ahorro con propósito", icon: PiggyBank, category: "Ahorro", catColor: "#10b981", lessons: 5 },
                { id: 6, title: "¿Deuda: cuándo ayuda y cuándo destruye?", icon: CreditCard, category: "Deuda", catColor: "#f59e0b", lessons: 7 },
                { id: 7, title: "Sistema financiero explicado fácil", icon: Landmark, category: "Fundamentos", catColor: "#3b82f6", lessons: 6 },
                { id: 8, title: "Impuestos en la vida real", icon: FileText, category: "Impuestos", catColor: "#6366f1", lessons: 6 },
                { id: 9, title: "Inflación y poder adquisitivo", icon: TrendingUp, category: "Economía", catColor: "#8b5cf6", lessons: 5 },
                { id: 10, title: "Introducción a la inversión", icon: Presentation, category: "Inversión", catColor: "#2563eb", lessons: 8 },
                { id: 11, title: "Instrumentos de inversión básicos", icon: BarChart4, category: "Inversión", catColor: "#2563eb", lessons: 10 },
                { id: 12, title: "Psicología del inversionista", icon: Brain, category: "Inversión", catColor: "#2563eb", lessons: 7 },
                { id: 13, title: "Construcción de patrimonio", icon: ShieldCheck, category: "Patrimonio", catColor: "#10b981", lessons: 9 },
                { id: 14, title: "Errores financieros comunes", icon: AlertTriangle, category: "Errores", catColor: "#f59e0b", lessons: 6 },
                { id: 15, title: "Decisiones financieras conscientes", icon: Lightbulb, category: "Mentalidad", catColor: "#facc15", lessons: 5 },
                { id: 16, title: "Mentalidad emprendedora", icon: Rocket, category: "Emprender", catColor: "#ef4444", lessons: 8 },
                { id: 17, title: "Oportunidades de negocio", icon: Search, category: "Emprender", catColor: "#ef4444", lessons: 6 },
                { id: 18, title: "Validar ideas rápido", icon: Zap, category: "Emprender", catColor: "#ef4444", lessons: 7 },
                { id: 19, title: "Modelo de negocio simple", icon: Layout, category: "Negocios", catColor: "#6366f1", lessons: 9 },
                { id: 20, title: "Ingresos, costos y utilidad", icon: Calculator, category: "Negocios", catColor: "#6366f1", lessons: 8 },
                { id: 21, title: "Flujo de efectivo", icon: LineChart, category: "Negocios", catColor: "#6366f1", lessons: 6 },
                { id: 22, title: "Precios y valor", icon: BadgeDollarSign, category: "Negocios", catColor: "#6366f1", lessons: 5 },
                { id: 23, title: "Contabilidad básica", icon: BookOpen, category: "Negocios", catColor: "#6366f1", lessons: 7 },
                { id: 24, title: "Errores comunes al emprender", icon: Skull, category: "Errores", catColor: "#f59e0b", lessons: 6 },
                { id: 25, title: "Escalar un negocio", icon: TrendingUp, category: "Negocios", catColor: "#6366f1", lessons: 8 },
                { id: 26, title: "Dinero y estilo de vida", icon: Smile, category: "Bienestar", catColor: "#ec4899", lessons: 5 },
                { id: 27, title: "Dinero y decisiones importantes", icon: Heart, category: "Bienestar", catColor: "#ec4899", lessons: 6 },
                { id: 28, title: "Dinero en crisis", icon: ShieldAlert, category: "Resiliencia", catColor: "#dc2626", lessons: 7 },
                { id: 29, title: "Estrés y bienestar financiero", icon: Coffee, category: "Bienestar", catColor: "#ec4899", lessons: 5 },
                { id: 30, title: "Mi vida financiera a futuro", icon: Target, category: "Futuro", catColor: "#0ea5e9", lessons: 10 },
              ]
              const pairs: typeof topics[] = []
              for (let i = 0; i < topics.length; i += 2) pairs.push(topics.slice(i, i + 2))

              return pairs.map((pair, pairIdx) => {
                const isRTL = pairIdx % 2 === 1
                const isLastPair = pairIdx === pairs.length - 1
                const displayPair = isRTL ? [...pair].reverse() : pair
                return (
                  <React.Fragment key={pairIdx}>
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "stretch", width: "100%", gap: 0 }}>
                      {displayPair.map((topic, i) => {
                        const IconComp = topic.icon
                        const showArrow = i === 0 && displayPair.length > 1
                        return (
                          <React.Fragment key={topic.id}>
                            <div
                              onClick={() => router.push(`/courses/${topic.id}`)}
                              className="course-card-hover"
                              style={{ flex: 1, minHeight: 180, cursor: "pointer", border: "1px solid rgba(15,98,254,0.1)", borderRadius: "24px", background: "linear-gradient(135deg, #f8faff 0%, #ffffff 100%)", boxShadow: "0 4px 20px rgba(15,98,254,0.08)", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", overflow: "hidden", display: "flex", flexDirection: "column", minWidth: 0 }}
                            >
                              <div style={{ height: 5, background: "linear-gradient(90deg, #1e3a8a, #3b82f6)", width: "100%", flexShrink: 0 }} />
                              <div style={{ padding: "44px 32px", position: "relative", flex: 1, display: "flex", alignItems: "center", gap: 24 }}>
                                <div style={{ position: "absolute", top: 20, right: 24, fontSize: 11, fontWeight: 800, color: topic.catColor, background: `${topic.catColor}16`, border: `1px solid ${topic.catColor}30`, padding: "4px 12px", borderRadius: 999, letterSpacing: "0.04em", textTransform: "uppercase" as const }}>{topic.category}</div>
                                <div style={{ width: 68, height: 68, borderRadius: 20, flexShrink: 0, background: `${topic.catColor}14`, display: "flex", alignItems: "center", justifyContent: "center", color: topic.catColor }}><IconComp size={36} strokeWidth={2} /></div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", marginBottom: 8, letterSpacing: "0.06em" }}>TEMA {topic.id.toString().padStart(2, "0")}</div>
                                  <div style={{ fontSize: 19, fontWeight: 800, color: "#0f172a", lineHeight: 1.25 }}>{topic.title}</div>
                                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, fontSize: 13, fontWeight: 700, color: "#3b82f6" }}><BookOpen size={16} /><span>{topic.lessons} lecciones</span></div>
                                </div>
                              </div>
                            </div>
                            {showArrow && (
                              <div style={{ display: "flex", flexDirection: "row", alignItems: "center", flexShrink: 0, padding: "0 4px", alignSelf: "center" }}>
                                {isRTL ? (<><svg width="10" height="14" viewBox="0 0 10 14" fill="none"><path d="M0 7L9.75 0.94L9.75 13.06L0 7Z" fill="#3b82f6" /></svg><div style={{ width: 20, height: 2, background: "linear-gradient(to left, #bfdbfe, #3b82f6)", borderRadius: 2 }} /></>) : (<><div style={{ width: 20, height: 2, background: "linear-gradient(to right, #bfdbfe, #3b82f6)", borderRadius: 2 }} /><svg width="10" height="14" viewBox="0 0 10 14" fill="none"><path d="M10 7L0.25 13.06L0.25 0.94L10 7Z" fill="#3b82f6" /></svg></>)}
                              </div>
                            )}
                          </React.Fragment>
                        )
                      })}
                    </div>
                    {!isLastPair && (
                      <div style={{ display: "flex", width: "100%", justifyContent: isRTL ? "flex-start" : "flex-end" }}>
                        <div style={{ width: "50%", display: "flex", justifyContent: "center", padding: "12px 0" }}>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <div style={{ width: 2, height: 40, background: "linear-gradient(to bottom, #bfdbfe, #3b82f6)", borderRadius: 2 }} />
                            <svg width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M7 10L0.94 0.25H13.06L7 10Z" fill="#3b82f6" /></svg>
                          </div>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                )
              })
            })()}
          </section>
        </section>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .topics-grid-responsive {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .topics-grid-responsive {
            grid-template-columns: 1fr !important;
          }
          .progress-card-responsive {
            padding: 16px !important;
            border-radius: 16px !important;
            margin-bottom: 24px !important;
          }
          .progress-flex-container {
            flex-direction: row !important;
            align-items: center !important;
            flex-wrap: nowrap !important; /* Force single row for progress header */
            gap: 4px !important;
          }
          .progress-flex-container > div:first-child {
            flex: 1 !important;
            min-width: 0 !important;
          }
          .progress-subtitle .full-text {
            display: none !important;
          }
          .progress-subtitle .short-text {
            display: inline !important;
          }
          .progress-title .full-text {
            display: none !important;
          }
          .progress-title .short-text {
            display: inline !important;
          }
        }
        @media (min-width: 641px) {
          .progress-subtitle .short-text {
            display: none !important;
          }
          .progress-subtitle .full-text {
            display: inline !important;
          }
          .progress-title .short-text {
            display: none !important;
          }
          .progress-title .full-text {
            display: inline !important;
          }
        }

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

        .course-card-hover:hover {
          border-color: #3b82f6 !important;
          transform: translateY(-4px) !important;
          box-shadow: 0 12px 32px rgba(37, 99, 235, 0.14) !important;
        }

        .course-card-hover:active {
          transform: translateY(-1px) !important;
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-8px); }
        }
        
        @keyframes softRotate {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
        
        /* Removed redundant padding media queries handled globally */
        
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
          }
          
        /* Responsive sidebar offsets */
        @media (min-width: 1161px) {
          .courses-main-content {
            padding-left: 280px !important;
            padding-right: 32px !important;
          }
        }
        @media (min-width: 768px) and (max-width: 1160px) {
          .courses-main-content {
            padding-left: 220px !important;
            padding-right: 24px !important;
          }
        }
        @media (max-width: 767px) {
          .courses-main-content {
            padding-left: 16px !important;
            padding-right: 16px !important;
            padding-top: 80px !important;
          }
        }
        
        /* Ensure app-shell and containers allow full width */
        .app-shell, .app-scroll, .app-main {
          width: 100% !important;
          max-width: 100% !important;
        }
        
          /* Content area is already offset by app-main padding in globals.css */
        `}</style>
    </div>
  )
}
