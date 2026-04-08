import { NextRequest, NextResponse } from "next/server"
export const dynamic = 'force-dynamic'
import { createSupabaseServer } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { calculateLevel, xpInCurrentLevel, totalXpForNextLevel, xpForNextLevel, calculateCurrentStreak } from "@/lib/xp"

export async function GET() {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parallel fetch with carefully managed Prisma calls
    const [profile, topics, progress, diagnostic, transactions] = await Promise.all([
      prisma.profile.findUnique({
        where: { userId: user.id },
      }),
      prisma.topic.findMany({
        where: { isActive: true },
        include: {
          courses: {
            orderBy: { order: 'asc' }
          },
          _count: { select: { courses: true } }
        },
        orderBy: { displayOrder: 'asc' }
      }),
      prisma.progress.findMany({
        where: { userId: user.id },
      }),
      prisma.diagnosticResult.findFirst({
        where: { email: { equals: user.email, mode: 'insensitive' } },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.walletTransaction.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 10
      })
    ]).catch(err => {
      console.error("Dashboard Init DB Error:", err)
      throw err
    })

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 500 })
    }

    // Calculate Stats
    const currentXp = profile.xp || 0
    const currentLevel = calculateLevel(currentXp)
    const currentStreakCount = calculateCurrentStreak(profile.lastActive, profile.currentStreak || 0)

    // Secondary data (counts)
    const [lessonsCompleted, coursesEnrolled, certificatesCount, inventoryResults] = await Promise.all([
      prisma.progress.count({ where: { userId: user.id, percent: 100 } }),
      prisma.enrollment.count({ where: { userId: user.id } }),
      prisma.certificate.count({ where: { userId: user.id } }),
      prisma.userInventoryItem.findMany({ where: { userId: user.id }, select: { productId: true } })
    ]).catch(() => [0, 0, 0, []])

    const inventoryItems = Array.isArray(inventoryResults) ? inventoryResults : []

    // Weekly activity
    const now = new Date()
    const sunday = new Date(now)
    sunday.setDate(now.getDate() - now.getDay())
    sunday.setHours(0, 0, 0, 0)
    const weekRange = { gte: sunday }

    const weeklyActivity = await prisma.progress.findMany({
      where: { userId: user.id, completedAt: weekRange },
      select: { completedAt: true }
    }).catch(() => [])

    const activeDatesSet = new Set<string>()
    weeklyActivity.forEach((p: any) => {
      if (p.completedAt) activeDatesSet.add(new Date(p.completedAt).toISOString().split("T")[0])
    })

    return NextResponse.json({
      stats: {
        xp: currentXp,
        level: currentLevel,
        xpInCurrentLevel: xpInCurrentLevel(currentXp),
        xpNeeded: totalXpForNextLevel(currentXp),
        xpToNextLevel: xpForNextLevel(currentXp),
        lessonsCompleted,
        coursesEnrolled,
        currentStreak: currentStreakCount,
        certificatesCount,
        bizcoins: profile.bizcoins || 0,
        inventory: inventoryItems.map((i:any) => i.productId),
        weeklyActiveDays: Array.from(activeDatesSet),
      },
      topics,
      progress: progress.map(p => p.lessonId || (p as any).slug).filter(Boolean),
      diagnostic: diagnostic ? { exists: true, adnProfile: diagnostic.dnaProfile } : { exists: false },
      profile: {
          ...profile,
          adnProfile: profile.dnaProfile || diagnostic?.dnaProfile
      },
      transactions: transactions || []
    })

  } catch (error) {
    console.error("Dashboard Init Fatal Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
