import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

// GET /api/attempts - Get quiz attempts
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const quizId = searchParams.get('quizId')

    const attempts = await prisma.attempt.findMany({
      where: {
        userId: userId,
        ...(quizId && { quizId })
      },
      include: {
        quiz: {
          include: {
            lesson: {
              include: {
                course: {
                  include: {
                    topic: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        completedAt: 'desc'
      }
    })

    return NextResponse.json(attempts)
  } catch (error) {
    console.error('Error fetching attempts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch attempts' },
      { status: 500 }
    )
  }
}

// POST /api/attempts - Submit quiz attempt
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { quizId, score } = body

    if (!quizId || score === undefined) {
      return NextResponse.json(
        { error: 'quizId and score are required' },
        { status: 400 }
      )
    }

    const attempt = await prisma.attempt.create({
      data: {
        userId: userId,
        quizId,
        score
      },
      include: {
        quiz: {
          include: {
            lesson: true
          }
        }
      }
    })

    return NextResponse.json(attempt, { status: 201 })
  } catch (error) {
    console.error('Error creating attempt:', error)
    return NextResponse.json(
      { error: 'Failed to submit quiz attempt' },
      { status: 500 }
    )
  }
}
