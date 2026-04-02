import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// This is an internal CRON job or edge function to trigger order execution 
// using the stored EOD prices.

const API_CRON_SECRET = process.env.API_CRON_SECRET || 'dev-secret-key';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${API_CRON_SECRET}` && process.env.NODE_ENV !== 'development') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Fetch pending orders
    const pendingOrders = await prisma.simulator_orders.findMany({
      where: { status: 'pending' },
      include: { portfolio: true }
    });

    if (!pendingOrders.length) {
      return NextResponse.json({ executed: 0, message: "No pending orders" });
    }

    // 2. Fetch the latest EOD prices for the symbols included
    const symbolsToFetch = Array.from(new Set(pendingOrders.map(o => o.symbol)));
    
    // In reality, this table requires seeded data daily. We will grab the latest date per symbol.
    const latestPrices = await prisma.market_prices_eod.findMany({
      where: { symbol: { in: symbolsToFetch } },
      orderBy: { date: 'desc' },
      distinct: ['symbol'] // PostgreSQL extension, works for Supabase
    });

    const priceMap = new Map();
    latestPrices.forEach(p => {
        priceMap.set(p.symbol, p);
    });

    let executedCount = 0;
    
    // Execute sequentially for simplicity/transactionality
    for (const order of pendingOrders) {
      const priceRecord = priceMap.get(order.symbol);
      if (!priceRecord) continue; // No price data, skip until tomorrow

      const open = Number(priceRecord.open);
      const high = Number(priceRecord.high);
      const low = Number(priceRecord.low);
      const close = Number(priceRecord.close);
      
      let executionPrice = 0;
      let shouldExecute = false;

      // Rules: market fills at close (EOD).
      // Limit fills if the limit price was breached.
      if (order.order_type === 'market') {
          shouldExecute = true;
          executionPrice = close;
      } else if (order.order_type === 'limit' && order.limit_price) {
          const limitPrice = Number(order.limit_price);
          if (order.side === 'buy' && low <= limitPrice) {
              shouldExecute = true;
              executionPrice = limitPrice; 
          } else if (order.side === 'sell' && high >= limitPrice) {
              shouldExecute = true;
              executionPrice = limitPrice;
          }
      }

      if (shouldExecute) {
        // 1:10 Ratio -> 1 USD = 10 Bizcoins
        const bizcoinMultiplier = 10;
        const executionPriceBizcoins = executionPrice * bizcoinMultiplier;
        const notional = Number(order.quantity) * executionPriceBizcoins;
        
        // Slippage & fees in Bizcoins
        const slippage = order.order_type === 'market' ? notional * 0.0005 : 0;
        const totalFees = (notional * 0.001) + slippage; // 0.1% fee + slippage
        
        // Execute inside a prisma transaction to ensure balance, profile & holdings integrity
        await prisma.$transaction(async (tx) => {
            const currentPortfolio = await tx.simulator_portfolios.findUnique({
              where: { id: order.portfolio_id },
              include: { holdings: true }
            });

            if (!currentPortfolio) throw new Error("Portfolio not found");

            const profile = await tx.profile.findUnique({
              where: { userId: currentPortfolio.user_id }
            });

            if (!profile) throw new Error("User profile not found");

            const currentCash = profile.bizcoins || 0;
            let cashAdjustment = 0;
            let qtyAdjustment = 0;

            if (order.side === 'buy') {
               const totalCost = notional + totalFees;
               if (currentCash < totalCost) {
                  // Insufficient funds -> Cancel order
                  await tx.simulator_orders.update({
                      where: { id: order.id },
                      data: { status: 'cancelled' }
                  });
                  return; // Stop transaction block for this iteration
               }
               cashAdjustment = -totalCost;
               qtyAdjustment = Number(order.quantity);
            } else if (order.side === 'sell') {
               const holding = currentPortfolio.holdings.find(h => h.symbol === order.symbol);
               if (!holding || Number(holding.quantity) < Number(order.quantity)) {
                  // Cannot sell what you don't have
                  await tx.simulator_orders.update({
                    where: { id: order.id },
                    data: { status: 'cancelled' }
                  });
                  return; 
               }
               const totalRevenue = notional - totalFees; // total cash received
               cashAdjustment = totalRevenue;
               qtyAdjustment = -Number(order.quantity);
            }

            const finalBizcoins = currentCash + Math.floor(cashAdjustment);

            // Update Profile Bizcoins
            await tx.profile.update({
                where: { userId: currentPortfolio.user_id },
                data: { bizcoins: finalBizcoins } as any
            });

            // Update Portfolio Cash Balance (for UI/redundancy)
            await tx.simulator_portfolios.update({
                where: { id: currentPortfolio.id },
                data: { cash_balance: finalBizcoins }
            });

            // Record Wallet Transaction
            await (tx as any).walletTransaction.create({
                data: {
                    userId: currentPortfolio.user_id,
                    amount: Math.abs(Math.floor(cashAdjustment)),
                    type: cashAdjustment > 0 ? "income" : "expense",
                    category: "investment",
                    description: `${order.side === 'buy' ? 'Compra' : 'Venta'} de ${order.quantity} acciones de ${order.symbol} @ ${executionPriceBizcoins.toFixed(0)} ₿`
                }
            });

            // Update holdings
            const holding = currentPortfolio.holdings.find(h => h.symbol === order.symbol);
            if (holding) {
                const updatedQty = Number(holding.quantity) + qtyAdjustment;
                if (updatedQty <= 0) {
                    await tx.simulator_holdings.delete({
                        where: { id: holding.id }
                    });
                } else {
                    // Update average cost on buy (store average cost in Bizcoins)
                    let newAvgCost = Number(holding.avg_cost);
                    if (order.side === 'buy') {
                        const totalOldCost = Number(holding.quantity) * Number(holding.avg_cost);
                        const totalNewCost = Number(order.quantity) * executionPriceBizcoins;
                        newAvgCost = (totalOldCost + totalNewCost) / updatedQty;
                    }

                    await tx.simulator_holdings.update({
                        where: { id: holding.id },
                        data: {
                           quantity: updatedQty,
                           avg_cost: newAvgCost
                        }
                    });
                }
            } else if (order.side === 'buy') {
                await tx.simulator_holdings.create({
                    data: {
                        portfolio_id: currentPortfolio.id,
                        symbol: order.symbol,
                        quantity: qtyAdjustment,
                        avg_cost: executionPriceBizcoins
                    }
                });
            }

            // Mark order filled
            await tx.simulator_orders.update({
                where: { id: order.id },
                data: {
                    status: 'filled',
                    filled_at: new Date(),
                    fill_price: executionPriceBizcoins,
                    fee: totalFees
                }
            });

            executedCount++;
        });
      }
    }

    return NextResponse.json({ executed: executedCount });
  } catch (error: any) {
    console.error("Execution error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
