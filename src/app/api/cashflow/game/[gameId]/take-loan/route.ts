import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"

export async function POST(
  request: NextRequest,
  { params }: { params: { gameId: string } }
) {
  try {
    console.log("🏦 Take loan API called")
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("❌ Auth error:", authError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { amount, type, description, interestRate } = await request.json()
    console.log("💰 Loan request:", { amount, type, description, interestRate })
    const gameId = parseInt(params.gameId)

    // Get player
    const { data: player, error: playerError } = await supabase
      .from('players')
      .select('*')
      .eq('game_session_id', gameId)
      .eq('user_id', user.id)
      .single()

    if (playerError || !player) {
      console.error("❌ Player fetch error:", playerError)
      return NextResponse.json({ error: "Player not found", details: playerError?.message }, { status: 404 })
    }

    console.log("✅ Player found:", { playerId: player.id, currentCash: player.cash_on_hand })

    // Calculate monthly payment (10% interest annually, divided by 12 months)
    const monthlyPayment = Math.ceil(amount * (interestRate || 10) / 100 / 12)
    console.log("📊 Calculated monthly payment:", monthlyPayment)

    // Create liability
    const { data: liability, error: liabilityError } = await supabase
      .from('player_liabilities')
      .insert({
        player_id: player.id,
        type: type || 'bank_loan',
        description: description || `Préstamo bancario de $${amount.toLocaleString()}`,
        principal_amount: amount,
        remaining_balance: amount,
        interest_rate: interestRate || 10,
        monthly_payment: monthlyPayment
      })
      .select()
      .single()

    if (liabilityError) {
      console.error("❌ Error creating liability:", liabilityError)
      return NextResponse.json({ 
        error: "Failed to create loan",
        details: liabilityError.message 
      }, { status: 500 })
    }

    console.log("✅ Liability created:", liability.id)

    // Update player cash
    const newCash = player.cash_on_hand + amount
    const { error: updateError } = await supabase
      .from('players')
      .update({ cash_on_hand: newCash })
      .eq('id', player.id)

    if (updateError) {
      console.error("❌ Error updating player cash:", updateError)
      return NextResponse.json({ 
        error: "Failed to update cash",
        details: updateError.message 
      }, { status: 500 })
    }

    console.log("✅ Player cash updated:", { oldCash: player.cash_on_hand, newCash })

    // Log loan event
    const { error: eventError } = await supabase.from('game_events').insert({
      game_session_id: gameId,
      player_id: player.id,
      event_type: "loan_taken",
      event_data: {
        amount,
        type,
        monthlyPayment
      },
      cash_change: amount,
      turn_number: player.current_turn
    })

    if (eventError) {
      console.warn("⚠️ Error logging event (non-critical):", eventError.message)
    }

    console.log(`✅ Loan taken successfully:`, { amount, newCash, monthlyPayment })
    return NextResponse.json({
      success: true,
      message: "Loan taken successfully",
      liability,
      newCash,
      amount,
      monthlyPayment
    })

  } catch (error) {
    console.error("❌ Error taking loan:", error)
    return NextResponse.json({ 
      error: "Failed to take loan",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
