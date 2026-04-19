import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        // --- 1. Students ranked by XP (top 100) ---
        let topStudents: any[] = []
        try {
            topStudents = await prisma.profile.findMany({
                where: {
                    xp: { gt: 0 },
                    role: 'student', // only students
                },
                select: {
                    userId: true,
                    fullName: true,
                    nickname: true,
                    xp: true,
                    level: true,
                    avatar: true,
                    schoolId: true,
                },
                orderBy: { xp: 'desc' },
                take: 100,
            })

            // Fetch school names manually for students
            const schoolIds = [...new Set(topStudents.map(u => u.schoolId).filter(Boolean))];
            if (schoolIds.length > 0) {
                const schools = await prisma.school.findMany({
                    where: { id: { in: schoolIds as string[] } },
                    select: { id: true, name: true }
                });
                const schoolMap = Object.fromEntries(schools.map(s => [s.id, s.name]));
                topStudents = topStudents.map(u => ({
                    ...u,
                    school: { name: schoolMap[u.schoolId as string] || null }
                }));
            }
        } catch (e: any) {
            console.error("Rankings: Failed to fetch top students:", e.message)
        }

        // --- 1.5 Particulares ranked by XP (top 100) ---
        let topParticulares: any[] = []
        try {
            topParticulares = await prisma.profile.findMany({
                where: {
                    xp: { gt: 0 },
                    role: 'particular', // only particulares
                },
                select: {
                    userId: true,
                    fullName: true,
                    nickname: true,
                    xp: true,
                    level: true,
                    avatar: true,
                    schoolId: true,
                },
                orderBy: { xp: 'desc' },
                take: 100,
            })
        } catch (e: any) {
            console.error("Rankings: Failed to fetch top particulares:", e.message)
        }

        // --- 2. Schools ranked by XP per capita ---
        let schoolRankings: any[] = []
        try {
            // Fetch all schools
            const schools = await prisma.school.findMany({
                select: { id: true, name: true }
            })

            // Fetch all student profiles that have a schoolId
            const studentProfiles = await prisma.profile.findMany({
                where: { role: 'student', schoolId: { not: null } },
                select: { schoolId: true, xp: true }
            })

            // Group by schoolId
            schoolRankings = schools
                .map((school) => {
                    const profiles = studentProfiles.filter(p => p.schoolId === school.id)
                    const studentCount = profiles.length
                    const totalXp = profiles.reduce((sum, p) => sum + p.xp, 0)
                    const xpPerCapita = studentCount > 0 ? Math.round(totalXp / studentCount) : 0

                    return {
                        schoolId: school.id,
                        schoolName: school.name,
                        studentCount,
                        totalXp,
                        xpPerCapita,
                    }
                })
                .filter((s) => s.studentCount > 0)
                .sort((a, b) => b.xpPerCapita - a.xpPerCapita)
        } catch (e: any) {
            console.error("Rankings: Failed to fetch school rankings:", e.message)
        }

        const mapUser = (u: any, i: number) => {
            const parts = (u.fullName || '').trim().split(/\s+/)
            const safeName = parts.length >= 2
                ? `${parts[0]} ${parts[parts.length - 1][0]}.`
                : (parts[0] || 'Usuario')

            return {
                rank: i + 1,
                userId: u.userId,
                displayName: u.nickname || safeName,
                nickname: u.nickname,
                xp: u.xp,
                level: u.level,
                avatar: u.avatar,
                schoolName: u.school?.name || null,
            }
        }

        return NextResponse.json({
            users: topStudents.map(mapUser),
            particulares: topParticulares.map(mapUser),
            schools: (schoolRankings || []).map((s, i) => ({ ...s, rank: i + 1 })),
        })
    } catch (error: any) {
        console.error('CRITICAL: Error fetching rankings!', error)
        return NextResponse.json({
            error: 'Failed to fetch rankings',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 })
    }
}
