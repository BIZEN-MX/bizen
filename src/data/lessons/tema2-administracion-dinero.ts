import type { LessonStep } from "@/types/lessonTypes"

/**
 * Subtema 2: Administración del dinero
 * 
 * Lessons expanded to 15 slides following the BIZEN Blueprint.
 * Focus: Engineering of income and expenses. Analytical, professional tone.
 */

// ==============================================================================
// LECCIÓN 1: ¿Qué son los ingresos y los gastos? - 15 SLIDES
// ==============================================================================
export const lessonIngresosYGastosSteps: LessonStep[] = [
  { id: "adm-1-1", stepType: "billy_talks", body: "Bienvenidos a la ingeniería de tu flujo. Para un Ingeniero del Dinero, solo existen dos variables críticas: lo que entra (Ingreso) y lo que sale (Gasto). Vamos a gobernarlas.", fullScreen: true,
    data: { glossary: [{ word: "Ingreso", definition: "Flujo de capital que entra al sistema, ya sea por intercambio de tiempo (activo) o por activos (pasivo)." }, { word: "Gasto", definition: "Salida de capital del sistema para cubrir necesidades, obligaciones o deseos." }] }
  },
  { id: "adm-1-2", stepType: "info", title: "La Trampa del Ingreso Alto", body: "Ganar mucho no te hace rico; gastar menos de lo que ganas sí. La riqueza no es una cifra de ingresos, es el MARGEN entre tus ingresos y tus gastos.", fullScreen: true,
    aiInsight: "El 50% de las personas que ganan más de $100k USD al año viven al día debido a la inflación de su estilo de vida."
  },
  { id: "adm-1-3", stepType: "impulse_meter", instructions: "Mantén pulsado para medir tu margen actual. Siente la presión del gasto contra la entrada.", item: { name: "Medidor de Margen", price: "Flujo", imageUrl: "/billy-breathing.png" }, holdTime: 5, fullScreen: true },
  { id: "adm-1-4", stepType: "mcq", question: "Si ganas $50,000 pero gastas $55,000, ¿qué eres técnicamente?", options: [{id:"o1", label:"Un consumidor exitoso", isCorrect:false}, {id:"o2", label:"Un sistema en déficit (Rumbo a la quiebra)", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "adm-1-5", stepType: "swipe_sorter", question: "¿Es un Ingreso o un Gasto?", leftBucket: {label:"Ingreso (Entrada)", color:"#10b981"}, rightBucket: {label:"Gasto (Salida)", color:"#ef4444"}, items: [{id:"i1", label:"Tu sueldo quincenal", correctBucket:"left"}, {id:"i2", label:"Suscripción a Netflix", correctBucket:"right"}, {id:"i3", label:"Venta de un artículo usado", correctBucket:"left"}, {id:"i4", label:"Pago de la luz", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "adm-1-6", stepType: "info", title: "Tipos de Ingreso", body: "Ingreso Activo: Trabajas para el dinero (Sueldo). Ingreso Pasivo: El dinero trabaja para ti (Inversiones, rentas). El objetivo BIZEN es transitar del activo al pasivo.", fullScreen: true },
  { id: "adm-1-7", stepType: "true_false", statement: "Un gasto necesario (como comida) deja de ser un gasto si es vital.", correctValue: false, explanation: "Sigue siendo un gasto. Todo lo que sale del sistema es un gasto, sea vital o no. La clave es optimizarlo.", isAssessment:true, fullScreen: true },
  { id: "adm-1-8", stepType: "order", question: "Ciclo de Dominio Financiero", items: [{id:"p1", label: "Rastrear cada peso que entra y sale", correctOrder: 1}, {id: "p2", label: "Eliminar gastos innecesarios (Fricción)", correctOrder: 2}, {id: "p3", label: "Invertir el excedente en activos", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "adm-1-9", stepType: "blitz_challenge", question: "¿Qué sucede si igualas tus gastos a tus ingresos?", options: [{id:"o1", label:"Eres estable", isCorrect:false}, {id:"o2", label:"Estás estancado (Frágil)", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "adm-1-10", stepType: "blitz_challenge", question: "¿Cuál es el mejor momento para registrar un gasto?", options: [{id:"o1", label:"Al final del mes", isCorrect:false}, {id:"o2", label:"En el momento que sucede", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "adm-1-11", stepType: "match", question: "Relaciona el Concepto", leftItems: [{id:"l1", label:"Sueldo"}, {id:"l2", label:"Superficial"}, {id:"l3", label:"Vivienda"}], rightItems: [{id:"r1", label:"Ingreso Activo"}, {id:"r2", label:"Gasto Variable"}, {id:"r3", label:"Gasto Fijo"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}, {leftId:"l3", rightId:"r3"}], isAssessment: true, fullScreen: true },
  { id: "adm-1-12", stepType: "mindset_translator", question: "Refactoriza tu visión", beliefs: [{id: "b1", original: "Gasto porque me lo merezco por trabajar duro.", healthyOptions: [{id: "h1", label: "Merezco libertad financiera más que un objeto temporal", isCorrect: true}, {id: "h2", label: "El consumo es mi recompensa", isCorrect: false}]}] },
  { id: "adm-1-13", stepType: "narrative_check", question: "¿Cuál es el gasto que más te duele registrar cada mes?", promptPlaceholder: "Me duele pagar ...", minChars: 15, billyResponse: "Ese dolor es una señal. Audítalo: ¿es vital o es presión social?", fullScreen: true },
  { id: "adm-1-14", stepType: "info", title: "Alerta de Ingeniería", body: "No busques ganar más para gastar más. Busca que cada peso que entre sea un soldado que luche por tu libertad futura.", fullScreen: true,
    aiInsight: "Registrar tus gastos reduce el gasto impulsivo en un 20% de forma inmediata por el 'efecto observador'."
  },
  { id: "adm-1-15", stepType: "summary", title: "Variables Definidas", body: "Has dominado la diferencia entre entrada y salida. Siguiente: El Flujo de Dinero.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 2: ¿Cómo fluye el dinero? (Cashflow) - 15 SLIDES
// ==============================================================================
export const lessonFlujoDeDineroSteps: LessonStep[] = [
  { id: "adm-2-1", stepType: "billy_talks", body: "El dinero no es estático; es energía en movimiento. Vamos a entender cómo fluye a través de tus manos y cómo evitar que se escurra.", fullScreen: true,
    data: { glossary: [{ word: "Flujo de Caja (Cashflow)", definition: "Diferencia entre el dinero que entra y el que sale en un periodo determinado." }, { word: "Liquidez", definition: "Capacidad de disponer de efectivo inmediato para cubrir obligaciones." }] }
  },
  { id: "adm-2-2", stepType: "info", title: "El Ciclo del Efectivo", body: "Recibes -> Gastas -> Ahorras? ¡Error! La secuencia correcta es: Recibes -> Ahorras -> Gastas. El flujo debe ser diseñado, no dejado al azar.", fullScreen: true,
    aiInsight: "La falta de flujo (liquidez) es la causa número 1 de quiebra, incluso en personas con muchos activos."
  },
  { id: "adm-2-3", stepType: "impulse_meter", instructions: "Mantén pulsado y visualiza el flujo de dinero llenando tus tanques. Respira abundancia técnica.", item: { name: "Bomba de Flujo", price: "0.00", imageUrl: "/billy-breathing.png" }, holdTime: 6, fullScreen: true },
  { id: "adm-2-4", stepType: "mcq", question: "¿Qué sucede si tu flujo de caja es negativo varios meses seguidos?", options: [{id:"o1", label:"Es solo una racha", isCorrect:false}, {id:"o2", label:"Estás consumiendo tu futuro (Deuda)", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "adm-2-5", stepType: "swipe_sorter", question: "¿Es Flujo Positivo o Negativo?", leftBucket: {label:"Positivo (Salud)", color:"#10b981"}, rightBucket: {label:"Negativo (Riesgo)", color:"#ef4444"}, items: [{id:"i1", label:"Gasto < Ingreso", correctBucket:"left"}, {id:"i2", label:"Gasto > Ingreso", correctBucket:"right"}, {id:"i3", label:"Sobra dinero a fin de mes", correctBucket:"left"}, {id:"i4", label:"Vives de préstamos", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "adm-2-6", stepType: "info", title: "El Grifo y el Drenaje", body: "Tu ingreso es el grifo; tus gastos el drenaje. Si el drenaje es más ancho que el grifo, el tanque se vacía. No importa qué tan grande sea el grifo si no sellas el drenaje.", fullScreen: true },
  { id: "adm-2-7", stepType: "true_false", statement: "Tener mucho dinero en el banco significa que tienes un buen flujo de caja.", correctValue: false, explanation: "Puedes tener ahorros pero estar gastando más de lo que ganas hoy (flujo negativo). El flujo es DINÁMICO.", isAssessment:true, fullScreen: true },
  { id: "adm-2-8", stepType: "order", question: "Secuencia de Flujo Saludable", items: [{id:"p1", label: "Captura de Ingresos", correctOrder: 1}, {id: "p2", label: "Reserva de Capital (Ahorro)", correctOrder: 2}, {id: "p3", label: "Operación del Sistema (Gastos)", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "adm-2-9", stepType: "blitz_challenge", question: "¿Cómo se llama el dinero que te queda tras gastar?", options: [{id:"o1", label:"Flujo Neto", isCorrect:true}, {id:"o2", label:"Sueldo Bruto", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "adm-2-10", stepType: "blitz_challenge", question: "¿Qué es más importante para sobrevivir una crisis?", options: [{id:"o1", label:"La Liquidez (Efectivo)", isCorrect:true}, {id:"o2", label:"Tus posesiones", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "adm-2-11", stepType: "match", question: "Relaciona el Estado", leftItems: [{id:"l1", label:"Déficit"}, {id:"l2", label:"Superávit"}], rightItems: [{id:"r1", label:"Sales en rojo"}, {id:"r2", label:"Sobras en verde"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}], isAssessment: true, fullScreen: true },
  { id: "adm-2-12", stepType: "mindset_translator", question: "Refactoriza tu flujo", beliefs: [{id: "b1", original: "No sé a dónde se va mi dinero.", healthyOptions: [{id: "h1", label: "Yo le digo a mi dinero exactamente a dónde ir antes de que se mueva", isCorrect: true}, {id: "h2", label: "El destino es misterioso", isCorrect: false}]}] },
  { id: "adm-2-13", stepType: "narrative_check", question: "¿Qué pasaría si hoy dejas de recibir ingresos? ¿Por cuánto tiempo fluiría tu vida?", promptPlaceholder: "Sobreviviría ... meses", minChars: 15, billyResponse: "Ese número es tu 'tiempo de vida financiera'. Vamos a extenderlo.", fullScreen: true },
  { id: "adm-2-14", stepType: "info", title: "Alerta importante", body: "Un flujo de caja sano es la base de la inversión. No puedes construir un rascacielos (patrimonio) sobre un pantano (flujo negativo).", fullScreen: true,
    aiInsight: "Automatizar el flujo reduce la carga cognitiva y aumenta la probabilidad de ahorro en un 80%."
  },
  { id: "adm-2-15", stepType: "summary", title: "Flujo Entendido", body: "Has visto la coreografía del dinero. Siguiente: El Presupuesto.", fullScreen: true },
]
