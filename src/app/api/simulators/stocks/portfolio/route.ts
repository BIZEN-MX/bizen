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

    let portfolio = await prisma.simulator_portfolios.findFirst({
      where: { user_id: user.id },
      include: {
        holdings: true,
        orders: {
          orderBy: { placed_at: 'desc' }
        }
      }
    });

    if (!portfolio) {
      // Create initial portfolio for user
      portfolio = await prisma.simulator_portfolios.create({
        data: {
          user_id: user.id,
          currency: 'USD',
          starting_cash: 10000,
          cash_balance: 10000
        },
        include: {
          holdings: true,
          orders: true
        }
      });
    }

    return NextResponse.json(portfolio);
  } catch (error: any) {
    console.error("Portfolio fetch error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
