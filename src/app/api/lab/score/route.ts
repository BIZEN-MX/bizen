import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { z } from 'zod';

const UpdateScoreSchema = z.object({
  readiness_score: z.number().min(0).max(100).optional(),
  notes: z.string().optional(),
  breakdown: z.record(z.any()).optional()
});

/**
 * GET /api/lab/score
 * Returns user's investment readiness score
 */
export async function GET() {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('lab_scores')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) throw error;

    // If no score exists, return default
    if (!data) {
      return NextResponse.json({
        success: true,
        data: {
          user_id: user.id,
          readiness_score: 0,
          notes: null,
          breakdown: null,
          updated_at: new Date().toISOString()
        }
      });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Error fetching score:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch score' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/lab/score
 * Update user's investment readiness score
 */
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = UpdateScoreSchema.parse(body);

    // Upsert (insert or update)
    const { data, error } = await supabase
      .from('lab_scores')
      .upsert({
        user_id: user.id,
        ...validated
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    console.error('Error updating score:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update score' },
      { status: 500 }
    );
  }
}

