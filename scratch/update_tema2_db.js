const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const topicId = 'tema-02';
  const subtemas = [
    {
      title: "1. ¿Qué son las finanzas personales?",
      lessons: [
        { title: "Definición de finanzas personales", slug: "que-son-finanzas-personales" },
        { title: "Importancia en la vida diaria", slug: "importancia-personales" },
      ]
    },
    {
      title: "2. Administración del dinero",
      lessons: [
        { title: "Ingresos y gastos", slug: "ingresos-y-gastos" },
        { title: "Flujo de dinero", slug: "flujo-de-dinero" },
      ]
    },
    {
      title: "3. Presupuesto",
      lessons: [
        { title: "Qué es un presupuesto", slug: "que-es-presupuesto" },
        { title: "Pasos para elaborarlo", slug: "pasos-presupuesto" },
        { title: "Cómo ajustarlo", slug: "ajuste-presupuesto" },
      ]
    },
    {
      title: "4. Métodos de presupuesto",
      lessons: [
        { title: "Regla 50/30/20", slug: "regla-50-30-20" },
        { title: "Regla 60/20/20", slug: "regla-60-20-20" },
      ]
    },
    {
      title: "5. Herramientas de control financiero",
      lessons: [
        { title: "Apps financieras", slug: "apps-financieras" },
        { title: "Excel / Hojas de cálculo", slug: "excel-financiero" },
        { title: "Métodos manuales", slug: "metodos-manuales" },
      ]
    },
    {
      title: "6. Ahorro",
      lessons: [
        { title: "Qué es el ahorro", slug: "que-es-ahorro" },
        { title: "Importancia del ahorro", slug: "importancia-ahorro" },
        { title: "Metas de ahorro", slug: "metas-ahorro" },
      ]
    },
    {
      title: "7. Fondo de emergencia",
      lessons: [
        { title: "Qué es el fondo de emergencia", slug: "fondo-emergencia-definicion" },
        { title: "Para qué sirve", slug: "utilidad-fondo" },
        { title: "Cuánto ahorrar (Cálculo)", slug: "calculo-fondo" },
        { title: "Tipos básicos de inversión para emergencias", slug: "tipos-inversion-emergencia" },
      ]
    },
    {
      title: "8. Crédito",
      lessons: [
        { title: "Qué es el crédito", slug: "que-es-credito" },
        { title: "Cómo funciona", slug: "funcionamiento-credito" },
        { title: "Uso responsable", slug: "uso-responsable-credito" },
      ]
    },
    {
      title: "9. Instituciones financieras y crediticias",
      lessons: [
        { title: "Bancos tradicionales", slug: "bancos-tradicionales" },
        { title: "SOFIPOs", slug: "sofipos" },
        { title: "Fintech", slug: "fintech" },
        { title: "Otras instituciones", slug: "otras-instituciones" },
      ]
    },
    {
      title: "10. Préstamos",
      lessons: [
        { title: "Qué son los préstamos", slug: "que-son-prestamos" },
        { title: "Tipos de préstamos", slug: "tipos-prestamos" },
        { title: "Riesgos asociados", slug: "riesgos-prestamos" },
      ]
    },
    {
      title: "11. Planeación financiera personal",
      lessons: [
        { title: "Metas financieras personales", slug: "metas-financieras-personales" },
        { title: "Organización del dinero", slug: "organizacion-dinero" },
        { title: "Hábitos financieros saludables", slug: "habitos-financieros" },
      ]
    },
  ];

  console.log(`Cleaning up existing courses for topic ${topicId}...`);
  await prisma.course.deleteMany({
    where: { topicId: topicId }
  });

  for (let i = 0; i < subtemas.length; i++) {
    const sub = subtemas[i];
    console.log(`Creating Course: ${sub.title}`);
    const course = await prisma.course.create({
      data: {
        topicId: topicId,
        title: sub.title,
        order: i + 1,
        description: "",
      }
    });

    for (let j = 0; j < sub.lessons.length; j++) {
      const lessonData = sub.lessons[j];
      console.log(`  Creating Lesson: ${lessonData.title}`);
      await prisma.lesson.create({
        data: {
          id: lessonData.slug,
          courseId: course.id,
          title: lessonData.title,
          order: j + 1,
          contentType: "interactive",
          xpReward: 50,
        }
      });
    }
  }

  console.log("✅ Tema 02 database structure updated.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
