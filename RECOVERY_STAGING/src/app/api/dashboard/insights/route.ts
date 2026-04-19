import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/api-auth";
import { prisma } from "@/lib/prisma";
import { generateFinancialInsights } from "@/lib/ai/insights";

export async function GET(request: NextRequest) {
    try {
        const authResult = await requireAuth(request);

        if (!authResult.success || !authResult.data?.user) {
            return authResult.response || NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { user } = authResult.data;
        const topic = request.nextUrl.searchParams.get("topic");

        // Fetch profile and last game session from Prisma
        const [profile, lastPlayer] = await Promise.all([
            prisma.profile.findUnique({
                where: { userId: user.id },
                include: { 
                    progress: { select: { lessonId: true } }
                }
            }),
            prisma.player.findFirst({
                where: { userId: user.id },
                include: { profession: true },
                orderBy: { createdAt: 'desc' }
            })
        ]);

        if (!profile) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 });
        }


        const insight = await generateFinancialInsights({
            name: profile.fullName.split(' ')[0],
            xp: profile.xp || 0,
            level: profile.level || 1,
            completedLessons: profile.progress.map(p => p.lessonId),
            adnProfile: (profile as any).dnaProfile || "Sin Diagnosticar",
            currentTopic: topic || undefined,
            gameStats: lastPlayer ? {
                totalCash: lastPlayer.cashOnHand,
                passiveIncome: lastPlayer.passiveIncome,
                escapedRatRace: lastPlayer.hasEscapedRatRace,
                mainProfession: lastPlayer.profession?.name
            } : undefined
        });

        return NextResponse.json({ insight });
    } catch (error) {
        console.error("Error generating dashboard insights:", error);
        return NextResponse.json({
            insight: "¡Sigue aprendiendo! BIZEN está analizando tu progreso para darte los mejores consejos."
        });
    }
}
