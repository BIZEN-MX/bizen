import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")
    const topicSlug = searchParams.get("topic")
    const tagSlug = searchParams.get("tag")

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ error: "Query too short" }, { status: 400 })
    }

    const searchTerm = query.trim().toLowerCase()

    const where: any = {
      moderationStatus: 'approved',
      isHidden: false,
      OR: [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { body: { contains: searchTerm, mode: 'insensitive' } }
      ]
    }

    // Filter by topic
    if (topicSlug) {
      const topic = await prisma.forumTopic.findUnique({ where: { slug: topicSlug } })
      if (topic) where.topicId = topic.id
    }

    // Filter by tag
    if (tagSlug) {
      const tag = await prisma.forumTag.findUnique({ where: { slug: tagSlug } })
      if (tag) {
        where.tags = {
          some: { tagId: tag.id }
        }
      }
    }

    const threads = await prisma.forumThread.findMany({
      where,
      include: {
        author: {
          select: {
            nickname: true,
            fullName: true,
            reputation: true
          }
        },
        topic: true,
        tags: {
          include: { tag: true }
        }
      },
      orderBy: [
        { score: 'desc' },
        { createdAt: 'desc' }
      ],
      take: 30
    })

    const formatted = threads.map(t => ({
      ...t,
      author: {
        ...t.author,
        nickname: t.author.nickname || t.author.fullName.split(' ')[0]
      },
      tags: t.tags.map(tt => tt.tag)
    }))

    return NextResponse.json({ query, results: formatted })
  } catch (error) {
    console.error("Error searching:", error)
    return NextResponse.json({ error: "Failed to search" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
