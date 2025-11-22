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

    // Fetch all quiz results with user information
    const quizResults = await prisma.diagnosticQuiz.findMany({
      orderBy: {
        completedAt: 'desc'
      }
    })

    // Create admin client with service role for fetching user data
    const supabaseAdmin = createSupabaseAdmin()
    
    // Fetch user emails from Supabase auth
    const resultsWithEmails = await Promise.all(
      quizResults.map(async (result) => {
        try {
          // Try to get user from auth.users using admin client
          const { data: { user: authUser }, error } = await supabaseAdmin.auth.admin.getUserById(result.userId)
          
          if (error) {
            console.error(`Error fetching user ${result.userId}:`, error)
            // Fallback: return userId as identifier
            return {
              id: result.id,
              userId: result.userId,
              email: result.userId.substring(0, 8) + '...', // Show partial ID
              userName: 'Usuario',
              score: result.score,
              totalQuestions: result.totalQuestions,
              scorePct: result.scorePct,
              completedAt: result.completedAt,
              answersData: result.answersData,
            }
          }
          
          return {
            id: result.id,
            userId: result.userId,
            email: authUser?.email || result.userId.substring(0, 8) + '...',
            userName: authUser?.user_metadata?.full_name || authUser?.email?.split('@')[0] || 'Usuario',
            score: result.score,
            totalQuestions: result.totalQuestions,
            scorePct: result.scorePct,
            completedAt: result.completedAt,
            answersData: result.answersData,
          }
        } catch (error) {
          console.error(`Error fetching user ${result.userId}:`, error)
          return {
            id: result.id,
            userId: result.userId,
            email: result.userId.substring(0, 8) + '...',
            userName: 'Usuario',
            score: result.score,
            totalQuestions: result.totalQuestions,
            scorePct: result.scorePct,
            completedAt: result.completedAt,
            answersData: result.answersData,
          }
        }
      })
    )

    return NextResponse.json({ 
      success: true,
      results: resultsWithEmails,
      total: resultsWithEmails.length
    })
  } catch (error) {
    console.error("Error fetching quiz results:", error)
    return NextResponse.json(
      { error: "Error al obtener los resultados" },
      { status: 500 }
    )
  }
}

