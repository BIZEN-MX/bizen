const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const topicId = 'tema-04';
  const subtemas = [
    {
      title: "1. Introducción a las finanzas empresariales",
      lessons: [
        { title: "Qué son las finanzas empresariales", slug: "intro-finanzas-empresariales" },
        { title: "Importancia en un negocio", slug: "importancia-negocio" },
      ]
    },
    {
      title: "2. Modelo de negocio",
      lessons: [
        { title: "Qué es un modelo de negocio", slug: "que-es-modelo-negocio" },
        { title: "Cómo genera ingresos", slug: "generacion-ingresos" },
        { title: "Tipos de modelo de negocio", slug: "tipos-modelo-negocio" },
      ]
    },
    {
      title: "3. Herramientas de modelo de negocio",
      lessons: [
        { title: "Business Model Canvas", slug: "business-model-canvas" },
        { title: "Roadmap de negocio", slug: "roadmap-negocio" },
        { title: "Propuesta de valor", slug: "propuesta-de-valor" },
      ]
    },
    {
      title: "4. Gestión de clientes",
      lessons: [
        { title: "Qué es un CRM", slug: "que-es-crm" },
        { title: "Importancia de los clientes", slug: "importancia-clientes" },
        { title: "Retención y fidelización", slug: "retencion-fidelizacion" },
      ]
    },
    {
      title: "5. Ingresos del negocio",
      lessons: [
        { title: "Tipos de ingresos", slug: "tipos-ingresos-negocio" },
        { title: "Proyección de ingresos", slug: "proyeccion-ingresos" },
      ]
    },
    {
      title: "6. Costos",
      lessons: [
        { title: "Qué son los costos", slug: "que-son-costos-negocio" },
        { title: "Costos fijos", slug: "costos-fijos" },
        { title: "Costos variables", slug: "costos-variables" },
      ]
    },
    {
      title: "7. Cálculo de costos",
      lessons: [
        { title: "Cómo calcular costos", slug: "calculo-costos-negocio" },
        { title: "Costo total", slug: "costo-total" },
        { title: "Costo por producto o servicio", slug: "costo-unitario" },
      ]
    },
    {
      title: "8. Precios",
      lessons: [
        { title: "Cómo fijar precios", slug: "fijacion-precios" },
        { title: "Relación costo-precio", slug: "relacion-costo-precio" },
        { title: "Margen de ganancia", slug: "margen-ganancia" },
      ]
    },
    {
      title: "9. Salarios",
      lessons: [
        { title: "Cómo definir sueldos", slug: "definir-sueldos" },
        { title: "Costos de empleados", slug: "costos-empleados" },
        { title: "Nómina básica", slug: "nomina-basica" },
      ]
    },
    {
      title: "10. Punto de equilibrio",
      lessons: [
        { title: "Qué es el punto de equilibrio", slug: "punto-equilibrio-que-es" },
        { title: "Cómo calcularlo", slug: "calculo-punto-equilibrio" },
        { title: "Importancia estratégica", slug: "importancia-punto-equilibrio" },
      ]
    },
    {
      title: "11. Flujo de efectivo",
      lessons: [
        { title: "Entradas y salidas de dinero", slug: "flujo-efectivo-negocio" },
        { title: "Control de efectivo", slug: "control-efectivo" },
        { title: "Importancia del flujo", slug: "importancia-flujo" },
      ]
    },
    {
      title: "12. Estados financieros",
      lessons: [
        { title: "Qué son los estados financieros", slug: "que-son-estados-financieros" },
        { title: "Estado de resultados", slug: "estado-resultados" },
        { title: "Balance general", slug: "balance-general" },
      ]
    },
    {
      title: "13. Lectura de estados financieros",
      lessons: [
        { title: "Cómo interpretar ingresos y gastos", slug: "interpretar-ingresos-gastos" },
        { title: "Utilidad y pérdidas", slug: "utilidad-y-perdidas" },
        { title: "Situación financiera", slug: "situacion-financiera" },
      ]
    },
    {
      title: "14. Razones financieras",
      lessons: [
        { title: "Qué son las razones financieras", slug: "razones-financieras-intro" },
        { title: "Liquidez", slug: "liquidez" },
        { title: "Rentabilidad", slug: "rentabilidad" },
        { title: "Endeudamiento", slug: "endeudamiento" },
      ]
    },
    {
      title: "15. Financiamiento",
      lessons: [
        { title: "Qué es el financiamiento", slug: "financiamiento-que-es" },
        { title: "Tipos de financiamiento", slug: "tipos-financiamiento" },
        { title: "Cuándo usarlo", slug: "cuando-usar-financiamiento" },
      ]
    },
    {
      title: "16. Créditos para negocio",
      lessons: [
        { title: "Tipos de crédito", slug: "creditos-negocio-tipos" },
        { title: "Cómo funcionan", slug: "funcionamiento-creditos-negocio" },
        { title: "Riesgos asociados", slug: "riesgos-creditos-negocio" },
      ]
    },
    {
      title: "17. Régimen fiscal (RESICO)",
      lessons: [
        { title: "Qué es el RESICO", slug: "que-es-resico" },
        { title: "Quién puede usarlo", slug: "quien-puede-usarlo" },
        { title: "Beneficios básicos", slug: "beneficios-resico" },
      ]
    },
    {
      title: "18. Evaluación de un negocio",
      lessons: [
        { title: "Rentabilidad", slug: "evaluacion-rentabilidad" },
        { title: "Crecimiento", slug: "evaluacion-crecimiento" },
        { title: "Viabilidad", slug: "viabilidad-negocio" },
      ]
    },
    {
      title: "19. Protección del negocio",
      lessons: [
        { title: "Seguros empresariales", slug: "seguros-negocio" },
        { title: "Protección legal básica", slug: "proteccion-legal" },
        { title: "Manejo de riesgos", slug: "manejo-riesgos-negocio" },
      ]
    },
    {
      title: "20. Reinversión",
      lessons: [
        { title: "Qué es la reinversión", slug: "que-es-reinversion" },
        { title: "Importancia estratégica", slug: "importancia-reinversion" },
        { title: "Estrategias de reinversión", slug: "estrategias-reinversion" },
      ]
    },
    {
      title: "21. Toma de decisiones financieras",
      lessons: [
        { title: "Análisis de opciones", slug: "analisis-opciones" },
        { title: "Optimización de recursos", slug: "optimizacion-recursos" },
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

  console.log("✅ Tema 04 database structure updated.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
