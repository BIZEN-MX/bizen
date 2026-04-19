const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const topics = [
    { id: 'tema-01', title: 'Introducción a las finanzas y economía', order: 1 },
    { id: 'tema-02', title: 'Finanzas personales', order: 2 },
    { id: 'tema-03', title: 'Finanzas Bursátiles', order: 3 },
    { id: 'tema-04', title: 'Finanzas para mi negocio', order: 4 },
  ];

  for (const t of topics) {
    console.log(`Upserting ${t.id}: ${t.title}`);
    await prisma.topic.upsert({
      where: { id: t.id },
      update: { title: t.title, displayOrder: t.order, isActive: true },
      create: { 
        id: t.id, 
        title: t.title, 
        displayOrder: t.order, 
        isActive: true, 
        level: 'Básico',
        description: '...'
      }
    });
  }

  // Delete potential duplicates or old titles
  const others = await prisma.topic.findMany({
    where: {
      id: { notIn: topics.map(t => t.id) }
    }
  });

  for (const other of others) {
    if (other.title.includes('Operativo') || other.title.includes('Bizen') || other.title.includes('Bienvenidos')) {
      console.log(`Deleting old topic: ${other.id} - ${other.title}`);
      await prisma.topic.delete({ where: { id: other.id } });
    }
  }

  console.log('✅ Synchronized first 4 topics.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
