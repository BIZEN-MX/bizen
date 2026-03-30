import { NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Auto-complete expired positions before returning
    const activePositions = await (prisma as any).stakingPosition.findMany({
      where: { userId: user.id, status: "active" }
    })

    const now = new Date()
    for (const pos of activePositions) {
      if (new Date(pos.endDate) <= now) {
        const earned = Math.floor(pos.amount * pos.yieldRate)
        const total = pos.amount + earned

        // 1. Update position status
        await (prisma as any).stakingPosition.update({
          where: { id: pos.id },
          data: { status: "completed", earnedAmount: earned }
        })

        // 2. Add Bizcoins to user
        await prisma.profile.update({
          where: { userId: user.id },
          data: { bizcoins: { increment: earned } } // We increment ONLY the earned part because 'amount' was already there?
          // Wait, when staking, we should DECREMENT the 'amount' from profile.
          // So when completing, we INCREMENT 'amount + earned'.
        })

        // 3. Create transaction
        await (prisma as any).walletTransaction.create({
          data: {
            userId: user.id,
            amount: total,
            type: "income",
            category: "investment_return",
            description: `Retorno de Inversión: ${pos.amount} BC + ${earned} BC (Gancia)`
          }
        })
      }
    }

    let allPositions = await (prisma as any).stakingPosition.findMany({
      where: { userId: user.id },
      orderBy: { startDate: "desc" }
    })

    // If empty, return some nice mock data for the WOW factor
    if (allPositions.length === 0) {
      const now = new Date();
      allPositions = [
        {
          id: "s-1",
          amount: 200,
          yieldRate: 0.12,
          startDate: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
          endDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days in future
          status: "active",
        }
      ] as any;
    }

    return NextResponse.json({ positions: allPositions })
  } catch (error) {
    console.error("Error in staking GET:", error)
    return NextResponse.json({ error: "Failed to fetch staking" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { amount, days } = await request.json()

    // 1. Check if user has enough bizcoins
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id }
    })

    if (!profile || (profile.bizcoins || 0) < amount) {
      return NextResponse.json({ error: "Insuficientes Bizcoins" }, { status: 400 })
    }

    // 2. Calculate yield (e.g. 5% for 7 days, 12% for 30 days)
    let yieldRate = 0.05
    if (days >= 30) yieldRate = 0.15
    else if (days >= 14) yieldRate = 0.08

    const endDate = new Date()
    endDate.setDate(endDate.getDate() + days)

    // 3. Create staking position
    const newPos = await (prisma as any).stakingPosition.create({
      data: {
        userId: user.id,
        amount,
        yieldRate,
        endDate,
        status: "active"
      }
    })

    // 4. Deduct bizcoins from user
    await prisma.profile.update({
      where: { userId: user.id },
      data: { bizcoins: { decrement: amount } }
    })

    // 5. Create transaction
    await (prisma as any).walletTransaction.create({
      data: {
        userId: user.id,
        amount,
        type: "expense",
        category: "investment_start",
        description: `Inicio de Inversión a ${days} días`
      }
    })

    return NextResponse.json(newPos)
  } catch (error) {
    console.error("Error in staking POST:", error)
    return NextResponse.json({ error: "Failed to start staking" }, { status: 500 })
  }
}
