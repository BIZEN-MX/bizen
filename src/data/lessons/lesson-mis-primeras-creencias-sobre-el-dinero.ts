import type { LessonStep } from "@/types/lessonTypes"

/**
 * Lesson 4: Mis primeras creencias sobre el dinero
 * Theme: Mi relación con el dinero
 * Lesson ID: mis-primeras-creencias-sobre-el-dinero
 * Audience: High school (15–18). Content: Spanish. Instructions: English.
 * Typography: Inter, SF Pro, Roboto, Helvetica Neue, sans-serif.
 * Images: Theory flashcards only; PNG, LEFT or RIGHT. No images on exercise slides.
 * Order step: items shown shuffled; AnswerKey = Familia → Escuela → Amigos → Redes sociales.
 * Final button: "Siguiente lección"
 */

const IMG = "/uploads/lesson-4"

export const lessonMisPrimerasCreenciasSobreElDineroSteps: LessonStep[] = [
  // SLIDE 1 — Theory Flashcard (Image 1 RIGHT)
  {
    id: "mpc-intro",
    stepType: "billy_talks",
    mood: "thinking",
    body: "¡Hola! Soy Billy. ¿Sabías que las primeras ideas que tienes sobre el dinero no las inventaste tú?\n\nSe nos pegan desde niños sin darnos cuenta. ¡Vamos a descubrir cuáles son las tuyas!",
    continueLabel: "¡Empecemos!",
    fullScreen: true,
  },

  // SLIDE 2 — Reflection (no image)
  {
    id: "mpc-reflection",
    stepType: "mcq",
    question: "¿Qué frase escuchabas más en casa?",
    options: [
      { id: "opt-cuesta", label: "El dinero cuesta mucho", isCorrect: true },
      { id: "opt-ricos", label: "Los ricos son malos", isCorrect: true },
      { id: "opt-no-alcanza", label: "El dinero no alcanza", isCorrect: true },
      { id: "opt-no-recuerdo", label: "No recuerdo nada claro", isCorrect: true },
    ],
    isAssessment: false,
    recordIncorrect: false,
    continueLabel: "Continuar",
    fullScreen: true,
  },
  {
    id: "mpc-detective",
    stepType: "influence_detective",
    scenario: "Escuchas a alguien decir: 'El dinero cambia a la gente para mal'. De pronto sientes desconfianza hacia los que tienen mucho.",
    options: [
      { id: "det-1", label: "Creencia heredada (Familia/Entorno)", emotion: "Social", isCorrect: true },
      { id: "det-2", label: "Análisis financiero real", emotion: "Finance", isCorrect: false },
      { id: "det-3", label: "Experiencia propia directa", emotion: "Inspiration", isCorrect: false },
    ],
    isAssessment: true,
    fullScreen: true,
  },

  // SLIDE 3 — Theory Flashcard (Image 2 LEFT)
  {
    id: "mpc-teoria-1",
    stepType: "info",
    title: "El sistema operativo",
    description: "Aprendizaje automático",
    body: "Muchas creencias se aprenden en automático. Son como el sistema operativo de tu mente financiera.\n\n¡Pero a veces ese sistema necesita una actualización!",
    imageUrl: IMG + "/image-2.png", // Following original pattern
    imageAlign: "left",
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 4 — True / False
  {
    id: "mpc-tf",
    stepType: "true_false",
    statement: "Las creencias que aprendí en mi infancia\nsiempre son correctas.",
    correctValue: false,
    explanation: "No todas las creencias heredadas son útiles.",
    isAssessment: true,
    recordIncorrect: true,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 5 — Order by Influence (items shuffled in UI; AnswerKey: Familia → Escuela → Amigos → Redes sociales)
  {
    id: "mpc-order",
    stepType: "order",
    question: "Ordena quién influyó más en tus primeras ideas sobre el dinero.",
    items: [
      { id: "item-familia", label: "Familia", correctOrder: 1 },
      { id: "item-escuela", label: "Escuela", correctOrder: 2 },
      { id: "item-amigos", label: "Amigos", correctOrder: 3 },
      { id: "item-redes", label: "Redes sociales", correctOrder: 4 },
    ],
    isAssessment: true,
    recordIncorrect: true,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 6 — Theory Flashcard (Image 3 RIGHT)
  {
    id: "mpc-teoria-2",
    stepType: "billy_talks",
    mood: "thinking",
    body: "Si escuchas 'el dinero es malo' mil veces, tu mente lo guarda como una verdad absoluta.\n\n¡Eso puede hacer que autosabotees tus propios ahorros después!",
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 7 — Scenario Decision (no image)
  {
    id: "mpc-scenario",
    stepType: "blitz_challenge",
    title: "Reto Relámpago",
    description: "Quieres ahorrar, pero una voz interna dice: '¡Disfruta ahora, mañana quién sabe!'",
    question: "¿Qué es ese pensamiento?",
    options: [
      { id: "opt-emocion", label: "Emoción temporal", isCorrect: false },
      { id: "opt-creencia", label: "Creencia limitante", isCorrect: true, explanation: "Es una idea que te frena, no una realidad inevitable." },
      { id: "opt-hecho", label: "Un hecho real", isCorrect: false },
    ],
    timeLimit: 20,
    isAssessment: true,
    continueLabel: "¡Rápido!",
    fullScreen: true,
  },

  // SLIDE 8 — Theory Flashcard (Image 4 LEFT)
  {
    id: "mpc-teoria-3",
    stepType: "info",
    title: "Creencia vs Realidad",
    description: "Cuestionando ideas",
    body: "Las creencias **NO** son hechos. Son solo ideas que aceptamos.\n\n¡Y lo mejor es que puedes cuestionarlas y elegir unas nuevas!",
    imageUrl: IMG + "/image-4.png",
    imageAlign: "left",
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 9 — Multiple Choice
  {
    id: "mpc-blitz",
    stepType: "blitz_challenge",
    title: "Reto Relámpago",
    description: "Detectas una idea que te frena a ahorrar.",
    question: "¿Qué es lo más sano hacer?",
    options: [
      { id: "opt-cuestionar", label: "Cuestionar si es verdad", isCorrect: true, explanation: "Cuestionar rompe el poder de la creencia limitante." },
      { id: "opt-ignorar", label: "Ignorarla y ya", isCorrect: false },
      { id: "opt-defender", label: "Defenderla", isCorrect: false },
    ],
    timeLimit: 20,
    isAssessment: true,
    continueLabel: "Avanzar",
    fullScreen: true,
  },

  // SLIDE 10 — Theory Flashcard (Image 5 RIGHT)
  {
    id: "mpc-teoria-4",
    stepType: "billy_talks",
    mood: "happy",
    body: "Entender tus creencias es el primer paso para transformarlas.\n\n¡Felicidades! Acabas de dar el paso más difícil hacia tu libertad financiera.",
    continueLabel: "¡Genial!",
    fullScreen: true,
  },

  // SLIDE 11 — Progress Feedback (XP, progress bar; button: Siguiente lección)
  {
    id: "mpc-summary",
    stepType: "summary",
    title: "Lección completada",
    body: "Ahora sabes de dónde vienen muchas de tus ideas sobre el dinero.",
    isAssessment: false,
    continueLabel: "Siguiente lección",
    fullScreen: true,
  },
]
