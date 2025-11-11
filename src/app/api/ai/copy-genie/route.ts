import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { z } from 'zod';
import { copyGenie, checkRateLimit } from '@/lib/lab/ai';

const InputSchema = z.object({
  pageType: z.enum(['landing', 'email', 'social']),
  keyPoints: z.array(z.string()).min(1),
  tone: z.string().min(3)
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!checkRateLimit(user.id)) {
      return NextResponse.json({ error: 'Rate limit exceeded. Please try again in a minute.' }, { status: 429 });
    }

    const body = await request.json();
    const validated = InputSchema.parse(body);

    const { data: jobData, error: jobError } = await supabase
      .from('lab_ai_jobs')
      .insert({ user_id: user.id, tool: 'copy-genie', input: validated, status: 'processing' })
      .select()
      .single();

    if (jobError) throw jobError;

    const result = await copyGenie(validated);

    if (result.success) {
      await supabase
        .from('lab_ai_jobs')
        .update({ output: result.data, status: 'completed', completed_at: new Date().toISOString() })
        .eq('id', jobData.id);

      return NextResponse.json({ success: true, data: result.data, job_id: jobData.id });
    } else {
      await supabase
        .from('lab_ai_jobs')
        .update({ status: 'failed', error: result.error, completed_at: new Date().toISOString() })
        .eq('id', jobData.id);

      return NextResponse.json({ error: result.error || 'AI processing failed' }, { status: 500 });
    }
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    console.error('Error in copy-genie:', error);
    return NextResponse.json({ error: error.message || 'Failed to process request' }, { status: 500 });
  }
}

