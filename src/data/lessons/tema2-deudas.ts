import type { LessonStep } from "@/types/lessonTypes"

/**
 * Subtema 8 & 10: Deuda y Préstamos
 * 
 * Lessons expanded to 15 slides following the BIZEN Blueprint.
 * Focus: Definition of debt, good vs bad debt, and repayment methods.
 */

// ==============================================================================
// LECCIÓN 1: ¿Qué es la deuda? - 15 SLIDES
// ==============================================================================
export const lessonQueEsLaDeudaSteps: LessonStep[] = [
  { id: "deu-1-1", stepType: "billy_talks", body: "La deuda no es buena ni mala, es solo una herramienta. Pero si no sabes usarla, puede ser el ancla que hunda tu barco financiero. Vamos a entender qué es realmente.", fullScreen: true,
    data: { glossary: [{ word: "Deuda", definition: "Obligación de pagar dinero a un tercero bajo ciertas condiciones y plazos." }, { word: "Interés", definition: "El costo de pedir prestado dinero; lo que pagas por usar capital ajeno." }] }
  },
  { id: "deu-1-2", stepType: "info", title: "Comprando Tiempo", body: "La deuda es una máquina del tiempo. Te permite traer dinero de tu futuro (tu trabajo de los próximos meses) al presente. El costo de ese viaje en el tiempo se llama interés.", fullScreen: true,
    aiInsight: "El 54% de los usuarios de tarjeta de crédito en México no paga el total de su deuda cada mes, regalando miles de millones en intereses a los bancos."
  },
  { id: "deu-1-3", stepType: "impulse_meter", instructions: "Mantén pulsado y siente el peso de la deuda sobre tus hombros. Visualiza la responsabilidad. Respira consciencia.", item: { name: "Ancla de Deuda", price: "0.00", imageUrl: "/billy-breathing.png" }, holdTime: 5, fullScreen: true },
  { id: "deu-1-4", stepType: "mcq", question: "¿Qué sucede realmente cuando pides un préstamo?", options: [{id:"o1", label:"El banco me regala dinero", isCorrect:false}, {id:"o2", label:"Estoy comprometiendo mi trabajo futuro para pagar algo hoy", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "deu-1-5", stepType: "swipe_sorter", question: "¿Es una Deuda o un Ingreso?", leftBucket: {label:"Deuda", color:"#ef4444"}, rightBucket: {label:"Ingreso", color:"#10b981"}, items: [{id:"i1", label:"Préstamo personal", correctBucket:"left"}, {id:"i2", label:"Salario mensual", correctBucket:"right"}, {id:"i3", label:"Tarjeta de crédito", correctBucket:"left"}, {id:"i4", label:"Rendimiento de inversión", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "deu-1-6", stepType: "info", title: "El Costo del Dinero (CAT)", body: "El Costo Anual Total (CAT) es la cifra real que debes mirar. Incluye intereses, comisiones y seguros. Un CAT del 80% significa que por cada $100 que pides, devuelves $180 al año.", fullScreen: true },
  { id: "deu-1-7", stepType: "true_false", statement: "Es posible vivir sin deudas en el mundo moderno.", correctValue: true, explanation: "Absolutamente. Requiere planeación y ahorro, pero vivir libre de deudas es la base de la verdadera riqueza.", isAssessment:true, fullScreen: true },
  { id: "deu-1-8", stepType: "order", question: "Componentes del Préstamo", items: [{id: "p1", label: "Capital (Lo que pides)", correctOrder: 1}, {id: "p2", label: "Interés (El costo)", correctOrder: 2}, {id: "p3", label: "Plazo (El tiempo)", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "deu-1-9", stepType: "blitz_challenge", question: "¿Qué pasa si dejas de pagar una deuda?", options: [{id:"o1", label:"Tu historial crediticio se daña", isCorrect:true}, {id:"o2", label:"No pasa nada", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "deu-1-10", stepType: "blitz_challenge", question: "¿Qué es el 'pago mínimo'?", options: [{id:"o1", label:"Una trampa para que pagues más intereses", isCorrect:true}, {id:"o2", label:"Un beneficio del banco", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "deu-1-11", stepType: "match", question: "Relaciona el Término", leftItems: [{id:"l1", label:"Principal"}, {id:"l2", label:"CAT"}, {id:"l3", label:"Mora"}], rightItems: [{id:"r1", label:"Monto prestado"}, {id:"r2", label:"Costo real anual"}, {id:"r3", label:"Retraso en pago"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}, {leftId:"l3", rightId:"r3"}], isAssessment: true, fullScreen: true },
  { id: "deu-1-12", stepType: "mindset_translator", question: "Refactoriza tu crédito", beliefs: [{id: "b1", original: "Si el banco me presta es porque puedo pagarlo.", healthyOptions: [{id: "h1", label: "El banco presta para ganar intereses, solo yo sé mi capacidad real de pago", isCorrect: true}, {id: "h2", label: "El banco es mi amigo", isCorrect: false}]}] },
  { id: "deu-1-13", stepType: "narrative_check", question: "¿Qué deuda tienes hoy que te gustaría eliminar por completo?", promptPlaceholder: "Me gustaría eliminar ...", minChars: 15, billyResponse: "Anotado. Visualizar ese momento de libertad es el combustible para lograrlo.", fullScreen: true },
  { id: "deu-1-14", stepType: "info", title: "Alerta de Ingeniería", body: "La deuda es como la presión en una tubería. Un poco puede ayudar al flujo (crecimiento), pero demasiada hará que todo el sistema reviente. Mantén la presión bajo control.", fullScreen: true,
    aiInsight: "Pagar tu tarjeta de crédito en su totalidad cada mes te da acceso a las mejores tasas de préstamo para casa o negocio en el futuro."
  },
  { id: "deu-1-15", stepType: "summary", title: "Deuda Definida", body: "Has visto la naturaleza de la deuda. Siguiente: Deuda Buena vs Deuda Mala.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 2: Deuda buena vs. deuda mala - 15 SLIDES
// ==============================================================================
export const lessonDeudaBuenaVsMalaSteps: LessonStep[] = [
  { id: "deu-2-1", stepType: "billy_talks", body: "No todos los préstamos son iguales. Algunos te hacen más pobre, otros te ayudan a ser más rico. Vamos a aprender a distinguirlos con precisión láser.", fullScreen: true,
    data: { glossary: [{ word: "Deuda Buena", definition: "Préstamo que se usa para adquirir activos que generan más dinero de lo que cuesta el interés." }, { word: "Deuda Mala", definition: "Préstamo usado para comprar bienes que pierden valor o que son consumibles." }] }
  },
  { id: "deu-2-2", stepType: "info", title: "La Regla de Oro", body: "Si la deuda pone dinero en tu bolsillo (negocio, inversión), es buena. Si saca dinero de tu bolsillo para cosas que se gastan o deprecian (ropa, vacaciones, televisores), es mala.", fullScreen: true,
    aiInsight: "Pedir prestado para educación técnica o profesional suele tener un retorno de inversión (ROI) del 300% a lo largo de la vida."
  },
  { id: "deu-2-3", stepType: "impulse_meter", instructions: "Mantén pulsado y siente la diferencia entre una inversión y un gasto. Respira discernimiento.", item: { name: "Balanza de Deuda", price: "0.00", imageUrl: "/billy-breathing.png" }, holdTime: 6, fullScreen: true },
  { id: "deu-2-4", stepType: "mcq", question: "¿Qué ejemplo se considera generalmente Deuda Buena?", options: [{id:"o1", label:"Un préstamo para irte de vacaciones", isCorrect:false}, {id:"o2", label:"Una hipoteca para una casa bien elegida o un crédito para equipos de negocio", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "deu-2-5", stepType: "swipe_sorter", question: "¿Buena o Mala?", leftBucket: {label:"Buena", color:"#10b981"}, rightBucket: {label:"Mala", color:"#ef4444"}, items: [{id:"i1", label:"Educación técnica", correctBucket:"left"}, {id:"i2", label:"iPhone a 24 meses", correctBucket:"right"}, {id:"i3", label:"Maquinaria para taller", correctBucket:"left"}, {id:"i4", label:"Cena con la tarjeta", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "deu-2-6", stepType: "info", title: "Deuda de Consumo", body: "Es la más peligrosa. Pagas intereses por cosas que ya no existen o que valen la mita apenas las sacas de la tienda. Los 'Meses Sin Intereses' son una trampa de flujo si abusas de ellos.", fullScreen: true },
  { id: "deu-2-7", stepType: "true_false", statement: "Un crédito hipotecario siempre es deuda buena.", correctValue: false, explanation: "Depende. Si la casa es más cara de lo que puedes pagar o no aumenta de valor, puede ser un ancla. Debe ser una decisión estratégica.", isAssessment:true, fullScreen: true },
  { id: "deu-2-8", stepType: "order", question: "Criterios de Evaluación", items: [{id: "p1", label: "¿Genera Ingresos?", correctOrder: 1}, {id: "p2", label: "¿La tasa es baja?", correctOrder: 2}, {id: "p3", label: "¿Puedo pagarla hoy?", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "deu-2-9", stepType: "blitz_challenge", question: "¿Cómo se llama cuando usas deuda para aumentar tus ganancias?", options: [{id:"o1", label:"Apalancamiento", isCorrect:true}, {id:"o2", label:"Ahorro", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "deu-2-10", stepType: "blitz_challenge", question: "¿Qué sucede con el valor de un coche nada más salir de la agencia?", options: [{id:"o1", label:"Baja un 20-30% de inmediato", isCorrect:true}, {id:"o2", label:"Sube de precio", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "deu-2-11", stepType: "match", question: "Relaciona el Efecto", leftItems: [{id:"l1", label:"Compra Activos"}, {id:"l2", label:"Compra Deseos"}], rightItems: [{id:"r1", label:"Te hace rico"}, {id:"r2", label:"Te hace pobre"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}], isAssessment: true, fullScreen: true },
  { id: "deu-2-12", stepType: "mindset_translator", question: "Refactoriza tu compra", beliefs: [{id: "b1", original: "Merezco este lujo aunque lo deba.", healthyOptions: [{id: "h1", label: "Merezco la paz mental de no deberle nada a nadie", isCorrect: true}, {id: "h2", label: "La deuda es estatus", isCorrect: false}]}] },
  { id: "deu-2-13", stepType: "narrative_check", question: "¿Cuál es la 'deuda mala' más común entre tus conocidos?", promptPlaceholder: "Muchos deben ...", minChars: 15, billyResponse: "Cierto. Identificar los errores ajenos ayuda a no cometerlos nosotros.", fullScreen: true },
  { id: "deu-2-14", stepType: "info", title: "Alerta de Ingeniería", body: "Antes de tomar cualquier deuda, pregunta: ¿Este dinero me va a ayudar a ganar más dinero o me va a obligar a trabajar más meses solo para pagarlo?", fullScreen: true,
    aiInsight: "El apalancamiento es un multiplicador. Si tu negocio es bueno, lo hace genial. Si tu negocio es malo, lo hace quebrar más rápido."
  },
  { id: "deu-2-15", stepType: "summary", title: "Clasificación Dominada", body: "Ya sabes distinguir la deuda. Siguiente: Métodos para pagarla.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 3: ¿Qué métodos existen para pagar deudas? - 15 SLIDES
// ==============================================================================
export const lessonMetodosPagarDeudasSteps: LessonStep[] = [
  { id: "deu-3-1", stepType: "billy_talks", body: "Si ya estás en un hoyo, lo primero es dejar de cavar. Vamos a diseñar tu plan de escape militar para erradicar esas deudas de una vez por todas.", fullScreen: true,
    data: { glossary: [{ word: "Método Bola de Nieve", definition: "Estrategia que prioriza pagar las deudas de menor a mayor monto para ganar motivación." }, { word: "Método Avalancha", definition: "Estrategia que prioriza pagar las deudas con la tasa de interés más alta primero." }] }
  },
  { id: "femer-3-14", stepType: "info", title: "El Poder del Enfoque", body: "No intentes pagar un poco a todas. Elige una víctima, golpéala con todo tu excedente de capital y mantén el pago mínimo en las demás. Una por una caen los gigantes.", fullScreen: true,
    aiInsight: "Las personas que usan el método 'Bola de Nieve' tienen un 22% más de probabilidades de terminar de pagar sus deudas gracias al éxito psicológico temprano."
  },
  { id: "deu-3-3", stepType: "impulse_meter", instructions: "Mantén pulsado y siente cómo una deuda desaparece. Siente la descarga de adrenalina. Respira victoria.", item: { name: "Destructor de Deuda", price: "0.00", imageUrl: "/billy-breathing.png" }, holdTime: 6, fullScreen: true },
  { id: "deu-3-4", stepType: "mcq", question: "¿Qué método es matemáticamente más eficiente (ahorras más intereses)?", options: [{id:"o1", label:"Método Bola de Nieve", isCorrect:false}, {id:"o2", label:"Método Avalancha (Interés más alto primero)", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "deu-3-5", stepType: "swipe_sorter", question: "¿A cuál ataco primero?", leftBucket: {label:"Bola de Nieve", color:"#3b82f6"}, rightBucket: {label:"Avalancha", color:"#f59e0b"}, items: [{id:"i1", label:"La deuda de $500 pesos", correctBucket:"left"}, {id:"i2", label:"La tarjeta con 90% de interés", correctBucket:"right"}, {id:"i3", label:"El préstamo más pequeño", correctBucket:"left"}, {id:"i4", label:"La deuda más cara", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "deu-3-6", stepType: "info", title: "Recortar y Reinyectar", body: "Para salir rápido necesitas 'combustible'. Recorta tus gastos variables (suscripciones, salidas) y usa todo ese dinero para abonar a capital en tu deuda objetivo. Es temporal, la libertad es permanente.", fullScreen: true },
  { id: "deu-3-7", stepType: "true_false", statement: "Consolidar deudas (pedir un préstamo barato para pagar 5 caros) siempre es buena idea.", correctValue: true, explanation: "Si la tasa del nuevo préstamo es menor a la de los anteriores y CANCELAS las tarjetas viejas, es una jugada maestra de ingeniería.", isAssessment:true, fullScreen: true },
  { id: "deu-3-8", stepType: "order", question: "Protocolo de Ataque", items: [{id: "p1", label: "Hacer lista de deudas", correctOrder: 1}, {id: "p2", label: "Elegir método (Nieve/Avalancha)", correctOrder: 2}, {id: "p3", label: "Ejecutar pagos agresivos", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "deu-3-9", stepType: "blitz_challenge", question: "¿Qué debes hacer con tus tarjetas mientras pagas?", options: [{id:"o1", label:"Congelarlas o cortarlas", isCorrect:true}, {id:"o2", label:"Seguir usándolas para puntos", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "deu-3-10", stepType: "blitz_challenge", question: "¿Qué es lo primero antes de pagar deudas agresivo?", options: [{id:"o1", label:"Tener un mini-fondo de emergencia", isCorrect:true}, {id:"o2", label:"Vender mi coche", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "deu-3-11", stepType: "match", question: "Relaciona el Método", leftItems: [{id:"l1", label:"Bola de Nieve"}, {id:"l2", label:"Avalancha"}, {id:"l3", label:"Consolidación"}], rightItems: [{id:"r1", label:"Éxito Psicológico"}, {id:"r2", label:"Ahorro Matemático"}, {id:"r3", label:"Unificación de Tasa"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}, {leftId:"l3", rightId:"r3"}], isAssessment: true, fullScreen: true },
  { id: "deu-3-12", stepType: "mindset_translator", question: "Refactoriza tu escape", beliefs: [{id: "b1", original: "Nunca saldré de esta.", healthyOptions: [{id: "h1", label: "Con un sistema y disciplina, mi deuda tiene fecha de muerte", isCorrect: true}, {id: "h2", label: "El banco es más fuerte", isCorrect: false}]}] },
  { id: "deu-3-13", stepType: "narrative_check", question: "¿Cuál de los dos métodos (Nieve o Avalancha) prefieres usar y por qué?", promptPlaceholder: "Prefiero ... porque ...", minChars: 15, billyResponse: "Cualquiera que elijas es mejor que no tener plan. ¡A darle!", fullScreen: true },
  { id: "deu-3-14", stepType: "info", title: "Alerta de Ingeniería", body: "No negocies con el bando perdedor. Una vez que inicies tu plan de pagos, no aceptes 'nuevas líneas de crédito' o 'promociones'. Estás en guerra contra la deuda, no en una tregua.", fullScreen: true,
    aiInsight: "Llamar al banco para negociar una tasa de interés más baja tiene éxito en el 50% de los casos si tienes buen historial previo."
  },
  { id: "deu-3-15", stepType: "summary", title: "Plan de Escape Listo", body: "Tienes las herramientas para ser libre. Siguiente: Instituciones Financieras.", fullScreen: true },
]
