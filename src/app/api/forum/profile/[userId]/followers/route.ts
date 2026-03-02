import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)
    const skip = parseInt(searchParams.get('skip') || '0')

    // Get followers (users who are following this userId)
    const followers = await prisma.userFollow.findMany({
      where: { followingId: userId },
      include: {
        follower: {
          select: {
            userId: true,
            nickname: true,
            fullName: true,
            reputation: true,
            level: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: skip
    })

    const total = await prisma.userFollow.count({
      where: { followingId: userId }
    })

    const formatted = followers.map(f => ({
      userId: f.follower.userId,
      nickname: f.follower.nickname || f.follower.fullName.split(' ')[0] || 'Usuario',
      reputation: f.follower.reputation,
      level: f.follower.level,
      followedAt: f.createdAt
    }))

    return NextResponse.json({
      followers: formatted,
      pagination: {
        total,
        limit,
        skip,
        hasMore: skip + limit < total
      }
    })
  } catch (error) {
    console.error("Error fetching followers:", error)
    return NextResponse.json({ error: "Failed to fetch followers" }, { status: 500 })
  }
}
