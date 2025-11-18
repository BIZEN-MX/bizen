"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { AvatarDisplay } from "@/components/AvatarDisplay"
import Image from "next/image"

export default function MobileFooterNav() {
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useAuth()
  const [showExitDialog, setShowExitDialog] = useState(false)
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)

  const isOnLessonPage = pathname?.includes('/learn/')
  const protectedRoutes = ['/assignments', '/progress', '/forum', '/profile', '/cuenta', '/configuracion']

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

  const navItems = [
    { path: "/courses", icon: "/rightmenucourses.png", active: isActivePath("/courses") },
    { path: "/business-lab", icon: "/rightmenubusinesslab.png", active: isActivePath("/business-lab") },
    { path: "/cash-flow", icon: "/rightmenucashflow.png", active: isActivePath("/cash-flow") },
    { path: "/simuladores", icon: "/rightmenusimulators.png", active: isActivePath("/simuladores") },
    { path: "/progress", icon: "/rightmenuprogress.png", active: isActivePath("/progress") },
    { path: "/forum", icon: "/rightmenuforo.png", active: isActivePath("/forum") },
    { path: "/profile", icon: "avatar", active: isActivePath("/profile") },
    { path: "/configuracion", icon: "/rightmenusettings.png", active: isActivePath("/configuracion") },
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
          height: calc(65px + env(safe-area-inset-bottom)) !important;
          padding-bottom: env(safe-area-inset-bottom) !important;
          background: linear-gradient(180deg, #E0F2FE 0%, #DBEAFE 50%, #BFDBFE 100%) !important;
          border-top: 2px solid rgba(15, 98, 254, 0.2) !important;
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1) !important;
          z-index: 10000 !important;
          font-family: Montserrat, sans-serif !important;
          display: block !important;
          margin: 0 !important;
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
        .mobile-footer-btn.active {
          background: #EFF6FF !important;
        }
        .mobile-footer-btn:not(.active) {
          background: transparent !important;
        }
      `}</style>

      <div className="mobile-footer-container">
        <div className="mobile-footer-inner">
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigateTo(item.path)}
              className={`mobile-footer-btn ${item.active ? 'active' : ''}`}
            >
              {item.icon === "avatar" && user ? (
                <div style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: user?.user_metadata?.avatar?.gradient || user?.user_metadata?.avatar?.bgColor 
                    ? "transparent" 
                    : "linear-gradient(135deg, #0F62FE 0%, #10B981 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}>
                  <AvatarDisplay 
                    avatar={user?.user_metadata?.avatar || { type: "emoji", value: (user?.user_metadata?.full_name || user?.email || "U")[0].toUpperCase() }} 
                    size={30} 
                  />
                </div>
              ) : item.icon === "avatar" ? (
                <Image 
                  src="/rightmenusettings.png" 
                  alt="Profile" 
                  width={30} 
                  height={30}
                  style={{ width: 30, height: 30, objectFit: "contain" }}
                />
              ) : (
                <Image 
                  src={item.icon} 
                  alt={item.path} 
                  width={30} 
                  height={30}
                  style={{ width: 30, height: 30, objectFit: "contain" }}
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
            <p style={{ margin: "0 0 20px 0", fontSize: 14, color: "#64748b", lineHeight: 1.5 }}>Necesitas iniciar sesión para acceder a esta sección.</p>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setShowAuthDialog(false)} style={{ flex: 1, padding: "12px 16px", background: "#f1f5f9", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#0f172a" }}>Cancelar</button>
              <button onClick={() => router.push("/login")} style={{ flex: 1, padding: "12px 16px", background: "#0F62FE", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 600, color: "white" }}>Iniciar sesión</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
