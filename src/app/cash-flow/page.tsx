"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

type Profession = {
  id: number
  name: string
  description: string | null
  salary: number
  taxes: number
  homeMortgagePayment: number
  schoolLoanPayment: number
  carLoanPayment: number
  creditCardPayment: number
  retailPayment: number
  otherExpenses: number
  childExpense: number
  homeMortgage: number
  schoolLoans: number
  carLoans: number
  creditCards: number
  retailDebt: number
  startingCash: number
  startingSavings: number
}

type GameSummary = {
  id: number
  status: string
  currentPhase: string | null
  startedAt: string
  completedAt: string | null
  lastActivityAt: string
  totalTurns: number
  player: {
    id: number
    profession: string
    currentTurn: number
    cashOnHand: number
    passiveIncome: number
    hasEscapedRatRace: boolean
    numInvestments: number
  } | null
}

export default function CashFlowPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [professions, setProfessions] = useState<Profession[]>([])
  const [selectedProfession, setSelectedProfession] = useState<number | null>(null)
  const [loadingProfessions, setLoadingProfessions] = useState(true)
  const [games, setGames] = useState<GameSummary[]>([])
  const [loadingGames, setLoadingGames] = useState(true)
  const [startingGame, setStartingGame] = useState(false)
  const [showNewGame, setShowNewGame] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      console.log("No user found, redirecting to login")
      router.push("/bizen/login")
    } else if (user) {
      console.log("User logged in:", user.email)
    }
  }, [user, loading, router])

  useEffect(() => {
    fetchProfessions()
    fetchGames()
  }, [])

  const fetchProfessions = async () => {
    try {
      const response = await fetch("/api/cashflow/professions")
      if (response.ok) {
        const data = await response.json()
        console.log("Professions loaded:", data.length)
        setProfessions(data)
      } else {
        console.error("Failed to fetch professions:", response.status, response.statusText)
        const error = await response.json()
        console.error("Error details:", error)
      }
    } catch (error) {
      console.error("Error fetching professions:", error)
    } finally {
      setLoadingProfessions(false)
    }
  }

  const fetchGames = async () => {
    try {
      const response = await fetch("/api/cashflow/my-games")
      if (response.ok) {
        const data = await response.json()
        setGames(data)
      } else if (response.status === 401) {
        // User not authenticated yet, that's ok
        console.log("Auth not ready, skipping games fetch")
      }
    } catch (error) {
      console.error("Error fetching games:", error)
    } finally {
      setLoadingGames(false)
    }
  }

  const deleteGame = async (gameId: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este juego?")) return

    try {
      const response = await fetch(`/api/cashflow/game/${gameId}/delete`, {
        method: "DELETE"
      })
      if (response.ok) {
        await fetchGames()
      }
    } catch (error) {
      console.error("Error deleting game:", error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const getTimeSince = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 60) return `Hace ${diffMins} min`
    if (diffHours < 24) return `Hace ${diffHours}h`
    if (diffDays < 7) return `Hace ${diffDays}d`
    return formatDate(dateString)
  }

  const startGame = async () => {
    if (!selectedProfession) {
      console.log("No profession selected!")
      return
    }
    
    console.log("Starting game with profession:", selectedProfession)
    setStartingGame(true)
    try {
      const response = await fetch("/api/cashflow/start-game", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ professionId: selectedProfession })
      })
      
      console.log("Start game response:", response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log("Game created:", data)
        router.push(`/cash-flow/game/${data.gameId}`)
      } else {
        const error = await response.json()
        console.error("Start game failed:", error)
        alert(`Error: ${error.error || 'No se pudo iniciar el juego'}`)
      }
    } catch (error) {
      console.error("Error starting game:", error)
      alert("Error de conexión. Por favor intenta de nuevo.")
    } finally {
      setStartingGame(false)
    }
  }

  const calculateTotalExpenses = (prof: Profession) => {
    return prof.taxes + prof.homeMortgagePayment + prof.schoolLoanPayment +
           prof.carLoanPayment + prof.creditCardPayment + prof.retailPayment + 
           prof.otherExpenses
  }

  const calculateCashFlow = (prof: Profession) => {
    return prof.salary - calculateTotalExpenses(prof)
  }

  if (loading || !user) {
    return null // Don't show anything while loading
  }

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #E0F2FE 0%, #DBEAFE 50%, #BFDBFE 100%)",
      fontFamily: "Montserrat, sans-serif",
      overflowX: "hidden",
      overflowY: "auto",
      boxSizing: "border-box"
    }}>
      {/* Main Content Area */}
      <main style={{
        flex: 1,
        paddingTop: "40px",
        paddingBottom: "40px",
        paddingLeft: "40px",
        paddingRight: "40px",
        overflowX: "hidden",
        overflowY: "visible",
        width: "100%",
        boxSizing: "border-box"
      }}>
        {/* Header */}
        <div style={{
          width: "100%",
          background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(239,246,255,0.95) 50%, rgba(219,234,254,0.95) 100%)",
          borderRadius: 24,
          padding: "40px",
          marginBottom: 32,
          boxShadow: "0 8px 32px rgba(11,113,254,0.25)",
          textAlign: "center",
          position: "relative",
          border: "2px solid rgba(11, 113, 254, 0.2)",
          boxSizing: "border-box"
        }}>
          <button
            onClick={() => router.push("/cash-flow/stats")}
            style={{
              position: "absolute",
              top: 24,
              right: 24,
              padding: "10px 20px",
              background: "#eff6ff",
              color: "#2563eb",
              border: "1px solid #3b82f6",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "Montserrat, sans-serif",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#dbeafe"
              e.currentTarget.style.transform = "scale(1.05)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#eff6ff"
              e.currentTarget.style.transform = "scale(1)"
            }}
          >
            📊 Estadísticas
          </button>

          <h1 style={{
            fontSize: 56,
            fontWeight: 900,
            margin: "0 0 20px",
            background: "linear-gradient(135deg, #0B71FE, #4A9EFF)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "-0.02em"
          }}>
            CASHFLOW
          </h1>
          <p style={{
            fontSize: 19,
            color: "#64748b",
            margin: 0,
            lineHeight: 1.7,
            maxWidth: 800,
            marginLeft: "auto",
            marginRight: "auto"
          }}>
            Aprende a construir riqueza e independencia financiera. Escapa de la "Carrera de Ratas" 
            generando ingresos pasivos que superen tus gastos.
          </p>
        </div>

        {/* Active Games */}
        {!loadingGames && games.length > 0 && !showNewGame && (
          <div style={{
            width: "100%",
            background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(239,246,255,0.95) 50%, rgba(219,234,254,0.95) 100%)",
            borderRadius: 24,
            padding: "40px",
            marginBottom: 32,
            boxShadow: "0 8px 32px rgba(11,113,254,0.25)",
            border: "2px solid rgba(11, 113, 254, 0.2)",
            boxSizing: "border-box"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 24
            }}>
              <h2 style={{
                fontSize: 32,
                fontWeight: 900,
                margin: 0,
                color: "#333"
              }}>
                Mis Partidas
              </h2>
              <button
                onClick={() => setShowNewGame(true)}
                style={{
                  padding: "12px 24px",
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  color: "white",
                  border: "none",
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
                  fontFamily: "Montserrat, sans-serif"
                }}
              >
                + Nueva Partida
              </button>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 20,
              width: "100%"
            }}>
              {games.map((game) => {
                if (!game.player) return null
                
                return (
                  <div
                    key={game.id}
                    style={{
                      background: "#f8f9fa",
                      borderRadius: 16,
                      padding: 20,
                      border: "2px solid #e9ecef",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#667eea"
                      e.currentTarget.style.transform = "translateY(-2px)"
                      e.currentTarget.style.boxShadow = "0 8px 20px rgba(102, 126, 234, 0.2)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#e9ecef"
                      e.currentTarget.style.transform = "translateY(0)"
                      e.currentTarget.style.boxShadow = "none"
                    }}
                  >
                    {/* Header */}
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "start",
                      marginBottom: 16
                    }}>
                      <div>
                        <div style={{
                          fontSize: 18,
                          fontWeight: 800,
                          color: "#333",
                          marginBottom: 4
                        }}>
                          {game.player.profession}
                        </div>
                        <div style={{
                          fontSize: 12,
                          color: "#999"
                        }}>
                          {getTimeSince(game.lastActivityAt)}
                        </div>
                      </div>
                      
                      {game.player.hasEscapedRatRace && (
                        <div style={{
                          background: "linear-gradient(135deg, #10b981, #059669)",
                          color: "white",
                          padding: "4px 10px",
                          borderRadius: 8,
                          fontSize: 11,
                          fontWeight: 700
                        }}>
                          ✓ Libre
                        </div>
                      )}
                    </div>

                    {/* Stats */}
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 12,
                      marginBottom: 16
                    }}>
                      <div>
                        <div style={{ fontSize: 11, color: "#666", marginBottom: 2 }}>
                          Efectivo
                        </div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "#10b981" }}>
                          ${game.player.cashOnHand.toLocaleString()}
                        </div>
                      </div>
                      
                      <div>
                        <div style={{ fontSize: 11, color: "#666", marginBottom: 2 }}>
                          Ingreso Pasivo
                        </div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "#2563eb" }}>
                          ${game.player.passiveIncome.toLocaleString()}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: 11, color: "#666", marginBottom: 2 }}>
                          Turno
                        </div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "#333" }}>
                          {game.player.currentTurn}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: 11, color: "#666", marginBottom: 2 }}>
                          Inversiones
                        </div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "#333" }}>
                          {game.player.numInvestments}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{
                      display: "flex",
                      gap: 8
                    }}>
                      <button
                        onClick={() => router.push(`/cash-flow/game/${game.id}`)}
                        style={{
                          flex: 1,
                          padding: "10px",
                          background: "linear-gradient(135deg, #667eea, #764ba2)",
                          color: "white",
                          border: "none",
                          borderRadius: 8,
                          fontSize: 13,
                          fontWeight: 700,
                          cursor: "pointer",
                          fontFamily: "Montserrat, sans-serif"
                        }}
                      >
                        Continuar
                      </button>

                      <button
                        onClick={() => deleteGame(game.id)}
                        style={{
                          padding: "10px 16px",
                          background: "white",
                          color: "#ef4444",
                          border: "1px solid #ef4444",
                          borderRadius: 8,
                          fontSize: 13,
                          fontWeight: 700,
                          cursor: "pointer",
                          fontFamily: "Montserrat, sans-serif"
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Instructions */}
        {(showNewGame || games.length === 0) && (
        <div style={{
          width: "100%",
          background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(239,246,255,0.95) 50%, rgba(219,234,254,0.95) 100%)",
          borderRadius: 24,
          padding: "32px",
          marginBottom: 32,
          boxShadow: "0 8px 32px rgba(11,113,254,0.25)",
          border: "2px solid rgba(11, 113, 254, 0.2)",
          boxSizing: "border-box"
        }}>
          <h2 style={{
            fontSize: 24,
            fontWeight: 800,
            margin: "0 0 16px",
            color: "#333"
          }}>
            ❓ Cómo Jugar
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 16
          }}>
            <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
              <span style={{ fontSize: 28 }}>1️⃣</span>
              <div>
                <strong>Elige tu profesión</strong>
                <div style={{ fontSize: 14, color: "#666", marginTop: 4 }}>
                  Cada carrera tiene diferentes ingresos, gastos y deudas
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
              <span style={{ fontSize: 28 }}>2️⃣</span>
              <div>
                <strong>Invierte sabiamente</strong>
                <div style={{ fontSize: 14, color: "#666", marginTop: 4 }}>
                  Compra activos que generen ingresos pasivos
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
              <span style={{ fontSize: 28 }}>3️⃣</span>
              <div>
                <strong>Escapa la carrera de ratas</strong>
                <div style={{ fontSize: 14, color: "#666", marginTop: 4 }}>
                  Gana cuando tu ingreso pasivo supere tus gastos
                </div>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Profession Selection */}
        {(showNewGame || games.length === 0) && (
        <div style={{
          width: "100%",
          background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(239,246,255,0.95) 50%, rgba(219,234,254,0.95) 100%)",
          borderRadius: 24,
          padding: "48px",
          boxShadow: "0 8px 32px rgba(11,113,254,0.25)",
          border: "2px solid rgba(11, 113, 254, 0.2)",
          boxSizing: "border-box"
        }}>
          <h2 style={{
            fontSize: 36,
            fontWeight: 900,
            margin: "0 0 40px",
            color: "#0f172a",
            textAlign: "center",
            letterSpacing: "-0.02em"
          }}>
            Selecciona tu Profesión
          </h2>

          {loadingProfessions ? (
            <div style={{ textAlign: "center", padding: 40, color: "#999" }}>
              Cargando profesiones...
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 24,
              width: "100%"
            }}>
              {professions.map((prof) => {
                const totalExpenses = calculateTotalExpenses(prof)
                const cashFlow = calculateCashFlow(prof)
                const isSelected = selectedProfession === prof.id

                return (
                  <div
                    key={prof.id}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setSelectedProfession(prof.id)
                      console.log("Selected profession:", prof.id, prof.name)
                    }}
                    style={{
                      background: isSelected 
                        ? "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)" 
                        : "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(239,246,255,0.98) 100%)",
                      border: isSelected ? "3px solid #0B71FE" : "2px solid rgba(59,130,246,0.3)",
                      borderRadius: 20,
                      padding: 24,
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      transform: isSelected ? "scale(1.03)" : "scale(1)",
                      boxShadow: isSelected 
                        ? "0 12px 32px rgba(11, 113, 254, 0.35)" 
                        : "0 4px 16px rgba(11, 113, 254, 0.12)",
                      userSelect: "none"
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.transform = "scale(1.02)"
                        e.currentTarget.style.boxShadow = "0 4px 16px rgba(11, 113, 254, 0.15)"
                        e.currentTarget.style.borderColor = "#0B71FE"
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.transform = "scale(1)"
                        e.currentTarget.style.boxShadow = "0 4px 16px rgba(11, 113, 254, 0.12)"
                        e.currentTarget.style.borderColor = "rgba(59,130,246,0.3)"
                      }
                    }}
                  >
                    <h3 style={{
                      fontSize: 22,
                      fontWeight: 800,
                      margin: "0 0 8px",
                      color: isSelected ? "white" : "#333",
                      pointerEvents: "none"
                    }}>
                      {prof.name}
                    </h3>
                    
                    <p style={{
                      fontSize: 14,
                      color: isSelected ? "rgba(255,255,255,0.9)" : "#666",
                      marginBottom: 16,
                      lineHeight: 1.5,
                      pointerEvents: "none"
                    }}>
                      {prof.description}
                    </p>

                    <div style={{
                      background: isSelected ? "rgba(255,255,255,0.15)" : "white",
                      borderRadius: 12,
                      padding: 16,
                      fontSize: 14,
                      pointerEvents: "none"
                    }}>
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 8,
                        paddingBottom: 8,
                        borderBottom: `1px solid ${isSelected ? "rgba(255,255,255,0.2)" : "#e9ecef"}`
                      }}>
                        <span style={{
                          color: isSelected ? "rgba(255,255,255,0.9)" : "#666",
                          fontWeight: 600
                        }}>
                          💵 Salario mensual:
                        </span>
                        <span style={{
                          color: isSelected ? "white" : "#10b981",
                          fontWeight: 700
                        }}>
                          ${prof.salary.toLocaleString()}
                        </span>
                      </div>
                      
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 8,
                        paddingBottom: 8,
                        borderBottom: `1px solid ${isSelected ? "rgba(255,255,255,0.2)" : "#e9ecef"}`
                      }}>
                        <span style={{
                          color: isSelected ? "rgba(255,255,255,0.9)" : "#666",
                          fontWeight: 600
                        }}>
                          💸 Gastos mensuales:
                        </span>
                        <span style={{
                          color: isSelected ? "white" : "#ef4444",
                          fontWeight: 700
                        }}>
                          ${totalExpenses.toLocaleString()}
                        </span>
                      </div>

                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 8,
                        paddingBottom: 8,
                        borderBottom: `1px solid ${isSelected ? "rgba(255,255,255,0.2)" : "#e9ecef"}`
                      }}>
                        <span style={{
                          color: isSelected ? "rgba(255,255,255,0.9)" : "#666",
                          fontWeight: 600
                        }}>
                          📊 Cash Flow:
                        </span>
                        <span style={{
                          color: isSelected ? "white" : cashFlow > 0 ? "#10b981" : "#ef4444",
                          fontWeight: 700
                        }}>
                          ${cashFlow.toLocaleString()}
                        </span>
                      </div>

                      <div style={{
                        display: "flex",
                        justifyContent: "space-between"
                      }}>
                        <span style={{
                          color: isSelected ? "rgba(255,255,255,0.9)" : "#666",
                          fontWeight: 600
                        }}>
                          💰 Efectivo inicial:
                        </span>
                        <span style={{
                          color: isSelected ? "white" : "#333",
                          fontWeight: 700
                        }}>
                          ${prof.startingCash.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Start Button */}
          {selectedProfession && (
            <div style={{
              marginTop: 32,
              textAlign: "center",
              display: "flex",
              gap: 16,
              justifyContent: "center"
            }}>
              {games.length > 0 && (
                <button
                  onClick={() => setShowNewGame(false)}
                  style={{
                    padding: "18px 32px",
                    background: "white",
                    color: "#667eea",
                    border: "2px solid #667eea",
                    borderRadius: 16,
                    fontSize: 18,
                    fontWeight: 800,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    fontFamily: "Montserrat, sans-serif"
                  }}
                >
                  ← Volver
                </button>
              )}
              
              <button
                onClick={startGame}
                disabled={startingGame}
                style={{
                  padding: "18px 48px",
                  background: startingGame 
                    ? "#ccc" 
                    : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: 16,
                  fontSize: 20,
                  fontWeight: 800,
                  cursor: startingGame ? "not-allowed" : "pointer",
                  boxShadow: "0 8px 24px rgba(16, 185, 129, 0.3)",
                  transition: "all 0.3s ease",
                  fontFamily: "Montserrat, sans-serif"
                }}
                onMouseEnter={(e) => {
                  if (!startingGame) {
                    e.currentTarget.style.transform = "scale(1.05)"
                    e.currentTarget.style.boxShadow = "0 12px 32px rgba(16, 185, 129, 0.4)"
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)"
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(16, 185, 129, 0.3)"
                }}
              >
                {startingGame ? "Iniciando..." : "🚀 Comenzar Juego"}
              </button>
            </div>
          )}
        </div>
        )}
      </main>

      {/* Sidebar Spacer - reserves space for the fixed sidebar */}
      <aside style={{
        width: "320px",
        flexShrink: 0
      }}>
        {/* Empty - the actual FixedSidebar component is position:fixed */}
      </aside>
    </div>
  )
}

