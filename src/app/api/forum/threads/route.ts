import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { filterContent } from "@/lib/forum/contentFilter"
import { checkRateLimit } from "@/lib/forum/rateLimiter"
import { checkAndAwardAchievements } from "@/lib/achievements"
import { touchDailyStreak } from "@/lib/rewards"
import { forumThreadSchema } from "@/validators/forum"

// ... GET function remains the same ...

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sort = searchParams.get("sort") || "new"
    const topicSlug = searchParams.get("topic")

    const supabase = await createSupabaseServer()
    const { data: { session } } = await supabase.auth.getSession()
    const user = session?.user

    let userId: string | undefined
    let isParticular = false
    if (user) {
      userId = user.id
      const profile = await prisma.profile.findUnique({ where: { userId }, select: { role: true } })
      isParticular = profile?.role === 'particular'
    }

    let orderBy: any = { createdAt: 'desc' }
    if (sort === 'top') orderBy = { score: 'desc' }
    if (sort === 'unanswered') orderBy = { commentCount: 'asc' }

    const where: any = { isHidden: false }
    if (userId) {
      where.OR = [{ moderationStatus: 'approved' }, { moderationStatus: 'pending', authorId: userId }]
      where.author = { role: isParticular ? 'particular' : { not: 'particular' } }
    } else {
      where.moderationStatus = 'approved'
    }

    if (topicSlug && topicSlug !== 'all') {
      const topic = await prisma.forumTopic.findUnique({ where: { slug: topicSlug } })
      if (topic) where.topicId = topic.id
    }

    const threads = await prisma.forumThread.findMany({
      where,
      orderBy: [{ isPinned: 'desc' }, orderBy],
      select: {
        id: true, title: true, body: true, status: true, score: true,
        viewCount: true, commentCount: true, isPinned: true, createdAt: true,
        acceptedCommentId: true,
        author: {
          select: { userId: true, nickname: true, reputation: true, fullName: true, avatar: true }
        },
        topic: { select: { id: true, name: true, slug: true, icon: true } },
        tags: { include: { tag: { select: { id: true, name: true, slug: true } } } }
      },
      take: 30
    })

    const formatted = threads.map(t => {
      const author = t.author || { userId: 'unknown', nickname: 'Usuario', reputation: 0, avatar: null }
      return {
        ...t,
        author,
        tags: t.tags.map((tt: any) => tt.tag),
        hasAcceptedAnswer: !!t.acceptedCommentId
      }
    })

    return NextResponse.json(formatted)
  } catch (error) {
    console.error("❌ [Forum:FetchError]:", error)
    return NextResponse.json({ error: "No se pudieron obtener los temas" }, { status: 500 })
  }
}

// POST create thread
export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    
    // 1. Validation (Allow-listing & Length Limits)
    const validation = forumThreadSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json({ 
        error: "Datos de tema inválidos", 
        details: validation.error.format() 
      }, { status: 400 })
    }

    const { title, body: content, topicId, tagSlugs = [] } = validation.data

    // Get user profile
    let profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      select: { role: true, reputation: true, postsCreated: true, isMinor: true, parentalOverride: true }
    })

    if (!profile) {
      return NextResponse.json({ error: "Perfil de usuario no encontrado" }, { status: 404 })
    }

    // Role check
    if (profile.role === 'school_admin' || profile.role === 'teacher') {
      return NextResponse.json({ 
        error: "Los administradores no pueden crear hilos, solo interactuar." 
      }, { status: 403 })
    }

    // Rate limit
    const rateLimit = await checkRateLimit(user.id, 'create_thread', 3, 60)
    if (!rateLimit.allowed) {
      return NextResponse.json({
        error: `Límite alcanzado. Intenta de nuevo en ${Math.ceil((rateLimit.resetAt.getTime() - Date.now()) / 60000)} min`
      }, { status: 429 })
    }

    // 2. Sanitization (Remove HTML & Escape)
    const titleFilter = filterContent(title, profile.reputation)
    const bodyFilter = filterContent(content, profile.reputation)
    
    if (titleFilter.isBlocked || bodyFilter.isBlocked) {
      return NextResponse.json({ 
        error: titleFilter.reason || bodyFilter.reason 
      }, { status: 400 })
    }

    // Moderation logic
    const moderationStatus = (profile.isMinor && !profile.parentalOverride) || (profile.postsCreated || 0) < 3 ? 'pending' : 'approved'

    // AI Moderation (Opt-in)
    let finalTagIds: string[] = []
    try {
      const { checkToxicity, suggestTags } = await import("@/lib/ai/moderation")
      const aiMod = await checkToxicity(titleFilter.filteredContent, bodyFilter.filteredContent)

      if (aiMod.isToxic) {
        return NextResponse.json({ error: "Contenido bloqueado por moderación" }, { status: 400 })
      }

      const availableTagsRaw = await prisma.forumTag.findMany({ take: 20 })
      const aiTags = await suggestTags(titleFilter.filteredContent, bodyFilter.filteredContent, availableTagsRaw.map(t => t.name))
      
      const combinedTagSlugs = Array.from(new Set([...tagSlugs, ...aiTags]))
      for (const slug of combinedTagSlugs) {
        let tag = await prisma.forumTag.findUnique({ where: { slug } }) || await prisma.forumTag.create({ data: { name: slug.replace(/-/g, ' '), slug } })
        finalTagIds.push(tag.id)
      }
    } catch (aiErr) {
      // AI fallback
      for (const slug of tagSlugs) {
        let tag = await prisma.forumTag.findUnique({ where: { slug } }) || await prisma.forumTag.create({ data: { name: slug.replace(/-/g, ' '), slug } })
        finalTagIds.push(tag.id)
      }
    }

    // Create thread with SAFE SANITIZED content
    const thread = await prisma.forumThread.create({
      data: {
        title: titleFilter.filteredContent.trim(), // Sanitized!
        body: bodyFilter.filteredContent.trim(),   // Sanitized!
        authorId: user.id,
        topicId,
        moderationStatus,
        tags: { create: finalTagIds.map(tagId => ({ tagId })) }
      }
    })

    // Update stats & rewards
    const updatedProfile = await prisma.profile.update({
      where: { userId: user.id },
      data: { postsCreated: { increment: 1 } }
    })

    checkAndAwardAchievements(user.id, { postsCreated: updatedProfile.postsCreated || 1 }).catch(() => {})
    touchDailyStreak(user.id).catch(() => {})

    return NextResponse.json(thread, { status: 201 })
  } catch (error) {
    console.error("❌ [Forum:ThreadPostError]:", error)
    return NextResponse.json({ error: "No se pudo publicar el tema" }, { status: 500 })
  }
}


