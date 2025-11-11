import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

export async function GET(
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

    const gameId = parseInt(params.gameId)

    // Get game session with player and profession details
    const gameSession = await prisma.gameSession.findUnique({
      where: { id: gameId },
      include: {
        players: {
          where: { userId: user.id },
          include: {
            profession: true,
            playerInvestments: {
              where: { isSold: false },
              include: {
                opportunityCard: true
              }
            },
            playerLiabilities: {
              where: { isPaidOff: false }
            },
            playerDoodads: true
          }
        }
      }
    })

    if (!gameSession) {
      return NextResponse.json(
        { error: "Game not found" },
        { status: 404 }
      )
    }

    if (gameSession.userId !== user.id) {
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

    return NextResponse.json({
      id: gameSession.id,
      status: gameSession.status,
      currentPhase: gameSession.currentPhase,
      totalTurns: gameSession.totalTurns,
      player: {
        id: player.id,
        cashOnHand: player.cashOnHand,
        savings: player.savings,
        numChildren: player.numChildren,
        currentTurn: player.currentTurn,
        passiveIncome: player.passiveIncome,
        totalIncome: player.totalIncome,
        totalExpenses: player.totalExpenses,
        cashFlow: player.cashFlow,
        hasEscapedRatRace: player.hasEscapedRatRace,
        isOnFastTrack: player.isOnFastTrack,
        profession: player.profession,
        investments: player.playerInvestments,
        liabilities: player.playerLiabilities,
        doodads: player.playerDoodads
      }
    })

  } catch (error) {
    console.error("Error fetching game state:", error)
    return NextResponse.json(
      { error: "Failed to fetch game state" },
      { status: 500 }
    )
  }
}

