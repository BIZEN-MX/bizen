const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const topics = await prisma.topic.findMany({
    orderBy: { displayOrder: 'asc' }
  });
  console.log(JSON.stringify(topics, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
