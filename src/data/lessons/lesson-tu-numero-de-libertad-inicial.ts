import type { LessonStep } from "@/types/lessonTypes"

/**
 * Lesson: Tu 'Número de Libertad' Inicial
 * Theme: El Tablero del Juego (Mentalidad)
 * Lesson ID: tu-numero-de-libertad-inicial
 * Difficulty: Intermedio / Analítico
 */

export const lessonTuNumeroDeLibertadInicialSteps: LessonStep[] = [
  {
    id: "ndl-slide-1",
    stepType: "billy_talks",
    mood: "happy",
    body: "La libertad financiera no es ser millonario. Es poder decirle que 'no' a un jefe abusivo o a una situación que no te gusta porque tienes el respaldo para irte.\n\nHoy calcularemos tu **Índice de Independencia**: el número de meses que puedes vivir si dejaras de trabajar hoy mismo.",
    continueLabel: "Hacer los cálculos",
    fullScreen: true,
  },
  {
    id: "ndl-slide-2",
    stepType: "info",
    title: "¿Qué es el Número de Libertad?",
    description: "Tu escudo contra el mundo",
    body: "Es la cantidad de dinero que necesitas para cubrir tus **gastos vitales** (renta, comida, servicios) por un tiempo determinado.\n\nFórmula básica:\n**Ahorros actuales / Tus gastos mensuales = Tus meses de libertad.**",
    continueLabel: "Calcular el tuyo",
    fullScreen: true,
  },
  {
    id: "ndl-slide-3",
    stepType: "mcq",
    title: "El Caso de Sofía",
    description: "Sofía tiene $30,000 en el banco. Sus gastos esenciales (lo que no puede dejar de pagar) son de $6,000 al mes.",
    question: "¿Cuál es el Índice de Independencia de Sofía?",
    options: [
      { id: "opt-1", label: "2 meses", isCorrect: false },
      { id: "opt-2", label: "5 meses", isCorrect: true, explanation: "$30,000 / $6,000 = 5 meses de libertad." },
      { id: "opt-3", label: "3 meses", isCorrect: false },
      { id: "opt-4", label: "Indefinido", isCorrect: false },
    ],
    isAssessment: true,
    fullScreen: true,
    aiInsight: "Billy dice: 5 meses es un tiempo excelente para buscar un nuevo trabajo o emprender algo pequeño.",
  },
  {
    id: "ndl-slide-4",
    stepType: "blitz_challenge",
    title: "Reto Relámpago",
    description: "Sofía recorta sus gastos de Netflix y salidas, bajando su costo de vida de $6,000 a $5,000.",
    question: "Si sus ahorros siguen siendo $30,000, ¿cuántos meses de libertad tiene AHORA?",
    options: [
      { id: "opt-1", label: "5 meses", isCorrect: false },
      { id: "opt-2", label: "6 meses", isCorrect: true, explanation: "$30,000 / $5,000 = 6 meses. ¡Ahorrar también compra tiempo!" },
      { id: "opt-3", label: "4 meses", isCorrect: false },
    ],
    timeLimit: 20,
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "ndl-slide-5",
    stepType: "true_false",
    statement: "Tener un coche de lujo a plazos, aunque ganes mucho, puede BAJAR tu Índice de Independencia si tus gastos mensuales suben demasiado.",
    correctValue: true,
    explanation: "Si tus gastos fijos suben, necesitas mucho más dinero ahorrado para comprar un solo mes de libertad.",
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "ndl-slide-6",
    stepType: "impulse_meter",
    item: {
      name: "Viaje impulsivo a la playa",
      price: "$10,000",
    },
    description: "Andrés gasta $5,000 al mes. Estos $10,000 equivalen a 2 meses de su libertad futura. ¿Vale la pena quemar esa tranquilidad por 3 días de arena?",
    instructions: "Mantén presionado para decir 'No' y proteger esos 2 meses de vida.",
    holdTime: 3.5,
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "ndl-slide-7",
    stepType: "narrative_check",
    question: "Si hoy te quedaras sin tu principal fuente de ingreso, ¿exactamente cuántos meses podrías sobrevivir con lo que tienes hoy? Sé honesto contigo mismo.",
    promptPlaceholder: "Podría sobrevivir ... meses.",
    minChars: 10,
    billyResponse: "¡Esa es tu realidad hoy! No te asustes si el número es bajo. Para eso estamos aquí, para que ese número nunca deje de subir.",
    isAssessment: false,
    fullScreen: true,
  },
  {
    id: "ndl-slide-8",
    stepType: "summary",
    title: "Arquitecto de Tiempo",
    body: "Tener un número claro en la cabeza cambia tu forma de gastar. Ya no es 'perder $5,000', es 'perder un mes de vida libre'. En la siguiente lección, entenderemos las reglas del sistema que quiere bajarte ese número.",
    continueLabel: "Finalizar",
    fullScreen: true,
  },
]
