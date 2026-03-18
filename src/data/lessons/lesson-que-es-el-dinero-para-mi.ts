import type { LessonStep } from "@/types/lessonTypes"

/**
 * Lesson: ¿Qué es el dinero para mí?
 * Theme: Mi relación con el dinero
 * Lesson ID: que-es-el-dinero-para-mi-hoy
 * Difficulty: Introductory
 * Rule: No images. Text-only content.
 */

export const lessonQueEsElDineroParaMiSteps: LessonStep[] = [
  // SLIDE 1 — FLASHCARD (Teoría)
  {
    id: "qed-slide-1",
    stepType: "billy_talks",
    mood: "happy",
    body: "¡Hola! Soy Billy. Antes de hablar de presupuestos o ahorros, hablemos de lo que **en verdad** guía tus compras: tus emociones.\n\n¿Sabías que el dinero significa algo distinto para cada persona? Lo que tú piensas de él hoy, decide tu futuro mañana.",
    continueLabel: "¡Descubrámoslo!",
    fullScreen: true,
  },

  // SLIDE 2 — Diagnóstico (No calificado)
  {
    id: "qed-slide-2",
    stepType: "mcq",
    question: "Recibes $1,000 que no esperabas. ¿Cuál es tu primer impulso honesto?",
    options: [
      { id: "opt-libertad", label: "Celebrar y disfrutar el momento", isCorrect: true },
      { id: "opt-seguridad", label: "Guardarlos por si pasa algo", isCorrect: true },
      { id: "opt-precion", label: "Pagar una deuda que me estresa", isCorrect: true },
      { id: "opt-herramienta", label: "Invertirlos en algo que me acerque a mi meta", isCorrect: true },
    ],
    isAssessment: false,
    recordIncorrect: false,
    continueLabel: "Continuar",
    fullScreen: true,
    description: "Tu impulso revela tu relación actual con el dinero.",
  },

  // SLIDE 3 — Flashcard (Teoría con criterio)
  {
    id: "qed-slide-3",
    stepType: "info",
    title: "El radar del significado",
    description: "Nadie ve el dinero igual",
    body: "El dinero no es solo papel o números en una app. Es un **lente** emocional:\n\n• **Seguridad**: Sientes que el dinero es tu escudo.\n• **Estatus**: Lo usas como señal de éxito o validación.\n• **Presión**: Lo ves como un problema constante.\n• **Herramienta**: Lo ves como energía para lograr metas.\n\n¡Entender tu lente evita que el dinero te controle!",
    continueLabel: "Entendido",
    fullScreen: true,
  },

  // SLIDE 4 — Ejercicio (Calificado) -> Transformado a Reto Relámpago (1/2)
  {
    id: "qed-slide-4",
    stepType: "blitz_challenge",
    title: "Reto Relámpago",
    description: "Ana prefiere no salir este fin de semana para no tocar su fondo de emergencias.",
    question: "¿Qué significado del dinero guía a Ana?",
    options: [
      { id: "opt-estatus", label: "Estatus", isCorrect: false },
      { id: "opt-presion", label: "Presión", isCorrect: false },
      { id: "opt-seguridad", label: "Seguridad", isCorrect: true, explanation: "Prioriza su tranquilidad futura sobre el placer de hoy." },
      { id: "opt-herramienta", label: "Herramienta", isCorrect: false },
    ],
    timeLimit: 20,
    isAssessment: true,
    continueLabel: "¡Comprobar!",
    fullScreen: true,
  },

  // SLIDE 5 — Ejercicio (Calificado)
  {
    id: "qed-slide-5",
    stepType: "mcq",
    title: "Imagen vs. Realidad",
    description: "Carlos compra un reloj de alta gama pensando en cómo lo mirarán en su oficina.",
    question: "¿Qué 'lente' está usando Carlos en esta decisión?",
    options: [
      { id: "opt-seguridad", label: "Seguridad", isCorrect: false },
      { id: "opt-estatus", label: "Estatus", isCorrect: true, explanation: "Busca validación o imagen social a través del gasto." },
      { id: "opt-herramienta", label: "Herramienta", isCorrect: false },
      { id: "opt-presion", label: "Presión", isCorrect: false },
    ],
    isAssessment: true,
    continueLabel: "Avanzar",
    fullScreen: true,
  },

  // NEW: IMPULSE METER (Slide 5-b)
  {
    id: "qed-slide-5-impulse",
    stepType: "impulse_meter",
    item: {
      name: "Oferta Flash: ¡Último Gadget!",
      price: "$3,999",
    },
    description: "Sientes el 'FOMO' (miedo a perderte la oferta). El corazón te late rápido y una voz en tu cabeza dice: '¡Dalo todo!'.",
    instructions: "Haz una pausa de 4 segundos para recuperar tu centro antes de que ese dinero vuele.",
    holdTime: 4,
    isAssessment: true,
    fullScreen: true,
  },

  // SLIDE 6 — Flashcard (Teoría)
  {
    id: "qed-slide-6",
    stepType: "billy_talks",
    mood: "mascot",
    body: "¡Bien hecho! Esa pausa es el inicio de tu libertad. Recuerda: dos personas con la misma cantidad de dinero toman decisiones distintas.\n\nNo decide el saldo de tu cuenta, decide el significado que tú le das a cada moneda.",
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 7 — Ejercicio (Calificado) Verdadero o Falso
  {
    id: "qed-slide-7",
    stepType: "true_false",
    statement: "Tu percepción y emociones afectan tus gastos mucho más que el saldo real en tu cuenta.",
    correctValue: true,
    explanation: "La psicología del dinero demuestra que nuestras emociones son el motor principal de la mayoría de los gastos.",
    isAssessment: true,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 8 — Ejercicio (Calificado) Matching
  {
    id: "qed-slide-8",
    stepType: "match",
    question: "Relaciona situación con significado más lógico",
    leftItems: [
      { id: "sit-presion", label: "Evitar revisar el saldo por miedo a ver menos" },
      { id: "sit-herramienta", label: "Ahorrar para pagar un curso o certificación" },
      { id: "sit-estatus", label: "Comprar para impresionar en redes" },
      { id: "sit-seguridad", label: "Guardar dinero por si pasa algo" },
    ],
    rightItems: [
      { id: "int-estatus", label: "Estatus" },
      { id: "int-seguridad", label: "Seguridad" },
      { id: "int-herramienta", label: "Herramienta" },
      { id: "int-presion", label: "Presión" },
    ],
    correctPairs: [
      { leftId: "sit-presion", rightId: "int-presion" },
      { leftId: "sit-herramienta", rightId: "int-herramienta" },
      { leftId: "sit-estatus", rightId: "int-estatus" },
      { leftId: "sit-seguridad", rightId: "int-seguridad" },
    ],
    isAssessment: true,
    continueLabel: "Seguir",
    fullScreen: true,
  },

  // SLIDE 9 — Flashcard (Teoría aplicada)
  {
    id: "qed-slide-9",
    stepType: "info",
    title: "Patrones invisibles",
    description: "Cómo nos relacionamos",
    body: "Detectar tus patrones te da superpoderes:\n\n• **Si el dinero es 'Presión'**: Evitas ver tu cuenta por miedo. No puedes planear porque prefieres ignorar.\n• **Si el dinero es 'Herramienta'**: El ahorro ya no se siente como un castigo, sino como una compra de tu futuro yo.\n\n¡Si dejas de adivinar, empiezas a ganar!",
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 10 — Ejercicio (Calificado) -> Reto Relámpago (2/2)
  {
    id: "qed-slide-10",
    stepType: "blitz_challenge",
    title: "Reto Relámpago",
    description: "Mario recibe un bono, piensa 'me lo merezco' y lo gasta en una noche sin planear.",
    question: "¿Qué dominó la decisión de Mario?",
    options: [
      { id: "opt-emocion", label: "La emoción del momento", isCorrect: true, explanation: "La gratificación inmediata venció a la razón." },
      { id: "opt-planeacion", label: "La lógica fría", isCorrect: false },
      { id: "opt-precios", label: "Ahorro consciente", isCorrect: false },
      { id: "opt-metas", label: "Metas de ahorro", isCorrect: false },
    ],
    timeLimit: 20,
    isAssessment: true,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 11 — Ejercicio (Calificado) Multi select
  {
    id: "qed-slide-11",
    stepType: "multi_select",
    title: "Alcance de la percepción",
    description: "La percepción del dinero actúa como un filtro invisible en casi todo lo que decides.",
    question: "¿En cuáles áreas puede influir tu percepción del dinero?",
    options: [
      { id: "opt-gastas", label: "Cómo gastas", isCorrect: true },
      { id: "opt-ahorras", label: "Cómo ahorras", isCorrect: true },
      { id: "opt-sentir", label: "Cómo te sientes al pagar", isCorrect: true },
      { id: "opt-metas", label: "Qué metas te parecen posibles", isCorrect: true },
    ],
    isAssessment: true,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 11-b — NEW: Swipe Sorter (¿Necesidad o Deseo?)
  {
    id: "qed-slide-11-swipe",
    stepType: "swipe_sorter",
    question: "Desliza cada gasto a su categoría",
    leftBucket: { label: "Necesidad", color: "#2563eb" },
    rightBucket: { label: "Deseo", color: "#f59e0b" },
    items: [
      {
        id: "sw-renta", label: "Renta", sublabel: "Pago mensual de tu casa", amount: "$6,500",
        correctBucket: "left",
      },
      {
        id: "sw-cafe", label: "Café de especialidad", sublabel: "Orden diaria en la cafetería", amount: "$85/día",
        correctBucket: "right",
      },
      {
        id: "sw-medicamento", label: "Medicamento recetado", sublabel: "Tratamiento médico mensual", amount: "$450",
        correctBucket: "left",
      },
      {
        id: "sw-ropa", label: "Ropa de moda", sublabel: "Nueva colección que viste en Instagram", amount: "$2,200",
        correctBucket: "right",
      },
      {
        id: "sw-comida", label: "Despensa del mes", sublabel: "Alimentos básicos para el hogar", amount: "$3,800",
        correctBucket: "left",
      },
    ],
    isAssessment: true,
    recordIncorrect: false, // SwipeSorter never repeats — diagnostic exercise, not punitive
    continueLabel: "¡Clasificado!",
    fullScreen: true,
  },

  // SLIDE 12 — Flashcard (Teoría)
  {
    id: "qed-slide-12",
    stepType: "billy_talks",
    mood: "thinking",
    body: "Antes de aprender a invertir, debes aprender a observarte. \n\nSi entiendes qué quieres sentir cuando gastas, podrás elegir tus batallas y dejar de 'perder' dinero sin saber por qué.",
    continueLabel: "¡Quiero intentarlo!",
    fullScreen: true,
  },

  // NEW: MINDSET TRANSLATOR (Slide 12-b)
  {
    id: "qed-slide-12-mindset",
    stepType: "mindset_translator",
    question: "¿Cómo reenfocarías esto?",
    beliefs: [
      {
        id: "belief-1",
        original: "No reviso mi cuenta porque me da miedo ver el saldo.",
        healthyOptions: [
          { id: "h1-1", label: "Revisar mi cuenta me da el control para decidir mejor", isCorrect: true },
          { id: "h1-2", label: "Mejor no veo y espero que todo se arregle solo", isCorrect: false },
        ]
      }
    ],
    isAssessment: true,
    fullScreen: true,
  },

  // SLIDE 13 — Ejercicio (Ordenar)
  {
    id: "qed-slide-13",
    stepType: "order",
    question: "Ordena la cadena típica de una decisión financiera personal",
    items: [
      { id: "item-pensamiento", label: "Pensamiento", correctOrder: 1 },
      { id: "item-emocion", label: "Emoción", correctOrder: 2 },
      { id: "item-decision", label: "Decisión", correctOrder: 3 },
      { id: "item-resultado", label: "Resultado", correctOrder: 4 },
    ],
    isAssessment: true,
    explanation: "El pensamiento guía la emoción, la emoción guía la decisión y la decisión trae el resultado.",
    continueLabel: "¡Lo tengo!",
    fullScreen: true,
  },

  // SLIDE 14 — Diagnóstico (No calificado)
  {
    id: "qed-slide-14",
    stepType: "mcq",
    question: "Hoy, ¿a qué se parece más el dinero para ti?",
    options: [
      { id: "opt-herramienta", label: "Herramienta", isCorrect: true },
      { id: "opt-presion", label: "Presión", isCorrect: true },
      { id: "opt-oportunidad", label: "Oportunidad", isCorrect: true },
      { id: "opt-preocupacion", label: "Preocupación", isCorrect: true },
    ],
    isAssessment: false,
    recordIncorrect: false,
    continueLabel: "Finalizar",
    fullScreen: true,
    description: "Este es tu perfil actual. ¡Vamos a mejorarlo!",
  },

  // NEW: INFLUENCE DETECTIVE (Slide 14-b)
  {
    id: "qed-slide-14-detective",
    stepType: "influence_detective",
    scenario: "Ves a un influencer mostrar un viaje increíble y de pronto sientes que tu vida es aburrida si no viajas igual.",
    options: [
      { id: "opt-1", label: "Comparación social", emotion: "Social", isCorrect: true },
      { id: "opt-2", label: "Ahorro programado", emotion: "Finance", isCorrect: false },
      { id: "opt-3", label: "Inspiración pura", emotion: "Inspiration", isCorrect: false },
    ],
    isAssessment: true,
    fullScreen: true,
  },

  // SLIDE 15 — Cierre (Progreso)
  {
    id: "qed-slide-15",
    stepType: "summary",
    title: "¡Gran comienzo!",
    body: "Has dado el paso más difícil: mirar hacia adentro. El dinero no es solo matemáticas; es, sobre todo, psicología y hábitos.",
    isAssessment: false,
    continueLabel: "¡Voy por más!",
    fullScreen: true,
  },
]
