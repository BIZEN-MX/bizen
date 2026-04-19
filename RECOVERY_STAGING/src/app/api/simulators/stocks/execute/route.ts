import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// This is an internal CRON job or edge function to trigger order execution 
// using the stored EOD prices.

const API_CRON_SECRET = process.env.API_CRON_SECRET || 'dev-secret-key';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${API_CRON_SECRET}` && process.env.NODE_ENV !== 'development') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { executePendingOrders } = await import('@/lib/simulators/stocks');
    const executedCount = await executePendingOrders();

    return NextResponse.json({ executed: executedCount });
  } catch (error: any) {
    console.error("Execution error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
