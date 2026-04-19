import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const data = await prisma.simulator.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    });
    
    // Transform back to snake_case names if expected by existing frontend
    const mappedData = data.map(s => ({
      ...s,
      is_active: s.isActive,
      sort_order: s.sortOrder,
      icon_name: s.iconName,
      button_color: s.buttonColor
    }));

    return NextResponse.json({ simulators: mappedData });
  } catch (error) {
    console.error('Unexpected error fetching simulators (ES):', error);
    return NextResponse.json(
      { error: 'Error inesperado' },
      { status: 500 }
    );
  }
}

