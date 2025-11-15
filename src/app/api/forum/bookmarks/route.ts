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

    const bookmarks = await prisma.forumBookmark.findMany({
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

    // Filter out any bookmarks with deleted/null threads
    const threads = bookmarks
      .filter(b => b.thread !== null)
      .map(b => ({
        ...b.thread,
        author: {
          ...b.thread.author,
          nickname: b.thread.author.nickname || b.thread.author.fullName?.split(' ')[0] || 'Usuario'
        },
        tags: b.thread.tags.map(tt => tt.tag),
        hasAcceptedAnswer: !!b.thread.acceptedCommentId
      }))

    console.log(`✅ Returning ${threads.length} bookmarked threads`)
    return NextResponse.json(threads)
  } catch (error) {
    console.error("Error fetching bookmarks:", error)
    return NextResponse.json({ error: "Failed to fetch bookmarks" }, { status: 500 })
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
    const { threadId } = body

    if (!threadId) {
      return NextResponse.json({ error: "Thread ID required" }, { status: 400 })
    }

    // Check if bookmark already exists
    const existing = await prisma.forumBookmark.findUnique({
      where: {
        userId_threadId: {
          userId: user.id,
          threadId
        }
      }
    })

    if (existing) {
      return NextResponse.json({ bookmarked: true })
    }

    await prisma.forumBookmark.create({
      data: {
        userId: user.id,
        threadId
      }
    })

    return NextResponse.json({ bookmarked: true })
  } catch (error) {
    console.error("Error bookmarking:", error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    // Handle unique constraint violation
    if (errorMessage.includes('Unique constraint') || errorMessage.includes('P2002')) {
      return NextResponse.json({ bookmarked: true })
    }
    return NextResponse.json({ error: "Failed to bookmark", details: errorMessage }, { status: 500 })
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

    await prisma.forumBookmark.delete({
      where: {
        userId_threadId: {
          userId: user.id,
          threadId
        }
      }
    })

    return NextResponse.json({ bookmarked: false })
  } catch (error) {
    console.error("Error removing bookmark:", error)
    return NextResponse.json({ error: "Failed to remove bookmark" }, { status: 500 })
  } finally {
    if (prisma) {
      await prisma.$disconnect().catch(() => {})
    }
  }
}

