import type { LessonStep } from "@/types/lessonTypes"

/**
 * Subtema 7: Fondo de Emergencia
 * 
 * Lessons expanded to 15 slides following the BIZEN Blueprint.
 * Focus: Definition, sizing, and allocation of the emergency fund.
 */

// ==============================================================================
// LECCIÓN 1: ¿Qué es un fondo de emergencia? - 15 SLIDES
// ==============================================================================
export const lessonQueEsFondoEmergenciaSteps: LessonStep[] = [
  { id: "femer-1-1", stepType: "billy_talks", body: "La vida es experta en lanzar bolas curvas. El Fondo de Emergencia es el guante que las atrapa antes de que te golpeen la cara. Vamos a construir tu escudo.", fullScreen: true,
    data: { glossary: [{ word: "Fondo de Emergencia", definition: "Dinero reservado exclusivamente para cubrir gastos inesperados y críticos." }, { word: "Liquidez", definition: "La facilidad con la que un activo puede convertirse en dinero en efectivo de inmediato." }] }
  },
  { id: "femer-1-2", stepType: "info", title: "El Seguro de tu Tranquilidad", body: "Sin un fondo, una llanta ponchada o una muela rota se convierten en deudas de tarjeta de crédito al 70% de interés. El fondo de emergencia transforma un desastre financiero en un simple inconveniente logístico.", fullScreen: true,
    aiInsight: "El 78% de los trabajadores viven 'al día', lo que significa que una sola emergencia médica puede arruinar su estabilidad por años."
  },
  { id: "femer-1-3", stepType: "impulse_meter", instructions: "Mantén pulsado y siente el muro de protección creciendo a tu alrededor. Respira invulnerabilidad.", item: { name: "Muro de Emergencia", price: "0.00", imageUrl: "/billy-breathing.png" }, holdTime: 5, fullScreen: true },
  { id: "femer-1-4", stepType: "mcq", question: "¿Cuál es el propósito real de un fondo de emergencia?", options: [{id:"o1", label:"Tener dinero para aprovechar ofertas en el Buen Fin", isCorrect:false}, {id:"o2", label:"Tener paz mental y evitar deudas ante imprevistos reales", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "femer-1-5", stepType: "swipe_sorter", question: "¿Es una Emergencia Real?", leftBucket: {label:"Emergencia", color:"#ef4444"}, rightBucket: {label:"Gasto Planeado", color:"#3b82f6"}, items: [{id:"i1", label:"Despido injustificado", correctBucket:"left"}, {id:"i2", label:"Reparación del motor", correctBucket:"left"}, {id:"i3", label:"Regalos de Navidad", correctBucket:"right"}, {id:"i4", label:"Vacaciones de verano", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "femer-1-6", stepType: "info", title: "Eliminar el Estrés del Sistema", body: "Tener un fondo de emergencia reduce tus niveles de cortisol. Sabes que si algo sale mal, tienes con qué responder. Esa claridad mental te permite tomar mejores decisiones en tu trabajo y vida.", fullScreen: true },
  { id: "femer-1-7", stepType: "true_false", statement: "El fondo de emergencia debe usarse para pagar deudas de consumo habitual.", correctValue: false, explanation: "Falso. El fondo es para EMERGENCIAS. Si lo usas para gastos normales, estarás desprotegido cuando llegue el verdadero problema.", isAssessment:true, fullScreen: true },
  { id: "femer-1-8", stepType: "order", question: "Prioridad de Fondos", items: [{id: "p1", label: "Mini-fondo (Parachoques)", correctOrder: 1}, {id: "p2", label: "Fondo Completo (3-6 meses)", correctOrder: 2}, {id: "p3", label: "Fondo de Inversión", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "femer-1-9", stepType: "blitz_challenge", question: "¿Qué otorga tener un fondo de emergencia?", options: [{id:"o1", label:"Libertad de decir 'No' a situaciones tóxicas", isCorrect:true}, {id:"o2", label:"Intereses masivos", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "femer-1-10", stepType: "blitz_challenge", question: "¿Dónde NO debe estar este fondo?", options: [{id:"o1", label:"En acciones riesgosas", isCorrect:true}, {id:"o2", label:"En una cuenta de ahorro líquida", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "femer-1-11", stepType: "match", question: "Relaciona el Concepto", leftItems: [{id:"l1", label:"Escudo"}, {id:"l2", label:"Parachoques"}, {id:"l3", label:"Paz Mental"}], rightItems: [{id:"r1", label:"Protección"}, {id:"r2", label:"Absorción de Impacto"}, {id:"r3", label:"Salud Psicológica"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}, {leftId:"l3", rightId:"r3"}], isAssessment: true, fullScreen: true },
  { id: "femer-1-12", stepType: "mindset_translator", question: "Refactoriza tu riesgo", beliefs: [{id: "b1", original: "A mí nunca me va a pasar nada malo.", healthyOptions: [{id: "h1", label: "Lo inesperado es inevitable; estar preparado es opcional pero inteligente", isCorrect: true}, {id: "h2", label: "Confío en mi buena suerte", isCorrect: false}]}] },
  { id: "femer-1-13", stepType: "narrative_check", question: "¿Cuál ha sido la 'emergencia' más cara que has tenido y cómo la pagaste?", promptPlaceholder: "Tuve que pagar ... con ...", minChars: 15, billyResponse: "Anotado. Con un fondo de emergencia, la próxima vez la historia terminará diferente.", fullScreen: true },
  { id: "femer-1-14", stepType: "info", title: "Alerta de Ingeniería", body: "Un sistema sin redundancias es un sistema frágil. El fondo de emergencia es la redundancia de tu vida financiera. Es lo que te mantiene volando cuando un motor falla.", fullScreen: true,
    aiInsight: "Las personas con fondos de emergencia informan niveles de felicidad un 15% más altos que quienes no los tienen, independientemente de su sueldo."
  },
  { id: "femer-1-15", stepType: "summary", title: "Fondo Comprendido", body: "Has visto qué es y para qué sirve. Siguiente: Cuánto dinero debe tener.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 2: ¿Cuánto dinero debo tener ahorrado? - 15 SLIDES
// ==============================================================================
export const lessonCuantoAhorrarEmergenciaSteps: LessonStep[] = [
  { id: "femer-2-1", stepType: "billy_talks", body: "Ni mucho que se oxide, ni poco que se rompa. Vamos a calcular el tamaño exacto de tu escudo según tu perfil de riesgo.", fullScreen: true,
    data: { glossary: [{ word: "Meses de Gastos", definition: "Unidad de medida del fondo de emergencia basada en tus costos fijos vitales." }, { word: "Austeridad", definition: "Nivel de gasto mínimo necesario para sobrevivir sin lujos durante una crisis." }] }
  },
  { id: "femer-2-2", stepType: "info", title: "La Regla de los 3 a 6 meses", body: "El estándar industrial es tener entre 3 y 6 meses de tus GASTOS BÁSICOS (no de tu sueldo). Si gastas $15k para vivir, tu fondo ideal es entre $45k y $90k.", fullScreen: true,
    aiInsight: "Tener 6 meses de fondo te da libertad estadística para encontrar un nuevo trabajo mejor pagado sin la presión del hambre."
  },
  { id: "femer-2-3", stepType: "impulse_meter", instructions: "Mantén pulsado y calcula mentalmente tus gastos por 3 meses. Visualiza la cifra. Respira realismo financiero.", item: { name: "Calculadora de Fondo", price: "0.00", imageUrl: "/billy-breathing.png" }, holdTime: 6, fullScreen: true },
  { id: "femer-2-4", stepType: "mcq", question: "¿Sobre qué cifra se calcula el fondo de emergencia?", options: [{id:"o1", label:"Sobre mi sueldo bruto mensual", isCorrect:false}, {id:"o2", label:"Sobre mis gastos vitales indispensables (renta, comida, luz)", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "femer-2-5", stepType: "swipe_sorter", question: "¿Necesitas 3 meses o 6 meses?", leftBucket: {label:"3 Meses (Menos Riesgo)", color:"#3b82f6"}, rightBucket: {label:"6 Meses (Más Riesgo)", color:"#f59e0b"}, items: [{id:"i1", label:"Soltero sin hijos", correctBucket:"left"}, {id:"i2", label:"Padre de familia", correctBucket:"right"}, {id:"i3", label:"Trabajo estable (Gobierno)", correctBucket:"left"}, {id:"i4", label:"Freelance con ingresos variables", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "femer-2-6", stepType: "info", title: "El Factor de Riesgo Personal", body: "¿Qué tan rápido puedes conseguir otro ingreso si pierdes el actual? Si eres médico, quizá 3 meses bastan. Si eres un artista de nicho, quizá necesites 12 meses. Tú conoces tu mercado.", fullScreen: true },
  { id: "femer-2-7", stepType: "true_false", statement: "Un fondo de 12 meses es siempre mejor que uno de 6.", correctValue: false, explanation: "Falso. Demasiado dinero en ahorro 'muerto' pierde valor por inflación. Transcurrido un punto, ese dinero rinde más invertido.", isAssessment:true, fullScreen: true },
  { id: "femer-2-8", stepType: "order", question: "Pasos para Calcular", items: [{id: "p1", label: "Sumar gastos vitales del mes", correctOrder: 1}, {id: "p2", label: "Multiplicar por nivel de riesgo", correctOrder: 2}, {id: "p3", label: "Establecer la meta final", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "femer-2-9", stepType: "blitz_challenge", question: "¿Qué haces si tus gastos suben?", options: [{id:"o1", label:"Ajustar el tamaño de mi fondo", isCorrect:true}, {id:"o2", label:"Dejarlo igual", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "femer-2-10", stepType: "blitz_challenge", question: "¿Qué es un mini-fondo o parachoques?", options: [{id:"o1", label:"Una meta inicial de $15,000 - $20,000", isCorrect:true}, {id:"o2", label:"Una cuenta vacía", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "femer-2-11", stepType: "match", question: "Relaciona Situación", leftItems: [{id:"l1", label:"Gastos: $10k | Meta 6m"}, {id:"l2", label:"Gastos: $20k | Meta 3m"}], rightItems: [{id:"r1", label:"$60,000"}, {id:"r2", label:"$60,000"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}], isAssessment: true, fullScreen: true },
  { id: "femer-2-12", stepType: "mindset_translator", question: "Refactoriza tu meta", beliefs: [{id: "b1", original: "Es demasiado dinero para juntar.", healthyOptions: [{id: "h1", label: "Es un proyecto de vida que avanzaré peso a peso cada quincena", isCorrect: true}, {id: "h2", label: "Mejor no empiezo", isCorrect: false}]}] },
  { id: "femer-2-13", stepType: "narrative_check", question: "¿Cuánto dinero gastas CADA MES en lo estrictamente vital (sin lujos)?", promptPlaceholder: "Gasto unos $...", minChars: 15, billyResponse: "Perfecto. Multiplica eso por 6 y ya tienes tu 'Número de Libertad'.", fullScreen: true },
  { id: "femer-2-14", stepType: "info", title: "Alerta de Ingeniería", body: "No busques el 100% de la meta el primer día. Busca el sistema que te acerque un 1% cada semana. La constancia es el cemento de tu muro.", fullScreen: true,
    aiInsight: "Tener una meta numérica escrita aumenta en un 50% las probabilidades de alcanzarla."
  },
  { id: "femer-2-15", stepType: "summary", title: "Monto Calculado", body: "Has visto cuánto necesitas. Siguiente: En dónde guardarlo.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 3: ¿Dónde guardar este fondo? - 15 SLIDES
// ==============================================================================
export const lessonDondeGuardarFondoSteps: LessonStep[] = [
  { id: "femer-3-1", stepType: "billy_talks", body: "Tan importante como tener el dinero es tenerlo accesible pero protegido. No lo entierres, ponlo a trabajar en el lugar correcto.", fullScreen: true,
    data: { glossary: [{ word: "CETES", definition: "Certificados de la Tesorería de la Federación; la inversión más segura en México." }, { word: "Disponibilidad Diaria", definition: "Capacidad de retirar tu dinero en días hábiles de inmediato." }] }
  },
  { id: "femer-3-2", stepType: "info", title: "El Trilema del Inversor", body: "En el fondo de emergencia priorizamos 1. Seguridad y 2. Liquidez. El Rendimiento es lo último que nos importa aquí. No buscamos hacernos ricos con el fondo, buscamos que no se nos pierda.", fullScreen: true,
    aiInsight: "Tener dinero en una cuenta de nómina normal es una invitación al gasto accidental. Necesitas sacarlo de tu vista diaria."
  },
  { id: "femer-3-3", stepType: "impulse_meter", instructions: "Mantén pulsado y visualiza tu dinero en una 'caja fuerte' digital. Siente la inaccesibilidad a impulsos. Respira control.", item: { name: "Caja Fuerte Digital", price: "0.00", imageUrl: "/billy-breathing.png" }, holdTime: 6, fullScreen: true },
  { id: "femer-3-4", stepType: "mcq", question: "¿Cuál es el mejor lugar para el fondo en México hoy?", options: [{id:"o1", label:"Bajo el colchón o en la cartera", isCorrect:false}, {id:"o2", label:"En Bonddia (CETES) o Cajitas de Neobancos con disponibilidad diaria", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "femer-3-5", stepType: "swipe_sorter", question: "¿Aprobado para el Fondo?", leftBucket: {label:"Aprobado", color:"#10b981"}, rightBucket: {label:"Rechazado", color:"#ef4444"}, items: [{id:"i1", label:"Bonddia (Dispo diaria)", correctBucket:"left"}, {id:"i2", label:"Acciones de Tesla", correctBucket:"right"}, {id:"i3", label:"Cajitas Nu / Ualá", correctBucket:"left"}, {id:"i4", label:"Préstamo a un amigo", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "femer-3-6", stepType: "info", title: "CETESDirecto y Bonddia", body: "Es la plataforma oficial. Bonddia te da rendimientos diarios y puedes retirar tu dinero de lunes a viernes en horario bancario. Es el estándar de oro para fondos de emergencia en México.", fullScreen: true },
  { id: "femer-3-7", stepType: "true_false", statement: "El fondo de emergencia debe estar en efectivo por si se cae el internet.", correctValue: false, explanation: "Aunque un pequeño extra en efectivo no sobra, el 95% debe estar bancarizado y rindiendo para que la inflación no lo destruya.", isAssessment:true, fullScreen: true },
  { id: "femer-3-8", stepType: "order", question: "Prioridad Bancaria", items: [{id: "p1", label: "Liquidez (Sacarlo hoy)", correctOrder: 1}, {id: "p2", label: "Seguridad (No perderlo)", correctOrder: 2}, {id: "p3", label: "Rendimiento (Que crezca algo)", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "femer-3-9", stepType: "blitz_challenge", question: "¿Qué impuesto se cobra sobre los rendimientos de CETES?", options: [{id:"o1", label:"ISR sobre el rendimiento real", isCorrect:true}, {id:"o2", label:"IVA comercial", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "femer-3-10", stepType: "blitz_challenge", question: "¿Cuál es el riesgo de guardarlo en criptomonedas?", options: [{id:"o1", label:"Alta volatilidad (Puede valer 0 cuando lo ocupes)", isCorrect:true}, {id:"o2", label:"Ninguno", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "femer-3-11", stepType: "match", question: "Relaciona el Refugio", leftItems: [{id:"l1", label:"CETES / Bonddia"}, {id:"l2", label:"Cajitas Fintech"}], rightItems: [{id:"r1", label:"Seguridad Estatal"}, {id:"r2", label:"Facilidad en App"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}], isAssessment: true, fullScreen: true },
  { id: "femer-3-12", stepType: "mindset_translator", question: "Refactoriza tu confianza", beliefs: [{id: "b1", original: "No entiendo Bonddia, mejor lo dejo en nómina.", healthyOptions: [{id: "h1", label: "Tomaré 10 minutos para aprender a usar una herramienta que protege mi esfuerzo", isCorrect: true}, {id: "h2", label: "La comodidad vale la pérdida", isCorrect: false}]}] },
  { id: "femer-3-13", stepType: "narrative_check", question: "¿A qué plataforma vas a transferir tus primeros $1,000 de fondo esta semana?", promptPlaceholder: "Voy a usar ...", minChars: 15, billyResponse: "Excelente elección. Dar ese paso es la diferencia entre un plan y una intención.", fullScreen: true },
  { id: "femer-3-14", stepType: "info", title: "Alerta de Ingeniería", body: "El dinero debe estar fuera del alcance de 'un solo click impulsivo'. Tenerlo en una institución distinta a tu banco principal añade una capa de protección psicológica vital.", fullScreen: true,
    aiInsight: "La fatiga de fricción (tener que hacer un traspaso de 24h) reduce el uso injustificado de fondos en un 40%."
  },
  { id: "femer-3-15", stepType: "summary", title: "Blindaje Completado", body: "Has visto el dónde, el cuánto y el por qué. Estás listo para blindar tu vida financiera. Siguiente: El Retiro.", fullScreen: true },
]
