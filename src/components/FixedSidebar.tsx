"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import Card from "@/components/ui/Card"

interface DashboardStats {
  coursesEnrolled: number
  lessonsCompleted: number
  currentStreak: number
  totalPoints: number
}

export default function FixedSidebar() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      // TODO: Fetch real stats from API
      setStats({
        coursesEnrolled: 2,
        lessonsCompleted: 15,
        currentStreak: 7,
        totalPoints: 450
      })
    }
  }, [user])

  const navigateTo = (path: string) => {
    router.push(path)
  }

  return (
    <>
      {/* Fixed Sidebar Panel */}
      <div style={{
        position: "fixed",
        top: 72,
        right: 0,
        width: 280,
        height: "calc(100vh - 72px)",
        background: "#fff",
        boxShadow: "-4px 0 20px rgba(0, 0, 0, 0.1)",
        zIndex: 1000,
        overflowY: "auto",
        fontFamily: "Montserrat, sans-serif",
        borderLeft: "1px solid rgba(15, 98, 254, 0.1)"
      }}>
        <div style={{ padding: "24px 20px" }}>
          {/* User Greeting */}
          {user && (
            <div style={{ marginBottom: 24 }}>
              <h2 style={{
                margin: 0,
                fontSize: 20,
                fontWeight: 800,
                background: "linear-gradient(135deg, #0F62FE 0%, #10B981 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}>
                ¡Hola, {user.user_metadata?.full_name || user.email?.split('@')[0] || 'Estudiante'}!
              </h2>
            </div>
          )}

          {/* Stats Section */}
          {stats && (
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ 
                margin: "0 0 12px", 
                fontSize: 14, 
                fontWeight: 700,
                color: "#666",
                textTransform: "uppercase",
                letterSpacing: "1px"
              }}>
                Tu Progreso
              </h3>
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10
              }}>
                <Card style={{ textAlign: "center", padding: "12px 8px" }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "#0F62FE" }}>{stats.coursesEnrolled}</div>
                  <div style={{ fontSize: 11, color: "#666", marginTop: 4 }}>Cursos</div>
                </Card>
                <Card style={{ textAlign: "center", padding: "12px 8px" }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "#10B981" }}>{stats.lessonsCompleted}</div>
                  <div style={{ fontSize: 11, color: "#666", marginTop: 4 }}>Lecciones</div>
                </Card>
                <Card style={{ textAlign: "center", padding: "12px 8px" }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "#F59E0B" }}>🔥 {stats.currentStreak}</div>
                  <div style={{ fontSize: 11, color: "#666", marginTop: 4 }}>Racha</div>
                </Card>
                <Card style={{ textAlign: "center", padding: "12px 8px" }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "#8B5CF6" }}>{stats.totalPoints}</div>
                  <div style={{ fontSize: 11, color: "#666", marginTop: 4 }}>Puntos</div>
                </Card>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ 
              margin: "0 0 12px", 
              fontSize: 14, 
              fontWeight: 700,
              color: "#666",
              textTransform: "uppercase",
              letterSpacing: "1px"
            }}>
              Acciones Rápidas
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                onClick={() => navigateTo("/courses")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px",
                  background: "#F9FAFB",
                  border: "1px solid #E5E7EB",
                  borderRadius: 10,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 14,
                  fontWeight: 600
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#0F62FE"
                  e.currentTarget.style.color = "#fff"
                  e.currentTarget.style.transform = "translateX(-4px)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#F9FAFB"
                  e.currentTarget.style.color = "#000"
                  e.currentTarget.style.transform = "translateX(0)"
                }}
              >
                <span style={{ fontSize: 20 }}>📚</span>
                <span>Explorar Cursos</span>
              </button>

              <button
                onClick={() => navigateTo("/assignments")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px",
                  background: "#F9FAFB",
                  border: "1px solid #E5E7EB",
                  borderRadius: 10,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 14,
                  fontWeight: 600
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#0F62FE"
                  e.currentTarget.style.color = "#fff"
                  e.currentTarget.style.transform = "translateX(-4px)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#F9FAFB"
                  e.currentTarget.style.color = "#000"
                  e.currentTarget.style.transform = "translateX(0)"
                }}
              >
                <span style={{ fontSize: 20 }}>📝</span>
                <span>Asignaciones</span>
              </button>

              <button
                onClick={() => navigateTo("/progress")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px",
                  background: "#F9FAFB",
                  border: "1px solid #E5E7EB",
                  borderRadius: 10,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 14,
                  fontWeight: 600
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#0F62FE"
                  e.currentTarget.style.color = "#fff"
                  e.currentTarget.style.transform = "translateX(-4px)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#F9FAFB"
                  e.currentTarget.style.color = "#000"
                  e.currentTarget.style.transform = "translateX(0)"
                }}
              >
                <span style={{ fontSize: 20 }}>🏆</span>
                <span>Mi Progreso</span>
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 style={{ 
              margin: "0 0 12px", 
              fontSize: 14, 
              fontWeight: 700,
              color: "#666",
              textTransform: "uppercase",
              letterSpacing: "1px"
            }}>
              Cuenta
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button
                onClick={() => navigateTo("/profile")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px",
                  background: "transparent",
                  border: "none",
                  borderRadius: 10,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  textAlign: "left"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#F9FAFB"
                  e.currentTarget.style.transform = "translateX(-4px)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent"
                  e.currentTarget.style.transform = "translateX(0)"
                }}
              >
                <span style={{ fontSize: 18 }}>👤</span>
                <span>Perfil</span>
              </button>

              <button
                onClick={() => navigateTo("/account")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px",
                  background: "transparent",
                  border: "none",
                  borderRadius: 10,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  textAlign: "left"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#F9FAFB"
                  e.currentTarget.style.transform = "translateX(-4px)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent"
                  e.currentTarget.style.transform = "translateX(0)"
                }}
              >
                <span style={{ fontSize: 18 }}>⚙️</span>
                <span>Cuenta</span>
              </button>

              <button
                onClick={() => navigateTo("/settings")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px",
                  background: "transparent",
                  border: "none",
                  borderRadius: 10,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  textAlign: "left"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#F9FAFB"
                  e.currentTarget.style.transform = "translateX(-4px)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent"
                  e.currentTarget.style.transform = "translateX(0)"
                }}
              >
                <span style={{ fontSize: 18 }}>🔧</span>
                <span>Configuración</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

