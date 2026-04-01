import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSupabaseServer } from '@/lib/supabase/server';
import { stockOrderSchema } from '@/validators/stocks';

export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    
    // 1. Validation (Allow-listing, Types & Range)
    const validation = stockOrderSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json({ 
        error: "Parámetros de orden inválidos", 
        details: validation.error.format() 
      }, { status: 400 });
    }

    const { symbol, side, order_type, quantity, limit_price } = validation.data;

    // Validate symbol against allowlist
    const activeSymbol = await prisma.market_symbols.findFirst({
        where: { symbol, is_active: true }
    });

    if (!activeSymbol) {
      return NextResponse.json({ error: "Símbolo no permitido o inactivo" }, { status: 400 });
    }

    let portfolio = await prisma.simulator_portfolios.findFirst({
      where: { user_id: user.id },
      include: {
        holdings: true
      }
    });

    if (!portfolio) {
      return NextResponse.json({ error: "Portafolio no encontrado" }, { status: 404 });
    }

    // Validation for sell: checking holdings
    if (side === 'sell') {
      const holding = portfolio.holdings.find(h => h.symbol === symbol);
      if (!holding || Number(holding.quantity) < quantity) {
        return NextResponse.json({ error: "Fondos insuficientes para vender" }, { status: 400 });
      }
    }

    // Creating pending order
    const order = await prisma.simulator_orders.create({
      data: {
        portfolio_id: portfolio.id,
        symbol,
        side, 
        order_type,
        quantity,
        limit_price: limit_price || null,
        status: 'pending' 
      }
    });

    // ⚡️ INSTANT EXECUTION for Market Orders ⚡️
    if (order_type === 'market') {
      try {
        await fetch(`${new URL(req.url).origin}/api/simulators/stocks/execute`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (err) {
        console.error("Auto-execution failed:", err);
      }
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    // 2. Safe Failure
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "No se pudo procesar la orden" }, { status: 500 });
  }
}
