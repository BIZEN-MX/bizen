
const { PrismaClient } = require("./node_modules/@prisma/client");
const prisma = new PrismaClient();

async function checkCounts() {
    try {
        const profileCount = await prisma.profile.count();
        const schoolCount = await prisma.school.count();
        const forumThreadCount = await prisma.forumThread.count();

        console.log(`Profiles: ${profileCount}`);
        console.log(`Schools: ${schoolCount}`);
        console.log(`Forum Threads: ${forumThreadCount}`);

        if (profileCount > 0) {
            const sample = await prisma.profile.findMany({ take: 5 });
            console.log('Sample Profiles:', JSON.stringify(sample, null, 2));
        }
    } catch (err) {
        console.error('Database Error:', err.message);
    } finally {
        await prisma.$disconnect();
    }
}

checkCounts();
