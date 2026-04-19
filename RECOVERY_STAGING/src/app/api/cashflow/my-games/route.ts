import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/api-auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);

    if (!authResult.success || !authResult.data?.user) {
      return authResult.response || NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { user } = authResult.data;

    // Get all game sessions for this user using Prisma
    const games = await prisma.gameSession.findMany({
      where: { userId: user.id },
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
      orderBy: { lastActivityAt: 'desc' }
    });

    // Transform data for frontend
    const gamesData = games.map((game) => {
      const player = game.players?.[0];
      
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
          profession: player.profession?.name || 'Unknown',
          currentTurn: player.currentTurn,
          cashOnHand: player.cashOnHand,
          passiveIncome: player.passiveIncome,
          hasEscapedRatRace: player.hasEscapedRatRace,
          numInvestments: player.investments.length
        } : null
      };
    });

    return NextResponse.json(gamesData);

  } catch (error) {
    console.error("Error fetching games:", error);
    return NextResponse.json(
      { error: "Failed to fetch games" },
      { status: 500 }
    );
  }
}

