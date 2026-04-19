import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { professionId } = await request.json()

    if (!professionId) {
      return NextResponse.json(
        { error: "Profession ID is required" },
        { status: 400 }
      )
    }

    // Get profession details
    const { data: profession, error: profError } = await supabase
      .from('professions')
      .select('*')
      .eq('id', professionId)
      .single()

    if (profError || !profession) {
      return NextResponse.json(
        { error: "Profession not found" },
        { status: 404 }
      )
    }

    // Create game session
    const { data: gameSession, error: gameError } = await supabase
      .from('game_sessions')
      .insert({
        user_id: user.id,
        status: "active",
        current_phase: "rat_race",
        total_turns: 0
      })
      .select()
      .single()

    if (gameError) throw gameError

    // Create player
    const { data: player, error: playerError } = await supabase
      .from('players')
      .insert({
        game_session_id: gameSession.id,
        user_id: user.id,
        profession_id: profession.id,
        cash_on_hand: profession.starting_cash,
        savings: profession.starting_savings,
        num_children: 0,
        current_position: 0,
        current_turn: 1,
        passive_income: 0
      })
      .select()
      .single()

    if (playerError) throw playerError

    // Log game start event
    const { error: eventError } = await supabase
      .from('game_events')
      .insert({
        game_session_id: gameSession.id,
        player_id: player.id,
        event_type: "game_started",
        event_data: {
          professionId: profession.id,
          professionName: profession.name
        },
        turn_number: 1
      })

    if (eventError) throw eventError

    return NextResponse.json({
      gameId: gameSession.id,
      playerId: player.id,
      message: "Game started successfully"
    })

  } catch (error) {
    console.error("Error starting game:", error)
    return NextResponse.json(
      { error: "Failed to start game" },
      { status: 500 }
    )
  }
}

