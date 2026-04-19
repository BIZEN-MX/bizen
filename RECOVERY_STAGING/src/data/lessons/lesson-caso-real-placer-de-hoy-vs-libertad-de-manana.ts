import type { LessonStep } from "@/types/lessonTypes"

/**
 * Lesson: Caso Real: Placer de hoy vs. Libertad de mañana
 * Theme: El Tablero del Juego (Mentalidad)
 * Lesson ID: caso-real-placer-de-hoy-vs-libertad-de-manana
 * Difficulty: Avanzado / Analítico
 */

export const lessonCasoRealPlacerDeHoyVsLibertadDeMananaSteps: LessonStep[] = [
  {
    id: "crp-slide-1",
    stepType: "billy_talks",
    mood: "thinking",
    body: "Para terminar este bloque, vamos a ver un caso real que separa a los que viven al día de los que consiguen libertad.\n\nTodo se reduce a una sola decisión: **¿Prefieres el placer de hoy o la seguridad de mañana?** Vamos a ponerle números.",
    continueLabel: "Ver los números",
    fullScreen: true,
  },
  {
    id: "crp-slide-2",
    stepType: "info",
    title: "El Dilema del Concierto de $5,000",
    description: "Placer inmediato vs. Libertad lejana",
    body: "Un concierto es una experiencia increíble (Dopamina pura). Cuesta $5,000.\n\nPero esos $5,000, invertidos al 12% anual durante 20 años, se convertirían en casi **$50,000 pesos** sin que tú tengas que hacer nada.\n\n**Ese es el costo real del boleto: 10 veces su precio.**",
    continueLabel: "Comparar opciones",
    fullScreen: true,
  },
  {
    id: "crp-slide-3",
    stepType: "mcq",
    title: "La Decisión de Julia",
    description: "Julia elige IR al concierto. Se lo merece, sus amigos van y se siente bien. Pero ahora su cuenta está en cero y tiene que esperar 15 días para su siguiente pago.",
    question: "¿Qué 'regaló' Julia a cambio del concierto?",
    options: [
      { id: "opt-1", label: "Solo $5,000 pesos", isCorrect: false },
      { id: "opt-2", label: "$50,000 de su futuro y su paz mental por los próximos 15 días", isCorrect: true, explanation: "Priorizó un placer efímero sobre la estabilidad futura y la libertad de no preocuparse por el dinero." },
      { id: "opt-3", label: "Una oportunidad de inversión", isCorrect: false },
    ],
    isAssessment: true,
    fullScreen: true,
    aiInsight: "Billy dice: No está mal ir al concierto, siempre y cuando NO sea a costa de tu libertad futura.",
  },
  {
    id: "crp-slide-4",
    stepType: "blitz_challenge",
    title: "Reto Relámpago",
    description: "Ganas $10,000 adicionales por un bono. Tienes 3 opciones.",
    question: "¿Cuál de estas opciones construye TU LIBERTAD a largo plazo?",
    options: [
      { id: "opt-1", label: "Comprar ropa nueva", isCorrect: false },
      { id: "opt-2", label: "Invertirlos (se convertirán en $100k en el futuro)", isCorrect: true, explanation: "Invertir hoy compra libertad mañana." },
      { id: "opt-3", label: "Ahorrarlos en una cuenta que no me cobra manejo", isCorrect: false },
    ],
    timeLimit: 15,
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "crp-slide-5",
    stepType: "true_false",
    statement: "La brecha de riqueza entre dos personas con el mismo sueldo se debe casi siempre a sus decisiones de retrasar la gratificación inmediata.",
    correctValue: true,
    explanation: "El que sabe esperar, gana. Punto.",
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "crp-slide-6",
    stepType: "impulse_meter",
    item: {
      name: "Upgrade de Vuelo a Primera Clase",
      price: "$6,500 extras",
    },
    description: "El vuelo dura 3 horas. Te ofrecen el upgrade. Tu cerebro dice: '¡Dopamina hoy!', pero sabes que esos $6,500 son la base de tu fondo de emergencias.",
    instructions: "Mantén presionado para quedarte en clase turista y proteger tu libertad futura.",
    holdTime: 4.5,
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "crp-slide-7",
    stepType: "multi_select",
    title: "El Menú de la Libertad",
    description: "¿Qué se requiere para elegir la libertad sobre el placer inmediato?",
    question: "Selecciona las habilidades necesarias:",
    options: [
      { id: "opt-meta", label: "Tener metas claras", isCorrect: true },
      { id: "opt-pausa", label: "Saber hacer una pausa antes de gastar", isCorrect: true },
      { id: "opt-futuro", label: "Visualizar a tu 'Yo' del futuro", isCorrect: true },
      { id: "opt-comparar", label: "Dejar de comparar mis gastos con otros", isCorrect: true },
    ],
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "crp-slide-8",
    stepType: "summary",
    title: "Visionario del Futuro",
    body: "Has terminado el bloque de Sesgos y Decisiones. Ya sabes cómo te engaña tu cerebro. Prepárate, en el siguiente bloque (Rutinas de Control) aprenderás las armas técnicas para dominar tu dinero cada día.",
    continueLabel: "Finalizar Módulo",
    fullScreen: true,
  },
]
