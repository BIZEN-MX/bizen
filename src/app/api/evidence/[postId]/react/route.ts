import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createSupabaseServer } from "@/lib/supabase/server"

const VALID_REACTIONS = ["Buena meta", "Tip", "Te faltó algo", "Inspirador"]

/**
 * POST /api/evidence/[postId]/react
 * Toggle a reaction on an evidence post (1 reaction per user per post).
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ postId: string }> }) {
    try {
        const supabase = await createSupabaseServer()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const { reactionType } = await req.json()
        if (!VALID_REACTIONS.includes(reactionType)) {
            return NextResponse.json({ error: "Reacción no válida" }, { status: 400 })
        }

        const { postId } = params

        // Check post exists
        const post = await prisma.evidencePost.findUnique({ where: { id: postId } })
        if (!post) return NextResponse.json({ error: "Post no encontrado" }, { status: 404 })

        // Check existing reaction
        const existing = await prisma.evidenceReaction.findUnique({
            where: { evidencePostId_userId: { evidencePostId: postId, userId: user.id } }
        })

        if (existing) {
            if (existing.reactionType === reactionType) {
                // Same reaction → remove it (toggle off)
                await prisma.evidenceReaction.delete({
                    where: { evidencePostId_userId: { evidencePostId: postId, userId: user.id } }
                })
                return NextResponse.json({ removed: true, reactionType })
            } else {
                // Different reaction → update it
                const updated = await prisma.evidenceReaction.update({
                    where: { evidencePostId_userId: { evidencePostId: postId, userId: user.id } },
                    data: { reactionType }
                })
                return NextResponse.json({ updated: true, reaction: updated })
            }
        }

        const reaction = await prisma.evidenceReaction.create({
            data: { evidencePostId: postId, userId: user.id, reactionType }
        })

        return NextResponse.json({ created: true, reaction }, { status: 201 })
    } catch (err) {
        console.error("POST /api/evidence/[postId]/react:", err)
        return NextResponse.json({ error: "Error al reaccionar" }, { status: 500 })
    }
}
