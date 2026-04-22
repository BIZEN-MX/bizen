import type { LessonStep } from "@/types/lessonTypes"

/**
 * Subtema 4: Métodos de presupuesto
 * 
 * Lessons expanded to 15 slides following the BIZEN Blueprint.
 * Focus: 50/30/20 and 60/20/20 rules.
 */

// ==============================================================================
// LECCIÓN 1: ¿En qué consiste la Regla 50/30/20? - 15 SLIDES
// ==============================================================================
export const lessonRegla503020Steps: LessonStep[] = [
  { id: "met-1-1", stepType: "billy_talks", body: "Si no quieres complicarte con hojas de cálculo infinitas, necesitas un sistema de porcentajes. La regla 50/30/20 es el estándar de oro.", fullScreen: true,
    data: { glossary: [{ word: "Regla 50/30/20", definition: "Método de distribución de ingresos: 50% Necesidades, 30% Deseos, 20% Ahorro/Deuda." }, { word: "Ingreso Disponible", definition: "Dinero que queda libre después de pagar impuestos y seguridad social." }] }
  },
  { id: "met-1-2", stepType: "info", title: "El 50%: Necesidades", body: "La mitad de tu ingreso neto debe cubrir lo vital: renta, comida básica, transporte, seguros y servicios. Si esto supera el 50%, tu estilo de vida es demasiado pesado para tu sueldo.", fullScreen: true,
    aiInsight: "En ciudades con rentas altas, muchas personas terminan destinando el 70% a necesidades, lo que estrangula su capacidad de ahorro."
  },
  { id: "met-1-3", stepType: "impulse_meter", instructions: "Mantén pulsado y visualiza el 50% de tu pastel financiero. Siente la base sólida. Respira estabilidad.", item: { name: "Base del 50%", price: "0.00", imageUrl: "/billy-breathing.png" }, holdTime: 5, fullScreen: true },
  { id: "met-1-4", stepType: "mcq", question: "¿Qué categoría de gasto cae dentro del 50% de Necesidades?", options: [{id:"o1", label:"Membresía del gimnasio", isCorrect:false}, {id:"o2", label:"Pago de la renta o hipoteca", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "met-1-5", stepType: "swipe_sorter", question: "¿Es Necesidad (50%) o Deseo (30%)?", leftBucket: {label:"Necesidad", color:"#3b82f6"}, rightBucket: {label:"Deseo", color:"#ec4899"}, items: [{id:"i1", label:"Electricidad", correctBucket:"left"}, {id:"i2", label:"Cenar fuera", correctBucket:"right"}, {id:"i3", label:"Supermercado base", correctBucket:"left"}, {id:"i4", label:"Nuevo videojuego", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "met-1-6", stepType: "info", title: "El 30%: Deseos", body: "Aquí va el color de la vida: cine, hobbies, ropa que no necesitas pero quieres, café fuera. Es tu margen de disfrute. Limitarlo al 30% te permite vivir hoy sin hipotecar tu mañana.", fullScreen: true },
  { id: "met-1-7", stepType: "true_false", statement: "Si ahorro más del 20%, estoy rompiendo la regla 50/30/20.", correctValue: false, explanation: "¡Al contrario! Ahorrar más es excelente. El 20% es el MÍNIMO sugerido para prosperar.", isAssessment:true, fullScreen: true },
  { id: "met-1-8", stepType: "order", question: "Prioridad de Llenado", items: [{id:"p1", label: "Ahorro/Inversión (20%)", correctOrder: 1}, {id: "p2", label: "Necesidades (50%)", correctOrder: 2}, {id: "p3", label: "Deseos (30%)", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "met-1-9", stepType: "blitz_challenge", question: "¿Cuál es el porcentaje mínimo de ahorro en esta regla?", options: [{id:"o1", label:"20%", isCorrect:true}, {id:"o2", label:"10%", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "met-1-10", stepType: "blitz_challenge", question: "¿Qué haces si tus necesidades son mas del 50%?", options: [{id:"o1", label:"Pedir prestado", isCorrect:false}, {id:"o2", label:"Recortar deseos o buscar más ingresos", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "met-1-11", stepType: "match", question: "Relaciona Porcentaje", leftItems: [{id:"l1", label:"50%"}, {id:"l2", label:"30%"}, {id:"l3", label:"20%"}], rightItems: [{id:"r1", label:"Vital"}, {id:"r2", label:"Ocio"}, {id:"r3", label:"Futuro"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}, {leftId:"l3", rightId:"r3"}], isAssessment: true, fullScreen: true },
  { id: "met-1-12", stepType: "mindset_translator", question: "Refactoriza tu división", beliefs: [{id: "b1", original: "No me alcanza para ahorrar el 20%.", healthyOptions: [{id: "h1", label: "Empezaré con el 5% y escalaré hasta el 20% bajando mis deseos", isCorrect: true}, {id: "h2", label: "Mejor no ahorro nada", isCorrect: false}]}] },
  { id: "met-1-13", stepType: "narrative_check", question: "¿Qué categoría (50, 30 o 20) crees que es la más difícil de respetar en tu vida hoy?", promptPlaceholder: "Me cuesta respetar el ...", minChars: 15, billyResponse: "Identificarlo es el primer paso. Vamos a blindar ese porcentaje.", fullScreen: true },
  { id: "met-1-14", stepType: "info", title: "Alerta de Ingeniería", body: "Usa la regla como una guía, no como una camisa de fuerza. Si puedes invertir el 40%, hazlo. El objetivo es que tus necesidades nunca devoren tu capacidad de inversión.", fullScreen: true,
    aiInsight: "Seguir esta regla de forma constante por 20 años garantiza la independencia financiera para la mayoría de las clases medias."
  },
  { id: "met-1-15", stepType: "summary", title: "50/30/20 Dominado", body: "Has visto el sistema básico. Siguiente: La Regla 60/20/20 (Nivel Avanzado).", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 2: ¿En qué consiste la Regla 60/20/20? - 15 SLIDES
// ==============================================================================
export const lessonRegla602020Steps: LessonStep[] = [
  { id: "met-2-1", stepType: "billy_talks", body: "¿Quieres más velocidad? La regla 60/20/20 simplifica tu vida agrupando gastos y acelerando tu protección ante imprevistos.", fullScreen: true,
    data: { glossary: [{ word: "Regla 60/20/20", definition: "60% Gastos de Vida, 20% Ahorro de Emergencia/Anual, 20% Inversión/Deuda." }, { word: "Aprovisionamiento Anual", definition: "Separar dinero mensual para gastos que solo ocurren una vez al año." }] }
  },
  { id: "met-2-2", stepType: "info", title: "El 60%: Gastos de Vida", body: "En este modelo, el 60% cubre TODO lo que necesitas para vivir mes a mes, incluyendo tus gustos pequeños. Es un solo cajón de 'Operación Diaria'.", fullScreen: true,
    aiInsight: "Simplificar en un solo cajón reduce la fatiga mental de clasificar cada micro-gasto."
  },
  { id: "met-2-3", stepType: "impulse_meter", instructions: "Mantén pulsado y agrupa tus gastos en el 60%. Siente la simplicidad. Respira claridad operativa.", item: { name: "Cajón del 60%", price: "0.00", imageUrl: "/billy-breathing.png" }, holdTime: 6, fullScreen: true },
  { id: "met-2-4", stepType: "mcq", question: "¿Qué ventaja tiene agrupar necesidades y deseos en el 60%?", options: [{id:"o1", label:"Me permite gastar más", isCorrect:false}, {id:"o2", label:"Me facilita el monitoreo diario al tener un solo tope", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "met-2-5", stepType: "swipe_sorter", question: "¿Es Gasto de Vida (60%) o Reserva (40%)?", leftBucket: {label:"Vida (60%)", color:"#3b82f6"}, rightBucket: {label:"Reserva (40%)", color:"#10b981"}, items: [{id:"i1", label:"Renta y Comida", correctBucket:"left"}, {id:"i2", label:"Inversión en Bolsa", correctBucket:"right"}, {id:"i3", label:"Salidas el fin de semana", correctBucket:"left"}, {id:"i4", label:"Fondo para vacaciones", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "met-2-6", stepType: "info", title: "El primer 20%: Reservas y Anuales", body: "Este 20% es para los 'golpes' que ya sabes que vienen: seguros anuales, vacaciones, mantenimiento del coche. Se llama ahorro de previsión.", fullScreen: true },
  { id: "met-2-7", stepType: "true_false", statement: "El 60/20/20 es mejor para personas con ingresos estables y controlados.", correctValue: true, explanation: "Requiere disciplina para no dejar que el 60% se coma el resto de los cajones de reserva.", isAssessment:true, fullScreen: true },
  { id: "met-2-8", stepType: "order", question: "Distribución Directiva", items: [{id:"p1", label: "Vivir (60%)", correctOrder: 1}, {id: "p2", label: "Previsión Anual (20%)", correctOrder: 2}, {id: "p3", label: "Inversión Futura (20%)", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "met-2-9", stepType: "blitz_challenge", question: "¿A qué se destina el segundo 20%?", options: [{id:"o1", label:"Inversión de largo plazo", isCorrect:true}, {id:"o2", label:"Gasto del mes", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "met-2-10", stepType: "blitz_challenge", question: "¿Qué evita el ahorro de previsión?", options: [{id:"o1", label:"Endeudarse por imprevistos previstos", isCorrect:true}, {id:"o2", label:"Ganar más dinero", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "met-2-11", stepType: "match", question: "Relaciona el Propósito", leftItems: [{id:"l1", label:"Primer 20%"}, {id:"l2", label:"Segundo 20%"}], rightItems: [{id:"r1", label:"Amortiguador Anual"}, {id:"r2", label:"Motor de Riqueza"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}], isAssessment: true, fullScreen: true },
  { id: "met-2-12", stepType: "mindset_translator", question: "Refactoriza tu reserva", beliefs: [{id: "b1", original: "No puedo ahorrar el 40% de mi ingreso.", healthyOptions: [{id: "h1", label: "Optimizaré mi 60% para que mis reservas construyan mi libertad", isCorrect: true}, {id: "h2", label: "Es imposible, mejor gasto todo", isCorrect: false}]}] },
  { id: "met-2-13", stepType: "narrative_check", question: "¿Cuál es el gasto anual (seguro, viaje, etc) que siempre te toma por sorpresa?", promptPlaceholder: "Siempre me sorprende el gasto de ...", minChars: 15, billyResponse: "Con el 20% de previsión, ese gasto dejará de ser una emergencia y será un trámite planeado.", fullScreen: true },
  { id: "met-2-14", stepType: "info", title: "Alerta importante", body: "Este modelo es agresivo. Destinar un 40% a reservas e inversión te pone en el carril rápido. Requiere que tu 'estilo de vida' sea eficiente y no robe capital del futuro.", fullScreen: true,
    aiInsight: "La simplicidad de tener solo 3 grandes cubetas aumenta la adherencia al presupuesto en un 60% comparado con presupuestos de categorías infinitas."
  },
  { id: "met-2-15", stepType: "summary", title: "Sistemas Dominados", body: "Has visto las dos mejores herramientas de distribución. Siguiente: Herramientas de control.", fullScreen: true },
]
