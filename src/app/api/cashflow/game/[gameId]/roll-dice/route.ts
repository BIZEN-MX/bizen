import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"

const BOARD_SPACES = [
  'payday', 'opportunity', 'market', 'opportunity', 'doodad', 'opportunity',
  'charity', 'opportunity', 'market', 'opportunity', 'baby', 'opportunity',
  'payday', 'opportunity', 'market', 'opportunity', 'doodad', 'opportunity',
  'charity', 'opportunity', 'market', 'opportunity', 'baby', 'opportunity'
]

export async function POST(
  request: NextRequest,
  { params }: { params: { gameId: string } }
) {
  try {
    console.log("🎲 Roll dice API called")
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("❌ Auth error:", authError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { diceRoll } = await request.json()
    const gameId = parseInt(params.gameId)
    console.log("🎲 Dice roll:", diceRoll)

    // Get player
    const { data: player, error: playerError } = await supabase
      .from('players')
      .select('*')
      .eq('game_session_id', gameId)
      .eq('user_id', user.id)
      .single()

    if (playerError || !player) {
      console.error("❌ Player fetch error:", playerError)
      return NextResponse.json({ error: "Player not found" }, { status: 404 })
    }

    console.log("✅ Player found:", { currentPosition: player.current_turn % 24 })

    // Calculate new position (circular board)
    const currentPosition = player.current_turn % 24
    const newPosition = (currentPosition + diceRoll) % 24
    const landedSpace = BOARD_SPACES[newPosition]

    console.log("📍 New position:", newPosition, "Space type:", landedSpace)

    // Check if passed Payday (position 0)
    const passedPayday = newPosition < currentPosition || (currentPosition + diceRoll >= 24)
    
    let cashChange = 0
    let message = ""

    // Handle Payday if passed
    if (passedPayday && landedSpace !== 'payday') {
      const { data: profession } = await supabase
        .from('professions')
        .select('*')
        .eq('id', player.profession_id)
        .single()

      if (profession) {
        const paydayAmount = profession.salary + player.passive_income
        cashChange += paydayAmount
        message += `¡Pasaste por Payday! +$${paydayAmount.toLocaleString()}\n`
        console.log("💵 Passed Payday:", paydayAmount)
      }
    }

    // Handle landing on Payday
    if (landedSpace === 'payday') {
      const { data: profession } = await supabase
        .from('professions')
        .select('*')
        .eq('id', player.profession_id)
        .single()

      if (profession) {
        const paydayAmount = profession.salary + player.passive_income
        cashChange += paydayAmount
        message = `💵 ¡Payday! Recibiste $${paydayAmount.toLocaleString()}`
        console.log("💵 Landed on Payday:", paydayAmount)
      }
    }

    // Update player position and cash
    const { error: updateError } = await supabase
      .from('players')
      .update({ 
        cash_on_hand: player.cash_on_hand + cashChange,
        current_turn: player.current_turn + 1
      })
      .eq('id', player.id)

    if (updateError) {
      console.error("❌ Error updating player:", updateError)
      return NextResponse.json({ error: "Failed to update player" }, { status: 500 })
    }

    console.log("✅ Player updated successfully")

    // Log the dice roll event
    await supabase.from('game_events').insert({
      game_session_id: gameId,
      player_id: player.id,
      event_type: "turn_started",
      event_data: {
        diceRoll,
        oldPosition: currentPosition,
        newPosition,
        landedSpace,
        passedPayday
      },
      cash_change: cashChange,
      turn_number: player.current_turn + 1
    })

    return NextResponse.json({
      success: true,
      diceRoll,
      newPosition,
      landedSpace,
      passedPayday,
      cashChange,
      message,
      newCash: player.cash_on_hand + cashChange
    })

  } catch (error) {
    console.error("❌ Error rolling dice:", error)
    return NextResponse.json({ 
      error: "Failed to roll dice",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}

