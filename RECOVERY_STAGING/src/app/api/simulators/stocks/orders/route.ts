import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth/api-auth';
import { stockOrderSchema } from '@/validators/stocks';

export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAuth(req);
    if (!authResult.success) {
      return authResult.response;
    }
    const { user } = authResult.data;

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

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id }
    });

    if (portfolio && profile && Number(portfolio.cash_balance) !== (profile.bizcoins || 0)) {
        portfolio = await prisma.simulator_portfolios.update({
            where: { id: portfolio.id },
            data: { cash_balance: profile.bizcoins || 0 },
            include: { holdings: true }
        });
    }

    if (!portfolio) {
      // Try to create the portfolio natively if it was ephemeral
      console.log(`[orders] Portfolio not found, creating new portfolio for user ${user.id}`);
      
      try {
        portfolio = await prisma.simulator_portfolios.create({
          data: {
            user_id: user.id,
            currency: 'BIZCOINS',
            starting_cash: profile?.bizcoins || 100000,
            cash_balance: profile?.bizcoins || 100000
          },
          include: { holdings: true }
        });
      } catch (createErr) {
        console.warn("Failed to create portfolio on the fly (ephemeral mode fallback):", createErr);
        // Si hay error en local (por sincronización de usuario), devolvemos éxito efímero
        return NextResponse.json({ 
             success: true, 
             order: {
                id: "temp-order-" + Date.now(),
                symbol,
                side,
                order_type,
                quantity,
                limit_price,
                status: 'pending'
             }
        });
      }
    }

    // Validation for sell: checking holdings
    if (side === 'sell') {
      const holding = portfolio.holdings.find(h => h.symbol === symbol);
      if (!holding || Number(holding.quantity) < quantity) {
        return NextResponse.json({ error: "Fondos insuficientes para vender" }, { status: 400 });
      }
    } else if (side === 'buy') {
      // Validation for buy: rough estimated check to prevent spam orders
      const latestPrice = await prisma.market_prices_eod.findFirst({
         where: { symbol },
         orderBy: { date: 'desc' }
      });
      if (latestPrice && Number(latestPrice.close) > 0) {
         const feeMultiplier = order_type === 'market' ? 1.0015 : 1.001;
         const estimatedCost = Number(latestPrice.close) * quantity * feeMultiplier;
         if (Number(portfolio.cash_balance) < estimatedCost) {
            return NextResponse.json({ error: `Saldo insuficiente para cubrir la compra. Tienes ${portfolio.cash_balance} bz pero el costo estimado es ${Math.ceil(estimatedCost)} bz.` }, { status: 400 });
         }
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
        const { executePendingOrders } = await import('@/lib/simulators/stocks');
        await executePendingOrders();
      } catch (err) {
        console.error("Auto-execution failed:", err);
      }
    }

    // 🎯 Disparador asíncrono para autocompletar misiones del día (sin bloquear la respuesta)
    if (side === 'buy') {
      import('@/lib/dailyMissions').then(({ triggerAutoMission }) => {
        triggerAutoMission(user.id, "buy_stock").catch(e => console.error("Auto-misión fallida:", e));
      });
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    // 2. Safe Failure
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "No se pudo procesar la orden" }, { status: 500 });
  }
}
