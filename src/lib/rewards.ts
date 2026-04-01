import { prisma } from "./prisma"
import { calculateLevel, getMexicoMidnight } from "./xp"

export interface RewardsResult {
    xpAwarded: number
    newTotalXp: number
    bizcoinsAwarded: number
    newTotalBizcoins: number
    oldLevel: number
    newLevel: number
    leveledUp: boolean
    streakUpdated: boolean
    currentStreak: number
}

export interface StreakTouchResult {
    streakUpdated: boolean
    currentStreak: number
    isFirstTouchToday: boolean
}

/**
 * Checks for active XP Boosts in the user's inventory.
 * A boost is active if purchased within the last 48 hours.
 */
export async function getRewardMultiplier(userId: string): Promise<number> {
    try {
        const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000)
        
        // Find if user has a Boost de XP (ID 14) active
        const activeBoost = await prisma.userInventoryItem.findFirst({
            where: {
                userId,
                productId: "14", // Boost de XP x2
                purchasedAt: { gte: fortyEightHoursAgo }
            }
        })

        if (activeBoost) return 2
        
        // Check for Global "Oferta de la semana" (Placeholder logic)
        // In a real scenario, this might check a global config table or a date range
        // For now, we'll implement it as a constant for this specific request if needed
        return 1
    } catch {
        return 1
    }
}

/**
 * Touches the daily streak for a user without awarding XP.
 * Call this from any action that should count as "active today":
 * - Participating in BIZEN Live
 * - Posting in the Forum
 * - Using AI tools (Budget AI, Vision Canvas)
 * - Any other meaningful engagement action
 */
export async function touchDailyStreak(userId: string): Promise<StreakTouchResult> {
    const profile = await prisma.profile.findUnique({
        where: { userId },
        select: { currentStreak: true, longestStreak: true, lastActive: true, role: true }
    })

    if (!profile) return { streakUpdated: false, currentStreak: 0, isFirstTouchToday: false }

    // Non-earning roles still get streak tracking for engagement purposes
    const now = new Date()
    const today = getMexicoMidnight(now)

    let newStreak = profile.currentStreak || 0
    let newLongestStreak = profile.longestStreak || 0
    let streakUpdated = false
    let isFirstTouchToday = false

    if (profile.lastActive) {
        const lastActiveDay = getMexicoMidnight(new Date(profile.lastActive))
        const diffTime = today.getTime() - lastActiveDay.getTime()
        const diffDays = Math.floor(diffTime / 86400000)

        if (diffDays === 0) {
            // Already active today — touch lastActive but don't change streak count
            isFirstTouchToday = false
        } else if (diffDays === 1) {
            // Active yesterday → increment streak
            newStreak += 1
            streakUpdated = true
            isFirstTouchToday = true
        } else {
            // Streak broken → reset to 1
            newStreak = 1
            streakUpdated = true
            isFirstTouchToday = true
        }
    } else {
        // First ever activity
        newStreak = 1
        streakUpdated = true
        isFirstTouchToday = true
    }

    if (newStreak > newLongestStreak) newLongestStreak = newStreak

    await prisma.profile.update({
        where: { userId },
        data: {
            currentStreak: newStreak,
            longestStreak: newLongestStreak,
            lastActive: now,
        } as any
    })

    return { streakUpdated, currentStreak: newStreak, isFirstTouchToday }
}

export async function awardXp(
    userId: string, 
    amount: number,
    options?: {
        category?: string;
        description?: string;
    }
): Promise<RewardsResult> {
    const profile = await prisma.profile.findUnique({
        where: { userId }
    })

    if (!profile) {
        throw new Error(`Profile not found for userId: ${userId}`)
    }

    // Role-based restriction: Only students and particulares can earn XP/Bizcoins
    const nonEarningRoles = ['admin', 'school_admin', 'teacher'];
    if (nonEarningRoles.includes(profile.role)) {
        return {
            xpAwarded: 0,
            newTotalXp: profile.xp,
            bizcoinsAwarded: 0,
            newTotalBizcoins: (profile as any).bizcoins || 0,
            oldLevel: profile.level,
            newLevel: profile.level,
            leveledUp: false,
            streakUpdated: false,
            currentStreak: profile.currentStreak || 0
        }
    }

    // Calculate new XP and Level
    const multiplier = await getRewardMultiplier(userId)
    const finalAmount = amount * multiplier
    const newTotalXp = profile.xp + finalAmount
    const bizcoinsAwarded = finalAmount // Maintain 1:1 ratio with boosted XP
    const newTotalBizcoins = ((profile as any).bizcoins || 0) + bizcoinsAwarded
    const oldLevel = profile.level
    const newLevel = calculateLevel(newTotalXp)
    const leveledUp = newLevel > oldLevel

    // Handle Streak Logic using localized Mexico Time
    const now = new Date()
    const today = getMexicoMidnight(now)

    let newStreak = profile.currentStreak || 0
    let newLongestStreak = profile.longestStreak || 0
    let streakUpdated = false

    if (profile.lastActive) {
        const lastActiveDay = getMexicoMidnight(new Date(profile.lastActive))

        const diffTime = today.getTime() - lastActiveDay.getTime()
        const diffDays = Math.floor(diffTime / 86400000)

        if (diffDays === 1) {
            // Last active was yesterday, increment streak
            newStreak += 1
            streakUpdated = true
        } else if (diffDays > 1 || newStreak === 0) {
            // Streak broken or just starting today, set/reset to 1
            newStreak = 1
            streakUpdated = true
        }
    } else {
        // First time being active
        newStreak = 1
        streakUpdated = true
    }

    // Update longest streak if necessary
    if (newStreak > newLongestStreak) {
        newLongestStreak = newStreak
    }

    // Save the updates to the database (in a transaction to ensure bizcoins and wallet record match)
    await prisma.$transaction(async (tx) => {
        await tx.profile.update({
            where: { userId },
            data: {
                xp: newTotalXp,
                bizcoins: newTotalBizcoins,
                level: newLevel,
                currentStreak: newStreak,
                longestStreak: newLongestStreak,
                lastActive: now
            } as any
        })

        if (bizcoinsAwarded > 0) {
            await (tx as any).walletTransaction.create({
                data: {
                    userId,
                    amount: bizcoinsAwarded,
                    type: "income",
                    category: options?.category || "activity_reward",
                    description: options?.description || "Recompensa de actividad"
                }
            })
        }
    })

    return {
        xpAwarded: finalAmount,
        newTotalXp,
        bizcoinsAwarded,
        newTotalBizcoins,
        oldLevel,
        newLevel,
        leveledUp,
        streakUpdated,
        currentStreak: newStreak
    }
}

