import { NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get all game sessions for this user
    const games = await prisma.gameSession.findMany({
      where: {
        userId: user.id
      },
      include: {
        players: {
          include: {
            profession: true,
            playerInvestments: {
              where: { isSold: false }
            }
          }
        }
      },
      orderBy: {
        lastActivityAt: 'desc'
      }
    })

    // Transform data for frontend
    const gamesData = games.map(game => {
      const player = game.players[0]
      
      return {
        id: game.id,
        status: game.status,
        currentPhase: game.currentPhase,
        startedAt: game.startedAt,
        completedAt: game.completedAt,
        lastActivityAt: game.lastActivityAt,
        totalTurns: game.totalTurns,
        player: player ? {
          id: player.id,
          profession: player.profession.name,
          currentTurn: player.currentTurn,
          cashOnHand: player.cashOnHand,
          passiveIncome: player.passiveIncome,
          hasEscapedRatRace: player.hasEscapedRatRace,
          numInvestments: player.playerInvestments.length
        } : null
      }
    })

    return NextResponse.json(gamesData)

  } catch (error) {
    console.error("Error fetching games:", error)
    return NextResponse.json(
      { error: "Failed to fetch games" },
      { status: 500 }
    )
  }
}

