import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth/api-auth"
import { translateOpportunityCard, translateMarketEvent } from "@/lib/cashflow/translations"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const { gameId: rawGameId } = await params
  try {
    console.log("🎴 Draw card API called")
    const authResult = await requireAuth(request)
    if (!authResult.success) {
      return authResult.response
    }
    const { user } = authResult.data

    const parsedGameId = parseInt(rawGameId)
    console.log("🎲 Game ID:", parsedGameId)

    // Verify game belongs to user and get player
    const gameSession = await prisma.gameSession.findUnique({
      where: { id: parsedGameId }
    })

    if (!gameSession || gameSession.userId !== user.id) {
      console.error("❌ Game session not found or unauthorized")
      return NextResponse.json({ error: "Game not found" }, { status: 403 })
    }

    console.log("✅ Game session found")

    const player = await prisma.player.findFirst({
      where: { gameSessionId: parsedGameId, userId: user.id },
      include: { profession: true }
    })

    if (!player) {
      console.error("❌ Player not found")
      return NextResponse.json({ error: "Player not found" }, { status: 404 })
    }

    console.log("✅ Player found:", { playerId: player.id, isOnFastTrack: player.isOnFastTrack })

    // AI Chance Configuration: 15% total (5% AI Market, 10% AI Doodad)
    const aiRand = Math.random()
    const useAI = aiRand < 0.15
    const isAIDoodad = useAI && aiRand < 0.10
    const isAIMarket = useAI && !isAIDoodad

    if (useAI) {
      console.log(`🤖 AI Event Triggered (Doodad: ${isAIDoodad}, Market: ${isAIMarket})`)
      const { generateDynamicMarketEvent, generatePersonalizedDoodad } = await import("@/lib/ai/cashflow-ai")

      // Get fuller player context for AI
      const fullPlayer = await prisma.player.findFirst({
        where: { id: player.id },
        include: {
          profession: true,
          playerInvestments: { include: { opportunityCard: true } }
        }
      })

      if (isAIDoodad) {
        const aiDoodad = await generatePersonalizedDoodad({
          ...player,
          investments: fullPlayer?.playerInvestments || []
        })

        // Log AI event
        await prisma.gameEvent.create({
          data: {
            gameSessionId: parsedGameId,
            playerId: player.id,
            eventType: "opportunity_drawn",
            eventData: { doodadName: aiDoodad.name, type: "doodad", isAI: true },
            turnNumber: player.currentTurn || 1
          }
        })

        return NextResponse.json({
          isDoodad: true,
          isAI: true,
          doodad: { id: 9999, ...aiDoodad }
        })
      }

      if (isAIMarket) {
        const aiEvent = await generateDynamicMarketEvent({
          ...player,
          investments: fullPlayer?.playerInvestments || []
        })

        const cashChange = aiEvent.cashChange || 0
        if (cashChange !== 0) {
          await prisma.player.update({
            where: { id: player.id },
            data: { cashOnHand: player.cashOnHand + cashChange }
          })
        }

        await prisma.gameEvent.create({
          data: {
            gameSessionId: parsedGameId,
            playerId: player.id,
            eventType: "market_event",
            eventData: { eventName: aiEvent.name, eventType: aiEvent.type, isAI: true },
            cashChange: cashChange,
            turnNumber: player.currentTurn || 1
          }
        })

        return NextResponse.json({
          isMarketEvent: true,
          isAI: true,
          marketEvent: {
            id: 8888,
            name: aiEvent.name,
            description: aiEvent.description,
            type: aiEvent.type,
            message: aiEvent.description
          },
          cashChange
        })
      }
    }

    // Fallback to original random logic
    const rand = Math.random()
    const isDoodad = rand < 0.15
    const isMarketEvent = rand >= 0.15 && rand < 0.35

    if (isDoodad) {
      console.log("🎰 Drawing doodad...")
      const doodads = await prisma.doodad.findMany({
        where: { isActive: true }
      })

      if (doodads && doodads.length > 0) {
        const randomDoodad = doodads[Math.floor(Math.random() * doodads.length)]
        console.log("✅ Doodad drawn:", randomDoodad.name)

        await prisma.gameEvent.create({
          data: {
            gameSessionId: parsedGameId,
            playerId: player.id,
            eventType: "opportunity_drawn",
            eventData: { doodadId: randomDoodad.id, doodadName: randomDoodad.name, type: "doodad" },
            turnNumber: player.currentTurn || 1
          }
        })

        return NextResponse.json({ isDoodad: true, doodad: randomDoodad })
      }
    }

    if (isMarketEvent) {
      console.log("📉 Drawing market event...")
      const marketCards = await prisma.marketCard.findMany({
        where: { isActive: true }
      })

      if (marketCards && marketCards.length > 0) {
        const marketEvent = marketCards[Math.floor(Math.random() * marketCards.length)]
        let cashChange = 0
        let message = ""
        const profession = player.profession!

        switch (marketEvent.type) {
          case "baby":
            await prisma.player.update({
              where: { id: player.id },
              data: { numChildren: (player.numChildren || 0) + 1 }
            })
            message = `¡Nació un bebé! Ahora tienes ${(player.numChildren || 0) + 1} hijo(s). Tus gastos mensuales aumentan $${profession.childExpense}.`
            break

          case "downsized":
            cashChange = -(profession.salary * 2)
            await prisma.player.update({
              where: { id: player.id },
              data: { cashOnHand: player.cashOnHand + cashChange }
            })
            message = `¡Te despidieron! Pierdes 2 turnos de salario (-$${Math.abs(cashChange).toLocaleString()}).`
            break

          case "charity": {
            const donation = Math.floor(profession.salary * 0.1)
            cashChange = -donation
            await prisma.player.update({
              where: { id: player.id },
              data: { cashOnHand: player.cashOnHand + cashChange }
            })
            message = `Donas a caridad. Contribuyes $${Math.abs(cashChange).toLocaleString()} y recibes beneficios fiscales.`
            break
          }

          case "paycheck":
            cashChange = profession.salary
            await prisma.player.update({
              where: { id: player.id },
              data: { cashOnHand: player.cashOnHand + cashChange }
            })
            message = `¡Día de pago extra! Recibes tu salario mensual de $${cashChange.toLocaleString()}.`
            break

          default:
            message = marketEvent.description
        }

        await prisma.gameEvent.create({
          data: {
            gameSessionId: parsedGameId,
            playerId: player.id,
            eventType: "market_event",
            eventData: { eventId: marketEvent.id, eventName: marketEvent.name, eventType: marketEvent.type },
            cashChange: cashChange,
            turnNumber: player.currentTurn || 1
          }
        })

        const translatedMarketEvent = translateMarketEvent(marketEvent)

        return NextResponse.json({
          isMarketEvent: true,
          marketEvent: {
            ...translatedMarketEvent,
            message: message || translatedMarketEvent.description
          },
          cashChange
        })
      }
    }

    // Get random opportunity card
    const isOnFastTrack = player.isOnFastTrack || false
    const cards = await prisma.opportunityCard.findMany({
      where: { isActive: true, isFastTrack: isOnFastTrack }
    })

    if (!cards || cards.length === 0) {
      return NextResponse.json({ error: "No cards available" }, { status: 404 })
    }

    const card = cards[Math.floor(Math.random() * cards.length)]
    const translatedCard = translateOpportunityCard(card)

    await prisma.gameEvent.create({
      data: {
        gameSessionId: parsedGameId,
        playerId: player.id,
        eventType: "opportunity_drawn",
        eventData: { cardId: card.id, cardName: card.name },
        turnNumber: player.currentTurn || 1
      }
    })

    return NextResponse.json({ isDoodad: false, isMarketEvent: false, card: translatedCard })

  } catch (error) {
    console.error("❌ Error drawing card:", error)
    return NextResponse.json(
      { error: "Failed to draw card", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
