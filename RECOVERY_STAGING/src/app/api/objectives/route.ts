import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/objectives - List all objectives
export async function GET(request: NextRequest) {
  try {
    const objectives = await prisma.objective.findMany({
      include: {
        lessonObjectives: {
          include: {
            lesson: {
              select: {
                id: true,
                title: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json(objectives)
  } catch (error) {
    console.error('Error fetching objectives:', error)
    return NextResponse.json(
      { error: 'Failed to fetch objectives' },
      { status: 500 }
    )
  }
}

// POST /api/objectives - Create objective
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, level } = body

    if (!title || !level) {
      return NextResponse.json(
        { error: 'title and level are required' },
        { status: 400 }
      )
    }

    const objective = await prisma.objective.create({
      data: {
        title,
        description: description || '',
        level
      }
    })

    return NextResponse.json(objective, { status: 201 })
  } catch (error) {
    console.error('Error creating objective:', error)
    return NextResponse.json(
      { error: 'Failed to create objective' },
      { status: 500 }
    )
  }
}

