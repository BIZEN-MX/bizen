import type { LessonStep } from "@/types/lessonTypes"

/**
 * Lesson: ¿Qué es el dinero para mí?
 * Theme: Mi relación con el dinero
 * Lesson ID: que-es-el-dinero-para-mi-hoy
 * Estimated duration: 12–15 minutes
 * 12 flashcards – intro, poll, theory, T/F, match, scenario, order, theory, T/F, reflection, theory, summary.
 * RULE: No two consecutive theory/text flashcards.
 * Typography: Inter (primary), SF Pro, Roboto, Helvetica Neue, sans-serif.
 * Instructions: English. Content: Spanish.
 */

export const lessonQueEsElDineroParaMiSteps: LessonStep[] = [
  // FLASHCARD 1 – Intro (Progressive intro) – heart & brain connection
  {
    id: "qed-intro",
    stepType: "info",
    title: "¿Qué es el dinero para mí?",
    body: "Antes de hablar de números,\nvamos a hablar de ti.\n\nNo hay respuestas buenas o malas.",
    isAssessment: false,
    continueLabel: "Empezar",
    fullScreen: true,
  },

  // FLASHCARD 2 – Engagement (Quick Poll, non-graded – store as personal insight)
  {
    id: "qed-poll",
    stepType: "mcq",
    question: "Cuando escuchas la palabra dinero, ¿qué sientes primero?",
    options: [
      { id: "opt-tranquilidad", label: "Tranquilidad", isCorrect: true },
      { id: "opt-estres", label: "Estrés", isCorrect: true },
      { id: "opt-emocion", label: "Emoción", isCorrect: true },
      { id: "opt-miedo", label: "Miedo", isCorrect: true },
      { id: "opt-indiferencia", label: "Indiferencia", isCorrect: true },
    ],
    isAssessment: false,
    recordIncorrect: false,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // FLASHCARD 3 – Theory – two cards (pensar/sentir → influye en decisiones)
  {
    id: "qed-teoria-1",
    stepType: "info",
    title: "Emociones y Dinero",
    body: "El dinero no es solo algo que se gana o se gasta.\nTambién es algo que se siente.",
    isAssessment: false,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // FLASHCARD 4 – Knowledge Check (True/False)
  {
    id: "qed-tf-1",
    stepType: "true_false",
    statement: "El dinero solo es importante para las personas que quieren ser ricas.",
    correctValue: false,
    isAssessment: true,
    recordIncorrect: true,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // FLASHCARD 5 – Concept Mapping (Match concept to meaning) – beach vs desk contrast
  {
    id: "qed-match",
    stepType: "match",
    question: "Relaciona el concepto con su significado.",
    leftItems: [
      { id: "left-dinero", label: "Dinero" },
      { id: "left-relacion", label: "Relación con el dinero" },
    ],
    rightItems: [
      { id: "right-influye", label: "Algo que influye en decisiones diarias" },
      { id: "right-pienso", label: "Cómo pienso y siento sobre el dinero" },
    ],
    correctPairs: [
      { leftId: "left-dinero", rightId: "right-influye" },
      { leftId: "left-relacion", rightId: "right-pienso" },
    ],
    isAssessment: true,
    recordIncorrect: true,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // FLASHCARD 6 – Example (Scenario) – stacked priority cards
  {
    id: "qed-scenario",
    stepType: "info",
    title: "Diferentes Realidades",
    body: "Dos personas ganan lo mismo.\nUna vive tranquila.\nLa otra vive estresada.\n\nEl dinero es el mismo.\nLa relación no.",
    isAssessment: false,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // FLASHCARD 7 – Structuring (Order by priority) – girl with piggy bank
  {
    id: "qed-order",
    stepType: "order",
    question: "Ordena lo que más influye en cómo usamos el dinero.",
    items: [
      { id: "item-pensar", label: "Forma de pensar", correctOrder: 1 },
      { id: "item-emociones", label: "Emociones", correctOrder: 2 },
      { id: "item-cantidad", label: "Cantidad de dinero", correctOrder: 3 },
    ],
    isAssessment: true,
    recordIncorrect: true,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // FLASHCARD 8 – Theory
  {
    id: "qed-teoria-2",
    stepType: "info",
    title: "Entender el pensamiento",
    body: "Antes de aprender finanzas,\nhay que entender cómo pensamos.",
    isAssessment: false,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // FLASHCARD 9 – Knowledge Check (True/False)
  {
    id: "qed-tf-2",
    stepType: "true_false",
    statement: "Si no pienso mucho en el dinero, no me afecta.",
    correctValue: false,
    isAssessment: true,
    recordIncorrect: true,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // FLASHCARD 10 – Reflection (non-graded – save as self-awareness data)
  {
    id: "qed-reflexion",
    stepType: "mcq",
    question: "Hoy, mi relación con el dinero es más:",
    options: [
      { id: "opt-tranquila", label: "Tranquila", isCorrect: true },
      { id: "opt-confusa", label: "Confusa", isCorrect: true },
      { id: "opt-estresante", label: "Estresante", isCorrect: true },
      { id: "opt-neutral", label: "Neutral", isCorrect: true },
    ],
    isAssessment: false,
    recordIncorrect: false,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // FLASHCARD 11 – Theory – reflection image
  {
    id: "qed-teoria-3",
    stepType: "info",
    title: "Observación",
    body: "Darte cuenta es el primer paso.\nNo cambiar nada todavía.\nSolo observar.",
    isAssessment: false,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // FLASHCARD 12 – Closure (Progress feedback – XP, progress bar, next lesson CTA)
  {
    id: "qed-progress",
    stepType: "summary",
    title: "Lección completada",
    body: "Has dado el primer paso para entender tu relación con el dinero.",
    isAssessment: false,
    continueLabel: "Siguiente lección: Cómo me hace sentir el dinero",
    fullScreen: true,
  },
]
