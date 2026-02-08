import type { LessonStep } from "@/types/lessonTypes"

/**
 * Lesson: Qué es el dinero para mí
 * Theme: Mi relación con el dinero
 * Lesson ID: que-es-el-dinero-para-mi-hoy
 * Estimated duration: 12–15 minutes
 * 12 slides – intro, activation, theory, quizzes, reflection, closing, progress.
 */

export const lessonQueEsElDineroParaMiSteps: LessonStep[] = [
  // SLIDE 1 – Intro
  {
    id: "qed-intro",
    stepType: "info",
    title: "Qué es el dinero para mí",
    body: "Antes de hablar de números, vamos a hablar de ti.\n\nNo hay respuestas buenas o malas.",
    isAssessment: false,
    continueLabel: "Empezar",
    fullScreen: true,
  },

  // SLIDE 2 – Quick activation (no correct/incorrect; register selection only)
  {
    id: "qed-activation",
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

  // SLIDE 3 – Quick theory
  {
    id: "qed-teoria-1",
    stepType: "info",
    body: "El dinero no es solo algo que se gana o se gasta.\n\nTambién es algo que se siente.",
    isAssessment: false,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 4 – True or False
  {
    id: "qed-tf-1",
    stepType: "true_false",
    statement: "El dinero solo es importante para las personas que quieren ser ricas.",
    correctValue: false,
    explanation: "Falso. El dinero afecta a todos, incluso cuando no queremos pensar en él.",
    isAssessment: true,
    recordIncorrect: true,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 5 – Quick theory
  {
    id: "qed-teoria-2",
    stepType: "info",
    body: "Todos tenemos una relación con el dinero, aunque nunca nos hayan enseñado sobre él.",
    isAssessment: false,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 6 – Everyday example
  {
    id: "qed-ejemplo",
    stepType: "info",
    body: "Dos personas ganan lo mismo.\n\nUna vive tranquila.\n\nLa otra vive estresada.\n\nEl dinero es el mismo. La relación no.",
    isAssessment: false,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 7 – Multiple choice quiz
  {
    id: "qed-mcq-1",
    stepType: "mcq",
    question: "¿Qué influye más en cómo usamos el dinero?",
    options: [
      { id: "opt-cuanto", label: "Cuánto dinero tenemos", isCorrect: false },
      {
        id: "opt-pensar",
        label: "Nuestra forma de pensar sobre él",
        isCorrect: true,
        explanation: "Exacto. Dos personas con el mismo dinero pueden vivir situaciones muy distintas.",
      },
      { id: "opt-suerte", label: "La suerte", isCorrect: false },
      { id: "opt-demas", label: "Lo que hacen los demás", isCorrect: false },
    ],
    isAssessment: true,
    recordIncorrect: true,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 8 – Key idea
  {
    id: "qed-key-idea",
    stepType: "info",
    body: "Antes de aprender finanzas, hay que entender cómo pensamos.\n\nSi no, repetimos los mismos errores.",
    isAssessment: false,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 9 – True or False
  {
    id: "qed-tf-2",
    stepType: "true_false",
    statement: "Si no pienso mucho en el dinero, no me afecta.",
    correctValue: false,
    explanation: "Aunque no lo pienses, el dinero influye en decisiones todos los días.",
    isAssessment: true,
    recordIncorrect: true,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 10 – Mini reflection (no grade; save as personal progress)
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

  // SLIDE 11 – Lesson closing
  {
    id: "qed-cierre",
    stepType: "info",
    body: "No necesitas saberlo todo hoy.\n\nSolo empezar a darte cuenta.",
    isAssessment: false,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 12 – Progress & CTA
  {
    id: "qed-progress",
    stepType: "summary",
    title: "Lección completada",
    body: "Has completado esta lección.\n\nTu progreso se ha guardado.",
    isAssessment: false,
    continueLabel: "Siguiente lección: Cómo me hace sentir el dinero",
    fullScreen: true,
  },
]
