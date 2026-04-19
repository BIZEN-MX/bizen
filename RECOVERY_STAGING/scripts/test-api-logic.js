const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function test() {
    try {
        const id = 'cmm9fr1qw0001r6lebcr2cd90'
        console.log('Fetching lesson with ID:', id)
        const lesson = await prisma.lesson.findUnique({
            where: { id },
            include: {
                units: true,
                steps: true
            }
        })
        console.log('Lesson found:', !!lesson)
        if (lesson) {
            console.log('Steps count:', lesson.steps?.length)
        }
    } catch (err) {
        console.error('Error detail:', err)
    } finally {
        await prisma.$disconnect()
    }
}

test()
