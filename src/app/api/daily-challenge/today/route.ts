import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createSupabaseServer } from "@/lib/supabase/server"

/**
 * GET /api/daily-challenge/today
 * Returns today's DailyChallenge, creating a placeholder if none exists.
 */
export async function GET() {
    try {
        const supabase = await createSupabaseServer()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        // Today in YYYY-MM-DD (UTC)
        const today = new Date()
        today.setUTCHours(0, 0, 0, 0)

        let challenge = await prisma.dailyChallenge.findFirst({
            where: { activeDate: today }
        })

        // Auto-seed a placeholder challenge if none exists for today
        if (!challenge) {
            const placeholders = [
                {
                    title: "Revisión de Gastos Semanal",
                    description: "Dedica 5 minutos a revisar tus gastos de los últimos 7 días. Identifica en qué categoría gastaste más y propón una estrategia de ahorro para el próximo mes.",
                    challengeType: "reflection",
                },
                {
                    title: "Mi Presupuesto del Mes",
                    description: "Anota tus ingresos y gastos fijos de este mes. Calcula cuánto te sobra (o falta) y diseña un plan para al menos ahorrar el 10%.",
                    challengeType: "task",
                },
                {
                    title: "¿Qué es el interés compuesto?",
                    description: "Investiga qué es el interés compuesto y calcula cuánto tendrías si ahorras $500 mensuales durante 5 años con un 6% de rendimiento anual.",
                    challengeType: "reflection",
                },
                {
                    title: "Identifica un Gasto Innecesario",
                    description: "Revisa tus últimos 3 gastos de entretenimiento. ¿Cuál podrías eliminar o reducir? Calcula cuánto ahorrarías en un año.",
                    challengeType: "task",
                },
                {
                    title: "Metas Financieras SMART",
                    description: "Define una meta financiera a corto plazo (3 meses) usando el método SMART: Específica, Medible, Alcanzable, Relevante y con Tiempo definido.",
                    challengeType: "reflection",
                },
            ]
            const pick = placeholders[today.getUTCDay() % placeholders.length]
            challenge = await prisma.dailyChallenge.create({
                data: { ...pick, activeDate: today }
            })
        }

        // Check if current user has already submitted evidence for this challenge
        const existingEvidence = await prisma.evidencePost.findFirst({
            where: { dailyChallengeId: challenge.id, authorUserId: user.id }
        })

        return NextResponse.json({
            ...challenge,
            isCompleted: !!existingEvidence
        })
    } catch (err) {
        console.error("GET /api/daily-challenge/today:", err)
        return NextResponse.json({ error: "Error al cargar el reto" }, { status: 500 })
    }
}
