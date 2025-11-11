import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { z } from 'zod';

const CreateChecklistSchema = z.object({
  step_id: z.string(),
  text: z.string().min(1),
  order: z.number().optional()
});

const UpdateChecklistSchema = z.object({
  id: z.string(),
  done: z.boolean().optional(),
  text: z.string().optional()
});

/**
 * GET /api/lab/checklists?step_id=xxx
 * Returns user's checklists for a specific step
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const stepId = searchParams.get('step_id');

    if (!stepId) {
      return NextResponse.json({ error: 'step_id is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('lab_checklists')
      .select('*')
      .eq('user_id', user.id)
      .eq('step_id', stepId)
      .order('order', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Error fetching checklists:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch checklists' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/lab/checklists
 * Create a new checklist item
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = CreateChecklistSchema.parse(body);

    const { data, error } = await supabase
      .from('lab_checklists')
      .insert({
        ...validated,
        user_id: user.id,
        done: false
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    console.error('Error creating checklist:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checklist' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/lab/checklists
 * Update checklist item (toggle done, edit text)
 */
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = UpdateChecklistSchema.parse(body);
    const { id, ...updates } = validated;

    const { data, error } = await supabase
      .from('lab_checklists')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    console.error('Error updating checklist:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update checklist' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/lab/checklists?id=xxx
 * Delete a checklist item
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('lab_checklists')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting checklist:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete checklist' },
      { status: 500 }
    );
  }
}

