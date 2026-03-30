import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateFinancialInsights } from "@/lib/ai/insights";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: topicId } = await params;
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: {
                diagnosticResults: true,
                simuladoresRuns: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                }
            }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Get completed lessons for this user
        const enrollments = await prisma.enrollment.findMany({
            where: { userId: user.id, status: "completed" },
            select: { lessonId: true }
        });
        const completedLessons = enrollments.map(e => e.lessonId);

        // Map DNA profile from diagnostic results
        const latestDiagnostic = user.diagnosticResults[0];
        let dnaProfile = "Sin Diagnosticar";
        if (latestDiagnostic) {
            // Simplified logic to pick the strongest category
            const results = latestDiagnostic.results as any;
            if (results && typeof results === 'object') {
                const categories = Object.entries(results);
                if (categories.length > 0) {
                    const top = categories.reduce((a, b) => (a[1] as number) > (b[1] as number) ? a : b);
                    dnaProfile = top[0];
                }
            }
        }

        // Get game stats from last simulator run
        const lastRun = user.simuladoresRuns[0];
        const gameStats = lastRun ? {
            totalCash: (lastRun.state as any)?.cash || 0,
            passiveIncome: (lastRun.state as any)?.passiveIncome || 0,
            escapedRatRace: (lastRun.state as any)?.escapedRatRace || false,
            mainProfession: (lastRun.state as any)?.profession?.name || "N/A"
        } : undefined;

        // Fetch topic title for context
        const topic = await prisma.topic.findUnique({
            where: { id: topicId },
            select: { title: true }
        });

        const insight = await generateFinancialInsights({
            name: user.fullName || user.id.slice(0, 8),
            xp: user.xp,
            level: user.level,
            completedLessons,
            dnaProfile,
            gameStats,
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
