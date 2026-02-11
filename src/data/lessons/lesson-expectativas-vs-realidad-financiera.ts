import type { LessonStep } from "@/types/lessonTypes"

/**
 * Lesson 5: Expectativas vs realidad financiera
 * Theme: Mi relación con el dinero
 * Lesson ID: expectativas-vs-realidad-financiera
 * Difficulty: Intermediate. Audience: High school (15–18). Content: Spanish. Instructions: English.
 * Typography: Inter, SF Pro, Roboto, Helvetica Neue, sans-serif.
 * Images: Theory flashcards only; PNG, LEFT or RIGHT. No images on exercise slides.
 * Order step: items shown shuffled; AnswerKey = Aprendizaje → Errores → Constancia → Resultados visibles.
 * Final button: "Siguiente lección"
 */

const IMG = "/uploads/lesson-5"

export const lessonExpectativasVsRealidadFinancieraSteps: LessonStep[] = [
  // SLIDE 1 — Theory Flashcard (Image 1 RIGHT)
  {
    id: "evr-intro",
    stepType: "info",
    title: "",
    body: "Todos tenemos expectativas sobre el dinero.\nPero pocas veces analizamos si son realistas.",
    imageUrl: `${IMG}/image1.png`,
    imageAlign: "right",
    isAssessment: false,
    continueLabel: "Empezar",
    fullScreen: true,
  },

  // SLIDE 2 — Multiple Choice (no image)
  {
    id: "evr-mcq-1",
    stepType: "mcq",
    question: "¿Cuál es una expectativa poco realista común?",
    options: [
      {
        id: "opt-rico-rapido",
        label: "Hacerme rico rápido",
        isCorrect: true,
        explanation:
          "Muchas expectativas financieras nacen de fantasías, no de procesos reales.",
      },
      { id: "opt-ahorrar", label: "Ahorrar poco a poco", isCorrect: false },
      { id: "opt-planear", label: "Planear mis gastos", isCorrect: false },
      { id: "opt-comparar", label: "Comparar precios", isCorrect: false },
    ],
    isAssessment: true,
    recordIncorrect: true,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 3 — Theory Flashcard (Image 2 LEFT)
  {
    id: "evr-teoria-1",
    stepType: "info",
    title: "",
    body: "Las redes sociales muestran resultados.\nCasi nunca muestran procesos.",
    imageUrl: `${IMG}/image2.png`,
    imageAlign: "left",
    isAssessment: false,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 4 — True / False
  {
    id: "evr-tf",
    stepType: "true_false",
    statement:
      "Si alguien tiene dinero joven,\nsignifica que el proceso fue fácil.",
    correctValue: false,
    explanation:
      "No conocemos el contexto completo detrás de los resultados.",
    isAssessment: true,
    recordIncorrect: true,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 5 — Scenario Decision (no image)
  {
    id: "evr-scenario",
    stepType: "mcq",
    question:
      "Ves a alguien de tu edad viajando constantemente\ny piensas: \"Voy atrasado\".\n\n¿Qué está ocurriendo?",
    options: [
      {
        id: "opt-comparacion",
        label: "Comparación irreal",
        isCorrect: true,
        explanation:
          "Comparar procesos invisibles genera frustración innecesaria.",
      },
      { id: "opt-planeacion", label: "Planeación financiera", isCorrect: false },
      { id: "opt-disciplina", label: "Disciplina financiera", isCorrect: false },
      { id: "opt-educacion", label: "Educación financiera", isCorrect: false },
    ],
    isAssessment: true,
    recordIncorrect: true,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 6 — Theory Flashcard (Image 3 RIGHT)
  {
    id: "evr-teoria-2",
    stepType: "info",
    title: "",
    body: "Expectativa alta + realidad lenta = frustración.\n\nCuando no entendemos el proceso,\nabandonamos demasiado pronto.",
    imageUrl: `${IMG}/image3.png`,
    imageAlign: "right",
    isAssessment: false,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 7 — Order by Logical Process (shuffled; AnswerKey: Aprendizaje → Errores → Constancia → Resultados visibles)
  {
    id: "evr-order",
    stepType: "order",
    question: "Ordena el proceso financiero realista.",
    items: [
      { id: "item-aprendizaje", label: "Aprendizaje", correctOrder: 1 },
      { id: "item-errores", label: "Errores", correctOrder: 2 },
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
    id: "evr-teoria-3",
    stepType: "info",
    title: "",
    body: "El problema no es tener expectativas.\nEl problema es no entender el proceso.",
    imageUrl: `${IMG}/image4.png`,
    imageAlign: "left",
    isAssessment: false,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 9 — Multiple Choice (no image)
  {
    id: "evr-mcq-2",
    stepType: "mcq",
    question: "¿Qué es más saludable financieramente?",
    options: [
      { id: "opt-inmediatos", label: "Buscar resultados inmediatos", isCorrect: false },
      { id: "opt-compararme", label: "Compararme constantemente", isCorrect: false },
      {
        id: "opt-gradual",
        label: "Entender que el crecimiento es gradual",
        isCorrect: true,
        explanation: "El crecimiento sostenible toma tiempo.",
      },
      { id: "opt-suerte", label: "Esperar suerte", isCorrect: false },
    ],
    isAssessment: true,
    recordIncorrect: true,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 10 — Closure Reflection Flashcard (Image 5 RIGHT)
  {
    id: "evr-teoria-4",
    stepType: "info",
    title: "",
    body: "Cuando ajustas tus expectativas,\npuedes sostener el proceso.",
    imageUrl: `${IMG}/image5.png`,
    imageAlign: "right",
    isAssessment: false,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 11 — Progress Feedback
  {
    id: "evr-summary",
    stepType: "summary",
    title: "Lección completada",
    body: "Ahora entiendes la diferencia entre expectativa y proceso financiero real.",
    isAssessment: false,
    continueLabel: "Siguiente lección",
    fullScreen: true,
  },
]
