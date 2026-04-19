import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const symbols = await prisma.market_symbols.findMany();
  console.log("Symbols:", symbols);
  
  const holding = await prisma.simulator_portfolios.findFirst({
    include: { holdings: true }
  });
  console.log("Portfolios with holdings:", holding);
}
main().catch(console.error).finally(() => prisma.$disconnect());
