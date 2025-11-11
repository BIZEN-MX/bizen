import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const comment = await prisma.forumComment.findUnique({
      where: { id: params.id }
    })

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 })
    }

    if (comment.authorId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { body: content } = body

    if (!content) {
      return NextResponse.json({ error: "Content required" }, { status: 400 })
    }

    const updated = await prisma.forumComment.update({
      where: { id: params.id },
      data: {
        body: content.trim(),
        updatedAt: new Date()
      }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Error updating comment:", error)
    return NextResponse.json({ error: "Failed to update comment" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const comment = await prisma.forumComment.findUnique({
      where: { id: params.id }
    })

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 })
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id }
    })

    const isAuthor = comment.authorId === user.id
    const isModerator = ['moderator', 'teacher', 'school_admin'].includes(profile?.role || '')

    if (!isAuthor && !isModerator) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await prisma.forumComment.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting comment:", error)
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

