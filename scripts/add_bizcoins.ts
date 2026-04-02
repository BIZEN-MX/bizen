import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const email = 'diego@bizen.mx'
  
  // Find the AuthUser by email
  // Using findFirst because email might not be in the Unique input for some reason in the client
  const user = await prisma.authUser.findFirst({
    where: { email: { equals: email, mode: 'insensitive' } }
  })

  if (!user) {
    console.error(`User with email ${email} not found in auth.users.`)
    return
  }

  console.log('User found:', user.id)

  // Find the Profile by userId
  const profile = await prisma.profile.findUnique({
    where: { userId: user.id }
  })

  if (!profile) {
    console.error(`Profile for userId ${user.id} not found in public.profiles.`)
    return
  }

  console.log('Current Bizcoins:', profile.bizcoins)

  // Update the Profile
  const updatedProfile = await prisma.profile.update({
    where: { userId: user.id },
    data: {
      bizcoins: {
        increment: 50000
      }
    }
  })

  // Create WalletTransaction
  await prisma.walletTransaction.create({
    data: {
      userId: user.id,
      amount: 50000,
      type: 'income',
      category: 'admin_adjustment',
      description: 'Ajuste administrativo de 50,000 Bizcoins'
    }
  })

  console.log('Updated Bizcoins:', updatedProfile.bizcoins)
  console.log('Transaction logged successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
