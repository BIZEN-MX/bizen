
const { PrismaClient } = require("./node_modules/@prisma/client");
const prisma = new PrismaClient();

async function testStats() {
    try {
        const user = { id: "18164799-c4c9-4a23-b69a-8b15b54918de" }; // Use a known user ID

        console.log("Fetching profile...");
        const profile = await prisma.profile.findUnique({
            where: { userId: user.id },
            select: { xp: true, bizcoins: true, level: true, createdAt: true, currentStreak: true, lastActive: true, schoolId: true }
        });
        console.log("Profile:", profile);

        console.log("Fetching progress...");
        const progress = await prisma.progress.count({
            where: { userId: user.id, percent: 100, completedAt: { not: null } }
        });
        console.log("Progress Count:", progress);

        console.log("Fetching enrollments...");
        const enrollments = await prisma.enrollment.count({
            where: { userId: user.id }
        });
        console.log("Enrollment Count:", enrollments);

        console.log("Fetching certificates...");
        const certs = await prisma.certificate.count({
            where: { userId: user.id }
        });
        console.log("Certificates Count:", certs);

        console.log("Fetching inventory...");
        const inventoryItems = await prisma.userInventoryItem.findMany({
            where: { userId: user.id },
            select: { productId: true }
        });
        console.log("Inventory:", inventoryItems);

        console.log("Fetching weekly evidence...");
        const now = new Date();
        const sunday = new Date(now);
        sunday.setDate(now.getDate() - now.getDay());
        sunday.setHours(0, 0, 0, 0);
        const saturday = new Date(sunday);
        saturday.setDate(sunday.getDate() + 6);
        saturday.setHours(23, 59, 59, 999);

        const weeklyEvidence = await prisma.evidencePost.findMany({
            where: { authorUserId: user.id, createdAt: { gte: sunday, lte: saturday } },
            select: { createdAt: true }
        });
        console.log("Weekly Evidence:", weeklyEvidence);

        console.log("Testing XP functions...");
        const { calculateLevel, getMexicoMidnight, calculateCurrentStreak } = require("./src/lib/xp.js");
        // Wait, typescript cannot be required easily from js. Let's just mock it.

        console.log("All queries executed properly.");
    } catch (err) {
        console.error("Test failed:", err);
    } finally {
        await prisma.$disconnect();
    }
}

testStats();
