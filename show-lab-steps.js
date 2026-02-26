const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const steps = await prisma.labStep.findMany({
        select: {
            title: true,
            track: {
                select: {
                    title: true
                }
            }
        }
    });

    console.log("Here are the affected Lab Steps grouping by track:");
    const grouped = steps.reduce((acc, step) => {
        const trackTitle = step.track?.title || 'Unknown Track';
        if (!acc[trackTitle]) acc[trackTitle] = [];
        acc[trackTitle].push(step.title);
        return acc;
    }, {});

    for (const [track, titles] of Object.entries(grouped)) {
        console.log(`\nTrack: ${track}`);
        titles.forEach(t => console.log(`  - ${t}`));
    }
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
