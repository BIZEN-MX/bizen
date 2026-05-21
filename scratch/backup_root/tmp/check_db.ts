
import { PrismaClient } from '@prisma/client'

async function checkDb() {
    const prisma = new PrismaClient()
    try {
        console.log('Checking Profiles...')
        const profile = await prisma.profile.findFirst()
        console.log('Profile sample:', profile ? { userId: profile.userId, bizcoins: (profile as any).bizcoins } : 'No profiles found')

        console.log('Checking Inventory...')
        const inventory = await prisma.userInventoryItem.findMany()
        console.log('Inventory count:', inventory.length)
        if (inventory.length > 0) {
            console.log('Inventory samples:', inventory.slice(0, 5))
        }
    } catch (err: any) {
        console.error('DATABASE ERROR:', err.message)
    } finally {
        await prisma.$disconnect()
    }
}

checkDb()
