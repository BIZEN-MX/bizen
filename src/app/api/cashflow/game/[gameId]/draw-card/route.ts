import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"

export async function POST(
  request: NextRequest,
  { params }: { params: { gameId: string } }
) {
  try {
    console.log("🎴 Draw card API called")
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("❌ Auth error:", authError)
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const gameId = parseInt(params.gameId)
    console.log("🎲 Game ID:", gameId)

    // Verify game belongs to user and get player
    const { data: gameSession, error: sessionError } = await supabase
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

    const { data: players, error: playersError } = await supabase
      .from('players')
      .select('*, professions(*)')
      .eq('game_session_id', gameId)
      .eq('user_id', user.id)

    const player = players?.[0]
    if (playersError || !player) {
      console.error("❌ Player fetch error:", playersError)
      return NextResponse.json({ error: "Player not found", details: playersError?.message }, { status: 404 })
    }

    console.log("✅ Player found:", { playerId: player.id, isOnFastTrack: player.is_on_fast_track })

    // Random card type: 15% doodad, 20% market event, 65% opportunity
    const rand = Math.random()
    const isDoodad = rand < 0.15
    const isMarketEvent = rand >= 0.15 && rand < 0.35

    if (isDoodad) {
      console.log("🎰 Drawing doodad...")
      // Get random doodad
      const { data: doodads, count, error: doodadError } = await supabase
        .from('doodads')
        .select('*', { count: 'exact' })
        .eq('is_active', true)

      if (doodadError) {
        console.error("❌ Error fetching doodads:", doodadError)
      }

      if (doodads && doodads.length > 0) {
        const randomDoodad = doodads[Math.floor(Math.random() * doodads.length)]
        console.log("✅ Doodad drawn:", randomDoodad.name)

        // Log doodad drawn
        await supabase.from('game_events').insert({
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
      } else {
        console.warn("⚠️ No doodads found, falling through to opportunity cards")
      }
    }

    if (isMarketEvent) {
      console.log("📉 Drawing market event...")
      // Get random market event
      const { data: marketCards, error: marketError } = await supabase
        .from('market_cards')
        .select('*')
        .eq('is_active', true)

      if (marketError) {
        console.error("❌ Error fetching market cards:", marketError)
      }

      if (marketCards && marketCards.length > 0) {
        console.log(`✅ Found ${marketCards.length} market cards`)
        const marketEvent = marketCards[Math.floor(Math.random() * marketCards.length)]
        let cashChange = 0
        let message = ""
        const profession = player.professions

        // Apply market event effects
        switch (marketEvent.type) {
          case "baby":
            await supabase
              .from('players')
              .update({ num_children: player.num_children + 1 })
              .eq('id', player.id)
            message = `¡Nació un bebé! Ahora tienes ${player.num_children + 1} hijo(s). Tus gastos mensuales aumentan $${profession.child_expense}.`
            break

          case "downsized":
            cashChange = -(profession.salary * 2)
            await supabase
              .from('players')
              .update({ cash_on_hand: player.cash_on_hand + cashChange })
              .eq('id', player.id)
            message = `¡Te despidieron! Pierdes 2 turnos de salario (-$${Math.abs(cashChange).toLocaleString()}).`
            break

          case "charity":
            const donation = Math.floor(profession.salary * 0.1)
            cashChange = -donation
            await supabase
              .from('players')
              .update({ cash_on_hand: player.cash_on_hand + cashChange })
              .eq('id', player.id)
            message = `Donas a caridad. Contribuyes $${Math.abs(cashChange).toLocaleString()} y recibes beneficios fiscales.`
            break

          case "paycheck":
            cashChange = profession.salary
            await supabase
              .from('players')
              .update({ cash_on_hand: player.cash_on_hand + cashChange })
              .eq('id', player.id)
            message = `¡Día de pago extra! Recibes tu salario mensual de $${cashChange.toLocaleString()}.`
            break

          default:
            message = marketEvent.description
        }

        // Get updated player
        const { data: updatedPlayers } = await supabase
          .from('players')
          .select('num_children')
          .eq('id', player.id)
          .single()

        // Log market event
        await supabase.from('game_events').insert({
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

        return NextResponse.json({
          isMarketEvent: true,
          marketEvent: {
            ...marketEvent,
            message
          },
          cashChange,
          newChildren: updatedPlayers?.num_children
        })
      }
    }

    // Get random opportunity card (filter by phase)
    const isOnFastTrack = player.is_on_fast_track
    console.log(`🃏 Drawing opportunity card (Fast Track: ${isOnFastTrack})...`)
    
    // Filter cards based on game phase
    // Rat Race players get basic cards, Fast Track players get advanced cards
    const { data: cards, error: cardsError } = await supabase
      .from('opportunity_cards')
      .select('*')
      .eq('is_active', true)
      .eq('is_fast_track', isOnFastTrack)

    if (cardsError) {
      console.error("❌ Error fetching opportunity cards:", cardsError)
      return NextResponse.json({ 
        error: "Failed to fetch opportunity cards",
        details: cardsError.message 
      }, { status: 500 })
    }

    if (!cards || cards.length === 0) {
      console.error("❌ No opportunity cards available")
      return NextResponse.json({ error: "No cards available for this phase" }, { status: 404 })
    }

    console.log(`✅ Found ${cards.length} opportunity cards`)
    const card = cards[Math.floor(Math.random() * cards.length)]

    // Log the draw event
    const { error: eventError } = await supabase.from('game_events').insert({
      game_session_id: gameId,
      player_id: player.id,
      event_type: "opportunity_drawn",
      event_data: {
        cardId: card.id,
        cardName: card.name,
        cardType: card.type
      },
      turn_number: player.current_turn
    })

    if (eventError) {
      console.warn("⚠️ Error logging event (non-critical):", eventError.message)
    }

    console.log(`✅ Card drawn successfully:`, { cardId: card.id, cardName: card.name, cardType: card.type })
    return NextResponse.json({ isDoodad: false, isMarketEvent: false, card })

  } catch (error) {
    console.error("❌ Error drawing card:", error)
    return NextResponse.json(
      { error: "Failed to draw card", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
