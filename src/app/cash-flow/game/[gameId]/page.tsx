"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter, useParams } from "next/navigation"
import GameBoard from "@/components/cashflow/GameBoard"
import { useCashflowSounds } from "@/hooks/useCashflowSounds"

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
  const { user, loading } = useAuth()
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
    maxWidth: 520,
    background: "white",
    borderRadius: 20,
    padding: 32,
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)"
  }

  const modalTitleStyle: React.CSSProperties = {
    fontSize: 28,
    fontWeight: 900,
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

  const modalInfoLabelStyle: React.CSSProperties = { fontWeight: 600 }
  const modalInfoValueStyle: React.CSSProperties = { fontWeight: 700 }

  const modalActionsStyle: React.CSSProperties = { display: "flex", gap: 12 }
  const modalPrimaryButtonStyle: React.CSSProperties = {
    flex: 1,
    padding: "14px",
    background: "linear-gradient(135deg, #10b981, #059669)",
    color: "white",
    border: "none",
    borderRadius: 12,
    fontSize: 16,
    fontWeight: 700,
    fontFamily: "'Montserrat', sans-serif"
  }
  const modalSecondaryButtonStyle: React.CSSProperties = {
    flex: 1,
    padding: "14px",
    background: "white",
    border: "2px solid #ef4444",
    borderRadius: 12,
    fontSize: 16,
    fontWeight: 700,
    fontFamily: "'Montserrat', sans-serif"
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
    const updateIsMobile = () => {
      setIsMobile(window.innerWidth <= 767)
    }
    updateIsMobile()
    window.addEventListener("resize", updateIsMobile)
    return () => window.removeEventListener("resize", updateIsMobile)
  }, [])

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
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
    if (gameState?.player.passiveIncome >= 50000 && gameState.player.isOnFastTrack) {
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
      <div style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #E0F2FE 0%, #DBEAFE 50%, #BFDBFE 100%)"
      }}>
        <div style={{ color: "#333", fontSize: 24, fontWeight: 700 }}>
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
    <div style={modalOverlayStyle}>
      <div style={modalCardStyle}>
        <h2 style={modalTitleStyle}>
          {currentCard?.type === "real_estate" && "🏠"}
          {currentCard?.type === "stock" && "📈"}
          {currentCard?.type === "business" && "💼"}
          {currentCard?.type === "limited_partnership" && "🤝"}{" "}
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
            💰 Comprar
          </button>
          <button
            onClick={passCard}
            disabled={actionInProgress}
            style={{
              ...modalSecondaryButtonStyle,
              cursor: actionInProgress ? "not-allowed" : "pointer"
            }}
          >
            ❌ Pasar
          </button>
        </div>
      </div>
    </div>
  )

  const renderDoodadModal = () => (
    <div style={modalOverlayStyle}>
      <div style={modalCardStyle}>
        <h2 style={modalTitleStyle}>
          {currentDoodad?.category === "toys" && "🎮"}
          {currentDoodad?.category === "entertainment" && "🎬"}
          {currentDoodad?.category === "fashion" && "👔"}
          {currentDoodad?.category === "travel" && "✈️"}
          {currentDoodad?.category === "food" && "🍽️"}
          {!currentDoodad?.category && "💎"} {currentDoodad?.name}
        </h2>
        <p style={modalDescriptionStyle}>{currentDoodad?.description}</p>
        <div style={warningBoxStyle}>
          <div style={warningTextStyle}>
            ⚠️ <strong>ADVERTENCIA:</strong> Este es un gasto de lujo que NO genera ningún ingreso.
          </div>
          <div style={warningQuoteStyle}>
            "Los pobres y la clase media compran lujos primero. Los ricos compran activos primero." - Robert Kiyosaki
          </div>
        </div>
        <div style={{ ...modalInfoBoxStyle, textAlign: "center" as const }}>
          <div style={{ fontSize: 14, color: "#666", marginBottom: 4 }}>
            Costo
          </div>
          <div style={{ fontSize: 36, fontWeight: 900, color: "#ef4444" }}>
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
            ✅ Pasar (Decisión Inteligente)
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
            💸 Comprar (Mala Idea)
          </button>
        </div>
      </div>
    </div>
  )
  return (
    <>
      <style>{`
        .cashflow-game-container {
          width: 100% !important;
          max-width: 100% !important;
        }
        .cashflow-game-main {
          width: 100% !important;
          max-width: 100% !important;
        }
        @media (max-width: 767px) {
          .cashflow-game-container {
            width: 100% !important;
            max-width: 100% !important;
          }
          .cashflow-game-main {
            padding: clamp(8px, 2vw, 16px) !important;
            padding-bottom: calc(140px + max(env(safe-area-inset-bottom), 0px)) !important;
            width: 100% !important;
            max-width: 100% !important;
            overflow-x: hidden !important;
          }
          .game-board-container {
            width: 100% !important;
            max-width: 100% !important;
            overflow-x: visible !important;
            overflow-y: visible !important;
            padding: clamp(4px, 1vw, 12px) !important;
            margin: 0 auto !important;
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
          }
          .cashflow-game-main {
            width: 100% !important;
            max-width: 100% !important;
          }
        }
      `}</style>
      <div style={{
        width: "100%",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #E0F2FE 0%, #DBEAFE 50%, #BFDBFE 100%)",
        fontFamily: "'Montserrat', sans-serif",
        overflowX: "hidden"
      }}>
        <main className="cashflow-game-main" style={{
          width: "100%",
          maxWidth: "100%",
          padding: "clamp(16px, 3vw, 24px)",
          paddingBottom: isMobile ? "140px" : "clamp(40px, 4vw, 80px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          boxSizing: "border-box"
        }}>
        <div className="cashflow-game-container" style={{ 
          width: "100%",
          maxWidth: "100%",
          boxSizing: "border-box"
        }}>
        {/* Header */}
        <div style={{
          background: player.isOnFastTrack 
            ? "linear-gradient(135deg, #fbbf24, #f59e0b)"
            : "white",
          borderRadius: "clamp(12px, 2vw, 16px)",
          padding: "clamp(12px, 2.5vw, 20px) clamp(16px, 3vw, 24px)",
          marginBottom: "clamp(12px, 2vw, 20px)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          border: player.isOnFastTrack ? "3px solid #f59e0b" : "none",
          flexWrap: "wrap",
          gap: "clamp(8px, 2vw, 12px)"
        }}>
          <div style={{ flex: "1 1 auto", minWidth: 0 }}>
            <h1 style={{
              fontSize: "clamp(20px, 4vw, 28px)",
              fontWeight: 900,
              margin: 0,
              color: player.isOnFastTrack ? "#f59e0b" : "#2563eb",
              lineHeight: 1.2
            }}>
              {player.isOnFastTrack ? "⚡ FAST TRACK" : "CASHFLOW"}
            </h1>
            <div style={{ 
              fontSize: "clamp(11px, 2.5vw, 14px)", 
              color: player.isOnFastTrack ? "#78350f" : "#666", 
              marginTop: 4,
              fontWeight: player.isOnFastTrack ? 700 : 400,
              lineHeight: 1.4,
              wordBreak: "break-word"
            }}>
              {player.profession.name} • Turno {player.currentTurn}
              {player.isOnFastTrack && ` • Meta: $50K ingreso pasivo`}
            </div>
          </div>
          
          <div style={{
            display: "flex",
            gap: "clamp(8px, 2vw, 16px)",
            alignItems: "center",
            flexShrink: 0
          }}>
            <button
              onClick={openHelp}
              style={{
                padding: "clamp(6px, 1.5vw, 8px) clamp(12px, 2.5vw, 16px)",
                background: "#eff6ff",
                color: "#2563eb",
                border: "1px solid #3b82f6",
                borderRadius: "clamp(8px, 1.5vw, 12px)",
                fontSize: "clamp(11px, 2.5vw, 14px)",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "'Montserrat', sans-serif",
                transition: "all 0.2s",
                whiteSpace: "nowrap"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#dbeafe"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#eff6ff"
              }}
            >
              ❓ Ayuda
            </button>
            
            <div style={{
              background: player.isOnFastTrack
                ? "linear-gradient(135deg, #fbbf24, #f59e0b)"
                : player.hasEscapedRatRace 
                  ? "linear-gradient(135deg, #10b981, #059669)" 
                  : "#f3f4f6",
              padding: "clamp(6px, 1.5vw, 8px) clamp(12px, 2.5vw, 16px)",
              borderRadius: "clamp(8px, 1.5vw, 12px)",
              fontWeight: 700,
              fontSize: "clamp(11px, 2.5vw, 14px)",
              color: (player.hasEscapedRatRace || player.isOnFastTrack) ? "white" : "#666",
              whiteSpace: "nowrap"
            }}>
              {player.isOnFastTrack 
                ? "⚡ Fast Track" 
                : player.hasEscapedRatRace 
                  ? "🎉 ¡Libre!" 
                  : "🏃 Carrera de Ratas"}
            </div>
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: "clamp(12px, 2.5vw, 20px)",
          marginBottom: "clamp(12px, 2.5vw, 20px)"
        }}>
          {/* Financial Statement */}
          <div style={{
            background: "white",
            borderRadius: "clamp(12px, 2vw, 16px)",
            padding: "clamp(16px, 3vw, 24px)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
          }}>
            <h2 style={{
              fontSize: "clamp(16px, 3vw, 20px)",
              fontWeight: 800,
              margin: "0 0 clamp(12px, 2vw, 16px)",
              color: "#333"
            }}>
              Estado Financiero
            </h2>

            {/* Income */}
            <div style={{
              background: "#ecfdf5",
              borderRadius: "clamp(8px, 1.5vw, 12px)",
              padding: "clamp(12px, 2vw, 16px)",
              marginBottom: "clamp(12px, 2vw, 16px)"
            }}>
              <div style={{
                fontSize: "clamp(12px, 2.5vw, 14px)",
                fontWeight: 700,
                color: "#059669",
                marginBottom: "clamp(8px, 1.5vw, 12px)"
              }}>
                INGRESOS
              </div>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "clamp(6px, 1vw, 8px)",
                fontSize: "clamp(12px, 2.5vw, 14px)"
              }}>
                <span>Salario:</span>
                <span style={{ fontWeight: 700 }}>
                  ${player.profession.salary.toLocaleString()}
                </span>
              </div>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "clamp(6px, 1vw, 8px)",
                fontSize: "clamp(12px, 2.5vw, 14px)"
              }}>
                <span>Ingreso Pasivo:</span>
                <span style={{ fontWeight: 700, color: "#10b981" }}>
                  ${player.passiveIncome.toLocaleString()}
                </span>
              </div>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                paddingTop: "clamp(8px, 1.5vw, 12px)",
                borderTop: "2px solid #059669",
                fontSize: "clamp(14px, 2.5vw, 16px)",
                fontWeight: 800
              }}>
                <span>Total:</span>
                <span>${totalIncome.toLocaleString()}</span>
              </div>
            </div>

            {/* Expenses */}
            <div style={{
              background: "#fef2f2",
              borderRadius: "clamp(8px, 1.5vw, 12px)",
              padding: "clamp(12px, 2vw, 16px)",
              marginBottom: "clamp(12px, 2vw, 16px)"
            }}>
              <div style={{
                fontSize: "clamp(12px, 2.5vw, 14px)",
                fontWeight: 700,
                color: "#dc2626",
                marginBottom: "clamp(8px, 1.5vw, 12px)"
              }}>
                GASTOS
              </div>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "clamp(4px, 1vw, 6px)",
                fontSize: "clamp(11px, 2.3vw, 13px)"
              }}>
                <span>Impuestos:</span>
                <span>${player.profession.taxes.toLocaleString()}</span>
              </div>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "clamp(4px, 1vw, 6px)",
                fontSize: "clamp(11px, 2.3vw, 13px)"
              }}>
                <span>Hipoteca:</span>
                <span>${player.profession.homeMortgagePayment.toLocaleString()}</span>
              </div>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "clamp(4px, 1vw, 6px)",
                fontSize: "clamp(11px, 2.3vw, 13px)"
              }}>
                <span>Préstamos escolares:</span>
                <span>${player.profession.schoolLoanPayment.toLocaleString()}</span>
              </div>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "clamp(4px, 1vw, 6px)",
                fontSize: "clamp(11px, 2.3vw, 13px)"
              }}>
                <span>Préstamo auto:</span>
                <span>${player.profession.carLoanPayment.toLocaleString()}</span>
              </div>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "clamp(4px, 1vw, 6px)",
                fontSize: "clamp(11px, 2.3vw, 13px)"
              }}>
                <span>Tarjetas crédito:</span>
                <span>${player.profession.creditCardPayment.toLocaleString()}</span>
              </div>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "clamp(4px, 1vw, 6px)",
                fontSize: "clamp(11px, 2.3vw, 13px)"
              }}>
                <span>Otros gastos:</span>
                <span>${player.profession.otherExpenses.toLocaleString()}</span>
              </div>
              {player.numChildren > 0 && (
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "clamp(4px, 1vw, 6px)",
                  fontSize: "clamp(11px, 2.3vw, 13px)"
                }}>
                  <span>Hijos ({player.numChildren}):</span>
                  <span>${(player.profession.childExpense * player.numChildren).toLocaleString()}</span>
                </div>
              )}
              {player.liabilities && player.liabilities.length > 0 && (
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "clamp(4px, 1vw, 6px)",
                  fontSize: "clamp(11px, 2.3vw, 13px)"
                }}>
                  <span>Préstamos bancarios ({player.liabilities.length}):</span>
                  <span>${loanPayments.toLocaleString()}</span>
                </div>
              )}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                paddingTop: "clamp(8px, 1.5vw, 12px)",
                borderTop: "2px solid #dc2626",
                fontSize: "clamp(14px, 2.5vw, 16px)",
                fontWeight: 800
              }}>
                <span>Total:</span>
                <span>${totalExpenses.toLocaleString()}</span>
              </div>
            </div>

            {/* Cash Flow */}
            <div style={{
              background: cashFlow > 0 
                ? "linear-gradient(135deg, #10b981, #059669)" 
                : "linear-gradient(135deg, #ef4444, #dc2626)",
              borderRadius: "clamp(8px, 1.5vw, 12px)",
              padding: "clamp(12px, 2vw, 16px)",
              color: "white"
            }}>
              <div style={{
                fontSize: "clamp(11px, 2.5vw, 14px)",
                fontWeight: 700,
                marginBottom: "clamp(6px, 1vw, 8px)",
                opacity: 0.9
              }}>
                FLUJO DE EFECTIVO MENSUAL
              </div>
              <div style={{
                fontSize: "clamp(24px, 5vw, 32px)",
                fontWeight: 900
              }}>
                ${cashFlow.toLocaleString()}
              </div>
            </div>

            {/* Active Loans */}
            {player.liabilities && player.liabilities.length > 0 && (
              <div style={{
                marginTop: "clamp(12px, 2vw, 16px)"
              }}>
                <h3 style={{
                  fontSize: "clamp(14px, 2.5vw, 16px)",
                  fontWeight: 800,
                  margin: "0 0 clamp(8px, 1.5vw, 12px)",
                  color: "#333"
                }}>
                  💳 Préstamos Activos
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {player.liabilities.map((loan) => (
                    <div
                      key={loan.id}
                      onClick={() => openPayOffModal(loan)}
                      style={{
                        background: "#fef2f2",
                        borderRadius: 8,
                        padding: 12,
                        cursor: "pointer",
                        transition: "all 0.2s",
                        border: "1px solid #fecaca"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#fee2e2"
                        e.currentTarget.style.borderColor = "#ef4444"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#fef2f2"
                        e.currentTarget.style.borderColor = "#fecaca"
                      }}
                    >
                      <div style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#333",
                        marginBottom: 4
                      }}>
                        🏦 {loan.description}
                      </div>
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 11,
                        color: "#666"
                      }}>
                        <span>Saldo: ${loan.remainingBalance.toLocaleString()}</span>
                        <span style={{ fontWeight: 700, color: "#ef4444" }}>
                          ${loan.monthlyPayment.toLocaleString()}/mes
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Assets & Cash */}
          <div style={{
            background: "white",
            borderRadius: "clamp(12px, 2vw, 16px)",
            padding: "clamp(16px, 3vw, 24px)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
          }}>
            <h2 style={{
              fontSize: "clamp(16px, 3vw, 20px)",
              fontWeight: 800,
              margin: "0 0 clamp(12px, 2vw, 16px)",
              color: "#333"
            }}>
              Activos
            </h2>

            <div style={{
              background: "#f0fdf4",
              borderRadius: "clamp(8px, 1.5vw, 12px)",
              padding: "clamp(16px, 2.5vw, 20px)",
              marginBottom: "clamp(12px, 2vw, 16px)",
              textAlign: "center"
            }}>
              <div style={{
                fontSize: "clamp(12px, 2.5vw, 14px)",
                color: "#059669",
                fontWeight: 700,
                marginBottom: "clamp(6px, 1vw, 8px)"
              }}>
                EFECTIVO
              </div>
              <div style={{
                fontSize: "clamp(28px, 6vw, 36px)",
                fontWeight: 900,
                color: "#10b981"
              }}>
                ${player.cashOnHand.toLocaleString()}
              </div>
            </div>

            <div style={{
              background: "#fefce8",
              borderRadius: "clamp(8px, 1.5vw, 12px)",
              padding: "clamp(16px, 2.5vw, 20px)",
              marginBottom: "clamp(12px, 2vw, 16px)",
              textAlign: "center"
            }}>
              <div style={{
                fontSize: "clamp(12px, 2.5vw, 14px)",
                color: "#ca8a04",
                fontWeight: 700,
                marginBottom: "clamp(6px, 1vw, 8px)"
              }}>
                AHORROS
              </div>
              <div style={{
                fontSize: "clamp(22px, 5vw, 28px)",
                fontWeight: 900,
                color: "#eab308"
              }}>
                ${player.savings.toLocaleString()}
              </div>
            </div>

            <div style={{
              background: "#eff6ff",
              borderRadius: "clamp(8px, 1.5vw, 12px)",
              padding: "clamp(12px, 2vw, 16px)",
              maxHeight: "clamp(250px, 50vh, 300px)",
              overflowY: "auto"
            }}>
              <div style={{
                fontSize: "clamp(12px, 2.5vw, 14px)",
                fontWeight: 700,
                color: "#2563eb",
                marginBottom: "clamp(8px, 1.5vw, 12px)"
              }}>
                INVERSIONES ({player.investments?.length || 0})
              </div>
              
              {!player.investments || player.investments.length === 0 ? (
                <div style={{ 
                  fontSize: 14, 
                  color: "#666",
                  textAlign: "center",
                  padding: "20px 0"
                }}>
                  No tienes inversiones aún.<br/>
                  ¡Saca una carta para comenzar!
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {player.investments.map((inv) => {
                    const profit = (inv.opportunityCard.minSalePrice || 0) - inv.purchasePrice
                    const profitPercent = ((profit / inv.purchasePrice) * 100).toFixed(1)
                    
                    return (
                      <div
                        key={inv.id}
                        onClick={() => openSellModal(inv)}
                        style={{
                          background: "white",
                          borderRadius: 8,
                          padding: 12,
                          cursor: "pointer",
                          transition: "all 0.2s",
                          border: "1px solid #e5e7eb"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#f9fafb"
                          e.currentTarget.style.borderColor = "#2563eb"
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "white"
                          e.currentTarget.style.borderColor = "#e5e7eb"
                        }}
                      >
                        <div style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#333",
                          marginBottom: 4,
                          display: "flex",
                          alignItems: "center",
                          gap: 4
                        }}>
                          {inv.opportunityCard.type === "real_estate" && "🏠"}
                          {inv.opportunityCard.type === "stock" && "📈"}
                          {inv.opportunityCard.type === "business" && "💼"}
                          {inv.opportunityCard.type === "limited_partnership" && "🤝"}
                          <span>{inv.opportunityCard.name}</span>
                        </div>
                        
                        <div style={{
                          fontSize: 11,
                          color: "#666",
                          marginBottom: 4
                        }}>
                          Flujo: <span style={{
                            fontWeight: 700,
                            color: (inv.currentCashFlow || 0) > 0 ? "#10b981" : "#666"
                          }}>
                            ${(inv.currentCashFlow || 0).toLocaleString()}/mes
                          </span>
                        </div>
                        
                        <div style={{
                          fontSize: 11,
                          color: "#666",
                          display: "flex",
                          justifyContent: "space-between"
                        }}>
                          <span>Compra: ${inv.purchasePrice.toLocaleString()}</span>
                          <span style={{
                            color: profit >= 0 ? "#10b981" : "#ef4444",
                            fontWeight: 600
                          }}>
                            {profit >= 0 ? "+" : ""}{profitPercent}%
                          </span>
                        </div>
                        
                        <div style={{
                          fontSize: 10,
                          color: "#999",
                          marginTop: 4
                        }}>
                          Ganado: ${inv.totalIncomeEarned.toLocaleString()}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
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
                  fontWeight: 700,
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
                      <span style={{ fontWeight: 700, color: "#ef4444" }}>
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
                  fontWeight: 700,
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
          </div>
        </div>

        {/* Game Board */}
        <div className="game-board-container" style={{
          width: "100%",
          maxWidth: "100%",
          overflowX: "auto",
          overflowY: "visible",
          padding: "clamp(8px, 1.5vw, 16px)",
          boxSizing: "border-box"
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

        {/* Quick Actions */}
        <div style={{
          background: "white",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          textAlign: "center"
        }}>
          <h2 style={{
            fontSize: 18,
            fontWeight: 800,
            margin: "0 0 16px",
            color: "#333"
          }}>
            Acciones Rápidas
          </h2>

          <div style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap"
          }}>
            <button
              onClick={() => setShowLoanModal(true)}
              disabled={actionInProgress}
              style={{
                padding: "12px 24px",
                background: actionInProgress 
                  ? "#ccc" 
                  : "linear-gradient(135deg, #f59e0b, #d97706)",
                color: "white",
                border: "none",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 700,
                cursor: actionInProgress ? "not-allowed" : "pointer",
                boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)",
                transition: "all 0.2s ease",
                fontFamily: "'Montserrat', sans-serif"
              }}
            >
              🏦 Préstamo
            </button>

            <button
              onClick={endTurn}
              disabled={actionInProgress}
              style={{
                padding: "12px 24px",
                background: actionInProgress 
                  ? "#ccc" 
                  : "linear-gradient(135deg, #10b981, #059669)",
                color: "white",
                border: "none",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 700,
                cursor: actionInProgress ? "not-allowed" : "pointer",
                boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
                transition: "all 0.2s ease",
                fontFamily: "'Montserrat', sans-serif"
              }}
            >
              ⏭️ Terminar Turno
            </button>
          </div>
          
          <div style={{
            fontSize: 12,
            color: "#666",
            marginTop: 12,
            fontStyle: "italic"
          }}>
            Tira el dado para moverte por el tablero
          </div>
        </div>
        </div>

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
                  fontWeight: 900,
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
                  <br/><br/>
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
                  fontWeight: 900,
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
                  fontWeight: 900,
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
                  fontWeight: 900,
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
                  fontWeight: 900,
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
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: "'Montserrat', sans-serif",
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
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "'Montserrat', sans-serif",
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
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "'Montserrat', sans-serif"
                }}
              >
                Saltar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Card Modal */}
      {showCard && currentCard && renderCardModal()}

      {/* Doodad Modal */}
      {showDoodadModal && currentDoodad && renderDoodadModal()}
      {/* Market Event Modal */}
      {showMarketEvent && marketEventData && (
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
              fontWeight: 900,
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
                fontWeight: 600
              }}>
                {marketEventData.marketEvent.message}
              </p>
              {marketEventData.cashChange !== 0 && (
                <div style={{
                  fontSize: 32,
                  fontWeight: 900,
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
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "'Montserrat', sans-serif"
              }}
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      {/* Pay Off Loan Modal */}
      {showPayOffModal && selectedLoan && (
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
              fontWeight: 900,
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
                <span style={{ fontWeight: 600 }}>Saldo actual:</span>
                <span style={{ fontWeight: 700, color: "#ef4444" }}>
                  ${selectedLoan.remainingBalance.toLocaleString()}
                </span>
              </div>

              <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 12,
                fontSize: 14
              }}>
                <span style={{ fontWeight: 600 }}>Pago mensual:</span>
                <span style={{ fontWeight: 700 }}>
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
                <span style={{ fontWeight: 600 }}>Tu efectivo actual:</span>
                <span style={{ fontWeight: 700, color: player.cashOnHand >= selectedLoan.remainingBalance ? "#10b981" : "#ef4444" }}>
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
                  fontWeight: 700,
                  cursor: (actionInProgress || player.cashOnHand < selectedLoan.remainingBalance) ? "not-allowed" : "pointer",
                  fontFamily: "'Montserrat', sans-serif"
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
                  fontWeight: 700,
                  cursor: actionInProgress ? "not-allowed" : "pointer",
                  fontFamily: "'Montserrat', sans-serif"
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bank Loan Modal */}
      {showLoanModal && (
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
              fontWeight: 900,
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
                fontWeight: 700,
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
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: "'Montserrat', sans-serif",
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
                  fontWeight: 700,
                  fontFamily: "'Montserrat', sans-serif",
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
                <span style={{ fontWeight: 600 }}>Recibirás:</span>
                <span style={{ fontWeight: 700, color: "#10b981" }}>
                  ${loanAmount.toLocaleString()}
                </span>
              </div>

              <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 12,
                fontSize: 14
              }}>
                <span style={{ fontWeight: 600 }}>Interés (10% anual):</span>
                <span style={{ fontWeight: 700 }}>
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
                <span style={{ fontWeight: 600 }}>Pago mensual:</span>
                <span style={{ fontWeight: 700, color: "#ef4444" }}>
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
                  fontWeight: 700,
                  cursor: (actionInProgress || loanAmount < 1000) ? "not-allowed" : "pointer",
                  fontFamily: "'Montserrat', sans-serif"
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
                  fontWeight: 700,
                  cursor: actionInProgress ? "not-allowed" : "pointer",
                  fontFamily: "'Montserrat', sans-serif"
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sell Investment Modal */}
      {showSellModal && selectedInvestment && (
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
              fontWeight: 900,
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
                <span style={{ fontWeight: 600 }}>Precio de compra:</span>
                <span style={{ fontWeight: 700 }}>
                  ${selectedInvestment.purchasePrice.toLocaleString()}
                </span>
              </div>

              <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 12,
                fontSize: 14
              }}>
                <span style={{ fontWeight: 600 }}>Ingreso generado:</span>
                <span style={{ fontWeight: 700, color: "#10b981" }}>
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
                <span style={{ fontWeight: 600 }}>Rango de venta:</span>
                <span style={{ fontWeight: 700 }}>
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
                fontWeight: 700,
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
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "'Montserrat', sans-serif"
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
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "'Montserrat', sans-serif"
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
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "'Montserrat', sans-serif"
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
                  fontWeight: 700,
                  fontFamily: "'Montserrat', sans-serif",
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
                fontWeight: 900,
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
                  fontWeight: 700,
                  cursor: actionInProgress ? "not-allowed" : "pointer",
                  fontFamily: "'Montserrat', sans-serif"
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
                  fontWeight: 700,
                  cursor: actionInProgress ? "not-allowed" : "pointer",
                  fontFamily: "'Montserrat', sans-serif"
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      </main>
    </div>
    </>
  )
}


