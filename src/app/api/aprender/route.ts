import { NextRequest, NextResponse } from "next/server"
export const dynamic = 'force-dynamic'
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth/api-auth"

/**
 * GET /api/aprender
 * Returns all active topics with their courses and lessons,
 * annotated with the user's real completion status.
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (!authResult.success) return authResult.response
    const { user } = authResult.data

    // 1. Fetch all active topics with ordered courses and lessons
    const topics = await prisma.topic.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
      include: {
        courses: {
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              orderBy: { order: 'asc' },
              select: { id: true, title: true, order: true, xpReward: true }
            }
          }
        }
      }
    })

    // 2. Fetch all completed lesson IDs for this user (100% progress)
    const completedProgress = await prisma.progress.findMany({
      where: { userId: user.id, percent: 100 },
      select: { lessonId: true }
    })
    const completedLessonIds = new Set(completedProgress.map((p: { lessonId: string }) => p.lessonId))

    // 3. Annotate each topic with lesson statuses
    const annotatedTopics = topics.map((topic: typeof topics[0]) => {
      // Flatten all lessons across all courses in this topic
      const allLessons = topic.courses.flatMap((course: typeof topic.courses[0]) => course.lessons)
      
      const totalLessons = allLessons.length
      const completedCount = allLessons.filter((l: typeof allLessons[0]) => completedLessonIds.has(l.id)).length
      const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

      // Determine which lesson is CURRENT (first non-completed one)
      let foundCurrent = false
      const annotatedLessons = allLessons.map((lesson: typeof allLessons[0], idx: number) => {
        const isCompleted = completedLessonIds.has(lesson.id)
        let status: 'COMPLETED' | 'CURRENT' | 'LOCKED' = 'LOCKED'

        if (isCompleted) {
          status = 'COMPLETED'
        } else if (!foundCurrent) {
          // First non-completed lesson becomes CURRENT
          status = 'CURRENT'
          foundCurrent = true
        }

        // Last lesson of topic = BOSS
        const isBoss = idx === allLessons.length - 1
        // Every 5 lessons, add a CHEST before the boss
        const isChest = !isBoss && (idx + 1) % 5 === 0

        return {
          id: lesson.id,
          title: lesson.title,
          status,
          type: isBoss ? 'BOSS' : isChest ? 'CHEST' : 'LESSON',
          xpReward: lesson.xpReward,
          order: idx
        }
      })

      // If all lessons are completed, add a CHEST node as grand reward
      const isTopicCompleted = completedCount === totalLessons && totalLessons > 0

      return {
        id: topic.id,
        title: topic.title,
        description: topic.description,
        level: topic.level,
        icon: topic.icon,
        bannerUrl: topic.bannerUrl,
        displayOrder: topic.displayOrder,
        progressPercent,
        completedCount,
        totalLessons,
        isCompleted: isTopicCompleted,
        // Topic is locked if previous topic isn't done (first topic always unlocked)
        lessons: annotatedLessons
      }
    })

    // 4. Apply topic-level locking: each topic unlocks only after the previous is done
    for (let i = 1; i < annotatedTopics.length; i++) {
      const previous = annotatedTopics[i - 1]
      if (!previous.isCompleted) {
        // Lock all lessons in this topic
        annotatedTopics[i].lessons = annotatedTopics[i].lessons.map((l: typeof annotatedTopics[0]['lessons'][0]) => ({
          ...l,
          status: 'LOCKED' as const
        }))
      }
    }

    return NextResponse.json({ success: true, topics: annotatedTopics })

  } catch (error: any) {
    console.error("[aprender-api] Error:", error.message || error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
