import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { calculateLevel } from "@/lib/xp"

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { xpAmount, reason } = body

    if (!xpAmount || typeof xpAmount !== 'number' || xpAmount <= 0) {
      return NextResponse.json(
        { error: "Invalid XP amount" },
        { status: 400 }
      )
    }

    // Get current profile
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      select: { xp: true, level: true, role: true }
    })
    
    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      )
    }

    // Skip for admins/teachers
    if (profile.role === 'school_admin' || profile.role === 'teacher') {
       return NextResponse.json({
         success: true,
         message: "XP not tracked for staff",
         xpAwarded: 0,
         totalXp: profile.xp,
         level: profile.level
       })
    }

    // Calculate new XP and level
    const newXp = profile.xp + xpAmount
    const newLevel = calculateLevel(newXp)
    const leveledUp = newLevel > profile.level

    // Update profile and create notification if leveled up
    await prisma.$transaction(async (tx) => {
      await tx.profile.update({
        where: { userId: user.id },
        data: {
          xp: newXp,
          level: newLevel
        }
      })

      if (leveledUp) {
        await tx.notification.create({
          data: {
            userId: user.id,
            title: "¡Has subido de nivel!",
            message: `Felicidades, has alcanzado el Nivel ${newLevel}. Sigue así para desbloquear nuevas recompensas.`,
            type: "achievement",
            priority: "high",
            link: "/profile"
          }
        })
      }
    })

    console.log(`✅ Awarded ${xpAmount} XP to user ${user.id} for: ${reason || 'unknown'}`)

    return NextResponse.json({
      success: true,
      xpAwarded: xpAmount,
      totalXp: newXp,
      level: newLevel,
      leveledUp,
      previousLevel: profile.level
    })

  } catch (error) {
    console.error("Error awarding XP:", error)
    return NextResponse.json(
      { error: "Failed to award XP" },
      { status: 500 }
    )
  }
}

