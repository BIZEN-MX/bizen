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

    // Get all users from the Profiles table
    const profiles = await prisma.profile.findMany();

    // Get details for each user
    const users = await Promise.all(
      profiles.map(async (profile) => {
        const userId = profile.userId;

        const [quizAttempts, progressItems] = await Promise.all([
          prisma.attempt.count({ where: { userId } }),
          prisma.progress.count({ where: { userId, percent: 100 } }),
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
          }
        } catch (error) {
          console.log(`Could not fetch email for user ${userId}:`, error);
        }

        return {
          userId,
          email: userEmail,
          diagnosticQuiz: {
            score: 0,
            totalQuestions: 0,
            studentName: profile.fullName || "Estudiante",
            completedAt: new Date().toISOString(), // Mock value since there is no diagnostic quiz
          },
          quizAttempts,
          sectionsCompleted: progressItems, // Use completed progress items (e.g. 100% lessons)
          pageVisits: 0, // Mock value as page tracking is not in DB
        };
      })
    );

    // Sort by recent first fallback
    users.sort((a, b) => {
      return (b.quizAttempts + b.sectionsCompleted) - (a.quizAttempts + a.sectionsCompleted);
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


