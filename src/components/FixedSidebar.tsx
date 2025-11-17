"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useSettings } from "@/contexts/SettingsContext"
import { useTranslation } from "@/lib/translations"
import { AvatarDisplay } from "@/components/AvatarDisplay"
import Image from "next/image"

export default function FixedSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading } = useAuth()
  const { settings } = useSettings()
  const t = useTranslation(settings.language)
  const [showExitDialog, setShowExitDialog] = useState(false)
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)

  // Check if user is on a lesson page
  const isOnLessonPage = pathname?.includes('/learn/')

  // Protected routes that require authentication
  const protectedRoutes = ['/assignments', '/progress', '/forum', '/profile', '/cuenta', '/configuracion']

  const navigateTo = (path: string) => {
    // Check if route requires auth and user is not authenticated
    if (!user && protectedRoutes.some(route => path.startsWith(route))) {
      setShowAuthDialog(true)
      return
    }

    // If on lesson page, show confirmation dialog
    if (isOnLessonPage) {
      setPendingNavigation(path)
      setShowExitDialog(true)
    } else {
      // If not on lesson page, navigate directly
      router.push(path)
    }
  }

  const confirmExit = () => {
    setShowExitDialog(false)
    if (pendingNavigation) {
      router.push(pendingNavigation)
      setPendingNavigation(null)
    }
  }

  const cancelExit = () => {
    setShowExitDialog(false)
    setPendingNavigation(null)
  }

  // Helper function to check if path is active
  const isActivePath = (path: string) => {
    if (path === '/courses') {
      return pathname === path
    }
    return pathname === path || pathname.startsWith(path + '/')
  }

  return (
    <>
      {/* Fixed Sidebar Panel */}
      <div data-fixed-sidebar style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: "clamp(240px, 25vw, 320px)",
        height: "100vh",
        background: "linear-gradient(180deg, #E0F2FE 0%, #DBEAFE 50%, #BFDBFE 100%)",
        boxShadow: "-4px 0 20px rgba(0, 0, 0, 0.1)",
        zIndex: 1000,
        overflowY: "auto",
        fontFamily: "Montserrat, sans-serif",
        borderLeft: "2px solid rgba(15, 98, 254, 0.2)",
        boxSizing: "border-box"
      }}>
        <div style={{ padding: "24px 20px" }}>
          {/* Username with Avatar or Create Account Button */}
          {user ? (
            <div style={{ 
              marginBottom: 24,
              display: "flex",
              alignItems: "center",
              gap: 12
            }}>
              {/* Avatar */}
              <div style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: user.user_metadata?.avatar?.gradient || user.user_metadata?.avatar?.bgColor 
                  ? "transparent" 
                  : "linear-gradient(135deg, #0F62FE 0%, #10B981 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                fontWeight: 800,
                color: "#fff",
                boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
                flexShrink: 0,
                overflow: "hidden"
              }}>
                <AvatarDisplay 
                  avatar={user.user_metadata?.avatar || { type: "emoji", value: (user.user_metadata?.full_name || user.email || "U")[0].toUpperCase() }} 
                  size={48} 
                />
              </div>
              
              {/* Username */}
              <h2 style={{
                margin: 0,
                fontSize: 18,
                fontWeight: 700,
                color: "#0F62FE",
                flex: 1
              }}>
                {user.user_metadata?.username || user.email?.split('@')[0] || t.sidebar.student}
              </h2>
            </div>
          ) : (
            /* Always show "Crear Cuenta" button when user is not authenticated */
            <div style={{ marginBottom: 24 }}>
              <button
                onClick={() => router.push("/signup")}
                style={{
                  width: "100%",
                  padding: "14px 20px",
                  background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
                  border: "none",
                  borderRadius: 12,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 15,
                  fontWeight: 700,
                  color: "white",
                  boxShadow: "0 4px 20px rgba(11, 113, 254, 0.5), 0 0 30px rgba(11, 113, 254, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden",
                  animation: "pulse-glow 2s ease-in-out infinite"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px) scale(1.02)"
                  e.currentTarget.style.boxShadow = "0 8px 25px rgba(11, 113, 254, 0.6), 0 0 40px rgba(11, 113, 254, 0.4)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)"
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(11, 113, 254, 0.5), 0 0 30px rgba(11, 113, 254, 0.3)"
                }}
              >
                {/* Shine effect overlay */}
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: "-100%",
                  width: "100%",
                  height: "100%",
                  background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)",
                  animation: "shine 3s ease-in-out infinite"
                }} />
                <span style={{ position: "relative", zIndex: 1 }}>Crear Cuenta</span>
              </button>
              <style>{`
                @keyframes pulse-glow {
                  0%, 100% {
                    box-shadow: 0 4px 20px rgba(11, 113, 254, 0.5), 0 0 30px rgba(11, 113, 254, 0.3);
                  }
                  50% {
                    box-shadow: 0 4px 25px rgba(11, 113, 254, 0.7), 0 0 40px rgba(11, 113, 254, 0.5);
                  }
                }
                @keyframes shine {
                  0% {
                    left: -100%;
                  }
                  20%, 100% {
                    left: 100%;
                  }
                }
              `}</style>
            </div>
          )}

          {/* Quick Actions */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                onClick={() => navigateTo("/courses")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px",
                  background: isActivePath("/courses") ? "#EFF6FF" : "transparent",
                  border: "none",
                  borderRadius: 10,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 14,
                  fontWeight: isActivePath("/courses") ? 700 : 600,
                  textAlign: "left",
                  color: isActivePath("/courses") ? "#0F62FE" : "#000"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#EFF6FF"
                  e.currentTarget.style.color = "#0F62FE"
                  e.currentTarget.style.transform = "translateX(-4px)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isActivePath("/courses") ? "#EFF6FF" : "transparent"
                  e.currentTarget.style.color = isActivePath("/courses") ? "#0F62FE" : "#000"
                  e.currentTarget.style.transform = "translateX(0)"
                }}
              >
                <span style={{ 
                  fontSize: 20,
                  background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  display: "inline-block"
                }}>📚</span>
                <span>{t.nav.exploreCourses}</span>
              </button>

              <button
                onClick={() => navigateTo("/business-lab")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px",
                  background: isActivePath("/business-lab") ? "#EFF6FF" : "transparent",
                  border: "none",
                  borderRadius: 10,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 14,
                  fontWeight: isActivePath("/business-lab") ? 700 : 600,
                  textAlign: "left",
                  color: isActivePath("/business-lab") ? "#0F62FE" : "#000"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#EFF6FF"
                  e.currentTarget.style.color = "#0F62FE"
                  e.currentTarget.style.transform = "translateX(-4px)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isActivePath("/business-lab") ? "#EFF6FF" : "transparent"
                  e.currentTarget.style.color = isActivePath("/business-lab") ? "#0F62FE" : "#000"
                  e.currentTarget.style.transform = "translateX(0)"
                }}
              >
                <Image 
                  src="/bizen-logo.png" 
                  alt="BIZEN" 
                  width={20} 
                  height={20}
                  style={{
                    objectFit: "contain"
                  }}
                />
                <span>Business Lab</span>
              </button>

              <button
                onClick={() => navigateTo("/cash-flow")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px",
                  background: isActivePath("/cash-flow") ? "#EFF6FF" : "transparent",
                  border: "none",
                  borderRadius: 10,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 14,
                  fontWeight: isActivePath("/cash-flow") ? 700 : 600,
                  textAlign: "left",
                  color: isActivePath("/cash-flow") ? "#0F62FE" : "#000"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#EFF6FF"
                  e.currentTarget.style.color = "#0F62FE"
                  e.currentTarget.style.transform = "translateX(-4px)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isActivePath("/cash-flow") ? "#EFF6FF" : "transparent"
                  e.currentTarget.style.color = isActivePath("/cash-flow") ? "#0F62FE" : "#000"
                  e.currentTarget.style.transform = "translateX(0)"
                }}
              >
                <span style={{ 
                  fontSize: 20,
                  background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  display: "inline-block"
                }}>💰</span>
                <span>Cash flow</span>
              </button>

              <button
                onClick={() => navigateTo("/simuladores")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px",
                  background: isActivePath("/simuladores") ? "#EFF6FF" : "transparent",
                  border: "none",
                  borderRadius: 10,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 14,
                  fontWeight: isActivePath("/simuladores") ? 700 : 600,
                  textAlign: "left",
                  color: isActivePath("/simuladores") ? "#0F62FE" : "#000"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#EFF6FF"
                  e.currentTarget.style.color = "#0F62FE"
                  e.currentTarget.style.transform = "translateX(-4px)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isActivePath("/simuladores") ? "#EFF6FF" : "transparent"
                  e.currentTarget.style.color = isActivePath("/simuladores") ? "#0F62FE" : "#000"
                  e.currentTarget.style.transform = "translateX(0)"
                }}
              >
                <span style={{ 
                  fontSize: 20,
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  display: "inline-block"
                }}>$</span>
                <span>Simuladores</span>
              </button>

              {/* Only show these navigation items when user is authenticated */}
              {user && (
              <>
              <button
                onClick={() => navigateTo("/assignments")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px",
                  background: isActivePath("/assignments") ? "#EFF6FF" : "transparent",
                  border: "none",
                  borderRadius: 10,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 14,
                  fontWeight: isActivePath("/assignments") ? 700 : 600,
                  textAlign: "left",
                  color: isActivePath("/assignments") ? "#0F62FE" : "#000"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#EFF6FF"
                  e.currentTarget.style.color = "#0F62FE"
                  e.currentTarget.style.transform = "translateX(-4px)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isActivePath("/assignments") ? "#EFF6FF" : "transparent"
                  e.currentTarget.style.color = isActivePath("/assignments") ? "#0F62FE" : "#000"
                  e.currentTarget.style.transform = "translateX(0)"
                }}
              >
                <span style={{ 
                  fontSize: 20,
                  background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  display: "inline-block"
                }}>✏️</span>
                <span>{t.nav.assignments}</span>
              </button>

              <button
                onClick={() => navigateTo("/progress")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px",
                  background: isActivePath("/progress") ? "#EFF6FF" : "transparent",
                  border: "none",
                  borderRadius: 10,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 14,
                  fontWeight: isActivePath("/progress") ? 700 : 600,
                  textAlign: "left",
                  color: isActivePath("/progress") ? "#0F62FE" : "#000"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#EFF6FF"
                  e.currentTarget.style.color = "#0F62FE"
                  e.currentTarget.style.transform = "translateX(-4px)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isActivePath("/progress") ? "#EFF6FF" : "transparent"
                  e.currentTarget.style.color = isActivePath("/progress") ? "#0F62FE" : "#000"
                  e.currentTarget.style.transform = "translateX(0)"
                }}
              >
                <span style={{ 
                  fontSize: 20,
                  background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  display: "inline-block"
                }}>🏆</span>
                <span>{t.nav.myProgress}</span>
              </button>

              <button
                onClick={() => navigateTo("/forum")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px",
                  background: isActivePath("/forum") ? "#EFF6FF" : "transparent",
                  border: "none",
                  borderRadius: 10,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 14,
                  fontWeight: isActivePath("/forum") ? 700 : 600,
                  textAlign: "left",
                  color: isActivePath("/forum") ? "#0F62FE" : "#000"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#EFF6FF"
                  e.currentTarget.style.color = "#0F62FE"
                  e.currentTarget.style.transform = "translateX(-4px)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isActivePath("/forum") ? "#EFF6FF" : "transparent"
                  e.currentTarget.style.color = isActivePath("/forum") ? "#0F62FE" : "#000"
                  e.currentTarget.style.transform = "translateX(0)"
                }}
              >
                <span style={{ 
                  fontSize: 20,
                  background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  display: "inline-block"
                }}>💬</span>
                <span>Foro Emprendedor</span>
              </button>
              </>
              )}
            </div>
          </div>

          {/* Navigation Links - Only show for authenticated users */}
          {user && (
          <div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                onClick={() => navigateTo("/profile")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px",
                  background: isActivePath("/profile") ? "#EFF6FF" : "transparent",
                  border: "none",
                  borderRadius: 10,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 14,
                  fontWeight: isActivePath("/profile") ? 700 : 600,
                  textAlign: "left",
                  color: isActivePath("/profile") ? "#0F62FE" : "#000"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#EFF6FF"
                  e.currentTarget.style.color = "#0F62FE"
                  e.currentTarget.style.transform = "translateX(-4px)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isActivePath("/profile") ? "#EFF6FF" : "transparent"
                  e.currentTarget.style.color = isActivePath("/profile") ? "#0F62FE" : "#000"
                  e.currentTarget.style.transform = "translateX(0)"
                }}
              >
                <span style={{ 
                  fontSize: 20,
                  background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  display: "inline-block"
                }}>👤</span>
                <span>{t.nav.profile}</span>
              </button>

              <button
                onClick={() => navigateTo("/cuenta")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px",
                  background: isActivePath("/cuenta") ? "#EFF6FF" : "transparent",
                  border: "none",
                  borderRadius: 10,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 14,
                  fontWeight: isActivePath("/cuenta") ? 700 : 600,
                  textAlign: "left",
                  color: isActivePath("/cuenta") ? "#0F62FE" : "#000"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#EFF6FF"
                  e.currentTarget.style.color = "#0F62FE"
                  e.currentTarget.style.transform = "translateX(-4px)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isActivePath("/cuenta") ? "#EFF6FF" : "transparent"
                  e.currentTarget.style.color = isActivePath("/cuenta") ? "#0F62FE" : "#000"
                  e.currentTarget.style.transform = "translateX(0)"
                }}
              >
                <span style={{ 
                  fontSize: 20,
                  background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  display: "inline-block"
                }}>⚙️</span>
                <span>{t.nav.account}</span>
              </button>

              <button
                onClick={() => navigateTo("/configuracion")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px",
                  background: isActivePath("/configuracion") ? "#EFF6FF" : "transparent",
                  border: "none",
                  borderRadius: 10,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 14,
                  fontWeight: isActivePath("/configuracion") ? 700 : 600,
                  textAlign: "left",
                  color: isActivePath("/configuracion") ? "#0F62FE" : "#000"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#EFF6FF"
                  e.currentTarget.style.color = "#0F62FE"
                  e.currentTarget.style.transform = "translateX(-4px)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isActivePath("/configuracion") ? "#EFF6FF" : "transparent"
                  e.currentTarget.style.color = isActivePath("/configuracion") ? "#0F62FE" : "#000"
                  e.currentTarget.style.transform = "translateX(0)"
                }}
              >
                <span style={{ 
                  fontSize: 20,
                  background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  display: "inline-block"
                }}>⚙️</span>
                <span>{t.nav.settings}</span>
              </button>
            </div>
          </div>
          )}
        </div>
      </div>

      {/* Exit Confirmation Dialog */}
      {showExitDialog && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1100,
          padding: 20,
          fontFamily: "Montserrat, sans-serif"
        }}>
          <div style={{
            background: "white",
            borderRadius: 16,
            padding: "32px",
            maxWidth: 450,
            width: "100%",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)"
          }}>
            <div style={{
              fontSize: 24,
              fontWeight: 800,
              marginBottom: 16,
              background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>
              ⚠️ ¿Estás seguro?
            </div>
            
            <p style={{
              fontSize: 16,
              color: "#374151",
              lineHeight: 1.6,
              marginBottom: 24
            }}>
              Si sales ahora, se perderá tu progreso de la lección actual. ¿Deseas continuar?
            </p>

            <div style={{
              display: "flex",
              gap: 12,
              flexDirection: "column"
            }}>
              <button
                onClick={cancelExit}
                style={{
                  padding: "14px 24px",
                  background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "transform 0.2s ease",
                  boxShadow: "0 4px 12px rgba(11, 113, 254, 0.3)",
                  fontFamily: "Montserrat, sans-serif"
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
              >
                Continuar con la lección
              </button>

              <button
                onClick={confirmExit}
                style={{
                  padding: "14px 24px",
                  background: "white",
                  color: "#DC2626",
                  border: "1px solid rgba(220, 38, 38, 0.3)",
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontFamily: "Montserrat, sans-serif"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#FEF2F2"
                  e.currentTarget.style.transform = "scale(1.02)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "white"
                  e.currentTarget.style.transform = "scale(1)"
                }}
              >
                Salir de la lección
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Authentication Required Dialog */}
      {showAuthDialog && (
        <div 
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1100,
            padding: 20,
            fontFamily: "Montserrat, sans-serif",
            backdropFilter: "blur(4px)"
          }}
          onClick={() => setShowAuthDialog(false)}
        >
          <div 
            style={{
              background: "white",
              borderRadius: 20,
              padding: "40px",
              maxWidth: 480,
              width: "100%",
              boxShadow: "0 25px 70px rgba(0, 0, 0, 0.4)",
              position: "relative"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icon */}
            <div style={{
              width: 80,
              height: 80,
              margin: "0 auto 24px",
              background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              boxShadow: "0 8px 20px rgba(11, 113, 254, 0.3)"
            }}>
              🔒
            </div>

            <div style={{
              fontSize: 26,
              fontWeight: 800,
              marginBottom: 16,
              textAlign: "center",
              background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>
              ¡Crea tu cuenta gratis!
            </div>
            
            <p style={{
              fontSize: 16,
              color: "#374151",
              lineHeight: 1.7,
              marginBottom: 28,
              textAlign: "center"
            }}>
              Necesitas una cuenta para acceder a esta función. Crea tu cuenta gratis para desbloquear todas las herramientas de BIZEN, incluyendo asignaciones, seguimiento de progreso, foro y más.
            </p>

            <div style={{
              display: "flex",
              gap: 12,
              flexDirection: "column"
            }}>
              <button
                onClick={() => {
                  setShowAuthDialog(false)
                  router.push("/signup")
                }}
                style={{
                  padding: "16px 24px",
                  background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: 12,
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: "0 4px 15px rgba(11, 113, 254, 0.4)",
                  fontFamily: "Montserrat, sans-serif"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)"
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(11, 113, 254, 0.5)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = "0 4px 15px rgba(11, 113, 254, 0.4)"
                }}
              >
                Crear Cuenta Gratis
              </button>

              <button
                onClick={() => {
                  setShowAuthDialog(false)
                  router.push("/login")
                }}
                style={{
                  padding: "16px 24px",
                  background: "transparent",
                  color: "#0B71FE",
                  border: "2px solid #0B71FE",
                  borderRadius: 12,
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontFamily: "Montserrat, sans-serif"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#EFF6FF"
                  e.currentTarget.style.transform = "translateY(-1px)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent"
                  e.currentTarget.style.transform = "translateY(0)"
                }}
              >
                Ya tengo cuenta
              </button>

              <button
                onClick={() => setShowAuthDialog(false)}
                style={{
                  padding: "12px",
                  background: "transparent",
                  color: "#6B7280",
                  border: "none",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "color 0.2s ease",
                  fontFamily: "Montserrat, sans-serif"
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#374151"}
                onMouseLeave={(e) => e.currentTarget.style.color = "#6B7280"}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

