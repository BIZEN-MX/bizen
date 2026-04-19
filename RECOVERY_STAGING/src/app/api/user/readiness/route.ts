import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { computeReadinessScore } from '@/lib/readinessScore';

export async function GET(req: Request) {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const readinessResult = await computeReadinessScore(user.id);

    return NextResponse.json(readinessResult);
  } catch (error: any) {
    console.error("Readiness score fetch error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
