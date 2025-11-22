import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const targetUserId = params.userId

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
      // Return 0 if there's an error (table might not exist yet)
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

