import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth/api-auth"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  try {
    console.log("🏦 Take loan API called")
    const authResult = await requireAuth(request)
    if (!authResult.success) {
      return authResult.response
    }
    const { user } = authResult.data

    const body = await request.json()
    const { amount, type, description, interestRate } = body
    console.log("💰 Loan request:", { amount, type, description, interestRate })
    const { gameId } = await params
    const parsedGameId = parseInt(gameId)

    // Get player
    const player = await prisma.player.findFirst({
      where: { gameSessionId: parsedGameId, userId: user.id }
    })

    if (!player) {
      console.error("❌ Player not found")
      return NextResponse.json({ error: "Player not found" }, { status: 404 })
    }

    console.log("✅ Player found:", { playerId: player.id, currentCash: player.cashOnHand })

    // Calculate monthly payment (10% interest annually, divided by 12 months)
    const monthlyPayment = Math.ceil(amount * (interestRate || 10) / 100 / 12)
    console.log("📊 Calculated monthly payment:", monthlyPayment)

    const newCash = player.cashOnHand + amount

    const result = await prisma.$transaction(async (tx) => {
      // Create liability
      const liability = await tx.playerLiability.create({
        data: {
          playerId: player.id,
          type: type || 'bank_loan',
          description: description || `Préstamo bancario de $${amount.toLocaleString()}`,
          principalAmount: amount,
          remainingBalance: amount,
          interestRate: interestRate || 10,
          monthlyPayment: monthlyPayment
        }
      })

      console.log("✅ Liability created:", liability.id)

      // Update player cash
      await tx.player.update({
        where: { id: player.id },
        data: { cashOnHand: newCash }
      })

      // Log loan event
      await tx.gameEvent.create({
        data: {
          gameSessionId: parsedGameId,
          playerId: player.id,
          eventType: "loan_taken",
          eventData: { amount, type, monthlyPayment },
          cashChange: amount,
          turnNumber: player.currentTurn || 1
        }
      })

      return liability
    })

    console.log(`✅ Loan taken successfully:`, { amount, newCash, monthlyPayment })
    return NextResponse.json({
      success: true,
      message: "Loan taken successfully",
      liability: result,
      newCash,
      amount,
      monthlyPayment
    })

  } catch (error) {
    console.error("❌ Error taking loan:", error)
    return NextResponse.json({
      error: "Failed to take loan",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
