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

    // Get followers and following counts for this user
    let followersCount = 0
    let followingCount = 0

    try {
      followersCount = await prisma.userFollow.count({
        where: { followingId: targetUserId }
      })

      followingCount = await prisma.userFollow.count({
        where: { followerId: targetUserId }
      })
    } catch (error) {
      console.error("Error fetching follow counts:", error)
      // Return 0 if there's an error
      followersCount = 0
      followingCount = 0
    }

    return NextResponse.json({
      followersCount,
      followingCount
    })
  } catch (error) {
    console.error("Error fetching profile stats:", error)
    return NextResponse.json({ error: "Failed to fetch profile stats" }, { status: 500 })
  }
}
