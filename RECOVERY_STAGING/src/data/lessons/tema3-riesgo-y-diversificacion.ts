import type { LessonStep } from "@/types/lessonTypes"

// ==============================================================================
// LECCIÓN 1: Riesgo, diversificación y primeras decisiones de inversión - 15 SLIDES
// ==============================================================================
export const lessonRiesgoDiversificacionSteps: LessonStep[] = [
  { 
    id: "rdi-1", 
    stepType: "billy_talks", 
    body: "Toda inversión conlleva la posibilidad de que el valor suba o baje. Tu misión como estratega no es eliminar este factor, sino administrarlo mediante la distribución inteligente de tu capital. Vamos a diseñar tu primer sistema de defensa y ataque financiero.", 
    fullScreen: true,
    data: { 
      glossary: [
        { word: "Riesgo", definition: "Posibilidad de que una inversión suba o baje de valor y no dé el resultado esperado." }, 
        { word: "Diversificación", definition: "Repartir el dinero en diferentes activos para no depender de uno solo y mitigar pérdidas." },
        { word: "Portafolio", definition: "El conjunto articulado de todas las inversiones que posee una persona." }
      ] 
    }
  },
  { 
    id: "rdi-2", 
    stepType: "mcq", 
    question: "¿Qué significa riesgo en el mundo bursátil?", 
    options: [
      { id: "o1", label: "Que una inversión siempre va a perder dinero", isCorrect: false }, 
      { id: "o2", label: "Que existe la posibilidad de ganar o perder según el mercado", isCorrect: true },
      { id: "o3", label: "Que solo las criptomonedas son peligrosas", isCorrect: false },
      { id: "o4", label: "Que invertir es igual a apostar al azar", isCorrect: false }
    ], 
    isAssessment: true, 
    fullScreen: true 
  },
  { 
    id: "rdi-3", 
    stepType: "true_false", 
    statement: "Una inversión con mayor posibilidad de rendimiento esperado también suele tener un mayor riesgo asociado.", 
    correctValue: true, 
    explanation: "Es la ley fundamental de las finanzas: para buscar mayores retornos, debes estar dispuesto a soportar mayor volatilidad (riesgo).", 
    isAssessment: true, 
    fullScreen: true 
  },
  { 
    id: "rdi-4", 
    stepType: "match", 
    question: "Relaciona cada concepto con su descripción correcta", 
    leftItems: [
      { id: "l1", label: "Acción" }, 
      { id: "l2", label: "ETF" }, 
      { id: "l3", label: "Bono" }, 
      { id: "l4", label: "Portafolio" }
    ], 
    rightItems: [
      { id: "r1", label: "Pequeña parte de una empresa" }, 
      { id: "r2", label: "Fondo que agrupa varios activos" }, 
      { id: "r3", label: "Instrumento de deuda que paga rendimiento" },
      { id: "r4", label: "Conjunto de inversiones de una persona" }
    ], 
    correctPairs: [
      { leftId: "l1", rightId: "r1" }, 
      { leftId: "l2", rightId: "r2" }, 
      { leftId: "l3", rightId: "r3" },
      { leftId: "l4", rightId: "r4" }
    ], 
    isAssessment: true, 
    fullScreen: true 
  },
  { 
    id: "rdi-5", 
    stepType: "info", 
    title: "El Poder de la Diversificación", 
    body: "Si pones todo tu dinero en una sola empresa y esta quiebra, pierdes tu capital. Si repartes tu inversión en 500 empresas usando un ETF, la caída de una se compensa con la subida de las demás.", 
    fullScreen: true,
    aiInsight: "Estudios demuestran que un portafolio diversificado reduce la volatilidad hasta en un 40% en tiempos de crisis."
  },
  { 
    id: "rdi-6", 
    stepType: "mcq", 
    question: "¿Cuál es el principal beneficio de diversificar un portafolio?", 
    options: [
      { id: "o1", label: "Asegurar que siempre habrá ganancias rápidas", isCorrect: false }, 
      { id: "o2", label: "Evitar por completo cualquier posibilidad de pérdida", isCorrect: false },
      { id: "o3", label: "Reducir el impacto negativo de depender de un solo activo", isCorrect: true },
      { id: "o4", label: "Comprar activamente solo acciones caras", isCorrect: false }
    ], 
    isAssessment: true, 
    fullScreen: true 
  },
  { 
    id: "rdi-7", 
    stepType: "true_false", 
    statement: "Diversificar significa invertir todo tu dinero, pero repartido en muchas criptomonedas distintas.", 
    correctValue: false, 
    explanation: "Eso es falsa diversificación. Todas las criptomonedas suelen moverse juntas (correlación). Diversificar es usar diferentes clases de activos (acciones, bonos, bienes raíces).", 
    isAssessment: true, 
    fullScreen: true 
  },
  { 
    id: "rdi-8", 
    stepType: "swipe_sorter", 
    question: "Evalúa el nivel de riesgo de estas prácticas", 
    leftBucket: { label: "Riesgo Controlado", color: "#10b981" }, 
    rightBucket: { label: "Riesgo Extremo", color: "#ef4444" }, 
    items: [
      { id: "i1", label: "Invertir en un ETF amplio del mercado", correctBucket: "left" }, 
      { id: "i2", label: "Invertir todo en una sola acción pequeña", correctBucket: "right" }, 
      { id: "i3", label: "Tener acciones, bonos y liquidez", correctBucket: "left" }, 
      { id: "i4", label: "Invertir todo en un activo sin conocer cómo funciona", correctBucket: "right" }
    ], 
    isAssessment: true, 
    fullScreen: true 
  },
  { 
    id: "rdi-9", 
    stepType: "order", 
    question: "Ordena los pasos lógicos antes de hacer tu primera inversión", 
    items: [
      { id: "p1", label: "Definir tu objetivo claro de inversión", correctOrder: 1 }, 
      { id: "p2", label: "Identificar cuánto riesgo puedes tolerar", correctOrder: 2 }, 
      { id: "p3", label: "Elegir los instrumentos adecuados a ese riesgo", correctOrder: 3 },
      { id: "p4", label: "Construir y dar seguimiento a tu portafolio", correctOrder: 4 }
    ], 
    isAssessment: true, 
    fullScreen: true 
  },
  { 
    id: "rdi-10", 
    stepType: "blitz_challenge", 
    question: "¿Cuál de estas opciones muestra una diversificación estructural adecuada?", 
    options: [
      { id: "o1", label: "100% en acciones tecnológicas", isCorrect: false }, 
      { id: "o2", label: "Acciones, ETFs y bonos según tu perfil", isCorrect: true },
      { id: "o3", label: "Guardar todo el dinero en efectivo bajo el colchón", isCorrect: false }
    ], 
    timeLimit: 12, 
    isAssessment: true, 
    fullScreen: true 
  },
  { 
    id: "rdi-11", 
    stepType: "blitz_challenge", 
    question: "Revisar noticias de forma objetiva ¿ayuda a entender tu inversión?", 
    options: [
      { id: "o1", label: "Sí, da perspectiva analítica", isCorrect: true }, 
      { id: "o2", label: "No, las noticias no importan nunca", isCorrect: false }
    ], 
    timeLimit: 12, 
    isAssessment: true, 
    fullScreen: true 
  },
  { 
    id: "rdi-12", 
    stepType: "match", 
    question: "Relaciona cada perfil con la decisión lógica que le corresponde", 
    leftItems: [
      { id: "l1", label: "Perfil Conservador" }, 
      { id: "l2", label: "Perfil Moderado" }, 
      { id: "l3", label: "Perfil Agresivo" }
    ], 
    rightItems: [
      { id: "r1", label: "Prioriza estabilidad sobre altas ganancias" }, 
      { id: "r2", label: "Busca equilibrio entre riesgo y rendimiento" }, 
      { id: "r3", label: "Tolera mucha volatilidad por mayor rendimiento" }
    ], 
    correctPairs: [
      { leftId: "l1", rightId: "r1" }, 
      { leftId: "l2", rightId: "r2" }, 
      { leftId: "l3", rightId: "r3" }
    ], 
    isAssessment: true, 
    fullScreen: true 
  },
  { 
    id: "rdi-13", 
    stepType: "mcq", 
    question: "Caso: Mariana tiene $10,000 para invertir prudentemente. ¿Qué opción tiene más sentido según la ingeniería BIZEN?", 
    options: [
      { id: "o1", label: "Invertir todo en una criptomoneda de moda", isCorrect: false }, 
      { id: "o2", label: "Repartir entre un ETF amplio, deuda y un 10% en acciones individuales", isCorrect: true },
      { id: "o3", label: "Dejar todo en efectivo por 10 años perdiendo valor por inflación", isCorrect: false },
      { id: "o4", label: "Pedir dinero prestado para invertir $20,000 de golpe", isCorrect: false }
    ], 
    isAssessment: true, 
    fullScreen: true 
  },
  { 
    id: "rdi-14", 
    stepType: "impulse_meter", 
    instructions: "Mantén pulsado para asimilar la disciplina del inversionista. Las caídas temporales no son pérdidas si tienes estrategia. Respira.", 
    item: { name: "Visión a Largo Plazo", price: "Libertad", imageUrl: "/billy-breathing.png" }, 
    holdTime: 6, 
    fullScreen: true 
  },
  { 
    id: "rdi-15", 
    stepType: "narrative_check", 
    question: "¿Por qué crees que estructurar un portafolio diversificado puede ayudarte a dormir más tranquilo por las noches?", 
    promptPlaceholder: "Diversificar mi dinero me daría tranquilidad porque...", 
    minChars: 20, 
    billyResponse: "Esa es la mente de un arquitecto financiero. La tranquilidad no se compra, se diseña.", 
    fullScreen: true 
  }
]
