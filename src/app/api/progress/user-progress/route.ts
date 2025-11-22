import { NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const supabase = await createSupabaseServer()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("Auth error:", authError)
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Get all section completions for this user across all modules
    let sectionCompletions: any[] = []
    try {
      sectionCompletions = await prisma.sectionCompletion.findMany({
        where: {
          userId: user.id,
        },
        orderBy: [
          { moduleId: 'asc' },
          { sectionId: 'asc' }
        ]
      })
    } catch (error) {
      console.error("Error fetching section completions:", error)
      // Continue with empty array if model doesn't exist
    }

    // Get all quiz attempts for this user
    let quizAttemptsRaw: any[] = []
    try {
      quizAttemptsRaw = await prisma.quizAttempt.findMany({
        where: {
          userId: user.id,
        },
        orderBy: [
          { moduleId: 'asc' },
          { sectionId: 'asc' },
          { pageNumber: 'asc' }
        ]
      })
    } catch (error) {
      console.error("Error fetching quiz attempts:", error)
      // Continue with empty array if model doesn't exist
    }

    // Add passed property to quiz attempts (70% threshold) and serialize dates
    const quizAttempts = quizAttemptsRaw.map(attempt => ({
      id: attempt.id,
      userId: attempt.userId,
      moduleId: attempt.moduleId,
      sectionId: attempt.sectionId,
      pageNumber: attempt.pageNumber,
      quizType: attempt.quizType,
      score: attempt.score,
      totalQuestions: attempt.totalQuestions,
      completedAt: attempt.completedAt ? new Date(attempt.completedAt).toISOString() : null,
      createdAt: attempt.createdAt ? new Date(attempt.createdAt).toISOString() : null,
      passed: attempt.totalQuestions > 0 && (attempt.score / attempt.totalQuestions) >= 0.7
    }))

    // Serialize section completions
    const serializedSectionCompletions = sectionCompletions.map(sc => ({
      id: sc.id,
      userId: sc.userId,
      moduleId: sc.moduleId,
      sectionId: sc.sectionId,
      pagesVisited: sc.pagesVisited || 0,
      totalPages: sc.totalPages || 0,
      quizzesCompleted: sc.quizzesCompleted || 0,
      quizzesTotal: sc.quizzesTotal || 0,
      isComplete: sc.isComplete || false,
      completedAt: sc.completedAt ? new Date(sc.completedAt).toISOString() : null,
      createdAt: sc.createdAt ? new Date(sc.createdAt).toISOString() : null,
    }))

    // Calculate overall progress
    // Count completed sections
    const completedSections = serializedSectionCompletions.filter(sc => sc.isComplete).length
    const totalSections = serializedSectionCompletions.length

    // Calculate overall progress percentage
    // Progress is based on:
    // 1. Pages visited vs total pages (50% weight)
    // 2. Quizzes completed vs total quizzes (50% weight)
    let totalPagesVisited = 0
    let totalPages = 0
    let totalQuizzesCompleted = 0
    let totalQuizzes = 0

    serializedSectionCompletions.forEach(sc => {
      totalPagesVisited += sc.pagesVisited
      totalPages += sc.totalPages
      totalQuizzesCompleted += sc.quizzesCompleted
      totalQuizzes += sc.quizzesTotal
    })

    const pagesProgress = totalPages > 0 ? (totalPagesVisited / totalPages) * 50 : 0
    const quizzesProgress = totalQuizzes > 0 ? (totalQuizzesCompleted / totalQuizzes) * 50 : 0
    const overallProgress = Math.round(pagesProgress + quizzesProgress)

    return NextResponse.json({
      success: true,
      sectionCompletions: serializedSectionCompletions,
      quizAttempts,
      overallProgress,
      completedSections,
      totalSections,
    })
  } catch (error) {
    console.error("Error fetching user progress:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error("Error details:", errorMessage, error)
    return NextResponse.json(
      { error: "Failed to fetch progress", details: errorMessage },
      { status: 500 }
    )
  }
}

