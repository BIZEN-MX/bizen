import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

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

    // Get query params for pagination
    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50) // Default 20, max 50
    const skip = parseInt(searchParams.get('skip') || '0')
    const includeReplies = searchParams.get('includeReplies') === 'true' // Default false - only load replies when explicitly requested

    // First, get the thread without comments to avoid heavy nested queries
    const thread = await prisma.forumThread.findUnique({
      where: { id: params.id },
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
            level: true
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

    // Get comments separately with optimized query
    // Only load top-level comments first, replies will be loaded on demand
    const comments = await prisma.forumComment.findMany({
      where: {
        threadId: params.id,
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
            level: true
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
                  level: true
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
      where: { id: params.id },
      data: { viewCount: { increment: 1 } }
    }).catch(err => console.error("Error incrementing view count:", err))

    // Check user's vote, bookmark, follow
    const [userVote, bookmark, follow] = await Promise.all([
      prisma.forumVote.findUnique({
        where: {
          userId_targetType_targetId: {
            userId: user.id,
            targetType: 'thread',
            targetId: params.id
          }
        }
      }),
      prisma.forumBookmark.findUnique({
        where: {
          userId_threadId: {
            userId: user.id,
            threadId: params.id
          }
        }
      }),
      prisma.forumFollow.findUnique({
        where: {
          userId_threadId: {
            userId: user.id,
            threadId: params.id
          }
        }
      })
    ])

    // Get user votes for all comments in a single optimized query
    const commentIds = includeReplies 
      ? comments.flatMap(c => [c.id, ...(c.replies || []).map((r: any) => r.id)])
      : comments.map(c => c.id)
    
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
    const formattedComments = comments.map(c => ({
      id: c.id,
      body: c.body,
      score: c.score,
      isAccepted: c.isAccepted,
      createdAt: c.createdAt,
      replyCount: c._count.replies,
      author: {
        ...c.author,
        nickname: c.author.nickname || c.author.fullName.split(' ')[0]
      },
      replies: includeReplies && (c as any).replies ? (c as any).replies.map((r: any) => ({
        ...r,
        author: {
          ...r.author,
          nickname: r.author.nickname || r.author.fullName.split(' ')[0]
        },
        userVote: voteMap.get(r.id) || null
      })) : [],
      userVote: voteMap.get(c.id) || null
    }))

    // Get total comment count for pagination
    const totalComments = await prisma.forumComment.count({
      where: {
        threadId: params.id,
        moderationStatus: 'approved',
        isHidden: false,
        parentCommentId: null
      }
    })

    return NextResponse.json({
      ...thread,
      author: {
        ...thread.author,
        nickname: thread.author.nickname || thread.author.fullName.split(' ')[0]
      },
      tags: thread.tags.map(tt => tt.tag),
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
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const thread = await prisma.forumThread.findUnique({
      where: { id: params.id }
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
      where: { id: params.id },
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
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const thread = await prisma.forumThread.findUnique({
      where: { id: params.id }
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
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting thread:", error)
    return NextResponse.json({ error: "Failed to delete thread" }, { status: 500 })
  }
}

