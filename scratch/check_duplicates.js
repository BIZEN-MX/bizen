const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Checking for duplicate emails in auth.users...')
  
  // Since auth schema might not be fully accessible via standard prisma queries 
  // (unless we use raw queries or the model is properly mapped), 
  // and AuthUser IS in our schema, we can try to use it.
  
  const duplicates = await prisma.$queryRaw`
    SELECT email, COUNT(*) 
    FROM auth.users 
    GROUP BY email 
    HAVING COUNT(*) > 1
  `
  
  console.log('Duplicate emails found:', duplicates)
  
  if (duplicates.length === 0) {
    console.log('No duplicate emails found in auth.users.')
  } else {
    for (const dup of duplicates) {
      const users = await prisma.authUser.findMany({
        where: { email: dup.email },
        orderBy: { created_at: 'asc' }
      })
      console.log(`Email: ${dup.email} has ${users.length} users.`)
      users.forEach(u => {
        console.log(`  - ID: ${u.id}, CreatedAt: ${u.created_at}`)
      })
    }
  }

  console.log('\nChecking for duplicate usernames in public.profiles...')
  const dupUsernames = await prisma.$queryRaw`
    SELECT username, COUNT(*) 
    FROM public.profiles 
    WHERE username IS NOT NULL AND username != ''
    GROUP BY username 
    HAVING COUNT(*) > 1
  `
  console.log('Duplicate usernames found:', dupUsernames)
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
