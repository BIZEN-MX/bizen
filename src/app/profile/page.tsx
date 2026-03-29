"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useOnboarding } from "@/contexts/OnboardingContext"
import { createClientMicrocred } from "@/lib/supabase/client-microcred"
import PageLoader from "@/components/PageLoader"
import { AvatarDisplay } from "@/components/AvatarDisplay"
import { AVATAR_OPTIONS, AVATAR_CATEGORIES, getDefaultAvatar } from "@/lib/avatarOptions"
import Link from "next/link"
import {
  Flame, Zap, Shield, Award, UserPlus, Users,
  Search, Mail, ChevronRight, X as CloseIcon, Camera, Star,
  Trophy, BookOpen, Compass, Share2, Heart, Settings, Instagram,
  Palette, CreditCard, Lock as LockIcon
} from "lucide-react"
import BizenVirtualCard, { CardTheme } from "@/components/BizenVirtualCard"

// --- CUSTOM ILLUSTRATIONS ---
const CommunityIllustration = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="40" cy="40" r="40" fill="#0F62FE" fillOpacity="0.05" />
    <path d="M40 48C46.6274 48 52 42.6274 52 36C52 29.3726 46.6274 24 40 24C33.3726 24 28 29.3726 28 36C28 42.6274 33.3726 48 40 48Z" stroke="#0F62FE" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M22 60V56C22 51.5817 25.5817 48 30 48H32" stroke="#0F62FE" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M58 60V56C58 51.5817 54.4183 48 50 48H48" stroke="#0F62FE" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const FollowIllustration = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="40" cy="40" r="40" fill="#0F62FE" fillOpacity="0.05" />
    <path d="M40 24V56M24 40H56" stroke="#0F62FE" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" />
    <path d="M40 28C44.4183 28 48 31.5817 48 36C48 40.4183 44.4183 44 40 44C35.5817 44 32 40.4183 32 36C32 31.5817 35.5817 28 40 28Z" stroke="#0F62FE" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M28 56V52C28 47.5817 31.5817 44 36 44H44C48.4183 44 52 47.5817 52 52V56" stroke="#0F62FE" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

interface UserStats {
  xp: number
  level: number
  xpInCurrentLevel: number
  xpNeeded: number
  xpToNextLevel: number
  currentStreak?: number
  weeklyActiveDays?: string[]
  inventory?: string[]
}

interface AchievementDef {
  id: string; title: string; description: string;
  icon: string; category: string; threshold: number;
  xpReward: number; rarity: string;
  unlocked: boolean; unlockedAt: string | null
}

const RARITY_CFG: Record<string, { grad: string; color: string; label: string }> = {
  común:      { grad: "linear-gradient(135deg,#374151,#1f2937)", color: "#9ca3af", label: "Común" },
  raro:       { grad: "linear-gradient(135deg,#1e3a8a,#1d4ed8)", color: "#60a5fa", label: "Raro" },
  épico:      { grad: "linear-gradient(135deg,#5b21b6,#7c3aed)", color: "#c4b5fd", label: "Épico" },
  legendario: { grad: "linear-gradient(135deg,#92400e,#d97706)", color: "#fbbf24", label: "Legendario" },
}

function AchievementIconSm({ icon, size = 22, color = "currentColor" }: { icon: string; size?: number; color?: string }) {
  const p = { width: size, height: size, style: {} }
  switch (icon) {
    case "flame": return <Flame {...p} color={color} />
    case "zap": return <Zap {...p} color={color} />
    case "award": return <Award {...p} color={color} />
    case "trophy": return <Trophy {...p} color={color} />
    case "star": return <Star {...p} color={color} />
    default: return <Shield {...p} color={color} />
  }
}

function AchievementCard({ a, cfg }: { a: AchievementDef; cfg: { grad: string; color: string; label: string } }) {
  const [flipped, setFlipped] = React.useState(false)
  
  return (
    <div onClick={() => setFlipped(!flipped)} style={{ perspective: "900px", cursor: "pointer", userSelect: "none" }}>
      <div style={{
        position: "relative", width: "100%", paddingBottom: "130%", transformStyle: "preserve-3d",
        transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)", transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
      }}>
        {/* FRONT */}
        <div style={{
          position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
          borderRadius: 20, background: a.unlocked ? cfg.grad : "#f1f5f9", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", textAlign: "center", padding: 16, border: a.unlocked ? "none" : "1.5px dashed #cbd5e1"
        }}>
          {!a.unlocked && <LockIcon size={14} color="#94a3b8" style={{ position: "absolute", top: 12, right: 12 }} />}
          <div style={{ width: 48, height: 48, borderRadius: 12, background: a.unlocked ? "rgba(255,255,255,0.2)" : "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
            <AchievementIconSm icon={a.icon} size={24} color={a.unlocked ? "white" : "#94a3b8"} />
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: a.unlocked ? "white" : "#64748b", lineHeight: 1.2 }}>{a.title}</div>
          <div style={{ fontSize: 9, fontWeight: 600, color: a.unlocked ? "rgba(255,255,255,0.6)" : "#94a3b8", textTransform: "uppercase", marginTop: 4 }}>{cfg.label}</div>
        </div>
        {/* BACK */}
        <div style={{
          position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
          transform: "rotateY(180deg)", borderRadius: 20, background: "#1e293b", padding: 16, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", textAlign: "center", color: "white"
        }}>
          <div style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.4 }}>{a.description}</div>
          {a.unlockedAt && <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", marginTop: 8 }}>Obtenido el {new Date(a.unlockedAt).toLocaleDateString()}</div>}
        </div>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const { user, loading, refreshUser, dbProfile } = useAuth()
  const { startTour } = useOnboarding()
  const router = useRouter()
  const supabase = createClientMicrocred()

  const [mounted, setMounted] = useState(false)
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const [savingAvatar, setSavingAvatar] = useState(false)
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [loadingStats, setLoadingStats] = useState(true)
  const [profileStats, setProfileStats] = useState<{ joinDate: string | null; followersCount: number; followingCount: number } | null>(null)
  const [rightTab, setRightTab] = useState<"following" | "followers">("following")
  const [followers, setFollowers] = useState<any[]>([])
  const [following, setFollowing] = useState<any[]>([])
  const [loadingFollowers, setLoadingFollowers] = useState(false)
  const [loadingFollowing, setLoadingFollowing] = useState(false)
  const [achievements, setAchievements] = useState<AchievementDef[]>([])
  const [loadingAchievements, setLoadingAchievements] = useState(true)
  const [screenSize, setScreenSize] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200)
  const [cardTheme, setCardTheme] = useState<CardTheme>("blue")
  const [savingTheme, setSavingTheme] = useState(false)
  const [isThemePickerOpen, setIsThemePickerOpen] = useState(false)
  const [planPopoverOpen, setPlanPopoverOpen] = useState(false)

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (loading) return
    if (!user) { router.push("/login"); return }
    const currentTheme = dbProfile?.cardTheme || dbProfile?.card_theme || user.user_metadata?.cardTheme || "blue"
    setCardTheme(currentTheme as CardTheme)
    
    const fetchData = async () => {
      try {
        const [statsRes, profStatsRes, achRes] = await Promise.all([
          fetch(`/api/user/stats?t=${Date.now()}`),
          fetch(`/api/profile/stats?t=${Date.now()}`),
          fetch(`/api/achievements`)
        ]);
        if (statsRes.ok) setUserStats(await statsRes.json());
        if (profStatsRes.ok) setProfileStats(await profStatsRes.json());
        if (achRes.ok) {
          const achData = await achRes.json();
          setAchievements(Array.isArray(achData) ? achData : []);
        }
      } catch (err) {
        console.error("Error fetching profile data", err);
      } finally {
        setLoadingStats(false);
        setLoadingAchievements(false);
      }
    };
    fetchData();
  }, [user, loading]);

  const fetchFollowersList = async () => {
    if (!user?.id || loadingFollowers) return
    setLoadingFollowers(true)
    try {
      const r = await fetch(`/api/forum/profile/${user.id}/followers`);
      if (r.ok) {
        const d = await r.json();
        setFollowers(d.followers || []);
      }
    } finally { setLoadingFollowers(false) }
  }
  const fetchFollowingList = async () => {
    if (!user?.id || loadingFollowing) return
    setLoadingFollowing(true)
    try {
      const r = await fetch(`/api/forum/profile/${user.id}/following`);
      if (r.ok) {
        const d = await r.json();
        setFollowing(d.following || []);
      }
    } finally { setLoadingFollowing(false) }
  }

  const updateAvatar = async (newAvatar: any) => {
    if (!supabase) return
    setSavingAvatar(true)
    try {
      await supabase.auth.updateUser({ data: { avatar: newAvatar } })
      await fetch("/api/profiles", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ avatar: newAvatar }) })
      if (refreshUser) refreshUser()
      setIsPickerOpen(false)
    } finally { setSavingAvatar(false) }
  }

  const updateCardTheme = async (newTheme: CardTheme) => {
    if (!supabase) return
    setSavingTheme(true);
    setCardTheme(newTheme);
    try {
      await supabase.auth.updateUser({ data: { cardTheme: newTheme } })
      await fetch("/api/profiles", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ cardTheme: newTheme }) })
      if (refreshUser) refreshUser()
    } finally { setSavingTheme(false) }
  }

  const handleSignOut = async () => {
    if (!supabase) return;
    try {
      await supabase.auth.signOut();
      router.push("/login");
    } catch { console.error("Error signing out") }
  }

  if (loading || !mounted || loadingStats) return <PageLoader />
  if (!user) return null

  const isAdminOrTeacher = dbProfile?.role === 'school_admin' || dbProfile?.role === 'teacher'
  const isParticular = dbProfile?.role === 'particular'
  const isInstitutionalStudent = dbProfile?.role === 'student'
  const isPremium = dbProfile?.subscriptionStatus === 'active' || (dbProfile?.school?.licenses?.length || 0) > 0

  const getPlanTitle = () => {
    if (isAdminOrTeacher || isInstitutionalStudent) return "INSTITUCIONAL"
    if (isParticular) return isPremium ? "PREMIUM" : "BÁSICO"
    return null
  }

  const displayName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Usuario"
  const nickname = user.user_metadata?.username || user.email?.split("@")[0] || ""
  const level = userStats?.level || dbProfile?.level || 1
  const totalXp = userStats?.xp || 0
  const bizcoins = (dbProfile as any)?.bizcoins || 0
  const xpPct = Math.min(((userStats?.xpInCurrentLevel || 0) / (userStats?.xpNeeded || 100)) * 100, 100)
  const xpInLevel = userStats?.xpInCurrentLevel || 0
  const xpForNext = userStats?.xpNeeded || 100

  const getLeagueTitle = (lvl: number) => {
    if (lvl >= 20) return "Leyenda"
    if (lvl >= 15) return "Maestro"
    if (lvl >= 10) return "Experto"
    if (lvl >= 5)  return "Avanzado"
    return "Explorer"
  }

  const getPlanInfo = () => {
    const plan = getPlanTitle()
    if (plan === "BÁSICO") return {
      label: "Plan Básico", color: "#0F62FE", bg: "white",
      desc: "Accede a lecciones gratuitas y a tu tarjeta BIZEN. Mejora a Pro para desbloquear todo el contenido.",
      cta: "Mejorar a BIZEN Pro — $179/mes"
    }
    if (plan === "PREMIUM") return {
      label: "BIZEN Pro", color: "white", bg: "rgba(16,185,129,0.9)",
      desc: "Tienes acceso ilimitado a todos los cursos, simuladores y herramientas premium de la plataforma.",
      cta: null
    }
    if (plan === "INSTITUCIONAL") return {
      label: "Plan Institucional", color: "white", bg: "rgba(99,102,241,0.85)",
      desc: "Tu acceso es gestionado por tu institución educativa. Disfruta de todos los beneficios del plan.",
      cta: null
    }
    return null
  }

  const statCards = [
    { icon: <Flame size={20} color="#0F62FE" />, value: userStats?.currentStreak || 0, label: "Racha" },
    { icon: <Zap size={20} color="#0F62FE" />, value: totalXp, label: "Total XP" },
    { icon: <Award size={20} color="#0F62FE" />, value: achievements.filter(a => a.unlocked).length, label: "Logros" },
    { icon: <Star size={20} color="#0F62FE" />, value: getLeagueTitle(level), label: "Liga" },
  ]

  return (
    <div className="prof-outer" style={{ minHeight: "100vh", background: "#FBFAF5" }}>
      <style>{`
        @media (max-width: 767px) {
          .prof-outer { width: 100% !important; margin-left: 0 !important; padding: 12px 12px 100px !important; }
          .prof-body  { flex-direction: column !important; gap: 20px !important; }
          .prof-side  { width: 100% !important; order: 1; }
          .prof-hero  { height: 200px !important; border-radius: 24px !important; padding: 20px !important; align-items: center !important; justify-content: center !important; }
          .prof-avatar-box { width: 110px !important; height: 110px !important; margin-top: 0 !important; }
        }
        @media (min-width: 768px) and (max-width: 1160px) {
          .prof-outer { margin-left: 220px !important; padding: 40px 24px 80px !important; width: calc(100% - 220px) !important; }
        }
        @media (min-width: 1161px) {
          .prof-outer { margin-left: 280px !important; padding: 60px 48px 80px !important; width: calc(100% - 280px) !important; }
        }
        .prof-card { background: white; border: 1.5px solid #e2e8f0; border-radius: 24px; box-shadow: 0 4px 20px rgba(15,23,42,0.03); transition: transform 0.2s; }
        .prof-card:hover { transform: translateY(-2px); }
        .prof-tab-btn { flex: 1; padding: 14px; border: none; background: transparent; font-weight: 700; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; transition: all 0.2s; }
        .prof-tab-btn.active { color: #0F62FE; border-bottom: 2px solid #0F62FE; background: #f8fafc; }
        .prof-tab-btn.inactive { color: #94a3b8; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.4s ease both; }
      `}</style>

      {/* Hero Banner with Identity */}
      <div className="prof-hero fade-up" style={{ 
        height: 220, background: "linear-gradient(135deg, #0b1e5e 0%, #0F62FE 100%)", 
        borderRadius: 32, position: "relative", marginBottom: 32,
        boxShadow: "0 20px 40px -12px rgba(15,98,254,0.3)",
        display: "flex", alignItems: "flex-end", padding: screenSize < 768 ? "24px" : "40px 48px"
      }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.1, backgroundImage: "radial-gradient(white 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
        
        <div style={{ position: "relative", zIndex: 10, display: "flex", gap: 24, alignItems: "center", width: "100%", flexDirection: screenSize < 768 ? "column" : "row", textAlign: screenSize < 768 ? "center" : "left" }}>
          {/* Avatar Box in Banner */}
          <div onClick={() => setIsPickerOpen(true)} className="prof-avatar-box" style={{ 
            width: 140, height: 140, borderRadius: "50%", background: "white", 
            border: "4px solid rgba(255,255,255,0.2)", backdropFilter: "blur(10px)",
            boxShadow: "0 15px 35px rgba(0,0,0,0.2)", 
            position: "relative", cursor: "pointer", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0
          }}>
            <AvatarDisplay avatar={user.user_metadata?.avatar || { id: "robot" }} size={120} />
            <div style={{ position: "absolute", bottom: 4, right: 4, width: 28, height: 28, borderRadius: "50%", background: "#0F62FE", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid white", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
              <Camera size={12} color="white" />
            </div>
          </div>

          {/* Identity Details in Banner */}
          <div style={{ flex: 1, color: "white" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, justifyContent: screenSize < 768 ? "center" : "flex-start", flexWrap: "wrap" }}>
              <div style={{ background: "rgba(255,255,255,0.25)", padding: "4px 12px", borderRadius: 999, fontSize: 10, fontWeight: 800, letterSpacing: "0.05em", border: "1px solid rgba(255,255,255,0.1)" }}>NIVEL {level}</div>
            </div>
            <h1 style={{ fontSize: screenSize < 768 ? 24 : 36, fontWeight: 800, margin: 0, letterSpacing: "-0.03em", textShadow: "0 2px 10px rgba(0,0,0,0.2)" }}>{displayName}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 4, justifyContent: screenSize < 768 ? "center" : "flex-start" }}>
              <span style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>@{nickname}</span>
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(255,255,255,0.3)" }} />
              <a href="https://instagram.com/bizen.mx" target="_blank" style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.9)", textDecoration: "none", fontWeight: 600, fontSize: 13 }}>
                <Instagram size={14} /> @bizen.mx
              </a>
            </div>
          </div>

          {/* Plan Badge - Right Side of Banner */}
          {getPlanTitle() && (() => {
            const info = getPlanInfo()!
            const isBasic = getPlanTitle() === "BÁSICO"
            return (
              <div
                onClick={() => isBasic && router.push("/payment")}
                style={{
                  marginLeft: screenSize < 768 ? "0" : "auto", flexShrink: 0,
                  marginTop: screenSize < 768 ? 12 : 0,
                  background: isBasic
                    ? "linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%)"
                    : info.bg,
                  padding: isBasic ? "12px 20px" : "8px 20px",
                  borderRadius: 20,
                  display: "flex", flexDirection: "column", gap: isBasic ? 4 : 2,
                  alignItems: screenSize < 768 ? "center" : "flex-start",
                  cursor: isBasic ? "pointer" : "default",
                  boxShadow: isBasic
                    ? "0 12px 30px rgba(15,98,254,0.25), 0 2px 8px rgba(0,0,0,0.08)"
                    : "0 8px 24px rgba(0,0,0,0.15)",
                  border: isBasic ? "1.5px solid rgba(15,98,254,0.3)" : "1.5px solid rgba(255,255,255,0.3)",
                  transition: "opacity 0.2s ease",
                  backdropFilter: "blur(12px)",
                  minWidth: isBasic ? 140 : 120,
                }}
                onMouseEnter={e => { if (isBasic) e.currentTarget.style.opacity = "0.75" }}
                onMouseLeave={e => { e.currentTarget.style.opacity = "1" }}
              >
                {isBasic ? (
                  <>
                    <div style={{ fontSize: 9, fontWeight: 900, color: "#0F62FE", letterSpacing: "0.18em", textTransform: "uppercase" }}>Mejora a Pro</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
                      <span style={{ fontSize: 26, fontWeight: 950, color: "#0f172a", letterSpacing: "-0.03em", lineHeight: 1 }}>$179</span>
                      <span style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>/mes</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Tu Plan</div>
                    <div style={{ fontSize: 16, fontWeight: 900, color: "white", letterSpacing: "-0.01em" }}>{info.label}</div>
                  </>
                )}
              </div>
            )
          })()}
        </div>
      </div>

      <div className="prof-body" style={{ display: "flex", gap: 40, maxWidth: 1300, margin: "0 auto", position: "relative", zIndex: 2 }}>
        
        {/* LEFT COLUMN: IDENTITY & STATS */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 32 }}>
          
          {/* XP Card with detailed count */}
          {!isAdminOrTeacher && (
            <div className="prof-card fade-up" style={{ padding: 0, animationDelay: "0.1s", overflow: "hidden", border: "1.5px solid #e2e8f0" }}>
              {/* Top gradient header - compact */}
              <div style={{ background: "linear-gradient(135deg, #0b1e5e 0%, #0F62FE 100%)", padding: "14px 24px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, opacity: 0.08, backgroundImage: "radial-gradient(white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 1 }}>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.6)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 2 }}>Progreso</div>
                    <div style={{ fontSize: 22, fontWeight: 950, color: "white", lineHeight: 1, letterSpacing: "-0.03em" }}>Nivel {level}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 26, fontWeight: 950, color: "white", lineHeight: 1, letterSpacing: "-0.03em" }}>{xpInLevel.toLocaleString()}<span style={{ fontSize: 13, fontWeight: 600, opacity: 0.65 }}> XP</span></div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", fontWeight: 600, marginTop: 3 }}>de {xpForNext.toLocaleString()} XP</div>
                  </div>
                </div>
              </div>
              {/* Progress bar footer */}
              <div style={{ padding: "14px 24px" }}>
                <div style={{ height: 20, background: "#f1f5f9", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ width: `${xpPct}%`, height: "100%", background: "linear-gradient(90deg, #60a5fa, #0F62FE)", borderRadius: 99, transition: "width 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)", boxShadow: "0 0 10px rgba(15,98,254,0.5)" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                  <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600 }}>Nivel {level}</span>
                  <span style={{ fontSize: 10, color: "#0F62FE", fontWeight: 700 }}>{(xpForNext - xpInLevel).toLocaleString()} XP para subir</span>
                </div>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="fade-up" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, animationDelay: "0.2s" }}>
            {[
              { icon: <Flame size={18} />, value: userStats?.currentStreak || 0, label: "Racha", sub: "días seguidos", cardBg: "linear-gradient(135deg, #fff1f2, #ffe4e6)", iconBg: "rgba(244,63,94,0.15)", iconColor: "#f43f5e", valColor: "#be123c", border: "#fecdd3" },
              { icon: <Zap size={18} />, value: totalXp.toLocaleString(), label: "Total XP", sub: "puntos acumulados", cardBg: "linear-gradient(135deg, #eff6ff, #dbeafe)", iconBg: "rgba(15,98,254,0.12)", iconColor: "#0F62FE", valColor: "#1d4ed8", border: "#bfdbfe" },
              { icon: <Award size={18} />, value: achievements.filter(a => a.unlocked).length, label: "Logros", sub: `de ${achievements.length} totales`, cardBg: "linear-gradient(135deg, #fefce8, #fef9c3)", iconBg: "rgba(202,138,4,0.15)", iconColor: "#ca8a04", valColor: "#a16207", border: "#fde68a" },
              { icon: <Star size={18} />, value: getLeagueTitle(level), label: "Liga", sub: `Nivel ${level}`, cardBg: "linear-gradient(135deg, #f0fdf4, #dcfce7)", iconBg: "rgba(22,163,74,0.15)", iconColor: "#16a34a", valColor: "#15803d", border: "#bbf7d0" },
            ].map(s => (
              <div key={s.label} style={{ padding: "18px 20px", display: "flex", alignItems: "center", gap: 14, background: s.cardBg, border: `1.5px solid ${s.border}`, borderRadius: 24, boxShadow: "0 4px 12px rgba(0,0,0,0.04)", transition: "transform 0.2s" }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"} onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: s.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: s.iconColor }}>
                  {s.icon}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: s.valColor, lineHeight: 1, letterSpacing: "-0.02em" }}>{s.value}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: s.valColor, marginTop: 2, textTransform: "uppercase", letterSpacing: "0.04em", opacity: 0.7 }}>{s.label}</div>
                  <div style={{ fontSize: 10, color: s.valColor, fontWeight: 500, marginTop: 1, opacity: 0.5 }}>{s.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Achievements Area */}
          <div className="fade-up" style={{ animationDelay: "0.3s" }}>
             <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
               Mis Logros
               <span style={{ fontSize: 12, fontWeight: 500, color: "#64748b", background: "#f1f5f9", padding: "2px 8px", borderRadius: 8 }}>{achievements.filter(a => a.unlocked).length}</span>
             </h2>
             <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 16 }}>
                {achievements.map(a => <AchievementCard key={a.id} a={a} cfg={RARITY_CFG[a.rarity] || RARITY_CFG.común} />)}
             </div>
          </div>
        </div>

        {/* RIGHT COLUMN: BIZEN CARD & SOCIAL */}
        <div className="prof-side fade-up" style={{ width: 380, display: "flex", flexDirection: "column", gap: 32, animationDelay: "0.15s" }}>
          
          {!isAdminOrTeacher && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: 0 }}>Tarjeta BIZEN Virtual</h2>
                </div>
                <button onClick={() => setIsThemePickerOpen(!isThemePickerOpen)} style={{ background: "none", border: "none", color: "#0F62FE", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600 }}>
                  <Palette size={14} /> Estilo
                </button>
              </div>
              
              <div style={{ transform: "scale(0.95)", transformOrigin: "top center" }}>
                <BizenVirtualCard bizcoins={bizcoins} holderName={displayName} colorTheme={cardTheme} />
              </div>

              {isThemePickerOpen && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: 16, background: "white", borderRadius: 20, border: "1.5px solid #e2e8f0", boxShadow: "0 10px 25px rgba(0,0,0,0.05)", animation: "fadeUp 0.3s ease" }}>
                  {(["blue", "emerald", "violet", "rose", "amber", "slate", "obsidian"] as CardTheme[]).map(t => (
                    <button key={t} onClick={() => updateCardTheme(t)} style={{ 
                      width: 32, height: 32, borderRadius: "50%", cursor: "pointer", 
                      border: cardTheme === t ? "3px solid #0F62FE" : "2px solid white", 
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      background: t === "obsidian" ? "#1a1a1a" : t === "blue" ? "#0F62FE" : t === "emerald" ? "#10B981" : t === "violet" ? "#8B5CF6" : t === "rose" ? "#F43F5E" : t === "amber" ? "#F59E0B" : "#64748B" 
                    }} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Status Badge for Admins/Teachers */}
          {isAdminOrTeacher && (
            <div style={{ padding: 24, background: "linear-gradient(135deg, #0b1e5e 0%, #0F62FE 100%)", borderRadius: 24, color: "white" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <Shield size={20} color="white" />
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Perfil de Gestión</h3>
              </div>
              <p style={{ margin: 0, fontSize: 13, opacity: 0.8, lineHeight: 1.5 }}>
                Como {dbProfile?.role === 'school_admin' ? 'Administrador' : 'Docente'}, tienes acceso total a las métricas y gestión de tu institución.
              </p>
            </div>
          )}

          {/* Social Panel */}
          <div className="prof-card" style={{ overflow: "hidden" }}>
             <div style={{ display: "flex", borderBottom: "1.5px solid #f1f5f9" }}>
                <button 
                  className={`prof-tab-btn ${rightTab === "following" ? "active" : "inactive"}`}
                  onClick={() => { setRightTab("following"); fetchFollowingList() }}>
                  Siguiendo
                </button>
                <button 
                  className={`prof-tab-btn ${rightTab === "followers" ? "active" : "inactive"}`}
                  onClick={() => { setRightTab("followers"); fetchFollowersList() }}>
                  Seguidores
                </button>
             </div>
             <div style={{ padding: 20, minHeight: 240, maxHeight: 400, overflowY: "auto" }}>
                {(rightTab === "following" ? loadingFollowing : loadingFollowers) ? (
                  <div style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}>Cargando...</div>
                ) : (rightTab === "following" ? following : followers).length === 0 ? (
                  <div style={{ textAlign: "center", padding: 40 }}>
                    {rightTab === "following" ? <FollowIllustration /> : <CommunityIllustration />}
                    <p style={{ marginTop: 16, color: "#94a3b8", fontSize: 13, fontWeight: 500 }}>No hay actividad aún.</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {(rightTab === "following" ? following : followers).map((f: any) => (
                      <div key={f.userId} onClick={() => router.push(`/forum/profile/${f.userId}`)} style={{ display: "flex", alignItems: "center", gap: 12, padding: 10, borderRadius: 16, cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                         <AvatarDisplay avatar={f.avatar} size={36} />
                         <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>{f.nickname}</div>
                            <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>Nivel {f.level}</div>
                         </div>
                         <ChevronRight size={14} color="#cbd5e1" />
                      </div>
                    ))}
                  </div>
                )}
             </div>
          </div>

          {/* Premium Upsell Card */}
          {isParticular && !isPremium && (
            <div 
              onClick={() => router.push("/payment")}
              style={{ 
                background: "linear-gradient(135deg, #0b1e5e 0%, #0F62FE 100%)", borderRadius: 24, padding: 24, color: "white", cursor: "pointer", position: "relative", overflow: "hidden", boxShadow: "0 15px 35px rgba(15,98,254,0.3)"
              }}
            >
              <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, background: "rgba(255,255,255,0.1)", borderRadius: "50%" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.2)", width: "fit-content", padding: "4px 10px", borderRadius: 99, fontSize: 10, fontWeight: 700, marginBottom: 12, letterSpacing: "0.08em" }}>BIZEN PRO</div>
              <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700 }}>Acceso Ilimitado</h3>
              <p style={{ margin: "0 0 20px", fontSize: 13, color: "rgba(255,255,255,0.8)", lineHeight: 1.5 }}>Domina tus finanzas con todos los cursos y simuladores desbloqueados.</p>
              <div style={{ display: "flex", alignItems: "center", gap: 4, fontWeight: 800, fontSize: 24 }}>$179 <span style={{ fontSize: 12, fontWeight: 500, opacity: 0.8 }}>/mes</span></div>
            </div>
          )}

        </div>
      </div>

      {/* Picker Modal Overlay */}
      {isPickerOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 20 }} onClick={() => setIsPickerOpen(false)}>
           <div style={{ background: "white", padding: 32, borderRadius: 32, width: "100%", maxWidth: 480, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)", position: "relative" }} onClick={e => e.stopPropagation()}>
              <button onClick={() => setIsPickerOpen(false)} style={{ position: "absolute", top: 20, right: 20, background: "#f1f5f9", border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><CloseIcon size={18} color="#64748b" /></button>
              <h3 style={{ margin: "0 0 8px", fontSize: 24, fontWeight: 800, color: "#0f172a" }}>Elige tu Avatar</h3>
              <p style={{ margin: "0 0 24px", color: "#64748b", fontSize: 14 }}>Personaliza tu identidad en la plataforma.</p>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(60px, 1fr))", gap: 12, maxHeight: 300, overflowY: "auto", paddingRight: 4 }}>
                {AVATAR_OPTIONS.map(av => (
                  <button key={av.id} onClick={() => updateAvatar(av)} style={{ background: "none", border: "2.5px solid transparent", cursor: "pointer", borderRadius: "50%", padding: 0, transition: "transform 0.2s", display: "flex", alignItems: "center", justifyContent: "center" }} onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
                    <AvatarDisplay avatar={av} size={screenSize < 480 ? 56 : 64} />
                  </button>
                ))}
              </div>
           </div>
        </div>
      )}
    </div>
  )
}
