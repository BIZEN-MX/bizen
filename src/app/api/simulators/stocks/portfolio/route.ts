import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSupabaseServer } from '@/lib/supabase/server';
import { executePendingOrders } from '@/lib/simulators/stocks';

export async function GET(req: Request) {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Trigger execution of any pending orders that meet market price
    try {
      await executePendingOrders();
    } catch (err) {
      console.error("Order execution sync failed:", err);
    }

    let canClaimBonus = false;

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

    // Unified Bonus Check: Check if bonus was ever claimed via transaction log
    const bonusTx = await prisma.walletTransaction.findFirst({
      where: { 
        userId: user.id, 
        description: { 
          contains: "Bono de Bienvenida: BIZEN Market",
        } 
      }
    });

    let portfolio = await prisma.simulator_portfolios.findFirst({
      where: { user_id: user.id },
      include: {
        holdings: true,
        orders: {
          orderBy: { placed_at: 'desc' }
        }
      }
    });

    // 1. Initial Creation or Migration Logic
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
      canClaimBonus = !bonusTx;
    } else {
      // 2. Migration from USD to BIZCOINS if needed
      if (portfolio.currency === 'USD') {
          portfolio = await prisma.simulator_portfolios.update({
            where: { id: portfolio.id },
            data: { 
                currency: 'BIZCOINS',
                cash_balance: profile.bizcoins || 0
            },
            include: { holdings: true, orders: { orderBy: { placed_at: 'desc' } } }
          });
      }

      // 3. Sync cash_balance with real Bizcoins from Profile
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
      
      // Banner should show ONLY if they haven't claimed the transaction yet
      canClaimBonus = !bonusTx;
    }

    return NextResponse.json({ ...portfolio, canClaimBonus });
  } catch (error: any) {
    console.error("Portfolio fetch error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
