const { PrismaClient } = require('@prisma/client');

async function run() {
  const prisma = new PrismaClient();

  try {
    const result = await prisma.$queryRaw`
      SELECT p.full_name, p.role, u.email 
      FROM public.profiles p
      JOIN auth.users u ON p.user_id::uuid = u.id
      WHERE p.role IN ('school_admin', 'teacher')
    `;

    console.log("Admin Data:");
    console.table(result);
  } catch (error) {
    console.error("Error running query:", error);
  } finally {
    await prisma.$disconnect();
  }
}

run();
