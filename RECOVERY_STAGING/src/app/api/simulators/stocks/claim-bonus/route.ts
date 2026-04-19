import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth/api-auth';

export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAuth(req);
    if (!authResult.success) {
      return authResult.response;
    }
    const { user } = authResult.data;

    // 1. Check if already claimed
    const bonusTx = await prisma.walletTransaction.findFirst({
      where: { 
        userId: user.id, 
        description: { contains: "Bono de Bienvenida: BIZEN Market" } 
      }
    });

    if (bonusTx) {
      return NextResponse.json({ error: "Bono ya reclamado" }, { status: 400 });
    }

    const bonusAmount = 1000;

    await prisma.$transaction(async (tx) => {
      // Award to profile
      const profile = await tx.profile.findUnique({ where: { userId: user.id } });
      const newBalance = (profile?.bizcoins || 0) + bonusAmount;

      await tx.profile.update({
        where: { userId: user.id },
        data: { bizcoins: newBalance } as any
      });

      // Record transaction
      await (tx as any).walletTransaction.create({
        data: {
          userId: user.id,
          amount: bonusAmount,
          type: "income",
          category: "investment_reward",
          description: "Bono de Bienvenida: BIZEN Market bz"
        }
      });

      // Sync simulator_portfolios
      const portfolio = await tx.simulator_portfolios.findFirst({
        where: { user_id: user.id }
      });

      if (portfolio) {
        await tx.simulator_portfolios.update({
          where: { id: portfolio.id },
          data: { 
            cash_balance: newBalance,
            // If they are just starting, updating starting_cash to reflect initial gift
            starting_cash: { increment: bonusAmount } 
          }
        });
      }
    });

    return NextResponse.json({ success: true, bonusAmount });
  } catch (error: any) {
    console.error("Bonus claim error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
