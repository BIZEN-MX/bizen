import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSupabaseServer } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { symbol, side, order_type, quantity, limit_price } = await req.json();

    if (!symbol || !side || !order_type || !quantity || quantity <= 0) {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    // Validate symbol against allowlist
    const activeSymbol = await prisma.market_symbols.findFirst({
        where: { symbol, is_active: true }
    });

    if (!activeSymbol) {
      return NextResponse.json({ error: "Symbol not allowed or inactive" }, { status: 400 });
    }

    let portfolio = await prisma.simulator_portfolios.findFirst({
      where: { user_id: user.id },
      include: {
        holdings: true
      }
    });

    if (!portfolio) {
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
    }

    // Optional constraint: checking daily trading limit, e.g. 5 orders max? 
    // Let's just create the order for now.
    
    // We might want to validate cash balance / holding amounts now. But prices fluctuate, so standard sim just rejects execution later if insufficient funds.
    // However, for immediate user feedback on sell:
    if (side === 'sell') {
      const holding = portfolio.holdings.find(h => h.symbol === symbol);
      if (!holding || Number(holding.quantity) < quantity) {
        return NextResponse.json({ error: "Insufficient holdings to sell" }, { status: 400 });
      }
    }

    // Creating pending order
    const order = await prisma.simulator_orders.create({
      data: {
        portfolio_id: portfolio.id,
        symbol,
        side, // 'buy' | 'sell'
        order_type, // 'market' | 'limit'
        quantity,
        limit_price: limit_price || null,
        status: 'pending' // pending until filled
      }
    });

    // ⚡️ INSTANT EXECUTION for Market Orders ⚡️
    // If it's a market order, we try to fill it immediately using the latest EOD price.
    if (order_type === 'market') {
      try {
        const res = await fetch(`${new URL(req.url).origin}/api/simulators/stocks/execute`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        if (res.ok) {
           console.log(`✅ Auto-executed market order ${order.id}`);
        }
      } catch (err) {
        console.error("Auto-execution failed:", err);
      }
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
