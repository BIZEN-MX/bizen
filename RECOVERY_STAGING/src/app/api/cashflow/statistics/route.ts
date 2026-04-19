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

    // Get all games for this user
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
            },
            playerDoodads: true
          }
        }
      },
      orderBy: {
        startedAt: 'desc'
      }
    })

    // Calculate statistics
    const totalGames = games.length
    const completedGames = games.filter(g => g.players[0]?.hasEscapedRatRace).length
    const activeGames = games.filter(g => g.status === 'active' && !g.players[0]?.hasEscapedRatRace).length
    const abandonedGames = games.filter(g => g.status === 'abandoned').length

    // Calculate win rate
    const winRate = totalGames > 0 ? ((completedGames / totalGames) * 100).toFixed(1) : "0.0"

    // Get games that were won
    const wonGames = games.filter(g => g.players[0]?.hasEscapedRatRace)

    // Average turns to win
    const avgTurnsToWin = wonGames.length > 0
      ? Math.round(wonGames.reduce((sum, g) => sum + (g.players[0]?.currentTurn || 0), 0) / wonGames.length)
      : 0

    // Fastest win
    const fastestWin = wonGames.length > 0
      ? Math.min(...wonGames.map(g => g.players[0]?.currentTurn || 999))
      : null

    // Best profession (most wins)
    const professionWins: { [key: string]: number } = {}
    wonGames.forEach(g => {
      const profName = g.players[0]?.profession.name
      if (profName) {
        professionWins[profName] = (professionWins[profName] || 0) + 1
      }
    })
    const bestProfession = Object.entries(professionWins).sort((a, b) => b[1] - a[1])[0]

    // Total money earned across all games
    const totalCashEarned = games.reduce((sum, g) => {
      const player = g.players[0]
      if (!player) return sum
      const startingCash = player.profession.startingCash
      return sum + (player.cashOnHand - startingCash)
    }, 0)

    // Total investments made
    const totalInvestments = games.reduce((sum, g) => {
      return sum + (g.players[0]?.playerInvestments.length || 0)
    }, 0)

    // Total doodads purchased (bad decisions!)
    const totalDoodads = games.reduce((sum, g) => {
      return sum + (g.players[0]?.playerDoodads.length || 0)
    }, 0)

    const totalDoodadsCost = games.reduce((sum, g) => {
      const doodads = g.players[0]?.playerDoodads || []
      return sum + doodads.reduce((dSum, d) => dSum + d.cost, 0)
    }, 0)

    // Recent games (last 5)
    const recentGames = games.slice(0, 5).map(g => {
      const player = g.players[0]
      return {
        id: g.id,
        profession: player?.profession.name,
        currentTurn: player?.currentTurn,
        cashOnHand: player?.cashOnHand,
        passiveIncome: player?.passiveIncome,
        hasWon: player?.hasEscapedRatRace,
        startedAt: g.startedAt,
        status: g.status
      }
    })

    return NextResponse.json({
      overview: {
        totalGames,
        completedGames,
        activeGames,
        abandonedGames,
        winRate: parseFloat(winRate)
      },
      performance: {
        avgTurnsToWin,
        fastestWin,
        bestProfession: bestProfession ? {
          name: bestProfession[0],
          wins: bestProfession[1]
        } : null,
        totalCashEarned,
        totalInvestments,
        totalDoodads,
        totalDoodadsCost
      },
      recentGames
    })

  } catch (error) {
    console.error("Error fetching statistics:", error)
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    )
  }
}

