"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"
import { useOnboarding } from "@/contexts/OnboardingContext"
import { createClientMicrocred } from "@/lib/supabase/client-microcred"
import StakingModal from "@/components/bizen/StakingModal"
import TransactionHistoryModal from "@/components/bizen/TransactionHistoryModal"
import PageLoader from "@/components/PageLoader"
import { AvatarDisplay } from "@/components/AvatarDisplay"
import { AVATAR_OPTIONS, AVATAR_CATEGORIES, getDefaultAvatar } from "@/lib/avatarOptions"
import Link from "next/link"
import {
  Flame, Zap, Shield, Award, UserPlus, Users,
  Search, Mail, ChevronRight, X as CloseIcon, Camera, Star,
  Trophy, BookOpen, Compass, Share2, Heart, Settings, Instagram,
  Palette, CreditCard, Lock as LockIcon, History, ArrowUpRight, ArrowDownLeft,
  CircleDollarSign, ShoppingCart, Gem, PlusCircle, Target, Send, Search as SearchIcon, Loader2, Check, ChevronDown, Calendar, Info
} from "lucide-react"
import BizenVirtualCard, { CardTheme, getTierFromLevel } from "@/components/BizenVirtualCard"

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

interface WalletTransaction {
  id: string
  amount: number
  type: "income" | "expense"
  category: string
  description: string
  createdAt: string
}

interface SavingsGoal {
  id: string
  title: string
  targetAmount: number
  category?: string
  isCompleted: boolean
  createdAt: string
}

interface StakingPosition {
  id: string
  amount: number
  yieldRate: number
  startDate: string
  endDate: string
  status: "active" | "completed"
  earnedAmount?: number
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
  const [transactions, setTransactions] = useState<WalletTransaction[]>([])
  const [loadingTransactions, setLoadingTransactions] = useState(true)
  const [goals, setGoals] = useState<SavingsGoal[]>([])
  const [loadingGoals, setLoadingGoals] = useState(true)
  const [staking, setStaking] = useState<StakingPosition[]>([])
  const [loadingStaking, setLoadingStaking] = useState(true)
  const [isStakingModalOpen, setIsStakingModalOpen] = useState(false)
  const [showActivity, setShowActivity] = useState(true)
  const [isFullHistoryOpen, setIsFullHistoryOpen] = useState(false)

  const getIcon = (cat: string) => {
    switch(cat) {
      case "purchase": return <ShoppingCart size={18} />
      case "streak_bonus": return <Flame size={18} />
      case "lesson_reward": return <BookOpen size={18} />
      case "achievement": return <Trophy size={18} />
      case "transfer_sent": return <ArrowUpRight size={18} />
      case "transfer_received": return <ArrowDownLeft size={18} />
      default: return <PlusCircle size={18} />
    }
  }

  // Sync theme with dbProfile
  useEffect(() => {
    if (dbProfile?.cardTheme || dbProfile?.card_theme) {
      setCardTheme((dbProfile.cardTheme || dbProfile.card_theme) as CardTheme)
    }
  }, [dbProfile])

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const fetchData = async () => {
    try {
      const [statsRes, profStatsRes, achRes, transRes, goalsRes, stakingRes] = await Promise.all([
        fetch(`/api/user/stats?t=${Date.now()}`),
        fetch(`/api/profile/stats?t=${Date.now()}`),
        fetch(`/api/achievements`),
        fetch(`/api/wallet/transactions?t=${Date.now()}`),
        fetch(`/api/wallet/goals?t=${Date.now()}`),
        fetch(`/api/wallet/staking?t=${Date.now()}`)
      ]);
      if (statsRes.ok) setUserStats(await statsRes.json());
      if (profStatsRes.ok) setProfileStats(await profStatsRes.json());
      if (achRes.ok) {
        const achData = await achRes.json();
        setAchievements(Array.isArray(achData) ? achData : []);
      }
      if (transRes.ok) {
        const transData = await transRes.json();
        setTransactions(transData.transactions || []);
      }
      if (goalsRes.ok) {
        const goalsData = await goalsRes.json();
        setGoals(goalsData.goals || []);
      }
      if (stakingRes.ok) {
        const stakingData = await stakingRes.json();
        setStaking(stakingData.positions || []);
      }
    } catch (err) {
      console.error("Error fetching profile data", err);
    } finally {
      setLoadingStats(false);
      setLoadingAchievements(false);
      setLoadingTransactions(false);
      setLoadingGoals(false);
      setLoadingStaking(false);
    }
  };

  const hasInitializedTheme = React.useRef(false)
  useEffect(() => {
    if (loading) return
    if (!user) { router.push("/login"); return }
    
    if (!hasInitializedTheme.current) {
      const currentTheme = dbProfile?.cardTheme || dbProfile?.card_theme || user.user_metadata?.cardTheme || "blue"
      setCardTheme(currentTheme as CardTheme)
      hasInitializedTheme.current = true
    }
    
    fetchData();
  }, [user, loading, dbProfile]);

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

  const isSchoolAdmin = dbProfile?.role === 'school_admin'
  const isAdminOrTeacher = isSchoolAdmin || dbProfile?.role === 'teacher'
  const isParticular = dbProfile?.role === 'particular'
  const isInstitutionalStudent = dbProfile?.role === 'student'
  const isPremium = dbProfile?.subscriptionStatus === 'active' || (dbProfile?.school?.licenses?.length || 0) > 0

  const getPlanTitle = () => {
    if (isAdminOrTeacher || isInstitutionalStudent) return "INSTITUCIONAL"
    if (isParticular) return isPremium ? "PREMIUM" : "BÁSICO"
    return null
  }

  const displayName = dbProfile?.fullName || user.user_metadata?.full_name || user.email?.split("@")[0] || "Usuario"
  const nickname = dbProfile?.username || user.user_metadata?.username || user.email?.split("@")[0] || ""
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

  // IMPORTANT: Admins must not have a traditional profile
  if (isSchoolAdmin) {
    return (
      <div className="prof-outer" style={{ minHeight: "100vh", background: "#FBFAF5", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ maxWidth: 500, width: "100%", textAlign: "center", padding: 40, background: "white", borderRadius: 32, border: "1.5px solid #e2e8f0", boxShadow: "0 20px 50px rgba(0,0,0,0.05)" }}>
          <div style={{ margin: "0 auto 24px", width: 120, height: 120, borderRadius: "50%", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", border: "4px solid #f1f5f9" }}>
            <AvatarDisplay avatar={{ type: "admin" }} size={120} />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: "#0f172a", marginBottom: 8 }}>Cuenta de Administración</h1>
          <p style={{ color: "#64748b", fontSize: 16, marginBottom: 32 }}>Este es un perfil institucional de gestión técnica. Las funciones sociales y de gamificación están desactivadas.</p>
          
          <div style={{ display: "grid", gap: 12 }}>
            <div style={{ padding: "16px 20px", background: "#f8fafc", borderRadius: 16, border: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8" }}>Rol Académico</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: "#0F62FE" }}>Administrador Escolar</span>
            </div>
            <div style={{ padding: "16px 20px", background: "#f8fafc", borderRadius: 16, border: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8" }}>Institución</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>{dbProfile?.school?.name || "Bizen Institute"}</span>
            </div>
          </div>

          <button 
            onClick={handleSignOut}
            style={{ marginTop: 40, width: "100%", padding: 16, background: "#ef4444", color: "white", border: "none", borderRadius: 16, fontWeight: 700, cursor: "pointer", transition: "opacity 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            Cerrar Sesión Institucional
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="prof-outer" style={{ minHeight: "100vh", background: "#FBFAF5" }}>
      <style>{`
        @media (max-width: 767px) {
          .prof-outer { width: 100% !important; margin-left: 0 !important; padding: 12px 12px 110px !important; }
          .prof-body  { flex-direction: column !important; gap: 16px !important; }
          .prof-side  { width: 100% !important; order: 1; }
          .prof-hero  { height: auto !important; min-height: 180px !important; border-radius: 20px !important; padding: 20px 16px !important; align-items: center !important; justify-content: center !important; }
          .prof-avatar-box { width: 90px !important; height: 90px !important; margin-top: 0 !important; }
          .prof-stat-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; }
          .prof-card { border-radius: 20px !important; padding: 16px !important; }
          .xp-card-header { padding: 12px 16px !important; }
          .xp-card-body { padding: 12px 16px !important; }
        }
        @media (min-width: 768px) and (max-width: 1160px) {
          .prof-outer { margin-left: 220px !important; padding: 40px 24px 80px !important; width: calc(100% - 220px) !important; }
        }
        @media (min-width: 1161px) {
          .prof-outer { margin-left: 280px !important; padding: 40px 48px 80px !important; width: calc(100% - 280px) !important; }
        }
        .prof-card { background: white; border: 1.5px solid #e2e8f0; border-radius: 24px; box-shadow: 0 4px 20px rgba(15,23,42,0.03); transition: transform 0.2s; }
        .prof-card:hover { transform: translateY(-2px); }
        .prof-tab-btn { flex: 1; padding: 14px; border: none; background: transparent; font-weight: 700; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; transition: all 0.2s; }
        .prof-tab-btn.active { color: #0F62FE; border-bottom: 2px solid #0F62FE; background: #f8fafc; }
        .prof-tab-btn.inactive { color: #94a3b8; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .prof-side-btn:hover { transform: translateY(-2px); filter: brightness(1.05); }
        .prof-side-btn:active { transform: translateY(0); }
        .prof-side-btn.secondary:hover { background: #f8fafc !important; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.4s ease both; }
        .transaction-row-hover { transition: all 0.2s ease; cursor: default; border-bottom: 1px solid #f8fafc; }
        .transaction-row-hover:hover { background: #f8fafc !important; transform: translateX(4px); }
      `}</style>

      {/* Hero Banner with Identity */}
      <div className="prof-hero fade-up" style={{ 
        height: 220, background: "linear-gradient(135deg, #0b1e5e 0%, #0F62FE 100%)", 
        borderRadius: 32, position: "relative", marginBottom: 32,
        boxShadow: "0 20px 40px -12px rgba(15,98,254,0.3)",
        display: "flex", alignItems: "flex-end", padding: screenSize < 768 ? "24px" : "40px 48px"
      }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.1, backgroundImage: "radial-gradient(white 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
        
        <div style={{ position: "relative", zIndex: 10, display: "flex", gap: screenSize < 768 ? 16 : 24, alignItems: "center", width: "100%", flexDirection: screenSize < 768 ? "column" : "row", textAlign: screenSize < 768 ? "center" : "left" }}>
          {/* Avatar Box in Banner */}
          <div onClick={() => setIsPickerOpen(true)} className="prof-avatar-box" style={{ 
            width: 130, height: 130, borderRadius: "50%", background: "white", 
            border: "4px solid rgba(255,255,255,0.2)", backdropFilter: "blur(10px)",
            boxShadow: "0 15px 35px rgba(0,0,0,0.2)", 
            position: "relative", cursor: "pointer", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0
          }}>
            <AvatarDisplay avatar={user.user_metadata?.avatar || { id: "robot" }} size={screenSize < 768 ? 80 : 110} />
            <div style={{ position: "absolute", bottom: 4, right: 4, width: 24, height: 24, borderRadius: "50%", background: "#0F62FE", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid white", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
              <Camera size={10} color="white" />
            </div>
          </div>

          {/* Identity Details in Banner */}
          <div style={{ flex: 1, color: "white", width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, justifyContent: screenSize < 768 ? "center" : "flex-start", flexWrap: "wrap" }}>
              <div style={{ background: "rgba(255,255,255,0.25)", padding: "3px 10px", borderRadius: 999, fontSize: 9, fontWeight: 800, letterSpacing: "0.05em", border: "1px solid rgba(255,255,255,0.1)" }}>NIVEL {level}</div>
            </div>
            <h1 style={{ fontSize: screenSize < 768 ? 22 : 32, fontWeight: 800, margin: 0, letterSpacing: "-0.03em", textShadow: "0 2px 8px rgba(0,0,0,0.2)", lineHeight: 1.1 }}>{displayName}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4, justifyContent: screenSize < 768 ? "center" : "flex-start", opacity: 0.9 }}>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>@{nickname}</span>
              <div style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,0.4)" }} />
              <button 
                onClick={() => router.push("/configuracion")}
                style={{ 
                  display: "flex", alignItems: "center", gap: 5, color: "white", 
                  background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
                  padding: "2px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700, 
                  cursor: "pointer", transition: "all 0.2s" 
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
              >
                <Settings size={12} /> Editar Perfil
              </button>
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
                  marginTop: screenSize < 768 ? 10 : 0,
                  background: isBasic
                    ? "linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%)"
                    : info.bg,
                  padding: isBasic ? (screenSize < 768 ? "8px 16px" : "12px 20px") : "8px 20px",
                  borderRadius: 16,
                  display: "flex", 
                  flexDirection: isBasic && screenSize < 768 ? "row" : "column", 
                  gap: isBasic ? 8 : 2,
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: isBasic ? "pointer" : "default",
                  boxShadow: isBasic
                    ? "0 8px 20px rgba(15,98,254,0.15), 0 2px 4px rgba(0,0,0,0.05)"
                    : "0 8px 24px rgba(0,0,0,0.15)",
                  border: isBasic ? "1.5px solid rgba(15,98,254,0.3)" : "1.5px solid rgba(255,255,255,0.3)",
                  transition: "opacity 0.2s ease",
                  backdropFilter: "blur(12px)",
                  minWidth: isBasic ? (screenSize < 768 ? "none" : 140) : 120,
                  width: screenSize < 768 ? "100%" : "auto"
                }}
                onMouseEnter={e => { if (isBasic) e.currentTarget.style.opacity = "0.75" }}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                {isBasic ? (
                  <>
                    <div style={{ fontSize: 9, fontWeight: 900, color: "#0F62FE", letterSpacing: "0.1em", textTransform: "uppercase" }}>{screenSize < 768 ? "PRO" : "Mejora a Pro"}</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
                      <span style={{ fontSize: 20, fontWeight: 950, color: "#0f172a", letterSpacing: "-0.02em", lineHeight: 1 }}>$179</span>
                      <span style={{ fontSize: 10, color: "#64748b", fontWeight: 500 }}>/mes</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: 8, fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Tu Plan</div>
                    <div style={{ fontSize: 14, fontWeight: 900, color: "white", letterSpacing: "-0.01em" }}>{info.label}</div>
                  </>
                )}
              </div>
            )
          })()}
        </div>
      </div>

      <div className="prof-body" style={{ display: "flex", gap: screenSize < 1200 ? 20 : 24, maxWidth: 1300, margin: "0 auto", position: "relative", zIndex: 2 }}>
        
        {/* LEFT COLUMN: IDENTITY & STATS */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 24 }}>
          
          {/* XP Card — Spatial Blue Premium Redesign */}
          {!isAdminOrTeacher && (
            <div className="fade-up" style={{ animationDelay: "0.1s", borderRadius: 28, overflow: "hidden", background: "linear-gradient(135deg, #060d22 0%, #0b1e5e 40%, #0F62FE 100%)", position: "relative", boxShadow: "0 24px 64px rgba(15,98,254,0.35), 0 0 0 1px rgba(255,255,255,0.05)" }}>
              {/* Ambient orbs */}
              <div style={{ position: "absolute", top: "-40%", right: "-10%", width: 300, height: 300, background: "radial-gradient(circle, rgba(96,165,250,0.25) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
              <div style={{ position: "absolute", bottom: "-30%", left: "0%", width: 220, height: 220, background: "radial-gradient(circle, rgba(167,139,250,0.2) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
              <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "radial-gradient(white 1px, transparent 1px)", backgroundSize: "24px 24px", pointerEvents: "none" }} />

              <div style={{ position: "relative", zIndex: 1, padding: screenSize < 768 ? "20px 18px" : "24px 28px" }}>
                {/* Top row: badge + XP value */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                  <div>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 999, padding: "4px 12px", marginBottom: 10 }}>
                      <Zap size={11} color="#60a5fa" />
                      <span style={{ fontSize: 10, fontWeight: 700, color: "#93c5fd", letterSpacing: "0.07em", textTransform: "uppercase" }}>Progreso de Nivel</span>
                    </div>
                    <div style={{ fontSize: screenSize < 768 ? 28 : 36, fontWeight: 900, color: "#fff", lineHeight: 1, letterSpacing: "-0.03em" }}>
                      Nivel <span style={{ background: "linear-gradient(90deg, #93c5fd, #c4b5fd)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{level}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", fontWeight: 500, marginTop: 4 }}>
                      {xpInLevel.toLocaleString()} / {xpForNext.toLocaleString()} XP en este nivel
                    </div>
                  </div>
                  {/* XP Ring */}
                  <div style={{ flexShrink: 0 }}>
                    <svg width={screenSize < 768 ? 72 : 90} height={screenSize < 768 ? 72 : 90} viewBox="0 0 100 100">
                      <defs>
                        <linearGradient id="xpRingPrf" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#60a5fa"/>
                          <stop offset="50%" stopColor="#a78bfa"/>
                          <stop offset="100%" stopColor="#f472b6"/>
                        </linearGradient>
                        <filter id="xpGlowPrf">
                          <feGaussianBlur stdDeviation="2.5" result="blur"/>
                          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                        </filter>
                      </defs>
                      <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="9"/>
                      <circle cx="50" cy="50" r="40" fill="none"
                        stroke="url(#xpRingPrf)" strokeWidth="9"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 40 * Math.min(xpPct / 100, 1)} ${2 * Math.PI * 40}`}
                        strokeDashoffset={2 * Math.PI * 40 * 0.25}
                        transform="rotate(-90 50 50)"
                        filter="url(#xpGlowPrf)"
                        style={{ transition: "stroke-dasharray 1.6s cubic-bezier(0.34,1.56,0.64,1)" }}
                      />
                      <text x="50" y="44" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8" fontWeight="800" style={{ letterSpacing: "0.15em" }}>XP</text>
                      <text x="50" y="62" textAnchor="middle" fill="#fff" fontSize="20" fontWeight="900" style={{ letterSpacing: "-0.02em" }}>{Math.round(xpPct)}%</text>
                    </svg>
                  </div>
                </div>

                {/* XP Bar */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ height: 10, background: "rgba(255,255,255,0.08)", borderRadius: 99, overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{
                      width: `${xpPct}%`, height: "100%",
                      background: "linear-gradient(90deg, #60a5fa 0%, #a78bfa 50%, #f472b6 100%)",
                      borderRadius: 99,
                      transition: "width 1.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
                      boxShadow: "0 0 16px rgba(167,139,250,0.6), 0 0 8px rgba(96,165,250,0.4)",
                      position: "relative"
                    }} />
                  </div>
                </div>

                {/* Level milestones + XP remaining pill */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    {/* Current level node */}
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <div style={{ width: 22, height: 22, borderRadius: "50%", background: "linear-gradient(135deg, #60a5fa, #a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 900, color: "#fff", boxShadow: "0 0 10px rgba(96,165,250,0.6)" }}>{level}</div>
                      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>Ahora</span>
                    </div>
                    <div style={{ flex: 1, width: 32, height: 1, background: "rgba(255,255,255,0.12)" }} />
                    {/* Next level node */}
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 900, color: "rgba(255,255,255,0.5)" }}>{level + 1}</div>
                      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontWeight: 600 }}>Siguiente</span>
                    </div>
                  </div>
                  {/* XP remaining pill */}
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(96,165,250,0.12)", border: "1px solid rgba(96,165,250,0.25)", borderRadius: 99, padding: "4px 10px" }}>
                    <Zap size={10} color="#60a5fa" />
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#93c5fd", whiteSpace: "nowrap" }}>
                      {(xpForNext - xpInLevel).toLocaleString()} XP restantes
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="fade-up prof-stat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, animationDelay: "0.2s" }}>
            {[
              { icon: <Flame size={screenSize < 768 ? 16 : 18} />, value: userStats?.currentStreak || 0, label: "Racha", sub: "días", cardBg: "linear-gradient(135deg, #fff1f2, #ffe4e6)", iconBg: "rgba(244,63,94,0.12)", iconColor: "#f43f5e", valColor: "#be123c", border: "#fecdd3" },
              { icon: <Zap size={screenSize < 768 ? 16 : 18} />, value: totalXp.toLocaleString(), label: "Total XP", sub: "puntos", cardBg: "linear-gradient(135deg, #eff6ff, #dbeafe)", iconBg: "rgba(15,98,254,0.1)", iconColor: "#0F62FE", valColor: "#1d4ed8", border: "#bfdbfe" },
              { icon: <Award size={screenSize < 768 ? 16 : 18} />, value: achievements.filter(a => a.unlocked).length, label: "Logros", sub: `de ${achievements.length}`, cardBg: "linear-gradient(135deg, #fefce8, #fef9c3)", iconBg: "rgba(202,138,4,0.12)", iconColor: "#ca8a04", valColor: "#a16207", border: "#fde68a" },
              { icon: <Star size={screenSize < 768 ? 16 : 18} />, value: getLeagueTitle(level), label: "Liga", sub: `Nivel ${level}`, cardBg: "linear-gradient(135deg, #f0fdf4, #dcfce7)", iconBg: "rgba(22,163,74,0.12)", iconColor: "#16a34a", valColor: "#15803d", border: "#bbf7d0" },
            ].map(s => (
              <div key={s.label} style={{ padding: screenSize < 768 ? "12px 14px" : "18px 20px", display: "flex", alignItems: "center", gap: screenSize < 768 ? 10 : 14, background: s.cardBg, border: `1.5px solid ${s.border}`, borderRadius: 20, boxShadow: "0 4px 10px rgba(0,0,0,0.03)", transition: "transform 0.2s" }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"} onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                <div style={{ width: screenSize < 768 ? 32 : 42, height: screenSize < 768 ? 32 : 42, borderRadius: 10, background: s.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: s.iconColor }}>
                  {s.icon}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: screenSize < 768 ? 18 : 22, fontWeight: 900, color: s.valColor, lineHeight: 1, letterSpacing: "-0.01em" }}>{s.value}</div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: s.valColor, marginTop: 2, textTransform: "uppercase", letterSpacing: "0.02em", opacity: 0.8 }}>{s.label}</div>
                  {screenSize >= 768 && <div style={{ fontSize: 10, color: s.valColor, fontWeight: 500, marginTop: 1, opacity: 0.5 }}>{s.sub}</div>}
                </div>
              </div>
            ))}
          </div>

          {/* Achievements Area */}
          <div className="fade-up" style={{ animationDelay: "0.3s" }}>
             <h2 style={{ fontSize: screenSize < 768 ? 16 : 18, fontWeight: 700, color: "#0f172a", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
               Mis Logros
               <span style={{ fontSize: 11, fontWeight: 500, color: "#64748b", background: "#f1f5f9", padding: "2px 8px", borderRadius: 8 }}>{achievements.filter(a => a.unlocked).length}</span>
             </h2>
             <div style={{ display: "grid", gridTemplateColumns: screenSize < 768 ? "repeat(auto-fill, minmax(100px, 1fr))" : "repeat(auto-fill, minmax(140px, 1fr))", gap: screenSize < 768 ? 10 : 16 }}>
                {achievements.map(a => <AchievementCard key={a.id} a={a} cfg={RARITY_CFG[a.rarity] || RARITY_CFG.común} />)}
             </div>
           </div>
        </div>

        {/* RIGHT COLUMN: BIZEN CARD & SOCIAL */}
        <div className="prof-side fade-up" style={{ width: screenSize < 1200 ? "100%" : 380, display: "flex", flexDirection: "column", gap: 24, animationDelay: "0.15s" }}>
          {/* BIZEN VIRTUAL CARD */}
          <div className="prof-card fade-up" style={{ padding: "20px", background: "white", animationDelay: "0.15s", borderRadius: 24, overflow: "visible" }}>
            <div style={{ marginBottom: 16 }}>
              <BizenVirtualCard 
                holderName={displayName} 
                level={level}
                colorTheme={cardTheme}
                bizcoins={bizcoins}
                onTransferClick={() => router.push("/transfer")}
                hideButtons={true}
              />
            </div>

            {/* Edit / Personalize Trigger */}
            <button 
              onClick={() => setIsThemePickerOpen(!isThemePickerOpen)}
              style={{
                width: "100%", padding: "10px", borderRadius: 12, border: "1.5px solid #e2e8f0",
                background: isThemePickerOpen ? "#f8fafc" : "white", color: "#64748b",
                fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", 
                alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s"
              }}
            >
              <Palette size={14} color={isThemePickerOpen ? "#0F62FE" : "#64748b"} />
              {isThemePickerOpen ? "Cerrar Personalización" : "Personalizar Tarjeta"}
              {isThemePickerOpen ? <ChevronDown size={14} style={{ transform: "rotate(180deg)" }} /> : <ChevronRight size={14} />}
            </button>

            {/* Theme Picker - Conditional */}
            {isThemePickerOpen && (
              <div style={{ marginTop: 20, padding: 16, background: "#f8fafc", borderRadius: 16, border: "1px solid #f1f5f9" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Selecciona un Color</span>
                  <div style={{ background: "white", padding: "2px 8px", borderRadius: 6, fontSize: 9, fontWeight: 800, color: "#0F62FE", border: "1px solid #e2e8f0" }}>{cardTheme.toUpperCase()}</div>
                </div>
                <div style={{ width: "100%", display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {(["blue", "emerald", "violet", "rose", "amber", "slate", "obsidian"] as CardTheme[]).map(t => (
                    <button 
                      key={t} 
                      onClick={() => updateCardTheme(t)} 
                      disabled={savingTheme}
                      onMouseEnter={e => { if (!savingTheme) e.currentTarget.style.transform = "scale(1.15)" }}
                      onMouseLeave={e => { e.currentTarget.style.transform = cardTheme === t ? "scale(1.1)" : "scale(1)" }}
                      style={{ 
                        width: 32, height: 32, borderRadius: "50%", cursor: savingTheme ? "wait" : "pointer", 
                        border: cardTheme === t ? "3px solid #0F62FE" : "2.5px solid white", 
                        boxShadow: cardTheme === t ? "0 0 12px rgba(15,98,254,0.3)" : "0 2px 6px rgba(0,0,0,0.08)",
                        background: t === "obsidian" ? "#1a1a1a" : t === "blue" ? "#0F62FE" : t === "emerald" ? "#10B981" : t === "violet" ? "#8B5CF6" : t === "rose" ? "#F43F5E" : t === "amber" ? "#F59E0B" : "#64748B",
                        transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
                        transform: cardTheme === t ? "scale(1.1)" : "scale(1)"
                      }} 
                    />
                  ))}
                </div>
              </div>
            )}
          </div>          {/* Status Badge for Admins/Teachers */}
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
          {/* Recent Activity (Wallet History) */}
          <div className="prof-card fade-up" style={{ animationDelay: "0.2s", display: "flex", flexDirection: "column" }}>
            <div 
               onClick={() => setShowActivity(!showActivity)}
               style={{ 
                 padding: "16px 20px", 
                 borderBottom: showActivity ? "1.5px solid #f1f5f9" : "none", 
                 display: "flex", 
                 justifyContent: "space-between", 
                 alignItems: "center",
                 cursor: "pointer"
               }}
            >
              <h3 
                style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: 10, flex: 1 }}
              >
                <History size={18} color="#0F62FE" /> Actividad Reciente
                <ChevronRight size={16} color="#94a3b8" style={{ transform: showActivity ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.3s ease", marginLeft: 4 }} />
              </h3>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {transactions.length > 0 && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push("/historial")
                    }}
                    style={{ 
                      fontSize: 11, 
                      fontWeight: 700, 
                      color: "#0F62FE", 
                      background: "rgba(15,98,254,0.08)", 
                      padding: "4px 12px", 
                      borderRadius: 99,
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(15,98,254,0.15)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(15,98,254,0.08)"}
                  >
                    Ver todo
                  </button>
                )}
              </div>
            </div>

            {showActivity && (
              <>
                <div style={{ padding: "6px 0", maxHeight: 320, overflowY: "auto" }}>
                  {loadingTransactions ? (
                    <div style={{ textAlign: "center", padding: 32, fontSize: 13, color: "#94a3b8" }}>Cargando actividad...</div>
                  ) : transactions.length === 0 ? (
                    <div style={{ textAlign: "center", padding: 40 }}>
                       <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                          <CircleDollarSign size={24} color="#cbd5e1" />
                       </div>
                       <p style={{ margin: 0, color: "#94a3b8", fontSize: 13, fontWeight: 500 }}>No hay transacciones aún.</p>
                       <p style={{ margin: "4px 0 0", color: "#cbd5e1", fontSize: 11 }}>Completa lecciones para ganar Bizcoins.</p>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      {transactions.slice(0, 2).map((t) => (
                        <div key={t.id} className="transaction-row-hover" style={{ padding: "14px 24px", display: "flex", alignItems: "center", gap: 16 }}>
                          <div style={{ 
                            width: 38, 
                            height: 38, 
                            borderRadius: 12, 
                            background: t.type === "income" ? "rgba(16,185,129,0.08)" : "rgba(244,63,94,0.08)", 
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "center",
                            color: t.type === "income" ? "#10B981" : "#F43F5E"
                          }}>
                            {getIcon(t.category)}
                          </div>
                          
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {t.description}
                            </div>
                            <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 500, marginTop: 1 }}>
                              {new Date(t.createdAt).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })} • {t.category === "purchase" || t.category === "transfer_sent" ? "Gasto" : "Ingreso"}
                            </div>
                          </div>

                          <div style={{ textAlign: "right" }}>
                            <div style={{ 
                              fontSize: 14, 
                              fontWeight: 800, 
                              color: t.type === "income" ? "#10B981" : "#F43F5E",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-end",
                              gap: 2
                            }}>
                              {t.type === "income" ? "+" : "-"}{t.amount}
                              <span style={{ fontSize: 9, fontWeight: 700, opacity: 0.8 }}>BC</span>
                            </div>
                            {t.type === "income" ? <ArrowUpRight size={10} color="#10B981" style={{ opacity: 0.6 }} /> : <ArrowDownLeft size={10} color="#F43F5E" style={{ opacity: 0.6 }} />}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </>
            )}
          </div>

          {/* Savings Goals Section */}
          <div className="prof-card fade-up" style={{ animationDelay: "0.25s" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1.5px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: 10 }}>
                <Target size={18} color="#10B981" /> Metas de Ahorro
              </h3>
              <PlusCircle size={16} color="#64748b" style={{ cursor: "pointer" }} onClick={() => router.push("/tienda")} />
            </div>

            <div style={{ padding: "14px 20px" }}>
              {loadingGoals ? (
                 <div style={{ textAlign: "center", padding: 20, fontSize: 12, color: "#94a3b8" }}>Cargando metas...</div>
              ) : goals.length === 0 ? (
                 <div style={{ textAlign: "center", padding: 20, color: "#94a3b8", fontSize: 13 }}>No tienes metas activas.</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {goals.map(g => {
                    const progress = Math.min(100, Math.floor((bizcoins / g.targetAmount) * 100));
                    return (
                      <div key={g.id}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 8 }}>
                          <div>
                            <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>{g.category || "General"}</div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{g.title}</div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                             <div style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>{progress}%</div>
                             <div style={{ fontSize: 9, fontWeight: 600, color: "#94a3b8" }}>{bizcoins} / {g.targetAmount} BC</div>
                          </div>
                        </div>
                        <div style={{ height: 8, background: "#f1f5f9", borderRadius: 4, overflow: "hidden" }}>
                          <div style={{ 
                            height: "100%", 
                            width: `${progress}%`, 
                            background: progress === 100 ? "linear-gradient(90deg, #10B981, #34D399)" : "linear-gradient(90deg, #0F62FE, #60A5FA)", 
                            borderRadius: 4,
                            transition: "width 1s cubic-bezier(0.34, 1.56, 0.64, 1)",
                            boxShadow: progress === 100 ? "0 0 10px rgba(16,185,129,0.3)" : "none"
                          }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Staking Section */}
          <div className="prof-card fade-up" style={{ animationDelay: "0.28s" }}>
             <div style={{ padding: "16px 20px", borderBottom: "1.5px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: 10 }}>
                   <Zap size={18} color="#8B5CF6" /> Inversión BIZEN
                </h3>
             </div>
             
             <div style={{ padding: "14px 20px" }}>
                {loadingStaking ? (
                   <div style={{ textAlign: "center", padding: 20, fontSize: 12, color: "#94a3b8" }}>Cargando inversiones...</div>
                ) : staking.length === 0 ? (
                   <div style={{ textAlign: "center", padding: "24px 20px", background: "#f8fafc", borderRadius: 20, border: "1.5px dashed #e2e8f0" }}>
                      <div style={{ width: 48, height: 48, background: "#f1f5f9", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                         <CircleDollarSign size={24} color="#cbd5e1" />
                      </div>
                      <p style={{ margin: "0 0 4px", color: "#64748B", fontSize: 13, fontWeight: 700 }}>Activos en pausa</p>
                      <p style={{ margin: 0, color: "#94a3b8", fontSize: 11 }}>No tienes Bizcoins trabajando ahora.</p>
                   </div>
                ) : (
                   <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                       {/* Yield Summary if multiple */}
                       {staking.filter(s => s.status === 'active').length > 1 && (
                         <div style={{ padding: "10px 14px", background: "rgba(139,92,246,0.05)", borderRadius: 12, border: "1px solid rgba(139,92,246,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                           <span style={{ fontSize: 11, fontWeight: 700, color: "#7C3AED" }}>Total en crecimiento</span>
                           <span style={{ fontSize: 13, fontWeight: 900, color: "#7C3AED" }}>{staking.filter(s => s.status === 'active').reduce((acc, curr) => acc + (curr.amount * curr.yieldRate), 0).toFixed(0)} <span style={{fontSize: 9}}>BC</span></span>
                         </div>
                       )}
                      {staking.map(s => {
                        const total = new Date(s.endDate).getTime() - new Date(s.startDate).getTime();
                        const elapsed = new Date().getTime() - new Date(s.startDate).getTime();
                        const progress = Math.min(100, Math.max(0, Math.floor((elapsed / total) * 100)));
                        const returnAmt = Math.floor(s.amount * s.yieldRate);

                        return (
                          <div key={s.id} style={{ 
                             background: s.status === 'active' ? "white" : "#f8fafc", 
                             borderRadius: 20, padding: 18, 
                             border: s.status === 'active' ? "1.5px solid #e2e8f0" : "1.5px solid #f1f5f9",
                             boxShadow: s.status === 'active' ? "0 4px 12px rgba(0,0,0,0.03)" : "none",
                             position: "relative",
                             overflow: "hidden"
                           }}>
                            {s.status === 'active' && <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 4, background: "#8B5CF6" }} />}
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                              <div>
                                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: s.status === 'active' ? "#8B5CF6" : "#10B981", animation: s.status === 'active' ? "pulse 2s infinite" : "none" }} />
                                  <div style={{ fontSize: 9, fontWeight: 800, color: s.status === 'active' ? "#8B5CF6" : "#10B981", textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.status === 'active' ? "Activo" : "Completado"}</div>
                                </div>
                                <div style={{ fontSize: 15, fontWeight: 900, color: "#0f172a" }}>{s.amount.toLocaleString()} <span style={{fontSize: 10, fontWeight: 600, color: "#94a3b8"}}>BC en fondo</span></div>
                              </div>
                              <div style={{ textAlign: "right" }}>
                                <div style={{ fontSize: 15, fontWeight: 950, color: "#10B981" }}>+{returnAmt} BC</div>
                                <div style={{ fontSize: 9, color: "#94a3b8", fontWeight: 700 }}>RETORNO ({(s.yieldRate * 100).toFixed(0)}%)</div>
                              </div>
                            </div>
                            
                            {s.status === 'active' ? (
                              <div style={{ marginTop: 12 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#64748B", fontWeight: 700, marginBottom: 6 }}>
                                  <span>Progreso de maduración</span>
                                  <span>{progress}%</span>
                                </div>
                                <div style={{ height: 8, background: "#f1f5f9", borderRadius: 4, overflow: "hidden" }}>
                                  <div 
                                    style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #8B5CF6, #C084FC)", borderRadius: 4, transition: "width 1s ease-out" }} 
                                  />
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8, fontSize: 9, color: "#94a3b8", fontWeight: 600 }}>
                                  <Calendar size={10} />
                                  Vence el {new Date(s.endDate).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </div>
                              </div>
                            ) : (
                              <div style={{ marginTop: 8, padding: "8px 12px", background: "rgba(16,185,129,0.06)", borderRadius: 10, display: "flex", alignItems: "center", gap: 8 }}>
                                <Check size={12} color="#10B981" />
                                <span style={{ fontSize: 10, color: "#059669", fontWeight: 700 }}>Inversión liquidada exitosamente</span>
                              </div>
                            )}
                          </div>
                        )
                      })}
                   </div>
                )}
                
                <button style={{ 
                  marginTop: 16, width: "100%", padding: "14px", borderRadius: 16, border: "none",
                  background: "linear-gradient(135deg, #2e1065 0%, #4c1d95 100%)",
                  color: "white", fontSize: 12, fontWeight: 800, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  boxShadow: "0 8px 24px rgba(46,16,101,0.25)",
                  transition: "all 0.2s"
                }} 
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                onClick={() => router.push("/investments")}>
                   <Zap size={16} fill="white" /> 
                   <span>Gestionar Inversiones</span>
                </button>

                 <div style={{ marginTop: 20, padding: 16, background: "rgba(15, 98, 254, 0.04)", borderRadius: 16, border: "1px solid rgba(15, 98, 254, 0.08)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                       <Info size={14} color="#0F62FE" />
                       <span style={{ fontSize: 11, fontWeight: 800, color: "#0F62FE", textTransform: "uppercase", letterSpacing: "0.05em" }}>Sabías que...</span>
                    </div>
                    <p style={{ margin: 0, fontSize: 11, color: "#64748B", lineHeight: 1.5 }}>
                       Invertir tus Bizcoins es la mejor forma de generar <span style={{ fontWeight: 700, color: "#0F172A" }}>interés compuesto</span>. ¡Entre más tiempo los dejes, más crecerán!
                    </p>
                 </div>
             </div>
          </div>

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

      {/* Full Screen History Overlay */}
      <AnimatePresence>
        {isFullHistoryOpen && (
          <TransactionHistoryModal 
            onClose={() => setIsFullHistoryOpen(false)}
            currentBalance={bizcoins}
          />
        )}
      </AnimatePresence>


      <AnimatePresence>
        {isStakingModalOpen && (
          <StakingModal
            onClose={() => setIsStakingModalOpen(false)}
            currentBalance={bizcoins}
            onSuccess={() => fetchData()}
          />
        )}
      </AnimatePresence>

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
