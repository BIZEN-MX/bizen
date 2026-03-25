import type { LessonStep } from "@/types/lessonTypes"

/**
 * Lesson: Costo de Oportunidad: Elegir es renunciar
 * Theme: El Tablero del Juego (Mentalidad)
 * Lesson ID: costo-de-oportunidad-elegir-es-renunciar
 * Difficulty: Intermedio / Analítico
 */

export const lessonCostoDeOportunidadElegirEsRenunciarSteps: LessonStep[] = [
  {
    id: "cdo-slide-1",
    stepType: "billy_talks",
    mood: "thinking",
    body: "Cada vez que dices 'SÍ' a un gasto, le estás diciendo 'NO' a algo más. Eso se llama **Costo de Oportunidad**.\n\nEn finanzas, lo que NO haces con tu dinero es tan importante como lo que SÍ haces. Vamos a ver por qué elegir mal hoy te quita opciones mañana.",
    continueLabel: "Analizar opciones",
    fullScreen: true,
  },
  {
    id: "cdo-slide-2",
    stepType: "info",
    title: "¿Qué es el Costo de Oportunidad?",
    description: "La alternativa perdida",
    body: "No es solo el precio de lo que compras. Es el **beneficio que dejas de recibir** de la mejor alternativa que sacrificaste.\n\nEjemplo: Si te compras unos tenis de $3,000, el costo no son solo los $3,000. Es también el rendimiento que esos $3,000 habrían generado si los hubieras invertido.",
    continueLabel: "Ver ejemplo real",
    fullScreen: true,
  },
  {
    id: "cdo-slide-3",
    stepType: "mcq",
    title: "El Dilema de Lucía",
    description: "Lucía tiene $5,000 extras. Puede gastarlos en un viaje el fin de semana o invertirlos en un fondo que le daría $500 extras cada año para siempre.",
    question: "Si Lucía elige el viaje, ¿cuál es su costo de oportunidad anual?",
    options: [
      { id: "opt-1", label: "$5,000 (lo que gastó)", isCorrect: false },
      { id: "opt-2", label: "$500 (lo que dejó de ganar cada año)", isCorrect: true, explanation: "El costo de oportunidad es el beneficio de la opción NO elegida." },
      { id: "opt-3", label: "$4,500", isCorrect: false },
    ],
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "cdo-slide-4",
    stepType: "blitz_challenge",
    title: "Reto Relámpago",
    description: "Andrés decide quedarse a trabajar horas extras para ganar $1,000 más, en lugar de ir a una cena que le costaría $600.",
    question: "¿Cuánto dinero 'mejoró' la posición de Andrés comparado con haber ido a la cena?",
    options: [
      { id: "opt-1", label: "$1,000", isCorrect: false },
      { id: "opt-2", label: "$1,600", isCorrect: true, explanation: "Ganó $1,000 y evitó gastar $600. La diferencia neta en su bolsillo es de $1,600." },
      { id: "opt-3", label: "$400", isCorrect: false },
    ],
    timeLimit: 15,
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "cdo-slide-5",
    stepType: "impulse_meter",
    item: {
      name: "Upgrade a Suite en tus vacaciones",
      price: "$2,500 adicionales",
    },
    description: "Llegas al hotel y te ofrecen una habitación mejor por $2,500 extra. Se ve increíble, pero esos $2,500 son exactamente lo que te falta para comprar tu nueva laptop de trabajo.",
    instructions: "Mantén presionado para elegir la laptop (tu futuro) sobre el lujo temporal.",
    holdTime: 3.5,
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "cdo-slide-6",
    stepType: "true_false",
    statement: "El costo de oportunidad de dejar tu dinero en una cuenta que no te da intereses es igual a la inflación acumulada.",
    correctValue: true,
    explanation: "Si no ganas nada mientras todo sube de precio, tu costo de oportunidad es la pérdida de poder adquisitivo.",
    isAssessment: true,
    fullScreen: true,
    aiInsight: "Billy dice: El dinero quieto es dinero que está muriendo lentamente.",
  },
  {
    id: "cdo-slide-7",
    stepType: "narrative_check",
    question: "Piensa en tu último gasto mayor de $1,000. Si no lo hubieras hecho, ¿en qué otra cosa útil podrías haber usado ese dinero?",
    promptPlaceholder: "Podría haberlo usado para...",
    minChars: 20,
    billyResponse: "¡Exacto! Visualizar esa alternativa es lo que te hará pensar dos veces la próxima vez.",
    isAssessment: false,
    fullScreen: true,
  },
  {
    id: "cdo-slide-8",
    stepType: "summary",
    title: "Estratega Formado",
    body: "Ahora entiendes que cada peso tiene un propósito prohibido: el de su alternativa. En la siguiente lección, calcularemos tu 'Número de Libertad' para saber cuánto dinero necesitas para decir 'NO' a lo que no quieras.",
    continueLabel: "Finalizar",
    fullScreen: true,
  },
]
