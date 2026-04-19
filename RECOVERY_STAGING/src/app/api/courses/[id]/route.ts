import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/courses/[id] - Get course by ID with topic info and lessons
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    let course: any = null
    try {
      course = await prisma.course.findUnique({
        where: { id },
        include: {
          topic: {
            select: {
              id: true,
              title: true
            }
          },
          lessons: {
            include: {
              quizzes: true,
              _count: {
                select: {
                  progress: true
                }
              }
            },
            orderBy: {
              order: 'asc'
            }
          }
        }
      })
    } catch (dbErr: any) {
      console.warn("Soft error fetching course relations:", dbErr.message)
      course = await prisma.course.findUnique({ where: { id } }).catch(() => null)
    }

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(course)
  } catch (error) {
    console.error('Error fetching course:', error)
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    )
  }
}
