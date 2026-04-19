import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/quizzes - List quizzes (optionally by lessonId)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lessonId = searchParams.get('lessonId')

    const quizzes = await prisma.quiz.findMany({
      where: lessonId ? { lessonId } : undefined,
      include: {
        lesson: {
          select: {
            id: true,
            title: true
          }
        },
        questions: {
          include: {
            options: true
          },
          orderBy: {
            order: 'asc'
          }
        },
        _count: {
          select: {
            attempts: true
          }
        }
      }
    })

    return NextResponse.json(quizzes)
  } catch (error) {
    console.error('Error fetching quizzes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quizzes' },
      { status: 500 }
    )
  }
}

// POST /api/quizzes - Create a new quiz
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { lessonId, title, passScore, totalPoints } = body

    if (!lessonId || !title) {
      return NextResponse.json(
        { error: 'lessonId and title are required' },
        { status: 400 }
      )
    }

    const quiz = await prisma.quiz.create({
      data: {
        lessonId,
        title,
        passScore: passScore || 70,
        totalPoints: totalPoints || 100
      }
    })

    return NextResponse.json(quiz, { status: 201 })
  } catch (error) {
    console.error('Error creating quiz:', error)
    return NextResponse.json(
      { error: 'Failed to create quiz' },
      { status: 500 }
    )
  }
}

