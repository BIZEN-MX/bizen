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

    // Get following (users that this userId is following)
    const following = await prisma.userFollow.findMany({
      where: { followerId: userId },
      include: {
        following: {
          select: {
            userId: true,
            nickname: true,
            fullName: true,
            reputation: true,
            level: true,
            avatar: true,
            inventory: { select: { productId: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: skip
    })

    const total = await prisma.userFollow.count({
      where: { followerId: userId }
    })

    const formatted = (following as any[]).map(f => ({
      userId: f.following.userId,
      nickname: f.following.nickname || f.following.fullName.split(' ')[0] || 'Usuario',
      reputation: f.following.reputation,
      level: f.following.level,
      avatar: f.following.avatar,
      inventory: f.following.inventory?.map((i: any) => i.productId) || [],
      followedAt: f.createdAt
    }))

    return NextResponse.json({
      following: formatted,
      pagination: {
        total,
        limit,
        skip,
        hasMore: skip + limit < total
      }
    })
  } catch (error) {
    console.error("Error fetching following:", error)
    return NextResponse.json({ error: "Failed to fetch following" }, { status: 500 })
  }
}
