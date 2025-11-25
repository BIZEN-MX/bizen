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
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const updateIsMobile = () => {
      setIsMobile(window.innerWidth <= 767)
    }
    updateIsMobile()
    window.addEventListener("resize", updateIsMobile)
    return () => window.removeEventListener("resize", updateIsMobile)
  }, [])

  useEffect(() => {
    if (!loading && !user) {
      console.log("No user found, redirecting to login")
      router.push("/login")
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
    <>
      <style>{`
        /* Mobile - account for footer */
        @media (max-width: 767px) {
          .cashflow-outer {
            padding-bottom: 65px !important;
            min-height: calc(100vh - 65px) !important;
          }
          .cashflow-container {
            width: 100% !important;
            max-width: 100% !important;
            padding: clamp(16px, 4vw, 24px) !important;
            padding-bottom: clamp(16px, 4vw, 24px) !important;
            margin-right: 0 !important;
          }
          .cashflow-header h1 {
            font-size: clamp(32px, 8vw, 56px) !important;
          }
          .cashflow-header p {
            font-size: clamp(14px, 3.5vw, 19px) !important;
          }
          .stats-button {
            position: relative !important;
            top: auto !important;
            right: auto !important;
            margin-bottom: 16px !important;
            width: 100% !important;
          }
          .cashflow-section {
            padding: clamp(20px, 5vw, 40px) !important;
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
          }
          .profession-grid {
            grid-template-columns: 1fr !important;
          }
          .games-grid {
            grid-template-columns: 1fr !important;
          }
          .instructions-grid {
            grid-template-columns: 1fr !important;
          }
        }
        /* Tablet/iPad - respect fixed right sidebar */
        @media (min-width: 768px) and (max-width: 1024px) {
          .cashflow-outer {
            width: calc(100% - clamp(200px, 22vw, 260px)) !important;
            max-width: calc(100% - clamp(200px, 22vw, 260px)) !important;
            margin-right: clamp(200px, 22vw, 260px) !important;
            padding: 0 !important;
          }
          .cashflow-container {
            width: 100% !important;
            max-width: 100% !important;
            padding: clamp(24px, 3vw, 40px) !important;
            margin-right: 0 !important;
          }
          .cashflow-section {
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
          }
          .profession-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        /* Desktop - keep content in usable space (exclude fixed right sidebar) */
        @media (min-width: 1025px) {
          .cashflow-outer {
            width: calc(100% - clamp(240px, 25vw, 320px)) !important;
            max-width: calc(100% - clamp(240px, 25vw, 320px)) !important;
            margin-right: clamp(240px, 25vw, 320px) !important;
            padding: 0 !important;
          }
          .cashflow-container {
            width: 100% !important;
            max-width: 100% !important;
            padding: clamp(24px, 4vw, 40px) !important;
            margin-right: 0 !important;
          }
          .cashflow-section {
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
          }
        }
        .delete-game-button {
          padding: 0 !important;
          width: 28px !important;
          height: 28px !important;
          min-width: 28px !important;
          min-height: 28px !important;
          max-width: 28px !important;
          max-height: 28px !important;
          font-size: 14px !important;
        }
        .continue-game-button {
          flex: 1 !important;
          min-width: 0 !important;
        }
      `}</style>
      <div className="cashflow-outer" data-bizen-tour="cashflow" style={{
        width: "100%",
        flex: 1,
        background: "#ffffff",
        fontFamily: "'Montserrat', sans-serif",
        overflowX: "hidden",
        overflowY: "auto",
        boxSizing: "border-box"
      }}>
        {/* Main Content Area */}
        <main className="cashflow-container" style={{
          paddingTop: "clamp(24px, 4vw, 40px)",
          paddingBottom: "clamp(24px, 4vw, 40px)",
          paddingLeft: "clamp(16px, 4vw, 40px)",
          paddingRight: "clamp(16px, 4vw, 40px)",
          overflowX: "hidden",
          overflowY: "visible",
          boxSizing: "border-box",
          margin: "0"
        }}>
        {isMobile ? (
          <div style={{
            width: "100%",
            maxWidth: "600px",
            margin: "0 auto",
            background: "white",
            borderRadius: "20px",
            padding: "clamp(32px, 6vw, 48px)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px"
          }}>
            <div style={{
              fontSize: "clamp(48px, 10vw, 64px)",
              marginBottom: "8px"
            }}>
              💻
            </div>
            <h1 style={{
              fontSize: "clamp(24px, 5vw, 32px)",
              fontWeight: 800,
              color: "#1f2937",
              margin: "0 0 12px",
              lineHeight: 1.2
            }}>
              Mejor experiencia en laptop
            </h1>
            <p style={{
              fontSize: "clamp(16px, 3.5vw, 18px)",
              color: "#6b7280",
              margin: "0 0 8px",
              lineHeight: 1.6
            }}>
              Para tener una mejor experiencia de juego, te recomendamos abrir Cash Flow en tu laptop o computadora de escritorio.
            </p>
            <p style={{
              fontSize: "clamp(14px, 3vw, 16px)",
              color: "#9ca3af",
              margin: 0,
              lineHeight: 1.5
            }}>
              El tablero y las interacciones están optimizados para pantallas más grandes.
            </p>
            <div style={{
              marginTop: "8px",
              padding: "16px",
              background: "#f3f4f6",
              borderRadius: "12px",
              width: "100%"
            }}>
              <p style={{
                fontSize: "clamp(13px, 2.8vw, 15px)",
                color: "#4b5563",
                margin: 0,
                fontWeight: 600
              }}>
                📱 En móvil puedes revisar tu progreso y estadísticas
              </p>
            </div>
          </div>
        ) : (
          <>
        {/* Header */}
        <div className="cashflow-section" style={{
          width: "100%",
          background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(239,246,255,0.95) 50%, rgba(219,234,254,0.95) 100%)",
          borderRadius: "clamp(16px, 3vw, 24px)",
          padding: "clamp(24px, 5vw, 40px)",
          marginBottom: "clamp(24px, 4vw, 32px)",
          boxShadow: "0 8px 32px rgba(11,113,254,0.25)",
          textAlign: "center",
          position: "relative",
          border: "2px solid rgba(11, 113, 254, 0.2)",
          boxSizing: "border-box"
        }}>
          <button
            className="stats-button"
            onClick={() => router.push("/cash-flow/stats")}
            style={{
              position: "absolute",
              top: 24,
              right: 24,
              padding: "clamp(8px, 1.5vw, 10px) clamp(16px, 3vw, 20px)",
              background: "#eff6ff",
              color: "#2563eb",
              border: "1px solid #3b82f6",
              borderRadius: 10,
              fontSize: "clamp(12px, 2.5vw, 14px)",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "'Montserrat', sans-serif",
              transition: "all 0.2s",
              whiteSpace: "nowrap"
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

          <h1 className="cashflow-header" style={{
            fontSize: "clamp(32px, 8vw, 56px)",
            fontWeight: 900,
            margin: "0 0 clamp(16px, 3vw, 20px)",
            background: "linear-gradient(135deg, #0B71FE, #4A9EFF)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "-0.02em"
          }}>
            CASHFLOW
          </h1>
          <p className="cashflow-header" style={{
            fontSize: "clamp(14px, 3.5vw, 19px)",
            color: "#64748b",
            margin: 0,
            lineHeight: 1.7,
            maxWidth: "min(800px, 100%)",
            marginLeft: "auto",
            marginRight: "auto"
          }}>
            Aprende a construir riqueza e independencia financiera. Escapa de la "Carrera de Ratas" 
            generando ingresos pasivos que superen tus gastos.
          </p>
        </div>

        {/* Active Games */}
        {!loadingGames && games.length > 0 && !showNewGame && (
          <div className="cashflow-section" style={{
            width: "100%",
            background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(239,246,255,0.95) 50%, rgba(219,234,254,0.95) 100%)",
            borderRadius: "clamp(16px, 3vw, 24px)",
            padding: "clamp(24px, 5vw, 40px)",
            marginBottom: "clamp(24px, 4vw, 32px)",
            boxShadow: "0 8px 32px rgba(11,113,254,0.25)",
            border: "2px solid rgba(11, 113, 254, 0.2)",
            boxSizing: "border-box"
          }}>
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              marginBottom: 24
            }}>
              <h2 style={{
                fontSize: "clamp(24px, 5vw, 32px)",
                fontWeight: 900,
                margin: 0,
                color: "#333"
              }}>
                Mis Partidas
              </h2>
              <button
                onClick={() => setShowNewGame(true)}
                style={{
                  padding: "clamp(10px, 2vw, 12px) clamp(20px, 4vw, 24px)",
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  color: "white",
                  border: "none",
                  borderRadius: 12,
                  fontSize: "clamp(13px, 2.5vw, 14px)",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
                  fontFamily: "'Montserrat', sans-serif",
                  alignSelf: "flex-start"
                }}
              >
                + Nueva Partida
              </button>
            </div>

            <div className="games-grid" style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))",
              gap: "clamp(16px, 3vw, 20px)",
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
                      padding: "clamp(16px, 3vw, 20px)",
                      border: "2px solid #e9ecef",
                      transition: "all 0.3s ease",
                      width: "100%",
                      boxSizing: "border-box"
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
                      gap: "clamp(8px, 1.5vw, 12px)",
                      width: "100%",
                      alignItems: "center"
                    }}>
                      <button
                        className="continue-game-button"
                        onClick={() => router.push(`/cash-flow/game/${game.id}`)}
                        style={{
                          flex: 1,
                          padding: "12px 16px",
                          background: "linear-gradient(135deg, #667eea, #764ba2)",
                          color: "white",
                          border: "none",
                          borderRadius: 8,
                          fontSize: "14px",
                          fontWeight: 700,
                          cursor: "pointer",
                          fontFamily: "'Montserrat', sans-serif",
                          whiteSpace: "nowrap",
                          textAlign: "center",
                          minWidth: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis"
                        }}
                      >
                        Continuar
                      </button>

                      <button
                        className="delete-game-button"
                        onClick={() => deleteGame(game.id)}
                        style={{
                          padding: "0",
                          background: "white",
                          color: "#ef4444",
                          border: "1px solid #ef4444",
                          borderRadius: 6,
                          fontSize: "14px",
                          fontWeight: 700,
                          cursor: "pointer",
                          fontFamily: "'Montserrat', sans-serif",
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "28px",
                          height: "28px",
                          minWidth: "28px",
                          minHeight: "28px",
                          maxWidth: "28px",
                          maxHeight: "28px"
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
        <div className="cashflow-section" style={{
          width: "100%",
          background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(239,246,255,0.95) 50%, rgba(219,234,254,0.95) 100%)",
          borderRadius: "clamp(16px, 3vw, 24px)",
          padding: "clamp(20px, 4vw, 32px)",
          marginBottom: "clamp(24px, 4vw, 32px)",
          boxShadow: "0 8px 32px rgba(11,113,254,0.25)",
          border: "2px solid rgba(11, 113, 254, 0.2)",
          boxSizing: "border-box"
        }}>
          <h2 style={{
            fontSize: "clamp(20px, 4vw, 24px)",
            fontWeight: 800,
            margin: "0 0 clamp(12px, 2.5vw, 16px)",
            color: "#333"
          }}>
            ❓ Cómo Jugar
          </h2>
          <div className="instructions-grid" style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
            gap: "clamp(12px, 2.5vw, 16px)"
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
        <div className="cashflow-section" style={{
          width: "100%",
          background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(239,246,255,0.95) 50%, rgba(219,234,254,0.95) 100%)",
          borderRadius: "clamp(16px, 3vw, 24px)",
          padding: "clamp(24px, 5vw, 48px)",
          boxShadow: "0 8px 32px rgba(11,113,254,0.25)",
          border: "2px solid rgba(11, 113, 254, 0.2)",
          boxSizing: "border-box"
        }}>
          <h2 style={{
            fontSize: "clamp(24px, 6vw, 36px)",
            fontWeight: 900,
            margin: "0 0 clamp(24px, 5vw, 40px)",
            color: "#0f172a",
            textAlign: "center",
            letterSpacing: "-0.02em"
          }}>
            Selecciona tu Profesión
          </h2>

          {loadingProfessions ? (
            <div style={{ textAlign: "center", padding: "clamp(24px, 5vw, 40px)", color: "#999" }}>
              Cargando profesiones...
            </div>
          ) : (
            <div className="profession-grid" style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
              gap: "clamp(16px, 3vw, 24px)",
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
              marginTop: "clamp(24px, 4vw, 32px)",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              gap: "clamp(12px, 2.5vw, 16px)",
              alignItems: "center",
              width: "100%"
            }}>
              <div style={{
                display: "flex",
                flexDirection: "row",
                gap: "clamp(12px, 2.5vw, 16px)",
                justifyContent: "center",
                flexWrap: "wrap",
                width: "100%"
              }}>
                {games.length > 0 && (
                  <button
                    onClick={() => setShowNewGame(false)}
                    style={{
                      padding: "clamp(14px, 3vw, 18px) clamp(24px, 5vw, 32px)",
                      background: "white",
                      color: "#667eea",
                      border: "2px solid #667eea",
                      borderRadius: 16,
                      fontSize: "clamp(16px, 3.5vw, 18px)",
                      fontWeight: 800,
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      fontFamily: "'Montserrat', sans-serif",
                      minWidth: "120px"
                    }}
                  >
                    ← Volver
                  </button>
                )}
                
                <button
                  onClick={startGame}
                  disabled={startingGame}
                  style={{
                    padding: "clamp(14px, 3vw, 18px) clamp(32px, 6vw, 48px)",
                    background: startingGame 
                      ? "#ccc" 
                      : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: 16,
                    fontSize: "clamp(16px, 4vw, 20px)",
                    fontWeight: 800,
                    cursor: startingGame ? "not-allowed" : "pointer",
                    boxShadow: "0 8px 24px rgba(16, 185, 129, 0.3)",
                    transition: "all 0.3s ease",
                    fontFamily: "'Montserrat', sans-serif",
                    minWidth: "180px"
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
            </div>
          )}
        </div>
        )}
          </>
        )}
      </main>
      </div>
    </>
  )
}

