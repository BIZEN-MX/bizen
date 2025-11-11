import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { professionId } = await request.json()

    if (!professionId) {
      return NextResponse.json(
        { error: "Profession ID is required" },
        { status: 400 }
      )
    }

    // Get profession details
    const profession = await prisma.profession.findUnique({
      where: { id: professionId }
    })

    if (!profession) {
      return NextResponse.json(
        { error: "Profession not found" },
        { status: 404 }
      )
    }

    // Create game session
    const gameSession = await prisma.gameSession.create({
      data: {
        userId: user.id,
        status: "active",
        currentPhase: "rat_race",
        totalTurns: 0
      }
    })

    // Create player
    const player = await prisma.player.create({
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

    // Log game start event
    await prisma.gameEvent.create({
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

    return NextResponse.json({
      gameId: gameSession.id,
      playerId: player.id,
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

