"use client"

import { useState, useEffect } from "react"
import Link from 'next/link'
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { createClientMicrocred } from '@/lib/supabase/client-microcred'
import { BarChart2, Briefcase, PiggyBank, CreditCard, TrendingUp, Percent, ChevronRight, Trash2, Play, Plus, MonitorSmartphone, Laptop } from "lucide-react"
import StreakWidget from "@/components/StreakWidget"
import PageLoader from "@/components/PageLoader"

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
  const { user, loading: authLoading, dbProfile } = useAuth()
  const streak = dbProfile?.currentStreak || 0
  const router = useRouter()

  const [activeTab, setActiveTab] = useState<"simulators" | "cashflow">("simulators")

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
  const [weeklyActiveDays, setWeeklyActiveDays] = useState<string[]>([])

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
      // Fetch weekly active days for calendar
      fetch("/api/user/stats")
        .then(r => r.ok ? r.json() : null)
        .then(data => { if (data?.weeklyActiveDays) setWeeklyActiveDays(data.weeklyActiveDays) })
        .catch(() => { })
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

  if (authLoading) return <PageLoader />

  return (
    <>
      <style>{`
        /* Base layout */
        .simulador-outer {
          width: 100%;
          min-height: 100vh;
          background: linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%);
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif;
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
          border-radius: 12px;
          font-weight: 500;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          border: none;
          font-family: inherit;
          white-space: nowrap;
        }
        .tab-btn.active   { background: linear-gradient(135deg, #0B71FE, #1e40af); color: white; box-shadow: 0 4px 20px rgba(11,113,254,0.4); }
        .tab-btn.inactive { background: #F1F5F9; color: #64748B; }
        .tab-btn.inactive:hover { background: #E2E8F0; color: #1e293b; }

        /* Profession card hover */
        .prof-card { transition: all 0.3s ease; }
        .prof-card:hover { transform: translateY(-4px); border-color: rgba(11,113,254,0.6) !important; box-shadow: 0 12px 40px rgba(11,113,254,0.2) !important; }

        /* Simulator card hover */
        .sim-card {
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          background: linear-gradient(135deg, #020b18 0%, #061440 100%) !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .sim-card:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 30px 60px rgba(11, 113, 254, 0.3) !important;
          border-color: rgba(11, 113, 254, 0.5) !important;
          background: linear-gradient(135deg, #040f24 0%, #0b2160 100%) !important;
        }

        .sim-card h3 { color: white !important; }
        .sim-card p { color: rgba(255, 255, 255, 0.6) !important; }
        .sim-card .category-badge { background: rgba(255, 255, 255, 0.05) !important; color: white !important; border: 1px solid rgba(255, 255, 255, 0.1) !important; }

        /* Game card hover */
        .game-card { transition: all 0.3s ease; }
        .game-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.08) !important; border-color: rgba(11,113,254,0.2) !important; }

        @keyframes shimmer-slide {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes float-orb {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }
        .start-btn-active {
          animation: shimmer-slide 2.5s linear infinite;
          background-size: 200% 100%;
        }
        .orb-1 { animation: float-orb 8s ease-in-out infinite; }
        .orb-2 { animation: float-orb 11s ease-in-out infinite reverse; }
        .orb-3 { animation: float-orb 14s ease-in-out infinite; }
      `}</style>

      <div className="simulador-outer">

        <main className="simulador-main" style={{
          position: "relative",
          zIndex: 1,
          padding: "clamp(24px, 4vw, 56px) clamp(16px, 4vw, 56px)",
          maxWidth: "1800px",
          margin: "0 auto",
          width: "100%",
          boxSizing: "border-box"
        }}>

          {/* Header */}
          <div style={{ marginBottom: "40px" }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: 16,
              marginBottom: 0,
            }}>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(11,113,254,0.1)", border: "1px solid rgba(11,113,254,0.2)", borderRadius: 999, padding: "6px 16px", marginBottom: 20, fontSize: 12, fontWeight: 700, color: "#0B71FE", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#0B71FE", display: "inline-block" }} />
                  Centro Financiero Interactivo
                </div>
                <h1 style={{
                  fontSize: "clamp(28px, 5.5vw, 60px)",
                  fontWeight: 800,
                  margin: "0 0 18px",
                  background: "linear-gradient(135deg, #0f172a 0%, #0F62FE 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: "-0.04em",
                  lineHeight: 1.15
                }}>
                  Simulador Financiero
                </h1>
                <p style={{ fontSize: "clamp(16px, 2vw, 20px)", color: "#64748B", margin: 0, lineHeight: 1.6, maxWidth: "700px" }}>
                  Explora el impacto de tus decisiones y domina las finanzas con nuestras herramientas avanzadas.
                </p>
              </div>
              <StreakWidget streak={streak} showCalendar activeDays={weeklyActiveDays} />
            </div>
          </div>

          {/* Tab Selection - Dark Glassmorphism */}
          <div style={{
            display: "flex",
            marginBottom: "48px",
            background: "rgba(11, 113, 254, 0.04)",
            border: "1px solid rgba(11, 113, 254, 0.1)",
            padding: "20px 24px",
            borderRadius: 20,
            alignItems: "center",
            gap: 16,
            boxShadow: "0 2px 10px rgba(0,0,0,0.02)"
          }}>
            <button className={`tab-btn ${activeTab === "simulators" ? "active" : "inactive"}`} onClick={() => setActiveTab("simulators")}>
              Simuladores Financieros
            </button>
            <button className={`tab-btn ${activeTab === "cashflow" ? "active" : "inactive"}`} onClick={() => setActiveTab("cashflow")}>
              Cashflow Game
            </button>
          </div>

          {/* Content */}
          <div style={{ minHeight: "50vh", position: "relative", zIndex: 1 }}>

            {/* ─── SIMULADORES ─── */}
            {activeTab === "simulators" && (
              <div>
                {/* Disclaimer - Dark Glassmorphism */}
                <div style={{
                  background: "white",
                  padding: "16px 24px",
                  borderRadius: 20,
                  border: "1px solid #f1f5f9",
                  boxShadow: "0 4px 20px rgba(11,113,254,0.05)",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  height: "100%",
                  marginBottom: "40px",
                  maxWidth: "960px",
                }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(11,113,254,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <BarChart2 size={18} color="#0B71FE" />
                  </div>
                  <p style={{ fontSize: 14, color: "#1e40af", lineHeight: 1.65, margin: 0 }}>
                    <strong style={{ color: "#0B71FE" }}>Propósito educativo:</strong> Estos simuladores son herramientas de aprendizaje. Los resultados son aproximaciones y no constituyen asesoría financiera profesional.
                  </p>
                </div>

                {/* Saved simulations button */}
                <div style={{ marginBottom: "36px" }}>
                  <Link href="/cash-flow/history" style={{ textDecoration: "none" }}>
                    <button style={{
                      padding: "12px 24px",
                      background: "white",
                      color: "#1e293b",
                      border: "1px solid #e2e8f0",
                      borderRadius: 14,
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      transition: "all 0.3s",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.03)"
                    }}>
                      Mis Simulaciones Guardadas
                      <ChevronRight size={16} />
                    </button>
                  </Link>
                </div>

                {simsError ? (
                  <div style={{ textAlign: "center", padding: "48px 0", color: "#ef4444", fontSize: 16, fontWeight: 500 }}>
                    Error al cargar los simuladores.
                  </div>
                ) : loadingSims ? (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
                    {Array(6).fill(0).map((_, i) => (
                      <div key={i} style={{ backgroundColor: "#f1f5f9", borderRadius: 20, height: 280, animation: "shimmer-slide 1.5s linear infinite", backgroundImage: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)", backgroundSize: "200% 100%" }} />
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
                            padding: 24,
                            border: "1px solid #f1f5f9",
                            display: "flex",
                            flexDirection: "column",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                            height: "100%",
                            boxSizing: "border-box",
                            position: "relative",
                            overflow: "hidden"
                          }}>
                            {/* Subtle inner glow */}
                            {/* Icon + category */}
                            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
                              <div style={{ width: 52, height: 52, borderRadius: 16, background: `${accent}20`, border: `1px solid ${accent}30`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 20px ${accent}20` }}>
                                <IconComponent size={24} color={accent} />
                              </div>
                              <span style={{ fontSize: 10, fontWeight: 700, padding: "5px 12px", background: `${accent}15`, color: accent, borderRadius: 999, textTransform: "uppercase", letterSpacing: "0.1em", border: `1px solid ${accent}25` }}>
                                {CATEGORY_LABELS[simulator.category] || simulator.category}
                              </span>
                            </div>
                            <h3 style={{ fontSize: 19, fontWeight: 700, color: "#1e293b", marginBottom: 10, lineHeight: 1.25, letterSpacing: "-0.01em" }}>
                              {simulator.name}
                            </h3>
                            <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.7, flex: 1, marginBottom: 24 }}>
                              {simulator.description}
                            </p>
                            <button style={{
                              width: "100%",
                              padding: "14px",
                              background: `linear-gradient(135deg, ${accent}ee, ${accent}99)`,
                              color: "white",
                              border: `1px solid ${accent}40`,
                              borderRadius: 14,
                              fontSize: 14,
                              fontWeight: 600,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 8,
                              boxShadow: `0 4px 20px ${accent}30`,
                              letterSpacing: "0.01em"
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
                    border: "1px solid #f1f5f9",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
                  }}>
                    <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(11,113,254,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                      <Laptop size={36} color="#3b82f6" />
                    </div>
                    <h2 style={{ fontSize: 22, fontWeight: 500, marginBottom: 14, color: "#1e293b" }}>Mejor experiencia en laptop</h2>
                    <p style={{ color: "#64748B", lineHeight: 1.65, marginBottom: 20, fontSize: 15 }}>
                      Para tener una mejor experiencia de juego, te recomendamos abrir CashFlow en tu computadora.
                    </p>
                    <div style={{ background: "#F1F5F9", padding: "14px 18px", borderRadius: 12, border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: 10, justifyContent: "center" }}>
                      <MonitorSmartphone size={18} color="#64748b" />
                      <span style={{ fontSize: 14, color: "#64748B" }}>En móvil puedes revisar tu progreso y estadísticas</span>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Hero Card */}
                    <div style={{
                      position: "relative",
                      background: "linear-gradient(135deg, #020b18 0%, #061440 100%)",
                      borderRadius: 28,
                      padding: "clamp(32px, 5vw, 60px) clamp(24px, 4vw, 48px)",
                      marginBottom: 48,
                      boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                      overflow: "hidden",
                      border: "1px solid rgba(255, 255, 255, 0.08)"
                    }}>
                      {/* Background decoration */}
                      <div aria-hidden style={{ position: "absolute", top: "-30%", right: "-5%", width: "45%", height: "200%", background: "radial-gradient(circle, rgba(11,113,254,0.2) 0%, transparent 70%)", pointerEvents: "none" }} />
                      <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "48px 48px", pointerEvents: "none" }} />

                      <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 32 }}>
                        <div>
                          <div style={{ display: "inline-block", background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.3)", borderRadius: 999, padding: "5px 14px", marginBottom: 16, fontSize: 11, fontWeight: 600, color: "#fbbf24", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                            Juego de Simulación Interactivo
                          </div>
                          <h2 style={{ fontSize: "clamp(28px, 4.5vw, 56px)", fontWeight: 800, marginBottom: 16, color: "white", letterSpacing: "-0.04em", lineHeight: 1.05 }}>
                            CASHFLOW GAME
                          </h2>
                          <p style={{ fontSize: "clamp(16px, 1.3vw, 20px)", color: "rgba(255,255,255,0.6)", maxWidth: 620, lineHeight: 1.7, margin: 0, fontWeight: 400 }}>
                            Escapa de la Carrera de Ratas generando ingresos pasivos. Aprende a invertir, administrar activos y construir independencia financiera real de forma divertida.
                          </p>
                        </div>
                        <button
                          onClick={() => router.push("/cash-flow/stats")}
                          style={{
                            padding: "14px 28px",
                            background: "rgba(255,255,255,0.08)",
                            color: "white",
                            border: "1px solid rgba(255,255,255,0.15)",
                            borderRadius: 16,
                            fontWeight: 600,
                            cursor: "pointer",
                            fontSize: 15,
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                            whiteSpace: "nowrap",
                            alignSelf: "flex-start",
                            backdropFilter: "blur(10px)"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(255,255,255,0.12)"
                            e.currentTarget.style.transform = "translateY(-2px)"
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "rgba(255,255,255,0.08)"
                            e.currentTarget.style.transform = "translateY(0)"
                          }}
                        >
                          <BarChart2 size={18} />
                          Ver Estadísticas
                        </button>
                      </div>
                    </div>

                    {/* Existing Games */}
                    {!loadingGames && games.length > 0 && !showNewGame && (
                      <div style={{
                        background: "white",
                        borderRadius: 24,
                        padding: "clamp(24px, 3vw, 32px)",
                        border: "1px solid #f1f5f9",
                        boxShadow: "0 8px 30px rgba(11,113,254,0.04)",
                        marginBottom: 32
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
                          <h2 style={{ fontSize: "clamp(20px, 2vw, 26px)", fontWeight: 700, color: "#1e293b", margin: 0 }}>Mis Partidas</h2>
                          <button
                            onClick={() => setShowNewGame(true)}
                            style={{
                              padding: "10px 22px",
                              background: "linear-gradient(135deg, #0B71FE, #1e40af)",
                              color: "white",
                              border: "none",
                              borderRadius: 14,
                              fontSize: 14,
                              fontWeight: 600,
                              cursor: "pointer",
                              transition: "all 0.2s ease",
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              boxShadow: "0 4px 12px rgba(11, 113, 254, 0.25)"
                            }}
                          >
                            <Plus size={16} />
                            Nueva Partida
                          </button>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
                          {games.map((game) => game.player && (
                            <div key={game.id} className="game-card" style={{
                              background: "white",
                              borderRadius: 24,
                              padding: "clamp(16px, 3vw, 32px)",
                              border: "1px solid #f1f5f9",
                              boxShadow: "0 8px 30px rgba(0,0,0,0.04)",
                              display: "flex",
                              flexDirection: "column",
                              height: "100%",
                              position: "relative",
                              overflow: "hidden"
                            }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                                <div>
                                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #1d4ed8, #3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 10px rgba(59,130,246,0.3)" }}>
                                      <Briefcase size={15} color="white" />
                                    </div>
                                    <div style={{ fontSize: 17, fontWeight: 600, color: "#1e293b" }}>{game.player.profession}</div>
                                  </div>
                                  <div style={{ fontSize: 12, color: "#64748B", marginLeft: 40 }}>{getTimeSince(game.lastActivityAt)}</div>
                                </div>
                                {game.player.hasEscapedRatRace && (
                                  <span style={{ background: "linear-gradient(135deg, #059669, #10b981)", color: "white", padding: "4px 10px", borderRadius: 8, fontSize: 11, fontWeight: 500, boxShadow: "0 2px 8px rgba(16,185,129,0.3)" }}>
                                    Libre
                                  </span>
                                )}
                              </div>

                              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
                                <div style={{ background: "rgba(5,150,105,0.08)", padding: "10px 12px", borderRadius: 12, border: "1px solid rgba(5,150,105,0.15)" }}>
                                  <div style={{ fontSize: 11, color: "#64748B", fontWeight: 500, marginBottom: 2 }}>Efectivo</div>
                                  <div style={{ fontWeight: 700, color: "#059669", fontSize: 16 }}>${game.player.cashOnHand.toLocaleString()}</div>
                                </div>
                                <div style={{ background: "rgba(11,113,254,0.08)", padding: "10px 12px", borderRadius: 12, border: "1px solid rgba(11,113,254,0.15)" }}>
                                  <div style={{ fontSize: 11, color: "#64748B", fontWeight: 500, marginBottom: 2 }}>Ingreso Pasivo</div>
                                  <div style={{ fontWeight: 700, color: "#0B71FE", fontSize: 16 }}>${game.player.passiveIncome.toLocaleString()}</div>
                                </div>
                              </div>

                              <div style={{ display: "flex", gap: 10 }}>
                                <button
                                  onClick={() => router.push(`/cash-flow/game/${game.id}`)}
                                  style={{ flex: 1, padding: "11px", background: "linear-gradient(135deg, #4f46e5, #6366f1)", color: "white", border: "none", borderRadius: 10, fontWeight: 500, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
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
                        borderRadius: 24,
                        padding: "32px",
                        border: "1px solid #f1f5f9",
                        boxShadow: "0 8px 30px rgba(0,0,0,0.04)"
                      }}>
                        <h2 style={{ fontSize: "clamp(18px, 2vw, 24px)", fontWeight: 700, marginBottom: 28, color: "#1e293b", letterSpacing: "-0.01em" }}>
                          Selecciona tu Profesión
                        </h2>

                        {loadingProfessions ? (
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
                            {Array(4).fill(0).map((_, i) => (
                              <div key={i} style={{ height: 160, borderRadius: 16, backgroundColor: "#f1f5f9", backgroundImage: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)", backgroundSize: "200% 100%", animation: "shimmer-slide 1.5s linear infinite" }} />
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
                                    borderRadius: 20,
                                    cursor: "pointer",
                                    border: isSel ? "1.5px solid rgba(11,113,254,0.3)" : "1px solid #f1f5f9",
                                    background: isSel ? "rgba(11,113,254,0.08)" : "#f8fafc",
                                    boxShadow: isSel ? "0 12px 24px rgba(11,113,254,0.08)" : "none",
                                  }}
                                >
                                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                                    <div style={{ width: 38, height: 38, borderRadius: 12, background: isSel ? "rgba(11,113,254,0.1)" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", border: isSel ? "1px solid rgba(11,113,254,0.2)" : "1px solid #e2e8f0" }}>
                                      <Briefcase size={18} color={isSel ? "#3b82f6" : "#64748b"} />
                                    </div>
                                    <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0, color: isSel ? "#0B71FE" : "#1e293b" }}>{prof.name}</h3>
                                  </div>
                                  {prof.description && (
                                    <div style={{ fontSize: 13, color: "#64748B", marginBottom: 14, lineHeight: 1.6 }}>{prof.description}</div>
                                  )}
                                  <div style={{ background: "#f1f5f9", padding: "12px 14px", borderRadius: 12, fontSize: 13, border: "1px solid #e2e8f0" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                                      <span style={{ color: "#64748B" }}>Salario</span>
                                      <span style={{ fontWeight: 700, color: "#059669" }}>${prof.salary.toLocaleString()}</span>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                      <span style={{ color: "#64748B" }}>Cash Flow</span>
                                      <span style={{ fontWeight: 700, color: cfPositive ? "#059669" : "#dc2626" }}>${cashFlow.toLocaleString()}</span>
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
                                style={{ padding: "14px 28px", background: "white", border: "1.5px solid #e2e8f0", borderRadius: 14, fontWeight: 500, cursor: "pointer", fontSize: 15, color: "#64748b" }}
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
                                backgroundColor: startingGame ? "#94a3b8" : "transparent",
                                backgroundImage: startingGame
                                  ? "none"
                                  : "linear-gradient(135deg, #059669 0%, #0B71FE 60%, #059669 100%)",
                                backgroundSize: "200% 100%",
                                color: "white",
                                border: "none",
                                borderRadius: 14,
                                fontSize: "clamp(15px, 1.5vw, 18px)",
                                fontWeight: 500,
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
