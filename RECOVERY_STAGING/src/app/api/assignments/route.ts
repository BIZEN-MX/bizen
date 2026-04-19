import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSupabaseServerMicrocred } from '@/lib/supabase/server-microcred'
import { cookies } from 'next/headers'

// GET /api/assignments - Get assignments (for students: their assignments; for teachers: all)
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const unitId = searchParams.get('unitId')
    const courseId = searchParams.get('courseId')

    // Get user's profile to check role
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id }
    })

    let assignments

    if (profile?.role === 'student') {
      // Students see assignments from their enrolled courses
      const enrollments = await prisma.enrollment.findMany({
        where: { userId: user.id },
        select: { courseId: true }
      })

      const enrolledCourseIds = enrollments.map(e => e.courseId)

      assignments = await prisma.assignment.findMany({
        where: {
          unit: {
            courseId: courseId 
              ? courseId 
              : { in: enrolledCourseIds }
          },
          ...(unitId && { unitId })
        },
        include: {
          unit: {
            include: {
              course: {
                select: {
                  id: true,
                  title: true
                }
              }
            }
          },
          submissions: {
            where: {
              userId: user.id
            }
          }
        },
        orderBy: {
          dueAt: 'asc'
        }
      })
    } else {
      // Teachers see all assignments
      assignments = await prisma.assignment.findMany({
        where: {
          ...(unitId && { unitId }),
          ...(courseId && { unit: { courseId } })
        },
        include: {
          unit: {
            include: {
              course: true
            }
          },
          _count: {
            select: {
              submissions: true
            }
          }
        },
        orderBy: {
          dueAt: 'asc'
        }
      })
    }

    return NextResponse.json(assignments)
  } catch (error) {
    console.error('Error fetching assignments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch assignments' },
      { status: 500 }
    )
  }
}

// POST /api/assignments - Create assignment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { unitId, title, type, dueAt, points } = body

    if (!unitId || !title || !type) {
      return NextResponse.json(
        { error: 'unitId, title, and type are required' },
        { status: 400 }
      )
    }

    const assignment = await prisma.assignment.create({
      data: {
        unitId,
        title,
        type,
        dueAt: dueAt ? new Date(dueAt) : null,
        points: points || 100
      }
    })

    return NextResponse.json(assignment, { status: 201 })
  } catch (error) {
    console.error('Error creating assignment:', error)
    return NextResponse.json(
      { error: 'Failed to create assignment' },
      { status: 500 }
    )
  }
}

