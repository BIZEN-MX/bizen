
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const [totalXP, totalMembers, activeToday, totalLessons] = await Promise.all([
            prisma.profile.aggregate({ _sum: { xp: true } }),
            prisma.profile.count(),
            prisma.profile.count({ 
                where: { 
                    createdAt: { gte: today } 
                } 
            }),
            prisma.progress.count({ where: { percent: 100 } })
        ])

        const xpTotal = totalXP._sum.xp || 0
        const formattedXP = xpTotal >= 1000000 
            ? `+${(xpTotal / 1000000).toFixed(1)}M` 
            : xpTotal >= 1000 
                ? `+${(xpTotal / 1000).toFixed(1)}K` 
                : xpTotal.toString()

        const ecoStatus = totalLessons >= 500 ? 'Sostenible' : 'En desarrollo'
        const activityStatus = activeToday >= (totalMembers * 0.1) ? 'Alta' : 'Moderada'

        return NextResponse.json({
            members: totalMembers,
            activeToday: activeToday,
            xpGenerated: formattedXP,
            ecoStatus: ecoStatus,
            activityLabel: activityStatus
        })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ 
            members: 0, 
            activeToday: 0, 
            xpGenerated: "0", 
            ecoStatus: "...", 
            activityLabel: "..." 
        })
    }
}
