"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import Link from "next/link"

interface RankingEntry {
  userId: string
  nickname: string
  level: number
  xp: number
  currentStreak: number
  totalStars: number
}

export default function RankingPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [entries, setEntries] = useState<RankingEntry[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const bodyEl = document.body
    if (bodyEl) {
      bodyEl.style.background = "#ffffff"
      bodyEl.style.backgroundAttachment = "fixed"
    }
    return () => {
      bodyEl.style.background = ""
      bodyEl.style.backgroundAttachment = "scroll"
    }
  }, [])

  useEffect(() => {
    if (loading) return
    if (!user) {
      window.open("/login", "_blank")
      return
    }
    fetchRanking()
  }, [user, loading, router])

  const fetchRanking = async () => {
    try {
      setLoadingData(true)
      setError(null)
      const res = await fetch("/api/ranking", { credentials: "same-origin" })
      if (!res.ok) {
        setEntries([])
        if (res.status === 401) setError("Inicia sesión para ver el ranking.")
        else setError("No se pudo cargar el ranking.")
        return
      }
      const data = await res.json()
      setEntries(Array.isArray(data.ranking) ? data.ranking : [])
    } catch (err) {
      console.error("Error fetching ranking:", err)
      setEntries([])
      setError("Error de conexión. Intenta de nuevo.")
    } finally {
      setLoadingData(false)
    }
  }

  const getPositionLabel = (position: number) => {
    if (position === 1) return "1"
    if (position === 2) return "2"
    if (position === 3) return "3"
    return String(position)
  }

  if (loading || loadingData) {
    return (
      <div
        className="ranking-outer"
        style={{
          display: "grid",
          placeItems: "center",
          minHeight: "60vh",
          fontFamily: "'Inter', 'Montserrat', sans-serif",
          background: "#ffffff",
          marginLeft: 280,
          width: "calc(100% - 280px)",
        }}
      >
        <style>{`
          @media (max-width: 767px) { .ranking-outer { margin-left: 0 !important; width: 100% !important; } }
          @media (min-width: 768px) and (max-width: 1160px) { .ranking-outer { margin-left: 220px !important; width: calc(100% - 220px) !important; } }
          @media (min-width: 1161px) { .ranking-outer { margin-left: 280px !important; width: calc(100% - 280px) !important; } }
        `}</style>
        <p style={{ color: "#64748b", fontSize: 16 }}>Cargando ranking...</p>
      </div>
    )
  }

  if (!user) return null

  return (
    <>
      <style>{`
        @media (max-width: 767px) {
          .ranking-outer { margin-left: 0 !important; width: 100% !important; padding-bottom: 65px !important; }
        }
        @media (min-width: 768px) and (max-width: 1160px) {
          .ranking-outer { margin-left: 220px !important; width: calc(100% - 220px) !important; }
        }
        @media (min-width: 1161px) {
          .ranking-outer { margin-left: 280px !important; width: calc(100% - 280px) !important; }
        }
      `}</style>
      <div
        className="ranking-outer"
        style={{
          position: "relative",
          minHeight: "100vh",
          paddingTop: 40,
          paddingBottom: 80,
          fontFamily: "'Inter', 'Montserrat', sans-serif",
          background: "#ffffff",
          marginLeft: 280,
          width: "calc(100% - 280px)",
        }}
      >
        <main
          style={{
            position: "relative",
            maxWidth: 900,
            margin: "0 auto",
            padding: "clamp(20px, 4vw, 40px)",
            zIndex: 1,
          }}
        >
        <h1 style={{ margin: "0 0 8px", fontSize: "clamp(26px, 4vw, 32px)", fontWeight: 800, color: "#111" }}>
          Ranking
        </h1>
        <p style={{ margin: "0 0 28px", color: "#64748b", fontSize: 15, fontWeight: 600 }}>
          Ordenado por racha, XP y estrellas conseguidas en cursos y lecciones
        </p>

        {error && (
          <div
            style={{
              padding: 16,
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              borderRadius: 12,
              color: "#991B1B",
              fontSize: 14,
              marginBottom: 24,
            }}
          >
            {error}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {entries.length === 0 && !error && (
            <p style={{ color: "#64748b", fontSize: 15, textAlign: "center", padding: 32 }}>
              Aún no hay datos en el ranking. Completa lecciones y gana XP y estrellas para aparecer.
            </p>
          )}
          {entries.map((entry, index) => {
            const position = index + 1
            const isTopThree = position <= 3
            return (
              <Link
                key={entry.userId}
                href={`/forum/profile/${entry.userId}`}
                style={{
                  padding: 20,
                  background: isTopThree ? "rgba(245, 158, 11, 0.08)" : "#fff",
                  border: isTopThree ? "1px solid rgba(245, 158, 11, 0.4)" : "1px solid #e2e8f0",
                  borderRadius: 16,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                  textDecoration: "none",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateX(4px)"
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateX(0)"
                  e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)"
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: isTopThree ? "#F59E0B" : "#e2e8f0",
                    color: isTopThree ? "#fff" : "#64748b",
                    fontSize: 18,
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {getPositionLabel(position)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 17, fontWeight: 700, color: "#111", marginBottom: 4 }}>
                    {entry.nickname}
                  </div>
                  <div style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>
                    Nivel {entry.level}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 20, fontSize: 13, fontWeight: 600, color: "#475569", flexShrink: 0, flexWrap: "wrap" }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#F59E0B" }}>{entry.currentStreak}</div>
                    <div style={{ color: "#94a3b8", fontSize: 12 }}>racha (días)</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#0F62FE" }}>{entry.xp}</div>
                    <div style={{ color: "#94a3b8", fontSize: 12 }}>XP</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#10B981" }}>{entry.totalStars}</div>
                    <div style={{ color: "#94a3b8", fontSize: 12 }}>estrellas</div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
        </main>
      </div>
    </>
  )
}
