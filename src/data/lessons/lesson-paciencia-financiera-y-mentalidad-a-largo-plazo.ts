import type { LessonStep } from "@/types/lessonTypes"

/**
 * Lesson 6: Paciencia financiera y mentalidad a largo plazo
 * Theme: Mi relación con el dinero
 * Lesson ID: paciencia-financiera-y-mentalidad-a-largo-plazo
 * Difficulty: Intermediate-Advanced. Audience: High school (15–18). Content: Spanish. Instructions: English.
 * Typography: Inter, SF Pro, Roboto, Helvetica Neue, sans-serif.
 * Images: Theory flashcards only; PNG, LEFT or RIGHT. No images on exercise slides.
 * Order step: items shown shuffled; AnswerKey = Aprendizaje → Ajustes → Constancia → Resultados visibles.
 * Final button: "Siguiente lección"
 */

const IMG = "/uploads/lesson-6"

export const lessonPacienciaFinancieraYMentalidadALargoPlazoSteps: LessonStep[] = [
  // SLIDE 1 — Theory Flashcard (Image 1 RIGHT)
  {
    id: "pfm-intro",
    stepType: "billy_talks",
    mood: "happy",
    body: "¡Hola! Billy por aquí de nuevo. El dinero crece lento, ¡pero la impaciencia lo destruye muy rápido!\n\n¿Tienes la paciencia necesaria para ganar? ¡Vamos a poner a prueba tu temple!",
    continueLabel: "¡Empezar!",
    fullScreen: true,
  },

  // SLIDE 2 — Multiple Choice (no image)
  {
    id: "pfm-mcq-1",
    stepType: "mcq",
    question: "¿Cuál es una señal de impaciencia financiera?",
    options: [
      { id: "opt-ahorrar", label: "Ahorrar constantemente", isCorrect: false },
      {
        id: "opt-inmediatos",
        label: "Buscar resultados inmediatos",
        isCorrect: true,
        explanation: "La impaciencia suele llevar a malas decisiones.",
      },
      { id: "opt-analizar", label: "Analizar antes de gastar", isCorrect: false },
      { id: "opt-comparar", label: "Comparar opciones", isCorrect: false },
    ],
    isAssessment: true,
    recordIncorrect: true,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 3 — Theory Flashcard (Image 2 LEFT)
  {
    id: "pfm-teoria-1",
    stepType: "info",
    title: "La brecha del abandono",
    description: "Tiempos reales",
    body: "La mayoría de las personas abandonan justo antes de ver los resultados.\n\nNo porque sea imposible, sino porque simplemente **tarda** más de lo que esperaban. ¡Tú sé diferente!",
    imageUrl: IMG + "/image-2.png",
    imageAlign: "left",
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 4 — True / False
  {
    id: "pfm-tf",
    stepType: "true_false",
    statement: "Los resultados financieros sostenibles\nsuelen tomar tiempo.",
    correctValue: true,
    explanation: "El crecimiento estable es gradual.",
    isAssessment: true,
    recordIncorrect: true,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 5 — Scenario Decision (no image)
  {
    id: "pfm-scenario",
    stepType: "blitz_challenge",
    title: "Reto Relámpago",
    description: "Llevas 2 meses ahorrando pero no ves el cambio que esperabas. El iPhone nuevo te tienta.",
    question: "¿Qué es lo más difícil de hacer?",
    options: [
      { id: "opt-continua", label: "Continuar constante", isCorrect: true, explanation: "La constancia sin resultados inmediatos es el reto más grande." },
      { id: "opt-gastar", label: "Gastar el ahorro", isCorrect: false },
    ],
    timeLimit: 20,
    isAssessment: true,
    continueLabel: "¡Resistir!",
    fullScreen: true,
  },
  {
    id: "pfm-impulse",
    stepType: "impulse_meter",
    item: {
      name: "Compra impulsiva de fin de semana",
      price: "$1,800",
    },
    instructions: "Sientes que tu ahorro no avanza y quieres gastar en algo hoy mismo. ¡Resiste el impulso para mantener tu meta a largo plazo!",
    holdTime: 6,
    isAssessment: true,
    fullScreen: true,
  },

  // SLIDE 6 — Theory Flashcard (Image 3 RIGHT)
  {
    id: "pfm-teoria-2",
    stepType: "billy_talks",
    mood: "mascot",
    body: "Paciencia **NO** es esperar sentado sin hacer nada. Es actuar constantemente incluso si no ves el fruto todavía.\n\n¡Es como plantar un árbol, regarlo hoy da sombra mañana!",
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 7 — Order by Logical Growth (shuffled; AnswerKey: Aprendizaje → Ajustes → Constancia → Resultados visibles)
  {
    id: "pfm-order",
    stepType: "order",
    question: "Ordena el proceso real de crecimiento financiero.",
    items: [
      { id: "item-aprendizaje", label: "Aprendizaje", correctOrder: 1 },
      { id: "item-ajustes", label: "Ajustes", correctOrder: 2 },
      { id: "item-constancia", label: "Constancia", correctOrder: 3 },
      { id: "item-resultados", label: "Resultados visibles", correctOrder: 4 },
    ],
    isAssessment: true,
    recordIncorrect: true,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 8 — Key Idea Flashcard (Image 4 LEFT)
  {
    id: "pfm-teoria-3",
    stepType: "info",
    title: "Mira el calendario",
    description: "Visión panorámica",
    body: "La mentalidad a largo plazo reduce tu ansiedad a corto plazo. ¡Deja de mirar el reloj y mira el calendario!",
    imageUrl: IMG + "/image-4.png",
    imageAlign: "left",
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 9 — Multiple Choice (no image)
  {
    id: "pfm-blitz",
    stepType: "blitz_challenge",
    title: "Reto Relámpago",
    description: "Te ofrecen una inversión que promete 'duplicar tu dinero en 2 días'.",
    question: "¿Qué es lo más estratégico?",
    options: [
      { id: "opt-disciplina", label: "Ignorar y seguir mi plan constante", isCorrect: true, explanation: "La disciplina y el tiempo real son más seguros que el dinero rápido." },
      { id: "opt-riesgo", label: "Arriesgar para ir rápido", isCorrect: false },
    ],
    timeLimit: 20,
    isAssessment: true,
    continueLabel: "Avanzar",
    fullScreen: true,
  },

  // SLIDE 10 — Closure Reflection Flashcard (Image 5 RIGHT)
  {
    id: "pfm-teoria-4",
    stepType: "billy_talks",
    mood: "happy",
    body: "Si piensas a largo plazo, tomas decisiones más inteligentes hoy. ¡Tu 'yo' del futuro te lo va a agradecer muchísimo!",
    continueLabel: "¡Excelente!",
    fullScreen: true,
  },

  // SLIDE 11 — Progress Feedback
  {
    id: "pfm-summary",
    stepType: "summary",
    title: "Lección completada",
    body: "Ahora entiendes por qué la paciencia es una ventaja financiera.",
    isAssessment: false,
    continueLabel: "Siguiente lección",
    fullScreen: true,
  },
]
