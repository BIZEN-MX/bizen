
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('--- DATABASE INSPECTION ---')
  try {
    const topics = await prisma.topic.count()
    const courses = await prisma.course.count()
    const lessons = await prisma.lesson.count()
    const profiles = await prisma.profile.count()
    const professions = await prisma.profession.count()
    const items = await prisma.userInventoryItem.count()

    console.log(`Topics: ${topics}`)
    console.log(`Courses: ${courses}`)
    console.log(`Lessons: ${lessons}`)
    console.log(`Profiles: ${profiles}`)
    console.log(`Professions: ${professions}`)
    console.log(`Inventory Items: ${items}`)
  } catch (e) {
    console.error('Inspection failed:', e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
