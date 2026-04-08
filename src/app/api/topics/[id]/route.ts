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
      // 1. Try finding by the provided ID
      topic = await prisma.topic.findUnique({
        where: { id },
        include: {
          courses: {
            include: {
              lessons: {
                orderBy: { order: 'asc' }
              }
            },
            orderBy: { order: 'asc' }
          },
          _count: {
            select: { enrollments: true }
          }
        }
      });

      // 2. Fallback for numeric IDs (Legacy support: '1' -> 'tema-01')
      if (!topic && !id.includes('tema-') && !isNaN(parseInt(id))) {
        const legacyId = `tema-${id.padStart(2, '0')}`;
        topic = await prisma.topic.findUnique({
          where: { id: legacyId },
          include: {
            courses: {
              include: {
                lessons: {
                  orderBy: { order: 'asc' }
                }
              },
              orderBy: { order: 'asc' }
            },
            _count: {
              select: { enrollments: true }
            }
          }
        });
      }

      // 3. Fallback for lesson slugs appearing in /courses/[id] URLs
      if (!topic) {
        const lesson = await prisma.lesson.findUnique({
          where: { id },
          include: { course: true }
        });

        if (lesson?.course?.topicId) {
          topic = await prisma.topic.findUnique({
            where: { id: lesson.course.topicId },
            include: {
              courses: {
                include: {
                  lessons: {
                    orderBy: { order: 'asc' }
                  }
                },
                orderBy: { order: 'asc' }
              },
              _count: {
                select: { enrollments: true }
              }
            }
          });
        }
      }
    } catch (dbErr: any) {
      console.error("Critical error fetching topic with relations:", dbErr.message);
      return NextResponse.json(
        { error: 'Error de base de datos al obtener el tema y sus lecciones.' },
        { status: 500 }
      );
    }

    if (!topic) {
      return NextResponse.json(
        { error: `Topic with ID '${id}' not found in database.` },
        { status: 404 }
      );
    }

    return NextResponse.json(topic);
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
