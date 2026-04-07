import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { generateFinancialInsights } from "@/lib/ai/insights";

export async function GET(request: NextRequest) {
    try {
        const supabase = await createSupabaseServer();
        const { data: { user }, error: authError } = await (supabase as any).auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const topic = request.nextUrl.searchParams.get("topic");

        // Fetch profile and last game session
        const profile = await prisma.profile.findUnique({
            where: { userId: user.id },
            include: { progress: { select: { lessonId: true } } }
        });

        if (!profile) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 });
        }

        const lastGame = await (supabase as any)
            .from('players')
            .select('*, professions(*)')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        const insight = await generateFinancialInsights({
            name: profile.fullName.split(' ')[0],
            xp: profile.xp,
            level: profile.level,
            completedLessons: profile.progress.map(p => p.lessonId),
            adnProfile: (profile as any).adnProfile || "Sin Diagnosticar",
            currentTopic: topic || undefined,
            gameStats: lastGame.data ? {
                totalCash: lastGame.data.cash_on_hand,
                passiveIncome: lastGame.data.passive_income,
                escapedRatRace: lastGame.data.has_escaped_rat_race,
                mainProfession: lastGame.data.professions?.name
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
