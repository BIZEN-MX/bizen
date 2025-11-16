"use client"

import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useSettings } from "@/contexts/SettingsContext"
import { useTranslation } from "@/lib/translations"
import Image from "next/image"
import { useState } from "react"
import { haptic } from "@/utils/hapticFeedback"

export default function MobileBottomNav() {
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useAuth()
  const { settings } = useSettings()
  const t = useTranslation(settings.language)
  const [showAuthDialog, setShowAuthDialog] = useState(false)

  // Protected routes that require authentication
  const protectedRoutes = ['/assignments', '/progress', '/forum', '/profile', '/cuenta', '/configuracion']

  const isActivePath = (path: string) => {
    if (path === '/courses') {
      return pathname === path
    }
    return pathname === path || pathname.startsWith(path + '/')
  }

  const navigateTo = (path: string) => {
    // Check if route requires auth and user is not authenticated
    if (!user && protectedRoutes.some(route => path.startsWith(route))) {
      haptic.medium()
      setShowAuthDialog(true)
      return
    }
    haptic.light()
    router.push(path)
  }

  // Main navigation items (always visible)
  const navItems = [
    {
      id: 'courses',
      label: 'Cursos',
      icon: '📚',
      path: '/courses',
      protected: false
    },
    {
      id: 'business-lab',
      label: 'Business Lab',
      icon: '💼',
      path: '/business-lab',
      protected: false
    },
    {
      id: 'cash-flow',
      label: 'Cash Flow',
      icon: '💰',
      path: '/cash-flow',
      protected: false
    },
    {
      id: 'simuladores',
      label: 'Simuladores',
      icon: '$',
      path: '/simuladores',
      protected: false
    }
  ]

  // Additional navigation items for authenticated users
  const additionalNavItems = user ? [
    {
      id: 'assignments',
      label: 'Asignaciones',
      icon: '✏️',
      path: '/assignments',
      protected: true
    },
    {
      id: 'progress',
      label: 'Progreso',
      icon: '🏆',
      path: '/progress',
      protected: true
    },
    {
      id: 'forum',
      label: 'Foro',
      icon: '💬',
      path: '/forum',
      protected: true
    }
  ] : []

  // Account button (only for unauthenticated users)
  const accountItem = !user ? {
    id: 'signup',
    label: 'Crear Cuenta',
    icon: '✨',
    path: '/signup',
    protected: false
  } : null

  // More menu items (for authenticated users)
  const moreMenuItems = user ? [
    {
      id: 'profile',
      label: 'Perfil',
      icon: '👤',
      path: '/profile',
      protected: true
    },
    {
      id: 'account',
      label: 'Cuenta',
      icon: '⚙️',
      path: '/cuenta',
      protected: true
    },
    {
      id: 'settings',
      label: 'Configuración',
      icon: '🔧',
      path: '/configuracion',
      protected: true
    }
  ] : []
  
  const [showMoreMenu, setShowMoreMenu] = useState(false)

  return (
    <>
      {/* Mobile Bottom Navigation - Only visible on mobile */}
      <nav 
        data-mobile-bottom-nav
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: "70px",
          background: "linear-gradient(180deg, #E0F2FE 0%, #DBEAFE 50%, #BFDBFE 100%)",
          borderTop: "2px solid rgba(15, 98, 254, 0.2)",
          boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.1)",
          zIndex: 10000, // Higher than FixedSidebar (1000) and GlobalLogo (1001)
          display: "none", // Hidden by default, shown via CSS media query
          paddingBottom: "calc(8px + env(safe-area-inset-bottom))",
          paddingTop: "8px",
          fontFamily: "Montserrat, sans-serif"
        }}
      >
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          width: "100%",
          padding: "0 4px",
          gap: "4px",
          overflow: "hidden" // Prevent any scrolling
        }}>
          
          {/* Main nav items */}
          {navItems.map((item) => {
            const isActive = isActivePath(item.path)
            return (
              <button
                key={item.id}
                onClick={() => navigateTo(item.path)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                  padding: "6px 4px",
                  background: isActive ? "rgba(15, 98, 254, 0.15)" : "transparent",
                  border: "none",
                  borderRadius: 10,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  minWidth: "50px",
                  flex: "1 1 0",
                  maxWidth: "none"
                }}
                onTouchStart={(e) => {
                  e.currentTarget.style.transform = "scale(0.95)"
                  e.currentTarget.style.background = isActive ? "rgba(15, 98, 254, 0.25)" : "rgba(15, 98, 254, 0.1)"
                  e.preventDefault() // Prevent any default touch behaviors
                }}
                onTouchEnd={(e) => {
                  e.currentTarget.style.transform = "scale(1)"
                  e.currentTarget.style.background = isActive ? "rgba(15, 98, 254, 0.15)" : "transparent"
                }}
                onTouchCancel={(e) => {
                  e.currentTarget.style.transform = "scale(1)"
                  e.currentTarget.style.background = isActive ? "rgba(15, 98, 254, 0.15)" : "transparent"
                }}
              >
                <span style={{
                  fontSize: 20,
                  display: "inline-block",
                  filter: isActive ? "none" : "opacity(0.6)"
                }}>
                  {item.icon}
                </span>
                <span style={{
                  fontSize: 9,
                  fontWeight: isActive ? 700 : 600,
                  color: isActive ? "#0F62FE" : "#374151",
                  textAlign: "center",
                  lineHeight: 1.1
                }}>
                  {item.label}
                </span>
              </button>
            )
          })}

          {/* Additional nav items for authenticated users */}
          {additionalNavItems.map((item) => {
            const isActive = isActivePath(item.path)
            return (
              <button
                key={item.id}
                onClick={() => navigateTo(item.path)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                  padding: "6px 4px",
                  background: isActive ? "rgba(15, 98, 254, 0.15)" : "transparent",
                  border: "none",
                  borderRadius: 10,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  minWidth: "50px",
                  flex: "1 1 0",
                  maxWidth: "none"
                }}
                onTouchStart={(e) => {
                  e.currentTarget.style.transform = "scale(0.95)"
                  e.currentTarget.style.background = isActive ? "rgba(15, 98, 254, 0.25)" : "rgba(15, 98, 254, 0.1)"
                  e.preventDefault()
                }}
                onTouchEnd={(e) => {
                  e.currentTarget.style.transform = "scale(1)"
                  e.currentTarget.style.background = isActive ? "rgba(15, 98, 254, 0.15)" : "transparent"
                }}
                onTouchCancel={(e) => {
                  e.currentTarget.style.transform = "scale(1)"
                  e.currentTarget.style.background = isActive ? "rgba(15, 98, 254, 0.15)" : "transparent"
                }}
              >
                <span style={{
                  fontSize: 20,
                  display: "inline-block",
                  filter: isActive ? "none" : "opacity(0.6)"
                }}>
                  {item.icon}
                </span>
                <span style={{
                  fontSize: 9,
                  fontWeight: isActive ? 700 : 600,
                  color: isActive ? "#0F62FE" : "#374151",
                  textAlign: "center",
                  lineHeight: 1.1
                }}>
                  {item.label}
                </span>
              </button>
            )
          })}

          {/* Account button (only for unauthenticated users) */}
          {accountItem && (
            <button
              onClick={() => navigateTo(accountItem.path)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
                padding: "8px 12px",
                background: isActivePath(accountItem.path) ? "rgba(15, 98, 254, 0.15)" : "transparent",
                border: "none",
                borderRadius: 12,
                cursor: "pointer",
                transition: "all 0.2s ease",
                minWidth: "60px",
                width: "60px",
                flexShrink: 0
              }}
              onTouchStart={(e) => {
                e.currentTarget.style.transform = "scale(0.95)"
                e.currentTarget.style.background = isActivePath(accountItem.path) ? "rgba(15, 98, 254, 0.25)" : "rgba(15, 98, 254, 0.1)"
                e.preventDefault()
              }}
              onTouchEnd={(e) => {
                e.currentTarget.style.transform = "scale(1)"
                e.currentTarget.style.background = isActivePath(accountItem.path) ? "rgba(15, 98, 254, 0.15)" : "transparent"
              }}
              onTouchCancel={(e) => {
                e.currentTarget.style.transform = "scale(1)"
                e.currentTarget.style.background = isActivePath(accountItem.path) ? "rgba(15, 98, 254, 0.15)" : "transparent"
              }}
            >
              <span style={{
                fontSize: 24,
                background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                display: "inline-block",
                filter: isActivePath(accountItem.path) ? "none" : "opacity(0.6)"
              }}>
                {accountItem.icon}
              </span>
              <span style={{
                fontSize: 10,
                fontWeight: isActivePath(accountItem.path) ? 700 : 600,
                color: isActivePath(accountItem.path) ? "#0F62FE" : "#374151",
                textAlign: "center",
                lineHeight: 1.2
              }}>
                {accountItem.label}
              </span>
            </button>
          )}

          {/* More menu button for authenticated users (Perfil, Cuenta, Configuración) */}
          {moreMenuItems.length > 0 && (
            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
                padding: "8px 12px",
                background: showMoreMenu ? "rgba(15, 98, 254, 0.15)" : "transparent",
                border: "none",
                borderRadius: 12,
                cursor: "pointer",
                transition: "all 0.2s ease",
                minWidth: "60px",
                width: "60px",
                flexShrink: 0
              }}
              onTouchStart={(e) => {
                e.currentTarget.style.transform = "scale(0.95)"
                e.currentTarget.style.background = showMoreMenu ? "rgba(15, 98, 254, 0.25)" : "rgba(15, 98, 254, 0.1)"
                e.preventDefault()
              }}
              onTouchEnd={(e) => {
                e.currentTarget.style.transform = "scale(1)"
                e.currentTarget.style.background = showMoreMenu ? "rgba(15, 98, 254, 0.15)" : "transparent"
              }}
              onTouchCancel={(e) => {
                e.currentTarget.style.transform = "scale(1)"
                e.currentTarget.style.background = showMoreMenu ? "rgba(15, 98, 254, 0.15)" : "transparent"
              }}
            >
              <span style={{
                fontSize: 20,
                display: "inline-block",
                filter: showMoreMenu ? "none" : "opacity(0.6)",
                transform: showMoreMenu ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease"
              }}>
                ⋯
              </span>
              <span style={{
                fontSize: 9,
                fontWeight: showMoreMenu ? 700 : 600,
                color: showMoreMenu ? "#0F62FE" : "#374151",
                textAlign: "center",
                lineHeight: 1.1
              }}>
                Más
              </span>
            </button>
          )}
        </div>
      </nav>

      {/* More Menu Popup */}
      {showMoreMenu && moreMenuItems.length > 0 && (
        <>
          <div
            style={{
              position: "fixed",
              bottom: "80px",
              right: "16px",
              background: "white",
              borderRadius: 16,
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
              padding: "12px",
              zIndex: 10001,
              minWidth: "160px",
              fontFamily: "Montserrat, sans-serif",
              border: "2px solid rgba(15, 98, 254, 0.1)",
              animation: "slideUpFade 0.2s ease-out"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {moreMenuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  haptic.light()
                  navigateTo(item.path)
                  setShowMoreMenu(false)
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 16px",
                  background: isActivePath(item.path) ? "rgba(15, 98, 254, 0.1)" : "transparent",
                  border: "none",
                  borderRadius: 10,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  width: "100%",
                  textAlign: "left",
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 14,
                  fontWeight: isActivePath(item.path) ? 700 : 600,
                  color: isActivePath(item.path) ? "#0F62FE" : "#374151"
                }}
                onTouchStart={(e) => {
                  e.currentTarget.style.background = "rgba(15, 98, 254, 0.15)"
                }}
                onTouchEnd={(e) => {
                  e.currentTarget.style.background = isActivePath(item.path) ? "rgba(15, 98, 254, 0.1)" : "transparent"
                }}
              >
                <span style={{
                  fontSize: 20,
                  background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  display: "inline-block"
                }}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Click outside to close more menu */}
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 10000,
              background: "transparent"
            }}
            onClick={() => setShowMoreMenu(false)}
          />
        </>
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
            zIndex: 10001, // Above mobile nav (10000)
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
              width: "100%",
              maxWidth: "480px",
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

      {/* CSS to show mobile nav only on mobile */}
      <style>{`
        @media (max-width: 767px) {
          [data-mobile-bottom-nav] {
            display: flex !important;
          }
        }
        @media (min-width: 768px) {
          [data-mobile-bottom-nav] {
            display: none !important;
          }
        }
      `}</style>
    </>
  )
}

