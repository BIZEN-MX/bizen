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

    const body = await request.json()
    const { investmentId, salePrice } = body
    const { gameId } = await params
    const parsedGameId = parseInt(gameId)

    // Get player
    const player = await prisma.player.findFirst({
      where: { gameSessionId: parsedGameId, userId: user.id }
    })

    if (!player) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 })
    }

    // Get investment with card details
    const investment = await prisma.playerInvestment.findFirst({
      where: { id: parseInt(investmentId), playerId: player.id },
      include: { opportunityCard: true }
    })

    if (!investment || investment.isSold) {
      return NextResponse.json({ error: "Investment not found or already sold" }, { status: 404 })
    }

    const card = investment.opportunityCard
    const minPrice = card.minSalePrice || 0
    const maxPrice = card.maxSalePrice || investment.purchasePrice

    if (salePrice < minPrice || salePrice > maxPrice) {
      return NextResponse.json({ error: "Sale price out of range" }, { status: 400 })
    }

    const profit = salePrice - investment.purchasePrice
    const cashChange = salePrice - (investment.mortgageAmount || 0)
    const newPassiveIncome = Math.max(0, (player.passiveIncome || 0) - (investment.currentCashFlow || 0))

    await prisma.$transaction(async (tx) => {
      // Mark investment as sold
      await tx.playerInvestment.update({
        where: { id: investment.id },
        data: {
          isSold: true,
          soldAt: new Date(),
          salePrice: salePrice
        }
      })

      // Update player cash and passive income
      await tx.player.update({
        where: { id: player.id },
        data: {
          cashOnHand: player.cashOnHand + cashChange,
          passiveIncome: newPassiveIncome
        }
      })

      // Log sale event
      await tx.gameEvent.create({
        data: {
          gameSessionId: parsedGameId,
          playerId: player.id,
          eventType: "investment_sold",
          eventData: {
            investmentId,
            cardName: card.name,
            salePrice,
            profit
          },
          cashChange: cashChange,
          cashFlowChange: -(investment.currentCashFlow || 0),
          turnNumber: player.currentTurn || 1
        }
      })
    })

    return NextResponse.json({
      message: "Investment sold successfully",
      profit,
      newCash: player.cashOnHand + cashChange,
      newPassiveIncome
    })

  } catch (error) {
    console.error("Error selling investment:", error)
    return NextResponse.json({ error: "Failed to sell investment" }, { status: 500 })
  }
}
