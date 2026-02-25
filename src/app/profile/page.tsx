"use client"

import React, { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useOnboarding } from "@/contexts/OnboardingContext"
import Image from "next/image"
import Button from "../../components/ui/button"
import { createClientMicrocred } from "@/lib/supabase/client-microcred"
import { AvatarDisplay } from "@/components/AvatarDisplay"

interface UserStats {
  xp: number
  level: number
  xpInCurrentLevel: number
  totalXpForNextLevel: number
  xpForNextLevel: number
}

export default function ProfilePage() {
  const { user, loading, refreshUser } = useAuth()
  const { startTour } = useOnboarding()
  const router = useRouter()
  const supabase = createClientMicrocred()
  const [mounted, setMounted] = React.useState(false)
  const [showAvatarPicker, setShowAvatarPicker] = useState(false)
  const [selectedAvatar, setSelectedAvatar] = useState<any>({ type: "emoji", value: "👤" })
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
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
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Custom avatar options with emojis, custom designs, and cartoon characters
  const avatarOptions = [
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
  ]

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

    // Initialize avatar - try to find saved avatar or use default
    const savedAvatar = user.user_metadata?.avatar
    if (savedAvatar && typeof savedAvatar === 'object') {
      setSelectedAvatar(savedAvatar)
    } else {
      setSelectedAvatar({ type: "mascot", id: "fox", label: "Zorro" })
    }

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

  // Auto-save function with debouncing
  const autoSave = async () => {
    if (!user) return

    setSaving(true)
    setSaveError(null)

    try {
      // Update user metadata in Supabase Auth
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: formData.fullName,
          username: formData.username,
          bio: formData.bio,
          avatar: selectedAvatar,
          birth_date: formData.birthDate,
          school_id: formData.schoolId
        }
      })

      if (error) {
        throw error
      }

      // Also update the Prisma profile
      await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          avatar: selectedAvatar,
          birthDate: formData.birthDate || null,
          schoolId: formData.schoolId
        })
      })

      // Refresh the user session to get updated metadata
      await supabase.auth.refreshSession()

      // Force refresh the AuthContext
      await refreshUser()

      // Success!
      setLastSaved(new Date())
      setShowAvatarPicker(false)
      console.log("✅ Profile auto-saved successfully!")

    } catch (error: any) {
      console.error("Error saving profile:", error)
      setSaveError(error.message || "Error al guardar")
      // Clear error after 3 seconds
      setTimeout(() => setSaveError(null), 3000)
    } finally {
      setSaving(false)
    }
  }

  // Trigger auto-save when form data or avatar changes (debounced)
  useEffect(() => {
    // Don't auto-save on initial load or if no user
    if (!user || !formData.fullName) return

    // Check if data actually changed from saved values
    const hasChanges =
      formData.fullName !== (user.user_metadata?.full_name || "") ||
      formData.username !== (user.user_metadata?.username || "") ||
      formData.bio !== (user.user_metadata?.bio || "") ||
      formData.birthDate !== (user.user_metadata?.birth_date || "") ||
      formData.schoolId !== (user.user_metadata?.school_id || "") ||
      JSON.stringify(selectedAvatar) !== JSON.stringify(user.user_metadata?.avatar || { type: "emoji", value: "👤" })

    // Only save if there are actual changes
    if (!hasChanges) return

    // Clear previous timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    // Set new timeout for auto-save (3 seconds delay to avoid rate limiting)
    saveTimeoutRef.current = setTimeout(() => {
      autoSave()
    }, 3000)

    // Cleanup
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, selectedAvatar])

  if (loading || !mounted) {
    return <div style={{ minHeight: "100vh", background: "#f8faff" }} />
  }

  if (!user) return null

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes prof-fadeUp { from { opacity:0; transform:translateY(18px) } to { opacity:1; transform:translateY(0) } }
        @keyframes prof-float  { 0%,100% { transform:translateY(0) } 50% { transform:translateY(-5px) } }
        .prof-input { width:100%; padding:13px 16px; border-radius:12px; border:1.5px solid #e2e8f0; background:#fff; font-size:15px; font-family:'Inter',sans-serif; color:#1f2937; outline:none; transition:all 0.2s; box-sizing:border-box; }
        .prof-input:focus { border-color:#0F62FE; box-shadow:0 0 0 3px rgba(15,98,254,0.1); }
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
        background: "#f8faff",
        overflowY: "auto",
        overflowX: "hidden"
      }}>
        {/* Subtle background orbs */}
        <div style={{ position: "fixed", top: "10%", right: "5%", width: 500, height: 500, background: "radial-gradient(circle, rgba(15,98,254,0.06) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ position: "fixed", bottom: "10%", left: "5%", width: 400, height: 400, background: "radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
        {/* Main Content */}
        <main className="profile-main-content" data-bizen-tour="profile" style={{
          minHeight: "100vh",
          padding: "0 0 40px",
          fontFamily: "'Inter', Montserrat, sans-serif",
          width: "100%",
          maxWidth: "100%",
          boxSizing: "border-box" as const,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          overflowX: "hidden" as const,
          position: "relative" as const,
          zIndex: 1
        }}>
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
            {/* Avatar floating at bottom of banner */}
            <div style={{ position: "absolute", bottom: "-48px", left: "clamp(24px,4vw,48px)", zIndex: 10 }}>
              <div
                onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                style={{ width: 96, height: 96, borderRadius: "50%", background: "linear-gradient(135deg,#0F62FE,#6366f1)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 32px rgba(15,98,254,0.4), 0 0 0 4px #fff", cursor: "pointer", position: "relative", transition: "transform 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.06)" }}
                onMouseLeave={e => { e.currentTarget.style.transform = "" }}
              >
                <AvatarDisplay avatar={selectedAvatar} size={52} />
                <div style={{ position: "absolute", bottom: 2, right: 2, width: 28, height: 28, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>✏️</div>
              </div>
              {/* Avatar Picker */}
              {showAvatarPicker && (
                <div style={{
                  position: "absolute",
                  top: "108px",
                  left: 0,
                  background: "white",
                  borderRadius: 20,
                  padding: "16px",
                  boxShadow: "0 12px 48px rgba(0,0,0,0.18)",
                  border: "1px solid #e2e8f0",
                  zIndex: 100,
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 12,
                  width: "280px",
                  animation: "prof-fadeUp 0.3s ease-out"
                }}>
                  {avatarOptions.map((av, idx) => {
                    const isSelected = JSON.stringify(selectedAvatar) === JSON.stringify(av)
                    return (
                      <div
                        key={av.id || idx}
                        onClick={() => { setSelectedAvatar(av); setShowAvatarPicker(false) }}
                        style={{
                          width: 54,
                          height: 54,
                          borderRadius: "50%",
                          background: isSelected ? "rgba(15,98,254,0.1)" : "#f8fafc",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          border: isSelected ? "3.5px solid #0F62FE" : "2px solid #f1f5f9",
                          overflow: "hidden",
                          transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)"
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.transform = "scale(1.15)"
                          e.currentTarget.style.borderColor = isSelected ? "#0F62FE" : "#cbd5e1"
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.transform = ""
                          e.currentTarget.style.borderColor = isSelected ? "#0F62FE" : "#f1f5f9"
                        }}
                      >
                        <AvatarDisplay avatar={av} size={32} />
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ── CONTENT AREA ── */}
          <div style={{ padding: "0 clamp(16px,4vw,48px)", display: "flex", flexDirection: "column", gap: 24 }}>

            {/* Name / username / badges row (below banner) */}
            <div style={{ paddingLeft: "clamp(110px,14vw,120px)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <div>
                {(user.user_metadata?.username || formData.username) && (
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#64748b" }}>@{user.user_metadata?.username || formData.username}</p>
                )}
                {profileStats?.joinDate && (
                  <p style={{ margin: "4px 0 0", fontSize: 12, color: "#94a3b8" }}>Se unió en {new Date(profileStats.joinDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' })}</p>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                {profileStats && (
                  <>
                    <div style={{ textAlign: "center" }}><div style={{ fontSize: 18, fontWeight: 900, color: "#0f172a" }}>{profileStats.followersCount}</div><div style={{ fontSize: 11, fontWeight: 600, color: "#64748b" }}>Seguidores</div></div>
                    <div style={{ width: 1, height: 32, background: "#e2e8f0" }} />
                    <div style={{ textAlign: "center" }}><div style={{ fontSize: 18, fontWeight: 900, color: "#0f172a" }}>{profileStats.followingCount}</div><div style={{ fontSize: 11, fontWeight: 600, color: "#64748b" }}>Siguiendo</div></div>
                  </>
                )}
                <div style={{ display: "inline-flex", alignItems: "center", padding: "7px 16px", background: user.user_metadata?.plan === "premium" ? "linear-gradient(135deg,#FBBF24,#F59E0B)" : user.user_metadata?.plan === "estudiante" ? "linear-gradient(135deg,#3B82F6,#2563EB)" : "linear-gradient(135deg,#10B981,#059669)", borderRadius: 20, boxShadow: "0 4px 12px rgba(0,0,0,0.12)" }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#fff", textTransform: "capitalize" }}>{user.user_metadata?.plan === "premium" ? "Premium" : user.user_metadata?.plan === "estudiante" ? "Estudiante" : "Gratuito"}</span>
                </div>
              </div>
            </div>

            {/* Profile Card */}
            <div style={{
              width: "100%",
              background: "white",
              borderRadius: 24,
              padding: "clamp(24px, 4vw, 36px)",
              boxShadow: "0 4px 20px rgba(15,98,254,0.06)",
              border: "1px solid #e8f0fe",
              boxSizing: "border-box"
            }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", margin: "0 0 20px", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 4, height: 18, background: "linear-gradient(180deg,#0F62FE,#6366f1)", borderRadius: 2, display: "inline-block" }} />
                Información Personal
              </h2>
              {/* Form Fields */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 20 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.04em" }}>Nombre Completo</label>
                  <input type="text" className="prof-input" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} placeholder="Tu nombre completo" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.04em" }}>Nombre de Usuario</label>
                  <input type="text" className="prof-input" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} placeholder="tunombredeusuario" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.04em" }}>Fecha de Nacimiento</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type="date"
                      className="prof-input"
                      value={formData.birthDate}
                      max={new Date().toISOString().split('T')[0]}
                      onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
                      style={{ colorScheme: "light" }}
                    />
                    {formData.birthDate && (() => {
                      const bd = new Date(formData.birthDate)
                      const today = new Date()
                      let age = today.getFullYear() - bd.getFullYear()
                      const m = today.getMonth() - bd.getMonth()
                      if (m < 0 || (m === 0 && today.getDate() < bd.getDate())) age--
                      return (
                        <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em" }}>Edad:</span>
                          <span style={{ fontSize: 13, fontWeight: 800, color: "#0F62FE" }}>{age} años</span>
                        </div>
                      )
                    })()}
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.04em" }}>Mi Escuela</label>
                  <select
                    className="prof-input"
                    value={formData.schoolId}
                    onChange={e => setFormData({ ...formData, schoolId: e.target.value })}
                  >
                    <option value="">Selecciona tu escuela</option>
                    {schools.map(school => (
                      <option key={school.id} value={school.id}>
                        {school.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.04em" }}>Intereses Financieros</label>
                  <textarea className="prof-input" value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} placeholder="¿Qué es lo que más te llama la atención del mundo de las finanzas?" rows={3} style={{ resize: "vertical" }} />
                </div>
              </div>

              {/* Save Status (Success message hidden per request) */}
              {saving && <div style={{ marginTop: 20, padding: "11px 16px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 12, fontSize: 14, fontWeight: 600, color: "#2563eb" }}>Guardando cambios...</div>}
              {saveError && <div style={{ marginTop: 20, padding: "11px 16px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, fontSize: 14, fontWeight: 600, color: "#dc2626" }}>⚠ {saveError}</div>}
            </div>

            {/* Level & Progress Section */}
            {userStats && !loadingStats && (
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
            {/* Replay Onboarding Tour */}
            <div style={{ background: "white", borderRadius: 24, padding: "clamp(20px,3vw,28px) clamp(22px,4vw,32px)", border: "1px solid #e8f0fe", boxShadow: "0 4px 20px rgba(15,98,254,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg,#eff6ff,#dbeafe)", border: "1px solid #bfdbfe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🗺️</div>
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

          </div>{/* end content area */}
        </main >
      </div >
    </>
  )
}
