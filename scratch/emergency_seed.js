const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  console.log('🌱 Starting Emergency Seed...');

  try {
    // 1. Topics
    console.log('📖 Seeding Topics...');
    const welcomeTopic = await prisma.topic.upsert({
      where: { id: 'welcome-topic' },
      update: {},
      create: {
        id: 'welcome-topic',
        title: 'Bienvenidos a Bizen',
        description: 'Todo lo que necesitas saber para empezar tu camino financiero.',
        level: 'Beginner',
        isActive: true,
        displayOrder: 1
      }
    });

    // 2. Courses
    console.log('📦 Seeding Courses...');
    const mainCourse = await prisma.course.upsert({
      where: { id: 'main-course' },
      update: {},
      create: {
        id: 'main-course',
        topicId: welcomeTopic.id,
        title: 'Fundamentos Financieros',
        description: 'Aprende las bases de la economía y las finanzas personales.',
        order: 1,
        isActive: true
      }
    });

    // 3. Simulators
    console.log('🎮 Seeding Simulators...');
    const simulators = [
      { slug: 'stocks', title: 'BIZEN Market', category: 'investment', iconName: 'TrendingUp', description: 'Simulador de bolsa en tiempo real.', sortOrder: 1 },
      { slug: 'credit', title: 'BIZEN Score', category: 'credit', iconName: 'CreditCard', description: 'Simulador de historial crediticio.', sortOrder: 2 },
      { slug: 'savings-goal', title: 'Metas de Ahorro', category: 'savings', iconName: 'PiggyBank', description: 'Planifica tus objetivos financieros.', sortOrder: 3 },
      { slug: 'inflation-calculator', title: 'Calculadora de Inflación', category: 'inflation', iconName: 'Percent', description: 'Mira cómo el tiempo afecta tu dinero.', sortOrder: 4 }
    ];

    for (const s of simulators) {
      await prisma.simulator.upsert({
        where: { slug: s.slug },
        update: { ...s, isActive: true },
        create: { ...s, isActive: true }
      });
    }

    // 4. Market Symbols
    console.log('📈 Seeding Market Symbols...');
    const symbols = [
      { symbol: 'AAPL', name: 'Apple Inc.', type: 'Stock' },
      { symbol: 'TSLA', name: 'Tesla, Inc.', type: 'Stock' },
      { symbol: 'BTC-USD', name: 'Bitcoin', type: 'Crypto' },
      { symbol: 'AMZN', name: 'Amazon.com, Inc.', type: 'Stock' },
      { symbol: 'GOOGL', name: 'Alphabet Inc.', type: 'Stock' },
      { symbol: 'MSFT', name: 'Microsoft Corporation', type: 'Stock' },
      { symbol: 'NVDA', name: 'NVIDIA Corporation', type: 'Stock' },
      { symbol: 'VOO', name: 'Vanguard S&P 500 ETF', type: 'ETF' }
    ];

    for (const s of symbols) {
      await prisma.market_symbols.upsert({
        where: { symbol: s.symbol },
        update: { ...s, is_active: true },
        create: { ...s, is_active: true }
      });
    }

    console.log('✨ Seed Complete! Refresh the app to see the changes.');
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
