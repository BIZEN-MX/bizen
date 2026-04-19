import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { generatePersonalizedLab } from "@/lib/ai/billyLabEngine";

export async function GET(request: NextRequest) {
    try {
        const supabase = await createSupabaseServer();
        const { data: { user }, error: authError } = await (supabase as any).auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Fetch user context for the prompt
        const profile = await prisma.profile.findUnique({
            where: { userId: user.id },
            select: { adnProfile: true, adnScore: true }
        });

        // FETCH REAL SAVINGS GOALS
        const goals = await (prisma as any).savingsGoal.findMany({
          where: { userId: user.id, isCompleted: false },
          select: { title: true, targetAmount: true }
        });

        const goalList: string[] = (goals as any[]).map((g: any) => `${g.title} ($${g.targetAmount})`);

        // Simulating mistake tracking (Could come from DB later)
        const mistakes: string[] = ["Confusión entre Interés Simple y Compuesto"];
        const currentTopic = "Inversión y Patrimonio";

        // Generate the lab using Gemini 2.0 Flash
        const lab = await generatePersonalizedLab(
            profile?.adnProfile || "Iniciado BIZEN",
            mistakes,
            currentTopic,
            goalList // Pass goals to engine
        );

        return NextResponse.json({
            success: true,
            lab
        });

    } catch (error) {
        console.error("API Billy Lab Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
