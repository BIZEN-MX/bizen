import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "weekly"

    let dateFilter = undefined
    if (period === 'weekly') {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      dateFilter = weekAgo
    }

    // Get top users
    const users = await prisma.profile.findMany({
      orderBy: [
        { reputation: 'desc' },
        { acceptedAnswers: 'desc' }
      ],
      select: {
        userId: true,
        nickname: true,
        fullName: true,
        reputation: true,
        level: true,
        postsCreated: true,
        commentsCreated: true,
        acceptedAnswers: true
      },
      take: 50
    })

    // Format with nicknames
    const formatted = users.map(u => ({
      ...u,
      nickname: u.nickname || u.fullName.split(' ')[0],
      weeklyScore: u.reputation // Simplified - could calculate weekly activity
    }))

    return NextResponse.json({ leaderboard: formatted })
  } catch (error) {
    console.error("Error fetching leaderboard:", error)
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

