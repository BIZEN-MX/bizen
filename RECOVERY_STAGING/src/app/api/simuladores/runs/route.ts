/**
 * API Routes: Simulator Runs
 * GET /api/simuladores/runs?slug=... - Get user's saved runs
 * POST /api/simuladores/runs - Save a new run
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { simulatorRunSchema } from '@/lib/simulators/schemas';
import { awardXp } from '@/lib/rewards';
import { prisma } from '@/lib/prisma';
import { ensureProfile } from '@/lib/profiles';

// GET: Fetch user's saved runs
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    // Ensure profile exists for the user to avoid FK issues later
    await ensureProfile(userId);

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    
    // Use Prisma to fetch runs to avoid RLS issues with Clerk user IDs
    const runs = await prisma.sim_runs.findMany({
      where: {
        user_id: userId,
        ...(slug ? { simulator_slug: slug } : {})
      },
      orderBy: {
        created_at: 'desc'
      }
    });
    
    return NextResponse.json({ runs });
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
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const supabase = await createSupabaseServer();
    
    // Ensure profile exists for the user to avoid FK issues
    await ensureProfile(userId);
    
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
    
    // Insert into database using Prisma to bypass RLS issues and ensure better compatibility with Clerk user IDs
    let data;
    try {
      data = await prisma.sim_runs.create({
        data: {
          user_id: userId,
          run_name: run_name || 'Mi Simulación',
          simulator_slug,
          inputs: inputs as any,
          outputs: outputs as any,
          notes,
        }
      });
    } catch (dbError: any) {
      console.error('Error saving run with Prisma:', dbError);
      return NextResponse.json(
        { error: 'Error al guardar simulación en la base de datos' },
        { status: 500 }
      );
    }

    // AWARD XP and update streak for meaningful AI tool interaction
    let rewards = null;
    try {
      rewards = await awardXp(userId, 25, {
        category: "simulator_reward",
        description: `Uso del simulador: ${run_name || simulator_slug}`
      });
      
      // Trigger achievement check for financial category
      try {
        const { checkAndAwardAchievements } = await import('@/lib/achievements');
        const profile = await prisma.profile.findUnique({ where: { userId: userId }, select: { xp: true, level: true, bizcoins: true } });
        const cashflowWon = await prisma.player.count({ where: { userId: userId, hasEscapedRatRace: true } }).catch(() => 0);
        
        await checkAndAwardAchievements(userId, {
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


