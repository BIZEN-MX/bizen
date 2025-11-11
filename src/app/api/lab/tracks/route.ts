import { NextResponse } from 'next/server';
import { getTracksWithSteps, getUserLabProgress } from '@/lib/lab/db';
import { createSupabaseServer } from '@/lib/supabase/server';

/**
 * GET /api/lab/tracks
 * Returns all tracks with their steps and user's progress
 */
export async function GET() {
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

    // Get all tracks with steps
    const tracks = await getTracksWithSteps();
    
    // Get user's progress
    const progress = await getUserLabProgress(user.id);
    const progressMap = new Map(progress.map(p => [p.step_id, p]));
    
    // Enrich tracks with progress info
    const tracksWithProgress = tracks.map(track => ({
      ...track,
      steps: track.steps.map(step => ({
        ...step,
        progress: progressMap.get(step.id) || null
      })),
      completedSteps: track.steps.filter(step => 
        progressMap.get(step.id)?.is_completed
      ).length,
      totalSteps: track.steps.length
    }));

    return NextResponse.json({
      success: true,
      data: tracksWithProgress
    });
  } catch (error: any) {
    console.error('Error fetching tracks:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch tracks' },
      { status: 500 }
    );
  }
}

