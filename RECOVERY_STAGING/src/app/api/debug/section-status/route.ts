// Debug API to check section completion status
import { NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const supabase = await createSupabaseServer()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Get URL params
    const url = new URL(request.url)
    const moduleId = parseInt(url.searchParams.get('moduleId') || '1')

    // Get all section completions for this user and module
    const completions = await prisma.sectionCompletion.findMany({
      where: {
        userId: user.id,
        moduleId: moduleId,
      },
      orderBy: {
        sectionId: 'asc'
      }
    })

    // Get module progress
    const moduleProgress = await prisma.userModuleProgress.findUnique({
      where: {
        userId_moduleId: {
          userId: user.id,
          moduleId: moduleId,
        },
      },
    })

    // Get quiz attempts
    const quizzes = await prisma.quizAttempt.findMany({
      where: {
        userId: user.id,
        moduleId: moduleId,
      },
      orderBy: [
        { sectionId: 'asc' },
        { pageNumber: 'asc' }
      ]
    })

    return NextResponse.json({
      success: true,
      userId: user.id,
      moduleId,
      sectionCompletions: completions,
      moduleProgress,
      quizAttempts: quizzes,
    })
  } catch (error) {
    console.error("Debug API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch debug info" },
      { status: 500 }
    )
  }
}

// Force complete a section for debugging
export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServer()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const body = await request.json()
    const { moduleId, sectionId } = body

    // Force complete the section
    await prisma.sectionCompletion.upsert({
      where: {
        userId_moduleId_sectionId: {
          userId: user.id,
          moduleId: parseInt(moduleId),
          sectionId: parseInt(sectionId),
        },
      },
      update: {
        isComplete: true,
        completedAt: new Date(),
      },
      create: {
        userId: user.id,
        moduleId: parseInt(moduleId),
        sectionId: parseInt(sectionId),
        totalPages: 10,
        pagesVisited: 10,
        quizzesTotal: 2,
        quizzesCompleted: 2,
        isComplete: true,
        completedAt: new Date(),
      },
    })

    // Unlock next section
    const nextSection = parseInt(sectionId) + 1
    await prisma.userModuleProgress.upsert({
      where: {
        userId_moduleId: {
          userId: user.id,
          moduleId: parseInt(moduleId),
        },
      },
      update: {
        unlockedSection: Math.max(nextSection, 1),
        updatedAt: new Date(),
      },
      create: {
        userId: user.id,
        moduleId: parseInt(moduleId),
        unlockedSection: Math.max(nextSection, 1),
      },
    })

    return NextResponse.json({
      success: true,
      message: `Forced completion of M${moduleId}S${sectionId}`,
    })
  } catch (error) {
    console.error("Force complete error:", error)
    return NextResponse.json(
      { error: "Failed to force complete" },
      { status: 500 }
    )
  }
}


