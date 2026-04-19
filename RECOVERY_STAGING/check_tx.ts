import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const tx = await prisma.walletTransaction.findMany({ 
    where: { description: { contains: "Bono" } } 
  });
  console.log("Found bonus transactions:", tx);
}
main();
