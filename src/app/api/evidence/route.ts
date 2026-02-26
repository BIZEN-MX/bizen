import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createSupabaseServer } from "@/lib/supabase/server"
import { awardXp } from "@/lib/rewards"

/**
 * POST /api/evidence
 * Create a new EvidencePost linked to today's DailyChallenge.
 */
export async function POST(req: NextRequest) {
    try {
        const supabase = await createSupabaseServer()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const body = await req.json()
        const { dailyChallengeId, smartGoal, didToday, learned, changeTomorrow } = body

        if (!dailyChallengeId || !smartGoal || !didToday || !learned || !changeTomorrow) {
            return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 })
        }

        // Fetch school_id from profile (if available)
        const profile = await prisma.profile.findUnique({
            where: { userId: user.id },
            select: { schoolId: true }
        })

        // Check that the challenge exists
        const challenge = await prisma.dailyChallenge.findUnique({ where: { id: dailyChallengeId } })
        if (!challenge) return NextResponse.json({ error: "Reto no encontrado" }, { status: 404 })

        // Prevent duplicate submissions for same user+challenge
        const existing = await prisma.evidencePost.findFirst({
            where: { dailyChallengeId, authorUserId: user.id }
        })
        if (existing) {
            return NextResponse.json({ error: "Ya publicaste tu evidencia para este reto", postId: existing.id }, { status: 409 })
        }

        const post = await prisma.evidencePost.create({
            data: {
                dailyChallengeId,
                authorUserId: user.id,
                schoolId: profile?.schoolId ?? null,
                smartGoal: smartGoal.slice(0, 200),
                didToday: didToday.slice(0, 300),
                learned: learned.slice(0, 300),
                changeTomorrow: changeTomorrow.slice(0, 300),
            }
        })

        // Give XP for submitting the daily challenge logic
        const rewards = await awardXp(user.id, 50)

        return NextResponse.json({ ...post, rewards }, { status: 201 })
    } catch (err) {
        console.error("POST /api/evidence:", err)
        return NextResponse.json({ error: "Error al publicar evidencia" }, { status: 500 })
    }
}

/**
 * GET /api/evidence?challengeId=...&scope=class|school|all
 * Fetch evidence posts for a given daily challenge, scoped by the requesting user's school.
 */
export async function GET(req: NextRequest) {
    try {
        const supabase = await createSupabaseServer()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const { searchParams } = new URL(req.url)
        const challengeId = searchParams.get("challengeId")
        const scope = searchParams.get("scope") || "school" // "class" | "school" | "all"

        if (!challengeId) {
            return NextResponse.json({ error: "Falta challengeId" }, { status: 400 })
        }

        // Get user role + schoolId
        const profile = await prisma.profile.findUnique({
            where: { userId: user.id },
            select: { schoolId: true, role: true }
        })

        const where: any = { dailyChallengeId: challengeId }

        // Scope restriction: students can only see their school
        if (profile?.role !== "admin" && scope !== "all") {
            where.schoolId = profile?.schoolId ?? "none"
        }

        const posts = await prisma.evidencePost.findMany({
            where,
            orderBy: { createdAt: "desc" },
            take: 50,
            include: {
                reactions: true,
                comments: { orderBy: { createdAt: "asc" } }
            }
        })

        // Anonymize author display: fetch first name + last initial from profiles
        const authorIds = [...new Set(posts.map(p => p.authorUserId))]
        const profiles = await prisma.profile.findMany({
            where: { userId: { in: authorIds } },
            select: { userId: true, fullName: true, role: true, avatar: true }
        })
        const profileMap = Object.fromEntries(profiles.map(p => [p.userId, p]))

        const formatted = posts.map(p => {
            const authorProfile = profileMap[p.authorUserId]
            const fullName = authorProfile?.fullName || "Usuario"
            const parts = fullName.trim().split(" ")
            const displayName = parts.length >= 2
                ? `${parts[0]} ${parts[parts.length - 1][0]}.`
                : parts[0]
            return {
                ...p,
                authorDisplay: displayName,
                isMe: p.authorUserId === user.id,
                authorRole: authorProfile?.role ?? "student",
                avatar: authorProfile?.avatar
            }
        })

        return NextResponse.json(formatted)
    } catch (err) {
        console.error("GET /api/evidence:", err)
        return NextResponse.json({ error: "Error al cargar evidencias" }, { status: 500 })
    }
}
