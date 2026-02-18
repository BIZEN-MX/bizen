"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import Link from "next/link"

type Statistics = {
  overview: {
    totalGames: number
    completedGames: number
    activeGames: number
    abandonedGames: number
    winRate: number
  }
  performance: {
    avgTurnsToWin: number
    fastestWin: number | null
    bestProfession: {
      name: string
      wins: number
    } | null
    totalCashEarned: number
    totalInvestments: number
    totalDoodads: number
    totalDoodadsCost: number
  }
  recentGames: Array<{
    id: number
    profession: string
    currentTurn: number
    cashOnHand: number
    passiveIncome: number
    hasWon: boolean
    startedAt: string
    status: string
  }>
}

export default function CashFlowStatsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<Statistics | null>(null)
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      window.open("/login", "_blank")
    }
  }, [user, loading, router])

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/cashflow/statistics")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Error fetching statistics:", error)
    } finally {
      setLoadingStats(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric"
    })
  }

  if (loading || loadingStats || !stats) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8fafc",
        paddingRight: "340px"
      }}>
        <div style={{ color: "#333", fontSize: 24, fontWeight: 700 }}>
          Cargando estadísticas...
        </div>
      </div>
    )
  }

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: "#ffffff",
      fontFamily: "Montserrat, sans-serif"
    }}>
      <main style={{
        flex: 1,
        padding: "40px 20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start"
      }}>
        <div style={{ maxWidth: 1200, width: "100%" }}>
          {/* Header */}
          <div style={{
            background: "white",
            borderRadius: 20,
            padding: "32px",
            marginBottom: 32,
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div>
                <h1 style={{
                  fontSize: 48,
                  fontWeight: 900,
                  margin: "0 0 8px",
                  background: "linear-gradient(135deg, #667eea, #764ba2)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}>
                  📊 Estadísticas
                </h1>
                <p style={{ fontSize: 16, color: "#666", margin: 0 }}>
                  Tu progreso en el juego Cashflow
                </p>
              </div>

              <Link
                href="/simulador"
                style={{
                  padding: "12px 24px",
                  background: "linear-gradient(135deg, #667eea, #764ba2)",
                  color: "white",
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 700,
                  textDecoration: "none",
                  boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)"
                }}
              >
                ← Volver
              </Link>
            </div>
          </div>

          {/* Overview Stats */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 20,
            marginBottom: 32
          }}>
            <div style={{
              background: "white",
              borderRadius: 16,
              padding: 24,
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
            }}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>🎮</div>
              <div style={{ fontSize: 36, fontWeight: 900, color: "#667eea", marginBottom: 4 }}>
                {stats.overview.totalGames}
              </div>
              <div style={{ fontSize: 14, color: "#666", fontWeight: 600 }}>
                Partidas Jugadas
              </div>
            </div>

            <div style={{
              background: "white",
              borderRadius: 16,
              padding: 24,
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
            }}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>🏆</div>
              <div style={{ fontSize: 36, fontWeight: 900, color: "#10b981", marginBottom: 4 }}>
                {stats.overview.completedGames}
              </div>
              <div style={{ fontSize: 14, color: "#666", fontWeight: 600 }}>
                Victorias
              </div>
            </div>

            <div style={{
              background: "white",
              borderRadius: 16,
              padding: 24,
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
            }}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>📈</div>
              <div style={{ fontSize: 36, fontWeight: 900, color: "#2563eb", marginBottom: 4 }}>
                {stats.overview.winRate}%
              </div>
              <div style={{ fontSize: 14, color: "#666", fontWeight: 600 }}>
                Tasa de Victoria
              </div>
            </div>

            <div style={{
              background: "white",
              borderRadius: 16,
              padding: 24,
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
            }}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>⚡</div>
              <div style={{ fontSize: 36, fontWeight: 900, color: "#f59e0b", marginBottom: 4 }}>
                {stats.performance.fastestWin || "-"}
              </div>
              <div style={{ fontSize: 14, color: "#666", fontWeight: 600 }}>
                Victoria Más Rápida (turnos)
              </div>
            </div>
          </div>

          {/* Performance Stats */}
          <div style={{
            background: "white",
            borderRadius: 20,
            padding: 32,
            marginBottom: 32,
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)"
          }}>
            <h2 style={{
              fontSize: 28,
              fontWeight: 900,
              margin: "0 0 24px",
              color: "#333"
            }}>
              🎯 Rendimiento
            </h2>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 20
            }}>
              <div style={{
                background: "#f8f9fa",
                borderRadius: 12,
                padding: 20
              }}>
                <div style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                  📊 Turnos Promedio para Ganar
                </div>
                <div style={{ fontSize: 32, fontWeight: 900, color: "#667eea" }}>
                  {stats.performance.avgTurnsToWin || "-"}
                </div>
              </div>

              <div style={{
                background: "#f8f9fa",
                borderRadius: 12,
                padding: 20
              }}>
                <div style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                  👤 Mejor Profesión
                </div>
                <div style={{ fontSize: 24, fontWeight: 900, color: "#10b981" }}>
                  {stats.performance.bestProfession?.name || "Ninguna aún"}
                </div>
                {stats.performance.bestProfession && (
                  <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
                    {stats.performance.bestProfession.wins} victoria{stats.performance.bestProfession.wins !== 1 ? 's' : ''}
                  </div>
                )}
              </div>

              <div style={{
                background: "#f8f9fa",
                borderRadius: 12,
                padding: 20
              }}>
                <div style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                  💰 Dinero Total Ganado
                </div>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#10b981" }}>
                  ${stats.performance.totalCashEarned.toLocaleString()}
                </div>
              </div>

              <div style={{
                background: "#f8f9fa",
                borderRadius: 12,
                padding: 20
              }}>
                <div style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                  🏠 Inversiones Totales
                </div>
                <div style={{ fontSize: 32, fontWeight: 900, color: "#2563eb" }}>
                  {stats.performance.totalInvestments}
                </div>
              </div>

              <div style={{
                background: "#fef2f2",
                borderRadius: 12,
                padding: 20,
                border: "1px solid #fecaca"
              }}>
                <div style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                  💸 Doodads Comprados
                </div>
                <div style={{ fontSize: 32, fontWeight: 900, color: "#ef4444" }}>
                  {stats.performance.totalDoodads}
                </div>
                <div style={{ fontSize: 12, color: "#dc2626", marginTop: 4 }}>
                  ${stats.performance.totalDoodadsCost.toLocaleString()} desperdiciados
                </div>
              </div>

              <div style={{
                background: "#f8f9fa",
                borderRadius: 12,
                padding: 20
              }}>
                <div style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                  🎲 Partidas Activas
                </div>
                <div style={{ fontSize: 32, fontWeight: 900, color: "#f59e0b" }}>
                  {stats.overview.activeGames}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Games */}
          {stats.recentGames.length > 0 && (
            <div style={{
              background: "white",
              borderRadius: 20,
              padding: 32,
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)"
            }}>
              <h2 style={{
                fontSize: 28,
                fontWeight: 900,
                margin: "0 0 24px",
                color: "#333"
              }}>
                🕐 Partidas Recientes
              </h2>

              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: 12
              }}>
                {stats.recentGames.map((game) => (
                  <div
                    key={game.id}
                    style={{
                      background: "#f8f9fa",
                      borderRadius: 12,
                      padding: 20,
                      border: "2px solid #e9ecef",
                      transition: "all 0.3s"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#667eea"
                      e.currentTarget.style.transform = "translateX(4px)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#e9ecef"
                      e.currentTarget.style.transform = "translateX(0)"
                    }}
                  >
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: 18,
                          fontWeight: 800,
                          color: "#333",
                          marginBottom: 8
                        }}>
                          {game.profession}
                          {game.hasWon && (
                            <span style={{
                              marginLeft: 8,
                              padding: "4px 10px",
                              background: "linear-gradient(135deg, #10b981, #059669)",
                              color: "white",
                              borderRadius: 8,
                              fontSize: 11,
                              fontWeight: 700
                            }}>
                              ✓ GANADO
                            </span>
                          )}
                        </div>

                        <div style={{
                          display: "flex",
                          gap: 24,
                          fontSize: 13,
                          color: "#666"
                        }}>
                          <div>
                            <strong>Turno:</strong> {game.currentTurn}
                          </div>
                          <div>
                            <strong>Efectivo:</strong> ${game.cashOnHand.toLocaleString()}
                          </div>
                          <div>
                            <strong>Ingreso Pasivo:</strong> ${game.passiveIncome.toLocaleString()}
                          </div>
                          <div>
                            <strong>Fecha:</strong> {formatDate(game.startedAt)}
                          </div>
                        </div>
                      </div>

                      <Link
                        href={`/simulador/game/${game.id}`}
                        style={{
                          padding: "10px 20px",
                          background: "linear-gradient(135deg, #667eea, #764ba2)",
                          color: "white",
                          borderRadius: 10,
                          fontSize: 13,
                          fontWeight: 700,
                          textDecoration: "none"
                        }}
                      >
                        {game.hasWon ? "Ver" : "Continuar"}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {stats.overview.totalGames === 0 && (
            <div style={{
              background: "white",
              borderRadius: 20,
              padding: "64px 32px",
              textAlign: "center",
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)"
            }}>
              <div style={{ fontSize: 80, marginBottom: 16 }}>
                🎮
              </div>
              <h2 style={{
                fontSize: 28,
                fontWeight: 800,
                color: "#333",
                marginBottom: 16
              }}>
                Aún no has jugado
              </h2>
              <p style={{
                fontSize: 16,
                color: "#666",
                marginBottom: 32
              }}>
                ¡Comienza tu primera partida de Cashflow y aparecerán tus estadísticas aquí!
              </p>
              <Link
                href="/simulador"
                style={{
                  display: "inline-block",
                  padding: "16px 32px",
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  color: "white",
                  borderRadius: 12,
                  fontSize: 16,
                  fontWeight: 700,
                  textDecoration: "none",
                  boxShadow: "0 6px 20px rgba(16, 185, 129, 0.3)"
                }}
              >
                🚀 Empezar a Jugar
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* Sidebar Spacer */}
      <aside style={{
        width: "320px",
        flexShrink: 0
      }} />
    </div>
  )
}


