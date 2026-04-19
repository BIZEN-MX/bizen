"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useLessonProgress } from "@/hooks/useLessonProgress"
import { motion, AnimatePresence } from "framer-motion"
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
  const [activeTab, setActiveTab] = useState("all")
  const [topicWarning, setTopicWarning] = useState(false)
  const [showRecommendation, setShowRecommendation] = useState(false)
  const [hasDismissedRecommendation, setHasDismissedRecommendation] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [dbTopics, setDbTopics] = useState<any[]>([])
  const [insight, setInsight] = useState<string | null>(null)
  const [loadingInsight, setLoadingInsight] = useState(true)
  const [pendingTopicId, setPendingTopicId] = useState<string | null>(null)

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
      const currentPath = window.location.pathname;
      const targetPath = `/courses/${redirectId}`;
      if (currentPath !== targetPath) {
        router.replace(targetPath);
      }
    }
  }, [willRedirect, nextTopicId, router])

  // Set body and html background for this page
    useEffect(() => {
    const htmlEl = document.documentElement
    const bodyEl = document.body

    htmlEl.style.background = "#FBFAF5"
    htmlEl.style.backgroundAttachment = "scroll"
    bodyEl.style.background = "#FBFAF5"
    bodyEl.style.backgroundAttachment = "scroll"

    return () => {
      htmlEl.style.background = ""
      htmlEl.style.backgroundAttachment = ""
      bodyEl.style.background = "#FBFAF5"
      bodyEl.style.backgroundAttachment = "scroll"
    }
  }, [])


  // Show loading placeholder if data is missing OR if we are about to redirect
  // This prevents the "Overview" page from blinking for one frame before jumping to the topic.
  useEffect(() => {
    document.body.classList.add('hide-sidebar');
    return () => {
      document.body.classList.remove('hide-sidebar');
    };
  }, []);

  if (loading || loadingData || !user || (willRedirect && nextTopicId)) {
    return <PageLoader />
  }

  return (
    <div className="courses-page-active relative w-full max-w-full flex-1 bg-[#FBFAF5] overflow-visible m-0 p-0 box-border">
      {/* Decorative Orbs for Glassmorphism */}
      <div className="fixed top-[5%] -right-[5%] w-[500px] h-[500px] rounded-full pointer-events-none z-0 blur-[80px]" style={{ background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)" }} />
      <div className="fixed bottom-[5%] -left-[5%] w-[600px] h-[600px] rounded-full pointer-events-none z-0 blur-[90px]" style={{ background: "radial-gradient(circle, rgba(34,197,94,0.12) 0%, transparent 70%)" }} />
      <div className="fixed top-[40%] left-[20%] w-[450px] h-[450px] rounded-full pointer-events-none z-0 blur-[70px]" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)" }} />
      <div className="fixed bottom-[35%] right-[15%] w-[350px] h-[350px] rounded-full pointer-events-none z-0 blur-[80px]" style={{ background: "radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)" }} />
      <div className="fixed top-[40%] left-[50%] w-[500px] h-[500px] rounded-full pointer-events-none z-0 blur-[80px]" style={{ background: "radial-gradient(circle, rgba(147, 197, 253, 0.12) 0%, transparent 70%)" }} />


      <div className="courses-main-content relative w-full flex flex-col justify-start items-stretch pb-[clamp(40px,8vw,80px)] m-0 box-border bg-transparent">
        {/* Same width as course bars (800px) - progress at top, then course list */}
        <section className="relative z-10 w-full flex flex-col items-stretch m-0 p-0 box-border">
          {/* Hero Header */}
          <div
            className="courses-hero relative flex flex-col md:flex-row items-center justify-between gap-10 rounded-[40px] overflow-hidden my-8 mx-auto w-[calc(100%-48px)] max-w-[1400px] p-[clamp(32px,5vw,48px)_clamp(32px,6vw,80px)] shadow-[0_25px_60px_rgba(11,113,254,0.25)] box-border"
            style={{
              background: "linear-gradient(145deg, #0f1c3f 0%, #0B71FE 100%)",
            }}
          >
            {/* Glowing background details */}
            <div className="absolute -top-[10%] right-[10%] w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)" }} />
            <div className="absolute -bottom-[20%] left-[0%] w-[300px] h-[300px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)" }} />

            {/* Left Side: Content */}
            <div className="flex-[1_1_500px] min-w-0 relative z-10">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="bg-white/15 backdrop-blur-md rounded-full px-4 py-1.5 inline-flex items-center gap-2">
                  <Zap size={14} color="#fff" />
                  <span className="text-[13px] font-bold text-white tracking-widest uppercase">{dbTopics.length} Temas Disponibles</span>
                </div>
              </div>
              
              <h1 className="text-[clamp(32px,6vw,52px)] font-black text-white m-0 mb-3 leading-none tracking-tight">
                Tu Camino Financiero
              </h1>
              <p className="text-[clamp(15px,2vw,18px)] text-white/80 m-0 mb-8 leading-relaxed max-w-[550px] font-medium">
                Domina el dinero paso a paso. Desde las bases hasta invertir y emprender con la guía experta de Billy.
              </p>

              <div className="flex flex-wrap items-center gap-8">
                {/* Progress Circle or Bar */}
                <div className="flex-[1_1_300px] max-w-[450px]">
                  <div className="flex justify-between items-end mb-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-[13px] font-bold text-white/70 uppercase tracking-widest">Mi Progreso</span>
                      <span className="text-[14px] font-medium text-white">{completedCount} lecciones completadas</span>
                    </div>
                    <span className="text-[36px] font-black text-white leading-none">{progressPct}%</span>
                  </div>
                  <div className="w-full h-3.5 bg-white/15 rounded-full overflow-hidden border border-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPct}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full rounded-full shadow-[0_0_25px_rgba(255,255,255,0.3)]"
                      style={{
                        background: "linear-gradient(90deg, #fff 0%, #cbd5e1 100%)",
                      }}
                    />
                  </div>
                </div>

                {/* Vertical Divider */}
                <div className="w-px h-[60px] bg-white/20 hidden md:block hero-divider" />

                {/* Stats Grid */}
                <div className="flex gap-6">
                   <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-white/70">
                        <GraduationCap size={16} />
                        <span className="text-[11px] font-bold uppercase tracking-widest">Temas</span>
                      </div>
                      <div className="text-[28px] font-bold text-white">{dbTopics.length}</div>
                   </div>
                   <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-white/70">
                        <BookOpen size={16} />
                        <span className="text-[11px] font-bold uppercase tracking-widest">Secciones</span>
                      </div>
                      <div className="text-[28px] font-bold text-white">{dbTopics.reduce((acc, t) => acc + (t._count?.courses || 0), 0)}</div>
                   </div>
                </div>
              </div>
            </div>


          </div>

          {/* ── BILLY INSIGHT SECTION ────────────────────────────────────────── */}
          {(insight || loadingInsight) && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="w-full max-w-none mx-auto mb-8 box-border px-6"
            >
              <div className="bg-white/70 backdrop-blur-xl rounded-3xl py-4 px-5 border border-white/80 shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex items-center gap-4">
                <div className="w-[52px] h-[52px] flex items-center justify-center shrink-0 relative">
                  <Image 
                    src="/billy_chatbot.png" 
                    alt="Billy" 
                    width={52} 
                    height={52} 
                    className={`object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.08)] ${loadingInsight ? "opacity-60" : "opacity-100"}`}
                  />
                  {loadingInsight && (
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute inset-0 rounded-full bg-blue-500/20"
                    />
                  )}
                </div>
                <div className="flex-1">
                  {loadingInsight && !insight ? (
                    <div className="flex flex-col gap-1.5">
                      <div className="skeleton-pulse h-3.5 w-4/5 bg-black/5 rounded" />
                      <div className="skeleton-pulse h-3.5 w-[60%] bg-black/5 rounded" />
                    </div>
                  ) : (
                    <div className="text-[clamp(13px,1.6vw,15px)] text-slate-800 leading-relaxed font-medium">
                      &quot;{insight?.replace(/\*/g, '')}&quot;
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Topics Path — 2-per-row snake/zigzag layout */}
          <section
            className="w-full max-w-none m-0 mb-[clamp(32px,6vw,48px)] pb-10 flex flex-col items-stretch"
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
                displayOrder: idx + 1,
                bannerUrl: dt.bannerUrl
              }))

              if (dbTopics.length === 0 && !loadingData) {
                return (
                  <div className="text-center py-16 px-5 bg-white/50 rounded-3xl border border-dashed border-slate-200 mx-5">
                    <div className="mb-4">
                      <Skull size={40} className="text-slate-300" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-[18px] font-semibold text-slate-800 m-0 mb-2">Sin temas disponibles</h3>
                    <p className="text-[14px] text-slate-500 max-w-[300px] mx-auto m-0">
                      No hemos podido cargar los cursos en este momento. Por favor, intenta recargar la página.
                    </p>
                    <button 
                      onClick={() => setRefreshKey(k => k + 1)}
                      className="mt-5 px-5 py-2.5 bg-blue-600 text-white border-none rounded-xl cursor-pointer font-medium hover:bg-blue-700 transition"
                    >
                      Reintentar
                    </button>
                  </div>
                )
              }

              return (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6 w-full max-w-none px-6">
                  {allTopics.map((topic) => {
                    const isDnaSpecialist = dbProfile?.adnProfile === "Billy Inversionista";
                    const isDnaRecommended = isDnaSpecialist && (topic.id === "tema-09" || topic.id === "tema-10");
                    const isDnaSkipped = isDnaSpecialist && (topic.id === "tema-06" || topic.id === "tema-07" || topic.id === "tema-08");

                    // Topics are now unlocked at entry level to allow access to the first 3 free lessons
                    const isAlwaysUnlocked = true;
                    const isPremiumTopic = topic.displayOrder > 4; // Visual indicator only
                    const isPaywalled = isPremiumTopic && !hasPremiumAccess;
                    const isSequenceLocked = false; 
                    const isLocked = false; // Paywall is now handled inside each topic/lesson level

                    return (
                      <motion.div
                        key={topic.id}
                        whileHover={{ y: -5, scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        onClick={() => {
                          if (!dbProfile && user) return;

                          // BILLY RECOMMENDATION LOGIC:
                          // If theme 1 is not completed, and they click on themes 2, 3, or 4
                          const introTopicLessons = SUBTEMAS_BY_COURSE[0]?.flatMap(s => s.lessons.map(l => l.slug)) || [];
                          const isIntroCompleted = introTopicLessons.length > 0 && introTopicLessons.every(slug => completedLessons.includes(slug));
                          const isInitialUnlockedTopic = topic.displayOrder > 1 && topic.displayOrder <= 4;

                          if (!isIntroCompleted && isInitialUnlockedTopic && !hasDismissedRecommendation) {
                            setPendingTopicId(topic.id);
                            setShowRecommendation(true);
                            return;
                          }

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
                          background: isLocked 
                            ? `linear-gradient(135deg, rgba(241, 245, 249, 0.8), rgba(241, 245, 249, 0.4))`
                            : (isDnaRecommended 
                                ? "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)" 
                                : `rgba(255, 255, 255, 0.8)`),
                          borderColor: isLocked 
                            ? "rgba(255, 255, 255, 0.6)" 
                            : (isDnaRecommended 
                                ? "#60a5fa" 
                                : `rgba(255, 255, 255, 0.8)`),
                          boxShadow: isDnaRecommended 
                            ? "0 20px 40px rgba(37, 99, 235, 0.2)" 
                            : "0 10px 30px rgba(0, 0, 0, 0.03)",
                        }}
                        className={`cursor-pointer rounded-3xl border-[1.5px] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden p-6 flex flex-col justify-between min-h-[220px] relative ${isDnaSkipped ? "opacity-60" : (isLocked ? "opacity-80" : "opacity-100")} ${topic.id === nextTopicId && !isDnaRecommended ? "next-topic-glow" : (isDnaRecommended ? "adn-glow-pulse border-[2px]" : "")}`}
                      >
                        {/* Mascot Banner */}
                        {topic.bannerUrl && (
                          <div className={`absolute -bottom-1 -right-1 w-[120px] h-[120px] z-0 pointer-events-none -rotate-[5deg] ${isLocked ? "opacity-20" : "opacity-90"}`}>
                            <Image 
                              src={topic.bannerUrl} 
                              alt={topic.title} 
                              width={120} 
                              height={120} 
                              style={{ objectFit: "contain" }}
                            />
                          </div>
                        )}

                        <div className="relative z-10">
                           <div className="flex justify-between items-start mb-3">
                             <div 
                               className="w-12 h-12 rounded-[14px] flex items-center justify-center"
                               style={{ background: isDnaRecommended ? "rgba(255,255,255,0.15)" : `${topic.catColor}15` }}
                             >
                               <topic.icon size={24} color={isDnaRecommended ? "#fff" : topic.catColor} />
                             </div>
                             <div className={`text-[11px] font-bold tracking-widest ${isDnaRecommended ? "text-blue-300" : "text-slate-400"}`}>
                                #{topic.displayOrder.toString().padStart(2, "0")}
                             </div>
                           </div>

                           <h3 
                             className={`text-[20px] font-bold m-0 mb-2 leading-tight ${isDnaRecommended ? "text-white" : "text-slate-800"}`}
                             style={{ maxWidth: topic.bannerUrl ? "75%" : "100%" }}
                           >
                             {topic.title}
                           </h3>
                           
                           {isDnaRecommended && (
                             <div className="flex items-center gap-1.5 text-[11px] text-blue-300 font-semibold mb-3">
                               <Sparkles size={14} /> RECOMENDADO BILLY ADN
                             </div>
                           )}
                        </div>

                        <div className="flex items-center gap-3 mt-auto relative z-10">
                          <div 
                            className={`text-[10px] font-bold py-1 px-2.5 rounded-lg uppercase ${isDnaRecommended ? "text-white bg-white/20" : ""}`}
                            style={!isDnaRecommended ? { color: topic.catColor, background: `${topic.catColor}15` } : undefined}
                          >
                            {isPaywalled ? "Premium" : topic.category}
                          </div>
                          <div className={`flex items-center gap-1.5 text-[12px] ${isDnaRecommended ? "text-white/80" : "text-slate-500"}`}>
                            <BookOpen size={16} color={isDnaRecommended ? "#fff" : topic.catColor} />
                            <span>{topic.lessons} cursos</span>
                          </div>
                        </div>

                        {isLocked && (
                          <div className="absolute top-3 right-3">
                            {isPaywalled ? <Sparkles size={16} color="#f59e0b" /> : <Zap size={16} color="#94a3b8" opacity={0.5} />}
                          </div>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              )
            })()}
          </section>
        </section>
      </div >

      {/* ── RECOMMENDATION MODAL ────────────────────────────────────────── */}
      <AnimatePresence>
        {showRecommendation && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-blue-600/20 backdrop-blur-md z-[9999] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[40px] pt-12 px-10 pb-10 max-w-[480px] w-full text-center relative shadow-[0_30px_60px_rgba(0,0,0,0.12)] border border-blue-600/10"
            >
              {/* Image */}
              <div className="relative w-[200px] h-[200px] mx-auto mb-6">
                <Image 
                  src="/courses-banners/recommendation.png" 
                  alt="Recomendación Billy" 
                  fill 
                  className="object-contain"
                />
              </div>

              <h2 className="text-[28px] font-extrabold text-blue-900 m-0 mb-3 leading-[1.2]">
                ¡Empecemos Bien! 🚀
              </h2>
              <p className="text-[16px] text-slate-500 leading-relaxed mb-8">
                Billy me recomendó que inicies por el curso de <strong className="text-blue-600">Introducción a las Finanzas</strong> para que domines los cimientos antes de avanzar.
              </p>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => router.push('/courses/tema-01')}
                  className="p-4 bg-blue-600 text-white border-none rounded-2xl text-[16px] font-bold cursor-pointer shadow-[0_10px_20px_rgba(11,113,254,0.2)] hover:-translate-y-0.5 transition-transform"
                >
                  Ir al curso recomendado
                </button>
                <button 
                  onClick={() => {
                    setShowRecommendation(false)
                    setHasDismissedRecommendation(true)
                    if (pendingTopicId) {
                      router.push(`/courses/${pendingTopicId}`)
                    }
                  }}
                  className="p-4 bg-blue-600/5 text-slate-500 border-none rounded-2xl text-[15px] font-semibold cursor-pointer hover:bg-blue-600/10 transition-colors"
                >
                   Continuar de todos modos
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        /* Responsive Grid: Stack on mobile */
        @media (max-width: 900px) {
          .courses-page-active div[style*="gridTemplateColumns"] {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
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
            padding-top: 0 !important;
          }
        }
        @media (min-width: 768px) and (max-width: 1160px) {
          .courses-main-content {
            padding-left: 28px !important;
            padding-right: 28px !important;
            padding-top: 0 !important;
          }
        }
        /* RESTORED ANIMATIONS & HOVER EFFECTS */
        .skeleton-pulse {
          animation: skeleton-pulse-fade 1.5s ease-in-out infinite;
        }
        @keyframes skeleton-pulse-fade {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

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

        @keyframes adn-glow-pulse {
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
        .adn-glow-pulse {
          animation: adn-glow-pulse 3s ease-in-out infinite !important;
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
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/40 backdrop-blur-md animate-[seqOverlayIn_0.25s_ease]"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-[28px] py-10 px-8 max-w-[380px] w-[90%] flex flex-col items-center gap-5 shadow-[0_32px_80px_rgba(0,0,0,0.22)] animate-[seqCardIn_0.35s_cubic-bezier(0.34,1.56,0.64,1)] relative overflow-hidden text-center"
          >
            {/* Top gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-900 via-blue-500 to-blue-400" />

            {/* Mascot Image */}
            <div className="w-[120px] h-[120px] relative -mb-2.5">
              <Image 
                src="/image copy 3.png" 
                alt="Billy" 
                fill 
                className="object-contain"
              />
            </div>



            {/* Title */}
            <div className="text-[20px] font-medium text-slate-900 leading-tight">
              ¡Calma!
            </div>

            {/* Body */}
            <div className="text-[15px] font-medium text-slate-500 leading-relaxed max-w-[280px]">
              Para desbloquear este tema, primero debes completar todos los cursos del tema anterior.
            </div>

            {/* Dismiss */}
            <button
              onClick={() => setTopicWarning(false)}
              className="mt-1 px-8 py-3 bg-gradient-to-br from-blue-900 to-blue-500 text-white border-none rounded-xl text-[14px] font-medium cursor-pointer shadow-[0_6px_20px_rgba(37,99,235,0.35)] transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-[3px] hover:shadow-[0_12px_28px_rgba(37,99,235,0.45)] active:translate-y-0 active:opacity-85"
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


