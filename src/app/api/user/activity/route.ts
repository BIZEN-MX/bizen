import { NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

/**
 * GET /api/user/activity
 * Returns a map of { [YYYY-MM-DD]: activityCount } for the last 365 days.
 * Activity = lesson completions + reto diario submissions + forum posts.
 */
export async function GET() {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const since = new Date()
    since.setDate(since.getDate() - 364)
    since.setHours(0, 0, 0, 0)

    // Fetch all activity timestamps in parallel
    const [progress, evidence, forumPosts, forumComments] = await Promise.all([
      prisma.progress.findMany({
        where: { userId: user.id, completedAt: { gte: since } },
        select: { completedAt: true },
      }).catch(() => []),
      prisma.evidencePost.findMany({
        where: { authorUserId: user.id, createdAt: { gte: since } },
        select: { createdAt: true },
      }).catch(() => []),
      prisma.forumThread.findMany({
        where: { authorId: user.id, createdAt: { gte: since } },
        select: { createdAt: true },
      }).catch(() => []),
      prisma.forumComment.findMany({
        where: { authorId: user.id, createdAt: { gte: since } },
        select: { createdAt: true },
      }).catch(() => []),
    ])

    // Count activities per day
    const activity: Record<string, number> = {}

    const addDay = (date: Date | null | undefined) => {
      if (!date) return
      const key = new Date(date).toISOString().split("T")[0]
      activity[key] = (activity[key] ?? 0) + 1
    }

    for (const p of progress)      addDay((p as any).completedAt)
    for (const e of evidence)      addDay((e as any).createdAt)
    for (const t of forumPosts)    addDay((t as any).createdAt)
    for (const c of forumComments) addDay((c as any).createdAt)

    // Also compute longest streak from the activity days
    const activeDays = Object.keys(activity).sort()
    let longestStreak = 0
    let currentRun   = 0
    let prevDate: Date | null = null

    for (const d of activeDays) {
      const cur = new Date(d)
      if (prevDate) {
        const diff = (cur.getTime() - prevDate.getTime()) / 86400000
        if (diff === 1) {
          currentRun++
        } else {
          currentRun = 1
        }
      } else {
        currentRun = 1
      }
      longestStreak = Math.max(longestStreak, currentRun)
      prevDate = cur
    }

    return NextResponse.json({
      activity,          // { "2025-03-16": 4, ... }
      longestStreak,
      totalActiveDays: activeDays.length,
    })
  } catch (err: any) {
    console.error("[activity] GET error:", err?.message)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
