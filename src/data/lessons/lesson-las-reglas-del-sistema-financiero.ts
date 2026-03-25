import type { LessonStep } from "@/types/lessonTypes"

/**
 * Lesson: Las reglas del Sistema Financiero
 * Theme: El Tablero del Juego (Mentalidad)
 * Lesson ID: las-reglas-del-sistema-financiero
 * Difficulty: Avanzado / Técnico
 */

export const lessonLasRulesDelSistemaFinancieroSteps: LessonStep[] = [
  {
    id: "rsf-slide-1",
    stepType: "billy_talks",
    mood: "thinking",
    body: "Para ganar el juego, hay que conocer al rival. Los bancos no son ONGs; son negocios que venden un producto: **dinero prestado**.\n\nHoy vamos a entender por qué te invitan a gastar, por qué te dan tarjetas de crédito y cómo usar esas reglas a tu favor para que no te usen a ti.",
    continueLabel: "Descubrir las reglas",
    fullScreen: true,
  },
  {
    id: "rsf-slide-2",
    stepType: "info",
    title: "El Producto es el Interés",
    description: "¿Cómo gana el banco?",
    body: "Un banco te presta $10,000 pero espera cobrarte $12,000 o más. Ese extra es su ganancia. \n\nSu negocio es que **tú debas dinero el mayor tiempo posible**. Por eso existen los 'Pagos Mínimos': están diseñados para que la deuda dure años y tú pagues intereses mensuales sin parar.",
    continueLabel: "Analizar el negocio",
    fullScreen: true,
  },
  {
    id: "rsf-slide-3",
    stepType: "mcq",
    title: "El Truco del Pago Mínimo",
    description: "Carlos debe $10,000 en su tarjeta. El banco le dice: 'Paga solo $500 este mes'. Carlos piensa: '¡Qué buena onda el banco!'.",
    question: "Si Carlos solo paga el mínimo cada mes, ¿cuál es el resultado más probable?",
    options: [
      { id: "opt-1", label: "Termina de pagar en 10 meses", isCorrect: false },
      { id: "opt-2", label: "La deuda nunca baja porque el 90% del pago se va a puros intereses", isCorrect: true, explanation: "El pago mínimo está calculado para cubrir intereses y apenas tocar lo que debes." },
      { id: "opt-3", label: "El banco le regala el resto de la deuda", isCorrect: false },
    ],
    isAssessment: true,
    fullScreen: true,
    aiInsight: "Billy dice: El banco no es tu amigo, es tu socio... y quiere la parte más grande del pastel.",
  },
  {
    id: "rsf-slide-4",
    stepType: "blitz_challenge",
    title: "Reto Relámpago",
    description: "Te ofrecen una tarjeta de crédito con 0% de interés por 6 meses, después sube al 75% de CAT.",
    question: "¿Cuál es la verdadera intención detrás de esta oferta?",
    options: [
      { id: "opt-1", label: "Ayudarte a comprar cosas", isCorrect: false },
      { id: "opt-2", label: "Que te acostumbres a gastar y luego te amparen con la tasa alta", isCorrect: true, explanation: "Es un gancho: te dan crédito gratis para que generes el hábito y luego cobres lo que perdiste con creces." },
      { id: "opt-3", label: "Un premio por ser buen estudiante", isCorrect: false },
    ],
    timeLimit: 15,
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "rsf-slide-5",
    stepType: "true_false",
    statement: "Si usas una tarjeta de crédito y pagas el TOTAL de lo que gastaste antes de la fecha límite, el banco no te cobra intereses y te presta dinero 'gratis' por unos días.",
    correctValue: true,
    explanation: "Este es el truco para ganarles: usa su dinero, paga a tiempo y aprovecha sus beneficios sin pagar un solo peso de interés (Usuario Totalero).",
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "rsf-slide-6",
    stepType: "impulse_meter",
    item: {
      name: "Préstamo de nómina 'En un click'",
      price: "$20,000 directo en tu cuenta",
    },
    description: "Abres tu app del banco y un botón brillante dice: '¡Felicidades, tienes $20k listos!'. No los necesitas, pero se ve tentador para unas vacaciones.",
    instructions: "Mantén presionado para cerrar la app y no morder el anzuelo.",
    holdTime: 4.5,
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "rsf-slide-7",
    stepType: "narrative_check",
    question: "¿Has sentido alguna vez que un banco o tienda te 'invita' a gastar dinero que no tienes? ¿Cómo lo hicieron?",
    promptPlaceholder: "A través de una oferta de...",
    minChars: 20,
    billyResponse: "¡Bingo! Identificar la trampa antes de caer es la mitad de la victoria.",
    isAssessment: false,
    fullScreen: true,
  },
  {
    id: "rsf-slide-8",
    stepType: "summary",
    title: "Jugador de Elite",
    body: "Has terminado el primer bloque. Ya sabes qué es el dinero, cuánto vale tu tiempo y cómo funciona el sistema. En la siguiente sección (Sesgos y Decisiones), aprenderemos por qué nuestro propio cerebro a veces juega en nuestra contra.",
    continueLabel: "Finalizar Módulo",
    fullScreen: true,
  },
]
