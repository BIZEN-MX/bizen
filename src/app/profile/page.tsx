"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useOnboarding } from "@/contexts/OnboardingContext"
import { createClientMicrocred } from "@/lib/supabase/client-microcred"
import { AvatarDisplay } from "@/components/AvatarDisplay"
import Link from "next/link"
import {
  Flame, Zap, Shield, Award, UserPlus, Users,
  Search, Mail, ChevronRight, X as CloseIcon, Camera, Star,
  Trophy, BookOpen, Compass, Share2, Heart
} from "lucide-react"

// --- CUSTOM ILLUSTRATIONS ---
const CommunityIllustration = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="40" cy="40" r="40" fill="#0F62FE" fillOpacity="0.05" />
    <path d="M40 48C46.6274 48 52 42.6274 52 36C52 29.3726 46.6274 24 40 24C33.3726 24 28 29.3726 28 36C28 42.6274 33.3726 48 40 48Z" stroke="#0F62FE" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M22 60V56C22 51.5817 25.5817 48 30 48H32" stroke="#0F62FE" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M58 60V56C58 51.5817 54.4183 48 50 48H48" stroke="#0F62FE" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="58" cy="34" r="6" stroke="#0F62FE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="22" cy="34" r="6" stroke="#0F62FE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const FollowIllustration = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="40" cy="40" r="40" fill="#0F62FE" fillOpacity="0.05" />
    <path d="M40 24V56M24 40H56" stroke="#0F62FE" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" />
    <path d="M40 28C44.4183 28 48 31.5817 48 36C48 40.4183 44.4183 44 40 44C35.5817 44 32 40.4183 32 36C32 31.5817 35.5817 28 40 28Z" stroke="#0F62FE" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M28 56V52C28 47.5817 31.5817 44 36 44H44C48.4183 44 52 47.5817 52 52V56" stroke="#0F62FE" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="60" cy="24" r="4" fill="#0F62FE" stroke="#0F62FE" strokeWidth="1" />
  </svg>
)

const CustomFollowingIcon = ({ active }: { active: boolean }) => (
  <div style={{
    width: 44, height: 44, borderRadius: "50%",
    background: active ? "rgba(15,98,254,0.12)" : "rgba(148,163,184,0.06)",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
    transform: active ? "scale(1.1)" : "scale(1)"
  }}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ animation: active ? "tienda-bounce 2s infinite" : "none" }}>
      <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke={active ? "#0F62FE" : "#94a3b8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z" stroke={active ? "#0F62FE" : "#94a3b8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 11L19 13L23 9" stroke={active ? "#0F62FE" : "#94a3b8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
)

const CustomFollowersIcon = ({ active }: { active: boolean }) => (
  <div style={{
    width: 44, height: 44, borderRadius: "50%",
    background: active ? "rgba(15,98,254,0.12)" : "rgba(148,163,184,0.06)",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
    transform: active ? "scale(1.1)" : "scale(1)"
  }}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ animation: active ? "tienda-wiggle 2s infinite" : "none" }}>
      <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke={active ? "#0F62FE" : "#94a3b8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke={active ? "#0F62FE" : "#94a3b8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke={active ? "#0F62FE" : "#94a3b8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45768C17.623 10.1593 16.8604 10.6597 16 10.88" stroke={active ? "#0F62FE" : "#94a3b8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
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


const ACHIEVEMENTS: any[] = []

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
  const [profileStats, setProfileStats] = useState<{
    joinDate: string | null
    followersCount: number
    followingCount: number
  } | null>(null)
  const [schools, setSchools] = useState<{ id: string; name: string }[]>([])
  const [formData, setFormData] = useState({ fullName: "", username: "", bio: "", birthDate: "", schoolId: "" })
  const [showFollowers, setShowFollowers] = useState(false)
  const [showFollowing, setShowFollowing] = useState(false)
  const [followers, setFollowers] = useState<any[]>([])
  const [following, setFollowing] = useState<any[]>([])
  const [loadingFollowers, setLoadingFollowers] = useState(false)
  const [loadingFollowing, setLoadingFollowing] = useState(false)
  const [rightTab, setRightTab] = useState<"following" | "followers">("following")

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    document.body.style.background = "#FBFAF5"
    // Refresh user profile whenever page mounts to ensure inventory is fresh
    if (refreshUser) refreshUser()
    return () => { document.body.style.background = "" }
  }, [])

  useEffect(() => {
    if (loading) return
    if (!user) { window.open("/login", "_blank"); return }
    setFormData({
      fullName: user.user_metadata?.full_name || "",
      username: user.user_metadata?.username || "",
      bio: user.user_metadata?.bio || "",
      birthDate: user.user_metadata?.birth_date || "",
      schoolId: user.user_metadata?.school_id || ""
    })
    fetch("/api/user/stats").then(r => r.ok ? r.json() : null).then(d => { if (d) setUserStats(d) }).finally(() => setLoadingStats(false))
    fetch("/api/profile/stats").then(r => r.ok ? r.json() : null).then(d => { if (d) setProfileStats(d) })
    fetch("/api/schools").then(r => r.ok ? r.json() : null).then(d => { if (d) setSchools(d) })
  }, [user, loading, router])

  const fetchFollowersList = async () => {
    if (!user?.id || loadingFollowers) return
    setLoadingFollowers(true)
    try { const r = await fetch(`/api/forum/profile/${user.id}/followers`); if (r.ok) { const d = await r.json(); setFollowers(d.followers || []) } }
    catch { } finally { setLoadingFollowers(false) }
  }
  const fetchFollowingList = async () => {
    if (!user?.id || loadingFollowing) return
    setLoadingFollowing(true)
    try { const r = await fetch(`/api/forum/profile/${user.id}/following`); if (r.ok) { const d = await r.json(); setFollowing(d.following || []) } }
    catch { } finally { setLoadingFollowing(false) }
  }

  const avatarOptions = [
    { type: "character", id: "robot", character: "robot", label: "Robot" },
    { type: "character", id: "astronaut", character: "astronaut", label: "Astronauta" },
    { type: "mascot", id: "fox", label: "Zorro" }, { type: "mascot", id: "owl", label: "Búho" },
    { type: "mascot", id: "dolphin", label: "Delfín" }, { type: "mascot", id: "turtle", label: "Tortuga" },
    { type: "mascot", id: "beaver", label: "Castor" }, { type: "mascot", id: "squirrel", label: "Ardilla" },
    { type: "mascot", id: "dog", label: "Perro" }, { type: "mascot", id: "cat", label: "Gato" },
    { type: "mascot", id: "lion", label: "León" }, { type: "mascot", id: "koala", label: "Koala" },
    { type: "mascot", id: "penguin", label: "Pingüino" },
    { type: "gradient", id: "grad1", gradient: "linear-gradient(135deg, #0F62FE, #6366f1)", label: "Azure" },
    { type: "pattern", id: "patt1", pattern: "dots", color: "#0F62FE", label: "Puntos" },
    { type: "abstract", id: "abst1", abstract: "circles", colors: ["#0F62FE", "#6366f1", "#93c5fd"], label: "Abstract" }
  ]

  const updateAvatar = async (newAvatar: any) => {
    if (!supabase) return
    setSavingAvatar(true)
    try {
      const { error } = await supabase.auth.updateUser({ data: { avatar: newAvatar } })
      if (error) throw error
      await fetch("/api/profiles", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ avatar: newAvatar }) })
      setIsPickerOpen(false)
      if (refreshUser) refreshUser()
      router.refresh()
    } catch { alert("No se pudo actualizar el avatar") } finally { setSavingAvatar(false) }
  }

  // ── SKELETON COMPONENTS ──
  const Skeleton = ({ w, h, r = 12, mb = 0, style = {} }: any) => (
    <div className="skeleton-pulse" style={{ width: w, height: h, borderRadius: r, marginBottom: mb, background: "#f1f5f9", ...style }} />
  )

  const ProfileSkeleton = () => (
    <div className="prof-outer" style={{ minHeight: "100vh", background: "#FBFAF5", padding: "clamp(24px, 5vw, 48px) clamp(16px, 4vw, 40px)" }}>
      <div style={{ maxWidth: 1140, margin: "0 auto", display: "flex", gap: 32 }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 24, alignItems: "center" }}>
          <Skeleton w={190} h={190} r="50%" mb={20} />
          <Skeleton w={200} h={40} mb={8} />
          <Skeleton w={140} h={20} mb={24} />
          <div style={{ display: "flex", gap: 16 }}>
            <Skeleton w={80} h={40} />
            <Skeleton w={80} h={40} />
          </div>
          <div style={{ width: "100%", height: 1, background: "#e2e8f0", margin: "10px 0" }} />
          <div style={{ alignSelf: "flex-start", width: "100%" }}>
            <Skeleton w={120} h={24} mb={16} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Skeleton w="100%" h={100} />
              <Skeleton w="100%" h={100} />
              <Skeleton w="100%" h={100} />
              <Skeleton w="100%" h={100} />
            </div>
          </div>
        </div>
        <div style={{ width: 300, display: "flex", flexDirection: "column", gap: 16 }}>
          <Skeleton w="100%" h={250} />
          <Skeleton w="100%" h={180} />
        </div>
      </div>
    </div>
  )

  const ListSkeleton = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {[1, 2, 3, 4].map(i => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Skeleton w={40} h={40} r="50%" />
          <div style={{ flex: 1 }}>
            <Skeleton w="70%" h={14} mb={6} />
            <Skeleton w="40%" h={10} />
          </div>
        </div>
      ))}
    </div>
  )

  if (loading || !mounted) return (
    <>
      <style>{`
        @keyframes skeleton-pulse { 0% { opacity: 1; } 50% { opacity: 0.6; } 100% { opacity: 1; } }
        .skeleton-pulse { animation: skeleton-pulse 1.5s infinite ease-in-out; }
      `}</style>
      <ProfileSkeleton />
    </>
  )
  if (!user) return null

  const displayName = formData.fullName || user.email?.split("@")[0] || "Usuario"
  const nickname = formData.username ? formData.username.replace("@", "") : user.email?.split("@")[0] || ""
  const joinDate = profileStats?.joinDate
    ? new Date(profileStats.joinDate).toLocaleDateString("es-ES", { month: "long", year: "numeric" })
    : null

  const streak = dbProfile?.currentStreak || userStats?.currentStreak || 0
  const totalXp = userStats?.xp || 0
  const level = userStats?.level || dbProfile?.level || 1
  const bizcoins = (dbProfile as any)?.bizcoins || 0
  const xpInLevel = userStats?.xpInCurrentLevel || 0
  const xpForNext = userStats?.xpNeeded || 100
  const xpPct = Math.min((xpInLevel / xpForNext) * 100, 100)

  const getAchievementProgress = (a: typeof ACHIEVEMENTS[0]) => {
    if (a.unit === "streak") return Math.min(streak, a.maxVal)
    if (a.unit === "xp") return Math.min(totalXp, a.maxVal)
    return 0
  }

  const statCards = [
    { icon: <Flame size={22} color="#0F62FE" />, value: streak, label: "Racha diaria" },
    { icon: <Zap size={22} color="#0F62FE" />, value: totalXp, label: "Total XP" },
    { icon: <Shield size={22} color="#0F62FE" />, value: level === 1 ? "Ninguna" : `Nivel ${level}`, label: "Liga actual" },
    { icon: <Award size={22} color="#0F62FE" />, value: ACHIEVEMENTS.filter(a => getAchievementProgress(a) >= a.maxVal).length, label: "Top completados" },
  ]

  const Card = ({ style, className, children }: any) => (
    <div className={className} style={{
      background: "white",
      border: "1px solid rgba(15,98,254,0.08)",
      borderRadius: 20,
      boxSizing: "border-box",
      boxShadow: "0 2px 12px rgba(15,98,254,0.04), 0 1px 3px rgba(0,0,0,0.04)",
      ...style
    }}>
      {children}
    </div>
  )

  return (
    <>


      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px) } to { opacity:1; transform:translateY(0) } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes blobRotate { 0% { transform: rotate(0deg) scale(1); } 50% { transform: rotate(180deg) scale(1.1); } 100% { transform: rotate(360deg) scale(1); } }
        @keyframes skeleton-pulse { 0% { opacity: 1; } 50% { opacity: 0.6; } 100% { opacity: 1; } }

        .skeleton-pulse { animation: skeleton-pulse 1.5s infinite ease-in-out; }

        @media (max-width: 767px) {
          .prof-outer { padding-bottom: calc(80px + env(safe-area-inset-bottom)) !important; }
          .prof-two-col { flex-direction: column !important; align-items: center !important; }
          .prof-left-col { width: 100% !important; display: flex !important; flex-direction: column !important; align-items: center !important; }
          .prof-right-col { width: 100% !important; }
        }
        @media (min-width: 768px) and (max-width: 1160px) {
          .prof-outer { width: calc(100% - 220px) !important; margin-left: 220px !important; }
        }
        @media (min-width: 1161px) {
          .prof-outer { width: calc(100% - 280px) !important; margin-left: 280px !important; }
        }
        .prof-tab-btn {
          flex: 1; padding: 14px; font-size: 13px; font-weight: 800;
          font-family: inherit; border: none; cursor: pointer;
          text-transform: uppercase; letter-spacing: 0.08em;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); background: transparent;
        }
        .prof-tab-btn.active { color: #0F62FE; border-bottom: 3px solid #0F62FE; }
        .prof-tab-btn.inactive { color: #94a3b8; border-bottom: 3px solid transparent; }
        .prof-tab-btn.inactive:hover { color: #64748b; background: rgba(15,98,254,0.02); }

        .prof-add-row {
          display: flex; align-items: center; gap: 14px;
          padding: 14px 20px; cursor: pointer; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); border-radius: 12px;
        }
        .prof-add-row:hover { background: #f1f5f9; transform: translateX(4px); }

        .prof-card-hover { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .prof-card-hover:hover { transform: translateY(-4px); box-shadow: 0 12px 30px -10px rgba(0,0,0,0.1); }

        .progress-shimmer {
          background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }

        .blob {
          position: fixed; width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(15,98,254,0.06) 0%, transparent 70%);
          border-radius: 50%; z-index: -1; animation: blobRotate 20s infinite linear;
        }

        @keyframes tienda-bounce  { 0%,100% { transform: scale(1); } 50% { transform: scale(1.1); } }
        @keyframes tienda-wiggle  { 0%,100% { transform: rotate(0); } 25% { transform: rotate(-8deg); } 75% { transform: rotate(8deg); } }
        `
      }} />

      <div className="prof-outer" style={{
        minHeight: "100vh", background: "#FBFAF5",
        fontFamily: "'Inter', 'Montserrat', sans-serif",
        boxSizing: "border-box", color: "#0f172a",
        position: "relative", overflowX: "hidden"
      }}>
        {/* Decorative elements */}
        <div className="blob" style={{ top: "-100px", right: "-100px" }} />
        <div className="blob" style={{ bottom: "-100px", left: "-100px", animationDelay: "-10s" }} />

        {/* Banner Section */}
        <div style={{
          height: 180, width: "calc(100% - 32px)",
          margin: "16px",
          borderRadius: "24px",
          background: "linear-gradient(135deg, #0f2a6e 0%, #1e3a8a 50%, #2563eb 100%)",
          position: "absolute", top: 0, left: 0, zIndex: 0,
          boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3)"
        }}>
          <div style={{ position: "absolute", inset: 0, opacity: 0.1, backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        </div>

        <div className="prof-two-col" style={{
          display: "flex", gap: 32,
          padding: "clamp(24px, 5vw, 48px) clamp(16px, 4vw, 40px)",
          maxWidth: 1400, margin: "0 auto",
          boxSizing: "border-box", width: "100%",
          alignItems: "flex-start",
          animation: "fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both"
        }}>

          {/* ══ LEFT COLUMN ══ */}
          <div className="prof-left-col" style={{ flex: "1 1 0", minWidth: 0, display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Avatar card - CIRCULAR with 'Life' features */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
              <div
                onClick={() => setIsPickerOpen(true)}
                className="prof-card-hover"
                style={{
                  width: 190, height: 190,
                  background: "white",
                  borderRadius: "50%", overflow: "hidden",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  position: "relative", cursor: "pointer",
                  border: "6px solid #fff",
                  boxShadow: "0 20px 40px rgba(15,98,254,0.12)",
                }}
              >
                {/* Background glow in circle */}
                <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 50%, #eff6ff 0%, #dbeafe 100%)", zIndex: 0 }} />

                <div style={{ position: "relative", zIndex: 1 }}>
                  <AvatarDisplay
                    avatar={user.user_metadata?.avatar || { type: "character", id: "robot", character: "robot" }}
                    size={155}
                    frame={
                      (userStats?.inventory?.includes("2") || dbProfile?.inventory?.includes("2")) ? "vip" :
                        (userStats?.inventory?.includes("1") || dbProfile?.inventory?.includes("1")) ? "ambassador" : null
                    }
                  />
                </div>

                {/* Camera icon button */}
                <div style={{
                  position: "absolute", bottom: 12, right: 12,
                  width: 42, height: 42, borderRadius: "50%",
                  background: "#0F62FE",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 8px 16px rgba(15,98,254,0.4)",
                  border: "3px solid white",
                  zIndex: 2,
                  transition: "transform 0.2s"
                }}>
                  <Camera size={20} color="white" />
                </div>
              </div>
            </div>

            {/* Identity */}
            <div style={{ textAlign: "center" }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "rgba(15,98,254,0.06)", border: "1px solid rgba(15,98,254,0.12)",
                padding: "4px 12px", borderRadius: 999, marginBottom: 12
              }}>
                <Trophy size={14} color="#0F62FE" />
                <span style={{ fontSize: 12, fontWeight: 800, color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.02em" }}>Nivel {level}</span>
              </div>

              <h1 style={{ margin: "0 0 6px", fontSize: 32, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                {displayName}
              </h1>
              <p style={{ margin: "0 0 4px", fontSize: 16, color: "#64748b", fontWeight: 600 }}>
                {nickname ? `@${nickname}` : user.email}
              </p>
              {joinDate && (
                <p style={{ margin: "0 0 20px", fontSize: 13, color: "#94a3b8", fontWeight: 500 }}>
                  <Compass size={13} style={{ verticalAlign: "middle", marginRight: 5, marginTop: -2 }} />
                  Se unió en {joinDate}
                </p>
              )}

              {/* Following / Followers */}
              <div style={{ display: "inline-flex", gap: 32, marginBottom: 24, justifyContent: "center" }}>
                <button
                  onClick={() => { setRightTab("following"); fetchFollowingList() }}
                  style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: "4px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
                >
                  <CustomFollowingIcon active={rightTab === "following"} />
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 18, fontWeight: 900, color: "#0f172a" }}>{profileStats?.followingCount ?? 0}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: rightTab === "following" ? "#0F62FE" : "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Siguiendo</div>
                  </div>
                </button>
                <button
                  onClick={() => { setRightTab("followers"); fetchFollowersList() }}
                  style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: "4px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
                >
                  <CustomFollowersIcon active={rightTab === "followers"} />
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 18, fontWeight: 900, color: "#0f172a" }}>{profileStats?.followersCount ?? 0}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: rightTab === "followers" ? "#0F62FE" : "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Seguidores</div>
                  </div>
                </button>
              </div>

              <div style={{ height: 1, background: "linear-gradient(90deg, transparent, #e2e8f0, transparent)", marginBottom: 24 }} />
            </div>

            {/* Level Progress - Adding Life */}
            <div className="prof-card-hover" style={{
              background: "linear-gradient(135deg, #f8faff 0%, #fff 100%)",
              padding: "20px 24px", borderRadius: 20,
              border: "1px solid rgba(15,98,254,0.1)",
              boxShadow: "0 4px 16px rgba(15,98,254,0.06)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#0f172a", display: "flex", alignItems: "center", gap: 8 }}>
                  <Zap size={16} color="#0F62FE" />
                  Tu Progreso
                </h3>
                <span style={{ fontSize: 12, fontWeight: 800, color: "#0F62FE", background: "rgba(15,98,254,0.07)", padding: "3px 10px", borderRadius: 999 }}>{xpPct.toFixed(0)}%</span>
              </div>
              <div style={{ width: "100%", height: 10, background: "#e9f0ff", borderRadius: 10, overflow: "hidden", position: "relative" }}>
                <div style={{
                  width: `${xpPct}%`, height: "100%",
                  background: "linear-gradient(90deg, #60a5fa, #0F62FE)",
                  borderRadius: 10, transition: "width 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }} />
                <div className="progress-shimmer" style={{ position: "absolute", inset: 0, width: `${xpPct}%`, borderRadius: 10 }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 12, fontWeight: 700, color: "#94a3b8" }}>
                <span>{xpInLevel.toLocaleString()} XP</span>
                <span>Nivel {level + 1} →</span>
              </div>
            </div>

            {/* Statistics */}
            <div>
              <h2 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.02em" }}>
                Estadísticas
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {statCards.map(({ icon, value, label }, i) => (
                  <div
                    key={label}
                    className="prof-card-hover"
                    style={{
                      padding: "20px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                      background: i % 2 === 0
                        ? "linear-gradient(135deg, #f8faff 0%, #fff 100%)"
                        : "linear-gradient(135deg, #fffdf8 0%, #fff 100%)",
                      border: "1px solid rgba(15,98,254,0.08)",
                      borderRadius: 18,
                      boxShadow: "0 2px 12px rgba(15,98,254,0.05)",
                      boxSizing: "border-box"
                    }}
                  >
                    <div style={{
                      width: 40, height: 40, borderRadius: 12,
                      background: "rgba(15,98,254,0.08)",
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}>{icon}</div>
                    <div>
                      <div style={{ fontSize: 24, fontWeight: 900, color: "#0f172a", lineHeight: 1 }}>{value}</div>
                      <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700, marginTop: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inventory / Purchases Section */}
            {(userStats?.inventory?.length || dbProfile?.inventory?.length) ? (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.01em" }}>
                    Mis Compras
                  </h2>
                  <Link href="/tienda" style={{ fontSize: 13, fontWeight: 800, color: "#0F62FE", textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    VER TIENDA
                  </Link>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 12 }}>
                  {(() => {
                    // Merged inventory from both sources to ensure freshness
                    const fullInventory = Array.from(new Set([
                      ...(userStats?.inventory || []),
                      ...(dbProfile?.inventory || [])
                    ]));

                    // Define product details for inventory items (should ideally match PRODUCTS in tienda/page.tsx)
                    const INVENTORY_DETAILS: Record<string, { name: string; icon: string; color: string }> = {
                      "1": { name: "Marco Embajador", icon: "💎", color: "#0F62FE" },
                      "2": { name: "Marco VIP", icon: "👑", color: "#d97706" },
                      "3": { name: "Guía Inversión", icon: "📚", color: "#10b981" },
                      "4": { name: "Cash Flow Pro", icon: "🔥", color: "#ef4444" },
                      "5": { name: "Tema Premium", icon: "🎨", color: "#7c3aed" },
                      "6": { name: "Escudo Racha", icon: "🛡️", color: "#0891b2" },
                    };

                    return fullInventory.map(id => {
                      const details = INVENTORY_DETAILS[id] || { name: `Producto #${id}`, icon: "📦", color: "#64748b" };
                      return (
                        <div key={id} className="prof-card-hover" style={{
                          background: "white", padding: "16px", borderRadius: 16, border: "1.5px solid rgba(15,98,254,0.1)",
                          display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 8
                        }}>
                          <div style={{ fontSize: 24 }}>{details.icon}</div>
                          <div style={{ fontSize: 12, fontWeight: 800, color: "#0f172a", lineHeight: 1.2 }}>{details.name}</div>
                          <div style={{ fontSize: 10, fontWeight: 700, color: "#10b981", background: "#f0fdf4", padding: "2px 8px", borderRadius: 10 }}>ADQUIRIDO</div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            ) : null}


            {/* Achievements - Hidden until real ones exist */}
            {ACHIEVEMENTS.length > 0 && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.01em" }}>
                    Logros
                  </h2>
                  <Link href="/puntos" style={{ fontSize: 13, fontWeight: 800, color: "#0F62FE", textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    VER TODOS
                  </Link>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {ACHIEVEMENTS.map(a => {
                    const cur = getAchievementProgress(a)
                    const pct = Math.min((cur / a.maxVal) * 100, 100)
                    const done = cur >= a.maxVal
                    return (
                      <Card key={a.id} style={{ padding: "18px 20px", display: "flex", alignItems: "center", gap: 16 }}>
                        {/* Badge */}
                        <div style={{
                          width: 60, height: 60, borderRadius: 14, flexShrink: 0,
                          background: done ? a.color : "#f1f5f9",
                          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                          gap: 2, position: "relative"
                        }}>
                          <span style={{ fontSize: 22 }}>{a.icon}</span>
                          <span style={{ fontSize: 9, fontWeight: 800, color: done ? "white" : "#94a3b8", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                            {done ? "✓" : "NIV 1"}
                          </span>
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                            <span style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>{a.title}</span>
                            <span style={{ fontSize: 13, fontWeight: 700, color: "#64748b" }}>{cur}/{a.maxVal}</span>
                          </div>
                          <div style={{ width: "100%", height: 10, background: "#f1f5f9", borderRadius: 999, overflow: "hidden", marginBottom: 6 }}>
                            <div style={{
                              width: `${pct}%`, height: "100%",
                              background: done ? a.color : "#0F62FE",
                              borderRadius: 999, transition: "width 1s ease"
                            }} />
                          </div>
                          <div style={{ fontSize: 12, color: "#64748b" }}>{a.desc}</div>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ══ RIGHT COLUMN ══ */}
          <div className="prof-right-col" style={{ width: 300, flexShrink: 0, display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Following / Followers panel */}
            <Card style={{ overflow: "hidden" }}>
              {/* Tabs */}
              <div style={{ display: "flex", borderBottom: "1.5px solid #e2e8f0" }}>
                <button className={`prof-tab-btn ${rightTab === "following" ? "active" : "inactive"}`}
                  onClick={() => { setRightTab("following"); fetchFollowingList() }}>
                  Siguiendo
                </button>
                <button className={`prof-tab-btn ${rightTab === "followers" ? "active" : "inactive"}`}
                  onClick={() => { setRightTab("followers"); fetchFollowersList() }}>
                  Seguidores
                </button>
              </div>

              {/* Content */}
              <div style={{ padding: "24px 20px", minHeight: 280 }}>
                {(rightTab === "following" ? loadingFollowing : loadingFollowers) ? (
                  <ListSkeleton />
                ) : (rightTab === "following" ? following : followers).length === 0 ? (
                  <div style={{ textAlign: "center", animation: "fadeUp 0.5s ease" }}>
                    <div style={{
                      width: "100%", height: 140,
                      borderRadius: 16, marginBottom: 20,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {rightTab === "following" ? <FollowIllustration /> : <CommunityIllustration />}
                    </div>
                    <p style={{ fontSize: 15, color: "#64748b", fontWeight: 600, lineHeight: 1.6, margin: 0 }}>
                      {rightTab === "following"
                        ? "Aún no sigues a nadie. ¡Comienza a conectar con tus compañeros!"
                        : "Todavía no tienes seguidores. ¡Mantente activo y destaca!"}
                    </p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {(rightTab === "following" ? following : followers).map((f: any) => (
                      <div key={f.userId}
                        onClick={() => router.push(`/forum/profile/${f.userId}`)}
                        style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 12, cursor: "pointer", transition: "all 0.15s" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "#f1f5f9")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                      >
                        <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#f1f5f9", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <AvatarDisplay
                            avatar={f.avatar}
                            size={34}
                            frame={f.inventory?.includes("2") ? "vip" : f.inventory?.includes("1") ? "ambassador" : null}
                          />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.nickname}</div>
                          <div style={{ fontSize: 11, color: "#64748b" }}>Nivel {f.level}</div>
                        </div>
                        <ChevronRight size={15} color="#cbd5e1" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {/* Add friends & Actions */}
            <Card className="prof-card-hover" style={{ padding: "20px 16px", background: "linear-gradient(135deg, #f8faff 0%, #fff 100%)" }}>
              <h3 style={{ margin: "0 0 16px", fontSize: 13, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Más Acciones
              </h3>
              <div className="prof-add-row" onClick={() => router.push("/forum")}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(15,98,254,0.06)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Search size={22} color="#0F62FE" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Buscar en el Foro</div>
                </div>
                <ChevronRight size={18} color="#cbd5e1" />
              </div>
              <div className="prof-add-row" onClick={startTour} style={{ marginTop: 8 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(15,98,254,0.06)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Mail size={22} color="#0F62FE" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Repetir tour BIZEN</div>
                </div>
                <ChevronRight size={18} color="#cbd5e1" />
              </div>
            </Card>

          </div>
        </div>
      </div>

      {/* ── AVATAR PICKER MODAL ── */}
      {isPickerOpen && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)",
          backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 9999, padding: 20
        }} onClick={() => setIsPickerOpen(false)}>
          <div style={{ background: "white", border: "1.5px solid #e2e8f0", borderRadius: 28, width: "100%", maxWidth: 440, padding: 32, position: "relative", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}
            onClick={e => e.stopPropagation()}>
            <button onClick={() => setIsPickerOpen(false)} style={{ position: "absolute", top: 20, right: 20, background: "#f1f5f9", border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CloseIcon size={18} />
            </button>
            <h3 style={{ fontSize: 20, fontWeight: 900, color: "#0f172a", margin: "0 0 6px" }}>Elige tu Mascota</h3>
            <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 24px" }}>Selecciona el avatar que más te represente</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(76px, 1fr))", gap: 14 }}>
              {avatarOptions.map(av => {
                const isSelected = (user.user_metadata?.avatar?.id || "robot") === av.id
                return (
                  <div key={av.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                    <button onClick={() => updateAvatar(av)} disabled={savingAvatar} style={{
                      width: 70, height: 70, borderRadius: "50%",
                      border: `2.5px solid ${isSelected ? "#0F62FE" : "#f1f5f9"}`,
                      background: isSelected ? "#eff6ff" : "white",
                      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                      padding: 0, outline: "none", overflow: "hidden", transition: "all 0.2s"
                    }}>
                      <AvatarDisplay avatar={av} size={48} />
                    </button>
                    <span style={{ fontSize: 10, fontWeight: 700, color: isSelected ? "#0F62FE" : "#64748b" }}>{av.label}</span>
                  </div>
                )
              })}
            </div>
            {savingAvatar && <div style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: "#0F62FE", fontWeight: 700 }}>Guardando...</div>}
          </div>
        </div>
      )}
    </>
  )
}
