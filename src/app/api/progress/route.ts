import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSupabaseServerMicrocred } from '@/lib/supabase/server-microcred'
import { cookies } from 'next/headers'
import { awardXp } from '@/lib/rewards'
import { createSupabaseServer } from '@/lib/supabase/server'

// GET /api/progress - Get user's progress (optionally by lessonId or courseId)
export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = await createSupabaseServer()

    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const lessonId = searchParams.get('lessonId')
    const courseId = searchParams.get('courseId')

    let progressData

    if (lessonId) {
      // Get specific lesson progress
      progressData = await prisma.progress.findUnique({
        where: {
          userId_lessonId: {
            userId: user.id,
            lessonId
          }
        },
        include: {
          lesson: {
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
    } else if (courseId) {
      // Get all progress for a course
      progressData = await prisma.progress.findMany({
        where: {
          userId: user.id,
          lesson: {
            unit: {
              courseId
            }
          }
        },
        include: {
          lesson: {
            include: {
              unit: true
            }
          }
        }
      })
    } else {
      // Get all progress for user
      progressData = await prisma.progress.findMany({
        where: {
          userId: user.id
        },
        include: {
          lesson: {
            include: {
              unit: {
                include: {
                  course: true
                }
              }
            }
          }
        },
        orderBy: {
          updatedAt: 'desc'
        }
      })
    }

    return NextResponse.json(progressData)
  } catch (error) {
    console.error('Error fetching progress:', error)
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    )
  }
}

// POST /api/progress - Upsert lesson progress
export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = await createSupabaseServer()

    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { lessonId, percent, completedAt } = body

    if (!lessonId || percent === undefined) {
      return NextResponse.json(
        { error: 'lessonId and percent are required' },
        { status: 400 }
      )
    }

    const progress = await prisma.progress.upsert({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId
        }
      },
      update: {
        percent,
        ...(completedAt && { completedAt: new Date(completedAt) })
      },
      create: {
        userId: user.id,
        lessonId,
        percent,
        ...(completedAt && { completedAt: new Date(completedAt) })
      },
      include: {
        lesson: {
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

    // Award XP if completed (100%) and newly created or updated to 100% just now
    let rewards = null
    if (percent === 100 && completedAt) {
      rewards = await awardXp(user.id, 50) // 50 XP per completed lesson
    }

    return NextResponse.json({ ...progress, rewards })
  } catch (error) {
    console.error('Error upserting progress:', error)
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    )
  }
}
