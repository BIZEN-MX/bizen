import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

// POST /api/profile/follow - Follow a user
export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { followingId } = body

    if (!followingId) {
      return NextResponse.json({ error: "followingId is required" }, { status: 400 })
    }

    if (followingId === user.id) {
      return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 })
    }

    // Check if user is already following
    const existingFollow = await prisma.userFollow.findUnique({
      where: {
        followerId_followingId: {
          followerId: user.id,
          followingId: followingId
        }
      }
    })

    if (existingFollow) {
      return NextResponse.json({ error: "Already following this user" }, { status: 400 })
    }

    // Create the follow relationship
    const follow = await prisma.userFollow.create({
      data: {
        followerId: user.id,
        followingId: followingId
      }
    })

    return NextResponse.json({ 
      success: true, 
      message: "User followed successfully",
      follow 
    })
  } catch (error: any) {
    console.error("Error following user:", error)
    
    // Handle unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "Already following this user" }, { status: 400 })
    }
    
    return NextResponse.json({ error: "Failed to follow user" }, { status: 500 })
  }
}

// DELETE /api/profile/follow - Unfollow a user
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const followingId = searchParams.get("followingId")

    if (!followingId) {
      return NextResponse.json({ error: "followingId is required" }, { status: 400 })
    }

    // Delete the follow relationship
    await prisma.userFollow.delete({
      where: {
        followerId_followingId: {
          followerId: user.id,
          followingId: followingId
        }
      }
    })

    return NextResponse.json({ 
      success: true, 
      message: "User unfollowed successfully"
    })
  } catch (error: any) {
    console.error("Error unfollowing user:", error)
    
    // Handle not found error
    if (error.code === 'P2025') {
      return NextResponse.json({ error: "Not following this user" }, { status: 404 })
    }
    
    return NextResponse.json({ error: "Failed to unfollow user" }, { status: 500 })
  }
}

// GET /api/profile/follow?userId=xxx - Check if current user is following a specific user
export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 })
    }

    // Check if user is following
    const follow = await prisma.userFollow.findUnique({
      where: {
        followerId_followingId: {
          followerId: user.id,
          followingId: userId
        }
      }
    })

    return NextResponse.json({ 
      isFollowing: !!follow,
      follow: follow || null
    })
  } catch (error) {
    console.error("Error checking follow status:", error)
    return NextResponse.json({ error: "Failed to check follow status" }, { status: 500 })
  }
}

