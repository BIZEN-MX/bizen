import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        console.log('Testing connection to DB...')
        const profiles = await prisma.profile.findMany({ take: 1 })
        console.log('Successfully connected and queried 1 profile:', profiles)
    } catch (err) {
        console.error('Failed to connect or query!', err)
    } finally {
        await prisma.$disconnect()
    }
}

main()
