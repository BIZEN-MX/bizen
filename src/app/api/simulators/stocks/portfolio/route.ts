import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSupabaseServer } from '@/lib/supabase/server';

export async function GET(req: Request) {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Fetch Profile to get real Bizcoins
    let profile = await prisma.profile.findUnique({
      where: { userId: user.id }
    });

    if (!profile) {
      // Basic profile fallback if it doesn't exist yet
      profile = await prisma.profile.create({
        data: {
          userId: user.id,
          fullName: user.user_metadata?.full_name || "Usuario Bizen",
          bizcoins: 0
        }
      });
    }

    let canClaimBonus = false;
    let portfolio = await prisma.simulator_portfolios.findFirst({
      where: { user_id: user.id },
      include: {
        holdings: true,
        orders: {
          orderBy: { placed_at: 'desc' }
        }
      }
    });

    // Initial Creation if missing
    if (!portfolio) {
      portfolio = await prisma.simulator_portfolios.create({
        data: {
          user_id: user.id,
          currency: 'BIZCOINS',
          starting_cash: profile.bizcoins || 0,
          cash_balance: profile.bizcoins || 0
        },
        include: { holdings: true, orders: true }
      });
      // Check if they ever claimed the bonus
      const bonusTx = await prisma.walletTransaction.findFirst({
        where: { userId: user.id, description: { contains: "Bono de Bienvenida: BIZEN Market" } }
      });
      if (!bonusTx) canClaimBonus = true;
    } else if (portfolio.currency === 'USD') {
      // Legacy USD portfolios need to migrate AND get the bonus if not already awarded
      canClaimBonus = true;
    } else {
      // Portfolio already in BIZCOINS, check if bonus was ever claimed
      const bonusTx = await prisma.walletTransaction.findFirst({
        where: { userId: user.id, description: { contains: "Bono de Bienvenida: BIZEN Market" } }
      });
      if (!bonusTx) canClaimBonus = true;

      // Sync cash_balance with real Bizcoins
      if (Number(portfolio.cash_balance) !== (profile.bizcoins || 0)) {
        portfolio = await prisma.simulator_portfolios.update({
          where: { id: portfolio.id },
          data: { cash_balance: profile.bizcoins || 0 },
          include: {
            holdings: true,
            orders: { orderBy: { placed_at: 'desc' } }
          }
        });
      }
    }

    return NextResponse.json({ ...portfolio, canClaimBonus });
  } catch (error: any) {
    console.error("Portfolio fetch error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
