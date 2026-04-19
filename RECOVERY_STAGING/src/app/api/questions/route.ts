import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/questions - Create question with options
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { quizId, type, prompt, order, options } = body

    if (!quizId || !type || !prompt) {
      return NextResponse.json(
        { error: 'quizId, type, and prompt are required' },
        { status: 400 }
      )
    }

    const question = await prisma.question.create({
      data: {
        quizId,
        type,
        prompt,
        order: order || 1,
        ...(options && {
          options: {
            create: options.map((opt: any) => ({
              text: opt.text,
              isCorrect: opt.isCorrect || false
            }))
          }
        })
      },
      include: {
        options: true
      }
    })

    return NextResponse.json(question, { status: 201 })
  } catch (error) {
    console.error('Error creating question:', error)
    return NextResponse.json(
      { error: 'Failed to create question' },
      { status: 500 }
    )
  }
}

// PATCH /api/questions - Update question
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { questionId, type, prompt, order } = body

    if (!questionId) {
      return NextResponse.json(
        { error: 'questionId is required' },
        { status: 400 }
      )
    }

    const question = await prisma.question.update({
      where: { id: questionId },
      data: {
        ...(type && { type }),
        ...(prompt && { prompt }),
        ...(order !== undefined && { order })
      },
      include: {
        options: true
      }
    })

    return NextResponse.json(question)
  } catch (error) {
    console.error('Error updating question:', error)
    return NextResponse.json(
      { error: 'Failed to update question' },
      { status: 500 }
    )
  }
}

// DELETE /api/questions - Delete question
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const questionId = searchParams.get('questionId')

    if (!questionId) {
      return NextResponse.json(
        { error: 'questionId is required' },
        { status: 400 }
      )
    }

    await prisma.question.delete({
      where: { id: questionId }
    })

    return NextResponse.json({ message: 'Question deleted successfully' })
  } catch (error) {
    console.error('Error deleting question:', error)
    return NextResponse.json(
      { error: 'Failed to delete question' },
      { status: 500 }
    )
  }
}

