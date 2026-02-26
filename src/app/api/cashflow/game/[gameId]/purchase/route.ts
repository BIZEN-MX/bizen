import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"
import { awardXp } from "@/lib/rewards"

export async function POST(
  request: NextRequest,
  { params }: { params: { gameId: string } }
) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { opportunityCardId } = await request.json()
    const gameId = parseInt(params.gameId)

    // Get player with profession
    const { data: players } = await supabase
      .from('players')
      .select('*, professions(*)')
      .eq('game_session_id', gameId)
      .eq('user_id', user.id)
      .single()

    const player = players
    if (!player) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 })
    }

    // Get opportunity card
    const { data: card } = await supabase
      .from('opportunity_cards')
      .select('*')
      .eq('id', opportunityCardId)
      .single()

    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 })
    }

    const purchaseCost = card.down_payment || card.cost

    if (player.cash_on_hand < purchaseCost) {
      return NextResponse.json({ error: "Not enough cash" }, { status: 400 })
    }

    // Create investment
    const { data: investment } = await supabase
      .from('player_investments')
      .insert({
        player_id: player.id,
        opportunity_card_id: card.id,
        purchase_price: card.cost,
        down_payment_paid: card.down_payment,
        mortgage_amount: card.mortgage,
        shares_owned: card.shares || 1,
        current_cash_flow: card.cash_flow || 0
      })
      .select()
      .single()

    const newPassiveIncome = player.passive_income + (card.cash_flow || 0)

    // Update player
    await supabase
      .from('players')
      .update({
        cash_on_hand: player.cash_on_hand - purchaseCost,
        passive_income: newPassiveIncome
      })
      .eq('id', player.id)

    // Log purchase event
    await supabase.from('game_events').insert({
      game_session_id: gameId,
      player_id: player.id,
      event_type: "investment_purchased",
      event_data: {
        cardId: card.id,
        cardName: card.name,
        cardType: card.type,
        purchasePrice: card.cost,
        cashFlow: card.cash_flow
      },
      cash_change: -purchaseCost,
      cash_flow_change: card.cash_flow || 0,
      turn_number: player.current_turn
    })

    // Check if escaped rat race
    const profession = player.professions
    const totalExpenses =
      profession.taxes +
      profession.home_mortgage_payment +
      profession.school_loan_payment +
      profession.car_loan_payment +
      profession.credit_card_payment +
      profession.retail_payment +
      profession.other_expenses +
      (profession.child_expense * player.num_children)

    let rewards = null
    if (newPassiveIncome > totalExpenses && !player.has_escaped_rat_race) {
      await supabase
        .from('players')
        .update({
          has_escaped_rat_race: true,
          is_on_fast_track: true,
          escaped_at: new Date().toISOString()
        })
        .eq('id', player.id)

      await supabase.from('game_events').insert({
        game_session_id: gameId,
        player_id: player.id,
        event_type: "escaped_rat_race",
        event_data: { passiveIncome: newPassiveIncome, totalExpenses },
        turn_number: player.current_turn
      })

      rewards = await awardXp(user.id, 150) // Massive bonus for winning cashflow
    }

    return NextResponse.json({
      message: "Investment purchased successfully",
      investment,
      newCash: player.cash_on_hand - purchaseCost,
      newPassiveIncome,
      rewards
    })

  } catch (error) {
    console.error("Error purchasing investment:", error)
    return NextResponse.json({ error: "Failed to purchase investment" }, { status: 500 })
  }
}
