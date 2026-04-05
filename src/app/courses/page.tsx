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
  GraduationCap,
  Sparkles,
  Dna
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
const APPROX_TOTAL_LESSONS = 450

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
        className="courses-main-content"
        style={{
          paddingTop: "clamp(72px, 9vw, 88px)",
          paddingBottom: "clamp(40px, 8vw, 80px)",
          paddingLeft: "clamp(16px, 3vw, 56px)",
          paddingRight: "clamp(16px, 3vw, 56px)",
          background: "transparent",
          position: "relative",
          display: "flex",
          justifyContent: "center", // Changed from flex-start to center for better mobile alignment
          alignItems: "flex-start",
          marginBottom: 0,
          boxSizing: "border-box",
          width: "100%"
        }}>
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
              padding: "clamp(24px, 4vw, 40px) clamp(22px, 4vw, 36px)",
              width: "100%",
              maxWidth: 1188,
              margin: "0 auto clamp(20px, 4vw, 32px)",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(15, 98, 254, 0.25)",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column"
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
                      <span style={{ fontSize: 13, fontWeight: 500, color: "#93c5fd", textTransform: "uppercase", letterSpacing: "0.05em" }}>Progreso de Lecciones</span>
                      <span style={{ fontSize: 12, fontWeight: 500, color: "#60a5fa" }}>{completedCount} de 450 lecciones completadas</span>
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
                        padding: "16px 20px",
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

          {/* ── BILLY INSIGHT SECTION ────────────────────────────────────────── */}
          {insight && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{ 
                width: "100%", 
                maxWidth: 1188, 
                margin: "0 auto 32px", 
                boxSizing: "border-box",
              }}
            >
              <div style={{ 
                background: "rgba(255, 255, 255, 0.7)", 
                backdropFilter: "blur(20px)", 
                borderRadius: 24, 
                padding: "16px 20px", 
                border: "1px solid rgba(255, 255, 255, 0.8)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
                display: "flex",
                alignItems: "center",
                gap: 16
              }}>
                <div style={{ 
                  width: 52, 
                  height: 52, 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  flexShrink: 0,
                  position: "relative"
                }}>
                  <Image 
                    src="/billy_chatbot.png" 
                    alt="Billy" 
                    width={52} 
                    height={52} 
                    style={{ 
                      objectFit: "contain",
                      filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.08))"
                    }} 
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontSize: "clamp(13px, 1.6vw, 15px)", 
                    color: "#1e293b", 
                    lineHeight: 1.5,
                    fontWeight: 500
                  }}>
                    &quot;{insight.replace(/\*/g, '')}&quot;
                  </div>
                </div>
              </div>
            </motion.div>
          )}

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
              const allTopics = dbTopics.map((dt, idx) => ({
                id: dt.id,
                title: dt.title,
                icon: ICON_MAP[dt.icon || "BookOpen"] || BookOpen,
                category: dt.level || "General",
                catColor: CATEGORY_COLORS[dt.level] || "#3b82f6",
                lessons: dt._count?.courses || 0,
                displayOrder: idx + 1
              }))

              const coreTopics = allTopics.slice(0, 5);
              const advancedTopics = allTopics.slice(5);

              const renderSection = (topics: typeof allTopics, title: string, subtitle: string, startIndex: number) => {
                const totalTopics = topics.length;

                return (
                  <div key={title} style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "stretch", marginBottom: 60 }}>
                    <div style={{ textAlign: "center" as const, marginBottom: 40, padding: "0 20px" }}>
                      <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
                        <h2 className="phase-title-shimmer" style={{ 
                          fontSize: "clamp(24px, 5vw, 32px)", 
                          fontWeight: 900, 
                          color: "#1e3a8a", 
                          margin: 0,
                          background: "linear-gradient(90deg, #1e3a8a 0%, #3b82f6 50%, #1e3a8a 100%)",
                          backgroundSize: "200% auto",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          letterSpacing: "-0.03em"
                        }}>{title}</h2>
                        <div style={{ width: 60, height: 4, background: "linear-gradient(90deg, #3b82f6, #60a5fa)", borderRadius: 2, marginTop: 12, marginBottom: 12, boxShadow: "0 2px 10px rgba(59, 130, 246, 0.3)" }} />
                        <p style={{ fontSize: "clamp(13px, 1.8vw, 15px)", color: "#64748b", margin: 0, fontWeight: 500, letterSpacing: "0.02em" }}>{subtitle}</p>
                      </div>
                    </div>

                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 1fr)",
                      gap: "40px 60px",
                      width: "100%",
                      maxWidth: "1100px",
                      margin: "0 auto",
                      position: "relative",
                      padding: "0 20px"
                    }}>
                      {topics.map((topic, idx) => {
                        const globalIdx = startIndex + idx;
                        const rowIdx = Math.floor(idx / 2);
                        const isEvenRow = rowIdx % 2 === 0;
                        const isLastInRow = idx % 2 === 1;
                        const isLastTopic = idx === topics.length - 1;
                        const isOrphan = isLastTopic && idx % 2 === 0;

                        // SPECIALIZATION LOGIC: DNA Bypass
                        const isDnaSpecialist = dbProfile?.dnaProfile === "Billy Inversionista";
                        const isDnaRecommended = isDnaSpecialist && (topic.id === "tema-09" || topic.id === "tema-10");
                        const isDnaSkipped = isDnaSpecialist && (topic.id === "tema-06" || topic.id === "tema-07" || topic.id === "tema-08");

                        // Determine visual position in grid
                        let gridColumn = (idx % 2) + 1;
                        if (!isEvenRow) {
                          gridColumn = idx % 2 === 0 ? 2 : 1; 
                        }

                        // If it's an orphan, center it across both columns
                        const gridColValue = isOrphan ? "1 / span 2" : gridColumn.toString();

                        const isPremiumTopic = topic.displayOrder > 1;
                        const isPaywalled = isPremiumTopic && !hasPremiumAccess;
                        const isSequenceLocked = false; // Bloqueo de secuencia desactivado para pruebas
                        
                        // LOCKED if (paywalled OR out of order) AND NOT (unlocked by DNA)
                        const isLocked = (isPaywalled || isSequenceLocked) && !isDnaRecommended;

                        return (
                          <React.Fragment key={topic.id}>
                            <motion.div
                              whileHover={{ y: -5, scale: 1.01 }}
                              transition={{ type: "spring", stiffness: 400, damping: 17 }}
                              onClick={() => {
                                if (!dbProfile && user) return;
                                if (isLocked) {
                                  if (isSequenceLocked) {
                                    setTopicWarning(true);
                                    return;
                                  }
                                  if (isPaywalled) {
                                    router.push('/payment');
                                    return;
                                  }
                                } else {
                                  router.push(`/courses/${topic.id}`);
                                }
                              }}
                              style={{
                                gridColumn: gridColValue,
                                justifySelf: isOrphan ? "center" : "stretch",
                                width: isOrphan ? "100%" : "auto",
                                maxWidth: isOrphan ? "550px" : "100%",
                                gridRow: rowIdx + 1,
                                minHeight: 180,
                                cursor: "pointer",
                                borderRadius: "24px",
                                background: isLocked 
                                  ? `linear-gradient(135deg, rgba(241, 245, 249, 0.8), rgba(241, 245, 249, 0.4))`
                                  : (isDnaRecommended 
                                      ? "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)" 
                                      : `linear-gradient(135deg, rgba(255, 255, 255, 0.8), ${topic.catColor}15)`),
                                backgroundColor: isLocked ? "rgba(241, 245, 249, 0.6)" : "rgba(255, 255, 255, 0.3)",
                                backdropFilter: "blur(20px)",
                                WebkitBackdropFilter: "blur(20px)",
                                border: isLocked 
                                  ? "1.5px solid rgba(255, 255, 255, 0.6)" 
                                  : (isDnaRecommended 
                                      ? "2px solid #60a5fa" 
                                      : `1.5px solid ${topic.catColor}30`),
                                boxShadow: isDnaRecommended 
                                  ? "0 20px 40px rgba(37, 99, 235, 0.3)" 
                                  : (isLocked ? "none" : "0 10px 30px rgba(0, 0, 0, 0.03)"),
                                transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                                overflow: "hidden",
                                display: "flex",
                                flexDirection: "column",
                                position: "relative",
                                opacity: isDnaSkipped ? 0.6 : (isLocked ? 0.8 : 1),
                                pointerEvents: "auto",
                                zIndex: 2
                              }}
                              className={topic.id === nextTopicId && !isDnaRecommended ? "next-topic-glow" : (isDnaRecommended ? "dna-glow-pulse" : "")}
                            >
                              <div style={{ padding: "22px 24px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                                  <div style={{ fontSize: 11, fontWeight: 400, color: isDnaRecommended ? "#93c5fd" : "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                                    TEMA {topic.displayOrder.toString().padStart(2, "0")}
                                  </div>
                                  <div style={{ 
                                    fontSize: 10, 
                                    fontWeight: 400, 
                                    color: isDnaRecommended ? "#fff" : (isLocked ? '#64748b' : topic.catColor), 
                                    background: isDnaRecommended ? "rgba(255,255,255,0.2)" : (isLocked ? 'rgba(255,255,255,0.4)' : `${topic.catColor}15`), 
                                    padding: "4px 10px", 
                                    borderRadius: 999, 
                                    textTransform: "uppercase",
                                    border: `1px solid ${isDnaRecommended ? "rgba(255,255,255,0.3)" : (isLocked ? 'rgba(0,0,0,0.05)' : `${topic.catColor}30`)}`,
                                    backdropFilter: "blur(10px)",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6
                                  }}>
                                    {isDnaRecommended && <Dna size={12} color="#60a5fa" />}
                                    {isDnaRecommended ? "Billy DNA Recomendado" : (isPaywalled ? 'Premium' : topic.category)}
                                  </div>
                                </div>
                                
                                <h3 style={{ fontSize: 22, fontWeight: 500, color: isDnaRecommended ? "#fff" : "#1e293b", margin: 0, lineHeight: 1.3 }}>{topic.title}</h3>
                                {isDnaSkipped && (
                                  <div style={{ fontSize: 11, fontWeight: 400, color: "#64748b", marginTop: 8, display: "flex", alignItems: "center", gap: 4 }}>
                                    <Sparkles size={12} color={topic.catColor} /> BILLY DNA: NIVEL DOMINADO
                                  </div>
                                )}
                                
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 24, fontSize: 13, color: isDnaRecommended ? "rgba(255,255,255,0.8)" : "#64748b" }}>
                                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: 8, background: isDnaRecommended ? "rgba(255,255,255,0.15)" : (isLocked ? "rgba(255,255,255,0.4)" : `${topic.catColor}15`), border: `1px solid ${isDnaRecommended ? "rgba(255,255,255,0.2)" : (isLocked ? 'rgba(0,0,0,0.05)' : `${topic.catColor}30`)}` }}>
                                    <BookOpen size={16} color={isDnaRecommended ? "#fff" : (isLocked ? "#94a3b8" : topic.catColor)} />
                                  </div>
                                  <span style={{ fontWeight: 400 }}>{topic.lessons} cursos disponibles</span>
                                </div>
                              </div>
                              {isLocked && (
                                <div style={{ position: "absolute", bottom: 12, right: 12 }}>
                                  {isPaywalled ? <Sparkles size={16} color="#f59e0b" /> : <Zap size={16} color="#94a3b8" opacity={0.5} />}
                                </div>
                              )}
                            </motion.div>

                            {/* Connection Arrow Logic */}
                            {!isLastTopic && (() => {
                              const nextTopic = topics[idx + 1];
                              const isTurnRow = (idx + 1) % 2 === 0; // Turn row every 2 topics
                              const isDestLocked = (nextTopic.displayOrder > 1 && !hasPremiumAccess); // Solo bloqueado si es premium y no tiene acceso, no por secuencia
                              const arrowColor = isDestLocked ? "#cbd5e1" : "#3b82f6";
                              const isRightToLeft = !isEvenRow;

                              if ((idx + 1) % 2 !== 0) {
                                // Horizontal arrow between columns
                                return (
                                  <div style={{
                                    position: "absolute",
                                    top: `calc(${rowIdx * 220}px + 90px)`, // Rough center of card
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    width: 60,
                                    height: 20,
                                    zIndex: 1,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center"
                                  }}>
                                    <svg width="40" height="20" viewBox="0 0 40 20" fill="none">
                                      {isRightToLeft ? (
                                        <path d="M15 5L5 10L15 15M35 10H7" stroke={arrowColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                      ) : (
                                        <path d="M25 5L35 10L25 15M5 10H33" stroke={arrowColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                      )}
                                    </svg>
                                  </div>
                                );
                              } else {
                                // Vertical arrow between rows
                                // If row 0, arrow is on Right (idx 1 down to 2)
                                // If row 1, arrow is on Left (idx 3 down to 4)
                                const isArrowOnRight = isEvenRow; 
                                
                                // Special case: if next topic is an orphan, center the arrow
                                const isNextOrphan = (idx + 1) === topics.length - 1 && (idx + 1) % 2 === 0;

                                return (
                                  <div style={{
                                    position: "absolute",
                                    top: `calc(${rowIdx * 220}px + 180px)`,
                                    left: isNextOrphan ? "50%" : (isArrowOnRight ? "calc(75% + 10px)" : "calc(25% - 10px)"),
                                    transform: "translateX(-50%)",
                                    height: 40,
                                    width: 20,
                                    zIndex: 1
                                  }}>
                                    <svg width="20" height="40" viewBox="0 0 20 40" fill="none">
                                      <path d="M5 25L10 35L15 25M10 5V33" stroke={arrowColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                  </div>
                                );
                              }
                            })()}
                          </React.Fragment>
                        )
                      })}
                    </div>
                  </div>
                )
              }

              return [
                renderSection(coreTopics, "Fase 1: Cimientos (Tronco Común)", "Los 5 pilares fundamentales para dominar el dinero.", 0),
                <div key="separator" style={{ width: "100%", display: "flex", justifyContent: "center", marginBottom: 60, marginTop: -40 }}>
                   <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 2, height: 40, background: "linear-gradient(to bottom, #3b82f6, transparent)" }} />
                      <Sparkles size={24} color="#3b82f6" opacity={0.5} />
                      <div style={{ width: 2, height: 40, background: "linear-gradient(to top, #6366f1, transparent)" }} />
                   </div>
                </div>,
                renderSection(advancedTopics, "Fase 2: Especialización DNA", "Rutas personalizadas basadas en tu perfil analítico y metas personales.", 5)
              ]
            })()}
          </section>
        </section>
      </div >

      <style>{`
        /* Responsive Grid: Stack on mobile */
        @media (max-width: 900px) {
          .courses-page-active div[style*="gridTemplateColumns"] {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          
          /* Hide connection arrows on mobile stack */
          .courses-page-active svg[width="40"],
          .courses-page-active svg[width="20"] {
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
          
        /* Top nav aware offsets (sidebar removed)
           all sizes now get consistent horizontal padding */
        @media (min-width: 1161px) {
          .courses-main-content {
            padding-left: clamp(32px, 4vw, 56px) !important;
            padding-right: clamp(32px, 4vw, 56px) !important;
            padding-top: 88px !important;
          }
        }
        @media (min-width: 768px) and (max-width: 1160px) {
          .courses-main-content {
            padding-left: 28px !important;
            padding-right: 28px !important;
            padding-top: 84px !important;
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

        @keyframes dna-glow-pulse {
          0%, 100% { 
            box-shadow: 0 10px 30px rgba(37, 99, 235, 0.2), 0 0 0 0px rgba(96, 165, 250, 0); 
            border-color: #60a5fa;
            transform: translateY(-5px) scale(1.01);
          }
          50% { 
            box-shadow: 0 25px 50px rgba(37, 99, 235, 0.4), 0 0 0 4px rgba(96, 165, 250, 0.2); 
            border-color: #93c5fd;
            transform: translateY(-8px) scale(1.02);
          }
        }
        .dna-glow-pulse {
          animation: dna-glow-pulse 3s ease-in-out infinite !important;
        }

        .phase-title-shimmer {
          animation: titleShimmer 3s linear infinite;
        }

        @keyframes titleShimmer {
          to { background-position: 200% center; }
        }

        @media (max-width: 767px) {
          .courses-main-content {
            padding-top: 74px !important;
            padding-bottom: calc(85px + env(safe-area-inset-bottom)) !important;
          }
          .courses-hero {
            padding: 24px 20px !important; // More compact
            margin-bottom: 24px !important;
          }
          .courses-hero h1 {
            font-size: 26px !important;
            margin-bottom: 8px !important;
          }
          .courses-hero p {
            font-size: 14px !important;
            margin-bottom: 20px !important;
          }
          .courses-hero > div:first-of-type {
            flex-direction: column !important;
            gap: 24px !important;
          }
          .courses-hero > div:first-of-type > div:first-child {
            flex: initial !important;
            width: 100% !important;
          }
          .courses-hero > div:first-of-type > div:last-child {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            width: 100% !important;
            min-width: unset !important;
          }
          .courses-hero > div:first-of-type > div:last-child > div {
            padding: 14px !important;
            border-radius: 16px !important;
          }
          .courses-hero > div:first-of-type > div:last-child > div div[style*="fontSize: 28"] {
            font-size: 22px !important;
          }
          
          .topic-row-container {
            gap: 16px !important;
          }
          .course-card-wrapper {
            border-radius: 24px !important;
          }
          .course-card-content {
            padding: 24px 20px !important;
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

            {/* Mascot Image */}
            <div style={{ width: 120, height: 120, position: 'relative', marginBottom: -10 }}>
              <Image 
                src="/image copy 3.png" 
                alt="Billy" 
                fill 
                style={{ objectFit: 'contain' }}
              />
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


