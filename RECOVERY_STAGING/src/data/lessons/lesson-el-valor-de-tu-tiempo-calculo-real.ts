import type { LessonStep } from "@/types/lessonTypes"

/**
 * Lesson: El valor de tu tiempo (Cálculo real)
 * Theme: Operativo BIZEN
 * Lesson ID: el-valor-de-tu-tiempo-calculo-real
 */

export const lessonElValorDeTuTiempoCalculoRealSteps: LessonStep[] = [
  {
    id: "vdt-1",
    stepType: "billy_talks",
    mood: "thinking",
    body: "La mayoría cree que sabe cuánto gana. Dicen: 'Gano $10,000'. Pero eso es una ilusión.\n\nPara BIZEN, tu sueldo real no es lo que dice tu recibo, sino lo que queda tras 'comprar' tu derecho a trabajar. Hoy calcularemos tu **[[Salario Real|Lo que realmente te queda libre por cada hora de vida que entregas]]**.",
    data: { 
      glossary: [
        { word: "Salario Real", definition: "Ingreso neto total dividido entre las horas totales dedicadas (incluyendo transporte y preparación)." },
        { word: "Horas Fantasma", definition: "Tiempo no pagado pero necesario para trabajar (tráfico, preparación, descompresión)." }
      ] 
    },
    fullScreen: true,
  },
  {
    id: "vdt-2",
    stepType: "info",
    title: "La Trampa del Bruto",
    body: "Si trabajas 40 horas pero haces 10 horas de tráfico, le dedicas 50 horas a tu empleo. \n\nSi además gastas en gasolina, comidas fuera y ropa de oficina, ese dinero debe restarse DE TU SUELDO antes de decir cuánto vales por hora.",
    aiInsight: "El trabajador promedio gasta el 25% de su tiempo laboral solo en financiar su capacidad de llegar al trabajo.",
    fullScreen: true,
  },
  {
    id: "vdt-3",
    stepType: "mcq",
    question: "Andrés gana $20k, pero gasta $4k en gasolina y $2k en comidas forzadas de oficina. ¿Cuál es su ingreso real?",
    options: [
      { id: "o1", label: "$20,000 (Es su sueldo)", isCorrect: false },
      { id: "o2", label: "$14,000", isCorrect: true, explanation: "Debes restar los gastos obligatorios para poder trabajar del ingreso total." }
    ],
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "vdt-4",
    stepType: "blitz_challenge",
    question: "Si Andrés dedica 200 horas al mes (trabajo + tráfico) para llevarse $14,000 limpios, ¿cuánto gana por hora?",
    options: [
      { id: "o1", label: "$70 pesos por hora", isCorrect: true },
      { id: "o2", label: "$100 pesos por hora", isCorrect: false }
    ],
    timeLimit: 12,
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "vdt-5",
    stepType: "swipe_sorter",
    question: "¿Es una Hora Pagada o una Hora Fantasma?",
    leftBucket: { label: "Fantasma (Drena)", color: "#ef4444" },
    rightBucket: { label: "Pagada (Suma)", color: "#10b981" },
    items: [
      { id: "i1", label: "Tiempo en el tráfico", correctBucket: "left" },
      { id: "i2", label: "Hora de junta efectiva", correctBucket: "right" },
      { id: "i3", label: "Preparar lunch/ropa", correctBucket: "left" },
      { id: "i4", label: "Ejecución de tareas", correctBucket: "right" }
    ],
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "vdt-6",
    stepType: "info",
    title: "El Costo de la Distancia",
    body: "Vivir lejos por una renta barata puede ser un error matemático. Si ahorras $2,000 de renta pero gastas $3,000 en gasolina y 40 horas al mes en tráfico, estás PERDIENDO dinero y vida.",
    aiInsight: "Reducir tu tiempo de traslado es equivalente a un aumento de sueldo del 15% en calidad de vida y salud mental.",
    fullScreen: true,
  },
  {
    id: "vdt-7",
    stepType: "true_false",
    statement: "Tu salario real por hora es la métrica más importante para decidir si una compra 'vale la pena'.",
    correctValue: true,
    explanation: "Si algo cuesta $700 y ganas $70/hora, ese objeto te cuesta 10 HORAS de tu vida. ¿Realmente lo vale?",
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "vdt-8",
    stepType: "impulse_meter",
    instructions: "Mantén presionado para 'Recuperar tus Horas' enfocándote en la eficiencia.",
    item: { name: "Cronómetro de Vida", price: "Libertad", imageUrl: "/billy-breathing.png" },
    holdTime: 4,
    fullScreen: true,
  },
  {
    id: "vdt-9",
    stepType: "blitz_challenge",
    question: "Si quieres comprar un iPhone de $20,000 y ganas $100/hora real, ¿cuántas horas te cuesta?",
    options: [
      { id: "o1", label: "200 horas (Más de un mes de vida)", isCorrect: true },
      { id: "o2", label: "20 horas", isCorrect: false }
    ],
    timeLimit: 10,
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "vdt-10",
    stepType: "order",
    question: "Pasos para subir tu Salario Real",
    items: [
      { id: "p1", label: "Eliminar gastos de transporte/comida", correctOrder: 1 },
      { id: "p2", label: "Reducir horas fantasma (Tráfico/Juntas)", correctOrder: 2 },
      { id: "p3", label: "Subir el valor de tu hora (Habilidades)", correctOrder: 3 }
    ],
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "vdt-11",
    stepType: "match",
    question: "Relaciona el Impacto",
    leftItems: [
      { id: "l1", label: "Home Office" },
      { id: "l2", label: "Comedor Industrial" }
    ],
    rightItems: [
      { id: "r1", label: "Elimina horas fantasma" },
      { id: "r2", label: "Reduce el gasto de comida diaria" }
    ],
    correctPairs: [
      { leftId: "l1", rightId: "r1" },
      { leftId: "l2", rightId: "r2" }
    ],
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "vdt-12",
    stepType: "mindset_translator",
    question: "Cambia tu perspectiva horaria",
    beliefs: [
      { 
        id: "b1", 
        original: "Tengo que trabajar más horas para ganar más.", 
        healthyOptions: [
          { id: "h1", label: "Tengo que aumentar mi valor por hora para trabajar menos y ganar más", isCorrect: true },
          { id: "h2", label: "El sudor es la única forma de riqueza", isCorrect: false }
        ] 
      }
    ],
    fullScreen: true,
  },
  {
    id: "vdt-13",
    stepType: "info",
    title: "El Techo del Intercambio",
    body: "Hay un límite de horas que puedes trabajar sin morir. Por eso vender tiempo es el modelo de negocio más pobre. Tu objetivo es transicionar de 'vender tiempo' a 'vender sistemas o resultados'.",
    aiInsight: "Los millonarios no tienen más horas, tienen activos que trabajan 24/7 sin ellos presentes.",
    fullScreen: true,
  },
  {
    id: "vdt-14",
    stepType: "narrative_check",
    question: "Haz el cálculo rápido: Sueldo Limpio / Horas Totales. ¿A cuánto asciende tu hora de vida hoy?",
    promptPlaceholder: "Mi hora vale aprox $...",
    minChars: 10,
    billyResponse: "Ese es tu precio actual. Vamos a trabajar para duplicarlo.",
    fullScreen: true,
  },
  {
    id: "vdt-15",
    stepType: "summary",
    title: "Tiempo es Oro",
    body: "Has dejado de ver etiquetas y empezado a ver relojes. Estás listo para entender el Costo de Oportunidad.",
    fullScreen: true,
  },
]
