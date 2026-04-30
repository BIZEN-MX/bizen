import { prisma } from '@/lib/prisma';
import { STOCK_FUNDAMENTALS } from '@/data/simulators/stock-metadata';

/**
 * BIZEN Market — Dividend Engine
 *
 * Logic:
 *  - Dividends are paid every 30 "BIZEN days" (calendar days) from the date of purchase.
 *  - Yield is based on divYield % from STOCK_FUNDAMENTALS, prorated monthly (annual / 12).
 *  - Payment is based on the user's holding quantity × the stock's current price × monthly yield %.
 *  - A WalletTransaction is created for each payment so it appears in the history.
 *  - We track last dividend date per holding via a metadata approach using a dedicated table.
 */

export interface DividendResult {
  symbol: string;
  quantity: number;
  pricePerShare: number;
  annualYieldPct: number;
  monthlyYieldPct: number;
  amountBizcoins: number;
  paidAt: string;
}

/**
 * Process and pay dividends for a single user.
 * Returns the list of dividends paid in this run.
 */
export async function processDividendsForUser(
  userId: string,
  currentPrices: Record<string, number>  // symbol -> current price in Bizcoins
): Promise<DividendResult[]> {
  const paid: DividendResult[] = [];

  // 1. Get portfolio with holdings
  const portfolio = await prisma.simulator_portfolios.findFirst({
    where: { user_id: userId },
    include: { holdings: true },
  });

  if (!portfolio || portfolio.holdings.length === 0) return paid;

  // 2. Get last dividend payments for this portfolio
  const lastPayments = await (prisma as any).simulator_dividend_payments.findMany({
    where: { portfolio_id: portfolio.id },
  }).catch(() => []); // Gracefully fail if table doesn't exist yet

  const lastPaymentMap = new Map<string, Date>();
  for (const p of lastPayments) {
    lastPaymentMap.set(p.symbol, new Date(p.paid_at));
  }

  const now = new Date();
  const DAYS_BETWEEN_PAYMENTS = 30; // 30 calendar days = 1 "month"

  for (const holding of portfolio.holdings) {
    const symbol = holding.symbol;
    const quantity = Number(holding.quantity);

    // Check if this stock pays dividends
    const fundamentals = STOCK_FUNDAMENTALS[symbol];
    if (!fundamentals?.divYield || fundamentals.divYield <= 0) continue;

    // Check if 30 days have passed since last payment (or since purchase if first time)
    const lastPayment = lastPaymentMap.get(symbol);
    const referenceDate = lastPayment ?? new Date(holding.created_at ?? now);
    const daysSinceLastPayment = Math.floor(
      (now.getTime() - referenceDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceLastPayment < DAYS_BETWEEN_PAYMENTS) continue;

    // Calculate payment
    const currentPrice = currentPrices[symbol];
    if (!currentPrice || currentPrice <= 0) continue;

    const annualYieldPct = fundamentals.divYield;          // e.g. 0.5 = 0.5%
    const monthlyYieldPct = annualYieldPct / 12;            // e.g. 0.0417%
    const dividendPerShare = currentPrice * (monthlyYieldPct / 100);
    const totalDividend = Math.floor(quantity * dividendPerShare);

    if (totalDividend < 1) continue; // Skip dust amounts

    // Pay in a transaction
    await prisma.$transaction(async (tx: any) => {
      // Update user's Bizcoins
      const profile = await tx.profile.findUnique({ where: { userId } });
      if (!profile) return;

      const newBizcoins = (profile.bizcoins || 0) + totalDividend;

      await tx.profile.update({
        where: { userId },
        data: { bizcoins: newBizcoins } as any,
      });

      // Update portfolio cash_balance to stay in sync
      await tx.simulator_portfolios.update({
        where: { id: portfolio.id },
        data: { cash_balance: newBizcoins },
      });

      // Record WalletTransaction
      await (tx as any).walletTransaction.create({
        data: {
          userId,
          amount: totalDividend,
          type: 'income',
          category: 'dividend',
          description: `💸 Dividendo de ${symbol} — ${quantity.toFixed(4)} acciones × ${monthlyYieldPct.toFixed(4)}% mensual`,
        },
      });

      // Upsert dividend payment record
      try {
        await (tx as any).simulator_dividend_payments.upsert({
          where: { portfolio_id_symbol: { portfolio_id: portfolio.id, symbol } },
          update: { paid_at: now, amount: totalDividend, quantity: quantity },
          create: {
            portfolio_id: portfolio.id,
            symbol,
            paid_at: now,
            amount: totalDividend,
            quantity: quantity,
          },
        });
      } catch {
        // Table may not exist yet – non-fatal
      }
    });

    paid.push({
      symbol,
      quantity,
      pricePerShare: currentPrice,
      annualYieldPct,
      monthlyYieldPct,
      amountBizcoins: totalDividend,
      paidAt: now.toISOString(),
    });
  }

  return paid;
}

/**
 * Get upcoming dividends for a user (next payment date per holding).
 * Used for the UI preview panel.
 */
export async function getUpcomingDividends(
  userId: string,
  currentPrices: Record<string, number>
): Promise<Array<{
  symbol: string;
  quantity: number;
  annualYieldPct: number;
  estimatedNextPayment: number;
  nextPaymentDate: string;
  daysUntilNext: number;
}>> {
  const result = [];

  const portfolio = await prisma.simulator_portfolios.findFirst({
    where: { user_id: userId },
    include: { holdings: true },
  });

  if (!portfolio) return [];

  const lastPayments = await (prisma as any).simulator_dividend_payments.findMany({
    where: { portfolio_id: portfolio.id },
  }).catch(() => []);

  const lastPaymentMap = new Map<string, Date>();
  for (const p of lastPayments) {
    lastPaymentMap.set(p.symbol, new Date(p.paid_at));
  }

  const now = new Date();
  const DAYS_BETWEEN_PAYMENTS = 30;

  for (const holding of portfolio.holdings) {
    const symbol = holding.symbol;
    const quantity = Number(holding.quantity);
    const fundamentals = STOCK_FUNDAMENTALS[symbol];

    if (!fundamentals?.divYield || fundamentals.divYield <= 0) continue;

    const lastPayment = lastPaymentMap.get(symbol);
    const referenceDate = lastPayment ?? new Date(holding.created_at ?? now);
    const daysSince = Math.floor((now.getTime() - referenceDate.getTime()) / 86400000);
    const daysUntilNext = Math.max(0, DAYS_BETWEEN_PAYMENTS - daysSince);

    const nextDate = new Date(referenceDate);
    nextDate.setDate(nextDate.getDate() + DAYS_BETWEEN_PAYMENTS);

    const currentPrice = currentPrices[symbol] ?? 0;
    const monthlyYieldPct = fundamentals.divYield / 12;
    const estimatedPayment = Math.floor(quantity * currentPrice * (monthlyYieldPct / 100));

    result.push({
      symbol,
      quantity,
      annualYieldPct: fundamentals.divYield,
      estimatedNextPayment: estimatedPayment,
      nextPaymentDate: nextDate.toISOString(),
      daysUntilNext,
    });
  }

  return result.sort((a, b) => a.daysUntilNext - b.daysUntilNext);
}
