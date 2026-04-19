import type { LessonStep } from "@/types/lessonTypes"

/**
 * Lesson: ¿Qué es el dinero? (Deuda vs Energía)
 * Theme: Operativo BIZEN
 * Lesson ID: que-es-el-dinero-deuda-vs-energia
 */

export const lessonQueEsElDineroDeudaVsEnergiaSteps: LessonStep[] = [
  {
    id: "dve-1",
    stepType: "billy_talks",
    mood: "thinking",
    body: "Muchos ven el dinero como billetes. Un Ingeniero del Dinero lo ve como **[[Energía Almacenada|Tu tiempo y esfuerzo convertidos en un formato intercambiable]]**.\n\nHoy vamos a entender por qué el dinero es tu libertad enlatada y cómo evitar que se evapore.",
    data: { 
      glossary: [
        { word: "Energía Vital", definition: "El tiempo y esfuerzo limitado que tienes para producir valor." },
        { word: "Inflación", definition: "El fenómeno que hace que tu dinero guardado pierda capacidad de compra con el tiempo." }
      ] 
    },
    fullScreen: true,
  },
  {
    id: "dve-2",
    stepType: "info",
    title: "El Sistema de Intercambio",
    body: "Cuando trabajas, estás 'vendiendo' tu tiempo (vida). El dinero es el recibo que te dan para que puedas 'comprar' el tiempo de otros después. \n\nSi malgastas dinero, estás malgastando las horas de vida que te costó ganarlo.",
    aiInsight: "El 95% de las personas no calcula cuántas horas de su vida cuesta un objeto antes de comprarlo.",
    fullScreen: true,
  },
  {
    id: "dve-3",
    stepType: "mcq",
    question: "Si pides un préstamo para un televisor que no necesitas, ¿qué estás haciendo realmente?",
    options: [
      { id: "o1", label: "Aprovechando una oferta", isCorrect: false },
      { id: "o2", label: "Gastando energía vital de tu futuro yo (esclavitud)", isCorrect: true, explanation: "Te estás obligando a trabajar en el futuro para pagar un placer de hoy." }
    ],
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "dve-4",
    stepType: "blitz_challenge",
    question: "¿Qué drena tu energía guardada sin que te des cuenta?",
    options: [
      { id: "o1", label: "La Inflación", isCorrect: true },
      { id: "o2", label: "El Ahorro", isCorrect: false }
    ],
    timeLimit: 12,
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "dve-5",
    stepType: "swipe_sorter",
    question: "¿Es Generador de Energía o Drenaje de Energía?",
    leftBucket: { label: "Drenaje (Deuda/Pasivo)", color: "#ef4444" },
    rightBucket: { label: "Generador (Activo)", color: "#10b981" },
    items: [
      { id: "i1", label: "Tarjeta de crédito al 40%", correctBucket: "left" },
      { id: "i2", label: "Inversión en bolsa (ETF)", correctBucket: "right" },
      { id: "i3", label: "Suscripciones no usadas", correctBucket: "left" },
      { id: "i4", label: "Ahorro programado con interés", correctBucket: "right" }
    ],
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "dve-6",
    stepType: "info",
    title: "Dinero Fiduciario",
    body: "El dinero hoy no está respaldado por oro, sino por la **confianza**. Por eso los gobiernos pueden imprimir más, diluyendo el valor de tu energía acumulada.",
    aiInsight: "Desde 1971, el dinero es una promesa, no un objeto físico de valor intrínseco.",
    fullScreen: true,
  },
  {
    id: "dve-7",
    stepType: "true_false",
    statement: "Tener dinero guardado bajo el colchón es la forma más segura de proteger mi energía para el futuro.",
    correctValue: false,
    explanation: "La inflación es una fuga silenciosa. El dinero quieto es energía que se evapora.",
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "dve-8",
    stepType: "impulse_meter",
    instructions: "Mantén presionado para 'Cargar tus Baterías' enfocándote en tu propósito financiero.",
    item: { name: "Batería BIZEN", price: "Libertad", imageUrl: "/billy-breathing.png" },
    holdTime: 5,
    fullScreen: true,
  },
  {
    id: "dve-9",
    stepType: "blitz_challenge",
    question: "¿Qué es el interés compuesto?",
    options: [
      { id: "o1", label: "Dinero que genera más dinero (Multiplicador)", isCorrect: true },
      { id: "o2", label: "Una comisión bancaria", isCorrect: false }
    ],
    timeLimit: 10,
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "dve-10",
    stepType: "order",
    question: "Evolución de un Maestro del Dinero",
    items: [
      { id: "p1", label: "Cambiar tiempo por dinero", correctOrder: 1 },
      { id: "p2", label: "Cambiar valor por dinero (Escala)", correctOrder: 2 },
      { id: "p3", label: "Cambiar dinero por más dinero", correctOrder: 3 }
    ],
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "dve-11",
    stepType: "match",
    question: "Relaciona el flujo",
    leftItems: [
      { id: "l1", label: "El Pobre:" },
      { id: "l2", label: "El Rico:" }
    ],
    rightItems: [
      { id: "r1", label: "Compra pasivos con su energía" },
      { id: "r2", label: "Compra activos que generen energía" }
    ],
    correctPairs: [
      { leftId: "l1", rightId: "r1" },
      { leftId: "l2", rightId: "r2" }
    ],
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "dve-12",
    stepType: "mindset_translator",
    question: "Refactoriza tu concepto de 'Caro'",
    beliefs: [
      { 
        id: "b1", 
        original: "Este café de $100 es muy caro.", 
        healthyOptions: [
          { id: "h1", label: "Este café me cuesta 2 horas de mi vida que no volverán", isCorrect: true },
          { id: "h2", label: "No tengo suficiente sueldo para esto", isCorrect: false }
        ] 
      }
    ],
    fullScreen: true,
  },
  {
    id: "dve-13",
    stepType: "info",
    title: "La Rareza del Valor",
    body: "El mercado no te paga por tu esfuerzo, te paga por la **[[Rareza|Qué tan difícil es encontrarte en el mercado]]** de tu valor. Un cirujano gana más que un barrendero no por esfuerzo, sino por la escasez de sus habilidades.",
    aiInsight: "Si quieres más energía (dinero), no trabajes más duro, trabaja en volverte más difícil de reemplazar.",
    fullScreen: true,
  },
  {
    id: "dve-14",
    stepType: "narrative_check",
    question: "Si hoy dejaras de trabajar, ¿cuántos días podrías sobrevivir con la 'energía' que tienes guardada?",
    promptPlaceholder: "Sobreviviría aproximadamente...",
    minChars: 10,
    billyResponse: "Ese número se llama 'Días de Libertad'. Vamos a multiplicarlo.",
    fullScreen: true,
  },
  {
    id: "dve-15",
    stepType: "summary",
    title: "Física Dominada",
    body: "Ya no ves billetes, ves flujos de vida. Estás listo para mapear tu propio sistema. Siguiente: Tu Primer Estado de Resultados.",
    fullScreen: true,
  },
]
