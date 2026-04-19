const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkRows() {
  try {
    const counts = {
      profiles: await prisma.profile.count(),
      topics: await prisma.topic.count(),
      courses: await prisma.course.count(),
      lessons: await prisma.lesson.count(),
      simulators: await prisma.simulator.count(),
      portfolioCount: await prisma.simulator_portfolios.count(),
      marketPrices: await prisma.market_prices_eod.count()
    };
    console.log(JSON.stringify(counts, null, 2));
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkRows();
