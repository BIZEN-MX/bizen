import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const lessonId = 'dinero-como-seguridad-vs-libertad';

  // Find the lesson first to ensure it exists
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId }
  });

  if (!lesson) {
    console.error('Lesson not found:', lessonId);
    process.exit(1);
  }

  console.log('🗑️  Deleting existing steps for lesson:', lessonId);
  await prisma.lessonStep.deleteMany({
    where: { lessonId: lessonId }
  });

  const steps = [
    {
      order: 1,
      type: 'info',
      title: 'Seguridad vs Libertad',
      body: 'Dos de los pilares más fuertes en nuestra relación con el dinero son la **seguridad** y la **libertad**.\n\nAprendemos una visión u otra casi siempre en casa, viendo cómo nuestros padres manejaban sus finanzas y escuchando sus miedos y alegrías.',
      data: { 
        mood: 'thinking',
        aiInsight: 'La seguridad es el suelo que pisas; la libertad es el cielo al que aspiras. ¡Necesitas ambos para construir tu vida!',
        glossary: [
          { word: 'Seguridad', definition: 'Sensación de protección ante imprevistos o riesgos futuros.' },
          { word: 'Libertad', definition: 'Poder elegir qué hacer hoy sin depender del dinero de mañana.' }
        ]
      }
    },
    {
      order: 2,
      type: 'mcq',
      title: 'Tu búsqueda personal',
      body: 'Cuando piensas en dinero, ¿qué es lo que más buscas?',
      data: {
        question: 'Cuando piensas en dinero, ¿qué es lo que más buscas?',
        options: [
          { id: 'opt1', label: 'Tranquilidad y estabilidad', isCorrect: true },
          { id: 'opt2', label: 'Poder elegir y moverme libremente', isCorrect: true },
          { id: 'opt3', label: 'Depende del día', isCorrect: true },
          { id: 'opt4', label: 'No estoy seguro', isCorrect: true }
        ],
        graded: false, 
        shuffle: true,
        baselineLabel: 'orientación seguridad vs libertad'
      }
    },
    {
      order: 3,
      type: 'info',
      title: 'Dos enfoques diferentes',
      body: '• **Enfoque en Seguridad**: priorizas el ahorro, evitas riesgos y buscas estabilidad antes que nada.\n• **Enfoque en Libertad**: priorizas tener opciones, poder moverte de un lugar a otro y no ser atado a un empleo por necesidad.',
      data: { 
        mood: 'explaining',
        aiInsight: 'Sin seguridad, la libertad es solo un riesgo. Sin libertad, la seguridad es solo una jaula. ¡Busca el balance!'
      }
    },
    {
      order: 4,
      type: 'mcq',
      title: 'Identificando el enfoque',
      body: '¿Qué enfoque domina según los criterios aprendidos?',
      data: {
        question: '¿Qué enfoque domina según los criterios aprendidos?',
        description: 'Daniela siempre guarda tres meses de gastos en una cuenta aparte solo para estar tranquila por si algo pasa.',
        options: [
          { id: 'opt1', label: 'Seguridad', isCorrect: true },
          { id: 'opt2', label: 'Libertad', isCorrect: false },
          { id: 'opt3', label: 'Riesgo', isCorrect: false },
          { id: 'opt4', label: 'Herramienta', isCorrect: false }
        ],
        feedback: '¡Exacto! Priorizar la base de protección ante imprevistos es seguridad pura.',
        shuffle: true
      }
    },
    {
      order: 5,
      type: 'mcq',
      title: 'Identificando el enfoque',
      body: '¿Qué enfoque domina aquí?',
      data: {
        question: '¿Qué enfoque domina aquí?',
        description: 'Javier prefiere no subir su nivel de gastos para poder aceptar un trabajo con menos sueldo que le dé el triple de vacaciones.',
        options: [
          { id: 'opt1', label: 'Seguridad', isCorrect: false },
          { id: 'opt2', label: 'Libertad', isCorrect: true },
          { id: 'opt3', label: 'Lujo', isCorrect: false },
          { id: 'opt4', label: 'Control', isCorrect: false }
        ],
        feedback: '¡Correcto! El dinero como medio para comprar tiempo y elegir tu estilo de vida es libertad.',
        shuffle: true
      }
    },
    {
      order: 6,
      type: 'info',
      title: 'El mito del extremo',
      body: 'No tienes que ser solo uno. La clave es el **equilibrio**.\n\nDemasiada seguridad puede estancarte. Demasiada libertad sin una base (seguridad) puede llevarte al abismo financiero.\n\n¿Sabes en qué punto del espectro estás hoy?',
      data: { 
        mood: 'curious',
        aiInsight: 'Tener un plan de seguridad te da el permiso emocional para disfrutar de tu libertad. ¡Sin base no hay vuelo!'
      }
    },
    {
      order: 7,
      type: 'true_false',
      title: 'Verdadero o Falso',
      body: 'Enunciado: Identificar si valoro más la libertad o la seguridad me ayuda a elegir mejor mis metas financieras.',
      data: {
        statement: 'Identificar si valoro más la libertad o la seguridad me ayuda a elegir mejor mis metas financieras.',
        correctValue: true,
        feedback: '¡Punto para ti! Conocer tu motor principal hace que tus planes no choquen con tus emociones.'
      }
    },
    {
      order: 8,
      type: 'match',
      title: 'Acción y Motor',
      body: 'Relaciona cada acción con el motor principal que mejor le corresponde.',
      data: {
        question: 'Relaciona cada acción con el motor principal que mejor le corresponde.',
        leftItems: [
          { id: 'l1', label: 'Elegir un empleo estable' },
          { id: 'l2', label: 'Ahorrar para un año sabático' },
          { id: 'l3', label: 'Tener un fondo de emergencias' },
          { id: 'l4', label: 'Trabajar por mi cuenta' }
        ],
        rightItems: [
          { id: 'r1', label: 'Seguridad' },
          { id: 'r2', label: 'Libertad' },
          { id: 'r3', label: 'Seguridad' },
          { id: 'r4', label: 'Libertad' }
        ],
        correctPairs: [
          { leftId: 'l1', rightId: 'r1' },
          { leftId: 'l2', rightId: 'r2' },
          { leftId: 'l3', rightId: 'r3' },
          { leftId: 'l4', rightId: 'r4' }
        ],
        feedback: '¡Excelente! Estás aprendiendo a leer la intención lógica detrás de cada pensamiento financiero.'
      }
    },
    {
      order: 9,
      type: 'info',
      title: 'Patrones heredados',
      body: 'Cuidado con los extremos:\n\n• **Miedo al gasto**: exceso de seguridad que te impide disfrutar lo que logras.\n• **Fuga de capital**: búsqueda de libertad inmediata que te deja sin nada para mañana.\n\nReconocer tu patrón heredado es el primer paso para mejorarlo.',
      data: { mood: 'alert' }
    },
    {
      order: 10,
      type: 'blitz_challenge',
      title: '¡DESAFÍO RELÁMPAGO!',
      body: '¿Qué le pasa a Elena?',
      data: {
        question: 'Elena gana muy bien pero gasta todo en viajes caros hoy porque "mañana quién sabe", quedándose sin nada para una emergencia. ¿Qué pilar olvidó?',
        options: [
          { id: 'opt1', label: 'Libertad financiera real', isCorrect: false },
          { id: 'opt2', label: 'Seguridad básica', isCorrect: true },
          { id: 'opt3', label: 'Suerte personal', isCorrect: false },
          { id: 'opt4', label: 'Ahorro para lujos', isCorrect: false }
        ],
        timeLimit: 12,
        ghostName: 'Billy',
        ghostScore: '7s',
        feedback: '¡Rápido y correcto! Elena busca libertad, pero sin seguridad vive en un riesgo constante.'
      }
    },
    {
      order: 11,
      type: 'multi_select',
      title: 'Equilibrando el barco',
      body: '¿Cuáles de estas son metas financieras equilibradas que combinan ambos pilares?',
      data: {
        question: '¿Cuáles de estas son metas financieras equilibradas que combinan ambos pilares?',
        options: [
          { id: 'opt1', label: 'Tener un seguro médico potente', isCorrect: true },
          { id: 'opt2', label: 'Gastar por impulso solo hoy', isCorrect: false },
          { id: 'opt3', label: 'Invertir en una habilidad para ganar más', isCorrect: true },
          { id: 'opt4', label: 'Tener ahorros en cuentas seguras', isCorrect: true }
        ],
        feedback: '¡Correcto! Combinar protección con inversión de crecimiento es el plan maestro.',
        instruction: 'Selecciona las opciones que consideres positivas.'
      }
    },
    {
      order: 12,
      type: 'info',
      title: 'Tu mezcla actual',
      body: 'Identifica tu mezcla actual:\n\n"Hoy busco más **seguridad** para mi familia, pero me encantaría tener más **libertad** para viajar más adelante".\n\nNombrarlo lo convierte en un plan real y deja de ser solo un deseo vago.',
      data: { mood: 'satisfied' }
    },
    {
      order: 13,
      type: 'order',
      title: 'El orden del balance',
      body: 'Ordena el proceso para lograr el equilibrio entre seguridad y libertad.',
      data: {
        question: 'Ordena el proceso para lograr el equilibrio entre seguridad y libertad.',
        items: [
          { id: 'i1', label: 'Cubrir mis necesidades básicas básicas', correctOrder: 1 },
          { id: 'i2', label: 'Crear una pequeña reserva de protección', correctOrder: 2 },
          { id: 'i3', label: 'Ahorrar para planes de largo plazo', correctOrder: 3 },
          { id: 'i4', label: 'Invertir en mayor libertad de tiempo', correctOrder: 4 }
        ],
        feedback: '¡Perfecto! Primero se asegura el suelo (seguridad) y luego se construye el vuelo (libertad).'
      }
    },
    {
      order: 14,
      type: 'mcq',
      title: 'Tu enfoque hoy',
      body: 'Hoy por hoy, ¿cuál de estos enfoques sientes con más fuerza en ti?',
      data: {
        question: 'Hoy por hoy, ¿cuál de estos enfoques sientes con más fuerza en ti?',
        options: [
          { id: 'opt1', label: 'Seguridad', isCorrect: true },
          { id: 'opt2', label: 'Libertad', isCorrect: true },
          { id: 'opt3', label: 'Los dos simultáneamente', isCorrect: true },
          { id: 'opt4', label: 'Ninguno todavía', isCorrect: true }
        ],
        graded: false, 
        shuffle: true,
        baselineLabel: 'perfil seguridad libertad'
      }
    },
    {
      order: 15,
      type: 'summary',
      title: '¡Lección completada!',
      body: 'Has descubierto el balance vital de tus finanzas. ¡No dejes que el miedo ni el impulso guíen tu barco!\n\nEn la próxima lección profundizaremos en la **Presión financiera**.',
      data: { 
        mood: 'celebrating',
        nextActionLabel: 'Siguiente lección'
      }
    }
  ];

  console.log('🌱 Adding steps to lesson:', lessonId);
  for (const step of steps) {
    await prisma.lessonStep.create({
      data: {
        lessonId: lessonId,
        order: step.order,
        type: step.type,
        title: step.title,
        body: step.body,
        data: step.data,
        xpReward: 10
      }
    });
  }

  console.log('✅ Lesson 1.A.3 seeded successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
