import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import { calculateLevel } from "@/lib/xp"
import { checkAndAwardAchievements } from "@/lib/achievements"

/**
 * POST /api/lesson/complete
 * Body: { lessonId: string, starsEarned: 0|1|2|3, xpEarned: number }
 *
 * RULES:
 * - 3 stars = 15 XP
 * - 2 stars = 10 XP
 * - 1 star = 5 XP
 * - 0 stars = 0 XP
 * - REPEAT: Max 5 XP if lesson was already completed (and starsEarned > 0).
 *
 * - Awards XP on FIRST completion based on stars.
 * - Awards INCREMENTAL XP if stars improved from previous best.
 * - Awards REPEAT BONUS (5 XP) if stars did NOT improve but lesson was finished with >= 1 star.
 */
export async function POST(req: NextRequest) {
    try {
        // Get authenticated user
        const cookieStore = await cookies()
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() { return cookieStore.getAll() },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            )
                        } catch { /* Server Component context */ }
                    },
                },
            }
        )

        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const { lessonId, starsEarned, xpEarned, answers } = body as {
            lessonId: string
            starsEarned: 0 | 1 | 2 | 3
            xpEarned: number
            answers?: Record<string, { isCorrect: boolean, answerData?: any }>
        }

        if (!lessonId || starsEarned === undefined || xpEarned === undefined) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        const userId = user.id

        // Ensure lesson exists in the database (create stub if missing)
        // This prevents foreign key errors for lessons that are defined in code but not yet in DB
        const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } })
        if (!lesson) {
            await prisma.lesson.create({
                data: {
                    id: lessonId,
                    title: (lessonId.charAt(0).toUpperCase() + lessonId.slice(1)).replace(/-/g, " "),
                    contentType: "interactive",
                    order: 0,
                    xpReward: 50
                }
            }).catch(err => console.error("[lesson/complete] Failed to create lesson stub:", err))
        }

        // Check existing progress for this lesson to determine rewards
        const existing = await prisma.progress.findUnique({
            where: { userId_lessonId: { userId, lessonId } },
        })

        const isFirstCompletion = !existing?.completedAt
        const prevStars = (existing?.starsEarned ?? 0) as 0 | 1 | 2 | 3
        const starsImproved = starsEarned > prevStars

        let xpToAward = 0

        if (isFirstCompletion) {
            // First time: stars * 5 XP (Max 15)
            xpToAward = starsEarned * 5
        } else if (starsImproved) {
            // Improved stars: difference * 5 XP
            // e.g., 1 star -> 3 stars = (3-1)*5 = 10 XP
            xpToAward = (starsEarned - prevStars) * 5
        } else {
            // No improvement or same stars: 0 XP
            xpToAward = 0
        }

        console.log(`[lesson/complete] User ${userId} completed ${lessonId}. Stars: ${starsEarned} (prev: ${prevStars}). Awarding: ${xpToAward} XP.`)

        // Upsert progress row
        const progressRecord = await prisma.progress.upsert({
            where: { userId_lessonId: { userId, lessonId } },
            create: {
                userId,
                lessonId,
                percent: 100,
                starsEarned,
                completedAt: new Date(),
            },
            update: {
                percent: 100,
                completedAt: new Date(),
                // Only upgrade stars, never downgrade
                starsEarned: starsImproved ? starsEarned : prevStars,
            },
        })

        // Save individual step responses for profiling
        if (answers && Object.keys(answers).length > 0) {
            try {
                // Delete previous answers to this lesson if repeating
                await prisma.stepResponse.deleteMany({
                    where: { progressId: progressRecord.id }
                })

                const responseEntries = Object.entries(answers).map(([stepId, res]) => ({
                    progressId: progressRecord.id,
                    stepId,
                    answer: (res.answerData || {}) as any,
                    isCorrect: res.isCorrect
                }))

                await prisma.stepResponse.createMany({
                    data: responseEntries
                })

                // 🔥 Trigger DNA Profile Refinement (Placeholder for logic)
                // if (lessonId.includes('behavioral') || lessonId.includes('sesgo')) {
                //    await refineDnaProfile(userId, answers)
                // }
            } catch (err) {
                console.error("[lesson/complete] Failed to save step responses:", err)
            }
        }

        // Award XP to profile using centralized reward utility
        let rewardResult = null
        if (xpToAward > 0) {
            try {
                const { awardXp } = await import("@/lib/rewards")

                // Ensure profile exists first
                const profile = await prisma.profile.findUnique({ where: { userId } })
                if (!profile) {
                    await prisma.profile.create({
                        data: {
                            userId,
                            fullName: user.user_metadata?.full_name || "Usuario Bizen",
                            xp: 0,
                            level: 1,
                        }
                    })
                }

                rewardResult = await awardXp(userId, xpToAward, {
                    category: "lesson_reward",
                    description: `Lección completada: ${lesson?.title || lessonId}`
                })
            } catch (err) {
                console.error("[lesson/complete] Failed to award XP:", err)
            }
        }

        // Check & award achievements after XP is granted
        let newAchievements: string[] = []
        try {
            const [profile, lessonCount, courseCount] = await Promise.all([
                prisma.profile.findUnique({
                    where: { userId },
                    select: { currentStreak: true, level: true, bizcoins: true, postsCreated: true }
                }),
                prisma.progress.count({ where: { userId, percent: 100 } }),
                // Count distinct completed courses (all lessons in unit completed)
                prisma.progress.count({ where: { userId, percent: 100 } }).catch(() => 0)
            ])

            // Count inventory items for store achievements
            const inventoryCount = await prisma.userInventoryItem.count({ where: { userId } }).catch(() => 0)

            newAchievements = await checkAndAwardAchievements(userId, {
                lessonsCompleted:  lessonCount,
                coursesCompleted:  isFirstCompletion ? 1 : 0, // will be re-checked on context
                currentStreak:     profile?.currentStreak ?? 0,
                level:             profile?.level         ?? 1,
                bizcoins:          profile?.bizcoins      ?? 0,
                postsCreated:      profile?.postsCreated  ?? 0,
                itemsOwned:        inventoryCount,
            })
        } catch (achErr) {
            console.warn("[lesson/complete] Achievement check failed:", achErr)
        }

        return NextResponse.json({
            success: true,
            starsEarned,
            xpAwarded: xpToAward,
            newLevel: rewardResult?.newLevel ?? null,
            bizcoinsAwarded: rewardResult?.bizcoinsAwarded ?? 0,
            isFirstCompletion,
            newAchievements,
        })
    } catch (error) {
        console.error("[lesson/complete] Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
