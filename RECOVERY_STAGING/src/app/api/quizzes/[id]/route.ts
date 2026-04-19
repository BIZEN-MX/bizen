import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSupabaseServer } from '@/lib/supabase/server'

// GET /api/quizzes/[id] - Get quiz by ID (HIDDEN ANSWERS)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createSupabaseServer()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          include: {
            options: {
              select: {
                id: true,
                text: true,
                questionId: true
                // Note: isCorrect is EXCLUDED here to prevent cheating
              }
            }
          },
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    }

    return NextResponse.json(quiz)
  } catch (error) {
    console.error('Error fetching quiz:', error)
    return NextResponse.json({ error: 'Failed to fetch quiz' }, { status: 500 })
  }
}

// PATCH /api/quizzes/[id] - Update quiz (ADMIN ONLY)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createSupabaseServer()
    const { data: { user } } = await supabase.auth.getUser()

    // --- SECURITY BRAKE: ADMIN ONLY ---
    const role = user?.user_metadata?.role
    if (role !== 'admin' && role !== 'school_admin' && role !== 'teacher') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

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
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE /api/quizzes/[id] - Delete quiz (ADMIN ONLY)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createSupabaseServer()
    const { data: { user } } = await supabase.auth.getUser()

    const role = user?.user_metadata?.role
    if (role !== 'admin') {
      return NextResponse.json({ error: 'Only top admins can delete quizzes' }, { status: 403 })
    }

    await prisma.quiz.delete({ where: { id } })
    return NextResponse.json({ message: 'Quiz deleted' })
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}

