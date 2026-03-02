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
  Search, Mail, ChevronRight, X as CloseIcon, Camera, Star
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

const ACHIEVEMENTS = [
  {
    id: "wildfire", title: "Wildfire", desc: "Alcanza una racha de 3 días",
    icon: "🔥", color: "#ef4444", maxVal: 3, unit: "streak"
  },
  {
    id: "sage", title: "Sage", desc: "Gana 100 XP",
    icon: "🧙", color: "#22c55e", maxVal: 100, unit: "xp"
  },
  {
    id: "streak7", title: "On Fire", desc: "Alcanza una racha de 7 días",
    icon: "🌟", color: "#f59e0b", maxVal: 7, unit: "streak"
  },
  {
    id: "xp500", title: "Scholar", desc: "Gana 500 XP",
    icon: "📚", color: "#6366f1", maxVal: 500, unit: "xp"
  },
]

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

  if (loading || !mounted) return <div style={{ minHeight: "100vh", background: "#FBFAF5" }} />
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

  const getAchievementProgress = (a: typeof ACHIEVEMENTS[0]) => {
    if (a.unit === "streak") return Math.min(streak, a.maxVal)
    if (a.unit === "xp") return Math.min(totalXp, a.maxVal)
    return 0
  }

  const statCards = [
    { icon: <Flame size={22} color="#fb923c" />, value: streak, label: "Racha diaria" },
    { icon: <Zap size={22} color="#0F62FE" />, value: totalXp, label: "Total XP" },
    { icon: <Shield size={22} color="#0F62FE" />, value: level === 1 ? "Ninguna" : `Nivel ${level}`, label: "Liga actual" },
    { icon: <Award size={22} color="#0F62FE" />, value: ACHIEVEMENTS.filter(a => getAchievementProgress(a) >= a.maxVal).length, label: "Top completados" },
  ]

  const Card = ({ style, children }: any) => (
    <div style={{ background: "white", border: "1.5px solid #e2e8f0", borderRadius: 16, boxSizing: "border-box", ...style }}>
      {children}
    </div>
  )

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
        @media (max-width: 767px) {
          .prof-outer { padding-bottom: calc(80px + env(safe-area-inset-bottom)) !important; }
          .prof-two-col { flex-direction: column !important; }
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
          transition: color 0.2s; background: transparent;
        }
        .prof-tab-btn.active { color: #0F62FE; border-bottom: 3px solid #0F62FE; }
        .prof-tab-btn.inactive { color: #94a3b8; border-bottom: 3px solid transparent; }
        .prof-add-row {
          display: flex; align-items: center; gap: 14px;
          padding: 14px 20px; cursor: pointer; transition: background 0.15s; border-radius: 12px;
        }
        .prof-add-row:hover { background: #f8fafc; }
        `
      }} />

      <div className="prof-outer" style={{
        minHeight: "100vh", background: "#FBFAF5",
        fontFamily: "'Inter', 'Montserrat', sans-serif",
        boxSizing: "border-box", color: "#0f172a"
      }}>
        <div className="prof-two-col" style={{
          display: "flex", gap: 20,
          padding: "clamp(20px, 4vw, 36px) clamp(16px, 4vw, 40px)",
          maxWidth: 1080, margin: "0 auto",
          boxSizing: "border-box", width: "100%",
          alignItems: "flex-start"
        }}>

          {/* ══ LEFT COLUMN ══ */}
          <div style={{ flex: "1 1 0", minWidth: 0, display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Avatar card - CIRCULAR */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
              <div
                onClick={() => setIsPickerOpen(true)}
                style={{
                  width: 180, height: 180,
                  background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
                  borderRadius: "50%", overflow: "hidden",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  position: "relative", cursor: "pointer",
                  border: "4px solid #fff",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
                }}
              >
                <AvatarDisplay
                  avatar={user.user_metadata?.avatar || { type: "character", id: "robot", character: "robot" }}
                  size={140}
                />
                {/* Camera icon button */}
                <div style={{
                  position: "absolute", bottom: 10, right: 10,
                  width: 38, height: 38, borderRadius: "50%",
                  background: "#0F62FE",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(15,98,254,0.3)",
                  border: "2px solid white"
                }}>
                  <Camera size={18} color="white" />
                </div>
              </div>
            </div>

            {/* Identity */}
            <div style={{ textAlign: "center" }}>
              <h1 style={{ margin: "0 0 4px", fontSize: 28, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.02em" }}>
                {displayName}
              </h1>
              <p style={{ margin: "0 0 4px", fontSize: 14, color: "#64748b", fontWeight: 500 }}>
                {nickname ? `@${nickname}` : user.email}
              </p>
              {joinDate && (
                <p style={{ margin: "0 0 16px", fontSize: 13, color: "#94a3b8", fontWeight: 400 }}>
                  Se unió en {joinDate}
                </p>
              )}

              {/* Following / Followers */}
              <div style={{ display: "inline-flex", gap: 24, marginBottom: 20, justifyContent: "center" }}>
                <button
                  onClick={() => { setRightTab("following"); fetchFollowingList() }}
                  style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: 0 }}
                >
                  <span style={{ fontSize: 15, fontWeight: 700, color: "#0F62FE" }}>
                    {profileStats?.followingCount ?? 0} Siguiendo
                  </span>
                </button>
                <button
                  onClick={() => { setRightTab("followers"); fetchFollowersList() }}
                  style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: 0 }}
                >
                  <span style={{ fontSize: 15, fontWeight: 700, color: "#0F62FE" }}>
                    {profileStats?.followersCount ?? 0} Seguidores
                  </span>
                </button>
              </div>

              <div style={{ height: 1, background: "#e2e8f0", marginBottom: 24 }} />
            </div>

            {/* Statistics */}
            <div>
              <h2 style={{ margin: "0 0 14px", fontSize: 18, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.01em" }}>
                Estadísticas
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {statCards.map(({ icon, value, label }) => (
                  <Card key={label} style={{ padding: "18px 20px", display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ flexShrink: 0 }}>{icon}</div>
                    <div>
                      <div style={{ fontSize: 20, fontWeight: 900, color: "#0f172a", lineHeight: 1 }}>{value}</div>
                      <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, marginTop: 4, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Achievements */}
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
              <div style={{ padding: "24px 20px" }}>
                {(rightTab === "following" ? (loadingFollowing ? [] : following) : (loadingFollowers ? [] : followers)).length === 0 ? (
                  <div style={{ textAlign: "center" }}>
                    <div style={{
                      width: "100%", height: 120, background: "#f8fafc",
                      borderRadius: 14, marginBottom: 16,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 48, border: "1.5px dashed #e2e8f0"
                    }}>
                      {rightTab === "following" ? "👥" : "🧑‍🤝‍🧑"}
                    </div>
                    <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, margin: 0 }}>
                      Aprender es más divertido y efectivo cuando te conectas con otros.
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
                        <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#0F62FE,#6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: "white", flexShrink: 0 }}>
                          {f.nickname ? f.nickname[0].toUpperCase() : "U"}
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

            {/* Add friends */}
            <Card style={{ padding: "20px 16px" }}>
              <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 800, color: "#0f172a" }}>
                Agrega amigos
              </h3>
              <div className="prof-add-row" onClick={() => router.push("/forum")}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Search size={20} color="#64748b" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>Buscar en el Foro</div>
                </div>
                <ChevronRight size={16} color="#cbd5e1" />
              </div>
              <div className="prof-add-row" onClick={startTour}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Mail size={20} color="#64748b" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>Repetir tour de BIZEN</div>
                </div>
                <ChevronRight size={16} color="#cbd5e1" />
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
