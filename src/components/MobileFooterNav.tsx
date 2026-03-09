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
  Target,
  BarChart2,
  Trophy
} from "lucide-react"

export default function MobileFooterNav() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, dbProfile, signOut } = useAuth()
  const [showExitDialog, setShowExitDialog] = useState(false)
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)
  const [showProfilePanel, setShowProfilePanel] = useState(false)

  const isAdminOrTeacher = dbProfile?.role === "school_admin" || dbProfile?.role === "teacher"
  const isStudentOrGuest = !isAdminOrTeacher

  const isOnLessonPage = pathname?.includes('/learn/')
  const protectedRoutes = ['/forum', '/profile', '/cuenta', '/configuracion', '/tienda', '/puntos', '/impacto-social', '/teacher/dashboard', '/teacher/courses']

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
  const navItems = isStudentOrGuest ? [
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
      path: "/cash-flow",
      label: "Simulador",
      icon: Gamepad2,
      active: isActivePath("/cash-flow")
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
    }
  ] : [
    {
      path: "/teacher/dashboard",
      label: "Panel escolar",
      icon: BarChart2,
      active: isActivePath("/teacher/dashboard")
    },
    {
      path: "/teacher/courses",
      label: "Mis cursos",
      icon: MapIcon,
      active: isActivePath("/teacher/courses")
    },
    {
      path: "/profile",
      label: "Perfil",
      icon: User,
      active: isActivePath("/profile") || isActivePath("/configuracion"),
      isProfileButton: true
    }
  ]

  return (
    <>
      <style jsx>{`
        .mobile-footer-container {
          z-index: 10000 !important;
          font-family: Montserrat, sans-serif !important;
          margin: 0 !important;
          box-sizing: border-box !important;
        }
        .mobile-footer-inner {
          display: flex !important;
          flex-direction: row !important;
          flex-wrap: nowrap !important;
          align-items: stretch !important;
          justify-content: space-around !important;
          height: 100% !important;
          padding: 8px 12px 0 12px !important;
          gap: 4px !important;
          width: 100% !important;
        }
        .mobile-footer-btn {
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          flex: 1 1 0 !important;
          height: auto !important;
          max-width: 64px !important;
          border: none !important;
          border-radius: 12px !important;
          cursor: pointer !important;
          padding: 6px 0 !important;
          margin: 0 !important;
          transition: all 0.2s ease !important;
        }
        .mobile-footer-icon-wrapper {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          height: 32px !important;
          width: 32px !important;
          transition: transform 0.2s ease !important;
        }
        .mobile-footer-btn.active .mobile-footer-icon-wrapper {
          transform: translateY(-2px) !important;
        }
        .mobile-footer-btn.active {
          background: rgba(15, 98, 254, 0.08) !important;
        }
        .mobile-footer-btn:not(.active) {
          background: transparent !important;
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
      <div
        className="mobile-footer-container"
        data-mobile-bottom-nav
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: "70px",
          paddingBottom: "max(12px, env(safe-area-inset-bottom, 0px))",
          boxSizing: "content-box",
          zIndex: 10000,
          transform: "translate3d(0, 0, 0)",
          WebkitTransform: "translate3d(0, 0, 0)",
          display: "block",
          background: "#FBFAF5",
          borderTop: "2px solid #0F62FE",
          boxShadow: "0 -4px 12px rgba(0, 0, 0, 0.05)"
        }}
      >
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
              <div className="mobile-footer-icon-wrapper">
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
                      frame={dbProfile?.inventory?.includes("2") ? "vip" : dbProfile?.inventory?.includes("1") ? "ambassador" : null}
                    />
                  </div>
                ) : (
                  <item.icon
                    size={24}
                    strokeWidth={item.active ? 2.5 : 2}
                    color={item.active ? "#0F62FE" : "#4b5563"}
                  />
                )}
              </div>
              <span style={{
                fontSize: "10px",
                fontWeight: 500,
                color: item.active ? "#0F62FE" : "#64748b",
                marginTop: "2px"
              }}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {showExitDialog && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0, 0, 0, 0.5)", zIndex: 10001, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }} onClick={cancelExit}>
          <div style={{ background: "white", borderRadius: 16, padding: "24px", maxWidth: "400px", width: "100%", boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)" }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: 18, fontWeight: 500, color: "#0f172a" }}>¿Salir de la lección?</h3>
            <p style={{ margin: "0 0 20px 0", fontSize: 14, color: "#64748b", lineHeight: 1.5 }}>Tu progreso se guardará automáticamente.</p>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={cancelExit} style={{ flex: 1, padding: "12px 16px", background: "#f1f5f9", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 500, color: "#0f172a" }}>Cancelar</button>
              <button onClick={confirmExit} style={{ flex: 1, padding: "12px 16px", background: "#0F62FE", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 500, color: "white" }}>Salir</button>
            </div>
          </div>
        </div>
      )}

      {showAuthDialog && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0, 0, 0, 0.5)", zIndex: 10001, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }} onClick={() => setShowAuthDialog(false)}>
          <div style={{ background: "white", borderRadius: 16, padding: "24px", maxWidth: "400px", width: "100%", boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)" }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: 18, fontWeight: 500, color: "#0f172a" }}>Inicia sesión</h3>
            <p style={{ margin: "0 0 20px 0", fontSize: 14, color: "#64748b", lineHeight: 1.5 }}>¿Necesitas iniciar sesión? Inicia sesión para acceder a esta sección.</p>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setShowAuthDialog(false)} style={{ flex: 1, padding: "12px 16px", background: "#f1f5f9", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 500, color: "#0f172a" }}>Cancelar</button>
              <button onClick={() => window.open("/login", "_blank")} style={{ flex: 1, padding: "12px 16px", background: "#0F62FE", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 500, color: "white" }}>Iniciar sesión</button>
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
              {isStudentOrGuest && (
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
                    fontWeight: 500,
                    color: "#0f172a",
                    width: "100%",
                    textAlign: "left"
                  }}
                >
                  <ShoppingBag size={20} color="#0F62FE" />
                  <span>Tienda</span>
                </button>
              )}

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
                  fontWeight: 500,
                  color: "#0f172a",
                  width: "100%",
                  textAlign: "left"
                }}
              >
                <Settings size={20} color="#0F62FE" />
                <span>Configuración</span>
              </button>

              {isStudentOrGuest && (
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
                    fontWeight: 500,
                    color: "#0f172a",
                    width: "100%",
                    textAlign: "left"
                  }}
                >
                  <Star size={20} color="#0F62FE" />
                  <span>Mis Puntos</span>
                </button>
              )}

              {isStudentOrGuest && (
                <button
                  onClick={() => {
                    setShowProfilePanel(false)
                    navigateTo("/rankings")
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
                    fontWeight: 500,
                    color: "#0f172a",
                    width: "100%",
                    textAlign: "left"
                  }}
                >
                  <Trophy size={20} color="#0F62FE" />
                  <span>Rankings</span>
                </button>
              )}

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
                  fontWeight: 500,
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
                  fontWeight: 500,
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
                    fontWeight: 500,
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
