import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

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

    const thread = await prisma.forumThread.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: {
            userId: true,
            nickname: true,
            fullName: true,
            reputation: true,
            level: true
          }
        },
        topic: true,
        tags: {
          include: { tag: true }
        },
        comments: {
          where: {
            moderationStatus: 'approved',
            isHidden: false,
            parentCommentId: null
          },
          include: {
            author: {
              select: {
                userId: true,
                nickname: true,
                fullName: true,
                reputation: true,
                level: true
              }
            },
            replies: {
              where: {
                moderationStatus: 'approved',
                isHidden: false
              },
              include: {
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
              orderBy: { createdAt: 'asc' }
            }
          },
          orderBy: [
            { isAccepted: 'desc' },
            { score: 'desc' },
            { createdAt: 'asc' }
          ]
        }
      }
    })

    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 })
    }

    // Increment view count
    await prisma.forumThread.update({
      where: { id: params.id },
      data: { viewCount: { increment: 1 } }
    })

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

    // Get user votes for all comments
    const commentIds = thread.comments.flatMap(c => [c.id, ...c.replies.map(r => r.id)])
    const commentVotes = await prisma.forumVote.findMany({
      where: {
        userId: user.id,
        targetType: 'comment',
        targetId: { in: commentIds }
      }
    })

    const voteMap = new Map(commentVotes.map(v => [v.targetId, v.value]))

    // Format response
    const formattedComments = thread.comments.map(c => ({
      ...c,
      author: {
        ...c.author,
        nickname: c.author.nickname || c.author.fullName.split(' ')[0]
      },
      replies: c.replies.map(r => ({
        ...r,
        author: {
          ...r.author,
          nickname: r.author.nickname || r.author.fullName.split(' ')[0]
        },
        userVote: voteMap.get(r.id) || null
      })),
      userVote: voteMap.get(c.id) || null
    }))

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
      isFollowing: !!follow
    })
  } catch (error) {
    console.error("Error fetching thread:", error)
    return NextResponse.json({ error: "Failed to fetch thread" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
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
  } finally {
    await prisma.$disconnect()
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
  } finally {
    await prisma.$disconnect()
  }
}

