import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import { calculateLevel } from "@/lib/xp"

/**
 * POST /api/lesson/complete
 * Body: { lessonId: string, starsEarned: 0|1|2|3, xpEarned: number }
 *
 * - Creates or updates the progress row (upsert).
 *   If the lesson was already completed with MORE stars, we don't downgrade stars.
 * - Awards XP only on FIRST completion or if stars improved.
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

        // Check existing progress for this lesson
        const existing = await prisma.progress.findUnique({
            where: { userId_lessonId: { userId, lessonId } },
        })

        const isFirstCompletion = !existing?.completedAt
        const prevStars = existing?.starsEarned ?? 0
        const starsImproved = starsEarned > prevStars

        // Only award XP if this is a new completion or an improvement
        const xpToAward = isFirstCompletion || starsImproved ? xpEarned - (isFirstCompletion ? 0 : prevStars * 5) : 0

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

        // Award XP to profile
        let newLevel: number | undefined
        if (xpToAward > 0) {
            const profile = await prisma.profile.update({
                where: { userId },
                data: { xp: { increment: xpToAward } },
                select: { xp: true },
            })
            newLevel = calculateLevel(profile.xp)
        }

        return NextResponse.json({
            success: true,
            starsEarned,
            xpAwarded: xpToAward,
            newLevel: newLevel ?? null,
            isFirstCompletion,
        })
    } catch (error) {
        console.error("[lesson/complete] Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
