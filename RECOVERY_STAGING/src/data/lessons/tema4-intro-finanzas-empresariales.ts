import type { LessonStep } from "@/types/lessonTypes"

// ==============================================================================
// LECCIÓN 1: Costos, flujo de efectivo y prioridades del negocio - 15 SLIDES
// ==============================================================================
export const lessonIntroFinanzasEmpresarialesSteps: LessonStep[] = [
  { 
    id: "ife-1", 
    stepType: "billy_talks", 
    body: "Para que un negocio sobreviva, la pasión no basta: necesitas ingeniería. Identificar qué gastos puedes controlar y cómo fluye tu dinero es la única forma de evitar que la máquina se detenga. Vamos a estructurar tus finanzas.", 
    fullScreen: true,
    data: { 
      glossary: [
        { word: "Costo fijo", definition: "Gasto constante que se paga vendas poco o mucho (ej. renta)." }, 
        { word: "Costo variable", definition: "Gasto que cambia y aumenta según la cantidad que produces o vendes." },
        { word: "Flujo de efectivo", definition: "El movimiento real de dinero que entra y sale de tu negocio." },
        { word: "Margen", definition: "La ganancia real que queda después de descontar el costo de producción o venta." },
        { word: "Punto de equilibrio", definition: "Nivel de ventas donde no hay pérdida ni ganancia; los ingresos cubren exactos los gastos." },
        { word: "Liquidez", definition: "Capacidad de disponer de efectivo inmediato para cubrir obligaciones a corto plazo." }
      ] 
    }
  },
  { 
    id: "ife-2", 
    stepType: "swipe_sorter", 
    question: "Clasifica los siguientes gastos de un negocio para mantener el control", 
    leftBucket: { label: "Costo Fijo", color: "#3b82f6" }, 
    rightBucket: { label: "Costo Variable", color: "#f59e0b" }, 
    items: [
      { id: "i1", label: "Renta mensual del local", correctBucket: "left" }, 
      { id: "i2", label: "Ingredientes para cada pastel vendido", correctBucket: "right" }, 
      { id: "i3", label: "Empaque y envío por cada pedido", correctBucket: "right" }, 
      { id: "i4", label: "Sueldo administrativo mensual", correctBucket: "left" }
    ], 
    isAssessment: true, 
    fullScreen: true 
  },
  { 
    id: "ife-3", 
    stepType: "true_false", 
    statement: "Si vendo más productos de forma exitosa, mis costos variables normalmente también aumentarán.", 
    correctValue: true, 
    explanation: "Correcto. Al vender más, necesitas producir más, por lo que gastas más en materias primas o empaques.", 
    isAssessment: true, 
    fullScreen: true 
  },
  { 
    id: "ife-4", 
    stepType: "match", 
    question: "Relaciona cada concepto financiero con su ejemplo directo", 
    leftItems: [
      { id: "l1", label: "Costo fijo" }, 
      { id: "l2", label: "Costo variable" }, 
      { id: "l3", label: "Ingreso" }, 
      { id: "l4", label: "Flujo de efectivo" }
    ], 
    rightItems: [
      { id: "r1", label: "Pago de la renta del local" }, 
      { id: "r2", label: "Caja de empaque por producto" }, 
      { id: "r3", label: "Dinero que entra por ventas" },
      { id: "r4", label: "Entradas y salidas continuas de dinero" }
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
    id: "ife-5", 
    stepType: "info", 
    title: "El oxígeno de tu emprendimiento", 
    body: "Muchos emprendedores confunden 'Utilidad' con 'Efectivo disponible'. Puedes tener un negocio muy rentable en papel, pero si tus clientes no te pagan a tiempo, no tendrás dinero para pagar la nómina hoy.", 
    fullScreen: true,
    aiInsight: "Un asombroso 82% de las pequeñas empresas que fracasan, lo hacen debido a problemas de flujo de efectivo, no por falta de clientes."
  },
  { 
    id: "ife-6", 
    stepType: "mcq", 
    question: "¿Qué pasa si  vendes mucho, pero siempre cobras muy tarde y pagas muy rápido?", 
    options: [
      { id: "o1", label: "Siempre tendrás utilidades inmediatas", isCorrect: false }, 
      { id: "o2", label: "Solo importa vender para ganar", isCorrect: false },
      { id: "o3", label: "Puedes tener problemas de efectivo", isCorrect: true },
      { id: "o4", label: "Tu flujo mejora automáticamente", isCorrect: false }
    ], 
    isAssessment: true, 
    fullScreen: true 
  },
  { 
    id: "ife-7", 
    stepType: "match", 
    question: "Relaciona cada situación con el impacto más probable", 
    leftItems: [
      { id: "l1", label: "Suben ventas y materia prima" }, 
      { id: "l2", label: "Se paga una renta mensual" }, 
      { id: "l3", label: "Clientes tardan en pagar" }, 
      { id: "l4", label: "Se controlan gastos innecesarios" }
    ], 
    rightItems: [
      { id: "r1", label: "Aumentan los costos variables" }, 
      { id: "r2", label: "Representa un costo fijo constante" }, 
      { id: "r3", label: "Presiona el flujo de efectivo" },
      { id: "r4", label: "Mejora el margen del negocio" }
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
    id: "ife-8", 
    stepType: "order", 
    question: "Ordena correctamente las prioridades de un negocio al recibir sus primeros ingresos", 
    items: [
      { id: "p1", label: "Cubrir costos operativos esenciales", correctOrder: 1 }, 
      { id: "p2", label: "Pagar obligaciones y deudas cercanas", correctOrder: 2 }, 
      { id: "p3", label: "Separar una reserva de reinversión", correctOrder: 3 },
      { id: "p4", label: "Gastos no esenciales o retiros", correctOrder: 4 }
    ], 
    isAssessment: true, 
    fullScreen: true 
  },
  { 
    id: "ife-9", 
    stepType: "blitz_challenge", 
    question: "¿Cuál es la regla de oro para no mezclar dinero personal y del negocio?", 
    options: [
      { id: "o1", label: "Tomar de la caja sin registrarlo", isCorrect: false }, 
      { id: "o2", label: "Pagar gastos personales con saldo del negocio", isCorrect: false },
      { id: "o3", label: "Usar cuentas bancarias completamente separadas", isCorrect: true }
    ], 
    timeLimit: 10, 
    isAssessment: true, 
    fullScreen: true 
  },
  { 
    id: "ife-10", 
    stepType: "true_false", 
    statement: "Un negocio exitoso puede quebrar si no controla estratégicamente sus salidas de dinero, por más que venda.", 
    correctValue: true, 
    explanation: "Sin flujo positivo, hasta la empresa que más vende se hunde por quedarse sin liquidez inmediata.", 
    isAssessment: true, 
    fullScreen: true 
  },
  { 
    id: "ife-11", 
    stepType: "blitz_challenge", 
    question: "¿Qué decisión operativa te blinda ante la falta de flujo?", 
    options: [
      { id: "o1", label: "Dar descuentos extremos", isCorrect: false }, 
      { id: "o2", label: "Llevar un control semanal estricto", isCorrect: true },
      { id: "o3", label: "Acumular todo el inventario posible", isCorrect: false }
    ], 
    timeLimit: 12, 
    isAssessment: true, 
    fullScreen: true 
  },
  { 
    id: "ife-12", 
    stepType: "impulse_meter", 
    instructions: "Mantén pulsado para generar disciplina. Robarle a la caja de tu emprendimiento para compras emocionales debilita tu motor de crecimiento.", 
    item: { name: "Caja chica intocable", price: "Control Financiero", imageUrl: "/billy-breathing.png" }, 
    holdTime: 7, 
    fullScreen: true 
  },
  { 
    id: "ife-13", 
    stepType: "order", 
    question: "Ordena los pasos de la auditoría básica de salud financiera", 
    items: [
      { id: "p1", label: "Registrar ingresos y gastos totales", correctOrder: 1 }, 
      { id: "p2", label: "Aislar costos fijos y variables", correctOrder: 2 }, 
      { id: "p3", label: "Calcular capacidad de margen interno", correctOrder: 3 },
      { id: "p4", label: "Ajustar precios o gastos para sanear el negocio", correctOrder: 4 }
    ], 
    isAssessment: true, 
    fullScreen: true 
  },
  { 
    id: "ife-14", 
    stepType: "mcq", 
    question: "Caso Real: Mariana vende módicos $40,000 mensuales. Paga renta y nómina, pero habitualmente retira dinero para despensa personal sin avisar. ¿Dónde falla?", 
    options: [
      { id: "o1", label: "Pierde control real sobre si el negocio es rentable", isCorrect: true }, 
      { id: "o2", label: "Vende muy poco para pagar renta", isCorrect: false },
      { id: "o3", label: "Los gastos de la despensa son renta técnica", isCorrect: false },
      { id: "o4", label: "El flujo no le va a afectar si vende al final", isCorrect: false }
    ], 
    isAssessment: true, 
    fullScreen: true 
  },
  { 
    id: "ife-15", 
    stepType: "narrative_check", 
    question: "¿Cuál crees que es el error más común al emprender: vender poco, no controlar gastos o usar el negocio como cajero personal? ¿Por qué lo consideras el más letal?", 
    promptPlaceholder: "El error principal es...", 
    minChars: 30, 
    billyResponse: "Puntaje perfecto de ingeniero. Ser dueño a veces significa ser el último en cobrar, pero el que se lleva la recompensa a largo plazo.", 
    fullScreen: true 
  }
]
