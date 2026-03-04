import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/quizzes/[id] - Get quiz by ID with questions
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    let quiz: any = null
    try {
      quiz = await prisma.quiz.findUnique({
        where: { id },
        include: {
          lesson: {
            include: {
              units: {
                include: {
                  course: {
                    select: {
                      id: true,
                      title: true
                    }
                  }
                }
              }
            }
          },
          questions: {
            include: {
              options: true
            },
            orderBy: {
              order: 'asc'
            }
          }
        }
      })
    } catch (dbErr: any) {
      console.warn("Soft error fetching quiz relations:", dbErr.message)
      quiz = await prisma.quiz.findUnique({ where: { id } }).catch(() => null)
    }

    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(quiz)
  } catch (error) {
    console.error('Error fetching quiz:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quiz' },
      { status: 500 }
    )
  }
}

// PATCH /api/quizzes/[id] - Update quiz
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, passScore, totalPoints } = body

    const quiz = await prisma.quiz.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(passScore !== undefined && { passScore }),
        ...(totalPoints !== undefined && { totalPoints })
      }
    })

    return NextResponse.json(quiz)
  } catch (error) {
    console.error('Error updating quiz:', error)
    return NextResponse.json(
      { error: 'Failed to update quiz' },
      { status: 500 }
    )
  }
}

// DELETE /api/quizzes/[id] - Delete quiz
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.quiz.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Quiz deleted successfully' })
  } catch (error) {
    console.error('Error deleting quiz:', error)
    return NextResponse.json(
      { error: 'Failed to delete quiz' },
      { status: 500 }
    )
  }
}

