import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const lessonId = 'identificar-mi-definicion-personal-del-dinero';

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
      title: 'Tu definición de dinero',
      body: 'Ya hemos visto que el dinero puede significar muchas cosas: seguridad, libertad, presión, oportunidad, estatus, herramienta o control.\n\nHoy llega el momento clave: construir tu propia definición personal para empezar a tomar decisiones con intención real.',
      data: { 
        mood: 'thinking',
        aiInsight: 'Tu definición es el filtro de tus decisiones. ¡Si el filtro está claro, elegir lo que realmente importa se vuelve automático!',
        glossary: [
           { word: 'Equilibrio', definition: 'Estado donde diferentes elementos se mantienen en proporciones adecuadas para evitar el caos.' }
        ]
      }
    },
    {
      order: 2,
      type: 'mcq',
      title: 'Tu palabra dominante',
      body: '¿Cuál de estas palabras describe mejor tu relación con el dinero en este momento?',
      data: {
        question: '¿Cuál de estas palabras describe mejor tu relación con el dinero en este momento?',
        options: [
          { id: 'opt1', label: 'Seguridad', isCorrect: true },
          { id: 'opt2', label: 'Libertad', isCorrect: true },
          { id: 'opt3', label: 'Presión', isCorrect: true },
          { id: 'opt4', label: 'Oportunidad', isCorrect: true }
        ],
        graded: false, 
        shuffle: true,
        baselineLabel: 'palabra dominante inicial'
      }
    },
    {
      order: 3,
      type: 'swipe_sorter',
      title: 'Semaforo de Prioridad',
      body: 'Desliza a la izquierda si es una **Necesidad** (seguridad/base) o a la derecha si es un **Deseo** (libertad/antojo).',
      data: {
        question: 'Clasifica según tu criterio de prioridad fundamental hoy.',
        leftLabel: 'Necesidad',
        rightLabel: 'Deseo',
        items: [
          { id: 'i1', label: 'Renta/Vivienda', correctSide: 'left' },
          { id: 'i2', label: 'Suscripciones extra', correctSide: 'right' },
          { id: 'i3', label: 'Alimentos básicos', correctSide: 'left' },
          { id: 'i4', label: 'Café de marca diario', correctSide: 'right' },
          { id: 'i5', label: 'Seguro médico', correctSide: 'left' },
          { id: 'i6', label: 'Viaje de lujo imprevisto', correctSide: 'right' }
        ],
        feedback: '¡Excelente! Saber distinguir entre lo que te da seguridad (base) y lo que te da libertad (opciones) es la clave del orden financiero.',
        glossary: [
          { word: 'Necesidad', definition: 'Gasto vital requerido para la supervivencia o el cumplimiento de compromisos básicos.' },
          { word: 'Deseo', definition: 'Gasto opcional que busca placer, comodidad o gratificación momentánea.' }
        ]
      }
    },
    {
      order: 4,
      type: 'info',
      title: 'Criterio práctico',
      body: 'Tu definición se nota en lo que haces repetidamente:\n\n• Si priorizas cubrir imprevistos → Seguridad.\n• Si priorizas tener opciones futuras → Libertad.\n• Si evitas ver tu dinero por ansiedad → Presión.\n• Si usas el dinero para crecer o mejorar algo → Oportunidad.\n\nNo tienes que elegir solo una, pero es vital saber cuál domina hoy.',
      data: { 
        mood: 'explaining',
        aiInsight: '¿Sabías que tu "yo" del pasado ya tomó la decisión de hoy? Tu definición heredada suele ser la que guía el impulso.'
      }
    },
    {
      order: 5,
      type: 'mcq',
      title: 'Análisis de comportamiento',
      body: '¿Qué enfoque domina según los criterios aprendidos?',
      data: {
        question: '¿Qué enfoque domina según los criterios aprendidos?',
        description: 'Mónica revisa su saldo bancario, se pone muy nerviosa y prefiere cerrar la app rápido porque le da miedo ver cuánto tiene realmente.',
        options: [
          { id: 'opt1', label: 'Presión', isCorrect: true },
          { id: 'opt2', label: 'Libertad', isCorrect: false },
          { id: 'opt3', label: 'Oportunidad', isCorrect: false },
          { id: 'opt4', label: 'Seguridad', isCorrect: false }
        ],
        feedback: '¡Exacto! La evasión por ansiedad es el síntoma principal de un enfoque dominado por la presión.',
        shuffle: true
      }
    },
    {
      order: 6,
      type: 'mcq',
      title: 'Análisis de comportamiento',
      body: '¿Qué enfoque domina aquí?',
      data: {
        question: '¿Qué enfoque domina aquí?',
        description: 'Hugo separa una pequeña cantidad cada mes para emergencias, solo para poder dormir tranquilo.',
        options: [
          { id: 'opt1', label: 'Presión', isCorrect: false },
          { id: 'opt2', label: 'Oportunidad', isCorrect: false },
          { id: 'opt3', label: 'Seguridad', isCorrect: true },
          { id: 'opt4', label: 'Estatus', isCorrect: false }
        ],
        feedback: '¡Correcto! Priorizar la tranquilidad ante lo inesperado es la base del enfoque de seguridad.',
        shuffle: true
      }
    },
    {
      order: 7,
      type: 'info',
      title: 'La búsqueda del equilibrio',
      body: 'Una definición sana del dinero busca el equilibrio:\n\n• Base mínima de seguridad.\n• Margen de libertad para opciones futuras.\n• Reducción de presión mediante el orden.\n• Oportunidad a través de acciones pequeñas.\n\nSin este balance, es fácil caer en el caos constante.',
      data: { 
        mood: 'curious',
        aiInsight: 'No hay presupuesto perfecto, solo presupuesto con intención. ¡Equilibrar estos cuatro pilares es tu meta real!'
      }
    },
    {
      order: 8,
      type: 'true_false',
      title: 'Verdadero o Falso',
      body: 'Enunciado: Identificar mi definición personal del dinero me ayuda directamente a gastar con mucha más intención y menos remordimiento.',
      data: {
        statement: 'Identificar mi definición personal del dinero me ayuda directamente a gastar con mucha más intención y menos remordimiento.',
        correctValue: true,
        feedback: '¡Así es! Si sabes qué estás buscando realmente, tus decisiones se vuelven coherentes y los impulsos pierden su fuerza.'
      }
    },
    {
      order: 9,
      type: 'match',
      title: 'Frases e Intenciones',
      body: 'Relaciona cada frase con el enfoque estratégico que mejor le corresponde.',
      data: {
        question: 'Relaciona cada frase con el enfoque estratégico que mejor le corresponde.',
        leftItems: [
          { id: 'l1', label: 'Quiero estar cubierto ante imprevistos' },
          { id: 'l2', label: 'Quiero tener opciones para elegir ' },
          { id: 'l3', label: 'Me estresa ver mi saldo hoy' },
          { id: 'l4', label: 'Quiero aprender algo para crecer' }
        ],
        rightItems: [
          { id: 'r1', label: 'Seguridad' },
          { id: 'r2', label: 'Libertad' },
          { id: 'r3', label: 'Presión' },
          { id: 'r4', label: 'Oportunidad' }
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
      order: 10,
      type: 'blitz_challenge',
      title: '¡DESAFÍO RELÁMPAGO!',
      body: '¿Qué contradicción cometió Diego?',
      data: {
        question: 'Diego dice: "Yo valoro mucho mi libertad financiera", pero gasta todo hoy en impulsos y se queda sin opciones mañana. ¿Qué le falló?',
        options: [
          { id: 'opt1', label: 'Definición coherente', isCorrect: false },
          { id: 'opt2', label: 'Contradicción: Dice libertad, actúa por impulso', isCorrect: true },
          { id: 'opt3', label: 'Ahorro excesivo', isCorrect: false },
          { id: 'opt4', label: 'Falta de ingresos', isCorrect: false }
        ],
        timeLimit: 12,
        ghostName: 'Billy',
        ghostScore: '7s',
        feedback: '¡Rápido y correcto! La libertad financiera real requiere intención y paciencia, no gratificación inmediata hoy.'
      }
    },
    {
      order: 11,
      type: 'multi_select',
      title: 'Cimentando tu definición',
      body: '¿Cuáles de estos hábitos apoyan una definición sana y equilibrada del dinero?',
      data: {
        question: '¿Cuáles de estas son señales de un plan equilibrado?',
        options: [
          { id: 'opt1', label: 'Separar ahorro para emergencias', isCorrect: true },
          { id: 'opt2', label: 'Definir un tope para antojos', isCorrect: true },
          { id: 'opt3', label: 'Evitar revisar estados de cuenta', isCorrect: false },
          { id: 'opt4', label: 'Elegir una meta financiera para el mes', isCorrect: true }
        ],
        feedback: '¡Correcto! Los hábitos simples y claros reducen la presión y aumentan el sentido de control real.',
        instruction: 'Selecciona las opciones que consideres positivas.'
      }
    },
    {
      order: 12,
      type: 'info',
      title: 'Tu Plantilla Personal',
      body: 'Intenta completar esto mentalmente:\n\n"Para mí el dinero es principalmente una herramienta para ____ y una base para ____. Hoy lo demuestro cuando hago ____".\n\nEsto convierte tus ideas abstractas en un plan de acción real.',
      data: { mood: 'satisfied' }
    },
    {
      order: 13,
      type: 'order',
      title: 'Proceso de definición',
      body: 'Ordena el proceso lógico para construir una definición personal con intención.',
      data: {
        question: 'Ordena el proceso lógico para construir una definición personal con intención.',
        items: [
          { id: 'i1', label: 'Identificar qué busco hoy', correctOrder: 1 },
          { id: 'i2', label: 'Observar mi comportamiento real', correctOrder: 2 },
          { id: 'i3', label: 'Convertirlo en una frase simple', correctOrder: 3 },
          { id: 'i4', label: 'Elegir un hábito que lo respalde', correctOrder: 4 }
        ],
        feedback: '¡Perfecto! Primero te observas con honestidad, luego lo defines con claridad y finalmente lo anclas con un hábito de control.'
      }
    },
    {
      order: 14,
      type: 'mcq',
      title: 'Tu compromiso hoy',
      body: '¿Cuál de estos pilares te gustaría empezar a fortalecer desde hoy mismo?',
      data: {
        question: '¿Cuál de estos pilares te gustaría empezar a fortalecer desde hoy mismo?',
        options: [
          { id: 'opt1', label: 'Seguridad', isCorrect: true },
          { id: 'opt2', label: 'Libertad', isCorrect: true },
          { id: 'opt3', label: 'Oportunidad', isCorrect: true },
          { id: 'opt4', label: 'Reducir la presión', isCorrect: true }
        ],
        graded: false, 
        shuffle: true,
        baselineLabel: 'objetivo personal de definición'
      }
    },
    {
      order: 15,
      type: 'summary',
      title: '¡Subtema completado!',
      body: '¡Felicidades! Has terminado el primer bloque de Percepción. Ahora tienes una definición clara de qué es el dinero para ti y cómo quieres usarlo.\n\nEn el próximo bloque profundizaremos en el mundo de las Emociones financierias.',
      data: { 
        mood: 'celebrating',
        nextActionLabel: 'Siguiente Subtema'
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

  console.log('✅ Lesson 1.A.5 seeded successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
