import type { LessonStep } from "@/types/lessonTypes"

/**
 * Subtema 11: Planeación y Metas
 * 
 * Lessons expanded to 15 slides following the BIZEN Blueprint.
 * Focus: SMART goals, organizing money, and healthy habits.
 */

// ==============================================================================
// LECCIÓN 1: ¿Cómo establecer metas financieras? - 15 SLIDES
// ==============================================================================
export const lessonMetasFinancierasPersonalesSteps: LessonStep[] = [
  { id: "plan-1-1", stepType: "billy_talks", body: "Tener un deseo no es lo mismo que tener una meta. Si no sabes a dónde vas, cualquier camino te dejará perdido. Vamos a aprender a ponerle coordenadas a tus sueños.", fullScreen: true,
    data: { glossary: [{ word: "Meta SMART", definition: "Metodología para definir objetivos que sean Específicos, Medibles, Alcanzables, Relevantes y con un Tiempo definido." }] }
  },
  { id: "plan-1-2", stepType: "info", title: "El Método SMART", body: "S: Específica (¿Qué quiero exactamente?)\nM: Medible (¿Cuánto dinero es?)\nA: Alcanzable (¿Es realista con mi ingreso?)\nR: Relevante (¿Por qué me importa?)\nT: Tiempo (¿Para qué fecha lo tendré?)", fullScreen: true,
    aiInsight: "Las personas que escriben sus metas y les ponen una fecha de cumplimiento tienen un 42% más de probabilidades de lograrlas."
  },
  { id: "plan-1-3", stepType: "impulse_meter", instructions: "Mantén pulsado y visualiza tu meta más grande. Siente la satisfacción de lograrla. Respira enfoque.", item: { name: "Brújula de Metas", price: "0.00", imageUrl: "/billy-breathing.png" }, holdTime: 5, fullScreen: true },
  { id: "plan-1-4", stepType: "mcq", question: "¿Qué le falta a la meta: 'Quiero ahorrar para mi casa'?", options: [{id:"o1", label:"Ganas de hacerlo", isCorrect:false}, {id:"o2", label:"Monto exacto, plazo de tiempo y un plan de ahorro mensual", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "plan-1-5", stepType: "swipe_sorter", question: "¿Es una Meta SMART?", leftBucket: {label:"SMART", color:"#10b981"}, rightBucket: {label:"Solo un sueño", color:"#ef4444"}, items: [{id:"i1", label:"Juntar $50,000 para diciembre 2025", correctBucket:"left"}, {id:"i2", label:"Tener mucho dinero algún día", correctBucket:"right"}, {id:"i3", label:"Pagar mi deuda de $10k en 5 meses", correctBucket:"left"}, {id:"i4", label:"Viajar por el mundo pronto", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "plan-1-6", stepType: "info", title: "Plazos de Tiempo", body: "Corto Plazo: Menos de 1 año (Fondo de emergencia, vacaciones).\nMediano Plazo: 1 a 5 años (Enganche de casa, maestría).\nLargo Plazo: Más de 5 años (Retiro, educación de hijos).", fullScreen: true },
  { id: "plan-1-7", stepType: "true_false", statement: "Es mejor tener 10 metas al mismo tiempo para avanzar rápido.", correctValue: false, explanation: "Falso. La dispersión de energía es el enemigo. Enfócate en 2 o 3 metas prioritarias para asegurar que las cumplas.", isAssessment:true, fullScreen: true },
  { id: "plan-1-8", stepType: "order", question: "Prioridad BIZEN", items: [{id: "p1", label: "Eliminar deudas caras", correctOrder: 1}, {id: "p2", label: "Fondo de emergencia", correctOrder: 2}, {id: "p3", label: "Inversión para retiro", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "plan-1-9", stepType: "blitz_challenge", question: "¿Qué significa la 'M' en SMART?", options: [{id:"o1", label:"Medible", isCorrect:true}, {id:"o2", label:"Mañana", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "plan-1-10", stepType: "blitz_challenge", question: "¿Cuál es el primer paso antes de invertir?", options: [{id:"o1", label:"Saber cuánto dinero necesitas ahorrar al mes", isCorrect:true}, {id:"o2", label:"Comprar acciones", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "plan-1-11", stepType: "match", question: "Relaciona el Plazo", leftItems: [{id:"l1", label:"Corto"}, {id:"l2", label:"Mediano"}, {id:"l3", label:"Largo"}], rightItems: [{id:"r1", label:"Cena de aniversario"}, {id:"r2", label:"Cambio de coche"}, {id:"r3", label:"Libertad Financiera"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}, {leftId:"l3", rightId:"r3"}], isAssessment: true, fullScreen: true },
  { id: "plan-1-12", stepType: "mindset_translator", question: "Refactoriza tu futuro", beliefs: [{id: "b1", original: "No planeo porque la vida da muchas vueltas.", healthyOptions: [{id: "h1", label: "Planeo para estar preparado ante las vueltas que dé la vida", isCorrect: true}, {id: "h2", label: "El destino decidirá por mí", isCorrect: false}]}] },
  { id: "plan-1-13", stepType: "narrative_check", question: "¿Cuál es la meta financiera que más te emociona lograr este año?", promptPlaceholder: "Mi meta es ...", minChars: 15, billyResponse: "Excelente elección. Conviértela en SMART y será inevitable.", fullScreen: true },
  { id: "plan-1-14", stepType: "info", title: "Alerta de Ingeniería", body: "Divide y vencerás. Si tu meta es de $100,000 a un año, no pienses en los $100k. Piensa en los $8,333 que necesitas este mes. Menos carga cognitiva, más ejecución.", fullScreen: true,
    aiInsight: "El cerebro libera dopamina con cada pequeña meta lograda, lo cual te automotiva para seguir con la siguiente."
  },
  { id: "plan-1-15", stepType: "summary", title: "Ruta Trazada", body: "Ya sabes cómo definir metas. Siguiente: Organización del dinero.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 2: ¿Cómo organizar mejor tu dinero? - 15 SLIDES
// ==============================================================================
export const lessonOrganizacionDineroSteps: LessonStep[] = [
  { id: "plan-2-1", stepType: "billy_talks", body: "Tener tu dinero todo mezclado en una sola cuenta es como tener tu ropa limpia y sucia en el mismo cajón. Un caos. Vamos a diseñar tu sistema de compartimentos.", fullScreen: true,
    data: { glossary: [{ word: "Apartados", definition: "Segmentos virtuales de una cuenta bancaria destinados a un fin específico sin mezclarse con el saldo disponible." }, { word: "Págate a ti primero", definition: "Hábito de separar el ahorro inmediatamente al recibir el ingreso, antes de pagar cualquier otro gasto." }] }
  },
  { id: "plan-2-2", stepType: "info", title: "La Arquitectura de Cuentas", body: "Necesitas tres niveles: 1) Cuenta HUB (donde llega la nómina y se pagan facturas), 2) Bóveda de Emergencia (en una SOFIPO a la vista), 3) Cuentas de Inversión (para tus metas SMART).", fullScreen: true,
    aiInsight: "Automatizar el ahorro el día que recibes tu sueldo reduce el estrés financiero en un 60%."
  },
  { id: "plan-2-3", stepType: "impulse_meter", instructions: "Mantén pulsado y siente cómo el dinero fluye a cada cajón correspondiente. Todo en orden. Respira claridad organizacional.", item: { name: "Filtro de Dinero", price: "0.00", imageUrl: "/billy-breathing.png" }, holdTime: 6, fullScreen: true },
  { id: "plan-2-4", stepType: "mcq", question: "¿Qué significa 'Págate a ti primero'?", options: [{id:"o1", label:"Ir a comprarte un regalo en cuanto cobras", isCorrect:false}, {id:"o2", label:"Separar tu ahorro para inversión antes de pagar renta, luz o deudas", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "plan-2-5", stepType: "swipe_sorter", question: "¿A qué compartimento va?", leftBucket: {label:" HUB / Gastos", color:"#3b82f6"}, rightBucket: {label:"Bóveda / Ahrorro", color:"#10b981"}, items: [{id:"i1", label:"Pago de la luz", correctBucket:"left"}, {id:"i2", label:"$500 para retiro", correctBucket:"right"}, {id:"i3", label:"Súper de la semana", correctBucket:"left"}, {id:"i4", label:"Fondo para vacaciones", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "plan-2-6", stepType: "info", title: "Cajitas y Apartados", body: "Usa la tecnología. Casi todos los neobancos y bancos tradicionales tienen 'Apartados'. Ponle nombre a cada uno: 'Renta', 'Súper', 'Seguro Coche'. Si el saldo principal dice $0, no gastas de más.", fullScreen: true },
  { id: "plan-2-7", stepType: "true_false", statement: "Es mejor guardar el ahorro debajo del colchón para tenerlo a la mano.", correctValue: false, explanation: "Falso. El efectivo pierde valor por inflación y es fácil de gastar. Guárdalo en un apartado digital que genere rendimiento.", isAssessment:true, fullScreen: true },
  { id: "plan-2-8", stepType: "order", question: "El Ciclo de la Nómina", items: [{id: "p1", label: "Recibir Dinero", correctOrder: 1}, {id: "p2", label: "Mover a Inversión", correctOrder: 2}, {id: "p3", label: "Pagar Gastos Fijos", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "plan-2-9", stepType: "blitz_challenge", question: "¿Para qué sirve el saldo principal en $0?", options: [{id:"o1", label:"Para no gastar dinero que ya está destinado a otra cosa", isCorrect:true}, {id:"o2", label:"Para que no me cobren impuestos", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "plan-2-10", stepType: "blitz_challenge", question: "¿Cuál es la frecuencia ideal para revisar tu presupuesto?", options: [{id:"o1", label:"Mensual o quincenal", isCorrect:true}, {id:"o2", label:"Una vez al año", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "plan-2-11", stepType: "match", question: "Relaciona el Destino", leftItems: [{id:"l1", label:"Gasto Variable"}, {id:"l2", label:"Inversión"}, {id:"l3", label:"Gasto Fijo"}], rightItems: [{id:"r1", label:"Salida con amigos"}, {id:"r2", label:"CETES"}, {id:"r3", label:"Renta"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}, {leftId:"l3", rightId:"r3"}], isAssessment: true, fullScreen: true },
  { id: "plan-2-12", stepType: "mindset_translator", question: "Refactoriza tu orden", beliefs: [{id: "b1", original: "El orden limita mi libertad.", healthyOptions: [{id: "h1", label: "El orden financiero es la base de mi verdadera libertad", isCorrect: true}, {id: "h2", label: "Vivir al día es mejor", isCorrect: false}]}] },
  { id: "plan-2-13", stepType: "narrative_check", question: "¿Cuántos apartados o 'cajitas' crees que necesitas hoy?", promptPlaceholder: "Necesito al menos ...", minChars: 15, billyResponse: "Empezar con 3 o 4 es ideal para no complicarte al inicio.", fullScreen: true },
  { id: "plan-2-14", stepType: "info", title: "Alerta de Ingeniería", body: "Automatiza. Si tu banco permite programar transferencias a tus apartados el día 15 y 30, hazlo. Elimina la voluntad del proceso y el sistema funcionará solo.", fullScreen: true,
    aiInsight: "Las personas que usan apartados gastan en promedio un 15% menos en compras impulsivas."
  },
  { id: "plan-2-15", stepType: "summary", title: "Orden Establecido", body: "Has visto cómo organizar tu flujo. Siguiente: Hábitos saludables.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 3: ¿Qué hábitos financieros son saludables? - 15 SLIDES
// ==============================================================================
export const lessonHabitosFinancierosSteps: LessonStep[] = [
  { id: "plan-3-1", stepType: "billy_talks", body: "Tus hábitos son las micro-decisiones que te hacen rico o pobre a largo plazo. No es un gran esfuerzo un día, es un pequeño esfuerzo todos los días.", fullScreen: true,
    data: { glossary: [{ word: "Hábito Financiero", definition: "Acción repetitiva y automática relacionada con el manejo, ahorro o gasto del dinero." }] }
  },
  { id: "plan-3-2", stepType: "info", title: "El Poder de lo Pequeño", body: "Hábito 1: Registrar gastos (aunque sea de $10 pesos).\nHábito 2: Esperar 24h antes de una compra grande.\nHábito 3: Auditar tus suscripciones cada mes.\nHábito 4: Ignorar el 'status' y priorizar el patrimonio.", fullScreen: true,
    aiInsight: "El 80% de los millonarios de primera generación atribuyen su éxito a la disciplina de sus hábitos, no a la suerte."
  },
  { id: "plan-3-3", stepType: "impulse_meter", instructions: "Mantén pulsado y siente la resistencia al gasto impulsivo. Tú tienes el control. Respira disciplina.", item: { name: "Escudo de Hábitos", price: "0.00", imageUrl: "/billy-breathing.png" }, holdTime: 6, fullScreen: true },
  { id: "plan-3-4", stepType: "mcq", question: "¿Qué hábito ayuda más a evitar la 'fuga de dinero'?", options: [{id:"o1", label:"Comprar cuando hay descuentos", isCorrect:false}, {id:"o2", label:"Registrar todos tus gastos para identificar a dónde se va el dinero", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "plan-3-5", stepType: "swipe_sorter", question: "¿Es un hábito saludable?", leftBucket: {label:"Saludable", color:"#10b981"}, rightBucket: {label:"Tóxico", color:"#ef4444"}, items: [{id:"i1", label:"Revisar estados de cuenta", correctBucket:"left"}, {id:"i2", label:"Pagar solo el mínimo", correctBucket:"right"}, {id:"i3", label:"Comparar precios antes de comprar", correctBucket:"left"}, {id:"i4", label:"Gastar más si recibo un bono", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "plan-3-6", stepType: "info", title: "La Regla de las 24 Horas", body: "¿Quieres esos tenis nuevos? Déjalos en el carrito de compras y espera 24 horas. Si al día siguiente los sigues necesitando y están en presupuesto, adelante. En el 70% de los casos, el deseo desaparece.", fullScreen: true },
  { id: "plan-3-7", stepType: "true_false", statement: "Anotar un café de $50 pesos es una pérdida de tiempo.", correctValue: false, explanation: "Falso. La suma de muchos pequeños gastos (gastos hormiga) puede representar miles de pesos al mes que no sabes en qué se fueron.", isAssessment:true, fullScreen: true },
  { id: "plan-3-8", stepType: "order", question: "Fuerza de un Hábito", items: [{id: "p1", label: "Decisión Consciente", correctOrder: 1}, {id: "p2", label: "Repetición Diaria", correctOrder: 2}, {id: "p3", label: "Acción Automática", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "plan-3-9", stepType: "blitz_challenge", question: "¿Cómo se llama el gasto pequeño que parece inofensivo?", options: [{id:"o1", label:"Gasto Hormiga", isCorrect:true}, {id:"o2", label:"Gasto Elefante", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "plan-3-10", stepType: "blitz_challenge", question: "¿Qué hacer con las suscripciones que no usas?", options: [{id:"o1", label:"Cancelarlas de inmediato", isCorrect:true}, {id:"o2", label:"Dejarlas por si acaso", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "plan-3-11", stepType: "match", question: "Relaciona el Hábito", leftItems: [{id:"l1", label:"Registro"}, {id:"l2", label:"Pausa"}, {id:"l3", label:"Estudio"}], rightItems: [{id:"r1", label:"Saber en qué gastas"}, {id:"r2", label:"Evitar impulso"}, {id:"r3", label:"Educación constante"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}, {leftId:"l3", rightId:"r3"}], isAssessment: true, fullScreen: true },
  { id: "plan-3-12", stepType: "mindset_translator", question: "Refactoriza tu disciplina", beliefs: [{id: "b1", original: "Solo se vive una vez (YOLO).", healthyOptions: [{id: "h1", label: "Solo se vive una vez, por eso quiero vivirla con tranquilidad financiera", isCorrect: true}, {id: "h2", label: "Gástate todo hoy", isCorrect: false}]}] },
  { id: "plan-3-13", stepType: "narrative_check", question: "¿Cuál es el 'gasto hormiga' que más detectas en tu día a día?", promptPlaceholder: "Gasto mucho en ...", minChars: 15, billyResponse: "Identificarlo es el 50% de la batalla. El otro 50% es reducirlo.", fullScreen: true },
  { id: "plan-3-14", stepType: "info", title: "Alerta de Ingeniería", body: "Recompensa tu disciplina. Si lograste tu meta de ahorro del mes, date un pequeño premio programado. Usa la psicología a tu favor para reforzar el hábito positivo.", fullScreen: true,
    aiInsight: "Un hábito nuevo tarda en promedio 66 días en formarse completamente."
  },
  { id: "plan-3-15", stepType: "summary", title: "Hábitos Blindados", body: "Has completado Tema 2. Tienes el sistema, las metas y los hábitos. ¡Nivel completado!", fullScreen: true },
]
