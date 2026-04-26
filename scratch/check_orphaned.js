const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Checking for orphaned profiles (no matching auth user)...')
  const profiles = await prisma.profile.findMany({
    select: { userId: true, fullName: true }
  })
  
  const orphaned = []
  for (const p of profiles) {
    const auth = await prisma.authUser.findUnique({ where: { id: p.userId } })
    if (!auth) {
      orphaned.push(p)
    }
  }
  
  console.log(`Found ${orphaned.length} orphaned profiles:`)
  orphaned.forEach(p => console.log(`  - ID: ${p.userId}, Name: ${p.fullName}`))
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
