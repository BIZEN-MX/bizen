import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { z } from 'zod';
import { calculateFunnel, FunnelInput } from '@/lib/lab/simulators';

const FunnelInputSchema = z.object({
  visitors: z.number().int().min(1),
  visitorToLeadPercent: z.number().min(0).max(100),
  leadToTrialPercent: z.number().min(0).max(100),
  trialToPaidPercent: z.number().min(0).max(100),
  averageOrderValue: z.number().min(0),
  costPerVisitor: z.number().min(0).optional(),
  avgCustomerLifetimeMonths: z.number().int().min(1).optional()
});

/**
 * POST /api/lab/sim/funnel
 * Calculate conversion funnel metrics
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = FunnelInputSchema.parse(body);
    const { avgCustomerLifetimeMonths, ...funnelInput } = validated;

    // Calculate funnel
    const output = calculateFunnel(funnelInput as FunnelInput, avgCustomerLifetimeMonths);

    // Save input
    const { data: inputData, error: inputError } = await supabase
      .from('lab_sim_inputs')
      .insert({
        user_id: user.id,
        kind: 'funnel',
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
    console.error('Error calculating funnel:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to calculate funnel' },
      { status: 500 }
    );
  }
}

