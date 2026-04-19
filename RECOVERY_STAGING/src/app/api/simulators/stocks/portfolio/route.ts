import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { executePendingOrders } from '@/lib/simulators/stocks';
import { requireAuth } from '@/lib/auth/api-auth';
import { ensureProfile } from '@/lib/profiles';

export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAuth(req)
    if (!authResult.success) {
      return authResult.response
    }
    const { user } = authResult.data

    // Safe execution of pending orders
    try {
      await executePendingOrders();
    } catch (err) {
      console.error("[stocks] Order execution sync failed (non-fatal):", err);
    }

    // 1. Fetch or CREATE Profile to get real Bizcoins
    const profile = await ensureProfile(user.id, user.email, user.user_metadata?.full_name);

    if (!profile) {
       console.warn(`[portfolio] Profile could not be ensured for user ${user.id}`);
       return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // 2. Fetch or Create Portfolio
    let portfolio = await prisma.simulator_portfolios.findFirst({
      where: { user_id: user.id },
      include: {
        holdings: true,
        orders: {
          orderBy: { placed_at: 'desc' },
          take: 50
        }
      }
    });

    if (!portfolio) {
      console.log(`[portfolio] Creating new portfolio for user ${user.id}`);
      try {
        portfolio = await prisma.simulator_portfolios.create({
          data: {
            user_id: user.id,
            currency: 'BIZCOINS',
            starting_cash: profile.bizcoins || 100000,
            cash_balance: profile.bizcoins || 100000
          },
          include: { holdings: true, orders: true }
        });
      } catch (createErr: any) {
        if (createErr.code === 'P2003') {
           console.warn(`[portfolio] DB users table missing record for ${user.id}. Serving ephemeral portfolio.`);
           const existingBonus = await prisma.walletTransaction.findFirst({
             where: { userId: user.id, description: { contains: "Bono de Bienvenida: BIZEN Market" } }
           });
           return NextResponse.json({
              id: "temp-portfolio",
              user_id: user.id,
              currency: 'BIZCOINS',
              starting_cash: profile.bizcoins || 100000,
              cash_balance: profile.bizcoins || 100000,
              holdings: [],
              orders: [],
              canClaimBonus: !existingBonus
           });
        }
        throw createErr;
      }
    }

    // 3. Sync Logic (Sync Cash Balance if needed)
    if (portfolio.currency !== 'BIZCOINS' || Number(portfolio.cash_balance) !== (profile.bizcoins || 0)) {
        portfolio = await prisma.simulator_portfolios.update({
          where: { id: portfolio.id },
          data: { 
            currency: 'BIZCOINS',
            cash_balance: profile.bizcoins || 0
          },
          include: { 
            holdings: true, 
            orders: { orderBy: { placed_at: 'desc' }, take: 50 } 
          }
        });
    }

    // 4. Bonus Check (Unified via Transaction Log)
    const bonusTx = await prisma.walletTransaction.findFirst({
      where: { 
        userId: user.id, 
        description: { contains: "Bono de Bienvenida: BIZEN Market" } 
      }
    });

    return NextResponse.json({ 
      ...portfolio, 
      canClaimBonus: !bonusTx 
    });
  } catch (error: any) {
    console.error("❌ [Portfolio:FatalError]:", error);
    return NextResponse.json({ 
      error: "Error interno al cargar el portafolio",
      details: error.message
    }, { status: 500 });
  }
}
