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
            select: { dnaProfile: true, dnaScore: true }
        });

        // Simulating mistake tracking (In a real scenario, this would come from analytics or quiz logs)
        const mistakes = ["Confusión entre Interés Simple y Compuesto", "Sesgo de confirmación en compras"];
        const currentTopic = "Inversión y Patrimonio";

        // Generate the lab using Gemini
        const lab = await generatePersonalizedLab(
            profile?.dnaProfile || "Iniciado por Billy",
            mistakes,
            currentTopic
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
