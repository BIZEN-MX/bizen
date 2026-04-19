import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { filterContent } from "@/lib/forum/contentFilter"
import { checkRateLimit } from "@/lib/forum/rateLimiter"
import { touchDailyStreak } from "@/lib/rewards"
import { forumCommentSchema } from "@/validators/forum"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    
    // 1. Validation (Allow-listing & Length Limits)
    const validation = forumCommentSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json({ 
        error: "Datos de comentario inválidos", 
        details: validation.error.format() 
      }, { status: 400 })
    }

    const { threadId, parentCommentId, body: content } = validation.data

    // Verify thread exists and is not locked
    const thread = await prisma.forumThread.findUnique({
      where: { id: threadId }
    })

    if (!thread) {
      return NextResponse.json({ error: "Tema no encontrado" }, { status: 404 })
    }

    if (thread.status === 'locked') {
      return NextResponse.json({ error: "El tema está bloqueado" }, { status: 403 })
    }

    // Get or create user profile
    let profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      select: {
        userId: true,
        nickname: true,
        fullName: true,
        reputation: true,
        commentsCreated: true,
        isMinor: true,
        parentalOverride: true
      }
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
          acceptedAnswers: 0,
          isMinor: false,
          parentalOverride: false
        },
        select: {
          userId: true,
          nickname: true,
          fullName: true,
          reputation: true,
          commentsCreated: true,
          isMinor: true,
          parentalOverride: true
        }
      })
      console.log(`✅ Auto-created profile for user ${user.id}`)
    }

    // Check rate limit
    const rateLimit = await checkRateLimit(user.id, 'create_comment', 10, 60)
    if (!rateLimit.allowed) {
      return NextResponse.json({ 
        error: `Límite alcanzado. Intenta de nuevo en ${Math.ceil((rateLimit.resetAt.getTime() - Date.now()) / 60000)} min` 
      }, { status: 429 })
    }

    // 2. Sanitization (Strip HTML & Escape)
    const contentFilter = filterContent(content, profile.reputation)
    if (contentFilter.isBlocked) {
      return NextResponse.json({ error: contentFilter.reason }, { status: 400 })
    }

    // Determine moderation status
    const isMinor = profile?.isMinor ?? false
    const hasParentalOverride = profile?.parentalOverride ?? false
    const requiresModeration = isMinor && !hasParentalOverride
    const moderationStatus = requiresModeration || (profile?.commentsCreated || 0) < 3 ? 'pending' : 'approved'

    // Create comment using SAFE SANITIZED content
    const comment = await prisma.forumComment.create({
      data: {
        threadId,
        parentCommentId,
        authorId: user.id,
        body: contentFilter.filteredContent.trim(), // Sanitized!
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

    // Create notifications (non-blocking)
    prisma.forumFollow.findMany({
      where: { threadId, userId: { not: user.id }, notifyInApp: true }
    }).then(followers => {
      followers.forEach(follow => {
        prisma.forumNotification.create({
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
        }).catch(() => {})
      })
    }).catch(() => {})

    // Touch daily streak
    touchDailyStreak(user.id).catch(() => {})

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error("❌ [Forum:CommentError]:", error)
    return NextResponse.json({ error: "No se pudo publicar el comentario" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const commentId = searchParams.get("id")

    if (!commentId) {
      return NextResponse.json({ error: "ID de comentario no proporcionado" }, { status: 400 })
    }

    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Verify ownership
    const comment = await prisma.forumComment.findUnique({
      where: { id: commentId },
      select: { authorId: true }
    })

    if (!comment) {
      return NextResponse.json({ error: "Comentario no encontrado" }, { status: 404 })
    }

    if (comment.authorId !== user.id) {
       // Also allow moderators or admins if we have those roles
        return NextResponse.json({ error: "No tienes permiso para eliminar este comentario" }, { status: 403 })
    }

    // Permanent delete
    await prisma.forumComment.delete({
      where: { id: commentId }
    })

    return NextResponse.json({ success: true, message: "Comentario eliminado correctamente" })
  } catch (error) {
    console.error("❌ [Forum:CommentDeleteError]:", error)
    return NextResponse.json({ error: "No se pudo eliminar el comentario" }, { status: 500 })
  }
}
