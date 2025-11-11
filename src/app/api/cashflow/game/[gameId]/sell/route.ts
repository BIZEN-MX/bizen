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

    const { investmentId, salePrice } = await request.json()
    const gameId = parseInt(params.gameId)

    // Verify game belongs to user
    const gameSession = await prisma.gameSession.findUnique({
      where: { id: gameId },
      include: {
        players: {
          where: { userId: user.id }
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

    // Get the investment
    const investment = await prisma.playerInvestment.findUnique({
      where: { id: investmentId },
      include: {
        opportunityCard: true
      }
    })

    if (!investment || investment.playerId !== player.id) {
      return NextResponse.json(
        { error: "Investment not found" },
        { status: 404 }
      )
    }

    if (investment.isSold) {
      return NextResponse.json(
        { error: "Investment already sold" },
        { status: 400 }
      )
    }

    // Validate sale price is within range
    const minPrice = investment.opportunityCard.minSalePrice || 0
    const maxPrice = investment.opportunityCard.maxSalePrice || investment.purchasePrice

    if (salePrice < minPrice || salePrice > maxPrice) {
      return NextResponse.json(
        { error: "Sale price out of range" },
        { status: 400 }
      )
    }

    // Calculate profit/loss
    const capitalGain = salePrice - investment.purchasePrice
    const totalReturn = salePrice + investment.totalIncomeEarned

    // Mark investment as sold
    await prisma.playerInvestment.update({
      where: { id: investmentId },
      data: {
        isSold: true,
        soldAt: new Date(),
        salePrice
      }
    })

    // Calculate new passive income (subtract this investment's cash flow)
    const newPassiveIncome = player.passiveIncome - (investment.currentCashFlow || 0)

    // Update player cash and passive income
    const updatedPlayer = await prisma.player.update({
      where: { id: player.id },
      data: {
        cashOnHand: player.cashOnHand + salePrice,
        passiveIncome: newPassiveIncome
      }
    })

    // Log sale event
    await prisma.gameEvent.create({
      data: {
        gameSessionId: gameId,
        playerId: player.id,
        eventType: "investment_sold",
        eventData: {
          investmentId: investment.id,
          investmentName: investment.opportunityCard.name,
          investmentType: investment.opportunityCard.type,
          purchasePrice: investment.purchasePrice,
          salePrice,
          capitalGain,
          totalIncomeEarned: investment.totalIncomeEarned,
          totalReturn
        },
        cashChange: salePrice,
        cashFlowChange: -(investment.currentCashFlow || 0),
        turnNumber: player.currentTurn
      }
    })

    return NextResponse.json({
      message: "Investment sold successfully",
      salePrice,
      capitalGain,
      totalReturn,
      newCash: updatedPlayer.cashOnHand,
      newPassiveIncome
    })

  } catch (error) {
    console.error("Error selling investment:", error)
    return NextResponse.json(
      { error: "Failed to sell investment" },
      { status: 500 }
    )
  }
}

