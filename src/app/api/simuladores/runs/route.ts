/**
 * API Routes: Simulator Runs
 * GET /api/simuladores/runs?slug=... - Get user's saved runs
 * POST /api/simuladores/runs - Save a new run
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { simulatorRunSchema } from '@/lib/simulators/schemas';
import { awardXp } from '@/lib/rewards';

// GET: Fetch user's saved runs
export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    
    let query = supabase
      .from('sim_runs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (slug) {
      query = query.eq('simulator_slug', slug);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching runs:', error);
      return NextResponse.json(
        { error: 'Error al cargar simulaciones' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ runs: data });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Error inesperado' },
      { status: 500 }
    );
  }
}

// POST: Save a new run
export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    
    // Validate input
    const validation = simulatorRunSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: validation.error.errors },
        { status: 400 }
      );
    }
    
    const { simulator_slug, run_name, inputs, outputs, notes } = validation.data;
    
    // Insert into database
    const { data, error } = await supabase
      .from('sim_runs')
      .insert({
        user_id: user.id,
        simulator_slug,
        run_name: run_name || 'Mi Simulación',
        inputs,
        outputs,
        notes,
      })
      .select()
      .single();

    
    if (error) {
      console.error('Error saving run:', error);
      return NextResponse.json(
        { error: 'Error al guardar simulación' },
        { status: 500 }
      );
    }

    // AWARD XP and update streak for meaningful AI tool interaction
    let rewards = null;
    try {
      rewards = await awardXp(user.id, 25);
      
      // Trigger achievement check for financial category
      try {
        const { checkAndAwardAchievements } = await import('@/lib/achievements');
        const profile = await prisma.profile.findUnique({ where: { userId: user.id }, select: { xp: true, level: true, bizcoins: true } });
        const cashflowWon = await prisma.player.count({ where: { userId: user.id, hasEscapedRatRace: true } }).catch(() => 0);
        
        await checkAndAwardAchievements(user.id, {
          cashflowWon,
          level: profile?.level ?? 1,
          bizcoins: profile?.bizcoins ?? 0,
        });
      } catch (achErr) {
        console.warn('[simuladores] Achievement check failed:', achErr);
      }
    } catch (xpErr) {
      console.error('Error awarding XP for simulator run:', xpErr);
    }
    
    return NextResponse.json({ run: data, rewards }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Error inesperado' },
      { status: 500 }
    );
  }
}


