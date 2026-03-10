/**
 * API Route: /api/simuladores/runs/[id]
 * GET: Fetch a single saved run
 * DELETE: Delete a saved run
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';

// GET: Fetch a single run by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    
    const { id } = await params;
    
    // Fetch run (RLS will ensure user owns it)
    const { data, error } = await supabase
      .from('sim_runs')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();
    
    if (error || !data) {
      return NextResponse.json(
        { error: 'Simulación no encontrada' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ run: data });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Error inesperado' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a saved run
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    
    const { id } = await params;
    
    // Delete run (RLS will ensure user owns it)
    const { error } = await supabase
      .from('sim_runs')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
    
    if (error) {
      console.error('Error deleting run:', error);
      return NextResponse.json(
        { error: 'Error al eliminar simulación' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Error inesperado' },
      { status: 500 }
    );
  }
}

