"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import Link from "next/link"

export default function AccountSettingsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const [nickname, setNickname] = useState("")
  const [notifyEmail, setNotifyEmail] = useState(true)
  const [notifyInApp, setNotifyInApp] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    const bodyEl = document.body
    if (bodyEl) {
      bodyEl.style.background = "linear-gradient(180deg, #E0F2FE 0%, #DBEAFE 50%, #BFDBFE 100%)"
      bodyEl.style.backgroundAttachment = "fixed"
    }
    return () => {
      bodyEl.style.background = "#fff"
      bodyEl.style.backgroundAttachment = "scroll"
    }
  }, [])

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.replace("/login")
      return
    }
    fetchSettings()
  }, [user, loading, router])

  const fetchSettings = async () => {
    try {
      setLoadingData(true)
      const response = await fetch('/api/profile/me')
      if (response.ok) {
        const data = await response.json()
        setNickname(data.nickname || '')
      }
    } catch (error) {
      console.error("Error fetching settings:", error)
    } finally {
      setLoadingData(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (saving) return

    try {
      setSaving(true)
      setMessage("")

      const response = await fetch('/api/profile/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname: nickname.trim(),
          notifyEmail,
          notifyInApp
        })
      })

      if (response.ok) {
        setMessage("✅ Configuración guardada")
        setTimeout(() => setMessage(""), 3000)
      } else {
        const error = await response.json()
        setMessage(`❌ ${error.error || 'Error al guardar'}`)
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      setMessage("❌ Error al guardar")
    } finally {
      setSaving(false)
    }
  }

  if (loading || loadingData) {
    return (
      <div style={{ 
        display: "grid", 
        placeItems: "center", 
        minHeight: "60vh", 
        fontFamily: "Montserrat, sans-serif",
        background: "linear-gradient(180deg, #E0F2FE 0%, #DBEAFE 50%, #BFDBFE 100%)"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 48,
            height: 48,
            border: "4px solid #0F62FE22",
            borderTop: "4px solid #0F62FE",
            borderRadius: "50%",
            margin: "0 auto 16px",
            animation: "spin 1s linear infinite",
          }} />
          <p style={{ color: "#666", fontSize: 16 }}>Cargando...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (!user) return null

  return (
    <div style={{
      position: "relative",
      minHeight: "100vh",
      paddingTop: 40,
      paddingBottom: 80,
      fontFamily: "Montserrat, sans-serif",
      background: "linear-gradient(180deg, #E0F2FE 0%, #DBEAFE 50%, #BFDBFE 100%)",
      backgroundAttachment: "fixed"
    }}>
      <main style={{ 
        position: "relative",
        maxWidth: 800, 
        margin: "0 auto", 
        padding: "clamp(20px, 4vw, 40px)",
        zIndex: 1
      }}>
        <h1 style={{ margin: "0 0 8px", fontSize: 32, fontWeight: 800, color: "#1E40AF" }}>
          Configuración de Cuenta
        </h1>
        <p style={{ margin: "0 0 32px", color: "#374151", fontSize: 15, fontWeight: 600 }}>
          Gestiona tu perfil del foro y preferencias
        </p>

        <div style={{
          padding: 32,
          background: "rgba(255, 255, 255, 0.4)",
          backdropFilter: "blur(20px)",
          borderRadius: 20,
          border: "2px solid rgba(255, 255, 255, 0.6)",
          boxShadow: "0 8px 32px rgba(31, 38, 135, 0.15)"
        }}>
          <form onSubmit={handleSave}>
            {/* Nickname */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ 
                display: "block",
                marginBottom: 8,
                fontSize: 15,
                fontWeight: 700,
                color: "#1E40AF"
              }}>
                Apodo (Pseudónimo del Foro)
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Elige un apodo único"
                maxLength={30}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  fontSize: 15,
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 600,
                  border: "2px solid rgba(255, 255, 255, 0.6)",
                  borderRadius: 12,
                  background: "rgba(255, 255, 255, 0.6)",
                  color: "#374151",
                  boxSizing: "border-box"
                }}
              />
              <div style={{ marginTop: 6, fontSize: 12, color: "#6B7280", fontWeight: 500 }}>
                Tu apodo se mostrará en lugar de tu nombre real en el foro
              </div>
            </div>

            {/* Email Notifications */}
            <div style={{ marginBottom: 24 }}>
              <label style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                cursor: "pointer",
                fontSize: 15,
                fontWeight: 600,
                color: "#374151"
              }}>
                <input
                  type="checkbox"
                  checked={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.checked)}
                  style={{ width: 18, height: 18, cursor: "pointer" }}
                />
                Recibir notificaciones por correo
              </label>
            </div>

            {/* In-App Notifications */}
            <div style={{ marginBottom: 24 }}>
              <label style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                cursor: "pointer",
                fontSize: 15,
                fontWeight: 600,
                color: "#374151"
              }}>
                <input
                  type="checkbox"
                  checked={notifyInApp}
                  onChange={(e) => setNotifyInApp(e.target.checked)}
                  style={{ width: 18, height: 18, cursor: "pointer" }}
                />
                Recibir notificaciones en la aplicación
              </label>
            </div>

            {/* Message */}
            {message && (
              <div style={{
                padding: 16,
                background: message.includes('✅') ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                borderRadius: 12,
                marginBottom: 24,
                fontSize: 14,
                fontWeight: 600,
                color: message.includes('✅') ? "#10B981" : "#EF4444"
              }}>
                {message}
              </div>
            )}

            {/* Buttons */}
            <div style={{ display: "flex", gap: 12 }}>
              <button
                type="submit"
                disabled={saving}
                style={{
                  padding: "14px 28px",
                  background: saving ? "#9CA3AF" : "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: saving ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 12px rgba(11, 113, 254, 0.3)",
                  fontFamily: "Montserrat, sans-serif"
                }}
              >
                {saving ? "Guardando..." : "Guardar Cambios"}
              </button>

              <Link
                href="/forum"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "14px 28px",
                  background: "rgba(255, 255, 255, 0.6)",
                  color: "#374151",
                  border: "none",
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: 700,
                  textDecoration: "none",
                  fontFamily: "Montserrat, sans-serif"
                }}
              >
                Volver al Foro
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

