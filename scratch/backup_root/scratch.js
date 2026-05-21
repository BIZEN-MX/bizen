const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL + "?sslmode=disable"
    }
  }
});

async function test() {
  try {
    console.log("Connecting with SSL disabled...");
    const topic = await prisma.topic.findFirst();
    console.log("DB SUCCESS:", topic?.title || "No topics found");
  } catch (err) {
    console.error("DB ERROR MESSAGE:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
