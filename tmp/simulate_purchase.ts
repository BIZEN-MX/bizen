
import { PrismaClient } from '@prisma/client'

async function simulatePurchase() {
    const prisma = new PrismaClient()
    // Using the ID for 'Diego Peña Sánchez' who has 100k
    const userId = '18164799-c4c9-4a23-b69a-8b15b54918de'
    const productId = '1' // Marco de Embajador
    const price = 200

    try {
        console.log(`PRE-PURCHASE CHECK for ${userId}...`)

        // Check if already owned
        const owned = await prisma.userInventoryItem.findFirst({
            where: { userId, productId }
        })
        console.log('Already owned?', !!owned)

        // Check balance
        const profile = await prisma.profile.findUnique({
            where: { userId },
            select: { bizcoins: true }
        })
        console.log('Balance:', (profile as any)?.bizcoins)

        if (owned) {
            console.log('SKIPPING: Already owned.')
            return
        }

        console.log('Executing purchase transaction...')
        const result = await prisma.$transaction(async (tx) => {
            const p = await tx.profile.update({
                where: { userId },
                data: { bizcoins: { decrement: price } }
            })
            const i = await tx.userInventoryItem.create({
                data: { userId, productId, pricePaid: price }
            })
            return { p, i }
        })

        console.log('PURCHASE SUCCESS!')
        console.log('New Balance:', (result.p as any).bizcoins)

        // Verify it's in the DB
        const verify = await prisma.userInventoryItem.findFirst({
            where: { userId, productId }
        })
        console.log('Verification in DB:', !!verify)

    } catch (err: any) {
        console.error('SIMULATION ERROR:', err.message)
    } finally {
        await prisma.$disconnect()
    }
}

simulatePurchase()
