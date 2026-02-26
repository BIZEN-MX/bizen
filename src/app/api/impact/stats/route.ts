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
        })

        const schoolId = profile?.schoolId

        // 1. Fetch Foundation & Impacts (for the current school or generically)
        let impacts = []
        if (schoolId) {
            impacts = await prisma.schoolImpact.findMany({
                where: { schoolId },
                include: {
                    foundation: true,
                    evidence: true
                }
            })
        }

        // 2. Fetch specific User Stats for "Mi Impacto"
        // Count successful progress (Módulos/Lecciones)
        const lessonsCompleted = await prisma.progress.count({
            where: {
                userId: user.id,
                percent: 100,
                completedAt: { not: null }
            }
        })

        // Count attempts (Quizzes)
        const quizzesTaken = await prisma.attempt.count({
            where: { userId: user.id }
        })

        // Count simulators (Cashflow Games)
        const simulatorsPlayed = await prisma.gameSession.count({
            where: { userId: user.id }
        })

        // Sesiones utiles calculation (e.g. 1 session for every 3 lessons completed + games)
        const usefulSessions = Math.floor(lessonsCompleted / 3) + simulatorsPlayed

        // 3. Fetch Targets
        const globalTargets = await prisma.impactTarget.findMany({
            where: { schoolId: null }
        })

        let schoolTargets = []
        if (schoolId) {
            schoolTargets = await prisma.impactTarget.findMany({
                where: { schoolId }
            })
        }

        // Combine targets
        const allTargets = [...globalTargets, ...schoolTargets]

        return NextResponse.json({
            studentStats: {
                usefulSessions,
                modulesCompleted: lessonsCompleted,
                quizzesTaken,
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
