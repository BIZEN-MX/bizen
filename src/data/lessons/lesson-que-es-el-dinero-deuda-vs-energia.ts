import type { LessonStep } from "@/types/lessonTypes"

/**
 * Lesson: ¿Qué es el dinero? (Deuda vs. Energía)
 * Theme: El Tablero del Juego (Mentalidad)
 * Lesson ID: que-es-el-dinero-deuda-vs-energia
 * Difficulty: Introductory / Technical
 */

export const lessonQueEsElDineroDeudaVsEnergiaSteps: LessonStep[] = [
  // SLIDE 1 — Billy the Coach Intro
  {
    id: "qed-slide-1",
    stepType: "billy_talks",
    mood: "happy",
    body: "¡Bienvenido al nivel pro! Soy Billy. Olvida lo que crees saber. El dinero no es papel, es un **sistema de transferencia de energía y tiempo**.\n\nHoy vamos a analizar las reglas que los bancos y el sistema usan para que tú trabajes para el dinero, y cómo empezar a darle la vuelta.",
    continueLabel: "Vamos a la realidad",
    fullScreen: true,
  },

  // SLIDE 2 — Concepto Técnico (Info)
  {
    id: "qed-slide-2",
    stepType: "info",
    title: "El Dinero como Deuda",
    description: "¿De dónde viene el dinero realmente?",
    body: "En el sistema moderno, casi todo el dinero se crea a través de **deuda**. \n\nCuando pides un crédito, el banco 'crea' ese dinero de la nada, pero tú tienes que devolverlo con tu **tiempo futuro**. Si no entiendes esto, estarás comprando cosas con trozos de tu vida que aún no has vivido.",
    continueLabel: "Analizar impacto",
    fullScreen: true,
  },

  // SLIDE 3 — Ejercicio Analítico (MCQ)
  {
    id: "qed-slide-3",
    stepType: "mcq",
    title: "El Costo del Préstamo",
    description: "Carlos quiere un iPhone de $20,000. No tiene el dinero, así que lo saca a pagos chiquitos. Al final, después de 2 años, habrá pagado $35,000.",
    question: "Si Carlos gana $100 por hora, ¿cuántas horas EXTRAS de su vida tuvo que trabajar solo para pagar los INTERESES (el costo extra)?",
    options: [
      { id: "opt-1", label: "200 horas", isCorrect: false },
      { id: "opt-2", label: "150 horas", isCorrect: true, explanation: "$35,000 total - $20,000 capital = $15,000 intereses. $15,000 / $100 = 150 horas de vida." },
      { id: "opt-3", label: "350 horas", isCorrect: false },
      { id: "opt-4", label: "No le costó nada, fueron pagos chiquitos", isCorrect: false },
    ],
    isAssessment: true,
    continueLabel: "Continuar",
    fullScreen: true,
    aiInsight: "Billy dice: 150 horas son casi un mes completo de trabajo regalado al banco solo por no saber esperar.",
  },

  // SLIDE 4 — Dinero como Energía (Info)
  {
    id: "qed-slide-4",
    stepType: "info",
    title: "Dinero como Energía Acumulada",
    description: "Tu superpoder",
    body: "Cuando ahorras o inviertes, estás 'congelando' tu esfuerzo pasado para usarlo en el futuro sin tener que volver a trabajar por él.\n\n• **Ahorro al 0%**: Tu energía se evapora (por la inflación).\n• **Inversión**: Tu energía se multiplica sola.\n• **Deuda de consumo**: Estás quemando energía que aún no generas.",
    continueLabel: "Entendido",
    fullScreen: true,
  },

  // SLIDE 5 — Blitz Challenge (Rápido)
  {
    id: "qed-slide-5",
    stepType: "blitz_challenge",
    title: "Reto Relámpago",
    description: "Ves una oferta que dice 'Compre hoy y pague en 2026'.",
    question: "Desde la perspectiva de 'Dinero como Deuda', ¿qué te están pidiendo realmente?",
    options: [
      { id: "opt-1", label: "Un regalo del banco", isCorrect: false },
      { id: "opt-2", label: "Hipotecar tu libertad futura", isCorrect: true, explanation: "Te están amarrando a tener que trabajar en el futuro para pagar algo que consumiste hoy." },
      { id: "opt-3", label: "Una oportunidad de inversión", isCorrect: false },
    ],
    timeLimit: 15,
    isAssessment: true,
    continueLabel: "Comprobar",
    fullScreen: true,
  },

  // SLIDE 6 — Impulse Meter (Situacional)
  {
    id: "qed-slide-6",
    stepType: "impulse_meter",
    item: {
      name: "Suscripción 'Pro' que no usas",
      price: "$299/mes",
    },
    description: "Te das cuenta que llevas 6 meses pagando una app que nunca abres. Suma $1,794 tirados. Tu impulso es decir 'Luego la cancelo'.",
    instructions: "Mantén presionado para romper el hábito y cancelarla emocionalmente ahora.",
    holdTime: 3,
    isAssessment: true,
    fullScreen: true,
  },

  // SLIDE 7 — True or False (Sistémico)
  {
    id: "qed-slide-7",
    stepType: "true_false",
    statement: "Si el banco me ofrece un crédito más alto, significa que mis finanzas están sanas y puedo gastar más.",
    correctValue: false,
    explanation: "El banco ofrece crédito basado en cuánto te pueden cobrar, no en qué es mejor para tu riqueza personal.",
    isAssessment: true,
    continueLabel: "Avanzar",
    fullScreen: true,
  },

  // SLIDE 8 — Resumen Billy
  {
    id: "qed-slide-8",
    stepType: "billy_talks",
    mood: "thinking",
    body: "Para ganar este juego, hay que dejar de pensar en 'pesos' y empezar a pensar en 'unidades de libertad'.\n\nSi cada compra la mides en cuántas horas de tu vida te costó, dejarás de caer en las trampas del consumo rápido.",
    continueLabel: "Siguiente Lección",
    fullScreen: true,
  },

  // SLIDE 9 — Summary
  {
    id: "qed-slide-9",
    stepType: "summary",
    title: "Lección Completada",
    body: "Has entendido la diferencia entre trabajar por dinero y que el dinero trabaje por ti. En la siguiente lección calcularemos exactamente cuánto vale CADA MINUTO de tu tiempo.",
    isAssessment: false,
    continueLabel: "Continuar",
    fullScreen: true,
  },
]
