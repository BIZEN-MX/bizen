import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const lessonId = 'que-es-el-dinero-para-mi';

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
      title: 'Tu relación con el dinero',
      body: 'Hoy vamos a hablar de lo más básico: **¿qué es el dinero para ti?**\n\nNo es solo un papel o un número en una app. Es una herramienta que refleja lo que valoras, lo que temes y lo que sueñas.\n\nEl dinero puede ser muchas cosas a la vez.',
      data: { 
        mood: 'thinking',
        aiInsight: 'A veces tratamos al dinero como un fin, pero recuerda: ¡es solo el transporte para llegar a tus metas!',
        glossary: [
          { word: 'Dinero', definition: 'Medio de intercambio aceptado por la sociedad para pagar bienes y servicios.' }
        ]
      }
    },
    {
      order: 2,
      type: 'mcq',
      title: 'Diagnóstico',
      body: 'Cuando escucho la palabra “dinero”, ¿qué idea me llega primero?',
      data: {
        question: 'Cuando escucho la palabra “dinero”, ¿qué idea me llega primero?',
        options: [
          { id: 'opt1', label: 'Presión', isCorrect: true },
          { id: 'opt2', label: 'Seguridad', isCorrect: true },
          { id: 'opt3', label: 'Libertad', isCorrect: true },
          { id: 'opt4', label: 'Preocupación', isCorrect: true }
        ],
        graded: false, 
        shuffle: true,
        baselineLabel: 'baseline de percepción'
      }
    },
    {
      order: 3,
      type: 'info',
      title: 'Tres visiones comunes',
      body: 'La mayoría de nosotros vemos el dinero desde uno de estos tres ángulos:\n\n• **Seguridad**: Tener lo suficiente para estar tranquilo.\n• **Libertad**: Tener opciones para elegir lo que quiero.\n• **Estatus**: Mostrar éxito o pertenecer a un grupo.\n\n¿Cuál crees que ha sido el tuyo hasta hoy?',
      data: { 
        mood: 'explaining',
        aiInsight: 'No hay una visión "correcta", pero hay visiones que te dan más paz que otras. ¡Tú decides cuál elegir!',
        glossary: [
           { word: 'Seguridad', definition: 'Sensación de tranquilidad ante posibles riesgos o imprevistos.' },
           { word: 'Libertad', definition: 'Capacidad de tomar decisiones propias sin restricciones externas.' },
           { word: 'Estatus', definition: 'Posición o reconocimiento social dentro de un grupo.' }
        ]
      }
    },
    {
      order: 4,
      type: 'mcq',
      title: 'Identificando la visión',
      body: '¿Qué visión domina en esta situación?',
      data: {
        question: '¿Qué visión domina en esta situación?',
        description: 'Mateo prefiere no salir de viaje hoy para tener guardado un "colchón" por si su coche falla mañana.',
        options: [
          { id: 'opt1', label: 'Seguridad', isCorrect: true },
          { id: 'opt2', label: 'Control', isCorrect: false },
          { id: 'opt3', label: 'Estatus', isCorrect: false },
          { id: 'opt4', label: 'Libertad', isCorrect: false }
        ],
        feedback: '¡Correcto! Priorizar la protección ante imprevistos es la esencia de la visión de seguridad.',
        shuffle: true
      }
    },
    {
      order: 5,
      type: 'mcq',
      title: 'Identificando la visión',
      body: '¿Qué visión domina aquí?',
      data: {
        question: '¿Qué visión domina aquí?',
        description: 'Valentina está muy emocionada porque puede decidir renunciar a un trabajo que no le gusta, ya que tiene ahorrado lo suficiente para vivir 6 meses.',
        options: [
          { id: 'opt1', label: 'Presión', isCorrect: false },
          { id: 'opt2', label: 'Libertad', isCorrect: true },
          { id: 'opt3', label: 'Herramienta', isCorrect: false },
          { id: 'opt4', label: 'Riesgo', isCorrect: false }
        ],
        feedback: '¡Exacto! El dinero como medio para tener opciones y elegir tu camino es libertad pura.',
        shuffle: true
      }
    },
    {
      order: 6,
      type: 'info',
      title: 'Más que un número',
      body: 'Si tu relación con el dinero es solo matemática (sumar y restar), será difícil mantener el hábito.\n\nPero si ves el **dinero** como la herramienta que protege tu **tranquilidad**, todo cambia.\n\n¿Sabes cuál es tu "por qué" real?',
      data: { 
        mood: 'curious',
        aiInsight: 'Escribir tu "por qué" financiero es como ponerle GPS a tu billetera. ¡Sin destino, cualquier gasto es una distracción!'
      }
    },
    {
      order: 7,
      type: 'true_false',
      title: 'Verdadero o Falso',
      body: 'Enunciado: El dinero es una herramienta neutra; quien le da el significado y la intención eres tú.',
      data: {
        statement: 'El dinero es una herramienta neutra; quien le da el significado y la intención eres tú.',
        correctValue: true,
        feedback: '¡Punto para ti! El dinero no es bueno ni malo, es un amplificador de tus propias decisiones.'
      }
    },
    {
      order: 8,
      type: 'match',
      title: 'Visión y Acción',
      body: 'Relaciona cada acción con la visión que mejor la describe.',
      data: {
        question: 'Relaciona cada acción con la visión que mejor la describe.',
        leftItems: [
          { id: 'l1', label: 'Guardar para imprevistos' },
          { id: 'l2', label: 'Comprar algo para impresionar' },
          { id: 'l3', label: 'Ahorrar para poder elegir' }
        ],
        rightItems: [
          { id: 'r1', label: 'Seguridad' },
          { id: 'r2', label: 'Estatus' },
          { id: 'r3', label: 'Libertad' }
        ],
        correctPairs: [
          { leftId: 'l1', rightId: 'r1' },
          { leftId: 'l2', rightId: 'r2' },
          { leftId: 'l3', rightId: 'r3' }
        ],
        feedback: '¡Muy bien! Estás aprendiendo a leer la intención lógica detrás de los gastos comunes.'
      }
    },
    {
      order: 9,
      type: 'info',
      title: 'El peligro del estatus',
      body: 'Seguir el estatus puede atraparte en un ciclo de presión constante: gastar dinero que no tienes para impresionar a gente que no te importa.\n\nLa verdadera riqueza comienza por dejar de jugar ese juego.',
      data: { mood: 'alert' }
    },
    {
      order: 10,
      type: 'blitz_challenge',
      title: '¡DESAFÍO RELÁMPAGO!',
      body: '¿Qué le pasa a Iker?',
      data: {
        question: 'Iker compra el último teléfono a plazos aunque no puede pagarlo cómodamente, solo para que sus amigos lo vean. ¿Qué visión domina?',
        options: [
          { id: 'opt1', label: 'Seguridad', isCorrect: false },
          { id: 'opt2', label: 'Libertad', isCorrect: false },
          { id: 'opt3', label: 'Estatus', isCorrect: true },
          { id: 'opt4', label: 'Oportunidad', isCorrect: false }
        ],
        timeLimit: 12,
        ghostName: 'Billy',
        ghostScore: '5s',
        feedback: '¡Rápido y correcto! Cuidado con Iker, está sacrificando su tranquilidad por una imagen pasajera.'
      }
    },
    {
      order: 11,
      type: 'multi_select',
      title: 'Visión Saludable',
      body: '¿Cuáles de estos enfoques crees que te darían más paz mental a largo plazo?',
      data: {
        question: '¿Cuáles de estos enfoques crees que te darían más paz mental a largo plazo?',
        options: [
          { id: 'opt1', label: 'Priorizar la seguridad', isCorrect: true },
          { id: 'opt2', label: 'Fomentar la libertad', isCorrect: true },
          { id: 'opt3', label: 'Seguir el estatus social', isCorrect: false },
          { id: 'opt4', label: 'Ver el dinero como herramienta', isCorrect: true }
        ],
        feedback: '¡Excelente! La seguridad y la libertad son los pilares de una relación sana con tus finanzas.',
        instruction: 'Selecciona las opciones que consideres saludables.'
      }
    },
    {
      order: 12,
      type: 'info',
      title: 'Cambiando el chip',
      body: 'Lo primero para mejorar es darte cuenta de cómo piensas.\n\nSi hoy tu visión es de presión o estatus, ¡no pasa nada! Solo con identificarlo ya estás ganando control.',
      data: { mood: 'satisfied' }
    },
    {
      order: 13,
      type: 'order',
      title: 'El camino del control',
      body: 'Ordena los pasos para empezar a ver el dinero con intención.',
      data: {
        question: 'Ordena los pasos para empezar a ver el dinero con intención.',
        items: [
          { id: 'i1', label: 'Identificar mi visión actual', correctOrder: 1 },
          { id: 'i2', label: 'Elegir una visión de paz (seguridad/libertad)', correctOrder: 2 },
          { id: 'i3', label: 'Tomar una decisión basada en esa nueva visión', correctOrder: 3 },
          { id: 'i4', label: 'Repetir consistentemente', correctOrder: 4 }
        ],
        feedback: '¡Perfecto! El proceso empieza por la consciencia y termina en el hábito.'
      }
    },
    {
      order: 14,
      type: 'mcq',
      title: 'Reflexión actual',
      body: 'Hoy, ¿cómo se siente el dinero en tu vida mayormente?',
      data: {
        question: 'Hoy, ¿cómo se siente el dinero en tu vida mayormente?',
        options: [
          { id: 'opt1', label: 'Oportunidad', isCorrect: true },
          { id: 'opt2', label: 'Herramienta', isCorrect: true },
          { id: 'opt3', label: 'Presión', isCorrect: true },
          { id: 'opt4', label: 'Preocupación', isCorrect: true }
        ],
        graded: false, 
        shuffle: true,
        baselineLabel: 'perfil de relación con dinero'
      }
    },
    {
      order: 15,
      type: 'summary',
      title: '¡Felicidades!',
      body: 'Has dado el primer paso para cambiar tu percepción del dinero. ¡No es un número, es tu herramienta!\n\nEn la siguiente lección exploraremos tus expectativas reales.',
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

  console.log('✅ Lesson 1.A.1 seeded successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
