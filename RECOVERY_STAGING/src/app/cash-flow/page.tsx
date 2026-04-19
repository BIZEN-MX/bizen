"use client"

import { useState, useEffect } from "react"
import Link from 'next/link'
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { createClientMicrocred } from '@/lib/supabase/client-microcred'
import { BarChart2, Briefcase, PiggyBank, CreditCard, TrendingUp, Percent, ChevronRight, Trash2, Play, Plus, MonitorSmartphone, Laptop, Sparkles, Brain, Rocket, Target } from "lucide-react"
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
    const fetchSimulatorsList = async () => {
      try {
        const response = await fetch('/api/simulators')
        if (response.ok) {
          const simulators = await response.json()
          // Map Prisma camelCase or DB snake_case to what the UI expects (name vs title)
          const mappedSims = simulators.map((s: any) => ({
            ...s,
            name: s.title || s.name,
            icon: s.iconName || s.icon,
            sort_order: s.sortOrder || s.sort_order
          }))
          setSimulatorsList(mappedSims)
        } else {
          setSimsError(true)
        }
      } catch (err) {
        console.error('Error fetching simulators:', err)
        setSimsError(true)
      } finally {
        setLoadingSims(false)
      }
    }
    fetchSimulatorsList()
  }, [])

  useEffect(() => {
    if (user) {
      // Check for tab query param
      const urlParams = new URLSearchParams(window.location.search)
      const tab = urlParams.get('tab') as any
      if (tab && ["simulators", "cashflow"].includes(tab)) {
        setActiveTab(tab)
      }
      
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
      <div className="min-h-screen bg-slate-50 w-full overflow-x-hidden">
        <main className="relative z-10 w-full max-w-[1400px] mx-auto pt-3 pb-24 px-4 md:py-10 md:px-6 lg:py-6 lg:px-16 box-border">

          {/* Header removed */}

          <div className="flex mb-8 md:mb-12 bg-blue-500/5 border border-blue-500/10 p-5 px-6 rounded-[20px] items-center gap-2 md:gap-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-x-auto scrollbar-hide">
            <button 
              className={`px-[22px] py-[10px] rounded-xl font-medium text-[15px] whitespace-nowrap transition-all duration-300 ${activeTab === "simulators" ? "bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-[0_4px_20px_rgba(11,113,254,0.4)]" : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800"}`} 
              onClick={() => setActiveTab("simulators")}
            >
              Simuladores Financieros
            </button>
            <button 
              className={`px-[22px] py-[10px] rounded-xl font-medium text-[15px] whitespace-nowrap transition-all duration-300 ${activeTab === "cashflow" ? "bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-[0_4_20px_rgba(11,113,254,0.4)]" : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800"}`} 
              onClick={() => setActiveTab("cashflow")}
            >
              Cashflow Game
            </button>
            <Link 
              href="/simulators/stocks"
              className="px-[22px] py-[10px] rounded-xl font-medium text-[15px] whitespace-nowrap transition-all duration-300 bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 no-underline block"
            >
              BIZEN Market
            </Link>
          </div>

          {/* Content */}
          <div className="min-h-[50vh] relative z-10">
            
            {/* ─── SIMULADORES ─── */}
            {activeTab === "simulators" && (
              <div>
                {/* Disclaimer - Dark Glassmorphism */}
                <div className="bg-white px-6 py-4 rounded-[20px] border border-slate-100 shadow-[0_4px_20px_rgba(11,113,254,0.05)] flex items-center gap-4 h-full mb-10 max-w-[960px]">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                    <BarChart2 size={18} className="text-blue-600" />
                  </div>
                  <p className="text-[14px] text-blue-800 leading-relaxed m-0">
                    <span className="text-blue-600 font-medium">Propósito educativo:</span> Estos simuladores son herramientas de aprendizaje. Los resultados son aproximaciones y no constituyen asesoría financiera profesional.
                  </p>
                </div>

                {/* Saved simulations button */}
                <div className="mb-9">
                  <Link href="/cash-flow/history" className="no-underline">
                    <button className="px-6 py-3 bg-white text-slate-800 border border-slate-200 rounded-xl text-[14px] font-medium cursor-pointer flex items-center gap-2 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:-translate-y-0.5">
                      Mis Simulaciones Guardadas
                      <ChevronRight size={16} />
                    </button>
                  </Link>
                </div>

                {simsError ? (
                  <div className="text-center py-12 text-red-500 text-[16px] font-medium">
                    Error al cargar los simuladores.
                  </div>
                ) : loadingSims ? (
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
                    {Array(6).fill(0).map((_, i) => (
                      <div key={i} className="bg-slate-100 rounded-[20px] h-[280px] animate-[pulse_1.5s_linear_infinite]" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {/* ── AI TOOLS SECTION ── */}
                    {/* Section label */}
                    <div className="col-span-full pb-1">
                      <div className="flex items-center gap-2.5">
                        <div className="inline-flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/25 rounded-full px-3.5 py-1.5 text-[11px] font-bold text-purple-500 tracking-wider uppercase">
                          <Sparkles size={11} /> Herramientas con IA
                        </div>
                        <div className="flex-1 h-px bg-purple-500/10" />
                      </div>
                    </div>

                    {/* AI Budget Planner Card */}
                    <Link href="/tools/budget" className="no-underline">
                      <div className="bg-white rounded-[20px] p-6 border border-slate-100 flex flex-col shadow-[0_4px_12px_rgba(0,0,0,0.03)] h-full relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(11,113,254,0.15)] group">
                        <div className="flex items-start justify-between mb-5">
                          <div className="w-13 h-13 rounded-2xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                            <BarChart2 size={24} className="text-indigo-500" />
                          </div>
                          <span className="text-[10px] font-bold px-3 py-1 bg-purple-500/10 text-purple-500 rounded-full uppercase tracking-widest border border-purple-500/20 flex items-center gap-1">
                            <Sparkles size={9} /> IA
                          </span>
                        </div>
                        <h3 className="text-[19px] font-semibold text-slate-800 mb-2.5 leading-snug tracking-tight">
                          Planificador de Presupuesto
                        </h3>
                        <p className="text-[14px] text-slate-500 leading-relaxed flex-1 mb-6">
                          Organiza tus ingresos y gastos en tiempo real. Billy analiza tu presupuesto con IA y te dice exactamente qué mejorar.
                        </p>
                        <button className="w-full py-3.5 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border border-indigo-500/40 rounded-xl text-[14px] font-semibold cursor-pointer flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(99,102,241,0.25)] tracking-wide group-hover:shadow-[0_6px_25px_rgba(99,102,241,0.35)] transition-shadow">
                          Abrir Herramienta <ChevronRight size={16} />
                        </button>
                      </div>
                    </Link>

                    {/* AI Vision Board Card */}
                    <Link href="/tools/vision" className="no-underline">
                      <div className="bg-white rounded-[20px] p-6 border border-slate-100 flex flex-col shadow-[0_4px_12px_rgba(0,0,0,0.03)] h-full relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(11,113,254,0.15)] group">
                        <div className="flex items-start justify-between mb-5">
                          <div className="w-13 h-13 rounded-2xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.2)]">
                            <Brain size={24} className="text-purple-500" />
                          </div>
                          <span className="text-[10px] font-bold px-3 py-1 bg-purple-500/10 text-purple-500 rounded-full uppercase tracking-widest border border-purple-500/20 flex items-center gap-1">
                            <Sparkles size={9} /> IA
                          </span>
                        </div>
                        <h3 className="text-[19px] font-semibold text-slate-800 mb-2.5 leading-snug tracking-tight">
                          Board de Visión Financiera
                        </h3>
                        <p className="text-[14px] text-slate-500 leading-relaxed flex-1 mb-6">
                          Escribe tus metas financieras y la IA las transforma en un plan estructurado con roadmap de 30-60-90 días.
                        </p>
                        <button className="w-full py-3.5 bg-gradient-to-br from-purple-500 to-purple-600 text-white border border-purple-500/40 rounded-xl text-[14px] font-semibold cursor-pointer flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(139,92,246,0.25)] tracking-wide group-hover:shadow-[0_6px_25px_rgba(139,92,246,0.35)] transition-shadow">
                          Abrir Herramienta <ChevronRight size={16} />
                        </button>
                      </div>
                    </Link>

                    {/* Separator before classic simulators */}
                    <div className="col-span-full pb-1 pt-2">
                      <div className="flex items-center gap-2.5">
                        <div className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full px-3.5 py-1.5 text-[11px] font-bold text-blue-600 tracking-wider uppercase">
                          Simuladores Educativos
                        </div>
                        <div className="flex-1 h-px bg-blue-500/10" />
                       </div>
                    </div>

                    {/* Simulador Crédito (Beta) */}
                    <Link href="/simulators/credit" className="no-underline">
                      <div className="bg-gradient-to-br from-[#020b18] to-[#061440] border border-white/10 rounded-[20px] p-6 flex flex-col shadow-[0_4px_12px_rgba(0,0,0,0.03)] h-full relative overflow-hidden transition-all duration-400 hover:-translate-y-2.5 hover:scale-[1.02] hover:shadow-[0_30px_60px_rgba(11,113,254,0.3)] hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-[#040f24] hover:to-[#0b2160] group">
                        <div className="flex items-start justify-between mb-5">
                          <div className="w-13 h-13 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                            <CreditCard size={24} className="text-amber-500" />
                          </div>
                          <span className="text-[10px] font-medium px-3 py-1 bg-white/5 text-white rounded-full uppercase tracking-widest border border-white/10">
                            NUEVO
                          </span>
                        </div>
                        <h3 className="text-[19px] font-semibold text-white mb-2.5 leading-snug tracking-tight">
                          BIZEN Score
                        </h3>
                        <p className="text-[14px] text-white/60 leading-relaxed flex-1 mb-6">
                          Descubre cómo funcionan las tarjetas de crédito, los préstamos y compras a Meses Sin Intereses.
                        </p>
                        <button className="w-full py-3.5 bg-gradient-to-br from-amber-500 to-amber-600 text-white border border-amber-500/40 rounded-xl text-[14px] font-semibold cursor-pointer flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(245,158,11,0.3)] tracking-wide group-hover:shadow-[0_6px_25px_rgba(245,158,11,0.4)] transition-shadow">
                          Abrir Simulador
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </Link>
                    
                    {simulatorsList.filter(s => s.slug !== 'stocks' && s.slug !== 'credit').map((simulator) => {
                      const IconComponent = CATEGORY_ICONS[simulator.category] || BarChart2
                      const accent = CATEGORY_ACCENT[simulator.category] || '#0B71FE'
                      return (
                        <Link key={simulator.id} href={`/cash-flow/${simulator.slug}`} className="no-underline">
                          <div className="bg-gradient-to-br from-[#020b18] to-[#061440] border border-white/10 rounded-[20px] p-6 flex flex-col shadow-[0_4px_12px_rgba(0,0,0,0.03)] h-full relative overflow-hidden transition-all duration-400 hover:-translate-y-2.5 hover:scale-[1.02] hover:shadow-[0_30px_60px_rgba(11,113,254,0.3)] hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-[#040f24] hover:to-[#0b2160] group">
                            {/* Icon + category */}
                            <div className="flex items-start justify-between mb-5">
                              <div className="w-13 h-13 rounded-2xl flex items-center justify-center" style={{ background: `${accent}20`, border: `1px solid ${accent}30`, boxShadow: `0 0 20px ${accent}20` }}>
                                <IconComponent size={24} color={accent} />
                              </div>
                              <span className="text-[10px] font-medium px-3 py-1 rounded-full uppercase tracking-widest text-white bg-white/5 border border-white/10 border-white/10" style={{ background: `${accent}15`, color: accent, border: `1px solid ${accent}25`, color:"white", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)" }}>
                                {CATEGORY_LABELS[simulator.category] || simulator.category}
                              </span>
                            </div>
                            <h3 className="text-[19px] font-semibold text-white mb-2.5 leading-snug tracking-tight">
                              {simulator.name}
                            </h3>
                            <p className="text-[14px] text-white/60 leading-relaxed flex-1 mb-6">
                              {simulator.description}
                            </p>
                            <button className="w-full py-3.5 text-white rounded-xl text-[14px] font-semibold cursor-pointer flex items-center justify-center gap-2 transition-shadow group-hover:brightness-110 tracking-wide" style={{ background: `linear-gradient(135deg, ${accent}ee, ${accent}99)`, border: `1px solid ${accent}40`, boxShadow: `0 4px 20px ${accent}30` }}>
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
                  <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-10 text-center max-w-[480px] mx-auto border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
                    <div className="w-[72px] h-[72px] rounded-full bg-blue-500/15 flex items-center justify-center mx-auto mb-5">
                      <Laptop size={36} className="text-blue-500" />
                    </div>
                    <h2 className="text-[22px] font-medium mb-3.5 text-white">Mejor experiencia en laptop</h2>
                    <p className="text-slate-400 leading-relaxed mb-5 text-[15px]">
                      Para tener una mejor experiencia de juego, te recomendamos abrir CashFlow en tu computadora.
                    </p>
                    <div className="bg-slate-100 p-3.5 rounded-xl border border-slate-200 flex items-center gap-2.5 justify-center">
                      <MonitorSmartphone size={18} className="text-slate-500" />
                      <span className="text-[14px] text-slate-500">En móvil puedes revisar tu progreso y estadísticas</span>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Hero Card */}
                    <div className="relative bg-gradient-to-br from-[#020b18] to-[#061440] rounded-[28px] p-[clamp(32px,5vw,60px)] px-[clamp(24px,4vw,48px)] mb-12 shadow-[0_20px_60px_rgba(0,0,0,0.3)] overflow-hidden border border-white/10">
                      {/* Background decoration */}
                      <div aria-hidden className="absolute -top-[30%] -right-[5%] w-[45%] h-[200%] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(11,113,254,0.2) 0%, transparent 70%)" }} />
                      <div aria-hidden className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />

                      <div className="relative z-10 flex justify-between items-start flex-wrap gap-8">
                        <div>
                          <div className="inline-block bg-amber-500/15 border border-amber-500/30 rounded-full px-3.5 py-1.5 mb-4 text-[11px] font-semibold text-amber-500 tracking-widest uppercase">
                            Juego de Simulación Interactivo
                          </div>
                          <h2 className="text-[clamp(28px,4.5vw,56px)] font-semibold mb-4 text-white tracking-tight leading-none">
                            CASHFLOW GAME
                          </h2>
                          <p className="text-[clamp(16px,1.3vw,20px)] text-white/60 max-w-[620px] leading-relaxed m-0 font-normal">
                            Escapa de la Carrera de Ratas generando ingresos pasivos. Aprende a invertir, administrar activos y construir independencia financiera real de forma divertida.
                          </p>
                        </div>
                        <button
                          onClick={() => router.push("/cash-flow/stats")}
                          className="px-7 py-3.5 bg-white/10 text-white border border-white/15 rounded-2xl font-semibold cursor-pointer text-[15px] flex items-center gap-2.5 transition-all duration-300 whitespace-nowrap self-start backdrop-blur-md hover:bg-white/15 hover:-translate-y-0.5"
                        >
                          <BarChart2 size={18} />
                          Ver Estadísticas
                        </button>
                      </div>
                    </div>

                    {!loadingGames && games.length > 0 && !showNewGame && (
                      <div className="bg-white rounded-3xl p-[clamp(24px,3vw,32px)] border border-slate-100 shadow-[0_8px_30px_rgba(11,113,254,0.04)] mb-8">
                        <div className="flex justify-between items-center mb-7 flex-wrap gap-4">
                          <h2 className="text-[clamp(20px,2vw,26px)] font-bold text-slate-800 m-0 leading-none">Mis Partidas</h2>
                          <button
                            onClick={() => setShowNewGame(true)}
                            className="px-5 py-2.5 bg-gradient-to-br from-blue-600 to-blue-800 text-white border-none rounded-xl text-[14px] font-semibold cursor-pointer transition-all duration-200 flex items-center gap-2 shadow-[0_4px_12px_rgba(11,113,254,0.25)] hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(11,113,254,0.35)]"
                          >
                            <Plus size={16} />
                            Nueva Partida
                          </button>
                        </div>

                        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5">
                          {games.map((game) => game.player && (
                            <div key={game.id} className="bg-white rounded-3xl p-[clamp(16px,3vw,32px)] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col h-full relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] hover:border-blue-500/20 group">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-700 to-blue-500 flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                                      <Briefcase size={15} className="text-white" />
                                    </div>
                                    <div className="text-[17px] font-medium text-slate-800">{game.player.profession}</div>
                                  </div>
                                  <div className="text-[12px] text-slate-500 ml-10">{getTimeSince(game.lastActivityAt)}</div>
                                </div>
                                {game.player.hasEscapedRatRace && (
                                  <span className="bg-gradient-to-br from-emerald-600 to-emerald-500 text-white px-2.5 py-1 rounded-lg text-[11px] font-medium shadow-[0_2px_8px_rgba(16,185,129,0.3)]">
                                    Libre
                                  </span>
                                )}
                              </div>

                              <div className="grid grid-cols-2 gap-3 mb-4.5">
                                <div className="bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/15">
                                  <div className="text-[11px] text-slate-500 font-medium mb-0.5">Efectivo</div>
                                  <div className="font-medium text-emerald-600 text-[16px]">${game.player.cashOnHand.toLocaleString()}</div>
                                </div>
                                <div className="bg-blue-500/10 p-2.5 rounded-xl border border-blue-500/15">
                                  <div className="text-[11px] text-slate-500 font-medium mb-0.5">Ingreso Pasivo</div>
                                  <div className="font-medium text-blue-600 text-[16px]">${game.player.passiveIncome.toLocaleString()}</div>
                                </div>
                              </div>

                              <div className="flex gap-2.5 mt-auto">
                                <button
                                  onClick={() => router.push(`/cash-flow/game/${game.id}`)}
                                  className="flex-1 py-2.5 bg-gradient-to-br from-indigo-600 to-indigo-500 text-white border-none rounded-xl font-medium cursor-pointer text-[14px] flex items-center justify-center gap-1.5 transition-all shadow-[0_4px_12px_rgba(99,102,241,0.25)] hover:-translate-y-0.5"
                                >
                                  <Play size={14} className="fill-white" />
                                  Continuar
                                </button>
                                <button
                                  onClick={() => deleteGame(game.id)}
                                  className="px-3.5 py-2.5 bg-white text-red-500 border border-red-200 rounded-xl cursor-pointer flex items-center justify-center transition-colors hover:bg-red-50 hover:border-red-300"
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
                      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                        <h2 className="text-[clamp(18px,2vw,24px)] font-bold mb-7 text-slate-800 tracking-tight">
                          Selecciona tu Profesión
                        </h2>

                        {loadingProfessions ? (
                          <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-5">
                            {Array(4).fill(0).map((_, i) => (
                              <div key={i} className="h-40 rounded-2xl bg-slate-100 animate-[pulse_1.5s_linear_infinite]" />
                            ))}
                          </div>
                        ) : (
                          <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-5">
                            {professions.map((prof) => {
                              const totalExp = calculateTotalExpenses(prof)
                              const cashFlow = calculateCashFlow(prof)
                              const isSel = selectedProfession === prof.id
                              const cfPositive = cashFlow >= 0
                              return (
                                <div
                                  key={prof.id}
                                  className={`prof-card p-[22px] rounded-[20px] cursor-pointer transition-all duration-300 ${isSel ? "border-[1.5px] border-blue-500/30 bg-blue-500/10 shadow-[0_12px_24px_rgba(11,113,254,0.08)]" : "border border-slate-100 bg-slate-50 hover:-translate-y-1 hover:border-blue-500/60 hover:shadow-[0_12px_40px_rgba(11,113,254,0.2)]"}`}
                                  onClick={() => setSelectedProfession(prof.id)}
                                >
                                  <div className="flex items-center gap-2.5 mb-2.5">
                                    <div className={`w-[38px] h-[38px] rounded-xl flex items-center justify-center border ${isSel ? "bg-blue-500/10 border-blue-500/20" : "bg-slate-100 border-slate-200"}`}>
                                      <Briefcase size={18} className={isSel ? "text-blue-500" : "text-slate-500"} />
                                    </div>
                                    <h3 className={`text-[17px] font-bold m-0 ${isSel ? "text-blue-600" : "text-slate-800"}`}>{prof.name}</h3>
                                  </div>
                                  {prof.description && (
                                    <div className="text-[13px] text-slate-500 mb-3.5 leading-relaxed">{prof.description}</div>
                                  )}
                                  <div className="bg-slate-100 p-3 rounded-xl text-[13px] border border-slate-200">
                                    <div className="flex justify-between mb-1.5">
                                      <span className="text-slate-500">Salario</span>
                                      <span className="font-bold text-emerald-600">${prof.salary.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-500">Cash Flow</span>
                                      <span className={`font-bold ${cfPositive ? "text-emerald-600" : "text-red-600"}`}>${cashFlow.toLocaleString()}</span>
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        )}

                        {selectedProfession && (
                          <div className="mt-9 flex justify-center gap-3.5 flex-wrap">
                            {games.length > 0 && (
                              <button
                                onClick={() => setShowNewGame(false)}
                                className="px-7 py-3.5 bg-white border-[1.5px] border-slate-200 rounded-xl font-medium cursor-pointer text-[15px] text-slate-500 hover:bg-slate-50"
                              >
                                Volver
                              </button>
                            )}
                            <button
                              onClick={startGame}
                              disabled={startingGame}
                              className={`px-10 py-3.5 rounded-xl text-[clamp(15px,1.5vw,18px)] font-medium flex items-center gap-2.5 ${startingGame ? "bg-slate-400 text-white cursor-not-allowed" : "animate-[shimmer-slide_2.5s_linear_infinite] [background-size:200%_100%] bg-[linear-gradient(135deg,#059669_0%,#0B71FE_60%,#059669_100%)] text-white cursor-pointer shadow-[0_8px_24px_rgba(11,113,254,0.35)]"}`}
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
