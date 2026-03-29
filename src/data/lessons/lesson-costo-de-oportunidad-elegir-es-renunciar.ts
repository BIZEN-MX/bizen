import type { LessonStep } from "@/types/lessonTypes"

/**
 * Lesson: Costo de Oportunidad: Elegir es renunciar
 * Theme: Operativo BIZEN
 * Lesson ID: costo-de-oportunidad-elegir-es-renunciar
 */

export const lessonCostoDeOportunidadElegirEsRenunciarSteps: LessonStep[] = [
  {
    id: "cdo-1",
    stepType: "billy_talks",
    mood: "thinking",
    body: "Cada vez que dices 'SÍ' a un gasto, le estás diciendo 'NO' a algo más. Eso se llama **[[Costo de Oportunidad|El valor de la mejor alternativa que sacrificas al tomar una decisión]]**.\n\nEn finanzas, lo que NO haces con tu dinero es tan importante como lo que SÍ haces.",
    data: { 
      glossary: [
        { word: "Costo de Oportunidad", definition: "El beneficio que dejas de recibir de la segunda mejor opción disponible." },
        { word: "Alternativa Sacrificada", definition: "La opción real que descartaste para poder ejecutar tu decisión actual." }
      ] 
    },
    fullScreen: true,
  },
  {
    id: "cdo-2",
    stepType: "info",
    title: "La Alternativa Perdida",
    body: "No es solo el precio de lo que compras. Es el **rendimiento** que ese dinero habría generado si lo hubieras usado para tu libertad.\n\nEjemplo: Comprar unos tenis de $3,000 no cuesta $3,000. Cuesta $3,000 + los intereses que esos $3,000 habrían ganado en un año.",
    aiInsight: "El costo de oportunidad es la razón por la cual los millonarios parecen tacaños: ellos no ven el precio, ven el potencial perdido.",
    fullScreen: true,
  },
  {
    id: "cdo-3",
    stepType: "mcq",
    question: "Lucía tiene $5,000. Puede viajar o invertirlos para ganar $500 anuales. Si viaja, ¿cuál es su costo de oportunidad?",
    options: [
      { id: "o1", label: "$5,000 (Lo que gastó)", isCorrect: false },
      { id: "o2", label: "$500 (Lo que dejó de ganar cada año)", isCorrect: true, explanation: "El costo de oportunidad es el beneficio de la opción NO elegida." }
    ],
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "cdo-4",
    stepType: "blitz_challenge",
    question: "Si eliges ver Netflix 3 horas en lugar de estudiar una habilidad que te pagan en $200/hora, ¿cuánto te costó Netflix?",
    options: [
      { id: "o1", label: "$600 pesos de tu futuro", isCorrect: true },
      { id: "o2", label: "Solo el precio de la suscripción", isCorrect: false }
    ],
    timeLimit: 12,
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "cdo-5",
    stepType: "swipe_sorter",
    question: "¿Es un Costo de Oportunidad Alto o Bajo?",
    leftBucket: { label: "Costo Alto (Peligro)", color: "#ef4444" },
    rightBucket: { label: "Costo Bajo (Okey)", color: "#10b981" },
    items: [
      { id: "i1", label: "Dejar $100k en el colchón", correctBucket: "left" },
      { id: "i2", label: "Comprar comida básica", correctBucket: "right" },
      { id: "i3", label: "Pagar tarjeta al mínimo", correctBucket: "left" },
      { id: "i4", label: "Gastar en un curso útil", correctBucket: "right" }
    ],
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "cdo-6",
    stepType: "info",
    title: "El Dinero Quieto Muere",
    body: "Si tienes tu dinero en una cuenta que no te da nada, tu costo de oportunidad es la **[[Inflación|Pérdida de poder de compra]]**. \n\nEstás pagando una 'multa' por no mover tu capital hacia activos productivos.",
    aiInsight: "Mantener efectivo durante 10 años te hace un 40% más pobre en promedio debido a la inflación acumulada.",
    fullScreen: true,
  },
  {
    id: "cdo-7",
    stepType: "true_false",
    statement: "Invertir en tu educación tiene un costo de oportunidad de $0 porque es para ti.",
    correctValue: false,
    explanation: "Falso. Siempre hay costo. El costo de estudiar es el dinero que podrías haber ganado trabajando en ese tiempo. Pero el ROI suele compensarlo.",
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "cdo-8",
    stepType: "impulse_meter",
    instructions: "Mantén presionado para 'Renunciar al placer inmediato' por una meta mayor.",
    item: { name: "Upgrade Temporal", price: "$2,000", imageUrl: "/billy-breathing.png" },
    holdTime: 5,
    fullScreen: true,
  },
  {
    id: "cdo-9",
    stepType: "blitz_challenge",
    question: "¿Qué es elegir?",
    options: [
      { id: "o1", label: "Renunciar a lo demás", isCorrect: true },
      { id: "o2", label: "Tenerlo todo", isCorrect: false }
    ],
    timeLimit: 10,
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "cdo-10",
    stepType: "order",
    question: "Jerarquía de Oportunidad",
    items: [
      { id: "p1", label: "Inversión en Negocio/Habilidad", correctOrder: 1 },
      { id: "p2", label: "Saldar deudas de alto CAT", correctOrder: 2 },
      { id: "p3", label: "Consumo discrecional (Lujo)", correctOrder: 3 }
    ],
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "cdo-11",
    stepType: "match",
    question: "Relaciona el sacrificio",
    leftItems: [
      { id: "l1", label: "Comer fuera diario" },
      { id: "l2", label: "No invertir $1,000/mes" }
    ],
    rightItems: [
      { id: "r1", label: "Costo: -$30,000/año en libertad" },
      { id: "r2", label: "Costo: -$1,000,000 en 30 años" }
    ],
    correctPairs: [
      { leftId: "l1", rightId: "r1" },
      { leftId: "l2", rightId: "r2" }
    ],
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "cdo-12",
    stepType: "mindset_translator",
    question: "Traduce tu decisión",
    beliefs: [
      { 
        id: "b1", 
        original: "Me lo merezco, para eso trabajo.", 
        healthyOptions: [
          { id: "h1", label: "Merezco libertad futura más que un placer efímero hoy", isCorrect: true },
          { id: "h2", label: "Mi esfuerzo borra mi costo de oportunidad", isCorrect: false }
        ] 
      }
    ],
    fullScreen: true,
  },
  {
    id: "cdo-13",
    stepType: "info",
    title: "El Costo Oculto del Tiempo",
    body: "Si pasas 2 horas buscando un descuento de $20 pesos, y tu hora real vale $100, acabas de PERDER $180 pesos de valor vital. \n\nNo busques el descuento más barato, busca el uso más eficiente de tu energía.",
    aiInsight: "Los millonarios subcontratan tareas de bajo valor para liberar tiempo para tareas de alto valor.",
    fullScreen: true,
  },
  {
    id: "cdo-14",
    stepType: "narrative_check",
    question: "¿Qué 'SÍ' vas a decir hoy que implique un 'NO' a un gasto tonto del pasado?",
    promptPlaceholder: "Le digo SÍ a ... y NO a ...",
    minChars: 15,
    billyResponse: "Ese SÍ es el cimiento de tu nueva arquitectura financiera.",
    fullScreen: true,
  },
  {
    id: "cdo-15",
    stepType: "summary",
    title: "Estratega de Opciones",
    body: "Has dejado de ser reactivo. Ahora evalúas cada opción por su sombra de costo. Siguiente: La Pausa de las 24 Horas.",
    fullScreen: true,
  },
]
