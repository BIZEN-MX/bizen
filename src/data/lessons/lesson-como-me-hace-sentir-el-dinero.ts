import type { LessonStep } from "@/types/lessonTypes"

/**
 * Lesson: Cómo me hace sentir el dinero
 * Theme: Mi relación con el dinero
 * Lesson ID: como-me-hace-sentir-el-dinero
 * Level: Introductory–Intermediate
 * Rule: No images. Text-only content.
 */

export const lessonComoMeHaceSentirElDineroSteps: LessonStep[] = [
  // SLIDE 1 — FLASHCARD (Teoría)
  {
    id: "cms-slide-1",
    stepType: "billy_talks",
    mood: "happy",
    body: "¡Hola! Billy por aquí. ¿Sabías que el cerebro financiero a veces se apaga cuando el corazón late rápido?\n\nEl dinero no solo se piensa, también se siente. El problema aparece cuando una emoción fuerte toma el control y decides sin analizar.",
    continueLabel: "¡Vamos!",
    fullScreen: true,
  },

  // SLIDE 2 — Diagnóstico (No calificado)
  {
    id: "cms-slide-2",
    stepType: "mcq",
    question: "Cuando tienes que pagar algo importante, ¿qué sientes primero?",
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
    description: "Guardando tu perfil emocional...",
  },

  // SLIDE 3 — Flashcard (Teoría con criterio)
  {
    id: "cms-slide-3",
    stepType: "info",
    title: "Señales de alerta",
    description: "Dominio emocional",
    body: "Una emoción domina una decisión cuando aparecen señales como:\n\n• **Urgencia**: \"Lo quiero ya\".\n• **Justificación rápida**: \"Me lo merezco\".\n• **Evitar consecuencias**: \"Luego veo\".\n• **Impulso físico**: Estrés.\n\n¡Si sientes que queman las manos por pagar, es una alerta emocional!",
    continueLabel: "Entendido",
    fullScreen: true,
  },

  // SLIDE 4 — Ejercicio (Calificado) -> Blitz Challenge (1/2)
  {
    id: "cms-slide-4",
    stepType: "blitz_challenge",
    title: "Reto Relámpago",
    description: "Sofía ve una oferta limitada. Piensa: \"Si no lo compro hoy, pierdo la oportunidad\" y siente urgencia.",
    question: "¿Qué emoción domina según las señales?",
    options: [
      { id: "opt-tranquilidad", label: "Tranquilidad", isCorrect: false },
      { id: "opt-emocion", label: "Emoción", isCorrect: true, explanation: "La urgencia y el 'lo quiero ya' son señales de emoción dominando." },
      { id: "opt-paciencia", label: "Paciencia", isCorrect: false },
      { id: "opt-indiferencia", label: "Indiferencia", isCorrect: false },
    ],
    timeLimit: 20,
    isAssessment: true,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 5 — Ejercicio (Calificado) Verdadero o Falso
  {
    id: "cms-slide-5",
    stepType: "true_false",
    statement: "Reconocer lo que siento antes de comprar puede ayudarme a decidir mejor.",
    correctValue: true,
    explanation: "Nombrar la emoción reduce impulsos y mejora la claridad de la decisión.",
    isAssessment: true,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 6 — Flashcard (Teoría aplicada)
  {
    id: "cms-slide-6",
    stepType: "billy_talks",
    mood: "mascot",
    body: "La emoción no es enemiga, es información. Pero no debería decidir por ti.\n\n**Regla simple**: cuando haya urgencia, estrés o impulso, ¡haz una pausa! El aire que apaga el fuego de la compra.",
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 7 — Ejercicio (Calificado) -> Impulse Meter (Psychology)
  {
    id: "cms-slide-7",
    stepType: "impulse_meter",
    item: {
      name: "Carrito lleno (Cosas no planeadas)",
      price: "$2,450",
    },
    description: "Diego está molesto por su día en el trabajo y quiere comprar todo para 'sentirse mejor'. Está a un clic de pagar.",
    instructions: "Ayúdalo a hacer la pausa necesaria para que la emoción baje y la lógica regrese.",
    holdTime: 5,
    isAssessment: true,
    continueLabel: "Pausa lograda",
    fullScreen: true,
  },

  // SLIDE 8 — Ejercicio (Calificado) Matching
  {
    id: "cms-slide-8",
    stepType: "match",
    question: "Relaciona situación con la emoción más probable",
    leftItems: [
      { id: "sit-saldo", label: "Ves que tu saldo es menor de lo que pensabas" },
      { id: "sit-meta", label: "Guardas dinero para una meta importante" },
      { id: "sit-cobro", label: "Te llega un cobro inesperado" },
      { id: "sit-deseo", label: "Compras algo que querías hace tiempo" },
    ],
    rightItems: [
      { id: "int-ansiedad", label: "Ansiedad" },
      { id: "int-tranquilidad", label: "Tranquilidad" },
      { id: "int-estres", label: "Estrés" },
      { id: "int-emocion", label: "Emoción" },
    ],
    correctPairs: [
      { leftId: "sit-saldo", rightId: "int-ansiedad" },
      { leftId: "sit-meta", rightId: "int-tranquilidad" },
      { leftId: "sit-cobro", rightId: "int-estres" },
      { leftId: "sit-deseo", rightId: "int-emocion" },
    ],
    isAssessment: true,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 9 — Flashcard (Teoría)
  {
    id: "cms-slide-9",
    stepType: "info",
    title: "Tipos de compra",
    description: "Planeación vs Impulso",
    body: "Recuerda los dos tipos de compra:\n\n• **Planeada**: Sabes por qué y para qué.\n• **Impulsiva**: Nace de una emoción fuerte.\n\n¡La planeación es el mapa que te salva del bosque!",
    continueLabel: "Entendido",
    fullScreen: true,
  },

  // SLIDE 10 — Ejercicio (Calificado) -> Mindset Translator (Psychology)
  {
    id: "qed-mindset-2",
    stepType: "mindset_translator",
    question: "Detectando justificaciones vacías",
    beliefs: [
      {
        id: "belief-mariana",
        original: "Estoy estresada. Me merezco comprar esto aunque no me alcance.",
        healthyOptions: [
          { id: "hm-1", label: "Mi estrés es real, pero gastar lo que no tengo solo me traerá más estrés mañana.", isCorrect: true },
          { id: "hm-2", label: "Si trabajo duro, el dinero no debería ser una preocupación hoy.", isCorrect: false },
          { id: "hm-3", label: "Un pequeño gusto no afecta mi futuro si me hace feliz ahora.", isCorrect: false },
        ]
      }
    ],
    isAssessment: true,
    continueLabel: "Mente clara",
    fullScreen: true,
  },

  // SLIDE 11 — Ejercicio (Calificado) Multi select -> Blitz Challenge (2/2)
  {
    id: "cms-slide-11",
    stepType: "blitz_challenge",
    title: "Reto Relámpago",
    description: "Cuando una emoción domina, aparecen varias señales a la vez.",
    question: "¿Cuáles indican una compra impulsiva?",
    options: [
      { id: "opt-rapido", label: "Querer decidir rápido", isCorrect: true },
      { id: "opt-ignorar", label: "Ignorar si estaba planeado", isCorrect: true },
      { id: "opt-justificar", label: "Justificar después de pagar", isCorrect: true },
      { id: "opt-impulso", label: "Sentir impulso inmediato", isCorrect: true },
    ],
    timeLimit: 20,
    isAssessment: true,
    continueLabel: "¡Excelente!",
    fullScreen: true,
  },

  // SLIDE 12 — Flashcard (Teoría método 4 pasos)
  {
    id: "cms-slide-12",
    stepType: "billy_talks",
    mood: "mascot",
    body: "¡Anótalo! Estos 4 pasos son como el cinturón de seguridad de tus ahorros:\n\n1. **Nombrar** lo que siento.\n2. **Pausar** 30 segundos.\n3. **Evaluar** si lo necesito.\n4. **Decidir** con calma.",
    continueLabel: "¡Memorizado!",
    fullScreen: true,
  },

  // SLIDE 13 — Ejercicio (Calificado) Ordenar
  {
    id: "cms-slide-13",
    stepType: "order",
    question: "Ordena el método de 4 pasos de Billy",
    items: [
      { id: "step-nombrar", label: "Nombrar lo que siento", correctOrder: 1 },
      { id: "step-pausar", label: "Pausar", correctOrder: 2 },
      { id: "step-evaluar", label: "Evaluar si lo necesito", correctOrder: 3 },
      { id: "step-decidir", label: "Decidir", correctOrder: 4 },
    ],
    isAssessment: true,
    continueLabel: "¡Listo!",
    fullScreen: true,
  },

  // SLIDE 14 — Diagnóstico (No calificado)
  {
    id: "cms-slide-14",
    stepType: "mcq",
    question: "¿Qué emoción aparece con más frecuencia cuando piensas en dinero?",
    options: [
      { id: "opt-presion", label: "Presión", isCorrect: true },
      { id: "opt-motivacion", label: "Motivación", isCorrect: true },
      { id: "opt-tranquilidad", label: "Tranquilidad", isCorrect: true },
      { id: "opt-preocupacion", label: "Preocupación", isCorrect: true },
    ],
    isAssessment: false,
    recordIncorrect: false,
    continueLabel: "Finalizar lección",
    fullScreen: true,
    description: "Actualizando tu perfil emocional...",
  },

  // SLIDE 15 — Cierre (Progreso)
  {
    id: "cms-slide-15",
    stepType: "summary",
    title: "¡Lección completada!",
    body: "Ahora puedes detectar cuándo una emoción está dominando una decisión con dinero. ¡Sigue así!",
    isAssessment: false,
    continueLabel: "Siguiente lección",
    fullScreen: true,
  },
]
