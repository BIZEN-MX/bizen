import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { z } from 'zod';
import { calculateCashflow, CashflowInput } from '@/lib/lab/simulators';

const CashflowInputSchema = z.object({
  startingCash: z.number().min(0),
  monthlyRevenue: z.number().min(0),
  monthlyExpenses: z.number().min(0),
  months: z.number().int().min(1).max(60)
});

/**
 * POST /api/lab/sim/cashflow
 * Calculate cashflow projection
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = CashflowInputSchema.parse(body);

    // Calculate cashflow
    const output = calculateCashflow(validated as CashflowInput);

    // Save input
    const { data: inputData, error: inputError } = await supabase
      .from('lab_sim_inputs')
      .insert({
        user_id: user.id,
        kind: 'cashflow',
        input: validated
      })
      .select()
      .single();

    if (inputError) throw inputError;

    // Save output
    const { error: outputError } = await supabase
      .from('lab_sim_outputs')
      .insert({
        sim_input_id: inputData.id,
        output
      });

    if (outputError) throw outputError;

    return NextResponse.json({
      success: true,
      data: {
        input: validated,
        output,
        saved_id: inputData.id
      }
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    console.error('Error calculating cashflow:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to calculate cashflow' },
      { status: 500 }
    );
  }
}

