import { prisma } from '@/lib/prisma';

export async function executePendingOrders() {
  // 1. Fetch pending orders
  const pendingOrders = await prisma.simulator_orders.findMany({
    where: { status: 'pending' },
    include: { portfolio: true }
  });

  if (!pendingOrders.length) {
    return 0;
  }

  // 2. Fetch the latest EOD prices for the symbols included
  const symbolsToFetch = Array.from(new Set(pendingOrders.map(o => o.symbol)));
  
  const latestPrices = await prisma.market_prices_eod.findMany({
    where: { symbol: { in: symbolsToFetch } },
    orderBy: [
      { symbol: 'asc' },
      { date: 'desc' }
    ],
    distinct: ['symbol']
  });

  console.log(`[stocks] Found ${latestPrices.length} price records for ${symbolsToFetch.length} requested symbols.`);

  // 3. Fetch Global Market Config
  const configProfile = await prisma.profile.findUnique({
    where: { userId: "GLOBAL_CONFIG_MARKET" },
    select: { settings: true }
  });
  const config = (configProfile?.settings as any) || { commissionMarket: 0.15, commissionLimit: 0.10 };


  const priceMap = new Map();
  latestPrices.forEach(p => {
      priceMap.set(p.symbol, p);
  });

  let executedCount = 0;
  
  for (const order of pendingOrders) {
    const priceRecord = priceMap.get(order.symbol);
    if (!priceRecord) {
      console.warn(`[stocks] Missing price data for ${order.symbol}, skipping order execution.`);
      continue;
    }

    const close = Number(priceRecord.close || 0);
    const high = Number(priceRecord.high || 0);
    const low = Number(priceRecord.low || 0);
    
    if (close === 0) {
      console.warn(`[stocks] Zero price for ${order.symbol}, skipping execution.`);
      continue;
    }
    
    let executionPrice = 0;
    let shouldExecute = false;

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
      const bizcoinMultiplier = 1;
      const executionPriceBizcoins = executionPrice * bizcoinMultiplier;
      const notional = Number(order.quantity) * executionPriceBizcoins;
      
      const marketFeeRatio = (Number(config.commissionMarket) ?? 0.15) / 100;
      const limitFeeRatio = (Number(config.commissionLimit) ?? 0.10) / 100;
      const feeRatio = order.order_type === 'market' ? marketFeeRatio : limitFeeRatio;
      const totalFees = notional * feeRatio;
      
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
                await tx.simulator_orders.update({
                    where: { id: order.id },
                    data: { status: 'cancelled' }
                });
                return;
             }
             cashAdjustment = -totalCost;
             qtyAdjustment = Number(order.quantity);
          } else if (order.side === 'sell') {
             const holding = currentPortfolio.holdings.find(h => h.symbol === order.symbol);
             if (!holding || Number(holding.quantity) < Number(order.quantity)) {
                await tx.simulator_orders.update({
                  where: { id: order.id },
                  data: { status: 'cancelled' }
                });
                return; 
             }
             const totalRevenue = notional - totalFees;
             cashAdjustment = totalRevenue;
             qtyAdjustment = -Number(order.quantity);
          }

          const finalBizcoins = currentCash + Math.floor(cashAdjustment);

          await tx.profile.update({
              where: { userId: currentPortfolio.user_id },
              data: { bizcoins: finalBizcoins } as any
          });

          await tx.simulator_portfolios.update({
              where: { id: currentPortfolio.id },
              data: { cash_balance: finalBizcoins }
          });

          const walletTxModel = (tx as any).walletTransaction;
          if (walletTxModel) {
            await walletTxModel.create({
                data: {
                    userId: currentPortfolio.user_id,
                    amount: Math.abs(Math.floor(cashAdjustment)),
                    type: cashAdjustment > 0 ? "income" : "expense",
                    category: "investment_trade",
                    description: `${order.side === 'buy' ? 'Compra' : 'Venta'} de ${order.quantity} acciones de ${order.symbol} @ ${executionPriceBizcoins.toFixed(0)} bz`
                }
            });
          }

          const holding = currentPortfolio.holdings.find(h => h.symbol === order.symbol);
          if (holding) {
              const updatedQty = Number(holding.quantity) + qtyAdjustment;
              if (updatedQty <= 0) {
                  await tx.simulator_holdings.delete({
                      where: { id: holding.id }
                  });
              } else {
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

  return executedCount;
}
