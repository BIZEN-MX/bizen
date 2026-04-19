import { NextResponse } from 'next/server';
import { executePendingOrders } from '@/lib/simulators/stocks';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const executed = await executePendingOrders();
    
    const pendingOrders = await prisma.simulator_orders.findMany({
      where: { status: 'pending' }
    });

    return NextResponse.json({ success: true, executed, leftPending: pendingOrders });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message, stack: err.stack });
  }
}
