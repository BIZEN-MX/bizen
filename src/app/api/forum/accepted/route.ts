import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { threadId, commentId } = body

    if (!threadId || !commentId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get thread
    const thread = await prisma.forumThread.findUnique({
      where: { id: threadId }
    })

    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 })
    }

    // Check if user is thread author or moderator
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id }
    })

    const isAuthor = thread.authorId === user.id
    const isModerator = ['moderator', 'teacher', 'school_admin'].includes(profile?.role || '')

    if (!isAuthor && !isModerator) {
      return NextResponse.json({ error: "Only thread author or moderator can accept answers" }, { status: 403 })
    }

    // Verify comment exists and belongs to this thread
    const comment = await prisma.forumComment.findUnique({
      where: { id: commentId }
    })

    if (!comment || comment.threadId !== threadId) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 })
    }

    // Unmark previous accepted answer if exists
    if (thread.acceptedCommentId) {
      await prisma.forumComment.update({
        where: { id: thread.acceptedCommentId },
        data: { isAccepted: false }
      })
    }

    // Mark new accepted answer
    await prisma.forumComment.update({
      where: { id: commentId },
      data: { isAccepted: true }
    })

    // Update thread
    await prisma.forumThread.update({
      where: { id: threadId },
      data: {
        acceptedCommentId: commentId,
        status: 'resolved'
      }
    })

    // Award XP to comment author
    await prisma.profile.update({
      where: { userId: comment.authorId },
      data: {
        reputation: { increment: 10 },
        acceptedAnswers: { increment: 1 }
      }
    })

    // Create notification for comment author
    await prisma.forumNotification.create({
      data: {
        userId: comment.authorId,
        type: 'accepted_answer',
        data: {
          threadId,
          commentId,
          threadTitle: thread.title
        }
      }
    })

    console.log(`✅ Accepted answer ${commentId} for thread ${threadId}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error accepting answer:", error)
    return NextResponse.json({ error: "Failed to accept answer" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

