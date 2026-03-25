import type { LessonStep } from "@/types/lessonTypes"

/**
 * Lesson: Tu primer Estado de Resultados Personal
 * Theme: El Tablero del Juego (Mentalidad)
 * Lesson ID: tu-primer-estado-de-resultados-personal
 * Difficulty: Avanzado / Técnico
 */

export const lessonTuPrimerEstadoDeResultadosPersonalSteps: LessonStep[] = [
  {
    id: "erp-slide-1",
    stepType: "billy_talks",
    mood: "celebrating",
    body: "¡Felicidades, llegaste al final del primer bloque! Ya tienes todas las armas. Ahora vamos a ver el **Estado de Resultados**: la fotografía final de tu éxito financiero.\n\nHoy aprenderás a calcular cuánto vales hoy realmente (Capital Neto) y cómo hacer que ese número nunca deje de subir.",
    continueLabel: "La fotografía final",
    fullScreen: true,
  },
  {
    id: "erp-slide-2",
    stepType: "info",
    title: "¿Qué es el Estado de Resultados?",
    description: "Tu balance general",
    body: "Es la suma de lo que tienes menos lo que debes.\n\n• **Activos**: Dinero en el banco, inversiones, bienes que valen algo.\n• **Pasivos**: Deudas, tarjetas, préstamos de amigos.\n\n**Capital Neto = Activos - Pasivos.** \n¡Este es el número que realmente importa en el Tablero del Juego!",
    continueLabel: "Ver ejemplo",
    fullScreen: true,
  },
  {
    id: "erp-slide-4",
    stepType: "mcq",
    title: "El Caso de Julia 'La Exitosa'",
    description: "Julia gana $50,000 mensuales, tiene un coche de $400k (debe $350k al banco) y solo tiene $10,000 de ahorros. Su amigo Mario gana solo $15,000, pero tiene $100k ahorrados y cero deudas.",
    question: "¿Quién es 'más rico' según el Capital Neto hoy?",
    options: [
      { id: "opt-1", label: "Julia (gana más)", isCorrect: false },
      { id: "opt-2", label: "Mario ($100k neto vs. $60k neto de Julia)", isCorrect: true, explanation: "Julia tiene muchos pasivos (deuda del coche) que matan su riqueza real. $10k ahorros + $50k equidad del coche = $60k. Mario tiene $100k limpios." },
      { id: "opt-3", label: "Ninguno", isCorrect: false },
    ],
    isAssessment: true,
    fullScreen: true,
    aiInsight: "Billy dice: No confundas el estilo de vida con la riqueza real.",
  },
  {
    id: "erp-slide-5",
    stepType: "swipe_sorter",
    question: "Clasifica estos elementos para tu Estado de Resultados",
    leftBucket: { label: "Pasivo (Lo que debes)", color: "#ef4444" },
    rightBucket: { label: "Activo (Lo que tienes)", color: "#10b981" },
    items: [
      { id: "a-cetes", label: "Ahorro en Cetes", amount: "$5,000", correctBucket: "right" },
      { id: "a-deuda", label: "Deuda Coppel", amount: "$3,200", correctBucket: "left" },
      { id: "a-caja", label: "Efectivo en mano", amount: "$450", correctBucket: "right" },
      { id: "a-minimo", label: "Pago mínimo pendiente de tarjeta", amount: "$1,200", correctBucket: "left" },
      { id: "a-laptop", label: "Inversión en tu equipo de trabajo", amount: "$18,000", correctBucket: "right" },
    ],
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "erp-slide-6",
    stepType: "blitz_challenge",
    title: "Reto Relámpago",
    description: "Si hoy vendieras todo lo que tienes y pagaras todo lo que debes...",
    question: "¿Cómo se llama el dinero que te sobraría?",
    options: [
      { id: "opt-1", label: "Salario bruto", isCorrect: false },
      { id: "opt-2", label: "Capital Neto", isCorrect: true, explanation: "Es tu valor real en el mercado hoy." },
      { id: "opt-3", label: "Ahorro quincenal", isCorrect: false },
    ],
    timeLimit: 15,
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "erp-slide-7",
    stepType: "true_false",
    statement: "Tener un Capital Neto Negativo (deber mas de lo que tienes) es una emergencia financiera que debes resolver antes de salir a cenar fuera.",
    correctValue: true,
    explanation: "Si debes más de lo que tienes, estás técnicamente en la quiebra personal. ¡Hay que actuar rápido!",
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "erp-slide-8",
    stepType: "narrative_check",
    question: "¿Qué compromiso te haces hoy a ti mismo para que tu Capital Neto sea mayor el próximo mes?",
    promptPlaceholder: "Pagaré mi deuda de ... o ahorraré ... pesos.",
    minChars: 20,
    billyResponse: "¡Eso es un plan de ataque! Nos vemos en el siguiente módulo para dominar los gastos.",
    isAssessment: false,
    fullScreen: true,
  },
  {
    id: "erp-slide-9",
    stepType: "summary",
    title: "¡Maestro de Mentalidad!",
    body: "Has completado el Módulo 1. Sabes las reglas, conoces tus miedos y tienes las rutinas. Estás listo para el Siguiente Nivel: **Ingeniería del Gasto**. ¡Vamos!",
    continueLabel: "Finalizar Módulo Completado",
    fullScreen: true,
  },
]
