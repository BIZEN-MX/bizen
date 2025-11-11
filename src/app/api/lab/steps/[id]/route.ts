import { NextRequest, NextResponse } from 'next/server';
import { getStepById } from '@/lib/lab/db';
import { createSupabaseServer } from '@/lib/supabase/server';

/**
 * GET /api/lab/steps/[id]
 * Returns step details with user's checklists, artifacts, and experiments
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createSupabaseServer();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const stepId = params.id;
    const stepData = await getStepById(stepId, user.id);

    return NextResponse.json({
      success: true,
      data: stepData
    });
  } catch (error: any) {
    console.error('Error fetching step:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch step' },
      { status: 500 }
    );
  }
}

