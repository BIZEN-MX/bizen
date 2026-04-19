import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get query params for pagination
    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50) // Default 20, max 50
    const skip = parseInt(searchParams.get('skip') || '0')
    const includeReplies = searchParams.get('includeReplies') === 'true' // Default false - only load replies when explicitly requested

    // First, get the thread without comments to avoid heavy nested queries
    const thread = await (prisma.forumThread as any).findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        body: true,
        status: true,
        score: true,
        viewCount: true,
        commentCount: true,
        acceptedCommentId: true,
        isPinned: true,
        createdAt: true,
        authorId: true,
        topicId: true,
        author: {
          select: {
            userId: true,
            nickname: true,
            fullName: true,
            reputation: true,
            level: true,
            role: true,
            isMinor: true,
            avatar: true,
            inventory: { select: { productId: true } }
          }
        },
        topic: {
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true
          }
        },
        tags: {
          select: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true
              }
            }
          }
        }
      }
    })

    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 })
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      select: { role: true }
    })

    const isParticular = profile?.role === 'particular'
    const isAuthorParticular = (thread as any).author?.role === 'particular'

    if (isParticular !== isAuthorParticular) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    // Get comments separately with optimized query
    // Only load top-level comments first, replies will be loaded on demand
    const comments = await (prisma.forumComment as any).findMany({
      where: {
        threadId: id,
        moderationStatus: 'approved',
        isHidden: false,
        parentCommentId: null
      },
      select: {
        id: true,
        body: true,
        score: true,
        isAccepted: true,
        createdAt: true,
        _count: {
          select: {
            replies: {
              where: {
                moderationStatus: 'approved',
                isHidden: false
              }
            }
          }
        },
        author: {
          select: {
            userId: true,
            nickname: true,
            fullName: true,
            reputation: true,
            level: true,
            isMinor: true,
            avatar: true,
            inventory: { select: { productId: true } }
          }
        },
        // Only include replies if explicitly requested and limit to 10 per comment
        ...(includeReplies ? {
          replies: {
            where: {
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
                  level: true,
                  avatar: true,
                  inventory: { select: { productId: true } }
                }
              }
            },
            orderBy: { createdAt: 'asc' },
            take: 10 // Limit replies per comment to improve performance
          }
        } : {})
      },
      orderBy: [
        { isAccepted: 'desc' },
        { score: 'desc' },
        { createdAt: 'asc' }
      ],
      take: limit,
      skip: skip
    })

    // Increment view count asynchronously (don't block response)
    prisma.forumThread.update({
      where: { id },
      data: { viewCount: { increment: 1 } }
    }).catch(err => console.error("Error incrementing view count:", err))

    // Check user's vote, bookmark, follow
    const [userVote, bookmark, follow] = await Promise.all([
      prisma.forumVote.findUnique({
        where: {
          userId_targetType_targetId: {
            userId: user.id,
            targetType: 'thread',
            targetId: id
          }
        }
      }),
      prisma.forumBookmark.findUnique({
        where: {
          userId_threadId: {
            userId: user.id,
            threadId: id
          }
        }
      }),
      prisma.forumFollow.findUnique({
        where: {
          userId_threadId: {
            userId: user.id,
            threadId: id
          }
        }
      })
    ]).catch(() => [null, null, null])

    // Get user votes for all comments in a single optimized query
    const commentIds = includeReplies
      ? (comments as any[]).flatMap(c => [c.id, ...(c.replies || []).map((r: any) => r.id)])
      : (comments as any[]).map(c => c.id)

    const commentVotes = commentIds.length > 0 ? await prisma.forumVote.findMany({
      where: {
        userId: user.id,
        targetType: 'comment',
        targetId: { in: commentIds }
      },
      select: {
        targetId: true,
        value: true
      }
    }) : []

    const voteMap = new Map(commentVotes.map(v => [v.targetId, v.value]))

    // Format response
    const formattedComments = (comments as any[]).map(c => {
      if (!c.author) {
        return {
          id: c.id,
          body: c.body,
          score: c.score,
          isAccepted: c.isAccepted,
          createdAt: c.createdAt,
          replyCount: c._count.replies,
          author: {
            userId: 'unknown',
            nickname: 'Usuario',
            reputation: 0,
            level: 1,
            avatar: null,
            inventory: []
          },
          replies: [],
          userVote: voteMap.get(c.id) || null
        }
      }

      const parts = (c.author.fullName || '').trim().split(/\s+/)
      const safeName = parts.length >= 2
        ? `${parts[0]} ${parts[parts.length - 1][0]}.`
        : (parts[0] || 'Usuario')

      return {
        id: c.id,
        body: c.body,
        score: c.score,
        isAccepted: c.isAccepted,
        createdAt: c.createdAt,
        replyCount: c._count.replies,
        author: {
          userId: c.author.userId,
          nickname: c.author.nickname || safeName,
          reputation: c.author.reputation,
          level: c.author.level,
          avatar: c.author.avatar,
          inventory: c.author.inventory?.map((i: any) => i.productId) || []
        },
        replies: includeReplies && (c as any).replies ? (c as any).replies.map((r: any) => {
          const rParts = (r.author.fullName || '').trim().split(/\s+/)
          const rSafeName = rParts.length >= 2
            ? `${rParts[0]} ${rParts[rParts.length - 1][0]}.`
            : (rParts[0] || 'Usuario')
          return {
            ...r,
            author: {
              userId: r.author.userId,
              nickname: r.author.nickname || rSafeName,
              reputation: r.author.reputation,
              level: r.author.level,
              avatar: r.author.avatar,
              inventory: r.author.inventory?.map((i: any) => i.productId) || []
            },
            userVote: voteMap.get(r.id) || null
          }
        }) : [],
        userVote: voteMap.get(c.id) || null
      }
    })

    // Get total comment count for pagination
    const totalComments = await prisma.forumComment.count({
      where: {
        threadId: id,
        moderationStatus: 'approved',
        isHidden: false,
        parentCommentId: null
      }
    })

    const threadAuthor = (thread as any).author
    let threadAuthorSafeName = 'Usuario'
    if (threadAuthor) {
      const threadAuthorParts = (threadAuthor.fullName || '').trim().split(/\s+/)
      threadAuthorSafeName = threadAuthorParts.length >= 2
        ? `${threadAuthorParts[0]} ${threadAuthorParts[threadAuthorParts.length - 1][0]}.`
        : (threadAuthorParts[0] || 'Usuario')
    }

    return NextResponse.json({
      ...(thread as any),
      author: threadAuthor ? {
        userId: threadAuthor.userId,
        nickname: threadAuthor.nickname || threadAuthorSafeName,
        reputation: threadAuthor.reputation,
        level: threadAuthor.level,
        avatar: threadAuthor.avatar,
        inventory: threadAuthor.inventory?.map((i: any) => i.productId) || []
      } : {
        userId: 'unknown',
        nickname: 'Usuario',
        reputation: 0,
        level: 1,
        avatar: null,
        inventory: []
      },
      tags: (thread as any).tags.map((tt: any) => tt.tag),
      comments: formattedComments,
      userVote: userVote?.value || null,
      isBookmarked: !!bookmark,
      isFollowing: !!follow,
      pagination: {
        total: totalComments,
        limit,
        skip,
        hasMore: skip + limit < totalComments
      }
    }, {
      headers: {
        'Cache-Control': 'private, max-age=30' // Cache for 30 seconds to reduce load
      }
    })
  } catch (error) {
    console.error("Error fetching thread:", error)
    return NextResponse.json({ error: "Failed to fetch thread" }, { status: 500 })
  }
}

// PATCH update thread
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const thread = await prisma.forumThread.findUnique({
      where: { id }
    })

    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 })
    }

    // Check if user is author or moderator/admin
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id }
    })

    const isAuthor = thread.authorId === user.id
    const isModerator = ['moderator', 'teacher', 'school_admin'].includes(profile?.role || '')

    if (!isAuthor && !isModerator) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const updateData: any = {}

    if (isAuthor) {
      if (body.title) updateData.title = body.title.trim()
      if (body.body) updateData.body = body.body.trim()
    }

    if (isModerator) {
      if (body.status) updateData.status = body.status
      if (body.isPinned !== undefined) updateData.isPinned = body.isPinned
      if (body.isHidden !== undefined) updateData.isHidden = body.isHidden
    }

    const updated = await prisma.forumThread.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Error updating thread:", error)
    return NextResponse.json({ error: "Failed to update thread" }, { status: 500 })
  }
}

// DELETE thread
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const thread = await prisma.forumThread.findUnique({
      where: { id }
    })

    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 })
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id }
    })

    const isAuthor = thread.authorId === user.id
    const isModerator = ['moderator', 'teacher', 'school_admin'].includes(profile?.role || '')

    if (!isAuthor && !isModerator) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await prisma.forumThread.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting thread:", error)
    return NextResponse.json({ error: "Failed to delete thread" }, { status: 500 })
  }
}

