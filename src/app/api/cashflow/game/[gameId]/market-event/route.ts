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

    const { eventType, eventData } = await request.json()
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

    // Log market event
    await supabase.from('game_events').insert({
      game_session_id: gameId,
      player_id: player.id,
      event_type: eventType || "market_event",
      event_data: eventData || {},
      turn_number: player.current_turn
    })

    return NextResponse.json({ message: "Market event processed successfully" })

  } catch (error) {
    console.error("Error processing market event:", error)
    return NextResponse.json({ error: "Failed to process market event" }, { status: 500 })
  }
}
