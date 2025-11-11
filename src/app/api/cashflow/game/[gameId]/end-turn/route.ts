import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: NextRequest,
  { params }: { params: { gameId: string } }
) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const gameId = parseInt(params.gameId)

    // Get game and player
    const gameSession = await prisma.gameSession.findUnique({
      where: { id: gameId },
      include: {
        players: {
          where: { userId: user.id },
          include: {
            profession: true,
            playerInvestments: {
              where: { isSold: false }
            },
            playerLiabilities: {
              where: { isPaidOff: false }
            }
          }
        }
      }
    })

    if (!gameSession || gameSession.userId !== user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    const player = gameSession.players[0]
    if (!player) {
      return NextResponse.json(
        { error: "Player not found" },
        { status: 404 }
      )
    }

    // Calculate total income from investments
    const investmentIncome = player.playerInvestments.reduce(
      (sum, inv) => sum + (inv.currentCashFlow || 0),
      0
    )

    // Calculate loan payments
    const loanPayments = player.playerLiabilities.reduce(
      (sum, liability) => sum + liability.monthlyPayment,
      0
    )

    // Calculate monthly cash flow
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

    const monthlyCashFlow = player.profession.salary + investmentIncome - totalExpenses

    // Update player for new turn
    const updatedPlayer = await prisma.player.update({
      where: { id: player.id },
      data: {
        currentTurn: player.currentTurn + 1,
        cashOnHand: player.cashOnHand + monthlyCashFlow
      }
    })

    // Update game session total turns
    await prisma.gameSession.update({
      where: { id: gameId },
      data: {
        totalTurns: gameSession.totalTurns + 1,
        lastActivityAt: new Date()
      }
    })

    // Log payday event
    await prisma.gameEvent.create({
      data: {
        gameSessionId: gameId,
        playerId: player.id,
        eventType: "payday",
        eventData: {
          salary: player.profession.salary,
          passiveIncome: investmentIncome,
          expenses: totalExpenses,
          netCashFlow: monthlyCashFlow
        },
        cashChange: monthlyCashFlow,
        turnNumber: player.currentTurn + 1
      }
    })

    // Update investment income totals
    for (const investment of player.playerInvestments) {
      if (investment.currentCashFlow && investment.currentCashFlow > 0) {
        await prisma.playerInvestment.update({
          where: { id: investment.id },
          data: {
            totalIncomeEarned: investment.totalIncomeEarned + investment.currentCashFlow
          }
        })
      }
    }

    return NextResponse.json({
      message: "Turn ended successfully",
      newTurn: updatedPlayer.currentTurn,
      cashReceived: monthlyCashFlow,
      newCash: updatedPlayer.cashOnHand
    })

  } catch (error) {
    console.error("Error ending turn:", error)
    return NextResponse.json(
      { error: "Failed to end turn" },
      { status: 500 }
    )
  }
}

