import { NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"
import { PrismaClient } from "@prisma/client"
import { calculateLevel, xpInCurrentLevel, totalXpForNextLevel, xpForNextLevel } from "@/lib/xp"

const prisma = new PrismaClient()

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

    // Calculate streak (simplified - counts days with completed lessons)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    let currentStreak = 0
    let checkDate = new Date(today)
    
    // Check last 30 days for streak
    for (let i = 0; i < 30; i++) {
      const startOfDay = new Date(checkDate)
      const endOfDay = new Date(checkDate)
      endOfDay.setHours(23, 59, 59, 999)
      
      const completedToday = await prisma.progress.count({
        where: {
          userId: user.id,
          completedAt: {
            gte: startOfDay,
            lte: endOfDay
          }
        }
      })
      
      if (completedToday > 0) {
        currentStreak++
        checkDate.setDate(checkDate.getDate() - 1)
      } else {
        // Streak broken
        if (i === 0) {
          // Check yesterday to allow for today not having progress yet
          checkDate.setDate(checkDate.getDate() - 1)
          continue
        }
        break
      }
    }

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

    return NextResponse.json({
      xp: profile.xp,
      level: currentLevel,
      xpInCurrentLevel: xpInLevel,
      totalXpForNextLevel: totalXpNeeded,
      xpForNextLevel: xpNeeded,
      lessonsCompleted,
      coursesEnrolled,
      currentStreak,
      certificatesCount,
      totalPoints: profile.xp // XP is the same as points
    })

  } catch (error) {
    console.error("Error fetching user stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

