import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"
import { PrismaClient } from "@prisma/client"
import { calculateLevel } from "@/lib/xp"

const prisma = new PrismaClient()

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
      select: { xp: true, level: true }
    })

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      )
    }

    // Calculate new XP and level
    const newXp = profile.xp + xpAmount
    const newLevel = calculateLevel(newXp)
    const leveledUp = newLevel > profile.level

    // Update profile
    await prisma.profile.update({
      where: { userId: user.id },
      data: {
        xp: newXp,
        level: newLevel
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
  } finally {
    await prisma.$disconnect()
  }
}

