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

    const { opportunityCardId } = await request.json()
    const gameId = parseInt(params.gameId)

    // Get game and player
    const gameSession = await prisma.gameSession.findUnique({
      where: { id: gameId },
      include: {
        players: {
          where: { userId: user.id },
          include: {
            profession: true
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

    // Get opportunity card
    const card = await prisma.opportunityCard.findUnique({
      where: { id: opportunityCardId }
    })

    if (!card) {
      return NextResponse.json(
        { error: "Card not found" },
        { status: 404 }
      )
    }

    // Determine purchase cost (down payment for real estate, full cost otherwise)
    const purchaseCost = card.downPayment || card.cost
    
    // Check if player has enough cash
    if (player.cashOnHand < purchaseCost) {
      return NextResponse.json(
        { error: "Not enough cash" },
        { status: 400 }
      )
    }

    // Create investment
    const investment = await prisma.playerInvestment.create({
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

    // Calculate new passive income
    const newPassiveIncome = player.passiveIncome + (card.cashFlow || 0)
    
    // Update player cash and passive income
    const updatedPlayer = await prisma.player.update({
      where: { id: player.id },
      data: {
        cashOnHand: player.cashOnHand - purchaseCost,
        passiveIncome: newPassiveIncome
      }
    })

    // Log purchase event
    await prisma.gameEvent.create({
      data: {
        gameSessionId: gameId,
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
        turnNumber: player.currentTurn
      }
    })

    // Check if player escaped rat race
    const totalExpenses = 
      player.profession.taxes +
      player.profession.homeMortgagePayment +
      player.profession.schoolLoanPayment +
      player.profession.carLoanPayment +
      player.profession.creditCardPayment +
      player.profession.retailPayment +
      player.profession.otherExpenses +
      (player.profession.childExpense * player.numChildren)

    if (newPassiveIncome > totalExpenses && !player.hasEscapedRatRace) {
      await prisma.player.update({
        where: { id: player.id },
        data: {
          hasEscapedRatRace: true,
          isOnFastTrack: true,
          escapedAt: new Date()
        }
      })

      await prisma.gameEvent.create({
        data: {
          gameSessionId: gameId,
          playerId: player.id,
          eventType: "escaped_rat_race",
          eventData: {
            passiveIncome: newPassiveIncome,
            totalExpenses
          },
          turnNumber: player.currentTurn
        }
      })
    }

    return NextResponse.json({
      message: "Investment purchased successfully",
      investment,
      newCash: updatedPlayer.cashOnHand,
      newPassiveIncome
    })

  } catch (error) {
    console.error("Error purchasing investment:", error)
    return NextResponse.json(
      { error: "Failed to purchase investment" },
      { status: 500 }
    )
  }
}

