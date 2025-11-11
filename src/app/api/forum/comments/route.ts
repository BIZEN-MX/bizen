import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"
import { PrismaClient } from "@prisma/client"
import { filterContent } from "@/lib/forum/contentFilter"
import { checkRateLimit } from "@/lib/forum/rateLimiter"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { threadId, parentCommentId, body: content } = body

    if (!threadId || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verify thread exists and is not locked
    const thread = await prisma.forumThread.findUnique({
      where: { id: threadId }
    })

    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 })
    }

    if (thread.status === 'locked') {
      return NextResponse.json({ error: "Thread is locked" }, { status: 403 })
    }

    // Get or create user profile
    let profile = await prisma.profile.findUnique({
      where: { userId: user.id }
    })

    if (!profile) {
      // Auto-create profile if it doesn't exist
      profile = await prisma.profile.create({
        data: {
          userId: user.id,
          fullName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario',
          role: 'student',
          nickname: user.user_metadata?.username || user.email?.split('@')[0] || null,
          reputation: 0,
          postsCreated: 0,
          commentsCreated: 0,
          acceptedAnswers: 0
        }
      })
      console.log(`✅ Auto-created profile for user ${user.id}`)
    }

    // Check rate limit
    const rateLimit = await checkRateLimit(user.id, 'create_comment', 20, 60)
    if (!rateLimit.allowed) {
      return NextResponse.json({ 
        error: `Límite de comentarios alcanzado. Intenta de nuevo en ${Math.ceil((rateLimit.resetAt.getTime() - Date.now()) / 60000)} minutos` 
      }, { status: 429 })
    }

    // Filter content
    const contentFilter = filterContent(content, profile.reputation)
    if (contentFilter.isBlocked) {
      return NextResponse.json({ error: contentFilter.reason }, { status: 400 })
    }

    // Check moderation status (first 3 comments need approval)

    const moderationStatus = (profile?.commentsCreated || 0) < 3 ? 'pending' : 'approved'

    // Create comment
    const comment = await prisma.forumComment.create({
      data: {
        threadId,
        parentCommentId,
        authorId: user.id,
        body: content.trim(),
        moderationStatus
      },
      include: {
        author: {
          select: {
            userId: true,
            nickname: true,
            fullName: true,
            reputation: true
          }
        }
      }
    })

    // Update profile stats
    await prisma.profile.update({
      where: { userId: user.id },
      data: { commentsCreated: { increment: 1 } }
    })

    // Create notification for thread followers
    const followers = await prisma.forumFollow.findMany({
      where: {
        threadId,
        userId: { not: user.id },
        notifyInApp: true
      }
    })

    for (const follow of followers) {
      await prisma.forumNotification.create({
        data: {
          userId: follow.userId,
          type: 'new_comment',
          data: {
            threadId,
            commentId: comment.id,
            authorName: profile?.nickname || profile?.fullName,
            threadTitle: thread.title
          }
        }
      })
    }

    console.log(`✅ Created comment on thread ${threadId} by user ${user.id}`)

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error("Error creating comment:", error)
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

