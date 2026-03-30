import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const supabase = await createSupabaseServer();
        const { data: { user }, error: authError } = await (supabase as any).auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Fetch User Responses from TEMA-01 to TEMA-05
        // We look for step_responses related to these topics
        const lessons = await prisma.lesson.findMany({
            where: {
                course: {
                    topicId: {
                        in: ["tema-01", "tema-02", "tema-03", "tema-04", "tema-05"]
                    }
                }
            },
            select: { id: true, course: { select: { topicId: true } } }
        });

        const lessonIds = lessons.map(l => l.id);

        const progress = await prisma.progress.findMany({
            where: {
                userId: user.id,
                lessonId: { in: lessonIds }
            },
            include: { responses: true }
        });

        // Calculate Category Scores
        // Mentalidad (T1), Bases (T2), Psicología (T3), Optimización (T4), Ahorro (T5)
        const categories: Record<string, { correct: number; total: number }> = {
            "tema-01": { correct: 0, total: 0 },
            "tema-02": { correct: 0, total: 0 },
            "tema-03": { correct: 0, total: 0 },
            "tema-04": { correct: 0, total: 0 },
            "tema-05": { correct: 0, total: 0 }
        };

        progress.forEach(p => {
            const lesson = lessons.find(l => l.id === p.lessonId);
            if (lesson) {
                const topicId = lesson.course?.topicId || "";
                p.responses.forEach(r => {
                    categories[topicId].total++;
                    if (r.isCorrect) categories[topicId].correct++;
                });
            }
        });

        const scores = {
            mentalidad: Math.round(((categories["tema-01"].correct || 0.5) / (categories["tema-01"].total || 0.6)) * 100),
            bases: Math.round(((categories["tema-02"].correct || 0.5) / (categories["tema-02"].total || 0.6)) * 100),
            psicologia: Math.round(((categories["tema-03"].correct || 0.5) / (categories["tema-03"].total || 0.6)) * 100),
            optimizacion: Math.round(((categories["tema-04"].correct || 0.5) / (categories["tema-04"].total || 0.6)) * 100),
            ahorro: Math.round(((categories["tema-05"].correct || 0.5) / (categories["tema-05"].total || 0.6)) * 100)
        };

        const averageScore = Math.round((scores.mentalidad + scores.bases + scores.psicologia + scores.optimizacion + scores.ahorro) / 5);

        // Determine New Profile and Next Topic
        let newProfile = "Billy Constructor"; // Default
        let nextTopicId = "tema-06"; // Default
        let nextTopicTitle = "Presupuesto Real";

        if (averageScore >= 90) {
            newProfile = "Billy Inversionista";
            nextTopicId = "tema-09";
            nextTopicTitle = "Estrategias de Inversión";
        } else if (averageScore >= 80) {
            newProfile = "Billy Estratega";
            nextTopicId = "tema-07";
            nextTopicTitle = "Sistema de Crédito";
        } else {
            newProfile = "Billy Constructor";
            nextTopicId = "tema-06";
            nextTopicTitle = "Presupuesto Real";
        }

        // Update User Profile in DB
        await prisma.profile.update({
            where: { userId: user.id },
            data: {
                dnaProfile: newProfile,
                dnaScore: averageScore
            }
        });

        return NextResponse.json({
            success: true,
            newProfile,
            scores,
            nextTopicId,
            nextTopicTitle
        });

    } catch (error) {
        console.error("Error calculating DNA evolution:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
