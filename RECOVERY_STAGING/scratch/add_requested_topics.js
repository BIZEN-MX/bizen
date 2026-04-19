const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const topics = [
    {
      id: 'tema-01',
      title: 'Introducción a las finanzas y economía',
      description: 'Conceptos fundamentales de cómo funciona el dinero y el sistema económico.',
      level: 'Economía',
      icon: 'Presentation',
      displayOrder: 1,
      isActive: true
    },
    {
      id: 'tema-02',
      title: 'Finanzas personales',
      description: 'Aprende a gestionar tu dinero, crear presupuestos y alcanzar tus metas financieras.',
      level: 'Fundamentos',
      icon: 'Wallet',
      displayOrder: 2,
      isActive: true
    },
    {
      id: 'tema-03',
      title: 'Finanzas Bursátiles',
      description: 'El mundo de las inversiones en bolsa, acciones, bonos y fondos de inversión.',
      level: 'Inversión',
      icon: 'TrendingUp',
      displayOrder: 3,
      isActive: true
    },
    {
      id: 'tema-04',
      title: 'Finanzas para mi negocio',
      description: 'Herramientas financieras esenciales para emprendedores y dueños de negocios.',
      level: 'Negocios',
      icon: 'Briefcase',
      displayOrder: 4,
      isActive: true
    }
  ];

  for (const topic of topics) {
    console.log(`Upserting topic: ${topic.title}`);
    await prisma.topic.upsert({
      where: { id: topic.id },
      update: topic,
      create: topic
    });
  }

  console.log('✅ Topics added successfully');
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
