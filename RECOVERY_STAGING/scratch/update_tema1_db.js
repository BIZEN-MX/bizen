const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const topicId = 'tema-01';
  const subtemas = [
    {
      title: "1. Conceptos básicos de finanzas",
      lessons: [
        { title: "Qué son las finanzas", slug: "que-son-las-finanzas" },
        { title: "Importancia de las finanzas", slug: "importancia-de-las-finanzas" },
      ]
    },
    {
      title: "2. Conceptos básicos de economía",
      lessons: [
        { title: "Qué es la economía", slug: "que-es-la-economia" },
        { title: "Relación entre economía y vida diaria", slug: "economia-y-vida-diaria" },
      ]
    },
    {
      title: "3. El dinero",
      lessons: [
        { title: "Qué es el dinero", slug: "que-es-el-dinero" },
        { title: "Funciones del dinero", slug: "funciones-del-dinero" },
        { title: "Evolución del dinero", slug: "evolucion-del-dinero" },
      ]
    },
    {
      title: "4. Principios económicos",
      lessons: [
        { title: "Escasez", slug: "principio-escasez" },
        { title: "Recursos", slug: "recursos-economicos" },
        { title: "Elección y toma de decisiones", slug: "toma-de-decisiones" },
      ]
    },
    {
      title: "5. Oferta y demanda",
      lessons: [
        { title: "Qué es la oferta", slug: "que-es-la-oferta" },
        { title: "Qué es la demanda", slug: "que-es-la-demanda" },
        { title: "Cómo se determina el precio", slug: "determinacion-del-precio" },
      ]
    },
    {
      title: "6. El mercado",
      lessons: [
        { title: "Qué es un mercado", slug: "que-es-el-mercado" },
        { title: "Tipos de mercado", slug: "tipos-de-mercado" },
      ]
    },
    {
      title: "7. Inflación",
      lessons: [
        { title: "Qué es la inflación", slug: "que-es-la-inflacion" },
        { title: "Aumento generalizado de precios", slug: "aumento-de-precios" },
        { title: "Poder adquisitivo", slug: "poder-adquisitivo" },
      ]
    },
    {
      title: "8. Costo de oportunidad",
      lessons: [
        { title: "Qué es el costo de oportunidad", slug: "que-es-costo-oportunidad" },
        { title: "Importancia en decisiones financieras", slug: "importancia-costo-oportunidad" },
      ]
    },
    {
      title: "9. Educación financiera",
      lessons: [
        { title: "Qué es la educación financiera", slug: "que-es-educacion-financiera" },
        { title: "Por qué es importante", slug: "importancia-educacion-financiera" },
      ]
    },
    {
      title: "10. Sistema financiero en México",
      lessons: [
        { title: "Banco de México (Banxico)", slug: "banxico" },
        { title: "CONDUSEF", slug: "condusef" },
        { title: "IPAB", slug: "ipab" },
        { title: "Función de cada institución", slug: "funciones-instituciones-financieras" },
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

  console.log("✅ Tema 01 database structure updated.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
