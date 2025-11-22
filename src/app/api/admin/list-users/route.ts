import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { prisma } from "@/lib/prisma";

// BIZEN admin emails
const ADMIN_EMAILS = ["diego@bizen.mx", "202207895@mondragonmexico.edu.mx"];

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // Check if user is admin
    if (!user.email || !ADMIN_EMAILS.includes(user.email)) {
      return NextResponse.json({ error: "No autorizado - solo admins" }, { status: 403 });
    }

    // Get all unique userIds from various tables
    const quizUsers = await prisma.quizAttempt.findMany({
      select: { userId: true },
      distinct: ['userId']
    });

    const diagnosticUsers = await prisma.diagnosticQuiz.findMany({
      select: { userId: true }
    });

    const progressUsers = await prisma.sectionCompletion.findMany({
      select: { userId: true },
      distinct: ['userId']
    });

    // Combine and deduplicate
    const allUserIds = new Set([
      ...quizUsers.map(u => u.userId),
      ...diagnosticUsers.map(u => u.userId),
      ...progressUsers.map(u => u.userId),
    ]);

    // Get details for each user
    const users = await Promise.all(
      Array.from(allUserIds).map(async (userId) => {
        const [diagnostic, quizAttempts, sections, visits] = await Promise.all([
          prisma.diagnosticQuiz.findUnique({ where: { userId } }),
          prisma.quizAttempt.count({ where: { userId } }),
          prisma.sectionCompletion.count({ where: { userId, isComplete: true } }),
          prisma.pageVisit.count({ where: { userId } }),
        ]);

        // Try to get user email from Supabase as fallback
        let userEmail: string | undefined;
        try {
          const supabaseAdmin = createSupabaseAdmin();
          const { data: { user: supabaseUser }, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);
          if (userError) {
            console.log(`Error fetching user ${userId}:`, userError.message);
          } else {
            userEmail = supabaseUser?.email;
            console.log(`Fetched email for user ${userId}:`, userEmail);
          }
        } catch (error) {
          console.log(`Could not fetch email for user ${userId}:`, error);
        }

        return {
          userId,
          email: userEmail,
          diagnosticQuiz: diagnostic ? {
            score: diagnostic.score,
            totalQuestions: diagnostic.totalQuestions,
            studentName: diagnostic.studentName,
            completedAt: diagnostic.completedAt.toISOString(),
          } : undefined,
          quizAttempts,
          sectionsCompleted: sections,
          pageVisits: visits,
        };
      })
    );

    // Sort by diagnostic quiz completion date (most recent first)
    users.sort((a, b) => {
      if (!a.diagnosticQuiz) return 1;
      if (!b.diagnosticQuiz) return -1;
      return new Date(b.diagnosticQuiz.completedAt).getTime() - new Date(a.diagnosticQuiz.completedAt).getTime();
    });

    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    console.error("Error listing users:", error);
    return NextResponse.json(
      { error: "Error al listar usuarios", details: error.message },
      { status: 500 }
    );
  }
}


