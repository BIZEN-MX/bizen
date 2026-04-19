const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const idsToDelete = ['welcome-topic', 'default_topic'];
  
  for (const id of idsToDelete) {
    try {
      console.log(`Deleting topic with ID: ${id}`);
      await prisma.topic.delete({
        where: { id }
      });
      console.log(`✅ Topic ${id} deleted.`);
    } catch (e) {
      console.log(`⚠️ Could not delete topic ${id} (maybe it doesn't exist or has relations): ${e.message}`);
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
