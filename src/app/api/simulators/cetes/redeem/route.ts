import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth/api-auth';

export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAuth(req);
    if (!authResult.success) return authResult.response;
    const { user } = authResult.data;

    const { positionId } = await req.json();
    if (!positionId) return NextResponse.json({ error: 'positionId requerido' }, { status: 400 });

    const db = prisma as any;

    // Get position
    const position = await db.cetesPositions.findFirst({
      where: { id: positionId },
      include: { portfolio: true },
    });

    if (!position) return NextResponse.json({ error: 'Posición no encontrada' }, { status: 404 });
    if (position.portfolio.user_id !== user.id) return NextResponse.json({ error: 'No autorizado' }, { status: 403 });

    const now = new Date();
    const isMatured = now >= new Date(position.matures_at);

    if (!isMatured) {
      return NextResponse.json({ error: '¡Aún no ha vencido! Espera a que se cumpla el plazo.' }, { status: 400 });
    }
    if (position.status === 'redeemed') {
      return NextResponse.json({ error: 'Esta posición ya fue cobrada.' }, { status: 400 });
    }

    const principal = Number(position.amount_invested);
    const interest = Number(position.interest_earned);
    const totalPayout = principal + interest;

    const profile = await prisma.profile.findUnique({ where: { userId: user.id } });
    const newBizcoins = (profile?.bizcoins ?? 0) + totalPayout;

    await prisma.$transaction([
      // Credit bizcoins
      prisma.profile.update({
        where: { userId: user.id },
        data: { bizcoins: newBizcoins } as any,
      }),
      // Update portfolio
      db.cetesPortfolios.update({
        where: { id: position.portfolio_id },
        data: {
          cash_balance: newBizcoins,
          total_invested: { decrement: principal },
          updated_at: new Date(),
        },
      }),
      // Mark position redeemed
      db.cetesPositions.update({
        where: { id: positionId },
        data: { status: 'redeemed', redeemed_at: now },
      }),
    ] as any);

    // Wallet log
    await (prisma as any).walletTransaction?.create({
      data: {
        userId: user.id,
        amount: totalPayout,
        type: 'income',
        category: 'fixed_income_redeem',
        description: `Cobro de ${position.instrument}: +${interest} bz en intereses`,
      },
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      principal,
      interest,
      totalPayout,
      newBalance: newBizcoins,
    });
  } catch (error: any) {
    console.error('[cetes/redeem:POST]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
