import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/licenses/[id] - Get license by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const license = await prisma.license.findUnique({
      where: { id: params.id },
      include: {
        school: true
      }
    })

    if (!license) {
      return NextResponse.json(
        { error: 'License not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(license)
  } catch (error) {
    console.error('Error fetching license:', error)
    return NextResponse.json(
      { error: 'Failed to fetch license' },
      { status: 500 }
    )
  }
}

// PATCH /api/licenses/[id] - Update license
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json()
    const { plan, seats, status, startDate, endDate } = body

    const license = await prisma.license.update({
      where: { id: params.id },
      data: {
        ...(plan && { plan }),
        ...(seats !== undefined && { seats }),
        ...(status && { status }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) })
      },
      include: {
        school: true
      }
    })

    return NextResponse.json(license)
  } catch (error) {
    console.error('Error updating license:', error)
    return NextResponse.json(
      { error: 'Failed to update license' },
      { status: 500 }
    )
  }
}

