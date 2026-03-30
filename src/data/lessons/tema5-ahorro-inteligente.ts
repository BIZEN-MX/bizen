import type { LessonStep } from "@/types/lessonTypes"

/**
 * Tema 5: Ahorro Inteligente (Ingeniería de Acumulación)
 * 
 * Lessons follow the BIZEN Lesson Blueprint:
 * - 15 slides exactly
 * - 2 Blitz Challenges
 * - variety of activity types
 * - no emojis (spatial blue style)
 */

// ==============================================================================
// LECCIÓN 1: Ahorro BIZEN: No es guardar, es acumular energía - 15 SLIDES
// ==============================================================================
export const lessonAhorroNoEsGuardarEsAcumularSteps: LessonStep[] = [
  { 
    id: "aho-1-1", 
    stepType: "billy_talks", 
    body: "Muchos ven el ahorro como una limitación. Un Ingeniero BIZEN lo ve como un **[[Diferencial de Presión|La diferencia entre lo que ingresas y lo que retienes para futuras operaciones]]**. \n\nHoy vamos a entender por qué el ahorro no es lo que sobra, sino lo que asignas por diseño.",
    data: { 
      glossary: [
        { word: "Ahorro Pasivo", definition: "Dinero que se guarda sin un propósito claro, perdiendo valor por inflación." },
        { word: "Reserva Estratégica", definition: "Capital acumulado con el fin específico de ser inyectado en activos (palancas)." }
      ] 
    },
    fullScreen: true 
  },
  { 
    id: "aho-1-2", 
    stepType: "info", 
    title: "Energía Almacenada", 
    body: "Ahorrar es, literalmente, guardar las horas de vida que ya trabajaste para que trabajen por ti en el futuro. Cada peso que no gastas hoy es un soldado de energía que reclutas para tu libertad.", 
    aiInsight: "El ahorro es el primer paso de la ingeniería financiera; sin acumulación inicial, no hay masa crítica para invertir.",
    fullScreen: true 
  },
  { 
    id: "aho-1-3", 
    stepType: "impulse_meter", 
    instructions: "Mantén pulsado para 'Comprimir' tu margen de ahorro contra la presión del consumo. Siente la acumulación.", 
    item: { name: "Tanque de Acumulación", price: "Presión", imageUrl: "/billy-breathing.png" }, 
    holdTime: 5, 
    fullScreen: true 
  },
  { 
    id: "aho-1-4", 
    stepType: "mcq", 
    question: "¿Qué es el ahorro en un sistema financiero eficiente?", 
    options: [
      { id: "o1", label: "Lo que sobra al final del mes", isCorrect: false }, 
      { id: "o2", label: "Un gasto prioritario asignado al inicio del mes", isCorrect: true, explanation: "Págate a ti primero. El ahorro es el 'sueldo' de tu Yo del Futuro." }
    ], 
    isAssessment: true, 
    fullScreen: true 
  },
  { 
    id: "aho-1-5", 
    stepType: "swipe_sorter", 
    question: "¿Es un Objetivo de Ahorro con Propósito o Ahorro Muerto?", 
    leftBucket: { label: "Con Propósito (Lógica)", color: "#10b981" }, 
    rightBucket: { label: "Ahorro Muerto (Error)", color: "#ef4444" }, 
    items: [
      { id: "s1", label: "Fondo de Emergencia (6 meses)", correctBucket: "left" }, 
      { id: "s2", label: "Dinero en efectivo bajo el colchón", correctBucket: "right" }, 
      { id: "s3", label: "Capital para mi primer negocio", correctBucket: "left" }, 
      { id: "s4", label: "Guardar sin saber para qué 'por si acaso'", correctBucket: "right" }
    ], 
    isAssessment: true, 
    fullScreen: true 
  },
  { 
    id: "aho-1-6", 
    stepType: "info", 
    title: "La Regla de la Fricción Cero", 
    body: "Si tienes que decidir ahorrar cada mes, vas a fallar. La voluntad es un recurso limitado. El secreto es la **automatización**: programa una transferencia directa el día que recibes tu ingreso.", 
    aiInsight: "Automatizar tu ahorro aumenta la probabilidad de éxito en un 70% comparado con el ahorro manual.",
    fullScreen: true 
  },
  { 
    id: "aho-1-7", 
    stepType: "true_false", 
    statement: "Guardar dinero en una cuenta de ahorros de un banco tradicional suele ser una mala estrategia a largo plazo.", 
    correctValue: true, 
    explanation: "La inflación suele ser mayor que el interés que te paga el banco. Estás perdiendo energía vital por inacción.", 
    isAssessment: true, 
    fullScreen: true 
  },
  { 
    id: "aho-1-8", 
    stepType: "order", 
    question: "Prioridad de asignación de Flujo", 
    items: [
      { id: "p1", label: "Ahorro Automático (Invariable)", correctOrder: 1 }, 
      { id: "p2", label: "Gastos Fijos Necesarios", correctOrder: 2 }, 
      { id: "p3", label: "Gastos Discrecionales (Ocio)", correctOrder: 3 }
    ], 
    isAssessment: true, 
    fullScreen: true 
  },
  { 
    id: "aho-1-9", 
    stepType: "blitz_challenge", 
    question: "¿Qué drena tu dinero ahorrado si no produce intereses?", 
    options: [
      { id: "o1", label: "La Inflación", isCorrect: true }, 
      { id: "o2", label: "El Impuesto", isCorrect: false }
    ], 
    timeLimit: 12, 
    isAssessment: true, 
    fullScreen: true 
  },
  { 
    id: "aho-1-10", 
    stepType: "blitz_challenge", 
    question: "¿Cuál es el porcentaje mínimo recomendado para empezar?", 
    options: [
      { id: "o1", label: "10%", isCorrect: true }, 
      { id: "o2", label: "50%", isCorrect: false }
    ], 
    timeLimit: 12, 
    isAssessment: true, 
    fullScreen: true 
  },
  { 
    id: "aho-1-11", 
    stepType: "match", 
    question: "Relaciona el Horizonte del Ahorro", 
    leftItems: [
      { id: "l1", label: "Fondo de Emergencia" }, 
      { id: "l2", label: "Inversión Patrimonial" }
    ], 
    rightItems: [
      { id: "r1", label: "Disponibilidad Inmediata" }, 
      { id: "r2", label: "Largo Plazo (Interés Compuesto)" }
    ], 
    correctPairs: [
      { leftId: "l1", rightId: "r1" }, 
      { leftId: "l2", rightId: "r2" }
    ], 
    isAssessment: true, 
    fullScreen: true 
  },
  { 
    id: "aho-1-12", 
    stepType: "mindset_translator", 
    question: "Refactoriza tu Concepto", 
    beliefs: [
      { 
        id: "b1", 
        original: "Ahorrar me limita el presente.", 
        healthyOptions: [
          { id: "h1", label: "Acumular energía hoy expande exponencialmente mis opciones del mañana", isCorrect: true }, 
          { id: "h2", label: "Solo se vive una vez (YOLO)", isCorrect: false }
        ] 
      }
    ], 
    fullScreen: true 
  },
  { 
    id: "aho-1-13", 
    stepType: "narrative_check", 
    question: "¿Cuál es tu mayor obstáculo mental hoy para separar dinero antes de gastarlo?", 
    promptPlaceholder: "Siento que no puedo porque ...", 
    minChars: 15, 
    billyResponse: "Identificar la barrera es el primer paso para derribarla. La ingeniería financiera no juzga, solo optimiza.", 
    fullScreen: true 
  },
  { 
    id: "aho-1-14", 
    stepType: "info", 
    title: "Alerta de Ingeniería", 
    body: "En un sistema hidráulico, si la presión de salida iguala a la de entrada, el sistema no acumula nada. En tus finanzas, si gastas el 100% de lo que ganas, tu sistema está en 'Muerte Térmica': no hay crecimiento posible.", 
    aiInsight: "Guardar el 10% de tus ingresos durante 10 años, incluso sin invertir, te compra 1 año entero de libertad absoluta.",
    fullScreen: true 
  },
  { 
    id: "aho-1-15", 
    stepType: "summary", 
    title: "Sistema de Acumulación Iniciado", 
    body: "Has hackeado el concepto de 'ahorro'. Ya no guardas dinero, estás acumulando poder. Siguiente: El Fondo de Emergencia de Acero.", 
    fullScreen: true 
  },
]

// ==============================================================================
// LECCIÓN 2: El Fondo de Emergencia de Acero - 15 SLIDES
// ==============================================================================
export const lessonFondoDeEmergenciaDeAceroSteps: LessonStep[] = [
  { 
    id: "aho-2-1", 
    stepType: "billy_talks", 
    body: "El fondo de emergencia no es un ahorro para gastar después. Es una **[[Barrera de Contención|Protección técnica ante fallos críticos del sistema (pérdida de empleo, salud, reparaciones urgentes)]]**. \n\nHoy vamos a blindar tu tranquilidad con un fondo de acero.",
    data: { 
      glossary: [
        { word: "Reserva de Supervivencia", definition: "El monto mínimo necesario para cubrir tus gastos fijos durante un periodo de tiempo sin ingresos." },
        { word: "Liquidez Inmediata", definition: "La capacidad de convertir un activo en dinero efectivo de forma instantánea y sin pérdida de valor." }
      ] 
    },
    fullScreen: true 
  },
  { 
    id: "aho-2-2", 
    stepType: "info", 
    title: "El Costo de la Ansiedad", 
    body: "Cuando no tienes un fondo, cada imprevisto es una crisis. Cuando tienes un fondo, un imprevisto es solo un **inconveniente financiero**. El fondo de acero no paga tus cuentas, paga tu capacidad de pensar con claridad bajo presión.", 
    aiInsight: "Tener un fondo de emergencia de al menos 3 meses reduce el nivel de cortisol (estrés) en un 40% promedio.",
    fullScreen: true 
  },
  { 
    id: "aho-2-3", 
    stepType: "impulse_meter", 
    instructions: "Mantén pulsado para 'Blindar' tu sistema. Siente cómo la ansiedad disminuye a medida que la reserva crece.", 
    item: { name: "Escudo de Acero", price: "Paz", imageUrl: "/billy-breathing.png" }, 
    holdTime: 6, 
    fullScreen: true 
  },
  { 
    id: "aho-2-4", 
    stepType: "mcq", 
    question: "¿En qué momento se debe activar el uso del fondo de emergencia?", 
    options: [
      { id: "o1", label: "Cuando hay una oferta imperdible en tecnología", isCorrect: false }, 
      { id: "o2", label: "Ante un evento urgente, no planeado y necesario", isCorrect: true, explanation: "Urgencia real: salud, desempleo o averías que detienen tu operatividad." }
    ], 
    isAssessment: true, 
    fullScreen: true 
  },
  { 
    id: "aho-2-5", 
    stepType: "swipe_sorter", 
    question: "¿Es una Emergencia de Acero o un Desvío de Capital?", 
    leftBucket: { label: "Emergencia (Usar)", color: "#10b981" }, 
    rightBucket: { label: "Desvío (Detener)", color: "#ef4444" }, 
    items: [
      { id: "s1", label: "Reparación del coche (Herramienta de trabajo)", correctBucket: "left" }, 
      { id: "s2", label: "Boda de un amigo cercano", correctBucket: "right" }, 
      { id: "s3", label: "Gasto médico no cubierto por seguro", correctBucket: "left" }, 
      { id: "s4", label: "Cambiar el smartphone por uno más nuevo", correctBucket: "right" }
    ], 
    isAssessment: true, 
    fullScreen: true 
  },
  { 
    id: "aho-2-6", 
    stepType: "info", 
    title: "La Regla de los 6 Meses", 
    body: "Un fondo estándar debe cubrir **6 meses** de tus gastos de supervivencia. Esto te da el poder de 'despedir a tu jefe' si es necesario o buscar una mejor oportunidad sin la presión del hambre.", 
    aiInsight: "El poder de negociación profesional aumenta drásticamente cuando tu supervivencia no depende del cheque de la próxima quincena.",
    fullScreen: true 
  },
  { 
    id: "aho-2-7", 
    stepType: "true_false", 
    statement: "El fondo de emergencia debe estar invertido en la bolsa de valores para que no pierda contra la inflación.", 
    correctValue: false, 
    explanation: "Error técnico grave. El fondo debe ser SEGURO y LÍQUIDO. La bolsa puede caer justo cuando más necesites el dinero.", 
    isAssessment: true, 
    fullScreen: true 
  },
  { 
    id: "aho-2-8", 
    stepType: "order", 
    question: "Fases de Construcción del Blindaje", 
    items: [
      { id: "p1", label: "Fondo Semilla ($10k - $20k inmediatos)", correctOrder: 1 }, 
      { id: "p2", label: "Fondo de Supervivencia (3 meses de gastos)", correctOrder: 2 }, 
      { id: "p3", label: "Fondo de Acero (6 a 12 meses de gastos)", correctOrder: 3 }
    ], 
    isAssessment: true, 
    fullScreen: true 
  },
  { 
    id: "aho-2-9", 
    stepType: "blitz_challenge", 
    question: "¿Cuál es la característica innegociable del fondo?", 
    options: [
      { id: "o1", label: "Alta Liquidez", isCorrect: true }, 
      { id: "o2", label: "Alto Rendimiento", isCorrect: false }
    ], 
    timeLimit: 12, 
    isAssessment: true, 
    fullScreen: true 
  },
  { 
    id: "aho-2-10", 
    stepType: "blitz_challenge", 
    question: "¿Dónde NO debe vivir tu fondo de emergencia?", 
    options: [
      { id: "o1", label: "En tu cuenta de uso diario", isCorrect: true }, 
      { id: "o2", label: "En una cuenta de renta fija separada", isCorrect: false }
    ], 
    timeLimit: 12, 
    isAssessment: true, 
    fullScreen: true 
  },
  { 
    id: "aho-2-11", 
    stepType: "match", 
    question: "Relaciona el Fondo con su Misión", 
    leftItems: [
      { id: "l1", label: "Fondo Semilla" }, 
      { id: "l2", label: "Fondo de Acero" }
    ], 
    rightItems: [
      { id: "r1", label: "Detener pequeñas fugas de crédito" }, 
      { id: "r2", label: "Comprar libertad de elección" }
    ], 
    correctPairs: [
      { leftId: "l1", rightId: "r1" }, 
      { leftId: "l2", rightId: "r2" }
    ], 
    isAssessment: true, 
    fullScreen: true 
  },
  { 
    id: "aho-2-12", 
    stepType: "mindset_translator", 
    question: "Refactoriza tu Seguridad", 
    beliefs: [
      { 
        id: "b1", 
        original: "Tener dinero parado es una pérdida de oportunidad.", 
        healthyOptions: [
          { id: "h1", label: "Mi fondo de emergencia es una prima de seguro que paga mi paz mental y audacia profesional", isCorrect: true }, 
          { id: "h2", label: "Debo arriesgar todo mi capital para ganar siempre", isCorrect: false }
        ] 
      }
    ], 
    fullScreen: true 
  },
  { 
    id: "aho-2-13", 
    stepType: "narrative_check", 
    question: "¿Cuál de tus gastos actuales (casa, comida, transporte) es el que más te dolería cubrir en una emergencia?", 
    promptPlaceholder: "Me preocuparía cubrir ...", 
    minChars: 15, 
    billyResponse: "Ese es el primer bloque de tu muralla. Vamos a asegurarlo.", 
    fullScreen: true 
  },
  { 
    id: "aho-2-14", 
    stepType: "info", 
    title: "Alerta de Operación", 
    body: "Si usas el fondo de emergencia para una urgencia real, tu prioridad número uno después debe ser **RELLENARLO**. Un sistema sin reserva es un sistema vulnerable.", 
    aiInsight: "El 60% de las quiebras personales ocurren por no tener un fondo de al menos $20,000 pesos para imprevistos básicos.",
    fullScreen: true 
  },
  { 
    id: "aho-2-15", 
    stepType: "summary", 
    title: "Blindaje de Acero Instalado", 
    body: "Ya no eres un náufrago financiero; ahora tienes un bote salvavidas de acero. Siguiente: Automatización (Fricción Cero).", 
    fullScreen: true 
  },
]

// ==============================================================================
// LECCIÓN 3: Sistemas de Automatización (Fricción Cero) - 15 SLIDES
// ==============================================================================
export const lessonSistemasDeAutomatizacionSteps: LessonStep[] = [
  { id: "aho-3-1", stepType: "billy_talks", body: "Tu mayor enemigo es tu 'Yo del Momento', que prefiere el placer de hoy al patrimonio de mañana. La solución: quitarle la tarjeta y automatizar el flujo.", fullScreen: true,
    data: { glossary: [{ word: "Fricción Financiera", definition: "Cualquier obstáculo psicológico o técnico que detiene una acción positiva (ej. tener que entrar a la app para ahorrar)." }, { word: "Arquitectura de Decisión", definition: "Diseñar el entorno para que la opción correcta sea la más fácil de realizar." }] }
  },
  { id: "aho-3-2", stepType: "info", title: "Diseño de Fricción Cero", body: "Si el dinero se separa el mismo milisegundo que llega a tu cuenta, nunca sientes que 'lo tuviste'. No duele gastar lo que nunca viste disponible.", fullScreen: true,
    aiInsight: "La automatización elimina la 'Fatiga de Decisión', permitiéndote usar tu fuerza de voluntad en cosas más productivas."
  },
  { id: "aho-3-3", stepType: "mcq", question: "¿Cuál es el momento óptimo para programar una transferencia de ahorro?", options: [{id:"o1", label:"El último día del mes", isCorrect:false}, {id:"o2", label:"El mismo día del depósito de nómina (Día 1)", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "aho-3-4", stepType: "swipe_sorter", question: "¿Acción de Fricción Cero o de Decisión Manual?", leftBucket: {label:"Automatizado (Eficiente)", color:"#10b981"}, rightBucket: {label:"Manual (Riesgo)", color:"#fbbf24"}, items: [{id:"i1", label:"Cargo domiciliado a inversión", correctBucket:"left"}, {id:"i2", label:"Esperar a que sobre para ahorrar", correctBucket:"right"}, {id:"i3", label:"Transferencia recurrente programada", correctBucket:"left"}, {id:"i4", label:"Anotar en Excel antes de pagar", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "aho-3-5", stepType: "info", title: "El Sistema 'Fijar y Olvidar'", body: "Usa las herramientas de tu banco o apps de inversión para crear un 'Drenaje Automático'. Tu meta es que tu cuenta corriente solo tenga lo necesario para sobrevivir el mes.", fullScreen: true },
  { id: "aho-3-6", stepType: "true_false", statement: "Confiar en mi disciplina es mejor que confiar en una automatización bancaria.", correctValue: false, explanation: "Incluso la persona más disciplinada tiene días malos, estrés o tentaciones. El software no tiene emociones.", isAssessment:true, fullScreen: true },
  { id: "aho-3-7", stepType: "order", question: "Pasos para la Automatización Total", items: [{id:"p1", label: "Calcular porcentaje de ahorro (Tasa BIZEN)", correctOrder: 1}, {id: "p2", label: "Programar transferencia automática recurrente", correctOrder: 2}, {id: "p3", label: "Revisar/Ajustar monto cada 3 meses", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "aho-3-8", stepType: "blitz_challenge", question: "¿Qué mata la automatización?", options: [{id:"o1", label:"La sobre-decisión mensual", isCorrect:true}, {id:"o2", label:"El software bancario", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "aho-3-9", stepType: "blitz_challenge", question: "¿Cómo se llama diseñar tu entorno financiero?", options: [{id:"o1", label:"Arquitectura de Decisión", isCorrect:true}, {id:"o2", label:"Decoración Bancaria", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "aho-3-10", stepType: "match", question: "Relaciona Estrategia", leftItems: [{id:"l1", label:"Domiciliación"}, {id:"l2", label:"Recordatorio manual"}], rightItems: [{id:"r1", label:"Fricción Cero"}, {id:"r2", label:"Fricción Máxima"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}], isAssessment: true, fullScreen: true },
  { id: "aho-3-11", stepType: "mindset_translator", question: "Refactoriza tu Control", beliefs: [{id: "b1", original: "Quiero tener todo el dinero disponible por si acaso.", healthyOptions: [{id: "h1", label: "Separo mi ahorro por diseño para evitar sabotear mi propio futuro", isCorrect: true}, {id: "h2", label: "Mi yo impulsivo es muy responsable", isCorrect: false}]}] },
  { id: "aho-3-12", stepType: "impulse_meter", instructions: "Mantén pulsado para 'Programar' tu flujo automático. Respira libertad operativa.", item: { name: "Botón Auto", price: "0.00", imageUrl: "/billy-breathing.png" }, holdTime: 5, fullScreen: true },
  { id: "aho-3-13", stepType: "narrative_check", question: "¿Qué porcentaje de tu ingreso vas a automatizar HOY mismo para el ahorro?", promptPlaceholder: "Automatizaré el ...%", minChars: 10, billyResponse: "Cualquier número mayor a 0 es una victoria del sistema.", fullScreen: true },
  { id: "aho-3-14", stepType: "info", title: "Alerta de Ingeniería", body: "No automatices el pago de deudas de alto interés con el mínimo. Automatiza el saldo TOTAL si es posible, o automatiza el flujo de ahorro hacia la deuda más cara.", fullScreen: true,
    aiInsight: "Las personas que automatizan su ahorro retienen un 300% más de capital que los que lo hacen manualmente."
  },
  { id: "aho-3-15", stepType: "summary", title: "Automatización Instalada", body: "Has quitado el factor humano del ahorro. Siguiente: Ahorro por Objetivos (Buckets).", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 4: Ahorro por Objetivos (Bucket System) - 15 SLIDES
// ==============================================================================
export const lessonAhorroPorObjetivosSteps: LessonStep[] = [
  { id: "aho-4-1", stepType: "billy_talks", body: "Tener todo tu ahorro en una sola 'bolsa' es un error táctico. Vamos a dividir tu capital en **Cubetas de Especialidad** (Buckets).", fullScreen: true,
    data: { glossary: [{ word: "Bucket (Cubeta)", definition: "Sub-cuenta o división lógica del ahorro destinada a un fin específico." }, { word: "Costo de Mezcla", definition: "La confusión psicológica de ver mucho dinero junto y creer que todo es para gastar." }] }
  },
  { id: "aho-4-2", stepType: "info", title: "La Psicología de las Cubetas", body: "Tu mente respeta más el dinero que tiene una etiqueta. 'Ahorro para Viaje' es más difícil de gastar en pizza que 'Dinero en Cuenta'.", fullScreen: true,
    aiInsight: "Etiquetar tus ahorros reduce el gasto impulsivo de esas reservas en un 50%."
  },
  { id: "aho-4-3", stepType: "mcq", question: "¿Cuál es el beneficio principal de separar el ahorro por objetivos?", options: [{id:"o1", label:"Ganar más intereses", isCorrect:false}, {id:"o2", label:"Evitar el canibalismo entre prioridades (gastar el fondo de salud en un iPhone)", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "aho-4-4", stepType: "swipe_sorter", question: "¿En qué Cubeta debe ir este Gasto?", leftBucket: {label:"Consumo (Corto)", color:"#fbbf24"}, rightBucket: {label:"Estructural (Largo)", color:"#3b82f6"}, items: [{id:"i1", label:"Mantenimiento anual coche", correctBucket:"right"}, {id:"i2", label:"Zapatos nuevos", correctBucket:"left"}, {id:"i3", label:"Anualidad de tarjeta", correctBucket:"right"}, {id:"i4", label:"Salida de viernes", correctBucket:"left"}], isAssessment: true, fullScreen: true },
  { id: "aho-4-5", stepType: "info", title: "Los 3 Buckets Esenciales", body: "1. **Emergencia** (Paz), 2. **Operativo** (Gastos anuales/seguros), 3. **Crecimiento** (Capital para palancas). Mezclarlos es riesgo.", fullScreen: true },
  { id: "aho-4-6", stepType: "true_false", statement: "Es mejor tener 10 cuentas de banco diferentes para cada objetivo de ahorro.", correctValue: false, explanation: "Agrega demasiada complejidad. Usa un banco que permita 'apartados' o divisiones lógicas dentro de la misma cuenta.", isAssessment:true, fullScreen: true },
  { id: "aho-4-7", stepType: "order", question: "Proceso de Llenado de Cubetas", items: [{id:"p1", label: "Llenar Cubeta de Emergencia (Primero)", correctOrder: 1}, {id: "p2", label: "Llenar Cubeta de Operación (Seguro/Tenencia)", correctOrder: 2}, {id: "p3", label: "Llenar Cubeta de Inversión (Escala)", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "aho-4-8", stepType: "blitz_challenge", question: "¿Cómo se llama gastar dinero de un bucket para otro?", options: [{id:"o1", label:"Canibalización de Ahorro", isCorrect:true}, {id:"o2", label:"Préstamo Interno Inteligente", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "aho-4-9", stepType: "blitz_challenge", question: "¿Qué bucket es el más sagrado?", options: [{id:"o1", label:"El de Emergencia", isCorrect:true}, {id:"o2", label:"El de Recreación", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "aho-4-10", stepType: "match", question: "Relaciona Objetivo con Bucket", leftItems: [{id:"l1", label:"Enganche de Casa"}, {id:"l2", label:"Seguro de Auto"}], rightItems: [{id:"r1", label:"Largo Plazo / Sueño"}, {id:"r2", label:"Gasto Planeado / Operativo"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}], isAssessment: true, fullScreen: true },
  { id: "aho-4-11", stepType: "mindset_translator", question: "Refactoriza tu Visión", beliefs: [{id: "b1", original: "Tengo mucho dinero en el banco.", healthyOptions: [{id: "h1", label: "Tengo dinero asignado a 5 misiones diferentes; no está disponible para gasto azaroso", isCorrect: true}, {id: "h2", label: "Soy rico y puedo gastar en lo que sea", isCorrect: false}]}] },
  { id: "aho-4-12", stepType: "impulse_meter", instructions: "Mantén pulsado y 'Etiqueta' tus apartados. Siente el orden del sistema.", item: { name: "Etiquetadora", price: "Orden", imageUrl: "/billy-breathing.png" }, holdTime: 5, fullScreen: true },
  { id: "aho-4-13", stepType: "narrative_check", question: "¿Cuál es el primer 'Bucket' u objetivo que vas a nombrar hoy?", promptPlaceholder: "Mi bucket se llamará ...", minChars: 10, billyResponse: "Nombrarlo le da existencia legal en tu sistema. Gran paso.", fullScreen: true },
  { id: "aho-4-14", stepType: "info", title: "Alerta de Ingeniería", body: "No abras buckets para todo. Limítate a un máximo de 5-7. Demasiados buckets generan parálisis y dificultan el rastreo.", fullScreen: true,
    aiInsight: "Un sistema de 3 buckets (Seguridad, Necesidad e Inversión) es estadísticamente el más sostenible a largo plazo."
  },
  { id: "aho-4-15", stepType: "summary", title: "Arquitectura de Buckets", body: "Has dividido para vencer. Siguiente: La Tasa de Ahorro.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 5: La Tasa de Ahorro: Tu indicador maestro - 15 SLIDES
// ==============================================================================
export const lessonLaTasaDeAhorroSteps: LessonStep[] = [
  { id: "aho-5-1", stepType: "billy_talks", body: "No importa cuánto ganes si tu **Tasa de Ahorro** es 0%. Ésta es la métrica reina que predice tu fecha de jubilación y libertad.", fullScreen: true,
    data: { glossary: [{ word: "Tasa de Ahorro", definition: "Porcentaje de tus ingresos netos que logras retener después de todos tus gastos." }, { word: "Masa Crítica", definition: "El punto donde tu ahorro acumulado genera suficientes intereses para cubrir tus gastos sin trabajar." }] }
  },
  { id: "aho-5-2", stepType: "info", title: "La Ecuación de la Libertad", body: "Si ahorras el 10%, trabajas 9 años para comprar 1 de libertad. Si ahorras el 50%, por cada año trabajado compras **1 año de libertad**. La matemática no miente.", fullScreen: true,
    aiInsight: "La tasa de ahorro es más importante que la rentabilidad de tus inversiones en los primeros 10 años."
  },
  { id: "aho-5-3", stepType: "mcq", question: "Si ganas $100k y gastas $100k, y tu vecino gana $20k y ahorra $5k, ¿quién es más 'rico' sistémicamente?", options: [{id:"o1", label:"Tú, por el flujo bruto", isCorrect:false}, {id:"o2", label:"Tu vecino, por su tasa de ahorro positiva", isCorrect:true, explanation: "La riqueza es lo que RETIENES, no lo que pasa por tus manos."}], isAssessment: true, fullScreen: true },
  { id: "aho-5-4", stepType: "swipe_sorter", question: "¿Acción que Sube o Baja tu Tasa de Ahorro?", leftBucket: {label:"Sube Tasa (+)", color:"#10b981"}, rightBucket: {label:"Baja Tasa (-)", color:"#ef4444"}, items: [{id:"i1", label:"Mudarse a un depa más barato", correctBucket:"left"}, {id:"i2", label:"Comprar coche a crédito", correctBucket:"right"}, {id:"i3", label:"Aumentar ingreso y mantener gasto", correctBucket:"left"}, {id:"i4", label:"Subir nivel de vida con cada aumento", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "aho-5-5", stepType: "info", title: "Estilo de Vida Inflado", body: "El mayor peligro para tu tasa de ahorro es la **Inflación del Estilo de Vida**. Ganar más y gastar proporcionalmente más te mantiene en la rueda de hámster para siempre.", fullScreen: true },
  { id: "aho-5-6", stepType: "true_false", statement: "Es posible jubilarse en menos de 10 años si ahorras más del 60% de tus ingresos.", correctValue: true, explanation: "La matemática dinámica muestra que una tasa de ahorro del 65% permite la libertad financiera en aproximadamente 8-10 años.", isAssessment:true, fullScreen: true },
  { id: "aho-5-7", stepType: "order", question: "Prioridad del Ingeniero", items: [{id:"p1", label: "Establecer meta de Tasa (ej. 20%)", correctOrder: 1}, {id: "p2", label: "Reducir gastos fijos estructurales", correctOrder: 2}, {id: "p3", label: "Escalar ingresos conservando gastos", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "aho-5-8", stepType: "blitz_challenge", question: "¿Qué mide la Tasa de Ahorro?", options: [{id:"o1", label:"Tu eficiencia de retención", isCorrect:true}, {id:"o2", label:"Tu capacidad de gasto", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "aho-5-9", stepType: "blitz_challenge", question: "¿Qué sucede si mi tasa es 0%?", options: [{id:"o1", label:"Fracaso sistémico a largo plazo", isCorrect:true}, {id:"o2", label:"Estoy en equilibrio perfecto", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "aho-5-10", stepType: "match", question: "Relaciona Tasa con Perfil", leftItems: [{id: "l1", label: "Tasa 10%"}, {id: "l2", label: "Tasa 40%"}], rightItems: [{id: "r1", label: "Sobreviviente promedio"}, {id: "r2", label: "Ingeniero BIZEN en camino"}], correctPairs: [{leftId: "l1", rightId: "r1"}, {leftId: "l2", rightId: "r2"}], isAssessment: true, fullScreen: true },
  { id: "aho-5-11", stepType: "mindset_translator", question: "Refactoriza tu Riqueza", beliefs: [{id: "b1", original: "Gano poco, por eso no puedo ahorrar.", healthyOptions: [{id: "h1", label: "Debo optimizar mi tasa incluso con $1 peso para entrenar el hábito de retención", isCorrect: true}, {id: "h2", label: "Esperaré a ser rico para empezar", isCorrect: false}]}] },
  { id: "aho-5-12", stepType: "impulse_meter", instructions: "Mantén pulsado y 'Eleva' tu tasa de ahorro. Siente la aceleración hacia tu meta.", item: { name: "Potenciador", price: "%", imageUrl: "/billy-breathing.png" }, holdTime: 6, fullScreen: true },
  { id: "aho-5-13", stepType: "narrative_check", question: "¿Cuál es tu Tasa de Ahorro aproximada HOY? (Ahorro / Ingreso Total)", promptPlaceholder: "Mi tasa es de ...%", minChars: 2, billyResponse: "Cualquiera que sea el número, nuestro objetivo es subirla 5 puntos este mes.", fullScreen: true },
  { id: "aho-5-14", stepType: "info", title: "Alerta de Ingeniería", body: "No sacrifiques tu salud o capital intelectual por una tasa de ahorro del 90%. El sistema debe ser SOSTENIBLE en el tiempo para ser exitoso.", fullScreen: true,
    aiInsight: "Las tasas de ahorro superiores al 20% son el umbral donde el interés compuesto empieza a ser notable en menos de 5 años."
  },
  { id: "aho-5-15", stepType: "summary", title: "Indicador Dominado", body: "Ahora mides lo que importa. Siguiente: El Reto de los 30 Días.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 6: El Reto de los 30 Días - 15 SLIDES
// ==============================================================================
export const lessonReto30DiasSteps: LessonStep[] = [
  { id: "aho-6-1", stepType: "billy_talks", body: "La teoría sin práctica es solo entretenimiento. Vamos a hackear tu comportamiento con un **Reto de 30 Días** de ahorro intensivo. ¿Aceptas la misión?", fullScreen: true,
    data: { glossary: [{ word: "Reto de 30 Días", definition: "Periodo de entrenamiento conductual para fijar el hábito de retención de capital mediante la repetición diaria." }, { word: "Dopamina Retrasada", definition: "El placer obtenido no del consumo inmediato, sino de ver el crecimiento de un activo." }] }
  },
  { id: "aho-6-2", stepType: "info", title: "La Regla de la Abstinencia", body: "Durante este reto, eliminaremos todos los gastos discrecionales 'tipo hormiga'. El objetivo es resetear tu paladar financiero y encontrar tu verdadero margen de maniobra.", fullScreen: true,
    aiInsight: "Un reto de 30 días es suficiente para reconectar las rutas neuronales de recompensa hacia el ahorro."
  },
  { id: "aho-6-3", stepType: "impulse_meter", instructions: "Mantén pulsado para 'Firmar' tu compromiso de 30 días. Respira voluntad técnica.", item: { name: "Contrato 30D", price: "Disciplina", imageUrl: "/billy-breathing.png" }, holdTime: 6, fullScreen: true },
  { id: "aho-6-4", stepType: "mcq", question: "¿Qué sucede si fallas un día en el reto?", options: [{id:"o1", label:"Debo rendirme", isCorrect:false}, {id:"o2", label:"Retomo inmediatamente al siguiente gasto (Resiliencia)", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "aho-6-5", stepType: "swipe_sorter", question: "¿Acción Permitida o Bloqueada durante el Reto?", leftBucket: {label:"Permitida (Base)", color:"#10b981"}, rightBucket: {label:"Bloqueada (Capricho)", color:"#ef4444"}, items: [{id:"i1", label:"Comida casera preparada", correctBucket:"left"}, {id:"i2", label:"Salida a cine/restaurante", correctBucket:"right"}, {id:"i3", label:"Pago de internet", correctBucket:"left"}, {id:"i4", label:"Compra de ropa 'en oferta'", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "aho-6-6", stepType: "info", title: "El Efecto Bola de Nieve", body: "Al final de la primera semana verás un excedente que nunca habías tenido. Ese sentimiento de PODER es más adictivo que cualquier compra.", fullScreen: true },
  { id: "aho-6-7", stepType: "true_false", statement: "El objetivo del reto es ahorrar dinero para gastarlo todo en un premio al terminar el mes.", correctValue: false, explanation: "El objetivo es demostrarte que PUEDES vivir con menos y que ese excedente es tu semilla de libertad, no un bono para gastar.", isAssessment:true, fullScreen: true },
  { id: "aho-6-8", stepType: "order", question: "Cronograma del Reto", items: [{id:"p1", label: "Días 1-7: Resistencia (Hambre de gasto)", correctOrder: 1}, {id: "p2", label: "Días 8-21: Adaptación (Nuevos hábitos)", correctOrder: 2}, {id: "p3", label: "Días 22-30: Maestría (Paz financiera)", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "aho-6-9", stepType: "blitz_challenge", question: "¿Cómo se llama el placer del ahorro?", options: [{id:"o1", label:"Gratificación Retrasada", isCorrect:true}, {id:"o2", label:"Tacañería Extrema", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "aho-6-10", stepType: "blitz_challenge", question: "¿Cuándo es más difícil el reto?", options: [{id:"o1", label:"La primera semana", isCorrect:true}, {id:"o2", label:"El último día", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "aho-6-11", stepType: "match", question: "Relaciona Semana con Objetivo", leftItems: [{id: "l1", label: "Semana 1"}, {id: "l2", label: "Semana 4"}], rightItems: [{id: "r1", label: "Sobrevivir al impulso"}, {id: "r2", label: "Validar el nuevo sistema"}], correctPairs: [{leftId: "l1", rightId: "r1"}, {leftId: "l2", rightId: "r2"}], isAssessment: true, fullScreen: true },
  { id: "aho-6-12", stepType: "mindset_translator", question: "Refactoriza tu Esfuerzo", beliefs: [{id: "b1", original: "No voy a poder aguantar un mes.", healthyOptions: [{id: "h1", label: "Solo tengo que vencer hoy; el sistema se encarga del resto", isCorrect: true}, {id: "h2", label: "Mi mente es débil", isCorrect: false}]}] },
  { id: "aho-6-13", stepType: "narrative_check", question: "¿Cuál es el gasto que más te va a costar dejar durante estos 30 días?", promptPlaceholder: "Me costará dejar el/la ...", minChars: 10, billyResponse: "Cuidado con ese punto de falla. Prepárate con una alternativa gratuita.", fullScreen: true },
  { id: "aho-6-14", stepType: "info", title: "Alerta de Ingeniería", body: "Usa el excedente del reto para llenar tu **Fondo Semilla**. No dejes que se quede ocioso; dale una misión inmediata.", fullScreen: true,
    aiInsight: "Las personas que completan un reto de 30 días tienen un 80% más de probabilidad de mantener una tasa de ahorro estable el resto del año."
  },
  { id: "aho-6-15", stepType: "summary", title: "Reto Aceptado", body: "Has declarado la guerra a la ineficiencia. Siguiente: Micro-ahorro (El poder de lo pequeño).", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 7: Micro-ahorro: El poder de lo pequeño - 15 SLIDES
// ==============================================================================
export const lessonMicroAhorroSteps: LessonStep[] = [
  { id: "aho-7-1", stepType: "billy_talks", body: "Muchos ignoran los centavos porque no ven el bosque. En BIZEN, cada peso es un **Nano-Soldado** que puede multiplicarse.", fullScreen: true,
    data: { glossary: [{ word: "Micro-ahorro", definition: "Técnica de retención de montos mínimos (centavos, redondeos) que sumados generan capital significativo." }, { word: "Efecto Goteo", definition: "Acumulación constante de flujo que termina llenando el tanque por repetición, no por volumen único." }] }
  },
  { id: "aho-7-2", stepType: "info", title: "La Táctica del Redondeo", body: "Si gastas $37, guarda $3. Si gastas $95, guarda $5. Estas micro-decisiones no duelen individualmente, pero al final del año son miles de pesos.", fullScreen: true,
    aiInsight: "El redondeo automático puede generar hasta $5,000 pesos de ahorro anual sin que el usuario lo note en su flujo diario."
  },
  { id: "aho-7-3", stepType: "mcq", question: "¿Por qué el micro-ahorro es tan efectivo?", options: [{id:"o1", label:"Porque el banco paga más intereses por montos pequeños", isCorrect:false}, {id:"o2", label:"Porque tiene 'Fricción de Dolor' casi nula", isCorrect:true, explanation: "Tu cerebro no registra la pérdida de montos pequeños, por lo que no genera resistencia."}], isAssessment: true, fullScreen: true },
  { id: "aho-7-4", stepType: "swipe_sorter", question: "¿Es una oportunidad de Micro-Ahorro?", leftBucket: {label:"Micro-Ahorro (+)", color:"#10b981"}, rightBucket: {label:"Gasto Hormiga (-)", color:"#ef4444"}, items: [{id:"i1", label:"Quedarte con el cambio de las tortillas", correctBucket:"left"}, {id:"i2", label:"Pagar $10 de propina por 'presión'", correctBucket:"right"}, {id:"i3", label:"Redondear tu cuenta bancaria cada noche", correctBucket:"left"}, {id:"i4", label:"Comprar un chicle de $2", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "aho-7-5", stepType: "info", title: "El Alcancía 2.0", body: "Usa apps que automaticen el redondeo. Es la versión digital de la alcancía de cerdito, pero con intereses y sin el riesgo de que alguien la rompa.", fullScreen: true },
  { id: "aho-7-6", stepType: "true_false", statement: "Ahorrar de 10 en 10 pesos no sirve para nada ante una inflación alta.", correctValue: false, explanation: "Sirve para entrenar la DISCIPLINA de retención. Además, 10 pesos invertidos hoy valen más que 0 pesos guardados por pereza.", isAssessment:true, fullScreen: true },
  { id: "aho-7-7", stepType: "order", question: "Efecto Multiplicador", items: [{id:"p1", label: "Ahorrar $20 diarios", correctOrder: 1}, {id: "p2", label: "$600 al mes", correctOrder: 2}, {id: "p3", label: "$7,200 al año (más intereses)", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "aho-7-8", stepType: "blitz_challenge", question: "¿Cómo se llama el ahorro de montos pequeños?", options: [{id:"o1", label:"Micro-ahorro", isCorrect:true}, {id:"o2", label:"Mini-presupuesto", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "aho-7-9", stepType: "blitz_challenge", question: "¿Cuál es la principal ventaja?", options: [{id:"o1", label:"Poco dolor psicológico", isCorrect:true}, {id:"o2", label:"Alta velocidad de crecimiento", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "aho-7-10", stepType: "match", question: "Relaciona Estrategia con Herramienta", leftItems: [{id: "l1", label: "Redondeo"}, {id: "l2", label: "Cambio Físico"}], rightItems: [{id: "r1", label: "App Bancaria (Algoritmo)"}, {id: "r2", label: "Frasco de Cristal (Analógico)"}], correctPairs: [{leftId: "l1", rightId: "r1"}, {leftId: "l2", rightId: "r2"}], isAssessment: true, fullScreen: true },
  { id: "aho-7-11", stepType: "mindset_translator", question: "Refactoriza el Valor", beliefs: [{id: "b1", original: "$5 pesos no me hacen ni más pobre ni más rico.", healthyOptions: [{id: "h1", label: "Cada peso es una unidad de energía que por ley de acumulación construye mi libertad", isCorrect: true}, {id: "h2", label: "Los centavos son basura", isCorrect: false}]}] },
  { id: "aho-7-12", stepType: "impulse_meter", instructions: "Mantén pulsado para 'Recoger' cada pequeño ahorro del día. Siente la suma.", item: { name: "Imán de Monedas", price: "Σ", imageUrl: "/billy-breathing.png" }, holdTime: 5, fullScreen: true },
  { id: "aho-7-13", stepType: "narrative_check", question: "¿Qué vas a hacer hoy con el cambio o las monedas que te sobren?", promptPlaceholder: "Voy a ...", minChars: 10, billyResponse: "Darle un destino a lo 'pequeño' te hace dueño de lo 'grande'.", fullScreen: true },
  { id: "aho-7-14", stepType: "info", title: "Alerta de Ingeniería", body: "No dejes el micro-ahorro en el frasco para siempre. Cada vez que llegues a $500, transfiérelo a tu **Fase de Inversión** para que deje de ser 'dinero muerto'.", fullScreen: true,
    aiInsight: "La disciplina del micro-ahorro es el mejor predictor de éxito en inversiones de alto riesgo."
  },
  { id: "aho-7-15", stepType: "summary", title: "Poder de lo Pequeño", body: "Has visto el bosque a través del árbol. Siguiente: Inflación (El enemigo invisible).", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 8: Inflación: El enemigo invisible - 15 SLIDES
// ==============================================================================
export const lessonInflacionSteps: LessonStep[] = [
  { id: "aho-8-1", stepType: "billy_talks", body: "Ahorrar no es suficiente si tu dinero está perdiendo valor cada segundo. La **Inflación** es el ladrón silencioso que se come tu energía vital acumulada.", fullScreen: true,
    data: { glossary: [{ word: "Inflación", definition: "Aumento generalizado de precios que reduce el poder adquisitivo del dinero con el tiempo." }, { word: "Rendimiento Real", definition: "La ganancia de tu ahorro menos la inflación (Ganancia Real = Tasa - Inflación)." }] }
  },
  { id: "aho-8-2", stepType: "info", title: "El Impuesto a la Inacción", body: "Si la inflación es del 5% y tu dinero rinde 0% (debajo del colchón), el próximo año tendrás un 5% MENOS de vida comprable. Guardar dinero quieto es una pérdida garantizada.", fullScreen: true,
    aiInsight: "En 10 años, una inflación del 5% anual reduce el valor de tu ahorro a casi la mitad."
  },
  { id: "aho-8-3", stepType: "mcq", question: "Si los precios suben un 10% y tu sueldo sube un 5%, ¿qué sucedió realmente?", options: [{id:"o1", label:"Ganaste un 5% más", isCorrect:false}, {id:"o2", label:"Eres un 5% más pobre en términos reales", isCorrect:true, explanation: "Tu capacidad de compra disminuyó porque el costo de vida subió más que tu ingreso."}], isAssessment: true, fullScreen: true },
  { id: "aho-8-4", stepType: "swipe_sorter", question: "¿Protege contra la Inflación o es Vulnerable?", leftBucket: {label:"Protección (Escudo)", color:"#10b981"}, rightBucket: {label:"Vulnerable (Fuga)", color:"#ef4444"}, items: [{id:"i1", label:"Cetes o bonos gubernamentales", correctBucket:"left"}, {id:"i2", label:"Dinero en efectivo en cartera", correctBucket:"right"}, {id:"i3", label:"Bienes raíces / Propiedades", correctBucket:"left"}, {id:"i4", label:"Cuenta de débito normal", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "aho-8-5", stepType: "info", title: "Ahorro vs Acumulación de Valor", body: "No ahorres 'pesos', acumula 'valor'. Busca instrumentos que al menos igualen la inflación para que tu esfuerzo del pasado no se evapore.", fullScreen: true },
  { id: "aho-8-6", stepType: "true_false", statement: "La inflación solo afecta a las personas que compran cosas de lujo.", correctValue: false, explanation: "Afecta a todos, especialmente en productos básicos. Es un dreno universal de energía financiera.", isAssessment:true, fullScreen: true },
  { id: "aho-8-7", stepType: "order", question: "Mecánica de la Erosión", items: [{id:"p1", label: "Gobierno emite más dinero / Sube demanda", correctOrder: 1}, {id: "p2", label: "Suben los precios de los productos", correctOrder: 2}, {id: "p3", label: "Tu billete de $100 compra menos que ayer", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "aho-8-8", stepType: "blitz_challenge", question: "¿Cómo se llama la pérdida de poder de compra?", options: [{id:"o1", label:"Inflación", isCorrect:true}, {id:"o2", label:"Devaluación", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "aho-8-9", stepType: "blitz_challenge", question: "¿Qué debe superar tu ahorro?", options: [{id:"o1", label:"La Tasa de Inflación", isCorrect:true}, {id:"o2", label:"Tus gastos fijos", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "aho-8-10", stepType: "match", question: "Relaciona Concepto", leftItems: [{id: "l1", label: "Tasa Nominal"}, {id: "l2", label: "Tasa Real"}], rightItems: [{id: "r1", label: "Lo que el banco dice que paga"}, {id: "r2", label: "Tasa Nominal - Inflación"}], correctPairs: [{leftId: "l1", rightId: "r1"}, {leftId: "l2", rightId: "r2"}], isAssessment: true, fullScreen: true },
  { id: "aho-8-11", stepType: "mindset_translator", question: "Refactoriza tu Seguridad", beliefs: [{id: "b1", original: "Tener el dinero en el banco es lo más seguro.", healthyOptions: [{id: "h1", label: "Tener el dinero quieto es una pérdida lenta; debo buscar instrumentos de protección", isCorrect: true}, {id: "h2", label: "El banco cuida mi poder de compra", isCorrect: false}]}] },
  { id: "aho-8-12", stepType: "impulse_meter", instructions: "Mantén pulsado para 'Congelar' el valor de tu dinero frente a la inflación caliente. Respira protección.", item: { name: "Escudo Térmico", price: "$$$", imageUrl: "/billy-breathing.png" }, holdTime: 6, fullScreen: true },
  { id: "aho-8-13", stepType: "narrative_check", question: "¿Qué producto has notado que ha subido más de precio en el último mes?", promptPlaceholder: "He notado que ...", minChars: 10, billyResponse: "Esa es la inflación golpeando tu realidad. Vamos a defendernos.", fullScreen: true },
  { id: "aho-8-14", stepType: "info", title: "Alerta de Ingeniería", body: "No arriesgues tu fondo de emergencia buscando ganarle a la inflación por mucho. Para ese fondo, buscamos EMPATAR con la inflación. El crecimiento real viene después, en la inversión.", fullScreen: true,
    aiInsight: "Ignorar la inflación es el error número 1 de quienes ahorran a largo plazo sin un plan de inversión."
  },
  { id: "aho-8-15", stepType: "summary", title: "Enemigo Identificado", body: "Ahora sabes quién roba tu energía. Siguiente: Ahorro Hedónico (No te prives, optimiza).", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 9: Ahorro Hedónico: No te prives, optimiza - 15 SLIDES
// ==============================================================================
export const lessonAhorroHedonicoSteps: LessonStep[] = [
  { id: "aho-9-1", stepType: "billy_talks", body: "Ahorrar no significa vivir como un ermitaño. Se trata de **Optimizar el Placer** (Hedonismo Inteligente). Obtén el mismo disfrute por una fracción del costo.", fullScreen: true,
    data: { glossary: [{ word: "Ahorro Hedónico", definition: "Estrategia de buscar alternativas de menor costo que brinden el mismo nivel de satisfacción o utilidad." }, { word: "Adaptación Hedónica", definition: "Tendencia humana de volver a un nivel estable de felicidad a pesar de cambios en el nivel de vida." }] }
  },
  { id: "aho-9-2", stepType: "info", title: "La Táctica del 80/20 del Placer", body: "El 80% de tu satisfacción viene del 20% de lo que gastas. Identifica qué te hace realmente feliz y recorta lo que haces solo por inercia o presión social.", fullScreen: true,
    aiInsight: "Cambiar marcas de lujo por marcas blancas de alta calidad puede liberar hasta un 15% de tus ingresos sin afectar tu bienestar percibido."
  },
  { id: "aho-9-3", stepType: "mcq", question: "Si te gusta el café social, ¿cuál es la acción de ahorro hedónico?", options: [{id:"o1", label:"Dejar de tomar café para siempre", isCorrect:false}, {id:"o2", label:"Buscar un lugar local excelente pero más barato que la cadena internacional", isCorrect:true, explanation: "Mantienes el placer social y la cafeína, pero optimizas el costo operativo."}], isAssessment: true, fullScreen: true },
  { id: "aho-9-4", stepType: "swipe_sorter", question: "¿Acción de Optimización Hedónica?", leftBucket: {label:"Optimiza (SÍ)", color:"#10b981"}, rightBucket: {label:"Privación (NO)", color:"#ef4444"}, items: [{id:"i1", label:"Cena en casa con amigos (vs restaurante)", correctBucket:"left"}, {id:"i2", label:"Caminar en el parque (vs pagar gym que no uso)", correctBucket:"left"}, {id:"i3", label:"Dejar de comer para ahorrar $50", correctBucket:"right"}, {id:"i4", label:"No usar aire acondicionado a 40 grados", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "aho-9-5", stepType: "info", title: "Sustitución Estratégica", body: "No busques lo 'barato', busca el **Mejor Valor por Peso**. A veces gastar más en algo duradero es una forma de ahorro hedónico a largo plazo.", fullScreen: true },
  { id: "aho-9-6", stepType: "true_false", statement: "El cerebro se acostumbra rápido a los lujos, necesitando cada vez más dinero para sentir el mismo placer.", correctValue: true, explanation: "Se llama Adaptación Hedónica. Por eso los aumentos de sueldo se 'evaporan' rápido en nuevos gastos.", isAssessment:true, fullScreen: true },
  { id: "aho-9-7", stepType: "order", question: "Filtro de Gasto Inteligente", items: [{id:"p1", label: "¿Esto me da felicidad genuina o es estatus?", correctOrder: 1}, {id: "p2", label: "¿Hay una alternativa de menor costo con mismo placer?", correctOrder: 2}, {id: "p3", label: "Ejecutar la optimización", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "aho-9-8", stepType: "blitz_challenge", question: "¿Cómo se llama acostumbrarse al lujo?", options: [{id:"o1", label:"Adaptación Hedónica", isCorrect:true}, {id:"o2", label:"Inflación de Ego", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "aho-9-9", stepType: "blitz_challenge", question: "¿Qué busca el ahorro hedónico?", options: [{id:"o1", label:"Paz mental y placer óptimo", isCorrect:true}, {id:"o2", label:"Sufrimiento para ser rico", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "aho-9-10", stepType: "match", question: "Relaciona Gasto con Optimización", leftItems: [{id: "l1", label: "Gimnasio de lujo"}, {id: "l2", label: "Marca de ropa premium"}], rightItems: [{id: "r1", label: "Entrenamiento funcional en parque"}, {id: "r2", label: "Marca blanca de misma tela"}], correctPairs: [{leftId: "l1", rightId: "r1"}, {leftId: "l2", rightId: "r2"}], isAssessment: true, fullScreen: true },
  { id: "aho-9-11", stepType: "mindset_translator", question: "Refactoriza tu Disfrute", beliefs: [{id: "b1", original: "Si no gasto mucho, la gente pensará que soy pobre.", healthyOptions: [{id: "h1", label: "Mi estatus real es mi saldo bancario, no lo que traigo puesto", isCorrect: true}, {id: "h2", label: "Debo impresionar a todos", isCorrect: false}]}] },
  { id: "aho-9-12", stepType: "impulse_meter", instructions: "Mantén pulsado para 'Filtrar' el placer genuino del gasto innecesario. Respira claridad.", item: { name: "Filtro Joy", price: "0.00", imageUrl: "/billy-breathing.png" }, holdTime: 5, fullScreen: true },
  { id: "aho-9-13", stepType: "narrative_check", question: "¿Cuál es ese gasto 'de estatus' que hoy podrías optimizar sin perder felicidad?", promptPlaceholder: "Podría optimizar mi ...", minChars: 10, billyResponse: "Córpalo sin miedo. Tu libertad te dará más felicidad que ese objeto.", fullScreen: true },
  { id: "aho-9-14", stepType: "info", title: "Alerta de Ingeniería", body: "Reinvierte el ahorro de tus optimizaciones en experiencias que generen recuerdos (capital social/emocional) o en inversión. No lo dejes en la cuenta corriente.", fullScreen: true,
    aiInsight: "Invertir en experiencias genera un bienestar un 40% más duradero que invertir en objetos físicos."
  },
  { id: "aho-9-15", stepType: "summary", title: "Hedonismo Optimizado", body: "Disfrutas más con menos. Siguiente: Auditoría de Suscripciones Maestras.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 10: Auditoría de Suscripciones Maestras - 15 SLIDES
// ==============================================================================
export const lessonAuditoriaSuscripcionesSteps: LessonStep[] = [
  { id: "aho-10-1", stepType: "billy_talks", body: "Las suscripciones son el 'Aparato de Succión' de la economía moderna. Pequeñas cantidades que parecen nada, pero que juntas son una **Fuga Crítica**.", fullScreen: true,
    data: { glossary: [{ word: "Vampiro Financiero", definition: "Cobro recurrente poco perceptible que extrae capital sin que el usuario use el servicio." }, { word: "Pila de Suscripciones", definition: "Suma total de servicios mensuales: streaming, apps, gym, seguros, etc." }] }
  },
  { id: "aho-10-2", stepType: "info", title: "El Efecto $9.99", body: "Las empresas aman los $9.99 porque están debajo del radar de tu cerebro. 10 de estas suscripciones son $1,200 pesos al año... por cada una. Sumadas son una hipoteca.", fullScreen: true,
    aiInsight: "El 50% de las personas pagan por al menos una suscripción que NO han usado en los últimos 3 meses."
  },
  { id: "aho-10-3", stepType: "mcq", question: "¿Cuál es la mejor forma de auditar tus suscripciones?", options: [{id:"o1", label:"Revisar mi estado de cuenta una vez al año", isCorrect:false}, {id:"o2", label:"Exportar movimientos de 3 meses y marcar todos los cargos recurrentes", isCorrect:true, explanation: "Los estados de cuenta trimestrales revelan patrones que un mes no muestra."}], isAssessment: true, fullScreen: true },
  { id: "aho-10-4", stepType: "swipe_sorter", question: "¿Se queda o se va?", leftBucket: {label:"Se Queda (Valor)", color:"#10b981"}, rightBucket: {label:"Se Va (Fuga)", color:"#ef4444"}, items: [{id:"i1", label:"App de estudio/trabajo diario", correctBucket:"left"}, {id:"i2", label:"Cuarto servicio de streaming", correctBucket:"right"}, {id:"i3", label:"Membresía club que no visito", correctBucket:"right"}, {id:"i4", label:"Seguro de vida necesario", correctBucket:"left"}], isAssessment: true, fullScreen: true },
  { id: "aho-10-5", stepType: "info", title: "Táctica: Cancela y Espera", body: "Si dudas de una suscripción, cancélala hoy. Si en 30 días no la has extrañado, felicidades, has ganado flujo perpetuo sin esfuerzo.", fullScreen: true },
  { id: "aho-10-6", stepType: "true_false", statement: "Las pruebas gratis (Free Trials) son regalos de las empresas por mi lealtad.", correctValue: false, explanation: "Son trampas de inercia. Apuestan a que olvidarás cancelar antes del primer cobro.", isAssessment:true, fullScreen: true },
  { id: "aho-10-7", stepType: "order", question: "Protocolo de Limpieza", items: [{id:"p1", label: "Listar todas las suscripciones", correctOrder: 1}, {id: "p2", label: "Cancelar las de nulo uso inmediato", correctOrder: 2}, {id: "p3", label: "Consolidar planes (ej. Familiar vs Individual)", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "aho-10-8", stepType: "blitz_challenge", question: "¿Cómo se llama el cobro que no ves?", options: [{id:"o1", label:"Vampiro Financiero", isCorrect:true}, {id:"o2", label:"Donación Corporativa", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "aho-10-9", stepType: "blitz_challenge", question: "¿Qué porcentaje de capital se pierde aquí?", options: [{id:"o1", label:"Hasta 15% del ingreso neto", isCorrect:true}, {id:"o2", label:"Menos del 1%", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "aho-10-10", stepType: "match", question: "Relaciona Servicio con Optimización", leftItems: [{id: "l1", label: "Multiples Streaming"}, {id: "l2", label: "Membresía física"}], rightItems: [{id: "r1", label: "Rotación mensual de apps"}, {id: "r2", label: "Pago por evento o día"}], correctPairs: [{leftId: "l1", rightId: "r1"}, {leftId: "l2", rightId: "r2"}], isAssessment: true, fullScreen: true },
  { id: "aho-10-11", stepType: "mindset_translator", question: "Refactoriza tu Pertenencia", beliefs: [{id: "b1", original: "Solo son 200 pesos, no vale la pena el trámite.", healthyOptions: [{id: "h1", label: "$200 al mes son $24,000 acumulables en 10 años (sin intereses); mi tiempo vale ese trámite", isCorrect: true}, {id: "h2", label: "Soy muy generoso con las multinacionales", isCorrect: false}]}] },
  { id: "aho-10-12", stepType: "impulse_meter", instructions: "Mantén pulsado y 'Corta' el cable del vampiro financiero. Respira flujo libre.", item: { name: "Cortafuegos", price: "0.00", imageUrl: "/billy-breathing.png" }, holdTime: 6, fullScreen: true },
  { id: "aho-10-13", stepType: "narrative_check", question: "¿Cuál es esa suscripción o membresía que sabes que no usas y vas a cancelar MAÑANA?", promptPlaceholder: "Voy a cancelar ...", minChars: 10, billyResponse: "Hazlo. Ese dinero ahora te pertenece a ti, no a ellos.", fullScreen: true },
  { id: "aho-10-14", stepType: "info", title: "Alerta de Ingeniería", body: "Usa tarjetas virtuales temporales para pruebas gratis. Si olvidas cancelar, el cargo rebotará y tu sistema estará protegido.", fullScreen: true,
    aiInsight: "La auditoría recurrente (cada 6 meses) de suscripciones ahorra un promedio de $4,500 anuales."
  },
  { id: "aho-10-15", stepType: "summary", title: "Vampiros Eliminados", body: "Tu sistema está limpio. Siguiente: Ahorro vs Inversión.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 11: Ahorro vs Inversión: El salto cuántico - 15 SLIDES
// ==============================================================================
export const lessonAhorroVsInversionSteps: LessonStep[] = [
  { id: "aho-11-1", stepType: "billy_talks", body: "Has dominado el ahorro (Retención). Ahora, vamos a preparar el **Salto Cuántico** hacia la Inversión (Multiplicación). No son lo mismo.", fullScreen: true,
    data: { glossary: [{ word: "Ahorro", definition: "Preservación del capital con enfoque en seguridad y liquidez." }, { word: "Inversión", definition: "Exposición del capital al riesgo con el fin de obtener un rendimiento superior (crecimiento)." }] }
  },
  { id: "aho-11-2", stepType: "info", title: "Defensa vs Ataque", body: "El ahorro es tu defensa (Escudo). La inversión es tu ataque (Espada). Un equipo solo de defensa nunca gana el partido; un equipo solo de ataque muere al primer golpe.", fullScreen: true,
    aiInsight: "El ahorro te hace estable; la inversión te hace rico."
  },
  { id: "aho-11-3", stepType: "mcq", question: "¿Qué debe suceder antes de empezar a invertir agresivamente?", options: [{id:"o1", label:"Tener un fondo de emergencia sólido", isCorrect:true}, {id:"o2", label:"Tener el último iPhone", isCorrect:false}], isAssessment: true, fullScreen: true },
  { id: "aho-11-4", stepType: "swipe_sorter", question: "¿Es una característica de Ahorro o Inversión?", leftBucket: {label:"Ahorro (Defensa)", color:"#3b82f6"}, rightBucket: {label:"Inversión (Ataque)", color:"#8b5cf6"}, items: [{id:"i1", label:"Disponibilidad de dinero en 24h", correctBucket:"left"}, {id:"i2", label:"Posibilidad de perder valor temporal", correctBucket:"right"}, {id:"i3", label:"Garantía de capital nominal", correctBucket:"left"}, {id:"i4", label:"Potencial de interés compuesto masivo", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "aho-11-5", stepType: "info", title: "El Puente Metálico", body: "El ahorro es el puente que construyes para llegar a la isla de la inversión. Si intentas nadar sin puente (invertir lo que no tienes ahorrado), te ahogarás en la primera crisis.", fullScreen: true },
  { id: "aho-11-6", stepType: "true_false", statement: "Se puede invertir dinero que vas a necesitar para pagar la renta el próximo mes.", correctValue: false, explanation: "Regla de oro: Nunca inviertas capital operativo de corto plazo. La inversión requiere tiempo para madurar.", isAssessment:true, fullScreen: true },
  { id: "aho-11-7", stepType: "order", question: "El Camino del Capital", items: [{id:"p1", label: "Acumular fondo de emergencia (Ahorro)", correctOrder: 1}, {id: "p2", label: "Definir perfil de riesgo y metas", correctOrder: 2}, {id: "p3", label: "Inyectar excedentes en activos (Inversión)", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "aho-11-8", stepType: "blitz_challenge", question: "¿Qué busca el ahorro?", options: [{id:"o1", label:"Preservación", isCorrect:true}, {id:"o2", label:"Multiplicación", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "aho-11-9", stepType: "blitz_challenge", question: "¿Qué busca la inversión?", options: [{id:"o1", label:"Crecimiento", isCorrect:true}, {id:"o2", label:"Liquidez", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "aho-11-10", stepType: "match", question: "Relaciona Instrumento", leftItems: [{id: "l1", label: "Cuenta de Clar/Nu"}, {id: "l2", label: "S&P 500 (Bolsa)"}], rightItems: [{id: "r1", label: "Ahorro / Cash técnico"}, {id: "r2", label: "Inversión / Crecimiento"}], correctPairs: [{leftId: "l1", rightId: "r1"}, {leftId: "l2", rightId: "r2"}], isAssessment: true, fullScreen: true },
  { id: "aho-11-11", stepType: "mindset_translator", question: "Refactoriza tu Misión", beliefs: [{id: "b1", original: "Invertir es apostar.", healthyOptions: [{id: "h1", label: "Invertir es asignar capital a sistemas productivos tras asegurar mi defensa", isCorrect: true}, {id: "h2", label: "Todo es azar", isCorrect: false}]}] },
  { id: "aho-11-12", stepType: "impulse_meter", instructions: "Mantén pulsado para 'Cruzar el Puente' hacia la inversión. Siente el cambio de velocidad.", item: { name: "Portal Inversor", price: "Libertad", imageUrl: "/billy-breathing.png" }, holdTime: 6, fullScreen: true },
  { id: "aho-11-13", stepType: "narrative_check", question: "¿Te sientes hoy más en una etapa de 'Ahorro Defensivo' o listo para el 'Ataque Inversor'?", promptPlaceholder: "Me siento ...", minChars: 5, billyResponse: "Cualquier etapa es válida si tienes una estrategia clara.", fullScreen: true },
  { id: "aho-11-14", stepType: "info", title: "Alerta de Ingeniería", body: "No saltes a la inversión si tienes deudas con tasas mayores al 20%. Pagar esa deuda es la MEJOR inversión con 20% de rendimiento garantizado.", fullScreen: true,
    aiInsight: "La confusión entre ahorro e inversión es la causa principal de pánico financiero durante las caídas de mercado."
  },
  { id: "aho-11-15", stepType: "summary", title: "Puente Construido", body: "Entiendes la diferencia. Siguiente: Cuentas de Alto Rendimiento.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 12: Cuentas de Alto Rendimiento (Efectivo Inteligente) - 15 SLIDES
// ==============================================================================
export const lessonCuentasAltoRendimientoSteps: LessonStep[] = [
  { id: "aho-12-1", stepType: "billy_talks", body: "Tu efectivo no debe dormir, debe estar en **'Guardia Activa'**. Las Cuentas de Alto Rendimiento (Sofipos, Cetes, etc.) son el hogar ideal para tu ahorro.", fullScreen: true,
    data: { glossary: [{ word: "SOFIPO", definition: "Sociedad Financiera Popular: instituciones reguladas que suelen ofrecer tasas de ahorro más altas que los bancos." }, { word: "GAT Real", definition: "Ganancia Anual Total después de impuestos e inflación." }] }
  },
  { id: "aho-12-2", stepType: "info", title: "El Cash que produce Cash", body: "Si dejas tu dinero en una tarjeta de débito normal, el banco lo usa y tú no ganas nada. En una cuenta de rendimiento, el banco te paga a TI por tener tu liquidez ahí.", fullScreen: true,
    aiInsight: "Mover tu ahorro de una cuenta tradicional a una Sofipo puede aumentar tu capital pasivo en un 10-14% anual de forma segura."
  },
  { id: "aho-12-3", stepType: "mcq", question: "¿Cuál es el riesgo principal de las Sofipos en México?", options: [{id:"o1", label:"Ninguno, son 100% seguras", isCorrect:false}, {id:"o2", label:"Riesgo de insolvencia (protegido hasta ~190k MXN por el fondo ProSofipo)", isCorrect:true, explanation: "Existe un seguro oficial que protege tu ahorro hasta cierto monto por institución."}], isAssessment: true, fullScreen: true },
  { id: "aho-12-4", stepType: "swipe_sorter", question: "¿Es este Instrumento un Lugar para mi Ahorro Líquido?", leftBucket: {label:"SÍ (Luz Verde)", color:"#10b981"}, rightBucket: {label:"NO (Luz Roja)", color:"#ef4444"}, items: [{id:"i1", label:"Cetes a 28 días", correctBucket:"left"}, {id:"i2", label:"Cuentas a la vista (Nu/Clar/Finex)", correctBucket:"left"}, {id:"i3", label:"Criptomonedas volátiles", correctBucket:"right"}, {id:"i4", label:"Prestarle a un familiar", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "aho-12-5", stepType: "info", title: "La Magia de la Capitalización Diaria", body: "Algunas cuentas modernas te pagan rendimientos DIARIOS. Ver tu saldo crecer unos centavos cada mañana es el mejor combustible para tu hábito de ahorro.", fullScreen: true },
  { id: "aho-12-6", stepType: "true_false", statement: "Solo vale la pena abrir estas cuentas si tengo más de $100,000 pesos.", correctValue: false, explanation: "Puedes empezar desde $1 peso. Lo importante es que CADA PESO trabaje para ti desde el día uno.", isAssessment:true, fullScreen: true },
  { id: "aho-12-7", stepType: "order", question: "Activación de Cuenta", items: [{id:"p1", label: "Verificar regulación (CNBV/CONDUSEF)", correctOrder: 1}, {id: "p2", label: "Abrir cuenta y validar identidad", correctOrder: 2}, {id: "p3", label: "Transferir fondo de emergencia", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "aho-12-8", stepType: "blitz_challenge", question: "¿Quién protege tu ahorro en Sofipos?", options: [{id:"o1", label:"ProSofipo", isCorrect:true}, {id:"o2", label:"IPAB", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "aho-12-9", stepType: "blitz_challenge", question: "¿Cómo se llama el rendimiento real?", options: [{id:"o1", label:"GAT Real", isCorrect:true}, {id:"o2", label:"Tasa Bruta", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "aho-12-10", stepType: "match", question: "Relaciona Institución con Tipo", leftItems: [{id: "l1", label: "CetesDirecto"}, {id: "l2", label: "Nu / Clar"}], rightItems: [{id: "r1", label: "Gobierno (Deuda Soberana)"}, {id: "r2", label: "Sofipo / Institución Privada"}], correctPairs: [{leftId: "l1", rightId: "r1"}, {leftId: "l2", rightId: "r2"}], isAssessment: true, fullScreen: true },
  { id: "aho-12-11", stepType: "mindset_translator", question: "Refactoriza tu Almacén", beliefs: [{id: "b1", original: "No confío en apps nuevas.", healthyOptions: [{id: "h1", label: "Confío en la regulación y en los datos; diversifico mi riesgo entre instituciones solidas", isCorrect: true}, {id: "h2", label: "Prefiero el colchón de mi abuela", isCorrect: false}]}] },
  { id: "aho-12-12", stepType: "impulse_meter", instructions: "Mantén pulsado y 'Activa' el motor de rendimientos diarios. Respira flujo pasivo.", item: { name: "Motor de GAT", price: "📈", imageUrl: "/billy-breathing.png" }, holdTime: 6, fullScreen: true },
  { id: "aho-12-13", stepType: "narrative_check", question: "¿Ya tienes cuenta en alguna Sofipo o Cetes? Si no, ¿cuál investigarás hoy?", promptPlaceholder: "Investigaré ...", minChars: 2, billyResponse: "Abre la cuenta. El tiempo que pasas fuera es dinero que dejas sobre la mesa.", fullScreen: true },
  { id: "aho-12-14", stepType: "info", title: "Alerta de Ingeniería", body: "No pongas TODO tu dinero en una sola institución si excedes el monto del seguro ProSofipo ($190k aprox). Diversifica para mantener tu riesgo en CERO técnico.", fullScreen: true,
    aiInsight: "Las tasas actuales de rendimiento en México son de las más altas del mundo; es un momento histórico para el ahorro inteligente."
  },
  { id: "aho-12-15", stepType: "summary", title: "Efectivo Inteligente", body: "Tu ahorro ahora es un trabajador. Siguiente: El Costo de la Inacción.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 13: El Costo de la Inacción - 15 SLIDES
// ==============================================================================
export const lessonCostoInaccionSteps: LessonStep[] = [
  { id: "aho-13-1", stepType: "billy_talks", body: "Esperar a 'ganar mejor' para ahorrar es el error más caro de tu vida. Se llama **Costo de Oportunidad** y cada día de duda te quita meses de libertad futura.", fullScreen: true,
    data: { glossary: [{ word: "Costo de Oportunidad", definition: "Lo que pierdes al elegir una opción (o no elegir ninguna) frente a la mejor alternativa posible." }, { word: "Ventaja Temporal", definition: "El valor exponencial que el tiempo le da a tus activos gracias al interés compuesto." }] }
  },
  { id: "aho-13-2", stepType: "info", title: "El Tiempo es más valioso que el Dinero", body: "Si empiezas a los 20, necesitas $1,000 al mes para ser millonario. Si empiezas a los 40, necesitas $15,000. El castigo por esperar es una carga 15 veces mayor.", fullScreen: true,
    aiInsight: "Un año de retraso en tu plan de ahorro puede costarte hasta el 20% de tu patrimonio final proyectado."
  },
  { id: "aho-13-3", stepType: "mcq", question: "¿Cuál es el mayor enemigo de tu yo de 60 años?", options: [{id:"o1", label:"El mercado bajista", isCorrect:false}, {id:"o2", label:"Tú yo de 25 años decidiendo 'disfrutar' y no ahorrar nada", isCorrect:true, explanation: "La inacción temprana es el daño más difícil de reparar en finanzas."}], isAssessment: true, fullScreen: true },
  { id: "aho-13-4", stepType: "swipe_sorter", question: "¿Acción que Aprovecha el Tiempo o Acción Procrastinadora?", leftBucket: {label:"Aceleradora (+)", color:"#10b981"}, rightBucket: {label:"Freno (-)", color:"#ef4444"}, items: [{id:"i1", label:"Empezar con $100 hoy", correctBucket:"left"}, {id:"i2", label:"Esperar a terminar de pagar mi coche", correctBucket:"right"}, {id:"i3", label:"Leer un libro de finanzas este fin", correctBucket:"left"}, {id:"i4", label:"Ver 5 horas de videos sobre 'hacerse rico' sin actuar", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "aho-13-5", stepType: "info", title: "La Trampa de 'Mañana'", body: "Mañana tendrás más gastos, más responsabilidades y menos energía. El 'momento ideal' no existe. Existe el HOY técnico.", fullScreen: true },
  { id: "aho-13-6", stepType: "true_false", statement: "Es mejor esperar a tener un plan perfecto de inversión antes de separar mi primer peso.", correctValue: false, explanation: "La acción imperfecta vence a la procrastinación perfecta siempre. Ahorra primero, optimiza después.", isAssessment:true, fullScreen: true },
  { id: "aho-13-7", stepType: "order", question: "La Cascada del Éxito", items: [{id:"p1", label: "Decidir el monto hoy", correctOrder: 1}, {id: "p2", label: "Ejecutar la transferencia inicial", correctOrder: 2}, {id: "p3", label: "Aprender mientras el dinero ya crece", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "aho-13-8", stepType: "blitz_challenge", question: "¿Qué factor multiplica tu riqueza exponencialmente?", options: [{id:"o1", label:"El Tiempo", isCorrect:true}, {id:"o2", label:"La Suerte", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "aho-13-9", stepType: "blitz_challenge", question: "¿Cómo se llama lo que dejas de ganar por no actuar?", options: [{id:"o1", label:"Costo de Oportunidad", isCorrect:true}, {id:"o2", label:"Pérdida Neta", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "aho-13-10", stepType: "match", question: "Relaciona Período con Impacto", leftItems: [{id: "l1", label: "Empezar Hoy"}, {id: "l2", label: "Empezar en 5 años"}], rightItems: [{id: "r1", label: "Máximo Apalancamiento Temporal"}, {id: "r2", label: "Esfuerzo Doble Necesario"}], correctPairs: [{leftId: "l1", rightId: "r1"}, {leftId: "l2", rightId: "r2"}], isAssessment: true, fullScreen: true },
  { id: "aho-13-11", stepType: "mindset_translator", question: "Refactoriza tu Tiempo", beliefs: [{id: "b1", original: "Aún soy joven, tengo tiempo.", healthyOptions: [{id: "h1", label: "Mi juventud es mi activo más valioso para el interés compuesto; no lo desperdiciaré", isCorrect: true}, {id: "h2", label: "Mañana lo arreglo", isCorrect: false}]}] },
  { id: "aho-13-12", stepType: "impulse_meter", instructions: "Mantén pulsado y 'Detén' el reloj de la inacción. Respira urgencia positiva.", item: { name: "Reloj Maestro", price: "AHORA", imageUrl: "/billy-breathing.png" }, holdTime: 6, fullScreen: true },
  { id: "aho-13-13", stepType: "narrative_check", question: "¿Cuántos años crees que has 'perdido' de interés compuesto por no haber empezado antes?", promptPlaceholder: "Siento que perdí ... años", minChars: 2, billyResponse: "No mires atrás, el mejor momento para empezar era ayer, el segundo mejor es HOY.", fullScreen: true },
  { id: "aho-13-14", stepType: "info", title: "Alerta de Ingeniería", body: "Un sistema estático es un sistema que muere. La inacción es la forma más rápida de entropía financiera. Muévete.", fullScreen: true,
    aiInsight: "La decisión de empezar a ahorrar HOY tiene más impacto en tu riqueza final que elegir la acción ganadora en la bolsa mañana."
  },
  { id: "aho-13-15", stepType: "summary", title: "Inacción Vencida", body: "Has tomado el control del tiempo. Siguiente: Protección contra Devaluación.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 14: Protección contra Devaluación - 15 SLIDES
// ==============================================================================
export const lessonProteccionDevaluacionSteps: LessonStep[] = [
  { id: "aho-14-1", stepType: "billy_talks", body: "Si ahorras en una moneda débil, tu esfuerzo puede evaporarse por decisiones políticas ajenas a ti. Vamos a aprender sobre la **Protección contra Devaluación**.", fullScreen: true,
    data: { glossary: [{ word: "Devaluación", definition: "Pérdida del valor de una moneda local frente a una moneda extranjera (ej. USD) o un activo de reserva." }, { word: "Cobertura Cambiaria", definition: "Estrategia para proteger el patrimonio de las fluctuaciones del tipo de cambio." }] }
  },
  { id: "aho-14-2", stepType: "info", title: "El Riesgo de Moneda Única", body: "Tener el 100% de tu ahorro en pesos (o cualquier moneda local) es una apuesta arriesgada. Un Ingeniero BIZEN diversifica su ahorro en **Moneda Fuerte** o activos globales.", fullScreen: true,
    aiInsight: "Históricamente, las monedas de mercados emergentes pierden frente al USD un promedio de 3-5% anual a largo plazo."
  },
  { id: "aho-14-3", stepType: "mcq", question: "¿Qué sucede con tu ahorro si el tipo de cambio sube de $17 a $20?", options: [{id:"o1", label:"Tengo la misma cantidad de dinero real", isCorrect:false}, {id:"o2", label:"Tengo menos poder de compra internacional (Inflación importada)", isCorrect:true, explanation: "Muchos de los productos que consumes son importados; si tu moneda baja, esos productos suben para ti."}], isAssessment: true, fullScreen: true },
  { id: "aho-14-4", stepType: "swipe_sorter", question: "¿Es un Activo de Refugio o Activo Vulnerable?", leftBucket: {label:"Refugio (Escudo)", color:"#10b981"}, rightBucket: {label:"Vulnerable (Fuga)", color:"#ef4444"}, items: [{id:"i1", label:"Dólares fìsicos o digitales (Stablecoins)", correctBucket:"left"}, {id:"i2", label:"Efectivo en moneda local", correctBucket:"right"}, {id:"i3", label:"Oro o Metales preciosos", correctBucket:"left"}, {id:"i4", label:"Cuenta de nómina local", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "aho-14-5", stepType: "info", title: "Dolarización del Ahorro", body: "No necesitas vivir en EE.UU. para ahorrar en dólares. Apps modernas y stablecoins permiten que parte de tu **Reserva de Acero** esté protegida contra devaluaciones repentinas.", fullScreen: true },
  { id: "aho-14-6", stepType: "true_false", statement: "Es mejor comprar dólares físicos y guardarlos bajo el colchón para protegerse.", correctValue: false, explanation: "El dólar también tiene inflación. Debes buscar que tus dólares también generen un rendimiento mínimo.", isAssessment:true, fullScreen: true },
  { id: "aho-14-7", stepType: "order", question: "Estrategia de Cobertura", items: [{id:"p1", label: "Determinar porcentaje de ahorro en moneda fuerte (ej. 30%)", correctOrder: 1}, {id: "p2", label: "Elegir plataforma de custodia segura", correctOrder: 2}, {id: "p3", label: "Ejecutar compras periódicas (DCA)", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "aho-14-8", stepType: "blitz_challenge", question: "¿Cómo se llama la pérdida de valor frente al dólar?", options: [{id:"o1", label:"Devaluación", isCorrect:true}, {id:"o2", label:"Inflación", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "aho-14-9", stepType: "blitz_challenge", question: "¿Qué activo es refugio histórico?", options: [{id:"o1", label:"Oro", isCorrect:true}, {id:"o2", label:"Criptos volátiles", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "aho-14-10", stepType: "match", question: "Relaciona Riesgo con Protección", leftItems: [{id: "l1", label: "Riesgo País / Político"}, {id: "l2", label: "Riesgo Inflación Local"}], rightItems: [{id: "r1", label: "Ahorro en USD / Global"}, {id: "r2", label: "Ahorro en Activos Reales"}], correctPairs: [{leftId: "l1", rightId: "r1"}, {leftId: "l2", rightId: "r2"}], isAssessment: true, fullScreen: true },
  { id: "aho-14-11", stepType: "mindset_translator", question: "Refactoriza tu Patria Financiera", beliefs: [{id: "b1", original: "Debo ahorrar en mi moneda por patriotismo.", healthyOptions: [{id: "h1", label: "Mi patriotismo es con mi familia y mi futuro; proteger mi capital es mi responsabilidad técnica", isCorrect: true}, {id: "h2", label: "El peso es invencible", isCorrect: false}]}] },
  { id: "aho-14-12", stepType: "impulse_meter", instructions: "Mantén pulsado y 'Dolariza' parte de tu reserva. Siente la estabilidad global.", item: { name: "Escudo Global", price: "USD", imageUrl: "/billy-breathing.png" }, holdTime: 6, fullScreen: true },
  { id: "aho-14-13", stepType: "narrative_check", question: "¿Qué porcentaje de tu ahorro total tienes hoy en activos que NO sean pesos?", promptPlaceholder: "Tengo un ...%", minChars: 2, billyResponse: "Cualquier porcentaje mayor a cero es un buen inicio de diversificación de país.", fullScreen: true },
  { id: "aho-14-14", stepType: "info", title: "Alerta de Ingeniería", body: "No conviertas todo a dólares cuando el tipo de cambio está en máximos históricos (pánico). Usa el **Promediado (DCA)**: compra un poco cada mes, sin importar el precio.", fullScreen: true,
    aiInsight: "La diversificación de moneda es la diferencia entre la clase media y la clase alta en países con historiales de volatilidad."
  },
  { id: "aho-14-15", stepType: "summary", title: "Protección Activada", body: "Tu ahorro es ahora global. Siguiente: Examen de Maestría en Acumulación.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 15: Examen de Maestría en Acumulación - 15 SLIDES
// ==============================================================================
export const lessonExamenMaestriaAcumulacionSteps: LessonStep[] = [
  { id: "aho-15-1", stepType: "billy_talks", body: "Has llegado al final del Tema 5. Es momento de validar si eres un **Maestro de la Acumulación** o si aún hay fugas en tu sistema.", fullScreen: true },
  { id: "aho-15-2", stepType: "mcq", question: "¿Qué es el ahorro BIZEN?", options: [{id:"o1", label:"Dinero guardado para gastar", isCorrect:false}, {id:"o2", label:"Energía acumulada para inversión x diseño", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "aho-15-3", stepType: "true_false", statement: "Un fondo de emergencia debe cubrir 6 meses de gastos y estar en una cuenta de alta liquidez.", correctValue: true, isAssessment: true, fullScreen: true },
  { id: "aho-15-4", stepType: "mcq", question: "¿Cuál es la métrica reina de este tema?", options: [{id:"o1", label:"Ingreso Bruto", isCorrect:false}, {id:"o2", label:"Tasa de Ahorro", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "aho-15-5", stepType: "swipe_sorter", question: "¿Estrategia Correcta o Error Técnico?", leftBucket: {label:"Correcto", color:"#10b981"}, rightBucket: {label:"Error", color:"#ef4444"}, items: [{id:"i1", label:"Automatizar el ahorro el día 1", correctBucket:"left"}, {id:"i2", label:"Invertir el fondo de emergencia en Bitcoin", correctBucket:"right"}, {id:"i3", label:"Dividir el ahorro en Buckets", correctBucket:"left"}, {id:"i4", label:"Ahorrar lo que sobra al final del mes", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "aho-15-6", stepType: "mcq", question: "¿Qué drena tu dinero si no haces nada?", options: [{id:"o1", label:"Inflación", isCorrect:true}, {id:"o2", label:"Interés Compuesto", isCorrect:false}], isAssessment: true, fullScreen: true },
  { id: "aho-15-7", stepType: "order", question: "Prioridad de un Sistema Robusto", items: [{id:"p1", label: "Eliminar deudas de alto consumo", correctOrder: 1}, {id: "p2", label: "Construir Fondo de Acero", correctOrder: 2}, {id: "p3", label: "Optimizar Tasa de Ahorro", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "aho-15-8", stepType: "blitz_challenge", question: "¿Qué es el micro-ahorro?", options: [{id:"o1", label:"Ahorro de montos pequeños constantes", isCorrect:true}, {id:"o2", label:"Ahorrar poco tiempo", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "aho-15-9", stepType: "blitz_challenge", question: "¿Cuánto vale 1 año de retraso?", options: [{id:"o1", label:"Hasta 20% del patrimonio final", isCorrect:true}, {id:"o2", label:"Nada, el tiempo se recupera", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "aho-15-10", stepType: "match", question: "Relaciona Conceptos", leftItems: [{id: "l1", label: "Fricción Cero"}, {id: "l2", label: "Ahorro Hedónico"}], rightItems: [{id: "r1", label: "Automatización"}, {id: "r2", label: "Optimización del placer"}], correctPairs: [{leftId: "l1", rightId: "r1"}, {leftId: "l2", rightId: "r2"}], isAssessment: true, fullScreen: true },
  { id: "aho-15-11", stepType: "true_false", statement: "La diversificación de moneda protege contra devaluaciones locales.", correctValue: true, isAssessment: true, fullScreen: true },
  { id: "aho-15-12", stepType: "impulse_meter", instructions: "Mantén pulsado para 'Graduarte' del Tema 5. Siente la masa crítica acumulada.", item: { name: "Diploma Acumulador", price: "Éxito", imageUrl: "/billy-breathing.png" }, holdTime: 7, fullScreen: true },
  { id: "aho-15-13", stepType: "narrative_check", question: "¿Cuál es tu compromiso final al terminar este bloque de cimientos?", promptPlaceholder: "Me comprometo a ...", minChars: 15, billyResponse: "Palabra de Ingeniero. El sistema está ahora bajo tu mando.", fullScreen: true },
  { id: "aho-15-14", stepType: "billy_talks", mood: "celebrating", body: "¡Felicidades! Has completado el Tronco Común (Fase 1) de BIZEN. Estás listo para dejar la teoría y entrar a la práctica real.", fullScreen: true },
  { id: "aho-15-15", stepType: "summary", title: "Maestría Alcanzada", body: "Has dominado el ahorro inteligente. Siguiente: La Fase 2 de Especialización (Inversión y Multiplicación).", fullScreen: true },
]
