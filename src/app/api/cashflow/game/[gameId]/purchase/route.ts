import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth/api-auth"
import { awardXp } from "@/lib/rewards"

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

    const body = await request.json()
    const { opportunityCardId } = body
    const { gameId } = await params
    const parsedGameId = parseInt(gameId)

    // Get player with profession
    const player = await prisma.player.findFirst({
      where: { gameSessionId: parsedGameId, userId: user.id },
      include: { profession: true }
    })

    if (!player || !player.profession) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 })
    }

    // Get opportunity card
    const card = await prisma.opportunityCard.findUnique({
      where: { id: parseInt(opportunityCardId) }
    })

    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 })
    }

    const purchaseCost = card.downPayment || card.cost

    if (player.cashOnHand < purchaseCost) {
      return NextResponse.json({ error: "Not enough cash" }, { status: 400 })
    }

    const newPassiveIncome = (player.passiveIncome || 0) + (card.cashFlow || 0)

    // Run in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create investment
      const investment = await tx.playerInvestment.create({
        data: {
          playerId: player.id,
          opportunityCardId: card.id,
          purchasePrice: card.cost,
          downPaymentPaid: card.downPayment,
          mortgageAmount: card.mortgage,
          sharesOwned: card.shares || 1,
          currentCashFlow: card.cashFlow || 0
        }
      })

      // Update player cash and passive income
      const updatedPlayer = await tx.player.update({
        where: { id: player.id },
        data: {
          cashOnHand: player.cashOnHand - purchaseCost,
          passiveIncome: newPassiveIncome
        }
      })

      // Log purchase event
      await tx.gameEvent.create({
        data: {
          gameSessionId: parsedGameId,
          playerId: player.id,
          eventType: "investment_purchased",
          eventData: {
            cardId: card.id,
            cardName: card.name,
            cardType: card.type,
            purchasePrice: card.cost,
            cashFlow: card.cashFlow
          },
          cashChange: -purchaseCost,
          cashFlowChange: card.cashFlow || 0,
          turnNumber: player.currentTurn || 1
        }
      })

      return { investment, updatedPlayer }
    })

    // Check if escaped rat race (outside transaction to avoid nested issues)
    const profession = player.profession
    const totalExpenses =
      profession.taxes +
      profession.homeMortgagePayment +
      profession.schoolLoanPayment +
      profession.carLoanPayment +
      profession.creditCardPayment +
      profession.retailPayment +
      profession.otherExpenses +
      (profession.childExpense * (player.numChildren || 0))

    let rewards = null
    if (newPassiveIncome > totalExpenses && !player.hasEscapedRatRace) {
      await prisma.$transaction(async (tx) => {
        await tx.player.update({
          where: { id: player.id },
          data: {
            hasEscapedRatRace: true,
            isOnFastTrack: true,
            escapedAt: new Date()
          }
        })

        await tx.gameEvent.create({
          data: {
            gameSessionId: parsedGameId,
            playerId: player.id,
            eventType: "escaped_rat_race",
            eventData: { passiveIncome: newPassiveIncome, totalExpenses },
            turnNumber: player.currentTurn || 1
          }
        })
      })

      rewards = await awardXp(user.id, 150)
    }

    return NextResponse.json({
      message: "Investment purchased successfully",
      investment: result.investment,
      newCash: player.cashOnHand - purchaseCost,
      newPassiveIncome,
      rewards
    })

  } catch (error) {
    console.error("Error purchasing investment:", error)
    return NextResponse.json({ error: "Failed to purchase investment" }, { status: 500 })
  }
}
