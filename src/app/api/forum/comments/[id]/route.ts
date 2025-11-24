import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

// GET replies for a specific comment
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50)
    const skip = parseInt(searchParams.get('skip') || '0')

    // Get replies for this comment
    const replies = await prisma.forumComment.findMany({
      where: {
        parentCommentId: params.id,
        moderationStatus: 'approved',
        isHidden: false
      },
      select: {
        id: true,
        body: true,
        score: true,
        createdAt: true,
        author: {
          select: {
            userId: true,
            nickname: true,
            fullName: true,
            reputation: true,
            level: true
          }
        }
      },
      orderBy: { createdAt: 'asc' },
      take: limit,
      skip: skip
    })

    // Get user votes for replies
    const replyIds = replies.map(r => r.id)
    const votes = replyIds.length > 0 ? await prisma.forumVote.findMany({
      where: {
        userId: user.id,
        targetType: 'comment',
        targetId: { in: replyIds }
      },
      select: {
        targetId: true,
        value: true
      }
    }) : []

    const voteMap = new Map(votes.map(v => [v.targetId, v.value]))

    // Format response
    const formattedReplies = replies.map(r => ({
      ...r,
      author: {
        ...r.author,
        nickname: r.author.nickname || r.author.fullName.split(' ')[0]
      },
      userVote: voteMap.get(r.id) || null
    }))

    // Get total count for pagination
    const total = await prisma.forumComment.count({
      where: {
        parentCommentId: params.id,
        moderationStatus: 'approved',
        isHidden: false
      }
    })

    return NextResponse.json({
      replies: formattedReplies,
      total,
      pagination: {
        total,
        limit,
        skip,
        hasMore: skip + limit < total
      }
    }, {
      headers: {
        'Cache-Control': 'private, max-age=30'
      }
    })
  } catch (error) {
    console.error("Error fetching comment replies:", error)
    return NextResponse.json({ error: "Failed to fetch replies" }, { status: 500 })
  }
}

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
  }
}

