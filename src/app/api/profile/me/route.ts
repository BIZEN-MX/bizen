import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { calculateLevel } from "@/lib/xp"

export async function GET() {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userProfile = (await prisma.profile.findUnique({
      where: { userId: user.id }
    })) as any

    if (!userProfile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    // Ensure level is synced with XP
    const calculatedLevel = calculateLevel(userProfile.xp)
    if (calculatedLevel !== userProfile.level) {
      await prisma.profile.update({
        where: { userId: user.id },
        data: { level: calculatedLevel }
      })
      userProfile.level = calculatedLevel
    }

    // Get active days this week (Sun–Sat)
    const now = new Date()
    const dayOfWeek = now.getDay()
    const sunday = new Date(now)
    sunday.setDate(now.getDate() - dayOfWeek)
    sunday.setHours(0, 0, 0, 0)
    const saturday = new Date(sunday)
    saturday.setDate(sunday.getDate() + 6)
    saturday.setHours(23, 59, 59, 999)

    const [weeklyEvidence, weeklyProgress] = await Promise.all([
      prisma.evidencePost.findMany({
        where: { authorUserId: user.id, createdAt: { gte: sunday, lte: saturday } },
        select: { createdAt: true }
      }).catch(() => []),
      prisma.progress.findMany({
        where: { userId: user.id, completedAt: { gte: sunday, lte: saturday } },
        select: { completedAt: true }
      }).catch(() => [])
    ])

    const activeDatesSet = new Set<string>()
    for (const e of weeklyEvidence as any[]) {
      if (e.createdAt) activeDatesSet.add(new Date(e.createdAt).toISOString().split("T")[0])
    }
    for (const p of weeklyProgress as any[]) {
      if (p.completedAt) activeDatesSet.add(new Date(p.completedAt).toISOString().split("T")[0])
    }
    const weeklyActiveDays = Array.from(activeDatesSet)

    return NextResponse.json({
      ...userProfile,
      weeklyActiveDays
    })
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { nickname } = body

    const updateData: any = {}

    if (nickname !== undefined) {
      if (nickname.trim().length < 3) {
        return NextResponse.json({ error: "El apodo debe tener al menos 3 caracteres" }, { status: 400 })
      }
      if (nickname.trim().length > 30) {
        return NextResponse.json({ error: "El apodo no puede tener más de 30 caracteres" }, { status: 400 })
      }
      // Check if nickname is already taken
      const existing = await prisma.profile.findUnique({
        where: { nickname: nickname.trim() }
      })
      if (existing && existing.userId !== user.id) {
        return NextResponse.json({ error: "Este apodo ya está en uso" }, { status: 400 })
      }
      updateData.nickname = nickname.trim()
    }

    const updated = await prisma.profile.update({
      where: { userId: user.id },
      data: updateData
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}

