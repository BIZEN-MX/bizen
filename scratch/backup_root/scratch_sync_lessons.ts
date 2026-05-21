import { PrismaClient } from '@prisma/client'
import { TEMA2_SUBTEMAS } from './src/app/courses/tema2-data'
import { TEMA3_SUBTEMAS } from './src/app/courses/tema3-data'
import { TEMA4_SUBTEMAS } from './src/app/courses/tema4-data'

const prisma = new PrismaClient()

async function syncLessons() {
  const allSubtemas = [
    ...TEMA2_SUBTEMAS,
    ...TEMA3_SUBTEMAS,
    ...TEMA4_SUBTEMAS,
  ]

  let updateCount = 0

  for (const sub of allSubtemas) {
    for (const lesson of sub.lessons) {
      // Find lesson by ID (slug)
      const dbLesson = await prisma.lesson.findUnique({
        where: { id: lesson.slug }
      })

      if (dbLesson) {
        if (dbLesson.title !== lesson.title) {
          await prisma.lesson.update({
            where: { id: lesson.slug },
            data: { title: lesson.title }
          })
          console.log(`Updated ${lesson.slug}: "${dbLesson.title}" -> "${lesson.title}"`)
          updateCount++
        }
      } else {
        console.log(`Warning: Lesson ${lesson.slug} not found in DB`)
      }
    }
  }

  console.log(`Successfully updated ${updateCount} lesson titles in the database.`)
}

syncLessons()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
