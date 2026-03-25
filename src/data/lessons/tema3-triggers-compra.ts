import { LessonStep } from "@/types/lessonTypes";

// 1. ¿Qué es un trigger de compra?
export const lessonQueEsUnTriggerDeCompraSteps: LessonStep[] = [
  {
    id: "t3-l1-s1",
    stepType: "billy_talks",
    title: "El Control de tu Cerebro",
    body: "Bienvenido al Tema 3. Aquí entenderemos por qué a veces compramos cosas sin saber realmente por qué. Un 'trigger' o gatillo es un estímulo externo que dispara un impulso automático.",
    mood: "thinking",
  },
  {
    id: "t3-l1-s2",
    stepType: "match",
    title: "Tipos de Gatillos",
    question: "Asocia el estímulo con el tipo de gatillo que representa:",
    leftItems: [
      { id: "e1", label: "Olor a pan recién horneado" },
      { id: "e2", label: "Notificación de 'Últimas 2 piezas'" },
      { id: "e3", label: "Ver a un influencer con un reloj" },
    ],
    rightItems: [
      { id: "g1", label: "Gatillo Sensorial" },
      { id: "g2", label: "Gatillo de Escasez" },
      { id: "g3", label: "Gatillo de Estatus" },
    ],
    correctPairs: [
      { leftId: "e1", rightId: "g1" },
      { leftId: "e2", rightId: "g2" },
      { leftId: "e3", rightId: "g3" }
    ],
  },
  {
    id: "t3-l1-s3",
    stepType: "order",
    title: "La Anatomía de un Impulso",
    question: "Ordena los pasos desde que aparece el estímulo hasta que ocurre la compra:",
    items: [
      { id: "p1", label: "Estímulo Externo (Trigger)", correctOrder: 1 },
      { id: "p2", label: "Respuesta Emocional (Dopamina)", correctOrder: 2 },
      { id: "p3", label: "Racionalización ('Me lo merezco')", correctOrder: 3 },
      { id: "p4", label: "Acción de Pago", correctOrder: 4 },
    ],
  }
];

// 2. Publicidad: cómo te manipula
export const lessonPublicidadComoTeManipulaSteps: LessonStep[] = [
  {
    id: "t3-l2-s1",
    stepType: "influence_detective",
    title: "Detective de Influencia",
    scenario: "Ves un anuncio con un actor vestido de médico recomendando una crema cara que 'rejuvenece 10 años'.",
    options: [
      { id: "o1", label: "Autoridad (La bata blanca)", emotion: "Autoridad", isCorrect: true },
      { id: "o2", label: "Escasez", emotion: "Miedo", isCorrect: false },
      { id: "o3", label: "Prueba Social", emotion: "Pertenencia", isCorrect: false },
    ],
    explanation: "¡Exacto! El cerebro baja la guardia ante símbolos de autoridad y expertos aparentes.",
  },
  {
    id: "t3-l2-s2",
    stepType: "mcq",
    title: "El Ancla de Precio",
    question: "Un producto marca $1,000 originalmente, pero tiene un tachón y dice $399. ¿Cómo se llama esta táctica?",
    options: [
      { id: "a1", label: "Anclaje de Precio", isCorrect: true, explanation: "Tu cerebro usa el primer número como referencia para que el segundo parezca un 'regalo'." },
      { id: "a2", label: "Efecto Halo", isCorrect: false },
    ],
  }
];

// 3. Redes: comparación y presión
export const lessonRedesComparacionYPresionSteps: LessonStep[] = [
  {
    id: "t3-l3-s1",
    stepType: "billy_talks",
    title: "La Vitrina Infinita",
    body: "Las redes sociales no son solo para conectar; son centros comerciales disfrazados de álbumes de fotos. Cada post es una comparación silenciosa.",
    mood: "worried",
  },
  {
    id: "t3-l3-s2",
    stepType: "swipe_sorter",
    title: "Filtro de Realidad",
    question: "¿Esto es una necesidad real o una presión de estilo de vida?",
    leftBucket: { label: "Necesidad Real", color: "#3b82f6" },
    rightBucket: { label: "Presión Social", color: "#ef4444" },
    items: [
      { id: "i1", label: "Zapatillas nuevas porque las viejas tienen huecos", correctBucket: "left" },
      { id: "i2", label: "El mismo café de $10 que todos postean", correctBucket: "right" },
      { id: "i3", label: "Un viaje al mismo destino que tu ex para mostrar felicidad", correctBucket: "right" },
    ],
  }
];

// 4. Compras por aburrimiento vs necesidad
export const lessonComprasPorAburrimientoVsNecesidadSteps: LessonStep[] = [
  {
    id: "t3-l4-s1",
    stepType: "mcq",
    title: "La Trampa del Ocio",
    question: "Estás en el sofá, aburrido, y entras a una app de compras 'solo para ver'. ¿Qué sustancia busca tu cerebro?",
    options: [
      { id: "s1", label: "Dopamina", isCorrect: true, explanation: "Exacto. La novedad genera dopamina. La compra rápida es el 'hielo' más fácil para el aburrimiento." },
      { id: "s2", label: "Adrenalina", isCorrect: false },
    ],
  },
  {
    id: "t3-l4-s2",
    stepType: "fill_blanks",
    title: "La Regla de los 10 Minutos",
    question: "Completa la estrategia anti-aburrimiento:",
    textParts: [
      { type: "text", content: "Para evitar compras por aburrimiento, aplica la regla de los " },
      { type: "blank", id: "b1", correctOptionId: "opt-10" },
      { type: "text", content: " minutos. Si después de ese tiempo el " },
      { type: "blank", id: "b2", correctOptionId: "opt-imp" },
      { type: "text", content: " desaparece, era solo un gatillo emocional." }
    ],
    options: [
      { id: "opt-10", label: "10", isCorrect: true },
      { id: "opt-imp", label: "impulso", isCorrect: true },
      { id: "opt-60", label: "60", isCorrect: false },
      { id: "opt-gas", label: "gasto", isCorrect: false },
    ],
  }
];

// 5. Detectar mis triggers (casos)
export const lessonDetectarMisTriggersCasosSteps: LessonStep[] = [
  {
    id: "t3-l5-s1",
    stepType: "mcq", // Replaced narrative_check with mcq for better validation in this version
    title: "Auto-Diagnóstico",
    question: "Reflexiona sobre tu última compra innecesaria. ¿Qué ocurrió justo antes?",
    options: [
      { id: "c1", label: "Estaba triste o estresado.", isCorrect: true, explanation: "Gatillo Emocional." },
      { id: "c2", label: "Recibí un cupón de 'Sólo hoy'.", isCorrect: true, explanation: "Gatillo de Oportunidad." },
      { id: "c3", label: "Vi a alguien más que lo tenía.", isCorrect: true, explanation: "Gatillo de Comparación." },
    ],
  },
  {
    id: "t3-l5-s2",
    stepType: "billy_talks",
    title: "Tu Escudo Mental",
    body: "Identificar el gatillo es el 50% de la batalla. En la siguiente unidad veremos cómo armar sistemas para que esos gatillos no disparen tu cartera automáticamente.",
    mood: "celebrating",
  }
];
