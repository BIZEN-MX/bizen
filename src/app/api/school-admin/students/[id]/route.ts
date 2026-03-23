import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSupabaseServer } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const studentId = params.id
        const supabase = await createSupabaseServer();
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const actorProfile = await prisma.profile.findUnique({ where: { userId: session.user.id } })
        if (!actorProfile || (actorProfile.role !== 'teacher' && actorProfile.role !== 'school_admin')) {
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

        if (!studentProfile || studentProfile.schoolId !== actorProfile.schoolId) {
            return NextResponse.json({ error: 'Student not found in your school' }, { status: 404 })
        }

        // --- FETCH DEEP METRICS ---

        // 1. Get user email for Diagnostic mapping
        const { data: authUser } = await supabase.auth.admin.getUserById(studentId)
        const email = authUser?.user?.email

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
