import type { LessonStep } from "@/types/lessonTypes"

/**
 * Lesson: ¿Qué es el dinero para mí?
 * Theme: Mi relación con el dinero
 * Lesson ID: que-es-el-dinero-para-mi-hoy
 * Difficulty: Introductory
 * Slides: 15
 */

export const lessonQueEsElDineroParaMiSteps: LessonStep[] = [
  // SLIDE 1 — FLASHCARD (Intro Theory)
  {
    id: "qed-slide-1",
    stepType: "info",
    title: "¿Qué es el dinero para mí?",
    body: "Antes de aprender a ahorrar, invertir o emprender,\nhay una pregunta más importante:\n\n¿Qué significa el dinero para ti?\n\nTu respuesta influye en muchas decisiones,\naun que todavía no te des cuenta.",
    isAssessment: false,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 2 — Diagnostic Perception (non-graded)
  {
    id: "qed-slide-2",
    stepType: "mcq",
    question: "Cuando escuchas la palabra \"dinero\", ¿qué idea aparece primero?",
    options: [
      { id: "opt-seguridad", label: "Seguridad", isCorrect: true },
      { id: "opt-libertad", label: "Libertad", isCorrect: true },
      { id: "opt-presion", label: "Presión", isCorrect: true },
      { id: "opt-preocupacion", label: "Preocupación", isCorrect: true },
    ],
    isAssessment: false,
    recordIncorrect: false,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 3 — FLASHCARD (Theory)
  {
    id: "qed-slide-3",
    stepType: "info",
    title: "Diferentes significados",
    body: "El dinero no representa lo mismo para todos.\n\nPuede sentirse como:\n• **seguridad** (me protege)\n• **presión** (me estresa)\n• **estatus** (me hace verme de cierta forma)\n• **herramienta** (me ayuda a cumplir metas)\n\nEstas ideas cambian cómo decides.",
    isAssessment: false,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 4 — Guided Classification (graded)
  {
    id: "qed-slide-4",
    stepType: "mcq",
    title: "Análisis de caso",
    description: "Si alguien guarda dinero “por si surge una emergencia”,",
    question: "¿qué interpretación del dinero aparece más claramente?",
    options: [
      { id: "opt-estatus", label: "Estatus", isCorrect: false },
      { id: "opt-seguridad", label: "Seguridad", isCorrect: true, explanation: "Guardar dinero para cubrir una necesidad futura suele reflejar seguridad." },
      { id: "opt-presion", label: "Presión", isCorrect: false },
      { id: "opt-apariencia", label: "Apariencia", isCorrect: false },
    ],
    isAssessment: true,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 5 — Guided Multiple Choice (graded)
  {
    id: "qed-slide-5",
    stepType: "mcq",
    title: "Percepciones sociales",
    description: "Una persona compra algo caro para que los demás la vean “exitosa”.",
    question: "¿Qué interpretación del dinero aparece más claramente?",
    options: [
      { id: "opt-metas", label: "Herramienta para metas", isCorrect: false },
      { id: "opt-estatus", label: "Estatus", isCorrect: true, explanation: "Aquí el dinero se usa para proyectar imagen o valor frente a otros." },
      { id: "opt-seguridad", label: "Seguridad", isCorrect: false },
      { id: "opt-organizacion", label: "Organización", isCorrect: false },
    ],
    isAssessment: true,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 6 — FLASHCARD (Example Theory)
  {
    id: "qed-slide-6",
    stepType: "info",
    title: "Mismo dinero, distinta visión",
    body: "Dos personas pueden tener la misma cantidad de dinero\ny vivirla de forma muy distinta.\n\nNo cambia solo la cantidad.\nCambia el significado que cada quien le da.",
    isAssessment: false,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 7 — True / False (graded)
  {
    id: "qed-slide-7",
    stepType: "true_false",
    statement: "Si dos personas tienen el mismo dinero,\nnormalmente tomarán las mismas decisiones.",
    correctValue: false,
    explanation: "Las decisiones cambian según la percepción, emociones y creencias de cada persona.",
    isAssessment: true,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 8 — Match Concepts (graded)
  {
    id: "qed-slide-8",
    stepType: "match",
    question: "Relaciona cada situación con la interpretación del dinero MÁS lógica.",
    leftItems: [
      { id: "sit-metas", label: "Ahorrar para pagar una certificación" },
      { id: "sit-presion", label: "Evitar revisar el saldo por miedo" },
      { id: "sit-estatus", label: "Comprar para impresionar a otros" },
      { id: "sit-seguridad", label: "Guardar dinero para una emergencia" },
    ],
    rightItems: [
      { id: "int-metas", label: "El dinero como herramienta para metas" },
      { id: "int-presion", label: "El dinero como presión" },
      { id: "int-estatus", label: "El dinero como estatus" },
      { id: "int-seguridad", label: "El dinero como seguridad" },
    ],
    correctPairs: [
      { leftId: "sit-metas", rightId: "int-metas" },
      { leftId: "sit-presion", rightId: "int-presion" },
      { leftId: "sit-estatus", rightId: "int-estatus" },
      { leftId: "sit-seguridad", rightId: "int-seguridad" },
    ],
    isAssessment: true,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 9 — FLASHCARD (Theory)
  {
    id: "qed-slide-9",
    stepType: "info",
    title: "¿Cuándo empieza todo?",
    body: "Tu relación con el dinero no empieza\ncuando ganas dinero.\n\nEmpieza con cómo lo observas,\ncómo lo sientes\ny qué significado le das.",
    isAssessment: false,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 10 — Scenario Diagnosis (graded)
  {
    id: "qed-slide-10",
    stepType: "mcq",
    title: "El caso de Mario",
    description: "Mario recibe dinero extra. Piensa: “Me lo merezco, luego veo cómo me acomodo”. Termina gastándolo completo en una tarde.",
    question: "¿Qué influyó MÁS en su decisión?",
    options: [
      { id: "opt-planeacion", label: "Planeación financiera", isCorrect: false },
      { id: "opt-ahorro", label: "Estrategia de ahorro", isCorrect: false },
      { id: "opt-emocion", label: "Emoción/percepción del momento", isCorrect: true, explanation: "Su decisión nace de una sensación inmediata, no desde un plan." },
      { id: "opt-prioridades", label: "Análisis de prioridades", isCorrect: false },
    ],
    isAssessment: true,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 11 — Multiple Select (graded)
  {
    id: "qed-slide-11",
    stepType: "multi_select",
    title: "Impacto profundo",
    description: "La forma en que percibes el dinero puede afectar más cosas que solo “gastar o ahorrar”. Selecciona todas las correctas.",
    question: "¿Cuáles de estas áreas pueden verse afectadas por tu percepción del dinero?",
    options: [
      { id: "opt-gastas", label: "Cómo gastas", isCorrect: true },
      { id: "opt-ahorras", label: "Cómo ahorras", isCorrect: true },
      { id: "opt-sentir", label: "Cómo te sientes al pagar", isCorrect: true },
      { id: "opt-metas", label: "Qué metas te parecen posibles", isCorrect: true },
    ],
    isAssessment: true,
    continueLabel: "Continuar",
    fullScreen: true,
    // Feedback: Tu percepción del dinero influye en decisiones, emociones y expectativas.
  },

  // SLIDE 12 — FLASHCARD (Key Idea)
  {
    id: "qed-slide-12",
    stepType: "info",
    title: "Tu base personal",
    body: "Primero no necesitas “saber más de dinero”.\n\nPrimero necesitas entender\ncómo lo estás viendo hoy.\n\nEsa base cambia todo lo demás.",
    isAssessment: false,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 13 — Order by Logic (graded)
  {
    id: "qed-slide-13",
    stepType: "order",
    question: "Ordena cómo suele formarse una decisión financiera personal.",
    items: [
      { id: "step-resultado", label: "Resultado", correctOrder: 4 },
      { id: "step-decision", label: "Decisión", correctOrder: 3 },
      { id: "step-emocion", label: "Emoción", correctOrder: 2 },
      { id: "step-pensamiento", label: "Pensamiento", correctOrder: 1 },
    ],
    isAssessment: true,
    continueLabel: "Continuar",
    fullScreen: true,
    // Feedback: Lo que piensas influye en lo que sientes, y eso impacta tu decisión.
  },

  // SLIDE 14 — Diagnostic Reflection (non-graded)
  {
    id: "qed-slide-14",
    stepType: "mcq",
    question: "Hoy, el dinero se parece más a:",
    options: [
      { id: "opt-herramienta", label: "Una herramienta", isCorrect: true },
      { id: "opt-presion", label: "Una presión", isCorrect: true },
      { id: "opt-oportunidad", label: "Una oportunidad", isCorrect: true },
      { id: "opt-preocupacion", label: "Una preocupación", isCorrect: true },
    ],
    isAssessment: false,
    recordIncorrect: false,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 15 — Progress Feedback
  {
    id: "qed-slide-15",
    stepType: "summary",
    title: "¡Lección completada!",
    body: "Acabas de identificar una idea clave: el dinero no es solo una cantidad. También es una percepción.",
    isAssessment: false,
    continueLabel: "Siguiente lección",
    fullScreen: true,
  },
]
