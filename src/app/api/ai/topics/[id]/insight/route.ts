import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/api-auth";
import { prisma } from "@/lib/prisma";
import { generateFinancialInsights } from "@/lib/ai/insights";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: topicId } = await params;
        const authResult = await requireAuth(request);
        
        if (!authResult.success) {
            return authResult.response;
        }

        const supabaseUser = authResult.data.user;

        const profile = await prisma.profile.findUnique({
            where: { userId: supabaseUser.id },
            include: {
                progress: {
                    where: { completedAt: { not: null } },
                    select: { lessonId: true }
                }
            }
        });

        if (!profile) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 });
        }

        const completedLessons = profile.progress.map(p => p.lessonId);

        // Fetch topic title for context
        const topic = await prisma.topic.findUnique({
            where: { id: topicId },
            select: { title: true }
        });

        const insight = await generateFinancialInsights({
            name: profile.fullName || supabaseUser.email?.split('@')[0] || "BIZENer",
            xp: profile.xp,
            level: profile.level,
            completedLessons,
            dnaProfile: profile.dnaProfile || "Sin Diagnosticar",
            // Game stats can be fetched from a separate query if needed, 
            // but for now we skip or find last game session
            gameStats: undefined, 
            currentTopic: topic?.title || topicId
        });

        return NextResponse.json({ insight });
    } catch (error) {
        console.error("Error generating topic insight:", error);
        return NextResponse.json({ 
            insight: "¡Sigue dándole duro a este tema! BIZEN está analizando tu progreso para darte el mejor consejo." 
        });
    }
}
