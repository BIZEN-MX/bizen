"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import Link from "next/link"

interface LeaderboardEntry {
  userId: string
  nickname: string
  reputation: number
  level: number
  postsCreated: number
  commentsCreated: number
  acceptedAnswers: number
  weeklyScore: number
}

export default function LeaderboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [filter, setFilter] = useState<'all' | 'weekly'>('weekly')
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    const bodyEl = document.body
    if (bodyEl) {
      bodyEl.style.background = "#ffffff"
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
      window.open("/login", "_blank")
      return
    }
    fetchLeaderboard()
  }, [user, loading, router, filter])

  const fetchLeaderboard = async () => {
    try {
      setLoadingData(true)
      const response = await fetch(`/api/forum/leaderboard?period=${filter}`)
      if (response.ok) {
        const data = await response.json()
        setEntries(data.leaderboard)
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error)
    } finally {
      setLoadingData(false)
    }
  }

  const getMedalEmoji = (position: number) => {
    if (position === 1) return "🥇"
    if (position === 2) return "🥈"
    if (position === 3) return "🥉"
    return `${position}.`
  }

  if (loading || loadingData) {
    return (
      <div style={{ 
        display: "grid", 
        placeItems: "center", 
        minHeight: "60vh", 
        fontFamily: "Montserrat, sans-serif",
        background: "#ffffff"
      }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#666", fontSize: 16 }}>Cargando...</p>
        </div>
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
      background: "#ffffff",
    }}>
      <main style={{ 
        position: "relative",
        maxWidth: 1000, 
        margin: "0 auto", 
        padding: "clamp(20px, 4vw, 40px)",
        zIndex: 1
      }}>
        <h1 style={{ margin: "0 0 8px", fontSize: 32, fontWeight: 800, color: "#1E40AF" }}>
          Tabla de Clasificación
        </h1>
        <p style={{ margin: "0 0 32px", color: "#374151", fontSize: 15, fontWeight: 600 }}>
          Los miembros más activos de la comunidad
        </p>

        {/* Filters */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          <button
            onClick={() => setFilter('weekly')}
            style={{
              padding: "10px 20px",
              background: filter === 'weekly' ? "#0F62FE" : "rgba(255, 255, 255, 0.6)",
              color: filter === 'weekly' ? "white" : "#374151",
              border: "none",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "Montserrat, sans-serif"
            }}
          >
            Esta Semana
          </button>
          <button
            onClick={() => setFilter('all')}
            style={{
              padding: "10px 20px",
              background: filter === 'all' ? "#0F62FE" : "rgba(255, 255, 255, 0.6)",
              color: filter === 'all' ? "white" : "#374151",
              border: "none",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "Montserrat, sans-serif"
            }}
          >
            Histórico
          </button>
        </div>

        {/* Leaderboard */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {entries.map((entry, index) => (
            <Link
              key={entry.userId}
              href={`/forum/profile/${entry.userId}`}
              style={{
                padding: 24,
                background: index < 3 ? "rgba(255, 215, 0, 0.1)" : "rgba(255, 255, 255, 0.4)",
                backdropFilter: "blur(20px)",
                borderRadius: 16,
                border: index < 3 ? "2px solid #F59E0B" : "2px solid rgba(255, 255, 255, 0.6)",
                boxShadow: "0 4px 16px rgba(31, 38, 135, 0.1)",
                textDecoration: "none",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                gap: 20
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateX(4px)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateX(0)"
              }}
            >
              {/* Position */}
              <div style={{
                fontSize: 24,
                fontWeight: 800,
                color: index < 3 ? "#F59E0B" : "#6B7280",
                minWidth: 50,
                textAlign: "center"
              }}>
                {getMedalEmoji(index + 1)}
              </div>

              {/* User Info */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#1E40AF", marginBottom: 4 }}>
                  {entry.nickname}
                </div>
                <div style={{ fontSize: 13, color: "#6B7280", fontWeight: 600 }}>
                  Nivel {entry.level} • {entry.reputation} pts
                </div>
              </div>

              {/* Stats */}
              <div style={{ display: "flex", gap: 20, fontSize: 13, fontWeight: 600, color: "#374151" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#0F62FE" }}>
                    {entry.postsCreated}
                  </div>
                  <div style={{ color: "#9CA3AF" }}>temas</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#10B981" }}>
                    {entry.acceptedAnswers}
                  </div>
                  <div style={{ color: "#9CA3AF" }}>aceptadas</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}

