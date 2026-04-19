import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth/api-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const diagnostic: any = {
    step: 'start',
    error: null
  };

  try {
    // 1. Check Auth 
    diagnostic.step = 'checking_auth';
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) {
      return NextResponse.json({ error: 'Debes estar logueado para probar esto' }, { status: 401 });
    }
    const { user } = authResult;
    diagnostic.user = user.id;

    // 2. Check Profile Table
    diagnostic.step = 'checking_profile_table';
    const profile = await prisma.profile.findUnique({ where: { userId: user.id } });
    diagnostic.has_profile = !!profile;

    // 3. Check Item Table (Here is where I suspect the error is)
    diagnostic.step = 'checking_items_table';
    const items = await prisma.item.findMany();
    diagnostic.items_count = items.length;

    // 4. Try a dry-run UPSERT
    diagnostic.step = 'dry_run_upsert';
    const testUsername = "tester_" + Math.floor(Math.random() * 1000);
    const testProfile = await prisma.profile.upsert({
        where: { userId: user.id },
        update: { nickname: profile?.nickname || testUsername },
        create: {
            userId: user.id,
            fullName: user.user_metadata?.full_name || "Test User",
            nickname: testUsername,
            xp: 0,
            bizcoins: 0,
            role: 'particular'
        }
    });
    diagnostic.upsert_success = true;

    return NextResponse.json({ status: 'OK', diagnostic });
  } catch (err: any) {
    return NextResponse.json({ 
      status: 'CRASHED', 
      step_where_it_failed: diagnostic.step,
      error: err.message,
      stack: err.stack,
      hint: 'Copia este error y pásaselo a Antigravity'
    });
  }
}
