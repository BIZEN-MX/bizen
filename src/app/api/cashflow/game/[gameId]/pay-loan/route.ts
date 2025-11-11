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

    const { liabilityId } = await request.json()
    const gameId = parseInt(params.gameId)

    // Get game and player
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

    // Get the liability
    const liability = await prisma.playerLiability.findUnique({
      where: { id: liabilityId }
    })

    if (!liability || liability.playerId !== player.id) {
      return NextResponse.json(
        { error: "Loan not found" },
        { status: 404 }
      )
    }

    if (liability.isPaidOff) {
      return NextResponse.json(
        { error: "Loan already paid off" },
        { status: 400 }
      )
    }

    // Check if player has enough cash
    if (player.cashOnHand < liability.remainingBalance) {
      return NextResponse.json(
        { error: "Not enough cash to pay off loan" },
        { status: 400 }
      )
    }

    // Mark loan as paid off
    await prisma.playerLiability.update({
      where: { id: liabilityId },
      data: {
        isPaidOff: true,
        paidOffAt: new Date(),
        remainingBalance: 0
      }
    })

    // Deduct cash from player
    const updatedPlayer = await prisma.player.update({
      where: { id: player.id },
      data: {
        cashOnHand: player.cashOnHand - liability.remainingBalance
      }
    })

    // Log payoff event
    await prisma.gameEvent.create({
      data: {
        gameSessionId: gameId,
        playerId: player.id,
        eventType: "loan_paid",
        eventData: {
          loanId: liability.id,
          amount: liability.remainingBalance,
          monthlyPaymentSaved: liability.monthlyPayment
        },
        cashChange: -liability.remainingBalance,
        cashFlowChange: liability.monthlyPayment, // positive because expense is removed
        turnNumber: player.currentTurn
      }
    })

    return NextResponse.json({
      message: "Loan paid off successfully",
      amountPaid: liability.remainingBalance,
      monthlyPaymentSaved: liability.monthlyPayment,
      newCash: updatedPlayer.cashOnHand
    })

  } catch (error) {
    console.error("Error paying off loan:", error)
    return NextResponse.json(
      { error: "Failed to pay off loan" },
      { status: 500 }
    )
  }
}

