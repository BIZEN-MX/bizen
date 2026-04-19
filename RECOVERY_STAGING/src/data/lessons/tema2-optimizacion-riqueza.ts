import type { LessonStep } from "@/types/lessonTypes"

/**
 * Subtema 2C: Optimización de Riqueza
 * 
 * Lessons are now expanded to 15 slides each following the UPDATED BIZEN Blueprint (2 Blitz, 2+ AI Insights).
 */

// ==============================================================================
// LECCIÓN 1: Capital intelectual vs financiero (Los dos tanques) - 15 SLIDES
// ==============================================================================
export const lessonCapitalIntelectualVsFinancieroSteps: LessonStep[] = [
  { id: "opt-1-1", stepType: "billy_talks", body: "Tienes dos tanques de combustible: Lo que sabes hacer (Intelectual) y lo que tienes en el banco (Financiero). Vamos a ver cómo se alimentan entre ellos.", fullScreen: true,
    data: { glossary: [{ word: "Capital Intelectual", definition: "Suma de conocimientos, habilidades y experiencias que generan valor económico." }, { word: "Arbitraje de Capital", definition: "Proceso de convertir conocimiento en dinero y viceversa de forma eficiente." }] }
  },
  { id: "opt-1-2", stepType: "info", title: "El Inventario Invisible", body: "El capital financiero se puede quemar, robar o devaluar. El intelectual es **[[Inalienable|Que no se puede quitar, transferir ni enajenar de su dueño]]**. Tu mente es el único activo a prueba de crisis.", fullScreen: true,
    aiInsight: "Un exilio financiero es temporal si tu capital intelectual permanece intacto."
  },
  { id: "opt-1-3", stepType: "impulse_meter", instructions: "Mantén pulsado y siente tu conocimiento fluyendo hacia tu cuenta. Respira valor intelectual.", item: { name: "Tanque Mental", price: "Saber", imageUrl: "/billy-breathing.png" }, holdTime: 5, fullScreen: true },
  { id: "opt-1-4", stepType: "mcq", question: "¿Qué sucede cuando inyectas capital FINANCIERO en capital INTELECTUAL?", options: [{id:"o1", label:"Pierdo dinero", isCorrect:false}, {id:"o2", label:"Multiplico mi potencial futuro (HVA)", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "opt-1-5", stepType: "swipe_sorter", question: "¿Es Capital Intelectual o Financiero?", leftBucket: {label:"Intelectual (Software)", color:"#3b82f6"}, rightBucket: {label:"Financiero (Hardware)", color:"#10b981"}, items: [{id:"i1", label:"Tu red de contactos", correctBucket:"left"}, {id:"i2", label:"Tus acciones en bolsa", correctBucket:"right"}, {id:"i3", label:"Tu habilidad de ventas", correctBucket:"left"}, {id:"i4", label:"Tu fondo de emergencia", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "opt-1-6", stepType: "info", title: "El Arbitraje Vital", body: "Trabajas (Intelectual) -> Ganas (Financiero) -> Inviertes en Cursos (Intelectual) -> Ganas más (Financiero). Rompe el ciclo cuando el financiero ya no dependa del intelectual.", fullScreen: true },
  { id: "opt-1-7", stepType: "true_false", statement: "El capital intelectual es el único que tiene interés compuesto infinito.", correctValue: true, explanation: "El conocimiento se acumula y se mezcla, generando ideas que antes no podías ver. Es exponencial.", isAssessment:true, fullScreen: true },
  { id: "opt-1-8", stepType: "order", question: "Ciclo de Crecimiento de Riqueza", items: [{id:"p1", label: "Acumulación de Habilidades (Intelectual)", correctOrder: 1}, {id: "p2", label: "Generación de Excedente (Flujo)", correctOrder: 2}, {id: "p3", label: "Conversión a Activos (Financiero)", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "opt-1-9", stepType: "blitz_challenge", question: "¿Qué capital es más difícil de perder?", options: [{id:"o1", label:"El Intelectual", isCorrect:true}, {id:"o2", label:"El Financiero", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "opt-1-10", stepType: "blitz_challenge", question: "¿Qué sucede al dejar de estudiar?", options: [{id:"o1", label:"Me estanco (Devaluación)", isCorrect:true}, {id:"o2", label:"Ahorro tiempo", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "opt-1-11", stepType: "match", question: "Relaciona Recurso con Tanque", leftItems: [{id:"l1", label:"Tu Maestría en Marketing"}, {id:"l2", label:"Tu cuenta de inversión"}], rightItems: [{id:"r1", label:"Intelectual"}, {id:"r2", label:"Financiero"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}], isAssessment: true, fullScreen: true },
  { id: "opt-1-12", stepType: "mindset_translator", question: "Refactoriza tu gasto", beliefs: [{id: "b1", original: "No quiero gastar en este libro/curso.", healthyOptions: [{id: "h1", label: "Estoy alimentando mi motor de riqueza perpetua", isCorrect: true}, {id: "h2", label: "Es dinero tirado a la basura", isCorrect: false}]}] },
  { id: "opt-1-13", stepType: "narrative_check", question: "¿Qué conocimiento tienes hoy que crees que podrías vender por $1,000 en el mercado?", promptPlaceholder: "Sé cómo ... para ...", minChars: 10, billyResponse: "Encuentra el comprador y tendrás tu primer activo intelectual monetizado.", fullScreen: true },
  { id: "opt-1-14", stepType: "info", title: "Alerta importante", body: "No seas un 'académico pobre'. El intelecto sin ejecución es solo entretenimiento. El intelecto estratégico produce billetes.", fullScreen: true,
    aiInsight: "La aplicación práctica del conocimiento multiplica su valor percibido por 10."
  },
  { id: "opt-1-15", stepType: "summary", title: "Tanques Equilibrados", body: "Has visto la balanza. Siguiente: Impuesto a la Ignorancia.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 2: El Impuesto a la Ignorancia (Fugas invisibles) - 15 SLIDES
// ==============================================================================
export const lessonImpuestoALaIgnoranciaSteps: LessonStep[] = [
  { id: "opt-2-1", stepType: "billy_talks", body: "No pagas impuestos solo al gobierno; pagas el **[[Impuesto a la Ignorancia|Dinero perdido por no saber cómo funciona el sistema (intereses, deudas, inversión)]]** cada vez que cometes un error técnico.", fullScreen: true,
    data: { glossary: [{ word: "Impuesto a la Ignorancia", definition: "Costo oculto de la falta de conocimiento financiero: comisiones, tasas altas, oportunidades perdidas." }, { word: "Costo de Inacción", definition: "Lo que dejas de ganar por no saber cómo empezar." }] }
  },
  { id: "opt-2-2", stepType: "info", title: "La Tasa del 20% del 'No Saber'", body: "Pagar el mínimo de tu tarjeta de crédito es pagar un impuesto a la ignorancia masivo. El banco se enriquece de lo que tú no sabes o no aplicas.", fullScreen: true,
    aiInsight: "Las familias que no dominan el concepto de interés compuesto pagan hasta un 40% más por los mismos bienes a lo largo de su vida."
  },
  { id: "opt-2-3", stepType: "mcq", question: "¿Cuál es el impuesto a la ignorancia más caro?", options: [{id:"o1", label:"Tener el dinero en una cuenta de ahorros al 0% con inflación del 5%", isCorrect:true}, {id:"o2", label:"Pagar el IVA del súper", isCorrect:false}], isAssessment: true, fullScreen: true },
  { id: "opt-2-4", stepType: "swipe_sorter", question: "¿Es un Impuesto a la Ignorancia o una Decisión de Ingeniería?", leftBucket: {label:"Impuesto (Error)", color:"#ef4444"}, rightBucket: {label:"Ingeniería (Dato)", color:"#10b981"}, items: [{id:"i1", label:"Pagar solo el mínimo", correctBucket:"left"}, {id:"i2", label:"Invertir en ETFs de bajo costo", correctBucket:"right"}, {id:"i3", label:"Comprar garantía extendida inútil", correctBucket:"left"}, {id:"i4", label:"Deducir impuestos legalmente", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "opt-2-5", stepType: "info", title: "Fugas de Sistema", body: "Cada suscripción que no usas, cada comisión innecesaria... son goteras en tu tanque. Tapar las goteras es el aumento de sueldo más rápido que existe.", fullScreen: true },
  { id: "opt-2-6", stepType: "true_false", statement: "Es más barato contratar a un experto que aprender yo mismo cómo funciona mi dinero.", correctValue: false, explanation: "Incluso con un experto, si eres ignorante, no sabrás si te está asesorando bien. La responsabilidad última es TUYA.", isAssessment:true, fullScreen: true },
  { id: "opt-2-7", stepType: "order", question: "Limpieza de Impuesto a la Ignorancia", items: [{id:"p1", label: "Auditar deudas (Tasas de interés)", correctOrder: 1}, {id: "p2", label: "Eliminar gatillos de gasto inútiles", correctOrder: 2}, {id: "p3", label: "Automatizar la inversión a bajo costo", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "opt-2-8", stepType: "blitz_challenge", question: "¿Qué impuesto es más difícil de detectar?", options: [{id:"o1", label:"El de Transacción", isCorrect:false}, {id:"o2", label:"El de la Ignorancia", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "opt-2-9", stepType: "blitz_challenge", question: "¿Cómo se cancela este impuesto?", options: [{id:"o1", label:"Educación Aplicada", isCorrect:true}, {id:"o2", label:"Quejas constantes", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "opt-2-10", stepType: "match", question: "Relaciona Error con Consecuencia", leftItems: [{id:"l1", label:"Fricción de Inversion"}, {id:"l2", label:"Deuda de Consumo"}], rightItems: [{id:"r1", label:"Pérdida por Inflación"}, {id:"r2", label:"Interés en Contra"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}], isAssessment: true, fullScreen: true },
  { id: "opt-2-11", stepType: "mindset_translator", question: "Limpia tus fugas", beliefs: [{id: "b1", original: "No tengo tiempo para ver mis finanzas.", healthyOptions: [{id: "h1", label: "Tengo que dedicar 1 hora al mes a tapar mis fugas de capital por ignorancia", isCorrect: true}, {id: "h2", label: "El banco lo hace por mí", isCorrect: false}]}] },
  { id: "opt-2-12", stepType: "impulse_meter", instructions: "Mantén pulsado y visualiza tus goteras financieras sellándose. Respira eficiencia.", item: { name: "Sellador de Fugas", price: "0.00", imageUrl: "/billy-breathing.png" }, holdTime: 5, fullScreen: true },
  { id: "opt-2-13", stepType: "narrative_check", question: "¿Cuál ha sido el error financiero más caro que has cometido por 'no saber'?", promptPlaceholder: "Perdí dinero al ...", minChars: 15, billyResponse: "Doloroso, pero esa es tu matrícula. No volverás a pagarla.", fullScreen: true },
  { id: "opt-2-14", stepType: "info", title: "Alerta importante", body: "La ignorancia es un lujo que un Ingeniero del Dinero no se puede permitir. Lee las letras pequeñas de tu vida.", fullScreen: true,
    aiInsight: "La transparencia de datos reduce el impuesto a la ignorancia de forma inmediata tras el primer análisis."
  },
  { id: "opt-2-15", stepType: "summary", title: "Goteras Selladas", body: "Has auditado las fugas. Siguiente: Apalancamiento.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 3: Apalancamiento: Hacer más con menos - 15 SLIDES
// ==============================================================================
export const lessonApalancamientoHacerMasConMenosSteps: LessonStep[] = [
  { id: "opt-3-1", stepType: "billy_talks", body: "Arquímedes dijo: 'Dame un punto de apoyo y moveré el mundo'. En finanzas, ese punto de apoyo es el Apalancamiento.", fullScreen: true,
    data: { glossary: [{ word: "Apalancamiento", definition: "Uso de recursos ajenos (capital, tecnología, personas) para multiplicar el resultado de tu propia acción." }, { word: "Punto de Apoyo", definition: "Ventaja competitiva donde aplicas tu esfuerzo para obtener mayor impacto." }] }
  },
  { id: "opt-3-2", stepType: "info", title: "Tipos de Palanca", body: "Existen 4 palancas: Código (Software), Media (Contenido), Dinero (Capital Ajeno) y Personas (Equipos). ¿Cuál vas a jalar tú?", fullScreen: true,
    aiInsight: "El código y el contenido son las palancas más potentes hoy porque tienen CERO costo marginal."
  },
  { id: "opt-3-3", stepType: "mcq", question: "¿Qué palanca es la más difícil de soltar pero la más milenaria?", options: [{id:"o1", label: "El Dinero", isCorrect: false}, {id:"o2", label: "Las Personas (Liderazgo)", isCorrect: true}], isAssessment: true, fullScreen: true },
  { id: "opt-3-4", stepType: "swipe_sorter", question: "¿Qué recurso es una Palanca o un Ancla?", leftBucket: {label:"Palanca (Poder)", color:"#10b981"}, rightBucket: {label:"Ancla (Peso)", color:"#ef4444"}, items: [{id:"i1", label:"Software de automatización", correctBucket:"left"}, {id:"i2", label:"Préstamo para TV", correctBucket:"right"}, {id:"i3", label:"Crédito Hipotecario para Inversión", correctBucket:"left"}, {id:"i4", label:"Gastos de coche de lujo", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "opt-3-5", stepType: "info", title: "El Riesgo de la Palanca", body: "La palanca puede ayudarte a subir rápido o a enterrarte rápido. Apalancarse en ignorancia es suicidio financiero.", fullScreen: true },
  { id: "opt-3-6", stepType: "true_false", statement: "Es posible volverse extremadamente libre usando solo tu propio esfuerzo físico sin ninguna palanca.", correctValue: false, explanation: "Tu fuerza física es constante; las palancas son las que te dan escala masiva.", isAssessment:true, fullScreen: true },
  { id: "opt-3-7", stepType: "order", question: "Uso Ético de la Palanca", items: [{id:"p1", label: "Dominar la técnica base", correctOrder: 1}, {id: "p2", label: "Aplicar palanca tecnológica (Código/Media)", correctOrder: 2}, {id: "p3", label: "Apalancamiento de Capital", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "opt-3-8", stepType: "blitz_challenge", question: "¿Cual es la palanca que no duerme?", options: [{id:"o1", label:"El Software y el Contenido", isCorrect:true}, {id:"o2", label:"Tu equipo de ventas", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "opt-3-9", stepType: "blitz_challenge", question: "¿Apalancarse en deuda es?", options: [{id:"o1", label:"Un riesgo calculado", isCorrect:true}, {id:"o2", label:"Siempre malo", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "opt-3-10", stepType: "match", question: "Relaciona Recurso", leftItems: [{id:"l1", label:"Código"}, {id:"l2", label:"Capital"}], rightItems: [{id:"r1", label:"Multiplica tu lógica"}, {id:"r2", label:"Multiplica tu dinero"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}], isAssessment: true, fullScreen: true },
  { id: "opt-3-11", stepType: "mindset_translator", question: "Refactoriza tu fuerza", beliefs: [{id: "b1", original: "Tengo que hacerlo todo yo solo.", healthyOptions: [{id: "h1", label: "Usaré herramientas que expandan mi alcance mientras descanso", isCorrect: true}, {id: "h2", label: "La soledad operativa es mi destino", isCorrect: false}]}] },
  { id: "opt-3-12", stepType: "impulse_meter", instructions: "Mantén pulsado y usa la palanca para levantar tu meta financiera. Respira fuerza técnica.", item: { name: "Barra de Fuerza", price: "Libertad", imageUrl: "/billy-breathing.png" }, holdTime: 6, fullScreen: true },
  { id: "opt-3-13", stepType: "narrative_check", question: "¿Qué palanca (Código, Media, Capital, Personas) vas a empezar a construir este mes?", promptPlaceholder: "Construiré mi palanca de ...", minChars: 15, billyResponse: "Elección sabia. Es el único camino a la verdadera escala.", fullScreen: true },
  { id: "opt-3-14", stepType: "info", title: "Alerta importante", body: "Antes de apalancarte en dinero ajeno, asegúrate de que tu modelo de negocio sea rentable en pequeño.", fullScreen: true,
    aiInsight: "La tecnología ha democratizado el apalancamiento: hoy un solo humano puede mover billones con código."
  },
  { id: "opt-3-15", stepType: "summary", title: "Palanca en Mano", body: "Has visto el poder del apoyo. Siguiente: Ingresos Recurrentes.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 4: Ingresos Recurrentes: Tu ejército (La base del flujo) - 15 SLIDES
// ==============================================================================
export const lessonIngresosRecurrentesTuEjercitoSteps: LessonStep[] = [
  { id: "opt-4-1", stepType: "billy_talks", body: "Vender una vez es agotador. Vender algo que te paguen cada mes para siempre es libertad. Vamos a reclutar tus Ingresos Recurrentes.", fullScreen: true,
    data: { glossary: [{ word: "Ingresos Recurrentes", definition: "Dinero que entra periódicamente con un solo esfuerzo inicial de adquisición." }, { word: "Churn Rate (Tasa de Baja)", definition: "Ritmo al que los ingresos recurrentes se pierden o cancelan." }] }
  },
  { id: "opt-4-2", stepType: "info", title: "La Paz de la Suscripción", body: "Si el día 1 de cada mes ya tienes cubiertos tus gastos fijos por ingresos recurrentes, tu sistema es antifrágil.", fullScreen: true,
    aiInsight: "Las empresas basadas en suscripción valen hasta 8 veces más que las de venta única por su predictibilidad."
  },
  { id: "opt-4-3", stepType: "mcq", question: "¿Qué es más valioso para un sistema rico?", options: [{id:"o1", label: "Vender una casa (Gran suma, 1 vez)", isCorrect: false}, {id:"o2", label: "Renta mensual (Pequeña suma, eterno)", isCorrect: true}], isAssessment: true, fullScreen: true },
  { id: "opt-4-4", stepType: "swipe_sorter", question: "¿Es una Venta Única o un Ingreso Recurrente?", leftBucket: {label:"Única (Caza)", color:"#ef4444"}, rightBucket: {label:"Recurrente (Granja)", color:"#10b981"}, items: [{id:"i1", label:"Venta de un celular", correctBucket:"left"}, {id:"i2", label:"Suscripción a SaaS", correctBucket:"right"}, {id:"i3", label:"Clase particular suelta", correctBucket:"left"}, {id:"i4", label:"Membresía VIP mensual", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "opt-4-5", stepType: "info", title: "Cazar vs Sembrar", body: "La mayoría de la gente sale a cazar cada día (Venta única). Los ricos siembran granjas (Recurrencia). Deja de perseguir la presa y construye el campo.", fullScreen: true },
  { id: "opt-4-6", stepType: "true_false", statement: "Un sueldo fijo como empleado es un ingreso recurrente de alta calidad.", correctValue: false, explanation: "Es recurrente para la empresa mientras te necesiten, pero tú no eres dueño del flujo. Si te despiden, el flujo es 0.", isAssessment:true, fullScreen: true },
  { id: "opt-4-7", stepType: "order", question: "Construcción de Recurrencia", items: [{id:"p1", label: "Brindar un valor constante real", correctOrder: 1}, {id: "p2", label: "Sistematizar el cobro (Suscripción)", correctOrder: 2}, {id: "p3", label: "Optimizar retención (Bajo Churn)", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "opt-4-8", stepType: "blitz_challenge", question: "¿Cómo se llama la pérdida de suscriptores?", options: [{id:"o1", label:"Churn", isCorrect:true}, {id:"o2", label:"Burn", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "opt-4-9", stepType: "blitz_challenge", question: "¿Qué busca el Ingeniero del Dinero?", options: [{id:"o1", label:"Ventas épicas rápidas", isCorrect:false}, {id:"o2", label:"Flujos estables perpetuos", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "opt-4-10", stepType: "match", question: "Relaciona Ejemplo", leftItems: [{id:"l1", label:"Inquilino"}, {id:"l2", label:"Dividendos stock"}], rightItems: [{id:"r1", label:"Recurrencia Física"}, {id:"r2", label:"Recurrencia Financiera"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}], isAssessment: true, fullScreen: true },
  { id: "opt-4-11", stepType: "mindset_translator", question: "Refactoriza tu cosecha", beliefs: [{id: "b1", original: "Prefiero ganar $10,000 hoy que $100 al mes.", healthyOptions: [{id: "h1", label: "Prefiero construir flujos pequeños que acumulados venzan a la inflación para siempre", isCorrect: true}, {id: "h2", label: "El ahora es lo único que importa", isCorrect: false}]}] },
  { id: "opt-4-12", stepType: "impulse_meter", instructions: "Mantén pulsado y planta el primer árbol de tu bosque recurrente. Respira paciencia fértil.", item: { name: "Semilla de Flujo", price: "0.00", imageUrl: "/billy-breathing.png" }, holdTime: 5, fullScreen: true },
  { id: "opt-4-13", stepType: "narrative_check", question: "¿Qué podrías ofrecer como suscripción a partir de tus habilidades actuales?", promptPlaceholder: "Ofrecería una suscripción de ...", minChars: 15, billyResponse: "Cualquier HVA puede empaquetarse. Busca el modelo de membresía.", fullScreen: true },
  { id: "opt-4-14", stepType: "info", title: "Alerta de Riesgo", body: "La recurrencia te da paz, pero no te duermas. El mercado cambia y debes seguir nutriendo tu valor para mantener la retención.", fullScreen: true,
    aiInsight: "La tasa de retención (retention rate) es la métrica de salud más importante de todo sistema rico."
  },
  { id: "opt-4-15", stepType: "summary", title: "Ejército Reclutado", body: "Has visto la granja. Siguiente: Tu Plan de Acción.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 5: Plan de Acción: Duplicar mi valor de mercado - 15 SLIDES
// ==============================================================================
export const lessonPlanAccionDuplicarValorMercadoSteps: LessonStep[] = [
  { id: "opt-5-1", stepType: "billy_talks", body: "Felicidades. Has completado el Tema 2. Ahora, vamos a la ejecución táctica. Vamos a duplicar tu valor en los próximos 12 meses.", fullScreen: true,
    data: { glossary: [{ word: "Plan de Acción BIZEN", definition: "Hoja de ruta secuencial para elevar el capital intelectual y financiero." }, { word: "Métrica de Éxito", definition: "Indicador clave cuantificable que mide el progreso del sistema." }] }
  },
  { id: "opt-5-2", stepType: "info", title: "El Factor Doppelganger", body: "Si hoy existiera una versión de tí que supiera IA y Ventas, ¿cuánto más ganaría? Ese es tu objetivo. Vamos a clonar esa versión mejorada.", fullScreen: true,
    aiInsight: "Duplicar tu valor no requiere el doble de trabajo, requiere el doble de impacto técnico."
  },
  { id: "opt-5-3", stepType: "impulse_meter", instructions: "Mantén pulsado y firma tu contrato contigo mismo. Doble de valor, doble de libertad. Respira compromiso.", item: { name: "Contrato de Valor", price: "Firma", imageUrl: "/billy-breathing.png" }, holdTime: 6, fullScreen: true },
  { id: "opt-5-4", stepType: "mcq", question: "¿Qué vas a priorizar este mes para duplicar tu valor?", options: [{id:"o1", label: "Trabajar más horas extras", isCorrect: false}, {id:"o2", label: "Adquirir una HVA complementaria", isCorrect: true}, {id:"o3", label: "Pedir un préstamo", isCorrect: false}], isAssessment: true, fullScreen: true },
  { id: "opt-5-5", stepType: "swipe_sorter", question: "¿Es una Acción del Plan de Crecimiento?", leftBucket: {label:"Rechazar (Ruido)", color:"#ef4444"}, rightBucket: {label:"Aceptar (Señal)", color:"#10b981"}, items: [{id:"i1", label:"Ver 3 horas de TV al día", correctBucket:"left"}, {id:"i2", label:"Escribir 1 post de valor al día", correctBucket:"right"}, {id:"i3", label:"Aprender automatización de procesos", correctBucket:"right"}, {id:"i4", label:"Comprar ropa cara por estatus", correctBucket:"left"}], isAssessment: true, fullScreen: true },
  { id: "opt-5-6", stepType: "info", title: "La Dieta de Información", body: "Lo que consumes en tu cerebro determina tus ingresos. Deja de consumir chatarra mental y empieza a consumir algoritmos de valor.", fullScreen: true },
  { id: "opt-5-7", stepType: "true_false", statement: "Es imposible duplicar mis ingresos si el país está en crisis económica.", correctValue: false, explanation: "En las crisis el dinero cambia de manos. Los ingenieros del valor atraen ese dinero aprovechando las ineficiencias de otros.", isAssessment:true, fullScreen: true },
  { id: "opt-5-8", stepType: "order", question: "Cronograma de Ejecución", items: [{id:"p1", label: "Definir HVA a aprender (Mes 1-3)", correctOrder: 1}, {id: "p2", label: "Construir Portfolio/Casos de Éxito (Mes 4-6)", correctOrder: 2}, {id: "p3", label: "Recalibrar precio o Lanzar sistema (Mes 7-12)", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "opt-5-9", stepType: "blitz_challenge", question: "¿Cuál es tu mejor activo en crisis?", options: [{id:"o1", label:"Tu Capital Intelectual", isCorrect:true}, {id:"o2", label:"Tus gadgets", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "opt-5-10", stepType: "blitz_challenge", question: "¿Cuándo termina el aprendizaje?", options: [{id:"o1", label:"Nunca (Mejora Continua)", isCorrect:true}, {id:"o2", label:"Al graduarte", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "opt-5-11", stepType: "match", question: "Relaciona Meta", leftItems: [{id:"l1", label:"Corto Plazo"}, {id:"l2", label:"Largo Plazo"}], rightItems: [{id:"r1", label:"Eliminar fugas"}, {id:"r2", label:"Construir palancas"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}], isAssessment: true, fullScreen: true },
  { id: "opt-5-12", stepType: "mindset_translator", question: "Grito de Guerra BIZEN", beliefs: [{id: "b1", original: "Ojalá me den una oportunidad.", healthyOptions: [{id: "h1", label: "Soy la oportunidad andante y el mercado vendrá a buscarme", isCorrect: true}, {id: "h2", label: "Seguiré esperando con paciencia", isCorrect: false}]}] },
  { id: "opt-5-13", stepType: "billy_talks", mood: "celebrating", body: "Has terminado el bloque de Ingeniería del Ingreso. Tu visión ha cambiado. Estás listo para dominar tus gastos (Tema 3).", fullScreen: true },
  { id: "opt-5-14", stepType: "narrative_check", question: "¿Cuál es el primer paso físico que darás HOY para empezar tu plan de 12 meses?", promptPlaceholder: "Hoy voy a ...", minChars: 15, billyResponse: "Perfecto. La audacia técnica es la clave. ¡A por ello!", fullScreen: true,
    aiInsight: "Un plan escrito tiene un 42% más de probabilidades de éxito que uno solo pensado."
  },
  { id: "opt-5-15", stepType: "summary", title: "Tema 2 Concluido", body: "Has dominado la Ingeniería del Ingreso. ¡Felicidades, Arquitecto de Riqueza!", fullScreen: true },
]
