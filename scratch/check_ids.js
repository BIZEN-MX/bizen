const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const profiles = await prisma.profile.findMany({ take: 5 })
  console.log('--- PROFILES ---')
  profiles.forEach(p => console.log(`ID: ${p.userId}, Name: ${p.fullName}`))

  const threads = await prisma.forumThread.findMany({ take: 5, select: { authorId: true } })
  console.log('\n--- THREAD AUTHOR IDs ---')
  threads.forEach(t => console.log(`AuthorID: ${t.authorId}`))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
