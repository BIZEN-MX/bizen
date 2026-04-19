import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { lessonRegistry } from '@/data/lessons/registry'
import { currentUser } from '@clerk/nextjs/server'

// GET /api/lessons/[id] - Get lesson by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // In Next.js 15, params is a Promise
) {
  try {
    const { id } = await params
    console.log(`[api/lessons] Requesting ID: "${id}"`)
    const user = await currentUser()

    // --- SECURITY BRAKE: AUTHENTICATION ---
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // --- SECURITY BRAKE: PROGRESS & SEQUENCING ---
    // Get the current lesson and its order
    const currentLesson = await prisma.lesson.findUnique({
      where: { id },
      include: { course: true }
    })

    if (!currentLesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    // Role bypass: Admins and Teachers can skip anything
    const role = user.user_metadata?.role || 'student'
    const isAdmin = ['admin', 'school_admin', 'teacher'].includes(role)
    const isTopic1 = currentLesson.course?.topicId === 'tema-01'

    if (!isAdmin && currentLesson.order > 1) {
      // Allow bypass for first 3 lessons of Tema 1 (Intro)
      if (isTopic1 && currentLesson.order <= 3) {
         // Bypass sequence check
      } else {
        // Find the PREVIOUS lesson in the same course
        const previousLesson = await prisma.lesson.findFirst({
          where: {
            courseId: currentLesson.courseId,
            order: currentLesson.order - 1
          }
        })

        if (previousLesson) {
          // Check if the student has completed the previous lesson
          const progress = await prisma.progress.findUnique({
            where: {
              userId_lessonId: {
                userId: user.id,
                lessonId: previousLesson.id
              }
            }
          })

          if (!progress || !progress.completedAt) {
            return NextResponse.json({ 
              error: 'BLOQUEO DE PROGRESO: Debes completar la lección anterior antes de ver esta.',
              code: 'PREVIOUS_LESSON_REQUIRED'
            }, { status: 403 })
          }
        }
      }
    }

    // 1. Check if we have static content first (Dev-friendly / fallback)
    const staticSteps = lessonRegistry[id]
    
    // 2. Fetch steps from DB if needed
    let dbSteps = currentLesson.steps || []
    if (dbSteps.length === 0) {
       const lessonWithSteps = await prisma.lesson.findUnique({
         where: { id },
         include: { steps: true }
       })
       dbSteps = lessonWithSteps?.steps || []
    }

    // Prepare response
    const responseData = {
      ...currentLesson,
      steps: staticSteps?.length ? staticSteps : dbSteps
    }

    // Final check for steps
    if (!responseData.steps?.length) {
      console.warn(`[api/lessons] Lesson found but has no steps: ${id}`)
    }

    return NextResponse.json(responseData)
  } catch (error) {
    console.error('Error fetching lesson:', error)
    return NextResponse.json(
      { error: 'Failed to fetch lesson' },
      { status: 500 }
    )
  }
}

