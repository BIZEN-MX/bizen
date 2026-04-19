
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkTopic() {
  try {
    const topic = await prisma.topic.findUnique({
      where: { id: 'tema-01' },
      include: {
        courses: {
          include: {
            lessons: true
          }
        }
      }
    })
    console.log('TOPIC_FOUND:', JSON.stringify(topic, null, 2))
  } catch (error) {
    console.error('DB_ERROR:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkTopic()
