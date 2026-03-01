import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        // --- 1. Users ranked by XP (top 100) ---
        const topUsers = await prisma.profile.findMany({
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

        // --- 2. Schools ranked by XP per capita ---
        // First get all schools with their student profiles
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

        const schoolRankings = schools
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

        return NextResponse.json({
            users: topUsers.map((u, i) => ({
                rank: i + 1,
                userId: u.userId,
                displayName: u.fullName || u.nickname || 'Usuario',
                nickname: u.nickname,
                xp: u.xp,
                level: u.level,
                schoolName: u.school?.name || null,
            })),
            schools: schoolRankings.map((s, i) => ({ ...s, rank: i + 1 })),
        })
    } catch (error) {
        console.error('Error fetching rankings:', error)
        return NextResponse.json({ error: 'Failed to fetch rankings' }, { status: 500 })
    }
}
