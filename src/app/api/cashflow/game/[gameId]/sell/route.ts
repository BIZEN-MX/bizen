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

    const { investmentId, salePrice } = await request.json()
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

    // Get investment with card details
    const { data: investment } = await supabase
      .from('player_investments')
      .select('*, opportunity_cards(*)')
      .eq('id', investmentId)
      .eq('player_id', player.id)
      .single()

    if (!investment || investment.is_sold) {
      return NextResponse.json({ error: "Investment not found or already sold" }, { status: 404 })
    }

    const card = investment.opportunity_cards
    const minPrice = card.min_sale_price || 0
    const maxPrice = card.max_sale_price || investment.purchase_price

    if (salePrice < minPrice || salePrice > maxPrice) {
      return NextResponse.json({ error: "Sale price out of range" }, { status: 400 })
    }

    // Mark as sold
    await supabase
      .from('player_investments')
      .update({
        is_sold: true,
        sold_at: new Date().toISOString(),
        sale_price: salePrice
      })
      .eq('id', investmentId)

    // Calculate profit/loss
    const profit = salePrice - investment.purchase_price
    const cashChange = salePrice - (investment.mortgage_amount || 0)

    // Update player cash and passive income
    const newPassiveIncome = player.passive_income - (investment.current_cash_flow || 0)
    
    await supabase
      .from('players')
      .update({
        cash_on_hand: player.cash_on_hand + cashChange,
        passive_income: Math.max(0, newPassiveIncome)
      })
      .eq('id', player.id)

    // Log sale event
    await supabase.from('game_events').insert({
      game_session_id: gameId,
      player_id: player.id,
      event_type: "investment_sold",
      event_data: {
        investmentId,
        cardName: card.name,
        salePrice,
        profit
      },
      cash_change: cashChange,
      cash_flow_change: -(investment.current_cash_flow || 0),
      turn_number: player.current_turn
    })

    return NextResponse.json({
      message: "Investment sold successfully",
      profit,
      newCash: player.cash_on_hand + cashChange,
      newPassiveIncome
    })

  } catch (error) {
    console.error("Error selling investment:", error)
    return NextResponse.json({ error: "Failed to sell investment" }, { status: 500 })
  }
}
