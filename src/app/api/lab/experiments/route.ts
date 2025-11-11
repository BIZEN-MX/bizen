import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { z } from 'zod';

const CreateExperimentSchema = z.object({
  step_id: z.string(),
  hypothesis: z.string().min(1),
  metric: z.string().optional(),
  target_value: z.string().optional()
});

const UpdateExperimentSchema = z.object({
  id: z.string(),
  result: z.string().optional(),
  decision: z.string().optional(),
  status: z.enum(['planned', 'running', 'completed']).optional()
});

/**
 * GET /api/lab/experiments?step_id=xxx
 * Returns user's experiments for a specific step
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

    let query = supabase
      .from('lab_experiments')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (stepId) {
      query = query.eq('step_id', stepId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Error fetching experiments:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch experiments' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/lab/experiments
 * Create a new experiment
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = CreateExperimentSchema.parse(body);

    const { data, error } = await supabase
      .from('lab_experiments')
      .insert({
        ...validated,
        user_id: user.id,
        status: 'planned'
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    console.error('Error creating experiment:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create experiment' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/lab/experiments
 * Update an experiment (add results, decision, status)
 */
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = UpdateExperimentSchema.parse(body);
    const { id, ...updates } = validated;

    const { data, error } = await supabase
      .from('lab_experiments')
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
    console.error('Error updating experiment:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update experiment' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/lab/experiments?id=xxx
 * Delete an experiment
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
      .from('lab_experiments')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting experiment:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete experiment' },
      { status: 500 }
    );
  }
}

