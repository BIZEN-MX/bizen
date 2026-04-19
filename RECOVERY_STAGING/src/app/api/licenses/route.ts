import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/licenses - List all licenses
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const schoolId = searchParams.get('schoolId')

    const licenses = await prisma.license.findMany({
      where: schoolId ? { schoolId } : undefined,
      include: {
        school: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        startDate: 'desc'
      }
    })

    return NextResponse.json(licenses)
  } catch (error) {
    console.error('Error fetching licenses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch licenses' },
      { status: 500 }
    )
  }
}

// POST /api/licenses - Create a new license
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { schoolId, plan, seats, status, startDate, endDate } = body

    if (!schoolId || !plan || !seats || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const license = await prisma.license.create({
      data: {
        schoolId,
        plan,
        seats,
        status: status || 'active',
        startDate: new Date(startDate),
        endDate: new Date(endDate)
      },
      include: {
        school: true
      }
    })

    return NextResponse.json(license, { status: 201 })
  } catch (error) {
    console.error('Error creating license:', error)
    return NextResponse.json(
      { error: 'Failed to create license' },
      { status: 500 }
    )
  }
}

