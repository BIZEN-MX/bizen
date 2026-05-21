
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log("Checking achievements table...")
    try {
        const count = await prisma.$queryRawUnsafe(`SELECT count(*) FROM public.achievements`)
        console.log("Achievements count:", count)
        
        const samples = await prisma.$queryRawUnsafe(`SELECT * FROM public.achievements LIMIT 5`)
        console.log("Samples:", samples)

        const userCount = await prisma.$queryRawUnsafe(`SELECT count(*) FROM public.user_achievements`)
        console.log("User Achievements count:", userCount)

        const userSamples = await prisma.$queryRawUnsafe(`SELECT * FROM public.user_achievements LIMIT 5`)
        console.log("User samples:", userSamples)
    } catch (err) {
        console.error("Error querying achievements:", err)
    } finally {
        await prisma.$disconnect()
    }
}

main()
