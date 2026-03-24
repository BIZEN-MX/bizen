import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"
import { touchDailyStreak } from "@/lib/rewards"

/**
 * POST /api/streak/touch
 * Body: { source: string }  — e.g. "forum", "live_quiz", "budget_ai", "vision_canvas"
 *
 * Marks the user as active today (updates streak) without awarding XP.
 * Call fire-and-forget from any action that should "count" for the daily streak.
 */
export async function POST(req: NextRequest) {
    try {
        const supabase = await createSupabaseServer()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ ok: false }, { status: 401 })

        const body = await req.json().catch(() => ({}))
        const source = body?.source || "unknown"

        const result = await touchDailyStreak(user.id)

        console.log(`[streak/touch] source=${source} userId=${user.id} streak=${result.currentStreak} firstToday=${result.isFirstTouchToday}`)

        return NextResponse.json({
            ok: true,
            source,
            ...result
        })
    } catch (err: any) {
        console.error("[streak/touch] error:", err.message)
        // Silent fail — never block the main action because of streak
        return NextResponse.json({ ok: false, error: err.message }, { status: 200 })
    }
}
