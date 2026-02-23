"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { AvatarDisplay } from "@/components/AvatarDisplay"
import Image from "next/image"
import {
  Map as MapIcon,
  Gamepad2,
  ShoppingBag,
  MessageSquare,
  User,
  Settings,
  Star,
  Heart,
  LogIn,
  Target
} from "lucide-react"

export default function MobileFooterNav() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const [showExitDialog, setShowExitDialog] = useState(false)
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)
  const [showProfilePanel, setShowProfilePanel] = useState(false)

  const isOnLessonPage = pathname?.includes('/learn/')
  const protectedRoutes = ['/forum', '/profile', '/cuenta', '/configuracion', '/tienda', '/puntos', '/impacto-social']

  const navigateTo = (path: string) => {
    if (!user && protectedRoutes.some(route => path.startsWith(route))) {
      setShowAuthDialog(true)
      return
    }
    if (isOnLessonPage) {
      setPendingNavigation(path)
      setShowExitDialog(true)
    } else {
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

  const isActivePath = (path: string) => {
    if (path === '/courses') return pathname === path
    if (path === '/configuracion') {
      return pathname === '/cuenta' || pathname === '/configuracion' || pathname?.startsWith('/cuenta/') || pathname?.startsWith('/configuracion/')
    }
    return pathname === path || pathname.startsWith(path + '/')
  }

  // Business Lab hidden for now — add back { path: "/business-lab", ... } to show again
  const navItems = [
    {
      path: "/courses",
      label: "Cursos",
      icon: MapIcon,
      active: isActivePath("/courses")
    },
    {
      path: "/reto-diario",
      label: "Reto",
      icon: Target,
      active: isActivePath("/reto-diario")
    },
    {
      path: "/simulador",
      label: "Simulador",
      icon: Gamepad2,
      active: isActivePath("/simulador")
    },

    {
      path: "/forum",
      label: "Foro",
      icon: MessageSquare,
      active: isActivePath("/forum")
    },
    {
      path: "/profile",
      label: "Perfil",
      icon: User,
      active: isActivePath("/profile") || isActivePath("/configuracion"),
      isProfileButton: true
    },
  ]

  return (
    <>
      <style jsx>{`
        .mobile-footer-container {
          position: fixed !important;
          bottom: 0 !important;
          left: 0 !important;
          right: 0 !important;
          width: 100vw !important;
          height: calc(65px + max(env(safe-area-inset-bottom), 0px)) !important;
          padding-bottom: max(env(safe-area-inset-bottom), 0px) !important;
          background: #FBFAF5 !important;
          border-top: 2px solid #0F62FE !important;
          box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.05) !important;
          z-index: 10000 !important;
          font-family: Montserrat, sans-serif !important;
          display: block !important;
          margin: 0 !important;
          transform: translateZ(0) !important;
          -webkit-transform: translateZ(0) !important;
          will-change: transform !important;
        }
        .mobile-footer-inner {
          display: flex !important;
          flex-direction: row !important;
          flex-wrap: nowrap !important;
          align-items: center !important;
          justify-content: space-around !important;
          height: 100% !important;
          padding: 0 4px !important;
          gap: 2px !important;
          width: 100% !important;
        }
        .mobile-footer-btn {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          flex: 1 1 0 !important;
          height: 50px !important;
          max-width: 60px !important;
          min-width: 35px !important;
          border: none !important;
          border-radius: 8px !important;
          cursor: pointer !important;
          padding: 0 !important;
          margin: 0 !important;
          flex-shrink: 1 !important;
        }
        .mobile-footer-icon {
          width: 40px !important;
          height: 40px !important;
        }
        .mobile-footer-btn.active {
          background: #EFF6FF !important;
        }
        .mobile-footer-btn:not(.active) {
          background: transparent !important;
        }
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>

      <div className="mobile-footer-container" data-bizen-tour="navigation">
        <div className="mobile-footer-inner">
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                if (item.isProfileButton) {
                  setShowProfilePanel(true)
                } else {
                  navigateTo(item.path)
                }
              }}
              className={`mobile-footer-btn ${item.active ? 'active' : ''}`}
            >
              {item.isProfileButton && user ? (
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: user?.user_metadata?.avatar?.gradient || user?.user_metadata?.avatar?.bgColor
                    ? "transparent"
                    : "linear-gradient(135deg, #0F62FE 0%, #10B981 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  border: item.active ? "2px solid #0F62FE" : "none",
                  boxSizing: "border-box"
                }}>
                  <AvatarDisplay
                    avatar={user?.user_metadata?.avatar || { type: "emoji", value: (user?.user_metadata?.full_name || user?.email || "U")[0].toUpperCase() }}
                    size={32}
                  />
                </div>
              ) : (
                <item.icon
                  size={24}
                  strokeWidth={item.active ? 2.5 : 2}
                  color={item.active ? "#0F62FE" : "#4b5563"}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {showExitDialog && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0, 0, 0, 0.5)", zIndex: 10001, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }} onClick={cancelExit}>
          <div style={{ background: "white", borderRadius: 16, padding: "24px", maxWidth: "400px", width: "100%", boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)" }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: 18, fontWeight: 700, color: "#0f172a" }}>¿Salir de la lección?</h3>
            <p style={{ margin: "0 0 20px 0", fontSize: 14, color: "#64748b", lineHeight: 1.5 }}>Tu progreso se guardará automáticamente.</p>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={cancelExit} style={{ flex: 1, padding: "12px 16px", background: "#f1f5f9", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#0f172a" }}>Cancelar</button>
              <button onClick={confirmExit} style={{ flex: 1, padding: "12px 16px", background: "#0F62FE", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 600, color: "white" }}>Salir</button>
            </div>
          </div>
        </div>
      )}

      {showAuthDialog && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0, 0, 0, 0.5)", zIndex: 10001, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }} onClick={() => setShowAuthDialog(false)}>
          <div style={{ background: "white", borderRadius: 16, padding: "24px", maxWidth: "400px", width: "100%", boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)" }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: 18, fontWeight: 700, color: "#0f172a" }}>Inicia sesión</h3>
            <p style={{ margin: "0 0 20px 0", fontSize: 14, color: "#64748b", lineHeight: 1.5 }}>¿Necesitas iniciar sesión? Inicia sesión para acceder a esta sección.</p>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setShowAuthDialog(false)} style={{ flex: 1, padding: "12px 16px", background: "#f1f5f9", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#0f172a" }}>Cancelar</button>
              <button onClick={() => window.open("/login", "_blank")} style={{ flex: 1, padding: "12px 16px", background: "#0F62FE", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 600, color: "white" }}>Iniciar sesión</button>
            </div>
          </div>
        </div>
      )}

      {showProfilePanel && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: 10001,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            padding: "0"
          }}
          onClick={() => setShowProfilePanel(false)}
        >
          <div
            style={{
              background: "#FBFAF5",
              borderRadius: "20px 20px 0 0",
              padding: "24px",
              width: "100%",
              maxWidth: "100%",
              boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.15)",
              animation: "slideUp 0.3s ease-out",
              borderTop: "2px solid #0F62FE"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              width: "40px",
              height: "4px",
              background: "#d1d5db",
              borderRadius: "2px",
              margin: "0 auto 20px auto"
            }} />

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <button
                onClick={() => {
                  setShowProfilePanel(false)
                  navigateTo("/tienda")
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "16px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#0f172a",
                  width: "100%",
                  textAlign: "left"
                }}
              >
                <ShoppingBag size={20} color="#0F62FE" />
                <span>Tienda</span>
              </button>

              <button
                onClick={() => {
                  setShowProfilePanel(false)
                  navigateTo("/configuracion")
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "16px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#0f172a",
                  width: "100%",
                  textAlign: "left"
                }}
              >
                <Settings size={20} color="#0F62FE" />
                <span>Configuración</span>
              </button>

              <button
                onClick={() => {
                  setShowProfilePanel(false)
                  navigateTo("/puntos")
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "16px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#0f172a",
                  width: "100%",
                  textAlign: "left"
                }}
              >
                <Star size={20} color="#0F62FE" />
                <span>Mis Puntos</span>
              </button>

              <button
                onClick={() => {
                  setShowProfilePanel(false)
                  navigateTo("/impacto-social")
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "16px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#0f172a",
                  width: "100%",
                  textAlign: "left"
                }}
              >
                <Heart size={20} color="#0F62FE" />
                <span>Mi Impacto Social</span>
              </button>

              <button
                onClick={() => {
                  setShowProfilePanel(false)
                  navigateTo("/profile")
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "16px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#0f172a",
                  width: "100%",
                  textAlign: "left"
                }}
              >
                <User size={20} color="#0F62FE" />
                <span>Perfil</span>
              </button>

              {user && (
                <button
                  onClick={async () => {
                    setShowProfilePanel(false)
                    try {
                      await signOut()
                      router.push("/")
                    } catch (error) {
                      console.error("Error signing out:", error)
                    }
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "16px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#0f172a",
                    width: "100%",
                    textAlign: "center",
                    justifyContent: "center"
                  }}
                >
                  <LogIn size={20} color="#DC2626" />
                  <span style={{ color: "#DC2626" }}>Cerrar sesión</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
