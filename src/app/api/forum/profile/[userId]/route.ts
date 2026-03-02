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

    const profile = (await prisma.profile.findUnique({
      where: { userId },
      select: {
        userId: true,
        nickname: true,
        fullName: true,
        reputation: true,
        level: true,
        postsCreated: true,
        commentsCreated: true,
        currentStreak: true,
        createdAt: true,
        avatar: true,
        forumUserBadges: {
          include: {
            badge: true
          },
          orderBy: {
            earnedAt: 'desc'
          }
        },
        inventory: {
          select: {
            productId: true
          }
        }
      }
    })) as any

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

    // Get active days this week (Sun–Sat) from daily challenge evidence posts and progress
    const now = new Date()
    const dayOfWeek = now.getDay() // 0=Sun
    const sunday = new Date(now)
    sunday.setDate(now.getDate() - dayOfWeek)
    sunday.setHours(0, 0, 0, 0)
    const saturday = new Date(sunday)
    saturday.setDate(sunday.getDate() + 6)
    saturday.setHours(23, 59, 59, 999)

    // Check daily challenge evidence post submissions for the week
    const weeklyEvidence = await prisma.evidencePost.findMany({
      where: {
        authorUserId: userId,
        createdAt: { gte: sunday, lte: saturday }
      },
      select: { createdAt: true }
    }).catch(() => [] as { createdAt: Date }[])

    // Also check any progress (lesson completions) for the week
    const weeklyProgress = await prisma.progress.findMany({
      where: {
        userId: userId,
        completedAt: { gte: sunday, lte: saturday }
      },
      select: { completedAt: true }
    }).catch(() => [] as { completedAt: Date | null }[])

    const activeDatesSet = new Set<string>()
    for (const e of weeklyEvidence) {
      if (e.createdAt) activeDatesSet.add(e.createdAt.toISOString().split("T")[0])
    }
    for (const p of weeklyProgress) {
      if (p.completedAt) activeDatesSet.add(p.completedAt.toISOString().split("T")[0])
    }
    const weeklyActiveDays = Array.from(activeDatesSet)

    return NextResponse.json({
      ...profile,
      nickname: profile.nickname || profile.fullName.split(' ')[0],
      badges: profile.forumUserBadges,
      inventory: profile.inventory.map((item: any) => item.productId),
      recentActivity: allActivity,
      weeklyActiveDays,
    })
  } catch (error) {
    console.error("Error fetching forum profile:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}
