import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const lessons = await prisma.lesson.findMany({
    where: {
      course: {
        topicId: {
          in: ["tema-03", "tema-04"]
        }
      }
    },
    select: { id: true, title: true }
  })
  console.log("Lessons found:", lessons.slice(0, 10))
}

main().catch(console.error).finally(() => prisma.$disconnect())
