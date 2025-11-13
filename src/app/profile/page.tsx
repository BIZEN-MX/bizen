"use client"

import React, { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import Image from "next/image"
import Button from "../../components/ui/button"
import { createClientMicrocred } from "@/lib/supabase/client-microcred"
import { AvatarDisplay } from "@/components/AvatarDisplay"
import PageLogo from "@/components/PageLogo"

interface UserStats {
  xp: number
  level: number
  xpInCurrentLevel: number
  totalXpForNextLevel: number
  xpForNextLevel: number
}

export default function ProfilePage() {
  const { user, loading, refreshUser } = useAuth()
  const router = useRouter()
  const supabase = createClientMicrocred()
  const [showAvatarPicker, setShowAvatarPicker] = useState(false)
  const [selectedAvatar, setSelectedAvatar] = useState<any>({ type: "emoji", value: "👤" })
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [loadingStats, setLoadingStats] = useState(true)
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    bio: ""
  })
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Custom avatar options with emojis, custom designs, and cartoon characters
  const avatarOptions = [
    { type: "emoji", value: "👤" },
    { type: "emoji", value: "😀" },
    { type: "emoji", value: "😎" },
    { type: "emoji", value: "🤓" },
    // Cartoon Characters
    { type: "custom", id: "char-robot", character: "robot", bgColor: "#DBEAFE" },
    { type: "custom", id: "char-astronaut", character: "astronaut", bgColor: "#E0E7FF" },
    { type: "custom", id: "char-wizard", character: "wizard", bgColor: "#F3E8FF" },
    { type: "custom", id: "char-ninja", character: "ninja", bgColor: "#FEE2E2" },
    { type: "custom", id: "char-pirate", character: "pirate", bgColor: "#FFEDD5" },
    { type: "custom", id: "char-superhero", character: "superhero", bgColor: "#DBEAFE" },
    { type: "custom", id: "char-scientist", character: "scientist", bgColor: "#E0F2FE" },
    { type: "custom", id: "char-artist", character: "artist", bgColor: "#FCE7F3" },
    { type: "custom", id: "char-cat", character: "cat", bgColor: "#FEF3C7" },
    { type: "custom", id: "char-dog", character: "dog", bgColor: "#FED7AA" },
    // Gradients
    { type: "custom", id: "gradient-blue", gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
    { type: "custom", id: "gradient-sunset", gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
    { type: "custom", id: "gradient-ocean", gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
    { type: "custom", id: "gradient-forest", gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" },
    // Patterns
    { type: "custom", id: "pattern-dots", pattern: "dots", color: "#3B82F6" },
    { type: "custom", id: "pattern-waves", pattern: "waves", color: "#10B981" },
    // Geometric
    { type: "custom", id: "geometric-triangle", shape: "triangle", color: "#EF4444" },
    { type: "custom", id: "geometric-star", shape: "star", color: "#FBBF24" },
  ]

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.replace("/login")
      return
    }

    // Initialize form with user data
    setFormData({
      fullName: user.user_metadata?.full_name || "",
      username: user.user_metadata?.username || "",
      bio: user.user_metadata?.bio || ""
    })
    
    // Initialize avatar - try to find saved avatar or use default
    const savedAvatar = user.user_metadata?.avatar
    if (savedAvatar && typeof savedAvatar === 'object') {
      setSelectedAvatar(savedAvatar)
    } else {
      setSelectedAvatar({ type: "emoji", value: "👤" })
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

    fetchStats()
  }, [user, loading, router])

  // Set body background for this page
  useEffect(() => {
    const htmlEl = document.documentElement
    const bodyEl = document.body
    
    htmlEl.style.background = "linear-gradient(180deg, #E0F2FE 0%, #DBEAFE 50%, #BFDBFE 100%)"
    htmlEl.style.backgroundAttachment = "fixed"
    bodyEl.style.background = "linear-gradient(180deg, #E0F2FE 0%, #DBEAFE 50%, #BFDBFE 100%)"
    bodyEl.style.backgroundAttachment = "fixed"
    
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
          avatar: selectedAvatar
        }
      })

      if (error) {
        throw error
      }

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

  if (loading) {
    return (
      <div style={{ display: "grid", placeItems: "center", minHeight: "100vh", fontFamily: "Montserrat, sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 40,
            height: 40,
            border: "4px solid #E5E7EB",
            borderTopColor: "#0F62FE",
            borderRadius: "50%",
            margin: "0 auto 16px",
            animation: "spin 1s linear infinite",
          }} />
          <p style={{ color: "#666", fontSize: 16 }}>Cargando perfil...</p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (!user) return null

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "linear-gradient(180deg, #E0F2FE 0%, #DBEAFE 50%, #BFDBFE 100%)",
      overflowY: "auto",
      overflowX: "hidden"
    }}>
      {/* Decorative Orbs */}
      <div style={{
        position: "fixed",
        top: "15%",
        right: "8%",
        width: "400px",
        height: "400px",
        background: "radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)",
        borderRadius: "50%",
        filter: "blur(60px)",
        pointerEvents: "none"
      }} />
      <div style={{
        position: "fixed",
        bottom: "15%",
        left: "8%",
        width: "450px",
        height: "450px",
        background: "radial-gradient(circle, rgba(34, 197, 94, 0.15) 0%, transparent 70%)",
        borderRadius: "50%",
        filter: "blur(70px)",
        pointerEvents: "none"
      }} />
      <div style={{
        position: "fixed",
        top: "40%",
        left: "50%",
        width: "500px",
        height: "500px",
        background: "radial-gradient(circle, rgba(147, 197, 253, 0.12) 0%, transparent 70%)",
        borderRadius: "50%",
        filter: "blur(80px)",
        pointerEvents: "none"
      }} />

      {/* Main Content */}
      <main style={{ 
        minHeight: "100vh",
        paddingTop: "40px",
        paddingBottom: "80px",
        paddingLeft: "40px",
        paddingRight: "380px",
        fontFamily: "Montserrat, sans-serif",
        maxWidth: "100%"
      }}>
        {/* Logo */}
        <div style={{ marginBottom: 24 }}>
          <PageLogo />
        </div>

        {/* Page Title */}
        <div style={{
          textAlign: "left",
          marginBottom: 48
        }}>
          <h1 style={{
            fontSize: "clamp(28px, 5vw, 42px)",
            fontWeight: 800,
            color: "#1E40AF",
            marginBottom: 8
          }}>
            Mi Perfil
          </h1>
          <p style={{
            fontSize: "clamp(14px, 2vw, 16px)",
            color: "#6B7280"
          }}>
            Administra tu información personal
          </p>
        </div>

        {/* Profile Card */}
        <div style={{
          maxWidth: "800px",
          margin: "0 auto",
          background: "rgba(255, 255, 255, 0.5)",
          backdropFilter: "blur(10px)",
          borderRadius: 24,
          padding: "clamp(24px, 5vw, 40px)",
          boxShadow: "0 4px 20px rgba(59, 130, 246, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)",
          border: "2px solid rgba(147, 197, 253, 0.4)"
        }}>
          {/* Profile Picture Section */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: 40,
            position: "relative"
          }}>
            <div 
              onClick={() => setShowAvatarPicker(!showAvatarPicker)}
              style={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #0F62FE 0%, #10B981 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 64,
                fontWeight: 800,
                color: "#fff",
                marginBottom: 16,
                boxShadow: "0 8px 24px rgba(59, 130, 246, 0.3)",
                cursor: "pointer",
                transition: "all 0.2s ease",
                position: "relative"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)"
                e.currentTarget.style.boxShadow = "0 12px 32px rgba(59, 130, 246, 0.4)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)"
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(59, 130, 246, 0.3)"
              }}
            >
              <AvatarDisplay avatar={selectedAvatar} size={64} />
              <div style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)"
              }}>
                ✏️
              </div>
            </div>

            {/* Avatar Picker */}
            {showAvatarPicker && (
              <div style={{
                position: "absolute",
                top: "140px",
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                borderRadius: 16,
                padding: 16,
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
                border: "2px solid rgba(147, 197, 253, 0.4)",
                zIndex: 10,
                display: "grid",
                gridTemplateColumns: "repeat(8, 1fr)",
                gap: 10,
                maxWidth: "500px"
              }}>
                {avatarOptions.map((avatar, idx) => {
                  const isSelected = JSON.stringify(selectedAvatar) === JSON.stringify(avatar)
                  return (
                  <div
                    key={avatar.id || avatar.value || idx}
                    onClick={() => {
                      setSelectedAvatar(avatar)
                      setShowAvatarPicker(false)
                    }}
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      background: isSelected 
                        ? "linear-gradient(135deg, #0F62FE 0%, #10B981 100%)" 
                        : "rgba(59, 130, 246, 0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      border: isSelected ? "3px solid #0F62FE" : "2px solid transparent",
                      overflow: "hidden",
                      position: "relative"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.1)"
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.3)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)"
                      e.currentTarget.style.boxShadow = "none"
                    }}
                  >
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <AvatarDisplay avatar={avatar} size={24} />
                    </div>
                  </div>
                  )
                })}
              </div>
            )}

            <h2 style={{
              fontSize: 24,
              fontWeight: 800,
              color: "#1E40AF",
              marginBottom: 4
            }}>
              {user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario'}
            </h2>
            {(user.user_metadata?.username || formData.username) && (
              <p style={{
                margin: 0,
                fontSize: 16,
                fontWeight: 600,
                color: "#6B7280",
                marginBottom: 8
              }}>
                {user.user_metadata?.username || formData.username}
              </p>
            )}
            
            {/* Role Badge */}
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 16px",
              background: user.user_metadata?.plan === "premium" 
                ? "linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)"
                : user.user_metadata?.plan === "estudiante"
                ? "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)"
                : "linear-gradient(135deg, #10B981 0%, #059669 100%)",
              borderRadius: 20,
              alignSelf: "center",
              marginTop: 8,
              boxShadow: user.user_metadata?.plan === "premium" 
                ? "0 4px 12px rgba(251, 191, 36, 0.3)"
                : user.user_metadata?.plan === "estudiante"
                ? "0 4px 12px rgba(59, 130, 246, 0.3)"
                : "0 4px 12px rgba(16, 185, 129, 0.3)"
            }}>
              <span style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#fff",
                textTransform: "capitalize",
                letterSpacing: "0.5px"
              }}>
                {user.user_metadata?.plan === "premium" 
                  ? "Premium"
                  : user.user_metadata?.plan === "estudiante"
                  ? "Estudiante"
                  : "Gratuito"}
              </span>
            </div>
          </div>

          {/* Form Fields */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: 24
          }}>
            {/* Full Name */}
            <div>
              <label style={{
                display: "block",
                fontSize: 14,
                fontWeight: 700,
                color: "#374151",
                marginBottom: 8
              }}>
                Nombre Completo
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Tu nombre completo"
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: 12,
                  border: "2px solid #3B82F6",
                  background: "#fff",
                  fontSize: 16,
                  fontFamily: "Montserrat, sans-serif",
                  color: "#1F2937",
                  outline: "none",
                  transition: "all 0.2s ease"
                }}
              />
            </div>

            {/* Username */}
            <div>
              <label style={{
                display: "block",
                fontSize: 14,
                fontWeight: 700,
                color: "#374151",
                marginBottom: 8
              }}>
                Nombre de Usuario
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="tunombredeusuario"
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: 12,
                  border: "2px solid #3B82F6",
                  background: "#fff",
                  fontSize: 16,
                  fontFamily: "Montserrat, sans-serif",
                  color: "#1F2937",
                  outline: "none",
                  transition: "all 0.2s ease"
                }}
              />
            </div>

            {/* Bio */}
            <div>
              <label style={{
                display: "block",
                fontSize: 14,
                fontWeight: 700,
                color: "#374151",
                marginBottom: 8
              }}>
                Intereses Financieros
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="¿Qué es lo que más te llama la atención del mundo de las finanzas?"
                rows={4}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: 12,
                  border: "2px solid #3B82F6",
                  background: "#fff",
                  fontSize: 16,
                  fontFamily: "Montserrat, sans-serif",
                  color: "#1F2937",
                  outline: "none",
                  resize: "vertical",
                  transition: "all 0.2s ease"
                }}
              />
            </div>

          </div>

          {/* Save Status Messages */}
          {saving && (
            <div style={{
              marginTop: 24,
              padding: "12px 16px",
              background: "rgba(59, 130, 246, 0.1)",
              border: "2px solid #3B82F6",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              gap: 8
            }}>
              <div style={{
                width: 20,
                height: 20,
                border: "3px solid rgba(59, 130, 246, 0.3)",
                borderTop: "3px solid #3B82F6",
                borderRadius: "50%",
                animation: "spin 1s linear infinite"
              }} />
              <span style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#3B82F6"
              }}>
                Guardando...
              </span>
            </div>
          )}

          {lastSaved && !saving && !saveError && (
            <div style={{
              marginTop: 24,
              padding: "12px 16px",
              background: "rgba(16, 185, 129, 0.1)",
              border: "2px solid #10B981",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              gap: 8
            }}>
              <span style={{ fontSize: 20 }}>✅</span>
              <span style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#10B981"
              }}>
                Cambios guardados - {lastSaved.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          )}

          {saveError && (
            <div style={{
              marginTop: 24,
              padding: "12px 16px",
              background: "rgba(239, 68, 68, 0.1)",
              border: "2px solid #EF4444",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              gap: 8
            }}>
              <span style={{ fontSize: 20 }}>❌</span>
              <span style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#DC2626"
              }}>
                {saveError}
              </span>
            </div>
          )}
        </div>

        {/* Level & Progress Section */}
        {userStats && !loadingStats && (
        <div style={{
          maxWidth: "800px",
          margin: "32px auto 0",
          background: "rgba(255, 255, 255, 0.5)",
          backdropFilter: "blur(10px)",
          borderRadius: 20,
          padding: 28,
          border: "2px solid rgba(147, 197, 253, 0.4)"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16
          }}>
            <h3 style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 800,
              color: "#1E40AF",
              display: "flex",
              alignItems: "center",
              gap: 10
            }}>
              ⚡ Nivel & Progreso
            </h3>
            <div style={{
              padding: "8px 16px",
              background: "linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)",
              borderRadius: 20,
              fontSize: 18,
              fontWeight: 800,
              color: "#fff",
              boxShadow: "0 4px 12px rgba(251, 191, 36, 0.3)"
            }}>
                Nivel {userStats.level}
              </div>
          </div>

          {/* XP Progress Bar */}
          <div style={{ marginBottom: 12 }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 8,
              fontSize: 14,
              fontWeight: 600,
              color: "#374151"
            }}>
                <span>{userStats.xpInCurrentLevel} XP</span>
                <span>{userStats.totalXpForNextLevel} XP</span>
            </div>
            <div style={{
              width: "100%",
              height: 12,
              background: "rgba(59, 130, 246, 0.2)",
              borderRadius: 12,
              overflow: "hidden",
              position: "relative"
            }}>
              <div style={{
                  width: `${(userStats.xpInCurrentLevel / userStats.totalXpForNextLevel) * 100}%`,
                height: "100%",
                background: "linear-gradient(90deg, #10B981 0%, #059669 100%)",
                borderRadius: 12,
                transition: "width 0.5s ease",
                boxShadow: "0 0 12px rgba(16, 185, 129, 0.5)"
              }} />
            </div>
            <p style={{
              margin: "8px 0 0",
              fontSize: 12,
              color: "#6B7280",
              fontWeight: 600,
              textAlign: "center"
            }}>
                {userStats.xpForNextLevel} XP para el siguiente nivel
            </p>
          </div>
        </div>
        )}

        {loadingStats && (
          <div style={{
            maxWidth: "800px",
            margin: "32px auto 0",
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

        {/* Badges Section */}
        <div style={{
          maxWidth: "800px",
          margin: "24px auto 0",
          background: "rgba(255, 255, 255, 0.5)",
          backdropFilter: "blur(10px)",
          borderRadius: 20,
          padding: 28,
          border: "2px solid rgba(147, 197, 253, 0.4)"
        }}>
          <h3 style={{
            margin: "0 0 20px",
            fontSize: 20,
            fontWeight: 800,
            color: "#1E40AF",
            display: "flex",
            alignItems: "center",
            gap: 10
          }}>
            🏆 Logros & Insignias
          </h3>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
            gap: 16
          }}>
            {/* Badge 1 - First Lesson */}
            <div style={{
              background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
              borderRadius: 16,
              padding: 16,
              textAlign: "center",
              boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
              transition: "transform 0.2s ease",
              cursor: "pointer"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>🎯</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>Primera Lección</div>
            </div>

            {/* Badge 2 - Week Streak */}
            <div style={{
              background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
              borderRadius: 16,
              padding: 16,
              textAlign: "center",
              boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)",
              transition: "transform 0.2s ease",
              cursor: "pointer"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>🔥</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>Racha 7 Días</div>
            </div>

            {/* Badge 3 - Course Completed */}
            <div style={{
              background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
              borderRadius: 16,
              padding: 16,
              textAlign: "center",
              boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
              transition: "transform 0.2s ease",
              cursor: "pointer"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>🎓</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>Curso Completo</div>
            </div>

            {/* Badge 4 - Perfect Score */}
            <div style={{
              background: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
              borderRadius: 16,
              padding: 16,
              textAlign: "center",
              boxShadow: "0 4px 12px rgba(139, 92, 246, 0.3)",
              transition: "transform 0.2s ease",
              cursor: "pointer"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>⭐</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>Puntuación Perfecta</div>
            </div>

            {/* Badge 5 - Early Bird */}
            <div style={{
              background: "linear-gradient(135deg, #EC4899 0%, #DB2777 100%)",
              borderRadius: 16,
              padding: 16,
              textAlign: "center",
              boxShadow: "0 4px 12px rgba(236, 72, 153, 0.3)",
              transition: "transform 0.2s ease",
              cursor: "pointer"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>🌅</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>Madrugador</div>
            </div>

            {/* Badge 6 - Locked */}
            <div style={{
              background: "rgba(156, 163, 175, 0.3)",
              borderRadius: 16,
              padding: 16,
              textAlign: "center",
              border: "2px dashed rgba(156, 163, 175, 0.5)"
            }}>
              <div style={{ fontSize: 32, marginBottom: 8, opacity: 0.5 }}>🔒</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF" }}>Bloqueado</div>
            </div>
          </div>
        </div>

      </main>
      
      {/* CSS Animations */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

