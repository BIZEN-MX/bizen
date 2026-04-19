import type { LessonStep } from "@/types/lessonTypes"

/**
 * TEMA 1: Lección 14 - El Salario de tu 'Yo del Futuro'
 * 15 SLIDES - BIZEN BLUEPRINT
 */

export const lessonElSalarioDeTuYoDelFuturoSteps: LessonStep[] = [
  { id: "sal-1-1", stepType: "billy_talks", body: "Cada vez que gastas todo lo que ganas, estás robándole el salario a una persona: a tu 'Yo del Futuro'. Vamos a diseñar tu primer fondo de libertad.", fullScreen: true,
    data: { glossary: [{ word: "Ahorro para el Futuro", definition: "Diferir el consumo presente para garantizar la seguridad o inversión futura." }, { word: "Interés Compuesto", definition: "El beneficio generado por el capital inicial más los intereses previos acumulados." }] }
  },
  { id: "sal-1-2", stepType: "info", title: "Págate a Tí Primero", body: "La mayoría de la gente paga la renta, el súper y las deudas, y 'si sobra', ahorra. Eso es un error de ingeniería. La primera transferencia del mes debe ser para TU futuro. El ahorro es un gasto fijo con tu libertad.", fullScreen: true,
    aiInsight: "Invertir un 10% de tus ingresos desde los 25 años puede retirarte con una riqueza 5 veces mayor que empezar a los 40."
  },
  { id: "sal-1-3", stepType: "mcq", question: "Si hoy separas $100 y no los tocas en 20 años bajo interés, ¿qué hiciste?", options: [{id:"o1", label:"Lo ahorré (Perdí el uso hoy)", isCorrect:false}, {id:"o2", label:"Le pagué un salario a mi 'Yo' del futuro", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "sal-1-4", stepType: "swipe_sorter", question: "¿Estás Robando o Pagando a tu Futuro?", leftBucket: {label:"Pagando (Dignidad)", color:"#10b981"}, rightBucket: {label:"Robando (Esclavitud)", color:"#ef4444"}, items: [{id:"i1", label:"Gastar el bono en un viaje impulsivo", correctBucket:"right"}, {id:"i2", label:"Separar el 10% de nómina fijo", correctBucket:"left"}, {id:"i3", label:"Comprar algo a MSI innecesario", correctBucket:"right"}, {id:"i4", label:"Aportación voluntaria a AFORE/ETF", correctBucket:"left"}], isAssessment: true, fullScreen: true },
  { id: "sal-1-5", stepType: "info", title: "La Trampa de la Gratificación Inmediata", body: "Tu cerebro biológico quiere dopamina HOY. Tu mente racional quiere libertad MAÑANA. BIZEN es el software que ayuda a ganar la batalla técnica por el control del tiempo.", fullScreen: true },
  { id: "sal-1-6", stepType: "true_false", statement: "Es mejor esperar a ganar 'mucho más' para empezar a separar un salario para el futuro.", correctValue: false, explanation: "El hábito es más importante que la cantidad al principio. La inercia del ahorro se construye con el primer peso.", isAssessment:true, fullScreen: true },
  { id: "sal-1-7", stepType: "order", question: "Tu Nueva Cascada de Nómina", items: [{id:"p1", label: "Recibir Ingreso", correctOrder: 1}, {id: "p2", label: "Separar Salario del Futuro (10%+)", correctOrder: 2}, {id: "p3", label: "Pagar gastos de vida con el 90% restante", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "sal-1-8", stepType: "blitz_challenge", question: "¿Cuál es la moneda de cambio del retiro?", options: [{id:"o1", label:"El Tiempo expuesto al interés", isCorrect:true}, {id:"o2", label:"La Cantidad única ahorrada", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "sal-1-9", stepType: "blitz_challenge", question: "¿Qué sucede si solo vives el presente?", options: [{id:"o1", label:"Eres feliz siempre", isCorrect:false}, {id:"o2", label:"Te vuelves esclavo del trabajo de por vida", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "sal-1-10", stepType: "match", question: "Relaciona Factor con Impacto", leftItems: [{id:"l1", label:"Ahorro constante"}, {id:"l2", label:"Tiempo largo"}, {id:"l3", label:"Interés alto"}], rightItems: [{id:"r1", label:"Base de capital"}, {id:"r2", label:"Efecto bola de nieve"}, {id:"r3", label:"Acelerador de riqueza"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}, {leftId:"l3", rightId:"r3"}], isAssessment: true, fullScreen: true },
  { id: "sal-1-11", stepType: "impulse_meter", instructions: "Mantén pulsado y visualiza décadas de paz financiera. Respira seguridad. Siente el pago de tu salario futuro.", item: { name: "Acelerador Temporal", price: "0.00", imageUrl: "/billy-breathing.png" }, holdTime: 6, fullScreen: true },
  { id: "sal-1-12", stepType: "mindset_translator", question: "Refactoriza tu retiro", beliefs: [{id: "b1", original: "No sé si estaré vivo mañana.", healthyOptions: [{id: "h1", label: "Lo más probable es que sí, y prefiero estar vivo con dinero y opciones que sin ellas", isCorrect: true}, {id: "h2", label: "Gastar todo hoy es mi seguro", isCorrect: false}]}] },
  { id: "sal-1-13", stepType: "narrative_check", question: "¿Cuál es el pretexto número 1 que usas para no separar dinero hoy mismo?", promptPlaceholder: "Mi pretexto es ...", minChars: 10, billyResponse: "Elimínalo. No es un pretexto de dinero, es un error de configuración.", fullScreen: true },
  { id: "sal-1-14", stepType: "info", title: "Alerta de Ingeniería", body: "Si no automatizas tu ahorro, lo vas a olvidar o gastar. Usa domiciliaciones bancarias. El sistema debe trabajar por tí sin que intervenga tu voluntad.", fullScreen: true,
    aiInsight: "Las personas con ahorros automatizados ahorran un 200% más que las que lo hacen de forma manual cada mes."
  },
  { id: "sal-1-15", stepType: "summary", title: "Salario Asegurado", body: "Has pagado tu cuota de libertad. Siguiente: La Auditoría de Supervivencia.", fullScreen: true },
]
