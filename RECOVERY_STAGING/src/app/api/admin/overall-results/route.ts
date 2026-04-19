import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { prisma } from "@/lib/prisma";

// BIZEN admin emails
const ADMIN_EMAILS = [
  "diego@bizen.mx",
  "202207895@mondragonmexico.edu.mx", // Legacy admin email
];

export async function GET() {
  try {
    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    if (!ADMIN_EMAILS.includes(user.email || "")) {
      return NextResponse.json({ error: "No autorizado - Solo administradores" }, { status: 403 });
    }

    // Get all quiz attempts grouped by user
    const quizAttempts = await prisma.quizAttempt.findMany({
      include: {
        answers: true,
      },
      orderBy: {
        userId: "asc",
      },
    });

    // Get all module completion status
    const moduleProgress = await prisma.userModuleProgress.findMany();

    // Get all section completions
    const sectionCompletions = await prisma.sectionCompletion.findMany();

    // Get unique user IDs
    const userIds = [...new Set(quizAttempts.map(a => a.userId))];
    
    // Create admin client for fetching user data
    const supabaseAdmin = createSupabaseAdmin();
    
    // Fetch user information from Supabase
    const userInfoMap = new Map();
    await Promise.all(
      userIds.map(async (userId) => {
        try {
          const { data: { user: authUser }, error } = await supabaseAdmin.auth.admin.getUserById(userId);
          if (!error && authUser) {
            userInfoMap.set(userId, {
              email: authUser.email || null,
              userName: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Usuario',
            });
          } else {
            userInfoMap.set(userId, {
              email: null,
              userName: 'Usuario',
            });
          }
        } catch (error) {
          console.error(`Error fetching user ${userId}:`, error);
          userInfoMap.set(userId, {
            email: null,
            userName: 'Usuario',
          });
        }
      })
    );

    // Group by user
    const userMap = new Map();

    quizAttempts.forEach((attempt) => {
      if (!userMap.has(attempt.userId)) {
        const userInfo = userInfoMap.get(attempt.userId) || { email: null, userName: 'Usuario' };
        userMap.set(attempt.userId, {
          userId: attempt.userId,
          email: userInfo.email || 'Usuario',
          userName: userInfo.userName,
          totalQuizzes: 0,
          totalScore: 0,
          totalQuestions: 0,
          moduleScores: {},
          completedModules: [],
        });
      }

      const userData = userMap.get(attempt.userId);
      userData.totalQuizzes++;
      userData.totalScore += attempt.score;
      userData.totalQuestions += attempt.totalQuestions;

      if (!userData.moduleScores[attempt.moduleId]) {
        userData.moduleScores[attempt.moduleId] = {
          totalScore: 0,
          totalQuestions: 0,
        };
      }
      userData.moduleScores[attempt.moduleId].totalScore += attempt.score;
      userData.moduleScores[attempt.moduleId].totalQuestions += attempt.totalQuestions;
    });

    // Add module completion status
    moduleProgress.forEach((progress) => {
      if (userMap.has(progress.userId)) {
        const userData = userMap.get(progress.userId);
        if (progress.completed) {
          userData.completedModules.push(progress.moduleId);
        }
      }
    });

    // Calculate averages and format
    const results = Array.from(userMap.values()).map((userData) => {
      const overallPercentage = userData.totalQuestions > 0
        ? Math.round((userData.totalScore / userData.totalQuestions) * 100)
        : 0;

      const moduleBreakdown = Array.from({ length: 6 }, (_, i) => {
        const moduleId = i + 1;
        const moduleData = userData.moduleScores[moduleId] || { totalScore: 0, totalQuestions: 0 };
        const modulePercentage = moduleData.totalQuestions > 0
          ? Math.round((moduleData.totalScore / moduleData.totalQuestions) * 100)
          : 0;

        return {
          moduleId,
          score: moduleData.totalScore,
          totalQuestions: moduleData.totalQuestions,
          percentage: modulePercentage,
          completed: userData.completedModules.includes(moduleId),
        };
      });

      return {
        userId: userData.userId,
        email: userData.email,
        userName: userData.userName,
        totalQuizzes: userData.totalQuizzes,
        overallScore: userData.totalScore,
        totalQuestions: userData.totalQuestions,
        overallPercentage,
        completedModules: userData.completedModules.length,
        moduleBreakdown,
      };
    });

    // Sort by overall percentage descending
    results.sort((a, b) => b.overallPercentage - a.overallPercentage);

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error("Error fetching overall results:", error);
    return NextResponse.json(
      { error: "Error al obtener resultados generales" },
      { status: 500 }
    );
  }
}
