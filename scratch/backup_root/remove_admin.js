const { PrismaClient } = require('@prisma/client');

async function run() {
    const prisma = new PrismaClient();

    try {
        const result = await prisma.$executeRaw`
      UPDATE public.profiles
      SET role = 'student'
      WHERE user_id::uuid IN (
        SELECT id FROM auth.users WHERE email = 'diegopenita31@gmail.com'
      )
    `;

        console.log("Rows affected:", result);
    } catch (error) {
        console.error("Error running query:", error);
    } finally {
        await prisma.$disconnect();
    }
}

run();
