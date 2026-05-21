const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    try {
        const topics = await prisma.topic.findMany({
            include: {
                _count: {
                    select: {
                        courses: true,
                        enrollments: true
                    }
                }
            },
            orderBy: {
                displayOrder: 'asc'
            }
        });
        console.log('SUCCESS: Fetched', topics.length, 'topics');
    } catch (e) {
        console.error('FAILURE:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}
main();
