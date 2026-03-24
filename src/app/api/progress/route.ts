import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSupabaseServerMicrocred } from '@/lib/supabase/server-microcred'
import { cookies } from 'next/headers'
import { awardXp } from '@/lib/rewards'
import { createSupabaseServer } from '@/lib/supabase/server'
import { checkAndAwardAchievements } from '@/lib/achievements'

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
              section: {
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
            section: {
              courseId
            }
          }
        },
        include: {
          lesson: {
            include: {
              section: true
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
              section: {
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

    const existingProgress = await prisma.progress.findUnique({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId
        }
      }
    })

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
            section: {
              include: {
                course: true
              }
            }
          }
        }
      }
    })

    // Award XP only if newly completed to 100% (prevent infinite XP exploit)
    let rewards = null
    let newAchievements: string[] = []
    
    const isNewlyCompleted = percent === 100 && (!existingProgress || existingProgress.percent < 100)
    
    if (isNewlyCompleted && completedAt) {
      rewards = await awardXp(user.id, 50) // 50 XP per completed lesson

      // -- achievement check --
      try {
        const profile = await prisma.profile.findUnique({
          where: { userId: user.id },
          select: { currentStreak: true, level: true, bizcoins: true, postsCreated: true }
        })
        const lessonCount = await prisma.progress.count({
          where: { userId: user.id, percent: 100 }
        })
        newAchievements = await checkAndAwardAchievements(user.id, {
          lessonsCompleted: lessonCount,
          currentStreak:    profile?.currentStreak ?? 0,
          level:            profile?.level         ?? 1,
          bizcoins:         profile?.bizcoins      ?? 0,
          postsCreated:     profile?.postsCreated  ?? 0,
        })
      } catch {/* silent */}
    }

    return NextResponse.json({ ...progress, rewards, newAchievements })
  } catch (error) {
    console.error('Error upserting progress:', error)
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    )
  }
}
