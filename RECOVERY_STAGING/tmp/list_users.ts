
import { PrismaClient } from '@prisma/client'

async function listUsers() {
    const prisma = new PrismaClient()
    try {
        const profiles = await prisma.profile.findMany({
            select: { userId: true, fullName: true, bizcoins: true }
        })
        console.log('User Profiles:', profiles)
    } catch (err: any) {
        console.error('ERROR:', err.message)
    } finally {
        await prisma.$disconnect()
    }
}

listUsers()
