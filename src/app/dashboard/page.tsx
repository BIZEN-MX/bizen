"use client"

import React, { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import PageLoader from "@/components/PageLoader"
import DailyChallengeWidget from "@/components/DailyChallengeWidget"
import { SUBTEMAS_BY_COURSE } from "@/data/lessons/courseLessonsOrder"
import { Flame } from "lucide-react"

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
  Fundamentos:"#3b82f6", Presupuesto:"#0ea5e9", Ahorro:"#10b981",
  Deuda:"#f59e0b", Impuestos:"#6366f1", Economía:"#8b5cf6",
  Inversión:"#2563eb", Patrimonio:"#10b981", Errores:"#f59e0b",
  Mentalidad:"#eab308", Emprender:"#ef4444", Negocios:"#6366f1",
  Bienestar:"#ec4899", Resiliencia:"#dc2626", Futuro:"#0ea5e9",
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
export default function DashboardPage() {
  const { user, loading, dbProfile } = useAuth()
  const router = useRouter()

  const [stats,            setStats]            = useState<Stats | null>(null)
  const [topics,           setTopics]           = useState<Topic[]>([])
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [loadingData,      setLoadingData]      = useState(true)

  const firstName = useMemo(() => {
    const n = dbProfile?.fullName || user?.email || ""
    return n.split(" ")[0]
  }, [dbProfile, user])

  /* next incomplete topic — same logic as /courses */
  const nextTopic = useMemo(() => {
    for (let i = 0; i < topics.length; i++) {
      const sub = SUBTEMAS_BY_COURSE[i]
      if (!sub) continue
      const slugs = sub.flatMap((s: any) => s.lessons.map((l: any) => l.slug))
      if (!slugs.length) continue
      if (!slugs.every((sl: string) => completedLessons.includes(sl))) return topics[i]
    }
    return null
  }, [topics, completedLessons])

  const topicColor  = nextTopic?.level ? (TOPIC_COLORS[nextTopic.level] ?? "#3b82f6") : "#3b82f6"
  const days        = useMemo(() => weekDays(), [])
  const activeSet   = useMemo(() => new Set(stats?.weeklyActiveDays ?? []), [stats])
  const todayStr    = new Date().toISOString().split("T")[0]

  const xpPct = useMemo(() => {
    if (!stats) return 0
    const total = stats.xpInCurrentLevel + stats.xpToNextLevel
    return total > 0 ? Math.round((stats.xpInCurrentLevel / total) * 100) : 0
  }, [stats])

  useEffect(() => {
    if (loading) return
    if (!user)   { router.replace("/login"); return }
    const go = async () => {
      setLoadingData(true)
      try {
        const [sR, tR, pR] = await Promise.all([
          fetch("/api/user/stats"),
          fetch("/api/topics"),
          fetch("/api/progress"),
        ])
        if (sR.ok) setStats(await sR.json())
        if (tR.ok) setTopics(await tR.json())
        if (pR.ok) {
          const pd = await pR.json()
          setCompletedLessons(
            (pd.progress ?? pd ?? []).map((p: any) => p.lessonId || p.slug || "").filter(Boolean)
          )
        }
      } catch {/* silent */} finally { setLoadingData(false) }
    }
    go()
  }, [user, loading, router])

  if (loading || loadingData) return <PageLoader />

  const streak   = stats?.currentStreak   ?? 0
  const bizcoins = stats?.bizcoins        ?? 0
  const lessons  = stats?.lessonsCompleted ?? 0
  const level    = stats?.level           ?? 1
  const lessonPct = Math.min(100, Math.round((lessons / 150) * 100))

  return (
    <div style={{ minHeight: "100vh", background: "#FBFAF5", width: "100%", boxSizing: "border-box", fontFamily: '"SF Pro Display","SF Pro Text",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif' }}>
      <style>{`
        /* ── sidebar offsets ── */
        @media (max-width:767px)              { .di { padding:20px 16px 100px !important; margin-left:0 !important; } }
        @media (min-width:768px) and (max-width:1160px) { .di { margin-left:220px !important; padding:32px 28px 64px !important; } }
        @media (min-width:1161px)             { .di { margin-left:280px !important; padding:40px 60px 80px !important; max-width: 1600px !important; margin-right: auto !important; } }

        /* ── animations ── */
        @keyframes du { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fl { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        @keyframes sh { 0%{left:-100%} 20%,100%{left:120%} }
        @keyframes pr { 0%,100%{opacity:1} 50%{opacity:.55} }
        @keyframes scale-in { from{transform:scale(0.92);opacity:0} to{transform:scale(1);opacity:1} }

        .dc { animation: du .48s cubic-bezier(.2,.8,.2,1) both; }

        /* stat card — screenshot style: colored bg, centered content, no heavy border */
        .sc {
          border-radius:20px; padding:28px 24px 24px;
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
          border-radius:20px; padding:18px 16px;
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

          /* STAT CARDS: side by side logic or smaller height */
          .stats-row { 
            display: grid !important; 
            grid-template-columns: 1fr 1fr !important;
            gap: 10px !important;
          }
          /* Card 1 & 2 side by side, Card 3 full width */
          .stats-row > div:nth-child(3) { grid-column: span 2; min-height: 100px !important; }
          .sc { padding: 16px 14px !important; min-height: 110px !important; }
          .sc-num { font-size: 32px !important; margin-top: 8px !important; }
          .sc-label { font-size: 9px !important; margin-bottom: 8px !important; }

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
          .ql { padding:12px 10px !important; gap:8px !important; }
          .ql-label { font-size: 13px !important; }
          .ql-sub { font-size: 11px !important; }
        }

        @media (max-width:380px) {
          /* single col on very tiny screens */
          .quick-grid { grid-template-columns:1fr !important; }
          .ql { flex-direction:row !important; align-items:center !important; }
        }
      `}</style>

      {/* ── background orbs ── */}
      <div style={{position:"fixed",top:"3%",right:"-8%",width:560,height:560,background:"radial-gradient(circle,rgba(59,130,246,.08) 0%,transparent 70%)",borderRadius:"50%",filter:"blur(80px)",pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"fixed",bottom:"8%",left:"-8%",width:500,height:500,background:"radial-gradient(circle,rgba(139,92,246,.07) 0%,transparent 70%)",borderRadius:"50%",filter:"blur(90px)",pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"fixed",top:"50%",left:"30%",width:400,height:400,background:"radial-gradient(circle,rgba(16,185,129,.05) 0%,transparent 70%)",borderRadius:"50%",filter:"blur(80px)",pointerEvents:"none",zIndex:0}}/>

      {/* ── content wrapper ── */}
      <div className="di" style={{position:"relative",zIndex:1,boxSizing:"border-box",maxWidth:"none"}}>

        {/* ══════════════════════════════════════════════════════════
            HERO
        ══════════════════════════════════════════════════════════ */}
        <div className="dc" style={{
          background:"linear-gradient(135deg,#0a0f2e 0%,#0d2a6b 45%,#1a56db 100%)",
          borderRadius:32, padding:"clamp(36px,5vw,56px) clamp(32px,5vw,52px)",
          marginBottom:24, position:"relative", overflow:"hidden",
          boxShadow:"0 24px 64px rgba(13,42,107,.35), inset 0 1px 0 rgba(255,255,255,.08)",
          animationDelay:"0s",
        }}>
          {/* mesh-style orbs inside hero */}
          <div style={{position:"absolute",top:"-40%",right:"-8%",width:360,height:360,background:"radial-gradient(circle,rgba(96,165,250,.22) 0%,transparent 70%)",borderRadius:"50%",pointerEvents:"none"}}/>
          <div style={{position:"absolute",bottom:"-30%",left:"5%",width:300,height:300,background:"radial-gradient(circle,rgba(167,139,250,.18) 0%,transparent 70%)",borderRadius:"50%",pointerEvents:"none"}}/>
          <div style={{position:"absolute",top:"20%",left:"40%",width:240,height:240,background:"radial-gradient(circle,rgba(244,114,182,.12) 0%,transparent 70%)",borderRadius:"50%",pointerEvents:"none"}}/>

          <div style={{position:"relative",zIndex:1,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:28}}>
            {/* left */}
            <div style={{flex:"1 1 300px"}}>
              {/* badge */}
              <div style={{display:"inline-flex",alignItems:"center",gap:7,background:"rgba(255,255,255,.10)",border:"1px solid rgba(255,255,255,.15)",borderRadius:999,padding:"5px 14px",marginBottom:18}}>
                <IcoShield size={12} color="#93c5fd" strokeWidth={2.5}/>
                <span style={{fontSize:11,fontWeight:700,color:"#93c5fd",letterSpacing:".07em",textTransform:"uppercase"}}>Tu espacio personal</span>
              </div>

              {/* greeting */}
              <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:10}}>
                <div style={{width:52,height:52,borderRadius:16,background:"rgba(255,255,255,.10)",border:"1px solid rgba(255,255,255,.15)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <IcoWave size={30} color="#fff"/>
                </div>
                <h1 style={{fontSize:"clamp(26px,4.5vw,44px)",fontWeight:800,color:"#fff",margin:0,lineHeight:1.1,letterSpacing:"-0.025em"}}>
                  {getGreeting()}, <span style={{background:"linear-gradient(90deg,#93c5fd,#c4b5fd)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{firstName}</span>
                </h1>
              </div>

              <p style={{fontSize:"clamp(13px,1.8vw,16px)",color:"rgba(255,255,255,.55)",margin:"0 0 28px",lineHeight:1.65}}>
                {streak >= 7
                  ? `Llevas ${streak} días de racha. Eres imparable.`
                  : streak >= 1
                    ? `Llevas ${streak} día${streak>1?"s":""} de racha. ¡Sigue así!`
                    : "Completa el reto de hoy y comienza tu racha."}
              </p>

              {/* mini stats row inside hero */}
              <div className="hero-stats-pills" style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                {[
                  { icon:<Flame size={14} style={{color:"#fb923c"}}/>, label:`${streak} días`, sub:"Racha", bg:"rgba(251,146,60,.15)", border:"rgba(251,146,60,.25)" },
                  { icon:<IcoZap size={14} color="#fbbf24"/>,   label:`${(stats?.xpInCurrentLevel??0).toLocaleString()} XP`, sub:"Nivel Actual", bg:"rgba(251,191,36,.12)", border:"rgba(251,191,36,.25)" },
                  { icon:<IcoCoin size={14} color="#34d399"/>,  label:`${bizcoins.toLocaleString()} BC`, sub:"Bizcoins", bg:"rgba(52,211,153,.12)", border:"rgba(52,211,153,.25)" },
                ].map(m => (
                  <div key={m.sub} style={{display:"flex",alignItems:"center",gap:9,background:m.bg,border:`1px solid ${m.border}`,borderRadius:12,padding:"9px 14px"}}>
                    {m.icon}
                    <div>
                      <div style={{fontSize:13,fontWeight:800,color:"#fff",lineHeight:1.2}}>{m.label}</div>
                      <div style={{fontSize:10,fontWeight:600,color:"rgba(255,255,255,.5)",textTransform:"uppercase",letterSpacing:".08em",marginTop:2}}>{m.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* right: XP ring */}
            <div className="hero-xp-ring" style={{flex:"0 0 auto",display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
              <div style={{animation:"fl 4s ease-in-out infinite"}}>
                <XPRing pct={xpPct} level={level}/>
              </div>
              <div style={{textAlign:"center"}}>
                <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,.45)",textTransform:"uppercase",letterSpacing:".08em",lineHeight:1.5}}>
                  {xpPct}% hacia nivel {level+1}
                </div>
                <div style={{fontSize:12,fontWeight:600,color:"rgba(255,255,255,.30)",marginTop:3}}>
                  {stats?.xpToNextLevel??0} XP restantes
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STAT CARDS */}
        <div className="stats-row" style={{display:"flex",gap:14,marginBottom:24,alignItems:"stretch"}}>

          {/* CARD 1 — Racha */}
          <div className="sc dc" style={{
            animationDelay:".07s",
            background: streak > 0 ? "linear-gradient(145deg,#fffbeb,#fef3c7)" : "linear-gradient(145deg,#f8fafc,#f1f5f9)",
            border: streak > 0 ? "1px solid #fde68a" : "1px solid #e2e8f0",
            display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
            textAlign:"center", minHeight:160,
          }}>
            <div className="sc-label" style={{color: streak > 0 ? "#b45309" : "#94a3b8", marginBottom:18}}>Racha Diaria</div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              <Flame size={34} style={{color: streak > 0 ? "#d97706" : "#94a3b8"}}/>
              <div className="sc-num" style={{color: streak > 0 ? "#92400e" : "#cbd5e1"}}>{streak}</div>
            </div>
            <div style={{marginTop:10,fontSize:13,fontWeight:600,color: streak > 0 ? "#d97706" : "#94a3b8"}}>
              {streak === 0 ? "Sin racha activa" : streak >= 7 ? "Racha legendaria" : "¡No la rompas!"}
            </div>
          </div>

          {/* CARD 2 — Lecciones */}
          <div className="sc dc" style={{
            animationDelay:".12s",
            background:"#fff", border:"1px solid #e9eef8",
            display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
            textAlign:"center", minHeight:160,
          }}>
            <div className="sc-label" style={{color:"#94a3b8", marginBottom:18}}>Lecciones completadas</div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:16}}>
              <IcoBook size={32} color="#0F62FE"/>
              <div className="sc-num" style={{color:"#0F62FE"}}>{lessons}</div>
            </div>
            <div style={{width:"100%",height:5,background:"#e0e9ff",borderRadius:10,overflow:"hidden"}}>
              <div style={{width:`${lessonPct}%`,height:"100%",background:"linear-gradient(90deg,#93c5fd,#0F62FE)",borderRadius:10,transition:"width 1.4s cubic-bezier(.34,1.56,.64,1)"}}/>
            </div>
          </div>

          {/* CARD 3 — Bizcoins */}
          <div className="sc dc" style={{
            animationDelay:".17s", cursor:"pointer",
            background:"linear-gradient(145deg,#eff6ff,#dbeafe)", border:"1px solid #bfdbfe",
            display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
            textAlign:"center", minHeight:160,
          }} onClick={()=>router.push("/tienda")}>
            <div className="sc-label" style={{color:"#1d4ed8", marginBottom:18}}>Bizcoins</div>
            <div style={{display:"flex",alignItems:"baseline",justifyContent:"center",gap:6,marginBottom:10}}>
              <div className="sc-num" style={{color:"#1e40af"}}>{bizcoins.toLocaleString()}</div>
              <div style={{fontSize:15,fontWeight:600,color:"#3b82f6"}}>BC</div>
            </div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,fontSize:12,fontWeight:600,color:"#3b82f6"}}>
              <IcoStore size={12} color="#3b82f6" strokeWidth={2}/>
              Ver tienda
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            CONTINUE LEARNING
        ══════════════════════════════════════════════════════════ */}
        <div className="dc" style={{
          background:"#fff", borderRadius:28,
          border:"1.5px solid rgba(0,0,0,.055)",
          boxShadow:`0 4px 24px rgba(0,0,0,.06), 0 0 0 3px ${topicColor}14`,
          marginBottom:24, position:"relative", overflow:"hidden",
          animationDelay:".21s"
        }}>
          {/* colored left border accent */}
          <div style={{position:"absolute",left:0,top:0,bottom:0,width:4,background:`linear-gradient(180deg,${topicColor},${topicColor}55)`}}/>

          <div style={{padding:"clamp(28px,4vw,40px) clamp(28px,4vw,40px) clamp(28px,4vw,40px) calc(clamp(28px,4vw,40px) + 12px)"}}>
            {/* section label */}
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:20}}>
              <div style={{width:28,height:28,borderRadius:9,background:`${topicColor}18`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <IcoChart size={14} color={topicColor} strokeWidth={2.5}/>
              </div>
              <span style={{fontSize:11,fontWeight:800,color:topicColor,textTransform:"uppercase",letterSpacing:".10em"}}>
                Continúa donde lo dejaste
              </span>
            </div>

            {nextTopic ? (
              <div className="continue-inner" style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:20}}>
                <div style={{display:"flex",alignItems:"center",gap:20,flex:"1 1 260px"}}>
                  {/* icon box */}
                  <div style={{
                    width:72,height:72,borderRadius:20,flexShrink:0,
                    background:`linear-gradient(135deg,${topicColor}22,${topicColor}0a)`,
                    border:`1.5px solid ${topicColor}30`,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    boxShadow:`0 8px 24px ${topicColor}20`,
                    position:"relative",overflow:"hidden"
                  }}>
                    <div style={{position:"absolute",bottom:"-20%",right:"-20%",width:60,height:60,background:`radial-gradient(circle,${topicColor}30 0%,transparent 70%)`,borderRadius:"50%"}}/>
                    <IcoBook size={32} color={topicColor} strokeWidth={1.5}/>
                  </div>
                  <div style={{minWidth:0}}>
                    <div style={{fontSize:11,fontWeight:800,color:"#94a3b8",textTransform:"uppercase",letterSpacing:".12em",marginBottom:8,lineHeight:1.4}}>
                      {nextTopic.level ?? "Finanzas"}
                    </div>
                    <div style={{fontSize:"clamp(16px,3vw,26px)",fontWeight:800,color:"#0f172a",lineHeight:1.2,letterSpacing:"-0.02em",marginBottom:10}}>
                      {nextTopic.title}
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:7,fontSize:12,color:"#64748b",fontWeight:600}}>
                      <IcoMap size={13} color="#94a3b8" strokeWidth={2}/>
                      <span>{nextTopic._count?.courses ?? "?"} cursos en este tema</span>
                    </div>
                  </div>
                </div>
                <button className="cb" onClick={() => {
                  const id = String(nextTopic.id)
                  const nav = (!id.startsWith("tema-") && !isNaN(parseInt(id))) ? `tema-${id.padStart(2,"0")}` : id
                  router.push(`/courses/${nav}`)
                }}>
                  Continuar <IcoArrowRight size={17} color="#fff"/>
                </button>
              </div>
            ) : (
              <div style={{display:"flex",alignItems:"center",gap:16}}>
                <div style={{width:60,height:60,borderRadius:18,background:"linear-gradient(135deg,#d1fae5,#6ee7b7)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <IcoCheck size={28} color="#059669"/>
                </div>
                <div>
                  <div style={{fontSize:22,fontWeight:800,color:"#0f172a"}}>Camino completado</div>
                  <div style={{fontSize:14,color:"#64748b",marginTop:4}}>Has terminado todos los temas. Eres increíble.</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            ACTIVITY + RETO DIARIO
        ══════════════════════════════════════════════════════════ */}
        <div className="dual-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16,marginBottom:24}}>

          {/* Weekly Activity */}
          <div className="dc" style={{
            background:"#fff",borderRadius:24,padding:"28px 24px",
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
            <div style={{marginTop:20,padding:"12px 14px",background:"#f8fafc",borderRadius:12,display:"flex",alignItems:"center",gap:8}}>
              <Flame size={16} style={{color:"#f97316"}}/>
              <span style={{fontSize:12,fontWeight:600,color:"#475569"}}>
                {streak>0 ? `Racha activa de ${streak} días` : "Completa el reto de hoy para iniciar tu racha"}
              </span>
            </div>
          </div>

          {/* Misión del día Interactivo */}
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
              { Icon:IcoUser,    label:"Mi Perfil",          sub:"Insignias y logros",        href:"/profile",  color:"#0891b2", bg:"#cffafe", delay:".53s" },
            ] as const).map(({Icon,label,sub,href,color,bg,delay})=>(
              <div key={href} className="ql dc" style={{animationDelay:delay}} onClick={()=>router.push(href)}>
                <div style={{width:46,height:46,borderRadius:14,background:bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:`0 4px 12px ${color}20`}}>
                  <Icon size={22} color={color} strokeWidth={1.8}/>
                </div>
                <div style={{minWidth:0,flex:1}}>
                  <div className="ql-label">{label}</div>
                  <div className="ql-sub">{sub}</div>
                </div>
                <div style={{flexShrink:0,opacity:.3}}>
                  <IcoArrowRight size={15} color="#64748b"/>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
