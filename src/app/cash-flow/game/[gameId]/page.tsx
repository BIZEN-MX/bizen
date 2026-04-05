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

  const modalOverlayStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(15, 23, 42, 0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
    padding: "clamp(16px, 4vw, 40px)"
  }

  const modalCardStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: isMobile ? "94vw" : 520,
    background: "white",
    borderRadius: 20,
    padding: isMobile ? "20px 16px" : 32,
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
    maxHeight: "90vh",
    overflowY: "auto"
  }

  const modalTitleStyle: React.CSSProperties = {
    fontSize: 28,
    fontWeight: 500,
    margin: "0 0 16px",
    color: "#333"
  }

  const modalDescriptionStyle: React.CSSProperties = {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    lineHeight: 1.6
  }

  const modalInfoBoxStyle: React.CSSProperties = {
    background: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20
  }

  const modalInfoRowStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 12,
    fontSize: 14
  }

  const modalInfoLabelStyle: React.CSSProperties = { fontWeight: 500 }
  const modalInfoValueStyle: React.CSSProperties = { fontWeight: 500 }

  const modalActionsStyle: React.CSSProperties = { display: "flex", gap: 12 }
  const modalPrimaryButtonStyle: React.CSSProperties = {
    flex: 1,
    padding: "14px",
    background: "linear-gradient(135deg, #10b981, #059669)",
    color: "white",
    border: "none",
    borderRadius: 12,
    fontSize: 16,
    fontWeight: 500,
      }
  const modalSecondaryButtonStyle: React.CSSProperties = {
    flex: 1,
    padding: "14px",
    background: "white",
    border: "2px solid #ef4444",
    borderRadius: 12,
    fontSize: 16,
    fontWeight: 500,
      }

  const warningBoxStyle: React.CSSProperties = {
    background: "#fef2f2",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    border: "1px solid #ef4444"
  }
  const warningTextStyle: React.CSSProperties = {
    fontSize: 13,
    color: "#991b1b",
    marginBottom: 8
  }
  const warningQuoteStyle: React.CSSProperties = {
    fontSize: 12,
    color: "#dc2626",
    fontStyle: "italic"
  }

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
      <>
        <style>{`
          .cashflow-game-page { width: 100% !important; min-height: 100vh; overflow-x: hidden !important; }
        `}</style>
        <div
          className="cashflow-game-page"
          style={{
            minHeight: "100vh",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#FBFAF5",
            boxSizing: "border-box"
          }}
        >
          <div style={{ color: "#333", fontSize: 24, fontWeight: 500 }}>
            Cargando juego...
          </div>
        </div>
      </>
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
    <div style={modalOverlayStyle}>
      <div style={modalCardStyle}>
        <h2 style={modalTitleStyle}>
          {currentCard?.type === "real_estate" && <Home size={28} color="#0F62FE" style={{ marginRight: 12, verticalAlign: 'middle' }} />}
          {currentCard?.type === "stock" && <TrendingUp size={28} color="#10b981" style={{ marginRight: 12, verticalAlign: 'middle' }} />}
          {currentCard?.type === "business" && <Briefcase size={28} color="#8b5cf6" style={{ marginRight: 12, verticalAlign: 'middle' }} />}
          {currentCard?.type === "limited_partnership" && <Users size={28} color="#f59e0b" style={{ marginRight: 12, verticalAlign: 'middle' }} />}
          {currentCard?.name}
        </h2>
        <p style={modalDescriptionStyle}>{currentCard?.description}</p>
        {currentCard && (
          <div style={modalInfoBoxStyle}>
            <div style={modalInfoRowStyle}>
              <span style={modalInfoLabelStyle}>Precio:</span>
              <span style={modalInfoValueStyle}>
                ${currentCard.cost.toLocaleString()}
              </span>
            </div>
            {currentCard.downPayment && (
              <div style={modalInfoRowStyle}>
                <span style={modalInfoLabelStyle}>Enganche:</span>
                <span style={{ ...modalInfoValueStyle, color: "#ef4444" }}>
                  ${currentCard.downPayment.toLocaleString()}
                </span>
              </div>
            )}
            {currentCard.cashFlow && (
              <div style={modalInfoRowStyle}>
                <span style={modalInfoLabelStyle}>Flujo mensual:</span>
                <span style={{
                  ...modalInfoValueStyle,
                  color: currentCard.cashFlow > 0 ? "#10b981" : "#ef4444"
                }}>
                  ${currentCard.cashFlow.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        )}
        <div style={modalActionsStyle}>
          <button
            onClick={purchaseInvestment}
            disabled={actionInProgress}
            style={{
              ...modalPrimaryButtonStyle,
              background: actionInProgress
                ? "#ccc"
                : "linear-gradient(135deg, #10b981, #059669)",
              cursor: actionInProgress ? "not-allowed" : "pointer"
            }}
          >
            <BadgeDollarSign size={18} style={{ marginRight: 8 }} /> Comprar
          </button>
          <button
            onClick={passCard}
            disabled={actionInProgress}
            style={{
              ...modalSecondaryButtonStyle,
              cursor: actionInProgress ? "not-allowed" : "pointer"
            }}
          >
            <X size={18} style={{ marginRight: 8 }} /> Pasar
          </button>
        </div>
      </div>
    </div>
  )

  const renderDoodadModal = () => (
    <div style={modalOverlayStyle}>
      <div style={modalCardStyle}>
        <h2 style={modalTitleStyle}>
          {currentDoodad?.category === "toys" && <Gamepad2 size={28} color="#ec4899" style={{ marginRight: 12, verticalAlign: 'middle' }} />}
          {currentDoodad?.category === "entertainment" && <Film size={28} color="#ef4444" style={{ marginRight: 12, verticalAlign: 'middle' }} />}
          {currentDoodad?.category === "fashion" && <Shirt size={28} color="#3b82f6" style={{ marginRight: 12, verticalAlign: 'middle' }} />}
          {currentDoodad?.category === "travel" && <Plane size={28} color="#0ea5e9" style={{ marginRight: 12, verticalAlign: 'middle' }} />}
          {currentDoodad?.category === "food" && <Utensils size={28} color="#f59e0b" style={{ marginRight: 12, verticalAlign: 'middle' }} />}
          {!currentDoodad?.category && <Gem size={28} color="#a78bfa" style={{ marginRight: 12, verticalAlign: 'middle' }} />}
          {currentDoodad?.name}
        </h2>
        <p style={modalDescriptionStyle}>{currentDoodad?.description}</p>
        <div style={warningBoxStyle}>
          <div style={warningTextStyle}>
            <AlertTriangle size={16} style={{ marginRight: 8, verticalAlign: 'text-bottom' }} /> <strong>ADVERTENCIA:</strong> Este es un gasto de lujo que NO genera ningún ingreso.
          </div>
          <div style={warningQuoteStyle}>
            "Los pobres y la clase media compran lujos primero. Los ricos compran activos primero." - Robert Kiyosaki
          </div>
        </div>
        <div style={{ ...modalInfoBoxStyle, textAlign: "center" as const }}>
          <div style={{ fontSize: 14, color: "#666", marginBottom: 4 }}>
            Costo
          </div>
          <div style={{ fontSize: 36, fontWeight: 500, color: "#ef4444" }}>
            ${currentDoodad?.cost.toLocaleString()}
          </div>
          <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
            Tu efectivo: ${player.cashOnHand.toLocaleString()}
          </div>
        </div>
        <div style={modalActionsStyle}>
          <button
            onClick={passDoodad}
            style={modalPrimaryButtonStyle}
          >
            <Check size={18} style={{ marginRight: 8 }} /> Pasar (Decisión Inteligente)
          </button>
          <button
            onClick={buyDoodad}
            disabled={actionInProgress || !currentDoodad || player.cashOnHand < currentDoodad.cost}
            style={{
              ...modalSecondaryButtonStyle,
              background: (actionInProgress || !currentDoodad || player.cashOnHand < currentDoodad.cost)
                ? "#ccc"
                : "linear-gradient(135deg, #ef4444, #dc2626)",
              border: "none",
              color: "white",
              cursor: (actionInProgress || !currentDoodad || player.cashOnHand < currentDoodad.cost)
                ? "not-allowed"
                : "pointer"
            }}
          >
            <BadgeDollarSign size={18} style={{ marginRight: 8 }} /> Comprar (Mala Idea)
          </button>
        </div>
      </div>
    </div>
  )
  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }
        /* Full-screen immersive layout — sidebar is hidden via hide-sidebar body class */
        .cashflow-game-page {
          width: 100vw !important;
          max-width: 100vw !important;
          margin: 0 !important;
          padding: 0 !important;
          min-height: 100dvh;
          overflow-x: hidden !important;
          position: relative;
        }
        .cashflow-game-container {
          width: 100% !important;
          max-width: 100% !important;
          overflow-x: visible !important;
          overflow-y: visible !important;
        }
        .cashflow-game-main {
          width: 100% !important;
          max-width: 100% !important;
          overflow-x: visible !important;
          overflow-y: visible !important;
        }
        @media (min-width: 1161px) {
          .cashflow-game-main {
            padding-right: 24px !important;
          }
        }
        @media (min-width: 768px) and (max-width: 1160px) {
          .cashflow-game-main {
            padding-right: 16px !important;
          }
        }
        .cashflow-game-container > div[style*="display: grid"] {
          width: 100% !important;
          max-width: 100% !important;
        }
        .cashflow-game-container > div[style*="display: grid"] > div:nth-child(1) {
          grid-column: 1 !important;
          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;
        }
        .cashflow-game-container > div[style*="display: grid"] > div:nth-child(2) {
          grid-column: 2 !important;
          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;
          visibility: visible !important;
          opacity: 1 !important;
          display: block !important;
        }
        .cashflow-game-container > div[style*="grid"] {
          width: 100% !important;
          max-width: 100% !important;
        }
        .cashflow-game-container > div[style*="grid"] > div:first-child {
          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;
          grid-column: 1 !important;
        }
        .cashflow-game-container > div[style*="grid"] > div:last-child {
          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;
          grid-column: 2 !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
        /* Stack grid to single column when content area is narrow (tablet with sidebar) */
        @media (min-width: 768px) and (max-width: 1100px) {
          .cashflow-game-container > div[style*="display: grid"] {
            grid-template-columns: 1fr !important;
          }
          .cashflow-game-container > div[style*="display: grid"] > div:nth-child(2) {
            grid-column: 1 !important;
          }
        }
        @media (max-width: 767px) {
          .cashflow-game-container > div[style*="grid"] > div:last-child {
            grid-column: 1 !important;
          }
        }
        @media (max-width: 767px) {
          .cashflow-game-container {
            width: 100% !important;
            max-width: 100% !important;
            overflow-x: visible !important;
            overflow-y: visible !important;
          }
          .cashflow-game-main {
            padding: clamp(8px, 2vw, 16px) !important;
            padding-bottom: calc(140px + max(env(safe-area-inset-bottom), 0px)) !important;
            width: 100% !important;
            max-width: 100% !important;
            overflow-x: visible !important;
            overflow-y: visible !important;
          }
          .game-board-container {
            width: 100% !important;
            max-width: 100% !important;
            overflow-x: visible !important;
            overflow-y: visible !important;
            padding: clamp(4px, 1vw, 12px) !important;
            margin: 0 auto !important;
            box-sizing: border-box !important;
          }
          .game-board-wrapper {
            width: 100% !important;
            max-width: 100% !important;
          }
        }
        @media (min-width: 768px) {
          .cashflow-game-container {
            width: 100% !important;
            max-width: 100% !important;
            overflow-x: visible !important;
            overflow-y: visible !important;
          }
          .cashflow-game-main {
            width: 100% !important;
            max-width: 100% !important;
            overflow-x: visible !important;
            overflow-y: visible !important;
          }
          .game-board-container {
            width: 100% !important;
            max-width: 100% !important;
            overflow-x: visible !important;
            overflow-y: visible !important;
            padding: clamp(8px, 1.5vw, 16px) !important;
            margin: 0 auto !important;
            box-sizing: border-box !important;
          }
        }
      `}</style>
      <div className="cashflow-game-page" style={{
        width: "100%",
        minHeight: "100vh",
        background: "#FBFAF5",
                overflowX: "hidden"
      }}>
        <main className="cashflow-game-main" style={{
          width: "100%",
          maxWidth: "100%",
          padding: isMobile ? "clamp(12px, 3vw, 16px)" : "clamp(16px, 3vw, 24px)",
          paddingBottom: isMobile ? "calc(140px + env(safe-area-inset-bottom, 0px))" : "clamp(40px, 4vw, 80px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          boxSizing: "border-box",
          overflowX: "hidden",
          overflowY: "visible"
        }}>
          <div className="cashflow-game-container" style={{
            width: "100%",
            maxWidth: "100%",
            boxSizing: "border-box",
            overflowX: "visible",
            overflowY: "visible",
            display: "flex",
            flexDirection: "column"
          }}>
            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: player.isOnFastTrack
                  ? "linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)"
                  : "linear-gradient(135deg, #0f172a, #1e3a8a, #1e40af)",
                borderRadius: "24px",
                padding: "clamp(20px, 4vw, 32px)",
                marginBottom: "24px",
                boxShadow: "0 20px 50px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                justifyContent: "space-between",
                alignItems: isMobile ? "flex-start" : "center",
                position: "relative",
                overflow: "hidden",
                gap: 20
              }}
            >
              {/* EXIT BUTTON */}
              <button 
                onClick={() => router.back()}
                style={{ 
                  position: "absolute", 
                  top: 16, 
                  right: 16, 
                  width: 44, 
                  height: 44, 
                  borderRadius: 14, 
                  background: "rgba(255,255,255,0.1)", 
                  border: "1px solid rgba(255,255,255,0.2)", 
                  color: "white", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  cursor: "pointer",
                  zIndex: 10,
                  transition: "all 0.2s"
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(15, 98, 254, 0.3)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
              >
                <X size={20} />
              </button>
              {/* Decorative elements */}
              <div style={{ position: "absolute", top: "-20%", right: "-5%", width: "40%", height: "140%", background: player.isOnFastTrack ? "radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)" : "radial-gradient(circle, rgba(11,113,254,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />

              <div style={{ display: "flex", alignItems: "center", gap: 20, zIndex: 1, position: "relative" }}>
                <div style={{
                  width: 64, height: 64, borderRadius: 18, background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center",
                  justifyContent: "center", overflow: "hidden", backdropFilter: "blur(10px)"
                }}>
                  <AvatarDisplay
                    size={56}
                    avatar={dbProfile?.avatar}
                    frame={dbProfile?.inventory?.includes("2") ? "vip" : dbProfile?.inventory?.includes("1") ? "ambassador" : null}
                  />
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <h1 style={{
                      fontSize: "clamp(22px, 3vw, 36px)",
                      fontWeight: 500,
                      margin: 0,
                      color: "white",
                      letterSpacing: "-0.02em"
                    }}>
                      {player.isOnFastTrack ? "TRABAJO DE SUEÑO" : player.profession.name}
                    </h1>
                    <span style={{
                      padding: "4px 12px", background: player.isOnFastTrack ? "#fbbf24" : "rgba(11,113,254,0.3)",
                      color: player.isOnFastTrack ? "#92400e" : "#bfdbfe", borderRadius: 999,
                      fontSize: 12, fontWeight: 500, textTransform: "uppercase"
                    }}>
                      {player.isOnFastTrack ? "Fast Track" : "Rat Race"}
                    </span>
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, fontWeight: 500 }}>
                    Turno {player.currentTurn} • Progreso a la Libertad Financiera
                  </div>
                </div>
              </div>

              {/* Progress Toward Freedom */}
              {!player.isOnFastTrack && (
                <div style={{ minWidth: isMobile ? "100%" : 300, zIndex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13, fontWeight: 500, color: "white" }}>
                    <span>Independencia Financiera</span>
                    <span>{Math.min(100, Math.round((player.passiveIncome / totalExpenses) * 100))}%</span>
                  </div>
                  <div style={{ width: "100%", height: 10, background: "rgba(255,255,255,0.1)", borderRadius: 5, overflow: "hidden" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (player.passiveIncome / totalExpenses) * 100)}%` }}
                      style={{ height: "100%", background: "linear-gradient(90deg, #10b981, #3b82f6)", borderRadius: 5 }}
                    />
                  </div>
                  <div style={{ textAlign: "right", marginTop: 4, fontSize: 11, color: "rgba(255,255,255,0.5)" }}>
                    Meta: Ingreso Pasivo {">"} Gastos
                  </div>
                </div>
              )}
            </motion.div>

            {/* Financial Dashboard Container */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "minmax(300px, 1fr) minmax(300px, 1fr)",
                gap: "24px",
                marginBottom: "32px"
              }}
            >
              {/* Financial Statement Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                style={{
                  background: "rgba(255, 255, 255, 0.7)",
                  backdropFilter: "blur(20px)",
                  borderRadius: "28px",
                  padding: "32px",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.06)",
                  border: "1px solid rgba(255,255,255,0.4)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px"
                }}
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
                <div style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.05), rgba(5,150,105,0.1))", borderRadius: 20, padding: 20, border: "1px solid rgba(16,185,129,0.1)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "#059669", textTransform: "uppercase", letterSpacing: "0.05em" }}>Ingresos Totales</span>
                    <span style={{ fontSize: 18, fontWeight: 500, color: "#059669" }}>${totalIncome.toLocaleString()}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                      <span style={{ color: "#64748b" }}>Salario</span>
                      <span style={{ fontWeight: 500 }}>${player.profession.salary.toLocaleString()}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                      <span style={{ color: "#64748b" }}>Ingreso Pasivo</span>
                      <span style={{ fontWeight: 500, color: "#10b981" }}>+${player.passiveIncome.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Expenses Section */}
                <div style={{ background: "linear-gradient(135deg, rgba(239,68,68,0.05), rgba(220,38,38,0.1))", borderRadius: 20, padding: 20, border: "1px solid rgba(239,68,68,0.1)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "#dc2626", textTransform: "uppercase", letterSpacing: "0.05em" }}>Gastos Totales</span>
                    <span style={{ fontSize: 18, fontWeight: 500, color: "#dc2626" }}>${totalExpenses.toLocaleString()}</span>
                  </div>
                  <div style={{ maxHeight: 120, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, paddingRight: 4 }}>
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
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                        <span style={{ color: "#64748b" }}>{e.label}</span>
                        <span style={{ fontWeight: 500 }}>${e.val.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Monthly Cash Flow Card */}
                <div style={{
                  background: cashFlow > 0 ? "linear-gradient(135deg, #10b981, #059669)" : "linear-gradient(135deg, #ef4444, #dc2626)",
                  borderRadius: 20, padding: 24, color: "white", boxShadow: "0 15px 30px rgba(0,0,0,0.15)"
                }}>
                  <div style={{ fontSize: 12, fontWeight: 500, opacity: 0.8, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Flujo Mensual</div>
                  <div style={{ fontSize: 28, fontWeight: 500 }}>${cashFlow.toLocaleString()}</div>
                </div>
              </motion.div>

              {/* Assets & Investments Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                style={{
                  background: "rgba(255, 255, 255, 0.7)",
                  backdropFilter: "blur(20px)",
                  borderRadius: "28px",
                  padding: "32px",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.06)",
                  border: "1px solid rgba(255,255,255,0.4)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(16,185,129,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <MoneyIcon size={24} color="#10b981" />
                  </div>
                  <h2 style={{ fontSize: 20, fontWeight: 500, color: "#1e293b", margin: 0 }}>Mis Activos</h2>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div style={{ background: "white", borderRadius: 16, padding: 16, border: "1px solid #f1f5f9", textAlign: "center" }}>
                    <div style={{ fontSize: 11, fontWeight: 500, color: "#64748b", textTransform: "uppercase", marginBottom: 4 }}>Efectivo</div>
                    <div style={{ fontSize: 20, fontWeight: 500, color: "#10b981" }}>${player.cashOnHand.toLocaleString()}</div>
                  </div>
                  <div style={{ background: "white", borderRadius: 16, padding: 16, border: "1px solid #f1f5f9", textAlign: "center" }}>
                    <div style={{ fontSize: 11, fontWeight: 500, color: "#64748b", textTransform: "uppercase", marginBottom: 4 }}>Ahorros</div>
                    <div style={{ fontSize: 20, fontWeight: 500, color: "#3b82f6" }}>${player.savings.toLocaleString()}</div>
                  </div>
                </div>

                {/* Investments List */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 14, fontWeight: 500, color: "#334155" }}>Portafolio ({player.investments?.length || 0})</span>
                    <span style={{ fontSize: 12, color: "#94a3b8" }}>Haga clic para vender</span>
                  </div>

                  <div style={{
                    maxHeight: 250, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, paddingRight: 4
                  }}>
                    {!player.investments?.length ? (
                      <div style={{ textAlign: "center", padding: "32px 16px", background: "#FBFAF5", borderRadius: 16, border: "1.5px dashed #e2e8f0" }}>
                        <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Aún no tienes inversiones. ¡Saca una carta de oportunidad!</p>
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
                style={{
                  background: "rgba(255, 255, 255, 0.7)",
                  backdropFilter: "blur(20px)",
                  borderRadius: "28px",
                  padding: "32px",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.06)",
                  border: "1px solid rgba(255,255,255,0.4)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(239,68,68,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <CreditCardIcon size={24} color="#ef4444" />
                  </div>
                  <h2 style={{ fontSize: 20, fontWeight: 500, color: "#1e293b", margin: 0 }}>Mis Deudas</h2>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12, maxHeight: 350, overflowY: "auto", paddingRight: 4 }}>
                  {/* Fixed Profession Liabilities */}
                  {[
                    { label: "Hipoteca", value: player.profession.homeMortgage },
                    { label: "Préstamo Escolar", value: player.profession.schoolLoans },
                    { label: "Préstamo Auto", value: player.profession.carLoans },
                    { label: "Tarjetas", value: player.profession.creditCards },
                    { label: "Deuda Tiendas", value: player.profession.retailDebt }
                  ].filter(l => l.value > 0).map((l, idx) => (
                    <div key={idx} style={{ background: "white", borderRadius: 16, padding: "14px 18px", border: "1.5px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>{l.label}</div>
                        <div style={{ fontSize: 16, fontWeight: 500, color: "#1e293b" }}>${l.value.toLocaleString()}</div>
                      </div>
                      <div style={{ padding: "6px 10px", borderRadius: 8, background: "#fef2f2", color: "#ef4444", fontSize: 11, fontWeight: 500 }}>PASIVO</div>
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
                      style={{
                        background: "white", borderRadius: 16, padding: "14px 18px", border: "1.5px solid #f1f5f9", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center"
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>{l.description || l.type === "bank_loan" ? "Préstamo Bancario" : l.type}</div>
                        <div style={{ fontSize: 16, fontWeight: 500, color: "#1e293b" }}>${l.remainingBalance.toLocaleString()}</div>
                      </div>
                      <button style={{ padding: "6px 12px", borderRadius: 8, background: "#ef4444", color: "white", border: "none", fontSize: 11, fontWeight: 500, cursor: "pointer" }}>PAGAR</button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Purchased Doodads */}
            {player.doodads && player.doodads.length > 0 && (
              <div style={{
                background: "#fef2f2",
                borderRadius: 12,
                padding: 16,
                marginTop: 16
              }}>
                <div style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#dc2626",
                  marginBottom: 12
                }}>
                  💸 GASTOS DE LUJO ({player.doodads.length})
                </div>
                <div style={{
                  fontSize: 12,
                  color: "#666",
                  marginBottom: 12
                }}>
                  Dinero gastado sin retorno de inversión:
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {player.doodads.map((doodad) => (
                    <div
                      key={doodad.id}
                      style={{
                        background: "white",
                        borderRadius: 6,
                        padding: 8,
                        fontSize: 11,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}
                    >
                      <span style={{ color: "#666" }}>{doodad.name}</span>
                      <span style={{ fontWeight: 500, color: "#ef4444" }}>
                        -${doodad.cost.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                <div style={{
                  marginTop: 12,
                  paddingTop: 12,
                  borderTop: "1px solid #fecaca",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#dc2626",
                  display: "flex",
                  justifyContent: "space-between"
                }}>
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
              style={{
                width: "100%",
                maxWidth: "100%",
                overflow: "visible",
                marginBottom: "32px"
              }}
            >
              <div className="game-board-container" style={{
                width: "100%",
                maxWidth: "100%",
                padding: "clamp(8px, 2vw, 24px)",
                background: "rgba(15, 23, 42, 0.4)",
                backdropFilter: "blur(4px)",
                borderRadius: "32px",
                border: "1px solid rgba(255,255,255,0.05)",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}>
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
            <div style={{
              background: "rgba(255,255,255,0.7)",
              backdropFilter: "blur(20px)",
              borderRadius: "24px",
              padding: "24px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.05)",
              border: "1px solid rgba(255,255,255,0.4)",
              textAlign: "center"
            }}>
              <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(245, 158, 11, 0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowLoanModal(true)}
                  disabled={actionInProgress}
                  style={{
                    padding: "14px 32px",
                    background: "white",
                    color: "#f59e0b",
                    border: "2.5px solid #fbbf24",
                    borderRadius: "20px",
                    fontSize: 15,
                    fontWeight: 500,
                    cursor: actionInProgress ? "not-allowed" : "pointer",
                    boxShadow: "0 4px 12px rgba(245, 158, 11, 0.1)",
                                        display: "flex",
                    alignItems: "center",
                    gap: 10
                  }}
                >
                  <MoneyIcon size={20} color="#f59e0b" />
                  Solicitar Préstamo
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(16, 185, 129, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={endTurn}
                  disabled={actionInProgress}
                  style={{
                    padding: "14px 32px",
                    background: "linear-gradient(135deg, #10b981, #059669)",
                    color: "white",
                    border: "none",
                    borderRadius: "20px",
                    fontSize: 15,
                    fontWeight: 500,
                    cursor: actionInProgress ? "not-allowed" : "pointer",
                    boxShadow: "0 8px 20px rgba(16, 185, 129, 0.3)",
                                        display: "flex",
                    alignItems: "center",
                    gap: 10
                  }}
                >
                  <ZapIcon size={20} color="white" />
                  Terminar Turno
                </motion.button>
              </div>
              <p style={{ fontSize: 13, color: "#64748b", marginTop: 16, fontWeight: 500 }}>
                💡 Consejo: Tira el dado para avanzar y busca oportunidades de ingreso pasivo.
              </p>
            </div>
          </div>
        </main>

        {/* Tutorial Modal */}
        {showTutorial && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 3000,
            padding: 20
          }}>
            <div style={{
              background: "white",
              borderRadius: 24,
              padding: "40px",
              maxWidth: 650,
              width: "100%",
              boxShadow: "0 25px 80px rgba(0, 0, 0, 0.4)",
              position: "relative"
            }}>
              {/* Step Indicator */}
              <div style={{
                display: "flex",
                gap: 8,
                justifyContent: "center",
                marginBottom: 24
              }}>
                {[0, 1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    style={{
                      width: tutorialStep === step ? 32 : 8,
                      height: 8,
                      borderRadius: 4,
                      background: tutorialStep === step
                        ? "linear-gradient(135deg, #667eea, #764ba2)"
                        : "#e5e7eb",
                      transition: "all 0.3s"
                    }}
                  />
                ))}
              </div>

              {/* Step 0: Welcome */}
              {tutorialStep === 0 && (
                <div>
                  <div style={{ fontSize: 64, textAlign: "center", marginBottom: 16 }}>
                    👋
                  </div>
                  <h2 style={{
                    fontSize: 32,
                    fontWeight: 500,
                    margin: "0 0 16px",
                    textAlign: "center",
                    background: "linear-gradient(135deg, #667eea, #764ba2)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text"
                  }}>
                    ¡Bienvenido a CASHFLOW!
                  </h2>
                  <p style={{
                    fontSize: 16,
                    color: "#666",
                    lineHeight: 1.8,
                    textAlign: "center",
                    marginBottom: 24
                  }}>
                    Basado en el juego de Robert Kiyosaki, autor de "Padre Rico, Padre Pobre".
                    <br /><br />
                    <strong style={{ color: "#333" }}>Tu objetivo:</strong> Escapar de la "Carrera de Ratas"
                    construyendo suficiente <strong style={{ color: "#10b981" }}>ingreso pasivo</strong> para
                    cubrir tus gastos y alcanzar la libertad financiera.
                  </p>
                </div>
              )}

              {/* Step 1: Financial Statement */}
              {tutorialStep === 1 && (
                <div>
                  <div style={{ fontSize: 64, textAlign: "center", marginBottom: 16 }}>
                    📊
                  </div>
                  <h2 style={{
                    fontSize: 28,
                    fontWeight: 500,
                    margin: "0 0 16px",
                    textAlign: "center",
                    color: "#333"
                  }}>
                    Tu Estado Financiero
                  </h2>
                  <div style={{
                    fontSize: 15,
                    color: "#666",
                    lineHeight: 1.8,
                    marginBottom: 20
                  }}>
                    <div style={{ marginBottom: 16 }}>
                      <strong style={{ color: "#10b981" }}>💵 INGRESOS:</strong>
                      <ul style={{ marginTop: 8, marginLeft: 20 }}>
                        <li><strong>Salario:</strong> Tu trabajo mensual</li>
                        <li><strong style={{ color: "#10b981" }}>Ingreso Pasivo:</strong> Dinero que ganas sin trabajar (¡clave para ganar!)</li>
                      </ul>
                    </div>

                    <div style={{ marginBottom: 16 }}>
                      <strong style={{ color: "#ef4444" }}>💸 GASTOS:</strong>
                      <ul style={{ marginTop: 8, marginLeft: 20 }}>
                        <li>Impuestos, hipoteca, préstamos, tarjetas</li>
                        <li>Pagos mensuales obligatorios</li>
                      </ul>
                    </div>

                    <div>
                      <strong style={{ color: "#2563eb" }}>📊 CASH FLOW:</strong>
                      <ul style={{ marginTop: 8, marginLeft: 20 }}>
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
                  <div style={{ fontSize: 64, textAlign: "center", marginBottom: 16 }}>
                    🎲
                  </div>
                  <h2 style={{
                    fontSize: 28,
                    fontWeight: 500,
                    margin: "0 0 16px",
                    textAlign: "center",
                    color: "#333"
                  }}>
                    Cómo Jugar
                  </h2>
                  <div style={{
                    fontSize: 15,
                    color: "#666",
                    lineHeight: 1.8
                  }}>
                    <div style={{
                      background: "#f8f9fa",
                      borderRadius: 12,
                      padding: 16,
                      marginBottom: 12
                    }}>
                      <strong>1. 🃏 Sacar Carta:</strong> Recibirás inversiones, eventos o tentaciones de lujo
                    </div>

                    <div style={{
                      background: "#f8f9fa",
                      borderRadius: 12,
                      padding: 16,
                      marginBottom: 12
                    }}>
                      <strong>2. 💰 Tomar Decisiones:</strong> Comprar inversiones que generen ingreso pasivo o pasar
                    </div>

                    <div style={{
                      background: "#f8f9fa",
                      borderRadius: 12,
                      padding: 16,
                      marginBottom: 12
                    }}>
                      <strong>3. ⏭️ Terminar Turno:</strong> Recibe tu salario + ingresos pasivos, paga gastos
                    </div>

                    <div style={{
                      background: "#ecfdf5",
                      borderRadius: 12,
                      padding: 16,
                      border: "2px solid #10b981"
                    }}>
                      <strong style={{ color: "#059669" }}>🎯 GANAR:</strong> Cuando tu ingreso pasivo
                      supere tus gastos totales, ¡habrás escapado!
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Investment Strategy */}
              {tutorialStep === 3 && (
                <div>
                  <div style={{ fontSize: 64, textAlign: "center", marginBottom: 16 }}>
                    🏠💼📈
                  </div>
                  <h2 style={{
                    fontSize: 28,
                    fontWeight: 500,
                    margin: "0 0 16px",
                    textAlign: "center",
                    color: "#333"
                  }}>
                    Tipos de Inversiones
                  </h2>
                  <div style={{
                    fontSize: 15,
                    color: "#666",
                    lineHeight: 1.8
                  }}>
                    <div style={{
                      background: "#f0fdf4",
                      borderRadius: 12,
                      padding: 16,
                      marginBottom: 12,
                      border: "1px solid #10b981"
                    }}>
                      <strong style={{ color: "#059669" }}>🏠 Bienes Raíces:</strong>
                      <div style={{ fontSize: 14, marginTop: 4 }}>
                        Casas, apartamentos, edificios. Paga enganche, recibe renta mensual. ¡Puedes vender más caro!
                      </div>
                    </div>

                    <div style={{
                      background: "#eff6ff",
                      borderRadius: 12,
                      padding: 16,
                      marginBottom: 12,
                      border: "1px solid #3b82f6"
                    }}>
                      <strong style={{ color: "#1e40af" }}>📈 Acciones:</strong>
                      <div style={{ fontSize: 14, marginTop: 4 }}>
                        Compra barato, vende caro. Algunas pagan dividendos. Volátiles pero lucrativas.
                      </div>
                    </div>

                    <div style={{
                      background: "#fef3c7",
                      borderRadius: 12,
                      padding: 16,
                      marginBottom: 12,
                      border: "1px solid #f59e0b"
                    }}>
                      <strong style={{ color: "#92400e" }}>💼 Negocios:</strong>
                      <div style={{ fontSize: 14, marginTop: 4 }}>
                        Franquicias, lavanderías, negocios. Alto cash flow estable.
                      </div>
                    </div>

                    <div style={{
                      background: "#f5f3ff",
                      borderRadius: 12,
                      padding: 16,
                      border: "1px solid #a78bfa"
                    }}>
                      <strong style={{ color: "#6d28d9" }}>🤝 Sociedades Limitadas:</strong>
                      <div style={{ fontSize: 14, marginTop: 4 }}>
                        Inversiones grupales. Alto riesgo, alta recompensa.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Advanced Tips */}
              {tutorialStep === 4 && (
                <div>
                  <div style={{ fontSize: 64, textAlign: "center", marginBottom: 16 }}>
                    💡
                  </div>
                  <h2 style={{
                    fontSize: 28,
                    fontWeight: 500,
                    margin: "0 0 16px",
                    textAlign: "center",
                    color: "#333"
                  }}>
                    Consejos Estratégicos
                  </h2>
                  <div style={{
                    fontSize: 15,
                    color: "#666",
                    lineHeight: 1.8
                  }}>
                    <div style={{
                      background: "#ecfdf5",
                      borderRadius: 12,
                      padding: 16,
                      marginBottom: 12,
                      border: "1px solid #10b981"
                    }}>
                      <strong style={{ color: "#059669" }}>✅ HACER:</strong>
                      <ul style={{ marginTop: 8, marginLeft: 20, fontSize: 14 }}>
                        <li>Comprar activos que generen ingreso pasivo</li>
                        <li>Usar préstamos para comprar inversiones más grandes</li>
                        <li>Vender inversiones cuando suban de precio</li>
                        <li>Pagar préstamos para reducir gastos</li>
                      </ul>
                    </div>

                    <div style={{
                      background: "#fef2f2",
                      borderRadius: 12,
                      padding: 16,
                      border: "1px solid #ef4444"
                    }}>
                      <strong style={{ color: "#dc2626" }}>❌ EVITAR:</strong>
                      <ul style={{ marginTop: 8, marginLeft: 20, fontSize: 14 }}>
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
              <div style={{
                display: "flex",
                gap: 12,
                marginTop: 32
              }}>
                {tutorialStep > 0 && (
                  <button
                    onClick={prevTutorialStep}
                    style={{
                      padding: "14px 24px",
                      background: "white",
                      color: "#667eea",
                      border: "2px solid #667eea",
                      borderRadius: 12,
                      fontSize: 16,
                      fontWeight: 500,
                      cursor: "pointer",
                                            transition: "all 0.2s"
                    }}
                  >
                    ← Anterior
                  </button>
                )}

                <button
                  onClick={nextTutorialStep}
                  style={{
                    flex: 1,
                    padding: "14px 24px",
                    background: "linear-gradient(135deg, #667eea, #764ba2)",
                    color: "white",
                    border: "none",
                    borderRadius: 12,
                    fontSize: 16,
                    fontWeight: 500,
                    cursor: "pointer",
                                        boxShadow: "0 6px 20px rgba(102, 126, 234, 0.3)",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                  {tutorialStep === 4 ? "🚀 ¡Empezar a Jugar!" : "Siguiente →"}
                </button>

                <button
                  onClick={closeTutorial}
                  style={{
                    padding: "14px 24px",
                    background: "transparent",
                    color: "#999",
                    border: "none",
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: "pointer",
                                      }}
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
            <div style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2000,
              padding: 20
            }}>
              <div style={{
                background: "white",
                borderRadius: 20,
                padding: 32,
                maxWidth: 500,
                width: "100%",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)"
              }}>
                <h2 style={{
                  fontSize: 28,
                  fontWeight: 500,
                  margin: "0 0 16px",
                  color: "#333"
                }}>
                  {marketEventData.marketEvent.type === "baby" && "👶"}
                  {marketEventData.marketEvent.type === "downsized" && "📉"}
                  {marketEventData.marketEvent.type === "charity" && "❤️"}
                  {marketEventData.marketEvent.type === "paycheck" && "💵"}{" "}
                  {marketEventData.marketEvent.name}
                </h2>

                <div style={{
                  background: marketEventData.cashChange >= 0 ? "#ecfdf5" : "#fef2f2",
                  borderRadius: 16,
                  padding: 20,
                  marginBottom: 20,
                  textAlign: "center"
                }}>
                  <p style={{
                    fontSize: 16,
                    color: "#333",
                    margin: "0 0 16px",
                    lineHeight: 1.6,
                    fontWeight: 500
                  }}>
                    {marketEventData.marketEvent.message}
                  </p>
                  {marketEventData.cashChange !== 0 && (
                    <div style={{
                      fontSize: 32,
                      fontWeight: 500,
                      color: marketEventData.cashChange > 0 ? "#10b981" : "#ef4444"
                    }}>
                      {marketEventData.cashChange > 0 ? "+" : ""}${marketEventData.cashChange.toLocaleString()}
                    </div>
                  )}
                </div>

                <button
                  onClick={closeMarketEvent}
                  style={{
                    width: "100%",
                    padding: "14px",
                    background: "linear-gradient(135deg, #667eea, #764ba2)",
                    color: "white",
                    border: "none",
                    borderRadius: 12,
                    fontSize: 16,
                    fontWeight: 500,
                    cursor: "pointer",
                                      }}
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
              <div style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(0, 0, 0, 0.7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 2000,
                padding: 20
              }}>
                <div style={{
                  background: "white",
                  borderRadius: 20,
                  padding: 32,
                  maxWidth: 500,
                  width: "100%",
                  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)"
                }}>
                  <h2 style={{
                    fontSize: 28,
                    fontWeight: 500,
                    margin: "0 0 16px",
                    color: "#333"
                  }}>
                    💳 Pagar Préstamo
                  </h2>

                  <p style={{
                    fontSize: 14,
                    color: "#666",
                    marginBottom: 20,
                    lineHeight: 1.6
                  }}>
                    Paga este préstamo para eliminar el pago mensual y mejorar tu flujo de efectivo.
                  </p>

                  <div style={{
                    background: "#f8f9fa",
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 20
                  }}>
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 12,
                      fontSize: 14
                    }}>
                      <span style={{ fontWeight: 500 }}>Saldo actual:</span>
                      <span style={{ fontWeight: 500, color: "#ef4444" }}>
                        ${selectedLoan.remainingBalance.toLocaleString()}
                      </span>
                    </div>

                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 12,
                      fontSize: 14
                    }}>
                      <span style={{ fontWeight: 500 }}>Pago mensual:</span>
                      <span style={{ fontWeight: 500 }}>
                        ${selectedLoan.monthlyPayment.toLocaleString()}/mes
                      </span>
                    </div>

                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingTop: 12,
                      borderTop: "2px solid #e5e7eb",
                      fontSize: 14
                    }}>
                      <span style={{ fontWeight: 500 }}>Tu efectivo actual:</span>
                      <span style={{ fontWeight: 500, color: player.cashOnHand >= selectedLoan.remainingBalance ? "#10b981" : "#ef4444" }}>
                        ${player.cashOnHand.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Warning or Benefit */}
                  {player.cashOnHand >= selectedLoan.remainingBalance ? (
                    <div style={{
                      background: "#ecfdf5",
                      borderRadius: 12,
                      padding: 16,
                      marginBottom: 20,
                      border: "1px solid #10b981"
                    }}>
                      <div style={{
                        fontSize: 13,
                        color: "#065f46"
                      }}>
                        ✅ <strong>Beneficio:</strong> Al pagar este préstamo, tus gastos mensuales
                        disminuirán ${selectedLoan.monthlyPayment.toLocaleString()}, mejorando tu cash flow.
                      </div>
                    </div>
                  ) : (
                    <div style={{
                      background: "#fef2f2",
                      borderRadius: 12,
                      padding: 16,
                      marginBottom: 20,
                      border: "1px solid #ef4444"
                    }}>
                      <div style={{
                        fontSize: 13,
                        color: "#991b1b"
                      }}>
                        ❌ <strong>Fondos insuficientes:</strong> Necesitas $
                        {(selectedLoan.remainingBalance - player.cashOnHand).toLocaleString()} más para pagar este préstamo.
                      </div>
                    </div>
                  )}

                  <div style={{
                    display: "flex",
                    gap: 12
                  }}>
                    <button
                      onClick={payOffLoan}
                      disabled={actionInProgress || player.cashOnHand < selectedLoan.remainingBalance}
                      style={{
                        flex: 1,
                        padding: "14px",
                        background: (actionInProgress || player.cashOnHand < selectedLoan.remainingBalance)
                          ? "#ccc"
                          : "linear-gradient(135deg, #10b981, #059669)",
                        color: "white",
                        border: "none",
                        borderRadius: 12,
                        fontSize: 16,
                        fontWeight: 500,
                        cursor: (actionInProgress || player.cashOnHand < selectedLoan.remainingBalance) ? "not-allowed" : "pointer",
                                              }}
                    >
                      💰 Pagar ${selectedLoan.remainingBalance.toLocaleString()}
                    </button>

                    <button
                      onClick={closePayOffModal}
                      disabled={actionInProgress}
                      style={{
                        flex: 1,
                        padding: "14px",
                        background: "white",
                        color: "#ef4444",
                        border: "2px solid #ef4444",
                        borderRadius: 12,
                        fontSize: 16,
                        fontWeight: 500,
                        cursor: actionInProgress ? "not-allowed" : "pointer",
                                              }}
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
            <div style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2000,
              padding: 20
            }}>
              <div style={{
                background: "white",
                borderRadius: 20,
                padding: 32,
                maxWidth: 500,
                width: "100%",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)"
              }}>
                <h2 style={{
                  fontSize: 28,
                  fontWeight: 500,
                  margin: "0 0 16px",
                  color: "#333"
                }}>
                  🏦 Préstamo Bancario
                </h2>

                <p style={{
                  fontSize: 14,
                  color: "#666",
                  marginBottom: 20,
                  lineHeight: 1.6
                }}>
                  Solicita un préstamo para comprar inversiones más grandes.
                  El banco cobra 10% de interés anual.
                </p>

                <div style={{
                  background: "#fef3c7",
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 20,
                  border: "1px solid #f59e0b"
                }}>
                  <div style={{
                    fontSize: 13,
                    color: "#92400e"
                  }}>
                    ⚠️ <strong>Recuerda:</strong> Los préstamos aumentan tus gastos mensuales.
                    Solo pide prestado si puedes generar más ingresos con la inversión.
                  </div>
                </div>

                {/* Loan Amount Selector */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{
                    display: "block",
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#333",
                    marginBottom: 12
                  }}>
                    Cantidad del préstamo:
                  </label>

                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: 8,
                    marginBottom: 12
                  }}>
                    {[5000, 10000, 15000, 20000, 30000, 50000].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setLoanAmount(amount)}
                        style={{
                          padding: "10px",
                          background: loanAmount === amount ? "#f59e0b" : "#f3f4f6",
                          color: loanAmount === amount ? "white" : "#333",
                          border: "none",
                          borderRadius: 8,
                          fontSize: 13,
                          fontWeight: 500,
                          cursor: "pointer",
                                                    transition: "all 0.2s"
                        }}
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
                    style={{
                      width: "100%",
                      padding: "14px",
                      border: "2px solid #e5e7eb",
                      borderRadius: 12,
                      fontSize: 18,
                      fontWeight: 500,
                                            textAlign: "center"
                    }}
                  />
                </div>

                {/* Loan Details */}
                <div style={{
                  background: "#f8f9fa",
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 20
                }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 12,
                    fontSize: 14
                  }}>
                    <span style={{ fontWeight: 500 }}>Recibirás:</span>
                    <span style={{ fontWeight: 500, color: "#10b981" }}>
                      ${loanAmount.toLocaleString()}
                    </span>
                  </div>

                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 12,
                    fontSize: 14
                  }}>
                    <span style={{ fontWeight: 500 }}>Interés (10% anual):</span>
                    <span style={{ fontWeight: 500 }}>
                      ${Math.floor(loanAmount * 0.10).toLocaleString()}/año
                    </span>
                  </div>

                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingTop: 12,
                    borderTop: "2px solid #e5e7eb",
                    fontSize: 14
                  }}>
                    <span style={{ fontWeight: 500 }}>Pago mensual:</span>
                    <span style={{ fontWeight: 500, color: "#ef4444" }}>
                      ${Math.floor(loanAmount * 0.10 / 12).toLocaleString()}/mes
                    </span>
                  </div>
                </div>

                <div style={{
                  display: "flex",
                  gap: 12
                }}>
                  <button
                    onClick={takeLoan}
                    disabled={actionInProgress || loanAmount < 1000}
                    style={{
                      flex: 1,
                      padding: "14px",
                      background: (actionInProgress || loanAmount < 1000)
                        ? "#ccc"
                        : "linear-gradient(135deg, #f59e0b, #d97706)",
                      color: "white",
                      border: "none",
                      borderRadius: 12,
                      fontSize: 16,
                      fontWeight: 500,
                      cursor: (actionInProgress || loanAmount < 1000) ? "not-allowed" : "pointer",
                                          }}
                  >
                    💰 Solicitar Préstamo
                  </button>

                  <button
                    onClick={() => setShowLoanModal(false)}
                    disabled={actionInProgress}
                    style={{
                      flex: 1,
                      padding: "14px",
                      background: "white",
                      color: "#ef4444",
                      border: "2px solid #ef4444",
                      borderRadius: 12,
                      fontSize: 16,
                      fontWeight: 500,
                      cursor: actionInProgress ? "not-allowed" : "pointer",
                                          }}
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
              <div style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(0, 0, 0, 0.7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 2000,
                padding: 20
              }}>
                <div style={{
                  background: "white",
                  borderRadius: 20,
                  padding: 32,
                  maxWidth: 500,
                  width: "100%",
                  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)"
                }}>
                  <h2 style={{
                    fontSize: 28,
                    fontWeight: 500,
                    margin: "0 0 16px",
                    color: "#333"
                  }}>
                    {selectedInvestment.opportunityCard.type === "real_estate" && "🏠"}
                    {selectedInvestment.opportunityCard.type === "stock" && "📈"}
                    {selectedInvestment.opportunityCard.type === "business" && "💼"}
                    {selectedInvestment.opportunityCard.type === "limited_partnership" && "🤝"}
                    {" "}
                    Vender {selectedInvestment.opportunityCard.name}
                  </h2>

                  <div style={{
                    background: "#f8f9fa",
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 20
                  }}>
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 12,
                      fontSize: 14
                    }}>
                      <span style={{ fontWeight: 500 }}>Precio de compra:</span>
                      <span style={{ fontWeight: 500 }}>
                        ${selectedInvestment.purchasePrice.toLocaleString()}
                      </span>
                    </div>

                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 12,
                      fontSize: 14
                    }}>
                      <span style={{ fontWeight: 500 }}>Ingreso generado:</span>
                      <span style={{ fontWeight: 500, color: "#10b981" }}>
                        ${selectedInvestment.totalIncomeEarned.toLocaleString()}
                      </span>
                    </div>

                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 12,
                      fontSize: 14,
                      paddingTop: 12,
                      borderTop: "1px solid #e5e7eb"
                    }}>
                      <span style={{ fontWeight: 500 }}>Rango de venta:</span>
                      <span style={{ fontWeight: 500 }}>
                        ${(selectedInvestment.opportunityCard.minSalePrice || 0).toLocaleString()} -
                        ${(selectedInvestment.opportunityCard.maxSalePrice || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Sale Price Selector */}
                  <div style={{ marginBottom: 20 }}>
                    <label style={{
                      display: "block",
                      fontSize: 14,
                      fontWeight: 500,
                      color: "#333",
                      marginBottom: 8
                    }}>
                      Precio de venta:
                    </label>

                    <div style={{
                      display: "flex",
                      gap: 8,
                      marginBottom: 12
                    }}>
                      <button
                        onClick={() => setSalePrice(selectedInvestment.opportunityCard.minSalePrice || selectedInvestment.purchasePrice)}
                        style={{
                          flex: 1,
                          padding: "8px",
                          background: salePrice === selectedInvestment.opportunityCard.minSalePrice ? "#667eea" : "#f3f4f6",
                          color: salePrice === selectedInvestment.opportunityCard.minSalePrice ? "white" : "#333",
                          border: "none",
                          borderRadius: 8,
                          fontSize: 12,
                          fontWeight: 500,
                          cursor: "pointer",
                                                  }}
                      >
                        Mínimo
                      </button>

                      <button
                        onClick={() => {
                          const min = selectedInvestment.opportunityCard.minSalePrice || 0
                          const max = selectedInvestment.opportunityCard.maxSalePrice || 0
                          setSalePrice(Math.floor((min + max) / 2))
                        }}
                        style={{
                          flex: 1,
                          padding: "8px",
                          background: "#f3f4f6",
                          color: "#333",
                          border: "none",
                          borderRadius: 8,
                          fontSize: 12,
                          fontWeight: 500,
                          cursor: "pointer",
                                                  }}
                      >
                        Medio
                      </button>

                      <button
                        onClick={() => setSalePrice(selectedInvestment.opportunityCard.maxSalePrice || selectedInvestment.purchasePrice)}
                        style={{
                          flex: 1,
                          padding: "8px",
                          background: salePrice === selectedInvestment.opportunityCard.maxSalePrice ? "#667eea" : "#f3f4f6",
                          color: salePrice === selectedInvestment.opportunityCard.maxSalePrice ? "white" : "#333",
                          border: "none",
                          borderRadius: 8,
                          fontSize: 12,
                          fontWeight: 500,
                          cursor: "pointer",
                                                  }}
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
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: "2px solid #e5e7eb",
                        borderRadius: 8,
                        fontSize: 16,
                        fontWeight: 500,
                                                textAlign: "center"
                      }}
                    />
                  </div>

                  {/* Profit/Loss Display */}
                  <div style={{
                    background: (salePrice - selectedInvestment.purchasePrice) >= 0 ? "#ecfdf5" : "#fef2f2",
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 20,
                    textAlign: "center"
                  }}>
                    <div style={{
                      fontSize: 14,
                      color: "#666",
                      marginBottom: 4
                    }}>
                      {(salePrice - selectedInvestment.purchasePrice) >= 0 ? "Ganancia" : "Pérdida"}
                    </div>
                    <div style={{
                      fontSize: 32,
                      fontWeight: 500,
                      color: (salePrice - selectedInvestment.purchasePrice) >= 0 ? "#10b981" : "#ef4444"
                    }}>
                      {(salePrice - selectedInvestment.purchasePrice) >= 0 ? "+" : ""}
                      ${(salePrice - selectedInvestment.purchasePrice).toLocaleString()}
                    </div>
                    <div style={{
                      fontSize: 12,
                      color: "#666",
                      marginTop: 4
                    }}>
                      Total recibido: ${(salePrice + selectedInvestment.totalIncomeEarned).toLocaleString()}
                    </div>
                  </div>

                  <div style={{
                    display: "flex",
                    gap: 12
                  }}>
                    <button
                      onClick={sellInvestment}
                      disabled={actionInProgress}
                      style={{
                        flex: 1,
                        padding: "14px",
                        background: actionInProgress
                          ? "#ccc"
                          : "linear-gradient(135deg, #10b981, #059669)",
                        color: "white",
                        border: "none",
                        borderRadius: 12,
                        fontSize: 16,
                        fontWeight: 500,
                        cursor: actionInProgress ? "not-allowed" : "pointer",
                                              }}
                    >
                      💰 Vender
                    </button>

                    <button
                      onClick={closeSellModal}
                      disabled={actionInProgress}
                      style={{
                        flex: 1,
                        padding: "14px",
                        background: "white",
                        color: "#ef4444",
                        border: "2px solid #ef4444",
                        borderRadius: 12,
                        fontSize: 16,
                        fontWeight: 500,
                        cursor: actionInProgress ? "not-allowed" : "pointer",
                                              }}
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
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.9)",
            backdropFilter: "blur(20px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 5000,
            padding: 20
          }}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{
                background: "white",
                borderRadius: "32px",
                padding: "60px 40px",
                maxWidth: 600,
                width: "100%",
                boxShadow: "0 40px 100px rgba(0,0,0,0.5)",
                textAlign: "center",
                position: "relative",
                overflow: "hidden"
              }}
            >
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 8,
                background: "linear-gradient(90deg, #10b981, #3b82f6)"
              }} />

              <div style={{ fontSize: 80, marginBottom: 24 }}>🏆</div>

              <h2 style={{
                fontSize: 42,
                fontWeight: 500,
                color: "#1e293b",
                margin: "0 0 16px",
                              }}>
                ¡LIBERTAD FINANCIERA!
              </h2>

              <p style={{
                fontSize: 18,
                color: "#64748b",
                lineHeight: 1.8,
                marginBottom: 40
              }}>
                Has logrado que tu <strong style={{ color: "#10b981" }}>ingreso pasivo</strong> sea mayor que tus gastos.
                ¡Oficialmente has salido de la carrera de ratas y eres financieramente libre!
              </p>

              <div style={{
                background: "#f0fdf4",
                borderRadius: 24,
                padding: 32,
                marginBottom: 40,
                border: "2px solid #bbf7d0"
              }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "#059669", textTransform: "uppercase", marginBottom: 4 }}>Ingreso Pasivo</div>
                    <div style={{ fontSize: 24, fontWeight: 500, color: "#064e3b" }}>${player.passiveIncome.toLocaleString()}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "#ef4444", textTransform: "uppercase", marginBottom: 4 }}>Gastos Totales</div>
                    <div style={{ fontSize: 24, fontWeight: 500, color: "#7f1d1d" }}>${totalExpenses.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowWinScreen(false)}
                style={{
                  width: "100%",
                  padding: "18px",
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  color: "white",
                  border: "none",
                  borderRadius: "16px",
                  fontSize: 18,
                  fontWeight: 500,
                  cursor: "pointer",
                  boxShadow: "0 10px 30px rgba(16, 185, 129, 0.4)",
                                  }}
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


