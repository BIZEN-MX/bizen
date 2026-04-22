import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const slugToCheck = "intro-finanzas-empresariales"
  const lesson = await prisma.lesson.findUnique({
    where: { id: slugToCheck }
  })

  if (lesson) {
    console.log(`[Check] Lesson '${slugToCheck}' found in DB.`)
  } else {
    console.warn(`[Check] Lesson '${slugToCheck}' NOT found in DB.`)
    
    // Let's count lessons per topic
    const counts = await prisma.course.findMany({
      include: {
        _count: { select: { lessons: true } },
        topic: true
      }
    })
    
    for (const c of counts) {
      console.log(`Topic: ${c.topicId} | Course: ${c.title} | Lessons: ${c._count.lessons}`)
    }
  }
}

main().finally(() => prisma.$disconnect())
