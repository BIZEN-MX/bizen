
import { PrismaClient } from '@prisma/client'

async function testDuplicatePurchase() {
    const prisma = new PrismaClient()
    const userId = '3475daa6-87a3-470d-b5d4-99fa8c0c7e98'
    const productId = '2'
    const price = 500

    try {
        console.log('Attempting duplicate purchase...')
        const inv = await prisma.userInventoryItem.create({
            data: { userId, productId, pricePaid: price }
        })
        console.log('Duplicate purchase SUCCESSFUL? ID:', inv.id)
    } catch (err: any) {
        console.log('DUPLICATE BLOCKED BY DB:', err.message)
    } finally {
        await prisma.$disconnect()
    }
}

testDuplicatePurchase()
