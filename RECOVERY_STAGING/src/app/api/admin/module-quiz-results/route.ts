import { NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"
import { createSupabaseAdmin } from "@/lib/supabase/admin"
import { prisma } from "@/lib/prisma"

// BIZEN admin emails - only these users can access the dashboard
const ADMIN_EMAILS = [
  "diego@bizen.mx",
  "202207895@mondragonmexico.edu.mx", // Legacy admin email
  // Add more admin emails here if needed
]

export async function GET() {
  try {
    const supabase = await createSupabaseServer()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    // Check if user is admin
    if (!ADMIN_EMAILS.includes(user.email || "")) {
      return NextResponse.json({ error: "No autorizado - Solo administradores" }, { status: 403 })
    }

    // Fetch all quiz attempts with their answers
    const quizAttempts = await prisma.quizAttempt.findMany({
      include: {
        answers: true
      },
      orderBy: {
        completedAt: 'desc'
      }
    })

    // Create admin client for fetching user data
    const supabaseAdmin = createSupabaseAdmin()
    
    // Fetch user information from Supabase
    const resultsWithUserInfo = await Promise.all(
      quizAttempts.map(async (attempt) => {
        try {
          // Try to get user from auth.users using admin client
          const { data: { user: authUser }, error } = await supabaseAdmin.auth.admin.getUserById(attempt.userId)
          
          if (error) {
            console.error(`Error fetching user ${attempt.userId}:`, error)
            // Fallback: return userId as identifier
            return {
              id: attempt.id,
              userId: attempt.userId,
              email: attempt.userId.substring(0, 8) + '...',
              userName: 'Usuario',
              moduleId: attempt.moduleId,
              sectionId: attempt.sectionId,
              pageNumber: attempt.pageNumber,
              quizType: attempt.quizType,
              score: attempt.score,
              totalQuestions: attempt.totalQuestions,
              scorePct: Math.round((attempt.score / attempt.totalQuestions) * 100),
              completedAt: attempt.completedAt,
              answers: attempt.answers
            }
          }
          
          return {
            id: attempt.id,
            userId: attempt.userId,
            email: authUser?.email || attempt.userId.substring(0, 8) + '...',
            userName: authUser?.user_metadata?.full_name || authUser?.email?.split('@')[0] || 'Usuario',
            moduleId: attempt.moduleId,
            sectionId: attempt.sectionId,
            pageNumber: attempt.pageNumber,
            quizType: attempt.quizType,
            score: attempt.score,
            totalQuestions: attempt.totalQuestions,
            scorePct: Math.round((attempt.score / attempt.totalQuestions) * 100),
            completedAt: attempt.completedAt,
            answers: attempt.answers
          }
        } catch (error) {
          console.error(`Error fetching user ${attempt.userId}:`, error)
          return {
            id: attempt.id,
            userId: attempt.userId,
            email: attempt.userId.substring(0, 8) + '...',
            userName: 'Usuario',
            moduleId: attempt.moduleId,
            sectionId: attempt.sectionId,
            pageNumber: attempt.pageNumber,
            quizType: attempt.quizType,
            score: attempt.score,
            totalQuestions: attempt.totalQuestions,
            scorePct: Math.round((attempt.score / attempt.totalQuestions) * 100),
            completedAt: attempt.completedAt,
            answers: attempt.answers
          }
        }
      })
    )

    return NextResponse.json({ 
      success: true,
      results: resultsWithUserInfo,
      total: resultsWithUserInfo.length
    })
  } catch (error) {
    console.error("Error fetching quiz results:", error)
    return NextResponse.json(
      { error: "Error al obtener los resultados" },
      { status: 500 }
    )
  }
}

