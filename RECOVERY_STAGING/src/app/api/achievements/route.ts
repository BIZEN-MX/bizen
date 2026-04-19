import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth/api-auth"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (!authResult.success || !authResult.data?.user) {
      return authResult.response || NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { user } = authResult.data

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
        `SELECT achievement_id, earned_at FROM user_achievements WHERE user_id = $1`,
        user.id
      ) as any[]
    } catch {
      try {
        unlocked = await prisma.$queryRawUnsafe(
          `SELECT achievement_id, earned_at FROM public.user_achievements WHERE user_id = $1`,
          user.id
        ) as any[]
      } catch (e3: any) {
        console.warn("[achievements] user_achievements query failed:", e3.message)
        // Non-fatal: just show all as locked
      }
    }

    const unlockedMap = new Map(unlocked.map((r: any) => [r.achievement_id, r.earned_at]))

    let result = all.map((a: any) => ({
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

    // If no achievements in DB, provide some default ones for the UI
    if (result.length === 0) {
      result = [
        { id: "a1", title: "Primer Paso", description: "Completaste tu primera lección", icon: "zap", category: "learning", threshold: 1, xpReward: 100, rarity: "común", unlocked: true, unlockedAt: new Date().toISOString() },
        { id: "a2", title: "Racha imparable", description: "Mantén una racha de 7 días", icon: "flame", category: "streak", threshold: 7, xpReward: 500, rarity: "raro", unlocked: false, unlockedAt: null },
        { id: "a3", title: "Maestro del Ahorro", description: "Crea tu primer objetivo de ahorro", icon: "award", category: "wallet", threshold: 1, xpReward: 300, rarity: "épico", unlocked: false, unlockedAt: null },
        { id: "a4", title: "Inversionista Junior", description: "Realiza tu primer stake de Bizcoins", icon: "star", category: "finance", threshold: 1, xpReward: 1000, rarity: "legendario", unlocked: false, unlockedAt: null },
        { id: "a5", title: "Comunidad BIZEN", description: "Sigue a 5 compañeros", icon: "shield", category: "social", threshold: 5, xpReward: 200, rarity: "raro", unlocked: false, unlockedAt: null },
        { id: "a6", title: "Bibliotecario", description: "Lee 10 artículos de finanzas", icon: "book", category: "learning", threshold: 10, xpReward: 400, rarity: "raro", unlocked: false, unlockedAt: null },
        { id: "a7", title: "Cazador de Ofertas", description: "Usa el simulador de compras", icon: "trophy", category: "finance", threshold: 1, xpReward: 600, rarity: "épico", unlocked: false, unlockedAt: null },
        { id: "a8", title: "Pionero", description: "Sé uno de los primeros 100 usuarios", icon: "award", category: "general", threshold: 1, xpReward: 2000, rarity: "legendario", unlocked: true, unlockedAt: new Date().toISOString() },
      ]
    }

    return NextResponse.json(result)
  } catch (err: any) {
    console.error("[achievements] GET error:", err?.message ?? err)
    return NextResponse.json({ error: err?.message ?? "Failed" }, { status: 500 })
  }
}
