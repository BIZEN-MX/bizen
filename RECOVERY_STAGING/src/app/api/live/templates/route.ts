import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

// ── GET /api/live/templates ──────────────────────────────────────────────────
// ?id=uuid   → returns full template (with questions JSONB)
// (no param) → returns list of own + public templates (without questions)
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (id) {
      const template = await prisma.live_quiz_templates.findFirst({
        where: {
          id,
          OR: [{ owner_id: userId }, { is_public: true }]
        }
      })
      if (!template) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      return NextResponse.json(template)
    }

    // List view — own + public templates
    const templates = await prisma.live_quiz_templates.findMany({
      where: {
        OR: [{ owner_id: userId }, { is_public: true }]
      },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        difficulty: true,
        question_count: true,
        times_used: true,
        is_public: true,
        owner_id: true,
        created_at: true,
        updated_at: true,
      },
      orderBy: { updated_at: 'desc' }
    })

    return NextResponse.json(templates)
  } catch (error) {
    console.error('Error GET /api/live/templates:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ── POST /api/live/templates ─────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { title, description, category, difficulty, questions, is_public } = body

    if (!title || !questions || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json({ error: 'title and questions are required' }, { status: 400 })
    }

    const template = await prisma.live_quiz_templates.create({
      data: {
        owner_id: userId,
        title: title.trim(),
        description: description?.trim() || null,
        category: category || 'Custom',
        difficulty: difficulty || 1,
        questions: questions as any,
        question_count: questions.length,
        is_public: is_public || false,
      }
    })

    return NextResponse.json(template, { status: 201 })
  } catch (error) {
    console.error('Error POST /api/live/templates:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ── PATCH /api/live/templates ─────────────────────────────────────────────────
export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { id, increment_used, ...rest } = body

    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

    if (increment_used) {
      const tpl = await prisma.live_quiz_templates.findUnique({ where: { id }, select: { times_used: true } })
      await prisma.live_quiz_templates.update({
        where: { id },
        data: { times_used: (tpl?.times_used || 0) + 1 }
      })
      return NextResponse.json({ ok: true })
    }

    const allowed = ['title', 'description', 'category', 'difficulty', 'questions', 'is_public'] as const
    const updates: Record<string, any> = {}
    for (const key of allowed) {
      if (rest[key] !== undefined) updates[key] = rest[key]
    }
    if (updates.questions && Array.isArray(updates.questions)) {
      updates.question_count = updates.questions.length
    }

    const template = await prisma.live_quiz_templates.update({
      where: { id, owner_id: userId },
      data: { ...updates, updated_at: new Date() }
    })

    return NextResponse.json(template)
  } catch (error) {
    console.error('Error PATCH /api/live/templates:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ── DELETE /api/live/templates ─────────────────────────────────────────────────
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

    await prisma.live_quiz_templates.deleteMany({
      where: { id, owner_id: userId }
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Error DELETE /api/live/templates:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
