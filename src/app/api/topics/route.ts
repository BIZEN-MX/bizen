import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/topics - List all topics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const schoolId = searchParams.get('schoolId')

    let topics

    if (schoolId) {
      // Filter by school's enabled topics
      topics = await prisma.topic.findMany({
        where: {
          schoolTopics: {
            some: {
              schoolId,
              isEnabled: true
            }
          }
        },
        include: {
          courses: {
            include: {
              _count: {
                select: {
                  lessons: true
                }
              }
            },
            orderBy: {
              order: 'asc'
            }
          },
          _count: {
            select: {
              courses: true,
              enrollments: true
            }
          }
        },
        orderBy: {
          id: 'asc'
        }
      })
    } else {
      // Get all topics
      topics = await prisma.topic.findMany({
        include: {
          _count: {
            select: {
              courses: true,
              enrollments: true
            }
          }
        },
        orderBy: {
          id: 'asc'
        }
      })
    }

    return NextResponse.json(topics)
  } catch (error) {
    console.error('Error fetching topics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch topics' },
      { status: 500 }
    )
  }
}

// POST /api/topics - Create a new topic
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, level, isActive } = body

    if (!title || !level) {
      return NextResponse.json(
        { error: 'Title and level are required' },
        { status: 400 }
      )
    }

    const topic = await prisma.topic.create({
      data: {
        title,
        description: description || '',
        level,
        isActive: isActive !== undefined ? isActive : true
      }
    })

    return NextResponse.json(topic, { status: 201 })
  } catch (error) {
    console.error('Error creating topic:', error)
    return NextResponse.json(
      { error: 'Failed to create topic' },
      { status: 500 }
    )
  }
}
