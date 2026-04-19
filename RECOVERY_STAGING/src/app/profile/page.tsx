"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"
import { useOnboarding } from "@/contexts/OnboardingContext"
import { useUser } from "@clerk/nextjs"
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
    <div onClick={() => setFlipped(!flipped)} className="perspective-[900px] cursor-pointer select-none">
      <div 
        className="relative w-full pb-[130%] transform-style-3d transition-transform duration-600 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        {/* FRONT */}
        <div 
          className={`absolute inset-0 backface-hidden rounded-[20px] flex flex-col items-center justify-center text-center p-4 ${a.unlocked ? "border-none" : "bg-slate-100 border-[1.5px] border-dashed border-slate-300"}`}
          style={{ background: a.unlocked ? cfg.grad : undefined }}
        >
          {!a.unlocked && <LockIcon size={14} className="absolute top-3 right-3 text-slate-400" />}
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${a.unlocked ? "bg-white/20" : "bg-slate-200"}`}>
            <AchievementIconSm icon={a.icon} size={24} color={a.unlocked ? "white" : "#94a3b8"} />
          </div>
          <div className={`text-[13px] font-bold leading-[1.2] ${a.unlocked ? "text-white" : "text-slate-500"}`}>{a.title}</div>
          <div className={`text-[9px] font-semibold uppercase mt-1 ${a.unlocked ? "text-white/60" : "text-slate-400"}`}>{cfg.label}</div>
        </div>
        {/* BACK */}
        <div className="absolute inset-0 backface-hidden [transform:rotateY(180deg)] bg-slate-800 rounded-[20px] p-4 flex flex-col items-center justify-center text-center text-white">
          <div className="text-[12px] font-medium leading-[1.4]">{a.description}</div>
          {a.unlockedAt && <div className="text-[9px] text-white/40 mt-2">Obtenido el {new Date(a.unlockedAt).toLocaleDateString()}</div>}
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

  const { user: clerkUser } = useUser()

  const updateAvatar = async (newAvatar: any) => {
    setSavingAvatar(true)
    try {
      // 1. Update our internal database (Prisma)
      await fetch("/api/profiles", { 
        method: "PATCH", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ avatar: newAvatar }) 
      })
      
      // 2. Clear local storage if needed or refresh
      if (refreshUser) await refreshUser()
      setIsPickerOpen(false)
    } catch (err) {
      console.error("Error updating avatar:", err)
    } finally { 
      setSavingAvatar(false) 
    }
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !clerkUser) return

    setSavingAvatar(true)
    try {
      // 1. Upload to Clerk
      await clerkUser.setProfileImage({ file })
      
      // 2. Take the new URL and sync to Prisma
      // We wait a bit for Clerk to process the image then refresh
      setTimeout(async () => {
        const newUrl = clerkUser.imageUrl
        await fetch("/api/profiles", { 
          method: "PATCH", 
          headers: { "Content-Type": "application/json" }, 
          body: JSON.stringify({ avatar: newUrl }) 
        })
        if (refreshUser) await refreshUser()
      }, 1000)

    } catch (err) {
      console.error("Error uploading photo:", err)
      alert("No se pudo subir la foto. Intenta con un archivo más pequeño.")
    } finally {
      setSavingAvatar(true) // Keep loading until refresh
      setTimeout(() => setSavingAvatar(false), 2000)
    }
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
      <div className="prof-outer min-h-screen bg-[#FBFAF5] flex items-center justify-center">
        <div className="max-w-[500px] w-full text-center p-10 bg-white rounded-[32px] border-[1.5px] border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
          <div className="mx-auto mb-6 w-[120px] h-[120px] rounded-full overflow-hidden flex items-center justify-center border-4 border-slate-100">
            <AvatarDisplay avatar={{ type: "admin" }} size={120} />
          </div>
          <h1 className="text-[28px] font-black text-slate-900 mb-2">Cuenta de Administración</h1>
          <p className="text-slate-500 text-[16px] mb-8">Este es un perfil institucional de gestión técnica. Las funciones sociales y de gamificación están desactivadas.</p>
          
          <div className="grid gap-3">
            <div className="py-4 px-5 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
              <span className="text-[13px] font-semibold text-slate-400">Rol Académico</span>
              <span className="text-[13px] font-extrabold text-blue-600">Administrador Escolar</span>
            </div>
            <div className="py-4 px-5 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
              <span className="text-[13px] font-semibold text-slate-400">Institución</span>
              <span className="text-[13px] font-extrabold text-slate-900">{dbProfile?.school?.name || "Bizen Institute"}</span>
            </div>
          </div>

          <button 
            onClick={handleSignOut}
            className="mt-10 w-full p-4 bg-red-500 text-white border-none rounded-2xl font-bold cursor-pointer hover:opacity-90 transition-opacity"
          >
            Cerrar Sesión Institucional
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-3 pb-28 px-3 md:py-10 md:px-6 lg:py-6 lg:px-16 w-full max-w-[1400px] mx-auto">
      <style>{`
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
      <div className="fade-up relative w-full mb-8 flex flex-col md:flex-row items-center md:items-end p-6 md:py-10 md:px-12 text-center md:text-left h-auto min-h-[180px] md:h-[260px] rounded-[20px] md:rounded-[32px] bg-gradient-to-br from-[#0b1e5e] to-[#0F62FE] shadow-[0_20px_40px_-12px_rgba(15,98,254,0.3)]">
        
        <div className="relative z-10 flex gap-4 md:gap-6 items-center w-full flex-col md:flex-row text-center md:text-left">
          {/* Avatar Box in Banner */}
          <div onClick={() => setIsPickerOpen(true)} className="w-[90px] h-[90px] md:w-[130px] md:h-[130px] rounded-full bg-white border-4 border-white/20 backdrop-blur-md shadow-2xl relative cursor-pointer overflow-hidden flex items-center justify-center shrink-0">
            <AvatarDisplay avatar={dbProfile?.avatar || user.user_metadata?.avatar || { id: "robot" }} size={screenSize < 768 ? 80 : 110} />
            <div 
              className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center border-2 border-white shadow-[0_4px_12px_rgba(0,0,0,0.2)] cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                document.getElementById('avatar-upload')?.click();
              }}
            >
              <Camera size={10} color="white" />
              <input 
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </div>
          </div>

          {/* Identity Details in Banner */}
          <div className="flex-1 text-white w-full">
            <div className={`flex items-center gap-2.5 mb-1 flex-wrap ${screenSize < 768 ? 'justify-center' : 'justify-start'}`}>
              <div className="bg-white/25 px-2.5 py-1 rounded-full text-[9px] font-extrabold tracking-widest border border-white/10">NIVEL {level}</div>
            </div>
            <h1 className={`font-extrabold m-0 tracking-tight leading-[1.1] drop-shadow-[0_2px_8px_rgba(0,0,0,0.2)] ${screenSize < 768 ? 'text-[22px]' : 'text-[32px]'}`}>
              {displayName}
            </h1>
            <div className={`flex items-center gap-2.5 mt-1 opacity-90 ${screenSize < 768 ? 'justify-center' : 'justify-start'}`}>
              <span className="text-[13px] text-white/80 font-medium">@{nickname}</span>
              <div className="w-[3px] h-[3px] rounded-full bg-white/40" />
              <button 
                onClick={() => router.push("/configuracion")}
                className="flex items-center gap-1.5 text-white bg-white/10 border border-white/20 py-0.5 px-2.5 rounded-full text-[11px] font-bold cursor-pointer transition-colors hover:bg-white/20"
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

      <div className="flex flex-col md:flex-row w-full relative z-10 gap-6 md:gap-8">
        
        {/* LEFT COLUMN: IDENTITY & STATS */}
        <div className="flex-1 flex flex-col gap-6">
          
          {/* XP Card — Spatial Blue Premium Redesign */}
          {!isAdminOrTeacher && (
            <div className="fade-up rounded-[28px] overflow-hidden bg-gradient-to-br from-[#060d22] via-[#0b1e5e] to-blue-600 relative shadow-[0_24px_64px_rgba(15,98,254,0.35),0_0_0_1px_rgba(255,255,255,0.05)]" style={{ animationDelay: "0.1s" }}>
              {/* Ambient orbs */}
              <div className="absolute -top-[40%] -right-[10%] w-[300px] h-[300px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(96,165,250,0.25) 0%, transparent 70%)" }} />
              <div className="absolute -bottom-[30%] left-[0%] w-[220px] h-[220px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(167,139,250,0.2) 0%, transparent 70%)" }} />

              <div className={`relative z-10 ${screenSize < 768 ? 'p-5' : 'p-6 px-7'}`}>
                {/* Top row: badge + XP value */}
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/10 rounded-full py-1 px-3 mb-2.5">
                      <Zap size={11} color="#60a5fa" />
                      <span className="text-[10px] font-bold text-blue-300 tracking-widest uppercase">Progreso de Nivel</span>
                    </div>
                    <div style={{ fontSize: screenSize < 768 ? 28 : 36, fontWeight: 900, color: "#fff", lineHeight: 1, letterSpacing: "-0.03em" }}>
                      Nivel <span style={{ background: "linear-gradient(90deg, #93c5fd, #c4b5fd)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{level}</span>
                    </div>
                    <div className="text-[12px] text-white/45 font-medium mt-1">
                      {xpInLevel.toLocaleString()} / {xpForNext.toLocaleString()} XP en este nivel
                    </div>
                  </div>
                  {/* XP Ring */}
                  <div className="shrink-0">
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
                        className="transition-[stroke-dasharray] duration-[1600ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                      />
                      <text x="50" y="44" textAnchor="middle" className="fill-white/40 text-[8px] font-extrabold tracking-[0.15em]">XP</text>
                      <text x="50" y="62" textAnchor="middle" className="fill-white text-[20px] font-black tracking-[-0.02em]">{Math.round(xpPct)}%</text>
                    </svg>
                  </div>
                </div>

                {/* XP Bar */}
                <div className="mb-3.5">
                  <div className="h-2.5 bg-white/10 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full transition-all duration-[1600ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] relative shadow-[0_0_16px_rgba(167,139,250,0.6),0_0_8px_rgba(96,165,250,0.4)]"
                      style={{ width: `${xpPct}%` }}
                    />
                  </div>
                </div>

                {/* Level milestones + XP remaining pill */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-1 max-w-[200px]">
                    {/* Current level node */}
                    <div className="flex items-center gap-1.5">
                      <div className="w-[22px] h-[22px] rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-[9px] font-black text-white shadow-[0_0_10px_rgba(96,165,250,0.6)]">{level}</div>
                      <span className="text-[10px] text-white/50 font-semibold hidden md:inline">Ahora</span>
                    </div>
                    <div className="flex-1 h-[1px] bg-white/10 mx-1" />
                    {/* Next level node */}
                    <div className="flex items-center gap-1.5">
                      <div className="w-[22px] h-[22px] rounded-full bg-white/10 border-[1.5px] border-white/15 flex items-center justify-center text-[9px] font-black text-white/50">{level + 1}</div>
                      <span className="text-[10px] text-white/35 font-semibold hidden md:inline">Siguiente</span>
                    </div>
                  </div>
                  {/* XP remaining pill */}
                  <div className="inline-flex items-center gap-1.5 bg-blue-400/10 border border-blue-400/20 rounded-full py-1 px-2.5">
                    <Zap size={10} color="#60a5fa" />
                    <span className="text-[10px] font-bold text-blue-300 whitespace-nowrap">
                      {(xpForNext - xpInLevel).toLocaleString()} XP restantes
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="fade-up grid grid-cols-2 gap-2 md:gap-3" style={{ animationDelay: "0.2s" }}>
            {[
              { icon: <Flame size={screenSize < 768 ? 16 : 18} />, value: userStats?.currentStreak || 0, label: "Racha", sub: "días", cardClass: "bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200", iconClass: "bg-rose-500/10 text-rose-500", valClass: "text-rose-700" },
              { icon: <Zap size={screenSize < 768 ? 16 : 18} />, value: totalXp.toLocaleString(), label: "Total XP", sub: "puntos", cardClass: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200", iconClass: "bg-blue-600/10 text-blue-600", valClass: "text-blue-700" },
              { icon: <Award size={screenSize < 768 ? 16 : 18} />, value: achievements.filter(a => a.unlocked).length, label: "Logros", sub: `de ${achievements.length}`, cardClass: "bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200", iconClass: "bg-yellow-600/10 text-yellow-600", valClass: "text-yellow-700" },
              { icon: <Star size={screenSize < 768 ? 16 : 18} />, value: getLeagueTitle(level), label: "Liga", sub: `Nivel ${level}`, cardClass: "bg-gradient-to-br from-green-50 to-green-100 border-green-200", iconClass: "bg-green-600/10 text-green-600", valClass: "text-green-700" },
            ].map(s => (
              <div key={s.label} className={`p-3 md:p-[18px_20px] flex items-center gap-2.5 md:gap-3.5 border-[1.5px] rounded-[20px] shadow-[0_4px_10px_rgba(0,0,0,0.03)] transition-transform hover:-translate-y-0.5 ${s.cardClass}`}>
                <div className={`w-8 h-8 md:w-[42px] md:h-[42px] rounded-lg flex items-center justify-center shrink-0 ${s.iconClass}`}>
                  {s.icon}
                </div>
                <div className="min-w-0">
                  <div className={`text-[18px] md:text-[22px] font-black leading-none tracking-tight ${s.valClass}`}>{s.value}</div>
                  <div className={`text-[9px] font-bold uppercase tracking-wider mt-0.5 opacity-80 ${s.valClass}`}>{s.label}</div>
                  {screenSize >= 768 && <div className={`text-[10px] font-medium mt-0.5 opacity-50 ${s.valClass}`}>{s.sub}</div>}
                </div>
              </div>
            ))}
          </div>

          {/* Achievements Area */}
          <div className="fade-up" style={{ animationDelay: "0.3s" }}>
             <h2 className="text-[16px] md:text-[18px] font-bold text-slate-900 mb-3 flex items-center gap-2">
               Mis Logros
               <span className="text-[11px] font-medium text-slate-500 bg-slate-100 py-0.5 px-2 rounded-lg">{achievements.filter(a => a.unlocked).length}</span>
             </h2>
             <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-2.5 md:gap-4">
                {achievements.map(a => <AchievementCard key={a.id} a={a} cfg={RARITY_CFG[a.rarity] || RARITY_CFG.común} />)}
             </div>
           </div>
        </div>

        {/* RIGHT COLUMN: BIZEN CARD & SOCIAL */}
        <div className="fade-up w-full md:w-[420px] shrink-0 flex flex-col gap-6 md:gap-8 order-[1] md:order-none" style={{ animationDelay: "0.15s" }}>
          {/* BIZEN VIRTUAL CARD */}
          <div className="prof-card fade-up p-3 md:p-6 bg-white rounded-3xl" style={{ animationDelay: "0.15s", overflow: "visible" }}>
            <div className="mb-4">
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
              className={`w-full p-2.5 rounded-xl border-[1.5px] border-slate-200 text-[12px] font-bold cursor-pointer flex items-center justify-center gap-2 transition-all duration-200 ${isThemePickerOpen ? 'bg-slate-50 text-blue-600' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
            >
              <Palette size={14} color={isThemePickerOpen ? "#0F62FE" : "#64748b"} />
              {isThemePickerOpen ? "Cerrar Personalización" : "Personalizar Tarjeta"}
              {isThemePickerOpen ? <ChevronDown size={14} className="rotate-180" /> : <ChevronRight size={14} />}
            </button>

            {/* Theme Picker - Conditional */}
            {isThemePickerOpen && (
              <div className="mt-5 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Selecciona un Color</span>
                  <div className="bg-white py-0.5 px-2 rounded-md text-[9px] font-extrabold text-blue-600 border border-slate-200">{cardTheme.toUpperCase()}</div>
                </div>
                <div className="w-full flex flex-wrap gap-2.5">
                  {(["blue", "emerald", "violet", "pink", "rose", "amber", "slate", "obsidian"] as CardTheme[]).map(t => (
                    <button 
                      key={t} 
                      onClick={() => updateCardTheme(t)} 
                      disabled={savingTheme}
                      className={`w-8 h-8 rounded-full transition-all duration-[200ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] ${savingTheme ? 'cursor-wait' : 'cursor-pointer'} hover:scale-110`}
                      style={{ 
                        border: cardTheme === t ? "3px solid #0F62FE" : "2.5px solid white", 
                        boxShadow: cardTheme === t ? "0 0 12px rgba(15,98,254,0.3)" : "0 2px 6px rgba(0,0,0,0.08)",
                        background: t === "obsidian" ? "#1a1a1a" : t === "blue" ? "#0F62FE" : t === "emerald" ? "#10B981" : t === "violet" ? "#8B5CF6" : t === "pink" ? "#EC4899" : t === "rose" ? "#F43F5E" : t === "amber" ? "#F59E0B" : "#64748B",
                        transform: cardTheme === t ? "scale(1.1)" : "scale(1)"
                      }} 
                    />
                  ))}
                </div>
              </div>
            )}
          </div>          {/* Status Badge for Admins/Teachers */}
          {isAdminOrTeacher && (
            <div className="p-6 bg-gradient-to-br from-[#0b1e5e] to-[#0F62FE] rounded-3xl text-white">
              <div className="flex items-center gap-3 mb-2">
                <Shield size={20} color="white" />
                <h3 className="m-0 text-[16px] font-bold">Perfil de Gestión</h3>
              </div>
              <p className="m-0 text-[13px] opacity-80 leading-relaxed">
                Como {dbProfile?.role === 'school_admin' ? 'Administrador' : 'Docente'}, tienes acceso total a las métricas y gestión de tu institución.
              </p>
            </div>
          )}

          {/* Premium Upsell Card (Moved up for visibility) */}
          {isParticular && !isPremium && (
            <div 
              onClick={() => router.push("/payment")}
              className="bg-gradient-to-br from-[#0b1e5e] to-[#0F62FE] rounded-3xl p-6 text-white cursor-pointer relative overflow-hidden shadow-[0_15px_35px_rgba(15,98,254,0.3)] transition-transform hover:-translate-y-1"
            >
              <div className="absolute -top-5 -right-5 w-[100px] h-[100px] bg-white/10 rounded-full" />
              <div className="flex items-center gap-2 bg-white/20 w-fit py-1 px-2.5 rounded-full text-[10px] font-bold mb-3 tracking-widest">BIZEN PRO</div>
              <h3 className="m-0 mb-2 text-[18px] font-bold">Acceso Ilimitado</h3>
              <p className="m-0 mb-5 text-[13px] text-white/80 leading-relaxed">Domina tus finanzas con todos los cursos y simuladores desbloqueados.</p>
              <div className="flex items-center gap-1 font-black text-[24px]">$179 <span className="text-[12px] font-medium opacity-80">/mes</span></div>
            </div>
          )}

          {/* Social Panel */}
          {/* Recent Activity (Wallet History) */}
          <div className="prof-card fade-up flex flex-col" style={{ animationDelay: "0.2s" }}>
            <div 
               onClick={() => setShowActivity(!showActivity)}
               className={`py-4 px-5 flex justify-between items-center cursor-pointer ${showActivity ? 'border-b-[1.5px] border-slate-100' : ''}`}
            >
              <h3 className="m-0 text-[15px] font-bold text-slate-900 flex items-center gap-2.5 flex-1">
                <History size={18} color="#0F62FE" /> Actividad Reciente
                <ChevronRight size={16} color="#94a3b8" className={`ml-1 transition-transform duration-300 ${showActivity ? 'rotate-90' : 'rotate-0'}`} />
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
                <div className="py-1.5 max-h-[320px] overflow-y-auto">
                  {loadingTransactions ? (
                    <div className="text-center py-8 text-[13px] text-slate-400">Cargando actividad...</div>
                  ) : transactions.length === 0 ? (
                    <div className="text-center py-10">
                       <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                          <CircleDollarSign size={24} color="#cbd5e1" />
                       </div>
                       <p className="m-0 text-slate-400 text-[13px] font-medium">No hay transacciones aún.</p>
                       <p className="m-0 mt-1 text-slate-300 text-[11px]">Completa lecciones para ganar Bizcoins.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      {transactions.slice(0, 2).map((t) => (
                        <div key={t.id} className="transaction-row-hover py-3.5 px-6 flex items-center gap-4">
                          <div className={`w-[38px] h-[38px] rounded-xl flex items-center justify-center ${t.type === "income" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"}`}>
                            {getIcon(t.category)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="text-[13px] font-bold text-slate-900 whitespace-nowrap overflow-hidden text-ellipsis">
                              {t.description}
                            </div>
                            <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                              {new Date(t.createdAt).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })} • {t.category === "purchase" || t.category === "transfer_sent" ? "Gasto" : "Ingreso"}
                            </div>
                          </div>

                          <div className="text-right">
                            <div className={`text-[14px] font-extrabold flex items-center justify-end gap-0.5 ${t.type === "income" ? "text-emerald-500" : "text-rose-500"}`}>
                              {t.type === "income" ? "+" : "-"}{t.amount}
                              <span className="text-[9px] font-bold opacity-80">BC</span>
                            </div>
                            {t.type === "income" ? <ArrowUpRight size={10} className="text-emerald-500 opacity-60 ml-auto" /> : <ArrowDownLeft size={10} className="text-rose-500 opacity-60 ml-auto" />}
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
            <div className="py-4 px-5 border-b-[1.5px] border-slate-100 flex justify-between items-center">
              <h3 
                onClick={() => router.push("/metas")}
                className="m-0 text-[15px] font-bold text-slate-900 flex items-center gap-2.5 cursor-pointer"
              >
                <Target size={18} color="#10B981" /> Metas de Ahorro
              </h3>
              <div className="flex items-center gap-2.5">
                {goals.length > 0 && (
                  <button 
                    onClick={() => router.push("/metas")}
                    className="text-[11px] font-bold text-emerald-500 bg-emerald-500/10 py-1 px-3 rounded-full border-none cursor-pointer"
                  >
                    Ver Todo
                  </button>
                )}
                <PlusCircle 
                  size={18} 
                  color="#10B981" 
                  className="cursor-pointer opacity-80" 
                  onClick={() => router.push("/metas")} 
                />
              </div>
            </div>

            <div className="py-3.5 px-5">
              {loadingGoals ? (
                 <div className="text-center p-5 text-[12px] text-slate-400">Cargando metas...</div>
              ) : goals.length === 0 ? (
                 <div className="text-center p-5 text-slate-400 text-[13px]">No tienes metas activas.</div>
              ) : (
                <div className="flex flex-col gap-5">
                  {goals.map(g => {
                    const progress = Math.min(100, Math.floor((bizcoins / g.targetAmount) * 100));
                    return (
                      <div key={g.id}>
                        <div className="flex justify-between items-end mb-2">
                          <div>
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">{g.category || "General"}</div>
                            <div className="text-[14px] font-bold text-slate-900">{g.title}</div>
                          </div>
                          <div className="text-right">
                             <div className="text-[13px] font-extrabold text-slate-900">{progress}%</div>
                             <div className="text-[9px] font-semibold text-slate-400">{bizcoins} / {g.targetAmount} BC</div>
                          </div>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-md overflow-hidden">
                          <div 
                            className={`h-full rounded-md transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${progress === 100 ? "bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]" : "bg-gradient-to-r from-blue-600 to-blue-400"}`}
                            style={{ width: `${progress}%` }} 
                          />
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
             <div className="py-4 px-5 border-b-[1.5px] border-slate-100 flex justify-between items-center">
                <h3 
                  onClick={() => router.push("/investments")}
                  className="m-0 text-[15px] font-bold text-slate-900 flex items-center gap-2.5 cursor-pointer"
                >
                   <Zap size={18} color="#8B5CF6" /> Inversión BIZEN
                </h3>
                <div className="flex items-center gap-2">
                  {staking.length > 0 && (
                    <button 
                      onClick={() => router.push("/investments")}
                      className="text-[11px] font-bold text-violet-500 bg-violet-500/10 py-1 px-3 rounded-full border-none cursor-pointer"
                    >
                      Ver Todo
                    </button>
                  )}
                  <PlusCircle 
                    size={18} 
                    color="#8B5CF6" 
                    className="cursor-pointer opacity-80" 
                    onClick={() => router.push("/investments")} 
                  />
                </div>
             </div>
             <div className="py-3.5 px-5">
                {loadingStaking ? (
                   <div className="text-center p-5 text-[12px] text-slate-400">Cargando inversiones...</div>
                ) : staking.length === 0 ? (
                   <div className="text-center py-6 px-5 bg-slate-50 rounded-2xl border-[1.5px] border-dashed border-slate-200">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                         <CircleDollarSign size={24} color="#cbd5e1" />
                      </div>
                      <p className="m-0 mb-1 text-slate-500 text-[13px] font-bold">Activos en pausa</p>
                      <p className="m-0 text-slate-400 text-[11px]">No tienes Bizcoins trabajando ahora.</p>
                   </div>
                ) : (
                   <div className="flex flex-col gap-3">
                       {/* Yield Summary if multiple */}
                       {staking.filter(s => s.status === 'active').length > 1 && (
                         <div className="py-2.5 px-3.5 bg-violet-500/5 rounded-xl border border-violet-500/10 flex justify-between items-center mb-1">
                           <span className="text-[11px] font-bold text-violet-600">Total en crecimiento</span>
                           <span className="text-[13px] font-extrabold text-violet-600">{staking.filter(s => s.status === 'active').reduce((acc, curr) => acc + (curr.amount * curr.yieldRate), 0).toFixed(0)} <span className="text-[9px]">BC</span></span>
                         </div>
                       )}
                      {staking.map(s => {
                        const total = new Date(s.endDate).getTime() - new Date(s.startDate).getTime();
                        const elapsed = new Date().getTime() - new Date(s.startDate).getTime();
                        const progress = Math.min(100, Math.max(0, Math.floor((elapsed / total) * 100)));
                        const returnAmt = Math.floor(s.amount * s.yieldRate);

                        return (
                          <div key={s.id} className={`p-4.5 rounded-[20px] relative overflow-hidden ${s.status === 'active' ? 'bg-white border-[1.5px] border-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.03)]' : 'bg-slate-50 border-[1.5px] border-slate-100'}`}>
                            {s.status === 'active' && <div className="absolute top-0 left-0 bottom-0 w-1 bg-violet-500" />}
                            <div className="flex justify-between mb-3">
                              <div>
                                <div className="flex items-center gap-1.5 mb-1.5">
                                   <div className={`w-5 h-5 rounded-full flex items-center justify-center ${s.status === 'active' ? 'bg-violet-500/10 text-violet-500' : 'bg-slate-200 text-slate-400'}`}>
                                      <Zap size={10} />
                                   </div>
                                   <span className={`text-[10px] font-bold ${s.status === 'active' ? 'text-violet-500' : 'text-slate-400'}`}>BIZEN LQD</span>
                                </div>
                                <div className="text-[15px] font-black text-slate-900">{s.amount.toLocaleString()} <span className="text-[10px] font-semibold text-slate-400">BC en fondo</span></div>
                              </div>
                              <div className="text-right">
                                <div className="text-[15px] font-black text-emerald-500">+{returnAmt} BC</div>
                                <div className="text-[9px] text-slate-400 font-bold">RETORNO ({(s.yieldRate * 100).toFixed(0)}%)</div>
                              </div>
                            </div>
                            
                            {s.status === 'active' ? (
                              <div className="mt-3">
                                <div className="flex justify-between text-[10px] text-slate-500 font-bold mb-1.5">
                                  <span>Progreso de maduración</span>
                                  <span>{progress}%</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-md overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-violet-500 to-purple-400 rounded-md transition-all duration-1000 ease-out"
                                    style={{ width: `${progress}%` }} 
                                  />
                                </div>
                                <div className="flex items-center gap-1 mt-2 text-[9px] text-slate-400 font-semibold">
                                  <Calendar size={10} />
                                  Vence el {new Date(s.endDate).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </div>
                              </div>
                            ) : (
                              <div className="mt-2 py-2 px-3 bg-emerald-500/5 rounded-[10px] flex items-center gap-2">
                                <Check size={12} color="#10B981" />
                                <span className="text-[10px] text-emerald-600 font-bold">Inversión liquidada exitosamente</span>
                              </div>
                            )}
                          </div>
                        )
                      })}
                   </div>
                )}
                
                <button 
                  className="mt-4 w-full py-3.5 rounded-2xl border-none bg-gradient-to-br from-violet-900 to-violet-800 text-white text-[12px] font-extrabold cursor-pointer flex items-center justify-center gap-2.5 shadow-[0_8px_24px_rgba(46,16,101,0.25)] transition-transform hover:-translate-y-0.5"
                  onClick={() => router.push("/investments")}
                >
                   <Zap size={16} className="fill-white" /> 
                   <span>Gestionar Inversiones</span>
                </button>

                 <div className="mt-5 p-4 bg-blue-600/5 rounded-2xl border border-blue-600/10">
                    <div className="flex items-center gap-2 mb-2">
                       <Info size={14} color="#0F62FE" />
                       <span className="text-[11px] font-extrabold text-blue-600 uppercase tracking-widest">Sabías que...</span>
                    </div>
                    <p className="m-0 text-[11px] text-slate-500 leading-relaxed">
                       Invertir tus Bizcoins es la mejor forma de generar <span className="font-bold text-slate-900">interés compuesto</span>. ¡Entre más tiempo los dejes, más crecerán!
                    </p>
                 </div>
             </div>
          </div>

          <div className="prof-card overflow-hidden">
             <div className="flex border-b-[1.5px] border-slate-100">
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
             <div className="p-5 min-h-[240px] max-h-[400px] overflow-y-auto">
                {(rightTab === "following" ? loadingFollowing : loadingFollowers) ? (
                  <div className="text-center p-10 text-slate-400">Cargando...</div>
                ) : (rightTab === "following" ? following : followers).length === 0 ? (
                  <div className="text-center p-10">
                    {rightTab === "following" ? <FollowIllustration /> : <CommunityIllustration />}
                    <p className="mt-4 text-slate-400 text-[13px] font-medium">No hay actividad aún.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {(rightTab === "following" ? following : followers).map((f: any) => (
                      <div key={f.userId} onClick={() => router.push(`/forum/profile/${f.userId}`)} className="flex items-center gap-3 p-2.5 rounded-2xl cursor-pointer transition-colors duration-200 hover:bg-slate-50">
                         <AvatarDisplay avatar={f.avatar} size={36} />
                         <div className="flex-1">
                            <div className="font-bold text-[14px] text-slate-900">{f.nickname}</div>
                            <div className="text-[11px] text-slate-400 font-semibold">Nivel {f.level}</div>
                         </div>
                         <ChevronRight size={14} color="#cbd5e1" />
                      </div>
                    ))}
                  </div>
                )}
             </div>
          </div>
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
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-[8px] flex items-center justify-center z-[9999] p-5" onClick={() => setIsPickerOpen(false)}>
           <div className="bg-white p-8 rounded-[32px] w-full max-w-[480px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] relative" onClick={e => e.stopPropagation()}>
              <button 
                onClick={() => setIsPickerOpen(false)} 
                className="absolute top-5 right-5 bg-slate-100 border-none rounded-full w-9 h-9 cursor-pointer flex items-center justify-center transition-colors hover:bg-slate-200"
              >
                <CloseIcon size={18} color="#64748b" />
              </button>
              <h3 className="m-0 mb-2 text-[24px] font-extrabold text-slate-900">Elige tu Avatar</h3>
              <p className="m-0 mb-6 text-slate-500 text-[14px]">Personaliza tu identidad en la plataforma.</p>
              
              <div className="grid grid-cols-[repeat(auto-fill,minmax(60px,1fr))] gap-3 max-h-[300px] overflow-y-auto pr-1">
                {AVATAR_OPTIONS.map(av => (
                  <button 
                    key={av.id} 
                    onClick={() => updateAvatar(av)} 
                    className="bg-transparent border-[2.5px] border-transparent cursor-pointer rounded-full p-0 flex items-center justify-center transition-transform hover:scale-110"
                  >
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
