import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

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

    const profile = await prisma.profile.findUnique({
      where: { userId: params.userId },
      select: {
        userId: true,
        nickname: true,
        fullName: true,
        reputation: true,
        level: true,
        postsCreated: true,
        commentsCreated: true,
        acceptedAnswers: true,
        createdAt: true,
        forumUserBadges: {
          include: {
            badge: true
          },
          orderBy: {
            earnedAt: 'desc'
          }
        }
      }
    })

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    // Get recent threads
    const recentThreads = await prisma.forumThread.findMany({
      where: {
        authorId: params.userId,
        moderationStatus: 'approved',
        isHidden: false
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        title: true,
        score: true,
        commentCount: true,
        createdAt: true
      }
    })

    return NextResponse.json({
      ...profile,
      nickname: profile.nickname || profile.fullName.split(' ')[0],
      badges: profile.forumUserBadges,
      recentThreads
    })
  } catch (error) {
    console.error("Error fetching forum profile:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

