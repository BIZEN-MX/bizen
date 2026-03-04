import { NextRequest, NextResponse } from "next/server"
export const dynamic = 'force-dynamic'
import { createSupabaseServer } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { calculateLevel, xpInCurrentLevel, totalXpForNextLevel, xpForNextLevel, calculateCurrentStreak, getMexicoMidnight } from "@/lib/xp"

export async function GET() {
  let user: any = null

  try {
    const supabase = await createSupabaseServer()

    // Get current user
    const { data: { user: supabaseUser }, error: authError } = await supabase.auth.getUser()
    user = supabaseUser

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get user profile with XP data using Prisma for reliability
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      select: {
        xp: true,
        bizcoins: true,
        level: true,
        createdAt: true,
        currentStreak: true,
        lastActive: true
      }
    })

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      )
    }

    const inventoryItems = await prisma.userInventoryItem.findMany({
      where: { userId: user.id },
      select: { productId: true }
    })

    const userProfile = {
      xp: profile.xp || 0,
      bizcoins: profile.bizcoins || 0,
      level: profile.level || 1,
      createdAt: profile.createdAt,
      currentStreak: profile.currentStreak || 0,
      inventory: inventoryItems.map(i => ({ productId: i.productId }))
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

    // Use timezone-aware streak calculation
    let currentStreak = calculateCurrentStreak(profile.lastActive, profile.currentStreak || 0)

    // Calculate level from XP
    const currentLevel = calculateLevel(userProfile.xp)
    const xpInLevel = xpInCurrentLevel(userProfile.xp)
    const totalXpNeeded = totalXpForNextLevel(userProfile.xp)
    const xpNeeded = xpForNextLevel(userProfile.xp)

    // Update level or streak in database IF they changed (Repair/Sync)
    if (currentLevel !== profile.level || currentStreak !== (profile.currentStreak || 0)) {
      await prisma.profile.update({
        where: { userId: user.id },
        data: {
          level: currentLevel,
          currentStreak: currentStreak,
        }
      })
    }

    const now = new Date();

    // Get active days this week (Sun–Sat)
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
      totalPoints: userProfile.bizcoins || 0,
      bizcoins: userProfile.bizcoins || 0,
      inventory: userProfile.inventory.map(i => i.productId) || [],
      weeklyActiveDays,
    }

    return NextResponse.json(result)

  } catch (error: any) {
    console.error("Error fetching user stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch stats", details: error.message },
      { status: 500 }
    )
  }
}
