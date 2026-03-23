import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

// ── GET /api/live/templates ──────────────────────────────────────────────────
// ?id=uuid   → returns full template (with questions JSONB)
// (no param) → returns list of own + public templates (without questions)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (id) {
      // Return single template with full questions JSONB
      const { data, error } = await supabase
        .from('live_quiz_templates')
        .select('*')
        .eq('id', id)
        .or(`owner_id.eq.${user.id},is_public.eq.true`)
        .single()

      if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      return NextResponse.json(data)
    }

    // List view — no questions blob to keep payload small
    const { data, error } = await supabase
      .from('live_quiz_templates')
      .select('id, title, description, category, difficulty, question_count, times_used, is_public, created_at, updated_at, owner_id')
      .or(`owner_id.eq.${user.id},is_public.eq.true`)
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Error fetching templates:', error)
      return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error GET /api/live/templates:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ── POST /api/live/templates ─────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { title, description, category, difficulty, questions, is_public } = body

    if (!title || !questions || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json({ error: 'title and questions are required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('live_quiz_templates')
      .insert({
        owner_id: user.id,
        title: title.trim(),
        description: description?.trim() || null,
        category: category || 'Custom',
        difficulty: difficulty || 1,
        questions,
        is_public: is_public || false,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating template:', error)
      return NextResponse.json({ error: 'Failed to create template' }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error POST /api/live/templates:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ── PATCH /api/live/templates ─────────────────────────────────────────────────
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { id, increment_used, ...rest } = body

    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

    if (increment_used) {
      const { data: tpl } = await supabase.from('live_quiz_templates').select('times_used').eq('id', id).single()
      await supabase.from('live_quiz_templates').update({ times_used: (tpl?.times_used || 0) + 1 }).eq('id', id)
      return NextResponse.json({ ok: true })
    }

    const allowed = ['title', 'description', 'category', 'difficulty', 'questions', 'is_public']
    const updates: Record<string, any> = {}
    for (const key of allowed) { if (rest[key] !== undefined) updates[key] = rest[key] }

    const { data, error } = await supabase
      .from('live_quiz_templates')
      .update(updates)
      .eq('id', id)
      .eq('owner_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating template:', error)
      return NextResponse.json({ error: 'Failed to update template' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error PATCH /api/live/templates:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ── DELETE /api/live/templates ─────────────────────────────────────────────────
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

    const { error } = await supabase
      .from('live_quiz_templates')
      .delete()
      .eq('id', id)
      .eq('owner_id', user.id)

    if (error) {
      console.error('Error deleting template:', error)
      return NextResponse.json({ error: 'Failed to delete template' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Error DELETE /api/live/templates:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
