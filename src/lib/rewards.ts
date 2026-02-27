import { prisma } from "./prisma"

/**
 * Calculates a player's level based on their XP.
 * Simple curve: Level = floor(sqrt(XP / 100)) + 1
 * e.g.,
 * XP 0-99 -> Lvl 1
 * XP 100-399 -> Lvl 2
 * XP 400-899 -> Lvl 3
 * XP 900-1599 -> Lvl 4
 * XP 1600-2499 -> Lvl 5
 */
export function calculateLevelFromXp(xp: number): number {
    if (xp < 0) return 1
    return Math.floor(Math.sqrt(xp / 100)) + 1
}

export interface RewardsResult {
    xpAwarded: number
    newTotalXp: number
    oldLevel: number
    newLevel: number
    leveledUp: boolean
    streakUpdated: boolean
    currentStreak: number
}

/**
 * Awards XP to a user and updates their daily streak if applicable.
 * @param userId - the ID of the user receiving the reward
 * @param amount - the amount of XP to award
 */
export async function awardXp(userId: string, amount: number): Promise<RewardsResult> {
    const profile = await prisma.profile.findUnique({
        where: { userId }
    })

    if (!profile) {
        throw new Error(`Profile not found for userId: ${userId}`)
    }

    // Calculate new XP and Level
    const newTotalXp = profile.xp + amount
    const oldLevel = profile.level
    const newLevel = calculateLevelFromXp(newTotalXp)
    const leveledUp = newLevel > oldLevel

    // Handle Streak Logic using UTC to be consistent with the Daily Challenge system
    const now = new Date()
    const today = new Date(now)
    today.setUTCHours(0, 0, 0, 0)

    let newStreak = profile.currentStreak || 0
    let newLongestStreak = profile.longestStreak || 0
    let streakUpdated = false

    if (profile.lastActive) {
        const lastActiveDay = new Date(profile.lastActive)
        lastActiveDay.setUTCHours(0, 0, 0, 0)

        const diffTime = today.getTime() - lastActiveDay.getTime()
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays === 1) {
            // Last active was yesterday, increment streak
            newStreak += 1
            streakUpdated = true
        } else if (diffDays > 1) {
            // Streak broken, reset to 1 
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

    // Save the updates to the database
    await prisma.profile.update({
        where: { userId },
        data: {
            xp: newTotalXp,
            level: newLevel,
            currentStreak: newStreak,
            longestStreak: newLongestStreak,
            lastActive: now
        }
    })

    return {
        xpAwarded: amount,
        newTotalXp,
        oldLevel,
        newLevel,
        leveledUp,
        streakUpdated,
        currentStreak: newStreak
    }
}
