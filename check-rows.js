const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const steps = await prisma.labStep.count()
    const checklists = await prisma.labChecklist.count()
    console.log(`LabSteps: ${steps}`)
    console.log(`LabChecklists: ${checklists}`)
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
