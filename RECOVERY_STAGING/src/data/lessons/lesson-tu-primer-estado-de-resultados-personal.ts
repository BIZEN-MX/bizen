import type { LessonStep } from "@/types/lessonTypes"

/**
 * Lesson: Tu primer Estado de Resultados Personal
 * Theme: Operativo BIZEN
 * Lesson ID: tu-primer-estado-de-resultados-personal
 */

export const lessonTuPrimerEstadoDeResultadosPersonalSteps: LessonStep[] = [
  {
    id: "erp-1",
    stepType: "billy_talks",
    mood: "celebrating",
    body: "¡Bienvenido al momento de la verdad! Para mejorar algo, primero hay que medirlo. Hoy tomaremos una **fotografía de tu realidad** financiera.\n\nHoy aprenderás a calcular cuánto vales hoy realmente y cómo hacer que ese número nunca deje de subir.",
    data: { 
      glossary: [
        { word: "Activo", definition: "Todo lo que pone dinero en tu bolsillo o tiene valor de reventa." },
        { word: "Pasivo", definition: "Todo lo que saca dinero de tu bolsillo (deudas, gastos fijos)." },
        { word: "Capital Neto", definition: "La diferencia real: Lo que Tienes - Lo que Debes." }
      ] 
    },
    fullScreen: true,
  },
  {
    id: "erp-2",
    stepType: "info",
    title: "La Fotografía Financiera",
    body: "No importa cuánto ganas, importa cuánto **te queda**. \n\nMuchas personas con sueldos altos tienen un Capital Neto negativo porque deben más de lo que poseen. Están atrapados en una jaula de oro.",
    aiInsight: "El Capital Neto es el único número que no miente sobre tu salud financiera real.",
    fullScreen: true,
  },
  {
    id: "erp-3",
    stepType: "mcq",
    question: "Julia gana $50k y debe $350k de un auto. Mario gana $15k y tiene $100k en el banco sin deudas. ¿Quién es más rico?",
    options: [
      { id: "o1", label: "Julia, porque su sueldo es mayor", isCorrect: false },
      { id: "o2", label: "Mario, porque su Capital Neto es positivo y mayor", isCorrect: true, explanation: "Julia tiene una riqueza ilusoria basada en deuda; Mario tiene riqueza real disponible." }
    ],
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "erp-4",
    stepType: "blitz_challenge",
    question: "¿Cuál es la fórmula del Capital Neto?",
    options: [
      { id: "o1", label: "Ingresos - Gastos", isCorrect: false },
      { id: "o2", label: "Activos - Pasivos", isCorrect: true }
    ],
    timeLimit: 12,
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "erp-5",
    stepType: "swipe_sorter",
    question: "¿Es un Activo o un Pasivo?",
    leftBucket: { label: "Pasivo (Resta)", color: "#ef4444" },
    rightBucket: { label: "Activo (Suma)", color: "#10b981" },
    items: [
      { id: "i1", label: "Efectivo en manos", correctBucket: "right" },
      { id: "i2", label: "Saldo de tarjeta de crédito", correctBucket: "left" },
      { id: "i3", label: "Dinero en Cetes/Inversión", correctBucket: "right" },
      { id: "i4", label: "Préstamo bancario", correctBucket: "left" }
    ],
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "erp-6",
    stepType: "info",
    title: "El Capital Neto Negativo",
    body: "Si hoy vendieras todo lo que tienes y no te alcanza para pagar lo que debes, tienes un **Balance Negativo**.\n\nEsto es una emergencia de Nivel 1. Significa que eres un esclavo de tu pasado y necesitamos un plan de rescate inmediato.",
    aiInsight: "Tener capital neto negativo es como intentar correr un maratón con una mochila llena de piedras.",
    fullScreen: true,
  },
  {
    id: "erp-7",
    stepType: "true_false",
    statement: "Un auto nuevo que sacas de la agencia es un activo porque tiene mucho valor.",
    correctValue: false,
    explanation: "Pierde el 20% de su valor al salir de la agencia y genera gastos (seguro, gasolina). Es un pasivo de uso.",
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "erp-8",
    stepType: "impulse_meter",
    instructions: "Mantén presionado para 'Aceptar la Realidad' sin juzgarte. Los números son solo datos para mejorar.",
    item: { name: "Escáner de Verdad", price: "Coraje", imageUrl: "/billy-breathing.png" },
    holdTime: 4,
    fullScreen: true,
  },
  {
    id: "erp-9",
    stepType: "blitz_challenge",
    question: "¿Qué es lo primero que debes hacer si tu balance es negativo?",
    options: [
      { id: "o1", label: "Gastar más para olvidar", isCorrect: false },
      { id: "o2", label: "Detener la fuga (No más deuda)", isCorrect: true }
    ],
    timeLimit: 10,
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "erp-10",
    stepType: "order",
    question: "Estructura de un Balance Saludable",
    items: [
      { id: "p1", label: "Fondo de Emergencia (Liquidez)", correctOrder: 1 },
      { id: "p2", label: "Inversiones a Largo Plazo", correctOrder: 2 },
      { id: "p3", label: "Bienes de Uso (Casa/Auto)", correctOrder: 3 }
    ],
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "erp-11",
    stepType: "match",
    question: "Relaciona la categoría",
    leftItems: [
      { id: "l1", label: "Cuenta de Ahorro" },
      { id: "l2", label: "Préstamo de Nómina" }
    ],
    rightItems: [
      { id: "r1", label: "Activo Circulante" },
      { id: "r2", label: "Pasivo Exigible" }
    ],
    correctPairs: [
      { leftId: "l1", rightId: "r1" },
      { leftId: "l2", rightId: "r2" }
    ],
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "erp-12",
    stepType: "mindset_translator",
    question: "Traduce tu Balance",
    beliefs: [
      { 
        id: "b1", 
        original: "Tengo muchas cosas bonitas, me va muy bien.", 
        healthyOptions: [
          { id: "h1", label: "Tengo muchos pasivos; necesito transformarlos en activos", isCorrect: true },
          { id: "h2", label: "Soy exitoso porque consumo mucho", isCorrect: false }
        ] 
      }
    ],
    fullScreen: true,
  },
  {
    id: "erp-13",
    stepType: "info",
    title: "El Valor de Reventa",
    body: "Un activo real es algo que puedes vender mañana si fuera necesario. Si compras algo que nadie te compraría después (como ropa usada), es un **gasto**, no una inversión.",
    aiInsight: "La clase media compra 'cosas'. La clase rica compra 'activos' que luego compran las 'cosas'.",
    fullScreen: true,
  },
  {
    id: "erp-14",
    stepType: "narrative_check",
    question: "Si sumas todo lo que tienes y restas todo lo que debes de forma honesta, ¿tu número es verde (positivo) o rojo (negativo)?",
    promptPlaceholder: "Mi número es ... porque ...",
    minChars: 15,
    billyResponse: "La honestidad radical es el único punto de partida hacia la libertad.",
    fullScreen: true,
  },
  {
    id: "erp-15",
    stepType: "summary",
    title: "Mapa Trazado",
    body: "Ya sabes dónde estás parado. No más vendas en los ojos. Estás listo para el Tema 4: Ingeniería del Gasto. ¡Vamos!",
    fullScreen: true,
  },
]
