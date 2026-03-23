import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const lessonId = 'dinero-como-presion-vs-oportunidad';

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
      title: 'Presión vs Oportunidad',
      body: 'Hoy veremos dos formas opuestas de vivir el dinero: **presión** y **oportunidad**.\n\nCuriosamente, la misma cantidad de dinero puede sentirse de ambas formas según cómo lo interpretes y el nivel de control que sientas hoy.',
      data: { 
        mood: 'thinking',
        aiInsight: 'La presión financiera no siempre es por falta de dinero, a veces es por falta de claridad. ¡El orden es el primer paso a la oportunidad!',
        glossary: [
           { word: 'Presión', definition: 'Sentimiento de urgencia, estrés o carga mental constante por deudas o falta de orden.' },
           { word: 'Oportunidad', definition: 'Posibilidad de usar el capital para crecer, aprender o ganar tiempo futuro.' }
        ]
      }
    },
    {
      order: 2,
      type: 'mcq',
      title: 'Tu sensación actual',
      body: 'Cuando piensas en dinero hoy, ¿lo sientes más como una presión o como una oportunidad?',
      data: {
        question: 'Cuando piensas en dinero hoy, ¿lo sientes más como una presión o como una oportunidad?',
        options: [
          { id: 'opt1', label: 'Una presión', isCorrect: true },
          { id: 'opt2', label: 'Una oportunidad', isCorrect: true },
          { id: 'opt3', label: 'Depende del día', isCorrect: true },
          { id: 'opt4', label: 'No estoy seguro', isCorrect: true }
        ],
        graded: false, 
        shuffle: true,
        baselineLabel: 'baseline presión vs oportunidad'
      }
    },
    {
      order: 3,
      type: 'info',
      title: '¿Cómo distinguirlas?',
      body: '• **Dinero como Presión**: evitas revisar tu saldo, sientes ansiedad al pagar y ves el dinero como una carga.\n• **Dinero como Oportunidad**: lo usas para construir, estudiar, invertir o resolver necesidades con **intención**.',
      data: { 
        mood: 'explaining',
        aiInsight: 'Cada vez que usas tu dinero para algo que te hace mejor o te ahorra tiempo, estás activando el modo Oportunidad.'
      }
    },
    {
      order: 4,
      type: 'mcq',
      title: 'Detectando la presión',
      body: '¿Qué enfoque domina según los criterios aprendidos?',
      data: {
        question: '¿Qué enfoque domina según los criterios aprendidos?',
        description: 'Paty recibe su dinero y lo primero que hace es preocuparse porque siente que no le va a alcanzar, evitando a toda costa ver su saldo bancario.',
        options: [
          { id: 'opt1', label: 'Oportunidad', isCorrect: false },
          { id: 'opt2', label: 'Presión', isCorrect: true },
          { id: 'opt3', label: 'Estatus', isCorrect: false },
          { id: 'opt4', label: 'Libertad', isCorrect: false }
        ],
        feedback: '¡Exacto! La evasión del saldo y la sensación constante de escasez son señales claras de presión financiera.',
        shuffle: true
      }
    },
    {
      order: 5,
      type: 'mcq',
      title: 'Detectando la oportunidad',
      body: '¿Qué enfoque domina en esta decisión?',
      data: {
        question: '¿Qué enfoque domina en esta decisión?',
        description: 'Ricardo usa una parte de su dinero para pagar una herramienta que le ayuda a trabajar más rápido y ganar más tiempo libre.',
        options: [
          { id: 'opt1', label: 'Presión', isCorrect: false },
          { id: 'opt2', label: 'Oportunidad', isCorrect: true },
          { id: 'opt3', label: 'Estatus', isCorrect: false },
          { id: 'opt4', label: 'Miedo', isCorrect: false }
        ],
        feedback: '¡Correcto! Usar el capital para ganar tiempo o mejorar capacidades es el enfoque de oportunidad.',
        shuffle: true
      }
    },
    {
      order: 6,
      type: 'info',
      title: 'El cambio de enfoque',
      body: 'Si solo ves la presión, te bloqueas. Si buscas la **oportunidad**, encuentras acciones pequeñas que mejoran tu situación paso a paso.\n\nCada acción de control reduce un poco la presión emocional.',
      data: { 
        mood: 'curious',
        aiInsight: 'No puedes controlar toda la economía, pero sí puedes controlar tu primer paso de hoy. ¡Empieza por lo pequeño!'
      }
    },
    {
      order: 7,
      type: 'true_false',
      title: 'Verdadero o Falso',
      body: 'Enunciado: Tener un plan financiero simple, por pequeño que sea, ayuda a reducir la presión financiera.',
      data: {
        statement: 'Tener un plan financiero simple, por pequeño que sea, ayuda a reducir la presión financiera.',
        correctValue: true,
        feedback: '¡Así es! Un plan te devuelve el sentido de control, y el control es el antídoto natural contra la presión.'
      }
    },
    {
      order: 8,
      type: 'match',
      title: 'Pensamiento y Enfoque',
      body: 'Relaciona cada pensamiento con el enfoque más lógico.',
      data: {
        question: 'Relaciona cada pensamiento con el enfoque más lógico.',
        leftItems: [
          { id: 'l1', label: 'No quiero ver mi saldo' },
          { id: 'l2', label: 'Ahorrar poco hoy me ayuda mañana' },
          { id: 'l3', label: 'El dinero siempre es un problema' },
          { id: 'l4', label: 'Usaré esto para aprender' }
        ],
        rightItems: [
          { id: 'r1', label: 'Presión' },
          { id: 'r2', label: 'Oportunidad' },
          { id: 'r3', label: 'Presión' },
          { id: 'r4', label: 'Oportunidad' }
        ],
        correctPairs: [
          { leftId: 'l1', rightId: 'r1' },
          { leftId: 'l2', rightId: 'r2' },
          { leftId: 'l3', rightId: 'r3' },
          { leftId: 'l4', rightId: 'r4' }
        ],
        feedback: '¡Muy bien! Identificar estos diálogos internos es clave para cambiar tu relación con el dinero.'
      }
    },
    {
      order: 9,
      type: 'info',
      title: 'Confusión común',
      body: 'Error típico: confundir **oportunidad** con impulso.\n\n• **Oportunidad real**: mejora algo concreto (pagar herramientas, ahorrar para metas, invertir en uno mismo).\n• **Gasto por impulso**: solo da una emoción corta que no construye futuro.',
      data: { mood: 'alert' }
    },
    {
      order: 10,
      type: 'blitz_challenge',
      title: '¡DESAFÍO RELÁMPAGO!',
      body: '¿Qué le pasa a Fernanda?',
      data: {
        question: 'Fernanda se siente presionada y, para calmarse, compra "ofertas de antojo" que no necesita. ¿Qué está cometiendo?',
        options: [
          { id: 'opt1', label: 'Alivio emocional pasajero', isCorrect: true },
          { id: 'opt2', label: 'Inversión de oportunidad', isCorrect: false },
          { id: 'opt3', label: 'Ahorro estratégico', isCorrect: false },
          { id: 'opt4', label: 'Plan de libertad', isCorrect: false }
        ],
        timeLimit: 12,
        ghostName: 'Billy',
        ghostScore: '6s',
        feedback: '¡Excelente! Comprar por ansiedad da un alivio momentáneo, pero aumenta la presión real después.'
      }
    },
    {
      order: 11,
      type: 'multi_select',
      title: 'Acciones de Oportunidad',
      body: '¿Cuáles de estas acciones generan más oportunidad que presión con el tiempo?',
      data: {
        question: '¿Cuáles de estas acciones generan más oportunidad que presión con el tiempo?',
        options: [
          { id: 'opt1', label: 'Registrar mis gastos una semana', isCorrect: true },
          { id: 'opt2', label: 'Evitar ver mi saldo hoy', isCorrect: false },
          { id: 'opt3', label: 'Separar un ahorro mínimo', isCorrect: true },
          { id: 'opt4', label: 'Aprender una habilidad nueva', isCorrect: true }
        ],
        feedback: '¡Correcto! La oportunidad nace de enfrentar la realidad y tomar acciones que mejoran tu futuro.',
        instruction: 'Selecciona las opciones que consideres positivas.'
      }
    },
    {
      order: 12,
      type: 'info',
      title: 'Marco Estratégico',
      body: 'Cómo pasar de la presión a la oportunidad:\n\n1. **Ver la realidad** (sin juzgarte).\n2. **Elegir una acción pequeña** de control.\n3. **Repetir** una semana para crear hábito.',
      data: { mood: 'satisfied' }
    },
    {
      order: 13,
      type: 'order',
      title: 'El orden del cambio',
      body: 'Ordena los pasos para transformar la presión en oportunidad financiera.',
      data: {
        question: 'Ordena los pasos para transformar la presión en oportunidad financiera.',
        items: [
          { id: 'i1', label: 'Enfrentar mi saldo real hoy', correctOrder: 1 },
          { id: 'i2', label: 'Elegir una pequeña acción de ahorro', correctOrder: 2 },
          { id: 'i3', label: 'Mantener la acción una semana', correctOrder: 3 },
          { id: 'i4', label: 'Revisar mi sentimiento de control', correctOrder: 4 }
        ],
        feedback: '¡Perfecto! El control constante es el que diluye la presión emocional.'
      }
    },
    {
      order: 14,
      type: 'mcq',
      title: 'Tu prioridad hoy',
      body: 'Hoy, ¿qué crees que te ayudaría más en tu situación actual?',
      data: {
        question: 'Hoy, ¿qué crees que te ayudaría más en tu situación actual?',
        options: [
          { id: 'opt1', label: 'Reducir la presión', isCorrect: true },
          { id: 'opt2', label: 'Crear más oportunidad', isCorrect: true },
          { id: 'opt3', label: 'Ambas cosas igual', isCorrect: true },
          { id: 'opt4', label: 'No estoy muy seguro', isCorrect: true }
        ],
        graded: false, 
        shuffle: true,
        baselineLabel: 'prioridad presión vs oportunidad'
      }
    },
    {
      order: 15,
      type: 'summary',
      title: '¡Lección completada!',
      body: 'Has aprendido a diferenciar la presión de la oportunidad y tienes un plan inicial para cambiar tu enfoque.\n\n¡En la próxima lección definiremos por fin tu propia visión personal del dinero!',
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

  console.log('✅ Lesson 1.A.4 seeded successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
