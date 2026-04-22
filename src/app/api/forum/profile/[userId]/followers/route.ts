import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth/api-auth"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId: targetUserId } = await params
    const authResult = await requireAuth(request)

    if (!authResult.success) {
      return authResult.response
    }

    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)
    const skip = parseInt(searchParams.get('skip') || '0')

    // Get followers records first
    const followRecords = await prisma.userFollow.findMany({
      where: { followingId: targetUserId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: skip
    })

    const followerIds = followRecords.map(f => f.followerId)

    // Fetch profile details for these followers
    const profiles = await prisma.profile.findMany({
      where: { userId: { in: followerIds } },
      select: {
        userId: true,
        nickname: true,
        fullName: true,
        reputation: true,
        level: true,
        avatar: true,
        inventory: { select: { productId: true } }
      }
    })

    // Map back to maintain order and include followedAt
    const formatted = followRecords.map(f => {
      const profile = profiles.find(p => p.userId === f.followerId)
      if (!profile) return null

      const parts = (profile.fullName || '').trim().split(/\s+/)
      const safeName = parts.length >= 2
        ? `${parts[0]} ${parts[parts.length - 1][0]}.`
        : (parts[0] || 'Usuario')

      return {
        userId: profile.userId,
        nickname: profile.nickname || safeName,
        reputation: profile.reputation,
        level: profile.level,
        avatar: profile.avatar,
        inventory: (profile as any).inventory?.map((i: any) => i.productId) || [],
        followedAt: f.createdAt
      }
    }).filter(Boolean)

    const total = await prisma.userFollow.count({
      where: { followingId: targetUserId }
    })

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
