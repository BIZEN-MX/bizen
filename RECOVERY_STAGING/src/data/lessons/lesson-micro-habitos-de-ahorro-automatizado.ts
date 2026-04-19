import type { LessonStep } from "@/types/lessonTypes"

/**
 * Lesson: Micro-hábitos de ahorro automatizado
 * Theme: El Tablero del Juego (Mentalidad)
 * Lesson ID: micro-habitos-de-ahorro-automatizado
 * Difficulty: Básico / Práctico
 */

export const lessonMicroHabitosDeAhorroAutomatizadoSteps: LessonStep[] = [
  {
    id: "mha-slide-1",
    stepType: "billy_talks",
    mood: "happy",
    body: "¡Excelente! Ya sabes cómo ver y frenar el dinero. Pero falta algo vital: que el ahorro sea **automático**.\n\nHoy vamos a aprender a usar la tecnología del banco a tu favor para que tu dinero se guarde solo, sin que tú tengas que esforzarte ni decidir cada mes.",
    continueLabel: "Aprender a automatizar",
    fullScreen: true,
  },
  {
    id: "mha-slide-2",
    stepType: "info",
    title: "La Fuerza de Voluntad se Agota",
    description: "Por qué automatizar es clave",
    body: "Tu cerebro tiene una cantidad limitada de energía diaria para tomar decisiones. Si esperas a fin de mes para ahorrar 'lo que sobre', tu cerebro encontrará 1,000 razones para gastarlo antes.\n\n**Automatizar es decidir una sola vez para que el banco lo repita mil veces.**",
    continueLabel: "Ver ejemplo",
    fullScreen: true,
  },
  {
    id: "mha-slide-3",
    stepType: "mcq",
    title: "El Caso de Sofía y la 'Invisibilidad'",
    description: "Cada quincena, en cuanto le pagan, Sofía tiene una transferencia automática de $500 pesos a un 'Apartado' (bolsillo digital). Ella nunca ve esos $500 en su saldo disponible.",
    question: "¿Qué ventaja tiene Sofía sobre alguien que ahorra manualmente 'lo que sobra'?",
    options: [
      { id: "opt-1", label: "Gana más intereses", isCorrect: false },
      { id: "opt-2", label: "Elimina la tentación de gastar dinero que ya está 'fuera de su vista'", isCorrect: true, explanation: "Psicológicamente, si el dinero no está en el saldo 'gastable', dejamos de contar con él." },
      { id: "opt-3", label: "No tiene que ir al banco", isCorrect: false },
    ],
    isAssessment: true,
    fullScreen: true,
    aiInsight: "Billy dice: Los millonarios automatizan primero y gastan después.",
  },
  {
    id: "mha-slide-4",
    stepType: "blitz_challenge",
    title: "Reto Relámpago",
    description: "Si automatizas $20 pesos diarios (el costo de un dulce) en un 'Apartado' a partir de hoy...",
    question: "¿Cuánto dinero extra tendrás al final de un año (365 días) sin darte cuenta?",
    options: [
      { id: "opt-1", label: "$3,650", isCorrect: false },
      { id: "opt-2", label: "$7,300", isCorrect: true, explanation: "$20 x 365 = $7,300 extra. Equivale a un vuelo nacional o un celular nuevo." },
      { id: "opt-3", label: "$5,000", isCorrect: false },
    ],
    timeLimit: 15,
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "mha-slide-5",
    stepType: "true_false",
    statement: "Activar el 'Redondeo' en tus compras de tarjeta de débito es una forma de micro-ahorro automatizado que no duele en absoluto.",
    correctValue: true,
    explanation: "Cada peso extra que se va al apartado de redondeo suma cientos de pesos al mes sin esfuerzo consciente.",
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "mha-slide-6",
    stepType: "impulse_meter",
    item: {
      name: "Apartado Automático Quincenal",
      price: "$1,000 guardados",
    },
    description: "Hoy te pagan y tu transferencia de ahorro ya se ejecutó. Sientes el impulso de 'deshacerla' para un antojo, pero sabes que ese dinero ya es de tu 'Yo' del futuro.",
    instructions: "Mantén presionado para confirmar que ese ahorro se quede ahí. ¡Tú mandas!",
    holdTime: 3,
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "mha-slide-7",
    stepType: "narrative_check",
    question: "¿Cuál de estos podrías automatizar HOY mismo en tu app del banco? (Apartado, Ahorro recurrente, Redondeo, Traspaso a inversión)",
    promptPlaceholder: "Mi primer micro-hábito será...",
    minChars: 15,
    billyResponse: "¡Eso! Hazlo ahora mismo y olvídate de él. ¡Tu cuenta te lo agradecerá!",
    isAssessment: false,
    fullScreen: true,
  },
  {
    id: "mha-slide-8",
    stepType: "summary",
    title: "Ahorrador Máquina",
    body: "Has hackeado tu propia pereza. Ahora tu dinero se guarda solo. En la siguiente lección, aprenderás el 'Ritual del Domingo' para revisar tu progreso semanal como un verdadero CEO de tus finanzas.",
    continueLabel: "Finalizar Lección",
    fullScreen: true,
  },
]
