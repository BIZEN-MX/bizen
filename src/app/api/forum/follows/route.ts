import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"
import { PrismaClient } from "@prisma/client"

const prisma = process.env.DATABASE_URL ? new PrismaClient() : null

export async function GET(request: NextRequest) {
  if (!prisma) {
    return NextResponse.json([])
  }

  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const follows = await prisma.forumFollow.findMany({
      where: { userId: user.id },
      include: {
        thread: {
          include: {
            author: {
              select: {
                userId: true,
                nickname: true,
                fullName: true,
                reputation: true
              }
            },
            topic: true,
            tags: {
              include: { tag: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Filter out any follows with deleted/null threads
    const threads = follows
      .filter(f => f.thread !== null)
      .map(f => ({
        ...f.thread,
        author: {
          ...f.thread.author,
          nickname: f.thread.author.nickname || f.thread.author.fullName?.split(' ')[0] || 'Usuario'
        },
        tags: f.thread.tags.map(tt => tt.tag),
        hasAcceptedAnswer: !!f.thread.acceptedCommentId
      }))

    console.log(`✅ Returning ${threads.length} followed threads`)
    return NextResponse.json(threads)
  } catch (error) {
    console.error("Error fetching followed threads:", error)
    return NextResponse.json({ error: "Failed to fetch followed threads" }, { status: 500 })
  } finally {
    if (prisma) {
      await prisma.$disconnect().catch(() => {})
    }
  }
}

export async function POST(request: NextRequest) {
  if (!prisma) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 })
  }

  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { threadId, notifyEmail = true, notifyInApp = true } = body

    if (!threadId) {
      return NextResponse.json({ error: "Thread ID required" }, { status: 400 })
    }

    // Check if follow already exists
    const existing = await prisma.forumFollow.findUnique({
      where: {
        userId_threadId: {
          userId: user.id,
          threadId
        }
      }
    })

    if (existing) {
      return NextResponse.json({ following: true })
    }

    await prisma.forumFollow.create({
      data: {
        userId: user.id,
        threadId,
        notifyEmail,
        notifyInApp
      }
    })

    return NextResponse.json({ following: true })
  } catch (error) {
    console.error("Error following:", error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    // Handle unique constraint violation
    if (errorMessage.includes('Unique constraint') || errorMessage.includes('P2002')) {
      return NextResponse.json({ following: true })
    }
    return NextResponse.json({ error: "Failed to follow", details: errorMessage }, { status: 500 })
  } finally {
    if (prisma) {
      await prisma.$disconnect().catch(() => {})
    }
  }
}

export async function DELETE(request: NextRequest) {
  if (!prisma) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 })
  }

  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { threadId } = body

    if (!threadId) {
      return NextResponse.json({ error: "Thread ID required" }, { status: 400 })
    }

    await prisma.forumFollow.delete({
      where: {
        userId_threadId: {
          userId: user.id,
          threadId
        }
      }
    })

    return NextResponse.json({ following: false })
  } catch (error) {
    console.error("Error unfollowing:", error)
    return NextResponse.json({ error: "Failed to unfollow" }, { status: 500 })
  } finally {
    if (prisma) {
      await prisma.$disconnect().catch(() => {})
    }
  }
}

