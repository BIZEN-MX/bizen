"use client"

import React, { useEffect, useState, useMemo, useCallback, useRef, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Billy } from "@/components/Billy"
import { useAuth } from "@/contexts/AuthContext"

import PageLoader from "@/components/PageLoader"
import DailyChallengeWidget from "@/components/DailyChallengeWidget"
import { SUBTEMAS_BY_COURSE } from "@/data/lessons/courseLessonsOrder"
import { Palette, ShoppingBag, Send, Search, Loader2, Check, X, History, ArrowUpRight, ArrowDownLeft, Flame, Shield, Target, Coins, BookOpen } from "lucide-react"
import BizenVirtualCard from "@/components/BizenVirtualCard"
import DNAEvolutionScreen from "@/components/bizen/DNAEvolutionScreen"
import BillyLabWidget from "@/components/bizen/BillyLabWidget"
import TransactionHistoryModal from "@/components/bizen/TransactionHistoryModal"

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
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────
function DashboardContent() {
  const { user, loading, dbProfile } = useAuth()
  const router = useRouter()
  const isAdminOrTeacher = dbProfile?.role === "school_admin" || dbProfile?.role === "teacher"

  const [stats,            setStats]            = useState<Stats | null>(null)
  const [topics,           setTopics]           = useState<Topic[]>([])
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [dnaResult,        setDnaResult]        = useState<any>(null)
  const [liveProfile,      setLiveProfile]      = useState<any>(null)
  const [loadingData,      setLoadingData]      = useState(true)
  const [isSyncing,        setIsSyncing]        = useState(false)
  const [transactions,     setTransactions]     = useState<any[]>([])
  const [prevStats,        setPrevStats]        = useState<Stats | null>(null)
  const [showPulseXp,      setShowPulseXp]      = useState(false)
  const [showPulseBc,      setShowPulseBc]      = useState(false)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)

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

  const profileColors: Record<string, { bg: string, text: string, icon: string, border: string, path: string }> = {
    "Gastador Digital": { bg: "#fff1f2", text: "#991b1b", icon: "#ef4444", border: "#fecaca", path: "Control de Gastos y Crédito" },
    "Ahorrador Estancado": { bg: "#ecfdf5", text: "#065f46", icon: "#10b981", border: "#a7f3d0", path: "Inversión y Crecimiento" },
    "Explorador Arriesgado": { bg: "#ecfeff", text: "#0891b2", icon: "#06b6d4", border: "#cffafe", path: "Bases Sólidas y Seguridad" },
    "Maestro BIZEN": { bg: "#f0fdf4", text: "#166534", icon: "#22c55e", border: "#bbf7d0", path: "Estrategias Avanzadas" },
  }

  const dnaInfo = dnaResult?.dnaProfile ? profileColors[dnaResult.dnaProfile] : null

  return (
    <div style={{ minHeight: "100vh", background: "#FBFAF5", width: "100%", boxSizing: "border-box", fontFamily: '"SF Pro Display","SF Pro Text",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif' }}>
      <style>{`
        /* ── sidebar offsets ── */
        @media (max-width:767px)              { .di { padding:14px 12px 100px !important; margin-left:0 !important; } }
        @media (min-width:768px) and (max-width:1160px) { .di { margin-left:220px !important; padding:24px 20px 48px !important; } }
        @media (min-width:1161px)             { .di { margin-left:280px !important; padding:32px 48px 64px !important; max-width: 1600px !important; margin-right: auto !important; } }

        /* ── animations ── */
        @keyframes du { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fl { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        @keyframes sh { 0%{left:-100%} 20%,100%{left:120%} }
        @keyframes pr { 0%,100%{opacity:1} 50%{opacity:.55} }
        @keyframes scale-in { from{transform:scale(0.92);opacity:0} to{transform:scale(1);opacity:1} }

        .dc { animation: du .48s cubic-bezier(.2,.8,.2,1) both; }

        /* stat card — screenshot style: colored bg, centered content, no heavy border */
        .sc {
          border-radius:20px; padding:22px 20px 18px;
          flex:1; min-width:0;
          font-family:"SF Pro Display","SF Pro Text",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
          transition: transform .3s cubic-bezier(.4,0,.2,1), box-shadow .3s cubic-bezier(.4,0,.2,1);
          cursor:default; position:relative; overflow:hidden;
        }
        .sc:hover { transform:translateY(-4px); box-shadow:0 20px 40px -10px rgba(15,98,254,0.14); }

        /* stat label */
        .sc-label {
          font-size:10px; font-weight:700;
          text-transform:uppercase; letter-spacing:.12em;
          line-height:1.4; margin-bottom:0;
        }

        /* stat number */
        .sc-num {
          font-size:52px; font-weight:800; line-height:1;
          letter-spacing:-0.03em;
        }
        .sc-unit { font-size:13px; font-weight:600; letter-spacing:0.04em; margin-left:4px; }

        /* quick link */
        .ql {
          background: linear-gradient(145deg,#FFFFFF 0%,#F8FAFC 100%);
          border-radius:20px; padding:14px 12px;
          border:1px solid rgba(15,98,254,0.10);
          box-shadow:0 8px 20px -6px rgba(15,98,254,0.08);
          display:flex; align-items:center; gap:14px; cursor:pointer;
          font-family:"SF Pro Display","SF Pro Text",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
          transition:all .3s cubic-bezier(.4,0,.2,1);
        }
        .ql:hover { box-shadow:0 16px 36px -8px rgba(15,98,254,0.18); transform:translateY(-4px); border-color:rgba(15,98,254,0.25); }
        .ql-label { font-size:14px; font-weight:700; color:#0f172a; line-height:1.3; }
        .ql-sub   { font-size:12px; color:#94a3b8; font-weight:500; margin-top:3px;
                    overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }

        /* continue button */
        .cb {
          display:inline-flex; align-items:center; gap:9px;
          padding:14px 28px;
          background:linear-gradient(135deg,#0f172a 0%,#1e3a8a 55%,#2563eb 100%);
          color:#fff; border:none; border-radius:14px;
          font-size:15px; font-weight:700; cursor:pointer;
          position:relative; overflow:hidden; transition:all .22s ease;
          white-space:nowrap; flex-shrink:0;
        }
        .cb::after { content:''; position:absolute; top:0; left:-100%; width:55%; height:100%; background:linear-gradient(90deg,transparent,rgba(255,255,255,.14),transparent); animation:sh 3s ease-in-out infinite; }
        .cb:hover { transform:translateY(-3px); box-shadow:0 16px 36px rgba(15,23,42,.32); }

        /* day dot */
        .dd { width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-content:center; transition:transform .18s ease; }
        .dd:hover { transform:scale(1.18); }

        /* ── mobile overrides ── */
        @media (max-width:640px) {
          /* reduce general container padding */
          .di { padding: 12px 14px 120px !important; }

          /* STAT CARDS: better scaling, avoid dead space */
          .stats-row { 
            display: grid !important; 
            grid-template-columns: 1fr 1fr !important;
            gap: 12px !important;
          }
          .stats-row > div:nth-child(3) { grid-column: span 2 !important; }
          @media (max-width:420px) {
            .stats-row { grid-template-columns: 1fr !important; }
          }
          /* Card spacing & font sizes */
          .sc { padding: 16px !important; min-height: 100px !important; }
          .sc-num { font-size: clamp(28px, 8vw, 36px) !important; margin-top: 6px !important; }
          .sc-label { font-size: 10px !important; margin-bottom: 6px !important; }

          /* hero: more compact */
          .hero-xp-ring { display:none !important; }
          .hero-stats-pills { gap:6px !important; }
          .hero-stats-pills > div { padding:6px 9px !important; gap:5px !important; }

          /* continue card: tighter padding */
          .continue-inner { flex-direction:column !important; align-items:flex-start !important; gap: 12px !important; }
          .cb { width:100% !important; justify-content:center !important; padding:12px 16px !important; font-size: 14px !important; }
          
          /* activity section: smaller dots */
          .dd { width: 28px !important; height: 28px !important; }
          .dual-grid { gap: 12px !important; }

          /* quick links: already 2 cols, but make them shorter */
          .quick-grid { grid-template-columns: 1fr 1fr !important; gap:8px !important; }
          .ql { padding:10px 8px !important; gap:6px !important; border-radius: 16px !important; }
          .ql-icon-box { width: 38px !important; height: 38px !important; border-radius: 10px !important; }
          .ql-label { font-size: 12px !important; font-weight: 800 !important; }
          .ql-sub { font-size: 10px !important; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
          .ql-arrow { display: none !important; }
        }

        @media (max-width:360px) {
          /* reduce gap even more for ultra-small screens */
          .quick-grid { gap:6px !important; }
          .ql { padding: 8px 6px !important; }
          .ql-label { font-size: 11px !important; }
        }
      `}</style>

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
            marginBottom: 16,
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
            {isSyncing ? "Sincronizando..." : "En vivo"}
          </span>
        </motion.div>

        {/* ══════════════════════════════════════════════════════════
            HERO
        ══════════════════════════════════════════════════════════ */}
        {/* HERO */}
        <div className="dc" style={{
          background: isAdminOrTeacher ? "linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #0F62FE 100%)" : "linear-gradient(135deg,#0a0f2e 0%,#0d2a6b 45%,#1a56db 100%)",
          borderRadius: 32, padding: "clamp(24px,4vw,40px) clamp(22px,4vw,36px)",
          marginBottom: 16, position: "relative", overflow: "hidden",
          boxShadow: "0 24px 64px rgba(13,42,107,.35), inset 0 1px 0 rgba(255,255,255,.08)",
          animationDelay: "0s",
        }}>
          {/* mesh-style orbs inside hero */}
          <div style={{ position: "absolute", top: "-40%", right: "-8%", width: 360, height: 360, background: "radial-gradient(circle,rgba(96,165,250,.22) 0%,transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "-30%", left: "5%", width: 300, height: 300, background: "radial-gradient(circle,rgba(167,139,250,.18) 0%,transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 28 }}>
            {/* left */}
            <div style={{ flex: "1 1 300px" }}>
              {/* badge */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,.10)", border: "1px solid rgba(255,255,255,.15)", borderRadius: 999, padding: "5px 14px", marginBottom: 18 }}>
                <IcoShield size={12} color="#93c5fd" strokeWidth={2.5} />
                <span style={{ fontSize: 11, fontWeight: 700, color: "#93c5fd", letterSpacing: ".07em", textTransform: "uppercase" }}>
                  {isAdminOrTeacher ? "Panel de Gestión" : "Tu espacio personal"}
                </span>
              </div>

              {/* greeting */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
                <div style={{ width: 52, height: 52, borderRadius: 16, background: "rgba(255,255,255,.10)", border: "1px solid rgba(255,255,255,.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <IcoWave size={30} color="#fff" />
                </div>
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
                  <button onClick={() => router.push("/admin/escuela")} style={{
                    padding: "12px 24px", background: "#fff", borderRadius: 12,
                    color: "#0f172a", fontWeight: 700, border: "none", cursor: "pointer",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.15)", transition: "all 0.2s"
                  }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"} onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                    Panel Escolar
                  </button>
                  <button onClick={() => router.push("/admin/cursos")} style={{
                    padding: "12px 24px", background: "rgba(255,255,255,0.1)", borderRadius: 12,
                    color: "#fff", fontWeight: 700, border: "1px solid rgba(255,255,255,0.3)", cursor: "pointer",
                    transition: "all 0.2s"
                  }} onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"} onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}>
                    Gestionar Cursos
                  </button>
                </div>
              )}

              {!isAdminOrTeacher && (
                <div className="hero-stats-pills" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {[
                    { icon: <Flame size={14} style={{ color: "#60a5fa" }} />, label: `${streak} días`, sub: "Racha", bg: "rgba(96,165,250,.15)", border: "rgba(96,165,250,.25)" },
                    { icon: <IcoZap size={14} color="#a78bfa" />, label: `${(stats?.xpInCurrentLevel ?? 0).toLocaleString()} XP`, sub: "Nivel Actual", bg: "rgba(167,139,250,.12)", border: "rgba(167,139,250,.25)" },
                    { icon: <IcoCoin size={14} color="#34d399" />, label: `${bizcoins.toLocaleString()} BZ`, sub: "Bizcoins", bg: "rgba(52,211,153,.12)", border: "rgba(52,211,153,.25)" },
                  ].map(m => (
                    <div key={m.sub} style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: 9, 
                      background: m.bg, 
                      border: `1px solid ${m.border}`, 
                      borderRadius: 12, 
                      padding: "9px 14px",
                      position: "relative",
                      overflow: "hidden"
                    }}>
                      {m.sub === "NIVEL" && showPulseXp && (
                         <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0, 0.2, 0] }} transition={{ duration: 1 }} style={{ position: "absolute", inset: 0, background: "#10b981" }} />
                      )}
                      {m.sub === "BIZCOINS" && showPulseBc && (
                         <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0, 0.2, 0] }} transition={{ duration: 1 }} style={{ position: "absolute", inset: 0, background: "#10b981" }} />
                      )}
                      {m.icon}
                      <div>
                        <motion.div 
                          key={m.label}
                          animate={((m.sub === "NIVEL" && showPulseXp) || (m.sub === "BIZCOINS" && showPulseBc)) ? { scale: [1, 1.15, 1], color: ["#fff", "#10b981", "#fff"] } : {}}
                          style={{ fontSize: 13, fontWeight: 800, color: "#fff", lineHeight: 1.2 }}
                        >
                          {m.label}
                        </motion.div>
                        <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,.5)", textTransform: "uppercase", letterSpacing: ".08em", marginTop: 2 }}>{m.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* right: Virtual Card (Student ONLY) */}
            {!isAdminOrTeacher && (
              <div className="hero-virtual-card" style={{ flex: "1 1 300px", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                <div style={{ width: "100%", maxWidth: 400 }}>
                  <BizenVirtualCard
                    bizcoins={bizcoins}
                    holderName={dbProfile?.fullName || user?.email?.split("@")[0] || ""}
                    animationDelay=".12s"
                    colorTheme={dbProfile?.cardTheme || "blue"}
                    level={dbProfile?.level || 1}
                    onTransferClick={() => router.push("/transfer")}
                  />
                </div>
              </div>
            )}

          </div>
        </div>


        <AnimatePresence>
          {isHistoryModalOpen && (
            <TransactionHistoryModal 
              onClose={() => setIsHistoryModalOpen(false)}
              currentBalance={bizcoins}
            />
          )}
        </AnimatePresence>

        {/* DNA PROFILE SECTION */}
        <div className="dc" style={{ animationDelay: ".05s", marginBottom: 24 }}>
          {liveProfile?.dnaProfile && liveProfile.dnaProfile.includes("Billy") ? (
            <BillyLabWidget 
              dnaProfile={liveProfile.dnaProfile}
              dnaScore={liveProfile.dnaScore || 0}
              nextTopicId={liveProfile.dnaProfile === "Billy Inversionista" ? "tema-09" : (liveProfile.dnaProfile === "Billy Estratega" ? "tema-07" : "tema-06")}
              nextTopicTitle={liveProfile.dnaProfile === "Billy Inversionista" ? "Estrategias de Inversión" : (liveProfile.dnaProfile === "Billy Estratega" ? "Sistema de Crédito" : "Presupuesto Real")}
            />
          ) : dnaResult ? (
            <div style={{
              background: dnaInfo?.bg || "white",
              border: `1.5px solid ${dnaInfo?.border || "#e2e8f0"}`,
              borderRadius: 24, padding: "16px 20px",
              display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16,
              boxShadow: "0 4px 12px rgba(0,0,0,0.03)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: "white", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 12px ${dnaInfo?.icon}20` }}>
                  <Shield size={28} color={dnaInfo?.icon} strokeWidth={2.2} />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: dnaInfo?.text, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 4 }}>Tu Perfil Financiero</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: dnaInfo?.text }}>{dnaResult.dnaProfile}</div>
                </div>
              </div>
              <div style={{ flex: 1, height: 1.5, background: `${dnaInfo?.border}40`, margin: "0 10px", minWidth: 20 }} className="hidden sm:block" />
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ textAlign: "right" as const }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: dnaInfo?.text, textTransform: "uppercase", opacity: 0.6 }}>Ruta Recomendada</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: dnaInfo?.text }}>{dnaInfo?.path}</div>
                </div>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: `1px solid ${dnaInfo?.border}` }} onClick={() => router.push("/courses")}>
                  <IcoArrowRight size={18} color={dnaInfo?.text} />
                </div>
              </div>
            </div>
          ) : (
            <div style={{
              background: "linear-gradient(135deg, #f0f9ff, #e0f2fe)",
              border: "1.5px dashed #bae6fd",
              borderRadius: 24, padding: "18px 24px",
              display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 52, height: 52, borderRadius: 16, background: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Target size={28} color="#0F62FE" />
                </div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#001d6c", margin: 0 }}>Descubre tu ADN Financiero</h3>
                  <p style={{ fontSize: 13, color: "#1d4ed8", margin: 0 }}>Completa el diagnóstico para recibir una ruta personalizada.</p>
                </div>
              </div>
              <button 
                onClick={() => router.push("/diagnostic/1")}
                style={{ padding: "10px 24px", background: "#0F62FE", color: "white", borderRadius: 12, border: "none", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 12px rgba(15,98,254,0.25)" }}
              >
                Comenzar <IcoArrowRight size={16} />
              </button>
            </div>
          )}
        </div>

        {!isAdminOrTeacher && (
          <div className="stats-row" style={{ 
            display: "flex", 
            flexWrap: "wrap", 
            gap: 14, 
            marginBottom: 20,
            alignItems: "stretch" 
          }}>
            {/* CARD 1 — Racha */}
            <div className="sc dc" style={{
              animationDelay: ".07s",
              flex: "0 0 200px",
              background: streak > 0 ? "linear-gradient(145deg,#f0f9ff,#e0f2fe)" : "linear-gradient(145deg,#f8fafc,#f1f5f9)",
              border: streak > 0 ? "1px solid #bae6fd" : "1px solid #e2e8f0",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              textAlign: "center", padding: "16px", borderRadius: 24, boxShadow: "0 2px 10px rgba(0,0,0,0.02)"
            }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: streak > 0 ? "#1d4ed8" : "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Racha Diaria</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <Flame size={24} style={{ color: streak > 0 ? "#3b82f6" : "#94a3b8" }} />
                <div style={{ fontSize: 28, fontWeight: 900, color: streak > 0 ? "#001d6c" : "#cbd5e1", lineHeight: 1 }}>{streak}</div>
              </div>
              <div style={{ marginTop: 8, fontSize: 11, fontWeight: 600, color: streak > 0 ? "#3b82f6" : "#94a3b8" }}>
                {streak === 0 ? "Sin racha" : "¡Sigue así!"}
              </div>
            </div>

            {/* CARD 2 — Lecciones */}
            <div className="sc dc" style={{
              animationDelay: ".12s",
              flex: "0 0 200px",
              background: "#fff", border: "1px solid #e9eef8",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              textAlign: "center", padding: "16px", borderRadius: 24, boxShadow: "0 2px 10px rgba(0,0,0,0.02)"
            }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Lecciones</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 10 }}>
                <IcoBook size={22} color="#3b82f6" />
                <div style={{ fontSize: 28, fontWeight: 900, color: "#0F62FE", lineHeight: 1 }}>{lessons}</div>
              </div>
              <div style={{ width: "100%", height: 5, background: "#f1f5f9", borderRadius: 10, overflow: "hidden" }}>
                <div style={{ width: `${lessonPct}%`, height: "100%", background: "linear-gradient(90deg,#93c5fd,#3b82f6)", borderRadius: 10, transition: "width 1.4s cubic-bezier(.34,1.56,.64,1)" }} />
              </div>
            </div>

            {/* CARD 3 — Continue Learning (Elastic) */}
            <div className="dc" style={{
              flex: "1 1 340px",
              background:"#fff", borderRadius:24,
              border:"1.5px solid rgba(0,0,0,.055)",
              boxShadow:`0 4px 24px rgba(0,0,0,.045)`,
              position:"relative", overflow:"hidden",
              animationDelay:".21s"
            }}>
              <div style={{position:"absolute",left:0,top:0,bottom:0,width:4,background:`linear-gradient(180deg,${topicColor},${topicColor}55)`}}/>
              <div style={{padding: "16px 20px"}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                  <div style={{width:20,height:20,borderRadius:6,background:`${topicColor}18`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <IcoChart size={10} color={topicColor} strokeWidth={2.5}/>
                  </div>
                  <span style={{fontSize:9,fontWeight:800,color:topicColor,textTransform:"uppercase",letterSpacing:".10em"}}>
                    Continúa donde lo dejaste
                  </span>
                </div>

                {nextTopic ? (
                  <div className="continue-inner" style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:16}}>
                    <div style={{display:"flex",alignItems:"center",gap:16,flex:"1 1 200px"}}>
                      <div style={{
                        width:56,height:56,borderRadius:16,flexShrink:0,
                        background:`linear-gradient(135deg,${topicColor}22,${topicColor}0a)`,
                        border:`1.5px solid ${topicColor}30`,
                        display:"flex",alignItems:"center",justifyContent:"center",
                        position:"relative",overflow:"hidden"
                      }}>
                        <IcoBook size={26} color={topicColor} strokeWidth={1.5}/>
                      </div>
                      <div style={{minWidth:0}}>
                        <div style={{fontSize:9,fontWeight:800,color:"#94a3b8",textTransform:"uppercase",letterSpacing:".12em",marginBottom:2}}>
                          {nextTopic.level ?? "Finanzas"}
                        </div>
                        <div style={{fontSize:"clamp(16px,2vw,20px)",fontWeight:800,color:"#0f172a",lineHeight:1.1,letterSpacing:"-0.02em",marginBottom:4}}>
                          {nextTopic.title}
                        </div>
                        <div style={{display:"flex",alignItems:"center",gap:6,fontSize:11,color:"#64748b",fontWeight:600}}>
                          <span>{nextTopic._count?.courses ?? "?"} cursos</span>
                        </div>
                      </div>
                    </div>
                    <button className="cb" style={{ padding: "10px 20px", fontSize: 13 }} onClick={() => {
                      if (nextLessonInfo?.lessonSlug && nextLessonInfo?.courseId) {
                        router.push(`/learn/${nextLessonInfo.topic.id}/${nextLessonInfo.courseId}/${nextLessonInfo.lessonSlug}/interactive`)
                      } else if (nextTopic) {
                        const id = String(nextTopic.id)
                        const nav = (!id.startsWith("tema-") && !isNaN(parseInt(id))) ? `tema-${id.padStart(2,"0")}` : id
                        router.push(`/courses/${nav}`)
                      }
                    }}>
                      Continuar <IcoArrowRight size={15} color="#fff"/>
                    </button>
                  </div>
                ) : (
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <div style={{width:44,height:44,borderRadius:14,background:"linear-gradient(135deg,#d1fae5,#6ee7b7)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <IcoCheck size={20} color="#059669"/>
                    </div>
                    <div>
                      <div style={{fontSize:16,fontWeight:800,color:"#0f172a"}}>Completado</div>
                      <div style={{fontSize:12,color:"#64748b"}}>Has terminado todos los temas.</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            ACTIVITY + RETO DIARIO
        ══════════════════════════════════════════════════════════ */}
        <div className="dual-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16,marginBottom:24,alignItems:"start"}}>

          {/* Weekly Activity */}
          <div className="dc" style={{
            background:"#fff",borderRadius:24,padding:"20px 20px",
            border:"1.5px solid rgba(0,0,0,.055)",
            boxShadow:"0 2px 14px rgba(0,0,0,.045)",animationDelay:".25s"
          }}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:22}}>
              <div style={{width:42,height:42,borderRadius:13,background:"linear-gradient(135deg,#dbeafe,#bfdbfe)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 12px rgba(59,130,246,.18)"}}>
                <IcoCalendar size={19} color="#3b82f6" strokeWidth={2}/>
              </div>
              <div>
                <div style={{fontSize:15,fontWeight:800,color:"#0f172a"}}>Actividad Semanal</div>
                <div style={{fontSize:12,color:"#94a3b8",fontWeight:500,marginTop:1}}>
                  {Array.from(activeSet).filter(d=>days.includes(d)).length} de 7 días activos esta semana
                </div>
              </div>
            </div>

            <div style={{display:"flex",justifyContent:"space-between",gap:4}}>
              {days.map((day,i) => {
                const active  = activeSet.has(day)
                const isToday = day === todayStr
                return (
                  <div key={day} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:7,flex:1}}>
                    <div className="dd" style={{
                      background: active
                        ? "linear-gradient(135deg,#10b981,#059669)"
                        : isToday ? "#f0f9ff" : "#f8fafc",
                      border: isToday ? "2px solid #3b82f6" : active ? "2px solid #059669" : "2px solid transparent",
                      boxShadow: active ? "0 4px 12px rgba(16,185,129,.35)" : "none",
                    }}>
                      {active
                        ? <IcoCheck size={13} color="#fff"/>
                        : <span style={{fontSize:9,fontWeight:700,color:isToday?"#3b82f6":"#cbd5e1"}}>·</span>
                      }
                    </div>
                    <span style={{fontSize:10,fontWeight:700,color:isToday?"#3b82f6":"#94a3b8",textTransform:"uppercase"}}>
                      {DAY_LABELS[i]}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* streak row */}
            <div style={{marginTop:20,padding:"12px 14px",background:"#f8fafc",borderRadius:12,display:"flex",alignItems:"center",gap:8, cursor: "pointer"}} onClick={() => router.push("/profile")}>
              <Flame size={16} style={{color:"#f97316"}}/>
              <span style={{fontSize:12,fontWeight:600,color:"#475569"}}>
                {streak>0 ? `Racha activa de ${streak} días` : "Completa el reto de hoy para iniciar tu racha"}
              </span>
            </div>
          </div>

          {/* Activity Feed / Notifications */}
          <div className="dc" style={{
            background:"#fff",borderRadius:24,padding:"22px 20px",
            border:"1.5px solid rgba(0,0,0,.055)",
            boxShadow:"0 2px 14px rgba(0,0,0,.045)",animationDelay:".28s",
            display: "flex", flexDirection: "column"
          }}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:22}}>
               <div style={{display:"flex",alignItems:"center",gap:10}}>
                 <div style={{width:42,height:42,borderRadius:13,background:"linear-gradient(135deg,#fdf2f8,#fce7f3)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 12px rgba(236,72,153,.15)"}}>
                    <History size={19} color="#db2777" />
                 </div>
                 <div>
                   <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#0f172a", lineHeight: 1.2 }}>Estado de Cuenta</h3>
                   <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, marginTop: 2 }}>Historial de Tarjeta BIZEN</div>
                 </div>
               </div>
               <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#f8fafc", padding: "6px 10px", borderRadius: 10, border: "1px solid #f1f5f9" }}>
                  <Coins size={13} color="#0F62FE" />
                  <span style={{ fontSize: 11, fontWeight: 800, color: "#0F62FE" }}>{bizcoins} BC</span>
               </div>
            </div>

            <div style={{ 
              flex: 1, 
              display: "flex", 
              flexDirection: "column", 
              gap: 10, 
              maxHeight: 380, 
              overflowY: "auto",
              paddingRight: 6,
              scrollbarWidth: "none"
            }}>
              {transactions.length === 0 ? (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 0", textAlign: "center" }}>
                   <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                      <Check size={20} color="#cbd5e1" />
                   </div>
                   <p style={{ margin: 0, fontSize: 13, color: "#94a3b8", fontWeight: 600 }}>Sin movimientos</p>
                   <p style={{ margin: "4px 0 0", fontSize: 11, color: "#cbd5e1" }}>Usa tu tarjeta para ver actividad.</p>
                </div>
              ) : (
                <AnimatePresence>
                  {transactions.slice(0, 10).map((t, idx) => (
                    <motion.div 
                      key={t.id}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      style={{ 
                        padding: "12px 14px", 
                        borderRadius: 16, 
                        background: idx === 0 ? "#f0f7ff" : "white", 
                        display: "flex", 
                        alignItems: "center", 
                        gap: 14,
                        border: idx === 0 ? "1.5px solid #bfdbfe" : "1.5px solid #f1f5f9",
                        boxShadow: idx === 0 ? "0 4px 12px rgba(15,98,254,0.08)" : "none",
                        transition: "all 0.2s"
                      }}
                      onMouseEnter={e => {if(idx!==0) { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.borderColor = "#e2e8f0"; }}}
                      onMouseLeave={e => {if(idx!==0) { e.currentTarget.style.background = "white"; e.currentTarget.style.borderColor = "#f1f5f9"; }}}
                    >
                      <div style={{ 
                        width: 38, 
                        height: 38, 
                        borderRadius: 12, 
                        background: t.type === "income" ? "rgba(16,185,129,0.12)" : "rgba(244,63,94,0.08)", 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center",
                        color: t.type === "income" ? "#10B981" : "#F43F5E",
                        flexShrink: 0
                      }}>
                        {t.category === "transfer_received" ? <ArrowDownLeft size={18} /> : 
                         t.category === "transfer_sent" ? <ArrowUpRight size={18} /> :
                         t.category === "purchase" ? <ShoppingBag size={18} /> :
                         t.category === "lesson_reward" ? <BookOpen size={18} /> :
                         <Coins size={18} />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.description}</div>
                        <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 500, marginTop: 1 }}>{new Date(t.createdAt).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })} • {t.category === "purchase" ? "Gasto" : "Recompensa"}</div>
                      </div>
                      <div style={{ textAlign: "right", minWidth: 60 }}>
                        <div style={{ fontSize: 14, fontWeight: 900, color: t.type === "income" ? "#10B981" : "#F43F5E" }}>
                          {t.type === "income" ? "+" : "-"}{t.amount}
                        </div>
                        <div style={{ fontSize: 9, fontWeight: 700, color: "#94a3b8" }}>BC</div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
            
            <button onClick={() => setIsHistoryModalOpen(true)} style={{ marginTop: 12, width: "100%", background: "#f8fafc", border: "1px solid #e2e8f0", padding: "10px", borderRadius: 12, fontSize: 12, fontWeight: 700, color: "#475569", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => {e.currentTarget.style.background="#0F62FE"; e.currentTarget.style.color="white"; e.currentTarget.style.borderColor="#0F62FE"}} onMouseLeave={e => {e.currentTarget.style.background="#f8fafc"; e.currentTarget.style.color="#475569"; e.currentTarget.style.borderColor="#e2e8f0"}}>Ver historial completo</button>
          </div>

          <DailyChallengeWidget />
        </div>

        {/* ══════════════════════════════════════════════════════════
            QUICK LINKS
        ══════════════════════════════════════════════════════════ */}
        <div>
          <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:16}}>
            <div style={{width:28,height:28,borderRadius:9,background:"linear-gradient(135deg,#dbeafe,#bfdbfe)",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <IcoGrid size={14} color="#3b82f6" strokeWidth={2.5}/>
            </div>
            <span style={{fontSize:18,fontWeight:800,color:"#0f172a",letterSpacing:"-0.01em"}}>Accesos Rápidos</span>
          </div>

          <div className="quick-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:12}}>
            {([
              { Icon:IcoBook,    label:"Aprende Finanzas",  sub:"30 temas en total",       href:"/courses",    color:"#3b82f6", bg:"#dbeafe", delay:".33s" },
              { Icon:IcoGamepad, label:"Simuladores",        sub:"Practica con escenarios",  href:"/cash-flow", color:"#8b5cf6", bg:"#ede9fe", delay:".37s" },
              { Icon:IcoStore,   label:"Tienda Bizen",       sub:`${bizcoins.toLocaleString()} BIZCOINS`,        href:"/tienda",   color:"#d97706", bg:"#fef3c7", delay:".41s" },
              { Icon:IcoUsers,   label:"Foro",               sub:"Comunidad activa",          href:"/forum",    color:"#10b981", bg:"#d1fae5", delay:".45s" },
              { Icon:IcoTrophy,  label:"Rankings",           sub:"Tu posición global",        href:"/rankings", color:"#ef4444", bg:"#fee2e2", delay:".49s" },
              { Icon:IcoZap,     label: (dbProfile?.role === 'teacher' || dbProfile?.role === 'school_admin') ? "Lanzar Live Quiz" : "Bizen Live", sub:"Quizzes en tiempo real", href:(dbProfile?.role === 'teacher' || dbProfile?.role === 'school_admin') ? "/live/host" : "/live/join", color:"#fbbf24", bg:"#fef3c7", delay:".51s" },
              { Icon:IcoUser,    label:"Mi Perfil",          sub:"Insignias y logros",        href:"/profile",  color:"#0891b2", bg:"#cffafe", delay:".53s" },
            ] as const).map(({Icon,label,sub,href,color,bg,delay})=>(
              <div key={href} className="ql dc" style={{animationDelay:delay}} onClick={()=>router.push(href)}>
                <div 
                  className="ql-icon-box"
                  style={{width:46,height:46,borderRadius:14,background:bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:`0 4px 12px ${color}20`}}
                >
                  <Icon size={22} color={color} strokeWidth={1.8}/>
                </div>
                <div style={{minWidth:0,flex:1}}>
                  <div className="ql-label">{label}</div>
                  <div className="ql-sub">{sub}</div>
                </div>
                <div className="ql-arrow" style={{flexShrink:0,opacity:.3}}>
                  <IcoArrowRight size={15} color="#64748b"/>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* DNA Evolution Modal overlay */}
      {showEvolution && dnaResult && (
        <DNAEvolutionScreen 
          currentProfile="Aspirante BIZEN"
          newProfile={dnaResult.dnaProfile}
          stats={{
            mentalidad: dnaResult.categoryScores?.Presupuesto?.percentage ?? 80,
            bases: dnaResult.categoryScores?.Crédito?.percentage ?? 80,
            optimizacion: dnaResult.categoryScores?.Inversión?.percentage ?? 80,
            ahorro: dnaResult.categoryScores?.Ahorro?.percentage ?? 80,
            riesgos: dnaResult.categoryScores?.Seguridad?.percentage ?? 80,
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

export default function DashboardPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <DashboardContent />
    </Suspense>
  )
}
