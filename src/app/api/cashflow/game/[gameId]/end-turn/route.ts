import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth/api-auth"

export async function POST(
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

    // Get player with profession and active investments/liabilities
    const player = await prisma.player.findFirst({
      where: { gameSessionId: parsedGameId, userId: user.id },
      include: {
        profession: true,
        playerInvestments: { where: { isSold: false } },
        playerLiabilities: { where: { isPaidOff: false } }
      }
    })

    if (!player || !player.profession) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 })
    }

    // Calculate investment income
    const investmentIncome = player.playerInvestments.reduce(
      (sum, inv) => sum + (inv.currentCashFlow || 0), 0
    )

    // Calculate additional loan payments
    const loanPayments = player.playerLiabilities.reduce(
      (sum, l) => sum + l.monthlyPayment, 0
    )

    const profession = player.profession
    const totalExpenses =
      profession.taxes +
      profession.homeMortgagePayment +
      profession.schoolLoanPayment +
      profession.carLoanPayment +
      profession.creditCardPayment +
      profession.retailPayment +
      profession.otherExpenses +
      (profession.childExpense * (player.numChildren || 0)) +
      loanPayments

    const totalIncome = profession.salary + investmentIncome
    const monthlyCashFlow = totalIncome - totalExpenses
    const newTurn = (player.currentTurn || 1) + 1

    await prisma.$transaction(async (tx) => {
      // Update player financials
      await tx.player.update({
        where: { id: player.id },
        data: {
          cashOnHand: player.cashOnHand + monthlyCashFlow,
          currentTurn: newTurn,
          passiveIncome: investmentIncome,
          totalIncome: totalIncome,
          totalExpenses: totalExpenses,
          cashFlow: monthlyCashFlow
        }
      })

      // Update game session activity
      await tx.gameSession.update({
        where: { id: parsedGameId },
        data: {
          totalTurns: newTurn,
          lastActivityAt: new Date()
        }
      })

      // Log turn end event
      await tx.gameEvent.create({
        data: {
          gameSessionId: parsedGameId,
          playerId: player.id,
          eventType: "turn_ended",
          eventData: {
            salary: profession.salary,
            investmentIncome,
            totalExpenses,
            cashFlow: monthlyCashFlow
          },
          cashChange: monthlyCashFlow,
          turnNumber: newTurn
        }
      })
    })

    return NextResponse.json({
      message: "Turn ended successfully",
      newCash: player.cashOnHand + monthlyCashFlow,
      cashFlow: monthlyCashFlow,
      newTurn
    })

  } catch (error) {
    console.error("Error ending turn:", error)
    return NextResponse.json({ error: "Failed to end turn" }, { status: 500 })
  }
}
