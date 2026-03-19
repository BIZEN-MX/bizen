/**
 * Achievement checking engine.
 * Call checkAndAwardAchievements(userId, context) from any API route
 * after a meaningful event occurs (lesson completed, streak updated, etc.)
 *
 * Returns an array of newly-unlocked achievement IDs (can be empty).
 */

import { prisma } from "@/lib/prisma"

export type AchievementContext = {
  lessonsCompleted?: number   // lesson / learning categories
  coursesCompleted?: number   // course category
  currentStreak?: number      // streak category
  level?: number              // level category
  bizcoins?: number           // coins category
  postsCreated?: number       // forum / social categories
  retosCompleted?: number     // reto category
  itemsOwned?: number         // store category
  cashflowWon?: number        // financial category
  consistencyDays?: number    // consistency category
}

interface AchievementDef {
  id: string
  category: string
  threshold: number
  xp_reward: number
}

/** Map each DB category to the correct context field */
function meetsThreshold(def: AchievementDef, ctx: AchievementContext): boolean {
  const t = def.threshold
  switch (def.category) {
    // Lecciones
    case "learning":
    case "lesson":
      return (ctx.lessonsCompleted ?? 0) >= t

    // Cursos
    case "course":
      return (ctx.coursesCompleted ?? 0) >= t

    // Racha diaria
    case "streak":
      return (ctx.currentStreak ?? 0) >= t

    // Nivel
    case "level":
      return (ctx.level ?? 1) >= t

    // Monedas
    case "coins":
      return (ctx.bizcoins ?? 0) >= t

    // Foro
    case "forum":
    case "social":
      return (ctx.postsCreated ?? 0) >= t

    // Retos diarios
    case "reto":
      return (ctx.retosCompleted ?? 0) >= t

    // Tienda
    case "store":
      return (ctx.itemsOwned ?? 0) >= t

    // Cashflow / simuladores
    case "financial":
      return (ctx.cashflowWon ?? 0) >= t

    // Consistencia general
    case "consistency":
      return (ctx.consistencyDays ?? 0) >= t

    default:
      return false
  }
}

export async function checkAndAwardAchievements(
  userId: string,
  ctx: AchievementContext
): Promise<string[]> {
  try {
    // 1. fetch all achievement definitions
    const allDefs = await prisma.$queryRawUnsafe<AchievementDef[]>(
      `SELECT id, category, threshold, xp_reward FROM public.achievements`
    )

    // 2. fetch already-unlocked achievements for this user
    const unlocked = await prisma.$queryRawUnsafe<{ achievement_id: string }[]>(
      `SELECT achievement_id FROM public.user_achievements WHERE user_id = $1`,
      userId
    )
    const unlockedSet = new Set(unlocked.map(r => r.achievement_id))

    // 3. find newly eligible achievements
    const toAward = allDefs.filter(
      d => !unlockedSet.has(d.id) && meetsThreshold(d, ctx)
    )

    if (toAward.length === 0) return []

    // 4. insert new user_achievements rows + grant XP
    for (const achievement of toAward) {
      await prisma.$executeRawUnsafe(
        `INSERT INTO public.user_achievements (user_id, achievement_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
        userId,
        achievement.id
      )
      if (achievement.xp_reward > 0) {
        await prisma.profile.update({
          where: { userId },
          data: { xp: { increment: achievement.xp_reward } },
        })
      }
    }

    console.log(`[achievements] Awarded ${toAward.length} to ${userId}:`, toAward.map(a => a.id))
    return toAward.map(a => a.id)
  } catch (err) {
    // Never crash the caller — achievements are best-effort
    console.warn("[achievements] check failed silently:", err)
    return []
  }
}
