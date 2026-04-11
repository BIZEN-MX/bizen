const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- Iniciando Activación de la Base de Datos ---');
  
  try {
    const school = await prisma.school.upsert({
      where: { id: 'sch_1' },
      update: {},
      create: {
        id: 'sch_1',
        name: 'Bizen Academy',
      },
    });
    console.log('✅ Colegio sch_1 listo:', school.name);

    // También creamos el primer curso básico para que no veas el dashboard vacío
    const topic = await prisma.topic.upsert({
      where: { id: 'default_topic' },
      update: {},
      create: {
        id: 'default_topic',
        title: 'Bienvenidos a Bizen',
        level: 'Básico',
        isActive: true,
      },
    });
    console.log('✅ Curso inicial listo:', topic.title);

  } catch (error) {
    console.error('❌ Error initializing DB:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
