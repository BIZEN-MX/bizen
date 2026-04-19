import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/lessons - List lessons (optionally by courseId)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')

    const lessons = await prisma.lesson.findMany({
      where: courseId ? { courseId } : undefined,
      include: {
        quizzes: true,
      },
      orderBy: {
        order: 'asc'
      }
    })

    return NextResponse.json(lessons)
  } catch (error) {
    console.error('Error fetching lessons:', error)
    return NextResponse.json(
      { error: 'Failed to fetch lessons' },
      { status: 500 }
    )
  }
}

// POST /api/lessons - Create a new lesson
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { courseId, title, contentType, order } = body

    if (!courseId || !title || !contentType) {
      return NextResponse.json(
        { error: 'courseId, title, and contentType are required' },
        { status: 400 }
      )
    }

    const lesson = await prisma.lesson.create({
      data: {
        courseId,
        title,
        contentType,
        order: order || 1
      }
    })

    return NextResponse.json(lesson, { status: 201 })
  } catch (error) {
    console.error('Error creating lesson:', error)
    return NextResponse.json(
      { error: 'Failed to create lesson' },
      { status: 500 }
    )
  }
}

// PATCH /api/lessons - Update lesson
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { lessonId, title, contentType, order } = body

    if (!lessonId) {
      return NextResponse.json(
        { error: 'lessonId is required' },
        { status: 400 }
      )
    }

    const lesson = await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        ...(title && { title }),
        ...(contentType && { contentType }),
        ...(order !== undefined && { order })
      }
    })

    return NextResponse.json(lesson)
  } catch (error) {
    console.error('Error updating lesson:', error)
    return NextResponse.json(
      { error: 'Failed to update lesson' },
      { status: 500 }
    )
  }
}

// DELETE /api/lessons - Delete lesson
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lessonId = searchParams.get('lessonId')

    if (!lessonId) {
      return NextResponse.json(
        { error: 'lessonId is required' },
        { status: 400 }
      )
    }

    await prisma.lesson.delete({
      where: { id: lessonId }
    })

    return NextResponse.json({ message: 'Lesson deleted successfully' })
  } catch (error) {
    console.error('Error deleting lesson:', error)
    return NextResponse.json(
      { error: 'Failed to delete lesson' },
      { status: 500 }
    )
  }
}
