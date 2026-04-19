import type { LessonStep } from "@/types/lessonTypes"

/**
 * Lesson: Sesgo de Comparación: El costo de 'quedar bien'
 * Theme: El Tablero del Juego (Mentalidad)
 * Lesson ID: sesgo-de-comparacion-el-costo-de-quedar-bien
 * Difficulty: Básico / Psicológico-Analítico
 */

export const lessonSesgoDeComparacionElCostoDeQuedarBienSteps: LessonStep[] = [
  {
    id: "sdc-slide-1",
    stepType: "billy_talks",
    mood: "worried",
    body: "El mayor enemigo de tu cuenta bancaria no es el banco, es tu vecino (o lo que ves en Instagram).\n\nSolemos gastar dinero que no tenemos, para comprar cosas que no necesitamos, para impresionar a gente que no conocemos. Hoy vamos a calcular cuánto nos cuesta 'quedar bien'.",
    continueLabel: "Analizar el sesgo",
    fullScreen: true,
  },
  {
    id: "sdc-slide-2",
    stepType: "info",
    title: "¿Qué es el Sesgo de Comparación?",
    description: "La trampa social",
    body: "Tu cerebro valora tu nivel de vida comparándolo con los demás. Si todos tus amigos tienen un coche nuevo, tú sientes que 'necesitas' uno aunque el tuyo funcione perfecto.\n\nEste sesgo te obliga a quemar tu riqueza solo para mantener una imagen social.",
    continueLabel: "Ver ejemplo",
    fullScreen: true,
  },
  {
    id: "sdc-slide-3",
    stepType: "mcq",
    title: "El Caso de Marina",
    description: "Marina ve que su mejor amiga compró una bolsa de diseñador de $8,000. Marina no tiene el dinero, pero siente que 'se está quedando atrás' y la compra a crédito.",
    question: "¿Qué está comprando Marina realmente?",
    options: [
      { id: "opt-1", label: "Una bolsa de alta calidad", isCorrect: false },
      { id: "opt-2", label: "Aceptación social a cambio de deuda", isCorrect: true, explanation: "Está intentando igualar el estatus de su amiga sacrificando su estabilidad financiera." },
      { id: "opt-3", label: "Una inversión a largo plazo", isCorrect: false },
    ],
    isAssessment: true,
    fullScreen: true,
    aiInsight: "Billy dice: La bolsa pasará de moda, pero los intereses de la tarjeta se quedarán contigo por meses.",
  },
  {
    id: "sdc-slide-4",
    stepType: "blitz_challenge",
    title: "Reto Relámpago",
    description: "Sabes que no deberías gastar, pero te invitan a una boda y sientes que 'tienes' que estrenar un traje o vestido de $3,500.",
    question: "Si tu salario por hora es de $100, ¿cuántos días (8h c/u) de tu vida vas a trabajar solo para impresionar a gente que ni te hablará en la boda?",
    options: [
      { id: "opt-1", label: "2 días", isCorrect: false },
      { id: "opt-2", label: "4.3 días", isCorrect: true, explanation: "$3,500 / $100 = 35 horas. 35 / 8 = aprox 4.3 días de vida regalados." },
      { id: "opt-3", label: "1 día", isCorrect: false },
    ],
    timeLimit: 20,
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "sdc-slide-5",
    stepType: "influence_detective",
    scenario: "Ves una foto de un influencer en un yate. De pronto, tu depa o casa se empieza a ver 'insuficiente' y sientes que necesitas gastar en un lujo para compensar.",
    options: [
      { id: "opt-1", label: "Es una meta inspiradora", emotion: "Inspiration", isCorrect: false },
      { id: "opt-2", label: "Es una trampa de comparación", emotion: "Comparison", isCorrect: true },
      { id: "opt-3", label: "Es un consejo de inversión", emotion: "Advice", isCorrect: false },
    ],
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "sdc-slide-6",
    stepType: "true_false",
    statement: "No revisar redes sociales mientras estás en una racha de ahorro puede ayudarte a gastar menos dinero.",
    correctValue: true,
    explanation: "Ojos que no ven, corazón que no gasta. Reducir los disparadores de comparación es una estrategia financiera sólida.",
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "sdc-slide-7",
    stepType: "impulse_meter",
    item: {
      name: "Upgrade de celular (el anterior sirve bien)",
      price: "$15,000",
    },
    description: "Salió el nuevo modelo. Todos en la oficina lo tienen. Tu impulso es sacarlo a meses solo para no tener el modelo 'viejo'.",
    instructions: "Mantén presionado para romper el espejo de la comparación y ahorrar esos $15k.",
    holdTime: 4,
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "sdc-slide-8",
    stepType: "narrative_check",
    question: "¿Qué es algo que compraste últimamente solo para 'encajar' o porque otros lo tenían, y hoy te arrepientes?",
    promptPlaceholder: "Compré ... y ahora me doy cuenta que...",
    minChars: 20,
    billyResponse: "¡Esa honestidad contigo mismo vale más que cualquier bolsa de marca!",
    isAssessment: false,
    fullScreen: true,
  },
  {
    id: "sdc-slide-9",
    stepType: "summary",
    title: "Persona Auténtica",
    body: "Comparar tu Capítulo 1 con el Capítulo 20 de alguien más es injusto y costoso. En la siguiente lección, veremos cómo nuestro cerebro nos engaña para confirmar solo lo que queremos creer.",
    continueLabel: "Finalizar Lección",
    fullScreen: true,
  },
]
