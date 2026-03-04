import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { doodadId } = await request.json()
    const gameId = parseInt(params.gameId)

    // Get player
    const { data: player } = await supabase
      .from('players')
      .select('*')
      .eq('game_session_id', gameId)
      .eq('user_id', user.id)
      .single()

    if (!player) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 })
    }

    // Get doodad
    const { data: doodad } = await supabase
      .from('doodads')
      .select('*')
      .eq('id', doodadId)
      .single()

    if (!doodad) {
      return NextResponse.json({ error: "Doodad not found" }, { status: 404 })
    }

    // Check if player has enough cash
    if (player.cash_on_hand < doodad.cost) {
      return NextResponse.json({ error: "Not enough cash" }, { status: 400 })
    }

    // Create player doodad record
    await supabase
      .from('player_doodads')
      .insert({
        player_id: player.id,
        doodad_id: doodad.id,
        name: doodad.name,
        description: doodad.description,
        cost: doodad.cost
      })

    // Update player cash
    await supabase
      .from('players')
      .update({ cash_on_hand: player.cash_on_hand - doodad.cost })
      .eq('id', player.id)

    // Log doodad purchase
    await supabase.from('game_events').insert({
      game_session_id: gameId,
      player_id: player.id,
      event_type: "doodad_purchased",
      event_data: {
        doodadId: doodad.id,
        doodadName: doodad.name,
        cost: doodad.cost
      },
      cash_change: -doodad.cost,
      turn_number: player.current_turn
    })

    return NextResponse.json({
      message: "Doodad purchased successfully",
      newCash: player.cash_on_hand - doodad.cost
    })

  } catch (error) {
    console.error("Error buying doodad:", error)
    return NextResponse.json({ error: "Failed to buy doodad" }, { status: 500 })
  }
}
