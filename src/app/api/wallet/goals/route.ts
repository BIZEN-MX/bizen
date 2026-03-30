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

    let goals = await (prisma as any).savingsGoal.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" }
    })

    // If empty, return some nice mock data for the WOW factor
    if (goals.length === 0) {
      goals = [
        {
          id: "g-1",
          title: "Avatar Astronauta Blue",
          targetAmount: 500,
          category: "avatar",
          isCompleted: false,
          createdAt: new Date().toISOString(),
        }
      ] as any;
    }

    return NextResponse.json({ goals })
  } catch (error) {
    console.error("Error fetching savings goals:", error)
    return NextResponse.json({ error: "Failed to fetch goals" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, targetAmount, category } = await request.json()

    const newGoal = await (prisma as any).savingsGoal.create({
      data: {
        userId: user.id,
        title,
        targetAmount,
        category
      }
    })

    return NextResponse.json(newGoal)
  } catch (error) {
    console.error("Error creating savings goal:", error)
    return NextResponse.json({ error: "Failed to create goal" }, { status: 500 })
  }
}
