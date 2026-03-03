import type { LessonStep } from "@/types/lessonTypes"

/**
 * Lesson 2: Cómo me hace sentir el dinero
 * Theme: Mi relación con el dinero
 * Lesson ID: como-me-hace-sentir-el-dinero
 * Estimated duration: 12–15 minutes
 * Language: Content in Spanish, instructions in English.
 *
 * Images only on flashcard (info) slides; no images on quizzes, match, order, etc.
 */

const IMG = "/uploads/lesson-2"

export const lessonComoMeHaceSentirElDineroSteps: LessonStep[] = [
  // FLASHCARD 1 – Intro
  {
    id: "cms-intro",
    stepType: "info",
    title: "Sentimientos y Dinero",
    body: "El dinero no solo se piensa.\nTambién se siente.",
    isAssessment: false,
    continueLabel: "Empezar",
    fullScreen: true,
  },

  // FLASHCARD 2 – Quick Poll (no image)
  {
    id: "cms-poll",
    stepType: "mcq",
    question: "Cuando tienes que pagar algo, normalmente te sientes:",
    options: [
      { id: "opt-tranquilo", label: "Tranquilo", isCorrect: true },
      { id: "opt-nervioso", label: "Nervioso", isCorrect: true },
      { id: "opt-estresado", label: "Estresado", isCorrect: true },
      { id: "opt-indiferente", label: "Indiferente", isCorrect: true },
    ],
    isAssessment: false,
    recordIncorrect: false,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // FLASHCARD 3 – Theory
  {
    id: "cms-teoria-1",
    stepType: "info",
    title: "Influencia Emocional",
    body: "Las emociones influyen en cómo usamos el dinero.",
    isAssessment: false,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // FLASHCARD 4 – True / False
  {
    id: "cms-tf-1",
    stepType: "true_false",
    statement: "Las decisiones de dinero siempre son racionales.",
    correctValue: false,
    isAssessment: true,
    recordIncorrect: true,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // FLASHCARD 5 – Match (NO image per rule)
  {
    id: "cms-match",
    stepType: "match",
    question: "Relaciona la situación con la emoción más común.",
    leftItems: [
      { id: "left-saldo", label: "Ver mi saldo" },
      { id: "left-comprar", label: "Comprar algo que quiero" },
      { id: "left-deuda", label: "Pagar una deuda" },
      { id: "left-ahorrar", label: "Ahorrar" },
    ],
    rightItems: [
      { id: "right-ansiedad", label: "Ansiedad" },
      { id: "right-emocion", label: "Emoción" },
      { id: "right-estres", label: "Estrés" },
      { id: "right-tranquilidad", label: "Tranquilidad" },
    ],
    correctPairs: [
      { leftId: "left-saldo", rightId: "right-ansiedad" },
      { leftId: "left-comprar", rightId: "right-emocion" },
      { leftId: "left-deuda", rightId: "right-estres" },
      { leftId: "left-ahorrar", rightId: "right-tranquilidad" },
    ],
    isAssessment: true,
    recordIncorrect: true,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // FLASHCARD 6 – Theory
  {
    id: "cms-teoria-2",
    stepType: "info",
    title: "Decisiones y Emociones",
    body: "No es malo sentir emociones con el dinero.\nEl problema es decidir solo con ellas.",
    isAssessment: false,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // FLASHCARD 7 – Scenario
  {
    id: "cms-scenario",
    stepType: "mcq",
    question: "Ves algo que te gusta mucho,\npero no lo tenías planeado comprar.\n\n¿Qué emoción aparece primero?",
    options: [
      { id: "opt-emocion", label: "Emoción", isCorrect: true },
      { id: "opt-ansiedad", label: "Ansiedad", isCorrect: true },
      { id: "opt-culpa", label: "Culpa", isCorrect: true },
      { id: "opt-indiferencia", label: "Indiferencia", isCorrect: true },
    ],
    isAssessment: false,
    recordIncorrect: false,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // FLASHCARD 8 – Order by intensity
  {
    id: "cms-order",
    stepType: "order",
    question: "Ordena las emociones de menor a mayor intensidad cuando se trata de dinero.",
    items: [
      { id: "item-estres", label: "Estrés", correctOrder: 3 },
      { id: "item-tranquilidad", label: "Tranquilidad", correctOrder: 1 },
      { id: "item-miedo", label: "Miedo", correctOrder: 4 },
      { id: "item-emocion", label: "Emoción", correctOrder: 2 },
    ],
    isAssessment: true,
    recordIncorrect: true,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // FLASHCARD 9 – Theory
  {
    id: "cms-teoria-3",
    stepType: "info",
    title: "Autoconocimiento",
    body: "Reconocer cómo me siento\nme ayuda a decidir mejor.",
    isAssessment: false,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // FLASHCARD 10 – MCQ (no image: content-dense)
  {
    id: "cms-mcq",
    stepType: "mcq",
    question: "¿Qué emoción suele llevar a decisiones impulsivas?",
    options: [
      { id: "opt-tranquilidad", label: "Tranquilidad", isCorrect: false },
      {
        id: "opt-emocion",
        label: "Emoción",
        isCorrect: true,
        explanation: "Correcto. La emoción intensa puede nublar la decisión.",
      },
      { id: "opt-paciencia", label: "Paciencia", isCorrect: false },
      { id: "opt-reflexion", label: "Reflexión", isCorrect: false },
    ],
    isAssessment: true,
    recordIncorrect: true,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // FLASHCARD 11 – Reflection
  {
    id: "cms-reflexion",
    stepType: "mcq",
    question: "La emoción que más influye en mis decisiones con dinero es:",
    options: [
      { id: "opt-miedo", label: "Miedo", isCorrect: true },
      { id: "opt-estres", label: "Estrés", isCorrect: true },
      { id: "opt-emocion", label: "Emoción", isCorrect: true },
      { id: "opt-culpa", label: "Culpa", isCorrect: true },
    ],
    isAssessment: false,
    recordIncorrect: false,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // FLASHCARD 12 – Closure (Progress Feedback)
  {
    id: "cms-cierre",
    stepType: "summary",
    title: "Lección completada",
    body: "Ahora entiendes mejor cómo te hace sentir el dinero.",
    isAssessment: false,
    continueLabel: "Siguiente lección",
    fullScreen: true,
  },
]
