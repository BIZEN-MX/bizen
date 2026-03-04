import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import { calculateLevel } from "@/lib/xp"

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
        const { lessonId, starsEarned, xpEarned } = body as {
            lessonId: string
            starsEarned: 0 | 1 | 2 | 3
            xpEarned: number
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
            // First time: full stars * 5
            xpToAward = starsEarned * 5
        } else {
            // Repeated lesson: user said "lo máximo que dará de xp son 5xp"
            // We give 5 XP if they at least finish with 1 star, regardless of improvement
            xpToAward = starsEarned > 0 ? 5 : 0
        }

        // Upsert progress row
        await prisma.progress.upsert({
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

                rewardResult = await awardXp(userId, xpToAward)
            } catch (err) {
                console.error("[lesson/complete] Failed to award XP:", err)
            }
        }

        return NextResponse.json({
            success: true,
            starsEarned,
            xpAwarded: xpToAward,
            newLevel: rewardResult?.newLevel ?? null,
            bizcoinsAwarded: rewardResult?.bizcoinsAwarded ?? 0,
            isFirstCompletion,
        })
    } catch (error) {
        console.error("[lesson/complete] Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
