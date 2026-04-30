import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth/api-auth';
import { getPositionProgress } from '@/lib/simulators/cetes';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAuth(req);
    if (!authResult.success) return authResult.response;
    const { user } = authResult.data;

    const db = prisma as any;

    // Get or create portfolio
    let portfolio = await db.cetesPortfolios.findFirst({ where: { user_id: user.id } });

    // Sync cash from profile bizcoins
    const profile = await prisma.profile.findUnique({ where: { userId: user.id } });

    if (!portfolio) {
      portfolio = await db.cetesPortfolios.create({
        data: {
          user_id: user.id,
          cash_balance: profile?.bizcoins ?? 0,
          total_invested: 0,
        },
      });
    } else if (portfolio.cash_balance !== (profile?.bizcoins ?? 0)) {
      portfolio = await db.cetesPortfolios.update({
        where: { id: portfolio.id },
        data: { cash_balance: profile?.bizcoins ?? 0 },
      });
    }

    // Get all active + recently matured positions
    const positions = await db.cetesPositions.findMany({
      where: { portfolio_id: portfolio.id, status: { in: ['active', 'matured'] } },
      orderBy: { invested_at: 'desc' },
    });

    // Enrich positions with progress data
    const enriched = positions.map((p: any) => ({
      ...p,
      amount_invested: Number(p.amount_invested),
      annual_rate: Number(p.annual_rate),
      interest_earned: Number(p.interest_earned),
      ...getPositionProgress(p),
    }));

    // Mark newly matured positions
    const nowMatured = enriched.filter((p: any) => p.isMatured && p.status === 'active');
    if (nowMatured.length > 0) {
      await db.cetesPositions.updateMany({
        where: { id: { in: nowMatured.map((p: any) => p.id) } },
        data: { status: 'matured' },
      });
      nowMatured.forEach((p: any) => (p.status = 'matured'));
    }

    // Calculate totals
    const totalInvested = enriched.reduce((s: number, p: any) => s + p.amount_invested, 0);
    const totalAccrued = enriched.reduce((s: number, p: any) => s + p.currentAccruedInterest, 0);
    const readyToRedeem = enriched.filter((p: any) => p.isMatured);

    return NextResponse.json({
      portfolio: {
        ...portfolio,
        cash_balance: Number(portfolio.cash_balance),
        total_invested: totalInvested,
      },
      positions: enriched,
      summary: {
        totalInvested,
        totalAccrued,
        readyToRedeemCount: readyToRedeem.length,
        readyToRedeemAmount: readyToRedeem.reduce((s: number, p: any) => s + p.amount_invested + p.totalInterest, 0),
      },
    });
  } catch (error: any) {
    console.error('[cetes/portfolio:GET]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
