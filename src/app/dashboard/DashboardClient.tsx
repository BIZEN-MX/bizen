"use client"

import React, { useEffect, useState, useMemo, useCallback, useRef, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Billy } from "@/components/Billy"
import { useAuth } from "@/contexts/AuthContext"

import PageLoader from "@/components/PageLoader"
import DailyChallengeWidget from "@/components/DailyChallengeWidget"
import { SUBTEMAS_BY_COURSE } from "@/data/lessons/courseLessonsOrder"
import { Palette, ShoppingBag, Send, Search, Loader2, Check, X, History, ArrowUpRight, ArrowDownLeft, Flame, Shield, Target, Coins, BookOpen, TrendingUp, BrainCircuit, ChevronRight, RefreshCw, Newspaper } from "lucide-react"
import BizenVirtualCard from "@/components/BizenVirtualCard"
import DNAEvolutionScreen from "@/components/bizen/DNAEvolutionScreen"
import BillyLabWidget from "@/components/bizen/BillyLabWidget"
import TransactionHistoryModal from "@/components/bizen/TransactionHistoryModal"
import InvestmentsWidget from "@/components/InvestmentsWidget"

// ─────────────────────────────────────────────────────────────────
// CUSTOM SVG ICON COMPONENTS
// ─────────────────────────────────────────────────────────────────
const IcoGrid = ({ size = 24, color = "currentColor", strokeWidth = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
  </svg>
)

const IcoWave = ({ size = 40, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <path d="M8 24 C10 20 14 16 18 20 C22 24 26 20 30 16" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="20" cy="10" r="4" fill={color} fillOpacity="0.85"/>
    <path d="M16 14 L20 20 L24 14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
)


const IcoBook = ({ size = 24, color = "currentColor", strokeWidth = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    <line x1="9" y1="7" x2="15" y2="7"/>
    <line x1="9" y1="11" x2="13" y2="11"/>
  </svg>
)

const IcoCoin = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.5"/>
    <path d="M12 7v10M9.5 9.5h3.75a1.75 1.75 0 0 1 0 3.5H10.5a1.75 1.75 0 0 0 0 3.5H14" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const IcoTarget = ({ size = 24, color = "currentColor", strokeWidth = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="6"/>
    <circle cx="12" cy="12" r="2"/>
    <line x1="12" y1="2" x2="12" y2="6"/>
    <line x1="12" y1="18" x2="12" y2="22"/>
    <line x1="2" y1="12" x2="6" y2="12"/>
    <line x1="18" y1="12" x2="22" y2="12"/>
  </svg>
)

const IcoChart = ({ size = 24, color = "currentColor", strokeWidth = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
)

const IcoZap = ({ size = 22, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
  </svg>
)

const IcoStore = ({ size = 24, color = "currentColor", strokeWidth = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
)

const IcoUsers = ({ size = 24, color = "currentColor", strokeWidth = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)

const IcoTrophy = ({ size = 24, color = "currentColor", strokeWidth = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="8 21 12 21 16 21"/>
    <line x1="12" y1="17" x2="12" y2="21"/>
    <path d="M7 4H17a4 4 0 0 1 4 4v3a8 8 0 0 1-8 8 8 8 0 0 1-8-8V8a4 4 0 0 1 4-4Z"/>
    <path d="M3 7v3M21 7v3"/>
  </svg>
)

const IcoUser = ({ size = 24, color = "currentColor", strokeWidth = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)

const IcoArrowRight = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
)

const IcoCheck = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

const IcoMap = ({ size = 24, color = "currentColor", strokeWidth = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
    <line x1="9" y1="3" x2="9" y2="18"/>
    <line x1="15" y1="6" x2="15" y2="21"/>
  </svg>
)

const IcoCalendar = ({ size = 20, color = "currentColor", strokeWidth = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)

const IcoStar = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} fillOpacity="0.9">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
)

const IcoShield = ({ size = 20, color = "currentColor", strokeWidth = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)

const IcoGamepad = ({ size = 24, color = "currentColor", strokeWidth = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <line x1="6" y1="12" x2="10" y2="12"/>
    <line x1="8" y1="10" x2="8" y2="14"/>
    <line x1="15" y1="13" x2="15.01" y2="13"/>
    <line x1="18" y1="11" x2="18.01" y2="11"/>
    <rect x="2" y="6" width="20" height="12" rx="6"/>
  </svg>
)

// ─────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────
interface Stats {
  xp: number; level: number; xpInCurrentLevel: number; xpNeeded: number
  xpToNextLevel: number; lessonsCompleted: number; coursesEnrolled: number
  currentStreak: number; certificatesCount: number; bizcoins: number
  weeklyActiveDays: string[]
}
interface Topic {
  id: string; title: string; icon?: string; level?: string
  courses?: { id: string; title: string; order: number }[]
  _count?: { courses?: number }
}

// ─────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return "Buenos días"
  if (h < 18) return "Buenas tardes"
  return "Buenas noches"
}

function weekDays() {
  const today = new Date()
  const dow   = today.getDay()
  const mon   = new Date(today)
  mon.setDate(today.getDate() - ((dow + 6) % 7))
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(mon); d.setDate(mon.getDate() + i)
    return d.toISOString().split("T")[0]
  })
}

const DAY_LABELS  = ["L", "M", "M", "J", "V", "S", "D"]
const TOPIC_COLORS: Record<string, string> = {
  Fundamentos: "#0F62FE", Presupuesto: "#0ea5e9", Ahorro: "#10b981",
  Deuda: "#4f46e5", Impuestos: "#6366f1", Economía: "#8b5cf6",
  Inversión: "#2563eb", Patrimonio: "#059669", Errores: "#7c3aed",
  Mentalidad: "#0891b2", Emprender: "#3b82f6", Negocios: "#6366f1",
  Bienestar: "#ec4899", Resiliencia: "#1d4ed8", Futuro: "#0ea5e9",
}

// ─────────────────────────────────────────────────────────────────
// XP RING
// ─────────────────────────────────────────────────────────────────
function XPRing({ pct, level }: { pct: number; level: number }) {
  const r = 46, circ = 2 * Math.PI * r, filled = circ * Math.min(pct / 100, 1)
  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <defs>
        <linearGradient id="xpRingG" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa"/>
          <stop offset="50%" stopColor="#a78bfa"/>
          <stop offset="100%" stopColor="#f472b6"/>
        </linearGradient>
        <filter id="xpGlow">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {/* track */}
      <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="9"/>
      {/* filled arc */}
      <circle
        cx="60" cy="60" r={r} fill="none"
        stroke="url(#xpRingG)" strokeWidth="9"
        strokeLinecap="round"
        strokeDasharray={`${filled} ${circ}`}
        strokeDashoffset={circ * 0.25}
        transform="rotate(-90 60 60)"
        filter="url(#xpGlow)"
        style={{ transition: "stroke-dasharray 1.4s cubic-bezier(0.34,1.56,0.64,1)" }}
      />
      {/* level number */}
      <text x="60" y="45" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9" fontWeight="800" style={{ letterSpacing: "0.2em" }}>NIVEL</text>
      <text x="60" y="85" textAnchor="middle" fill="#fff" fontSize="34" fontWeight="900" style={{ letterSpacing: "-0.02em", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))" }}>{level}</text>
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────────
// MAIN PAGE CONTENT
// ─────────────────────────────────────────────────────────────────
export default function DashboardContent() {
  const { user, loading, dbProfile } = useAuth()
  const router = useRouter()
  const isAdminOrTeacher = dbProfile?.role === "school_admin" || dbProfile?.role === "teacher" || dbProfile?.role === "admin"
  const isInstitutional = useMemo(() => {
    const email = user?.email?.toLowerCase() || ""
    return email.endsWith(".edu") || email.includes(".edu.")
  }, [user])

  const [stats,            setStats]            = useState<Stats | null>(null)
  const [topics,           setTopics]           = useState<Topic[]>([])
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [adnResult,        setDnaResult]        = useState<any>(null)
  const [liveProfile,      setLiveProfile]      = useState<any>(null)
  const [loadingData,      setLoadingData]      = useState(true)
  const [isSyncing,        setIsSyncing]        = useState(false)
  const [transactions,     setTransactions]     = useState<any[]>([])
  const [prevStats,        setPrevStats]        = useState<Stats | null>(null)
  const [showPulseXp,      setShowPulseXp]      = useState(false)
  const [showPulseBc,      setShowPulseBc]      = useState(false)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)
  const [news, setNews] = useState<any[]>([])
  const [loadingNews, setLoadingNews] = useState(true)
  const [activeNewsIndex, setActiveNewsIndex] = useState(0)

  useEffect(() => {
    if (news.length > 0) {
      const interval = setInterval(() => {
        setActiveNewsIndex((prev) => (prev + 1) % news.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [news]);

  const activeDnaProfile = liveProfile?.adnProfile || adnResult?.adnProfile
  const hasCompletedDiagnostic = !!activeDnaProfile || !!liveProfile?.diagnosticCompleted || !!adnResult

  const searchParams = useSearchParams()
  const [showEvolution, setShowEvolution] = useState(false)

  const firstName = useMemo(() => {
    const n = dbProfile?.fullName || user?.email || ""
    return n.split(" ")[0]
  }, [dbProfile, user])

  useEffect(() => {
    if (searchParams.get("showEvolution") === "true") {
      setShowEvolution(true)
    }
  }, [searchParams])

  /* next incomplete topic + lesson info — same logic as /courses but finding first lesson */
  const nextLessonInfo = useMemo(() => {
    // We already have topics (with courses) and completedLessons (slugs)
    for (let i = 0; i < topics.length; i++) {
      const dbTopic = topics[i]
      const sub = SUBTEMAS_BY_COURSE[i]
      if (!sub || !dbTopic) continue

      // For each subtheme (DB Course) in this Theme (DB Topic)
      for (let j = 0; j < sub.length; j++) {
        const subtheme = sub[j]
        const dbCourse = dbTopic.courses?.[j] // Assume correct order
        if (!subtheme || !dbCourse) continue

        const lessons = subtheme.lessons || []
        // Find FIRST incomplete lesson in this subtheme
        const next = lessons.find((l: any) => !completedLessons.includes(l.slug))
        if (next) {
          return {
            topic: dbTopic,
            courseId: dbCourse.id,
            lessonSlug: next.slug,
            isThemePage: false // We can go direct to /learn/...
          }
        }
      }
    }
    return null
  }, [topics, completedLessons])

  const nextTopic = nextLessonInfo?.topic || null
  const topicColor  = nextTopic?.level ? (TOPIC_COLORS[nextTopic.level] ?? "#3b82f6") : "#3b82f6"
  const days        = useMemo(() => weekDays(), [])
  const activeSet   = useMemo(() => new Set(stats?.weeklyActiveDays ?? []), [stats])
  const todayStr    = new Date().toISOString().split("T")[0]

  const xpPct = useMemo(() => {
    if (!stats) return 0
    const total = stats.xpInCurrentLevel + stats.xpToNextLevel
    return total > 0 ? Math.round((stats.xpInCurrentLevel / total) * 100) : 0
  }, [stats])

  // const [isTransferModalOpen, setIsTransferModalOpen] = useState(false)

  const go = useCallback(async (isSilent = false) => {
    if (!user?.email) return // No user, no call
    
    if (!isSilent) setLoadingData(true)
    else setIsSyncing(true)
    
    try {
      const [sR, tR, pR, dR, profR, transR] = await Promise.all([
        fetch("/api/user/stats"),
        fetch("/api/topics"),
        fetch("/api/progress"),
        fetch(`/api/diagnostic-quiz?email=${encodeURIComponent(user.email)}`),
        fetch("/api/profile"),
        fetch("/api/wallet/transactions?limit=10")
      ])

      // Only update stats IF we got a valid response (avoid flashing 0s)
      if (sR.ok) {
        const newStats = await sR.json()
        if (newStats && typeof newStats.bizcoins === 'number') {
          // Detect changes for pulse effects
          if (stats) {
            if (newStats.xp !== stats.xp) {
              setShowPulseXp(true)
              setTimeout(() => setShowPulseXp(false), 2000)
            }
            if (newStats.bizcoins !== stats.bizcoins) {
              setShowPulseBc(true)
              setTimeout(() => setShowPulseBc(false), 2000)
            }
          }
          setStats(newStats)
        }
      }

      if (tR.ok) setTopics(await tR.json())
      if (pR.ok) {
        const pd = await pR.json()
        setCompletedLessons(
          (pd.progress ?? pd ?? []).map((p: any) => p.lessonId || p.slug || "").filter(Boolean)
        )
      }
      if (dR.ok) {
        const dd = await dR.json()
        if (dd.exists) setDnaResult(dd.result)
      }
      if (profR.ok) setLiveProfile(await profR.json())
      if (transR.ok) {
        const td = await transR.json()
        setTransactions(td.transactions || [])
      }
    } catch (err) {
      console.error("Dashboard Sync Error:", err)
    } finally {
      if (!isSilent) setLoadingData(false)
      setIsSyncing(false)
    }
  }, [user, stats])

  const fetchNews = async () => {
    try {
      const res = await fetch("/api/news")
      if (res.ok) setNews(await res.json())
    } catch (err) {
      console.error("News fetch error:", err)
    } finally {
      setLoadingNews(false)
    }
  }

  useEffect(() => {
    fetchNews()
  }, [])

  useEffect(() => {
    if (loading) return
    if (!user)   { router.replace("/login"); return }

    // Redirigir administradores y profesores
    if (dbProfile?.role === "school_admin" || dbProfile?.role === "teacher") {
      router.replace("/teacher/dashboard")
      return
    }

    // Initial Load
    go()

    // Real-time Polling (every 10s)
    const interval = setInterval(() => go(true), 10000)
    return () => clearInterval(interval)
  }, [user, loading, router, dbProfile, go])

  // Initial page load vs background sync
  if (loading || (loadingData && !stats)) return <PageLoader />

  const streak   = stats?.currentStreak   ?? 0
  const bizcoins = stats?.bizcoins        ?? 0
  const lessons  = stats?.lessonsCompleted ?? 0
  const level    = stats?.level           ?? 1
  const lessonPct = Math.min(100, Math.round((lessons / 150) * 100))

  const profileColors: Record<string, { bg: string, text: string, icon: string, border: string, path: string, topicId: string }> = {
    "Gastador Digital": { bg: "#fff1f2", text: "#991b1b", icon: "#ef4444", border: "#fecaca", path: "Control de Gastos y Crédito", topicId: "tema-04" },
    "Ahorrador Estancado": { bg: "#ecfdf5", text: "#065f46", icon: "#10b981", border: "#a7f3d0", path: "Inversión y Crecimiento", topicId: "tema-08" },
    "Explorador Arriesgado": { bg: "#ecfeff", text: "#0891b2", icon: "#06b6d4", border: "#cffafe", path: "Bases Sólidas y Seguridad", topicId: "tema-01" },
    "Maestro BIZEN": { bg: "#f0fdf4", text: "#166534", icon: "#22c55e", border: "#bbf7d0", path: "Estrategias Avanzadas", topicId: "tema-11" },
  }

  const adnInfo = activeDnaProfile ? profileColors[activeDnaProfile as string] : null

  return (
    <div style={{ minHeight: "100vh", background: "#FBFAF5", width: "100%", boxSizing: "border-box", fontFamily: '"SF Pro Display","SF Pro Text",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif' }}>
      {/* Styles moved to globals.css */}

      {/* ── background orbs ── */}
      <div style={{position:"fixed",top:"3%",right:"-8%",width:560,height:560,background:"radial-gradient(circle,rgba(59,130,246,.08) 0%,transparent 70%)",borderRadius:"50%",filter:"blur(80px)",pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"fixed",bottom:"8%",left:"-8%",width:500,height:500,background:"radial-gradient(circle,rgba(139,92,246,.07) 0%,transparent 70%)",borderRadius:"50%",filter:"blur(90px)",pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"fixed",top:"50%",left:"30%",width:400,height:400,background:"radial-gradient(circle,rgba(16,185,129,.05) 0%,transparent 70%)",borderRadius:"50%",filter:"blur(80px)",pointerEvents:"none",zIndex:0}}/>

      {/* ── content wrapper ── */}
      <div className="di" style={{position:"relative",zIndex:1,boxSizing:"border-box",maxWidth:"none"}}>
        
        {/* Real-Time Sync Indicator */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "flex-end", 
            gap: 8, 
            marginBottom: 4,
            paddingRight: 8
          }}
        >
          <div style={{ position: "relative", width: 8, height: 8 }}>
            <motion.div 
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }} 
              transition={{ duration: 2, repeat: Infinity }}
              style={{ position: "absolute", inset: 0, background: isSyncing ? "#0F62FE" : "#10B981", borderRadius: "50%" }}
            />
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.05em", textTransform: "uppercase" }}>
            {isSyncing ? "Sincronizando..." : "Conectado"}
          </span>
        </motion.div>

        <motion.div
           initial="hidden"
           animate="visible"
           variants={{
             hidden: { opacity: 0 },
             visible: {
               opacity: 1,
               transition: {
                 staggerChildren: 0.1
               }
             }
           }}
        >
          {/* HERO */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 }
            }}
            style={{
              background: isAdminOrTeacher ? "linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #0F62FE 100%)" : "linear-gradient(135deg,#0a0f2e 0%,#0d2a6b 45%,#1a56db 100%)",
              borderRadius: 32, padding: "clamp(20px,3vw,32px) clamp(22px,4vw,36px)",
              marginBottom: 12, position: "relative", overflow: "hidden",
              boxShadow: "0 24px 64px rgba(13,42,107,.35), inset 0 1px 0 rgba(255,255,255,.08)",
            }}
          >
            {/* mesh-style orbs inside hero */}
            <div style={{ position: "absolute", top: "-40%", right: "-8%", width: 360, height: 360, background: "radial-gradient(circle,rgba(96,165,250,.22) 0%,transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: "-30%", left: "5%", width: 300, height: 300, background: "radial-gradient(circle,rgba(167,139,250,.18) 0%,transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

            <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 28 }}>
              {/* left */}
              <div style={{ flex: "1 1 300px" }}>
                {/* badge */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,.10)", border: "1px solid rgba(255,255,255,.15)", borderRadius: 999, padding: "5px 14px", marginBottom: 18 }}
                >
                  <IcoShield size={12} color="#93c5fd" strokeWidth={2.5} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#93c5fd", letterSpacing: ".07em", textTransform: "uppercase" }}>
                    {isAdminOrTeacher ? "Panel de Gestión" : "Tu espacio personal"}
                  </span>
                </motion.div>

                {/* greeting */}
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
                  <motion.div 
                    style={{ width: 52, height: 52, borderRadius: 16, background: "rgba(255,255,255,.10)", border: "1px solid rgba(255,255,255,.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                  >
                    <IcoWave size={30} color="#fff" />
                  </motion.div>
                  <h1 style={{ fontSize: "clamp(26px,4.5vw,44px)", fontWeight: 800, color: "#fff", margin: 0, lineHeight: 1.1, letterSpacing: "-0.025em" }}>
                    {getGreeting()}, <span style={{ background: "linear-gradient(90deg,#93c5fd,#c4b5fd)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{firstName}</span>
                  </h1>
                </div>

                <p style={{ fontSize: "clamp(13px,1.8vw,16px)", color: "rgba(255,255,255,.55)", margin: "0 0 28px", lineHeight: 1.65 }}>
                  {isAdminOrTeacher 
                    ? "Gestiona tu institución, supervisa el progreso de tus alumnos y configura tus cursos desde aquí."
                    : (streak >= 7
                        ? `Llevas ${streak} días de racha. Eres imparable.`
                        : streak >= 1
                          ? `Llevas ${streak} día${streak > 1 ? "s" : ""} de racha. ¡Sigue así!`
                          : "Completa el reto de hoy y comienza tu racha.")
                  }
                </p>

                {isAdminOrTeacher && (
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <motion.button 
                      onClick={() => router.push("/admin/escuela")} style={{
                        padding: "12px 24px", background: "#fff", borderRadius: 12,
                        color: "#0f172a", fontWeight: 700, border: "none", cursor: "pointer",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.15)"
                      }}>
                      Panel Escolar
                    </motion.button>
                    <motion.button 
                      onClick={() => router.push("/admin/cursos")} style={{
                        padding: "12px 24px", background: "rgba(255,255,255,0.1)", borderRadius: 12,
                        color: "#fff", fontWeight: 700, border: "1px solid rgba(255,255,255,0.3)", cursor: "pointer"
                      }}>
                      Gestionar Cursos
                    </motion.button>
                  </div>
                )}

                {!isAdminOrTeacher && (
                  <div className="hero-stats-pills" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {[
                      { icon: <Flame size={14} style={{ color: "#60a5fa" }} />, value: streak, label: "días", sub: "RACHA", bg: "rgba(96,165,250,.15)", border: "rgba(96,165,250,.25)" },
                      { icon: <IcoZap size={14} color="#a78bfa" />, value: stats?.xpInCurrentLevel ?? 0, label: "XP", sub: "NIVEL ACTUAL", bg: "rgba(167,139,250,.12)", border: "rgba(167,139,250,.25)" },
                      { icon: <IcoCoin size={14} color="#34d399" />, value: bizcoins, label: "BZ", sub: "BIZCOINS", bg: "rgba(52,211,153,.12)", border: "rgba(52,211,153,.25)" },
                    ].map(m => (
                      <motion.div 
                        key={m.sub} 
                        style={{ 
                          display: "flex", 
                          alignItems: "center", 
                          gap: 9, 
                          background: m.bg, 
                          border: `1px solid ${m.border}`, 
                          borderRadius: 12, 
                          padding: "9px 14px",
                          position: "relative",
                          overflow: "hidden"
                        }}
                      >
                        {m.sub === "NIVEL ACTUAL" && showPulseXp && (
                           <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0, 0.2, 0] }} transition={{ duration: 1 }} style={{ position: "absolute", inset: 0, background: "#10b981" }} />
                        )}
                        {m.sub === "BIZCOINS" && showPulseBc && (
                           <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0, 0.2, 0] }} transition={{ duration: 1 }} style={{ position: "absolute", inset: 0, background: "#10b981" }} />
                        )}
                        {m.icon}
                        <div>
                          <motion.div 
                            key={m.value}
                            initial={{ opacity: 0.5, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{ fontSize: 13, fontWeight: 800, color: "#fff", lineHeight: 1.2 }}
                          >
                            {m.value.toLocaleString()} {m.label}
                          </motion.div>
                          <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,.5)", textTransform: "uppercase", letterSpacing: ".08em", marginTop: 2 }}>{m.sub}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* right: Virtual Card (Student ONLY) */}
              {!isAdminOrTeacher && (
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, x: 50 },
                    visible: { opacity: 1, x: 0 }
                  }}
                  className="hero-virtual-card" style={{ flex: "1 1 300px", display: "flex", justifyContent: "flex-end", alignItems: "center" }}
                >
                  <div style={{ width: "100%", maxWidth: 400 }}>
                    <BizenVirtualCard
                      bizcoins={bizcoins}
                      holderName={dbProfile?.fullName || user?.email?.split("@")[0] || ""}
                      animationDelay=".12s"
                      colorTheme={dbProfile?.cardTheme || "blue"}
                      level={dbProfile?.level || 1}
                      onTransferClick={() => router.push("/transfer")}
                      pattern={(dbProfile?.settings as any)?.cardCustomizations?.pattern || "none"}
                      showBillySticker={(dbProfile?.settings as any)?.cardCustomizations?.showBillySticker || false}
                    />
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>


          <AnimatePresence>
            {isHistoryModalOpen && (
              <TransactionHistoryModal 
                onClose={() => setIsHistoryModalOpen(false)}
                currentBalance={bizcoins}
              />
            )}
          </AnimatePresence>


          {/* ADN PROFILE SECTION */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, scale: 0.95 },
              visible: { opacity: 1, scale: 1 }
            }}
            style={{ marginBottom: 24 }}
          >
            {activeDnaProfile && activeDnaProfile.includes("Billy") ? (
              <BillyLabWidget 
                adnProfile={activeDnaProfile}
                adnScore={liveProfile?.adnScore || adnResult?.adnScore || 0}
                nextTopicId={activeDnaProfile === "Billy Inversionista" ? "tema-09" : (activeDnaProfile === "Billy Estratega" ? "tema-07" : "tema-06")}
                nextTopicTitle={activeDnaProfile === "Billy Inversionista" ? "Estrategias de Inversión" : (activeDnaProfile === "Billy Estratega" ? "Sistema de Crédito" : "Presupuesto Real")}
              />
            ) : hasCompletedDiagnostic && adnInfo ? (
              <motion.div 
                style={{
                  background: adnInfo?.bg || "white",
                  border: `1.5px solid ${adnInfo?.border || "#e2e8f0"}`,
                  borderRadius: 24, padding: "16px 20px",
                  display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.03)", transition: "all 0.3s"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 16, background: "white", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 12px ${adnInfo?.icon}20` }}>
                    <Shield size={28} color={adnInfo?.icon} strokeWidth={2.2} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: adnInfo?.text, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 4 }}>Tu Perfil Financiero</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: adnInfo?.text }}>{activeDnaProfile}</div>
                  </div>
                </div>
                <div style={{ flex: 1, height: 1.5, background: `${adnInfo?.border}40`, margin: "0 10px", minWidth: 20 }} className="hidden sm:block" />
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ textAlign: "right" as const }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: adnInfo?.text, textTransform: "uppercase", opacity: 0.6 }}>Ruta Recomendada</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: adnInfo?.text }}>{adnInfo?.path}</div>
                  </div>
                  <motion.div 
                    style={{ width: 44, height: 44, borderRadius: 12, background: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: `1px solid ${adnInfo?.border}` }} 
                    onClick={() => {
                      if (adnInfo?.topicId) {
                        router.push(`/courses/${adnInfo.topicId}?noredirect=true`)
                      } else {
                        router.push("/courses")
                      }
                    }}
                  >
                    <IcoArrowRight size={18} color={adnInfo?.text} />
                  </motion.div>
                </div>
              </motion.div>
            ) : null}
          </motion.div>
          {/* ADN PROMO SECTION — NOW ALWAYS VISIBLE FOR STUDENTS */}
          {!isAdminOrTeacher && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{
                        background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",
                        borderRadius: 28,
                        padding: "24px 32px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 24,
                        boxShadow: "0 12px 40px rgba(15, 23, 42, 0.25)",
                        border: "1.5px solid rgba(255,255,255,0.18)",
                        position: "relative",
                        overflow: "hidden"
                    }}
                >
                    <div style={{ position: "absolute", top: "-50%", right: "-10%", width: 250, height: 250, background: "rgba(255,255,255,0.12)", borderRadius: "50%", filter: "blur(60px)" }} />
                    
                    <div style={{ display: "flex", alignItems: "center", gap: 20, position: "relative", zIndex: 1 }}>
                        <div style={{ width: 64, height: 64, borderRadius: 20, background: "rgba(255,255,255,0.22)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.25)" }}>
                            <BrainCircuit size={36} color="#fff" />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: "#fff", letterSpacing: "-0.015em" }}>ADN Financiero</h3>
                            <p style={{ margin: "4px 0 0", fontSize: 13, color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>Descubre tu ruta de aprendizaje.</p>
                        </div>
                    </div>
                    
                    <button
                        onClick={() => router.push("/diagnostic/1")}
                        style={{
                            background: "#fff",
                            color: "#0F62FE",
                            border: "none",
                            borderRadius: 16,
                            padding: "12px 20px",
                            fontWeight: 900,
                            fontSize: 14,
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            position: "relative",
                            zIndex: 1,
                            transition: "all 0.3s"
                        }}
                    >
                        Empezar
                        <ChevronRight size={18} />
                    </button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <InvestmentsWidget />
                </motion.div>
            </div>
          )}

          {!isAdminOrTeacher && (
            <motion.div 
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.05 }
                }
              }}
              className="stats-row" style={{ 
                display: "flex", 
                flexWrap: "wrap", 
                gap: 14, 
                marginBottom: 20,
                alignItems: "stretch" 
              }}
            >
              {/* CARD 1 — Racha */}
              <motion.div 
                variants={{
                  hidden: { opacity: 0, scale: 0.9 },
                  visible: { opacity: 1, scale: 1 }
                }}
                style={{
                  flex: "0 0 200px",
                  background: streak > 0 ? "linear-gradient(145deg,#f0f9ff,#e0f2fe)" : "linear-gradient(145deg,#f8fafc,#f1f5f9)",
                  border: streak > 0 ? "1px solid #bae6fd" : "1px solid #e2e8f0",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  textAlign: "center", padding: "20px 16px", borderRadius: 24, boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
                  transition: "all 0.3s ease"
                }}
              >
                <div style={{ fontSize: 10, fontWeight: 800, color: streak > 0 ? "#1d4ed8" : "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Racha Diaria</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                  <motion.div animate={streak > 0 ? { scale: [1, 1.2, 1] } : {}} transition={{ repeat: Infinity, duration: 2 }}>
                    <Flame size={28} style={{ color: streak > 0 ? "#3b82f6" : "#94a3b8" }} />
                  </motion.div>
                  <div style={{ fontSize: 36, fontWeight: 950, color: streak > 0 ? "#001d6c" : "#cbd5e1", lineHeight: 1, letterSpacing: "-0.05em" }}>{streak}</div>
                </div>
                <div style={{ marginTop: 10, fontSize: 11, fontWeight: 700, color: streak > 0 ? "#3b82f6" : "#94a3b8" }}>
                  {streak === 0 ? "Sin racha" : "¡Sigue así!"}
                </div>
              </motion.div>

            {/* CARD 2 — Lecciones */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: { opacity: 1, scale: 1 }
              }}
              style={{
                flex: "0 0 200px",
                background: "#fff", border: "1px solid #e9eef8",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                textAlign: "center", padding: "20px 16px", borderRadius: 24, boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
                transition: "all 0.3s ease"
              }}
            >
              <div style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Lecciones</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 12 }}>
                <IcoBook size={24} color="#3b82f6" />
                <div style={{ fontSize: 32, fontWeight: 950, color: "#0F62FE", lineHeight: 1, letterSpacing: "-0.05em" }}>{lessons}</div>
              </div>
              <div style={{ width: "100%", height: 7, background: "#f1f5f9", borderRadius: 10, overflow: "hidden" }}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${lessonPct}%` }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                  style={{ height: "100%", background: "linear-gradient(90deg,#93c5fd,#3b82f6)", borderRadius: 10 }} 
                />
              </div>
            </motion.div>

            {/* CARD 3 — Continue Learning (Elastic) */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, x: 20 },
                visible: { opacity: 1, x: 0 }
              }}
              style={{
                flex: "1 1 340px",
                background:"#fff", borderRadius:24,
                border:"1.5px solid rgba(0,0,0,.055)",
                boxShadow:`0 4px 24px rgba(0,0,0,.045)`,
                position:"relative", overflow:"hidden",
                transition: "all 0.3s ease"
              }}
            >
              <div style={{position:"absolute",left:0,top:0,bottom:0,width:4,background:`linear-gradient(180deg,${topicColor},${topicColor}55)`}}/>
              <div style={{padding: "20px"}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                  <motion.div 
                    animate={{ rotate: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    style={{width:24,height:24,borderRadius:8,background:`${topicColor}18`,display:"flex",alignItems:"center",justifyContent:"center"}}
                  >
                    <IcoChart size={12} color={topicColor} strokeWidth={2.5}/>
                  </motion.div>
                  <span style={{fontSize:10,fontWeight:800,color:topicColor,textTransform:"uppercase",letterSpacing:".10em"}}>
                    Continúa donde lo dejaste
                  </span>
                </div>

                {nextTopic ? (
                  <div className="continue-inner" style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:16}}>
                    <div style={{display:"flex",alignItems:"center",gap:16,flex:"1 1 200px"}}>
                      <motion.div 
                        style={{
                          width:60,height:60,borderRadius:18,flexShrink:0,
                          background:`linear-gradient(135deg,${topicColor}22,${topicColor}0a)`,
                          border:`1.5px solid ${topicColor}30`,
                          display:"flex",alignItems:"center",justifyContent:"center",
                          position:"relative",overflow:"hidden"
                        }}
                      >
                        <IcoBook size={28} color={topicColor} strokeWidth={1.5}/>
                      </motion.div>
                      <div style={{minWidth:0}}>
                        <div style={{fontSize:10,fontWeight:800,color:"#94a3b8",textTransform:"uppercase",letterSpacing:".12em",marginBottom:2}}>
                          {nextTopic.level ?? "Finanzas"}
                        </div>
                        <div style={{fontSize:"clamp(18px,2vw,22px)",fontWeight:900,color:"#0f172a",lineHeight:1.1,letterSpacing:"-0.02em",marginBottom:4}}>
                          {nextTopic.title}
                        </div>
                        <div style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:"#64748b",fontWeight:700}}>
                          <BookOpen size={12} />
                          <span>{nextTopic._count?.courses ?? "?"} cursos disponibles</span>
                        </div>
                      </div>
                    </div>
                    <motion.button 
                      className="cb" 
                      style={{ padding: "12px 24px", fontSize: 14 }} 
                      onClick={() => {
                        if (nextLessonInfo?.lessonSlug && nextLessonInfo?.courseId) {
                          router.push(`/learn/${nextLessonInfo.topic.id}/${nextLessonInfo.courseId}/${nextLessonInfo.lessonSlug}/interactive`)
                        } else if (nextTopic) {
                          const id = String(nextTopic.id)
                          const nav = (!id.startsWith("tema-") && !isNaN(parseInt(id))) ? `tema-${id.padStart(2,"0")}` : id
                          router.push(`/courses/${nav}`)
                        }
                      }}
                    >
                      Continuar <motion.div animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}><IcoArrowRight size={16} color="#fff"/></motion.div>
                    </motion.button>
                  </div>
                ) : (
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <div style={{width:48,height:48,borderRadius:16,background:"linear-gradient(135deg,#d1fae5,#6ee7b7)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <IcoCheck size={24} color="#059669"/>
                    </div>
                    <div>
                      <div style={{fontSize:18,fontWeight:800,color:"#0f172a"}}>¡Excelente trabajo!</div>
                      <div style={{fontSize:13,color:"#64748b"}}>Has completado todos los temas disponibles.</div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
        
        {/* FINANCIAL NEWS WIDGET — High Visibility Featured Layout */}
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.2 }}
           style={{ marginBottom: 40 }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 16, background: "rgba(15, 98, 254, 0.1)", border: "1.5px solid rgba(15, 98, 254, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 16px rgba(15, 98, 254, 0.1)" }}>
                <Newspaper size={24} color="#0F62FE" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: "#0B1E5E", letterSpacing: "-0.02em" }}>Inteligencia Financiera</h3>
                <div style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>Noticias y análisis en tiempo real</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button 
                onClick={() => router.push("/news")} 
                style={{ background: "#0F62FE", border: "none", color: "white", fontSize: 13, fontWeight: 750, cursor: "pointer", padding: "10px 22px", borderRadius: 12, transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", boxShadow: "0 8px 20px rgba(15, 98, 254, 0.3)" }}
                onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 24px rgba(15, 98, 254, 0.4)"; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(15, 98, 254, 0.3)"; }}
              >
                Portal de Noticias
              </button>
              <button onClick={fetchNews} style={{ background: "white", border: "1.5px solid #e2e8f0", color: "#64748b", width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 12, cursor: "pointer", transition: "all 0.2s" }} onMouseOver={(e) => e.currentTarget.style.borderColor = "#0F62FE"}>
                <RefreshCw size={18} className={loadingNews ? "animate-spin" : ""} />
              </button>
            </div>
          </div>

          <div style={{ position: "relative", height: 380, background: "white", borderRadius: 32, border: "1.5px solid #e9eef8", overflow: "hidden", boxShadow: "0 14px 40px rgba(13,42,107,0.06)" }}>
            {loadingNews ? (
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div className="animate-spin" style={{ width: 32, height: 32, border: "3px solid #f1f5f9", borderTopColor: "#0F62FE", borderRadius: "50%" }} />
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {news.length > 0 && (
                  <motion.div
                    key={activeNewsIndex}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "row", // Desktop: Side by side
                      cursor: "pointer",
                    }}
                    onClick={() => window.open(news[activeNewsIndex].url, "_blank")}
                  >
                    {/* Visual Section: Background with image */}
                    <div style={{ width: "45%", height: "100%", position: "relative", overflow: "hidden" }}>
                         <img 
                             src={news[activeNewsIndex].image} 
                             alt={news[activeNewsIndex].title} 
                             style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 8s linear" }} 
                             onLoad={(e) => e.currentTarget.style.transform = "scale(1.15)"}
                             onError={(e) => {
                                 (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200";
                             }}
                         />
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, transparent 60%, white 100%)" }} />
                        <div style={{ position: "absolute", top: 20, left: 20, background: "rgba(15, 98, 254, 0.85)", backdropFilter: "blur(8px)", color: "white", padding: "6px 12px", borderRadius: 8, fontSize: 11, fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                            Destacado
                        </div>
                    </div>

                    {/* Content Section */}
                    <div style={{ flex: 1, padding: "40px 48px 40px 32px", display: "flex", flexDirection: "column", justifyContent: "center", background: "white" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                        <span style={{ fontSize: 12, fontWeight: 900, color: "#0F62FE", textTransform: "uppercase", letterSpacing: "0.1em", background: "rgba(15,98,254,0.06)", padding: "4px 14px", borderRadius: 99 }}>{news[activeNewsIndex].category}</span>
                        <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 600 }}>{news[activeNewsIndex].time} • {news[activeNewsIndex].source}</span>
                      </div>
                      <h4 style={{ margin: 0, fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 900, color: "#0B1E5E", lineHeight: 1.15, letterSpacing: "-0.03em", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{news[activeNewsIndex].title}</h4>
                      <p style={{ marginTop: 20, fontSize: 16, color: "#475569", lineHeight: 1.6, fontWeight: 500, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {news[activeNewsIndex].desc}
                      </p>
                      
                      <div style={{ marginTop: 32, display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <TrendingUp size={20} color="#0F62FE" />
                        </div>
                        <div>
                            <div style={{ fontSize: 12, fontWeight: 800, color: "#0B1E5E" }}>Análisis BIZEN</div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>Impacto de mercado sugerido</div>
                        </div>
                        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, color: "#0F62FE", fontSize: 15, fontWeight: 800 }}>
                            Explorar análisis completo <IcoArrowRight size={18} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
          
          {/* Mobile and Tablet responsive fix for the news card height/layout */}
          {/* Dashboard News response fixes moved to globals.css */}
        </motion.div>

        {/* METAS DE AHORRO (Savings Goals) - Premium Standalone Widget */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1 }}
           onClick={() => router.push("/metas")}
           style={{
             background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
             borderRadius: 28,
             padding: "24px 32px",
             marginBottom: 24,
             display: "flex",
             alignItems: "center",
             justifyContent: "space-between",
             cursor: "pointer",
             border: "1px solid rgba(16, 185, 129, 0.2)",
             boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
             position: "relative",
             overflow: "hidden"
           }}
        >
          {/* Decorative Glow */}
          <div style={{ position: "absolute", top: "-50%", right: "-10%", width: 200, height: 200, background: "rgba(16,185,129,0.08)", borderRadius: "50%", filter: "blur(50px)" }} />
          
          <div style={{ display: "flex", alignItems: "center", gap: 18, position: "relative", zIndex: 1 }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Target size={28} color="#10b981" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em" }}>Metas de Ahorro</h3>
              <p style={{ margin: "2px 0 0", fontSize: 13, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>No tienes metas activas.</p>
            </div>
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.05)", padding: "8px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)" }}>
             <span style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>Ver objetivos</span>
             <ChevronRight size={14} color="#10b981" />
          </div>
        </motion.div>

        {/* RETO DIARIO (Billy Challenge) - Standalone Row */}
        <div style={{ marginBottom: 24 }}>
          <DailyChallengeWidget />
        </div>
        


        {/* ══════════════════════════════════════════════════════════
            ACTIVITY FEED
        ══════════════════════════════════════════════════════════ */}
        <div className="dual-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16,marginBottom:24,alignItems:"start"}}>

          {/* Weekly Activity — Enhanced */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            style={{
              background: "linear-gradient(145deg, #0f172a 0%, #1e1b4b 100%)",
              borderRadius: 28,
              padding: "28px 24px",
              border: "1.5px solid rgba(99,102,241,0.2)",
              boxShadow: "0 8px 32px rgba(99,102,241,0.12)",
              position: "relative",
              overflow: "hidden"
            }}
          >
            {/* Background glows */}
            <div style={{ position: "absolute", top: "-30%", right: "-10%", width: 200, height: 200, background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: "-20%", left: "-5%", width: 150, height: 150, background: "radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(99,102,241,0.4)" }}>
                  <IcoCalendar size={20} color="#fff" strokeWidth={2.2}/>
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>Actividad Semanal</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", fontWeight: 600, marginTop: 2 }}>
                    {Array.from(activeSet).filter(d => days.includes(d)).length} de 7 días activos
                  </div>
                </div>
              </div>
              {streak > 0 && (
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 2.5 }}
                  style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(251,146,60,0.15)", border: "1px solid rgba(251,146,60,0.35)", borderRadius: 12, padding: "6px 12px" }}
                >
                  <Flame size={14} style={{ color: "#fb923c" }} />
                  <span style={{ fontSize: 13, fontWeight: 900, color: "#fb923c" }}>{streak}d</span>
                </motion.div>
              )}
            </div>

            {/* Animated bar chart */}
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "flex-end", height: 80, marginBottom: 14, position: "relative", zIndex: 1 }}>
              {days.map((day, i) => {
                const active  = activeSet.has(day)
                const isToday = day === todayStr
                const barHeight = active ? 64 : isToday ? 40 : 18 + (i % 3) * 5
                return (
                  <div key={day} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flex: 1 }}>
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: barHeight, opacity: 1 }}
                      transition={{ delay: 0.4 + i * 0.08, duration: 0.5, ease: "easeOut" }}
                      style={{
                        width: "100%",
                        borderRadius: 8,
                        background: active
                          ? "linear-gradient(180deg, #10b981 0%, #059669 100%)"
                          : isToday
                          ? "rgba(99,102,241,0.5)"
                          : "rgba(255,255,255,0.07)",
                        boxShadow: active ? "0 4px 16px rgba(16,185,129,0.4)" : "none",
                        border: isToday && !active ? "1px solid rgba(99,102,241,0.4)" : "none",
                        position: "relative",
                        overflow: "hidden"
                      }}
                    >
                      {active && (
                        <motion.div
                          animate={{ y: ["-100%", "200%"] }}
                          transition={{ repeat: Infinity, duration: 2, ease: "linear", delay: i * 0.15 }}
                          style={{ position: "absolute", inset: "0 0 auto", height: "50%", background: "linear-gradient(180deg, rgba(255,255,255,0.22), transparent)", borderRadius: 8 }}
                        />
                      )}
                    </motion.div>
                    <span style={{ fontSize: 10, fontWeight: 800, color: active ? "#10b981" : isToday ? "#818cf8" : "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      {DAY_LABELS[i]}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Week progress bar */}
            <div style={{ position: "relative", zIndex: 1, marginBottom: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Progreso semanal</span>
                <span style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.5)" }}>
                  {Array.from(activeSet).filter(d => days.includes(d)).length}/7
                </span>
              </div>
              <div style={{ height: 5, background: "rgba(255,255,255,0.08)", borderRadius: 99, overflow: "hidden" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(Array.from(activeSet).filter(d => days.includes(d)).length / 7) * 100}%` }}
                  transition={{ duration: 1, delay: 0.9, ease: "easeOut" }}
                  style={{ height: "100%", background: "linear-gradient(90deg, #6366f1, #10b981)", borderRadius: 99 }}
                />
              </div>
            </div>

            {/* Streak footer */}
            <motion.div
              onClick={() => router.push("/profile")}
              style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.05)", borderRadius: 16, padding: "12px 16px", cursor: "pointer", border: "1px solid rgba(255,255,255,0.07)", position: "relative", zIndex: 1 }}
            >
              <motion.div animate={streak > 0 ? { rotate: [0, 15, 0] } : {}} transition={{ repeat: Infinity, duration: 2 }}>
                <Flame size={16} style={{ color: streak > 0 ? "#fb923c" : "rgba(255,255,255,0.2)" }} />
              </motion.div>
              <span style={{ fontSize: 12, fontWeight: 700, color: streak > 0 ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.3)", flex: 1 }}>
                {streak > 0 ? `Racha activa de ${streak} día${streak === 1 ? "" : "s"}` : "Completa el reto de hoy para iniciar tu racha"}
              </span>
              {streak > 0 && (
                <span style={{ fontSize: 11, fontWeight: 800, color: "#fb923c", background: "rgba(251,146,60,0.15)", padding: "3px 9px", borderRadius: 8 }}>
                  {streak}d
                </span>
              )}
            </motion.div>
          </motion.div>

          {/* Activity Feed / Notifications */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            style={{
              background:"#fff",borderRadius:24,padding:"24px",
              border:"1.5px solid rgba(0,0,0,.055)",
              boxShadow:"0 4px 15px rgba(0,0,0,.03)",
              display: "flex", flexDirection: "column"
            }}
          >
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
               <div style={{display:"flex",alignItems:"center",gap:12}}>
                 <div style={{width:46,height:46,borderRadius:14,background:"linear-gradient(135deg,#fdf2f8,#fce7f3)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 12px rgba(236,72,153,.15)"}}>
                    <History size={22} color="#db2777" />
                 </div>
                 <div>
                   <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#0f172a", lineHeight: 1.2 }}>Estado de Cuenta</h3>
                   <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, marginTop: 2 }}>Historial de Tarjeta BIZEN</div>
                 </div>
               </div>
               <motion.div 
                 onClick={() => router.push("/historial")}
                 style={{ display: "flex", alignItems: "center", gap: 8, background: "#f0f7ff", padding: "8px 14px", borderRadius: 12, border: "1px solid #bfdbfe", cursor: "pointer" }}
               >
                  <Coins size={14} color="#0F62FE" />
                  <span style={{ fontSize: 13, fontWeight: 800, color: "#0F62FE" }}>{bizcoins.toLocaleString()} BC</span>
               </motion.div>
            </div>

            <div style={{ 
              flex: 1, 
              display: "flex", 
              flexDirection: "column", 
              gap: 12, 
              maxHeight: 320, 
              overflowY: "auto",
              paddingRight: 6,
              scrollbarWidth: "none"
            }}>
              {transactions.length === 0 ? (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 10px", textAlign: "center" }}>
                   <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                      <Check size={24} color="#cbd5e1" />
                   </div>
                   <p style={{ margin: 0, fontSize: 14, color: "#94a3b8", fontWeight: 700 }}>Sin movimientos</p>
                   <p style={{ margin: "6px 0 0", fontSize: 12, color: "#cbd5e1" }}>Usa tu tarjeta BIZEN para ver actividad.</p>
                </div>
              ) : (
                <AnimatePresence>
                  {transactions.slice(0, 2).map((t, idx) => (
                    <motion.div 
                      key={t.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * idx }}
                      style={{ 
                        padding: "14px 16px", 
                        borderRadius: 18, 
                        background: idx === 0 ? "linear-gradient(90deg, #f0f7ff, white)" : "white", 
                        display: "flex", 
                        alignItems: "center", 
                        gap: 14,
                        border: idx === 0 ? "1.5px solid #bfdbfe" : "1.5px solid #f1f5f9",
                        boxShadow: idx === 0 ? "0 4px 12px rgba(15,98,254,0.06)" : "none",
                        cursor: "pointer",
                        transition: "all 0.2s"
                      }}
                      onClick={() => router.push("/historial")}
                    >
                      <div style={{ 
                        width: 40, 
                        height: 40, 
                        borderRadius: 12, 
                        background: t.type === "income" ? "rgba(16,185,129,0.12)" : "rgba(244,63,94,0.08)", 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center",
                        color: t.type === "income" ? "#10B981" : "#F43F5E",
                        flexShrink: 0
                      }}>
                        {t.category === "transfer_received" ? <ArrowDownLeft size={20} /> : 
                         t.category === "transfer_sent" ? <ArrowUpRight size={20} /> :
                         t.category === "purchase" ? <ShoppingBag size={20} /> :
                         t.category === "lesson_reward" ? <BookOpen size={20} /> :
                         (t.category === "investment" || t.category === "investment_reward") ? <TrendingUp size={20} /> :
                         <Coins size={20} />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.description}</div>
                        <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, marginTop: 2 }}>{new Date(t.createdAt).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })} • {t.category === "purchase" ? "Gasto" : "Ganancia"}</div>
                      </div>
                      <div style={{ textAlign: "right", minWidth: 65 }}>
                        <div style={{ fontSize: 15, fontWeight: 950, color: t.type === "income" ? "#10B981" : "#F43F5E", letterSpacing: "-0.02em" }}>
                          {t.type === "income" ? "+" : "-"}{t.amount}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
            
            <motion.button 
              onClick={() => router.push("/historial")} 
              style={{ marginTop: 16, width: "100%", background: "#f8fafc", border: "1px solid #e2e8f0", padding: "12px", borderRadius: 14, fontSize: 13, fontWeight: 800, color: "#475569", cursor: "pointer", transition: "all 0.2s" }}
            >
              Ver historial completo
            </motion.button>
          </motion.div>
        </div>


        {/* ══════════════════════════════════════════════════════════
            QUICK LINKS — Enhanced
        ══════════════════════════════════════════════════════════ */}
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.06 } }
          }}
          initial="hidden"
          animate="visible"
        >
          {/* Section header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 12, background: "linear-gradient(135deg, #1e1b4b, #312e81)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(99,102,241,0.3)" }}>
                <IcoGrid size={16} color="#a5b4fc" strokeWidth={2.2}/>
              </div>
              <div>
                <span style={{ fontSize: 20, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.02em" }}>Accesos Rápidos</span>
                <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, marginTop: 1 }}>Todos tus destinos en un click</div>
              </div>
            </div>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#6366f1", background: "#eef2ff", padding: "4px 12px", borderRadius: 99, border: "1px solid #c7d2fe" }}>9 herramientas</div>
          </div>

          <div className="quick-grid-container" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
            {([
              {
                Icon: IcoBook, label: "Aprende Finanzas", sub: "30 temas · Educación financiera",
                href: "/courses",
                gradient: "linear-gradient(145deg, #1d4ed8 0%, #1e40af 100%)",
                glow: "rgba(59,130,246,0.35)", border: "rgba(96,165,250,0.2)"
              },
              {
                Icon: TrendingUp, label: "Inversión BIZEN", sub: "Haz crecer tus Bizcoins",
                href: "/investments",
                gradient: "linear-gradient(145deg, #0f62fe 0%, #1d4ed8 100%)",
                glow: "rgba(15,98,254,0.35)", border: "rgba(96,165,250,0.2)"
              },
              {
                Icon: IcoGamepad, label: "Simuladores", sub: "Practica con escenarios reales",
                href: "/cash-flow",
                gradient: "linear-gradient(145deg, #5b21b6 0%, #7c3aed 100%)",
                glow: "rgba(139,92,246,0.35)", border: "rgba(167,139,250,0.2)"
              },
              {
                Icon: IcoStore, label: "Tienda Bizen", sub: `${bizcoins.toLocaleString()} BC disponibles`,
                href: "/tienda",
                gradient: "linear-gradient(145deg, #92400e 0%, #b45309 100%)",
                glow: "rgba(217,119,6,0.35)", border: "rgba(251,191,36,0.2)"
              },
              {
                Icon: IcoUsers, label: "Foro", sub: "Comunidad activa de inversores",
                href: "/forum",
                gradient: "linear-gradient(145deg, #065f46 0%, #047857 100%)",
                glow: "rgba(16,185,129,0.35)", border: "rgba(52,211,153,0.2)"
              },
              {
                Icon: IcoTrophy, label: "Rankings", sub: "Tu posición en el tablero global",
                href: "/rankings",
                gradient: "linear-gradient(145deg, #991b1b 0%, #b91c1c 100%)",
                glow: "rgba(239,68,68,0.35)", border: "rgba(252,165,165,0.2)"
              },
              {
                Icon: IcoZap,
                label: (dbProfile?.role === 'teacher' || dbProfile?.role === 'school_admin' || isInstitutional) ? "Lanzar Live Quiz" : "Bizen Live",
                sub: "Quizzes competitivos en tiempo real",
                href: (dbProfile?.role === 'teacher' || dbProfile?.role === 'school_admin' || isInstitutional) ? "/live/host" : "/live/join",
                gradient: "linear-gradient(145deg, #78350f 0%, #92400e 100%)",
                glow: "rgba(251,191,36,0.35)", border: "rgba(252,211,77,0.2)"
              },
              {
                Icon: IcoUser, label: "Mi Perfil", sub: "Insignias, logros y configuración",
                href: "/profile",
                gradient: "linear-gradient(145deg, #0c4a6e 0%, #075985 100%)",
                glow: "rgba(8,145,178,0.35)", border: "rgba(103,232,249,0.2)"
              },
              {
                Icon: Newspaper, label: "Noticias BIZEN", sub: "Análisis y tendencias globales",
                href: "/news",
                gradient: "linear-gradient(145deg, #0B1E5E 0%, #173896 100%)",
                glow: "rgba(11,30,94,0.35)", border: "rgba(23,56,150,0.2)"
              },
            ] as const).map(({ Icon, label, sub, href, gradient, glow, border }, idx) => (
              <motion.div
                key={href}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="ql"
                style={{
                  background: gradient,
                  border: `1.5px solid ${border}`,
                  boxShadow: `0 8px 24px ${glow}`,
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                  cursor: "pointer"
                }}
                onClick={() => router.push(href)}
              >
                {/* Top row: icon + arrow */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 16, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)" }}>
                    <Icon size={24} color="#fff" strokeWidth={1.8}/>
                  </div>
                  <div style={{ width: 28, height: 28, borderRadius: 10, background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <IcoArrowRight size={13} color="rgba(255,255,255,0.7)"/>
                  </div>
                </div>
                {/* Labels */}
                <div>
                  <div className="ql-label">{label}</div>
                  <div className="ql-sub">{sub}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>

    {/* ADN Evolution Modal overlay */}
    {showEvolution && adnResult && (
      <DNAEvolutionScreen 
        currentProfile="Aspirante BIZEN"
        newProfile={adnResult.adnProfile}
        stats={{
          mentalidad: adnResult.categoryScores?.Presupuesto?.percentage ?? 80,
          bases: adnResult.categoryScores?.Crédito?.percentage ?? 80,
          optimizacion: adnResult.categoryScores?.Inversión?.percentage ?? 80,
          ahorro: adnResult.categoryScores?.Ahorro?.percentage ?? 80,
          riesgos: adnResult.categoryScores?.Seguridad?.percentage ?? 80,
        }}
        nextTopicId={nextLessonInfo?.lessonSlug || "intro"}
        nextTopicTitle={nextLessonInfo?.lessonSlug ? "Tu Plan Personalizado" : "Explorar Cursos"}
        onClose={() => {
          setShowEvolution(false)
          router.replace("/dashboard", { scroll: false })
        }}
      />
    )}
  </div>
  )
}
// (End of file)
