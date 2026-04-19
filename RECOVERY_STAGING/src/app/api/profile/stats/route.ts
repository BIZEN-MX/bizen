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

    // Get user join date from Supabase auth
    const joinDate = user.created_at ? new Date(user.created_at) : null

    // Get real followers and following counts from user_follows table
    let followersCount = 0
    let followingCount = 0

    try {
      // Count how many users are following this user (followers)
      followersCount = await prisma.userFollow.count({
        where: { followingId: user.id }
      })

      // Count how many users this user is following (following)
      followingCount = await prisma.userFollow.count({
        where: { followerId: user.id }
      })
    } catch (error) {
      console.error("Error fetching follow counts:", error)
      // If the table doesn't exist yet, return 0
      // This will happen until the migration is run
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

