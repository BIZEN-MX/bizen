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
    stepType: "info",
    title: "",
    body: "El dinero crece lento.\nLa impaciencia lo destruye rápido.",
    imageUrl: `${IMG}/image1.png`,
    imageAlign: "right",
    isAssessment: false,
    continueLabel: "Empezar",
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
    title: "",
    body: "La mayoría abandona antes de ver resultados.\nNo porque sea imposible,\nsino porque tarda.",
    imageUrl: `${IMG}/image2.png`,
    imageAlign: "left",
    isAssessment: false,
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
    stepType: "mcq",
    question:
      "Empiezas a ahorrar.\nDespués de 2 meses no ves un gran cambio.\n\n¿Qué es más probable que pase?",
    options: [
      { id: "opt-continua", label: "Continúas constante", isCorrect: false },
      {
        id: "opt-abandonas",
        label: "Te frustras y abandonas",
        isCorrect: true,
        explanation: "La falta de resultados rápidos genera abandono.",
      },
      { id: "opt-ajustas", label: "Ajustas tu estrategia", isCorrect: false },
      { id: "opt-educacion", label: "Buscas educación", isCorrect: false },
    ],
    isAssessment: true,
    recordIncorrect: true,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 6 — Theory Flashcard (Image 3 RIGHT)
  {
    id: "pfm-teoria-2",
    stepType: "info",
    title: "",
    body: "Paciencia no es esperar sin hacer nada.\nEs actuar constantemente sin ver resultados inmediatos.",
    imageUrl: `${IMG}/image3.png`,
    imageAlign: "right",
    isAssessment: false,
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
    title: "",
    body: "La mentalidad a largo plazo\nreduce ansiedad a corto plazo.",
    imageUrl: `${IMG}/image4.png`,
    imageAlign: "left",
    isAssessment: false,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 9 — Multiple Choice (no image)
  {
    id: "pfm-mcq-2",
    stepType: "mcq",
    question: "¿Qué es más estratégico?",
    options: [
      { id: "opt-rapido", label: "Buscar dinero rápido", isCorrect: false },
      {
        id: "opt-disciplina",
        label: "Mantener disciplina constante",
        isCorrect: true,
        explanation: "La disciplina supera la motivación.",
      },
      { id: "opt-compararte", label: "Compararte con otros", isCorrect: false },
      { id: "opt-cambiar", label: "Cambiar de plan cada semana", isCorrect: false },
    ],
    isAssessment: true,
    recordIncorrect: true,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 10 — Closure Reflection Flashcard (Image 5 RIGHT)
  {
    id: "pfm-teoria-4",
    stepType: "info",
    title: "",
    body: "Si piensas a largo plazo,\ntomas decisiones más inteligentes hoy.",
    imageUrl: `${IMG}/image5.png`,
    imageAlign: "right",
    isAssessment: false,
    continueLabel: "Continuar",
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
