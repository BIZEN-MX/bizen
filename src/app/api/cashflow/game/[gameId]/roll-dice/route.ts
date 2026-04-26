import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth/api-auth"

const BOARD_SPACES = [
  'payday', 'opportunity', 'market', 'opportunity', 'doodad', 'opportunity',
  'charity', 'opportunity', 'market', 'opportunity', 'baby', 'opportunity',
  'payday', 'opportunity', 'market', 'opportunity', 'doodad', 'opportunity',
  'charity', 'opportunity', 'market', 'opportunity', 'baby', 'opportunity'
]

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  try {
    console.log("🎲 Roll dice API called")
    const authResult = await requireAuth(request)
    if (!authResult.success) {
      return authResult.response
    }
    const { user } = authResult.data

    const body = await request.json()
    const { diceRoll } = body
    const { gameId } = await params
    const parsedGameId = parseInt(gameId)
    console.log("🎲 Dice roll:", diceRoll)

    // Get player
    const player = await prisma.player.findFirst({
      where: {
        gameSessionId: parsedGameId,
        userId: user.id
      }
    })

    if (!player) {
      console.error("❌ Player not found")
      return NextResponse.json({ error: "Player not found" }, { status: 404 })
    }

    const boardSize = BOARD_SPACES.length
    const currentPosition = player.currentPosition ?? 0

    console.log("✅ Player found:", { currentPosition })

    // Calculate new position (circular board)
    const newPosition = (currentPosition + diceRoll) % boardSize
    const landedSpace = BOARD_SPACES[newPosition]

    console.log("📍 New position:", newPosition, "Space type:", landedSpace)

    // Check if passed Payday (position 0)
    const passedPayday = currentPosition + diceRoll >= boardSize
    
    let cashChange = 0
    let message = ""

    // Handle Payday if passed
    if (passedPayday && landedSpace !== 'payday') {
      const profession = await prisma.profession.findUnique({
        where: { id: player.professionId }
      })

      if (profession) {
        const paydayAmount = profession.salary + (player.passiveIncome || 0)
        cashChange += paydayAmount
        message += `¡Pasaste por Payday! +$${paydayAmount.toLocaleString()}\n`
        console.log("💵 Passed Payday:", paydayAmount)
      }
    }

    // Handle landing on Payday
    if (landedSpace === 'payday') {
      const profession = await prisma.profession.findUnique({
        where: { id: player.professionId }
      })

      if (profession) {
        const paydayAmount = profession.salary + (player.passiveIncome || 0)
        cashChange += paydayAmount
        message = `💵 ¡Payday! Recibiste $${paydayAmount.toLocaleString()}`
        console.log("💵 Landed on Payday:", paydayAmount)
      }
    }

    // Update player position and cash using a transaction with the event
    await prisma.$transaction(async (tx) => {
      await tx.player.update({
        where: { id: player.id },
        data: {
          cashOnHand: player.cashOnHand + cashChange,
          currentTurn: (player.currentTurn || 1) + 1,
          currentPosition: newPosition
        }
      })

      // Log the dice roll event
      await tx.gameEvent.create({
        data: {
          gameSessionId: parsedGameId,
          playerId: player.id,
          eventType: "turn_started",
          eventData: {
            diceRoll,
            oldPosition: currentPosition,
            newPosition,
            landedSpace,
            passedPayday
          },
          cashChange: cashChange,
          turnNumber: (player.currentTurn || 1) + 1
        }
      })
    })

    console.log("✅ Player updated successfully")

    return NextResponse.json({
      success: true,
      diceRoll,
      newPosition,
      landedSpace,
      passedPayday,
      cashChange,
      message,
      newCash: player.cashOnHand + cashChange
    })

  } catch (error) {
    console.error("❌ Error rolling dice:", error)
    return NextResponse.json({ 
      error: "Failed to roll dice",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}

