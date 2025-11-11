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

    const { amount } = await request.json()
    const gameId = parseInt(params.gameId)

    // Validate loan amount
    if (!amount || amount < 1000 || amount > 1000000) {
      return NextResponse.json(
        { error: "Invalid loan amount" },
        { status: 400 }
      )
    }

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

    // Calculate loan terms (10% annual interest)
    const interestRate = 10.0
    const annualInterest = Math.floor(amount * (interestRate / 100))
    const monthlyPayment = Math.floor(annualInterest / 12)

    // Create loan liability
    const loan = await prisma.playerLiability.create({
      data: {
        playerId: player.id,
        type: "bank_loan",
        description: `Préstamo bancario de $${amount.toLocaleString()}`,
        principalAmount: amount,
        remainingBalance: amount,
        interestRate,
        monthlyPayment
      }
    })

    // Add cash to player
    const updatedPlayer = await prisma.player.update({
      where: { id: player.id },
      data: {
        cashOnHand: player.cashOnHand + amount
      }
    })

    // Log loan event
    await prisma.gameEvent.create({
      data: {
        gameSessionId: gameId,
        playerId: player.id,
        eventType: "loan_taken",
        eventData: {
          loanId: loan.id,
          amount,
          interestRate,
          monthlyPayment
        },
        cashChange: amount,
        cashFlowChange: -monthlyPayment,
        turnNumber: player.currentTurn
      }
    })

    return NextResponse.json({
      message: "Loan approved successfully",
      loanId: loan.id,
      amount,
      monthlyPayment,
      newCash: updatedPlayer.cashOnHand
    })

  } catch (error) {
    console.error("Error processing loan:", error)
    return NextResponse.json(
      { error: "Failed to process loan" },
      { status: 500 }
    )
  }
}

