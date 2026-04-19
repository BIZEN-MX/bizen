import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const results: any = {
    timestamp: new Date().toISOString(),
    env: {
      has_db_url: !!process.env.DATABASE_URL,
      has_clerk_key: !!process.env.CLERK_SECRET_KEY,
      node_env: process.env.NODE_ENV
    },
    database: {
      status: 'pending',
      error: null,
      count: 0
    }
  };

  try {
    // Try a simple count
    const count = await prisma.profile.count();
    results.database.status = 'CONNECTED';
    results.database.count = count;
  } catch (err: any) {
    results.database.status = 'FAILED';
    results.database.error = err.message || 'Unknown error';
    results.database.stack = err.stack;
  }

  return NextResponse.json(results);
}
