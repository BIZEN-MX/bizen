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
    stepType: "info",
    title: "",
    body: "Las primeras ideas que tienes sobre el dinero\nno las inventaste tú.",
    imageUrl: `${IMG}/image1.png`,
    imageAlign: "right",
    isAssessment: false,
    continueLabel: "Empezar",
    fullScreen: true,
  },

  // SLIDE 2 — Reflection (no image)
  {
    id: "mpc-reflection",
    stepType: "mcq",
    question: "¿Recuerdas alguna frase sobre el dinero que escuchabas en casa?",
    options: [
      { id: "opt-cuesta", label: "El dinero cuesta mucho", isCorrect: true },
      { id: "opt-ricos", label: "Los ricos son malos", isCorrect: true },
      { id: "opt-no-alcanza", label: "El dinero no alcanza", isCorrect: true },
      { id: "opt-no-recuerdo", label: "No recuerdo", isCorrect: true },
    ],
    isAssessment: false,
    recordIncorrect: false,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 3 — Theory Flashcard (Image 2 LEFT)
  {
    id: "mpc-teoria-1",
    stepType: "info",
    title: "",
    body: "Muchas creencias sobre el dinero\nse aprenden sin que nos demos cuenta.",
    imageUrl: `${IMG}/image2.png`,
    imageAlign: "left",
    isAssessment: false,
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
    stepType: "info",
    title: "",
    body: "Si escuchas \"el dinero es malo\" muchas veces,\ntu mente puede empezar a creerlo.",
    imageUrl: `${IMG}/image3.png`,
    imageAlign: "right",
    isAssessment: false,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 7 — Scenario Decision (no image)
  {
    id: "mpc-scenario",
    stepType: "mcq",
    question:
      "Quieres ahorrar, pero escuchas en tu cabeza:\n\"No sirve de nada\".\n\n¿Qué es eso?",
    options: [
      { id: "opt-emocion", label: "Una emoción", isCorrect: false },
      {
        id: "opt-creencia",
        label: "Una creencia",
        isCorrect: true,
        explanation: "Correcto. Es una idea aprendida, no un hecho.",
      },
      { id: "opt-hecho", label: "Un hecho", isCorrect: false },
      { id: "opt-regla", label: "Una regla", isCorrect: false },
    ],
    isAssessment: true,
    recordIncorrect: true,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 8 — Theory Flashcard (Image 4 LEFT)
  {
    id: "mpc-teoria-3",
    stepType: "info",
    title: "",
    body: "Las creencias no son hechos.\nSon ideas que podemos cuestionar.",
    imageUrl: `${IMG}/image4.png`,
    imageAlign: "left",
    isAssessment: false,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 9 — Multiple Choice
  {
    id: "mpc-mcq",
    stepType: "mcq",
    question: "¿Qué es lo más sano hacer con una creencia limitante?",
    options: [
      { id: "opt-ignorar", label: "Ignorarla", isCorrect: false },
      { id: "opt-defender", label: "Defenderla", isCorrect: false },
      {
        id: "opt-cuestionar",
        label: "Cuestionarla",
        isCorrect: true,
        explanation: "Cuestionar una creencia es el primer paso para cambiarla.",
      },
      { id: "opt-repetir", label: "Repetirla", isCorrect: false },
    ],
    isAssessment: true,
    recordIncorrect: true,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 10 — Theory Flashcard (Image 5 RIGHT)
  {
    id: "mpc-teoria-4",
    stepType: "info",
    title: "",
    body: "Entender tus creencias\nes el primer paso para transformarlas.",
    imageUrl: `${IMG}/image5.png`,
    imageAlign: "right",
    isAssessment: false,
    continueLabel: "Continuar",
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
