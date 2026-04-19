import type { LessonStep } from "@/types/lessonTypes"

/**
 * Subtema A: Percepción
 * 
 * Lessons are now expanded to 15 slides each following the UPDATED BIZEN Blueprint (2 Blitz, 2+ AI Insights).
 */

// ==============================================================================
// LECCIÓN 1: ¿Qué es el dinero para mí? (Relación actual) - 15 SLIDES
// ==============================================================================
export const lessonQueEsElDineroParaMiSteps: LessonStep[] = [
  { id: "per-1-1", stepType: "billy_talks", mood: "thinking", body: "Antes de hablar de números, hablemos de lo que guía tu vida: tu percepción. ¿Qué es el dinero para tí?", fullScreen: true,
    data: { glossary: [{ word: "Energía Almacenada", definition: "Esfuerzo, tiempo y talento que has invertido y que puedes intercambiar." }, { word: "Percepción", definition: "Marco mental a través del cual interpretas tus recursos financieros." }] }
  },
  { id: "per-1-2", stepType: "info", title: "El Dinero como Espejo", body: "El dinero no es papel; es un lente emocional que refleja tus miedos y valores. **[[Percepción|La forma en que interpretas tu realidad financiera]]** es la clave del juego.", fullScreen: true,
    aiInsight: "La mayoría de las personas no tienen una definición técnica del dinero, solo emocional."
  },
  { id: "per-1-3", stepType: "impulse_meter", instructions: "Mantén pulsado para respirar. Controla el ritmo de tu curiosidad. Siente el control del momento.", item: { name: "Pausa de Control", price: "Libertad", imageUrl: "/billy-breathing.png" }, holdTime: 4, fullScreen: true },
  { id: "per-1-4", stepType: "mcq", question: "Si hoy recibieras $10,000 extra, ¿cuál es tu primera reacción real?", options: [{id:"o1", label:"Alivio (Pago deudas)", isCorrect:true}, {id:"o2", label:"Excitación (Quiero comprar algo)", isCorrect:true}, {id:"o3", label: "Prudencia (¿Cómo lo invierto?)", isCorrect: true}], isAssessment: false, fullScreen: true },
  { id: "per-1-5", stepType: "swipe_sorter", question: "¿Es una Necesidad Vital o un Deseo de Estatus?", leftBucket: {label:"Deseo (Querer)", color:"#ef4444"}, rightBucket: {label:"Necesidad (Tener)", color:"#10b981"}, items: [{id:"i1", label:"Agua potable", correctBucket:"right"}, {id:"i2", label:"Suscripción Premium", correctBucket:"left"}, {id:"i3", label:"Transporte al trabajo", correctBucket:"right"}, {id:"i4", label:"Reloj de marca", correctBucket:"left"}], isAssessment: true, fullScreen: true },
  { id: "per-1-6", stepType: "info", title: "La Tasa de Intercambio Humano", body: "Cuando pagas por algo, no pagas con dinero; pagas con las horas de vida que te tomó ganar ese dinero. Eso es **[[Costo de Vida Real|Valor de un objeto medido en tiempo de vida invertido]]**.", fullScreen: true },
  { id: "per-1-7", stepType: "true_false", statement: "El dinero tiene un valor objetivo que es el mismo para todas las personas.", correctValue: false, explanation: "$1,000 para alguien que no tiene nada es fortuna; para un billonario es redondeo. El valor es SUBJETIVO.", isAssessment:true, fullScreen: true },
  { id: "per-1-8", stepType: "order", question: "Jerarquía de prioridades financieras", items: [{id:"p1", label:"Cubrir necesidades básicas", correctOrder: 1}, {id:"p2", label:"Construir activos de libertad", correctOrder: 2}, {id:"p3", label:"Gasto en deseos/estatus", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "per-1-9", stepType: "blitz_challenge", question: "¿Qué representa el dinero realmente?", options: [{id:"o1", label:"Tu valor humano", isCorrect:false}, {id:"o2", label:"Tu energía almacenada", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "per-1-10", stepType: "blitz_challenge", question: "¿Cual es el primer pilar de BIZEN?", options: [{id:"o1", label:"Miedo", isCorrect:false}, {id:"o2", label:"Percepción", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "per-1-11", stepType: "match", question: "Relaciona Percepción con Resultado", leftItems: [{id:"l1", label:"Dinero como Libertad"}, {id:"l2", label:"Dinero como Seguridad"}], rightItems: [{id:"r1", label:"Capacidad de decir NO"}, {id:"r2", label:"Fondo de tranquilidad"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}], isAssessment: true, fullScreen: true },
  { id: "per-1-12", stepType: "mindset_translator", question: "Traduce tu creencia", beliefs: [{id: "b1", original: "El dinero quema en mis manos.", healthyOptions: [{id: "h1", label: "El dinero es energía que debo usar para construir mi libertad", isCorrect: true}, {id: "h2", label: "Mejor lo gasto antes de que desaparezca", isCorrect: false}]}] },
  { id: "per-1-13", stepType: "narrative_check", question: "¿Qué ha sido lo más valioso que has comprado con tu tiempo?", promptPlaceholder: "He comprado mi ...", minChars: 10, billyResponse: "Atesora esos momentos. Son la verdadera riqueza.", fullScreen: true },
  { id: "per-1-14", stepType: "info", title: "Alerta de Ingeniería", body: "Si no mides lo que el dinero significa para tí, el sistema decidirá por tí. Sé el arquitecto de tu valor.", fullScreen: true,
    aiInsight: "El costo de vida real es la única métrica honesta del intercambio de tu tiempo por objetos."
  },
  { id: "per-1-15", stepType: "summary", title: "Percepción Analizada", body: "Has dado el primer paso. Siguiente: ¿Qué espero del dinero realmente?", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 2: ¿Qué espero del dinero? (Expectativas) - 15 SLIDES
// ==============================================================================
export const lessonQueEsperoDelDineroSteps: LessonStep[] = [
  { id: "per-2-1", stepType: "billy_talks", body: "Esperamos que el dinero cure nuestra soledad, nuestro aburrimiento o nuestra falta de propósito. Spoilers: No lo hace.", fullScreen: true,
    data: { glossary: [{ word: "Propósito", definition: "Razón fundamental de ser que guía las decisiones." }, { word: "Vulnerabilidad", definition: "Estado emocional donde somos más propensos a gastos impulsivos." }] }
  },
  { id: "per-2-2", stepType: "info", title: "La Trampa de la Felicidad Material", body: "Si crees que comprar ese auto te hará feliz permanentemente, estás en una trampa de ingeniería. La felicidad material dura días; la deuda dura meses.", fullScreen: true,
    aiInsight: "La dopamina generada por una compra nueva desaparece en menos de 72 horas."
  },
  { id: "per-2-3", stepType: "impulse_meter", instructions: "Mantén pulsado y visualiza tu vida FELIZ sin el objeto que más deseas hoy. Respira y sonríe.", item: { name: "Ancla de Paz", price: "0.00", imageUrl: "/billy-breathing.png" }, holdTime: 5, fullScreen: true },
  { id: "per-2-4", stepType: "mcq", question: "¿Cuál es la verdadera expectativa que vale la pena tener sobre el dinero?", options: [{id:"o1", label:"Poder comprar todo lo que quiera", isCorrect:false}, {id:"o2", label:"Poder ser dueño de mi tiempo (Libertad)", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "per-2-5", stepType: "swipe_sorter", question: "¿Es una Expectativa Sana o una Trampa Emocional?", leftBucket: {label:"Trampa (Falsa)", color:"#ef4444"}, rightBucket: {label:"Sana (Verdad)", color:"#10b981"}, items: [{id:"i1", label:"Gastar para encajar", correctBucket:"left"}, {id:"i2", label:"Invertir para la vejez", correctBucket:"right"}, {id:"i3", label:"Comprar felicidad instantánea", correctBucket:"left"}, {id:"i4", label:"Ahorrar para una emergencia", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "per-2-6", stepType: "info", title: "El Vacío que No se Llena", body: "Un Ingeniero del Dinero sabe que los vacíos emocionales se llenan con relaciones, propósito y salud. El dinero es solo la infraestructura.", fullScreen: true },
  { id: "per-2-7", stepType: "true_false", statement: "Tener más dinero nos hace automáticamente más inteligentes en nuestras decisiones.", correctValue: false, explanation: "Más dinero suele amplificar nuestros vicios o virtudes actuales. Si eres desordenado, serás un desordenado con más recursos.", isAssessment:true, fullScreen: true },
  { id: "per-2-8", stepType: "order", question: "Evolución de las expectativas", items: [{id:"p1", label:"Dinero para Sobrevivir", correctOrder: 1}, {id: "p2", label:"Dinero para Pertenecer (Estatus)", correctOrder: 2}, {id: "p3", label:"Dinero para Trascender (Libertad)", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "per-2-9", stepType: "blitz_challenge", question: "¿Hacia dónde apunta tu verdadero norte?", options: [{id:"o1", label:"Consumo infinito", isCorrect:false}, {id:"o2", label:"Libertad y Propósito", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "per-2-10", stepType: "blitz_challenge", question: "¿Sirve el dinero para llenar vacíos emocionales?", options: [{id:"o1", label:"Sí, temporalmente", isCorrect:false}, {id:"o2", label: "No, es un error de sistema", isCorrect: true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "per-2-11", stepType: "match", question: "Relaciona Expectativa con Realidad", leftItems: [{id:"l1", label:"Esperanza de Lotería"}, {id:"l2", label:"Planificación BIZEN"}], rightItems: [{id:"r1", label:"Pobreza Probabilística"}, {id:"r2", label:"Riqueza por Ingeniería"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}], isAssessment: true, fullScreen: true },
  { id: "per-2-12", stepType: "mindset_translator", question: "Refactoriza tu deseo", beliefs: [{id: "b1", original: "Cuando tenga dinero, seré finalmente feliz.", healthyOptions: [{id: "h1", label: "Aprenderé a gestionar mi capital para que me dé libertad", isCorrect: true}, {id: "h2", label: "El dinero es la causa de todo mal", isCorrect: false}]}] },
  { id: "per-2-13", stepType: "narrative_check", question: "Escribe tu mayor expectativa financiera para los próximos 5 años.", promptPlaceholder: "Espero lograr ...", minChars: 15, billyResponse: "Amicioso. ¡Vamos a por ello!", fullScreen: true },
  { id: "per-2-14", stepType: "info", title: "Alerta importante", body: "Cuidado con lo que deseas. El dinero te revelará a tí mismo. Asegúrate de que te guste lo que ves.", fullScreen: true,
    aiInsight: "El dinero amplifica tu personalidad actual. Si eres caótico hoy, serás caótico con millones."
  },
  { id: "per-2-15", stepType: "summary", title: "Expectativas Alineadas", body: "Ya sabes qué quieres. Siguiente: Seguridad vs Libertad.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 3: Dinero como seguridad vs libertad - 15 SLIDES
// ==============================================================================
export const lessonDineroComoSeguridadVsLibertadSteps: LessonStep[] = [
  { id: "per-3-1", stepType: "billy_talks", body: "Para algunos, el dinero es una manta caliente (Seguridad). Para otros, es un par de botas para caminar hacia el horizonte (Libertad).", fullScreen: true,
    data: { glossary: [{ word: "Seguridad Financiera", definition: "Estado de tener garantizados los recursos básicos ante imprevistos." }, { word: "Libertad Financiera", definition: "Estado donde los ingresos pasivos cubren totalmente el costo de vida." }] }
  },
  { id: "per-3-2", stepType: "info", title: "La Seguridad es una Ilusión", body: "Un empleo 'seguro' es el mayor riesgo financiero: dependes de UNA sola persona para que tu familia coma. La libertad es tener múltiples opciones.", fullScreen: true,
    aiInsight: "La verdadera seguridad no viene de un sueldo, viene de tu capacidad de generar valor sin importar el jefe."
  },
  { id: "per-3-3", stepType: "mcq", question: "¿Qué prefieres hoy: $1M en el banco o saber generar capital infinitamente?", options: [{id:"o1", label: "$1M (Seguridad)", isCorrect: true}, {id:"o2", label:"Habilidad de Negocio (Libertad)", isCorrect:true}], isAssessment: false, fullScreen: true },
  { id: "per-3-4", stepType: "swipe_sorter", question: "¿Es un Activo de Seguridad o de Libertad?", leftBucket: {label:"Seguridad (Ancla)", color:"#3b82f6"}, rightBucket: {label:"Libertad (Velas)", color:"#10b981"}, items: [{id:"i1", label:"Fondo de emergencia", correctBucket:"left"}, {id:"i2", label:"Inversión en mi HVA", correctBucket:"right"}, {id:"i3", label:"Seguro de gastos médicos", correctBucket:"left"}, {id:"i4", label:"Negocio automatizado", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "per-3-5", stepType: "info", title: "El Miedo ataca a la Seguridad", body: "Cuando operamos por miedo, buscamos seguridad. Cuando operamos por visión, buscamos libertad. Un Ingeniero del Dinero usa la primera para construir la segunda.", fullScreen: true },
  { id: "per-3-6", stepType: "true_false", statement: "Arriesgar todo tu capital en un negocio es libertad financiera.", correctValue: false, explanation: "Eso es juego de azar. La libertad se construye sobre cimientos de seguridad técnica.", isAssessment:true, fullScreen: true },
  { id: "per-3-7", stepType: "order", question: "Escalera de la Libertad", items: [{id:"p1", label:"Sobrevivencia (Deuda 0)", correctOrder: 1}, {id: "p2", label:"Seguridad (Ahorro 6 meses)", correctOrder: 2}, {id: "p3", label:"Libertad (Renta Activos)", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "per-3-8", stepType: "blitz_challenge", question: "¿Cuál es el cimiento de la libertad?", options: [{id:"o1", label:"Gastar poco", isCorrect:false}, {id:"o2", label:"Seguridad y Activos", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "per-3-9", stepType: "blitz_challenge", question: "¿Es seguro tener un solo ingreso?", options: [{id:"o1", label:"Sí, si es estable", isCorrect:false}, {id:"o2", label: "No, es el mayor riesgo técnico", isCorrect: true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "per-3-10", stepType: "match", question: "Relaciona Estado con Propósito", leftItems: [{id:"l1", label:"Seguridad"}, {id:"l2", label:"Libertad"}], rightItems: [{id:"r1", label:"Evitar el dolor"}, {id:"r2", label:"Maximizar el placer"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}], isAssessment: true, fullScreen: true },
  { id: "per-3-11", stepType: "mindset_translator", question: "Cuestiona tu ancla", beliefs: [{id: "b1", original: "Debo quedarme en este trabajo horrible por seguridad.", healthyOptions: [{id: "h1", label: "Diseñaré mi salida construyendo un fondo de libertad hoy", isCorrect: true}, {id: "h2", label: "El sufrimiento es el costo de la comida", isCorrect: false}]}] },
  { id: "per-3-12", stepType: "impulse_meter", instructions: "Mantén pulsado para confirmar tu compromiso con la Libertad. Respira propósito.", item: { name: "Motor de Libertad", price: "0.00", imageUrl: "/billy-breathing.png" }, holdTime: 6, fullScreen: true },
  { id: "per-3-13", stepType: "narrative_check", question: "¿Qué harías mañana si tuvieras tu libertad financiera total?", promptPlaceholder: "Me dedicaría a ...", minChars: 15, billyResponse: "Anota eso. Es tu verdadero norte.", fullScreen: true },
  { id: "per-3-14", stepType: "info", title: "Alerta de Riesgo", body: "No confundas libertad con libertinaje. La verdadera libertad financiera requiere MÁS disciplina que un empleo normal.", fullScreen: true,
    aiInsight: "La opcionalidad es el activo más caro del mercado y se compra con liquidez."
  },
  { id: "per-3-15", stepType: "summary", title: "Conceptos Sellados", body: "Ya sabes hacia dónde vas. Siguiente: Presión vs Oportunidad.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 4: Dinero como presión vs oportunidad - 15 SLIDES
// ==============================================================================
export const lessonDineroComoPresionVsOportunidadSteps: LessonStep[] = [
  { id: "per-4-1", stepType: "billy_talks", body: "El dinero puede ser una soga al cuello (Presión) o un trampolín (Oportunidad). ¿Cómo lo estás configurando tú?", fullScreen: true,
    data: { glossary: [{ word: "Presión Financiera", definition: "Estado de estrés causado por deudas o falta de activos." }, { word: "Costo de Oportunidad", definition: "Aquello a lo que renuncias al elegir una opción sobre otra." }] }
  },
  { id: "per-4-2", stepType: "info", title: "La Trampa de la Deuda", body: "Cada deuda que adquieres es una presión futura que instalas en tu sistema. Quitas libertad de mañana para un placer fugaz de hoy.", fullScreen: true,
    aiInsight: "La deuda de consumo es un impuesto al futuro que tú mismo te impones."
  },
  { id: "per-4-3", stepType: "mcq", question: "Tienes $10,000 en el banco. Surge una inversión increíble. ¿Es esto presión u oportunidad?", options: [{id:"o1", label: "Oportunidad (Tengo el capital)", isCorrect: true}, {id:"o2", label:"Presión (Si no entro pierdo)", isCorrect:false}], isAssessment: true, fullScreen: true },
  { id: "per-4-4", stepType: "swipe_sorter", question: "¿Es un Generador de Presión o de Oportunidad?", leftBucket: {label:"Presión (Soga)", color:"#ef4444"}, rightBucket: {label:"Oportunidad (Lanzadera)", color:"#10b981"}, items: [{id:"i1", label:"Préstamo para vacaciones", correctBucket:"left"}, {id:"i2", label:"Ahorro para curso HVA", correctBucket:"right"}, {id:"i3", label:"Tarjeta al límite", correctBucket:"left"}, {id:"i4", label:"Línea de crédito para negocio probado", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "per-4-5", stepType: "info", title: "Liquidez es Oportunidad", body: "La gente sin ahorros nunca ve oportunidades, solo ve problemas. Un Ingeniero del Dinero mantiene liquidez para poder 'atacar' cuando la oportunidad aparece.", fullScreen: true },
  { id: "per-4-6", stepType: "true_false", statement: "Tener dinero en el banco sin usar es dinero desperdiciado.", correctValue: false, explanation: "Es el costo de tener la OPCIÓN de actuar. La opcionalidad es uno de los activos más caros y valiosos.", isAssessment:true, fullScreen: true },
  { id: "per-4-7", stepType: "order", question: "Conversión de Presión a Oportunidad", items: [{id:"p1", label: "Eliminar deudas de consumo (Presión)", correctOrder: 1}, {id: "p2", label: "Acumular fondo de maniobra", correctOrder: 2}, {id: "p3", label: "Ejecutar inversiones estratégicas", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "per-4-8", stepType: "blitz_challenge", question: "¿Qué genera la deuda de consumo?", options: [{id:"o1", label:"Oportunidad", isCorrect:false}, {id:"o2", label:"Presión futura", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "per-4-9", stepType: "blitz_challenge", question: "¿Cual es el motor de las oportunidades?", options: [{id:"o1", label:"La suerte", isCorrect:false}, {id:"o2", label: "La liquidez (Tener capital listo)", isCorrect: true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "per-4-10", stepType: "match", question: "Relaciona PerPerfil con Estado", leftItems: [{id:"l1", label:"Vivir al día"}, {id:"l2", label:"Vivir con excedente"}], rightItems: [{id:"r1", label:"Presión Constante"}, {id:"r2", label:"Oportunidad Abierta"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}], isAssessment: true, fullScreen: true },
  { id: "per-4-11", stepType: "mindset_translator", question: "Refactoriza tu soga", beliefs: [{id: "b1", original: "Nunca tendré suficientes oportunidades.", healthyOptions: [{id: "h1", label: "Las oportunidades se ven mejor cuando tengo el capital listo", isCorrect: true}, {id: "h2", label: "La suerte es para otros", isCorrect: false}]}] },
  { id: "per-4-12", stepType: "impulse_meter", instructions: "Mantén pulsado para transformar tu presión en empuje. Respira resiliencia.", item: { name: "Conversor de Energía", price: "0.00", imageUrl: "/billy-breathing.png" }, holdTime: 5, fullScreen: true },
  { id: "per-4-13", stepType: "narrative_check", question: "¿Qué oportunidad has dejado pasar por falta de capital o exceso de presión?", promptPlaceholder: "Perdí la oportunidad de ...", minChars: 15, billyResponse: "No volverá a pasar. Estamos construyendo tu base.", fullScreen: true },
  { id: "per-4-14", stepType: "info", title: "Alerta importante", body: "La presión nuble el juicio. No inviertas bajo presión. Primero limpia tu base, luego lánzate.", fullScreen: true,
    aiInsight: "Invertir bajo presión es jugar a la ruleta. El Ingeniero invierte desde la sobriedad técnica."
  },
  { id: "per-4-15", stepType: "summary", title: "Presión Analizada", body: "Has visto la diferencia. Siguiente: Tu definición personal.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 5: Identificar mi definición personal del dinero - 15 SLIDES
// ==============================================================================
export const lessonIdentificarMiDefinicionPersonalDelDineroSteps: LessonStep[] = [
  { id: "per-5-1", stepType: "billy_talks", body: "Es hora de escribir TU manual. ¿Cuál es tu definición operativa del dinero a partir de hoy?", fullScreen: true,
    data: { glossary: [{ word: "Definición Operativa", definition: "Concepto práctico que guía acciones diarias reales." }, { word: "Arquitectura Financiera", definition: "Estructura de gestión de recursos diseñada para un fin específico." }] }
  },
  { id: "per-5-2", stepType: "info", title: "Tú Eres el Arquitecto", body: "No aceptes la definición de tus padres, de la TV o de Instagram. Define el dinero como una herramienta técnica para TU visión de vida.", fullScreen: true,
    aiInsight: "Tu definición del dinero es el sistema operativo sobre el cual corren todas tus decisiones."
  },
  { id: "per-5-3", stepType: "mcq", question: "A partir de hoy, ¿qué es el dinero para tí?", options: [{id:"o1", label:"Energía para mi libertad", isCorrect:true}, {id:"o2", label:"Símbolo de mi estatus", isCorrect:false}, {id:"o3", label: "Algo que me genera miedo", isCorrect: false}], isAssessment: true, fullScreen: true },
  { id: "per-5-4", stepType: "swipe_sorter", question: "¿Encaja con MI Nueva Definición?", leftBucket: {label:"Rechazado (Viejo Yo)", color:"#ef4444"}, rightBucket: {label:"Aceptado (Nuevo Ingeniero)", color:"#10b981"}, items: [{id:"i1", label:"Gasto impulsivo por estrés", correctBucket:"left"}, {id:"i2", label:"Ahorro sistemático del 10%", correctBucket:"right"}, {id:"i3", label:"Compararme con el vecino", correctBucket:"left"}, {id:"i4", label:"Estudiar una nueva HVA", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "per-5-5", stepType: "info", title: "El Poder de la Consistencia", body: "Una definición no sirve si no se aplica. Tu ingeniería requiere mantenimiento diario. Revisa tu definición cada mañana.", fullScreen: true },
  { id: "per-5-6", stepType: "true_false", statement: "Mi definición del dinero puede cambiar a medida que crezco y aprendo.", correctValue: true, explanation: "La flexibilidad técnica es vital. Ajusta tu modelo a medida que tu realidad evoluciona.", isAssessment:true, fullScreen: true },
  { id: "per-5-7", stepType: "order", question: "Pasos para sellar tu definición", items: [{id:"p1", label: "Escribirla en algún lugar visible", correctOrder: 1}, {id: "p2", label: "Eliminar gastos que la contradigan", correctOrder: 2}, {id: "p3", label: "Enseñar a otros con mi ejemplo", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "per-5-8", stepType: "blitz_challenge", question: "¿Quién es el dueño de tu dinero?", options: [{id:"o1", label:"El banco", isCorrect:false}, {id:"o2", label:"Tú (El Arquitecto)", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "per-5-9", stepType: "blitz_challenge", question: "¿Es el dinero un fin en sí mismo?", options: [{id:"o1", label:"Sí, acumular es todo", isCorrect:false}, {id:"o2", label: "No, es una herramienta técnica", isCorrect: true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "per-5-10", stepType: "match", question: "Identidad", leftItems: [{id:"l1", label:"Dinero como Herramienta"}, {id:"l2", label:"Dinero como Esclavo"}], rightItems: [{id:"r1", label:"Yo lo mando a él"}, {id:"r2", label:"Él me manda a mí (Viejo)"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}], isAssessment: true, fullScreen: true },
  { id: "per-5-11", stepType: "mindset_translator", question: "Sella tu código", beliefs: [{id: "b1", original: "El dinero me controla.", healthyOptions: [{id: "h1", label: "Yo controlo el flujo de mi energía almacenada", isCorrect: true}, {id: "h2", label: "Soy una hoja al viento financiero", isCorrect: false}]}] },
  { id: "per-5-12", stepType: "impulse_meter", instructions: "Mantén pulsado para 'grabar' tu nueva definición en tu sistema cerebral. Respira éxito.", item: { name: "Sello de Arquitecto", price: "0.00", imageUrl: "/billy-breathing.png" }, holdTime: 6, fullScreen: true },
  { id: "per-5-13", stepType: "narrative_check", question: "Escribe en una frase: ¿Qué es el dinero para tí a partir de hoy?", promptPlaceholder: "El dinero es ...", minChars: 20, billyResponse: "Potente definición. ¡Bienvenido a BIZEN!", fullScreen: true },
  { id: "per-5-14", stepType: "info", title: "Alerta importante", body: "Has terminado el primer bloque de Mentalidad. Tu percepción ya no es la misma. ¡Prepárate para las Emociones!", fullScreen: true,
    aiInsight: "El éxito financiero no es un evento fortuito, es una consecuencia inevitable de una arquitectura correcta."
  },
  { id: "per-5-15", stepType: "summary", title: "Subtema Completado", body: "Has dominado el Subtema A: Percepción. ¡Felicidades, Ingeniero de Mentalidad!", fullScreen: true },
]
