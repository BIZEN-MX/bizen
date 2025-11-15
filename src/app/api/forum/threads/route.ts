import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"
import { PrismaClient } from "@prisma/client"
import { filterContent } from "@/lib/forum/contentFilter"
import { checkRateLimit } from "@/lib/forum/rateLimiter"

const prisma = process.env.DATABASE_URL ? new PrismaClient() : null

// GET list threads
export async function GET(request: NextRequest) {
  if (!prisma) {
    console.warn("⚠️ DATABASE_URL not configured. Returning empty forum threads list.")
    return NextResponse.json([])
  }

  try {
    console.log("📡 GET /api/forum/threads called")
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.error("❌ Auth error:", authError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("✅ User authenticated:", user.id)

    const { searchParams } = new URL(request.url)
    const sort = searchParams.get("sort") || "new"
    const topicSlug = searchParams.get("topic")
    
    console.log("📊 Query params:", { sort, topicSlug })

    let orderBy: any = { createdAt: 'desc' }
    if (sort === 'top') orderBy = { score: 'desc' }
    if (sort === 'unanswered') orderBy = { commentCount: 'asc' }

    const where: any = {
      OR: [
        { moderationStatus: 'approved' },
        { moderationStatus: 'pending', authorId: user.id } // Show user's own pending threads
      ],
      isHidden: false
    }

    if (topicSlug && topicSlug !== 'all') {
      console.log("🔍 Finding topic:", topicSlug)
      const topic = await prisma.forumTopic.findUnique({ where: { slug: topicSlug } })
      if (topic) {
        where.topicId = topic.id
        console.log("✅ Topic found:", topic.name)
      } else {
        console.warn("⚠️ Topic not found:", topicSlug)
      }
    }

    console.log("🔍 Fetching threads with where:", where)
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

    console.log(`✅ Found ${threads.length} threads`)

    const formatted = threads.map(t => ({
      ...t,
      author: {
        ...t.author,
        nickname: t.author.nickname || t.author.fullName?.split(' ')[0] || 'Usuario'
      },
      tags: t.tags.map(tt => tt.tag),
      hasAcceptedAnswer: !!t.acceptedCommentId
    }))

    console.log("✅ Returning formatted threads")
    return NextResponse.json(formatted)
  } catch (error) {
    console.error("❌ Error fetching threads:", error)
    console.error("Error details:", error instanceof Error ? error.message : String(error))
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace")
    return NextResponse.json({ 
      error: "Failed to fetch threads",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  } finally {
    if (prisma) {
      await prisma.$disconnect().catch(() => {})
    }
  }
}

// POST create thread
export async function POST(request: NextRequest) {
  if (!prisma) {
    console.error("❌ Cannot create thread: DATABASE_URL not configured")
    return NextResponse.json(
      { error: "Forum storage is temporarily unavailable" },
      { status: 503 }
    )
  }

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
    let profile
    try {
      profile = await prisma.profile.findUnique({
        where: { userId: user.id }
      })
    } catch (profileError: any) {
      console.error("❌ Error fetching profile:", profileError)
      // If profile table doesn't exist, create a minimal profile object
      if (profileError?.code === "P2021" || profileError?.message?.includes("does not exist")) {
        // Return a basic profile structure for forum operations
        profile = {
          userId: user.id,
          reputation: 0,
          postsCreated: 0,
          commentsCreated: 0,
          acceptedAnswers: 0
        } as any
      } else {
        throw profileError
      }
    }

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
    console.error("❌ Error creating thread:", error)
    console.error("Error details:", error instanceof Error ? error.message : String(error))
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace")
    
    // Provide detailed error information for debugging
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorCode = (error as any)?.code || "UNKNOWN_ERROR"
    
    // Handle specific Prisma errors
    if (errorCode === "P2021" || errorMessage.includes("does not exist")) {
      // Extract which table is missing from the error message - try multiple patterns
      let tableName = "unknown"
      
      // Pattern 1: relation "table_name" does not exist
      let match = errorMessage.match(/relation "(.+?)" does not exist/i)
      if (match) tableName = match[1]
      
      // Pattern 2: Table 'table_name' does not exist
      if (tableName === "unknown") {
        match = errorMessage.match(/Table ['"](.+?)['"] does not exist/i)
        if (match) tableName = match[1]
      }
      
      // Pattern 3: table_name in various formats
      if (tableName === "unknown") {
        match = errorMessage.match(/`(.+?)`/i)
        if (match) tableName = match[1]
      }
      
      // Pattern 4: Check for model name from Prisma
      if (tableName === "unknown") {
        match = errorMessage.match(/model (Forum\w+)/i)
        if (match) tableName = match[1].toLowerCase().replace(/([A-Z])/g, '_$1').toLowerCase()
      }
      
      console.error(`❌ Missing table: ${tableName}`)
      console.error(`❌ Full error message: ${errorMessage}`)
      
      return NextResponse.json({ 
        error: "Forum database tables not set up",
        details: `The table "${tableName}" does not exist. Full error: ${errorMessage}`,
        code: errorCode,
        hint: tableName.includes("profile") || tableName === "profiles"
          ? "The profiles table is missing. Check if it exists in your database."
          : `The ${tableName} table is missing. Run the forum_tables.sql script again or check your database.`
      }, { status: 503 })
    }
    
    if (errorMessage.includes("DATABASE_URL") || errorMessage.includes("Prisma") || !errorCode) {
      return NextResponse.json({ 
        error: "Database connection issue",
        details: "Unable to connect to the database. Check your DATABASE_URL configuration.",
        code: errorCode,
        hint: "Verify that DATABASE_URL is set correctly in your environment variables."
      }, { status: 503 })
    }
    
    return NextResponse.json({ 
      error: "Failed to create thread",
      details: errorMessage,
      code: errorCode,
      hint: "Check server logs for more details"
    }, { status: 500 })
  } finally {
    if (prisma) {
      await prisma.$disconnect().catch(() => {})
    }
  }
}

