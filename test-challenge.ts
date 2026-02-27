import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        console.log("Querying for today:", today.toISOString());

        // This is exactly what the route does
        const challenge = await prisma.dailyChallenge.findFirst({
            where: { activeDate: today }
        });

        console.log("Success! Challenge:", challenge);
    } catch (e) {
        console.error("FAILED!");
        console.error(e);
        console.error(JSON.stringify(e, null, 2));
    } finally {
        await prisma.$disconnect();
    }
}

main();
