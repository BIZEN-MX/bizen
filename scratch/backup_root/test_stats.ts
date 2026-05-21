
import { PrismaClient } from "@prisma/client"
import { calculateLevel, xpInCurrentLevel, totalXpForNextLevel, xpForNextLevel, calculateCurrentStreak } from "./src/lib/xp"

const prisma = new PrismaClient()

async function testStats() {
    try {
        const user = { id: "18164799-c4c9-4a23-b69a-8b15b54918de" }

        console.log("Fetching profile...");
        const profile = await prisma.profile.findUnique({
            where: { userId: user.id },
            select: { xp: true, bizcoins: true, level: true, createdAt: true, currentStreak: true, lastActive: true, schoolId: true }
        });

        if (!profile) throw new Error("Profile not found");

        const currentXp = profile.xp || 0;
        console.log("currentXp:", currentXp);

        const currentLevel = calculateLevel(currentXp);
        console.log("currentLevel:", currentLevel);

        const xpInLevel = xpInCurrentLevel(currentXp);
        console.log("xpInLevel:", xpInLevel);

        const totalXpNeeded = totalXpForNextLevel(currentXp);
        console.log("totalXpNeeded:", totalXpNeeded);

        const xpRemaining = xpForNextLevel(currentXp);
        console.log("xpRemaining:", xpRemaining);

        const currentStreakCount = calculateCurrentStreak(profile.lastActive, profile.currentStreak || 0);
        console.log("streakCount:", currentStreakCount);

        console.log("All XP functions succeeded.");
    } catch (err) {
        console.error("Test failed:", err);
    } finally {
        await prisma.$disconnect();
    }
}

testStats();
