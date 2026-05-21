
import { PrismaClient } from '@prisma/client'

async function testPurchase() {
    const prisma = new PrismaClient()
    const userId = '3475daa6-87a3-470d-b5d4-99fa8c0c7e98' // Use the ID from check_db.ts
    const productId = '2' // Marco Dorado VIP
    const price = 500

    try {
        console.log(`Initial stats for ${userId}...`)
        const profile = await prisma.profile.findUnique({ where: { userId }, select: { bizcoins: true } })
        console.log('Balance:', (profile as any)?.bizcoins)

        console.log('Attempting purchase...')
        const result = await prisma.$transaction(async (tx) => {
            const updated = await tx.profile.update({
                where: { userId },
                data: { bizcoins: { decrement: price } }
            })
            const inv = await tx.userInventoryItem.create({
                data: { userId, productId, pricePaid: price }
            })
            return { updated, inv }
        })
        console.log('Purchase successful:', result.inv.id)
    } catch (err: any) {
        console.error('PURCHASE FAILED:', err.message)
    } finally {
        await prisma.$disconnect()
    }
}

testPurchase()
