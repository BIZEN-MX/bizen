import type { LessonStep } from "@/types/lessonTypes"

/**
 * Lesson 2: Cómo me hace sentir el dinero
 * Theme: Mi relación con el dinero
 * Lesson ID: como-me-hace-sentir-el-dinero
 * Difficulty: Introductory–Intermediate
 * Slides: 15
 */

export const lessonComoMeHaceSentirElDineroSteps: LessonStep[] = [
  // SLIDE 1 — FLASHCARD (Intro Theory)
  {
    id: "cms-slide-1",
    stepType: "info",
    title: "Cómo me hace sentir el dinero",
    body: "El dinero no solo se piensa.\nTambién se siente.\n\nA veces sentimos tranquilidad.\nA veces presión.\nA veces emoción.\nA veces miedo.\n\nEntender eso mejora cómo decidimos.",
    isAssessment: false,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 2 — Diagnostic Emotion Baseline (non-graded)
  {
    id: "cms-slide-2",
    stepType: "mcq",
    question: "Cuando tienes que pagar algo importante, ¿qué siente primero?",
    options: [
      { id: "opt-presion", label: "Presión", isCorrect: true },
      { id: "opt-tranquilidad", label: "Tranquilidad", isCorrect: true },
      { id: "opt-nervios", label: "Nervios", isCorrect: true },
      { id: "opt-indiferencia", label: "Indiferencia", isCorrect: true },
    ],
    isAssessment: false,
    recordIncorrect: false,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 3 — FLASHCARD (Theory)
  {
    id: "cms-slide-3",
    stepType: "info",
    title: "Emociones y Dinero",
    body: "Sentir emociones con el dinero es normal.\n\nEl problema no es sentir. El problema aparece cuando decides sin reconocer lo que estás sintiendo.\n\nEmoción no siempre significa mala decisión, pero emoción intensa sí puede nublar el análisis.",
    isAssessment: false,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 4 — Guided Classification (graded)
  {
    id: "cms-slide-4",
    stepType: "mcq",
    title: "Análisis de Caso",
    description: "Sofía ahorró durante semanas. Ve una oferta de algo que quería mucho y siente muchas ganas de comprarlo de inmediato.",
    question: "¿Cuál emoción está influyendo MÁS en ese momento?",
    options: [
      { id: "opt-paciencia", label: "Paciencia", isCorrect: false },
      { id: "opt-emocion", label: "Emoción", isCorrect: true, explanation: "La urgencia por comprar “ya” suele aparecer cuando la emoción está alta." },
      { id: "opt-tranquilidad", label: "Tranquilidad", isCorrect: false },
      { id: "opt-organizacion", label: "Organización", isCorrect: false },
    ],
    isAssessment: true,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 5 — True / False (graded)
  {
    id: "cms-slide-5",
    stepType: "true_false",
    statement: "Si una compra me hace sentir bien en el momento, eso prueba que fue una buena decisión financiera.",
    correctValue: false,
    explanation: "Sentirse bien en el momento no garantiza una buena decisión. Una decisión puede sentirse bien hoy y complicarte después.",
    isAssessment: true,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 6 — FLASHCARD (Theory)
  {
    id: "cms-slide-6",
    stepType: "info",
    title: "La pausa necesaria",
    body: "Una emoción puede darte información, pero no debería decidir por ti.\n\nPrimero reconoces lo que sientes. Después evalúas si la decisión tiene sentido.",
    isAssessment: false,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 7 — Scenario Decision (graded)
  {
    id: "cms-slide-7",
    stepType: "mcq",
    title: "El caso de Diego",
    description: "Diego está molesto por una discusión. Entra a una tienda online y empieza a llenar el carrito con cosas que no tenía planeadas.",
    question: "¿Cuál sería la acción MÁS inteligente antes de comprar?",
    options: [
      { id: "opt-comprar-rapido", label: "Comprar rápido para sentirse mejor", isCorrect: false },
      { id: "opt-esperar", label: "Esperar un momento y revisar si realmente lo necesita", isCorrect: true, explanation: "Hacer una pausa ayuda a separar emoción y decisión." },
      { id: "opt-ya-agregue", label: "Comprar porque ya agregó productos al carrito", isCorrect: false },
      { id: "opt-ignorar", label: "Ignorar cómo se siente y seguir navegando", isCorrect: false },
    ],
    isAssessment: true,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 8 — Match Situations to Emotion (graded)
  {
    id: "cms-slide-8",
    stepType: "match",
    question: "Relaciona cada situación con la emoción MÁS probable.",
    leftItems: [
      { id: "sit-deuda", label: "Recibir una deuda inesperada" },
      { id: "sit-meta", label: "Guardar dinero para una meta importante" },
      { id: "sit-saldo", label: "Ver que tu saldo está más bajo de lo que pensabas" },
      { id: "sit-comprar", label: "Comprar algo que querías desde hace tiempo" },
    ],
    rightItems: [
      { id: "int-estres", label: "Estrés" },
      { id: "int-tranquilidad", label: "Tranquilidad" },
      { id: "int-ansiedad", label: "Ansiedad" },
      { id: "int-emocion", label: "Emoción" },
    ],
    correctPairs: [
      { leftId: "sit-deuda", rightId: "int-estres" },
      { leftId: "sit-meta", rightId: "int-tranquilidad" },
      { leftId: "sit-saldo", rightId: "int-ansiedad" },
      { leftId: "sit-comprar", rightId: "int-emocion" },
    ],
    isAssessment: true,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 9 — FLASHCARD (Theory)
  {
    id: "cms-slide-9",
    stepType: "info",
    title: "Recuperar el control",
    body: "Cuando reconoces una emoción, recuperas control.\n\nCuando la ignoras, la emoción puede convertirse en impulso.",
    isAssessment: false,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 10 — Multiple Select (graded)
  {
    id: "cms-slide-10",
    stepType: "multi_select",
    title: "Señales de alerta",
    description: "Una emoción fuerte puede influir en una compra incluso si la persona “cree” que está decidiendo con lógica. Selecciona todas las correctas.",
    question: "¿Cuáles de estas señales pueden indicar que una emoción está influyendo en una compra?",
    options: [
      { id: "opt-rapido", label: "Querer decidir rápido", isCorrect: true },
      { id: "opt-justificar", label: "Justificar la compra después", isCorrect: true },
      { id: "opt-ignorar-plan", label: "Ignorar si estaba planeada", isCorrect: true },
      { id: "opt-impulso", label: "Sentir impulso inmediato", isCorrect: true },
    ],
    isAssessment: true,
    continueLabel: "Continuar",
    fullScreen: true,
    // Feedback: Cuando la emoción sube, suelen aparecer varias señales al mismo tiempo.
  },

  // SLIDE 11 — FLASHCARD (Key Idea)
  {
    id: "cms-slide-11",
    stepType: "info",
    title: "La meta real",
    body: "La meta no es “no sentir”.\n\nLa meta es:\nsentir, reconocer\ny decidir mejor.",
    isAssessment: false,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 12 — Order by Logic (graded)
  {
    id: "cms-slide-12",
    stepType: "order",
    question: "Ordena una forma más inteligente de decidir cuando una emoción es fuerte.",
    items: [
      { id: "step-4", label: "Decidir", correctOrder: 4 },
      { id: "step-2", label: "Hacer una pausa", correctOrder: 2 },
      { id: "step-3", label: "Evaluar si lo necesito", correctOrder: 3 },
      { id: "step-1", label: "Nombrar lo que siento", correctOrder: 1 },
    ],
    isAssessment: true,
    continueLabel: "Continuar",
    fullScreen: true,
    // Feedback: Primero reconoces la emoción. Luego recuperas claridad para decidir.
  },

  // SLIDE 13 — Error Diagnosis (graded)
  {
    id: "cms-slide-13",
    stepType: "mcq",
    title: "El pensamiento de Mariana",
    description: "Mariana piensa: “Estoy estresada. Me merezco comprar esto, aunque no me alcance”.",
    question: "¿Cuál es el principal problema en ese pensamiento?",
    options: [
      { id: "opt-lista", label: "Está haciendo una lista de prioridades", isCorrect: false },
      { id: "opt-mezcla", label: "Está mezclando emoción con justificación financiera", isCorrect: true, explanation: "La emoción explica cómo te sientes, pero no convierte una mala decisión en buena." },
      { id: "opt-comparar", label: "Está comparando precios antes de decidir", isCorrect: false },
      { id: "opt-consecuencias", label: "Está analizando consecuencias a largo plazo", isCorrect: false },
    ],
    isAssessment: true,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 14 — Diagnostic Reflection (non-graded)
  {
    id: "cms-slide-14",
    stepType: "mcq",
    question: "¿Qué emoción aparece con más frecuencia cuando piensas en dinero?",
    options: [
      { id: "opt-motivacion", label: "Motivación", isCorrect: true },
      { id: "opt-preocupacion", label: "Preocupación", isCorrect: true },
      { id: "opt-tranquilidad", label: "Tranquilidad", isCorrect: true },
      { id: "opt-presion", label: "Presión", isCorrect: true },
    ],
    isAssessment: false,
    recordIncorrect: false,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 15 — Progress Feedback
  {
    id: "cms-slide-15",
    stepType: "summary",
    title: "¡Lección completada!",
    body: "Ahora entiendes mejor cómo tus emociones pueden influir en tus decisiones con dinero.",
    isAssessment: false,
    continueLabel: "Siguiente lección",
    fullScreen: true,
  },
]
