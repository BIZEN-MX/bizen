"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

interface DashboardStats {
  coursesEnrolled: number
  lessonsCompleted: number
  currentStreak: number
  totalPoints: number
}

export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [showExitDialog, setShowExitDialog] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useAuth()

  const isOnLessonPage = pathname?.includes('/learn/')

  useEffect(() => {
    if (user) {
      setStats({ coursesEnrolled: 2, lessonsCompleted: 15, currentStreak: 7, totalPoints: 450 })
    }
  }, [user])

  const toggleMenu = () => setIsOpen(!isOpen)

  const navigateTo = (path: string) => {
    if (isOnLessonPage) {
      setPendingNavigation(path)
      setShowExitDialog(true)
    } else {
      setIsOpen(false)
      router.push(path)
    }
  }

  const confirmExit = () => {
    setShowExitDialog(false)
    setIsOpen(false)
    if (pendingNavigation) { router.push(pendingNavigation); setPendingNavigation(null) }
  }

  const cancelExit = () => { setShowExitDialog(false); setPendingNavigation(null) }

  const navItems = [
    { icon: "📚", label: "Aprende finanzas", path: "/courses" },
    { icon: "📝", label: "Asignaciones", path: "/assignments" },
    { icon: "🌍", label: "Mi Impacto social", path: "/impacto-social" },
  ]

  const accountItems = [
    { icon: "👤", label: "Perfil", path: "/profile" },
    { icon: "⚙️", label: "Cuenta", path: "/account" },
    { icon: "🔧", label: "Configuración", path: "/settings" },
  ]

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        style={{
          background: "none", border: "none", cursor: "pointer",
          padding: 8, display: "flex", flexDirection: "column", gap: 5,
          zIndex: 1001, transition: "all 0.3s ease"
        }}
        aria-label="Menu"
      >
        {[
          { transform: isOpen ? "rotate(45deg) translateY(8px)" : "none" },
          { opacity: isOpen ? 0 : 1, transform: "none" },
          { transform: isOpen ? "rotate(-45deg) translateY(-8px)" : "none" },
        ].map((style, i) => (
          <div key={i} style={{
            width: 26, height: 2.5,
            background: "#fff",
            borderRadius: 2,
            transition: "all 0.3s ease",
            ...style
          }} />
        ))}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(4px)",
            zIndex: 999,
            animation: "hm-fadeIn 0.2s ease"
          }}
        />
      )}

      {/* Menu Panel */}
      <div style={{
        position: "fixed", top: 0, right: isOpen ? 0 : "-420px",
        width: "min(380px, 90vw)", height: "100dvh",
        background: "linear-gradient(160deg, #020e27 0%, #041640 50%, #061a4a 100%)",
        boxShadow: "-2px 0 40px rgba(0,0,0,0.5)",
        zIndex: 1000, transition: "right 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        overflowY: "auto", overflowX: "hidden",
        fontFamily: "Montserrat, sans-serif",
      }}>
        {/* Decorative blobs */}
        <div aria-hidden style={{ position: "absolute", top: "-60px", right: "-60px", width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,86,231,0.25) 0%, transparent 70%)", filter: "blur(30px)", pointerEvents: "none" }} />
        <div aria-hidden style={{ position: "absolute", bottom: "10%", left: "-40px", width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(25,131,253,0.15) 0%, transparent 70%)", filter: "blur(24px)", pointerEvents: "none" }} />

        {/* Grid overlay */}
        <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0,86,231,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,86,231,0.06) 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />

        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          style={{
            position: "absolute", top: 20, right: 20,
            width: 40, height: 40, borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "#fff", fontSize: 18, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 0.2s", zIndex: 2
          }}
          onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
          onMouseOut={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
          aria-label="Cerrar menú"
        >
          ✕
        </button>

        <div style={{ padding: "72px 24px 32px", position: "relative", zIndex: 1 }}>
          {/* Brand */}
          <div style={{ marginBottom: 28 }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
              BIZEN<span style={{ color: "#1983FD" }}>.</span>
            </span>
          </div>

          {/* User Greeting */}
          {user && (
            <div style={{
              marginBottom: 28, padding: "16px 18px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 14,
              backdropFilter: "blur(8px)"
            }}>
              <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.45)", letterSpacing: "0.05em", textTransform: "uppercase", fontFamily: "Inter, sans-serif" }}>
                Bienvenido de nuevo
              </p>
              <p style={{ margin: "4px 0 0", fontSize: 17, fontWeight: 700, color: "#fff" }}>
                {user.user_metadata?.full_name || user.email?.split('@')[0] || 'Estudiante'} 👋
              </p>
            </div>
          )}

          {/* Stats */}
          {stats && (
            <div style={{ marginBottom: 28 }}>
              <p style={{ margin: "0 0 12px", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "Inter, sans-serif" }}>
                Tu Progreso
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { value: stats.coursesEnrolled, label: "Cursos", color: "#1983FD" },
                  { value: stats.lessonsCompleted, label: "Lecciones", color: "#22c55e" },
                  { value: `🔥 ${stats.currentStreak}`, label: "Racha", color: "#f59e0b" },
                  { value: stats.totalPoints, label: "Puntos", color: "#a78bfa" },
                ].map((stat, i) => (
                  <div key={i} style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 12, padding: "14px 12px",
                    textAlign: "center"
                  }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: stat.color, fontFamily: "Montserrat, sans-serif" }}>{stat.value}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 4, fontFamily: "Inter, sans-serif" }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nav Items */}
          <div style={{ marginBottom: 24 }}>
            <p style={{ margin: "0 0 12px", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "Inter, sans-serif" }}>
              Acciones Rápidas
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigateTo(item.path)}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "14px 16px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 12, cursor: "pointer",
                    transition: "all 0.2s ease",
                    fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 600,
                    color: "#fff", textAlign: "left", width: "100%"
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.background = "rgba(0,86,231,0.2)"; e.currentTarget.style.borderColor = "rgba(25,131,253,0.3)"; e.currentTarget.style.transform = "translateX(4px)" }}
                  onMouseOut={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = "translateX(0)" }}
                >
                  <span style={{ fontSize: 20 }}>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Account Items */}
          <div style={{ marginBottom: 24 }}>
            <p style={{ margin: "0 0 12px", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "Inter, sans-serif" }}>
              Cuenta
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {accountItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigateTo(item.path)}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "12px 16px",
                    background: "transparent", border: "none", borderRadius: 10,
                    cursor: "pointer", transition: "all 0.2s ease",
                    fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 500,
                    color: "rgba(255,255,255,0.7)", textAlign: "left", width: "100%"
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.transform = "translateX(4px)" }}
                  onMouseOut={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; e.currentTarget.style.transform = "translateX(0)" }}
                >
                  <span style={{ fontSize: 18 }}>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "8px 0 20px" }} />

          {/* Email */}
          {user?.email && (
            <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.3)", fontFamily: "Inter, sans-serif", textAlign: "center" }}>
              {user.email}
            </p>
          )}
        </div>
      </div>

      {/* Exit Confirmation Dialog */}
      {showExitDialog && (
        <div style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1100, padding: 20, fontFamily: "Montserrat, sans-serif"
        }}>
          <div style={{
            background: "linear-gradient(160deg, #041640, #0a1f5c)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 20, padding: "32px",
            maxWidth: 420, width: "100%",
            boxShadow: "0 24px 64px rgba(0,0,0,0.5)"
          }}>
            <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 12, color: "#fff" }}>
              ⚠️ ¿Estás seguro?
            </div>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, marginBottom: 24 }}>
              Si sales ahora, se perderá tu progreso de la lección actual. ¿Deseas continuar?
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                onClick={cancelExit}
                style={{
                  padding: "14px", background: "linear-gradient(135deg, #0056E7, #1983FD)",
                  color: "#fff", border: "none", borderRadius: 12,
                  fontSize: 15, fontWeight: 700, cursor: "pointer",
                  boxShadow: "0 6px 16px rgba(0,86,231,0.4)", fontFamily: "Montserrat, sans-serif",
                  transition: "transform 0.2s"
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
              >
                Continuar con la lección
              </button>
              <button
                onClick={confirmExit}
                style={{
                  padding: "14px",
                  background: "rgba(220,38,38,0.1)",
                  color: "#f87171", border: "1px solid rgba(220,38,38,0.25)",
                  borderRadius: 12, fontSize: 15, fontWeight: 700,
                  cursor: "pointer", fontFamily: "Montserrat, sans-serif",
                  transition: "all 0.2s"
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = "rgba(220,38,38,0.2)" }}
                onMouseOut={(e) => { e.currentTarget.style.background = "rgba(220,38,38,0.1)" }}
              >
                Salir de la lección
              </button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes hm-fadeIn { from { opacity: 0; } to { opacity: 1; } }
      ` }} />
    </>
  )
}
