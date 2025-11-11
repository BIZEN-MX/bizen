import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

export async function POST(
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

    const { doodadId } = await request.json()
    const gameId = parseInt(params.gameId)

    // Get game and player
    const gameSession = await prisma.gameSession.findUnique({
      where: { id: gameId },
      include: {
        players: {
          where: { userId: user.id }
        }
      }
    })

    if (!gameSession || gameSession.userId !== user.id) {
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

    // Get doodad
    const doodad = await prisma.doodad.findUnique({
      where: { id: doodadId }
    })

    if (!doodad) {
      return NextResponse.json(
        { error: "Doodad not found" },
        { status: 404 }
      )
    }

    // Check if player has enough cash
    if (player.cashOnHand < doodad.cost) {
      return NextResponse.json(
        { error: "Not enough cash" },
        { status: 400 }
      )
    }

    // Create doodad purchase
    await prisma.playerDoodad.create({
      data: {
        playerId: player.id,
        doodadId: doodad.id,
        name: doodad.name,
        description: doodad.description,
        cost: doodad.cost
      }
    })

    // Deduct cash from player
    const updatedPlayer = await prisma.player.update({
      where: { id: player.id },
      data: {
        cashOnHand: player.cashOnHand - doodad.cost
      }
    })

    // Log doodad purchase
    await prisma.gameEvent.create({
      data: {
        gameSessionId: gameId,
        playerId: player.id,
        eventType: "doodad_purchased",
        eventData: {
          doodadId: doodad.id,
          doodadName: doodad.name,
          cost: doodad.cost
        },
        cashChange: -doodad.cost,
        turnNumber: player.currentTurn
      }
    })

    return NextResponse.json({
      message: "Doodad purchased",
      newCash: updatedPlayer.cashOnHand
    })

  } catch (error) {
    console.error("Error buying doodad:", error)
    return NextResponse.json(
      { error: "Failed to buy doodad" },
      { status: 500 }
    )
  }
}

