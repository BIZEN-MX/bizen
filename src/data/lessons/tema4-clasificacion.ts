import type { LessonStep } from "@/types/lessonTypes"

/**
 * Tema 4: Tipos de Gastos (Subtema A: Clasificación)
 * 
 * Sigue el BIZEN Lesson Blueprint (15 slides por lección, 2 Blitz, 2+ AI Insights, No emojis).
 */

// ==============================================================================
// LECCIÓN 1: Gastos fijos vs variables - 15 SLIDES
// ==============================================================================
export const lessonGastosFijosVsVariablesSteps: LessonStep[] = [
  { id: "cla-1-1", stepType: "billy_talks", body: "Bienvenidos al Bloque 4. No todo el dinero que sale de tu cuenta tiene el mismo peso. Aprender a clasificar tus gastos es la base del control estratégico.", fullScreen: true,
    data: { glossary: [{ word: "Gasto Fijo", definition: "Salida de dinero recurrente que no varía (o varía poco) mes con mes." }, { word: "Gasto Variable", definition: "Gasto que depende del consumo o de eventos específicos y fluye constantemente." }] }
  },
  { id: "cla-1-2", stepType: "info", title: "Gastos Fijos: Tu Costo Operativo", body: "Renta, internet, seguros, mensualidades fijas... Son los 'gastos de mantenimiento' de tu vida. Si no los pagas, tu sistema se detiene.", fullScreen: true,
    aiInsight: "Reducir tus gastos fijos es la forma más rápida de bajar tu 'Número de Libertad' y ganar paz mental."
  },
  { id: "cla-1-3", stepType: "info", title: "Gastos Variables: El Grifo Abierto", body: "Comida fuera, transporte, salidas, electricidad... Estos gastos dependen de tus DECISIONES diarias. Son el área de mayor oportunidad para el ahorro.", fullScreen: true },
  { id: "cla-1-4", stepType: "mcq", question: "Si pagas una suscripción de streaming cada mes sin falta, ¿qué tipo de gasto es?", options: [{id:"o1", label:"Gasto Variable (Ocio)", isCorrect:false}, {id:"o2", label:"Gasto Fijo (Recurrente)", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "cla-1-5", stepType: "swipe_sorter", question: "¿Es Fijo o Variable?", leftBucket: {label:"Fijo (Mantenimiento)", color:"#3b82f6"}, rightBucket: {label:"Variable (Consumo)", color:"#fbbf24"}, items: [{id:"s1", label:"Renta / Hipoteca", correctBucket:"left"}, {id:"s2", label:"Cena en restaurante", correctBucket:"right"}, {id:"s3", label:"Plan de datos móvil", correctBucket:"left"}, {id:"s4", label:"Gasolina / Uber", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "cla-1-6", stepType: "true_false", statement: "Un gasto fijo es siempre más peligroso que uno variable.", correctValue: true, explanation: "El gasto fijo es un COMPROMISO a futuro. El variable puedes cortarlo hoy mismo si te quedas sin presupuesto.", isAssessment: true, fullScreen: true },
  { id: "cla-1-7", stepType: "info", title: "Variables 'Disfrazados'", body: "Cuidado: un gasto que parece variable (como la luz) puede volverse fijo en tu mente si no lo controlas. Para BIZEN, si no puedes eliminarlo sin crisis, trátalo como fijo.", fullScreen: true },
  { id: "cla-1-8", stepType: "order", question: "Prioridad de Pago BIZEN", items: [{id:"p1", label: "Gastos Fijos Vitales (Techo/Comida)", correctOrder: 1}, {id: "p2", label: "Ahorro/Inversión Estratégica", correctOrder: 2}, {id: "p3", label: "Gastos Variables Discrecionales", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "cla-1-9", stepType: "blitz_challenge", question: "¿Qué gasto es el internet de tu casa?", options: [{id:"o1", label:"Fijo", isCorrect:true}, {id:"o2", label:"Variable", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "cla-1-10", stepType: "blitz_challenge", question: "¿Qué tipo de gasto permite mayor recorte inmediato?", options: [{id:"o1", label:"Variable", isCorrect:true}, {id:"o2", label:"Fijo", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "cla-1-11", stepType: "match", question: "Relaciona el Concepto", leftItems: [{id:"l1", label:"Inercia"}, {id:"l2", label:"Flujo"}], rightItems: [{id:"r1", label:"Gastos Fijos (Difícil parar)"}, {id:"r2", label:"Gastos Variables (Cambio rápido)"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}], isAssessment: true, fullScreen: true },
  { id: "cla-1-12", stepType: "impulse_meter", instructions: "Mantén pulsado para 'congelar' tus gastos fijos innecesarios. Respira liquidez.", item: { name: "Criogenización de Gastos", price: "0.00", imageUrl: "/billy-breathing.png" }, holdTime: 5, fullScreen: true },
  { id: "cla-1-13", stepType: "narrative_check", question: "¿Cuál es tu gasto fijo más alto actualmente y crees que podrías bajarlo?", promptPlaceholder: "Mi gasto más alto es ... y podría ...", minChars: 15, billyResponse: "Identificar el ancla es el primer paso para liberar el barco.", fullScreen: true },
  { id: "cla-1-14", stepType: "info", title: "Métrica de Supervivencia", body: "Si dejas de ganar dinero hoy, tus GASTOS FIJOS determinan cuántas semanas puedes sobrevivir. A eso le llamamos Runway.", fullScreen: true,
    aiInsight: "La clase media suele acumular gastos fijos (casa, auto) mientras que la clase rica acumula activos antes de subir sus fijos."
  },
  { id: "cla-1-15", stepType: "summary", title: "Clasificación Dominada", body: "Ya sabes distinguir entre el motor y el combustible. Siguiente: Necesidad vs Deseo.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 2: Necesidad vs deseo - 15 SLIDES
// ==============================================================================
export const lessonNecesidadVsDeseoSteps: LessonStep[] = [
  { id: "cla-2-1", stepType: "billy_talks", body: "La mayoría de la gente confunde un deseo con una necesidad para justificar sus compras. Vamos a separar la supervivencia del capricho.", fullScreen: true,
    data: { glossary: [{ word: "Necesidad Vital", definition: "Elemento indispensable para mantener la vida, la salud and la integridad básica." }, { word: "Deseo (Wants)", definition: "Elemento que mejora la calidad de vida o estatus pero cuya ausencia no pone en riesgo la supervivencia." }] }
  },
  { id: "cla-2-2", stepType: "info", title: "Necesidad: El Piso", body: "Comida básica, techo seguro, salud básica, transporte al trabajo. Sin esto, no puedes operar como ser humano productivo.", fullScreen: true,
    aiInsight: "Muchas 'necesidades' modernas son en realidad deseos que el marketing ha normalizado (ej. Plan de datos ilimitado)."
  },
  { id: "cla-2-3", stepType: "info", title: "Deseo: El Techo", body: "Café de marca, ropa de moda, suscripciones extra, salidas. No son malos, pero deben pagarse SOLAMENTE después de cubrir necesidades y ahorro.", fullScreen: true },
  { id: "cla-2-4", stepType: "mcq", question: "Necesito una computadora para trabajar. Puedo comprar una funcional por $500 o una de lujo por $2,000. ¿Qué es la diferencia de $1,500?", options: [{id:"o1", label:"Inversión Necesaria", isCorrect:false}, {id:"o2", label:"Un Deseo Disfrazado", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "cla-2-5", stepType: "swipe_sorter", question: "¿Es Necesidad Vital o Deseo?", leftBucket: {label:"Necesidad", color:"#10b981"}, rightBucket: {label:"Deseo", color:"#94a3b8"}, items: [{id:"s1", label:"Renta de departamento", correctBucket:"left"}, {id:"s2", label:"Último modelo de iPhone", correctBucket:"right"}, {id:"s3", label:"Seguro de Gastos Médicos", correctBucket:"left"}, {id:"s4", label:"Cena en restaurante caro", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "cla-2-6", stepType: "true_false", statement: "Un deseo se convierte en necesidad si todos mis amigos ya lo tienen.", correctValue: false, explanation: "Eso es presión social (estatus), no biología ni supervivencia.", isAssessment: true, fullScreen: true },
  { id: "cla-2-7", stepType: "info", title: "La Escalera del Estilo de Vida", body: "A medida que ganas más, tus DESEOS tienden a 'disfrazarse' de NECESIDADES. 'Necesito un auto mejor porque ahora soy gerente'. Mentira: Es un deseo de estatus.", fullScreen: true },
  { id: "cla-2-8", stepType: "order", question: "Filtro de Compra BIZEN", items: [{id:"p1", label: "¿Cubre una función vital?", correctOrder: 1}, {id: "p2", label: "¿Hay una opción más económica que cumpla la misma función?", correctOrder: 2}, {id: "p3", label: "¿Tengo excedente real para este lujo?", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "cla-2-9", stepType: "blitz_challenge", question: "¿Beber agua purificada es?", options: [{id:"o1", label:"Necesidad", isCorrect:true}, {id:"o2", label:"Deseo", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "cla-2-10", stepType: "blitz_challenge", question: "¿Qué palabra solemos usar para mentirnos?", options: [{id:"o1", label:"'Quiero'", isCorrect:false}, {id:"o2", label:"'Lo necesito'", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "cla-2-11", stepType: "match", question: "Relaciona el Tipo", leftItems: [{id:"l1", label:"Transporte"}, {id:"l2", label:"Comunicación"}, {id:"l3", label:"Diversión"}], rightItems: [{id:"r1", label:"Necesidad: Bus / Deseo: Auto Deportivo"}, {id:"r2", label:"Necesidad: Plan Básico / Deseo: Roaming Ilimitado"}, {id:"r3", label:"Necesidad: Salud Mental / Deseo: Club Privado"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}, {leftId:"l3", rightId:"r3"}], isAssessment: true, fullScreen: true },
  { id: "cla-2-12", stepType: "mindset_translator", question: "Honestidad Radical", beliefs: [{id: "b1", original: "Necesito esas zapatillas para ir al gimnasio.", healthyOptions: [{id: "h1", label: "Deseo esas zapatillas; puedo entrenar con las que tengo y ahorrar ese capital", isCorrect: true}, {id: "h2", label: "Sin marca no hay deporte", isCorrect: false}]}] },
  { id: "cla-2-13", stepType: "narrative_check", question: "¿Cuál ha sido la última 'necesidad' que compraste y que ahora te das cuenta que era un deseo?", promptPlaceholder: "Me mentí con ...", minChars: 15, billyResponse: "La honestidad es el primer paso para dejar de quemar capital.", fullScreen: true },
  { id: "cla-2-14", stepType: "info", title: "Costo de Oportunidad", body: "Cada 'deseo' que compras hoy es una 'necesidad futura' que estás dejando de financiar (como tu libertad o retiro).", fullScreen: true,
    aiInsight: "El 80% de los problemas de deuda provienen de financiar deseos con crédito de corto plazo."
  },
  { id: "cla-2-15", stepType: "summary", title: "Diferencia Aclarada", body: "Eres un maestro de la distinción. Siguiente: Gastos discrecionales (El área de tu libertad).", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 3: Gastos discrecionales (Lo que sí eliges) - 15 SLIDES
// ==============================================================================
export const lessonGastosDiscrecionalesLoQueSiEligesSteps: LessonStep[] = [
  { id: "cla-3-1", stepType: "billy_talks", body: "Los gastos discrecionales son el área donde TU PODER DE DECISIÓN es total. No son fijos ni vitales; son puro ESTILO DE VIDA.", fullScreen: true,
    data: { glossary: [{ word: "Gasto Discrecional", definition: "Aquel que puedes elegir hacer o no sin comprometer tu supervivencia o compromisos legales." }, { word: "Margen de Libertad", definition: "El capital que te queda libre después de tus gastos no-discrecionales." }] }
  },
  { id: "cla-3-2", stepType: "info", title: "El Control del Grifo", body: "Tú tienes la mano en la válvula. Si este mes quieres ahorrar el doble, cierras los discrecionales. Así de simple.", fullScreen: true,
    aiInsight: "En la mayoría de los presupuestos, los discrecionales representan el 30-50% del total de las salidas."
  },
  { id: "cla-3-3", stepType: "mcq", question: "Si cancelas una salida al cine para abonar a tu deuda, ¿qué tipo de gasto estás recortando?", options: [{id:"o1", label:"Gasto Operativo (Vital)", isCorrect:false}, {id:"o2", label:"Gasto Discrecional (Elegible)", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "cla-3-4", stepType: "swipe_sorter", question: "¿Es Discrecional (Tú eliges) o No-Discrecional?", leftBucket: {label:"Discrecional (Poder)", color:"#fbbf24"}, rightBucket: {label:"No-Discrecional (Deber)", color:"#3b82f6"}, items: [{id:"s1", label:"Cenas fuera de casa", correctBucket:"left"}, {id:"s2", label:"Impuesto de automóvil", correctBucket:"right"}, {id:"s3", label:"Viaje de fin de semana", correctBucket:"left"}, {id:"s4", label:"Seguro de vida", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "cla-3-5", stepType: "info", title: "Fricción Táctica", body: "Para controlar estos gastos, pon una 'PAUSA'. No compres al instante; espera 48 horas como vimos en el bloque anterior.", fullScreen: true },
  { id: "cla-3-6", stepType: "true_false", statement: "Un gasto discrecional puede ser muy pequeño pero constante, como un café diario.", correctValue: true, explanation: "Se llaman micro-gastos discrecionales y su acumulación es lo que rompe el presupuesto.", isAssessment: true, fullScreen: true },
  { id: "cla-3-7", stepType: "order", question: "Presupuesto de Discrecionales", items: [{id:"p1", label: "Calcular 'Dinero Libre' después de fijos", correctOrder: 1}, {id: "p2", label: "Definir un tope para ocios y deseos", correctOrder: 2}, {id: "p3", label: "Gastar con tarjeta de débito (no crédito)", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "cla-3-8", stepType: "match", question: "Relaciona Discrecional con su Impacto", leftItems: [{id:"l1", label:"Ocio puro"}, {id:"l2", label:"Social-Estatus"}, {id:"l3", label:"Educación-Valor"}], rightItems: [{id:"r1", label:"Streaming / Cine"}, {id:"r2", label:"Fiesta / Marcas"}, {id:"r3", label:"Curso / Mentoría"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}, {leftId:"l3", rightId:"r3"}], isAssessment: true, fullScreen: true },
  { id: "cla-3-9", stepType: "blitz_challenge", question: "¿Quién tiene la culpa de un gasto discrecional alto?", options: [{id:"o1", label:"Tú", isCorrect:true}, {id:"o2", label:"La economía", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "cla-3-10", stepType: "blitz_challenge", question: "¿Qué representa este gasto?", options: [{id:"o1", label:"Libertad de hoy vs mañana", isCorrect:true}, {id:"o2", label:"Sobrevivir", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "cla-3-11", stepType: "mindset_translator", question: "Toma el Control", beliefs: [{id: "b1", original: "No sé a dónde se va mi dinero.", healthyOptions: [{id: "h1", label: "Sé exactamente cuánto destino a discrecionales y decido cortarlo voluntariamente", isCorrect: true}, {id: "h2", label: "El dinero desaparece por magia", isCorrect: false}]}] },
  { id: "cla-3-12", stepType: "impulse_meter", instructions: "Mantén pulsado para 'apagar' el ruido del consumo. Respira frialdad estratégica.", item: { name: "Interruptor de Ocio", price: "Libertad", imageUrl: "/billy-breathing.png" }, holdTime: 6, fullScreen: true },
  { id: "cla-3-13", stepType: "narrative_check", question: "¿Cuánto dinero estimas que podrías ahorrar este mes si cortas tus discrecionales al 50%?", promptPlaceholder: "Ahorraría aproximadamente ... pesos.", minChars: 10, billyResponse: "Anota ese número. Ese es el precio de tu libertad hoy.", fullScreen: true },
  { id: "cla-3-14", stepType: "info", title: "Cero Culpa, Máximo Control", body: "No se trata de NO gastar en ocio, se trata de que sea una decisión CONSCIENTE y dentro de un límite, no una inercia compulsiva.", fullScreen: true,
    aiInsight: "Las personas que automatizan su ahorro primero, gastan sus discrecionales con un 40% menos de estrés."
  },
  { id: "cla-3-15", stepType: "summary", title: "Grifo Cerrado", body: "Has recuperado el mando del timón. Siguiente: El costo oculto (Extras y Mantenimiento).", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 4: Costo real (Gasto + Extras) - 15 SLIDES
// ==============================================================================
export const lessonCostoRealGastoExtrasSteps: LessonStep[] = [
  { id: "cla-4-1", stepType: "billy_talks", body: "El precio que ves en la etiqueta nunca es el costo real del objeto. Bienvenue a la Ingeniería de Costos: El Costo Total de Propiedad.", fullScreen: true,
    data: { glossary: [{ word: "TCO (Total Cost of Ownership)", definition: "Estimación del costo directo e indirecto de un producto a lo largo de su ciclo de vida." }, { word: "Costo de Mantenimiento", definition: "Gasto recurrente necesario para que un bien siga siendo funcional." }] }
  },
  { id: "cla-4-2", stepType: "info", title: "El Iceberg Financiero", body: "El precio de compra es solo la punta. Por debajo están: envíos, propinas, comisiones, impuestos, mantenimiento y futuras reparaciones.", fullScreen: true,
    aiInsight: "Un automóvil barato puede terminar costando un 300% más de su precio de compra en solo 5 años de mantenimiento."
  },
  { id: "cla-4-3", stepType: "mcq", question: "Compras una impresora de $100. Los cartuchos cuestan $50 cada 3 meses. ¿Cuál es el costo real el primer año?", options: [{id:"o1", label:"$100 pesos", isCorrect:false}, {id:"o2", label:"$300 pesos mínimo", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "cla-4-4", stepType: "swipe_sorter", question: "¿Es un Costo Directo o Oculto?", leftBucket: {label:"Directo (Etiqueta)", color:"#10b981"}, rightBucket: {label:"Oculto (Iceberg)", color:"#ef4444"}, items: [{id:"s1", label:"Precio de lista", correctBucket:"left"}, {id:"s2", label:"Seguro de robo/protección", correctBucket:"right"}, {id:"s3", label:"Comisión por pago tardío", correctBucket:"right"}, {id:"s4", label:"Costo de instalación", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "cla-4-5", stepType: "info", title: "Costo de Operación (OPEX)", body: "Todo lo que compras 'pide de comer'. Un perro pide comida y vet. Una laptop pide luz y software. Una casa pide predial y limpieza. ¿Puedes pagar su alimentación?", fullScreen: true },
  { id: "cla-4-6", stepType: "true_false", statement: "Un objeto 'regalado' puede salir caro financieramente.", correctValue: true, explanation: "Si el mantenimiento del regalo supera tu presupuesto, es un pasivo que destruye tu flujo.", isAssessment: true, fullScreen: true },
  { id: "cla-4-7", stepType: "order", question: "Cálculo de Compra Inteligente", items: [{id:"p1", label: "Consultar precio de etiqueta", correctOrder: 1}, {id: "p2", label: "Estimar costo de uso/mantención anual", correctOrder: 2}, {id: "p3", label: "Dividir entre meses de vida útil prevista", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "cla-4-8", stepType: "match", question: "Relaciona el Extras Oculto", leftItems: [{id:"l1", label:"Mascota"}, {id:"l2", label:"Automóvil"}, {id:"l3", label:"Tarjeta Crédito"}], rightItems: [{id:"r1", label:"Veterinario / Vacunas"}, {id:"r2", label:"Tenencia / Verificación"}, {id:"r3", label:"Anualidad / CAT"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}, {leftId:"l3", rightId:"r3"}], isAssessment: true, fullScreen: true },
  { id: "cla-4-9", stepType: "blitz_challenge", question: "¿Qué significa TCO?", options: [{id:"o1", label:"Total Cost of Operation", isCorrect:false}, {id:"o2", label:"Total Cost of Ownership", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "cla-4-10", stepType: "blitz_challenge", question: "¿Comprar barato siempre es ahorrar?", options: [{id:"o1", label:"No; lo barato sale caro si dura poco", isCorrect:true}, {id:"o2", label:"Sí, el precio es todo", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "cla-4-11", stepType: "mindset_translator", question: "Visión Rayos X", beliefs: [{id: "b1", original: "Fue una ganga, costó solo $1,000.", healthyOptions: [{id: "h1", label: "Cuesta $1,000 hoy más $200 mensuales de mantenimiento; lo evalúo por el total", isCorrect: true}, {id: "h2", label: "Si la etiqueta dice poco, gasto poco", isCorrect: false}]}] },
  { id: "cla-4-12", stepType: "impulse_meter", instructions: "Mantén pulsado y visualiza los costos invisibles de un objeto. Respira realismo.", item: { name: "Detector de Icebergs", price: "$$$", imageUrl: "/billy-breathing.png" }, holdTime: 6, fullScreen: true },
  { id: "cla-4-13", stepType: "narrative_check", question: "¿Cuál es el objeto que más 'dinero extras' te ha pedido este año (reparaciones, refacciones, etc)?", promptPlaceholder: "El objeto es ... y me pidió ...", minChars: 15, billyResponse: "Detectar el flujo de mantenimiento es vital para limpiar tu presupuesto.", fullScreen: true },
  { id: "cla-4-14", stepType: "info", title: "Costo Mental", body: "El mantenimiento no es solo dinero; es TIEMPO. Un objeto complejo pide que le dediques horas de gestión. ¿Tu tiempo no vale?", fullScreen: true,
    aiInsight: "La simplificación radical del entorno (unidades mínimas de posesión) aumenta la tasa de ahorro en un promedio de 25%."
  },
  { id: "cla-4-15", stepType: "summary", title: "Iceberg Identificado", body: "Ya no te engañan las etiquetas. Siguiente: Clasificación Final (Ejercicio Maestro).", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 5: Clasificar mis gastos (Ejercicio Maestro) - 15 SLIDES
// ==============================================================================
export const lessonClasificarMisGastosEjercicioCompletoSteps: LessonStep[] = [
  { id: "cla-5-1", stepType: "billy_talks", body: "Es momento de la verdad técnica. Vamos a aplicar todo lo aprendido a un escenario real de 10 gastos típicos. ¿Sabrás clasificarlos?", fullScreen: true,
    data: { glossary: [{ word: "Presupuesto Operativo (OPEX)", definition: "Suma de todos tus gastos fijos y variables necesarios para vivir." }, { word: "Excedente de Capital", definition: "Dinero sobrante tras cubrir todos los tipos de gastos." }] }
  },
  { id: "cla-5-2", stepType: "influence_detective", scenario: "Tu cuenta bancaria dice que te quedan $500 para el mes. Tienes pendiente pagar el internet ($400) y también el estreno de cine ($250). ¿Cuál eliminas?", options: [{id:"o1", label:"Elimino el internet", emotion:"Impulso", isCorrect:false}, {id:"o2", label:"Elimino el cine (Discrecional)", emotion:"Lógica BIZEN", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "cla-5-3", stepType: "info", title: "La Matriz BIZEN", body: "Divide una hoja en 4: Fijos Vitales, Fijos Opcionales, Variables Vitales y Variables de Lujo. Tu objetivo es limpiar los Opcionales y Lujos primero.", fullScreen: true,
    aiInsight: "El 50% de las suscripciones (Fijos Opcionales) en el mundo se olvidan pero se siguen cobrando."
  },
  { id: "cla-5-4", stepType: "swipe_sorter", question: "¿Es Gasto Fijo Opcional (Suscripción/Lujo) o Variable Vital (Súper/Transporte)?", leftBucket: {label:"Fijo Opcional", color:"#ef4444"}, rightBucket: {label:"Variable Vital", color:"#10b981"}, items: [{id:"s1", label:"Membresía del gimnasio", correctBucket:"left"}, {id:"s2", label:"Fruta y verdura del mercado", correctBucket:"right"}, {id:"s3", label:"Suscripción a revista", correctBucket:"left"}, {id:"s4", label:"Ticket de metro/autobús", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "cla-5-5", stepType: "info", title: "Detectando Fugas", body: "Un gasto variable pequeño que se repite 'cada martes' se vuelve un Gasto Fijo Invisibles. Vamos a atacarlos en la próxima lección de Gastos Hormiga.", fullScreen: true },
  { id: "cla-5-6", stepType: "true_false", statement: "Solo se puede ahorrar si dejas de comer fuera siempre.", correctValue: false, explanation: "Puedes ahorrar optimizando tus FIJOS primero (ejerciendo presión sobre seguros, rentas o internet), lo cual tiene un impacto mayor.", isAssessment: true, fullScreen: true },
  { id: "cla-5-7", stepType: "order", question: "Acción de Ajuste Brizna", items: [{id:"p1", label: "Identificar gasto de 'Lujo' que más te duele", correctOrder: 1}, {id: "p2", label: "Cambiarlo por una versión 'Low Cost' 1 mes", correctOrder: 2}, {id: "p3", label: "Transferir el ahorro a tu fondo de libertad", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "cla-5-8", stepType: "match", question: "Relaciona Prioridad", leftItems: [{id:"l1", label:"Prioridad 1"}, {id:"l2", label:"Prioridad 2"}, {id:"l3", label:"Prioridad 3"}], rightItems: [{id:"r1", label:"Comida y Techo"}, {id:"r2", label:"Inversión y Futuro"}, {id:"r3", label:"Deseos y Caprichos"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}, {leftId:"l3", rightId:"r3"}], isAssessment: true, fullScreen: true },
  { id: "cla-5-9", stepType: "blitz_challenge", question: "¿Cómo se llama el dinero que sobra tras gastos?", options: [{id:"o1", label:"Excedente", isCorrect:true}, {id:"o2", label:"Regalo", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "cla-5-10", stepType: "blitz_challenge", question: "¿Qué parte del presupuesto es 'estilo de vida'?", options: [{id:"o1", label:"Discrecional", isCorrect:true}, {id:"o2", label:"Operativo", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "cla-5-11", stepType: "mindset_translator", question: "Compromiso de Orden", beliefs: [{id: "b1", original: "No necesito anotar mis gastos para saber en qué gasto.", healthyOptions: [{id: "h1", label: "Clasificaré mis gastos el fin de semana para detectar fugas que mi mente ignora", isCorrect: true}, {id: "h2", label: "Tengo memoria fotográfica de mis compras", isCorrect: false}]}] },
  { id: "cla-5-12", stepType: "impulse_meter", instructions: "Mantén pulsado y limpia tu matriz de gastos de distracciones. Respira eficiencia.", item: { name: "Aspiradora de Gastos", price: "0.00", imageUrl: "/billy-breathing.png" }, holdTime: 6, fullScreen: true },
  { id: "cla-5-13", stepType: "narrative_check", question: "¿Qué categoría de gastos crees que es la que más 'te drena' energía ahora mismo?", promptPlaceholder: "Me drena el gasto en ...", minChars: 15, billyResponse: "Aceptar la fuga es el inicio del parche. Has completado la Clasificación.", fullScreen: true },
  { id: "cla-5-14", stepType: "info", title: "Alerta de Resultados", body: "Dominar la clasificación te da la CAPACIDAD DE PREDICCIÓN. Un Ingeniero BIZEN nunca se sorprende al final del mes preguntándose '¿a dónde se fue?'.", fullScreen: true,
    aiInsight: "Las personas que usan aplicaciones de clasificación (como BIZEN) ahorran un 18% más que las que usan métodos manuales o no registran nada."
  },
  { id: "cla-5-15", stepType: "summary", title: "Maestría en Clasificación", body: "Felicidades. Has terminado el Subtema A.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 6: Auditoría de Micro-seguros Ocultos - 15 SLIDES
// ==============================================================================
export const lessonAuditoriaDeMicroSegurosOcultosSteps: LessonStep[] = [
  { id: "mic-1-1", stepType: "billy_talks", body: "Los bancos y servicios digitales suelen inyectar micro-seguros que no pediste. Vamos a hacer una auditoría profunda para eliminar estos parásitos financieros.", fullScreen: true,
    data: { glossary: [{ word: "Micro-seguro Oculto", definition: "Pequeñas primas de seguros (vida, fraude, asistencia) que se cobran automáticamente sin una confirmación explícita recurrente." }, { word: "Métrica de Fuga Silenciosa", definition: "Suma anual de todos los cobros menores a $100 que pasan desapercibidos en el estado de cuenta." }] }
  },
  { id: "mic-1-2", stepType: "info", title: "El Costo de 'Por si acaso'", body: "¿Seguro de celular? ¿Seguro de fraude extra? ¿Asistencia en el hogar que ya tiene tu seguro de casa? Si no lo sabías, no lo usas. Eliminar estos micro-gastos libera un flujo que puede ir directamente a tu fondo de paz.", fullScreen: true,
    aiInsight: "Las instituciones financieras generan hasta un 15% de rentabilidad extra solo mediante la venta cruzada de micro-seguros no utilizados."
  },
  { id: "mic-1-3", stepType: "mcq", question: "Ves un cargo de $49 pesos llamado 'Asistencia Total'. ¿Qué haces?", options: [{id:"o1", label:"Dejarlo, no es mucho", isCorrect:false}, {id:"o2", label:"Llamar y cancelar; es una fuga de eficiencia", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "mic-1-4", stepType: "swipe_sorter", question: "¿Seguro Necesario o Fuga Inútil?", leftBucket: {label:"Necesario (Vital)", color:"#10b981"}, rightBucket: {label:"Inútil (Parásito)", color:"#ef4444"}, items: [{id:"i1", label:"Gastos Médicos Mayores", correctBucket:"left"}, {id:"i2", label:"Seguro de bolso/cartera (fraude ya cubierto)", correctBucket:"right"}, {id:"i3", label:"Responsabilidad Civil Auto", correctBucket:"left"}, {id:"i4", label:"Seguro de 'mantenimiento de red' en internet", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "mic-1-5", stepType: "info", title: "Cero Tolerancia", body: "Un Ingeniero BIZEN tiene tolerancia cero a las fugas no justificadas. Si un servicio cobra $1 extra por algo que no pediste, el sistema ha sido vulnerado. Sella la brecha.", fullScreen: true },
  { id: "mic-1-6", stepType: "true_false", statement: "Los seguros que vienen 'gratis' el primer mes suelen empezar a cobrar automáticamente después sin avisar.", correctValue: true, explanation: "Es una táctica de marketing clásica basada en el olvido del usuario. Pon alarmas para cancelar.", isAssessment:true, fullScreen: true },
  { id: "mic-1-7", stepType: "order", question: "Proceso de Caza de Micro-seguros", items: [{id:"p1", label: "Descargar XML o PDF detallado", correctOrder: 1}, {id: "p2", label: "Buscar conceptos menores a $150", correctOrder: 2}, {id: "p3", label: "Solicitar el folio de cancelación telefónica", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "mic-1-8", stepType: "blitz_challenge", question: "¿Cómo se llama la suma de fugas pequeñas?", options: [{id:"o1", label:"Gasto Hormiga Institucional", isCorrect:true}, {id:"o2", label:"Costo operativo", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "mic-1-9", stepType: "blitz_challenge", question: "¿Cual es el arma contra cobros no solicitados?", options: [{id:"o1", label:"CONDUSEF (o equivalente)", isCorrect:true}, {id:"o2", label:"La paciencia", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "mic-1-10", stepType: "match", question: "Relaciona Servicio con Fuga común", leftItems: [{id:"l1", label:"Telefonía Móvil"}, {id:"l2", label:"Tarjeta de Crédito"}, {id:"l3", label:"Internet Casa"}], rightItems: [{id:"r1", label:"Seguro de vida/accidentes"}, {id:"r2", label:"Protección de compras"}, {id:"r3", label:"Asistencia técnica premium"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}, {leftId:"l3", rightId:"r3"}], isAssessment: true, fullScreen: true },
  { id: "mic-1-11", stepType: "impulse_meter", instructions: "Mantén pulsado y visualiza tu estado de cuenta limpio de micro-cargos. Siente la victoria técnica.", item: { name: "Limpiador de Cargos", price: "0.00", imageUrl: "/billy-breathing.png" }, holdTime: 6, fullScreen: true },
  { id: "mic-1-12", stepType: "mindset_translator", question: "Refactoriza tu atención", beliefs: [{id: "b1", original: "Son solo $30 pesos, no vale la pena la llamada.", healthyOptions: [{id: "h1", label: "$30 pesos al mes por 20 años son miles de pesos que me pertenecen a MÍ, no al banco", isCorrect: true}, {id: "h2", label: "Mi tiempo vale más que $30", isCorrect: false}]}] },
  { id: "mic-1-13", stepType: "narrative_check", question: "¿Has revisado hoy los 'conceptos' de tu factura telefónica o bancaria?", promptPlaceholder: "He revisado ...", minChars: 10, billyResponse: "Hazlo. Encontrarás dinero tirado a la basura.", fullScreen: true },
  { id: "mic-1-14", stepType: "info", title: "Alerta importante", body: "Al cancelar, pide siempre un número de folio y verifica en el siguiente mes que no aparezca el cargo. La persistencia es clave en la auditoría.", fullScreen: true,
    aiInsight: "Las facturas digitales oscurecen estos cargos para que no los notes en el scroll rápido."
  },
  { id: "mic-1-15", stepType: "summary", title: "Auditoría Finalizada", body: "Has expulsado a los parásitos. Siguiente: Cacería de Hormigas.", fullScreen: true },
]
