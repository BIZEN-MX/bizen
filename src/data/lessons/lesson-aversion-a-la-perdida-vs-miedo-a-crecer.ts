import type { LessonStep } from "@/types/lessonTypes"

/**
 * Lesson: Aversión a la pérdida vs. Miedo a crecer
 * Theme: El Tablero del Juego (Mentalidad)
 * Lesson ID: aversion-a-la-perdida-vs-miedo-a-crecer
 * Difficulty: Intermedio / Psicológico-Analítico
 */

export const lessonAversionALaPerdidaVsMiedoACrecerSteps: LessonStep[] = [
  {
    id: "ap-slide-1",
    stepType: "billy_talks",
    mood: "thinking",
    body: "Nos duele el DOBLE perder $100 que lo que nos emociona ganar $100. Ese miedo es el que te impide ahorrar e invertir.\n\nHoy vamos a aprender a desprogramar ese miedo a 'soltar' dinero para poder hacerlo crecer.",
    continueLabel: "Entender el dolor",
    fullScreen: true,
  },
  {
    id: "ap-slide-2",
    stepType: "info",
    title: "¿Qué es la Aversión a la Pérdida?",
    description: "El dolor de perder",
    body: "Es una trampa psicológica: preferimos no ganar nada con tal de evitar el riesgo de perder una pequeña parte.\n\nPor eso mucha gente deja sus ahorros en efectivo o en cuentas que no dan intereses: 'Al menos ahí está seguro'. No ven que pierden valor cada día por la inflación.",
    continueLabel: "Ver el riesgo real",
    fullScreen: true,
  },
  {
    id: "ap-slide-3",
    stepType: "mcq",
    title: "El Dilema del Inversor Novato",
    description: "Humberto tiene $1,000. Una inversión le ofrece un 10% de rendimiento anual ($100), pero hay una mínima probabilidad de que pierda $50 en un mes malo.",
    question: "Si Humberto prefiere dejar el dinero en su alcancía 'por seguridad', ¿qué es lo que realmente está pasando?",
    options: [
      { id: "opt-1", label: "Está siendo cauteloso", isCorrect: false },
      { id: "opt-2", label: "La aversión a la pérdida inmediata es mayor que su deseo de crecimiento futuro", isCorrect: true, explanation: "Prioriza evitar el dolor pequeño hoy sobre la recompensa grande mañana." },
      { id: "opt-3", label: "Está ahorrando dinero", isCorrect: false },
    ],
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "ap-slide-4",
    stepType: "blitz_challenge",
    title: "Reto Relámpago",
    description: "Imagina que el iPhone 15 baja de precio un 10%. Lo compras emocionado.",
    question: "Si tu inversión en Cetes (renta fija segura) bajó un 1% esta semana, ¿cuál es tu reacción honesta?",
    options: [
      { id: "opt-1", label: "Miedo a perder todo (Pánico)", isCorrect: true, explanation: "No nos molesta perder $20k en un celular que vale menos, pero sí $200 en una inversión. Ese es el sesgo." },
      { id: "opt-2", label: "Comprar más barato (Oportunidad)", isCorrect: false },
      { id: "opt-3", label: "Nada, es normal", isCorrect: false },
    ],
    timeLimit: 15,
    isAssessment: true,
    fullScreen: true,
    aiInsight: "Billy dice: Este sesgo nos hace comprar pasivos y tenerle miedo a los activos.",
  },
  {
    id: "ap-slide-5",
    stepType: "true_false",
    statement: "No invertir tu dinero por miedo a perder es, en realidad, GARANTIZAR que pierdas poder adquisitivo por la inflación.",
    correctValue: true,
    explanation: "El riesgo de no hacer nada es el riesgo oculto más caro de todos.",
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "ap-slide-6",
    stepType: "impulse_meter",
    item: {
      name: "Retiro de inversión cuando bajó un poco",
      price: "$2,000 de pérdida ficticia",
    },
    description: "Ves que tu cuenta de inversión tiene $50 pesos menos que ayer. Sientes pánico y quieres sacar todo y esconderlo bajo el colchón.",
    instructions: "Mantén presionado para respirar, calmar ese impulso y confiar en el largo plazo.",
    holdTime: 5,
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "ap-slide-7",
    stepType: "match",
    question: "Relaciona el miedo con su consecuencia financiera",
    leftItems: [
      { id: "m-perder", label: "Miedo a que la inversión baje" },
      { id: "m-faltar", label: "Miedo a que mañana falte dinero" },
      { id: "m-equivocarse", label: "Miedo a no saber cómo invertir" },
    ],
    rightItems: [
      { id: "c-paralizar", label: "Nunca empezar a invertir" },
      { id: "c-inflacion", label: "Todo en efectivo (inflación)" },
      { id: "c-venta", label: "Vender barato en el pánico" },
    ],
    correctPairs: [
      { leftId: "m-perder", rightId: "c-venta" },
      { leftId: "m-faltar", rightId: "c-inflacion" },
      { leftId: "m-equivocarse", rightId: "c-paralizar" },
    ],
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "ap-slide-8",
    stepType: "summary",
    title: "Mente Inquebrantable",
    body: "Has aprendido que el dolor de perder es solo un filtro de tu cerebro. Los que ganan dinero son los que aprenden a soportar fluctuaciones pequeñas para obtener ganancias grandes. En la siguiente lección, veremos por qué a veces creemos que sabemos más de lo que sabemos.",
    continueLabel: "Finalizar Lección",
    fullScreen: true,
  },
]
