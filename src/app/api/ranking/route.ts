import { NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

/** Convert quiz score to stars (1-3). */
function scoreToStars(score: number): number {
  if (score >= 90) return 3
  if (score >= 70) return 2
  return 1
}

/** Compute current streak (consecutive days with at least one completed lesson, ending at most recent activity). */
function computeStreak(dates: Date[]): number {
  if (dates.length === 0) return 0
  const uniqueDays = [...new Set(dates.map((d) => d.toISOString().slice(0, 10)))].sort().reverse()
  const today = new Date().toISOString().slice(0, 10)
  const mostRecent = uniqueDays[0]
  if (!mostRecent) return 0
  const gap = (new Date(today).getTime() - new Date(mostRecent).getTime()) / (1000 * 60 * 60 * 24)
  if (gap > 1) return 0
  let streak = 0
  let expect = mostRecent
  for (const day of uniqueDays) {
    if (day !== expect) break
    streak++
    const next = new Date(expect)
    next.setDate(next.getDate() - 1)
    expect = next.toISOString().slice(0, 10)
  }
  return streak
}

export async function GET() {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    thirtyDaysAgo.setHours(0, 0, 0, 0)

    const [profiles, progressRows, attempts] = await Promise.all([
      prisma.profile.findMany({
        where: {},
        select: { userId: true, fullName: true, nickname: true, xp: true, level: true },
        orderBy: { xp: "desc" },
        take: 200,
      }),
      prisma.progress.findMany({
        where: { completedAt: { gte: thirtyDaysAgo }, percent: 100 },
        select: { userId: true, completedAt: true },
      }),
      prisma.attempt.findMany({
        select: { userId: true, quizId: true, score: true },
      }),
    ])

    const progressByUser = new Map<string, Date[]>()
    for (const p of progressRows) {
      if (!p.completedAt) continue
      const list = progressByUser.get(p.userId) ?? []
      list.push(p.completedAt)
      progressByUser.set(p.userId, list)
    }

    const starsByUser = new Map<string, number>()
    const bestByUserQuiz = new Map<string, Map<string, number>>()
    for (const a of attempts) {
      let byQuiz = bestByUserQuiz.get(a.userId)
      if (!byQuiz) {
        byQuiz = new Map()
        bestByUserQuiz.set(a.userId, byQuiz)
      }
      const best = byQuiz.get(a.quizId) ?? 0
      if (a.score > best) byQuiz.set(a.quizId, a.score)
    }
    for (const [userId, byQuiz] of bestByUserQuiz) {
      let total = 0
      for (const score of byQuiz.values()) total += scoreToStars(score)
      starsByUser.set(userId, total)
    }

    const ranking = profiles.map((profile) => {
      const dates = progressByUser.get(profile.userId) ?? []
      const currentStreak = computeStreak(dates)
      const totalStars = starsByUser.get(profile.userId) ?? 0
      const score =
        currentStreak * 1000 + profile.xp + totalStars * 10
      return {
        userId: profile.userId,
        nickname: profile.nickname || profile.fullName?.split(" ")[0] || "Usuario",
        level: profile.level,
        xp: profile.xp,
        currentStreak,
        totalStars,
        score,
      }
    })

    ranking.sort((a, b) => b.score - a.score)
    const top = ranking.slice(0, 100)

    return NextResponse.json({ ranking: top })
  } catch (error) {
    console.error("Error fetching ranking:", error)
    return NextResponse.json(
      { error: "Failed to fetch ranking" },
      { status: 500 }
    )
  }
}
