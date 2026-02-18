"use client"

import { useState, useEffect } from "react"
import Link from 'next/link'
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { createClientMicrocred } from '@/lib/supabase/client-microcred'

/**
 * Types & Interfaces
 */
interface Simulator {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  sort_order: number;
}

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

export default function CombinedSimulatorsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  // Tabs state
  const [activeTab, setActiveTab] = useState<"simulators" | "cashflow">("simulators")

  // --- Simulators State ---
  const [simulatorsList, setSimulatorsList] = useState<Simulator[]>([])
  const [loadingSims, setLoadingSims] = useState(true)
  const [simsError, setSimsError] = useState(false)

  // --- Cashflow State ---
  const [professions, setProfessions] = useState<Profession[]>([])
  const [selectedProfession, setSelectedProfession] = useState<number | null>(null)
  const [loadingProfessions, setLoadingProfessions] = useState(true)
  const [games, setGames] = useState<GameSummary[]>([])
  const [loadingGames, setLoadingGames] = useState(true)
  const [startingGame, setStartingGame] = useState(false)
  const [showNewGame, setShowNewGame] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Labels for simulators
  const categoryLabels: Record<string, string> = {
    budgeting: 'Presupuesto',
    savings: 'Ahorro',
    credit: 'Crédito',
    investment: 'Inversión',
    inflation: 'Inflación',
  };

  /**
   * Effects
   */
  useEffect(() => {
    const updateIsMobile = () => setIsMobile(window.innerWidth <= 767)
    updateIsMobile()
    window.addEventListener("resize", updateIsMobile)
    return () => window.removeEventListener("resize", updateIsMobile)
  }, [])

  // Fetch Simulators
  useEffect(() => {
    const fetchSimulators = async () => {
      try {
        const supabase = createClientMicrocred()
        const { data: simulators } = await supabase
          .from('simulators')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true })

        setSimulatorsList(simulators || [])
      } catch (err) {
        console.error('Error fetching simulators:', err)
        setSimsError(true)
      } finally {
        setLoadingSims(false)
      }
    }

    fetchSimulators()
  }, [])

  // Fetch Cashflow Data (only if user logged in)
  useEffect(() => {
    if (user) {
      fetchProfessions()
      fetchGames()
    }
  }, [user])

  /**
   * Cashflow Helpers
   */
  const fetchProfessions = async () => {
    try {
      const response = await fetch("/api/cashflow/professions")
      if (response.ok) {
        const data = await response.json()
        setProfessions(data)
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
      if (response.ok) fetchGames()
    } catch (error) {
      console.error("Error deleting game:", error)
    }
  }

  const startGame = async () => {
    if (!selectedProfession) return
    setStartingGame(true)
    try {
      const response = await fetch("/api/cashflow/start-game", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ professionId: selectedProfession })
      })
      if (response.ok) {
        const data = await response.json()
        router.push(`/cash-flow/game/${data.gameId}`)
      } else {
        const error = await response.json()
        alert(`Error: ${error.error || 'No se pudo iniciar el juego'}`)
      }
    } catch (error) {
      console.error("Error starting game:", error)
    } finally {
      setStartingGame(false)
    }
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
    return date.toLocaleDateString("es-ES")
  }

  const calculateTotalExpenses = (prof: Profession) => {
    return prof.taxes + prof.homeMortgagePayment + prof.schoolLoanPayment +
      prof.carLoanPayment + prof.creditCardPayment + prof.retailPayment +
      prof.otherExpenses
  }

  const calculateCashFlow = (prof: Profession) => {
    return prof.salary - calculateTotalExpenses(prof)
  }

  if (authLoading) return null

  return (
    <>
      <style>{`
        .tab-button {
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid transparent;
          font-family: 'Montserrat', sans-serif;
        }
        .tab-button.active {
          background: #0B71FE;
          color: white;
          box-shadow: 0 4px 12px rgba(11, 113, 254, 0.3);
        }
        .tab-button.inactive {
          background: white;
          color: #64748b;
          border-color: #e2e8f0;
        }
        .tab-button.inactive:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        /* Mobile specific adjustments merged from both pages */
        @media (max-width: 767px) {
          .simulador-outer {
            padding-bottom: 65px !important;
            min-height: calc(100vh - 65px) !important;
          }
          .simulador-main {
            width: 100% !important;
            max-width: 100% !important;
            margin-right: 0 !important;
            padding: 16px !important;
          }
        }

        /* Responsive sidebar gap adjustments */
        @media (min-width: 768px) and (max-width: 1160px) {
          .simulador-outer {
            width: calc(100% - 220px) !important;
            margin-left: 220px !important;
          }
        }
        @media (min-width: 1161px) {
          .simulador-outer {
            width: calc(100% - 280px) !important;
            margin-left: 280px !important;
          }
        }

        .simuladores-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
          width: 100%;
          align-items: stretch;
        }
        @media (min-width: 640px) {
          .simuladores-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 36px;
          }
        }
        @media (min-width: 1024px) {
          .simuladores-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 40px;
          }
        }

        .simulator-card {
          margin: 0 !important;
          height: 100%;
          min-height: 280px;
          box-sizing: border-box;
        }

        .cashflow-section-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(239,246,255,0.95) 50%, rgba(219,234,254,0.95) 100%);
          border-radius: 24px;
          padding: 32px;
          margin-bottom: 32px;
          boxShadow: 0 8px 32px rgba(11,113,254,0.15);
          border: 2px solid rgba(11, 113, 254, 0.1);
        }
      `}</style>

      <div className="simulador-outer" style={{
        width: "100%",
        minHeight: "100vh",
        background: "#ffffff",
        fontFamily: "'Montserrat', sans-serif",
        overflowX: "hidden"
      }}>
        <main className="simulador-main" style={{
          padding: "40px",
          maxWidth: "1400px",
          margin: "0 auto"
        }}>

          {/* Main Title */}
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <h1 style={{
              fontSize: "clamp(32px, 5vw, 56px)",
              fontWeight: 900,
              margin: "0 0 16px",
              background: "linear-gradient(135deg, #0B71FE, #4A9EFF)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.02em"
            }}>
              Simulador
            </h1>
            <p style={{
              fontSize: "19px",
              color: "#64748b",
              maxWidth: "800px",
              margin: "0 auto",
              lineHeight: 1.6
            }}>
              Explora herramientas interactivas y juegos para dominar tus finanzas personales y construir riqueza.
            </p>
          </div>

          {/* Tab Selection */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "16px",
            marginBottom: "40px",
            background: "#f1f5f9",
            padding: "8px",
            borderRadius: "20px",
            width: "fit-content",
            margin: "0 auto 48px"
          }}>
            <button
              className={`tab-button ${activeTab === "simulators" ? "active" : "inactive"}`}
              onClick={() => setActiveTab("simulators")}
            >
              Simuladores Financieros
            </button>
            <button
              className={`tab-button ${activeTab === "cashflow" ? "active" : "inactive"}`}
              onClick={() => setActiveTab("cashflow")}
            >
              Cashflow Game
            </button>
          </div>

          {/* Content Area */}
          <div style={{ minHeight: "60vh" }}>

            {activeTab === "simulators" && (
              <div key="simulators-tab">
                {/* Educational Disclaimer */}
                <div style={{
                  background: "rgba(59, 130, 246, 0.05)",
                  border: "2px solid rgba(59, 130, 246, 0.2)",
                  borderRadius: 20,
                  padding: "24px",
                  marginBottom: "40px",
                  maxWidth: "1000px",
                  margin: "0 auto 40px",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px"
                }}>
                  <span style={{ fontSize: "24px" }}>💡</span>
                  <p style={{ fontSize: 15, color: "#1e40af", lineHeight: 1.6, margin: 0 }}>
                    <strong>Propósito educativo:</strong> Estos simuladores son herramientas de aprendizaje.
                    Los resultados son aproximaciones y no constituyen asesoría financiera profesional.
                  </p>
                </div>

                <div style={{ display: "flex", justifyContent: "center", marginBottom: "40px" }}>
                  <Link href="/simulador/history" style={{ textDecoration: "none" }}>
                    <button style={{
                      padding: "12px 24px",
                      background: "white",
                      color: "#0B71FE",
                      border: "2px solid #0B71FE",
                      borderRadius: 12,
                      fontSize: 15,
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all 0.2s ease"
                    }}>
                      Mis Simulaciones Guardadas
                    </button>
                  </Link>
                </div>

                {simsError ? (
                  <div style={{ textAlign: "center", padding: "48px 0", color: "#ef4444" }}>
                    Error al cargar los simuladores.
                  </div>
                ) : loadingSims ? (
                  <div style={{ textAlign: "center", padding: "48px 0", color: "#64748b" }}>
                    Cargando simuladores...
                  </div>
                ) : (
                  <div className="simuladores-grid">
                    {simulatorsList.map((simulator) => (
                      <Link
                        key={simulator.id}
                        href={`/simulador/${simulator.slug}`}
                        style={{ textDecoration: "none" }}
                      >
                        <div className="simulator-card" style={{
                          background: "white",
                          borderRadius: 24,
                          padding: 28,
                          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                          border: "2px solid #f1f5f9",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          transition: "all 0.3s ease"
                        }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-4px)"
                            e.currentTarget.style.borderColor = "#0B71FE"
                            e.currentTarget.style.boxShadow = "0 12px 28px rgba(11, 113, 254, 0.15)"
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)"
                            e.currentTarget.style.borderColor = "#f1f5f9"
                            e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)"
                          }}>
                          <div style={{ marginBottom: 12 }}>
                            <span style={{
                              fontSize: 11,
                              fontWeight: 700,
                              padding: "4px 10px",
                              background: "#eff6ff",
                              color: "#1d4ed8",
                              borderRadius: 8,
                              textTransform: "uppercase"
                            }}>
                              {categoryLabels[simulator.category] || simulator.category}
                            </span>
                          </div>
                          <h3 style={{ fontSize: 22, fontWeight: 800, color: "#1e293b", marginBottom: 12 }}>
                            {simulator.name}
                          </h3>
                          <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.6, flex: 1, marginBottom: 24 }}>
                            {simulator.description}
                          </p>
                          <button style={{
                            width: "100%",
                            padding: "14px",
                            background: "linear-gradient(135deg, #0B71FE, #4A9EFF)",
                            color: "white",
                            border: "none",
                            borderRadius: 14,
                            fontSize: 15,
                            fontWeight: 700,
                            cursor: "pointer"
                          }}>
                            Abrir Simulador
                          </button>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "cashflow" && (
              <div key="cashflow-tab">
                {isMobile ? (
                  <div className="cashflow-section-card" style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto" }}>
                    <div style={{ fontSize: "64px", marginBottom: "20px" }}>💻</div>
                    <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>Mejor experiencia en laptop</h2>
                    <p style={{ color: "#64748b", lineHeight: 1.6, marginBottom: 20 }}>
                      Para tener una mejor experiencia de juego, te recomendamos abrir CashFlow en tu computadora.
                    </p>
                    <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "12px" }}>
                      📱 En móvil puedes revisar tu progreso y estadísticas
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="cashflow-section-card" style={{ textAlign: "center", position: "relative" }}>
                      <button
                        onClick={() => router.push("/simulador/stats")}
                        style={{
                          position: "absolute",
                          top: 24,
                          right: 24,
                          padding: "10px 20px",
                          background: "#eff6ff",
                          color: "#2563eb",
                          border: "1px solid #3b82f6",
                          borderRadius: 10,
                          fontWeight: 700,
                          cursor: "pointer"
                        }}
                      >
                        📊 Estadísticas
                      </button>
                      <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 16, color: "#1e293b" }}>CASHFLOW GAME</h2>
                      <p style={{ fontSize: 17, color: "#64748b", maxWidth: "700px", margin: "0 auto" }}>
                        Escapa de la "Carrera de Ratas" generando ingresos pasivos.
                        Aprende a invertir y construir independencia financiera.
                      </p>
                    </div>

                    {!loadingGames && games.length > 0 && !showNewGame && (
                      <div className="cashflow-section-card">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
                          <h2 style={{ fontSize: 28, fontWeight: 800 }}>Mis Partidas</h2>
                          <button
                            onClick={() => setShowNewGame(true)}
                            style={{
                              padding: "12px 24px",
                              background: "#10b981",
                              color: "white",
                              border: "none",
                              borderRadius: 12,
                              fontWeight: 700,
                              cursor: "pointer"
                            }}
                          >
                            + Nueva Partida
                          </button>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
                          {games.map((game) => game.player && (
                            <div key={game.id} style={{ background: "#f8fafc", borderRadius: 20, padding: 24, border: "2px solid #e2e8f0" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                                <div>
                                  <div style={{ fontSize: 19, fontWeight: 800 }}>{game.player.profession}</div>
                                  <div style={{ fontSize: 13, color: "#94a3b8" }}>{getTimeSince(game.lastActivityAt)}</div>
                                </div>
                                {game.player.hasEscapedRatRace && <span style={{ background: "#10b981", color: "white", padding: "4px 10px", borderRadius: 8, fontSize: 12, fontWeight: 700 }}>✓ Libre</span>}
                              </div>

                              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                                <div><div style={{ fontSize: 12, color: "#64748b" }}>Efectivo</div><div style={{ fontWeight: 700, color: "#10b981" }}>${game.player.cashOnHand.toLocaleString()}</div></div>
                                <div><div style={{ fontSize: 12, color: "#64748b" }}>Ingreso Pasivo</div><div style={{ fontWeight: 700, color: "#2563eb" }}>${game.player.passiveIncome.toLocaleString()}</div></div>
                              </div>

                              <div style={{ display: "flex", gap: 12 }}>
                                <button
                                  onClick={() => router.push(`/simulador/game/${game.id}`)}
                                  style={{ flex: 1, padding: "12px", background: "#6366f1", color: "white", border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer" }}
                                >
                                  Continuar
                                </button>
                                <button
                                  onClick={() => deleteGame(game.id)}
                                  style={{ padding: "12px", background: "white", color: "#ef4444", border: "1px solid #ef4444", borderRadius: 10, cursor: "pointer" }}
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {(showNewGame || games.length === 0) && (
                      <div className="cashflow-section-card">
                        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Selecciona tu Profesión</h2>
                        {loadingProfessions ? <p>Cargando...</p> : (
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
                            {professions.map((prof) => {
                              const totalExp = calculateTotalExpenses(prof)
                              const cashFlow = calculateCashFlow(prof)
                              const isSel = selectedProfession === prof.id
                              return (
                                <div
                                  key={prof.id}
                                  onClick={() => setSelectedProfession(prof.id)}
                                  style={{
                                    padding: 24,
                                    borderRadius: 20,
                                    cursor: "pointer",
                                    transition: "all 0.2s",
                                    border: `3px solid ${isSel ? "#0B71FE" : "#e2e8f0"}`,
                                    background: isSel ? "#eff6ff" : "white"
                                  }}
                                >
                                  <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>{prof.name}</h3>
                                  <div style={{ fontSize: 14, color: "#64748b", marginBottom: 16 }}>{prof.description}</div>
                                  <div style={{ background: "#f8fafc", padding: 12, borderRadius: 12, fontSize: 14 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                      <span>Salario:</span><span style={{ fontWeight: 700, color: "#10b981" }}>${prof.salary.toLocaleString()}</span>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                      <span>Cash Flow:</span><span style={{ fontWeight: 700, color: cashFlow > 0 ? "#10b981" : "#ef4444" }}>${cashFlow.toLocaleString()}</span>
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        )}

                        {selectedProfession && (
                          <div style={{ marginTop: 40, textAlign: "center", display: "flex", justifyContent: "center", gap: 16 }}>
                            {games.length > 0 && <button onClick={() => setShowNewGame(false)} style={{ padding: "16px 32px", background: "white", border: "2px solid #6366f1", borderRadius: 16, fontWeight: 800, cursor: "pointer" }}>← Volver</button>}
                            <button
                              onClick={startGame}
                              disabled={startingGame}
                              style={{ padding: "16px 48px", background: "#10b981", color: "white", border: "none", borderRadius: 16, fontSize: 20, fontWeight: 800, cursor: "pointer" }}
                            >
                              {startingGame ? "Iniciando..." : "🚀 Comenzar Juego"}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

          </div>

        </main>
      </div>
    </>
  )
}
