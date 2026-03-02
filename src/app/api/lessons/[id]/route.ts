import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/lessons/[id] - Get lesson by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // In Next.js 15, params is a Promise
) {
  try {
    const { id } = await params

    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        units: { // Correct relation name from schema
          include: {
            course: {
              select: {
                id: true,
                title: true
              }
            }
          }
        },
        quizzes: {
          include: {
            questions: {
              include: {
                options: true
              },
              orderBy: {
                order: 'asc'
              }
            }
          }
        },
        steps: {
          orderBy: {
            order: 'asc'
          }
        },
        resources: true
      }
    })

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(lesson)
  } catch (error) {
    console.error('Error fetching lesson:', error)
    return NextResponse.json(
      { error: 'Failed to fetch lesson' },
      { status: 500 }
    )
  }
}

