"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useLessonProgress } from "@/hooks/useLessonProgress"
import { motion } from "framer-motion"
import Image from "next/image"
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
  Layout,
  GraduationCap
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import PageLoader from "@/components/PageLoader"

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
  // Icon mapping for dynamic topics
  const ICON_MAP: Record<string, any> = {
    Wallet, Coins, RefreshCw, Receipt, PiggyBank, CreditCard, Landmark, FileText, TrendingUp, Presentation,
    BarChart4, Brain, ShieldCheck, AlertTriangle, Lightbulb, Rocket, Search, Zap, Layout, Calculator,
    LineChart, BadgeDollarSign, Skull, Smile, Heart, ShieldAlert, Coffee, Target, BookOpen
  }

  // Category color mapping
  const CATEGORY_COLORS: Record<string, string> = {
    Fundamentos: "#3b82f6",
    Presupuesto: "#0ea5e9",
    Ahorro: "#10b981",
    Deuda: "#f59e0b",
    Impuestos: "#6366f1",
    Economía: "#8b5cf6",
    Inversión: "#2563eb",
    Patrimonio: "#10b981",
    Errores: "#f59e0b",
    Mentalidad: "#facc15",
    Emprender: "#ef4444",
    Negocios: "#6366f1",
    Bienestar: "#ec4899",
    Resiliencia: "#dc2626",
    Futuro: "#0ea5e9",
  }

  const [courses, setCourses] = useState<Course[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const [topicWarning, setTopicWarning] = useState(false)
  const [dbTopics, setDbTopics] = useState<any[]>([])
  const [insight, setInsight] = useState<string | null>(null)
  const [loadingInsight, setLoadingInsight] = useState(true)

  // Calculate premium access based on Profile API data
  const hasActiveLicense = !!dbProfile?.school?.licenses?.length;
  const hasActiveStripe = dbProfile?.subscriptionStatus === 'active';
  const isInstitutional = !!dbProfile?.schoolId || (dbProfile?.role && dbProfile.role !== 'particular');
  const hasPremiumAccess = hasActiveLicense || hasActiveStripe || isInstitutional;

  const completedCount = completedLessons.length
  const progressPct = Math.min(100, Math.round((completedCount / APPROX_TOTAL_LESSONS) * 100))

  const nextTopicId = React.useMemo(() => {
    if (dbTopics.length === 0) return null
    // Find first topic that is NOT fully completed
    for (let i = 0; i < dbTopics.length; i++) {
      const topic = dbTopics[i]
      const subtemas = SUBTEMAS_BY_COURSE[i]
      if (!subtemas) continue

      const topicLessons = subtemas.flatMap(s => s.lessons.map(l => l.slug))
      if (topicLessons.length === 0) continue

      const isTopicDone = topicLessons.every(slug => completedLessons.includes(slug))
      if (!isTopicDone) return topic.id
    }
    return null // Stay on overview if everything is finished or no incomplete found
  }, [dbTopics, completedLessons])

  // Determine if we are about to redirect (to avoid the "blink" glitch)
  const willRedirect = React.useMemo(() => {
    if (loading || loadingData || !user || !nextTopicId) return false
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search)
      if (sp.get("noredirect") === "true") return false
    }
    return true
  }, [loading, loadingData, user, nextTopicId])

  // Redirect unauthenticated users
  useEffect(() => {
    if (!loading && !user) {
      window.open("/login", "_blank")
    }
  }, [loading, user])

  useEffect(() => {
    // Only fetch data if user is authenticated
    if (loading) return
    if (!user) return

    const fetchCoursesData = async () => {
      try {
        setLoadingData(true)
        const res = await fetch('/api/topics')
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.detail || data.error || "Failed to fetch topics")
        }

        setDbTopics(data)
        setCourses([])
      } catch (error: any) {
        console.error("Error fetching courses:", error)
        setLoadingData(false)
      } finally {
        setLoadingData(false)
      }
    }

    const fetchInsight = async () => {
      try {
        setLoadingInsight(true)
        const res = await fetch("/api/dashboard/insights")
        const data = await res.json()
        setInsight(data.insight)
      } catch (e) {
        console.error("Failed to fetch insights", e)
      } finally {
        setLoadingInsight(false)
      }
    }

    fetchCoursesData()
    fetchInsight()
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

  // Automatic redirection to the next topic to complete
  useEffect(() => {
    if (willRedirect && nextTopicId) {
      const id = nextTopicId.toString()
      const redirectId = (!id.startsWith("tema-") && !isNaN(parseInt(id)))
        ? `tema-${id.padStart(2, "0")}`
        : id;
      router.replace(`/courses/${redirectId}`)
    }
  }, [willRedirect, nextTopicId, router])

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


  // Show loading placeholder if data is missing OR if we are about to redirect
  // This prevents the "Overview" page from blinking for one frame before jumping to the topic.
  if (loading || loadingData || loadingInsight || !user || (willRedirect && nextTopicId)) {
    return <PageLoader />
  }

  return (
    <div className="courses-page-active" style={{
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
      {/* Decorative Orbs for Glassmorphism */}
      <div style={{ position: "fixed", top: "5%", right: "-5%", width: 500, height: 500, background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "5%", left: "-5%", width: 600, height: 600, background: "radial-gradient(circle, rgba(34,197,94,0.12) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(90px)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", top: "40%", left: "20%", width: 450, height: 450, background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(70px)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "35%", right: "15%", width: 350, height: 350, background: "radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none", zIndex: 0 }} />
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
          paddingLeft: "312px", // Desktop default offset
          paddingRight: "16px",
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
              width: "100%",
              maxWidth: 1188,
              margin: "0 auto clamp(28px, 5vw, 40px)",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(15, 98, 254, 0.25)",
              boxSizing: "border-box"
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
                    <span style={{ fontSize: 12, fontWeight: 500, color: "#93c5fd", letterSpacing: "0.05em", textTransform: "uppercase" }}>30 Temas</span>
                  </div>
                </div>
                <h1 style={{ fontSize: "clamp(26px, 5vw, 42px)", fontWeight: 500, color: "#ffffff", margin: "0 0 10px", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
                  Tu Camino Financiero
                </h1>
                <p style={{ fontSize: "clamp(14px, 2vw, 17px)", color: "#93c5fd", margin: "0 0 24px", lineHeight: 1.6, maxWidth: 500 }}>
                  Domina el dinero paso a paso. Desde las bases hasta invertir y emprender con confianza.
                </p>

                {/* Progress Bar Integrated */}
                <div style={{ width: "100%", maxWidth: 600 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 10 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: "#93c5fd", textTransform: "uppercase", letterSpacing: "0.05em" }}>Progreso de Cursos</span>
                      <span style={{ fontSize: 12, fontWeight: 500, color: "#60a5fa" }}>{Math.max(1, Math.floor(completedCount / 4))} de 150 cursos completados</span>
                    </div>
                    <span style={{ fontSize: 32, fontWeight: 500, color: "#fff", lineHeight: 1 }}>{progressPct}%</span>
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

              {/* Right Side: Stats */}
              <div style={{ flex: "0 1 auto", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px", minWidth: "280px" }}>
                {[
                  { label: "Temas", value: dbTopics.length.toString(), icon: GraduationCap, color: "#60a5fa" },
                  { label: "Secciones", value: dbTopics.reduce((acc, t) => acc + (t._count?.courses || 0), 0).toString(), icon: BookOpen, color: "#93c5fd" },
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
                        <div style={{ fontSize: 11, fontWeight: 500, color: "#93c5fd", textTransform: "uppercase", letterSpacing: "0.1em" }}>{stat.label}</div>
                      </div>
                      <div style={{ fontSize: 28, fontWeight: 500, color: "#fff", lineHeight: 1.1 }}>{stat.value}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Billy Insights Card */}
          <BillyInsights insight={insight} />



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
              const topics = dbTopics.map((dt, idx) => ({
                id: dt.id,
                title: dt.title,
                icon: ICON_MAP[dt.icon || "BookOpen"] || BookOpen,
                category: dt.level || "General",
                catColor: CATEGORY_COLORS[dt.level] || "#3b82f6",
                lessons: dt._count?.courses || 0,
                displayOrder: idx + 1
              }))

              const pairs: typeof topics[] = []
              for (let i = 0; i < topics.length; i += 2) pairs.push(topics.slice(i, i + 2))

              return pairs.map((pair, pairIdx) => {
                const isRTL = pairIdx % 2 === 1
                const isLastPair = pairIdx === pairs.length - 1
                const displayPair = pair
                return (
                  <React.Fragment key={pairIdx}>
                    <div className={`topics-row-container ${isRTL ? "rtl-row" : ""}`} style={{ display: "flex", flexDirection: isRTL ? "row-reverse" : "row", alignItems: "stretch", width: "100%", gap: 0, justifyContent: "center", position: "relative" }}>
                      {displayPair.map((topic, i) => {
                        const IconComp = topic.icon
                        const showArrow = i === 0 && displayPair.length > 1

                        const isPremiumTopic = topic.displayOrder > 1; // Basic sequential logic for premium
                        const isPaywalled = isPremiumTopic && !hasPremiumAccess;
                        const isSequenceLocked = false; // logic for sequence locking can be added later
                        const isLocked = isPaywalled || isSequenceLocked;

                        return (
                          <React.Fragment key={topic.id}>
                            <div
                              onClick={() => {
                                if (!dbProfile && user) return; // Prevent action until profile is loaded
                                if (isLocked) {
                                  if (hasPremiumAccess) {
                                    if (isSequenceLocked) setTopicWarning(true);
                                    return;
                                  }
                                  router.push('/payment');
                                } else {
                                  router.push(`/courses/${topic.id}`);
                                }
                              }}
                              className={`course-card-wrapper course-card-hover ${topic.id === nextTopicId ? "next-topic-glow" : ""}`}
                              style={{
                                flex: "0 1 550px",
                                minHeight: 180,
                                cursor: isLocked && !isPaywalled ? "default" : "pointer",
                                border: isLocked ? "1.5px solid rgba(148, 163, 184, 0.12)" : "1.5px solid rgba(255, 255, 255, 0.6)",
                                borderRadius: "32px",
                                background: isLocked ? "rgba(241, 245, 249, 0.8)" : "rgba(255, 255, 255, 0.75)",
                                backdropFilter: "blur(14px)",
                                WebkitBackdropFilter: "blur(14px)",
                                boxShadow: isLocked ? "none" : "0 12px 40px rgba(0, 0, 0, 0.04), inset 0 0 0 1px rgba(255,255,255,0.7)",
                                transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                                overflow: "hidden",
                                display: "flex",
                                flexDirection: "column",
                                minWidth: 0,
                                opacity: isLocked ? 0.6 : 1,
                                position: "relative"
                              }}
                            >

                              <div className="course-card-content" style={{ padding: "44px 32px", position: "relative", flex: 1, display: "flex", alignItems: "center", gap: 24 }}>
                                <div style={{ position: "absolute", top: 20, right: 24, fontSize: 11, fontWeight: 500, color: isLocked ? '#64748b' : topic.catColor, background: isLocked ? '#f1f5f9' : `${topic.catColor}16`, border: `1px solid ${isLocked ? '#cbd5e1' : `${topic.catColor}30`}`, padding: "4px 12px", borderRadius: 999, letterSpacing: "0.04em", textTransform: "uppercase" as const }}>
                                  {isLocked ? (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                      {isSequenceLocked ? 'Completar anterior' : 'Bloqueado'}
                                    </span>
                                  ) : topic.category}
                                </div>
                                <div className="course-card-icon-container" style={{ width: 68, height: 68, borderRadius: 20, flexShrink: 0, background: isLocked ? '#f1f5f9' : `${topic.catColor}14`, display: "flex", alignItems: "center", justifyContent: "center", color: isLocked ? '#64748b' : topic.catColor }}>
                                  <IconComp size={36} strokeWidth={2} />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", marginBottom: 6, letterSpacing: "0.08em", textTransform: "uppercase" }}>{topic.id.toString().replace('tema-', '').padStart(2, "0")}</div>
                                  <div style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", lineHeight: 1.15, letterSpacing: "-0.02em" }}>{topic.title}</div>
                                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, fontSize: 13, fontWeight: 500, color: isLocked ? "#64748b" : "#3b82f6" }}>
                                    <BookOpen size={16} /><span>{topic.lessons} cursos</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {showArrow && (() => {
                              const destTopic = displayPair[i + 1];
                              const isDestLocked = (destTopic.displayOrder > 1 && !hasPremiumAccess) || (destTopic.displayOrder > nextTopicId);
                              const arrowColor = isDestLocked ? "#94a3b8" : "#2563eb";
                              const strokeColor = isDestLocked ? "#cbd5e1" : "#3b82f6";

                              return (
                                <div className="topic-horizontal-arrow" style={{ display: "flex", flexDirection: "row", alignItems: "center", flexShrink: 0, padding: "0 8px", alignSelf: "center" }}>
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
                      const destTopic = nextPair[0];
                      const isDestLocked = (destTopic.displayOrder > 1 && !hasPremiumAccess) || (destTopic.displayOrder > nextTopicId);
                      const arrowColor = isDestLocked ? "#94a3b8" : "#1e3a8a";
                      const strokeColor = isDestLocked ? "#cbd5e1" : "#3b82f6";

                      return (
                        <div className="topic-vertical-arrow-container" style={{ display: "flex", width: "100%", justifyContent: "center", position: "relative" }}>
                          <div style={{
                            width: 1188,
                            display: "flex",
                            justifyContent: isRTL ? "flex-start" : "flex-end",
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
        /* Topics row: 2-per-row on desktop, 1-per-row on mobile */
        @media (max-width: 900px) {
          .topics-row-container {
            flex-direction: column !important;
            align-items: center !important;
            gap: 40px !important;
            margin-bottom: 40px !important;
          }
          .course-card-wrapper {
            flex: 1 1 100% !important;
            width: 100% !important;
            max-width: 550px !important;
          }
          .topic-horizontal-arrow, .topic-vertical-arrow-container {
            display: none !important;
          }
        }

        @media (max-width: 480px) {
          .course-card-content {
            padding: 16px 14px !important;
            gap: 10px !important;
          }
          .course-card-content div[style*="fontSize: 19"] {
            font-size: 16px !important;
          }
          .course-card-content div[style*="fontSize: 12"] {
            font-size: 10px !important;
          }
          .course-card-icon-container {
            width: 44px !important;
            height: 44px !important;
          }
          .course-card-icon-container svg {
            width: 24px !important;
            height: 24px !important;
          }
        }
          
        /* Responsive sidebar offsets */
        @media (min-width: 1161px) {
          .courses-main-content {
            padding-left: 312px !important;
            padding-right: 32px !important;
          }
        }
        @media (min-width: 768px) and (max-width: 1160px) {
          .courses-main-content {
            padding-left: 252px !important;
            padding-right: 24px !important;
          }
        }
        /* RESTORED ANIMATIONS & HOVER EFFECTS */
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .course-card-hover:not(.next-topic-glow):hover {
          border-color: rgba(15, 98, 254, 0.3) !important;
          transform: translateY(-6px) !important;
          box-shadow: 0 40px 80px -15px rgba(15, 98, 254, 0.15) !important;
        }

        .course-card-hover:active {
          transform: translateY(-1px) !important;
        }

        @keyframes topic-glow-pulse {
          0%, 100% { 
            box-shadow: 0 4px 20px rgba(15,98,254,0.08); 
            border-color: rgba(15,98,254,0.1);
          }
          50% { 
            box-shadow: 0 10px 32px rgba(37, 99, 235, 0.18), 0 0 0 1px rgba(37, 99, 235, 0.15); 
            border-color: rgba(37, 99, 235, 0.45);
          }
        }
        .next-topic-glow {
          animation: topic-glow-pulse 4s ease-in-out infinite !important;
        }

        @media (max-width: 767px) {
          .courses-main-content {
            padding-left: 16px !important;
            padding-right: 16px !important;
            padding-top: 20px !important;
            padding-bottom: calc(85px + env(safe-area-inset-bottom)) !important;
          }
        }
        
        /* Ensure app-shell and containers allow full width */
        .app-shell, .app-scroll, .app-main {
          width: 100% !important;
          max-width: 100% !important;
        }
        
          /* Content area is already offset by app-main padding in globals.css */
        `}</style>

      {/* Topic Sequence Warning Overlay */}
      {topicWarning && (
        <div
          onClick={() => setTopicWarning(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(15, 23, 42, 0.45)",
            backdropFilter: "blur(8px)",
            animation: "seqOverlayIn 0.25s ease"
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: 28,
              padding: "44px 40px 36px",
              maxWidth: 380,
              width: "90%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
              boxShadow: "0 32px 80px rgba(0,0,0,0.22)",
              animation: "seqCardIn 0.35s cubic-bezier(0.34,1.56,0.64,1)",
              position: "relative",
              overflow: "hidden",
              textAlign: "center",
            }}
          >
            {/* Top gradient bar */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg, #1e3a8a, #3b82f6, #60a5fa)" }} />

            {/* Custom SVG icon: Shield with arrow */}
            <div style={{
              width: 72, height: 72,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
              border: "2px solid #3b82f6",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0
            }}>
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Shield body */}
                <path d="M18 4L7 9v8c0 6.5 4.7 12.5 11 14 6.3-1.5 11-7.5 11-14V9L18 4z" fill="#2563eb" opacity="0.15" />
                <path d="M18 4L7 9v8c0 6.5 4.7 12.5 11 14 6.3-1.5 11-7.5 11-14V9L18 4z" stroke="#1e3a8a" strokeWidth="2" strokeLinejoin="round" fill="none" />
                {/* Steps icon inside */}
                <rect x="13" y="20" width="3" height="6" rx="1" fill="#2563eb" />
                <rect x="17" y="16" width="3" height="10" rx="1" fill="#2563eb" />
                <rect x="21" y="12" width="3" height="14" rx="1" fill="#2563eb" />
              </svg>
            </div>

            {/* Title */}
            <div style={{ fontSize: 20, fontWeight: 500, color: "#0f172a", lineHeight: 1.25 }}>
              ¡Calma!
            </div>

            {/* Body */}
            <div style={{ fontSize: 15, fontWeight: 500, color: "#64748b", lineHeight: 1.6, maxWidth: 280 }}>
              Para desbloquear este tema, primero debes completar todos los cursos del tema anterior.
            </div>

            {/* Dismiss */}
            <button
              onClick={() => setTopicWarning(false)}
              className="topic-dismiss-btn"
              style={{
                marginTop: 4,
                padding: "12px 32px",
                background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
                color: "#fff",
                border: "none", borderRadius: 12,
                fontSize: 14, fontWeight: 500,
                cursor: "pointer",
                boxShadow: "0 6px 20px rgba(37,99,235,0.35)",
                transition: "transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease, opacity 0.15s ease"
              }}
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes seqOverlayIn { 0% { opacity: 0; } 100% { opacity: 1; } }
        @keyframes seqCardIn { 0% { opacity: 0; transform: scale(0.88) translateY(20px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
        .topic-dismiss-btn:hover { transform: translateY(-3px) !important; box-shadow: 0 12px 28px rgba(37,99,235,0.45) !important; }
        .topic-dismiss-btn:active { transform: translateY(0) !important; opacity: 0.85; }
      `}</style>
    </div >
  )
}

// --- Sub-components ---

function BillyInsights({ insight }: { insight: string | null }) {
  if (!insight) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        width: "100%", maxWidth: 1188, margin: "0 auto 40px",
        background: "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(16px)",
        borderRadius: 24,
        padding: "24px 32px",
        border: "1px solid rgba(255, 255, 255, 0.8)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
        display: "flex",
        alignItems: "center",
        gap: 24,
        position: "relative",
        overflow: "hidden"
      }}
    >
      <div style={{
        width: 60, height: 60, borderRadius: "50%",
        background: "linear-gradient(135deg, #dbeafe, #eff6ff)",
        border: "2px solid #3b82f6",
        flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden"
      }}>
        <Image src="/billy_chatbot.png" alt="Billy" width={54} height={54} style={{ objectPosition: "top" }} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#2563eb", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Insight de Billy</div>
        <p style={{ fontSize: 16, color: "#1e293b", fontWeight: 500, lineHeight: 1.5, margin: 0 }}>
          {insight}
        </p>
      </div>
      {/* Decorative pulse */}
      <div style={{
        position: "absolute", right: 10, top: 10,
        width: 8, height: 8, borderRadius: "50%",
        background: "#3b82f6", opacity: 0.6,
        boxShadow: "0 0 10px #3b82f6"
      }} />
    </motion.div>
  )
}
