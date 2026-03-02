"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useOnboarding } from "@/contexts/OnboardingContext"
import { createClientMicrocred } from "@/lib/supabase/client-microcred"
import { AvatarDisplay } from "@/components/AvatarDisplay"
import { MapIcon } from "@/components/CustomIcons"
import StreakWidget from "@/components/StreakWidget"
import Link from "next/link"
import {
  Settings, Camera, X as CloseIcon, Star, Flame, Zap,
  Users, UserPlus, Trophy, TrendingUp, BookOpen, ChevronRight
} from "lucide-react"

interface UserStats {
  xp: number
  level: number
  xpInCurrentLevel: number
  totalXpForNextLevel: number
  xpForNextLevel: number
  currentStreak?: number
  weeklyActiveDays?: string[]
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
  const [profileStats, setProfileStats] = useState<{
    joinDate: string | null
    followersCount: number
    followingCount: number
  } | null>(null)
  const [schools, setSchools] = useState<{ id: string; name: string }[]>([])
  const [formData, setFormData] = useState({
    fullName: "", username: "", bio: "", birthDate: "", schoolId: ""
  })
  const [showFollowers, setShowFollowers] = useState(false)
  const [showFollowing, setShowFollowing] = useState(false)
  const [followers, setFollowers] = useState<any[]>([])
  const [following, setFollowing] = useState<any[]>([])
  const [loadingFollowers, setLoadingFollowers] = useState(false)
  const [loadingFollowing, setLoadingFollowing] = useState(false)

  useEffect(() => { setMounted(true) }, [])

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

  useEffect(() => {
    document.body.style.background = "#FBFAF5"
    return () => { document.body.style.background = "" }
  }, [])

  const fetchFollowersList = async () => {
    if (!user?.id || loadingFollowers) return
    setLoadingFollowers(true)
    try {
      const r = await fetch(`/api/forum/profile/${user.id}/followers`)
      if (r.ok) { const d = await r.json(); setFollowers(d.followers || []) }
    } catch { } finally { setLoadingFollowers(false) }
  }

  const fetchFollowingList = async () => {
    if (!user?.id || loadingFollowing) return
    setLoadingFollowing(true)
    try {
      const r = await fetch(`/api/forum/profile/${user.id}/following`)
      if (r.ok) { const d = await r.json(); setFollowing(d.following || []) }
    } catch { } finally { setLoadingFollowing(false) }
  }

  const avatarOptions = [
    { type: "character", id: "robot", character: "robot", label: "Robot" },
    { type: "character", id: "astronaut", character: "astronaut", label: "Astronauta" },
    { type: "mascot", id: "fox", label: "Zorro" },
    { type: "mascot", id: "owl", label: "Búho" },
    { type: "mascot", id: "dolphin", label: "Delfín" },
    { type: "mascot", id: "turtle", label: "Tortuga" },
    { type: "mascot", id: "beaver", label: "Castor" },
    { type: "mascot", id: "squirrel", label: "Ardilla" },
    { type: "mascot", id: "dog", label: "Perro" },
    { type: "mascot", id: "cat", label: "Gato" },
    { type: "mascot", id: "lion", label: "León" },
    { type: "mascot", id: "koala", label: "Koala" },
    { type: "mascot", id: "penguin", label: "Pingüino" },
    { type: "gradient", id: "grad1", gradient: "linear-gradient(135deg, #0F62FE, #6366f1)", label: "Azure" },
    { type: "pattern", id: "patt1", pattern: "dots", color: "#0F62FE", label: "Puntos" },
    { type: "pattern", id: "patt2", pattern: "waves", color: "#0F62FE", label: "Ondas" },
    { type: "shape", id: "shape1", shape: "star", color: "#0F62FE", label: "Estrella" },
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

  if (loading || !mounted) return <div style={{ minHeight: "100vh", background: "#FBFAF5" }} />
  if (!user) return null

  const displayName = formData.fullName || user.email?.split("@")[0] || "Usuario"
  const nickname = formData.username ? `@${formData.username.replace("@", "")}` : user.email?.split("@")[0] || ""
  const joinDate = profileStats?.joinDate
    ? new Date(profileStats.joinDate).toLocaleDateString("es-ES", { month: "long", year: "numeric" })
    : null
  const streak = dbProfile?.currentStreak || userStats?.currentStreak || 0
  const bizcoins = (dbProfile as any)?.bizcoins || 0
  const xpProgress = userStats ? Math.round((userStats.xpInCurrentLevel / userStats.totalXpForNextLevel) * 100) : 0

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes prof-fadeUp { from { opacity:0; transform:translateY(18px) } to { opacity:1; transform:translateY(0) } }
        @keyframes prof-scaleIn { from { opacity:0; transform:scale(0.96) } to { opacity:1; transform:scale(1) } }

        @media (max-width: 767px) {
          .prof-outer { padding-bottom: calc(80px + env(safe-area-inset-bottom)) !important; }
          .prof-layout { flex-direction: column !important; }
          .prof-right { width: 100% !important; }
        }
        @media (min-width: 768px) and (max-width: 1160px) {
          .prof-outer { width: calc(100% - 220px) !important; margin-left: 220px !important; }
        }
        @media (min-width: 1161px) {
          .prof-outer { width: calc(100% - 280px) !important; margin-left: 280px !important; }
        }

        .prof-stat-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 16px;
          padding: 20px 16px;
          display: flex;
          align-items: center;
          gap: 14px;
          transition: background 0.2s;
        }
        .prof-stat-card:hover { background: rgba(255,255,255,0.08); }

        .prof-section {
          background: white;
          border: 1.5px solid #f1f5f9;
          border-radius: 20px;
          padding: 24px 28px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
        }

        .prof-section-title {
          display: flex; align-items: center; gap: 10px;
          font-size: 15px; font-weight: 800; color: #0f172a;
          margin: 0 0 20px;
        }

        .prof-follow-btn {
          cursor: pointer;
          transition: all 0.2s;
        }
        .prof-follow-btn:hover { opacity: 0.8; transform: translateX(2px); }
        `
      }} />

      <div className="prof-outer" style={{
        minHeight: "100vh",
        background: "#FBFAF5",
        fontFamily: "'Inter', 'Montserrat', sans-serif",
        boxSizing: "border-box"
      }}>

        {/* ── HERO CARD ── */}
        <div style={{
          background: "#0f172a",
          position: "relative",
          overflow: "hidden",
          padding: "40px clamp(20px, 4vw, 48px) 36px",
          animation: "prof-fadeUp 0.4s ease both"
        }}>
          {/* Radial glows */}
          <div aria-hidden style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at 80% 0%, rgba(15,98,254,0.18) 0%, transparent 60%), radial-gradient(ellipse at 5% 100%, rgba(99,102,241,0.12) 0%, transparent 55%)",
            pointerEvents: "none"
          }} />

          <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "flex-start", gap: "clamp(20px, 3vw, 36px)", flexWrap: "wrap" }}>
            {/* Avatar */}
            <div
              onClick={() => setIsPickerOpen(true)}
              style={{
                width: 100, height: 100, borderRadius: 20,
                background: "rgba(255,255,255,0.08)",
                border: "2px solid rgba(255,255,255,0.15)",
                overflow: "hidden", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", position: "relative",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
              }}
            >
              <AvatarDisplay avatar={user.user_metadata?.avatar || { type: "character", id: "robot", character: "robot" }} size={80} />
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                height: "30%", background: "rgba(0,0,0,0.5)",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <Camera size={13} color="white" />
              </div>
            </div>

            {/* Identity */}
            <div style={{ flex: 1, minWidth: 200 }}>
              {/* Level badge */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.3)",
                borderRadius: 999, padding: "3px 10px", marginBottom: 10,
                fontSize: 11, fontWeight: 700, color: "#fbbf24", letterSpacing: "0.07em"
              }}>
                <Star size={11} fill="#fbbf24" strokeWidth={0} />
                NIVEL {userStats?.level || dbProfile?.level || 1}
              </div>

              <h1 style={{ margin: "0 0 4px", fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 900, color: "white", letterSpacing: "-0.02em", lineHeight: 1.15 }}>
                {displayName}
              </h1>

              {nickname && (
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 8 }}>{nickname}</div>
              )}

              {joinDate && (
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 14 }}>
                  Se unió en {joinDate}
                </div>
              )}

              {/* Following / Followers links */}
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  onClick={() => { setShowFollowing(true); fetchFollowingList() }}
                  style={{
                    background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
                    color: "rgba(255,255,255,0.85)", borderRadius: 8, padding: "6px 14px",
                    fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.14)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
                >
                  <strong>{profileStats?.followingCount ?? 0}</strong> Siguiendo
                </button>
                <button
                  onClick={() => { setShowFollowers(true); fetchFollowersList() }}
                  style={{
                    background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
                    color: "rgba(255,255,255,0.85)", borderRadius: 8, padding: "6px 14px",
                    fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.14)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
                >
                  <strong>{profileStats?.followersCount ?? 0}</strong> Seguidores
                </button>
              </div>
            </div>

            {/* Settings link */}
            <Link href="/configuracion" style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 40, height: 40, borderRadius: 12,
              background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.6)", textDecoration: "none", flexShrink: 0,
              transition: "all 0.2s"
            }}
              onMouseEnter={e => (e.currentTarget as any).style.background = "rgba(255,255,255,0.15)"}
              onMouseLeave={e => (e.currentTarget as any).style.background = "rgba(255,255,255,0.08)"}
            >
              <Settings size={18} />
            </Link>
          </div>
        </div>

        {/* ── TWO-COLUMN LAYOUT ── */}
        <div className="prof-layout" style={{
          display: "flex",
          gap: 20,
          padding: "24px clamp(16px, 4vw, 40px)",
          maxWidth: 1100,
          margin: "0 auto",
          boxSizing: "border-box",
          width: "100%",
          alignItems: "flex-start"
        }}>

          {/* ── LEFT COLUMN ── */}
          <div style={{ flex: "1 1 0", minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Statistics */}
            <div className="prof-section">
              <h2 className="prof-section-title">
                <div style={{ width: 4, height: 18, borderRadius: 3, background: "linear-gradient(180deg, #0F62FE, #6366f1)", flexShrink: 0 }} />
                Estadísticas
              </h2>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { icon: <Flame size={20} color="#fb923c" />, value: streak, label: "Racha diaria", bg: "rgba(251,146,60,0.08)" },
                  { icon: <Zap size={20} color="#0F62FE" />, value: userStats?.xp ?? 0, label: "Total XP", bg: "rgba(15,98,254,0.08)" },
                  { icon: <Star size={20} color="#fbbf24" fill="#fbbf24" strokeWidth={0} />, value: bizcoins.toLocaleString(), label: "Bizcoins", bg: "rgba(251,191,36,0.08)", onClick: () => router.push("/puntos") },
                  { icon: <Trophy size={20} color="#10b981" />, value: `Niv. ${userStats?.level ?? dbProfile?.level ?? 1}`, label: "Nivel actual", bg: "rgba(16,185,129,0.08)" },
                ].map(({ icon, value, label, bg, onClick }) => (
                  <div
                    key={label}
                    onClick={onClick}
                    style={{
                      background: bg, borderRadius: 16, padding: "16px 18px",
                      display: "flex", alignItems: "center", gap: 12,
                      cursor: onClick ? "pointer" : "default",
                      border: "1.5px solid rgba(0,0,0,0.04)", transition: "all 0.2s"
                    }}
                    onMouseEnter={e => onClick && (e.currentTarget.style.transform = "translateY(-1px)")}
                    onMouseLeave={e => onClick && (e.currentTarget.style.transform = "")}
                  >
                    <div style={{ flexShrink: 0 }}>{icon}</div>
                    <div>
                      <div style={{ fontSize: 20, fontWeight: 900, color: "#0f172a", lineHeight: 1 }}>{value}</div>
                      <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, marginTop: 3, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* XP Progress */}
            {userStats && !loadingStats && (
              <div className="prof-section" style={{ animation: "prof-fadeUp 0.4s ease 0.1s both" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <h2 className="prof-section-title" style={{ margin: 0 }}>
                    <div style={{ width: 4, height: 18, borderRadius: 3, background: "linear-gradient(180deg, #f59e0b, #d97706)", flexShrink: 0 }} />
                    Nivel & Progreso
                  </h2>
                  <div style={{
                    background: "linear-gradient(135deg, #fef3c7, #fde68a)",
                    border: "1px solid #fcd34d",
                    borderRadius: 12, padding: "6px 14px",
                    fontSize: 13, fontWeight: 900, color: "#92400e"
                  }}>
                    Nivel {userStats.level}
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, color: "#94a3b8", marginBottom: 8 }}>
                  <span>{userStats.xpInCurrentLevel} XP</span>
                  <span style={{ color: "#0F62FE" }}>{xpProgress}%</span>
                  <span>{userStats.totalXpForNextLevel} XP</span>
                </div>
                <div style={{ width: "100%", height: 10, background: "#f1f5f9", borderRadius: 10, overflow: "hidden" }}>
                  <div style={{
                    width: `${xpProgress}%`, height: "100%",
                    background: "linear-gradient(90deg, #60a5fa, #0F62FE)",
                    borderRadius: 10, transition: "width 1.2s cubic-bezier(0.34,1.56,0.64,1)",
                    boxShadow: "0 0 12px rgba(15,98,254,0.4)"
                  }} />
                </div>
                <div style={{ marginTop: 10, fontSize: 12, color: "#94a3b8", textAlign: "center" }}>
                  {userStats.xpForNextLevel} XP para el siguiente nivel
                </div>
              </div>
            )}

            {/* Bio / Financial interests */}
            <div className="prof-section">
              <h2 className="prof-section-title">
                <div style={{ width: 4, height: 18, borderRadius: 3, background: "linear-gradient(180deg, #10b981, #059669)", flexShrink: 0 }} />
                Intereses Financieros
              </h2>
              <p style={{
                margin: 0, fontSize: 14, lineHeight: 1.75,
                color: formData.bio ? "#374151" : "#94a3b8",
                fontStyle: formData.bio ? "normal" : "italic"
              }}>
                {formData.bio || "Aún no has compartido tus intereses. Ve a Configuración → Perfil para actualizarlos."}
              </p>
            </div>

          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="prof-right" style={{ width: 300, flexShrink: 0, display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Streak widget */}
            <StreakWidget
              streak={streak}
              showCalendar
              activeDays={(dbProfile as any)?.weeklyActiveDays || userStats?.weeklyActiveDays || []}
            />

            {/* Información personal */}
            <div className="prof-section">
              <h2 className="prof-section-title">
                <div style={{ width: 4, height: 18, borderRadius: 3, background: "linear-gradient(180deg, #6366f1, #4f46e5)", flexShrink: 0 }} />
                Información Personal
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { label: "Nombre", value: formData.fullName || "Sin nombre" },
                  { label: "Usuario", value: nickname || "—" },
                  { label: "Escuela", value: schools.find(s => s.id === formData.schoolId)?.name || "Sin asignar" },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: 8, borderBottom: "1px solid #f1f5f9", paddingBottom: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", textAlign: "right" }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="prof-section">
              <h2 className="prof-section-title">
                <div style={{ width: 4, height: 18, borderRadius: 3, background: "linear-gradient(180deg, #0F62FE, #3b82f6)", flexShrink: 0 }} />
                Acciones
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  { icon: <Settings size={17} color="#64748b" />, label: "Editar perfil", href: "/configuracion" },
                  { icon: <TrendingUp size={17} color="#64748b" />, label: "Ver mis puntos", href: "/puntos" },
                  { icon: <BookOpen size={17} color="#64748b" />, label: "Mis cursos", href: "/courses" },
                  { icon: <MapIcon size={17} />, label: "Repetir tour", onClick: startTour },
                ].map(({ icon, label, href, onClick }) => {
                  const style: React.CSSProperties = {
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "11px 14px", borderRadius: 12,
                    background: "#f8fafc", border: "1.5px solid #f1f5f9",
                    textDecoration: "none", cursor: "pointer",
                    transition: "all 0.15s", fontSize: 14, fontWeight: 600, color: "#374151"
                  }
                  const inner = (
                    <>
                      <span style={{ flexShrink: 0 }}>{icon}</span>
                      <span style={{ flex: 1 }}>{label}</span>
                      <ChevronRight size={15} color="#cbd5e1" />
                    </>
                  )
                  if (href) return (
                    <Link key={label} href={href} style={style}
                      onMouseEnter={e => (e.currentTarget as any).style.background = "#f1f5f9"}
                      onMouseLeave={e => (e.currentTarget as any).style.background = "#f8fafc"}
                    >{inner}</Link>
                  )
                  return (
                    <div key={label} style={style} onClick={onClick}
                      onMouseEnter={e => (e.currentTarget as any).style.background = "#f1f5f9"}
                      onMouseLeave={e => (e.currentTarget as any).style.background = "#f8fafc"}
                    >{inner}</div>
                  )
                })}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── AVATAR PICKER MODAL ── */}
      {isPickerOpen && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(15,23,42,0.7)",
          backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 9999, padding: 20
        }} onClick={() => setIsPickerOpen(false)}>
          <div style={{
            background: "white", borderRadius: 28, width: "100%", maxWidth: 440,
            padding: 32, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.4)",
            position: "relative", animation: "prof-scaleIn 0.3s ease both"
          }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setIsPickerOpen(false)} style={{
              position: "absolute", top: 20, right: 20, border: "none",
              background: "#f1f5f9", borderRadius: "50%", width: 36, height: 36,
              cursor: "pointer", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <CloseIcon size={18} />
            </button>
            <h3 style={{ fontSize: 20, fontWeight: 900, color: "#0f172a", margin: "0 0 6px" }}>Elige tu Mascota</h3>
            <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 24px" }}>Selecciona el avatar que más te represente</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(76px, 1fr))", gap: 14, marginBottom: 10 }}>
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
                    }}
                      onMouseEnter={e => !isSelected && (e.currentTarget.style.borderColor = "#bfdbfe")}
                      onMouseLeave={e => !isSelected && (e.currentTarget.style.borderColor = "#f1f5f9")}
                    >
                      <AvatarDisplay avatar={av} size={48} />
                    </button>
                    <span style={{ fontSize: 10, fontWeight: 700, color: isSelected ? "#0F62FE" : "#64748b" }}>{av.label}</span>
                  </div>
                )
              })}
            </div>
            {savingAvatar && <div style={{ textAlign: "center", marginTop: 10, fontSize: 13, color: "#0F62FE", fontWeight: 700 }}>Guardando...</div>}
          </div>
        </div>
      )}

      {/* ── FOLLOWERS MODAL ── */}
      {showFollowers && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(6px)", zIndex: 10000,
          display: "flex", alignItems: "center", justifyContent: "center", padding: 20
        }} onClick={() => setShowFollowers(false)}>
          <div style={{
            background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 24, padding: 28,
            maxWidth: 480, width: "100%", maxHeight: "80vh", overflow: "auto",
            boxShadow: "0 24px 64px rgba(0,0,0,0.5)"
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "white" }}>
                Seguidores <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 16 }}>({profileStats?.followersCount || 0})</span>
              </h2>
              <button onClick={() => setShowFollowers(false)} style={{
                background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
                color: "rgba(255,255,255,0.7)", width: 36, height: 36, borderRadius: 10,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
              }}><CloseIcon size={18} /></button>
            </div>
            {loadingFollowers ? (
              <div style={{ textAlign: "center", padding: 40, color: "rgba(255,255,255,0.4)" }}>Cargando...</div>
            ) : followers.length === 0 ? (
              <div style={{ textAlign: "center", padding: 40, color: "rgba(255,255,255,0.35)" }}>No hay seguidores aún</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {followers.map((f: any) => (
                  <div key={f.userId} onClick={() => { setShowFollowers(false); router.push(`/forum/profile/${f.userId}`) }}
                    style={{ padding: "14px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, display: "flex", alignItems: "center", gap: 14, cursor: "pointer", transition: "all 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.transform = "translateX(4px)" }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.transform = "" }}
                  >
                    <div style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg, #0F62FE, #6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 800, color: "white", flexShrink: 0 }}>
                      {f.nickname ? f.nickname[0].toUpperCase() : "U"}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "white", marginBottom: 2 }}>{f.nickname}</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Nivel {f.level} • {f.reputation} pts</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── FOLLOWING MODAL ── */}
      {showFollowing && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(6px)", zIndex: 10000,
          display: "flex", alignItems: "center", justifyContent: "center", padding: 20
        }} onClick={() => setShowFollowing(false)}>
          <div style={{
            background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 24, padding: 28,
            maxWidth: 480, width: "100%", maxHeight: "80vh", overflow: "auto",
            boxShadow: "0 24px 64px rgba(0,0,0,0.5)"
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "white" }}>
                Siguiendo <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 16 }}>({profileStats?.followingCount || 0})</span>
              </h2>
              <button onClick={() => setShowFollowing(false)} style={{
                background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
                color: "rgba(255,255,255,0.7)", width: 36, height: 36, borderRadius: 10,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
              }}><CloseIcon size={18} /></button>
            </div>
            {loadingFollowing ? (
              <div style={{ textAlign: "center", padding: 40, color: "rgba(255,255,255,0.4)" }}>Cargando...</div>
            ) : following.length === 0 ? (
              <div style={{ textAlign: "center", padding: 40, color: "rgba(255,255,255,0.35)" }}>No sigue a nadie aún</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {following.map((f: any) => (
                  <div key={f.userId} onClick={() => { setShowFollowing(false); router.push(`/forum/profile/${f.userId}`) }}
                    style={{ padding: "14px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, display: "flex", alignItems: "center", gap: 14, cursor: "pointer", transition: "all 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.transform = "translateX(4px)" }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.transform = "" }}
                  >
                    <div style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg, #0F62FE, #6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 800, color: "white", flexShrink: 0 }}>
                      {f.nickname ? f.nickname[0].toUpperCase() : "U"}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "white", marginBottom: 2 }}>{f.nickname}</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Nivel {f.level} • {f.reputation} pts</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
