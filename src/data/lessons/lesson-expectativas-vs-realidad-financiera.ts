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
    stepType: "billy_talks",
    mood: "thinking",
    body: "¡Hola! Billy por aquí. Todos tenemos expectativas sobre el dinero, pero pocas veces analizamos si son realistas.\n\n¿Crees que el éxito llega de la noche a la mañana? ¡Vamos a ver la realidad!",
    continueLabel: "¡Empezar!",
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
    title: "El filtro de la realidad",
    description: "Expectativas vs Proceso",
    body: "Las redes sociales muestran resultados brillantes, ¡pero casi nunca muestran el proceso difícil detrás!\n\nNo te compares con la versión editada de los demás. ¡Tú tienes tu propio ritmo!",
    imageUrl: IMG + "/image-2.png",
    imageAlign: "left",
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
    stepType: "blitz_challenge",
    title: "Reto Relámpago",
    description: "Ves a alguien de tu edad viajando constantemente y te frustras por no tener lo mismo.",
    question: "¿Qué está ocurriendo?",
    options: [
      { id: "opt-comparacion", label: "Comparación irreal", isCorrect: true, explanation: "Comparar procesos invisibles genera frustración." },
      { id: "opt-suerte", label: "Falta de suerte", isCorrect: false },
    ],
    timeLimit: 20,
    isAssessment: true,
    continueLabel: "¡Avanzar!",
    fullScreen: true,
  },
  {
    id: "evr-mindset",
    stepType: "mindset_translator",
    question: "¿Cómo reenfocarías este pensamiento?",
    beliefs: [
      {
        id: "belief-fomo",
        original: "Si no tengo lo que ellos tienen a mi edad, soy un fracaso.",
        healthyOptions: [
          { id: "hf-1", label: "Cada quien tiene sus tiempos y recursos; mi progreso actual es valioso por sí mismo", isCorrect: true },
          { id: "hf-2", label: "Debo esforzarme el doble para alcanzarlos lo antes posible", isCorrect: false },
        ]
      }
    ],
    isAssessment: true,
    fullScreen: true,
  },

  // SLIDE 6 — Theory Flashcard (Image 3 RIGHT)
  {
    id: "evr-teoria-2",
    stepType: "billy_talks",
    mood: "thinking",
    body: "Expectativa alta + realidad lenta = ¡Frustración!\n\nCuando no entendemos el proceso real, abandonamos demasiado pronto. ¡Sé paciente con tu crecimiento!",
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
    title: "Enfocando el esfuerzo",
    description: "Construyendo la montaña",
    body: "El problema no es tener expectativas grandes. El problema es no entender el proceso para llegar allá.\n\n¡Los pasos pequeños son los que construyen la montaña!",
    imageUrl: IMG + "/image-4.png",
    imageAlign: "left",
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 9 — Multiple Choice (no image)
  {
    id: "evr-blitz",
    stepType: "blitz_challenge",
    title: "Reto Relámpago",
    description: "Buscas mejorar tu situación.",
    question: "¿Qué es más saludable?",
    options: [
      { id: "opt-gradual", label: "Entender que el crecimiento es gradual", isCorrect: true, explanation: "El crecimiento sostenible siempre toma tiempo y constancia." },
      { id: "opt-inmediatos", label: "Resultados inmediatos", isCorrect: false },
    ],
    timeLimit: 20,
    isAssessment: true,
    continueLabel: "Avanzar",
    fullScreen: true,
  },

  // SLIDE 10 — Closure Reflection Flashcard (Image 5 RIGHT)
  {
    id: "evr-teoria-4",
    stepType: "billy_talks",
    mood: "happy",
    body: "Cuando ajustas tus expectativas a la realidad, puedes sostener el proceso sin rendirte.\n\n¡Estás listo para el éxito real, no el de filtros!",
    continueLabel: "¡Genial!",
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
