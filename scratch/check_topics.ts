import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const topics = await prisma.topic.findMany({
    orderBy: { displayOrder: 'asc' },
    take: 5
  })
  console.log(topics.map(t => `${t.displayOrder}: ${t.id} - ${t.title}`))
}
main()
