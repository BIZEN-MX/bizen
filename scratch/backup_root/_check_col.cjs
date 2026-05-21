const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const meta = await prisma.$queryRaw`
    SELECT column_name, data_type, character_maximum_length 
    FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'dna_profile'
  `;
  console.log(JSON.stringify(meta, null, 2));
  await prisma.$disconnect();
}
run();
