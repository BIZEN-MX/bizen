"use client"

import { useState, useEffect } from "react"
import Link from 'next/link'
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { BarChart2, Briefcase, PiggyBank, CreditCard, TrendingUp, Percent, ChevronRight, Trash2, Play, Plus, MonitorSmartphone, Laptop, Sparkles, Brain, Rocket, Target, ShoppingBag, Lock, AlertCircle, CheckCircle2, Shield } from "lucide-react"
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

const PROFESSION_EMOJIS: Record<string, string> = {
  "Médico": "🩺",
  "Piloto": "✈️",
  "Conserje": "🧹",
  "Maestro": "📚",
  "Ingeniero": "⚙️",
  "Abogado": "⚖️",
  "Secretaria": "💼",
  "Contador": "📊",
  "Director": "🏢",
  "Gerente": "📋",
}

export default function CombinedSimulatorsPage() {
  const { user, loading: authLoading, dbProfile } = useAuth()
  const userEmail = user?.email?.toLowerCase() || ""
  const isAnahuac = userEmail.endsWith('@anahuac.mx') || userEmail.endsWith('@bizen.mx') || userEmail === 'diegopenita31@gmail.com'
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
  const [inventory, setInventory] = useState<string[]>([])
  const [loadingInventory, setLoadingInventory] = useState(true)
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

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
      fetch("/api/user/stats")
        .then(r => r.ok ? r.json() : null)
        .then(data => { if (data?.weeklyActiveDays) setWeeklyActiveDays(data.weeklyActiveDays) })
        .catch(() => { })

      // Fetch inventory
      fetch("/api/tienda/inventory")
        .then(r => r.ok ? r.json() : null)
        .then(data => { 
          if (data?.inventory) setInventory(data.inventory)
          setLoadingInventory(false)
        })
        .catch(() => setLoadingInventory(false))
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
    if (pendingDeleteId !== gameId) {
      setPendingDeleteId(gameId)
      return
    }
    setDeletingId(gameId)
    setPendingDeleteId(null)
    try {
      const response = await fetch(`/api/cashflow/game/${gameId}/delete`, { method: "DELETE" })
      if (response.ok) fetchGames()
    } catch (error) {
      console.error("Error deleting game:", error)
    } finally {
      setDeletingId(null)
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
        const errorData = await response.json()
        console.error("Error starting game:", errorData)
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

          <div className={`flex mb-8 md:mb-12 p-5 px-6 rounded-[20px] items-center gap-2 md:gap-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-x-auto scrollbar-hide ${isAnahuac ? "bg-primary/5 border border-primary/10" : "bg-blue-500/5 border border-blue-500/10"}`}>
            <button 
              className={`px-[22px] py-[10px] rounded-xl font-medium text-[15px] whitespace-nowrap transition-all duration-300 ${activeTab === "simulators" ? (isAnahuac ? "bg-primary text-white shadow-[0_4px_20px_rgba(255,89,0,0.4)]" : "bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-[0_4px_20px_rgba(11,113,254,0.4)]") : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800"}`} 
              onClick={() => setActiveTab("simulators")}
            >
              Simuladores Financieros
            </button>
            <button 
              className={`px-[22px] py-[10px] rounded-xl font-medium text-[15px] whitespace-nowrap transition-all duration-300 ${activeTab === "cashflow" ? (isAnahuac ? "bg-primary text-white shadow-[0_4px_20px_rgba(255,89,0,0.4)]" : "bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-[0_4_20px_rgba(11,113,254,0.4)]") : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800"}`} 
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
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isAnahuac ? "bg-primary/10" : "bg-blue-500/10"}`}>
                    <BarChart2 size={18} className={isAnahuac ? "text-primary" : "text-blue-600"} />
                  </div>
                  <p className={`text-[14px] leading-relaxed m-0 ${isAnahuac ? "text-primary/90" : "text-blue-800"}`}>
                    <span className={`font-medium ${isAnahuac ? "text-primary" : "text-blue-600"}`}>Propósito educativo:</span> Estos simuladores son herramientas de aprendizaje. Los resultados son aproximaciones y no constituyen asesoría financiera profesional.
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
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-6">
                    {Array(6).fill(0).map((_, i) => (
                      <div key={i} className="bg-slate-100 rounded-[24px] h-[320px] animate-[pulse_1.5s_linear_infinite]" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
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
                    {(() => {
                      const isLocked = !inventory.includes("9")
                      return (
                        <Link href={isLocked ? "/tienda?highlight=9" : "/tools/budget"} className="no-underline">
                          <div className={`bg-white rounded-[24px] border border-slate-100 flex flex-col shadow-[0_4px_12px_rgba(0,0,0,0.03)] h-full relative overflow-hidden transition-all duration-300 group ${
                            isLocked
                            ? "grayscale opacity-80 cursor-not-allowed"
                            : (isAnahuac ? "hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(255,89,0,0.15)]" : "hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(11,113,254,0.15)]")
                          }`}>
                            {/* Hero Image */}
                            <div className="relative h-[210px] overflow-hidden bg-[#020b18] flex-shrink-0">
                              <img
                                src="/assets/billy/billy_budget_planner_1777056157270.png"
                                alt="Budget Planner"
                                className="w-full h-full object-contain object-center transition-transform duration-500 group-hover:scale-105 p-2"
                              />
                              {/* Lock overlay on image */}
                              {isLocked && (
                                <div className="absolute inset-0 bg-slate-900/30 flex items-center justify-center">
                                  <div className="bg-slate-900/70 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 text-white text-[11px] font-semibold">
                                    <Lock size={12} /> BLOQUEADO
                                  </div>
                                </div>
                              )}
                              {/* Gradient fade into card body */}
                              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent" />
                            </div>

                            <div className="p-6 flex flex-col flex-1">
                              {isLocked && (
                                <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 flex items-center gap-2">
                                  <ShoppingBag size={13} className="text-amber-500 flex-shrink-0" />
                                  <span className="text-[12px] font-semibold text-amber-700">Disponible en la Tienda BIZEN</span>
                                </div>
                              )}
                              <div className="flex items-start justify-between mb-4">
                                <div className="w-14 h-14 rounded-2xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                                  <BarChart2 size={26} className={isLocked ? "text-slate-400" : "text-indigo-500"} />
                                </div>
                                <span className="text-[10px] font-bold px-3 py-1 bg-purple-500/10 text-purple-500 rounded-full uppercase tracking-widest border border-purple-500/20 flex items-center gap-1">
                                  <Sparkles size={9} /> IA
                                </span>
                              </div>
                              <h3 className="text-[20px] font-semibold text-slate-800 mb-2 leading-snug tracking-tight">
                                Planificador de Presupuesto
                              </h3>
                              <p className="text-[14px] text-slate-500 leading-relaxed flex-1 mb-5">
                                Organiza tus ingresos y gastos en tiempo real. Billy analiza tu presupuesto con IA y te dice exactamente qué mejorar.
                              </p>
                              <button
                                disabled={isLocked}
                                className={`w-full py-3.5 text-white border rounded-xl text-[14px] font-semibold flex items-center justify-center gap-2 tracking-wide transition-all ${
                                  isLocked
                                  ? "bg-slate-200 border-slate-300 text-slate-500 cursor-not-allowed"
                                  : (isAnahuac ? "bg-primary border-primary/40 shadow-[0_4px_20px_rgba(255,89,0,0.25)] group-hover:shadow-[0_6px_25px_rgba(255,89,0,0.35)] cursor-pointer" : "bg-gradient-to-br from-indigo-500 to-indigo-600 border-indigo-500/40 shadow-[0_4px_20px_rgba(99,102,241,0.25)] group-hover:shadow-[0_6px_25px_rgba(99,102,241,0.35)] cursor-pointer")
                                }`}
                              >
                                {isLocked ? "Comprar en la Tienda" : "Abrir Herramienta"} {isLocked ? <ShoppingBag size={15} /> : <ChevronRight size={15} />}
                              </button>
                            </div>
                          </div>
                        </Link>
                      )
                    })()}

                    {/* AI Vision Board Card */}
                    {(() => {
                      const isLocked = !inventory.includes("10")
                      return (
                        <Link href={isLocked ? "/tienda?highlight=10" : "/tools/vision"} className="no-underline">
                          <div className={`bg-white rounded-[24px] border border-slate-100 flex flex-col shadow-[0_4px_12px_rgba(0,0,0,0.03)] h-full relative overflow-hidden transition-all duration-300 group ${
                            isLocked
                            ? "grayscale opacity-80 cursor-not-allowed"
                            : (isAnahuac ? "hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(255,89,0,0.15)]" : "hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(11,113,254,0.15)]")
                          }`}>
                            {/* Hero Image */}
                            <div className="relative h-[210px] overflow-hidden bg-[#020b18] flex-shrink-0">
                              <img
                                src="/assets/billy/billy_vision_board_1777056175192.png"
                                alt="Vision Board"
                                className="w-full h-full object-contain object-center transition-transform duration-500 group-hover:scale-105 p-2"
                              />
                              {isLocked && (
                                <div className="absolute inset-0 bg-slate-900/30 flex items-center justify-center">
                                  <div className="bg-slate-900/70 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 text-white text-[11px] font-semibold">
                                    <Lock size={12} /> BLOQUEADO
                                  </div>
                                </div>
                              )}
                              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent" />
                            </div>

                            <div className="p-6 flex flex-col flex-1">
                              {isLocked && (
                                <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 flex items-center gap-2">
                                  <ShoppingBag size={13} className="text-amber-500 flex-shrink-0" />
                                  <span className="text-[12px] font-semibold text-amber-700">Disponible en la Tienda BIZEN</span>
                                </div>
                              )}
                              <div className="flex items-start justify-between mb-4">
                                <div className="w-14 h-14 rounded-2xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.2)]">
                                  <Brain size={26} className={isLocked ? "text-slate-400" : "text-purple-500"} />
                                </div>
                                <span className="text-[10px] font-bold px-3 py-1 bg-purple-500/10 text-purple-500 rounded-full uppercase tracking-widest border border-purple-500/20 flex items-center gap-1">
                                  <Sparkles size={9} /> IA
                                </span>
                              </div>
                              <h3 className="text-[20px] font-semibold text-slate-800 mb-2 leading-snug tracking-tight">
                                Board de Visión Financiera
                              </h3>
                              <p className="text-[14px] text-slate-500 leading-relaxed flex-1 mb-5">
                                Escribe tus metas financieras y la IA las transforma en un plan estructurado con roadmap de 30-60-90 días.
                              </p>
                              <button
                                disabled={isLocked}
                                className={`w-full py-3.5 text-white border rounded-xl text-[14px] font-semibold flex items-center justify-center gap-2 tracking-wide transition-all ${
                                  isLocked
                                  ? "bg-slate-200 border-slate-300 text-slate-500 cursor-not-allowed"
                                  : (isAnahuac ? "bg-primary border-primary/40 shadow-[0_4px_20px_rgba(255,89,0,0.25)] group-hover:shadow-[0_6px_25px_rgba(255,89,0,0.35)] cursor-pointer" : "bg-gradient-to-br from-purple-500 to-purple-600 border-purple-500/40 shadow-[0_4px_20px_rgba(139,92,246,0.25)] group-hover:shadow-[0_6px_25px_rgba(139,92,246,0.35)] cursor-pointer")
                                }`}
                              >
                                {isLocked ? "Comprar en la Tienda" : "Abrir Herramienta"} {isLocked ? <ShoppingBag size={15} /> : <ChevronRight size={15} />}
                              </button>
                            </div>
                          </div>
                        </Link>
                      )
                    })()}

                    {/* Separator before classic simulators */}
                    <div className="col-span-full pb-1 pt-2">
                      <div className="flex items-center gap-2.5">
                        <div className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-bold tracking-wider uppercase ${isAnahuac ? "bg-primary/10 border border-primary/20 text-primary" : "bg-blue-500/10 border border-blue-500/20 text-blue-600"}`}>
                          Simuladores Educativos
                        </div>
                        <div className={`flex-1 h-px ${isAnahuac ? "bg-primary/10" : "bg-blue-500/10"}`} />
                       </div>
                    </div>

                    {/* Simulador Crédito (Beta) */}
                    <Link href="/simulators/credit" className="no-underline">
                      <div className={`bg-gradient-to-br from-[#020b18] to-[#061440] border border-white/10 rounded-[24px] flex flex-col shadow-[0_4px_12px_rgba(0,0,0,0.03)] h-full relative overflow-hidden transition-all duration-400 hover:-translate-y-2.5 hover:scale-[1.02] group ${isAnahuac ? "hover:shadow-[0_30px_60px_rgba(255,89,0,0.2)] hover:border-primary/50 hover:from-[#331100] hover:to-[#0f0500]" : "hover:shadow-[0_30px_60px_rgba(11,113,254,0.3)] hover:border-blue-500/50 hover:from-[#040f24] hover:to-[#0b2160]"}`}>
                        {/* Hero Image */}
                        <div className="relative h-[210px] overflow-hidden bg-[#020b18] flex-shrink-0">
                          <img
                            src="/assets/billy/billy_credit_score.png"
                            alt="BIZEN Score"
                            className="w-full h-full object-contain object-center transition-transform duration-500 group-hover:scale-105 p-2"
                          />
                          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#020b18] to-transparent" />
                        </div>

                        <div className="p-6 flex flex-col flex-1">
                          <div className="flex items-start justify-between mb-5">
                            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                              <CreditCard size={26} className="text-amber-500" />
                            </div>
                            <span className="text-[10px] font-medium px-3 py-1 bg-white/5 text-white rounded-full uppercase tracking-widest border border-white/10">
                              NUEVO
                            </span>
                          </div>
                        <h3 className="text-[22px] font-semibold text-white mb-3 leading-snug tracking-tight">
                          BIZEN Score
                        </h3>
                        <p className="text-[15px] text-white/60 leading-relaxed flex-1 mb-7">
                          Descubre cómo funcionan las tarjetas de crédito, los préstamos y compras a Meses Sin Intereses.
                        </p>
                        <button className={`w-full py-4 text-white border rounded-xl text-[15px] font-semibold cursor-pointer flex items-center justify-center gap-2 tracking-wide transition-shadow ${isAnahuac ? "bg-primary border-primary/40 shadow-[0_4px_20px_rgba(255,89,0,0.3)] group-hover:shadow-[0_6px_25px_rgba(255,89,0,0.4)]" : "bg-gradient-to-br from-amber-500 to-amber-600 border-amber-500/40 shadow-[0_4px_20px_rgba(245,158,11,0.3)] group-hover:shadow-[0_6px_25px_rgba(245,158,11,0.4)]"}`}>
                          Abrir Simulador
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  </Link>

                    {/* Simulador CETES / Renta Fija */}
                    <Link href="/simulators/cetes" className="no-underline">
                      <div className={`bg-gradient-to-br from-[#020b18] to-[#03160e] border border-white/10 rounded-[24px] flex flex-col shadow-[0_4px_12px_rgba(0,0,0,0.03)] h-full relative overflow-hidden transition-all duration-400 hover:-translate-y-2.5 hover:scale-[1.02] group hover:shadow-[0_30px_60px_rgba(16,185,129,0.25)] hover:border-emerald-500/40`}>
                        {/* Hero area */}
                        <div className="relative h-[210px] overflow-hidden bg-gradient-to-br from-[#020b18] to-[#031a10] flex items-center justify-center flex-shrink-0">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.3)] group-hover:shadow-[0_0_60px_rgba(16,185,129,0.5)] transition-all">
                              <span className="text-4xl">🏛️</span>
                            </div>
                            <div className="flex gap-2">
                              {['10.50%', '10.25%', '10.00%'].map(r => (
                                <span key={r} className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">{r}</span>
                              ))}
                            </div>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#020b18] to-transparent" />
                        </div>

                        <div className="p-6 flex flex-col flex-1">
                          <div className="flex items-start justify-between mb-5">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                              <Shield size={26} className="text-emerald-400" />
                            </div>
                            <span className="text-[10px] font-medium px-3 py-1 bg-white/5 text-white rounded-full uppercase tracking-widest border border-white/10">
                              NUEVO
                            </span>
                          </div>
                          <h3 className="text-[22px] font-semibold text-white mb-3 leading-snug tracking-tight">
                            Renta Fija / CETES
                          </h3>
                          <p className="text-[15px] text-white/60 leading-relaxed flex-1 mb-7">
                            Invierte en CETES, BONDES y UDIBONOS. Aprende a proteger tu dinero contra la inflación con la inversión más segura de México.
                          </p>
                          <button className="w-full py-4 text-white border rounded-xl text-[15px] font-semibold cursor-pointer flex items-center justify-center gap-2 tracking-wide transition-shadow bg-gradient-to-br from-emerald-500 to-cyan-600 border-emerald-500/40 shadow-[0_4px_20px_rgba(16,185,129,0.3)] group-hover:shadow-[0_6px_25px_rgba(16,185,129,0.4)]">
                            Abrir Simulador
                            <ChevronRight size={16} />
                          </button>
                        </div>
                      </div>
                    </Link>

                    {simulatorsList.filter(s => s.slug !== 'stocks' && s.slug !== 'credit').map((simulator) => {
                      const IconComponent = CATEGORY_ICONS[simulator.category] || BarChart2
                      const accent = CATEGORY_ACCENT[simulator.category] || '#0B71FE'
                      
                      // Check if locked — map slug to product ID in the store
                      const lockConfig: Record<string, string> = {
                        'inflation-calculator': "12"
                      }
                      const productId = lockConfig[simulator.slug]
                      const isLocked = productId && !inventory.includes(productId) && !inventory.includes("9")

                      return (
                        <Link key={simulator.id} href={isLocked ? `/tienda?highlight=${productId}` : `/cash-flow/${simulator.slug}`} className="no-underline">
                          <div className={`bg-gradient-to-br from-[#020b18] to-[#061440] border border-white/10 rounded-[24px] flex flex-col shadow-[0_4px_12px_rgba(0,0,0,0.03)] h-full relative overflow-hidden transition-all duration-300 group ${isLocked ? "opacity-75 cursor-not-allowed" : (isAnahuac ? "hover:-translate-y-1 hover:shadow-[0_30px_60px_rgba(255,89,0,0.2)] hover:border-primary/50" : "hover:-translate-y-1 hover:shadow-[0_30px_60px_rgba(11,113,254,0.3)] hover:border-blue-500/50")}`}>
                            {/* Hero Image */}
                            {(() => {
                              const imgMap: Record<string, string> = {
                                'savings-goal': '/assets/billy/billy_savings_goals_1777056195152.png',
                                'inflation-calculator': '/assets/billy/billy_inflation_calculator_1777056215773.png',
                                'investment-comparison': '/assets/billy/billy_investment.png',
                                'credit-card-payoff': '/assets/billy/billy_debt_payoff.png',
                                'simple-loan': '/assets/billy/billy_simple_loan.png'
                              }
                              const imgSrc = imgMap[simulator.slug]
                              if (!imgSrc) return (
                                <div className="h-[180px] bg-slate-800/50 flex-shrink-0 flex items-center justify-center">
                                  <IconComponent size={48} color={`${accent}80`} />
                                </div>
                              )
                              return (
                                <div className="relative h-[210px] overflow-hidden bg-[#020b18] flex-shrink-0">
                                  <img
                                    src={imgSrc}
                                    alt={simulator.name}
                                    className="w-full h-full object-contain object-center transition-transform duration-500 group-hover:scale-105 p-4"
                                  />
                                  {isLocked && (
                                    <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                                      <div className="bg-slate-900/80 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 text-white text-[11px] font-semibold border border-white/10">
                                        <Lock size={12} /> BLOQUEADO
                                      </div>
                                    </div>
                                  )}
                                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#020b18] to-transparent" />
                                </div>
                              )
                            })()}

                            <div className="p-6 flex flex-col flex-1">
                              {isLocked && (
                                <div className="mb-4 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2 flex items-center gap-2">
                                  <ShoppingBag size={13} className="text-amber-400 flex-shrink-0" />
                                  <span className="text-[12px] font-semibold text-amber-400">Disponible en la Tienda BIZEN</span>
                                </div>
                              )}
                              {/* Icon + category */}
                              <div className="flex items-start justify-between mb-5">
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: isLocked ? 'rgba(255,255,255,0.05)' : `${accent}20`, border: `1px solid ${isLocked ? 'rgba(255,255,255,0.08)' : `${accent}30`}`, boxShadow: isLocked ? 'none' : `0 0 20px ${accent}20` }}>
                                  <IconComponent size={26} color={isLocked ? '#64748b' : accent} />
                                </div>
                                <span className="text-[10px] font-medium px-3 py-1 rounded-full uppercase tracking-widest" style={{ background: isLocked ? 'rgba(255,255,255,0.05)' : `${accent}15`, color: isLocked ? '#64748b' : accent, border: `1px solid ${isLocked ? 'rgba(255,255,255,0.08)' : `${accent}25`}` }}>
                                  {isLocked ? "BLOQUEADO" : (CATEGORY_LABELS[simulator.category] || simulator.category)}
                                </span>
                              </div>
                              <h3 className="text-[20px] font-semibold text-white mb-2 leading-snug tracking-tight">
                                {simulator.name}
                              </h3>
                              <p className="text-[14px] text-white/60 leading-relaxed flex-1 mb-5">
                                {simulator.description}
                              </p>
                              <button
                                disabled={!!isLocked}
                                className={`w-full py-3.5 text-white rounded-xl text-[14px] font-semibold flex items-center justify-center gap-2 transition-all tracking-wide ${isLocked ? "bg-slate-800/80 border border-slate-700/50 cursor-not-allowed opacity-60" : "group-hover:brightness-110 cursor-pointer"}`}
                                style={!isLocked ? (isAnahuac ? { background: '#FF5900', border: '1px solid rgba(255,89,0,0.4)', boxShadow: '0 4px 20px rgba(255,89,0,0.3)' } : { background: `linear-gradient(135deg, ${accent}ee, ${accent}99)`, border: `1px solid ${accent}40`, boxShadow: `0 4px 20px ${accent}30` }) : {}}
                              >
                                {isLocked ? "Comprar en la Tienda" : "Abrir Simulador"}
                                {isLocked ? <ShoppingBag size={15} /> : <ChevronRight size={15} />}
                              </button>
                            </div>
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
                    <div className={`w-[72px] h-[72px] rounded-full flex items-center justify-center mx-auto mb-5 ${isAnahuac ? "bg-primary/20" : "bg-blue-500/15"}`}>
                      <Laptop size={36} className={isAnahuac ? "text-primary" : "text-blue-500"} />
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
                            className={`px-5 py-2.5 text-white border-none rounded-xl text-[14px] font-semibold cursor-pointer transition-all duration-200 flex items-center gap-2 hover:-translate-y-0.5 ${isAnahuac ? "bg-primary shadow-[0_4px_12px_rgba(255,89,0,0.25)] hover:shadow-[0_6px_16px_rgba(255,89,0,0.35)]" : "bg-gradient-to-br from-blue-600 to-blue-800 shadow-[0_4px_12px_rgba(11,113,254,0.25)] hover:shadow-[0_6px_16px_rgba(11,113,254,0.35)]"}`}
                          >
                            <Plus size={16} />
                            Nueva Partida
                          </button>
                        </div>

                        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5">
                          {games.map((game) => game.player && (
                            <div key={game.id} className={`bg-white rounded-3xl p-[clamp(16px,3vw,28px)] border shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col h-full relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] group ${isAnahuac ? "hover:border-primary/30 border-slate-100" : "hover:border-blue-500/20 border-slate-100"}`}>
                              {/* Escape badge */}
                              {game.player.hasEscapedRatRace && (
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-blue-500" />
                              )}

                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-2xl">{PROFESSION_EMOJIS[game.player.profession] || "💼"}</span>
                                    <div className="text-[17px] font-semibold text-slate-800">{game.player.profession}</div>
                                  </div>
                                  <div className="text-[12px] text-slate-400 ml-9">{getTimeSince(game.lastActivityAt)} · Turno {game.player.currentTurn}</div>
                                </div>
                                {game.player.hasEscapedRatRace && (
                                  <span className="bg-gradient-to-br from-emerald-600 to-emerald-500 text-white px-2.5 py-1 rounded-lg text-[11px] font-medium shadow-[0_2px_8px_rgba(16,185,129,0.3)]">
                                    🏆 Libre
                                  </span>
                                )}
                              </div>

                              {/* Progress bar */}
                              <div className="mb-4">
                                <div className="flex justify-between text-[11px] text-slate-400 mb-1.5">
                                  <span>Progreso a la Libertad</span>
                                  <span>{Math.min(100, Math.round((game.player.passiveIncome / (game.player.cashOnHand * 0.05 + 1000)) * 100))}%</span>
                                </div>
                                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full transition-all duration-700"
                                    style={{ width: `${Math.min(100, (game.player.passiveIncome / (game.player.cashOnHand * 0.05 + 1000)) * 100)}%` }}
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                                  <div className="text-[11px] text-slate-500 font-medium mb-0.5">Efectivo</div>
                                  <div className="font-semibold text-emerald-600 text-[16px]">${game.player.cashOnHand.toLocaleString()}</div>
                                </div>
                                <div className={isAnahuac ? "bg-orange-50 p-3 rounded-xl border border-orange-100" : "bg-blue-50 p-3 rounded-xl border border-blue-100"}>
                                  <div className="text-[11px] text-slate-500 font-medium mb-0.5">Ingreso Pasivo</div>
                                  <div className={`font-semibold text-[16px] ${isAnahuac ? "text-primary/90" : "text-blue-600"}`}>${game.player.passiveIncome.toLocaleString()}</div>
                                </div>
                              </div>

                              <div className="flex gap-2 mt-auto">
                                <button
                                  onClick={() => router.push(`/cash-flow/game/${game.id}`)}
                                  className={`flex-1 py-2.5 text-white border-none rounded-xl font-medium cursor-pointer text-[14px] flex items-center justify-center gap-1.5 transition-all hover:-translate-y-0.5 ${isAnahuac ? "bg-primary shadow-[0_4px_12px_rgba(255,89,0,0.25)]" : "bg-gradient-to-br from-indigo-600 to-indigo-500 shadow-[0_4px_12px_rgba(99,102,241,0.25)]"}`}
                                >
                                  <Play size={14} className="fill-white" />
                                  Continuar
                                </button>
                                <button
                                  onClick={() => deleteGame(game.id)}
                                  disabled={deletingId === game.id}
                                  className={`px-3.5 py-2.5 rounded-xl cursor-pointer flex items-center justify-center gap-1.5 transition-all text-[12px] font-medium border ${
                                    pendingDeleteId === game.id
                                      ? "bg-red-500 text-white border-red-500 hover:bg-red-600"
                                      : "bg-white text-red-400 border-red-200 hover:bg-red-50 hover:border-red-300"
                                  }`}
                                >
                                  {pendingDeleteId === game.id ? (
                                    <><AlertCircle size={13} /> Confirmar</>
                                  ) : (
                                    <Trash2 size={16} />
                                  )}
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
                              const emoji = PROFESSION_EMOJIS[prof.name] || "💼"
                              // Difficulty: based on starting cash flow ratio
                              const difficulty = cashFlow > 3000 ? "Fácil" : cashFlow > 1000 ? "Media" : "Difícil"
                              const diffColor = cashFlow > 3000 ? "text-emerald-500" : cashFlow > 1000 ? "text-amber-500" : "text-red-500"
                              const diffBg = cashFlow > 3000 ? "bg-emerald-500/10" : cashFlow > 1000 ? "bg-amber-500/10" : "bg-red-500/10"
                              return (
                                <div
                                  key={prof.id}
                                  onClick={() => setSelectedProfession(prof.id)}
                                  className={`relative p-6 rounded-[20px] cursor-pointer transition-all duration-300 border-2 ${
                                    isSel
                                      ? (isAnahuac
                                        ? "border-primary bg-primary/8 shadow-[0_12px_32px_rgba(255,89,0,0.15)]"
                                        : "border-blue-500 bg-blue-500/8 shadow-[0_12px_32px_rgba(59,130,246,0.15)]")
                                      : "border-transparent bg-slate-50 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] hover:border-slate-200"
                                  }`}
                                >
                                  {/* Selected check */}
                                  {isSel && (
                                    <div className={`absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center ${isAnahuac ? "bg-primary" : "bg-blue-500"}`}>
                                      <CheckCircle2 size={14} className="text-white" />
                                    </div>
                                  )}

                                  {/* Emoji + Name */}
                                  <div className="flex items-center gap-3 mb-3">
                                    <span className="text-3xl">{emoji}</span>
                                    <div>
                                      <h3 className={`text-[17px] font-bold m-0 leading-tight ${
                                        isSel ? (isAnahuac ? "text-primary" : "text-blue-600") : "text-slate-800"
                                      }`}>{prof.name}</h3>
                                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${diffBg} ${diffColor}`}>
                                        {difficulty}
                                      </span>
                                    </div>
                                  </div>

                                  {prof.description && (
                                    <p className="text-[13px] text-slate-500 mb-3 leading-relaxed">{prof.description}</p>
                                  )}

                                  {/* Stats */}
                                  <div className="bg-white rounded-xl p-3 border border-slate-200 space-y-2">
                                    <div className="flex justify-between text-[13px]">
                                      <span className="text-slate-400">Salario mensual</span>
                                      <span className="font-semibold text-emerald-600">${prof.salary.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-[13px]">
                                      <span className="text-slate-400">Gastos totales</span>
                                      <span className="font-semibold text-red-500">-${totalExp.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-[13px] pt-1.5 border-t border-slate-100">
                                      <span className="text-slate-600 font-medium">Cash Flow inicial</span>
                                      <span className={`font-bold ${cfPositive ? "text-emerald-600" : "text-red-600"}`}>
                                        {cfPositive ? "+" : ""}{cashFlow.toLocaleString()}
                                      </span>
                                    </div>
                                    <div className="flex justify-between text-[13px]">
                                      <span className="text-slate-400">Efectivo inicial</span>
                                      <span className="font-semibold text-blue-500">${prof.startingCash.toLocaleString()}</span>
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
                              className={`px-10 py-3.5 rounded-xl text-[clamp(15px,1.5vw,18px)] font-medium flex items-center gap-2.5 transition-all ${startingGame ? "bg-slate-400 text-white cursor-not-allowed" : (isAnahuac ? "bg-primary hover:bg-orange-600 text-white cursor-pointer shadow-[0_8px_24px_rgba(255,89,0,0.35)] hover:-translate-y-1" : "animate-[shimmer-slide_2.5s_linear_infinite] [background-size:200%_100%] bg-[linear-gradient(135deg,#059669_0%,#0B71FE_60%,#059669_100%)] text-white cursor-pointer shadow-[0_8px_24px_rgba(11,113,254,0.35)]")}`}
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
