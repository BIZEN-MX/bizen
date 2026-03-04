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

    const gameId = parseInt(params.gameId)

    // Get player with all related data
    const { data: player } = await supabase
      .from('players')
      .select('*, professions(*)')
      .eq('game_session_id', gameId)
      .eq('user_id', user.id)
      .single()

    if (!player) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 })
    }

    // Get active investments
    const { data: investments } = await supabase
      .from('player_investments')
      .select('*')
      .eq('player_id', player.id)
      .eq('is_sold', false)

    // Get unpaid liabilities
    const { data: liabilities } = await supabase
      .from('player_liabilities')
      .select('*')
      .eq('player_id', player.id)
      .eq('is_paid_off', false)

    // Calculate investment income
    const investmentIncome = investments?.reduce((sum, inv) => sum + (inv.current_cash_flow || 0), 0) || 0

    // Calculate loan payments
    const loanPayments = liabilities?.reduce((sum, l) => sum + l.monthly_payment, 0) || 0

    const profession = player.professions
    const totalExpenses = 
      profession.taxes +
      profession.home_mortgage_payment +
      profession.school_loan_payment +
      profession.car_loan_payment +
      profession.credit_card_payment +
      profession.retail_payment +
      profession.other_expenses +
      (profession.child_expense * player.num_children) +
      loanPayments

    const monthlyCashFlow = profession.salary + investmentIncome - totalExpenses

    // Update player
    await supabase
      .from('players')
      .update({
        cash_on_hand: player.cash_on_hand + monthlyCashFlow,
        current_turn: player.current_turn + 1,
        passive_income: investmentIncome,
        total_income: profession.salary + investmentIncome,
        total_expenses: totalExpenses,
        cash_flow: monthlyCashFlow
      })
      .eq('id', player.id)

    // Update game session
    await supabase
      .from('game_sessions')
      .update({
        total_turns: player.current_turn + 1,
        last_activity_at: new Date().toISOString()
      })
      .eq('id', gameId)

    // Log turn end event
    await supabase.from('game_events').insert({
      game_session_id: gameId,
      player_id: player.id,
      event_type: "turn_ended",
      event_data: {
        salary: profession.salary,
        investmentIncome,
        totalExpenses,
        cashFlow: monthlyCashFlow
      },
      cash_change: monthlyCashFlow,
      turn_number: player.current_turn + 1
    })

    return NextResponse.json({
      message: "Turn ended successfully",
      newCash: player.cash_on_hand + monthlyCashFlow,
      cashFlow: monthlyCashFlow,
      newTurn: player.current_turn + 1
    })

  } catch (error) {
    console.error("Error ending turn:", error)
    return NextResponse.json({ error: "Failed to end turn" }, { status: 500 })
  }
}
