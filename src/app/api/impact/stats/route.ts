import { NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const supabase = await createSupabaseServer()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const profile = await prisma.profile.findUnique({
            where: { userId: user.id },
            select: { schoolId: true }
        }).catch(() => null)

        const schoolId = profile?.schoolId

        // 1. Fetch Foundation & Impacts (with fallback)
        let impacts: any[] = []
        try {
            if (schoolId) {
                impacts = await prisma.schoolImpact.findMany({
                    where: { schoolId },
                    include: {
                        foundation: true,
                        evidence: true
                    }
                })
            }
        } catch (e: any) {
            console.warn("Impact fetch failed:", e.message)
        }

        // 2. Fetch specific User Stats for "Mi Impacto" (with fallbacks)
        let lessonsCompleted = 0
        try {
            lessonsCompleted = await prisma.progress.count({
                where: {
                    userId: user.id,
                    percent: 100,
                    completedAt: { not: null }
                }
            })
        } catch (e: any) { console.warn("Lessons count failed:", e.message) }

        let quizzesTaken = 0
        try {
            quizzesTaken = await prisma.attempt.count({
                where: { userId: user.id }
            })
        } catch (e: any) { console.warn("Quizzes count failed:", e.message) }

        let challengesCompleted = 0
        try {
            challengesCompleted = await prisma.evidencePost.count({
                where: { authorUserId: user.id }
            })
        } catch (e: any) { console.warn("Challenges count failed:", e.message) }

        let simulatorsPlayed = 0
        try {
            simulatorsPlayed = await (prisma as any).gameSession.count({
                where: { userId: user.id }
            })
        } catch (e: any) { console.warn("Games count failed:", e.message) }

        // Sesiones utiles calculation
        const usefulSessions = Math.floor(lessonsCompleted / 3) + challengesCompleted + simulatorsPlayed

        // 3. Fetch Targets (with fallbacks)
        let globalTargets: any[] = []
        try {
            globalTargets = await prisma.impactTarget.findMany({
                where: { schoolId: null }
            })
        } catch (e: any) { console.warn("Global targets fetch failed:", e.message) }

        let schoolTargets: any[] = []
        try {
            if (schoolId) {
                schoolTargets = await prisma.impactTarget.findMany({
                    where: { schoolId }
                })
            }
        } catch (e: any) { console.warn("School targets fetch failed:", e.message) }

        // Combine targets
        const allTargets = [...globalTargets, ...schoolTargets]

        return NextResponse.json({
            studentStats: {
                usefulSessions,
                lessonsCompleted,
                challengesCompleted,
                simulatorsPlayed,
            },
            schoolImpacts: impacts,
            targets: allTargets
        })

    } catch (error) {
        console.error("Error fetching impact stats:", error)
        return NextResponse.json(
            { error: "Failed to fetch impact statistics" },
            { status: 500 }
        )
    }
}
