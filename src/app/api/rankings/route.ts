import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        // --- 1. Users ranked by XP (top 100) ---
        let topUsers: any[] = []
        try {
            topUsers = await prisma.profile.findMany({
                where: {
                    xp: { gt: 0 },
                },
                select: {
                    userId: true,
                    fullName: true,
                    nickname: true,
                    xp: true,
                    level: true,
                    avatar: true,
                    school: {
                        select: { name: true },
                    },
                },
                orderBy: { xp: 'desc' },
                take: 100,
            })
        } catch (e: any) {
            console.error("Rankings: Failed to fetch top users:", e.message)
        }

        // --- 2. Schools ranked by XP per capita ---
        let schoolRankings: any[] = []
        try {
            const schools = await prisma.school.findMany({
                select: {
                    id: true,
                    name: true,
                    profiles: {
                        where: { role: 'student' },
                        select: { xp: true },
                    },
                },
            })

            schoolRankings = schools
                .map((school) => {
                    const studentCount = school.profiles.length
                    const totalXp = school.profiles.reduce((sum, p) => sum + p.xp, 0)
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

        return NextResponse.json({
            users: topUsers.map((u: any, i) => {
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
            }),
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
