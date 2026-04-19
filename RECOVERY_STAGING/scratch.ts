import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const profile = await prisma.profile.findFirst({
    where: { email: 'diegopenita31@gmail.com' },
  })
  console.log(profile)
}
main()
