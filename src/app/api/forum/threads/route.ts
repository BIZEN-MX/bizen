import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"
import { PrismaClient } from "@prisma/client"
import { filterContent } from "@/lib/forum/contentFilter"
import { checkRateLimit } from "@/lib/forum/rateLimiter"

const prisma = new PrismaClient()

// GET list threads
export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const sort = searchParams.get("sort") || "new"
    const topicSlug = searchParams.get("topic")

    let orderBy: any = { createdAt: 'desc' }
    if (sort === 'top') orderBy = { score: 'desc' }
    if (sort === 'unanswered') orderBy = { commentCount: 'asc' }

    const where: any = {
      moderationStatus: 'approved',
      isHidden: false
    }

    if (topicSlug && topicSlug !== 'all') {
      const topic = await prisma.forumTopic.findUnique({ where: { slug: topicSlug } })
      if (topic) where.topicId = topic.id
    }

    const threads = await prisma.forumThread.findMany({
      where,
      orderBy: [
        { isPinned: 'desc' },
        orderBy
      ],
      include: {
        author: {
          select: {
            userId: true,
            nickname: true,
            reputation: true,
            fullName: true
          }
        },
        topic: true,
        tags: {
          include: { tag: true }
        }
      },
      take: 50
    })

    const formatted = threads.map(t => ({
      ...t,
      author: {
        ...t.author,
        nickname: t.author.nickname || t.author.fullName.split(' ')[0]
      },
      tags: t.tags.map(tt => tt.tag),
      hasAcceptedAnswer: !!t.acceptedCommentId
    }))

    return NextResponse.json(formatted)
  } catch (error) {
    console.error("Error fetching threads:", error)
    return NextResponse.json({ error: "Failed to fetch threads" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

// POST create thread
export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    console.log("🔍 Auth check:", { user: user?.id, error: authError?.message })
    
    if (authError || !user) {
      console.error("❌ Unauthorized:", authError?.message || "No user")
      return NextResponse.json({ 
        error: "Unauthorized", 
        details: authError?.message || "No user found. Please log in."
      }, { status: 401 })
    }

    const body = await request.json()
    const { title, body: content, topicId, tagSlugs = [] } = body

    if (!title || !content || !topicId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
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
    const rateLimit = await checkRateLimit(user.id, 'create_thread', 5, 60)
    if (!rateLimit.allowed) {
      return NextResponse.json({ 
        error: `Límite de temas alcanzado. Intenta de nuevo en ${Math.ceil((rateLimit.resetAt.getTime() - Date.now()) / 60000)} minutos` 
      }, { status: 429 })
    }

    // Filter content
    const titleFilter = filterContent(title, profile.reputation)
    if (titleFilter.isBlocked) {
      return NextResponse.json({ error: titleFilter.reason }, { status: 400 })
    }

    const bodyFilter = filterContent(content, profile.reputation)
    if (bodyFilter.isBlocked) {
      return NextResponse.json({ error: bodyFilter.reason }, { status: 400 })
    }

    // Check moderation status (first 3 posts need approval)

    const moderationStatus = (profile?.postsCreated || 0) < 3 ? 'pending' : 'approved'

    // Get or create tags
    const tagIds: string[] = []
    for (const slug of tagSlugs) {
      let tag = await prisma.forumTag.findUnique({ where: { slug } })
      if (!tag) {
        tag = await prisma.forumTag.create({
          data: {
            name: slug.replace(/-/g, ' '),
            slug
          }
        })
      }
      tagIds.push(tag.id)
    }

    // Create thread
    const thread = await prisma.forumThread.create({
      data: {
        title: title.trim(),
        body: content.trim(),
        authorId: user.id,
        topicId,
        moderationStatus,
        tags: {
          create: tagIds.map(tagId => ({ tagId }))
        }
      },
      include: {
        topic: true,
        author: {
          select: {
            nickname: true,
            fullName: true
          }
        }
      }
    })

    // Update profile stats
    await prisma.profile.update({
      where: { userId: user.id },
      data: { postsCreated: { increment: 1 } }
    })

    console.log(`✅ Created thread: "${title}" by user ${user.id}`)

    return NextResponse.json(thread, { status: 201 })
  } catch (error) {
    console.error("Error creating thread:", error)
    return NextResponse.json({ error: "Failed to create thread" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

