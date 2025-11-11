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
          where: { userId: user.id },
          include: {
            profession: true
          }
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

    // Get a random market event
    const eventCount = await prisma.marketCard.count({
      where: { isActive: true }
    })

    const skip = Math.floor(Math.random() * eventCount)
    
    const event = await prisma.marketCard.findMany({
      where: { isActive: true },
      skip,
      take: 1
    })

    if (!event || event.length === 0) {
      return NextResponse.json(
        { error: "No market events available" },
        { status: 404 }
      )
    }

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
        // Lose 2 turns of salary
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
        // Donate 10% of income
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
        // Bonus paycheck
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
      event: {
        ...marketEvent,
        message
      },
      cashChange
    })

  } catch (error) {
    console.error("Error processing market event:", error)
    return NextResponse.json(
      { error: "Failed to process market event" },
      { status: 500 }
    )
  }
}

