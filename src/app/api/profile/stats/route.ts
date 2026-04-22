import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user join date from profile
    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: { createdAt: true }
    })

    const joinDate = profile?.createdAt || null

    // Get real followers and following counts from user_follows table
    let followersCount = 0
    let followingCount = 0

    try {
      // Count how many users are following this user (followers)
      followersCount = await prisma.userFollow.count({
        where: { followingId: userId }
      })

      // Count how many users this user is following (following)
      followingCount = await prisma.userFollow.count({
        where: { followerId: userId }
      })
    } catch (error) {
      console.error("Error fetching follow counts:", error)
      followersCount = 0
      followingCount = 0
    }

    return NextResponse.json({
      joinDate: joinDate?.toISOString() || null,
      followersCount,
      followingCount
    })
  } catch (error) {
    console.error("Error fetching profile stats:", error)
    return NextResponse.json({ error: "Failed to fetch profile stats" }, { status: 500 })
  }
}
