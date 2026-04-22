import type { LessonStep } from "@/types/lessonTypes"

/**
 * Subtema 3: Presupuesto
 * 
 * Lessons expanded to 15 slides following the BIZEN Blueprint.
 * Focus: Practical, engineering-focused budgeting.
 */

// ==============================================================================
// LECCIÓN 1: ¿Qué es un presupuesto? - 15 SLIDES
// ==============================================================================
export const lessonQueEsUnPresupuestoSteps: LessonStep[] = [
  { id: "pre-1-1", stepType: "billy_talks", body: "Olvídate de la palabra 'restricción'. Un presupuesto es el plano arquitectónico de tu libertad financiera. Vamos a diseñarlo.", fullScreen: true,
    data: { glossary: [{ word: "Presupuesto", definition: "Plan proyectado de ingresos y gastos para un periodo determinado." }, { word: "Asignación Táctica", definition: "Decisión consciente de dónde colocar cada unidad de capital antes de gastarla." }] }
  },
  { id: "pre-1-2", stepType: "info", title: "El Mapa de Guerra", body: "Sin presupuesto, tu dinero decide por ti. Con presupuesto, tú le dices a cada billete exactamente a qué frente de batalla ir. Es control puro.", fullScreen: true,
    aiInsight: "Las personas que usan un presupuesto ahorran en promedio un 18% más que las que no lo hacen, ganando exactamente lo mismo."
  },
  { id: "pre-1-3", stepType: "impulse_meter", instructions: "Mantén pulsado y siente el control fluyendo hacia tu plan. Respira orden financiero.", item: { name: "Mapa de Control", price: "0.00", imageUrl: "/billy-breathing.png" }, holdTime: 5, fullScreen: true },
  { id: "pre-1-4", stepType: "mcq", question: "¿Cuál es la función real de un presupuesto?", options: [{id:"o1", label:"Castigarme para no gastar en nada", isCorrect:false}, {id:"o2", label:"Darme permiso de gastar sin culpa en lo planeado", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "pre-1-5", stepType: "swipe_sorter", question: "¿Es un Presupuesto o un Registro de Gastos?", leftBucket: {label:"Presupuesto (Futuro)", color:"#10b981"}, rightBucket: {label:"Registro (Pasado)", color:"#3b82f6"}, items: [{id:"i1", label:"Decidir cuánto gastar el próximo mes", correctBucket:"left"}, {id:"i2", label:"Anotar lo que gastaste ayer", correctBucket:"right"}, {id:"i3", label:"Planear mi ahorro de navidad hoy", correctBucket:"left"}, {id:"i4", label:"Ver el ticket del súper", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "pre-1-6", stepType: "info", title: "Proactivo vs Reactivo", body: "El registro de gastos es una autopsia (qué ya murió). El presupuesto es una partitura (qué va a sonar). Sé el director de tu orquesta, no el forense.", fullScreen: true },
  { id: "pre-1-7", stepType: "true_false", statement: "Hacer un presupuesto quita tiempo que podrías usar para ganar más dinero.", correctValue: false, explanation: "Un presupuesto de 15 minutos al mes te ahorra horas de ansiedad y miles de pesos en fugas.", isAssessment:true, fullScreen: true },
  { id: "pre-1-8", stepType: "order", question: "Los 3 Pilares del Presupuesto", items: [{id:"p1", label: "Proyectar Ingresos Reales", correctOrder: 1}, {id: "p2", label: "Asignar Categorías de Gasto", correctOrder: 2}, {id: "p3", label: "Monitorear y Ajustar", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "pre-1-9", stepType: "blitz_challenge", question: "¿Cuándo se hace un presupuesto?", options: [{id:"o1", label:"Antes de que empiece el mes", isCorrect:true}, {id:"o2", label:"Cuando ya no tengo dinero", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "pre-1-10", stepType: "blitz_challenge", question: "¿Qué hace un presupuesto con los imprevistos?", options: [{id:"o1", label:"Los prohíbe", isCorrect:false}, {id:"o2", label:"Los anticipa (Fondo)", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "pre-1-11", stepType: "match", question: "Relaciona el Enfoque", leftItems: [{id:"l1", label:"Presupuesto"}, {id:"l2", label:"Registro"}], rightItems: [{id:"r1", label:"Mirar al frente"}, {id:"r2", label:"Mirar atrás"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}], isAssessment: true, fullScreen: true },
  { id: "pre-1-12", stepType: "mindset_translator", question: "Refactoriza tu orden", beliefs: [{id: "b1", original: "Soy malo con los números.", healthyOptions: [{id: "h1", label: "Solo necesito sumar y restar para ser dueño de mi destino", isCorrect: true}, {id: "h2", label: "El azar es mi contador", isCorrect: false}]}] },
  { id: "pre-1-13", stepType: "narrative_check", question: "¿Qué es lo primero que harías con el dinero extra que un presupuesto te ayudaría a 'encontrar'?", promptPlaceholder: "Invertiría en ...", minChars: 15, billyResponse: "Esa es la visión. El presupuesto es el vehículo para llegar ahí.", fullScreen: true },
  { id: "pre-1-14", stepType: "info", title: "Alerta de Ingeniería", body: "No busques la perfección, busca la dirección. Un presupuesto al 80% de precisión es infinitamente mejor que no tener ninguno.", fullScreen: true,
    aiInsight: "La fatiga de decisión disminuye drásticamente cuando ya has decidido el destino de tu dinero con anterioridad."
  },
  { id: "pre-1-15", stepType: "summary", title: "Concepto Integrado", body: "Has visto qué es un presupuesto. Siguiente: Los Pasos para crearlo.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 2: ¿Cuáles son los pasos para crearlo? - 15 SLIDES
// ==============================================================================
export const lessonPasosPresupuestoSteps: LessonStep[] = [
  { id: "pre-2-1", stepType: "billy_talks", body: "Vamos a la mesa de dibujo. Construir un presupuesto sólido requiere un orden lógico. Sigue estos pasos y no fallarás.", fullScreen: true,
    data: { glossary: [{ word: "Presupuesto Base Cero", definition: "Método donde cada peso tiene un destino asignado (Ingresos - Gastos = 0)." }, { word: "Gasto Discrecional", definition: "Gasto no esencial que depende de tu elección (ocio, lujos)." }] }
  },
  { id: "pre-2-2", stepType: "info", title: "Paso 1: Sumar tus Entradas", body: "Suma todo lo que entra NETO (lo que realmente llega a tu cuenta). Si varías, usa el promedio de los últimos 3 meses como base conservadora.", fullScreen: true,
    aiInsight: "Un error común es presupuestar con el salario bruto, ignorando que el 20-30% se va antes de que lo veas."
  },
  { id: "pre-2-3", stepType: "impulse_meter", instructions: "Mantén pulsado y suma mentalmente tus ingresos. Visualiza tu capital disponible. Respira claridad.", item: { name: "Contador Neto", price: "0.00", imageUrl: "/billy-breathing.png" }, holdTime: 6, fullScreen: true },
  { id: "pre-2-4", stepType: "mcq", question: "Paso 2: ¿Qué es lo primero que debes separar tras recibir tu ingreso?", options: [{id:"o1", label:"Lo que voy a gastar en comida", isCorrect:false}, {id:"o2", label:"Tu ahorro/inversión (Págate a ti primero)", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "pre-2-5", stepType: "swipe_sorter", question: "¿Es un Gasto Fijo o Variable?", leftBucket: {label:"Fijo (Estructural)", color:"#3b82f6"}, rightBucket: {label:"Variable (Elección)", color:"#f59e0b"}, items: [{id:"i1", label:"Renta", correctBucket:"left"}, {id:"i2", label:"Cenas fuera", correctBucket:"right"}, {id:"i3", label:"Seguro médico", correctBucket:"left"}, {id:"i4", label:"Cine", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "pre-2-6", stepType: "info", title: "Paso 3: Listar Gastos Fijos", body: "Anota tus 'inamovibles': renta, internet, luz, servicios. Estos son los cimientos de tu vida operativa. No se negocian, se pagan.", fullScreen: true },
  { id: "pre-2-7", stepType: "true_false", statement: "El ocio y los deseos no deben estar en el presupuesto inicial.", correctValue: false, explanation: "Si no los incluyes, el presupuesto es irreal. Deben tener su propio cajón con un límite claro.", isAssessment:true, fullScreen: true },
  { id: "pre-2-8", stepType: "order", question: "Secuencia Maestra BIZEN", items: [{id:"p1", label: "Calcular Ingreso Neto", correctOrder: 1}, {id: "p2", label: "Separar Ahorro/Inversión", correctOrder: 2}, {id: "p3", label: "Cubrir Gastos Fijos", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "pre-2-9", stepType: "blitz_challenge", question: "¿Qué es el presupuesto base cero?", options: [{id:"o1", label:"Tener 0 pesos en la cuenta", isCorrect:false}, {id:"o2", label:"Asignar destino a cada peso", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "pre-2-10", stepType: "blitz_challenge", question: "¿Qué haces si los gastos superan al ingreso?", options: [{id:"o1", label:"Pagar con tarjeta", isCorrect:false}, {id:"o2", label:"Recortar variables", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "pre-2-11", stepType: "match", question: "Relaciona Paso", leftItems: [{id:"l1", label:"Paso 1"}, {id:"l2", label:"Paso 2"}, {id:"l3", label:"Paso 3"}], rightItems: [{id:"r1", label:"Ingresos"}, {id:"r2", label:"Ahorro"}, {id:"r3", label:"Fijos"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}, {leftId:"l3", rightId:"r3"}], isAssessment: true, fullScreen: true },
  { id: "pre-2-12", stepType: "mindset_translator", question: "Refactoriza tu plan", beliefs: [{id: "b1", original: "No me gusta planear.", healthyOptions: [{id: "h1", label: "Planear es el hack para tener más libertad después", isCorrect: true}, {id: "h2", label: "La improvisación es riqueza", isCorrect: false}]}] },
  { id: "pre-2-13", stepType: "narrative_check", question: "¿Cuál es el primer paso que darás al recibir tu próximo pago?", promptPlaceholder: "Voy a ...", minChars: 15, billyResponse: "Ese compromiso es el inicio de tu nueva era financiera.", fullScreen: true },
  { id: "pre-2-14", stepType: "info", title: "Alerta de Ingeniería", body: "Usa herramientas. Una app o una hoja de cálculo no es opcional, es tu panel de instrumentos. Un piloto no vuela sin radar.", fullScreen: true,
    aiInsight: "Registrar tus gastos inmediatamente (en el momento) aumenta la precisión del presupuesto en un 40%."
  },
  { id: "pre-2-15", stepType: "summary", title: "Pasos Dominados", body: "Has visto la arquitectura. Siguiente: Cómo Ajustar el Presupuesto.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 3: ¿Cómo se puede ajustar un presupuesto? - 15 SLIDES
// ==============================================================================
export const lessonAjustePresupuestoSteps: LessonStep[] = [
  { id: "pre-3-1", stepType: "billy_talks", body: "La vida no es una línea recta. Tu presupuesto tampoco debe serlo. Vamos a aprender a recalibrar cuando las cosas cambian.", fullScreen: true,
    data: { glossary: [{ word: "Ajuste Presupuestal", definition: "Modificación de las partidas de gasto para adaptarse a cambios en ingresos o imprevistos." }, { word: "Costo de Oportunidad de Ajuste", definition: "Lo que sacrificas (ej. una cena) para mantener el equilibrio del sistema." }] }
  },
  { id: "pre-3-2", stepType: "info", title: "Elasticidad Financiera", body: "Un presupuesto rígido se rompe; uno elástico sobrevive. Si un gasto fijo sube, una variable debe bajar. Es una balanza de ingeniería.", fullScreen: true,
    aiInsight: "El 70% de los presupuestos fallan porque no contemplan una reserva de 'ajuste' para variaciones de precios."
  },
  { id: "pre-3-3", stepType: "impulse_meter", instructions: "Mantén pulsado para 'ajustar' tu balanza. Visualiza el equilibrio regresando. Respira flexibilidad.", item: { name: "Balanza de Ajuste", price: "0.00", imageUrl: "/billy-breathing.png" }, holdTime: 6, fullScreen: true },
  { id: "pre-3-4", stepType: "mcq", question: "¿Qué debes hacer si surge un gasto imprevisto de salud?", options: [{id:"o1", label:"Ignorar el presupuesto este mes", isCorrect:false}, {id:"o2", label:"Usar el fondo de emergencia y ajustar el próximo mes", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "pre-3-5", stepType: "swipe_sorter", question: "¿Qué recortarías primero en una crisis?", leftBucket: {label:"Recortar YA", color:"#ef4444"}, rightBucket: {label:"Mantener", color:"#10b981"}, items: [{id:"i1", label:"Suscripciones de ocio", correctBucket:"left"}, {id:"i2", label:"Seguro de gastos médicos", correctBucket:"right"}, {id:"i3", label:"Comer fuera", correctBucket:"left"}, {id:"i4", label:"Ahorro para jubilación", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "pre-3-6", stepType: "info", title: "La Regla de la Guillotina", body: "Ante un déficit, la guillotina cae primero sobre lo variable. Si no es vital ni te genera dinero, se va. Sin miedo, es temporal para salvar el sistema.", fullScreen: true },
  { id: "pre-3-7", stepType: "true_false", statement: "Ajustar el presupuesto significa que has fracasado en tu planeación.", correctValue: false, explanation: "Ajustar es parte del proceso profesional. El mundo es dinámico y tu plan debe serlo también.", isAssessment:true, fullScreen: true },
  { id: "pre-3-8", stepType: "order", question: "Pasos para el Ajuste", items: [{id:"p1", label: "Identificar la desviación", correctOrder: 1}, {id: "p2", label: "Priorizar recortes en variables", correctOrder: 2}, {id: "p3", label: "Recalibrar meta del mes", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "pre-3-9", stepType: "blitz_challenge", question: "¿Cuál es el mejor amortiguador ante el ajuste?", options: [{id:"o1", label:"El Fondo de Emergencia", isCorrect:true}, {id:"o2", label:"Una tarjeta de crédito", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "pre-3-10", stepType: "blitz_challenge", question: "¿Cada cuánto se debe revisar el presupuesto?", options: [{id:"o1", label:"Cada semana (Idealmente)", isCorrect:true}, {id:"o2", label:"Una vez al año", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "pre-3-11", stepType: "match", question: "Relaciona la Acción", leftItems: [{id:"l1", label:"Ingreso sube"}, {id:"l2", label:"Gasto sube"}], rightItems: [{id:"r1", label:"Invertir más"}, {id:"r2", label:"Recortar variables"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}], isAssessment: true, fullScreen: true },
  { id: "pre-3-12", stepType: "mindset_translator", question: "Refactoriza tu error", beliefs: [{id: "b1", original: "Ya me pasé este mes, mejor tiro la toalla.", healthyOptions: [{id: "h1", label: "Hoy retomo el control y ajusto lo que queda del mes", isCorrect: true}, {id: "h2", label: "Gastaré más para olvidar", isCorrect: false}]}] },
  { id: "pre-3-13", stepType: "narrative_check", question: "¿Qué actividad 'lujosa' estarías dispuesto a sacrificar un mes para salvar tu presupuesto?", promptPlaceholder: "Sacrificaría ...", minChars: 15, billyResponse: "Esa disciplina es la que construye fortunas. Es solo un ajuste temporal.", fullScreen: true },
  { id: "pre-3-14", stepType: "info", title: "Alerta de Ingeniería", body: "Si ajustas constantemente hacia arriba (gastas más), tu sistema tiene una fuga. Si ajustas hacia abajo (ahorras más), tu sistema tiene momentum.", fullScreen: true,
    aiInsight: "Revisar tu presupuesto 5 minutos al día previene desviaciones antes de que se vuelvan inmanejables."
  },
  { id: "pre-3-15", stepType: "summary", title: "Ajuste Dominado", body: "Has dominado la capacidad de recalibrar. Siguiente: Métodos de presupuesto.", fullScreen: true },
]
