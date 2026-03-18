import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { lessonRegistry } from '@/data/lessons/registry'

// GET /api/lessons/[id] - Get lesson by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // In Next.js 15, params is a Promise
) {
  try {
    const { id } = await params

    // 1. Check if we have static content first (Dev-friendly / fallback)
    const staticSteps = lessonRegistry[id]
    
    // 2. Try fetching metadata from DB (title, description, etc.)
    let lesson: any = null
    try {
      lesson = await prisma.lesson.findUnique({
        where: { id },
        include: { steps: true }
      })
    } catch (dbErr) {
      console.warn(`[api/lessons] DB Fetch failed for ${id}, using static fallback if available.`, dbErr)
    }

    // 3. Fallback logic: Combine DB metadata with static steps if DB steps are missing
    if (!lesson && !staticSteps) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      )
    }

    // Prepare response
    const responseData = {
      ...(lesson || { id, title: id.split('-').join(' ').toUpperCase(), description: "Lección interactiva" }),
      steps: staticSteps?.length ? staticSteps : (lesson?.steps || [])
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

