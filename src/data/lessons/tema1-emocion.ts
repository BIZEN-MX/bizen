import type { LessonStep } from "@/types/lessonTypes"

/**
 * Subtema B: Emoción
 */

/**
 * Lección 1: Cómo me hace sentir el dinero
 */
export const lessonComoMeHaceSentirElDineroSteps: LessonStep[] = [
  {
    id: "emo-1-1",
    stepType: "billy_talks",
    mood: "worried",
    body: "El dinero no es solo matemáticas; son sentimientos. ¿Ansiedad? ¿Poder? ¿Culpa? ¿Qué sientes cuando abres la app de tu banco?",
    fullScreen: true,
  },
  {
    id: "emo-1-2",
    stepType: "swipe_sorter",
    question: "Clasifica estas emociones financieras",
    leftBucket: { label: "Emoción que te drena", color: "#f43f5e" },
    rightBucket: { label: "Emoción que te empodera", color: "#10b981" },
    items: [
      { id: "e1", label: "Ansiedad por deudas", amount: "Estrés", correctBucket: "left" },
      { id: "e2", label: "Paz por tener ahorros", amount: "Control", correctBucket: "right" },
      { id: "e3", label: "Culpa por un gasto impulsivo", amount: "Remordimiento", correctBucket: "left" },
      { id: "e4", label: "Entusiasmo por una inversión", amount: "Visión", correctBucket: "right" },
    ],
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "emo-1-3",
    stepType: "summary",
    title: "Tus emociones, tu brújula",
    body: "Si el dinero te hace sentir mal, no es un problema de dinero, es un problema de relación con él.",
    fullScreen: true,
  },
]

/**
 * Lección 2: Señales de emoción dominando una decisión
 */
export const lessonSenalesDeEmocionDominandoUnaDecisionSteps: LessonStep[] = [
  {
    id: "emo-2-1",
    stepType: "billy_talks",
    mood: "thinking",
    body: "¿Alguna vez has comprado algo por puro aburrimiento o porque tuviste un mal día? Eso es tu emoción tomando el control del presupuesto.",
    fullScreen: true,
  },
  {
    id: "emo-2-2",
    stepType: "influence_detective",
    scenario: "Entras a la tienda para ver un par de tenis. De repente, ves una oferta relámpago del 50%. Tu corazón se acelera y piensas 'me lo merezco'.",
    options: [
      { id: "i1", label: "Esa es la euforia dominando tu decisión", emotion: "Euforia", isCorrect: true },
      { id: "i2", label: "Esa es tu lógica financiera", emotion: "Lógica", isCorrect: false },
    ],
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "emo-2-3",
    stepType: "summary",
    title: "Detectando al impostor",
    body: "Cuando tus manos tiemblan antes de pagar, no es el dinero, es el deseo. Respira antes de deslizar la tarjeta.",
    fullScreen: true,
  },
]

/**
 * Lección 3: Pausa financiera (reglas anti-impulso)
 */
export const lessonPausaFinancieraSteps: LessonStep[] = [
  {
    id: "emo-3-1",
    stepType: "billy_talks",
    body: "Aquí hay una regla mágica: **La Pausa de las 24 Horas**. Si algo cuesta más del 10% de tu ingreso, espera un día antes de comprarlo.",
    fullScreen: true,
  },
  {
    id: "emo-3-2",
    stepType: "fill_blanks",
    question: "La regla de oro del control:",
    textParts: [
        { type: "text", content: "Primero" },
        { type: "blank", id: "b1", correctOptionId: "opt-respira" },
        { type: "text", content: ", luego" },
        { type: "blank", id: "b2", correctOptionId: "opt-espera" },
        { type: "text", content: "y al final" },
        { type: "blank", id: "b3", correctOptionId: "opt-decide" },
    ],
    options: [
        { id: "opt-respira", label: "Respira", isCorrect: true },
        { id: "opt-espera", label: "Espera", isCorrect: true },
        { id: "opt-decide", label: "Decide", isCorrect: true },
    ],
    isAssessment: true,
    fullScreen: true,
    aiInsight: "Billy dice: La mayoría de los remordimientos financieros duran mucho más que la alegría de la compra.",
  },
  {
    id: "emo-3-3",
    stepType: "summary",
    title: "Tu nuevo escudo",
    body: "A partir de hoy, no eres un comprador impulsivo, eres un inversor pausado.",
    fullScreen: true,
  },
]

/**
 * Lección 4: Culpa y ansiedad financiera (cómo se forman)
 */
export const lessonCulpaYAnsiedadFinancieraSteps: LessonStep[] = [
  {
    id: "emo-4-1",
    stepType: "billy_talks",
    mood: "worried",
    body: "La culpa financiera nace de la brecha entre tus valores y tus gastos. Si valoras el futuro pero gastas todo hoy, sentirás culpa.",
    fullScreen: true,
  },
  {
    id: "emo-4-2",
    stepType: "true_false",
    statement: "Gastar en algo caro siempre está mal y debe causarte ansiedad.",
    correctValue: false,
    explanation: "Si el gasto está planeado y se ajusta a tus valores, no tiene por qué haber culpa.",
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "emo-4-3",
    stepType: "summary",
    title: "Sanando la relación",
    body: "Cuando tus gastos reflejan tus valores, la culpa desaparece.",
    fullScreen: true,
  },
]

/**
 * Lección 5: Emoción vs decisión (casos reales)
 */
export const lessonEmocionVsDecisionCasosRealesSteps: LessonStep[] = [
  {
    id: "emo-5-1",
    stepType: "billy_talks",
    body: "Vamos a ver si puedes separar la emoción del hecho en estos casos reales.",
    fullScreen: true,
  },
  {
    id: "emo-5-2",
    stepType: "blitz_challenge",
    question: "Tus amigos se van de viaje y tú no tienes presupuesto. ¿Qué haces?",
    options: [
      { id: "o1", label: "Pides un préstamo para no sentirte menos (Emoción)", isCorrect: false },
      { id: "o2", label: "Te quedas y ahorras para el próximo viaje (Decisión)", isCorrect: true },
    ],
    timeLimit: 12,
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "emo-5-3",
    stepType: "summary",
    title: "Módulo Finalizado",
    body: "Has aprendido a dominar tus emociones para que no ellas dominen tu dinero. ¡Sigue así!",
    continueLabel: "Ir a Subtema C: Creencias",
    fullScreen: true,
  },
]
