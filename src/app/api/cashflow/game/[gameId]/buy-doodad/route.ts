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
    const { doodadId, name, description, cost } = body
    const { gameId } = await params
    const parsedGameId = parseInt(gameId)

    // Get player
    const player = await prisma.player.findFirst({
      where: { gameSessionId: parsedGameId, userId: user.id }
    })

    if (!player) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 })
    }

    // Resolve doodad info: either from catalog ID or directly from body (AI doodads)
    let doodadName = name
    let doodadDescription = description
    let doodadCost = cost

    if (doodadId && doodadId !== 9999) {
      // Fetch from catalog table
      const doodad = await prisma.doodad.findUnique({
        where: { id: parseInt(doodadId) }
      })

      if (!doodad) {
        return NextResponse.json({ error: "Doodad not found" }, { status: 404 })
      }

      doodadName = doodad.name
      doodadDescription = doodad.description
      doodadCost = doodad.cost
    }

    if (!doodadName || doodadCost === undefined) {
      return NextResponse.json({ error: "Doodad info missing" }, { status: 400 })
    }

    // Check if player has enough cash
    if (player.cashOnHand < doodadCost) {
      return NextResponse.json({ error: "Not enough cash" }, { status: 400 })
    }

    const newCash = player.cashOnHand - doodadCost

    await prisma.$transaction(async (tx) => {
      // Create player doodad record (no FK to doodad catalog — schema uses name/desc/cost)
      await tx.playerDoodad.create({
        data: {
          playerId: player.id,
          name: doodadName,
          description: doodadDescription || null,
          cost: doodadCost
        }
      })

      // Update player cash
      await tx.player.update({
        where: { id: player.id },
        data: { cashOnHand: newCash }
      })

      // Log doodad purchase
      await tx.gameEvent.create({
        data: {
          gameSessionId: parsedGameId,
          playerId: player.id,
          eventType: "doodad_purchased",
          eventData: { doodadId, doodadName, cost: doodadCost },
          cashChange: -doodadCost,
          turnNumber: player.currentTurn || 1
        }
      })
    })

    return NextResponse.json({
      message: "Doodad purchased successfully",
      newCash
    })

  } catch (error) {
    console.error("Error buying doodad:", error)
    return NextResponse.json({ error: "Failed to buy doodad" }, { status: 500 })
  }
}
