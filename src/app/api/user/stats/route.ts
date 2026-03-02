import { NextResponse } from "next/server"
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

    // Get user profile with XP data
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      select: {
        xp: true,
        level: true,
        createdAt: true,
        currentStreak: true,
      }
    })

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      )
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
    const currentStreak = profile.currentStreak || 0

    // Calculate level from XP
    const currentLevel = calculateLevel(profile.xp)
    const xpInLevel = xpInCurrentLevel(profile.xp)
    const totalXpNeeded = totalXpForNextLevel(profile.xp)
    const xpNeeded = xpForNextLevel(profile.xp)

    // Update level in database if it changed
    if (currentLevel !== profile.level) {
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
    for (const e of weeklyEvidence) {
      if (e.createdAt) activeDatesSet.add(e.createdAt.toISOString().split("T")[0])
    }
    for (const p of weeklyProgress) {
      if (p.completedAt) activeDatesSet.add(p.completedAt.toISOString().split("T")[0])
    }
    const weeklyActiveDays = Array.from(activeDatesSet)

    return NextResponse.json({
      xp: profile.xp,
      level: currentLevel,
      xpInCurrentLevel: xpInLevel,
      xpNeeded: totalXpNeeded,
      xpToNextLevel: xpNeeded,
      lessonsCompleted,
      coursesEnrolled,
      currentStreak,
      certificatesCount,
      totalPoints: profile.xp, // XP is the same as points
      weeklyActiveDays,
    })


  } catch (error) {
    console.error("Error fetching user stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    )
  }
}

