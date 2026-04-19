import type { LessonStep } from "@/types/lessonTypes"

/**
 * Lesson: Las reglas del Sistema Financiero
 * Theme: Operativo BIZEN
 * Lesson ID: las-reglas-del-sistema-financiero
 */

export const lessonLasRulesDelSistemaFinancieroSteps: LessonStep[] = [
  {
    id: "rsf-1",
    stepType: "billy_talks",
    mood: "thinking",
    body: "Para ganar el juego, hay que conocer al rival. Los bancos no son ONGs; son negocios que venden un producto: [[dinero prestado|El dinero que no es tuyo pero usas a cambio de un costo]].\n\nHoy vamos a entender por qué te invitan a gastar y cómo usar sus reglas a tu favor.",
    data: { 
      glossary: [
        { word: "Interés", definition: "El precio que pagas por usar dinero que no es tuyo." },
        { word: "CAT", definition: "Costo Anual Total: la suma de todos los costos de un crédito (tasa, comisiones, seguros)." },
        { word: "Deuda de Consumo", definition: "Deuda para financiar bienes que pierden valor con el tiempo (viajes, ropa)." },
        { word: "Deuda de Inversión", definition: "Deuda usada para adquirir activos o habilidades que generarán más valor futuro." },
        { word: "Usuario Totalero", definition: "Persona que paga el saldo completo de su tarjeta cada mes, sin generar intereses." },
        { word: "Historial Crediticio", definition: "Registro de comportamiento de pagos (tu 'reputación' ante los bancos)." }
      ] 
    },
    fullScreen: true,
  },
  {
    id: "rsf-2",
    stepType: "info",
    title: "El Producto es el Interés",
    body: "Un banco te presta $10,000 pero espera cobrarte $12,000 o más. Esa diferencia es su ganancia. \n\nSu negocio es que **tú debas dinero el mayor tiempo posible**. No quieren que pagues rápido; quieren que pagues [[intereses|El precio que pagas por usar dinero que no es tuyo]] mensualmente.",
    aiInsight: "El sistema financiero está diseñado para que el 80% de la población trabaje para pagar los intereses de su pasado.",
    fullScreen: true,
  },
  {
    id: "rsf-3",
    stepType: "mcq",
    question: "Si Carlos debe $10,000 y el banco le sugiere pagar solo el 'Mínimo' ($500), ¿qué sucede?",
    options: [
      { id: "o1", label: "Termina de pagar en 20 meses", isCorrect: false },
      { id: "o2", label: "Casi todo el pago se va a intereses y la deuda apenas baja", isCorrect: true, explanation: "El pago mínimo está diseñado para mantenerte cautivo pagando intereses sin amortizar el capital." }
    ],
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "rsf-4",
    stepType: "blitz_challenge",
    question: "¿Qué significa ser un 'Usuario Totalero'?",
    options: [
      { id: "o1", label: "Alguien que gasta todo su dinero", isCorrect: false },
      { id: "o2", label: "Alguien que paga el total de su tarjeta cada mes", isCorrect: true }
    ],
    timeLimit: 12,
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "rsf-5",
    stepType: "swipe_sorter",
    question: "¿Es Deuda de Consumo o Deuda de Inversión?",
    leftBucket: { label: "Consumo (Drena)", color: "#ef4444" },
    rightBucket: { label: "Inversión (Suma)", color: "#10b981" },
    items: [
      { id: "i1", label: "Vacaciones a 12 meses", correctBucket: "left" },
      { id: "i2", label: "Crédito para equipo de trabajo", correctBucket: "right" },
      { id: "i3", label: "Ropa de marca a crédito", correctBucket: "left" },
      { id: "i4", label: "Préstamo para curso técnico", correctBucket: "right" }
    ],
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "rsf-6",
    stepType: "info",
    title: "El Costo Anual Total (CAT)",
    body: "Nunca mires solo la tasa de interés. Mira el **[[CAT|Costo Anual Total]]**. El CAT incluye anualidades, seguros y comisiones que el banco 'olvida' mencionar en el anuncio brillante.",
    aiInsight: "Un CAT del 70% significa que en poco más de un año, habrás pagado casi el doble de lo que pediste.",
    fullScreen: true,
  },
  {
    id: "rsf-7",
    stepType: "true_false",
    statement: "Si pagas tu tarjeta de crédito el día exacto de la fecha límite, el banco no te cobra intereses.",
    correctValue: true,
    explanation: "Es el hack principal: usar el dinero del banco gratis por 20-40 días.",
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "rsf-8",
    stepType: "impulse_meter",
    instructions: "Mantén presionado para 'Cerrar la App' ante un préstamo pre-aprobado que NO necesitas.",
    item: { name: "Préstamo $50k 'Fácil'", price: "CAT 85%", imageUrl: "/billy-breathing.png" },
    holdTime: 4,
    fullScreen: true,
  },
  {
    id: "rsf-9",
    stepType: "blitz_challenge",
    question: "¿Cuál es el interés de un préstamo de amigos comparado con un banco?",
    options: [
      { id: "o1", label: "Suele ser 0% (Riesgo Social)", isCorrect: true },
      { id: "o2", label: "Suele ser 50% (Riesgo Bancario)", isCorrect: false }
    ],
    timeLimit: 10,
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "rsf-10",
    stepType: "order",
    question: "Prioridad ante una crisis de deuda",
    items: [
      { id: "p1", label: "Pagar la deuda con mayor tasa (CAT)", correctOrder: 1 },
      { id: "p2", label: "Pagar deudas pequeñas (Efecto Bola de Nieve)", correctOrder: 2 },
      { id: "p3", label: "Ahorrar para inversión", correctOrder: 3 }
    ],
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "rsf-11",
    stepType: "match",
    question: "Relaciona el término con su impacto",
    leftItems: [
      { id: "l1", label: "Interés Moratorio" },
      { id: "l2", label: "Historial Crediticio" }
    ],
    rightItems: [
      { id: "r1", label: "Multa por pagar tarde" },
      { id: "r2", label: "Tu 'reputación' ante los bancos" }
    ],
    correctPairs: [
      { leftId: "l1", rightId: "r1" },
      { leftId: "l2", rightId: "r2" }
    ],
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "rsf-12",
    stepType: "mindset_translator",
    question: "Traduce la oferta bancaria",
    beliefs: [
      { 
        id: "b1", 
        original: "¡Felicidades! Tienes meses sin intereses en toda la tienda.", 
        healthyOptions: [
          { id: "h1", label: "Quieren que comprometa mis ingresos futuros en objetos que pierden valor", isCorrect: true },
          { id: "h2", label: "Me están regalando dinero por ser buen cliente", isCorrect: false }
        ] 
      }
    ],
    fullScreen: true,
  },
  {
    id: "rsf-13",
    stepType: "info",
    title: "Tu Reputación (Buró)",
    body: "Tener un buen [[historial crediticio|Registro de tu comportamiento de pago y tu nivel de riesgo como cliente]] no es para presumir, es para **negociar**. Un buen historial te permite pedir tasas más bajas cuando realmente necesites apalancamiento para un negocio.",
    aiInsight: "Un mal historial crediticio puede costarte cientos de miles de dólares en intereses extra a lo largo de tu vida.",
    fullScreen: true,
  },
  {
    id: "rsf-14",
    stepType: "narrative_check",
    question: "¿Qué producto financiero (tarjeta, préstamo, plan) sientes que te está 'robando' más energía hoy?",
    promptPlaceholder: "Siento que el préstamo de...",
    minChars: 15,
    billyResponse: "Identificar la fuga es el primer paso para sellarla. Vamos a por ello.",
    fullScreen: true,
  },
  {
    id: "rsf-15",
    stepType: "summary",
    title: "Sistema Entendido",
    body: "Has hackeado las reglas del tablero. Ya no eres una víctima del sistema, eres un jugador consciente. Siguiente: La Física del Dinero.",
    fullScreen: true,
  },
]
