import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    try {
        const cookieStore = await cookies()
        const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL_BIZEN || process.env.NEXT_PUBLIC_SUPABASE_URL)!
        const supabaseKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_BIZEN || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!

        const supabase = createServerClient(supabaseUrl, supabaseKey, {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // The `setAll` method was called from a route handler.
                    }
                },
            },
        })

        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const userId = session.user.id

        // Fetch the user's profile to get their role and schoolId
        const userProfile = await prisma.profile.findUnique({
            where: { userId }
        })

        if (!userProfile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
        }

        // Ensure the user is a teacher or school admin
        if (userProfile.role !== 'teacher' && userProfile.role !== 'school_admin') {
            return NextResponse.json({ error: 'Forbidden. Requires teacher or admin role.' }, { status: 403 })
        }

        // Ensure the user is associated with a school
        if (!userProfile.schoolId) {
            return NextResponse.json({ error: 'User is not associated with a school.' }, { status: 400 })
        }

        const schoolId = userProfile.schoolId
        
        let schoolName = "Institución"
        const schoolRecord = await prisma.school.findUnique({ where: { id: schoolId } })
        if (schoolRecord) {
            schoolName = schoolRecord.name
        }

        // --- MULTI-TENANT QUERIES ---
        // All queries from this point MUST filter by schoolId

        // 1. Get total students in the school
        const totalStudentsCount = await prisma.profile.count({
            where: {
                schoolId: schoolId,
                role: 'student'
            }
        })

        // 2. Fetch the student roster (id, name, level, email from auth? email won't be in profile table easily. We'll use profile fields)
        const roster = await prisma.profile.findMany({
            where: {
                schoolId: schoolId,
                role: 'student'
            },
            select: {
                userId: true,
                fullName: true,
                level: true,
                xp: true,
                createdAt: true,
                progress: {
                    select: { id: true, percent: true, completedAt: true }
                },
                enrollments: {
                    select: { topic: { select: { title: true } } }
                }
            },
            orderBy: { fullName: 'asc' }
        })

        // 3. Calculate some aggregate KPIs (e.g., active students = have completed progress recently, or just average progress)
        let totalCompletedLessons = 0
        const studentIds = roster.map(r => r.userId)
        
        // --- ADVANCED METRICS AGGREGATION ---

        // A. Quiz Efficiency (Attempts per quiz)
        const allAttempts = await prisma.attempt.findMany({
            where: { userId: { in: studentIds as any } },
            select: { userId: true, quizId: true }
        })
        const quizPairs = new Set(allAttempts.map(a => `${a.userId}-${a.quizId}`)).size
        const avgAttemptsPerQuiz = quizPairs > 0 ? (allAttempts.length / quizPairs).toFixed(2) : "1.00"

        // B. Stock Performance
        const portfolios = await prisma.simulator_portfolios.findMany({
            where: { user_id: { in: studentIds as any } },
            include: { holdings: true }
        })
        
        // Get latest prices for all symbols held by these students
        const allSymbols = Array.from(new Set(portfolios.flatMap(p => p.holdings.map(h => h.symbol))))
        const latestPrices = await prisma.market_prices_eod.findMany({
            where: { symbol: { in: allSymbols } },
            orderBy: { date: 'desc' },
            distinct: ['symbol']
        })
        const priceMap = new Map(latestPrices.map(p => [p.symbol, Number(p.close)]))

        let totalInstitutionalValue = 0
        portfolios.forEach(p => {
            let holdingsValue = 0
            p.holdings.forEach(h => {
                const price = priceMap.get(h.symbol) || Number(h.avg_cost)
                holdingsValue += Number(h.quantity) * price
            })
            totalInstitutionalValue += (Number(p.cash_balance) + holdingsValue)
        })
        const startingCapital = portfolios.length * 10000
        const institutionalROI = startingCapital > 0 
            ? ((totalInstitutionalValue - startingCapital) / startingCapital * 100).toFixed(2) 
            : "0.00"

        // C. Retention Risk & Community Leaders
        let studentsAtRisk = 0
        const threeDaysAgo = new Date(); threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
        
        const communityLeaders = roster
            .map(r => ({
                name: r.fullName,
                reputation: r.level * 100 + (r.xp / 10), // Proxy if detailed forum stats aren't direct
                xp: r.xp
            }))
            .sort((a, b) => b.reputation - a.reputation)
            .slice(0, 5)

        // D. Diagnostic Insights (Focused)
        // Link DiagnosticResult via email (requires fetching emails from Auth)
        const diagnosticStats = {
            avgScore: 0,
            participation: 0,
            strengths: [] as string[],
            weaknesses: [] as string[]
        }

        const diagResults = await prisma.diagnosticResult.findMany({
            where: { institution: { contains: schoolName, mode: 'insensitive' } }
        })

        if (diagResults.length > 0) {
            diagnosticStats.participation = diagResults.length
            diagnosticStats.avgScore = Math.round(diagResults.reduce((acc, curr) => acc + curr.score, 0) / diagResults.length)
            
            // Real topic analysis based on quiz labels
            const labelsMap: Record<string, string> = {
                "diag-1": "Educación", "diag-2": "Ahorro", "diag-3": "Mentalidad",
                "diag-4": "Objetivos", "diag-5": "Deuda", "diag-6": "Entorno",
                "diag-7": "Crédito", "diag-8": "Aprendizaje", "diag-9": "Gastos",
                "diag-10": "Gestión"
            }
            
            const categoryScores: Record<string, number[]> = {}
            diagResults.forEach(res => {
                const answers = res.answers as any
                Object.keys(answers).forEach(qId => {
                    const label = labelsMap[qId] || qId
                    if (!categoryScores[label]) categoryScores[label] = []
                    // 'A' is the ideal answer in diagnosticQuiz data
                    categoryScores[label].push(answers[qId] === 'A' ? 100 : 0)
                })
            })

            const sortedCategories = Object.entries(categoryScores)
                .map(([name, scores]) => ({
                    name,
                    avg: scores.reduce((a, b) => a + b, 0) / scores.length
                }))
                .sort((a, b) => b.avg - a.avg)

            diagnosticStats.strengths = sortedCategories.slice(0, 2).map(c => c.name)
            diagnosticStats.weaknesses = sortedCategories.slice(-2).reverse().map(c => c.name)
        }

        const students = (roster as any[]).map(student => {
            const completedLessons = student.progress.filter(p => p.percent === 100).length;
            totalCompletedLessons += completedLessons;
            
            const totalPercent = student.progress.reduce((acc, curr) => acc + (curr.percent || 0), 0);
            const avgProgressRaw = student.progress.length > 0 ? (totalPercent / student.progress.length) : 0;
            const averageProgress = Math.min(100, Math.round(avgProgressRaw));

            // Risk check
            const lastActive = student.progress.length > 0 
                ? new Date(Math.max(...student.progress.map(p => new Date(p.updatedAt).getTime())))
                : new Date(student.createdAt)
            
            if (lastActive < threeDaysAgo) studentsAtRisk++

            return {
                id: student.userId,
                name: student.fullName,
                level: student.level,
                xp: student.xp,
                joinedAt: student.createdAt,
                coursesEnrolled: student.enrollments.map(e => e.topic?.title || "Curso"),
                completedLessonsCount: completedLessons,
                averageProgress,
                lastActive
            }
        })

        const avgModulesCompleted = totalStudentsCount > 0 ? (totalCompletedLessons / totalStudentsCount).toFixed(1) : 0

        return NextResponse.json({
            school: schoolName,
            kpis: {
                totalStudents: totalStudentsCount,
                avgModulesCompleted: Number(avgModulesCompleted),
                totalCompletedLessons: totalCompletedLessons,
                avgAttemptsPerQuiz: Number(avgAttemptsPerQuiz),
                institutionalROI: Number(institutionalROI),
                studentsAtRisk,
                diagnosticStats
            },
            students: students,
            communityLeaders
        })

    } catch (error) {
        console.error('Error fetching dashboard data:', error)
        return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 })
    }
}
