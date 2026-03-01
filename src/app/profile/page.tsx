"use client"

import React, { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useOnboarding } from "@/contexts/OnboardingContext"
import Image from "next/image"
import Button from "../../components/ui/button"
import { createClientMicrocred } from "@/lib/supabase/client-microcred"
import { AvatarDisplay } from "@/components/AvatarDisplay"
import { WarningIcon, MapIcon } from "@/components/CustomIcons"
import StreakWidget from "@/components/StreakWidget"
import { Settings as SettingsIcon, Camera, X as CloseIcon } from "lucide-react"

interface UserStats {
  xp: number
  level: number
  xpInCurrentLevel: number
  totalXpForNextLevel: number
  xpForNextLevel: number
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
  const [loadingProfileStats, setLoadingProfileStats] = useState(true)
  const [schools, setSchools] = useState<{ id: string, name: string }[]>([])
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    bio: "",
    birthDate: "",
    schoolId: ""
  })

  const isAdminOrTeacher = dbProfile?.role === "school_admin" || dbProfile?.role === "teacher"
  const isStudentOrGuest = !isAdminOrTeacher

  useEffect(() => {
    if (loading) return
    if (!user) {
      window.open("/login", "_blank")
      return
    }

    // Initialize form with user data
    setFormData({
      fullName: user.user_metadata?.full_name || "",
      username: user.user_metadata?.username || "",
      bio: user.user_metadata?.bio || "",
      birthDate: user.user_metadata?.birth_date || "",
      schoolId: user.user_metadata?.school_id || ""
    })

    // Fetch real user stats
    const fetchStats = async () => {
      try {
        setLoadingStats(true)
        const response = await fetch('/api/user/stats')
        if (response.ok) {
          const data = await response.json()
          setUserStats(data)
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoadingStats(false)
      }
    }

    // Fetch profile stats (join date, followers, following)
    const fetchProfileStats = async () => {
      try {
        setLoadingProfileStats(true)
        const response = await fetch('/api/profile/stats')
        if (response.ok) {
          const data = await response.json()
          setProfileStats(data)
        }
      } catch (error) {
        console.error('Error fetching profile stats:', error)
      } finally {
        setLoadingProfileStats(false)
      }
    }

    // Fetch available schools
    const fetchSchools = async () => {
      try {
        const response = await fetch('/api/schools')
        if (response.ok) {
          const data = await response.json()
          setSchools(data)
        }
      } catch (error) {
        console.error('Error fetching schools:', error)
      }
    }

    fetchStats()
    fetchProfileStats()
    fetchSchools()
  }, [user, loading, router])

  // Mounted guard: prevents SSR/client hydration mismatch
  useEffect(() => { setMounted(true) }, [])

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "13px 16px", borderRadius: "12px", border: "1.5px solid #e2e8f0",
    background: "#f8fafc", fontSize: "15px", fontFamily: "'Inter', sans-serif", color: "#475569"
  }

  const avatarOptions = [
    // characters
    { type: "character", id: "robot", character: "robot", label: "Robot" },
    { type: "character", id: "astronaut", character: "astronaut", label: "Astronauta" },

    // mascots (the blue ones)
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

    // design themed
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
      const { error } = await supabase.auth.updateUser({
        data: { avatar: newAvatar }
      })
      if (error) throw error
      setIsPickerOpen(false)
      router.refresh()
    } catch (err) {
      console.error("Error updating avatar:", err)
      alert("No se pudo actualizar el avatar")
    } finally {
      setSavingAvatar(false)
    }
  }

  // Set body background for this page
  useEffect(() => {
    const htmlEl = document.documentElement
    const bodyEl = document.body

    htmlEl.style.background = "#ffffff"
    htmlEl.style.backgroundAttachment = "scroll"
    bodyEl.style.background = "#ffffff"
    bodyEl.style.backgroundAttachment = "scroll"

    return () => {
      htmlEl.style.background = ""
      htmlEl.style.backgroundAttachment = ""
      bodyEl.style.background = "#fff"
      bodyEl.style.backgroundAttachment = "scroll"
    }
  }, [])


  if (loading || !mounted) {
    return <div style={{ minHeight: "100vh", background: "#FBFAF5" }} />
  }

  if (!user) return null

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes prof-fadeUp { from { opacity:0; transform:translateY(18px) } to { opacity:1; transform:translateY(0) } }
        @keyframes prof-float  { 0%,100% { transform:translateY(0) } 50% { transform:translateY(-5px) } }
        .prof-input { width:100%; padding:13px 16px; border-radius:12px; border:1.5px solid #e2e8f0; background:#f8fafc; font-size:15px; font-family:'Inter',sans-serif; color:#475569; outline:none; transition:all 0.2s; box-sizing:border-box; cursor:default; }
        @media (max-width: 767px) {
          .profile-main-content { width:100% !important; max-width:100% !important; padding-bottom: calc(80px + env(safe-area-inset-bottom)) !important; }
        }
        @media (min-width: 768px) and (max-width: 1160px) {
          .profile-main-content { width:calc(100% - 220px) !important; max-width:calc(100% - 220px) !important; margin-left:220px !important; }
        }
        @media (min-width: 1161px) {
          .profile-main-content { width:calc(100% - 280px) !important; max-width:calc(100% - 280px) !important; margin-left:280px !important; }
        }
      ` }} />
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "#FBFAF5",
        overflowY: "auto",
        overflowX: "hidden"
      }}>
        {/* Subtle background orbs */}
        <div style={{ position: "fixed", top: "10%", right: "5%", width: 500, height: 500, background: "radial-gradient(circle, rgba(15,98,254,0.06) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ position: "fixed", bottom: "10%", left: "5%", width: 400, height: 400, background: "radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
        {/* Main Content */}
        <main className="profile-main-content" style={{
          minHeight: "100vh",
          padding: "0 0 40px",
          fontFamily: "'Inter', Montserrat, sans-serif",
          width: "100%",
          maxWidth: "100%",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          overflowX: "hidden",
          position: "relative",
          zIndex: 1
        }}
        >
          <div style={{ flex: "1 1 auto" }}>
            {/* ── HERO BANNER ── */}
            <div style={{
              background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #1d4ed8 100%)",
              padding: "clamp(28px,4vw,44px) clamp(24px,4vw,48px) clamp(56px,7vw,72px)",
              position: "relative",
              marginBottom: "clamp(36px,5vw,52px)"
            }}>
              {/* Hero orbs */}
              <div style={{ position: "absolute", top: "-20%", right: "-5%", width: 350, height: 350, background: "radial-gradient(circle,rgba(96,165,250,0.2) 0%,transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
              <div style={{ position: "absolute", bottom: "-30%", left: "3%", width: 280, height: 280, background: "radial-gradient(circle,rgba(139,92,246,0.15) 0%,transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,0.1)", borderRadius: 999, padding: "5px 14px", marginBottom: 14 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#93c5fd", textTransform: "uppercase", letterSpacing: "0.05em" }}>Mi Perfil BIZEN</span>
                </div>
                <h1 style={{ fontSize: "clamp(26px,4vw,38px)", fontWeight: 900, color: "#fff", margin: "0 0 8px", letterSpacing: "-0.02em" }}>
                  {user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario'}
                </h1>
                <p style={{ fontSize: 14, color: "#93c5fd", margin: 0 }}>Administra tu información personal y progreso</p>
              </div>
              <div style={{ position: "absolute", bottom: "-48px", left: "clamp(24px,4vw,48px)", zIndex: 10 }}>
                <div
                  onClick={() => setIsPickerOpen(true)}
                  style={{
                    width: 96, height: 96, borderRadius: "50%",
                    background: "linear-gradient(135deg,#0F62FE,#6366f1)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 8px 32px rgba(15,98,254,0.4), 0 0 0 4px #fff",
                    position: "relative", cursor: "pointer", transition: "transform 0.2s",
                    overflow: "hidden"
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                >
                  <AvatarDisplay avatar={user.user_metadata?.avatar || { type: "character", id: "robot", character: "robot" }} size={52} />
                  <div style={{
                    position: "absolute", bottom: 0, left: 0, width: "100%", height: "30%",
                    background: "rgba(15,98,254,0.6)", display: "flex", alignItems: "center", justifyContent: "center",
                    backdropFilter: "blur(4px)"
                  }}>
                    <Camera size={14} color="white" />
                  </div>
                </div>
              </div>
            </div>

            {/* ── CONTENT AREA ── */}
            <div style={{ padding: "0 clamp(16px,4vw,48px)", display: "flex", flexDirection: "column", gap: 24 }}>

              {/* Stats bar — premium pill row */}
              <div style={{ paddingLeft: "clamp(110px,14vw,120px)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                {/* Left: username + join date */}
                <div>
                  {(user.user_metadata?.username || formData.username) && (
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: "#64748b" }}>@{user.user_metadata?.username || formData.username}</p>
                  )}
                  {profileStats?.joinDate && (
                    <p style={{ margin: "4px 0 0", fontSize: 12, color: "#94a3b8", fontWeight: 400 }}>Se unió en {new Date(profileStats.joinDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' })}</p>
                  )}
                </div>

                {/* Right: stat pills */}
                <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                  <StreakWidget streak={dbProfile?.currentStreak || 0} />

                  {profileStats && (
                    <>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 18, fontWeight: 600, color: "#0f172a" }}>{profileStats.followersCount}</div>
                        <div style={{ fontSize: 11, fontWeight: 500, color: "#64748b" }}>Seguidores</div>
                      </div>
                      <div style={{ width: 1, height: 24, background: "#e2e8f0" }} />
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 18, fontWeight: 600, color: "#0f172a" }}>{profileStats.followingCount}</div>
                        <div style={{ fontSize: 11, fontWeight: 500, color: "#64748b" }}>Siguiendo</div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Profile Card – Premium Info Layout */}
              <div style={{
                width: "100%",
                background: "white",
                borderRadius: 24,
                padding: "clamp(24px, 4vw, 36px)",
                boxShadow: "0 4px 20px rgba(15,98,254,0.06)",
                border: "1px solid #e8f0fe",
                boxSizing: "border-box"
              }}>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", margin: "0 0 24px", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 4, height: 18, background: "linear-gradient(180deg,#0F62FE,#6366f1)", borderRadius: 2, display: "inline-block" }} />
                  Información Personal
                </h2>

                {/* Stat Pills Row */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 20 }}>

                  {/* Full Name */}
                  <div style={{ background: "linear-gradient(135deg,#eff6ff,#dbeafe)", borderRadius: 18, padding: "16px 20px", border: "1.5px solid #bfdbfe", display: "flex", flexDirection: "column", gap: 4 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#3b82f6", textTransform: "uppercase", letterSpacing: "0.1em" }}>👤 Nombre</div>
                    <div style={{ fontSize: 16, fontWeight: 500, color: "#0f172a", lineHeight: 1.2 }}>{formData.fullName || "Sin nombre"}</div>
                  </div>

                  {/* Username */}
                  <div style={{ background: "linear-gradient(135deg,#f0f7ff,#e0eeff)", borderRadius: 18, padding: "16px 20px", border: "1.5px solid #bdd7ff", display: "flex", flexDirection: "column", gap: 4 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#3b82f6", textTransform: "uppercase", letterSpacing: "0.1em" }}>✦ Usuario</div>
                    <div style={{ fontSize: 16, fontWeight: 500, color: "#0f172a", lineHeight: 1.2 }}>
                      {formData.username ? `@${formData.username.replace('@', '')}` : "Sin usuario"}
                    </div>
                  </div>

                  {/* Birth Date */}
                  {formData.birthDate && (() => {
                    const bd = new Date(formData.birthDate)
                    const today = new Date()
                    let age = today.getFullYear() - bd.getFullYear()
                    const m = today.getMonth() - bd.getMonth()
                    if (m < 0 || (m === 0 && today.getDate() < bd.getDate())) age--
                    return (
                      <div style={{ background: "linear-gradient(135deg,#eff6ff,#dbeafe)", borderRadius: 18, padding: "16px 20px", border: "1.5px solid #bfdbfe", display: "flex", flexDirection: "column", gap: 4 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#3b82f6", textTransform: "uppercase", letterSpacing: "0.1em" }}>🎂 Edad</div>
                        <div style={{ fontSize: 22, fontWeight: 600, color: "#0f172a", lineHeight: 1 }}>{age} <span style={{ fontSize: 13, fontWeight: 500, color: "#6b7280" }}>años</span></div>
                        <div style={{ fontSize: 12, color: "#3b82f6", fontWeight: 500 }}>
                          {bd.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                      </div>
                    )
                  })()}

                  {/* School */}
                  <div style={{ background: "linear-gradient(135deg,#f0f7ff,#e0eeff)", borderRadius: 18, padding: "16px 20px", border: "1.5px solid #bdd7ff", display: "flex", flexDirection: "column", gap: 4 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#3b82f6", textTransform: "uppercase", letterSpacing: "0.1em" }}>🏫 Escuela</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", lineHeight: 1.3 }}>
                      {schools.find(s => s.id === formData.schoolId)?.name || "Sin escuela asignada"}
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div style={{ background: "linear-gradient(135deg,#f8fafc,#f1f5f9)", borderRadius: 18, padding: "20px 24px", border: "1.5px solid #e2e8f0" }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>💡 Intereses Financieros</div>
                  <div style={{ fontSize: 15, fontWeight: 500, color: formData.bio ? "#1e293b" : "#94a3b8", lineHeight: 1.7, fontStyle: formData.bio ? "normal" : "italic" }}>
                    {formData.bio || "Aún no has compartido tus intereses financieros. Ve a Configuración → Perfil para actualizarlos."}
                  </div>
                </div>
              </div>

              {/* Level & Progress Section */}
              {userStats && !loadingStats && isStudentOrGuest && (
                <div style={{ background: "white", borderRadius: 24, padding: "clamp(22px,4vw,32px)", border: "1px solid #e8f0fe", boxShadow: "0 4px 20px rgba(15,98,254,0.06)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#0f172a", display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ width: 4, height: 18, background: "linear-gradient(180deg,#f59e0b,#d97706)", borderRadius: 2, display: "inline-block" }} />
                        Nivel & Progreso
                      </h3>
                      <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}>{userStats.xpForNextLevel} XP para el siguiente nivel</p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "linear-gradient(135deg,#fef3c7,#fde68a)", border: "1px solid #fcd34d", borderRadius: 18, padding: "10px 20px", boxShadow: "0 4px 14px rgba(245,158,11,0.2)" }}>
                      <span style={{ fontSize: 26, fontWeight: 900, color: "#92400e", lineHeight: 1 }}>{userStats.level}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#b45309", textTransform: "uppercase", letterSpacing: "0.05em" }}>Nivel</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 700, color: "#64748b", marginBottom: 8 }}>
                    <span>{userStats.xpInCurrentLevel} XP</span>
                    <span style={{ color: "#0F62FE" }}>{Math.round((userStats.xpInCurrentLevel / userStats.totalXpForNextLevel) * 100)}%</span>
                    <span>{userStats.totalXpForNextLevel} XP</span>
                  </div>
                  <div style={{ width: "100%", height: 10, background: "#f1f5f9", borderRadius: 10, overflow: "hidden" }}>
                    <div style={{ width: `${(userStats.xpInCurrentLevel / userStats.totalXpForNextLevel) * 100}%`, height: "100%", background: "linear-gradient(90deg,#60a5fa,#0F62FE)", borderRadius: 10, transition: "width 1.2s cubic-bezier(0.34,1.56,0.64,1)", boxShadow: "0 0 12px rgba(15,98,254,0.4)" }} />
                  </div>
                  {/* XP Source pills */}
                  <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
                    {[{ label: "Total XP", val: userStats.xp, color: "#0F62FE" }, { label: "Nivel", val: userStats.level, color: "#f59e0b" }].map(item => (
                      <div key={item.label} style={{ background: `${item.color}10`, border: `1px solid ${item.color}25`, borderRadius: 12, padding: "10px 18px", display: "flex", flexDirection: "column" }}>
                        <span style={{ fontSize: 20, fontWeight: 900, color: item.color, lineHeight: 1 }}>{item.val}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em" }}>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {loadingStats && (
                <div style={{
                  width: "100%",
                  margin: "32px 0 0",
                  background: "rgba(255, 255, 255, 0.5)",
                  backdropFilter: "blur(10px)",
                  borderRadius: 20,
                  padding: 28,
                  border: "2px solid rgba(147, 197, 253, 0.4)",
                  textAlign: "center"
                }}>
                  <p style={{ color: "#6B7280", fontSize: 14 }}>Cargando estadísticas...</p>
                </div>
              )}
              {isStudentOrGuest && (
                <>
                  {/* Replay Onboarding Tour */}
                  <div style={{ background: "white", borderRadius: 24, padding: "clamp(20px,3vw,28px) clamp(22px,4vw,32px)", border: "1px solid #e8f0fe", boxShadow: "0 4px 20px rgba(15,98,254,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg,#eff6ff,#dbeafe)", border: "1px solid #bfdbfe", display: "flex", alignItems: "center", justifyContent: "center", color: "#0F62FE", flexShrink: 0 }}>
                        <MapIcon size={24} />
                      </div>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", marginBottom: 3 }}>Recorrido por la aplicación</div>
                        <div style={{ fontSize: 13, color: "#64748b" }}>Repasa qué hace cada sección de BIZEN</div>
                      </div>
                    </div>
                    <button onClick={startTour}
                      style={{ padding: "11px 22px", background: "linear-gradient(135deg,#0F62FE,#3B82F6)", color: "white", border: "none", borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "'Inter',sans-serif", boxShadow: "0 6px 20px rgba(15,98,254,0.35)", whiteSpace: "nowrap", transition: "all 0.2s" }}
                      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 28px rgba(15,98,254,0.45)" }}
                      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 6px 20px rgba(15,98,254,0.35)" }}
                    >Repetir tour →</button>
                  </div>
                </>
              )}

            </div>
          </div>
        </main >

        {/* Mascot Picker Modal */}
        {isPickerOpen && (
          <div style={{
            position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
            background: "rgba(15,23,42,0.6)", backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 9999, padding: 20
          }} onClick={() => setIsPickerOpen(false)}>
            <div style={{
              background: "white", borderRadius: 28, width: "100%", maxWidth: 440,
              padding: 32, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
              position: "relative", animation: "modalIn 0.3s ease-out"
            }} onClick={e => e.stopPropagation()}>
              <button onClick={() => setIsPickerOpen(false)} style={{
                position: "absolute", top: 20, right: 20, border: "none",
                background: "#f1f5f9", borderRadius: "50%", padding: 8, cursor: "pointer",
                color: "#64748b"
              }}>
                <CloseIcon size={20} />
              </button>

              <h3 style={{ fontSize: 20, fontWeight: 900, color: "#0f172a", margin: "0 0 8px" }}>Elige tu Mascota</h3>
              <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 24px" }}>Selecciona el avatar que más te represente en BIZEN</p>

              <div style={{
                display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(76px, 1fr))",
                gap: 16, marginBottom: 10
              }}>
                {avatarOptions.map(av => {
                  const isSelected = (user.user_metadata?.avatar?.id || "robot") === av.id
                  return (
                    <div key={av.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                      <button onClick={() => updateAvatar(av)} disabled={savingAvatar} style={{
                        width: 70, height: 70, borderRadius: "50%", border: `2.5px solid ${isSelected ? "#0F62FE" : "#f1f5f9"}`,
                        background: isSelected ? "#eff6ff" : "white", cursor: "pointer", transition: "all 0.2s",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        padding: 0, outline: "none", overflow: "hidden"
                      }} onMouseEnter={e => !isSelected && (e.currentTarget.style.borderColor = "#bfdbfe")}
                        onMouseLeave={e => !isSelected && (e.currentTarget.style.borderColor = "#f1f5f9")}>
                        <AvatarDisplay avatar={av} size={48} />
                      </button>
                      <span style={{ fontSize: 10, fontWeight: 700, color: isSelected ? "#0F62FE" : "#64748b" }}>{av.label}</span>
                    </div>
                  )
                })}
              </div>
              {savingAvatar && <div style={{ textAlign: "center", marginTop: 10, fontSize: 13, color: "#0F62FE", fontWeight: 700 }}>Guardando...</div>}
            </div>

            <style jsx>{`
              @keyframes modalIn {
                from { opacity: 0; transform: scale(0.95) translateY(10px); }
                to { opacity: 1; transform: scale(1) translateY(0); }
              }
            `}</style>
          </div>
        )}
      </div >
    </>
  )
}
