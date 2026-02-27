"use client"

import { useState, useEffect } from "react"
import Link from 'next/link'
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { createClientMicrocred } from '@/lib/supabase/client-microcred'
import { BarChart2, Briefcase, PiggyBank, CreditCard, TrendingUp, Percent, ChevronRight, Trash2, Play, Plus, MonitorSmartphone, Laptop } from "lucide-react"

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

const CATEGORY_ICONS: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  budgeting: BarChart2,
  savings: PiggyBank,
  credit: CreditCard,
  investment: TrendingUp,
  inflation: Percent,
}

const CATEGORY_LABELS: Record<string, string> = {
  budgeting: 'Presupuesto',
  savings: 'Ahorro',
  credit: 'Crédito',
  investment: 'Inversión',
  inflation: 'Inflación',
}

const CATEGORY_ACCENT: Record<string, string> = {
  budgeting: '#3b82f6',
  savings: '#10b981',
  credit: '#f59e0b',
  investment: '#8b5cf6',
  inflation: '#ef4444',
}

export default function CombinedSimulatorsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  const [activeTab, setActiveTab] = useState<"simulators" | "cashflow">("cashflow")

  const [simulatorsList, setSimulatorsList] = useState<Simulator[]>([])
  const [loadingSims, setLoadingSims] = useState(true)
  const [simsError, setSimsError] = useState(false)

  const [professions, setProfessions] = useState<Profession[]>([])
  const [selectedProfession, setSelectedProfession] = useState<number | null>(null)
  const [loadingProfessions, setLoadingProfessions] = useState(true)
  const [games, setGames] = useState<GameSummary[]>([])
  const [loadingGames, setLoadingGames] = useState(true)
  const [startingGame, setStartingGame] = useState(false)
  const [showNewGame, setShowNewGame] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth <= 767)
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  useEffect(() => {
    const fetchSimulators = async () => {
      try {
        const supabase = createClientMicrocred()
        const { data: simulators } = await supabase.from('simulators').select('*').eq('is_active', true).order('sort_order', { ascending: true })
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

  useEffect(() => {
    if (user) {
      fetchProfessions()
      fetchGames()
    }
  }, [user])

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
      const response = await fetch(`/api/cashflow/game/${gameId}/delete`, { method: "DELETE" })
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

  const calculateTotalExpenses = (prof: Profession) =>
    prof.taxes + prof.homeMortgagePayment + prof.schoolLoanPayment +
    prof.carLoanPayment + prof.creditCardPayment + prof.retailPayment + prof.otherExpenses

  const calculateCashFlow = (prof: Profession) =>
    prof.salary - calculateTotalExpenses(prof)

  if (authLoading) return null

  return (
    <>
      <style>{`
        /* Base layout */
        .simulador-outer {
          width: 100%;
          min-height: 100vh;
          background: #f8fafc;
          font-family: 'Montserrat', sans-serif;
          overflow-x: hidden;
        }
        @media (max-width: 767px) {
          .simulador-outer { padding-bottom: 65px !important; }
          .simulador-main  { padding: 20px 16px !important; }
        }
        @media (min-width: 768px) and (max-width: 1160px) {
          .simulador-outer { width: calc(100% - 220px) !important; margin-left: 220px !important; }
        }
        @media (min-width: 1161px) {
          .simulador-outer { width: calc(100% - 280px) !important; margin-left: 280px !important; }
        }

        /* Simulator cards grid */
        .simuladores-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          width: 100%;
        }
        @media (min-width: 640px)  { .simuladores-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .simuladores-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 1600px) { .simuladores-grid { grid-template-columns: repeat(4, 1fr); } }

        /* Tab button */
        .tab-btn {
          padding: 10px 22px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.25s ease;
          border: none;
          font-family: 'Montserrat', sans-serif;
          white-space: nowrap;
        }
        .tab-btn.active   { background: #0B71FE; color: white; box-shadow: 0 4px 14px rgba(11,113,254,0.35); }
        .tab-btn.inactive { background: transparent; color: #64748b; }
        .tab-btn.inactive:hover { background: rgba(255,255,255,0.6); color: #0B71FE; }

        /* Profession card hover */
        .prof-card { transition: all 0.2s ease; }
        .prof-card:hover { transform: translateY(-2px); }

        /* Simulator card hover */
        .sim-card { transition: all 0.25s ease; }
        .sim-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(11,113,254,0.15) !important; border-color: #0B71FE !important; }

        /* Game card hover */
        .game-card { transition: all 0.2s ease; }
        .game-card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.1) !important; }

        @keyframes shimmer-slide {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .start-btn-active {
          animation: shimmer-slide 2.5s linear infinite;
          background-size: 200% 100%;
        }
      `}</style>

      <div className="simulador-outer">
        <main className="simulador-main" style={{
          padding: "clamp(24px, 4vw, 56px) clamp(16px, 4vw, 56px)",
          maxWidth: "1800px",
          margin: "0 auto",
          width: "100%",
          boxSizing: "border-box"
        }}>

          {/* Header */}
          <div style={{ marginBottom: "40px" }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(11,113,254,0.08)",
              border: "1px solid rgba(11,113,254,0.2)",
              borderRadius: 999,
              padding: "6px 16px",
              marginBottom: 16,
              fontSize: 12,
              fontWeight: 700,
              color: "#0B71FE",
              letterSpacing: "0.08em",
              textTransform: "uppercase"
            }}>
              <BarChart2 size={14} />
              Herramientas Interactivas
            </div>
            <h1 style={{
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 900,
              margin: "0 0 12px",
              color: "#0f172a",
              letterSpacing: "-0.02em",
              lineHeight: 1.15
            }}>
              Simulador Financiero
            </h1>
            <p style={{
              fontSize: "clamp(15px, 1.3vw, 18px)",
              color: "#64748b",
              maxWidth: "640px",
              margin: 0,
              lineHeight: 1.65
            }}>
              Explora herramientas interactivas y juegos para dominar tus finanzas personales y construir riqueza real.
            </p>
          </div>

          {/* Tab Selection */}
          <div style={{
            display: "flex",
            gap: "6px",
            marginBottom: "40px",
            background: "#f1f5f9",
            padding: "6px",
            borderRadius: "14px",
            width: "fit-content",
            border: "1px solid #e2e8f0"
          }}>
            <button className={`tab-btn ${activeTab === "simulators" ? "active" : "inactive"}`} onClick={() => setActiveTab("simulators")}>
              Simuladores Financieros
            </button>
            <button className={`tab-btn ${activeTab === "cashflow" ? "active" : "inactive"}`} onClick={() => setActiveTab("cashflow")}>
              Cashflow Game
            </button>
          </div>

          {/* Content */}
          <div style={{ minHeight: "50vh" }}>

            {/* ─── SIMULADORES ─── */}
            {activeTab === "simulators" && (
              <div>
                {/* Disclaimer */}
                <div style={{
                  background: "linear-gradient(135deg, rgba(239,246,255,0.8), rgba(219,234,254,0.8))",
                  border: "1.5px solid rgba(59,130,246,0.25)",
                  borderRadius: 16,
                  padding: "18px 22px",
                  marginBottom: "32px",
                  maxWidth: "900px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "14px"
                }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(59,130,246,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                    <BarChart2 size={16} color="#2563eb" />
                  </div>
                  <p style={{ fontSize: 14, color: "#1e40af", lineHeight: 1.65, margin: 0 }}>
                    <strong>Propósito educativo:</strong> Estos simuladores son herramientas de aprendizaje. Los resultados son aproximaciones y no constituyen asesoría financiera profesional.
                  </p>
                </div>

                {/* Saved simulations button */}
                <div style={{ marginBottom: "32px" }}>
                  <Link href="/cash-flow/history" style={{ textDecoration: "none" }}>
                    <button style={{
                      padding: "11px 22px",
                      background: "white",
                      color: "#0B71FE",
                      border: "1.5px solid #0B71FE",
                      borderRadius: 12,
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      transition: "all 0.2s"
                    }}>
                      Mis Simulaciones Guardadas
                      <ChevronRight size={16} />
                    </button>
                  </Link>
                </div>

                {simsError ? (
                  <div style={{ textAlign: "center", padding: "48px 0", color: "#ef4444", fontSize: 16, fontWeight: 600 }}>
                    Error al cargar los simuladores.
                  </div>
                ) : loadingSims ? (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
                    {Array(6).fill(0).map((_, i) => (
                      <div key={i} style={{ background: "#f1f5f9", borderRadius: 20, height: 280, animation: "shimmer-slide 1.5s linear infinite", backgroundImage: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)", backgroundSize: "200% 100%" }} />
                    ))}
                  </div>
                ) : (
                  <div className="simuladores-grid">
                    {simulatorsList.map((simulator) => {
                      const IconComponent = CATEGORY_ICONS[simulator.category] || BarChart2
                      const accent = CATEGORY_ACCENT[simulator.category] || '#0B71FE'
                      return (
                        <Link key={simulator.id} href={`/cash-flow/${simulator.slug}`} style={{ textDecoration: "none" }}>
                          <div className="sim-card" style={{
                            background: "white",
                            borderRadius: 20,
                            padding: "26px 24px",
                            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                            border: "1.5px solid #f1f5f9",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            boxSizing: "border-box"
                          }}>
                            {/* Icon + category */}
                            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 }}>
                              <div style={{ width: 48, height: 48, borderRadius: 14, background: `${accent}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <IconComponent size={22} color={accent} />
                              </div>
                              <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", background: `${accent}12`, color: accent, borderRadius: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                                {CATEGORY_LABELS[simulator.category] || simulator.category}
                              </span>
                            </div>
                            <h3 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 10, lineHeight: 1.25 }}>
                              {simulator.name}
                            </h3>
                            <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.65, flex: 1, marginBottom: 22 }}>
                              {simulator.description}
                            </p>
                            <button style={{
                              width: "100%",
                              padding: "13px",
                              background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
                              color: "white",
                              border: "none",
                              borderRadius: 12,
                              fontSize: 14,
                              fontWeight: 700,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 8
                            }}>
                              Abrir Simulador
                              <ChevronRight size={16} />
                            </button>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ─── CASHFLOW ─── */}
            {activeTab === "cashflow" && (
              <div>
                {isMobile ? (
                  /* Mobile: info card */
                  <div style={{
                    background: "linear-gradient(135deg, #0f172a, #1e1b4b)",
                    borderRadius: 24,
                    padding: "40px 28px",
                    textAlign: "center",
                    maxWidth: 480,
                    margin: "0 auto",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
                  }}>
                    <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(11,113,254,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                      <Laptop size={36} color="#3b82f6" />
                    </div>
                    <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 14, color: "white" }}>Mejor experiencia en laptop</h2>
                    <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.65, marginBottom: 20, fontSize: 15 }}>
                      Para tener una mejor experiencia de juego, te recomendamos abrir CashFlow en tu computadora.
                    </p>
                    <div style={{ background: "rgba(255,255,255,0.06)", padding: "14px 18px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: 10, justifyContent: "center" }}>
                      <MonitorSmartphone size={18} color="#64748b" />
                      <span style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>En móvil puedes revisar tu progreso y estadísticas</span>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Hero Card */}
                    <div style={{
                      background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
                      borderRadius: 24,
                      padding: "40px clamp(28px, 5vw, 56px)",
                      marginBottom: "32px",
                      position: "relative",
                      overflow: "hidden",
                      border: "1px solid rgba(255,255,255,0.08)",
                      boxShadow: "0 20px 60px rgba(0,0,0,0.25)"
                    }}>
                      {/* Background decoration */}
                      <div aria-hidden style={{ position: "absolute", top: "-30%", right: "-5%", width: "45%", height: "200%", background: "radial-gradient(circle, rgba(11,113,254,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
                      <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(11,113,254,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(11,113,254,0.04) 1px, transparent 1px)", backgroundSize: "48px 48px", pointerEvents: "none" }} />

                      <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 20 }}>
                        <div>
                          <div style={{ display: "inline-block", background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.3)", borderRadius: 999, padding: "5px 14px", marginBottom: 16, fontSize: 11, fontWeight: 700, color: "#fbbf24", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                            Juego de Simulación
                          </div>
                          <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 900, marginBottom: 12, color: "white", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                            CASHFLOW GAME
                          </h2>
                          <p style={{ fontSize: "clamp(14px, 1.3vw, 17px)", color: "rgba(255,255,255,0.6)", maxWidth: 560, lineHeight: 1.65, margin: 0 }}>
                            Escapa de la Carrera de Ratas generando ingresos pasivos. Aprende a invertir y construir independencia financiera real.
                          </p>
                        </div>
                        <button
                          onClick={() => router.push("/cash-flow/stats")}
                          style={{
                            padding: "11px 20px",
                            background: "rgba(255,255,255,0.08)",
                            color: "rgba(255,255,255,0.8)",
                            border: "1px solid rgba(255,255,255,0.15)",
                            borderRadius: 12,
                            fontWeight: 700,
                            cursor: "pointer",
                            fontSize: 14,
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            transition: "all 0.2s",
                            whiteSpace: "nowrap",
                            alignSelf: "flex-start"
                          }}
                        >
                          <BarChart2 size={16} />
                          Estadísticas
                        </button>
                      </div>
                    </div>

                    {/* Existing Games */}
                    {!loadingGames && games.length > 0 && !showNewGame && (
                      <div style={{
                        background: "white",
                        borderRadius: 20,
                        padding: "28px 32px",
                        marginBottom: "28px",
                        border: "1.5px solid #f1f5f9",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
                          <h2 style={{ fontSize: "clamp(20px, 2vw, 26px)", fontWeight: 800, color: "#0f172a", margin: 0 }}>Mis Partidas</h2>
                          <button
                            onClick={() => setShowNewGame(true)}
                            style={{
                              padding: "10px 20px",
                              background: "linear-gradient(135deg, #059669, #10b981)",
                              color: "white",
                              border: "none",
                              borderRadius: 12,
                              fontWeight: 700,
                              cursor: "pointer",
                              fontSize: 14,
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              boxShadow: "0 4px 14px rgba(16,185,129,0.35)"
                            }}
                          >
                            <Plus size={16} />
                            Nueva Partida
                          </button>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
                          {games.map((game) => game.player && (
                            <div key={game.id} className="game-card" style={{
                              background: "#FBFAF5",
                              borderRadius: 16,
                              padding: 22,
                              border: "1.5px solid #e2e8f0",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
                            }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                                <div>
                                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #1d4ed8, #3b82f6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                      <Briefcase size={15} color="white" />
                                    </div>
                                    <div style={{ fontSize: 17, fontWeight: 800, color: "#0f172a" }}>{game.player.profession}</div>
                                  </div>
                                  <div style={{ fontSize: 12, color: "#94a3b8", marginLeft: 40 }}>{getTimeSince(game.lastActivityAt)}</div>
                                </div>
                                {game.player.hasEscapedRatRace && (
                                  <span style={{ background: "linear-gradient(135deg, #059669, #10b981)", color: "white", padding: "4px 10px", borderRadius: 8, fontSize: 11, fontWeight: 700, boxShadow: "0 2px 8px rgba(16,185,129,0.3)" }}>
                                    Libre
                                  </span>
                                )}
                              </div>

                              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
                                <div style={{ background: "white", padding: "10px 12px", borderRadius: 10, border: "1px solid #f1f5f9" }}>
                                  <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, marginBottom: 2 }}>Efectivo</div>
                                  <div style={{ fontWeight: 800, color: "#059669", fontSize: 16 }}>${game.player.cashOnHand.toLocaleString()}</div>
                                </div>
                                <div style={{ background: "white", padding: "10px 12px", borderRadius: 10, border: "1px solid #f1f5f9" }}>
                                  <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, marginBottom: 2 }}>Ingreso Pasivo</div>
                                  <div style={{ fontWeight: 800, color: "#2563eb", fontSize: 16 }}>${game.player.passiveIncome.toLocaleString()}</div>
                                </div>
                              </div>

                              <div style={{ display: "flex", gap: 10 }}>
                                <button
                                  onClick={() => router.push(`/cash-flow/game/${game.id}`)}
                                  style={{ flex: 1, padding: "11px", background: "linear-gradient(135deg, #4f46e5, #6366f1)", color: "white", border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                                >
                                  <Play size={14} fill="white" />
                                  Continuar
                                </button>
                                <button
                                  onClick={() => deleteGame(game.id)}
                                  style={{ padding: "11px 14px", background: "white", color: "#ef4444", border: "1.5px solid #fecaca", borderRadius: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* New Game / Profession Selector */}
                    {(showNewGame || games.length === 0) && (
                      <div style={{
                        background: "white",
                        borderRadius: 20,
                        padding: "28px 32px",
                        border: "1.5px solid #f1f5f9",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
                      }}>
                        <h2 style={{ fontSize: "clamp(18px, 2vw, 24px)", fontWeight: 800, marginBottom: 24, color: "#0f172a" }}>
                          Selecciona tu Profesión
                        </h2>

                        {loadingProfessions ? (
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
                            {Array(4).fill(0).map((_, i) => (
                              <div key={i} style={{ height: 160, borderRadius: 16, background: "#f1f5f9", backgroundImage: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)", backgroundSize: "200% 100%", animation: "shimmer-slide 1.5s linear infinite" }} />
                            ))}
                          </div>
                        ) : (
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
                            {professions.map((prof) => {
                              const totalExp = calculateTotalExpenses(prof)
                              const cashFlow = calculateCashFlow(prof)
                              const isSel = selectedProfession === prof.id
                              const cfPositive = cashFlow >= 0
                              return (
                                <div
                                  key={prof.id}
                                  className="prof-card"
                                  onClick={() => setSelectedProfession(prof.id)}
                                  style={{
                                    padding: 22,
                                    borderRadius: 16,
                                    cursor: "pointer",
                                    border: isSel ? "2px solid #0B71FE" : "1.5px solid #e2e8f0",
                                    background: isSel ? "linear-gradient(135deg, rgba(11,113,254,0.06), rgba(11,113,254,0.02))" : "white",
                                    boxShadow: isSel ? "0 8px 24px rgba(11,113,254,0.15)" : "0 2px 8px rgba(0,0,0,0.04)"
                                  }}
                                >
                                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                                    <div style={{ width: 36, height: 36, borderRadius: 10, background: isSel ? "rgba(11,113,254,0.12)" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                      <Briefcase size={18} color={isSel ? "#0B71FE" : "#64748b"} />
                                    </div>
                                    <h3 style={{ fontSize: 17, fontWeight: 800, margin: 0, color: "#0f172a" }}>{prof.name}</h3>
                                  </div>
                                  {prof.description && (
                                    <div style={{ fontSize: 13, color: "#64748b", marginBottom: 14, lineHeight: 1.5 }}>{prof.description}</div>
                                  )}
                                  <div style={{ background: "#FBFAF5", padding: "12px 14px", borderRadius: 10, fontSize: 13 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                                      <span style={{ color: "#64748b" }}>Salario</span>
                                      <span style={{ fontWeight: 800, color: "#059669" }}>${prof.salary.toLocaleString()}</span>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                      <span style={{ color: "#64748b" }}>Cash Flow</span>
                                      <span style={{ fontWeight: 800, color: cfPositive ? "#059669" : "#ef4444" }}>${cashFlow.toLocaleString()}</span>
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        )}

                        {selectedProfession && (
                          <div style={{ marginTop: 36, display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
                            {games.length > 0 && (
                              <button
                                onClick={() => setShowNewGame(false)}
                                style={{ padding: "14px 28px", background: "white", border: "1.5px solid #e2e8f0", borderRadius: 14, fontWeight: 700, cursor: "pointer", fontSize: 15, color: "#64748b" }}
                              >
                                Volver
                              </button>
                            )}
                            <button
                              onClick={startGame}
                              disabled={startingGame}
                              className={startingGame ? "" : "start-btn-active"}
                              style={{
                                padding: "14px 40px",
                                background: startingGame
                                  ? "#94a3b8"
                                  : "linear-gradient(135deg, #059669 0%, #0B71FE 60%, #059669 100%)",
                                backgroundSize: "200% 100%",
                                color: "white",
                                border: "none",
                                borderRadius: 14,
                                fontSize: "clamp(15px, 1.5vw, 18px)",
                                fontWeight: 800,
                                cursor: startingGame ? "not-allowed" : "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                boxShadow: startingGame ? "none" : "0 8px 24px rgba(11,113,254,0.35)"
                              }}
                            >
                              <Play size={20} fill="white" />
                              {startingGame ? "Iniciando..." : "Comenzar Juego"}
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
