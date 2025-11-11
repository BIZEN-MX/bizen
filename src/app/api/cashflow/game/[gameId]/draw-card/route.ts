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

    const gameId = parseInt(params.gameId)

    // Verify game belongs to user
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

    // Random card type: 15% doodad, 20% market event, 65% opportunity
    const rand = Math.random()
    const isDoodad = rand < 0.15
    const isMarketEvent = rand >= 0.15 && rand < 0.35

    if (isDoodad) {
      // Get random doodad (tempting luxury purchase)
      const doodadCount = await prisma.doodad.count({
        where: { isActive: true }
      })

      const skip = Math.floor(Math.random() * doodadCount)
      
      const doodad = await prisma.doodad.findMany({
        where: { isActive: true },
        skip,
        take: 1
      })

      if (doodad && doodad.length > 0) {
        // Log doodad drawn
        await prisma.gameEvent.create({
          data: {
            gameSessionId: gameId,
            playerId: player.id,
            eventType: "opportunity_drawn",
            eventData: {
              doodadId: doodad[0].id,
              doodadName: doodad[0].name,
              type: "doodad"
            },
            turnNumber: player.currentTurn
          }
        })

        return NextResponse.json({
          isDoodad: true,
          doodad: doodad[0]
        })
      }
    }

    if (isMarketEvent) {
      // Get random market event
      const eventCount = await prisma.marketCard.count({
        where: { isActive: true }
      })

      const skip = Math.floor(Math.random() * eventCount)
      
      const event = await prisma.marketCard.findMany({
        where: { isActive: true },
        skip,
        take: 1
      })

      if (event && event.length > 0) {
        const marketEvent = event[0]
        let cashChange = 0
        let message = ""

        // Apply market event effects  
        switch (marketEvent.type) {
          case "baby":
            await prisma.player.update({
              where: { id: player.id },
              data: {
                numChildren: player.numChildren + 1
              }
            })
            message = `¡Nació un bebé! Ahora tienes ${player.numChildren + 1} hijo(s). Tus gastos mensuales aumentan $${player.profession.childExpense}.`
            break

          case "downsized":
            cashChange = -(player.profession.salary * 2)
            await prisma.player.update({
              where: { id: player.id },
              data: {
                cashOnHand: player.cashOnHand + cashChange
              }
            })
            message = `¡Te despidieron! Pierdes 2 turnos de salario (-$${Math.abs(cashChange).toLocaleString()}).`
            break

          case "charity":
            const donation = Math.floor(player.profession.salary * 0.1)
            cashChange = -donation
            await prisma.player.update({
              where: { id: player.id },
              data: {
                cashOnHand: player.cashOnHand + cashChange
              }
            })
            message = `Donas a caridad. Contribuyes $${Math.abs(cashChange).toLocaleString()} y recibes beneficios fiscales.`
            break

          case "paycheck":
            cashChange = player.profession.salary
            await prisma.player.update({
              where: { id: player.id },
              data: {
                cashOnHand: player.cashOnHand + cashChange
              }
            })
            message = `¡Día de pago extra! Recibes tu salario mensual de $${cashChange.toLocaleString()}.`
            break

          default:
            message = marketEvent.description
        }

        // Get updated profession data
        const updatedPlayer = await prisma.player.findUnique({
          where: { id: player.id },
          include: { profession: true }
        })

        // Log market event
        await prisma.gameEvent.create({
          data: {
            gameSessionId: gameId,
            playerId: player.id,
            eventType: "market_event",
            eventData: {
              eventId: marketEvent.id,
              eventName: marketEvent.name,
              eventType: marketEvent.type
            },
            cashChange,
            turnNumber: player.currentTurn
          }
        })

        return NextResponse.json({
          isMarketEvent: true,
          marketEvent: {
            ...marketEvent,
            message
          },
          cashChange,
          newChildren: updatedPlayer?.numChildren
        })
      }
    }

    // Get a random opportunity card (filter by phase)
    const isOnFastTrack = player.isOnFastTrack
    
    const cardCount = await prisma.opportunityCard.count({
      where: { 
        isActive: true,
        isFastTrack: isOnFastTrack // Only Fast Track cards if player is on Fast Track
      }
    })

    const skip = Math.floor(Math.random() * cardCount)
    
    const card = await prisma.opportunityCard.findMany({
      where: { 
        isActive: true,
        isFastTrack: isOnFastTrack
      },
      skip,
      take: 1
    })

    if (!card || card.length === 0) {
      return NextResponse.json(
        { error: "No cards available" },
        { status: 404 }
      )
    }

    // Log the draw event
    await prisma.gameEvent.create({
      data: {
        gameSessionId: gameId,
        playerId: player.id,
        eventType: "opportunity_drawn",
        eventData: {
          cardId: card[0].id,
          cardName: card[0].name,
          cardType: card[0].type
        },
        turnNumber: player.currentTurn
      }
    })

    return NextResponse.json({ isMarketEvent: false, card: card[0] })

  } catch (error) {
    console.error("Error drawing card:", error)
    return NextResponse.json(
      { error: "Failed to draw card" },
      { status: 500 }
    )
  }
}

