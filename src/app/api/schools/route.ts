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
    console.error('API Schools Error - Failed to fetch schools, returning empty array:', err)
    // Return empty array to prevent UI crashing on select components
    return NextResponse.json([], { status: 200 })
  }
}
