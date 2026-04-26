const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const samples = await prisma.profile.findMany({
    take: 5
  })
  console.log(JSON.stringify(samples, null, 2))
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
