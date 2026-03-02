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

    const profile = await prisma.profile.findUnique({
      where: { userId },
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
        avatar: true,
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
        authorId: userId,
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

    // Get recent evidence posts (Daily Challenges)
    const recentEvidence = await prisma.evidencePost.findMany({
      where: { authorUserId: userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        dailyChallenge: {
          select: { title: true }
        }
      }
    })

    const allActivity = [
      ...recentThreads.map(t => ({
        id: t.id,
        title: t.title,
        createdAt: t.createdAt,
        type: 'thread',
        score: t.score,
        commentCount: t.commentCount
      })),
      ...recentEvidence.map(e => ({
        id: e.id,
        title: `Reto: ${e.dailyChallenge?.title || "Evidencia"}`,
        createdAt: e.createdAt,
        type: 'evidence'
      }))
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 15)

    return NextResponse.json({
      ...profile,
      nickname: profile.nickname || profile.fullName.split(' ')[0],
      badges: profile.forumUserBadges,
      recentActivity: allActivity
    })
  } catch (error) {
    console.error("Error fetching forum profile:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}
