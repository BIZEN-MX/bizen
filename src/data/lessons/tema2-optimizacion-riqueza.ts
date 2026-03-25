import type { LessonStep } from "@/types/lessonTypes"

/**
 * Lesson: Capital Intelectual vs Capital Financiero
 * Theme: Optimización de la Riqueza
 */
export const lessonCapitalIntelectualVsFinancieroSteps: LessonStep[] = [
  {
    id: "cap-1",
    stepType: "billy_talks",
    mood: "thinking",
    body: "Si hoy te quitan todo tu dinero, pero conservas todo lo que sabes (tu Capital Intelectual), puedes recuperarlo todo.\n\nEl dinero es el resultado, el conocimiento es la causa.",
    fullScreen: true,
  },
  {
    id: "cap-2",
    stepType: "swipe_sorter",
    question: "Clasifica estos elementos en tu balance personal",
    leftBucket: { label: "Capital Financiero (Efectivo)", color: "#10b981" },
    rightBucket: { label: "Capital Intelectual (Saber)", color: "#3b82f6" },
    items: [
      { id: "i1", label: "Ahorros en el banco", amount: "$15,000", correctBucket: "left" },
      { id: "i2", label: "Certificación en Google Ads", amount: "Certificado", correctBucket: "right" },
      { id: "i3", label: "Habilidad para negociar contratos", amount: "Soft Skill", correctBucket: "right" },
      { id: "i4", label: "Bono de fin de año", amount: "$5,000", correctBucket: "left" },
      { id: "i5", label: "Dominio de 3 idiomas", amount: "Skill", correctBucket: "right" },
    ],
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "cap-3",
    stepType: "true_false",
    statement: "Un profesionista con alto Capital Intelectual pero poco Capital Financiero es más estable que alguien con dinero pero sin habilidades reales.",
    correctValue: true,
    explanation: "El mercado siempre volverá a premiar a quien sabe generar valor.",
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "cap-4",
    stepType: "summary",
    title: "El verdadero colchón",
    body: "Tus ahorros te dan paz hoy. Tus habilidades te dan paz para siempre.",
    fullScreen: true,
  },
]

/**
 * Lesson: El costo de no saber: Impuesto a la ignorancia
 */
export const lessonImpuestoALaIgnoranciaSteps: LessonStep[] = [
  {
    id: "ign-1",
    stepType: "billy_talks",
    mood: "worried",
    body: "No saber cómo funciona el dinero es como jugar al póker sin saber las reglas: alguien te las va a cobrar todas.\n\nYo lo llamo el **Impuesto a la Ignorancia**.",
    fullScreen: true,
  },
  {
    id: "ign-2",
    stepType: "mcq",
    question: "¿De quién fue ese dinero 'extra' que pagaste?",
    options: [
      { id: "o1", label: "Del banco (es suyo)", isCorrect: false },
      { id: "o2", label: "Tuyo, pero lo perdiste por no saber leer el contrato", isCorrect: true, explanation: "Ese fue tu impuesto a la ignorancia financiera." },
    ],
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "ign-3",
    stepType: "blitz_challenge",
    question: "¿Qué es más caro?",
    options: [
      { id: "o1", label: "Un curso de finanzas de $1,000", isCorrect: false },
      { id: "o2", label: "Perder $10,000 en una mala inversión por no saber", isCorrect: true },
    ],
    timeLimit: 12,
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "ign-4",
    stepType: "summary",
    title: "Deja de pagar ese impuesto",
    body: "Estudiar hoy es la forma más barata de ahorrar dinero mañana.",
    fullScreen: true,
  },
]

/**
 * Lesson: Apalancamiento: Hacer más con menos
 */
export const lessonApalancamientoHacerMasConMenosSteps: LessonStep[] = [
  {
    id: "apa-1",
    stepType: "billy_talks",
    mood: "celebrating",
    body: "Para mover una piedra gigante, no necesitas más fuerza, necesitas una palanca más larga.\n\nEn el dinero, las palancas se llaman **Apalancamiento**.",
    fullScreen: true,
  },
  {
    id: "apa-2",
    stepType: "order",
    question: "Ordena los tipos de apalancamiento de MENOR a MAYOR potencia de escala:",
    items: [
      { id: "p1", label: "Palanca de Trabajo (Tú mismo haciendo las cosas)", correctOrder: 1 },
      { id: "p2", label: "Palanca de Capital (Tu dinero trabajando)", correctOrder: 2 },
      { id: "p3", label: "Palanca de Código / Contenido (Internet grabando para ti)", correctOrder: 3 },
    ],
    isAssessment: true,
    fullScreen: true,
    aiInsight: "Billy dice: El código y el contenido son las palancas que hicieron a los nuevos ricos sin necesidad de pedir permiso a nadie.",
  },
  {
    id: "apa-3",
    stepType: "mcq",
    question: "Pero, ¿qué pasa si la inversión sale mal?",
    options: [
      { id: "o1", label: "No pasa nada, el banco entiende", isCorrect: false },
      { id: "o2", label: "Tusas pérdidas también se multiplican", isCorrect: true, explanation: "La palanca funciona para los dos lados (ganancias y pérdidas)." },
    ],
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "apa-4",
    stepType: "summary",
    title: "El artesano vs el ingeniero",
    body: "El artesano depende de sus manos. El ingeniero usa palancas. Tú estás aprendiendo Ingeniería del Ingreso.",
    fullScreen: true,
  },
]

/**
 * Lesson: Ingresos Recurrentes: Tu ejército de centavos
 */
export const lessonIngresosRecurrentesTuEjercitoSteps: LessonStep[] = [
  {
    id: "rec-1",
    stepType: "billy_talks",
    mood: "thinking",
    body: "El secreto de la libertad no es ganar mucho dinero una sola vez, es ganar dinero que regrese cada mes sin fallo.\n\nEso son los **Ingresos Recurrentes**.",
    fullScreen: true,
  },
  {
    id: "rec-2",
    stepType: "match",
    question: "Conecta el modelo recurrente con su ejemplo real:",
    leftItems: [
        { id: "l1", label: "Suscripción" },
        { id: "l2", label: "Renta" },
        { id: "l3", label: "Retención" },
    ],
    rightItems: [
        { id: "r1", label: "Netflix o software premium" },
        { id: "r2", label: "Arrendamiento de local" },
        { id: "r3", label: "Mantenimiento mensual de iguala" },
    ],
    correctPairs: [
        { leftId: "l1", rightId: "r1" },
        { leftId: "l2", rightId: "r2" },
        { leftId: "l3", rightId: "r3" },
    ],
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "rec-3",
    stepType: "mcq",
    question: "¿Cuál es el modelo de negocio más inteligente hoy?",
    options: [
      { id: "o1", label: "Vender un producto caro una sola vez", isCorrect: false },
      { id: "o2", label: "Generar una membresía o servicio mensual", isCorrect: true, explanation: "Te da flujo de caja constante y reduce tu costo de publicidad." },
    ],
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "rec-4",
    stepType: "summary",
    title: "Tu colchón de libertad",
    body: "Cuando tus ingresos recurrentes cubran tus gastos fijos, habrás ganado el juego.",
    fullScreen: true,
  },
]

/**
 * Lesson: Plan de Acción: Duplicar tu valor de mercado
 */
export const lessonPlanAccionDuplicarValorMercadoSteps: LessonStep[] = [
  {
    id: "plan-1",
    stepType: "billy_talks",
    mood: "celebrating",
    body: "Has completado el Módulo 2. Ahora sabes la diferencia entre sudar y generar valor.\n\nEs hora de tu **Hoja de Ruta de Ingeniería**.",
    fullScreen: true,
  },
  {
    id: "plan-2",
    stepType: "narrative_check",
    question: "Basado en tu Triángulo del Valor, ¿qué habilidad rara y escalable vas a empezar a aprender MAÑANA para duplicar tu ingreso el próximo año?",
    promptPlaceholder: "Aprenderé ... para poder ofrecer servicios de ... a escala ...",
    minChars: 40,
    billyResponse: "¡Ese es un plan digno de un Maestro BIZEN! No te detengas hasta lograrlo.",
    fullScreen: true,
  },
  {
    id: "plan-3",
    stepType: "mcq",
    question: "¿Cuál de estos cambios harás en tu gestión de tiempo para que esto ocurra?",
    options: [
      { id: "o1", label: "Eliminar 1 hora de redes sociales al día", isCorrect: true },
      { id: "o2", label: "Aprender mientras manejo (audio)", isCorrect: true },
      { id: "o3", label: "Eliminar una actividad que no genera valor", isCorrect: true },
    ],
    isAssessment: false,
    fullScreen: true,
  },
  {
    id: "plan-4",
    stepType: "summary",
    title: "¡Ingeniero de Ingresos Graduado!",
    body: "Has terminado el Tema 2. Tienes el mapa, tienes las herramientas y tienes el compromiso. \n\nNos vemos en el Tema 3: **Psicología Social y Blindaje Financiero**.",
    continueLabel: "Finalizar Módulo Completado",
    fullScreen: true,
  },
]
