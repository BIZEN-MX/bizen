const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const topicId = 'tema-03';
  const subtemas = [
    {
      title: "1. Introducción a la bolsa",
      lessons: [
        { title: "Qué es la bolsa de valores", slug: "bolsa-que-es" },
        { title: "Para qué sirve", slug: "bolsa-para-que" },
        { title: "Cómo funciona de forma general", slug: "bolsa-como-funciona" },
      ]
    },
    {
      title: "2. Participantes del mercado",
      lessons: [
        { title: "Inversionistas", slug: "inversionistas" },
        { title: "Empresas", slug: "empresas-listadas" },
        { title: "Intermediarios (casas de bolsa)", slug: "intermediarios-casas-bolsa" },
      ]
    },
    {
      title: "3. Conceptos básicos de inversión",
      lessons: [
        { title: "Qué es invertir", slug: "que-es-invertir" },
        { title: "Diferencia entre ahorrar e invertir", slug: "ahorro-vs-inversion" },
        { title: "Rendimiento y riesgo", slug: "rendimiento-y-riesgo" },
      ]
    },
    {
      title: "4. Tipos de instrumentos",
      lessons: [
        { title: "Acciones", slug: "instrumentos-acciones" },
        { title: "ETFs", slug: "instrumentos-etfs" },
        { title: "Bonos", slug: "instrumentos-bonos" },
        { title: "Fondos de inversión", slug: "instrumentos-fondos" },
      ]
    },
    {
      title: "5. Acciones",
      lessons: [
        { title: "Qué es una acción", slug: "accion-definicion" },
        { title: "Cómo se gana dinero (dividendos y plusvalía)", slug: "dividendos-y-plusvalia" },
        { title: "Empresas públicas", slug: "empresas-publicas" },
      ]
    },
    {
      title: "6. ETFs",
      lessons: [
        { title: "Qué son", slug: "etfs-definicion" },
        { title: "Cómo funcionan", slug: "etfs-funcionamiento" },
        { title: "Ventajas", slug: "etfs-ventajas" },
      ]
    },
    {
      title: "7. Bonos",
      lessons: [
        { title: "Qué son", slug: "bonos-definicion" },
        { title: "Cómo generan rendimiento", slug: "bonos-rendimiento" },
      ]
    },
    {
      title: "8. Cómo empezar a invertir",
      lessons: [
        { title: "Abrir una cuenta", slug: "abrir-cuenta-inversion" },
        { title: "Elegir plataforma", slug: "elegir-plataforma" },
        { title: "Primeros pasos", slug: "primeros-pasos-inversion" },
      ]
    },
    {
      title: "9. Compra y venta",
      lessons: [
        { title: "Qué es comprar y vender", slug: "compra-venta-bolsa" },
        { title: "Tipos de órdenes básicas", slug: "ordenes-basicas" },
      ]
    },
    {
      title: "10. Rendimiento",
      lessons: [
        { title: "Qué es el rendimiento", slug: "rendimiento-que-es" },
        { title: "Cómo se calcula de forma básica", slug: "calculo-rendimiento" },
      ]
    },
    {
      title: "11. Riesgo",
      lessons: [
        { title: "Qué es el riesgo", slug: "riesgo-financiero" },
        { title: "Tipos de riesgo", slug: "tipos-de-riesgo" },
        { title: "Relación riesgo-rendimiento", slug: "relacion-riesgo-rendimiento" },
      ]
    },
    {
      title: "12. Diversificación",
      lessons: [
        { title: "Qué es", slug: "diversificacion-que-es" },
        { title: "Importancia", slug: "importancia-diversificacion" },
        { title: "Ejemplos", slug: "ejemplos-diversificacion" },
      ]
    },
    {
      title: "13. Horizonte de inversión",
      lessons: [
        { title: "Corto plazo", slug: "corto-plazo" },
        { title: "Mediano plazo", slug: "mediano-plazo" },
        { title: "Largo plazo", slug: "largo-plazo" },
      ]
    },
    {
      title: "14. Estrategias básicas",
      lessons: [
        { title: "Inversión a largo plazo", slug: "estrategia-largo-plazo" },
        { title: "Trading básico", slug: "trading-basico" },
        { title: "Inversión periódica", slug: "inversion-periodica" },
      ]
    },
    {
      title: "15. Lectura de mercado",
      lessons: [
        { title: "Qué son las gráficas", slug: "graficas-que-son" },
        { title: "Tendencias básicas", slug: "tendencias-mercado" },
        { title: "Noticias financieras", slug: "noticias-financieras" },
      ]
    },
    {
      title: "16. Tipos de gráficas",
      lessons: [
        { title: "Gráficas de líneas", slug: "graficas-lineas" },
        { title: "Gráficas de velas japonesas", slug: "velas-japonesas" },
        { title: "Cómo interpretarlas", slug: "interpretacion-graficas" },
      ]
    },
    {
      title: "17. Portafolio",
      lessons: [
        { title: "Qué es", slug: "portafolio-definicion" },
        { title: "Cómo se construye", slug: "construccion-portafolio" },
        { title: "Balanceo", slug: "balanceo-portafolio" },
      ]
    },
    {
      title: "18. Psicología del inversionista",
      lessons: [
        { title: "Emociones al invertir", slug: "emociones-inversion" },
        { title: "Errores comunes", slug: "errores-psicologicos" },
        { title: "Disciplina", slug: "disciplina-financiera" },
      ]
    },
    {
      title: "19. Errores comunes al invertir",
      lessons: [
        { title: "No diversificar", slug: "no-diversificar" },
        { title: "Invertir sin conocimiento", slug: "invertir-sin-conocimiento" },
        { title: "Seguir “modas”", slug: "seguir-modas" },
      ]
    },
    {
      title: "20. Seguridad al invertir",
      lessons: [
        { title: "Fraudes", slug: "fraudes-inversion" },
        { title: "Plataformas confiables", slug: "plataformas-confiables" },
        { title: "Protección al usuario", slug: "proteccion-usuario" },
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

  console.log("✅ Tema 03 database structure updated.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
