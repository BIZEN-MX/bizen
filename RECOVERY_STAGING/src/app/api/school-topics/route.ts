import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/school-topics - Enable a topic for a school
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { schoolId, topicId, isEnabled } = body

    if (!schoolId || !topicId) {
      return NextResponse.json(
        { error: 'schoolId and topicId are required' },
        { status: 400 }
      )
    }

    const schoolTopic = await prisma.schoolTopic.upsert({
      where: {
        schoolId_topicId: {
          schoolId,
          topicId
        }
      },
      update: {
        isEnabled: isEnabled !== undefined ? isEnabled : true
      },
      create: {
        schoolId,
        topicId,
        isEnabled: isEnabled !== undefined ? isEnabled : true
      },
      include: {
        school: {
          select: {
            id: true,
            name: true
          }
        },
        topic: {
          select: {
            id: true,
            title: true
          }
        }
      }
    })

    return NextResponse.json(schoolTopic)
  } catch (error) {
    console.error('Error toggling school topic:', error)
    return NextResponse.json(
      { error: 'Failed to toggle school topic' },
      { status: 500 }
    )
  }
}

// DELETE /api/school-topics - Disable a topic for a school
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const schoolId = searchParams.get('schoolId')
    const topicId = searchParams.get('topicId')

    if (!schoolId || !topicId) {
      return NextResponse.json(
        { error: 'schoolId and topicId are required' },
        { status: 400 }
      )
    }

    await prisma.schoolTopic.delete({
      where: {
        schoolId_topicId: {
          schoolId,
          topicId
        }
      }
    })

    return NextResponse.json({ message: 'Topic disabled for school' })
  } catch (error) {
    console.error('Error deleting school topic:', error)
    return NextResponse.json(
      { error: 'Failed to delete school topic' },
      { status: 500 }
    )
  }
}
