"use client"

import React, { useEffect, useState, useMemo, useCallback, useRef, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Billy } from "@/components/Billy"
import { useAuth } from "@/contexts/AuthContext"

import PageLoader from "@/components/PageLoader"
import DailyChallengeWidget from "@/components/DailyChallengeWidget"
import { SUBTEMAS_BY_COURSE } from "@/data/lessons/courseLessonsOrder"
import { Palette, ShoppingBag, Send, Search, Loader2, Check, X, History, ArrowUpRight, ArrowDownLeft, Flame, Shield, Target, Coins, BookOpen, TrendingUp, BrainCircuit, ChevronRight, RefreshCw, Newspaper, Trophy, Megaphone } from "lucide-react"
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
  const userEmail = (user?.email || (user as any)?.emailAddresses?.[0]?.emailAddress || "").toLowerCase()
  const isSuperAdmin = userEmail === "diego@bizen.mx"
  const isAdminOrTeacher = dbProfile?.role === "school_admin" || dbProfile?.role === "teacher" || dbProfile?.role === "admin" || isSuperAdmin

  const isAnahuac = useMemo(() => {
    return userEmail.endsWith('@anahuac.mx') || userEmail.includes('.anahuac.mx') || userEmail.endsWith('@bizen.mx');
  }, [userEmail])

  const isInstitutional = useMemo(() => {
    return userEmail.endsWith(".edu") || userEmail.includes(".edu.") || isAnahuac
  }, [userEmail, isAnahuac])

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
  const [globalBanner, setGlobalBanner] = useState<any>(null)

  useEffect(() => {
    if (news.length > 0) {
      const interval = setInterval(() => {
        setActiveNewsIndex((prev) => (prev + 1) % news.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [news]);

  // Force scroll to top on mount and when loading finishes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!loadingData && stats) {
      window.scrollTo(0, 0);
    }
  }, [loadingData, stats]);

  const activeDnaProfile = liveProfile?.adnProfile || adnResult?.adnProfile
  const hasCompletedDiagnostic = !!activeDnaProfile || !!liveProfile?.diagnosticCompleted || !!adnResult

  const searchParams = useSearchParams()
  const [showEvolution, setShowEvolution] = useState(false)

  const firstName = useMemo(() => {
    return user?.user_metadata?.first_name || dbProfile?.fullName?.split(" ")[0] || user?.user_metadata?.full_name?.split(" ")[0] || "usuario"
  }, [dbProfile, user])

  useEffect(() => {
    if (searchParams.get("showEvolution") === "true") {
      setShowEvolution(true)
    }
    // Handle ADN test triggers from Billy or Gatekept lessons
    if (searchParams.get("startADN") === "true" || searchParams.get("startTest") === "true") {
      router.push("/diagnostic/1")
    }
  }, [searchParams, router])

  // Graduation status: Completing Tema 1-4 (The Core Curriculum)
  const isCoreGraduated = useMemo(() => {
    try {
      const coreThemes = [0, 1, 2, 3]; // Themes 1, 2, 3, 4
      return coreThemes.every(idx => {
        const sub = SUBTEMAS_BY_COURSE[idx];
        if (!sub) return true;
        const lessons = sub.flatMap(s => (s.lessons || []).map((l: any) => l.slug));
        if (lessons.length === 0) return true;
        return lessons.every(slug => completedLessons.includes(slug));
      });
    } catch (e) {
      return false;
    }
  }, [completedLessons]);

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
      const res = await fetch("/api/dashboard-init")
      
      if (!res.ok) {
         if (res.status === 401) { router.replace("/login"); return }
         throw new Error(`Failed to load dashboard: ${res.status}`)
      }

      const data = await res.json()
      
      // Update stats and handle pulses using functional updates to avoid dependency
      if (data.stats) {
        setStats(prev => {
          if (prev) {
            if (data.stats.xp !== prev.xp) {
              setShowPulseXp(true)
              setTimeout(() => setShowPulseXp(false), 2000)
            }
            if (data.stats.bizcoins !== prev.bizcoins) {
              setShowPulseBc(true)
              setTimeout(() => setShowPulseBc(false), 2000)
            }
          }
          return data.stats
        })
      }

      if (data.topics) setTopics(data.topics)
      if (data.progress) setCompletedLessons(data.progress)
      if (data.diagnostic?.exists) setDnaResult(data.diagnostic)
      if (data.profile) setLiveProfile(data.profile)
      if (data.transactions) setTransactions(data.transactions)

    } catch (err) {
      console.error("Dashboard Sync Error:", err)
    } finally {
      if (!isSilent) setLoadingData(false)
      setIsSyncing(false)
    }
  }, [user, router]) // Removed 'stats' from dependency list

  const fetchNewsAndBanner = async () => {
    try {
      const [resNews, resBanner] = await Promise.all([
        fetch("/api/news"),
        fetch("/api/admin/banner")
      ])
      if (resNews.ok) setNews(await resNews.json())
      if (resBanner.ok) {
        const data = await resBanner.json()
        if (data.banner && data.banner.isActive) {
          setGlobalBanner(data.banner)
        }
      }
    } catch (err) {
      console.error("Fetch error:", err)
    } finally {
      setLoadingNews(false)
    }
  }

  useEffect(() => {
    fetchNewsAndBanner()
  }, [])

  useEffect(() => {
    if (loading) return
    if (!user)   { router.replace("/login"); return }

    // Redirigir administradores y profesores
    if (dbProfile?.role === "school_admin" || dbProfile?.role === "teacher" || dbProfile?.role === "admin" || isSuperAdmin) {
      router.replace("/teacher/dashboard")
      return
    }

    // Initial Load - only called once when mount or user/profile changes
    go()

    // Real-time Polling (every 30s instead of 10s to be gentler on DB)
    const interval = setInterval(() => go(true), 30000)
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
    <div className="min-h-screen bg-[#FBFAF5] text-slate-900 w-full overflow-x-hidden relative font-sans">
      {/* ── SPATIAL DECORATIVE ORBS ── */}
      <div className="fixed top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-500 opacity-[0.05] rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[10%] left-[-5%] w-[500px] h-[500px] bg-indigo-500 opacity-[0.04] rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="fixed top-[40%] left-[20%] w-[400px] h-[400px] bg-emerald-500 opacity-[0.03] rounded-full blur-[90px] pointer-events-none z-0" />

      {/* ── CONTENT WRAPPER ── */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Real-Time Sync Indicator */}
        <div className="flex justify-end mb-4 pr-1">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm"
          >
            <div className="relative w-2 h-2">
              <motion.div 
                animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }} 
                transition={{ duration: 2, repeat: Infinity }}
                className={`absolute inset-0 rounded-full ${isSyncing ? "bg-blue-500" : "bg-emerald-500 font-black shadow-[0_0_8px_#10b981]"}`}
              />
            </div>
            <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">
              {isSyncing ? "Sincronizando..." : "Live Connection"}
            </span>
          </motion.div>
        </div>

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
          {/* GLOBAL BANNER */}
          {globalBanner && (
            <motion.div 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              className={`w-full rounded-2xl overflow-hidden shadow-lg border border-white/10 mb-6 cursor-pointer transform hover:scale-[1.01] transition-transform`}
              onClick={() => globalBanner.link && globalBanner.linkText && router.push(globalBanner.link)}
            >
              <div className={`p-4 sm:px-6 relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                globalBanner.color === "orange" ? "bg-gradient-to-r from-orange-500 to-amber-600" :
                globalBanner.color === "emerald" ? "bg-gradient-to-r from-emerald-500 to-teal-600" :
                globalBanner.color === "purple" ? "bg-gradient-to-r from-purple-500 to-fuchsia-600" :
                globalBanner.color === "red" ? "bg-gradient-to-r from-red-500 to-rose-600" :
                "bg-gradient-to-r from-blue-600 to-indigo-600"
              }`}>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/30 shrink-0">
                    <Megaphone size={18} />
                  </div>
                  <div>
                    <h3 className="font-black text-white text-[15px] sm:text-base leading-tight mb-0.5">{globalBanner.title}</h3>
                    <p className="text-white/90 font-medium text-[13px] leading-snug m-0 pr-4">{globalBanner.text}</p>
                  </div>
                </div>
                {globalBanner.link && globalBanner.linkText && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); router.push(globalBanner.link); }}
                    className="bg-white text-slate-900 px-5 py-2.5 rounded-xl text-[13px] font-black shadow-md hover:scale-105 transition-transform shrink-0 whitespace-nowrap self-start sm:self-auto"
                  >
                    {globalBanner.linkText}
                  </button>
                )}
                {/* Decorative glow */}
                <div className="absolute top-0 right-0 w-[150px] h-full bg-white/10 blur-[30px] rounded-full pointer-events-none" />
              </div>
            </motion.div>
          )}

          {/* HERO */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 }
            }}
            className="relative overflow-hidden rounded-[2rem] p-5 md:p-6 md:px-8 mb-6 border border-white/10 bg-[#0B1E5E] shadow-xl"
          >
            {/* Mesh-style orbs inside hero */}
            <div className="absolute -top-[50%] -right-[10%] w-[450px] h-[450px] bg-blue-400/15 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute -bottom-[40%] left-[0%] w-[400px] h-[400px] bg-indigo-400/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10 flex flex-wrap items-center justify-between gap-5 md:gap-8">
              {/* left */}
              <div className="flex-1 min-w-[300px]">
                {/* badge */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-3 py-1 mb-3"
                >
                  <IcoShield size={10} color="#93c5fd" strokeWidth={2.5} />
                  <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest">
                    {isAdminOrTeacher ? "Panel de Gestión" : "Tu espacio personal"}
                  </span>
                </motion.div>

                {/* greeting */}
                <div className="flex items-center gap-3 mb-2">
                  <motion.div 
                    className="w-10 h-10 rounded-[14px] bg-white/10 border border-white/20 flex items-center justify-center shrink-0 shadow-md"
                  >
                    <IcoWave size={22} color="#fff" />
                  </motion.div>
                  <h1 className="text-xl md:text-3xl lg:text-[34px] font-black text-white leading-[1.1] tracking-[-0.03em]">
                    {getGreeting()}, <span className="bg-gradient-to-r from-blue-300 via-emerald-300 to-indigo-300 bg-clip-text text-transparent">{firstName}</span>
                  </h1>
                </div>
                
                {/* Institutional Tag with Mascot (Conditional) */}
                {isAnahuac && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 mb-4 mt-2"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center p-1.5 shadow-lg border border-orange-200">
                      <img src="/León Anáhuac.png" alt="León Anáhuac" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-[#FF5900] uppercase tracking-widest leading-none mb-1">Comunidad Institucional</span>
                      <span className="text-sm font-bold text-white text-opacity-80">Experiencia Anáhuac Activa</span>
                    </div>
                  </motion.div>
                )}

                <p className="text-[14px] md:text-[15px] text-white/80 mb-5 leading-snug max-w-2xl font-medium">
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
                  <div className="flex flex-wrap gap-2">
                    <motion.button 
                      onClick={() => router.push("/admin/escuela")} 
                      className="px-5 py-2.5 bg-white rounded-xl text-slate-900 font-bold shadow-md hover:shadow-lg transition-all text-sm"
                    >
                      Panel Escolar
                    </motion.button>
                    <motion.button 
                      onClick={() => router.push("/admin/cursos")} 
                      className="px-5 py-2.5 bg-white/10 border border-white/30 rounded-xl text-white font-bold hover:bg-white/20 transition-all text-sm"
                    >
                      Gestionar Cursos
                    </motion.button>
                  </div>
                )}

                {!isAdminOrTeacher && (
                  <div className="flex flex-wrap gap-2">
                    {[
                      { icon: <Flame size={12} className="text-blue-400" />, value: streak, label: "días", sub: "RACHA", bg: "bg-blue-400/15", border: "border-blue-400/25" },
                      { icon: <IcoZap size={12} color="#a78bfa" />, value: stats?.xpInCurrentLevel ?? 0, label: "XP", sub: "NIVEL ACTUAL", bg: "bg-violet-400/12", border: "border-violet-400/25" },
                      { icon: <IcoCoin size={12} color="#34d399" />, value: bizcoins, label: "BZ", sub: "BIZCOINS", bg: "bg-emerald-400/12", border: "border-emerald-400/25" },
                    ].map(m => (
                      <motion.div 
                        key={m.sub} 
                        className={`group relative overflow-hidden flex items-center gap-2 px-3 py-2 rounded-xl border ${m.bg} ${m.border}`}
                      >
                        {m.sub === "NIVEL ACTUAL" && showPulseXp && (
                           <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0, 0.2, 0] }} transition={{ duration: 1 }} className="absolute inset-0 bg-emerald-500" />
                        )}
                        {m.sub === "BIZCOINS" && showPulseBc && (
                           <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0, 0.2, 0] }} transition={{ duration: 1 }} className="absolute inset-0 bg-emerald-500" />
                        )}
                        {m.icon}
                        <div>
                          <motion.div 
                            key={m.value}
                            initial={{ opacity: 0.5, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-[13px] font-extrabold text-white leading-none"
                          >
                            {m.value.toLocaleString()} {m.label}
                          </motion.div>
                          <div className="text-[9px] font-bold text-white/50 uppercase tracking-[0.08em] mt-0.5">{m.sub}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* right: Virtual Card + Mascot (Student ONLY) */}
              {!isAdminOrTeacher && (
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, x: 50 },
                    visible: { opacity: 1, x: 0 }
                  }}
                  className="hero-virtual-card" 
                  style={{ 
                    flex: "1 1 400px", 
                    display: "flex", 
                    justifyContent: "flex-end", 
                    alignItems: "center",
                    gap: 16,
                    position: "relative"
                  }}
                >
                  <div className="relative z-10 w-full max-w-[400px] perspective-1000">
                    <BizenVirtualCard
                      bizcoins={bizcoins}
                      holderName={dbProfile?.fullName || user?.email?.split("@")[0] || ""}
                      colorTheme={dbProfile?.cardTheme || (isAnahuac ? "anahuac" : "blue")}
                      level={dbProfile?.level || 1}
                      onTransferClick={() => router.push("/transfer")}
                      onRedeemClick={() => router.push("/tienda")}
                      pattern={(dbProfile?.settings as any)?.cardCustomizations?.pattern || "none"}
                      showBillySticker={(dbProfile?.settings as any)?.cardCustomizations?.showBillySticker || false}
                    />
                  </div>
                </motion.div>
              )}

              {/* GRADUATION BADGE — ONLY FOR CORE GRADUATES */}
              {isCoreGraduated && (
                <motion.div 
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="bg-gradient-to-r from-amber-400 to-amber-600 px-6 py-3 rounded-2xl shadow-xl border border-white/20 flex items-center gap-3 relative overflow-hidden group cursor-pointer"
                  onClick={() => setShowEvolution(true)}
                >
                  <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <Trophy size={18} className="text-white" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-0.5">Estatus BIZEN</span>
                    <span className="text-sm font-black text-white leading-none">Graduado Core 🎓</span>
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


          <motion.div 
            variants={{
              hidden: { opacity: 0, scale: 0.98 },
              visible: { opacity: 1, scale: 1 }
            }}
            className="mb-8"
          >
            {activeDnaProfile && (activeDnaProfile.includes("Billy") || isCoreGraduated) ? (
              <BillyLabWidget 
                adnProfile={activeDnaProfile || "Aspirante BIZEN"}
                adnScore={liveProfile?.adnScore || adnResult?.adnScore || 0}
                nextTopicId={activeDnaProfile === "Billy Inversionista" ? "tema-09" : (activeDnaProfile === "Billy Estratega" ? "tema-07" : "tema-05")}
                nextTopicTitle={activeDnaProfile === "Billy Inversionista" ? "Estrategias de Inversión" : (activeDnaProfile === "Billy Estratega" ? "Sistema de Crédito" : "Ahorro Inteligente")}
              />
            ) : hasCompletedDiagnostic && adnInfo ? (
              <motion.div 
                className="bg-white border border-slate-200 rounded-[2rem] p-6 flex items-center justify-between flex-wrap gap-6 shadow-sm"
              >
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center shadow-sm border border-blue-100">
                    <Shield size={32} className="text-blue-600" strokeWidth={2.2} />
                  </div>
                  <div>
                    <div className="text-[11px] font-black text-blue-600 uppercase tracking-widest mb-1.5 opacity-80">Tu Perfil Financiero</div>
                    <div className="text-2xl md:text-3xl font-black text-slate-900">{activeDnaProfile}</div>
                  </div>
                </div>
                <div className="hidden sm:block flex-1 h-[1px] bg-slate-100 mx-4" />
                <div className="flex items-center gap-5">
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Ruta Recomendada</div>
                    <div className="text-base font-black text-emerald-600">{adnInfo?.path}</div>
                  </div>
                  <motion.div 
                    whileHover={{ scale: 1.1, backgroundColor: "#f8fafc" }}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 rounded-xl bg-white flex items-center justify-center cursor-pointer border border-slate-200 shadow-sm"
                    onClick={() => {
                      if (adnInfo?.topicId) {
                        router.push(`/courses/${adnInfo.topicId}?noredirect=true`)
                      } else {
                        router.push("/courses")
                      }
                    }}
                  >
                    <ChevronRight size={24} className="text-slate-900" />
                  </motion.div>
                </div>
              </motion.div>
            ) : null}
          </motion.div>
          {/* ADN PROMO SECTION — NOW ALWAYS VISIBLE FOR STUDENTS */}
          {!isAdminOrTeacher && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ 
                  y: -5,
                  borderColor: "rgba(255,255,255,0.3)",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
                }}
                className="relative overflow-hidden rounded-[2.5rem] p-8 flex items-center justify-between gap-8 border border-white/10 bg-gradient-to-br from-[#0B1E5E] to-[#122b7a] shadow-2xl transition-all duration-300 group"
              >
                <div className="absolute -top-1/2 -right-[10%] w-[300px] h-[300px] bg-white/5 rounded-full blur-[60px]" />
                
                <div className="relative z-10 flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg group-hover:bg-white/20 transition-all">
                    <BrainCircuit size={36} className="text-white" />
                  </div>
                  <div>
                                        <h3 className="text-xl md:text-2xl font-black text-white tracking-tight leading-none mb-2">ADN Financiero</h3>
                    <p className="text-sm text-white/50 font-bold uppercase tracking-wider">Descubre tu ruta</p>
                  </div>
                </div>
                
                <motion.button
                  onClick={() => router.push("/diagnostic/1")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative z-10 bg-white text-[#0B1E5E] px-6 py-3.5 rounded-2xl font-black text-sm shadow-xl hover:shadow-white/10 transition-all flex items-center gap-2 whitespace-nowrap"
                >
                  Empezar
                  <ChevronRight size={18} />
                </motion.button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0B1E5E]/40 backdrop-blur-md shadow-2xl"
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
                  transition: { staggerChildren: 0.1 }
                }
              }}
              className="flex flex-wrap gap-4 mb-8 items-stretch"
            >
              {/* CARD 1 — Racha */}
              <motion.div 
                variants={{
                  hidden: { opacity: 0, scale: 0.95 },
                  visible: { opacity: 1, scale: 1 }
                }}
                className={`flex-[0_0_200px] rounded-[2rem] p-8 flex flex-col items-center justify-center text-center border transition-all duration-300 ${
                  streak > 0 
                  ? "bg-orange-500/10 border-orange-500/30 shadow-[0_10px_30px_rgba(251,146,60,0.1)]" 
                  : "bg-[#0B1E5E] border-white/10 shadow-2xl"
                }`}
              >
                <div className="flex flex-col items-center">
                  <span className={`text-[10px] font-black uppercase tracking-[0.15em] mb-4 ${
                    streak > 0 ? "text-orange-400" : "text-white"
                  }`}>Racha Diaria</span>
                  <div className="flex items-center justify-center gap-4">
                    <motion.div animate={streak > 0 ? { scale: [1, 1.25, 1], rotate: [0, 10, -10, 0] } : {}} transition={{ repeat: Infinity, duration: 2.5 }}>
                      <Flame size={32} className={streak > 0 ? "text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]" : "text-white"} />
                    </motion.div>
                    <span className="text-5xl font-black tracking-tighter leading-none text-white">{streak}</span>
                  </div>
                  <span className={`mt-5 text-xs font-bold uppercase tracking-wider ${
                    streak > 0 ? "text-orange-400/80" : "text-white"
                  }`}>
                    {streak === 0 ? "Inicia hoy" : "¡Imparable!"}
                  </span>
                </div>
              </motion.div>

              {/* CARD 2 — Lecciones */}
              <motion.div 
                variants={{
                  hidden: { opacity: 0, scale: 0.95 },
                  visible: { opacity: 1, scale: 1 }
                }}
                className="flex-[0_0_200px] bg-[#0B1E5E] border border-white/10 rounded-[2.2rem] p-8 flex flex-col items-center justify-center text-center shadow-2xl transition-all duration-300 hover:bg-[#0d2270]"
              >
                <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-4">Lecciones</span>
                <div className="flex items-center justify-center gap-4 mb-5">
                  <IcoBook size={32} color="#ffffff" />
                  <span className="text-5xl font-black text-white tracking-tighter leading-none">{lessons}</span>
                </div>
                <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${lessonPct}%` }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.4)]" 
                  />
                </div>
              </motion.div>

            {/* CARD 3 — Continue Learning (Elastic) */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, x: 20 },
                visible: { opacity: 1, x: 0 }
              }}
              className="flex-1 min-w-[340px] bg-[#0B1E5E] rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden transition-all duration-300 hover:bg-[#0d2270] hover:border-white/20 group"
            >
              <div 
                className="absolute left-0 top-0 bottom-0 w-1.5 opacity-60" 
                style={{ background: `linear-gradient(180deg, ${topicColor}, transparent)` }}
              />
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <motion.div 
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                    style={{ background: `${topicColor}22`, border: `1px solid ${topicColor}40` }}
                  >
                    <Target size={20} color="#ffffff" strokeWidth={2.5}/>
                  </motion.div>
                  <span 
                    className="text-[11px] font-black uppercase tracking-[0.2em]"
                    style={{ color: topicColor }}
                  >
                    Continuar Aprendiendo
                  </span>
                </div>

                {nextTopic ? (
                  <div className="flex items-center justify-between flex-wrap gap-6">
                    <div className="flex items-center gap-6 flex-1 min-w-[240px]">
                      <motion.div 
                        whileHover={{ rotate: 5, scale: 1.05 }}
                        className="w-20 h-20 rounded-2xl flex-shrink-0 flex items-center justify-center relative overflow-hidden border shadow-inner"
                        style={{ 
                          background: `linear-gradient(135deg, ${topicColor}33, transparent)`,
                          borderColor: `${topicColor}40`
                        }}
                      >
                        <IcoBook size={40} color="#ffffff" strokeWidth={1.5}/>
                      </motion.div>
                      <div className="min-w-0">
                        <div className="text-[10px] font-medium text-white/80 uppercase tracking-[0.15em] mb-2">
                          {nextTopic.level ?? "Finanzas"}
                        </div>
                        <div className="text-2xl md:text-3xl font-black text-white leading-tight tracking-[-0.03em] mb-2">
                          {nextTopic.title}
                        </div>
                        <div className="flex items-center gap-2.5 text-sm font-medium text-white/70">
                          <BookOpen size={16} className="text-white" />
                          <span>{nextTopic._count?.courses ?? "?"} cursos disponibles</span>
                        </div>
                      </div>
                    </div>
                    
                    <motion.button 
                      whileHover={{ scale: 1.05, x: 5 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 bg-white text-[#0B1E5E] rounded-2xl font-black text-base shadow-xl flex items-center gap-3 transition-all hover:shadow-white/10"
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
                      Empezar <ChevronRight size={20} />
                    </motion.button>
                  </div>
                ) : (
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <div style={{width:48,height:48,borderRadius:16,background:"linear-gradient(135deg,#d1fae5,#6ee7b7)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <IcoCheck size={24} color="#059669"/>
                    </div>
                    <div>
                      <div style={{fontSize:18,fontWeight:800,color:"#ffffff"}}>¡Excelente trabajo!</div>
                      <div style={{fontSize:13,color:"rgba(255,255,255,0.6)"}}>Has completado todos los temas disponibles.</div>
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
           className="mb-10"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                <Newspaper size={24} className="text-blue-600" />
              </div>
              <div>
                <h3 className="m-0 text-2xl font-black text-slate-900 tracking-tight">Inteligencia Financiera</h3>
                <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">En tiempo real</div>
              </div>
            </div>
            <div className="flex gap-3">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/news")} 
                className="bg-blue-600 border-none text-white text-xs font-black cursor-pointer px-6 py-3 rounded-xl transition-all shadow-md hover:bg-blue-700"
              >
                Portal Completo
              </motion.button>
              <button 
                onClick={fetchNewsAndBanner} 
                className="bg-white border border-slate-200 text-slate-400 w-11 h-11 flex items-center justify-center rounded-xl cursor-pointer transition-all hover:bg-slate-50"
              >
                <RefreshCw size={18} className={loadingNews ? "animate-spin" : ""} />
              </button>
            </div>
          </div>

          <div className="relative h-[400px] bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
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
           className="bg-white rounded-[2.5rem] px-8 py-7 mb-10 flex items-center justify-between cursor-pointer border border-emerald-100 shadow-sm relative overflow-hidden group transition-all duration-300 hover:border-emerald-300 hover:bg-emerald-50"
        >
          {/* Decorative Glow */}
          <div className="absolute -top-1/2 -right-[10%] w-64 h-64 bg-emerald-500/5 rounded-full blur-[70px] pointer-events-none" />
          
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Target size={32} className="text-emerald-500" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight mb-1 font-sans">Metas de Ahorro</h3>
              <p className="text-xs text-slate-400 font-black uppercase tracking-[0.2em]">{bizcoins > 0 ? "Comienza tu próximo objetivo" : "Sin metas activas"}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-200 group-hover:bg-emerald-500 group-hover:text-white transition-all">
             <span className="text-sm font-black uppercase tracking-widest text-slate-600 group-hover:text-white">Explorar</span>
             <ChevronRight size={18} className="text-emerald-500 group-hover:text-white" />
          </div>
        </motion.div>

        {/* RETO DIARIO (Billy Challenge) - Standalone Row */}
        <div className="mb-8">
          <DailyChallengeWidget />
        </div>

        {/* ══════════════════════════════════════════════════════════
            ACTIVITY FEED
        ══════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 mb-12 items-start">

          {/* Weekly Activity — Enhanced */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            className="bg-[#0B1E5E] rounded-[3rem] p-8 border border-white/10 shadow-2xl relative overflow-hidden h-full"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-10 relative z-10">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">
                  <IcoCalendar size={28} color="#ffffff" strokeWidth={2.2}/>
                </div>
                <div>
                  <div className="text-xl font-black text-white mb-2 tracking-tight">Actividad Semanal</div>
                  <div className="text-xs text-white/80 font-black uppercase tracking-[0.2em]">
                    {Array.from(activeSet).filter(d => days.includes(d)).length} de 7 días completados
                  </div>
                </div>
              </div>
              {streak > 0 && (
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 2.5 }}
                  className="flex items-center gap-2.5 px-5 py-2 rounded-2xl bg-orange-500/10 border border-orange-500/30 font-black text-orange-400 text-sm"
                >
                  <Flame size={18} />
                  <span>{streak}d</span>
                </motion.div>
              )}
            </div>

            {/* Animated bar chart */}
            <div className="flex justify-between gap-3 h-24 mb-10 relative z-10 items-end">
              {days.map((day, i) => {
                const active  = activeSet.has(day)
                const isToday = day === todayStr
                const barHeight = active ? 100 : isToday ? 60 : 25 + (i % 3) * 10
                return (
                  <div key={day} className="flex flex-col items-center gap-4 flex-1">
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: `${barHeight}%`, opacity: 1 }}
                      transition={{ delay: 0.4 + i * 0.08, duration: 0.6, ease: "backOut" }}
                      className={`w-full rounded-xl relative overflow-hidden ${active ? "bg-gradient-to-t from-blue-600 to-emerald-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]" : isToday ? "bg-white/20" : "bg-white/5"}`}
                    >
                      {active && (
                        <motion.div
                          animate={{ y: ["-100%", "200%"] }}
                          transition={{ repeat: Infinity, duration: 2, ease: "linear", delay: i * 0.15 }}
                          className="absolute inset-0 w-full h-[30%] bg-white/20"
                        />
                      )}
                    </motion.div>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${active ? "text-emerald-400" : isToday ? "text-blue-400" : "text-white/20"}`}>
                      {DAY_LABELS[i]}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Week progress bar */}
            <div className="relative z-10 mb-8 px-2">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-black text-white/70 uppercase tracking-[0.2em]">Rendimiento Semanal</span>
                <span className="text-sm font-black text-white">
                   {Math.round((Array.from(activeSet).filter(d => days.includes(d)).length / 7) * 100)}%
                </span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(Array.from(activeSet).filter(d => days.includes(d)).length / 7) * 100}%` }}
                  transition={{ duration: 1, delay: 0.9 }}
                  className="h-full bg-gradient-to-r from-blue-400 to-indigo-600 rounded-full"
                />
              </div>
            </div>

            {/* Streak footer */}
            <motion.div
              whileHover={{ scale: 1.02, backgroundColor: "#f8fafc" }}
              onClick={() => router.push("/profile")}
              className="flex items-center gap-4 bg-slate-50 rounded-3xl p-5 cursor-pointer border border-slate-100 relative z-10"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${streak > 0 ? "bg-orange-100" : "bg-slate-100"}`}>
                 <Flame size={20} className={streak > 0 ? "text-orange-500" : "text-slate-300"} />
              </div>
              <span className="text-sm font-bold text-slate-500 flex-1">
                {streak > 0 ? `Persistencia: ${streak} días seguidos` : "Ver mi meta diaria de hoy"}
              </span>
              <ChevronRight size={20} className="text-slate-300" />
            </motion.div>
          </motion.div>

          {/* Activity Feed / Transactions */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            className="bg-white rounded-[3rem] p-8 border border-slate-200 shadow-sm relative overflow-hidden h-full flex flex-col"
          >
            <div className="flex items-center justify-between mb-10">
               <div className="flex items-center gap-5">
                 <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                    <History size={28} className="text-emerald-600" />
                 </div>
                 <div>
                   <h3 className="m-0 text-xl font-black text-slate-900 tracking-tight">Estado de BIZEN</h3>
                   <div className="text-xs text-slate-400 font-black uppercase tracking-[0.2em]">Últimos movimientos</div>
                 </div>
               </div>
               <motion.div 
                 whileHover={{ scale: 1.05 }}
                 onClick={() => router.push("/historial")}
                 className="flex items-center gap-3 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-200 cursor-pointer shadow-sm"
               >
                  <Coins size={18} className="text-emerald-600" />
                  <span className="text-lg font-black text-slate-900">{bizcoins.toLocaleString()} <span className="text-emerald-400/60 text-xs font-black">BC</span></span>
               </motion.div>
            </div>

            <div className="flex-1 flex flex-col gap-4 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
              {transactions.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-40">
                   <Check size={48} className="text-slate-300" />
                   <p className="mt-4 font-black uppercase tracking-widest text-xs text-slate-400">Sin actividad reciente</p>
                </div>
              ) : (
                <AnimatePresence>
                  {transactions.slice(0, 4).map((t, idx) => (
                    <motion.div 
                      key={t.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * idx }}
                      className="group p-5 rounded-3xl bg-white border border-slate-100 hover:bg-slate-50 transition-all flex items-center gap-5 cursor-pointer shadow-sm hover:border-blue-200"
                      onClick={() => router.push("/historial")}
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border border-slate-100 shadow-inner ${t.type === "income" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
                        {t.category === "transfer_received" ? <ArrowDownLeft size={22} /> : 
                         t.category === "transfer_sent" ? <ArrowUpRight size={22} /> :
                         t.category === "purchase" ? <ShoppingBag size={22} /> :
                         t.category === "lesson_reward" ? <BookOpen size={22} /> :
                         (t.category === "investment" || t.category === "investment_reward") ? <TrendingUp size={22} /> :
                         <Coins size={22} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-base font-black text-slate-900 truncate group-hover:text-blue-600 transition-colors uppercase tracking-tight">{t.description}</div>
                        <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">
                          {new Date(t.createdAt).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })} • BIZCARD
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xl font-black tracking-[-0.05em] ${t.type === "income" ? "text-emerald-600" : "text-red-600"}`}>
                          {t.type === "income" ? "+" : "-"}{t.amount}
                        </div>
                        <div className="text-[10px] font-bold text-slate-300 uppercase">BC</div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
            
            <motion.button 
              whileHover={{ backgroundColor: "#f8fafc" }}
              onClick={() => router.push("/historial")} 
              className="mt-8 w-full bg-slate-50 border border-slate-200 py-5 rounded-3xl text-sm font-black text-slate-500 uppercase tracking-[0.2em] transition-all hover:text-blue-600"
            >
              Auditoría Completa
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
          className="mb-12"
        >
          {/* Section header */}
          <div className="flex items-center justify-between mb-8 px-2">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                <IcoGrid size={24} className="text-blue-600" strokeWidth={2.2}/>
              </div>
              <div>
                <span className="text-2xl font-black text-slate-900 tracking-tight">Accesos Rápidos</span>
                <div className="text-xs text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Tus herramientas BIZEN</div>
              </div>
            </div>
            <div className="hidden sm:block text-[10px] font-black text-blue-600 bg-blue-50 px-5 py-2 rounded-full border border-blue-100 uppercase tracking-widest">
              9 Accesos
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {([
              { Icon: IcoBook,    label: "Aprende Finanzas",  sub: "30 temas · Interactivos",                     href: "/courses",    bg: "bg-[#1E1B4B]", iconColor: "#93c5fd" },
              { Icon: TrendingUp, label: "Inversión BIZEN",   sub: "Haz crecer tus Bizcoins",                     href: "/investments", bg: "bg-[#0B1E5E]", iconColor: "#6ee7b7" },
              { Icon: IcoGamepad, label: "Simuladores",       sub: "Practica con el mercado",                     href: "/cash-flow",  bg: "bg-[#1E1B4B]", iconColor: "#a5b4fc" },
              { Icon: IcoStore,   label: "Tienda Bizen",      sub: `${bizcoins.toLocaleString()} BC en cartera`,  href: "/tienda",     bg: "bg-[#0B1E5E]", iconColor: "#fdba74" },
              { Icon: IcoUsers,   label: "Comunidad",         sub: "Foro de inversores",                          href: "/forum",      bg: "bg-[#1E1B4B]", iconColor: "#6ee7b7" },
              { Icon: IcoTrophy,  label: "Rankings",          sub: "Tu posición global",                          href: "/rankings",   bg: "bg-[#0B1E5E]", iconColor: "#fca5a5" },
              {
                Icon: IcoZap,
                label: (dbProfile?.role === 'teacher' || dbProfile?.role === 'school_admin' || isInstitutional) ? "Live Quiz" : "Bizen Live",
                sub: "Competencia en vivo",
                href: (dbProfile?.role === 'teacher' || dbProfile?.role === 'school_admin' || isInstitutional) ? "/live/host" : "/live/join",
                bg: "bg-[#1E1B4B]", iconColor: "#93c5fd"
              },
              { Icon: IcoUser,   label: "Mi Perfil",      sub: "Logros y configuración", href: "/profile", bg: "bg-[#0B1E5E]", iconColor: "#67e8f9" },
              { Icon: Newspaper, label: "Noticias BIZEN", sub: "Análisis mensual",        href: "/news",    bg: "bg-[#1E1B4B]", iconColor: "#a5b4fc" },
            ] as const).map(({ Icon, label, sub, href, bg, iconColor }) => (
              <motion.div
                key={href}
                variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
                whileHover={{ y: -6, borderColor: "rgba(255,255,255,0.25)", boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
                whileTap={{ scale: 0.98 }}
                className={`p-6 rounded-[2.5rem] border border-white/10 shadow-2xl transition-all cursor-pointer group ${bg}`}
                onClick={() => router.push(href)}
              >
                <div className="flex items-start justify-between mb-8">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"
                    style={{ background: `${iconColor}22`, border: `1.5px solid ${iconColor}88`, color: iconColor }}
                  >
                    <Icon size={28} strokeWidth={1.8} color={iconColor}/>
                  </div>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                    style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}
                  >
                    <IcoArrowRight size={16}/>
                  </div>
                </div>
                <div>
                  <div className="text-lg font-black text-white uppercase tracking-tight group-hover:text-blue-300 transition-colors">{label}</div>
                  <div className="text-xs font-bold uppercase tracking-widest mt-1.5" style={{ color: "rgba(255,255,255,0.5)" }}>{sub}</div>
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
        nextTopicId={nextLessonInfo?.topic.id || "intro"}
        nextTopicTitle={nextLessonInfo?.topic.id ? "Tu Plan Personalizado" : "Explorar Cursos"}
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
