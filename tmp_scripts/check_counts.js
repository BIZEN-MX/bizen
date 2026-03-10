const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    const topics = await prisma.topic.count();
    const lessons = await prisma.lesson.count();
    console.log('Total topics in DB:', topics);
    console.log('Total lessons in DB:', lessons);

    if (lessons > 0) {
        const samples = await prisma.lesson.findMany({
            take: 5,
            select: { id: true, title: true, courseId: true, sectionId: true }
        });
        console.log('Sample lessons:', samples);
    }
    process.exit(0);
}
main().catch(err => { console.error(err); process.exit(1); });
