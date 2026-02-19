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

        // Calculate score (optional but helpful)
        let scoreCount = 0
        diagnosticQuiz.forEach((q) => {
            if (userAnswers[q.id] === q.answer) {
                scoreCount++
            }
        })
        const totalQuestions = diagnosticQuiz.length
        const scorePercentage = totalQuestions > 0 ? Math.round((scoreCount / totalQuestions) * 100) : 0

        const result = await prisma.diagnosticResult.create({
            data: {
                email,
                fullName,
                institution,
                answers: userAnswers,
                score: scorePercentage,
            },
        })

        return NextResponse.json({ success: true, id: result.id })
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
            }
        })

        return NextResponse.json({ exists: !!existing })
    } catch (error) {
        console.error("Error checking diagnostic quiz:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
