"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useLessonProgress } from "@/hooks/useLessonProgress"
import { SUBTEMAS_BY_COURSE } from "@/data/lessons/courseLessonsOrder"
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
  const { user, dbProfile, loading } = useAuth()
  const router = useRouter()
  const { completedLessons } = useLessonProgress()
  const [courses, setCourses] = useState<Course[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  // Calcule premium access based on Profile API data
  const hasActiveLicense = !!dbProfile?.school?.licenses?.length;
  const hasActiveStripe = dbProfile?.subscriptionStatus === 'active';
  const hasPremiumAccess = hasActiveLicense || hasActiveStripe;

  const completedCount = completedLessons.length
  const progressPct = Math.min(100, Math.round((completedCount / APPROX_TOTAL_LESSONS) * 100))

  const nextTopicId = React.useMemo(() => {
    for (let i = 0; i < SUBTEMAS_BY_COURSE.length; i++) {
      const topicId = i + 1
      const lessons = SUBTEMAS_BY_COURSE[i].flatMap(s => s.lessons)
      const allDone = lessons.every(l => completedLessons.includes(l.slug))
      if (!allDone) return topicId
    }
    return 1
  }, [completedLessons])

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

            <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "clamp(24px, 5vw, 48px)", alignItems: "center" }}>
              {/* Left Side: Title & Progress */}
              <div style={{ flex: "1 1 500px", minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 999, padding: "4px 14px", display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <Zap size={13} color="#60a5fa" />
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#93c5fd", letterSpacing: "0.05em", textTransform: "uppercase" }}>30 Temas</span>
                  </div>
                </div>
                <h1 style={{ fontSize: "clamp(26px, 5vw, 42px)", fontWeight: 900, color: "#ffffff", margin: "0 0 10px", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
                  Tu Camino Financiero
                </h1>
                <p style={{ fontSize: "clamp(14px, 2vw, 17px)", color: "#93c5fd", margin: "0 0 24px", lineHeight: 1.6, maxWidth: 500 }}>
                  Domina el dinero paso a paso. Desde las bases hasta invertir y emprender con confianza.
                </p>

                {/* Progress Bar Integrated */}
                <div style={{ width: "100%", maxWidth: 600 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 10 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#93c5fd", textTransform: "uppercase", letterSpacing: "0.05em" }}>Progreso de Cursos</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#60a5fa" }}>{Math.max(1, Math.floor(completedCount / 4))} de 150 cursos completados</span>
                    </div>
                    <span style={{ fontSize: 32, fontWeight: 900, color: "#fff", lineHeight: 1 }}>{progressPct}%</span>
                  </div>
                  <div style={{ width: "100%", height: 12, background: "rgba(255,255,255,0.12)", borderRadius: 10, overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${progressPct}%`,
                        height: "100%",
                        background: "linear-gradient(90deg, #60a5fa 0%, #3b82f6 100%)",
                        borderRadius: 10,
                        boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)",
                        transition: "width 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)"
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Right Side: Stats Cluster */}
              <div style={{ flex: "0 1 auto", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px", minWidth: "280px" }}>
                {[
                  { label: "Temas", value: "30", icon: BookOpen, color: "#60a5fa" },
                  { label: "Cursos", value: "150+", icon: CheckCircle2, color: "#93c5fd" },
                ].map((stat) => {
                  const StatIcon = stat.icon
                  return (
                    <div
                      key={stat.label}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 20,
                        padding: "20px 24px",
                        backdropFilter: "blur(4px)"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
                        <StatIcon size={18} color={stat.color} />
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#93c5fd", textTransform: "uppercase", letterSpacing: "0.1em" }}>{stat.label}</div>
                      </div>
                      <div style={{ fontSize: 28, fontWeight: 900, color: "#fff", lineHeight: 1.1 }}>{stat.value}</div>
                    </div>
                  )
                })}
              </div>
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
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "stretch", width: "100%", gap: 0, justifyContent: "center", position: "relative" }}>
                      {displayPair.map((topic, i) => {
                        const IconComp = topic.icon
                        const showArrow = i === 0 && displayPair.length > 1

                        // Updated: Only topic 1 has free content. Topics 2-30 are premium.
                        const isPremiumTopic = topic.id > 1;
                        const isLocked = isPremiumTopic && !hasPremiumAccess;

                        return (
                          <React.Fragment key={topic.id}>
                            <div
                              onClick={() => {
                                if (isLocked) {
                                  router.push('/payment');
                                } else {
                                  router.push(`/courses/${topic.id}`);
                                }
                              }}
                              className={`course-card-hover ${topic.id === nextTopicId ? "next-topic-glow" : ""}`}
                              style={{
                                flex: "0 1 550px",
                                minHeight: 180,
                                cursor: "pointer",
                                border: "1px solid rgba(15,98,254,0.1)",
                                borderRadius: "24px",
                                background: "linear-gradient(135deg, #f8faff 0%, #ffffff 100%)",
                                boxShadow: "0 4px 20px rgba(15,98,254,0.08)",
                                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                overflow: "hidden",
                                display: "flex",
                                flexDirection: "column",
                                minWidth: 0,
                                opacity: isLocked ? 0.7 : 1
                              }}
                            >
                              <div style={{ height: 5, background: isLocked ? "linear-gradient(90deg, #64748b, #94a3b8)" : "linear-gradient(90deg, #1e3a8a, #3b82f6)", width: "100%", flexShrink: 0 }} />
                              <div style={{ padding: "44px 32px", position: "relative", flex: 1, display: "flex", alignItems: "center", gap: 24 }}>
                                <div style={{ position: "absolute", top: 20, right: 24, fontSize: 11, fontWeight: 800, color: isLocked ? '#64748b' : topic.catColor, background: isLocked ? '#f1f5f9' : `${topic.catColor}16`, border: `1px solid ${isLocked ? '#cbd5e1' : `${topic.catColor}30`}`, padding: "4px 12px", borderRadius: 999, letterSpacing: "0.04em", textTransform: "uppercase" as const }}>
                                  {isLocked ? <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Bloqueado</span> : topic.category}
                                </div>
                                <div style={{ width: 68, height: 68, borderRadius: 20, flexShrink: 0, background: isLocked ? '#f1f5f9' : `${topic.catColor}14`, display: "flex", alignItems: "center", justifyContent: "center", color: isLocked ? '#64748b' : topic.catColor }}>
                                  <IconComp size={36} strokeWidth={2} />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", marginBottom: 8, letterSpacing: "0.06em" }}>TEMA {topic.id.toString().padStart(2, "0")}</div>
                                  <div style={{ fontSize: 19, fontWeight: 800, color: "#0f172a", lineHeight: 1.25 }}>{topic.title}</div>
                                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, fontSize: 13, fontWeight: 700, color: isLocked ? "#64748b" : "#3b82f6" }}>
                                    <BookOpen size={16} /><span>{topic.lessons} cursos</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {showArrow && (() => {
                              const destTopic = displayPair[i + 1];
                              const isDestLocked = (destTopic.id > 1) && !hasPremiumAccess;
                              const arrowColor = isDestLocked ? "#94a3b8" : "#2563eb";
                              const strokeColor = isDestLocked ? "#cbd5e1" : "#3b82f6";

                              return (
                                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", flexShrink: 0, padding: "0 8px", alignSelf: "center" }}>
                                  {isRTL ? (
                                    <svg width="72" height="28" viewBox="0 0 72 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <defs>
                                        <linearGradient id={`hArrowL-${pairIdx}`} x1="72" y1="14" x2="0" y2="14" gradientUnits="userSpaceOnUse">
                                          <stop stopColor={isDestLocked ? "#f1f5f9" : "#dbeafe"} />
                                          <stop offset="0.5" stopColor={strokeColor} />
                                          <stop offset="1" stopColor={isDestLocked ? "#64748b" : "#1e3a8a"} />
                                        </linearGradient>
                                        <filter id={`glowL-${pairIdx}`} x="-20%" y="-150%" width="140%" height="400%">
                                          <feGaussianBlur stdDeviation="2" result="blur" />
                                          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                                        </filter>
                                      </defs>
                                      <line x1="68" y1="14" x2="22" y2="14" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" opacity="0.2" filter={`url(#glowL-${pairIdx})`} />
                                      <line x1="68" y1="14" x2="22" y2="14" stroke={`url(#hArrowL-${pairIdx})`} strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 3" />
                                      <path d="M24 7L8 14L24 21" stroke={arrowColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                      <circle cx="8" cy="14" r="3" fill={isDestLocked ? "#64748b" : "#1e3a8a"} />
                                    </svg>
                                  ) : (
                                    <svg width="72" height="28" viewBox="0 0 72 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <defs>
                                        <linearGradient id={`hArrowR-${pairIdx}`} x1="0" y1="14" x2="72" y2="14" gradientUnits="userSpaceOnUse">
                                          <stop stopColor={isDestLocked ? "#f1f5f9" : "#dbeafe"} />
                                          <stop offset="0.5" stopColor={strokeColor} />
                                          <stop offset="1" stopColor={isDestLocked ? "#64748b" : "#1e3a8a"} />
                                        </linearGradient>
                                        <filter id={`glowR-${pairIdx}`} x="-20%" y="-150%" width="140%" height="400%">
                                          <feGaussianBlur stdDeviation="2" result="blur" />
                                          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                                        </filter>
                                      </defs>
                                      <line x1="4" y1="14" x2="50" y2="14" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" opacity="0.2" filter={`url(#glowR-${pairIdx})`} />
                                      <line x1="4" y1="14" x2="50" y2="14" stroke={`url(#hArrowR-${pairIdx})`} strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 3" />
                                      <path d="M48 7L64 14L48 21" stroke={arrowColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                      <circle cx="64" cy="14" r="3" fill={isDestLocked ? "#64748b" : "#1e3a8a"} />
                                    </svg>
                                  )}
                                </div>
                              );
                            })()
                            }
                          </React.Fragment>
                        )
                      })
                      }
                    </div>
                    {!isLastPair && (() => {
                      const nextPair = pairs[pairIdx + 1];
                      // Points to the first item of next row (which is pairs[pairIdx+1][0])
                      const destTopic = nextPair[0];
                      const isDestLocked = (destTopic.id > 1) && !hasPremiumAccess;
                      const arrowColor = isDestLocked ? "#94a3b8" : "#1e3a8a";
                      const strokeColor = isDestLocked ? "#cbd5e1" : "#3b82f6";

                      return (
                        <div style={{ display: "flex", width: "100%", justifyContent: "center", position: "relative" }}>
                          {/* Total row width is actually 1188px (550 + 8 + 72 + 8 + 550) */}
                          <div style={{
                            width: 1188,
                            display: "flex",
                            justifyContent: isRTL ? "flex-start" : "flex-end",
                            // To align perfectly under the center of the card:
                            // Card center is at 275px from its side of the row.
                            // We use padding on the inner container and translate the arrow by its half-width (14px).
                            paddingLeft: isRTL ? 275 : 0,
                            paddingRight: isRTL ? 0 : 275,
                            position: "relative"
                          }}>
                            <div style={{ marginLeft: isRTL ? -14 : 0, marginRight: isRTL ? 0 : -14, display: "flex", flexDirection: "column", alignItems: "center" }}>
                              <svg width="28" height="72" viewBox="0 0 28 72" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                  <linearGradient id={`vArrow-${pairIdx}`} x1="14" y1="0" x2="14" y2="72" gradientUnits="userSpaceOnUse">
                                    <stop stopColor={isDestLocked ? "#f1f5f9" : "#dbeafe"} />
                                    <stop offset="0.6" stopColor={strokeColor} />
                                    <stop offset="1" stopColor={isDestLocked ? "#64748b" : "#1e3a8a"} />
                                  </linearGradient>
                                  <filter id={`vGlow-${pairIdx}`} x="-150%" y="-20%" width="400%" height="140%">
                                    <feGaussianBlur stdDeviation="2" result="blur" />
                                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                                  </filter>
                                </defs>
                                <line x1="14" y1="4" x2="14" y2="52" stroke={strokeColor} strokeWidth="5" strokeLinecap="round" opacity="0.15" filter={`url(#vGlow-${pairIdx})`} />
                                <line x1="14" y1="4" x2="14" y2="52" stroke={`url(#vArrow-${pairIdx})`} strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 3" />
                                <path d="M7 50L14 66L21 50" stroke={arrowColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                <circle cx="14" cy="4" r="3" fill={isDestLocked ? "#f1f5f9" : "#dbeafe"} />
                              </svg>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </React.Fragment>
                )
              })
            })()}
          </section>
        </section>
      </div >

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

        .course-card-hover:not(.next-topic-glow):hover {
          border-color: #3b82f6 !important;
          transform: translateY(-4px) !important;
          box-shadow: 0 12px 32px rgba(37, 99, 235, 0.14) !important;
        }

        .course-card-hover:active {
          transform: translateY(-1px) !important;
        }

        @keyframes topic-glow-pulse {
          0%, 100% { 
            box-shadow: 0 4px 20px rgba(15,98,254,0.08); 
            transform: scale(1);
            border-color: rgba(15,98,254,0.1);
          }
          50% { 
            box-shadow: 0 8px 24px rgba(37, 99, 235, 0.15); 
            transform: scale(1.02);
            border-color: rgba(37, 99, 235, 0.3);
          }
        }
        .next-topic-glow {
          animation: topic-glow-pulse 4s ease-in-out infinite !important;
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
    </div >
  )
}
