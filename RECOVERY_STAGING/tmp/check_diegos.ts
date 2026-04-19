
import { PrismaClient } from '@prisma/client'

async function checkDiegoInventory() {
    const prisma = new PrismaClient()
    try {
        const diegos = await prisma.profile.findMany({
            where: { fullName: { contains: 'Diego' } },
            select: { userId: true, fullName: true, bizcoins: true }
        })

        for (const diego of diegos) {
            const inv = await prisma.userInventoryItem.findMany({
                where: { userId: diego.userId }
            })
            console.log(`User: ${diego.fullName} (${diego.userId})`)
            console.log(`Balance: ${diego.bizcoins}`)
            console.log(`Inventory Items:`, inv.map(i => i.productId))
            console.log('---')
        }
    } catch (err: any) {
        console.error('ERROR:', err.message)
    } finally {
        await prisma.$disconnect()
    }
}

checkDiegoInventory()
