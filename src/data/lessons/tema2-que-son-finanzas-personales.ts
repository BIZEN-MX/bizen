import type { LessonStep } from "@/types/lessonTypes"

// ==============================================================================
// LECCIÓN 1: Definición e importancia diaria de las finanzas personales - 15 SLIDES
// ==============================================================================
export const lessonQueSonFinanzasPersonalesSteps: LessonStep[] = [
  { 
    id: "qsf-1", 
    stepType: "billy_talks", 
    body: "Muchos creen que las finanzas son solo para banqueros o millonarios. ¡Falso! Las finanzas aplican cada vez que decides comprar un café, pagar un recibo o ahorrar para una meta. Vamos a diseñar tu sistema de administración diaria.", 
    fullScreen: true,
    data: { 
      glossary: [
        { word: "Finanzas personales", definition: "Forma en la que una persona organiza, usa, ahorra y decide sobre su dinero día a día." }, 
        { word: "Presupuesto", definition: "Plan estratégico para saber cuánto dinero entra, cuánto sale y hacia dónde se dirige." },
        { word: "Administración del dinero", definition: "Orquestar tus recursos para cubrir necesidades, cumplir obligaciones y construir tu futuro." },
        { word: "Ingreso", definition: "Todo aquel dinero entrante que recibes, producto de tu trabajo, inversiones o ventas." },
        { word: "Gasto", definition: "Dinero que sale y ya no regresa a ti; se intercambia por algo inmediato." },
        { word: "Ahorro", definition: "Dinero que decides NO gastar hoy para acumularlo de forma estratégica para el futuro." }
      ] 
    }
  },
  { 
    id: "qsf-2", 
    stepType: "swipe_sorter", 
    question: "Clasifica las siguientes situaciones de tu vida diaria", 
    leftBucket: { label: "Finanza Personal", color: "#3b82f6" }, 
    rightBucket: { label: "Decisión Trivial", color: "#64748b" }, 
    items: [
      { id: "i1", label: "Decidir cuánto de tu quincena vas a ahorrar", correctBucket: "left" }, 
      { id: "i2", label: "Elegir qué serie ver en la noche", correctBucket: "right" }, 
      { id: "i3", label: "Organizar el pago de la luz y el internet", correctBucket: "left" }, 
      { id: "i4", label: "Escoger el color de tu funda del celular", correctBucket: "right" }
    ], 
    isAssessment: true, 
    fullScreen: true 
  },
  { 
    id: "qsf-3", 
    stepType: "true_false", 
    statement: "Las finanzas personales solo importan cuando una persona gana cantidades enormes de dinero o dirige una empresa.", 
    correctValue: false, 
    explanation: "Falso. Cada pequeña decisión monetaria impacta tu calidad de vida. Controlar el dinero importa sin importar cuánto ganes.", 
    isAssessment: true, 
    fullScreen: true 
  },
  { 
    id: "qsf-4", 
    stepType: "match", 
    question: "Relaciona cada pilar financiero con su definición correcta", 
    leftItems: [
      { id: "l1", label: "Ingreso" }, 
      { id: "l2", label: "Gasto" }, 
      { id: "l3", label: "Ahorro" }, 
      { id: "l4", label: "Presupuesto" }
    ], 
    rightItems: [
      { id: "r1", label: "Dinero que entra o que recibes" }, 
      { id: "r2", label: "Dinero que sale y no regresa" }, 
      { id: "r3", label: "Dinero que separas estratégicamente para el futuro" },
      { id: "r4", label: "Plan táctico para dar orden a todo tu dinero" }
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
    id: "qsf-5", 
    stepType: "info", 
    title: "El Control es Poder", 
    body: "Administrar bien el dinero no significa privarse de todo lo que te gusta, significa evitar deudas innecesarias, eliminar la ansiedad financiera y tener libertad total sobre tu propia vida y decisiones.", 
    fullScreen: true,
    aiInsight: "Cerca del 60% de los jóvenes que no arman un presupuesto gastan sus ingresos a los 10 días de la quincena por consumos invisibles."
  },
  { 
    id: "qsf-6", 
    stepType: "mcq", 
    question: "¿Por qué son importantes las finanzas personales en la vida diaria?", 
    options: [
      { id: "o1", label: "Porque hacen que literalmente todo sea gratis y fácil", isCorrect: false }, 
      { id: "o2", label: "Porque te ayudan a tomar mejores decisiones cada vez que usas tu dinero", isCorrect: true },
      { id: "o3", label: "Porque eliminan la obligación de trabajar a futuro", isCorrect: false },
      { id: "o4", label: "Porque te prohíben comprar cualquier cosa que no sea comida", isCorrect: false }
    ], 
    isAssessment: true, 
    fullScreen: true 
  },
  { 
    id: "qsf-7", 
    stepType: "blitz_challenge", 
    question: "¿Cuál es la función exacta de un presupuesto básico?", 
    options: [
      { id: "o1", label: "Lista de compras compulsivas", isCorrect: false }, 
      { id: "o2", label: "Plan para controlar ingresos y egresos", isCorrect: true },
      { id: "o3", label: "Una cuenta bloqueada del banco", isCorrect: false }
    ], 
    timeLimit: 10, 
    isAssessment: true, 
    fullScreen: true 
  },
  { 
    id: "qsf-8", 
    stepType: "match", 
    question: "Clasifica rápidamente cada acción del día a día", 
    leftItems: [
      { id: "l1", label: "Pagar la renta del departamento" }, 
      { id: "l2", label: "Recibir la nómina quincenal" }, 
      { id: "l3", label: "Guardar un 10% para fondo de emergencia" }, 
      { id: "l4", label: "Anotar en una app tus entradas y salidas" }
    ], 
    rightItems: [
      { id: "r1", label: "Gasto Obligatorio" }, 
      { id: "r2", label: "Ingreso Activo" }, 
      { id: "r3", label: "Ahorro Blindado" },
      { id: "r4", label: "Administración Consciente" }
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
    id: "qsf-9", 
    stepType: "true_false", 
    statement: "Administrar tu dinero de forma responsable significa dejar de gastar en todo lo que te gusta.", 
    correctValue: false, 
    explanation: "Falso. Administrar bien es poner límites para priorizar, de manera que gastes sin culpa en lo que SÍ valoras, eliminando lo que roba tu energía y billetera.", 
    isAssessment: true, 
    fullScreen: true 
  },
  { 
    id: "qsf-10", 
    stepType: "order", 
    question: "Ordena jerárquicamente de mayor a menor prioridad al recibir dinero", 
    items: [
      { id: "p1", label: "Cubrir necesidades y obligaciones básicas inmediatas", correctOrder: 1 }, 
      { id: "p2", label: "Separar de inmediato tu porcentaje al ahorro", correctOrder: 2 }, 
      { id: "p3", label: "Asignar capital a tus gastos variables del mes", correctOrder: 3 },
      { id: "p4", label: "Destinar el resto a gustos o estilo de vida no esenciales", correctOrder: 4 }
    ], 
    isAssessment: true, 
    fullScreen: true 
  },
  { 
    id: "qsf-11", 
    stepType: "blitz_challenge", 
    question: "¿Cuál opción retrata una administración moderna e infalible?", 
    options: [
      { id: "o1", label: "Gastar primero y ver si sobra", isCorrect: false }, 
      { id: "o2", label: "Cobrar todo y gastar más rápido", isCorrect: false },
      { id: "o3", label: "Diseñar presupuesto y apartar tu propio ahorro primero", isCorrect: true }
    ], 
    timeLimit: 12, 
    isAssessment: true, 
    fullScreen: true 
  },
  { 
    id: "qsf-12", 
    stepType: "impulse_meter", 
    instructions: "Mantén pulsado para inyectar disciplina a tus hábitos. La diferencia entre ser dueño de tu vida y esclavo de tu cartera, es un presupuesto.", 
    item: { name: "Paz Mental y Orden", price: "Libertad", imageUrl: "/billy-breathing.png" }, 
    holdTime: 6, 
    fullScreen: true 
  },
  { 
    id: "qsf-13", 
    stepType: "order", 
    question: "Ordena los pasos lógicos para estructurar tu presupuesto personal base", 
    items: [
      { id: "p1", label: "Identificar y promediar cuánto dinero entra", correctOrder: 1 }, 
      { id: "p2", label: "Anotar con precisión extrema cuánto dinero sale cada mes", correctOrder: 2 }, 
      { id: "p3", label: "Separar salidas por categoría (fijo, variable, gustos)", correctOrder: 3 },
      { id: "p4", label: "Revisar la matemática: ¿Sobra dinero, falta, o puedo eficientar?", correctOrder: 4 }
    ], 
    isAssessment: true, 
    fullScreen: true 
  },
  { 
    id: "qsf-14", 
    stepType: "mcq", 
    question: "Caso Práctico: Luis cobra cada quincena, pero la primera semana ya no tiene dinero. Gasta sin plan y paga suscripciones que no usa. ¿Qué solución drástica debe adoptar?", 
    options: [
      { id: "o1", label: "Renunciar porque le pagan mal", isCorrect: false }, 
      { id: "o2", label: "Implementar un presupuesto real y depurar salidas", isCorrect: true },
      { id: "o3", label: "Pedir un préstamo bancario mayor al mes anterior", isCorrect: false },
      { id: "o4", label: "Ignorar los cargos pequeños en su tarjeta", isCorrect: false }
    ], 
    isAssessment: true, 
    fullScreen: true 
  },
  { 
    id: "qsf-15", 
    stepType: "narrative_check", 
    question: "Desde tu perspectiva, ¿por qué crees que aprender a administrar y presupuestar desde tu primer sueldo transforma el resto de tu vida diaria?", 
    promptPlaceholder: "Aprender esto transforma mi vida porque...", 
    minChars: 25, 
    billyResponse: "Totalmente de acuerdo. Dominar tu dinero temprano es como programar el GPS en dirección a tu libertad. Has sentado las bases de un estratega.", 
    fullScreen: true 
  }
]
