import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createSupabaseServer } from "@/lib/supabase/server"

/**
 * POST /api/evidence/[postId]/comment
 * Add a comment to an evidence post.
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ postId: string }> }) {
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
        const profile = await prisma.profile.findUnique({ where: { userId: user.id }, select: { fullName: true, nickname: true } })
        const parts = (profile?.fullName || '').trim().split(/\s+/)
        const safeName = parts.length >= 2
            ? `${parts[0]} ${parts[parts.length - 1][0]}.`
            : (parts[0] || 'Usuario')
        const displayName = profile?.nickname || safeName

        return NextResponse.json({ ...comment, authorDisplay: displayName, isMe: true }, { status: 201 })
    } catch (err) {
        console.error("POST /api/evidence/[postId]/comment:", err)
        return NextResponse.json({ error: "Error al comentar" }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ postId: string }> }) {
    try {
        const { searchParams } = new URL(req.url)
        const commentId = searchParams.get("id")

        if (!commentId) {
            return NextResponse.json({ error: "ID de comentario no proporcionado" }, { status: 400 })
        }

        const supabase = await createSupabaseServer()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const comment = await prisma.evidenceComment.findUnique({
            where: { id: commentId },
            select: { userId: true }
        })

        if (!comment) {
            return NextResponse.json({ error: "Comentario no encontrado" }, { status: 404 })
        }

        if (comment.userId !== user.id) {
            return NextResponse.json({ error: "No tienes permiso para eliminar este comentario" }, { status: 403 })
        }

        await prisma.evidenceComment.delete({
            where: { id: commentId }
        })

        return NextResponse.json({ success: true, message: "Comentario eliminado" })
    } catch (err) {
        console.error("DELETE /api/evidence/[postId]/comment:", err)
        return NextResponse.json({ error: "Error al eliminar el comentario" }, { status: 500 })
    }
}
