import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const courses = await prisma.course.findMany({
      include: {
        _count: { select: { lessons: true } },
        topic: true
      }
    })

    const summary = courses.map(c => ({
      topic: c.topicId,
      course: c.title,
      lessonsCount: c._count.lessons
    }))

    // Check for a specific lesson
    const specific = await prisma.lesson.findUnique({
      where: { id: 'intro-finanzas-empresariales' }
    })

    return NextResponse.json({ summary, specific: !!specific })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
