const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const pending = await prisma.simulator_orders.findMany({
    where: { status: 'pending' },
    orderBy: { placed_at: 'desc' },
    take: 10
  });
  
  console.log('Pending Orders:');
  pending.forEach(o => {
    console.log(`- Order ${o.id}: ${o.side} ${o.quantity} ${o.symbol} at ${o.placed_at}`);
  });
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
