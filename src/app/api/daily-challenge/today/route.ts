import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createSupabaseServer } from "@/lib/supabase/server"

export async function GET() {
    try {
        const supabase = await createSupabaseServer()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        // 1. Get Today's Date in Mexico City Time
        const mxFormatter = new Intl.DateTimeFormat("en-US", {
            timeZone: "America/Mexico_City",
            year: "numeric", month: "2-digit", day: "2-digit",
        })
        const parts = mxFormatter.formatToParts(new Date())
        const y = parts.find(p => p.type === "year")?.value
        const m = parts.find(p => p.type === "month")?.value
        const d = parts.find(p => p.type === "day")?.value

        // Use a more relaxed date range if direct match fails
        const todayStr = `${y}-${m}-${d}`;
        const startDate = new Date(`${todayStr}T00:00:00Z`);
        const endDate = new Date(`${todayStr}T23:59:59Z`);

        // 2. Fetch challenge
        let challenge: any = await prisma.dailyChallenge.findFirst({
            where: {
                activeDate: { gte: startDate, lte: endDate }
            }
        }).catch(err => {
            console.error("DB: Initial challenge find failed:", err.message);
            return null;
        });

        // 3. Fallback to most recent if none found for *exactly* today
        if (!challenge) {
            challenge = await prisma.dailyChallenge.findFirst({
                orderBy: { activeDate: "desc" }
            }).catch(() => null);
        }

        // 4. Critical fallback - Create a basic object if DB is totally empty/unreachable
        if (!challenge) {
            challenge = {
                id: "fallback-challenge",
                title: "Revisión de Gastos Semanal",
                description: "Hoy enfoquémonos en revisar tus gastos recientes. Identifica uno que no fue necesario.",
                challengeType: "reflection",
                activeDate: startDate,
                xpReward: 50
            };
        }

        // 5. Completion Status
        let isCompleted = false;
        if (challenge.id !== "fallback-challenge") {
            const evidence = await prisma.evidencePost.findFirst({
                where: { dailyChallengeId: challenge.id, authorUserId: user.id }
            }).catch(() => null);
            isCompleted = !!evidence;
        }

        return NextResponse.json({ ...challenge, isCompleted })

    } catch (err: any) {
        console.error("CRITICAL: GET /api/daily-challenge/today:", err);
        return NextResponse.json({
            error: "Error al cargar el reto",
            details: err?.message || String(err)
        }, { status: 500 })
    }
}
