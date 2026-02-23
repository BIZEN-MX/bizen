import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createSupabaseServer } from "@/lib/supabase/server"

/**
 * POST /api/evidence/[postId]/comment
 * Add a comment to an evidence post.
 */
export async function POST(req: NextRequest, { params }: { params: { postId: string } }) {
    try {
        const supabase = await createSupabaseServer()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const { body, parentCommentId } = await req.json()
        if (!body || body.trim().length < 3) {
            return NextResponse.json({ error: "El comentario es muy corto" }, { status: 400 })
        }

        const { postId } = params

        const post = await prisma.evidencePost.findUnique({ where: { id: postId } })
        if (!post) return NextResponse.json({ error: "Post no encontrado" }, { status: 404 })

        const comment = await prisma.evidenceComment.create({
            data: {
                evidencePostId: postId,
                userId: user.id,
                body: body.trim().slice(0, 500),
                parentCommentId: parentCommentId ?? null
            }
        })

        // Anonymize author
        const profile = await prisma.profile.findUnique({ where: { userId: user.id }, select: { fullName: true } })
        const fullName = profile?.fullName || "Usuario"
        const parts = fullName.trim().split(" ")
        const displayName = parts.length >= 2 ? `${parts[0]} ${parts[parts.length - 1][0]}.` : parts[0]

        return NextResponse.json({ ...comment, authorDisplay: displayName, isMe: true }, { status: 201 })
    } catch (err) {
        console.error("POST /api/evidence/[postId]/comment:", err)
        return NextResponse.json({ error: "Error al comentar" }, { status: 500 })
    }
}
