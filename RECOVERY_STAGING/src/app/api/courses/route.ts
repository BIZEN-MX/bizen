import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/courses - List courses (optionally by topicId)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const topicId = searchParams.get('topicId')

    const courses = await prisma.course.findMany({
      where: topicId ? { topicId } : undefined,
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
    })

    return NextResponse.json(courses)
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    )
  }
}

// POST /api/courses - Create a new course
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { topicId, title, order, isLocked } = body

    if (!topicId || !title) {
      return NextResponse.json(
        { error: 'topicId and title are required' },
        { status: 400 }
      )
    }

    const course = await prisma.course.create({
      data: {
        topicId,
        title,
        order: order || 1,
        isLocked: isLocked !== undefined ? isLocked : false
      }
    })

    return NextResponse.json(course, { status: 201 })
  } catch (error) {
    console.error('Error creating course:', error)
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    )
  }
}

// PATCH /api/courses - Update course
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { courseId, title, order, isLocked } = body

    if (!courseId) {
      return NextResponse.json(
        { error: 'courseId is required' },
        { status: 400 }
      )
    }

    const course = await prisma.course.update({
      where: { id: courseId },
      data: {
        ...(title && { title }),
        ...(order !== undefined && { order }),
        ...(isLocked !== undefined && { isLocked })
      }
    })

    return NextResponse.json(course)
  } catch (error) {
    console.error('Error updating course:', error)
    return NextResponse.json(
      { error: 'Failed to update course' },
      { status: 500 }
    )
  }
}

// DELETE /api/courses - Delete course
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')

    if (!courseId) {
      return NextResponse.json(
        { error: 'courseId is required' },
        { status: 400 }
      )
    }

    await prisma.course.delete({
      where: { id: courseId }
    })

    return NextResponse.json({ message: 'Course deleted successfully' })
  } catch (error) {
    console.error('Error deleting course:', error)
    return NextResponse.json(
      { error: 'Failed to delete course' },
      { status: 500 }
    )
  }
}
