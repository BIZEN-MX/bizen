import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth/api-auth';
import { INSTRUMENTS, calcInterest, computeMaturityDate } from '@/lib/simulators/cetes';

export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAuth(req);
    if (!authResult.success) return authResult.response;
    const { user } = authResult.data;

    const { instrumentId, amount } = await req.json();

    // Validate instrument
    const instrument = INSTRUMENTS.find(i => i.id === instrumentId);
    if (!instrument) {
      return NextResponse.json({ error: 'Instrumento no válido' }, { status: 400 });
    }

    // Validate amount
    const amountInt = Math.floor(Number(amount));
    if (isNaN(amountInt) || amountInt < instrument.minAmount) {
      return NextResponse.json({ error: `El monto mínimo para ${instrument.name} es ${instrument.minAmount} bz` }, { status: 400 });
    }

    const db = prisma as any;

    // Get profile
    const profile = await prisma.profile.findUnique({ where: { userId: user.id } });
    if (!profile || (profile.bizcoins ?? 0) < amountInt) {
      return NextResponse.json({ error: 'Saldo insuficiente' }, { status: 400 });
    }

    // Get or create portfolio
    let portfolio = await db.cetesPortfolios.findFirst({ where: { user_id: user.id } });
    if (!portfolio) {
      portfolio = await db.cetesPortfolios.create({
        data: { user_id: user.id, cash_balance: profile.bizcoins ?? 0, total_invested: 0 },
      });
    }

    const maturyDate = computeMaturityDate(instrument.termDays);
    const interestAtMaturity = calcInterest(amountInt, instrument.annualRate, instrument.termDays);
    const newBizcoins = (profile.bizcoins ?? 0) - amountInt;

    // Atomic transaction
    const [, , position] = await prisma.$transaction([
      // Deduct from profile bizcoins
      prisma.profile.update({
        where: { userId: user.id },
        data: { bizcoins: newBizcoins } as any,
      }),
      // Update portfolio cash
      db.cetesPortfolios.update({
        where: { id: portfolio.id },
        data: {
          cash_balance: newBizcoins,
          total_invested: { increment: amountInt },
          updated_at: new Date(),
        },
      }),
      // Create position
      db.cetesPositions.create({
        data: {
          portfolio_id: portfolio.id,
          instrument: instrument.id,
          term_days: instrument.termDays,
          annual_rate: instrument.annualRate,
          amount_invested: amountInt,
          interest_earned: interestAtMaturity,
          matures_at: maturyDate,
          status: 'active',
        },
      }),
    ] as any);

    // Log wallet transaction
    await (prisma as any).walletTransaction?.create({
      data: {
        userId: user.id,
        amount: amountInt,
        type: 'expense',
        category: 'fixed_income_invest',
        description: `Inversión en ${instrument.name} — vence ${maturyDate.toLocaleDateString('es-MX')}`,
      },
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      position,
      interestAtMaturity,
      maturyDate,
      newBalance: newBizcoins,
    });
  } catch (error: any) {
    console.error('[cetes/invest:POST]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
