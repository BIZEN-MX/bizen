import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const lessonId = 'que-espero-del-dinero';

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
      title: 'Las dimensiones reales',
      body: 'Muchos esperan que el dinero solucione todo, pero tiene límites.\n\nPuedes esperar que te dé **tranquilidad, libertad, control o estatus**. Cada una tiene un impacto diferente en tu felicidad y paz mental.',
      data: { 
        mood: 'thinking',
        aiInsight: 'No pidas al dinero lo que solo el criterio puede darte. ¡El dinero amplía tus opciones, no tus valores!',
        glossary: [
          { word: 'Tranquilidad', definition: 'Estado de calma y ausencia de preocupaciones o nerviosismo.' },
          { word: 'Control', definition: 'Poder de manejar, guiar o decidir sobre una situación.' }
        ]
      }
    },
    {
      order: 2,
      type: 'mcq',
      title: 'Tus expectativas hoy',
      body: '¿Qué es lo que más esperas que el dinero te dé en este momento de tu vida?',
      data: {
        question: '¿Qué es lo que más esperas que el dinero te dé en este momento de tu vida?',
        options: [
          { id: 'opt1', label: 'Tranquilidad', isCorrect: true },
          { id: 'opt2', label: 'Libertad', isCorrect: true },
          { id: 'opt3', label: 'Estatus', isCorrect: true },
          { id: 'opt4', label: 'Control', isCorrect: true }
        ],
        graded: false, 
        shuffle: true,
        baselineLabel: 'expectativa principal'
      }
    },
    {
      order: 3,
      type: 'info',
      title: 'Diferencia clave',
      body: 'Confundir **estatus** con **libertad** es la trampa principal:\n\n• **Estatus**: requiere gastar dinero hoy para ser visto.\n• **Libertad**: requiere ahorrar dinero hoy para tener tiempo mañana.',
      data: { 
        mood: 'explaining',
        aiInsight: 'Casi todo el mundo sobreestima el valor del estatus y subestima el valor de la libertad. ¡Tú rompe ese patrón!'
      }
    },
    {
      order: 4,
      type: 'mcq',
      title: 'Detectando expectativas',
      body: '¿Qué espera Luis del dinero?',
      data: {
        question: '¿Qué espera Luis del dinero?',
        description: 'Luis ahorra el 20% de su sueldo solo para saber que si su jefe lo trata mal, puede renunciar mañana mismo.',
        options: [
          { id: 'opt1', label: 'Libertad', isCorrect: true },
          { id: 'opt2', label: 'Estatus', isCorrect: false },
          { id: 'opt3', label: 'Suerte', isCorrect: false },
          { id: 'opt4', label: 'Riesgo', isCorrect: false }
        ],
        feedback: '¡Correcto! El dinero como "seguro laboral" para poder decir que no es libertad pura.',
        shuffle: true
      }
    },
    {
      order: 5,
      type: 'mcq',
      title: 'Detectando expectativas',
      body: '¿Qué espera Ana?',
      data: {
        question: '¿Qué espera Ana?',
        description: 'Ana compró un reloj de lujo que no planeaba, solo para sentirse parte del grupo cuando sale con sus socios.',
        options: [
          { id: 'opt1', label: 'Tranquilidad', isCorrect: false },
          { id: 'opt2', label: 'Libertad', isCorrect: false },
          { id: 'opt3', label: 'Estatus', isCorrect: true },
          { id: 'opt4', label: 'Control', isCorrect: false }
        ],
        feedback: '¡Exacto! Gastar para pertenecer o impresionar es el motor del estatus.',
        shuffle: true
      }
    },
    {
      order: 6,
      type: 'info',
      title: 'El error de la felicidad',
      body: 'Esperar que el dinero te haga feliz por sí solo es como esperar que la gasolina conduzca el coche por ti.\n\nEs el **combustible**, pero tú eres quien elige el destino y maneja el volante.',
      data: { 
        mood: 'curious',
        aiInsight: 'La mayoría de la gente pide al dinero felicidad, cuando deberían pedirle tiempo. ¡El tiempo es lo único que el dinero compra realmente bien!'
      }
    },
    {
      order: 7,
      type: 'true_false',
      title: 'Verdadero o Falso',
      body: 'Enunciado: Si tu expectativa principal es el estatus, es muy probable que sientas presión financiera sin importar cuánto dinero ganes.',
      data: {
        statement: 'Si tu expectativa principal es el estatus, es muy probable que sientas presión financiera sin importar cuánto dinero ganes.',
        correctValue: true,
        feedback: '¡Bingo! El estatus siempre pide más; nunca se sacia.'
      }
    },
    {
      order: 8,
      type: 'match',
      title: 'Frases y Sentidos',
      body: 'Relaciona cada pensamiento con la expectativa que mejor le corresponde.',
      data: {
        question: 'Relaciona cada pensamiento con la expectativa que mejor le corresponde.',
        leftItems: [
          { id: 'l1', label: 'Quiero dormir sin deudas' },
          { id: 'l2', label: 'Quiero decidir mi propio horario' },
          { id: 'l3', label: 'Quiero que me vean exitoso' }
        ],
        rightItems: [
          { id: 'r1', label: 'Tranquilidad' },
          { id: 'r2', label: 'Libertad' },
          { id: 'r3', label: 'Estatus' }
        ],
        correctPairs: [
          { leftId: 'l1', rightId: 'r1' },
          { leftId: 'l2', rightId: 'r2' },
          { leftId: 'l3', rightId: 'r3' }
        ],
        feedback: '¡Excelente! Saber qué buscas te ayuda a no comprar por error lo que no necesitas.'
      }
    },
    {
      order: 9,
      type: 'info',
      title: 'Coherencia financiera',
      body: 'Para tener paz, tus gastos deben ser coherentes con tus expectativas reales.\n\nSi valoras la **tranquilidad** pero gastas en **estatus**, sentirás una contradicción constante que genera estrés.',
      data: { mood: 'alert' }
    },
    {
      order: 10,
      type: 'blitz_challenge',
      title: '¡DESAFÍO RELÁMPAGO!',
      body: '¿Qué error cometió Sofía?',
      data: {
        question: 'Sofía dice valorar la tranquilidad, pero gasta su ahorro de emergencia en un bolso de diseñador para una fiesta. ¿Dónde falló?',
        options: [
          { id: 'opt1', label: 'Falta de ingresos', isCorrect: false },
          { id: 'opt2', label: 'Contradicción: Dice tranquilidad pero actúa por estatus', isCorrect: true },
          { id: 'opt3', label: 'Ahorro insuficiente', isCorrect: false },
          { id: 'opt4', label: 'Falta de metas', isCorrect: false }
        ],
        timeLimit: 12,
        ghostName: 'Billy',
        ghostScore: '6s',
        feedback: '¡Brillante! Sofía sacrificó su verdadera base (tranquilidad) por una imagen momentánea.'
      }
    },
    {
      order: 11,
      type: 'multi_select',
      title: 'Expectativas Útiles',
      body: '¿Cuáles de estas expectativas suelen traer más bienestar sostenido a largo plazo?',
      data: {
        question: '¿Cuáles de estas expectativas suelen traer más bienestar sostenido a largo plazo?',
        options: [
          { id: 'opt1', label: 'Tener una base de tranquilidad', isCorrect: true },
          { id: 'opt2', label: 'Buscar mayor libertad de tiempo', isCorrect: true },
          { id: 'opt3', label: 'Seguir las tendencias de compra', isCorrect: false },
          { id: 'opt4', label: 'Tener control de mis decisiones', isCorrect: true }
        ],
        feedback: '¡Correcto! Las expectativas enfocadas en tu interior duran más que las enfocadas en el exterior.',
        instruction: 'Selecciona las opciones que consideres positivas.'
      }
    },
    {
      order: 12,
      type: 'info',
      title: 'Tu lista de deseos',
      body: 'Pregunta sincera: Si hoy tuvieras 10 millones, ¿qué comprarías por **felicidad** real y qué comprarías para **que te vean**?\n\nIdentificar eso separa la paja del trigo en tu cerebro financiero.',
      data: { mood: 'satisfied' }
    },
    {
      order: 13,
      type: 'order',
      title: 'El filtro del deseo',
      body: 'Ordena el proceso para filtrar tus compras por expectativa real.',
      data: {
        question: 'Ordena el proceso para filtrar tus compras por expectativa real.',
        items: [
          { id: 'i1', label: 'Sentir el impulso de compra', correctOrder: 1 },
          { id: 'i2', label: 'Identificar si busco libertad o estatus', correctOrder: 2 },
          { id: 'i3', label: 'Revisar mi sentimiento de paz interior', correctOrder: 3 },
          { id: 'i4', label: 'Decidir con calma', correctOrder: 4 }
        ],
        feedback: '¡Perfecto! El filtro de la intención ahorra más dinero que cualquier cupón de descuento.'
      }
    },
    {
      order: 14,
      type: 'mcq',
      title: 'Elección final',
      body: 'Si hoy tuvieras que elegir solo una, ¿cuál de estas sería tu expectativa principal?',
      data: {
        question: 'Si hoy tuvieras que elegir solo una, ¿cuál de estas sería tu expectativa principal?',
        options: [
          { id: 'opt1', label: 'Tranquilidad', isCorrect: true },
          { id: 'opt2', label: 'Libertad', isCorrect: true },
          { id: 'opt3', label: 'Control', isCorrect: true },
          { id: 'opt4', label: 'Estatus', isCorrect: true }
        ],
        graded: false, 
        shuffle: true,
        baselineLabel: 'expectativa elegida'
      }
    },
    {
      order: 15,
      type: 'summary',
      title: '¡Lección completada!',
      body: 'Has descubierto qué esperas realmente del dinero. ¡No dejes que el estatus decida por ti!\n\nEn la próxima lección profundizaremos en el balance entre **Seguridad y Libertad**.',
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

  console.log('✅ Lesson 1.A.2 seeded successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
