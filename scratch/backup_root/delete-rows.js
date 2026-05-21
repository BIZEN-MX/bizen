const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    await prisma.labChecklist.deleteMany({})
    await prisma.labStep.deleteMany({})
    console.log('Deleted old LabChecklist and LabStep rows to allow Prisma push.');
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
