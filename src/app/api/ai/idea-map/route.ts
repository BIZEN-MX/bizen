import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { z } from 'zod';
import { ideaMap, checkRateLimit } from '@/lib/lab/ai';

const InputSchema = z.object({
  problemStatement: z.string().min(10),
  targetCustomer: z.string().min(5)
});

/**
 * POST /api/ai/idea-map
 * Refine problem and create value proposition
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limiting
    if (!checkRateLimit(user.id)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again in a minute.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validated = InputSchema.parse(body);

    // Log AI job as pending
    const { data: jobData, error: jobError } = await supabase
      .from('lab_ai_jobs')
      .insert({
        user_id: user.id,
        tool: 'idea-map',
        input: validated,
        status: 'processing'
      })
      .select()
      .single();

    if (jobError) throw jobError;

    // Call AI
    const result = await ideaMap(validated);

    // Update job with result
    if (result.success) {
      await supabase
        .from('lab_ai_jobs')
        .update({
          output: result.data,
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', jobData.id);

      return NextResponse.json({
        success: true,
        data: result.data,
        job_id: jobData.id
      });
    } else {
      await supabase
        .from('lab_ai_jobs')
        .update({
          status: 'failed',
          error: result.error,
          completed_at: new Date().toISOString()
        })
        .eq('id', jobData.id);

      return NextResponse.json(
        { error: result.error || 'AI processing failed' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    console.error('Error in idea-map:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process request' },
      { status: 500 }
    );
  }
}

