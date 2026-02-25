import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const schools = await prisma.school.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    })
    return NextResponse.json(schools)
  } catch (err) {
    console.error('Error fetching schools:', err)
    return NextResponse.json({ error: 'Failed to fetch schools' }, { status: 500 })
  }
}
