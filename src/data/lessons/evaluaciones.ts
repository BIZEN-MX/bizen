import type { LessonStep } from "@/types/lessonTypes";

/**
 * EVALUACIONES DE BLOQUE (EXÁMENES FINALES DE TEMA)
 * 
 * Nivel de Dificultad: Media-Alta.
 * Enfoque: Validación de dominio técnico y aplicación de conceptos BIZEN.
 */

// ==============================================================================
// EVALUACION BLOQUE 1: MENTALIDAD (TEMA 1)
// ==============================================================================
export const lessonEvaluacionBloque1Steps: LessonStep[] = [
  { id: "eval-1-1", stepType: "billy_talks", body: "Bienvenido al Examen de Certificación: Bloque 1. Esta evaluación mide tu capacidad predictiva sobre tu propio software mental.", fullScreen: true },
  
  { id: "eval-1-2", stepType: "mcq", question: "En el sistema BIZEN, ¿cuál es el riesgo técnico más alto de no conocer tu 'Número de Libertad'?", options: [
    {id:"o1", label:"No poder comprar lo que deseas a fin de mes", isCorrect:false}, 
    {id:"o2", label:"Ceder el control de tu tiempo a un tercero al no tener una métrica de salida clara", isCorrect:true},
    {id:"o3", label:"Tener un balance bancario negativo", isCorrect:false}
  ], isAssessment: true, fullScreen: true },

  { id: "eval-1-3", stepType: "true_false", statement: "La Somatización Financiera es un error del sistema que debe eliminarse mediante el pensamiento lógico puro.", correctValue: false, explanation: "Falso. La somatización es una señal técnica del cuerpo que indica una desalineación entre el riesgo y tu capacidad de respuesta.", isAssessment:true, fullScreen: true },

  { id: "eval-1-4", stepType: "swipe_sorter", question: "Clasifica el Estímulo por su Origen en el Software Mental", leftBucket: {label:"Lógica (Corteza)", color:"#10b981"}, rightBucket: {label:"Sesgo (Límbico)", color:"#ef4444"}, items: [
    {id:"i1", label:"Anclaje: Comparar el precio actual con el anterior", correctBucket:"right"}, 
    {id:"i2", label:"Cálculo del Costo de Oportunidad", correctBucket:"left"}, 
    {id:"i3", label:"Aversión a la Pérdida: No vender un activo que cae", correctBucket:"right"}, 
    {id:"i4", label:"Etiquetado de Emoción ante un trigger", correctBucket:"left"}
  ], isAssessment: true, fullScreen: true },

  { id: "eval-1-5", stepType: "order", question: "Protocolo de Intercepción BIZEN ante un Gasto Imprevisto", items: [
    {id:"p1", label: "Pausa Táctica (Etiquetado Emocional)", correctOrder: 1}, 
    {id: "p2", label: "Cálculo de Vida Neta (Horas-Hombre)", correctOrder: 2}, 
    {id: "p3", label: "Validación de Realidad vs Deseo", correctOrder: 3}
  ], isAssessment: true, fullScreen: true },

  { id: "eval-1-6", stepType: "match", question: "Relaciona el Concepto con su Función Crítica", leftItems: [
    {id:"l1", label:"Criterio de Realidad"}, 
    {id:"l2", label:"Costo Hundido"}
  ], rightItems: [
    {id:"r1", label:"Filtro de datos contra creencias"}, 
    {id:"r2", label:"Trampa de persistencia por inversión previa"}
  ], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}], isAssessment: true, fullScreen: true },

  { id: "eval-1-7", stepType: "mcq", question: "Si tu Capacidad de Ahorro es del 10% y tus ingresos suben un 20%, pero tus gastos suben un 20%, ¿qué ha ocurrido?", options: [
    {id:"o1", label: "Tu sistema se ha expandido proporcionalmente", isCorrect: false}, 
    {id:"o2", label: "Has caído en la Ley de Parkinson, invalidando el crecimiento", isCorrect: true},
    {id:"o3", label: "Estás ahorrando el doble de dinero nominal", isCorrect: false}
  ], isAssessment: true, fullScreen: true },

  { id: "eval-1-8", stepType: "true_false", statement: "El Dinero es Energía Técnica que se expande mediante la creación de valor, no es un recurso finito.", correctValue: true, isAssessment:true, fullScreen: true },

  { id: "eval-1-9", stepType: "blitz_challenge", question: "¿Qué parte del cerebro es responsable del 'Sesgo de Gratificación Inmediata'?", options: [
    {id:"o1", label:"Sistema Límbico", isCorrect:true}, 
    {id:"o2", label:"Neocórtex", isCorrect:false}
  ], timeLimit: 10, isAssessment: true, fullScreen: true },

  { id: "eval-1-10", stepType: "summary", title: "Certificación: Mentalidad", body: "Examen finalizado. Si has respondido con precisión técnica, tu certificación de Bloque 1 está validada.", fullScreen: true },
]

// ==============================================================================
// EVALUACIÓN BLOQUE 2: INGENIERÍA DEL INGRESO (TEMA 2)
// ==============================================================================
export const lessonEvaluacionBloque2Steps: LessonStep[] = [
  { id: "eval-2-1", stepType: "billy_talks", body: "Bienvenido al Examen de Certificación: Bloque 2. Aquí validaremos tu capacidad para construir palancas de valor escalable.", fullScreen: true },
  
  { id: "eval-2-2", stepType: "mcq", question: "¿Cuál es la diferencia técnica fundamental entre una Habilidad (Skill) y una Palanca (Leverage)?", options: [
    {id:"o1", label:"La habilidad es lo que haces, la palanca es cuánto te pagan", isCorrect:false}, 
    {id:"o2", label:"La palanca desacopla el tiempo del resultado mediante sistemas o capital", isCorrect:true},
    {id:"o3", label:"No hay diferencia, son sinónimos en el sistema BIZEN", isCorrect:false}
  ], isAssessment: true, fullScreen: true },

  { id: "eval-2-3", stepType: "true_false", statement: "El Capital Intelectual es el único activo que puede generar flujo sin requerir una fase previa de construcción intensiva.", correctValue: false, explanation: "Todo activo escalable (intelectual, código, media) requiere una fase inicial de Inversión Neta de Tiempo.", isAssessment:true, fullScreen: true },

  { id: "eval-2-4", stepType: "swipe_sorter", question: "Clasifica la Actividad por su Potencial de Escala", leftBucket: {label:"Escalable (Palanca)", color:"#10b981"}, rightBucket: {label:"Lineal (Intercambio)", color:"#64748b"}, items: [
    {id:"i1", label:"Creación de un software de suscripción", correctBucket:"left"}, 
    {id:"i2", label:"Consultoría técnica cobrada por hora", correctBucket:"right"}, 
    {id:"i3", label:"Grabación de un curso digital", correctBucket:"left"}, 
    {id:"i4", label:"Gestión administrativa presencial", correctBucket:"right"}
  ], isAssessment: true, fullScreen: true },

  { id: "eval-2-5", stepType: "order", question: "Ruta de Evolución del Ingreso BIZEN", items: [
    {id:"p1", label: "Adquisición de HVA (Rareza en el mercado)", correctOrder: 1}, 
    {id: "p2", label: "Excedente de Flujo (Validación de Ingreso)", correctOrder: 2}, 
    {id: "p3", label: "Apalancamiento (Código/Media/Capital)", correctOrder: 3}
  ], isAssessment: true, fullScreen: true },

  { id: "eval-2-6", stepType: "match", question: "Relaciona la Palanca con su Característica Técnica", leftItems: [
    {id:"l1", label:"Media (Contenido)"}, 
    {id:"l2", label:"Código (Software)"}
  ], rightItems: [
    {id:"r1", label:"Permiso de audiencia masiva constante"}, 
    {id:"r2", label:"Ejecución lógica sin intervención humana"}
  ], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}], isAssessment: true, fullScreen: true },

  { id: "eval-2-7", stepType: "mcq", question: "En el Triángulo del Valor (HVA, Escala, Rareza), ¿qué ocurre si tienes HVA y Rareza pero NO tienes Escala?", options: [
    {id:"o1", label: "Serás un profesional muy bien pagado, pero atrapado en el intercambio de horas", isCorrect: true}, 
    {id:"o2", label: "Ganarás dinero de forma pasiva inmediatamente", isCorrect: false},
    {id:"o3", label: "Tu valor en el mercado caerá por falta de visibilidad", isCorrect: false}
  ], isAssessment: true, fullScreen: true },

  { id: "eval-2-8", stepType: "true_false", statement: "El 'Impuesto a la Ignorancia' se paga cada vez que delegas una decisión financiera que no comprendes técnicamente.", correctValue: true, isAssessment:true, fullScreen: true },

  { id: "eval-2-9", stepType: "blitz_challenge", question: "¿Cómo se llama la métrica que mide la deserción de ingresos recurrentes?", options: [
    {id:"o1", label:"Churn Rate", isCorrect:true}, 
    {id:"o2", label:"Burn Rate", isCorrect:false}
  ], timeLimit: 10, isAssessment: true, fullScreen: true },

  { id: "eval-2-10", stepType: "summary", title: "Certificación: Ingresos", body: "Examen finalizado. El dominio de la producción es la base de tu libertad técnica.", fullScreen: true },
]

// ==============================================================================
// EVALUACIÓN BLOQUE 3: PSICOLOGÍA DEL CONSUMO (TEMA 3)
// ==============================================================================
export const lessonEvaluacionBloque3Steps: LessonStep[] = [
  { id: "eval-3-1", stepType: "billy_talks", body: "Bienvenido al Examen de Certificación: Bloque 3. Aquí probaremos si eres el ingeniero de tus recursos o el pasajero de los algoritmos.", fullScreen: true },
  
  { id: "eval-3-2", stepType: "mcq", question: "¿Qué vulnerabilidad psicológica explota principalmente el 'Marketing de Urgencia' (Contadores de tiempo)?", options: [
    {id:"o1", label:"El deseo de tener algo nuevo", isCorrect:false}, 
    {id:"o2", label:"El sesgo de Aversión a la Pérdida y el FOMO", isCorrect:true},
    {id:"o3", label:"La necesidad de ahorrar dinero", isCorrect:false}
  ], isAssessment: true, fullScreen: true },

  { id: "eval-3-3", stepType: "true_false", statement: "La Riqueza Invisible BIZEN se define como el capital que tienes invertido pero que no puedes retirar a corto plazo.", correctValue: false, explanation: "Falso. La riqueza invisible es la libertad, el tiempo y la paz mental que obtienes al NO gastar en pasivos de estatus.", isAssessment:true, fullScreen: true },

  { id: "eval-3-4", stepType: "swipe_sorter", question: "Clasifica el Gasto por su Impacto en tu Libertad Neta", leftBucket: {label:"Activo (Inversión)", color:"#10b981"}, rightBucket: {label:"Pasivo (Estatus)", color:"#fbbf24"}, items: [
    {id:"i1", label:"Suscripción a herramienta de automatización HVA", correctBucket:"left"}, 
    {id:"i2", label:"Vehículo financiado por encima de tu capacidad", correctBucket:"right"}, 
    {id:"i3", label:"Formación técnica de alta demanda", correctBucket:"left"}, 
    {id:"i4", label:"Cena de lujo para impresionar círculo social", correctBucket:"right"}
  ], isAssessment: true, fullScreen: true },

  { id: "eval-3-5", stepType: "order", question: "Filtro Anti-Consumo de 3 Capas BIZEN", items: [
    {id:"p1", label: "Detección del Trigger (¿Por qué lo quiero?)", correctOrder: 1}, 
    {id: "p2", label: "Fricción Táctica (Esperar 48 horas)", correctOrder: 2}, 
    {id: "p3", label: "Célula Proyectiva (¿Cuánto tiempo neta me cuesta?)", correctOrder: 3}
  ], isAssessment: true, fullScreen: true },

  { id: "eval-3-6", stepType: "match", question: "Relaciona el Sesgo con el Error Técnico", leftItems: [
    {id:"l1", label:"Efecto Diderot"}, 
    {id:"l2", label:"Prueba Social"}
  ], rightItems: [
    {id:"r1", label:"Una compra genera una espiral de necesidades nuevas"}, 
    {id:"r2", label:"Comprar porque 'todos los demás' lo hacen"}
  ], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}], isAssessment: true, fullScreen: true },

  { id: "eval-3-7", stepType: "mcq", question: "Si aplicas la 'Asertividad Financiera', ¿cuál es tu respuesta técnica ante la presión social para gastar?", options: [
    {id:"o1", label: "Ignorar la presión y aislarse socialmente", isCorrect: false}, 
    {id:"o2", label: "Defender tu integridad de sistema ofreciendo una alternativa que no comprometa tu capital", isCorrect: true},
    {id:"o3", label: "Ceder solo una vez para evitar el conflicto", isCorrect: false}
  ], isAssessment: true, fullScreen: true },

  { id: "eval-3-8", stepType: "true_false", statement: "El 'Post-Audit' de un gasto impulsivo tiene como objetivo principal castigar el error para no repetirlo.", correctValue: false, explanation: "Falso. El objetivo es desglosar la ruta del trigger para parchar la vulnerabilidad del software mental.", isAssessment:true, fullScreen: true },

  { id: "eval-3-9", stepType: "blitz_challenge", question: "¿Qué regla BIZEN vence al impulso inmediato?", options: [
    {id:"o1", label:"Regla de las 48 Horas", isCorrect:true}, 
    {id:"o2", label:"Regla de la Gratificación Pospuesta", isCorrect:false}
  ], timeLimit: 10, isAssessment: true, fullScreen: true },

  { id: "eval-3-10", stepType: "summary", title: "Certificación: Consumo", body: "Examen finalizado. Has demostrado que el control de tus salidas de capital es una ventaja competitiva.", fullScreen: true },
]

// ==============================================================================
// EVALUACIÓN BLOQUE 4: FINANZAS PARA MI NEGOCIO (TEMA 4)
// ==============================================================================
export const lessonEvaluacionBloque4Steps: LessonStep[] = [
  { id: "eval-4-1", stepType: "billy_talks", body: "Bienvenido al Examen de Certificación Final: Bloque 4. Aquí validaremos si eres capaz de operar una estructura de negocio paramétrica y blindada.", fullScreen: true },
  
  { id: "eval-4-2", stepType: "mcq", question: "¿Qué indicador BIZEN determina si tu negocio está 'creciendo' o 'muriendo' independientemente de la facturación?", options: [
    {id:"o1", label:"Ingresos Brutos Mensuales", isCorrect:false}, 
    {id:"o2", label:"Utilidad Neta (Dinero real después de TODO)", isCorrect:true},
    {id:"o3", label:"Número de clientes activos", isCorrect:false}
  ], isAssessment: true, fullScreen: true },

  { id: "eval-4-3", stepType: "true_false", statement: "El Financiamiento BIZEN debe utilizarse prioritariamente para cubrir hoyos de flujo de efectivo en nóminas.", correctValue: false, explanation: "Falso. El financiamiento se usa exclusivamente para EXPANDIR operaciones con ROI probado, nunca para subsistencia operativa.", isAssessment:true, fullScreen: true },

  { id: "eval-4-4", stepType: "swipe_sorter", question: "Clasifica el Escenario por su Viabilidad Financiera", leftBucket: {label:"Viable (BIZEN)", color:"#10b981"}, rightBucket: {label:"Inviable (Suicidio)", color:"#ef4444"}, items: [
    {id:"i1", label:"ROI del 30% con un CAT bancario del 15%", correctBucket:"left"}, 
    {id:"i2", label:"Costo unitario mayor al precio de mercado", correctBucket:"right"}, 
    {id:"i3", label:"Margen Operativo que cubre costos fijos en 5 días", correctBucket:"left"}, 
    {id:"i4", label:"Dependencia de un solo cliente que aporta el 90% del flujo", correctBucket:"right"}
  ], isAssessment: true, fullScreen: true },

  { id: "eval-4-5", stepType: "order", question: "Ruta de Auditoría de Salida (Optimización de Recursos)", items: [
    {id:"p1", label: "Análisis de Margen de Ganancia Neto", correctOrder: 1}, 
    {id: "p2", label: "Optimización Fiscal (Ej. RESICO)", correctOrder: 2}, 
    {id: "p3", label: "Reinversión Paramétrica de Utilidades", correctOrder: 3}
  ], isAssessment: true, fullScreen: true },

  { id: "eval-4-6", stepType: "match", question: "Relaciona la Herramienta con su Blindaje", leftItems: [
    {id:"l1", label:"Seguro de Daños"}, 
    {id:"l2", label:"Acta Constitutiva"}
  ], rightItems: [
    {id:"r1", label:"Mitigación de riesgos letales operativos"}, 
    {id:"r2", label:"Separación de patrimonio personal y societario"}
  ], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}], isAssessment: true, fullScreen: true },

  { id: "eval-4-7", stepType: "mcq", question: "En el Régimen RESICO, ¿cuál es el beneficio financiero asimétrico más importante para una Persona Física con Actividad Empresarial?", options: [
    {id:"o1", label: "No tener que pagar IVA de los productos vendidos", isCorrect: false}, 
    {id:"o2", label: "Pagar un ISR máximo del 2.5%, liberando capital para reinversión", isCorrect: true},
    {id:"o3", label: "Poder deducir gastos de lujo sin revisión del SAT", isCorrect: false}
  ], isAssessment: true, fullScreen: true },

  { id: "eval-4-8", stepType: "true_false", statement: "El Punto de Equilibrio es el momento exacto en que la empresa empieza a generar riqueza para los socios.", correctValue: false, explanation: "Falso. El Punto de Equilibrio es solo el nivel de ventas donde no hay ganancia ni pérdida; la riqueza real empieza DESPUÉS de superarlo.", isAssessment:true, fullScreen: true },

  { id: "eval-4-9", stepType: "blitz_challenge", question: "¿Cómo se llama la barrera legal que protege tu propiedad intelectual?", options: [
    {id:"o1", label:"Moat Jurídico (IMPI/Contratos)", isCorrect:true}, 
    {id:"o2", label:"Patente de Corso", isCorrect:false}
  ], timeLimit: 10, isAssessment: true, fullScreen: true },

  { id: "eval-4-10", stepType: "summary", title: "Certificación: Finanzas Empresariales", body: "Examen finalizado. Has demostrado dominio sobre la estructura fáctica de un negocio rentable. Tu certificado final está validado.", fullScreen: true },
]
