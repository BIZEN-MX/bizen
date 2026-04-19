import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth/api-auth"

// We use the camelCase names matching the prisma client keys we found earlier
const STAKE_MODEL = (prisma as any).stakingPosition;
const TX_MODEL = (prisma as any).walletTransaction;

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    
    if (!authResult.success || !authResult.data?.user) {
      return authResult.response || NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { user } = authResult.data

    // Auto-complete expired positions before returning
    // We filter by status "active" and check the date
    const activePositions = await STAKE_MODEL.findMany({
      where: { userId: user.id, status: "active" }
    })

    const now = new Date()
    for (const pos of activePositions) {
      // If the current date is past the end date, liquidate the position
      if (new Date(pos.endDate) <= now) {
        const earned = Math.floor(pos.amount * pos.yieldRate)
        const total = pos.amount + earned

        // ATOMIC TRANSACTION for liquidation
        await prisma.$transaction(async (tx) => {
          // 1. Update position status to completed
          await (tx as any).stakingPosition.update({
            where: { id: pos.id },
            data: { status: "completed", earnedAmount: earned }
          })

          // 2. Return principal + yield to user profile
          await tx.profile.update({
            where: { userId: user.id },
            data: { bizcoins: { increment: total } }
          })

          // 3. Register the earnings in the global history
          await (tx as any).walletTransaction.create({
            data: {
              userId: user.id,
              amount: total,
              type: "income",
              category: "investment_return",
              description: `Liquidación: ${pos.amount} BC (capital) + ${earned} BC (rendimiento)`
            }
          })
        })
      }
    }

    // Fetch refreshed positions list
    let allPositions = await STAKE_MODEL.findMany({
      where: { userId: user.id },
      orderBy: { startDate: "desc" }
    })

    return NextResponse.json({ positions: allPositions })
  } catch (error) {
    console.error("❌ [STAKING_GET]:", error)
    return NextResponse.json({ error: "Error al sincronizar inversiones" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    
    if (!authResult.success || !authResult.data?.user) {
      return authResult.response || NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { user } = authResult.data

    const { amount, days } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Cantidad inválida" }, { status: 400 })
    }

    // 1. Yield Logic (Aligned with the Frontend STAKING_PLANS)
    let yieldRate = 0.05
    if (days >= 30) yieldRate = 0.15
    else if (days >= 14) yieldRate = 0.08

    const endDate = new Date()
    endDate.setDate(endDate.getDate() + days)

    // 2. ATOMIC TRANSACTION: Deduct balance and create position
    const result = await prisma.$transaction(async (tx) => {
      // Check balance first
      const profile = await tx.profile.findUnique({
        where: { userId: user.id },
        select: { bizcoins: true }
      })

      if (!profile || (profile.bizcoins || 0) < amount) {
        throw new Error("Saldo insuficiente")
      }

      // Create staking position
      const newPos = await (tx as any).stakingPosition.create({
        data: {
          userId: user.id,
          amount,
          yieldRate,
          endDate,
          status: "active"
        }
      })

      // Deduct balance
      await tx.profile.update({
        where: { userId: user.id },
        data: { bizcoins: { decrement: amount } }
      })

      // Create history entry
      await (tx as any).walletTransaction.create({
        data: {
          userId: user.id,
          amount,
          type: "expense",
          category: "investment_start",
          description: `Inicio de Inversión (${days} días) - Tasa: ${(yieldRate * 100).toFixed(0)}%`
        }
      })

      return newPos
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("❌ [STAKING_POST]:", error)
    return NextResponse.json({ error: error.message || "Error al iniciar inversión" }, { status: 500 })
  }
}
