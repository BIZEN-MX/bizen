import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/api-auth';
import { processDividendsForUser, getUpcomingDividends } from '@/lib/simulators/dividends';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * GET /api/simulators/stocks/dividends
 * Returns:
 *  - upcoming: array of scheduled dividends (next payment date, amount estimate)
 *  - history:  last 20 dividend wallet transactions
 */
export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAuth(req);
    if (!authResult.success) return authResult.response;
    const { user } = authResult.data;

    // Fetch current prices from DB (latest EOD)
    const latestPrices = await prisma.market_prices_eod.findMany({
      orderBy: [{ symbol: 'asc' }, { date: 'desc' }],
      distinct: ['symbol'],
    });
    const priceMap: Record<string, number> = {};
    for (const p of latestPrices) {
      priceMap[p.symbol] = Number(p.close);
    }

    const [upcoming, history] = await Promise.all([
      getUpcomingDividends(user.id, priceMap),
      prisma.walletTransaction.findMany({
        where: { userId: user.id, category: 'dividend' },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
    ]);

    return NextResponse.json({ upcoming, history });
  } catch (error: any) {
    console.error('[dividends:GET]', error);
    return NextResponse.json({ error: 'Error loading dividends', upcoming: [], history: [] }, { status: 500 });
  }
}

/**
 * POST /api/simulators/stocks/dividends
 * Triggers dividend processing for the authenticated user.
 * Called automatically when the portfolio is loaded.
 */
export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAuth(req);
    if (!authResult.success) return authResult.response;
    const { user } = authResult.data;

    // Fetch current prices
    const latestPrices = await prisma.market_prices_eod.findMany({
      orderBy: [{ symbol: 'asc' }, { date: 'desc' }],
      distinct: ['symbol'],
    });
    const priceMap: Record<string, number> = {};
    for (const p of latestPrices) {
      priceMap[p.symbol] = Number(p.close);
    }

    const paid = await processDividendsForUser(user.id, priceMap);

    return NextResponse.json({
      success: true,
      paid,
      message: paid.length > 0
        ? `¡Recibiste dividendos de ${paid.length} acción${paid.length > 1 ? 'es' : ''}!`
        : 'No hay dividendos pendientes.',
    });
  } catch (error: any) {
    console.error('[dividends:POST]', error);
    return NextResponse.json({ success: false, paid: [], error: error.message }, { status: 500 });
  }
}
