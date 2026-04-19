const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const tableExists = await prisma.$queryRawUnsafe("SELECT to_regclass('public.achievements') as exists");
  console.log("Table exists:", tableExists);
  if (tableExists[0].exists) {
    const achievements = await prisma.$queryRawUnsafe('SELECT count(*) FROM "public"."achievements"');
    console.log("Achievements count:", achievements);
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
