import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createSupabaseServer } from "@/lib/supabase/server"
import { awardXp } from "@/lib/rewards"
import { checkAndAwardAchievements } from "@/lib/achievements"

export async function POST(req: NextRequest) {
    try {
        const supabase = await createSupabaseServer()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const body = await req.json()
        const { dailyChallengeId, smartGoal, didToday, learned, changeTomorrow, attachments } = body
        
        // At least a challenge ID and some content are required
        if (!dailyChallengeId || (!smartGoal && !didToday && !learned && !attachments)) {
            return NextResponse.json({ error: "Falta información para publicar" }, { status: 400 })
        }

        const profile = await prisma.profile.findUnique({
            where: { userId: user.id },
            select: { schoolId: true, role: true }
        })

        if (!profile) return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 })

        // BLOCK STAFF FROM POSTING EVIDENCE
        if (profile.role === 'school_admin' || profile.role === 'teacher') {
            return NextResponse.json({ 
                error: "Los administradores y maestros no pueden publicar evidencias, solo validar las de los alumnos." 
            }, { status: 403 })
        }

        const challenge = await prisma.dailyChallenge.findUnique({ where: { id: dailyChallengeId } })
        if (!challenge) return NextResponse.json({ error: "Reto no encontrado" }, { status: 404 })

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
                smartGoal: smartGoal?.slice(0, 200) || "",
                didToday: didToday?.slice(0, 300) || "",
                learned: learned?.slice(0, 300) || "",
                changeTomorrow: changeTomorrow?.slice(0, 300) || "",
                attachments: attachments ?? null,
            }
        })

        const rewards = await awardXp(user.id, 50)

        // Count completed retos for this user
        const retosCompleted = await prisma.evidencePost.count({ where: { authorUserId: user.id } }).catch(() => 0)
        const profile2 = await prisma.profile.findUnique({ where: { userId: user.id }, select: { currentStreak: true, level: true, bizcoins: true } }).catch(() => null)
        checkAndAwardAchievements(user.id, {
            retosCompleted,
            currentStreak: profile2?.currentStreak ?? 0,
            level:         profile2?.level         ?? 1,
            bizcoins:      profile2?.bizcoins      ?? 0,
        }).catch(() => {})

        return NextResponse.json({ ...post, rewards }, { status: 201 })
    } catch (err) {
        console.error("POST /api/evidence:", err)
        return NextResponse.json({ error: "Error al publicar evidencia" }, { status: 500 })
    }
}

export async function GET(req: NextRequest) {
    try {
        const supabase = await createSupabaseServer()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        let isParticular = true; // Fallback default
        try {
            const myProfile = await prisma.profile.findUnique({
                where: { userId: user.id },
                select: { role: true }
            })
            if (myProfile?.role && myProfile.role !== 'particular') {
                isParticular = false;
            }
        } catch (e: any) {
            console.warn("Soft error checking role in evidence:", e.message)
        }

        let posts: any[] = []
        try {
            posts = await prisma.evidencePost.findMany({
                where: {
                    profiles: {
                        role: isParticular ? 'particular' : { not: 'particular' }
                    }
                },
                orderBy: { createdAt: "desc" },
                take: 50,
                include: {
                    reactions: true,
                    comments: { orderBy: { createdAt: "asc" } }
                }
            })
        } catch (e: any) {
            console.error("DB Error (evidence fetch):", e.message)
            // If primary fetch fails, we can't do much, but let's try to return empty
            return NextResponse.json([])
        }

        let formatted: any[] = []
        try {
            const authorIds = new Set<string>()
            posts.forEach(p => {
                authorIds.add(p.authorUserId)
                p.comments.forEach((c: any) => authorIds.add(c.userId))
            })

            const profiles = await prisma.profile.findMany({
                where: { userId: { in: Array.from(authorIds) } },
                select: { userId: true, fullName: true, nickname: true, role: true, avatar: true, inventory: { select: { productId: true } } }
            }).catch(() => []) as any[]

            const profileMap = Object.fromEntries(profiles.map(p => {
                const parts = (p.fullName || '').trim().split(/\s+/)
                const safeName = parts.length >= 2
                    ? `${parts[0]} ${parts[parts.length - 1][0]}.`
                    : (parts[0] || 'Usuario')
                return [p.userId, { ...p, displayName: p.nickname || safeName }]
            }))

            formatted = posts.map(p => {
                const authorProfile = profileMap[p.authorUserId]
                return {
                    ...p,
                    authorDisplay: authorProfile?.displayName || "Usuario",
                    isMe: p.authorUserId === user.id,
                    authorRole: authorProfile?.role ?? "student",
                    avatar: authorProfile?.avatar,
                    inventory: (authorProfile as any)?.inventory?.map((i: any) => i.productId) || [],
                    comments: p.comments.map((c: any) => ({
                        ...c,
                        authorDisplay: profileMap[c.userId]?.displayName || "Usuario"
                    }))
                }
            })
        } catch (e: any) {
            console.warn("Soft error in formatting evidence posts:", e.message)
            formatted = posts // Return unformatted if mapping fails
        }

        return NextResponse.json(formatted)
    } catch (err: any) {
        console.error("FATAL: GET /api/evidence:", err)
        return NextResponse.json({ error: "Error al cargar evidencias", details: err.message }, { status: 500 })
    }
}
