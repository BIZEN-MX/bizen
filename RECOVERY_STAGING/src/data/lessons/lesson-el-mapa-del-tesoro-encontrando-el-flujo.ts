import type { LessonStep } from "@/types/lessonTypes"

/**
 * TEMA 1: Lección 5 - El Mapa del Tesoro (Encontrando el flujo)
 * 15 SLIDES - BIZEN BLUEPRINT
 */

export const lessonElMapaDelTesoroSteps: LessonStep[] = [
  { id: "map-1-1", stepType: "billy_talks", body: "¿A dónde está yendo el flujo realmente? No es un misterio; es un mapa de ingeniería. Vamos a trazar el recorrido de tu capital.", fullScreen: true,
    data: { glossary: [{ word: "Mapa de Flujo", definition: "Representación visual de las entradas y salidas de capital de un sistema financiero personal." }, { word: "Cerrar el Grifo", definition: "Detener una salida de capital que ya no genera valor operativo o estratégico." }] }
  },
  { id: "map-1-2", stepType: "info", title: "Entradas y Salidas", body: "Tu dinero no desaparece; se transfiere. El Mapa del Tesoro te muestra quién es el dueño de tu esfuerzo: ¿Tú o las empresas a las que les pagas? Si los flujos salen más de lo que entran, el sistema colapsará.", fullScreen: true,
    aiInsight: "La visualización gráfica de gastos ayuda al cerebro a procesar la pérdida de capital mucho mejor que los números en una tabla."
  },
  { id: "map-1-3", stepType: "impulse_meter", instructions: "Mantén pulsado y visualiza la energía fluyendo hacia tu futuro. Siente el poder del mapa.", item: { name: "Brújula de Flujo", price: "0.00", imageUrl: "/billy-breathing.png" }, holdTime: 6, fullScreen: true },
  { id: "map-1-4", stepType: "mcq", question: "¿Qué sucede si no tienes un mapa trazado cada mes?", options: [{id:"o1", label:"Eres libre e intuitivo", isCorrect:false}, {id:"o2", label:"El dinero se drena por los agujeros de tu ignorancia", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "map-1-5", stepType: "swipe_sorter", question: "¿Es una Entrada (Oxígeno) o una Salida (CO2)?", leftBucket: {label:"Entrada (Plus)", color:"#10b981"}, rightBucket: {label:"Salida (Minus)", color:"#ef4444"}, items: [{id:"i1", label:"Sueldo mensual", correctBucket:"left"}, {id:"i2", label:"Cena de fin de semana", correctBucket:"right"}, {id:"i3", label:"Intereses del banco", correctBucket:"left"}, {id:"i4", label:"Renta de habitación", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "map-1-6", stepType: "info", title: "Cuellos de Botella", body: "En todo sistema hay un punto donde el fluido se detiene. Tu mapa debe mostrarte por qué no logras retener capital. Ese es el 'tesoro' real: el excedente.", fullScreen: true },
  { id: "map-1-7", stepType: "true_false", statement: "Es posible volverse millonario simplemente 'mapenado' el flujo sin aumentar los ingresos al principio.", correctValue: true, explanation: "La retención de capital mediante eficiencia operativa es la base más sólida de la riqueza real.", isAssessment:true, fullScreen: true },
  { id: "map-1-8", stepType: "order", question: "Pasos para crear tu Mapa Real", items: [{id:"p1", label: "Descarga cada transacción del mes", correctOrder: 1}, {id: "p2", label: "Dibuja flechas de entrada y salida por categoría", correctOrder: 2}, {id: "p3", label: "Identificar y cerrar las fugas más grandes", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "map-1-9", stepType: "blitz_challenge", question: "¿Cuál es el tesoro final de tu mapa?", options: [{id:"o1", label:"Comonidad", isCorrect:false}, {id:"o2", label:"El Excedente (Capital para Invertir)", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "map-1-10", stepType: "blitz_challenge", question: "¿Cómo se llama cuando gastas más de lo que tienes?", options: [{id:"o1", label:"Déficit", isCorrect:true}, {id:"o2", label:"Superávit", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "map-1-11", stepType: "match", question: "Relaciona Segmento con Función", leftItems: [{id:"l1", label:"Fondo para Emergencias"}, {id:"l2", label:"Gasto en Lujos"}, {id:"l3", label:"Inversión Técnica"}], rightItems: [{id:"r1", label:"Tanque de Reserva"}, {id:"r2", label:"Venteo de Energía"}, {id:"r3", label:"Acelerador de Flujo"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}, {leftId:"l3", rightId:"r3"}], isAssessment: true, fullScreen: true },
  { id: "map-1-12", stepType: "mindset_translator", question: "Refactoriza tu destino", beliefs: [{id: "b1", original: "El dinero se me escabulle de las manos.", healthyOptions: [{id: "h1", label: "Instalaré compuertas lógicas en mi mapa para que el flujo solo salga hacia donde yo decida", isCorrect: true}, {id: "h2", label: "La mala suerte me persigue", isCorrect: false}]}] },
  { id: "map-1-13", stepType: "narrative_check", question: "¿Cuál es el 'agujero' más grande por donde se escapa tu capital actualmente?", promptPlaceholder: "Mi fuga principal es ...", minChars: 10, billyResponse: "Cerrar ese grifo hoy equivale a un aumento salarial inmediato.", fullScreen: true },
  { id: "map-1-14", stepType: "info", title: "Alerta importante", body: "Un mapa no sirve si no lo consultas. La auditoría debe ser semanal para detectar el cambio de presión en tu sistema.", fullScreen: true,
    aiInsight: "Las personas que grafican sus gastos ahorran hasta un 25% más que quienes solo llevan un registro lineal."
  },
  { id: "map-1-15", stepType: "summary", title: "Mapa Trazado", body: "Has visto el terreno. Siguiente: El Blindaje de Cuenta.", fullScreen: true },
]
