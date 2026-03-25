import { LessonStep } from "@/types/lessonTypes";

// 6. Señales de compra impulsiva
export const lessonSenalesDeCompraImpulsivaSteps: LessonStep[] = [
  {
    id: "t3-l6-s1",
    stepType: "blitz_challenge",
    title: "Blitz: ¿Es Impulso?",
    question: "Identifica rápidamente si estas señales son de una compra planeada o impulsiva:",
    options: [
      { id: "i1", label: "Ritmo cardíaco acelerado (Impulso)", isCorrect: true },
      { id: "i2", label: "Urgencia de 'Ahora o nunca' (Impulso)", isCorrect: true },
      { id: "i3", label: "Comparación de 3 precios distintos (Freno)", isCorrect: false },
      { id: "i4", label: "Estar en el presupuesto del mes (Freno)", isCorrect: false },
    ],
    timeLimit: 12,
  },
  {
    id: "t3-l6-s2",
    stepType: "billy_talks",
    body: "Si sientes que el tiempo se acelera y tienes que pagar 'ya', te están secuestrando el cerebro racional. Ese es el momento de respirar.",
    mood: "worried",
  }
];

// 7. Antes de pagar: checklist de decisión
export const lessonAntesDePagarChecklistDeDecisionSteps: LessonStep[] = [
  {
    id: "t3-l7-s1",
    stepType: "order",
    title: "El Filtro del Consumo",
    question: "Ordena las preguntas que deberías hacerte antes de sacar la tarjeta:",
    items: [
      { id: "q1", label: "¿Tengo el presupuesto real ahora mismo?", correctOrder: 1 },
      { id: "q2", label: "¿Es por necesidad genuina?", correctOrder: 2 },
      { id: "q3", label: "¿He esperado las 24 horas de rigor?", correctOrder: 3 },
      { id: "q4", label: "¿Lo voy a usar genuinamente más de 5 veces?", correctOrder: 4 },
    ],
  },
  {
    id: "t3-l7-s2",
    stepType: "true_false",
    title: "El Test de la Mano",
    statement: "Si tuviera el objeto en la mano izquierda y el dinero en efectivo del precio en la derecha... ¿elegir el dinero significa que no debería comprarlo?",
    correctValue: true,
    explanation: "Correcto. Si prefieres el efectivo, la utilidad del objeto es menor que su precio para ti.",
  }
];

// 8. Micro-hábitos para evitar impulsos
export const lessonMicroHabitosParaEvitarImpulsosSteps: LessonStep[] = [
  {
    id: "t3-l8-s1",
    stepType: "fill_blanks",
    title: "Barreras de Fricción",
    question: "Aprende a hackear tu impulso:",
    textParts: [
      { type: "text", content: "Un micro-hábito clave es " },
      { type: "blank", id: "b1", correctOptionId: "opt-bor" },
      { type: "text", content: " los datos de tu tarjeta en las apps. Al tener que " },
      { type: "blank", id: "b2", correctOptionId: "opt-esc" },
      { type: "text", content: " los números cada vez, generas la " },
      { type: "blank", id: "b3", correctOptionId: "opt-fri" },
      { type: "text", content: " necesaria para detener el impulso." }
    ],
    options: [
      { id: "opt-bor", label: "borrar", isCorrect: true },
      { id: "opt-esc", label: "escribir", isCorrect: true },
      { id: "opt-fri", label: "fricción", isCorrect: true },
      { id: "opt-gua", label: "guardar", isCorrect: false },
    ],
  },
  {
    id: "t3-l8-s2",
    stepType: "mcq",
    title: "El Modo Incógnito",
    question: "¿Por qué navegar en modo incógnito te protege de las compras impulsivas?",
    options: [
      { id: "o1", label: "Evita el retargeting (los anuncios que te persiguen)", isCorrect: true },
      { id: "o2", label: "Oculta tus compras al banco", isCorrect: false },
    ],
  }
];

// 9. Post-compra: culpa y aprendizaje
export const lessonPostCompraCulpaYAprendizajeSteps: LessonStep[] = [
  {
    id: "t3-l9-s1",
    stepType: "mcq", // Better than narrative_check for automated feedback loop
    title: "El Remordimiento del Comprador",
    question: "Elegiste algo por impulso. ¿Cuál es el paso más inteligente después de sentir la culpa?",
    options: [
      { id: "r1", label: "Esconder el objeto para olvidarlo", isCorrect: false },
      { id: "r2", label: "Entender el gatillo que disparó la compra", isCorrect: true, explanation: "Convertir la culpa en datos es la única forma de mejorar." },
      { id: "r3", label: "Comprar algo más pequeño para compensar", isCorrect: false },
    ],
  },
  {
    id: "t3-l9-s2",
    stepType: "mcq",
    title: "La Curva de Utilidad",
    question: "¿Cuándo suele ser el punto máximo de felicidad de una compra impulsiva?",
    options: [
      { id: "c1", label: "En el momento que pagas (dopamina pura)", isCorrect: true, explanation: "Exacto. Es un pico químico temporal, no felicidad real." },
      { id: "c2", label: "A los 6 meses de uso intenso", isCorrect: false },
    ],
  }
];

// 10. Caso: “gasto por emoción” paso a paso
export const lessonCasoGastoPorEmocionPasoAPasoSteps: LessonStep[] = [
  {
    id: "t3-l10-s1",
    stepType: "influence_detective",
    title: "Caso: El Mal Día",
    scenario: "Laura tuvo un día terrible. Llega a casa, abre una app de comida y gasta $600 en postres caros diciendo 'Me lo merezco'.",
    options: [
      { id: "x1", label: "Hambre física extrema", emotion: "Fisiológico", isCorrect: false },
      { id: "x2", label: "Comprar para sedar una emoción negativa", emotion: "Compensación", isCorrect: true },
      { id: "x3", label: "Falta de azúcar", emotion: "Químico", isCorrect: false },
    ],
    explanation: "Juan y Laura usan el gasto como un narcótico emocional. El 'me lo merezco' es la justificación clásica.",
  },
  {
    id: "t3-l10-s2",
    stepType: "billy_talks",
    body: "Si aprendes a separar tus emociones de tu cartera, ya habrás ganado el juego. ¡Nos vemos en la siguiente unidad!",
    mood: "celebrating",
  }
];
