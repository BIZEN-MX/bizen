import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/topics/[id] - Get topic by ID with full details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    let topic: any = null
    try {
      topic = await prisma.topic.findUnique({
        where: { id },
        include: {
          courses: {
            include: {
              lessons: {
                include: {
                  quizzes: true
                },
                orderBy: {
                  order: 'asc'
                }
              }
            },
            orderBy: {
              order: 'asc'
            }
          },
          _count: {
            select: {
              enrollments: true
            }
          }
        }
      })
    } catch (dbErr: any) {
      console.warn("Soft error fetching topic relations:", dbErr.message)
      topic = await prisma.topic.findUnique({ where: { id } }).catch(() => null)
    }

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(topic)
  } catch (error) {
    console.error('Error fetching topic:', error)
    return NextResponse.json(
      { error: 'Failed to fetch topic' },
      { status: 500 }
    )
  }
}

// PATCH /api/topics/[id] - Update topic
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, description, level, isActive } = body

    const topic = await prisma.topic.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(level && { level }),
        ...(isActive !== undefined && { isActive })
      }
    })

    return NextResponse.json(topic)
  } catch (error) {
    console.error('Error updating topic:', error)
    return NextResponse.json(
      { error: 'Failed to update topic' },
      { status: 500 }
    )
  }
}

// DELETE /api/topics/[id] - Delete topic
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.topic.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Topic deleted successfully' })
  } catch (error) {
    console.error('Error deleting topic:', error)
    return NextResponse.json(
      { error: 'Failed to delete topic' },
      { status: 500 }
    )
  }
}
