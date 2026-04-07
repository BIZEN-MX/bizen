import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { diagnosticQuiz } from "@/components/diagnostic/quizData"

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email, fullName, institution, userAnswers } = body

        if (!email || !fullName || !institution || !userAnswers) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            )
        }

        // Calculate detailed ADN Profile
        const categoryScores: Record<string, { correct: number; total: number; percentage: number }> = {}
        let totalCorrect = 0

        diagnosticQuiz.forEach((q) => {
            const isCorrect = userAnswers[q.id] === q.answer
            if (isCorrect) totalCorrect++

            if (!categoryScores[q.label]) {
                categoryScores[q.label] = { correct: 0, total: 0, percentage: 0 }
            }
            categoryScores[q.label].total++
            if (isCorrect) categoryScores[q.label].correct++
        })

        // Finalize category math
        for (const cat in categoryScores) {
            categoryScores[cat].percentage = Math.round((categoryScores[cat].correct / categoryScores[cat].total) * 100)
        }

        const scorePercentage = Math.round((totalCorrect / diagnosticQuiz.length) * 100)

        // Logic for the 3 Profiles
        let adnProfile = "Ahorrador Estancado" // Default
        const creditScore = categoryScores["Crédito"]?.percentage || 0
        const budgetScore = categoryScores["Presupuesto"]?.percentage || 0
        const savingScore = categoryScores["Ahorro"]?.percentage || 0
        const investmentScore = categoryScores["Inversión"]?.percentage || 0
        const securityScore = categoryScores["Seguridad"]?.percentage || 0

        if (scorePercentage >= 85) {
            adnProfile = "Maestro BIZEN"
        } else if (creditScore < 50 || budgetScore < 50) {
            adnProfile = "Gastador Digital"
        } else if (savingScore > 50 && investmentScore < 40) {
            adnProfile = "Ahorrador Estancado"
        } else if (securityScore < 50 || investmentScore < 50) {
            adnProfile = "Explorador Arriesgado"
        }

        const result = await prisma.diagnosticResult.create({
            data: {
                email,
                fullName,
                institution,
                answers: userAnswers,
                score: scorePercentage,
                adnProfile: adnProfile,
                categoryScores: categoryScores as any,
            },
        })

        return NextResponse.json({ success: true, id: result.id, profile: adnProfile })
    } catch (error) {
        console.error("Error saving diagnostic quiz:", error)
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const email = searchParams.get("email")

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 })
        }

        const existing = await prisma.diagnosticResult.findFirst({
            where: {
                email: {
                    equals: email,
                    mode: 'insensitive'
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({ exists: !!existing, result: existing })
    } catch (error) {
        console.error("Error checking diagnostic quiz:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
