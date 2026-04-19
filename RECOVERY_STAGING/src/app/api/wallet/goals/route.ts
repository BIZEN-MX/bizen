import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth/api-auth"

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    
    if (!authResult.success || !authResult.data?.user) {
      return authResult.response || NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { user } = authResult.data

    let goals = await (prisma as any).savingsGoal.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json({ goals })
  } catch (error) {
    console.error("Error fetching savings goals:", error)
    return NextResponse.json({ error: "Failed to fetch goals" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    
    if (!authResult.success || !authResult.data?.user) {
      return authResult.response || NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { user } = authResult.data

    const { title, targetAmount, category, deadline } = await request.json()

    const newGoal = await (prisma as any).savingsGoal.create({
      data: {
        userId: user.id,
        title,
        targetAmount,
        category,
        deadline: deadline ? new Date(deadline) : null
      }
    })

    return NextResponse.json(newGoal)
  } catch (error) {
    console.error("Error creating savings goal:", error)
    return NextResponse.json({ error: "Failed to create goal" }, { status: 500 })
  }
}
