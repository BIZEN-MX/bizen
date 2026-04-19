import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createSupabaseServer } from "@/lib/supabase/server"

/**
 * POST /api/evidence/[postId]/validate
 * Teacher-only: mark an evidence post as validated.
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ postId: string }> }) {
    try {
        const supabase = await createSupabaseServer()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        // Check teacher role
        const profile = await prisma.profile.findUnique({
            where: { userId: user.id },
            select: { role: true }
        })
        if (!profile || !["teacher", "school_admin", "admin", "moderator"].includes(profile.role)) {
            return NextResponse.json({ error: "Solo los profesores pueden validar evidencias" }, { status: 403 })
        }

        const { postId } = params

        const post = await prisma.evidencePost.findUnique({ where: { id: postId } })
        if (!post) return NextResponse.json({ error: "Post no encontrado" }, { status: 404 })
        if (post.status === "validated") {
            return NextResponse.json({ message: "Ya estaba validado" }, { status: 200 })
        }

        const updated = await prisma.evidencePost.update({
            where: { id: postId },
            data: { status: "validated", validatedBy: user.id, validatedAt: new Date() }
        })

        return NextResponse.json(updated)
    } catch (err) {
        console.error("POST /api/evidence/[postId]/validate:", err)
        return NextResponse.json({ error: "Error al validar" }, { status: 500 })
    }
}
