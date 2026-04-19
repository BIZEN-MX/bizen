import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth/api-auth"

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAuth(request)
    if (!authResult.success || !authResult.data?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { user } = authResult.data
    const goalId = params.id

    const body = await request.json()
    const { isCompleted } = body

    // Check ownership
    const existingGoal = await (prisma as any).savingsGoal.findUnique({
      where: { id: goalId }
    })

    if (!existingGoal || existingGoal.userId !== user.id) {
      return NextResponse.json({ error: "Goal not found or unauthorized" }, { status: 404 })
    }

    const updatedGoal = await (prisma as any).savingsGoal.update({
      where: { id: goalId },
      data: { isCompleted }
    })

    return NextResponse.json(updatedGoal)
  } catch (error) {
    console.error("Error updating goal:", error)
    return NextResponse.json({ error: "Failed to update goal" }, { status: 500 })
  }
}
