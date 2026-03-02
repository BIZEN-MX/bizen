
import { PrismaClient } from '@prisma/client'

async function checkRecentActivity() {
    const prisma = new PrismaClient()
    try {
        console.log('--- Recent Inventory Purchases ---')
        const recent = await prisma.userInventoryItem.findMany({
            orderBy: { purchasedAt: 'desc' },
            take: 10,
            include: { profile: { select: { fullName: true } } }
        })
        console.log(recent.map(r => ({
            user: r.profile?.fullName,
            product: r.productId,
            at: r.purchasedAt
        })))

        console.log('\n--- Profiles with most purchases ---')
        const counts = await prisma.userInventoryItem.groupBy({
            by: ['userId'],
            _count: { userId: true }
        })
        console.log(counts)

    } catch (err: any) {
        console.error('ERROR:', err.message)
    } finally {
        await prisma.$disconnect()
    }
}

checkRecentActivity()
