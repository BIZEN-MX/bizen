import { NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    // Fetch all achievement definitions
    let all: any[] = []
    try {
      all = await prisma.$queryRawUnsafe(
        `SELECT id, title, description, icon, category, threshold, xp_reward, rarity FROM achievements ORDER BY threshold ASC`
      ) as any[]
    } catch (e1: any) {
      console.error("[achievements] query 1 failed:", e1.message)
      // Try with schema prefix
      try {
        all = await prisma.$queryRawUnsafe(
          `SELECT id, title, description, icon, category, threshold, xp_reward, rarity FROM public.achievements ORDER BY threshold ASC`
        ) as any[]
      } catch (e2: any) {
        console.error("[achievements] query 2 failed:", e2.message)
        return NextResponse.json({ error: `DB error: ${e2.message}` }, { status: 500 })
      }
    }

    // Fetch unlocked achievements for this user
    let unlocked: any[] = []
    try {
      unlocked = await prisma.$queryRawUnsafe(
        `SELECT achievement_id, unlocked_at FROM user_achievements WHERE user_id = $1`,
        user.id
      ) as any[]
    } catch {
      try {
        unlocked = await prisma.$queryRawUnsafe(
          `SELECT achievement_id, unlocked_at FROM public.user_achievements WHERE user_id = $1`,
          user.id
        ) as any[]
      } catch (e3: any) {
        console.warn("[achievements] user_achievements query failed:", e3.message)
        // Non-fatal: just show all as locked
      }
    }

    const unlockedMap = new Map(unlocked.map((r: any) => [r.achievement_id, r.unlocked_at]))

    const result = all.map((a: any) => ({
      id:          a.id,
      title:       a.title,
      description: a.description,
      icon:        a.icon,
      category:    a.category,
      threshold:   Number(a.threshold),
      xpReward:    Number(a.xp_reward),
      rarity:      a.rarity,
      unlocked:    unlockedMap.has(a.id),
      unlockedAt:  unlockedMap.get(a.id) ?? null,
    }))

    return NextResponse.json(result)
  } catch (err: any) {
    console.error("[achievements] GET error:", err?.message ?? err)
    return NextResponse.json({ error: err?.message ?? "Failed" }, { status: 500 })
  }
}
