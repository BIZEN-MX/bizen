import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth/api-auth"

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (!authResult.success) {
      return authResult.response
    }
    const { user } = authResult.data

    const body = await request.json()
    const { professionId } = body

    if (!professionId) {
      return NextResponse.json(
        { error: "Profession ID is required" },
        { status: 400 }
      )
    }

    // Get profession details
    const profession = await prisma.profession.findUnique({
      where: { id: parseInt(professionId) }
    })

    if (!profession) {
      return NextResponse.json(
        { error: "Profession not found" },
        { status: 404 }
      )
    }

    // Create game session and player in a transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      const gameSession = await tx.gameSession.create({
        data: {
          userId: user.id,
          status: "active",
          currentPhase: "rat_race",
          totalTurns: 0
        }
      })

      const player = await tx.player.create({
        data: {
          gameSessionId: gameSession.id,
          userId: user.id,
          professionId: profession.id,
          cashOnHand: profession.startingCash,
          savings: profession.startingSavings,
          numChildren: 0,
          currentPosition: 0,
          currentTurn: 1,
          passiveIncome: 0
        }
      })

      await tx.gameEvent.create({
        data: {
          gameSessionId: gameSession.id,
          playerId: player.id,
          eventType: "game_started",
          eventData: {
            professionId: profession.id,
            professionName: profession.name
          },
          turnNumber: 1
        }
      })

      return { gameSession, player }
    })

    return NextResponse.json({
      gameId: result.gameSession.id,
      playerId: result.player.id,
      message: "Game started successfully"
    })

  } catch (error) {
    console.error("Error starting game:", error)
    return NextResponse.json(
      { error: "Failed to start game" },
      { status: 500 }
    )
  }
}

