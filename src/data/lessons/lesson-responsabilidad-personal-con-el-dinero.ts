import type { LessonStep } from "@/types/lessonTypes"

/**
 * Lesson 7: Responsabilidad personal con el dinero
 * Theme: Mi relación con el dinero
 * Lesson ID: responsabilidad-personal-con-el-dinero
 */

export const lessonResponsabilidadPersonalConElDineroSteps: LessonStep[] = [
  // SLIDE 1 — FLASHCARD (Intro)
  {
    id: "rp-slide-1",
    stepType: "billy_talks",
    mood: "happy",
    body: "¡Hola! Billy de nuevo. Ya entendemos creencias y emociones, ahora hablemos de tomar el control.\n\nLa responsabilidad no es culpa, es el poder de decir: 'Mis decisiones presentes cambian mi futuro'.",
    continueLabel: "¡Estoy listo!",
    fullScreen: true,
  },

  // SLIDE 2 — Diagnostic (non-graded)
  {
    id: "rp-slide-2",
    stepType: "mcq",
    question: "Cuando algo sale mal financieramente, ¿qué piensas primero?",
    options: [
      { id: "opt-yo", label: "Fue mi decisión, puedo aprender", isCorrect: true },
      { id: "opt-otros", label: "Fue culpa de la economía o de otros", isCorrect: true },
    ],
    isAssessment: false,
    recordIncorrect: false,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 3 — Theory
  {
    id: "rp-slide-3",
    stepType: "info",
    title: "Círculo de control",
    description: "Enfocando tu energía",
    body: "La economía externa no la controlas, pero tu presupuesto sí.\n\nResponsabilidad es enfocar tu energía en lo que **SÍ** depende de ti.",
    continueLabel: "Entendido",
    fullScreen: true,
  },

  // SLIDE 4 — Blitz Challenge (1/2)
  {
    id: "rp-slide-4",
    stepType: "blitz_challenge",
    title: "Reto Relámpago",
    description: "Alguien dice: 'No ahorro porque todo está muy caro'.",
    question: "¿Qué tipo de pensamiento es?",
    options: [
      { id: "opt-externo", label: "Foco en factores externos", isCorrect: true, explanation: "Culpa a la economía sin buscar su margen de acción." },
      { id: "opt-responsable", label: "Responsabilidad personal", isCorrect: false },
    ],
    timeLimit: 20,
    isAssessment: true,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 5 — True / False
  {
    id: "rp-slide-5",
    stepType: "true_false",
    statement: "Tener responsabilidad personal significa que todo lo que pasa es culpa mía.",
    correctValue: false,
    explanation: "No es culpa, es centrarse en lo que puedes controlar para mejorar.",
    isAssessment: true,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 6 — Theory
  {
    id: "rp-slide-6",
    stepType: "billy_talks",
    mood: "mascot",
    body: "Si tomas la responsabilidad, dejas de ser una víctima de las circunstancias.\n\n¡Eres el piloto de tu propio vuelo financiero!",
    continueLabel: "Siguiente",
    fullScreen: true,
  },

  // SLIDE 7 — Blitz Challenge (2/2)
  {
    id: "rp-slide-7",
    stepType: "blitz_challenge",
    title: "Reto Relámpago",
    description: "Detectas un gasto hormiga que te está quitando dinero cada semana.",
    question: "¿Cuál es la acción más responsable?",
    options: [
      { id: "opt-cortar", label: "Ajustar mis hábitos y reducirlo", isCorrect: true, explanation: "Acción directa sobre lo que controlas." },
      { id: "opt-queja", label: "Quejarme de que el dinero no rinde", isCorrect: false },
    ],
    timeLimit: 20,
    isAssessment: true,
    continueLabel: "¡Hecho!",
    fullScreen: true,
  },

  // SLIDE 8 — Summary
  {
    id: "rp-slide-8",
    stepType: "summary",
    title: "¡Lección completada!",
    body: "Ahora tienes el poder más grande: la responsabilidad sobre tus decisiones. ¡Sigue así!",
    isAssessment: false,
    continueLabel: "Finalizar subtema",
    fullScreen: true,
  },
]
