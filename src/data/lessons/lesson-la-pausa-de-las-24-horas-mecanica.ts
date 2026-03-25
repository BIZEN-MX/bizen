import type { LessonStep } from "@/types/lessonTypes"

/**
 * Lesson: La Pausa de las 24 Horas (Mecánica)
 * Theme: El Tablero del Juego (Mentalidad)
 * Lesson ID: la-pausa-de-las-24-horas-mecanica
 * Difficulty: Básico / Práctico
 */

export const lessonLaPausaDeLas24HorasMecanicaSteps: LessonStep[] = [
  {
    id: "p24-slide-1",
    stepType: "billy_talks",
    mood: "happy",
    body: "¡Bienvenido al bloque de acción! Ya sabes cómo te engañan, ahora vamos a construir tus defensas.\n\nLa herramienta más poderosa contra el marketing es el **tiempo**. Hoy aprenderás la Regla de las 24 Horas: el muro que protege tu dinero de tus impulsos.",
    continueLabel: "Instalar el muro",
    fullScreen: true,
  },
  {
    id: "p24-slide-2",
    stepType: "info",
    title: "La Química del Deseo",
    description: "¿Por qué queremos comprar YA?",
    body: "Cuando ves algo que te gusta, tu cerebro libera **Dopamina**. Es una señal de '¡Cómpralo ahora o se acabará!'.\n\nPero la dopamina es volátil: desaparece en unas horas. Si esperas, el deseo baja y la razón sube. Comprar con dopamina es comprar caro; comprar con razón es comprar inteligente.",
    continueLabel: "Ver la mecánica",
    fullScreen: true,
  },
  {
    id: "p24-slide-3",
    stepType: "order",
    question: "Ordena los pasos de la Regla de las 24 Horas",
    items: [
      { id: "p24-1", label: "Ves algo que 'necesitas' (Pico de dopamina)", correctOrder: 1 },
      { id: "p24-2", label: "Lo pones en el carrito pero NO pagas", correctOrder: 2 },
      { id: "p24-3", label: "Cierras la pestaña o sales de la tienda por 24 horas", correctOrder: 3 },
      { id: "p24-4", label: "Mañana revisas si todavía lo quieres", correctOrder: 4 },
    ],
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "p24-slide-4",
    stepType: "mcq",
    title: "El Test de la Mañana Siguiente",
    description: "Han pasado 24 horas desde que viste esos audífonos de $3,500. Hoy ya no sientes el 'corazón acelerado' al verlos.",
    question: "¿Qué deberías hacer si el deseo ya no es intenso?",
    options: [
      { id: "opt-1", label: "Comprarlos de todos modos para no perder la oferta", isCorrect: false },
      { id: "opt-2", label: "Cerrar la pestaña definitivamente; era un capricho, no una necesidad", isCorrect: true, explanation: "Felicidades, acabas de ahorrar $3,500 sin ningún esfuerzo, solo esperando." },
      { id: "opt-3", label: "Esperar otras 24 horas por si acaso", isCorrect: false },
    ],
    isAssessment: true,
    fullScreen: true,
    aiInsight: "Billy dice: El 80% de los carritos abandonados son victorias para tu libertad financiera.",
  },
  {
    id: "p24-slide-5",
    stepType: "blitz_challenge",
    title: "Reto Relámpago",
    description: "La regla base dice que si algo cuesta más del 1% de tu ingreso mensual, DEBES esperar 24h.",
    question: "Si ganas $10,000 al mes, ¿a partir de qué precio deberías aplicar la regla estrictamente?",
    options: [
      { id: "opt-1", label: "$1,000", isCorrect: false },
      { id: "opt-2", label: "$100", isCorrect: true, explanation: "El 1% de $10,000 es $100. Gastos arriba de eso acumulados son los que desangran tu cuenta." },
      { id: "opt-3", label: "$500", isCorrect: false },
    ],
    timeLimit: 15,
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "p24-slide-6",
    stepType: "true_false",
    statement: "La Regla de las 24 Horas también aplica para préstamos y créditos que te ofrecen en la app del banco.",
    correctValue: true,
    explanation: "Especialmente en créditos. Nunca firmes nada bajo presión o 'emoción' del momento.",
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "p24-slide-7",
    stepType: "impulse_meter",
    item: {
      name: "Oferta Flash: Reloj de $4,000",
      price: "¡Se acaba en 5 minutos!",
    },
    description: "El contador rojo parpadea. Tu cerebro grita: '¡Lo vas a perder!'. Sabes que debes aplicar la regla de las 24 horas aunque la oferta venza.",
    instructions: "Mantén presionado para dejar pasar la 'oferta' y salvar tus $4,000.",
    holdTime: 5,
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "p24-slide-8",
    stepType: "narrative_check",
    question: "¿En qué gasto reciente hubieras deseado aplicar la regla de las 24 horas para no arrepentirte hoy?",
    promptPlaceholder: "Hubiera esperado antes de comprar...",
    minChars: 20,
    billyResponse: "¡No te culpes! Úsalo como recordatorio para la próxima vez. La pausa es tu poder.",
    isAssessment: false,
    fullScreen: true,
  },
  {
    id: "p24-slide-9",
    stepType: "summary",
    title: "Dueño de tu Tiempo",
    body: "Has instalado el primer freno de mano a tu billetera. En la siguiente lección, aprenderás a llevar un 'Registro de Guerra' para saber exactamente a dónde se va cada peso que salvas.",
    continueLabel: "Finalizar Lección",
    fullScreen: true,
  },
]
