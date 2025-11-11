import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { z } from 'zod';
import { calculatePricing, PricingInput } from '@/lib/lab/simulators';

const PricingInputSchema = z.object({
  baseCost: z.number().min(0),
  targetMarginPercent: z.number().min(0).max(100),
  features: z.object({
    basic: z.array(z.string()),
    standard: z.array(z.string()),
    premium: z.array(z.string())
  }),
  estimatedUsers: z.number().int().min(1).optional().default(100)
});

/**
 * POST /api/lab/sim/pricing
 * Calculate pricing tiers and scenarios
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = PricingInputSchema.parse(body);
    const { estimatedUsers, ...pricingInput } = validated;

    // Calculate pricing
    const output = calculatePricing(pricingInput as PricingInput, estimatedUsers);

    // Save input
    const { data: inputData, error: inputError } = await supabase
      .from('lab_sim_inputs')
      .insert({
        user_id: user.id,
        kind: 'pricing',
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
    console.error('Error calculating pricing:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to calculate pricing' },
      { status: 500 }
    );
  }
}

