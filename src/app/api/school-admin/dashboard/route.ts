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

        const students = (roster as any[]).map(student => {
            const completedLessons = student.progress.filter(p => p.percent === 100).length;
            totalCompletedLessons += completedLessons;
            
            const totalPercent = student.progress.reduce((acc, curr) => acc + (curr.percent || 0), 0);
            const avgProgressRaw = student.progress.length > 0 ? (totalPercent / student.progress.length) : 0;
            // Cap at 100% just in case
            const averageProgress = Math.min(100, Math.round(avgProgressRaw));

            return {
                id: student.userId,
                name: student.fullName,
                level: student.level,
                xp: student.xp,
                joinedAt: student.createdAt,
                coursesEnrolled: student.enrollments.map(e => e.topic?.title || "Curso"),
                completedLessonsCount: completedLessons,
                averageProgress
            }
        })

        const avgModulesCompleted = totalStudentsCount > 0 ? (totalCompletedLessons / totalStudentsCount).toFixed(1) : 0

        return NextResponse.json({
            school: schoolName,
            kpis: {
                totalStudents: totalStudentsCount,
                avgModulesCompleted: Number(avgModulesCompleted),
                totalCompletedLessons: totalCompletedLessons
            },
            students: students
        })

    } catch (error) {
        console.error('Error fetching dashboard data:', error)
        return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 })
    }
}
