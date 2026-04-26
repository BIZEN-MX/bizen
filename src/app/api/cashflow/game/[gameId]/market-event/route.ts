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
    const { eventType, eventData } = body
    const { gameId } = await params
    const parsedGameId = parseInt(gameId)

    // Get player
    const player = await prisma.player.findFirst({
      where: { gameSessionId: parsedGameId, userId: user.id }
    })

    if (!player) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 })
    }

    // Log market event
    await prisma.gameEvent.create({
      data: {
        gameSessionId: parsedGameId,
        playerId: player.id,
        eventType: eventType || "market_event",
        eventData: eventData || {},
        turnNumber: player.currentTurn || 1
      }
    })

    return NextResponse.json({ message: "Market event processed successfully" })

  } catch (error) {
    console.error("Error processing market event:", error)
    return NextResponse.json({ error: "Failed to process market event" }, { status: 500 })
  }
}
