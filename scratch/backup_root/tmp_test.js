const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const roles = await prisma.profile.groupBy({
        by: ['role'],
        _count: { role: true }
    });
    console.log(roles);

    const schools = await prisma.profile.findMany({
        where: { schoolId: { not: null } },
        take: 5
    });
    console.log('Profiles with schoolId:', schools);

    await prisma.$disconnect();
}
main().catch(console.error);
