import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth/api-auth"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  try {
    const authResult = await requireAuth(request)
    if (!authResult.success) {
      return authResult.response
    }
    const { user } = authResult.data

    const { gameId } = await params
    const parsedGameId = parseInt(gameId)

    // Get game session
    const gameSession = await prisma.gameSession.findUnique({
      where: { id: parsedGameId }
    })

    if (!gameSession || gameSession.userId !== user.id) {
      return NextResponse.json(
        { error: "Game not found" },
        { status: 404 }
      )
    }

    // Get player with profession, investments, liabilities, and doodads
    const player = await prisma.player.findFirst({
      where: {
        gameSessionId: parsedGameId,
        userId: user.id
      },
      include: {
        profession: true,
        playerInvestments: {
          where: { isSold: false },
          include: { opportunityCard: true }
        },
        playerLiabilities: {
          where: { isPaidOff: false }
        },
        playerDoodads: true
      }
    })

    if (!player || !player.profession) {
      return NextResponse.json(
        { error: "Player not found" },
        { status: 404 }
      )
    }

    // Transform investments to camelCase
    const investments = player.playerInvestments.map(inv => ({
      id: inv.id,
      purchasePrice: inv.purchasePrice,
      downPaymentPaid: inv.downPaymentPaid,
      currentCashFlow: inv.currentCashFlow,
      purchasedAt: inv.purchasedAt,
      totalIncomeEarned: inv.totalIncomeEarned,
      opportunityCard: {
        id: inv.opportunityCard.id,
        name: inv.opportunityCard.name,
        type: inv.opportunityCard.type,
        minSalePrice: inv.opportunityCard.minSalePrice,
        maxSalePrice: inv.opportunityCard.maxSalePrice
      }
    }))

    // Transform liabilities to camelCase
    const liabilities = player.playerLiabilities.map(lib => ({
      id: lib.id,
      type: lib.type,
      description: lib.description,
      principalAmount: lib.principalAmount,
      remainingBalance: lib.remainingBalance,
      monthlyPayment: lib.monthlyPayment,
      interestRate: lib.interestRate
    }))

    // Transform doodads to camelCase
    const doodads = player.playerDoodads.map(doodad => ({
      id: doodad.id,
      name: doodad.name,
      description: doodad.description,
      cost: doodad.cost,
      purchasedAt: doodad.purchasedAt
    }))

    // Transform to camelCase for frontend
    const profession = player.profession
    
    return NextResponse.json({
      id: gameSession.id,
      status: gameSession.status,
      currentPhase: gameSession.currentPhase,
      totalTurns: gameSession.totalTurns,
      player: {
        id: player.id,
        cashOnHand: player.cashOnHand,
        savings: player.savings,
        numChildren: player.numChildren,
        currentTurn: player.currentTurn,
        currentPosition: player.currentPosition ?? 0,
        passiveIncome: player.passiveIncome,
        totalIncome: player.totalIncome,
        totalExpenses: player.totalExpenses,
        cashFlow: player.cashFlow,
        hasEscapedRatRace: player.hasEscapedRatRace,
        isOnFastTrack: player.isOnFastTrack,
        profession: {
          id: profession.id,
          name: profession.name,
          description: profession.description,
          salary: profession.salary,
          taxes: profession.taxes,
          homeMortgagePayment: profession.homeMortgagePayment,
          schoolLoanPayment: profession.schoolLoanPayment,
          carLoanPayment: profession.carLoanPayment,
          creditCardPayment: profession.creditCardPayment,
          retailPayment: profession.retailPayment,
          otherExpenses: profession.otherExpenses,
          childExpense: profession.childExpense,
          homeMortgage: profession.homeMortgage,
          schoolLoans: profession.schoolLoans,
          carLoans: profession.carLoans,
          creditCards: profession.creditCards,
          retailDebt: profession.retailDebt,
          startingCash: profession.startingCash,
          startingSavings: profession.startingSavings
        },
        investments: investments,
        liabilities: liabilities,
        doodads: doodads
      }
    })

  } catch (error) {
    console.error("Error fetching game state:", error)
    return NextResponse.json(
      { error: "Failed to fetch game state" },
      { status: 500 }
    )
  }
}

