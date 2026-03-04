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

    const { liabilityId } = await request.json()
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

    // Get liability
    const { data: liability } = await supabase
      .from('player_liabilities')
      .select('*')
      .eq('id', liabilityId)
      .eq('player_id', player.id)
      .single()

    if (!liability || liability.is_paid_off) {
      return NextResponse.json({ error: "Liability not found or already paid" }, { status: 404 })
    }

    // Check if player has enough cash
    if (player.cash_on_hand < liability.remaining_balance) {
      return NextResponse.json({ error: "Not enough cash to pay off loan" }, { status: 400 })
    }

    // Mark as paid off
    await supabase
      .from('player_liabilities')
      .update({
        is_paid_off: true,
        remaining_balance: 0,
        paid_off_at: new Date().toISOString()
      })
      .eq('id', liabilityId)

    // Update player cash
    await supabase
      .from('players')
      .update({ cash_on_hand: player.cash_on_hand - liability.remaining_balance })
      .eq('id', player.id)

    // Log payment event
    await supabase.from('game_events').insert({
      game_session_id: gameId,
      player_id: player.id,
      event_type: "loan_paid",
      event_data: {
        liabilityId,
        amount: liability.remaining_balance
      },
      cash_change: -liability.remaining_balance,
      turn_number: player.current_turn
    })

    return NextResponse.json({
      message: "Loan paid off successfully",
      newCash: player.cash_on_hand - liability.remaining_balance
    })

  } catch (error) {
    console.error("Error paying loan:", error)
    return NextResponse.json({ error: "Failed to pay loan" }, { status: 500 })
  }
}
