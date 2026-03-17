/**
 * Achievement checking engine.
 * Call checkAndAwardAchievements(userId, context) from any API route
 * after a meaningful event occurs (lesson completed, streak updated, etc.)
 *
 * Returns an array of newly-unlocked achievement IDs (can be empty).
 */

import { prisma } from "@/lib/prisma"

export type AchievementContext = {
  lessonsCompleted?: number
  currentStreak?: number
  level?: number
  bizcoins?: number
  postsCreated?: number
}

interface AchievementDef {
  id: string
  category: string
  threshold: number
  xp_reward: number
}

/** Evaluate all achievement rules against current context */
function meetsThreshold(def: AchievementDef, ctx: AchievementContext): boolean {
  switch (def.category) {
    case "learning": return (ctx.lessonsCompleted ?? 0) >= def.threshold
    case "streak":   return (ctx.currentStreak    ?? 0) >= def.threshold
    case "level":    return (ctx.level            ?? 1) >= def.threshold
    case "coins":    return (ctx.bizcoins         ?? 0) >= def.threshold
    case "forum":    return (ctx.postsCreated     ?? 0) >= def.threshold
    default: return false
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

    // 4. insert new user_achievements rows
    for (const achievement of toAward) {
      await prisma.$executeRawUnsafe(
        `INSERT INTO public.user_achievements (user_id, achievement_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
        userId,
        achievement.id
      )
      // Grant XP bonus for each achievement if applicable
      if (achievement.xp_reward > 0) {
        await prisma.profile.update({
          where: { userId },
          data: { xp: { increment: achievement.xp_reward } },
        })
      }
    }

    return toAward.map(a => a.id)
  } catch (err) {
    // Never crash the caller — achievements are best-effort
    console.warn("[achievements] check failed silently:", err)
    return []
  }
}
