const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const latest = await prisma.market_prices_eod.findMany({
    orderBy: { date: 'desc' },
    take: 1
  });
  console.log('Latest Price Date:', latest[0]?.date);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
