import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const lessonId = 'como-me-hace-sentir-el-dinero';

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
      type: 'flashcard',
      title: 'El dinero se siente',
      body: 'El dinero no solo se piensa, también se siente.\n\nA veces siento tranquilidad, otras presión, emoción o miedo. Sentir es normal.\n\nEl problema real es cuando una **emoción fuerte** decide por mí sin que me dé cuenta.',
      data: { mood: 'thinking' }
    },
    {
      order: 2,
      type: 'mcq',
      title: 'Tu clima emocional',
      body: 'Cuando tienes que pagar algo importante, ¿qué es lo primero que sientes?',
      data: {
        options: ['Nervios', 'Presión', 'Tranquilidad', 'Indiferencia'],
        graded: false,
        shuffle: true,
        baselineLabel: 'baseline emocional'
      }
    },
    {
      order: 3,
      type: 'flashcard',
      title: 'Señales de alerta',
      body: 'Una emoción domina una decisión cuando aparecen señales claras:\n\n• **Urgencia**: lo quiero ya.\n• **Justificación rápida**: "me lo merezco".\n• **Evitar consecuencias**: "luego veo cómo le hago".\n• **Impulso físico**: ansiedad, estrés o euforia intensa.\n\nEstas señales indican que debo **pausar** antes de decidir.',
      data: { mood: 'alert' }
    },
    {
      order: 4,
      type: 'mcq',
      title: 'Detectando la emoción',
      body: 'Contexto: Sofía ve una oferta de tiempo limitado. Piensa "si no lo compro hoy lo pierdo" y siente mucha urgencia.\n\nPregunta: ¿Qué emoción predomina en su decisión?',
      data: {
        options: ['Tranquilidad', 'Emoción', 'Paciencia', 'Indiferencia'],
        correctAnswer: 'Emoción',
        feedback: '¡Correcto! Sentir urgencia y pensar "lo quiero ya" es una señal clara de que la emoción está al mando.',
        shuffle: true
      }
    },
    {
      order: 5,
      type: 'truefalse',
      title: 'Verdadero o Falso',
      body: 'Enunciado: Reconocer lo que siento antes de comprar puede ayudarme a tomar una decisión más consciente.',
      data: {
        correctAnswer: true,
        feedback: '¡Exacto! Nombrar la emoción reduce el impulso y nos devuelve el control para decidir mejor.'
      }
    },
    {
      order: 6,
      type: 'flashcard',
      title: 'La regla de la pausa',
      body: 'Regla simple: cuando una emoción está alta, haz una pausa antes de pagar.\n\nLa emoción te da información, pero **no debe ser quien decida**.\n\nPrimero identifico lo que siento, luego aplico mi criterio.',
      data: { mood: 'explaining' }
    },
    {
      order: 7,
      type: 'mcq',
      title: 'Diagnosticando señales',
      body: 'Contexto: Diego está molesto tras una discusión. Entra a una tienda online y llena el carrito con cosas que no tenía planeado comprar.\n\nPregunta: ¿Qué señal de "emoción dominando" es la más evidente?',
      data: {
        options: ['Justificación rápida', 'Planeación', 'Comparación de precios', 'Meta a largo plazo'],
        correctAnswer: 'Justificación rápida',
        feedback: 'Correcto. Comprar para regular el humor suele venir acompañado de justificar la acción rápidamente sin análisis previo.',
        shuffle: true
      }
    },
    {
      order: 8,
      type: 'matching',
      title: 'Reacción vs Emoción',
      body: 'Relaciona cada situación financiera con la emoción más lógica por el contexto.',
      data: {
        pairs: [
          { left: 'Ves que tu saldo está más bajo de lo que pensabas', right: 'Ansiedad' },
          { left: 'Guardas dinero para una meta importante', right: 'Tranquilidad' },
          { left: 'Te llega un cobro inesperado', right: 'Estrés' },
          { left: 'Compras algo que querías desde hace tiempo', right: 'Emoción' }
        ],
        feedback: '¡Perfecto! Identificar cómo reaccionamos nos ayuda a anticipar nuestros impulsos.'
      }
    },
    {
      order: 9,
      type: 'flashcard',
      title: 'Planeado vs Impulsivo',
      body: 'Hay dos formas básicas de gastar:\n\n• **Compra planeada**: sé por qué y para qué lo compro.\n• **Compra impulsiva**: nace de una emoción fuerte (urgencia, estrés, euforia).\n\nLo impulsivo suele traer arrepentimiento o culpa después.',
      data: { mood: 'satisfied' }
    },
    {
      order: 10,
      type: 'mcq',
      title: 'Justificaciones falsas',
      body: 'Contexto: Mariana piensa: "Estoy muy estresada por el trabajo. Me merezco comprar esto ahora, aunque no me alcance".\n\nPregunta: ¿Cuál es el error principal en su pensamiento?',
      data: {
        options: ['Mezclar emoción con justificación financiera', 'Hacer un presupuesto', 'Analizar consecuencias', 'Comparar opciones'],
        correctAnswer: 'Mezclar emoción con justificación financiera',
        feedback: '¡Exacto! La emoción explica cómo te sientes, pero no convierte una mala decisión financiera en una buena.',
        shuffle: true
      }
    },
    {
      order: 11,
      type: 'multiselect',
      title: 'Señales de lo impulsivo',
      body: 'Cuando una emoción domina, suelen aparecer varios síntomas al mismo tiempo.\n\nPregunta: ¿Cuáles de estas son señales de una compra impulsiva?',
      data: {
        options: ['Querer decidir muy rápido', 'Ignorar si estaba planeado', 'Justificar la compra después', 'Sentir un impulso físico inmediato'],
        correctAnswer: ['Querer decidir muy rápido', 'Ignorar si estaba planeado', 'Justificar la compra después', 'Sentir un impulso físico inmediato'],
        feedback: '¡Correcto! Todas estas son señales típicas de que la emoción ha tomado el volante.',
        instruction: 'Selecciona todas las señales que consideres correctas.'
      }
    },
    {
      order: 12,
      type: 'flashcard',
      title: 'Método de los 4 Pasos',
      body: 'Receta rápida antes de comprar:\n\n1. **Nombrar** lo que siento.\n2. **Pausar** 30 segundos (o 24 horas si es caro).\n3. **Evaluar** si es necesidad o deseo.\n4. **Decidir** con la mente en calma.\n\nEste método baja la intensidad emocional y sube tu control.',
      data: { mood: 'wise' }
    },
    {
      order: 13,
      type: 'order',
      title: 'Poniendo orden',
      body: 'Ordena los pasos del método para recuperar el control antes de una decisión.',
      data: {
        items: ['Nombrar lo que siento', 'Pausar', 'Evaluar si lo necesito o solo lo deseo', 'Decidir'],
        feedback: '¡Excelente! Primero va la emoción, luego la pausa, después el criterio y al final la decisión.'
      }
    },
    {
      order: 14,
      type: 'mcq',
      title: 'Reflexión actual',
      body: 'Hoy, ¿qué emoción aparece con más frecuencia cuando piensas en el dinero?',
      data: {
        options: ['Motivación', 'Presión', 'Tranquilidad', 'Preocupación'],
        graded: false,
        shuffle: true,
        baselineLabel: 'perfil emocional'
      }
    },
    {
      order: 15,
      type: 'summary',
      title: '¡Lección completada!',
      body: 'Has dado un gran paso. Ahora puedes detectar cuándo una emoción está intentando tomar una decisión por ti.\n\nEn la siguiente lección profundizaremos en las creencias que traes desde casa.',
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

  console.log('✅ Lesson 1.B.1 seeded successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
