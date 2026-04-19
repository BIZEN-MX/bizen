import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/prerequisites - Get prerequisites (optionally by unitId)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const unitId = searchParams.get('unitId')

    const prerequisites = await prisma.prerequisite.findMany({
      where: unitId ? { unitId } : undefined,
      include: {
        unit: {
          select: {
            id: true,
            title: true
          }
        },
        requiresUnit: {
          select: {
            id: true,
            title: true
          }
        }
      }
    })

    return NextResponse.json(prerequisites)
  } catch (error) {
    console.error('Error fetching prerequisites:', error)
    return NextResponse.json(
      { error: 'Failed to fetch prerequisites' },
      { status: 500 }
    )
  }
}

// POST /api/prerequisites - Create prerequisite
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { unitId, requiresUnitId, minScore } = body

    if (!unitId || !requiresUnitId) {
      return NextResponse.json(
        { error: 'unitId and requiresUnitId are required' },
        { status: 400 }
      )
    }

    const prerequisite = await prisma.prerequisite.create({
      data: {
        unitId,
        requiresUnitId,
        minScore: minScore || 70
      },
      include: {
        unit: true,
        requiresUnit: true
      }
    })

    return NextResponse.json(prerequisite, { status: 201 })
  } catch (error) {
    console.error('Error creating prerequisite:', error)
    return NextResponse.json(
      { error: 'Failed to create prerequisite' },
      { status: 500 }
    )
  }
}

// DELETE /api/prerequisites - Delete prerequisite
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const prerequisiteId = searchParams.get('id')

    if (!prerequisiteId) {
      return NextResponse.json(
        { error: 'id is required' },
        { status: 400 }
      )
    }

    await prisma.prerequisite.delete({
      where: { id: prerequisiteId }
    })

    return NextResponse.json({ message: 'Prerequisite deleted successfully' })
  } catch (error) {
    console.error('Error deleting prerequisite:', error)
    return NextResponse.json(
      { error: 'Failed to delete prerequisite' },
      { status: 500 }
    )
  }
}

