import type { LessonStep } from "@/types/lessonTypes"

/**
 * Lesson: ¿Qué es el dinero para mí?
 * Theme: Mi relación con el dinero
 * Lesson ID: que-es-el-dinero-para-mi-hoy
 * Difficulty: Introductory
 * Rule: No images. Text-only content.
 *
 * AI Features:
 * - Feature 1: Glossary terms via word
 * - Feature 2: aiInsight fields for Billy Empático (shows on 3rd mistake)
 * - Feature 3: Adaptive Mexican scenarios in exercises
 * - Feature 4: narrative_check step before summary
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
      { id: "opt-seguridad", label: "Guardarlo por si pasa algo", isCorrect: true },
      { id: "opt-precion", label: "Pagar una deuda que me estresa", isCorrect: true },
      { id: "opt-herramienta", label: "Invertirlo en algo que me acerque a mi meta", isCorrect: true },
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
    body: "El dinero no es solo papel o números en una app. Es un lente emocional:\n\n• **Seguridad**: Sientes que el dinero es tu escudo.\n• **Estatus**: Lo usas como señal de éxito o validación.\n• **Presión**: Lo ves como un problema constante.\n• **Herramienta**: Lo ves como energía para lograr metas.\n\n¡Entender tu lente evita que el dinero te controle!",
    continueLabel: "Entendido",
    fullScreen: true,
    aiInsight: "¿Cuál de estos lentes se parece más a ti? Identificarlo es el primer paso para cambiar cómo manejas tu dinero.",
  },

  // SLIDE 4 — Reto Relámpago (1/2)
  {
    id: "qed-slide-4",
    stepType: "blitz_challenge",
    title: "Reto Relámpago",
    description: "Ana prefiere no salir este fin de semana para no tocar su fondo de emergencias, aunque sus amigos la insisten en ir a un antojo de tacos.",
    question: "¿Qué significado del dinero guía a Ana?",
    options: [
      { id: "opt-estatus", label: "Estatus", isCorrect: false },
      { id: "opt-presion", label: "Presión", isCorrect: false },
      { id: "opt-seguridad", label: "Seguridad", isCorrect: true, explanation: "Prioriza su tranquilidad futura sobre el placer inmediato." },
      { id: "opt-herramienta", label: "Herramienta", isCorrect: false },
    ],
    timeLimit: 20,
    isAssessment: true,
    continueLabel: "¡Comprobar!",
    fullScreen: true,
    aiInsight: "Pista: Pregúntate, ¿Ana está pensando en cómo se ve con los demás o en proteger su estabilidad?",
  },

  // SLIDE 5 — Ejercicio (Calificado)
  {
    id: "qed-slide-5",
    stepType: "mcq",
    title: "Imagen vs. Realidad",
    description: "Carlos compra unos tenis de $4,500 que vio en el TikTok de un influencer, pensando en cómo lo verán en su trabajo.",
    question: "¿Qué 'lente' está usando Carlos en esta decisión?",
    options: [
      { id: "opt-seguridad", label: "Seguridad", isCorrect: false },
      { id: "opt-estatus", label: "Estatus", isCorrect: true, explanation: "Busca validación social a través del gasto." },
      { id: "opt-herramienta", label: "Herramienta", isCorrect: false },
      { id: "opt-presion", label: "Presión", isCorrect: false },
    ],
    isAssessment: true,
    continueLabel: "Avanzar",
    fullScreen: true,
    aiInsight: "¿El gasto de Carlos lo acerca a una meta personal o solo mejora cómo lo ven los demás? Esa es la clave.",
  },

  // SLIDE 5-b — Impulse Meter (Feature 3: escenario mexicano real)
  {
    id: "qed-slide-5-impulse",
    stepType: "impulse_meter",
    item: {
      name: "Hot Sale: iPhone último modelo",
      price: "$22,999",
    },
    description: "Es la 1am. Ves la oferta en tu celular y dice: '¡Solo quedan 3 en stock!'. El FOMO te está dominando. El corazón te late rápido.",
    instructions: "Respira y mantén 4 segundos antes de que ese dinero vuele.",
    holdTime: 4,
    isAssessment: true,
    fullScreen: true,
  },

  // SLIDE 6 — Flashcard (Teoría)
  {
    id: "qed-slide-6",
    stepType: "billy_talks",
    mood: "mascot",
    body: "¡Bien hecho! Esa pausa es el inicio de tu libertad. Recuerda: dos personas con exactamente el mismo sueldo toman decisiones totalmente distintas.\n\nNo decide el saldo de tu cuenta, decide el significado que tú le das a cada moneda.",
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 7 — Verdadero o Falso
  {
    id: "qed-slide-7",
    stepType: "true_false",
    statement: "Tu percepción y emociones afectan tus gastos mucho más que el saldo real en tu cuenta.",
    correctValue: true,
    explanation: "La psicología del dinero demuestra que nuestras emociones son el motor principal de la mayoría de los gastos.",
    isAssessment: true,
    continueLabel: "Continuar",
    fullScreen: true,
    aiInsight: "Piénsalo así: ¿Cuántas veces has gastado en algo 'porque te lo mereces' aunque no lo tenías planeado?",
  },

  // SLIDE 8 — Matching
  {
    id: "qed-slide-8",
    stepType: "match",
    question: "Relaciona la situación con su significado del dinero más probable",
    leftItems: [
      { id: "sit-presion", label: "Evitar revisar tu cuenta de Mercado Pago por miedo a ver el saldo" },
      { id: "sit-herramienta", label: "Ahorrar para pagar un curso de inglés o certificación" },
      { id: "sit-estatus", label: "Comprar ropa de marca para subir fotos en Instagram" },
      { id: "sit-seguridad", label: "Guardar 10% de tu quincena en caso de emergencia" },
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
    aiInsight: "Asocia cada situación con la emoción que la mueve: ¿es miedo, imagen, crecimiento o protección?",
  },

  // SLIDE 9 — Flashcard (Teoría aplicada)
  {
    id: "qed-slide-9",
    stepType: "info",
    title: "Patrones invisibles",
    description: "Cómo nos relacionamos",
    body: "Detectar tus patrones financieros te da superpoderes:\n\n• **Si el dinero es 'Presión'**: Evitas ver tu cuenta por miedo. No puedes planear porque prefieres ignorar.\n• **Si el dinero es 'Herramienta'**: El ahorro ya no se siente como un castigo, sino como una compra de tu futuro yo.\n\n¡Si dejas de adivinar, empiezas a ganar!",
    continueLabel: "Continuar",
    fullScreen: true,
    aiInsight: "Pregúntate: ¿en cuál de estos patrones me reconozco más? Con esa respuesta honesta, ya tienes el 50% ganado.",
  },

  // SLIDE 10 — Reto Relámpago (2/2)
  {
    id: "qed-slide-10",
    stepType: "blitz_challenge",
    title: "Reto Relámpago",
    description: "Mario recibe su quincena, piensa 'me lo merezco' y esa noche se gasta $800 en una salida sin planearlo.",
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
    aiInsight: "¿Mario tenía un plan o actuó por impulso? La palabra 'me lo merezco' es una señal de qué lo guió.",
  },

  // SLIDE 11 — Multi select
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
    aiInsight: "Todas son correctas. Tu relación con el dinero no solo afecta tu cartera, afecta tu autoestima y tus decisiones de vida.",
  },

  // SLIDE 11-b — Swipe Sorter (Feature 3: escenarios mexicanos reales)
  {
    id: "qed-slide-11-swipe",
    stepType: "swipe_sorter",
    question: "Clasificación inteligente",
    description: "Desliza la tarjeta a la IZQUIERDA si es una Necesidad (Supervivencia/Esencial), o a la DERECHA si es un Deseo (Disfrute/No esencial).",
    leftBucket: { label: "Necesidad", color: "#2563eb" },
    rightBucket: { label: "Deseo", color: "#f59e0b" },
    items: [
      {
        id: "sw-renta", label: "Renta", sublabel: "Pago mensual de tu cuarto o depa", amount: "$6,500",
        correctBucket: "left",
      },
      {
        id: "sw-cafe", label: "Café de Starbucks", sublabel: "Orden diaria antes de trabajar", amount: "$85/día",
        correctBucket: "right",
      },
      {
        id: "sw-medicamento", label: "Medicamento recetado", sublabel: "Tratamiento médico del mes", amount: "$450",
        correctBucket: "left",
      },
      {
        id: "sw-ropa", label: "Ropa de nueva temporada", sublabel: "Colección que viste en TikTok", amount: "$2,200",
        correctBucket: "right",
      },
      {
        id: "sw-comida", label: "Despensa del mes", sublabel: "Alimentos básicos del hogar", amount: "$3,800",
        correctBucket: "left",
      },
    ],
    isAssessment: true,
    recordIncorrect: false, // SwipeSorter nunca se repite — ejercicio diagnóstico
    continueLabel: "¡Clasificado!",
    fullScreen: true,
  },

  // SLIDE 12 — Billy reflexiona
  {
    id: "qed-slide-12",
    stepType: "billy_talks",
    mood: "thinking",
    body: "Antes de aprender a invertir, debes aprender a observarte. \n\nSi entiendes qué quieres sentir cuando gastas, podrás elegir tus batallas y dejar de 'perder' dinero sin saber por qué.",
    continueLabel: "¡Quiero intentarlo!",
    fullScreen: true,
  },

  // SLIDE 12-b — Mindset Translator
  {
    id: "qed-slide-12-mindset",
    stepType: "mindset_translator",
    question: "¿Cómo reenfocarías esta creencia?",
    beliefs: [
      {
        id: "belief-1",
        original: "No reviso mi cuenta de banco porque me da miedo ver el saldo.",
        healthyOptions: [
          { id: "h1-1", label: "Revisar mi cuenta me da el control para decidir mejor", isCorrect: true },
          { id: "h1-2", label: "Mejor no veo y espero que todo se arregle solo", isCorrect: false },
        ]
      }
    ],
    isAssessment: true,
    fullScreen: true,
    aiInsight: "Evitar ver tu cuenta no cambia el saldo, solo te quita el poder de actuar. La información, aunque duela, siempre es mejor que la ignorancia.",
  },

  // SLIDE 13 — Ordenar
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
    aiInsight: "Si cambias el pensamiento inicial, todo lo demás cambia con él. Esa es la raíz de la libertad financiera.",
  },

  // SLIDE 14 — Diagnóstico final (No calificado)
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

  // SLIDE 14-b — Influence Detective
  {
    id: "qed-slide-14-detective",
    stepType: "influence_detective",
    scenario: "Ves a un influencer de finanzas mostrar su depa en Santa Fe y de pronto sientes que tu vida es aburrida o insuficiente si no tienes lo mismo.",
    options: [
      { id: "opt-1", label: "Comparación social", emotion: "Social", isCorrect: true },
      { id: "opt-2", label: "Ahorro programado", emotion: "Finance", isCorrect: false },
      { id: "opt-3", label: "Inspiración pura", emotion: "Inspiration", isCorrect: false },
    ],
    isAssessment: true,
    fullScreen: true,
    aiInsight: "La comparación social es uno de los mayores saboteadores de las finanzas personales. Comparar tu Capítulo 1 con el Capítulo 20 de alguien más es una trampa.",
  },

  // SLIDE 14-c — Narrative Check (Feature 4: Billy el Mentor)
  {
    id: "qed-slide-14-commitment",
    stepType: "narrative_check",
    question: "Esta semana, ¿qué es UNA cosa concreta que harás diferente con tu dinero gracias a lo que aprendiste hoy?",
    promptPlaceholder: "Ej: Voy a revisar mi cuenta de banco todos los lunes por la mañana...",
    minChars: 25,
    billyResponse: "¡Ese es el espíritu! Los grandes cambios financieros empiezan con un pequeño hábito concreto. Escríbelo donde lo puedas ver esta semana.",
    isAssessment: false,
    recordIncorrect: false,
    fullScreen: true,
    continueLabel: "¡Lo haré!",
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
