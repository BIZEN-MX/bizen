import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.user.findMany({ include: { profile: true } });
  console.log("Users:", users.length);
  if (users.length > 0) {
     console.log("First user profile:", users[0].profile);
  }
}
main();
