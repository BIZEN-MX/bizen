import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"
import { translateOpportunityCard, translateMarketEvent } from "@/lib/cashflow/translations"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const { gameId: rawGameId } = await params
  try {
    console.log("🎴 Draw card API called")
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await (supabase as any).auth.getUser()

    if (authError || !user) {
      console.error("❌ Auth error:", authError)
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const gameId = parseInt(rawGameId)
    console.log("🎲 Game ID:", gameId)

    // Verify game belongs to user and get player
    const { data: gameSession, error: sessionError } = await (supabase as any)
      .from('game_sessions')
      .select('*')
      .eq('id', gameId)
      .eq('user_id', user.id)
      .single()

    if (sessionError || !gameSession) {
      console.error("❌ Game session error:", sessionError)
      return NextResponse.json({ error: "Game not found", details: sessionError?.message }, { status: 403 })
    }

    console.log("✅ Game session found")

    const { data: players, error: playersError } = await (supabase as any)
      .from('players')
      .select('*, professions(*)')
      .eq('game_session_id', gameId)
      .eq('user_id', user.id)

    const player = players?.[0] as any
    if (playersError || !player) {
      console.error("❌ Player fetch error:", playersError)
      return NextResponse.json({ error: "Player not found", details: playersError?.message }, { status: 404 })
    }

    console.log("✅ Player found:", { playerId: player.id, isOnFastTrack: player.is_on_fast_track })

    // AI Chance Configuration: 15% total (5% AI Market, 10% AI Doodad)
    const aiRand = Math.random()
    const useAI = aiRand < 0.15
    const isAIDoodad = useAI && aiRand < 0.10
    const isAIMarket = useAI && !isAIDoodad

    if (useAI) {
      console.log(`🤖 AI Event Triggered (Doodad: ${isAIDoodad}, Market: ${isAIMarket})`)
      const { generateDynamicMarketEvent, generatePersonalizedDoodad } = await import("@/lib/ai/cashflow-ai")

      // Get fuller player context for AI
      const { data: fullPlayer } = await (supabase as any)
        .from('players')
        .select('*, professions(*), player_investments(*, opportunity_cards(*))')
        .eq('id', player.id)
        .single()

      if (isAIDoodad) {
        const aiDoodad = await generatePersonalizedDoodad({
          ...player,
          investments: fullPlayer?.player_investments || []
        })

        // Log AI event
        await (supabase as any).from('game_events').insert({
          game_session_id: gameId,
          player_id: player.id,
          event_type: "opportunity_drawn",
          event_data: {
            doodadName: aiDoodad.name,
            type: "doodad",
            isAI: true
          },
          turn_number: player.current_turn
        })

        return NextResponse.json({
          isDoodad: true,
          isAI: true,
          doodad: {
            id: 9999, // Pseudo-ID for AI
            ...aiDoodad
          }
        })
      }

      if (isAIMarket) {
        const aiEvent = await generateDynamicMarketEvent({
          ...player,
          investments: fullPlayer?.player_investments || []
        })

        let cashChange = aiEvent.cashChange || 0
        if (cashChange !== 0) {
          await (supabase as any)
            .from('players')
            .update({ cash_on_hand: player.cash_on_hand + cashChange })
            .eq('id', player.id)
        }

        // Log AI event
        await (supabase as any).from('game_events').insert({
          game_session_id: gameId,
          player_id: player.id,
          event_type: "market_event",
          event_data: {
            eventName: aiEvent.name,
            eventType: aiEvent.type,
            isAI: true
          },
          cash_change: cashChange,
          turn_number: player.current_turn
        })

        return NextResponse.json({
          isMarketEvent: true,
          isAI: true,
          marketEvent: {
            id: 8888, // Pseudo-ID for AI
            name: aiEvent.name,
            description: aiEvent.description,
            type: aiEvent.type,
            message: aiEvent.description
          },
          cashChange
        })
      }
    }

    // fallback to original random logic if AI is skipped or failed
    const rand = Math.random()
    const isDoodad = rand < 0.15
    const isMarketEvent = rand >= 0.15 && rand < 0.35

    if (isDoodad) {
      console.log("🎰 Drawing doodad...")
      // Get random doodad
      const { data: doodads, error: doodadError } = await (supabase as any)
        .from('doodads')
        .select('*')
        .eq('is_active', true)

      if (doodadError) {
        console.error("❌ Error fetching doodads:", doodadError)
      }

      if (doodads && doodads.length > 0) {
        const randomDoodad = doodads[Math.floor(Math.random() * doodads.length)]
        console.log("✅ Doodad drawn:", randomDoodad.name)

        // Log doodad drawn
        await (supabase as any).from('game_events').insert({
          game_session_id: gameId,
          player_id: player.id,
          event_type: "opportunity_drawn",
          event_data: {
            doodadId: randomDoodad.id,
            doodadName: randomDoodad.name,
            type: "doodad"
          },
          turn_number: player.current_turn
        })

        return NextResponse.json({
          isDoodad: true,
          doodad: randomDoodad
        })
      }
    }

    if (isMarketEvent) {
      console.log("📉 Drawing market event...")
      // Get random market event
      const { data: marketCards, error: marketError } = await (supabase as any)
        .from('market_cards')
        .select('*')
        .eq('is_active', true)

      if (marketError) {
        console.error("❌ Error fetching market cards:", marketError)
      }

      if (marketCards && marketCards.length > 0) {
        const marketEvent = marketCards[Math.floor(Math.random() * marketCards.length)]
        let cashChange = 0
        let message = ""
        const profession = player.professions

        // Apply market event effects
        switch (marketEvent.type) {
          case "baby":
            await (supabase as any)
              .from('players')
              .update({ num_children: player.num_children + 1 })
              .eq('id', player.id)
            message = `¡Nació un bebé! Ahora tienes ${player.num_children + 1} hijo(s). Tus gastos mensuales aumentan $${profession.child_expense}.`
            break

          case "downsized":
            cashChange = -(profession.salary * 2)
            await (supabase as any)
              .from('players')
              .update({ cash_on_hand: player.cash_on_hand + cashChange })
              .eq('id', player.id)
            message = `¡Te despidieron! Pierdes 2 turnos de salario (-$${Math.abs(cashChange).toLocaleString()}).`
            break

          case "charity":
            const donation = Math.floor(profession.salary * 0.1)
            cashChange = -donation
            await (supabase as any)
              .from('players')
              .update({ cash_on_hand: player.cash_on_hand + cashChange })
              .eq('id', player.id)
            message = `Donas a caridad. Contribuyes $${Math.abs(cashChange).toLocaleString()} y recibes beneficios fiscales.`
            break

          case "paycheck":
            cashChange = profession.salary
            await (supabase as any)
              .from('players')
              .update({ cash_on_hand: player.cash_on_hand + cashChange })
              .eq('id', player.id)
            message = `¡Día de pago extra! Recibes tu salario mensual de $${cashChange.toLocaleString()}.`
            break

          default:
            message = marketEvent.description
        }

        // Log market event
        await (supabase as any).from('game_events').insert({
          game_session_id: gameId,
          player_id: player.id,
          event_type: "market_event",
          event_data: {
            eventId: marketEvent.id,
            eventName: marketEvent.name,
            eventType: marketEvent.type
          },
          cash_change: cashChange,
          turn_number: player.current_turn
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
    const isOnFastTrack = player.is_on_fast_track
    const { data: cards, error: cardsError } = await (supabase as any)
      .from('opportunity_cards')
      .select('*')
      .eq('is_active', true)
      .eq('is_fast_track', isOnFastTrack)

    if (cardsError || !cards || cards.length === 0) {
      return NextResponse.json({ error: "No cards available" }, { status: 404 })
    }

    const card = cards[Math.floor(Math.random() * cards.length)]
    const translatedCard = translateOpportunityCard(card)

    await (supabase as any).from('game_events').insert({
      game_session_id: gameId,
      player_id: player.id,
      event_type: "opportunity_drawn",
      event_data: { cardId: card.id, cardName: card.name },
      turn_number: player.current_turn
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
