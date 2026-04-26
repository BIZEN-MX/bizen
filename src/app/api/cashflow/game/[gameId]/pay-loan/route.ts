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
    const { liabilityId } = body
    const { gameId } = await params
    const parsedGameId = parseInt(gameId)

    // Get player
    const player = await prisma.player.findFirst({
      where: { gameSessionId: parsedGameId, userId: user.id }
    })

    if (!player) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 })
    }

    // Get liability and verify it belongs to this player
    const liability = await prisma.playerLiability.findFirst({
      where: { id: parseInt(liabilityId), playerId: player.id }
    })

    if (!liability || liability.isPaidOff) {
      return NextResponse.json({ error: "Liability not found or already paid" }, { status: 404 })
    }

    // Check if player has enough cash
    if (player.cashOnHand < liability.remainingBalance) {
      return NextResponse.json({ error: "Not enough cash to pay off loan" }, { status: 400 })
    }

    const newCash = player.cashOnHand - liability.remainingBalance

    await prisma.$transaction(async (tx) => {
      // Mark as paid off
      await tx.playerLiability.update({
        where: { id: liability.id },
        data: {
          isPaidOff: true,
          remainingBalance: 0,
          paidOffAt: new Date()
        }
      })

      // Update player cash
      await tx.player.update({
        where: { id: player.id },
        data: { cashOnHand: newCash }
      })

      // Log payment event
      await tx.gameEvent.create({
        data: {
          gameSessionId: parsedGameId,
          playerId: player.id,
          eventType: "loan_paid",
          eventData: { liabilityId, amount: liability.remainingBalance },
          cashChange: -liability.remainingBalance,
          turnNumber: player.currentTurn || 1
        }
      })
    })

    return NextResponse.json({
      message: "Loan paid off successfully",
      newCash
    })

  } catch (error) {
    console.error("Error paying loan:", error)
    return NextResponse.json({ error: "Failed to pay loan" }, { status: 500 })
  }
}
