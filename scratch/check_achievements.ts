import { prisma } from "../src/lib/prisma";

async function check() {
  try {
    const count = await prisma.achievement.count();
    console.log("Achievement count:", count);
    const achievements = await prisma.achievement.findMany();
    console.log("Achievements:", JSON.stringify(achievements, null, 2));
  } catch (err) {
    console.error("Error:", err);
  } finally {
    process.exit(0);
  }
}

check();
