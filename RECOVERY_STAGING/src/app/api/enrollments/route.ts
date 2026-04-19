import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth/api-auth'

// GET /api/enrollments - Get user's enrollments (Joined Topics)
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (!authResult.success) {
      return authResult.response
    }
    const { user } = authResult.data

    const enrollments = await prisma.enrollment.findMany({
      where: { userId: user.id },
      include: {
        topic: {
          include: {
            courses: {
              include: {
                _count: {
                  select: {
                    lessons: true
                  }
                }
              },
              orderBy: {
                order: 'asc'
              }
            }
          }
        }
      },
      orderBy: {
        enrolledAt: 'desc'
      }
    })

    return NextResponse.json(enrollments)
  } catch (error) {
    console.error('Error fetching enrollments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch enrollments' },
      { status: 500 }
    )
  }
}

// POST /api/enrollments - Enroll in a topic
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (!authResult.success) {
      return authResult.response
    }
    const { user } = authResult.data

    const body = await request.json()
    const { topicId } = body

    if (!topicId) {
      return NextResponse.json(
        { error: 'topicId is required' },
        { status: 400 }
      )
    }

    // Check if already enrolled
    const existing = await prisma.enrollment.findUnique({
      where: {
        userId_topicId: {
          userId: user.id,
          topicId
        }
      }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Already enrolled in this topic' },
        { status: 400 }
      )
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        userId: user.id,
        topicId
      },
      include: {
        topic: true
      }
    })

    return NextResponse.json(enrollment, { status: 201 })
  } catch (error) {
    console.error('Error creating enrollment:', error)
    return NextResponse.json(
      { error: 'Failed to enroll in topic' },
      { status: 500 }
    )
  }
}

// DELETE /api/enrollments - Unenroll from a topic
export async function DELETE(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (!authResult.success) {
      return authResult.response
    }
    const { user } = authResult.data

    const { searchParams } = new URL(request.url)
    const topicId = searchParams.get('topicId')

    if (!topicId) {
      return NextResponse.json(
        { error: 'topicId is required' },
        { status: 400 }
      )
    }

    await prisma.enrollment.delete({
      where: {
        userId_topicId: {
          userId: user.id,
          topicId
        }
      }
    })

    return NextResponse.json({ message: 'Unenrolled successfully' })
  } catch (error) {
    console.error('Error deleting enrollment:', error)
    return NextResponse.json(
      { error: 'Failed to unenroll from topic' },
      { status: 500 }
    )
  }
}
