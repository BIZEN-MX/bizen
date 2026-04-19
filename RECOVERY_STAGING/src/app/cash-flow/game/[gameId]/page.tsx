"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter, useParams } from "next/navigation"
import GameBoard from "@/components/cashflow/GameBoard"
import { useCashflowSounds } from "@/hooks/useCashflowSounds"
import { AvatarDisplay } from "@/components/AvatarDisplay"
import { motion, AnimatePresence } from "framer-motion"
import { 
  TrophyIcon, TargetIcon, MoneyIcon, BarChartIcon, BriefcaseIcon, ClockIcon, ZapIcon, CreditCardIcon, ShoppingCartIcon, CompassIcon, HeartIcon 
} from "@/components/CustomIcons"
import { 
  X, Home, TrendingUp, Briefcase, Users, BadgeDollarSign, Check, AlertTriangle, 
  Gamepad2, Film, Shirt, Plane, Utensils, Gem, CheckCircle2, Coins, ArrowLeft, 
  Lightbulb, Info, History, ShieldCheck, Target, Sparkles, Map, BookOpen, Star
} from "lucide-react"

type Player = {
  id: number
  cashOnHand: number
  savings: number
  numChildren: number
  currentTurn: number
  currentPosition: number
  passiveIncome: number
  totalIncome: number | null
  totalExpenses: number | null
  cashFlow: number | null
  hasEscapedRatRace: boolean
  isOnFastTrack: boolean
  profession: {
    name: string
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
  }
}

type Investment = {
  id: number
  purchasePrice: number
  downPaymentPaid: number | null
  currentCashFlow: number | null
  purchasedAt: string
  totalIncomeEarned: number
  opportunityCard: {
    id: number
    name: string
    type: string
    minSalePrice: number | null
    maxSalePrice: number | null
  }
}

type Liability = {
  id: number
  type: string
  description: string | null
  principalAmount: number
  remainingBalance: number
  monthlyPayment: number
  interestRate: number | null
}

type PlayerDoodad = {
  id: number
  name: string
  description: string | null
  cost: number
  purchasedAt: string
}

type GameState = {
  id: number
  status: string
  currentPhase: string | null
  totalTurns: number
  player: Player & {
    investments: Investment[]
    liabilities: Liability[]
    doodads: PlayerDoodad[]
  }
}

type OpportunityCard = {
  id: number
  type: string
  name: string
  description: string | null
  downPayment: number | null
  cost: number
  mortgage: number | null
  cashFlow: number | null
  shares: number | null
  minSalePrice: number | null
  maxSalePrice: number | null
  bedrooms: number | null
}

type Doodad = {
  id: number
  name: string
  description: string
  cost: number
  category: string | null
  rarity: string
}

export default function CashFlowGamePage() {
  const { user, dbProfile, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const gameId = params.gameId as string

  const [gameState, setGameState] = useState<GameState | null>(null)
  const [loadingGame, setLoadingGame] = useState(true)
  const [currentCard, setCurrentCard] = useState<OpportunityCard | null>(null)
  const [showCard, setShowCard] = useState(false)
  const [showMarketEvent, setShowMarketEvent] = useState(false)
  const [marketEventData, setMarketEventData] = useState<any>(null)
  const [showSellModal, setShowSellModal] = useState(false)
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null)
  const [salePrice, setSalePrice] = useState(0)
  const [showLoanModal, setShowLoanModal] = useState(false)
  const [loanAmount, setLoanAmount] = useState(5000)
  const [showWinScreen, setShowWinScreen] = useState(false)
  const [showPayOffModal, setShowPayOffModal] = useState(false)
  const [selectedLoan, setSelectedLoan] = useState<Liability | null>(null)
  const [showDoodadModal, setShowDoodadModal] = useState(false)
  const [currentDoodad, setCurrentDoodad] = useState<Doodad | null>(null)
  const [showTutorial, setShowTutorial] = useState(false)
  const [tutorialStep, setTutorialStep] = useState(0)
  const [actionInProgress, setActionInProgress] = useState(false)
  const [isRollingDice, setIsRollingDice] = useState(false)
  const [diceResult, setDiceResult] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const { playDiceRoll, playCardReveal, playReward, playDecision, playNegative, playSuccessChime } = useCashflowSounds()


  useEffect(() => {
    // Hide sidebar on mount for full-screen immersion
    document.body.classList.add('hide-sidebar')
    return () => {
      document.body.classList.remove('hide-sidebar')
    }
  }, [])

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
      window.open("/login", "_blank")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (gameId) {
      fetchGameState()
    }
  }, [gameId])

  // Show tutorial on first turn
  useEffect(() => {
    if (gameState?.player.currentTurn === 1 && !showTutorial) {
      // Check if user has seen tutorial before (using localStorage)
      const hasSeenTutorial = localStorage.getItem('cashflow_tutorial_seen')
      if (!hasSeenTutorial) {
        setShowTutorial(true)
      }
    }
  }, [gameState?.player.currentTurn, showTutorial])

  // Check if player just escaped rat race (first win)
  useEffect(() => {
    if (gameState?.player.hasEscapedRatRace && !showWinScreen) {
      // Check if this is the first time escaping (not ultimate win)
      const isFirstWin = gameState.player.passiveIncome < 50000
      if (isFirstWin || gameState.player.currentTurn === 1) {
        // Small delay for dramatic effect
        setTimeout(() => {
          setShowWinScreen(true)
        }, 500)
      }
    }
  }, [gameState?.player.hasEscapedRatRace, showWinScreen])

  // Check if player achieved ultimate win ($50K passive income)
  useEffect(() => {
    if (gameState && gameState.player.passiveIncome >= 50000 && gameState.player.isOnFastTrack) {
      // Check if we haven't shown ultimate win yet
      const hasSeenUltimateWin = sessionStorage.getItem(`ultimate_win_${gameId}`)
      if (!hasSeenUltimateWin) {
        setTimeout(() => {
          setShowWinScreen(true)
          sessionStorage.setItem(`ultimate_win_${gameId}`, 'true')
        }, 500)
      }
    }
  }, [gameState?.player.passiveIncome, gameState?.player.isOnFastTrack, gameId])

  const fetchGameState = async () => {
    try {
      const response = await fetch(`/api/cashflow/game/${gameId}`)
      if (response.ok) {
        const data = await response.json()
        setGameState(data)
      } else {
        router.push("/cash-flow")
      }
    } catch (error) {
      console.error("Error fetching game state:", error)
    } finally {
      setLoadingGame(false)
    }
  }

  const drawCard = async () => {
    setActionInProgress(true)
    console.log("🎴 Drawing card...")
    try {
      const response = await fetch(`/api/cashflow/game/${gameId}/draw-card`, {
        method: "POST"
      })
      console.log("📡 Draw card response status:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("✅ Card drawn:", data)

        if (data.isDoodad) {
          // Doodad drawn (luxury temptation)
          console.log("🎰 Doodad drawn:", data.doodad?.name)
          setCurrentDoodad(data.doodad)
          setShowDoodadModal(true)
          playCardReveal()
        } else if (data.isMarketEvent) {
          // Market event occurred
          console.log("📉 Market event:", data.marketEvent?.name)
          setMarketEventData(data)
          setShowMarketEvent(true)
          playCardReveal()
          console.log("🔄 Refreshing game state after market event...")
          await fetchGameState() // Refresh to show updated state
        } else {
          // Regular opportunity card
          console.log("🃏 Opportunity card:", data.card?.name)
          setCurrentCard(data.card)
          setShowCard(true)
          playCardReveal()
        }
      } else {
        const errorData = await response.json()
        console.error("❌ Failed to draw card:", errorData)
        playNegative()
        alert(`❌ Error al sacar carta:\n\n${errorData.error || 'Error desconocido'}\n\n${errorData.details ? `Detalles: ${errorData.details}` : 'Revisa la consola del navegador para más información.'}`)
      }
    } catch (error) {
      console.error("❌ Error drawing card:", error)
      playNegative()
      alert(`❌ Error de red al sacar carta.\n\n${error instanceof Error ? error.message : 'Error desconocido'}\n\nRevisa tu conexión y la consola del navegador.`)
    } finally {
      setActionInProgress(false)
    }
  }

  const purchaseInvestment = async () => {
    if (!currentCard) return

    setActionInProgress(true)
    try {
      const response = await fetch(`/api/cashflow/game/${gameId}/purchase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ opportunityCardId: currentCard.id })
      })

      if (response.ok) {
        await fetchGameState()
        setShowCard(false)
        setCurrentCard(null)
        playSuccessChime()
      }
    } catch (error) {
      console.error("Error purchasing investment:", error)
      playNegative()
    } finally {
      setActionInProgress(false)
    }
  }

  const passCard = () => {
    setShowCard(false)
    setCurrentCard(null)
    playDecision()
  }

  const closeMarketEvent = () => {
    setShowMarketEvent(false)
    setMarketEventData(null)
    playDecision()
  }

  const openSellModal = (investment: Investment) => {
    setSelectedInvestment(investment)
    // Set default sale price to minimum
    setSalePrice(investment.opportunityCard.minSalePrice || investment.purchasePrice)
    setShowSellModal(true)
  }

  const closeSellModal = () => {
    setShowSellModal(false)
    setSelectedInvestment(null)
    setSalePrice(0)
    playDecision()
  }

  const sellInvestment = async () => {
    if (!selectedInvestment) return

    setActionInProgress(true)
    try {
      const response = await fetch(`/api/cashflow/game/${gameId}/sell`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          investmentId: selectedInvestment.id,
          salePrice
        })
      })

      if (response.ok) {
        await fetchGameState()
        closeSellModal()
        playSuccessChime()
      }
    } catch (error) {
      console.error("Error selling investment:", error)
      playNegative()
    } finally {
      setActionInProgress(false)
    }
  }

  const takeLoan = async () => {
    setActionInProgress(true)
    console.log("💰 Taking loan:", loanAmount)
    try {
      const response = await fetch(`/api/cashflow/game/${gameId}/take-loan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: loanAmount })
      })
      console.log("📡 Take loan response status:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("✅ Loan taken successfully:", data)
        alert(`✅ ¡Préstamo aprobado!\n\n💰 Recibiste: $${data.amount?.toLocaleString() || loanAmount.toLocaleString()}\n💳 Pago mensual: $${data.monthlyPayment?.toLocaleString()}/mes\n💵 Nuevo efectivo: $${data.newCash?.toLocaleString()}`)
        console.log("🔄 Refreshing game state...")
        await fetchGameState()
        setShowLoanModal(false)
        playReward()
      } else {
        const errorData = await response.json()
        console.error("❌ Failed to take loan:", errorData)
        playNegative()
        alert(`❌ Error al solicitar préstamo:\n\n${errorData.error || 'Error desconocido'}\n\n${errorData.details ? `Detalles: ${errorData.details}` : 'Revisa la consola del navegador para más información.'}`)
      }
    } catch (error) {
      console.error("❌ Error taking loan:", error)
      playNegative()
      alert(`❌ Error de red al solicitar el préstamo.\n\n${error instanceof Error ? error.message : 'Error desconocido'}\n\nRevisa tu conexión y la consola del navegador.`)
    } finally {
      setActionInProgress(false)
    }
  }

  const openPayOffModal = (loan: Liability) => {
    setSelectedLoan(loan)
    setShowPayOffModal(true)
  }

  const closePayOffModal = () => {
    setShowPayOffModal(false)
    setSelectedLoan(null)
    playDecision()
  }

  const payOffLoan = async () => {
    if (!selectedLoan) return

    setActionInProgress(true)
    try {
      const response = await fetch(`/api/cashflow/game/${gameId}/pay-loan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ liabilityId: selectedLoan.id })
      })

      if (response.ok) {
        await fetchGameState()
        closePayOffModal()
        playSuccessChime()
      } else {
        const data = await response.json()
        playNegative()
        alert(data.error || "No puedes pagar este préstamo")
      }
    } catch (error) {
      console.error("Error paying off loan:", error)
      playNegative()
    } finally {
      setActionInProgress(false)
    }
  }

  const buyDoodad = async () => {
    if (!currentDoodad) return

    setActionInProgress(true)
    try {
      const response = await fetch(`/api/cashflow/game/${gameId}/buy-doodad`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doodadId: currentDoodad.id })
      })

      if (response.ok) {
        await fetchGameState()
        setShowDoodadModal(false)
        setCurrentDoodad(null)
        playNegative()
      } else {
        const data = await response.json()
        playNegative()
        alert(data.error || "No puedes comprar este artículo")
      }
    } catch (error) {
      console.error("Error buying doodad:", error)
      playNegative()
    } finally {
      setActionInProgress(false)
    }
  }

  const passDoodad = () => {
    setShowDoodadModal(false)
    setCurrentDoodad(null)
    playDecision()
  }

  const nextTutorialStep = () => {
    if (tutorialStep < 4) {
      setTutorialStep(tutorialStep + 1)
    } else {
      closeTutorial()
    }
  }

  const prevTutorialStep = () => {
    if (tutorialStep > 0) {
      setTutorialStep(tutorialStep - 1)
    }
  }

  const closeTutorial = () => {
    setShowTutorial(false)
    setTutorialStep(0)
    localStorage.setItem('cashflow_tutorial_seen', 'true')
  }

  const openHelp = () => {
    setTutorialStep(0)
    setShowTutorial(true)
  }

  const rollDice = async () => {
    setDiceResult(null)
    setIsRollingDice(true)
    setActionInProgress(true)
    playDiceRoll()

    // Simulate dice roll animation
    const roll = Math.floor(Math.random() * 6) + 1
    setDiceResult(roll)

    // Wait for animation
    await new Promise(resolve => setTimeout(resolve, 1000))

    try {
      const response = await fetch(`/api/cashflow/game/${gameId}/roll-dice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ diceRoll: roll })
      })

      if (response.ok) {
        const data = await response.json()
        const finalRoll = typeof data.diceRoll === "number" ? data.diceRoll : roll
        setDiceResult(finalRoll)
        console.log("🎲 Dice rolled:", data)

        // Move player and handle landing
        await fetchGameState()
        if (data.cashChange > 0 || data.landedSpace === "payday") {
          playReward()
        }

        // Check what space they landed on and trigger action
        if (data.landedSpace) {
          handleSpaceLanding(data.landedSpace)
        }
      }
    } catch (error) {
      console.error("Error rolling dice:", error)
    } finally {
      setIsRollingDice(false)
      setActionInProgress(false)
    }
  }

  const handleSpaceLanding = (spaceType: string) => {
    switch (spaceType) {
      case 'opportunity':
        // Auto-draw card when landing on opportunity
        setTimeout(() => drawCard(), 500)
        break
      case 'payday':
        // Payday happens automatically on backend
        alert('💵 ¡Día de pago! Recibiste tu salario e ingresos pasivos.')
        break
      case 'market':
        // Market event happens automatically
        setTimeout(() => drawCard(), 500)
        break
      case 'doodad':
        // Doodad temptation
        setTimeout(() => drawCard(), 500)
        break
      case 'charity':
        // Optional donation
        if (confirm('❤️ ¿Deseas donar 10% de tu salario a caridad? (beneficios fiscales)')) {
          // Handle charity donation
        }
        break
      case 'baby':
        alert('👶 ¡Felicidades! Tuviste un bebé. Tus gastos mensuales aumentan.')
        break
    }
  }

  const endTurn = async () => {
    setActionInProgress(true)
    try {
      const response = await fetch(`/api/cashflow/game/${gameId}/end-turn`, {
        method: "POST"
      })
      if (response.ok) {
        await fetchGameState()
      }
    } catch (error) {
      console.error("Error ending turn:", error)
    } finally {
      setActionInProgress(false)
    }
  }

  if (loading || loadingGame || !gameState) {
    return (
      <div className="w-full min-h-screen overflow-x-hidden flex items-center justify-center bg-[#FBFAF5] box-border">
        <div className="text-slate-800 text-2xl font-medium">
          Cargando juego...
        </div>
      </div>
    )
  }

  const player = gameState.player

  const loanPayments = player.liabilities?.reduce((sum, liability) => sum + liability.monthlyPayment, 0) || 0

  const totalExpenses =
    player.profession.taxes +
    player.profession.homeMortgagePayment +
    player.profession.schoolLoanPayment +
    player.profession.carLoanPayment +
    player.profession.creditCardPayment +
    player.profession.retailPayment +
    player.profession.otherExpenses +
    (player.profession.childExpense * player.numChildren) +
    loanPayments

  const totalIncome = player.profession.salary + player.passiveIncome
  const cashFlow = totalIncome - totalExpenses

  const renderCardModal = () => (
    <div className="fixed inset-0 bg-slate-900/70 flex items-center justify-center z-[2000] p-[clamp(16px,4vw,40px)]">
      <div className="w-full max-w-[520px] bg-white rounded-2xl p-5 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.3)] max-h-[90vh] overflow-y-auto">
        <h2 className="text-[28px] font-medium m-0 mb-4 text-slate-800 flex items-center">
          {currentCard?.type === "real_estate" && <Home size={28} color="#0F62FE" className="mr-3" />}
          {currentCard?.type === "stock" && <TrendingUp size={28} color="#10b981" className="mr-3" />}
          {currentCard?.type === "business" && <Briefcase size={28} color="#8b5cf6" className="mr-3" />}
          {currentCard?.type === "limited_partnership" && <Users size={28} color="#f59e0b" className="mr-3" />}
          {currentCard?.name}
        </h2>
        <p className="text-[14px] text-slate-600 mb-5 leading-relaxed">{currentCard?.description}</p>
        {currentCard && (
          <div className="bg-slate-50 rounded-xl p-4 mb-5">
            <div className="flex justify-between mb-3 text-[14px]">
              <span className="font-medium">Precio:</span>
              <span className="font-medium">
                ${currentCard.cost.toLocaleString()}
              </span>
            </div>
            {currentCard.downPayment && (
              <div className="flex justify-between mb-3 text-[14px]">
                <span className="font-medium">Enganche:</span>
                <span className="font-medium text-red-500">
                  ${currentCard.downPayment.toLocaleString()}
                </span>
              </div>
            )}
            {currentCard.cashFlow && (
              <div className="flex justify-between mb-3 text-[14px]">
                <span className="font-medium">Flujo mensual:</span>
                <span className={`font-medium ${currentCard.cashFlow > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  ${currentCard.cashFlow.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        )}
        <div className="flex gap-3">
          <button
            onClick={purchaseInvestment}
            disabled={actionInProgress}
            className={`flex-1 p-3.5 rounded-xl text-[16px] font-medium flex items-center justify-center ${actionInProgress ? 'bg-slate-300 text-white cursor-not-allowed' : 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white cursor-pointer hover:opacity-90'}`}
          >
            <BadgeDollarSign size={18} className="mr-2" /> Comprar
          </button>
          <button
            onClick={passCard}
            disabled={actionInProgress}
            className={`flex-1 p-3.5 bg-white border-2 border-red-500 rounded-xl text-[16px] font-medium flex items-center justify-center ${actionInProgress ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-red-50 text-red-500'}`}
          >
            <X size={18} className="mr-2" /> Pasar
          </button>
        </div>
      </div>
    </div>
  )

  const renderDoodadModal = () => (
    <div className="fixed inset-0 bg-slate-900/70 flex items-center justify-center z-[2000] p-[clamp(16px,4vw,40px)]">
      <div className="w-full max-w-[520px] bg-white rounded-2xl p-5 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.3)] max-h-[90vh] overflow-y-auto">
        <h2 className="text-[28px] font-medium m-0 mb-4 text-slate-800 flex items-center">
          {currentDoodad?.category === "toys" && <Gamepad2 size={28} color="#ec4899" className="mr-3" />}
          {currentDoodad?.category === "entertainment" && <Film size={28} color="#ef4444" className="mr-3" />}
          {currentDoodad?.category === "fashion" && <Shirt size={28} color="#3b82f6" className="mr-3" />}
          {currentDoodad?.category === "travel" && <Plane size={28} color="#0ea5e9" className="mr-3" />}
          {currentDoodad?.category === "food" && <Utensils size={28} color="#f59e0b" className="mr-3" />}
          {!currentDoodad?.category && <Gem size={28} color="#a78bfa" className="mr-3" />}
          {currentDoodad?.name}
        </h2>
        <p className="text-[14px] text-slate-600 mb-5 leading-relaxed">{currentDoodad?.description}</p>
        <div className="bg-red-50 rounded-xl p-4 mb-5 border border-red-500">
          <div className="text-[13px] text-red-800 mb-2 flex items-start">
            <AlertTriangle size={16} className="mr-2 mt-0.5 flex-shrink-0" /> 
            <span><strong>ADVERTENCIA:</strong> Este es un gasto de lujo que NO genera ningún ingreso.</span>
          </div>
          <div className="text-[12px] text-red-600 italic">
            "Los pobres y la clase media compran lujos primero. Los ricos compran activos primero." - Robert Kiyosaki
          </div>
        </div>
        <div className="bg-slate-50 rounded-xl p-4 mb-5 text-center">
          <div className="text-[14px] text-slate-600 mb-1">
            Costo
          </div>
          <div className="text-[36px] font-medium text-red-500">
            ${currentDoodad?.cost.toLocaleString()}
          </div>
          <div className="text-[12px] text-slate-400 mt-1">
            Tu efectivo: ${player.cashOnHand.toLocaleString()}
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={passDoodad}
            className="flex-1 p-3.5 rounded-xl text-[16px] font-medium flex items-center justify-center bg-gradient-to-br from-emerald-500 to-emerald-600 text-white cursor-pointer hover:opacity-90"
          >
            <Check size={18} className="mr-2" /> Pasar (Decisión Inteligente)
          </button>
          <button
            onClick={buyDoodad}
            disabled={actionInProgress || !currentDoodad || player.cashOnHand < currentDoodad.cost}
            className={`flex-1 p-3.5 rounded-xl text-[16px] font-medium flex items-center justify-center border-none text-white ${(actionInProgress || !currentDoodad || player.cashOnHand < currentDoodad.cost) ? 'bg-slate-300 cursor-not-allowed' : 'bg-gradient-to-br from-red-500 to-red-600 cursor-pointer hover:opacity-90'}`}
          >
            <BadgeDollarSign size={18} className="mr-2" /> Comprar (Mala Idea)
          </button>
        </div>
      </div>
    </div>
  )
  return (
    <>

      <div className="cashflow-game-page w-full min-h-screen bg-[#FBFAF5] overflow-x-hidden">
        <main className="cashflow-game-main w-full max-w-full flex justify-center items-start box-border overflow-x-hidden overflow-y-visible" style={{
          padding: isMobile ? "clamp(12px, 3vw, 16px)" : "clamp(16px, 3vw, 24px)",
          paddingBottom: isMobile ? "calc(140px + env(safe-area-inset-bottom, 0px))" : "clamp(40px, 4vw, 80px)"
        }}>
          <div className="cashflow-game-container w-full max-w-full box-border overflow-visible flex flex-col">
            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-[24px] mb-6 shadow-[0_20px_50px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)] flex relative overflow-hidden gap-5 p-[clamp(20px,4vw,32px)] ${player.isOnFastTrack ? 'bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600' : 'bg-gradient-to-br from-slate-900 via-blue-900 to-blue-800'} ${isMobile ? 'flex-col items-start' : 'flex-row items-center'}`}
            >
              {/* EXIT BUTTON */}
              <button 
                onClick={() => router.back()}
                className="absolute top-4 right-4 w-11 h-11 rounded-[14px] bg-white/10 border border-white/20 text-white flex items-center justify-center cursor-pointer z-10 transition-colors hover:bg-blue-600/30"
              >
                <X size={20} />
              </button>
              {/* Decorative elements */}
              <div className={`absolute -top-[20%] -right-[5%] w-[40%] h-[140%] pointer-events-none ${player.isOnFastTrack ? 'bg-[radial-gradient(circle,rgba(255,255,255,0.2)_0%,transparent_70%)]' : 'bg-[radial-gradient(circle,rgba(11,113,254,0.15)_0%,transparent_70%)]'}`} />

              <div className="flex items-center gap-5 z-[1] relative">
                <div className="w-16 h-16 rounded-[18px] bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden backdrop-blur-md">
                  <AvatarDisplay
                    size={56}
                    avatar={dbProfile?.avatar}
                    frame={dbProfile?.inventory?.includes("2") ? "vip" : dbProfile?.inventory?.includes("1") ? "ambassador" : null}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2.5 mb-1">
                    <h1 className="m-0 text-white tracking-tight font-medium" style={{ fontSize: "clamp(22px, 3vw, 36px)" }}>
                      {player.isOnFastTrack ? "TRABAJO DE SUEÑO" : player.profession.name}
                    </h1>
                    <span className={`px-3 py-1 rounded-full text-[12px] font-medium uppercase ${player.isOnFastTrack ? 'bg-amber-400 text-amber-900' : 'bg-blue-600/30 text-blue-200'}`}>
                      {player.isOnFastTrack ? "Fast Track" : "Rat Race"}
                    </span>
                  </div>
                  <div className="text-white/70 text-[14px] font-medium">
                    Turno {player.currentTurn} • Progreso a la Libertad Financiera
                  </div>
                </div>
              </div>

              {/* Progress Toward Freedom */}
              {!player.isOnFastTrack && (
                <div className="z-[1]" style={{ minWidth: isMobile ? "100%" : 300 }}>
                  <div className="flex justify-between mb-2 text-[13px] font-medium text-white">
                    <span>Independencia Financiera</span>
                    <span>{Math.min(100, Math.round((player.passiveIncome / totalExpenses) * 100))}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (player.passiveIncome / totalExpenses) * 100)}%` }}
                      className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full"
                    />
                  </div>
                  <div style={{ textAlign: "right", marginTop: 4, fontSize: 11, color: "rgba(255,255,255,0.5)" }}>
                    Meta: Ingreso Pasivo {">"} Gastos
                  </div>
                </div>
              )}
            </motion.div>

            {/* Financial Dashboard Container */}
            <div className={`grid gap-6 mb-8 w-full ${isMobile ? "grid-cols-1" : "grid-cols-[minmax(300px,1fr)_minmax(300px,1fr)] max-md:grid-cols-1"}`}>
              {/* Financial Statement Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white/70 backdrop-blur-xl rounded-[28px] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-white/40 flex flex-col gap-6 w-full"
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(37,99,235,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <BarChartIcon size={24} color="#2563eb" />
                  </div>
                  <h2 style={{ fontSize: 20, fontWeight: 500, color: "#1e293b", margin: 0 }}>Estado Financiero</h2>
                  <div style={{
                    marginLeft: "auto",
                    padding: "6px 14px",
                    borderRadius: "99px",
                    background: player.passiveIncome >= totalExpenses ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.1)",
                    color: player.passiveIncome >= totalExpenses ? "#059669" : "#d97706",
                    fontSize: "11px",
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: "0.03em",
                    border: player.passiveIncome >= totalExpenses ? "1px solid rgba(16, 185, 129, 0.2)" : "1px solid rgba(245, 158, 11, 0.2)"
                  }}>
                    {player.passiveIncome >= totalExpenses ? "✨ Libertad Alcanzada" : "🐀 Carrera de Ratas"}
                  </div>
                </div>

                {/* Income Section */}
                <div className="bg-gradient-to-br from-emerald-500/5 to-emerald-600/10 rounded-[20px] p-5 border border-emerald-500/10">
                  <div className="flex justify-between mb-4">
                    <span className="text-[13px] font-medium text-emerald-600 uppercase tracking-widest">Ingresos Totales</span>
                    <span className="text-[18px] font-medium text-emerald-600">${totalIncome.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-[14px]">
                      <span className="text-slate-500">Salario</span>
                      <span className="font-medium">${player.profession.salary.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-[14px]">
                      <span className="text-slate-500">Ingreso Pasivo</span>
                      <span className="font-medium text-emerald-500">+${player.passiveIncome.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Expenses Section */}
                <div className="bg-gradient-to-br from-red-500/5 to-red-600/10 rounded-[20px] p-5 border border-red-500/10">
                  <div className="flex justify-between mb-4">
                    <span className="text-[13px] font-medium text-red-600 uppercase tracking-widest">Gastos Totales</span>
                    <span className="text-[18px] font-medium text-red-600">${totalExpenses.toLocaleString()}</span>
                  </div>
                  <div className="max-h-[120px] overflow-y-auto flex flex-col gap-2 pr-1">
                    {[
                      { label: "Impuestos", val: player.profession.taxes },
                      { label: "Hipoteca", val: player.profession.homeMortgagePayment },
                      { label: "Educación", val: player.profession.schoolLoanPayment },
                      { label: "Auto", val: player.profession.carLoanPayment },
                      { label: "Crédito", val: player.profession.creditCardPayment },
                      { label: "Otros", val: player.profession.otherExpenses },
                      { label: `Hijos (${player.numChildren})`, val: player.profession.childExpense * player.numChildren, show: player.numChildren > 0 },
                      { label: "Bancos", val: loanPayments, show: loanPayments > 0 }
                    ].filter(x => x.show !== false).map((e, i) => (
                      <div key={i} className="flex justify-between text-[13px]">
                        <span className="text-slate-500">{e.label}</span>
                        <span className="font-medium">${e.val.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Monthly Cash Flow Card */}
                <div className={`rounded-[20px] p-6 text-white shadow-[0_15px_30px_rgba(0,0,0,0.15)] ${cashFlow > 0 ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' : 'bg-gradient-to-br from-red-500 to-red-600'}`}>
                  <div className="text-[12px] font-medium opacity-80 uppercase tracking-widest mb-2">Flujo Mensual</div>
                  <div className="text-[28px] font-medium">${cashFlow.toLocaleString()}</div>
                </div>
              </motion.div>

              {/* Assets & Investments Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white/70 backdrop-blur-[20px] rounded-[28px] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-white/40 flex flex-col gap-6"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <MoneyIcon size={24} color="#10b981" />
                  </div>
                  <h2 className="text-[20px] font-medium text-slate-800 m-0">Mis Activos</h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl p-4 border border-slate-100 text-center">
                    <div className="text-[11px] font-medium text-slate-500 uppercase mb-1">Efectivo</div>
                    <div className="text-[20px] font-medium text-emerald-500">${player.cashOnHand.toLocaleString()}</div>
                  </div>
                  <div className="bg-white rounded-2xl p-4 border border-slate-100 text-center">
                    <div className="text-[11px] font-medium text-slate-500 uppercase mb-1">Ahorros</div>
                    <div className="text-[20px] font-medium text-blue-500">${player.savings.toLocaleString()}</div>
                  </div>
                </div>

                {/* Investments List */}
                <div className="flex-1 flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[14px] font-medium text-slate-700">Portafolio ({player.investments?.length || 0})</span>
                    <span className="text-[12px] text-slate-400">Haga clic para vender</span>
                  </div>

                  <div className="max-h-[250px] overflow-y-auto flex flex-col gap-2.5 pr-1">
                    {!player.investments?.length ? (
                      <div className="text-center py-8 px-4 bg-[#FBFAF5] rounded-2xl border-[1.5px] border-dashed border-slate-200">
                        <p className="text-[13px] text-slate-400 m-0">Aún no tienes inversiones. ¡Saca una carta de oportunidad!</p>
                      </div>
                    ) : (
                      player.investments.map((inv) => (
                        <motion.div
                          key={inv.id}
                          whileHover={{ x: 5, borderColor: "#3b82f6" }}
                          onClick={() => openSellModal(inv)}
                          style={{
                            background: "white", borderRadius: 16, padding: 14, border: "1.5px solid #f1f5f9", cursor: "pointer", display: "flex", alignItems: "center", gap: 12
                          }}
                        >
                          <div style={{ width: 40, height: 40, borderRadius: 10, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                            {inv.opportunityCard.type === "real_estate" && "🏠"}
                            {inv.opportunityCard.type === "stock" && "📈"}
                            {inv.opportunityCard.type === "business" && "💼"}
                            {inv.opportunityCard.type === "limited_partnership" && "🤝"}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 14, fontWeight: 500, color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{inv.opportunityCard.name}</div>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#64748b", marginTop: 2 }}>
                              <span>Flujo: <b style={{ color: "#10b981" }}>+${(inv.currentCashFlow || 0).toLocaleString()}</b></span>
                              <span>ROI: <b>{((((inv.opportunityCard.minSalePrice || 0) - inv.purchasePrice) / inv.purchasePrice) * 100).toFixed(1)}%</b></span>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Liabilities Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white/70 backdrop-blur-[20px] rounded-[28px] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-white/40 flex flex-col gap-6"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-red-500/10 flex items-center justify-center">
                    <CreditCardIcon size={24} color="#ef4444" />
                  </div>
                  <h2 className="text-[20px] font-medium text-slate-800 m-0">Mis Deudas</h2>
                </div>

                <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto pr-1">
                  {/* Fixed Profession Liabilities */}
                  {[
                    { label: "Hipoteca", value: player.profession.homeMortgage },
                    { label: "Préstamo Escolar", value: player.profession.schoolLoans },
                    { label: "Préstamo Auto", value: player.profession.carLoans },
                    { label: "Tarjetas", value: player.profession.creditCards },
                    { label: "Deuda Tiendas", value: player.profession.retailDebt }
                  ].filter(l => l.value > 0).map((l, idx) => (
                    <div key={idx} className="bg-white rounded-2xl py-3.5 px-4 border-[1.5px] border-slate-100 flex justify-between items-center">
                      <div>
                        <div className="text-[13px] text-slate-500 font-medium">{l.label}</div>
                        <div className="text-[16px] font-medium text-slate-800">${l.value.toLocaleString()}</div>
                      </div>
                      <div className="py-1.5 px-2.5 rounded-lg bg-red-50 text-red-500 text-[11px] font-medium">PASIVO</div>
                    </div>
                  ))}

                  {/* Dynamic Liabilities */}
                  {player.liabilities?.map((l) => (
                    <motion.div
                      key={l.id}
                      whileHover={{ x: 5, borderColor: "#ef4444" }}
                      onClick={() => {
                        setSelectedLoan(l)
                        setShowPayOffModal(true)
                      }}
                      className="bg-white rounded-2xl py-3.5 px-4 border-[1.5px] border-slate-100 cursor-pointer flex justify-between items-center"
                    >
                      <div>
                        <div className="text-[13px] text-slate-500 font-medium">{l.description || l.type === "bank_loan" ? "Préstamo Bancario" : l.type}</div>
                        <div className="text-[16px] font-medium text-slate-800">${l.remainingBalance.toLocaleString()}</div>
                      </div>
                      <button className="py-1.5 px-3 rounded-lg bg-red-500 text-white border-none text-[11px] font-medium cursor-pointer">PAGAR</button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Purchased Doodads */}
            {player.doodads && player.doodads.length > 0 && (
              <div className="bg-red-50 rounded-xl p-4 mt-4">
                <div className="text-[14px] font-medium text-red-600 mb-3">
                  💸 GASTOS DE LUJO ({player.doodads.length})
                </div>
                <div className="text-[12px] text-slate-500 mb-3">
                  Dinero gastado sin retorno de inversión:
                </div>
                <div className="flex flex-col gap-1.5">
                  {player.doodads.map((doodad) => (
                    <div
                      key={doodad.id}
                      className="bg-white rounded-md p-2 text-[11px] flex justify-between items-center"
                    >
                      <span className="text-slate-500">{doodad.name}</span>
                      <span className="font-medium text-red-500">
                        -${doodad.cost.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-red-200 text-[14px] font-medium text-red-600 flex justify-between">
                  <span>Total desperdiciado:</span>
                  <span>
                    -${player.doodads.reduce((sum, d) => sum + d.cost, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            {/* Game Board Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-full overflow-visible mb-8"
            >
              <div className="game-board-container w-full max-w-full p-[clamp(8px,2vw,24px)] bg-slate-900/40 backdrop-blur-sm rounded-[32px] border border-white/5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] flex justify-center items-center">
                <GameBoard
                  playerPosition={player.currentPosition ?? (player.currentTurn % 24)}
                  isRolling={isRollingDice}
                  onRollDice={rollDice}
                  canRoll={!actionInProgress && !showCard && !showMarketEvent && !showDoodadModal}
                  isOnFastTrack={player.isOnFastTrack}
                  diceResult={diceResult}
                />
              </div>
            </motion.div>

            {/* Quick Actions Bar */}
            <div className="bg-white/70 backdrop-blur-[20px] rounded-[24px] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-white/40 text-center">
              <div className="flex gap-4 justify-center flex-wrap">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(245, 158, 11, 0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowLoanModal(true)}
                  disabled={actionInProgress}
                  className={`py-3.5 px-8 bg-white text-amber-500 border-[2.5px] border-amber-400 rounded-[20px] text-[15px] font-medium shadow-[0_4px_12px_rgba(245,158,11,0.1)] flex items-center gap-2.5 ${actionInProgress ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
                >
                  <MoneyIcon size={20} color="#f59e0b" />
                  Solicitar Préstamo
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(16, 185, 129, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={endTurn}
                  disabled={actionInProgress}
                  className={`py-3.5 px-8 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-none rounded-[20px] text-[15px] font-medium shadow-[0_8px_20px_rgba(16,185,129,0.3)] flex items-center gap-2.5 ${actionInProgress ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
                >
                  <ZapIcon size={20} color="white" />
                  Terminar Turno
                </motion.button>
              </div>
              <p className="text-[13px] text-slate-500 mt-4 font-medium m-0">
                💡 Consejo: Tira el dado para avanzar y busca oportunidades de ingreso pasivo.
              </p>
            </div>
          </div>
        </main>

        {/* Tutorial Modal */}
        {showTutorial && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[3000] p-5">
            <div className="bg-white rounded-[24px] p-10 w-full max-w-[650px] shadow-[0_25px_80px_rgba(0,0,0,0.4)] relative">
              {/* Step Indicator */}
              <div className="flex gap-2 justify-center mb-6">
                {[0, 1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`h-2 rounded-full transition-all duration-300 ${tutorialStep === step ? 'w-8 bg-gradient-to-br from-indigo-500 to-purple-600' : 'w-2 bg-slate-200'}`}
                  />
                ))}
              </div>

              {/* Step 0: Welcome */}
              {tutorialStep === 0 && (
                <div>
                  <div className="text-[64px] text-center mb-4">
                    👋
                  </div>
                  <h2 className="text-[32px] font-medium m-0 mb-4 text-center bg-gradient-to-br from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                    ¡Bienvenido a CASHFLOW!
                  </h2>
                  <p className="text-[16px] text-slate-500 leading-[1.8] text-center mb-6">
                    Basado en el juego de Robert Kiyosaki, autor de "Padre Rico, Padre Pobre".
                    <br /><br />
                    <strong className="text-slate-800">Tu objetivo:</strong> Escapar de la "Carrera de Ratas"
                    construyendo suficiente <strong className="text-emerald-500">ingreso pasivo</strong> para
                    cubrir tus gastos y alcanzar la libertad financiera.
                  </p>
                </div>
              )}

              {/* Step 1: Financial Statement */}
              {tutorialStep === 1 && (
                <div>
                  <div className="text-[64px] text-center mb-4">
                    📊
                  </div>
                  <h2 className="text-[28px] font-medium m-0 mb-4 text-center text-slate-800">
                    Tu Estado Financiero
                  </h2>
                  <div className="text-[15px] text-slate-500 leading-[1.8] mb-5">
                    <div className="mb-4">
                      <strong className="text-emerald-500">💵 INGRESOS:</strong>
                      <ul className="mt-2 ml-5">
                        <li><strong>Salario:</strong> Tu trabajo mensual</li>
                        <li><strong className="text-emerald-500">Ingreso Pasivo:</strong> Dinero que ganas sin trabajar (¡clave para ganar!)</li>
                      </ul>
                    </div>

                    <div className="mb-4">
                      <strong className="text-red-500">💸 GASTOS:</strong>
                      <ul className="mt-2 ml-5">
                        <li>Impuestos, hipoteca, préstamos, tarjetas</li>
                        <li>Pagos mensuales obligatorios</li>
                      </ul>
                    </div>

                    <div>
                      <strong className="text-blue-600">📊 CASH FLOW:</strong>
                      <ul className="mt-2 ml-5">
                        <li>Ingresos - Gastos = Cash Flow mensual</li>
                        <li>Positivo = Buen camino 💚</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: How to Play */}
              {tutorialStep === 2 && (
                <div>
                  <div className="text-[64px] text-center mb-4">
                    🎲
                  </div>
                  <h2 className="text-[28px] font-medium m-0 mb-4 text-center text-slate-800">
                    Cómo Jugar
                  </h2>
                  <div className="text-[15px] text-slate-500 leading-[1.8]">
                    <div className="bg-slate-50 rounded-xl p-4 mb-3">
                      <strong>1. 🃏 Sacar Carta:</strong> Recibirás inversiones, eventos o tentaciones de lujo
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4 mb-3">
                      <strong>2. 💰 Tomar Decisiones:</strong> Comprar inversiones que generen ingreso pasivo o pasar
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4 mb-3">
                      <strong>3. ⏭️ Terminar Turno:</strong> Recibe tu salario + ingresos pasivos, paga gastos
                    </div>

                    <div className="bg-emerald-50 rounded-xl p-4 border-2 border-emerald-500">
                      <strong className="text-emerald-600">🎯 GANAR:</strong> Cuando tu ingreso pasivo
                      supere tus gastos totales, ¡habrás escapado!
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Investment Strategy */}
              {tutorialStep === 3 && (
                <div>
                  <div className="text-[64px] text-center mb-4">
                    🏠💼📈
                  </div>
                  <h2 className="text-[28px] font-medium m-0 mb-4 text-center text-slate-800">
                    Tipos de Inversiones
                  </h2>
                  <div className="text-[15px] text-slate-500 leading-[1.8]">
                    <div className="bg-emerald-50 rounded-xl p-4 mb-3 border border-emerald-500">
                      <strong className="text-emerald-600">🏠 Bienes Raíces:</strong>
                      <div className="text-[14px] mt-1">
                        Casas, apartamentos, edificios. Paga enganche, recibe renta mensual. ¡Puedes vender más caro!
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-xl p-4 mb-3 border border-blue-500">
                      <strong className="text-blue-800">📈 Acciones:</strong>
                      <div className="text-[14px] mt-1">
                        Compra barato, vende caro. Algunas pagan dividendos. Volátiles pero lucrativas.
                      </div>
                    </div>

                    <div className="bg-amber-50 rounded-xl p-4 mb-3 border border-amber-500">
                      <strong className="text-amber-700">💼 Negocios:</strong>
                      <div className="text-[14px] mt-1">
                        Franquicias, lavanderías, negocios. Alto cash flow estable.
                      </div>
                    </div>

                    <div className="bg-purple-50 rounded-xl p-4 border border-purple-400">
                      <strong className="text-purple-700">🤝 Sociedades Limitadas:</strong>
                      <div className="text-[14px] mt-1">
                        Inversiones grupales. Alto riesgo, alta recompensa.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Advanced Tips */}
              {tutorialStep === 4 && (
                <div>
                  <div className="text-[64px] text-center mb-4">
                    💡
                  </div>
                  <h2 className="text-[28px] font-medium m-0 mb-4 text-center text-slate-800">
                    Consejos Estratégicos
                  </h2>
                  <div className="text-[15px] text-slate-500 leading-[1.8]">
                    <div className="bg-emerald-50 rounded-xl p-4 mb-3 border border-emerald-500">
                      <strong className="text-emerald-600">✅ HACER:</strong>
                      <ul className="mt-2 ml-5 text-[14px]">
                        <li>Comprar activos que generen ingreso pasivo</li>
                        <li>Usar préstamos para comprar inversiones más grandes</li>
                        <li>Vender inversiones cuando suban de precio</li>
                        <li>Pagar préstamos para reducir gastos</li>
                      </ul>
                    </div>

                    <div className="bg-red-50 rounded-xl p-4 border border-red-500">
                      <strong className="text-red-600">❌ EVITAR:</strong>
                      <ul className="mt-2 ml-5 text-[14px]">
                        <li>Comprar "Doodads" (lujos que drenan dinero)</li>
                        <li>Tomar préstamos sin plan de inversión</li>
                        <li>Pasar buenas oportunidades por miedo</li>
                        <li>Quedarte sin efectivo para emergencias</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3 mt-8">
                {tutorialStep > 0 && (
                  <button
                    onClick={prevTutorialStep}
                    className="py-3.5 px-6 bg-white text-indigo-500 border-2 border-indigo-500 rounded-xl text-[16px] font-medium cursor-pointer transition-all duration-200 hover:bg-indigo-50"
                  >
                    ← Anterior
                  </button>
                )}

                <button
                  onClick={nextTutorialStep}
                  className="flex-1 py-3.5 px-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none rounded-xl text-[16px] font-medium cursor-pointer shadow-[0_6px_20px_rgba(102,126,234,0.3)] transition-transform duration-200 hover:scale-[1.02]"
                >
                  {tutorialStep === 4 ? "🚀 ¡Empezar a Jugar!" : "Siguiente →"}
                </button>

                <button
                  onClick={closeTutorial}
                  className="py-3.5 px-6 bg-transparent text-slate-400 border-none text-[14px] font-medium cursor-pointer hover:text-slate-600"
                >
                  Saltar
                </button>
              </div>
            </div>
          </div>
        )
        }

        {/* Card Modal */}
        {showCard && currentCard && renderCardModal()}

        {/* Doodad Modal */}
        {showDoodadModal && currentDoodad && renderDoodadModal()}
        {/* Market Event Modal */}
        {
          showMarketEvent && marketEventData && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[2000] p-5">
              <div className="bg-white rounded-[20px] p-8 w-full max-w-[500px] shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
                <h2 className="text-[28px] font-medium m-0 mb-4 text-slate-800">
                  {marketEventData.marketEvent.type === "baby" && "👶"}
                  {marketEventData.marketEvent.type === "downsized" && "📉"}
                  {marketEventData.marketEvent.type === "charity" && "❤️"}
                  {marketEventData.marketEvent.type === "paycheck" && "💵"}{" "}
                  {marketEventData.marketEvent.name}
                </h2>

                <div className={`rounded-2xl p-5 mb-5 text-center ${marketEventData.cashChange >= 0 ? 'bg-emerald-50' : 'bg-red-50'}`}>
                  <p className="text-[16px] text-slate-800 m-0 mb-4 leading-[1.6] font-medium">
                    {marketEventData.marketEvent.message}
                  </p>
                  {marketEventData.cashChange !== 0 && (
                    <div className={`text-[32px] font-medium ${marketEventData.cashChange > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                      {marketEventData.cashChange > 0 ? "+" : ""}${marketEventData.cashChange.toLocaleString()}
                    </div>
                  )}
                </div>

                <button
                  onClick={closeMarketEvent}
                  className="w-full py-3.5 bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none rounded-xl text-[16px] font-medium cursor-pointer"
                >
                  Continuar
                </button>
              </div>
            </div>
          )
        }

        {/* Pay Off Loan Modal */}
        {
          showPayOffModal && selectedLoan && (() => {
            const loan = selectedLoan;
            return (
              <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[2000] p-5">
                <div className="bg-white rounded-[20px] p-8 w-full max-w-[500px] shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
                  <h2 className="text-[28px] font-medium m-0 mb-4 text-slate-800">
                    💳 Pagar Préstamo
                  </h2>

                  <p className="text-[14px] text-slate-500 mb-5 leading-[1.6]">
                    Paga este préstamo para eliminar el pago mensual y mejorar tu flujo de efectivo.
                  </p>

                  <div className="bg-slate-50 rounded-xl p-4 mb-5">
                    <div className="flex justify-between mb-3 text-[14px]">
                      <span className="font-medium">Saldo actual:</span>
                      <span className="font-medium text-red-500">
                        ${selectedLoan.remainingBalance.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between mb-3 text-[14px]">
                      <span className="font-medium">Pago mensual:</span>
                      <span className="font-medium">
                        ${selectedLoan.monthlyPayment.toLocaleString()}/mes
                      </span>
                    </div>

                    <div className="flex justify-between pt-3 border-t-2 border-slate-200 text-[14px]">
                      <span className="font-medium">Tu efectivo actual:</span>
                      <span className={`font-medium ${player.cashOnHand >= selectedLoan.remainingBalance ? 'text-emerald-500' : 'text-red-500'}`}>
                        ${player.cashOnHand.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Warning or Benefit */}
                  {player.cashOnHand >= selectedLoan.remainingBalance ? (
                    <div className="bg-emerald-50 rounded-xl p-4 mb-5 border border-emerald-500">
                      <div className="text-[13px] text-emerald-800">
                        ✅ <strong>Beneficio:</strong> Al pagar este préstamo, tus gastos mensuales
                        disminuirán ${selectedLoan.monthlyPayment.toLocaleString()}, mejorando tu cash flow.
                      </div>
                    </div>
                  ) : (
                    <div className="bg-red-50 rounded-xl p-4 mb-5 border border-red-500">
                      <div className="text-[13px] text-red-800">
                        ❌ <strong>Fondos insuficientes:</strong> Necesitas $
                        {(selectedLoan.remainingBalance - player.cashOnHand).toLocaleString()} más para pagar este préstamo.
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={payOffLoan}
                      disabled={actionInProgress || player.cashOnHand < selectedLoan.remainingBalance}
                      className={`flex-1 py-3.5 border-none rounded-xl text-[16px] font-medium ${(actionInProgress || player.cashOnHand < selectedLoan.remainingBalance) ? 'bg-slate-300 text-white cursor-not-allowed' : 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white cursor-pointer'}`}
                    >
                      💰 Pagar ${selectedLoan.remainingBalance.toLocaleString()}
                    </button>

                    <button
                      onClick={closePayOffModal}
                      disabled={actionInProgress}
                      className={`flex-1 py-3.5 bg-white text-red-500 border-2 border-red-500 rounded-xl text-[16px] font-medium ${actionInProgress ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )
          })()
        }

        {/* Bank Loan Modal */}
        {
          showLoanModal && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[2000] p-5">
              <div className="bg-white rounded-[20px] p-8 w-full max-w-[500px] shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
                <h2 className="text-[28px] font-medium m-0 mb-4 text-slate-800">
                  🏦 Préstamo Bancario
                </h2>

                <p className="text-[14px] text-slate-500 mb-5 leading-[1.6]">
                  Solicita un préstamo para comprar inversiones más grandes.
                  El banco cobra 10% de interés anual.
                </p>

                <div className="bg-amber-50 rounded-xl p-4 mb-5 border border-amber-500">
                  <div className="text-[13px] text-amber-800">
                    ⚠️ <strong>Recuerda:</strong> Los préstamos aumentan tus gastos mensuales.
                    Solo pide prestado si puedes generar más ingresos con la inversión.
                  </div>
                </div>

                {/* Loan Amount Selector */}
                <div className="mb-5">
                  <label className="block text-[14px] font-medium text-slate-800 mb-3">
                    Cantidad del préstamo:
                  </label>

                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {[5000, 10000, 15000, 20000, 30000, 50000].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setLoanAmount(amount)}
                        className={`p-2.5 rounded-lg text-[13px] font-medium cursor-pointer transition-all duration-200 border-none ${loanAmount === amount ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'}`}
                      >
                        ${(amount / 1000).toFixed(0)}K
                      </button>
                    ))}
                  </div>

                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(parseInt(e.target.value) || 0)}
                    min={1000}
                    max={100000}
                    step={1000}
                    className="w-full p-3.5 border-2 border-slate-200 rounded-xl text-[18px] font-medium text-center focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Loan Details */}
                <div className="bg-slate-50 rounded-xl p-4 mb-5">
                  <div className="flex justify-between mb-3 text-[14px]">
                    <span className="font-medium">Recibirás:</span>
                    <span className="font-medium text-emerald-500">
                      ${loanAmount.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between mb-3 text-[14px]">
                    <span className="font-medium">Interés (10% anual):</span>
                    <span className="font-medium">
                      ${Math.floor(loanAmount * 0.10).toLocaleString()}/año
                    </span>
                  </div>

                  <div className="flex justify-between pt-3 border-t-2 border-slate-200 text-[14px]">
                    <span className="font-medium">Pago mensual:</span>
                    <span className="font-medium text-red-500">
                      ${Math.floor(loanAmount * 0.10 / 12).toLocaleString()}/mes
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={takeLoan}
                    disabled={actionInProgress || loanAmount < 1000}
                    className={`flex-1 py-3.5 border-none rounded-xl text-[16px] font-medium ${(actionInProgress || loanAmount < 1000) ? 'bg-slate-300 text-white cursor-not-allowed' : 'bg-gradient-to-br from-amber-500 to-amber-600 text-white cursor-pointer'}`}
                  >
                    💰 Solicitar Préstamo
                  </button>

                  <button
                    onClick={() => setShowLoanModal(false)}
                    disabled={actionInProgress}
                    className={`flex-1 py-3.5 bg-white text-red-500 border-2 border-red-500 rounded-xl text-[16px] font-medium ${actionInProgress ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )
        }

        {/* Sell Investment Modal */}
        {
          showSellModal && selectedInvestment && (() => {
            const investment = selectedInvestment;
            return (
              <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[2000] p-5">
                <div className="bg-white rounded-[20px] p-8 w-full max-w-[500px] shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
                  <h2 className="text-[28px] font-medium m-0 mb-4 text-slate-800">
                    {selectedInvestment.opportunityCard.type === "real_estate" && "🏠"}
                    {selectedInvestment.opportunityCard.type === "stock" && "📈"}
                    {selectedInvestment.opportunityCard.type === "business" && "💼"}
                    {selectedInvestment.opportunityCard.type === "limited_partnership" && "🤝"}
                    {" "}
                    Vender {selectedInvestment.opportunityCard.name}
                  </h2>

                  <div className="bg-slate-50 rounded-xl p-4 mb-5">
                    <div className="flex justify-between mb-3 text-[14px]">
                      <span className="font-medium">Precio de compra:</span>
                      <span className="font-medium">
                        ${selectedInvestment.purchasePrice.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between mb-3 text-[14px]">
                      <span className="font-medium">Ingreso generado:</span>
                      <span className="font-medium text-emerald-500">
                        ${selectedInvestment.totalIncomeEarned.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between pt-3 border-t border-slate-200 text-[14px]">
                      <span className="font-medium">Rango de venta:</span>
                      <span className="font-medium">
                        ${(selectedInvestment.opportunityCard.minSalePrice || 0).toLocaleString()} -
                        ${(selectedInvestment.opportunityCard.maxSalePrice || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Sale Price Selector */}
                  <div className="mb-5">
                    <label className="block text-[14px] font-medium text-slate-800 mb-2">
                      Precio de venta:
                    </label>

                    <div className="flex gap-2 mb-3">
                      <button
                        onClick={() => setSalePrice(selectedInvestment.opportunityCard.minSalePrice || selectedInvestment.purchasePrice)}
                        className={`flex-1 p-2 rounded-lg text-[12px] font-medium cursor-pointer border-none transition-colors duration-200 ${salePrice === selectedInvestment.opportunityCard.minSalePrice ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'}`}
                      >
                        Mínimo
                      </button>

                      <button
                        onClick={() => {
                          const min = selectedInvestment.opportunityCard.minSalePrice || 0
                          const max = selectedInvestment.opportunityCard.maxSalePrice || 0
                          setSalePrice(Math.floor((min + max) / 2))
                        }}
                        className="flex-1 p-2 bg-slate-100 text-slate-800 hover:bg-slate-200 rounded-lg text-[12px] font-medium cursor-pointer border-none transition-colors duration-200"
                      >
                        Medio
                      </button>

                      <button
                        onClick={() => setSalePrice(selectedInvestment.opportunityCard.maxSalePrice || selectedInvestment.purchasePrice)}
                        className={`flex-1 p-2 rounded-lg text-[12px] font-medium cursor-pointer border-none transition-colors duration-200 ${salePrice === selectedInvestment.opportunityCard.maxSalePrice ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'}`}
                      >
                        Máximo
                      </button>
                    </div>

                    <input
                      type="number"
                      value={salePrice}
                      onChange={(e) => setSalePrice(parseInt(e.target.value) || 0)}
                      min={selectedInvestment.opportunityCard.minSalePrice || 0}
                      max={selectedInvestment.opportunityCard.maxSalePrice || selectedInvestment.purchasePrice}
                      className="w-full p-3 border-2 border-slate-200 rounded-lg text-[16px] font-medium text-center focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Profit/Loss Display */}
                  <div className={`rounded-xl p-4 mb-5 text-center ${(salePrice - selectedInvestment.purchasePrice) >= 0 ? 'bg-emerald-50' : 'bg-red-50'}`}>
                    <div className="text-[14px] text-slate-500 mb-1">
                      {(salePrice - selectedInvestment.purchasePrice) >= 0 ? "Ganancia" : "Pérdida"}
                    </div>
                    <div className={`text-[32px] font-medium ${(salePrice - selectedInvestment.purchasePrice) >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                      {(salePrice - selectedInvestment.purchasePrice) >= 0 ? "+" : ""}
                      ${(salePrice - selectedInvestment.purchasePrice).toLocaleString()}
                    </div>
                    <div className="text-[12px] text-slate-500 mt-1">
                      Total recibido: ${(salePrice + selectedInvestment.totalIncomeEarned).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={sellInvestment}
                      disabled={actionInProgress}
                      className={`flex-1 py-3.5 border-none rounded-xl text-[16px] font-medium ${actionInProgress ? 'bg-slate-300 text-white cursor-not-allowed' : 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white cursor-pointer'}`}
                    >
                      💰 Vender
                    </button>

                    <button
                      onClick={closeSellModal}
                      disabled={actionInProgress}
                      className={`flex-1 py-3.5 bg-white text-red-500 border-2 border-red-500 rounded-xl text-[16px] font-medium ${actionInProgress ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )
          })()
        }

        {/* Win Screen Modal */}
        {showWinScreen && (
          <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl flex items-center justify-center z-[5000] p-5">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-[32px] py-[60px] px-10 w-full max-w-[600px] shadow-[0_40px_100px_rgba(0,0,0,0.5)] text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 to-blue-500" />

              <div className="text-[80px] mb-6">🏆</div>

              <h2 className="text-[42px] font-medium text-slate-800 m-0 mb-4">
                ¡LIBERTAD FINANCIERA!
              </h2>

              <p className="text-[18px] text-slate-500 leading-[1.8] mb-10">
                Has logrado que tu <strong className="text-emerald-500">ingreso pasivo</strong> sea mayor que tus gastos.
                ¡Oficialmente has salido de la carrera de ratas y eres financieramente libre!
              </p>

              <div className="bg-emerald-50 rounded-[24px] p-8 mb-10 border-2 border-emerald-200">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-[13px] font-medium text-emerald-600 uppercase mb-1">Ingreso Pasivo</div>
                    <div className="text-[24px] font-medium text-emerald-900">${player.passiveIncome.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-[13px] font-medium text-red-500 uppercase mb-1">Gastos Totales</div>
                    <div className="text-[24px] font-medium text-red-900">${totalExpenses.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowWinScreen(false)}
                className="w-full p-[18px] bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-none rounded-[16px] text-[18px] font-medium cursor-pointer shadow-[0_10px_30px_rgba(16,185,129,0.4)] transition-transform duration-200 hover:scale-[1.02]"
              >
                🚀 Continuar a la Vía Rápida
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </>
  )
}


