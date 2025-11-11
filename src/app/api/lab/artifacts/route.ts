import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { z } from 'zod';

const CreateArtifactSchema = z.object({
  step_id: z.string(),
  type: z.string(),
  title: z.string().min(1),
  content: z.string().optional(),
  url: z.string().url().optional(),
  metadata: z.record(z.any()).optional()
});

const UpdateArtifactSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  content: z.string().optional(),
  url: z.string().url().optional(),
  metadata: z.record(z.any()).optional(),
  is_shared: z.boolean().optional()
});

/**
 * GET /api/lab/artifacts?step_id=xxx
 * Returns user's artifacts for a specific step
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
      .from('lab_artifacts')
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
    console.error('Error fetching artifacts:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch artifacts' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/lab/artifacts
 * Create a new artifact
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = CreateArtifactSchema.parse(body);

    const { data, error } = await supabase
      .from('lab_artifacts')
      .insert({
        ...validated,
        user_id: user.id
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    console.error('Error creating artifact:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create artifact' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/lab/artifacts
 * Update an artifact
 */
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = UpdateArtifactSchema.parse(body);
    const { id, ...updates } = validated;

    const { data, error } = await supabase
      .from('lab_artifacts')
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
    console.error('Error updating artifact:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update artifact' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/lab/artifacts?id=xxx
 * Delete an artifact
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
      .from('lab_artifacts')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting artifact:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete artifact' },
      { status: 500 }
    );
  }
}

