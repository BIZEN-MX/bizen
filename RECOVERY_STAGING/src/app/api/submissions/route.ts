import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSupabaseServerMicrocred } from '@/lib/supabase/server-microcred'
import { cookies } from 'next/headers'

// POST /api/submissions - Submit assignment
export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { assignmentId, url } = body

    if (!assignmentId || !url) {
      return NextResponse.json(
        { error: 'assignmentId and url are required' },
        { status: 400 }
      )
    }

    const submission = await prisma.submission.create({
      data: {
        assignmentId,
        userId: user.id,
        url,
        status: 'submitted'
      },
      include: {
        assignment: {
          include: {
            unit: {
              include: {
                course: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json(submission, { status: 201 })
  } catch (error) {
    console.error('Error submitting assignment:', error)
    return NextResponse.json(
      { error: 'Failed to submit assignment' },
      { status: 500 }
    )
  }
}

// PATCH /api/submissions - Grade submission (teachers only)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { submissionId, score, status } = body

    if (!submissionId) {
      return NextResponse.json(
        { error: 'submissionId is required' },
        { status: 400 }
      )
    }

    const submission = await prisma.submission.update({
      where: { id: submissionId },
      data: {
        ...(score !== undefined && { score }),
        ...(status && { status })
      },
      include: {
        assignment: true,
        user: {
          select: {
            fullName: true
          }
        }
      }
    })

    return NextResponse.json(submission)
  } catch (error) {
    console.error('Error grading submission:', error)
    return NextResponse.json(
      { error: 'Failed to grade submission' },
      { status: 500 }
    )
  }
}

