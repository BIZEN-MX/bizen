import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth/api-auth'
import { clerkClient } from '@clerk/nextjs/server'

export const dynamic = 'force-dynamic'

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const studentId = params.id
        const authResult = await requireAuth(request)
        
        if (!authResult.success) {
            return authResult.response
        }

        const actorProfile = await prisma.profile.findUnique({ where: { userId: authResult.data.user.id } })
        if (!actorProfile || (actorProfile.role !== 'teacher' && actorProfile.role !== 'school_admin' && actorProfile.role !== 'admin')) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        // Fetch student profile with specific school check
        const studentProfile = await prisma.profile.findUnique({
            where: { userId: studentId },
            include: {
                progress: { include: { lesson: true } },
                enrollments: { include: { topic: true } },
            }
        })

        if (!studentProfile || (actorProfile.role !== 'admin' && studentProfile.schoolId !== actorProfile.schoolId)) {
            return NextResponse.json({ error: 'Student not found in your school' }, { status: 404 })
        }

        // --- FETCH DEEP METRICS ---

        // 1. Get user email for Diagnostic mapping from Clerk
        let email = ""
        try {
            const client = await clerkClient()
            const authUser = await client.users.getUser(studentId)
            email = authUser.emailAddresses[0]?.emailAddress || ""
        } catch (e) {
            console.warn("[StudentDetail] Could not fetch user from Clerk:", e)
        }


        const [diagnostic, attempts, portfolio, forumPosts, forumComments] = await Promise.all([
            email ? prisma.diagnosticResult.findFirst({ where: { email: { equals: email, mode: 'insensitive' } } }) : null,
            prisma.attempt.findMany({ where: { userId: studentId } }),
            prisma.simulator_portfolios.findFirst({ 
                where: { user_id: studentId },
                include: { holdings: true }
            }),
            prisma.forumThread.count({ where: { authorId: studentId } }),
            prisma.forumComment.count({ where: { authorId: studentId } })
        ])

        // 2. Calculate average quiz score
        const quizScores = attempts.map(a => a.score)
        const avgQuizScore = quizScores.length > 0 ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length) : 0

        // 3. Calculate actual Portfolio Value
        let currentPortfolioValue = 0
        if (portfolio) {
            const symbols = portfolio.holdings.map(h => h.symbol)
            const latestPrices = await prisma.market_prices_eod.findMany({
                where: { symbol: { in: symbols } },
                orderBy: { date: 'desc' },
                distinct: ['symbol']
            })
            const priceMap = new Map(latestPrices.map(p => [p.symbol, Number(p.close)]))
            
            let holdingsValue = 0
            portfolio.holdings.forEach(h => {
                const price = priceMap.get(h.symbol) || Number(h.avg_cost)
                holdingsValue += Number(h.quantity) * price
            })
            currentPortfolioValue = Number(portfolio.cash_balance) + holdingsValue
        }

        return NextResponse.json({
            profile: {
                name: studentProfile.fullName,
                level: studentProfile.level,
                xp: studentProfile.xp,
                bizcoins: studentProfile.bizcoins,
                streak: studentProfile.currentStreak,
                joinedAt: studentProfile.createdAt
            },
            metrics: {
                avgQuizScore,
                totalAttempts: attempts.length,
                lessonsCompleted: studentProfile.progress.filter(p => p.percent === 100).length,
                totalProgress: studentProfile.progress.length > 0 
                  ? Math.round(studentProfile.progress.reduce((a, b) => a + (b.percent || 0), 0) / studentProfile.progress.length) 
                  : 0
            },
            diagnostic: diagnostic ? {
                score: diagnostic.score,
                completedAt: (diagnostic as any).createdAt,
                answers: diagnostic.answers
            } : null,
            simulator: portfolio ? {
                roi: ((currentPortfolioValue - 10000) / 100).toFixed(2), // Based on 10k start
                cash: portfolio.cash_balance,
                holdingsCount: portfolio.holdings.length
            } : null,
            social: {
                posts: forumPosts,
                comments: forumComments,
                reputation: studentProfile.level * 10 
            }
        })

    } catch (err: any) {
        console.error(err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
