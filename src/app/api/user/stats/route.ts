import { NextRequest, NextResponse } from "next/server"
export const dynamic = 'force-dynamic'
import { createSupabaseServer } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { calculateLevel, xpInCurrentLevel, totalXpForNextLevel, xpForNextLevel } from "@/lib/xp"

export async function GET() {
  try {
    const supabase = await createSupabaseServer()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get user profile with XP data using Raw SQL for reliability
    const profileResult: any[] = await prisma.$queryRaw`
      SELECT xp, bizcoins, level, created_at, current_streak 
      FROM public.profiles 
      WHERE user_id = ${user.id} 
      LIMIT 1
    `

    if (!profileResult || profileResult.length === 0) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      )
    }

    const inventoryResult: any[] = await prisma.$queryRaw`
      SELECT product_id FROM public.user_inventory WHERE user_id = ${user.id}
    `

    const userProfile = {
      xp: profileResult[0].xp || 0,
      bizcoins: profileResult[0].bizcoins || 0,
      level: profileResult[0].level || 1,
      createdAt: profileResult[0].created_at,
      currentStreak: profileResult[0].current_streak || 0,
      inventory: inventoryResult.map(i => ({ productId: i.product_id }))
    }

    // Get lessons completed count
    const lessonsCompleted = await prisma.progress.count({
      where: {
        userId: user.id,
        percent: 100,
        completedAt: { not: null }
      }
    })

    // Get courses enrolled
    const coursesEnrolled = await prisma.enrollment.count({
      where: { userId: user.id }
    })

    // Get certificates count
    const certificatesCount = await prisma.certificate.count({
      where: { userId: user.id }
    })

    // Use currentStreak from profile
    const currentStreak = userProfile.currentStreak || 0

    // Calculate level from XP
    const currentLevel = calculateLevel(userProfile.xp)
    const xpInLevel = xpInCurrentLevel(userProfile.xp)
    const totalXpNeeded = totalXpForNextLevel(userProfile.xp)
    const xpNeeded = xpForNextLevel(userProfile.xp)

    // Update level in database if it changed
    if (currentLevel !== userProfile.level) {
      await prisma.profile.update({
        where: { userId: user.id },
        data: { level: currentLevel }
      })
    }

    // Get active days this week (Sun–Sat) from daily challenge evidence posts
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
        authorUserId: user.id,
        createdAt: { gte: sunday, lte: saturday }
      },
      select: { createdAt: true }
    }).catch(() => [] as { createdAt: Date }[])

    // Also check any progress (lesson completions) for the week
    const weeklyProgress = await prisma.progress.findMany({
      where: {
        userId: user.id,
        completedAt: { gte: sunday, lte: saturday }
      },
      select: { completedAt: true }
    }).catch(() => [] as { completedAt: Date | null }[])

    const activeDatesSet = new Set<string>()
    for (const e of (weeklyEvidence as any[])) {
      if (e.createdAt) activeDatesSet.add(new Date(e.createdAt).toISOString().split("T")[0])
    }
    for (const p of (weeklyProgress as any[])) {
      if (p.completedAt) activeDatesSet.add(new Date(p.completedAt).toISOString().split("T")[0])
    }
    const weeklyActiveDays = Array.from(activeDatesSet)

    const result = {
      xp: userProfile.xp,
      level: currentLevel,
      xpInCurrentLevel: xpInLevel,
      xpNeeded: totalXpNeeded,
      xpToNextLevel: xpNeeded,
      lessonsCompleted,
      coursesEnrolled,
      currentStreak,
      certificatesCount,
      totalPoints: (userProfile as any).bizcoins || 0,
      bizcoins: (userProfile as any).bizcoins || 0,
      inventory: (userProfile as any).inventory?.map((i: any) => i.productId) || [],
      weeklyActiveDays,
    }

    const { logToFile } = require("@/lib/debugLogger")
    logToFile(`STATS API: user=${user.id} bizcoins=${result.bizcoins}`)

    return NextResponse.json(result)


  } catch (error) {
    console.error("Error fetching user stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    )
  }
}

