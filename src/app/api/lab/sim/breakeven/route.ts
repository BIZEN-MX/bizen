import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { z } from 'zod';
import { calculateBreakeven, BreakevenInput } from '@/lib/lab/simulators';

const BreakevenInputSchema = z.object({
  fixedCosts: z.number().min(0),
  pricePerUnit: z.number().min(0),
  variableCostPerUnit: z.number().min(0),
  currentUnits: z.number().int().min(0).optional()
});

/**
 * POST /api/lab/sim/breakeven
 * Calculate breakeven point
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = BreakevenInputSchema.parse(body);
    const { currentUnits, ...breakevenInput } = validated;

    // Calculate breakeven
    const output = calculateBreakeven(breakevenInput as BreakevenInput, currentUnits);

    // Save input
    const { data: inputData, error: inputError } = await supabase
      .from('lab_sim_inputs')
      .insert({
        user_id: user.id,
        kind: 'breakeven',
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
    console.error('Error calculating breakeven:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to calculate breakeven' },
      { status: 500 }
    );
  }
}

