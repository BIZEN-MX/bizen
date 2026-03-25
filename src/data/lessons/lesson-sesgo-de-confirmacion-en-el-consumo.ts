import type { LessonStep } from "@/types/lessonTypes"

/**
 * Lesson: Sesgo de Confirmación en el consumo
 * Theme: El Tablero del Juego (Mentalidad)
 * Lesson ID: sesgo-de-confirmacion-en-el-consumo
 * Difficulty: Básico / Psicológico-Analítico
 */

export const lessonSesgoDeConfirmacionEnElConsumoSteps: LessonStep[] = [
  {
    id: "scc-slide-1",
    stepType: "billy_talks",
    mood: "thinking",
    body: "Tu cerebro ya eligió lo que quiere comprar. Ahora solo está buscando excusas. Eso se llama **Sesgo de Confirmación**.\n\nHoy vamos a aprender a detectar esas mentiras internas que nos contamos para sentirnos bien al gastar mal.",
    continueLabel: "Analizar el sesgo",
    fullScreen: true,
  },
  {
    id: "scc-slide-2",
    stepType: "info",
    title: "¿Qué es el Sesgo de Confirmación?",
    description: "La búsqueda de razones",
    body: "Es la tendencia de ignorar las razones para NO comprar algo y solo enfocarse en lo que nos conviene.\n\nIgnoramos el CAT de la tarjeta, el saldo bajo y la renta próxima, para enfocarnos solo en: 'Están en oferta' y 'Me lo merezco'.",
    continueLabel: "Ver ejemplo",
    fullScreen: true,
  },
  {
    id: "scc-slide-3",
    stepType: "mcq",
    title: "El Caso de Alberto",
    description: "Alberto quiere un videojuego de $1,400. Sabe que no tiene el dinero, pero lee reseñas que dicen: '¡Es una pieza de arte!' e ignora las que dicen: 'Está lleno de bugs'.",
    question: "¿Qué está haciendo Alberto emocionalmente?",
    options: [
      { id: "opt-1", label: "Analizando opciones de manera objetiva", isCorrect: false },
      { id: "opt-2", label: "Solo busca evidencia que apoye lo que ya quiere comprar", isCorrect: true, explanation: "Ignora lo negativo para que el deseo gane a la razón." },
      { id: "opt-3", label: "Esperando la oferta", isCorrect: false },
    ],
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "scc-slide-4",
    stepType: "blitz_challenge",
    title: "Reto Relámpago",
    description: "Ves una oferta del 50% de descuento en el 'Día del Niño'. El artículo cuesta $2,000 originalmente.",
    question: "Si compras el artículo solo por el descuento sin haberlo planeado, ¿cuánto dinero REALMENTE estás 'ahorrando'?",
    options: [
      { id: "opt-1", label: "$1,000", isCorrect: false },
      { id: "opt-2", label: "$0 (en realidad estás GASTANDO $1,000)", isCorrect: true, explanation: "Gastar en algo por 'oferta' no es ahorrar, es gastar con descuento." },
      { id: "opt-3", label: "$2,000", isCorrect: false },
    ],
    timeLimit: 15,
    isAssessment: true,
    fullScreen: true,
    aiInsight: "Billy dice: Si no lo ibas a comprar ANTES de la oferta, no estás ahorrando nada.",
  },
  {
    id: "scc-slide-5",
    stepType: "mindset_translator",
    question: "¿Cómo reenfocarías esta mentira para ver la realidad?",
    beliefs: [
      {
        id: "belief-1",
        original: "Compro este café de $85 pesos diario porque 'me ayuda a trabajar mejor' y 'me lo merezco'.",
        healthyOptions: [
          { id: "h1-1", label: "Gasto $2,500 al mes en café. Puedo trabajar igual con uno de casa y ahorrar de verdad.", isCorrect: true },
          { id: "h1-2", label: "Si no lo compro, seré un fracaso hoy en la oficina.", isCorrect: false },
        ]
      }
    ],
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "scc-slide-6",
    stepType: "true_false",
    statement: "Hacer una lista de 'Razones para NO comprar' antes de un gasto grande puede vencer al Sesgo de Confirmación.",
    correctValue: true,
    explanation: "Obligar a tu cerebro a ver la contraparte equilibra tu balanza de decisión.",
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "scc-slide-7",
    stepType: "impulse_meter",
    item: {
      name: "Upgrade a 'Combo Grande' en el cine",
      price: "$29 adicionales",
    },
    description: "Te dicen: '¡Por solo $29 más te llevas el doble!'. Tu cerebro dice: '¡Qué gran trato!', ignorando que ya vas a comer demasiado y no lo necesitas.",
    instructions: "Mantén presionado para quedarte con el tamaño que planeaste originalmente.",
    holdTime: 3.5,
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "scc-slide-8",
    stepType: "narrative_check",
    question: "¿Cuál es la excusa más común que usas para justificar un gasto que sabías que no debías hacer?",
    promptPlaceholder: "Mi excusa favorita es...",
    minChars: 15,
    billyResponse: "¡Esa frase es tu enemiga número uno! Identificarla es como desarmar una bomba.",
    isAssessment: false,
    fullScreen: true,
  },
  {
    id: "scc-slide-9",
    stepType: "summary",
    title: "Mente en Alerta",
    body: "Los mejores inversionistas son los que cuestionan sus propios deseos. Ahora tienes las herramientas para detectar cuándo tu cerebro te está mintiendo. En la siguiente lección, veremos por qué nos duele tanto perder.",
    continueLabel: "Finalizar Lección",
    fullScreen: true,
  },
]
