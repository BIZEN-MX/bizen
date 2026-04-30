import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { processDividendsForUser } from '@/lib/simulators/dividends';

export const dynamic = 'force-dynamic';

/**
 * GET /api/cron/dividends
 * 
 * Cron endpoint — processes dividend payments for ALL active users with holdings.
 * Called by watchdog.sh every hour. Protected by a shared secret.
 * 
 * Usage: curl -H "x-cron-secret: BIZEN_CRON_2026" http://localhost:3004/api/cron/dividends
 */
export async function GET(req: NextRequest) {
  // Simple shared-secret auth so it's not publicly accessible
  const secret = req.headers.get('x-cron-secret') ?? req.nextUrl.searchParams.get('secret');
  const expectedSecret = process.env.CRON_SECRET ?? 'BIZEN_CRON_2026';

  if (secret !== expectedSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const startedAt = Date.now();
  console.log('[cron/dividends] Starting dividend run for all users...');

  try {
    // 1. Fetch all portfolios that have holdings
    const portfolios = await prisma.simulator_portfolios.findMany({
      where: { holdings: { some: {} } },
      select: { user_id: true },
    });

    if (portfolios.length === 0) {
      console.log('[cron/dividends] No portfolios with holdings. Exiting.');
      return NextResponse.json({ success: true, processed: 0, totalPaid: 0, durationMs: Date.now() - startedAt });
    }

    // 2. Fetch current market prices once (reused for all users)
    const latestPrices = await prisma.market_prices_eod.findMany({
      orderBy: [{ symbol: 'asc' }, { date: 'desc' }],
      distinct: ['symbol'],
    });
    const priceMap: Record<string, number> = {};
    for (const p of latestPrices) {
      priceMap[p.symbol] = Number(p.close);
    }

    // 3. Process each user
    let totalPaid = 0;
    let usersWithDividends = 0;

    for (const { user_id } of portfolios) {
      try {
        const paid = await processDividendsForUser(user_id, priceMap);
        if (paid.length > 0) {
          usersWithDividends++;
          totalPaid += paid.reduce((sum, d) => sum + d.amountBizcoins, 0);
          console.log(`[cron/dividends] Paid ${paid.length} dividend(s) to user ${user_id.slice(0, 8)}...`);
        }
      } catch (userErr: any) {
        console.error(`[cron/dividends] Error processing user ${user_id}:`, userErr.message);
        // Continue with next user — don't abort the whole run
      }
    }

    const durationMs = Date.now() - startedAt;
    console.log(`[cron/dividends] Done. ${usersWithDividends}/${portfolios.length} users received dividends. Total: ${totalPaid} bz. (${durationMs}ms)`);

    return NextResponse.json({
      success: true,
      processed: portfolios.length,
      usersWithDividends,
      totalPaid,
      durationMs,
    });
  } catch (error: any) {
    console.error('[cron/dividends] Fatal error:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
