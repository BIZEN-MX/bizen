import { NextResponse } from 'next/server';
import { createSupabaseServer } from "@/lib/supabase/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const supabase = await createSupabaseServer();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: 'No autorizado' 
      }, { status: 401 });
    }

    // Fetch final test results from Prisma (Module 6 quizzes)
    const results = await prisma.quizAttempt.findMany({
      where: {
        moduleId: 6, // Only module 6 (final test)
      },
      include: {
        answers: true
      },
      orderBy: {
        completedAt: 'desc'
      }
    });

    // Create admin client for fetching user data
    const supabaseAdmin = createSupabaseAdmin();
    
    // Fetch user information from Supabase and add it to results
    const resultsWithUserInfo = await Promise.all(
      results.map(async (result) => {
        try {
          // Try to get user from auth.users using admin client
          const { data: { user: authUser }, error } = await supabaseAdmin.auth.admin.getUserById(result.userId)
          
          if (error || !authUser) {
            console.error(`Error fetching user ${result.userId}:`, error)
            // Fallback: return with minimal data
            return {
              id: String(result.id),
              user_id: result.userId,
              score: result.score,
              total_questions: result.totalQuestions,
              score_percentage: Math.round((result.score / result.totalQuestions) * 100),
              answers: result.answers,
              student_name: null,
              evaluator_notes: null,
              completed_at: result.completedAt.toISOString(),
              user_email: null,
              user_name: null
            }
          }
          
          return {
            id: String(result.id),
            user_id: result.userId,
            score: result.score,
            total_questions: result.totalQuestions,
            score_percentage: Math.round((result.score / result.totalQuestions) * 100),
            answers: result.answers,
            student_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || null,
            evaluator_notes: null,
            completed_at: result.completedAt.toISOString(),
            user_email: authUser.email || null,
            user_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || null
          }
        } catch (error) {
          console.error(`Error fetching user ${result.userId}:`, error)
          return {
            id: String(result.id),
            user_id: result.userId,
            score: result.score,
            total_questions: result.totalQuestions,
            score_percentage: Math.round((result.score / result.totalQuestions) * 100),
            answers: result.answers,
            student_name: null,
            evaluator_notes: null,
            completed_at: result.completedAt.toISOString(),
            user_email: null,
            user_name: null
          }
        }
      })
    );

    return NextResponse.json({
      success: true,
      results: resultsWithUserInfo
    });

  } catch (error) {
    console.error('Unexpected error in GET /api/admin/final-test-results:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Error interno del servidor' 
    }, { status: 500 });
  }
}
