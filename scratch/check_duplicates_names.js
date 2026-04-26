const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Checking for duplicate Full Names in profiles...')
  const dupFullNames = await prisma.$queryRaw`
    SELECT full_name, COUNT(*) 
    FROM public.profiles 
    GROUP BY full_name 
    HAVING COUNT(*) > 1
    ORDER BY count DESC
    LIMIT 20
  `
  console.log('Duplicate Full Names found:', dupFullNames)

  if (dupFullNames.length > 0) {
    for (const dup of dupFullNames) {
      const profiles = await prisma.profile.findMany({
        where: { fullName: dup.full_name },
        select: { userId: true, fullName: true, createdAt: true }
      })
      console.log(`\nName: "${dup.full_name}" has ${profiles.length} profiles.`)
      // Try to find the emails for these users
      for (const p of profiles) {
        const auth = await prisma.authUser.findUnique({ where: { id: p.userId } })
        console.log(`  - ID: ${p.userId}, Email: ${auth?.email}, CreatedAt: ${p.createdAt}`)
      }
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
