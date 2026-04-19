import type { LessonStep } from "@/types/lessonTypes"

/**
 * TEMA 1: Lección 15 - La Auditoría de Supervivencia (Final Tema 1)
 * 15 SLIDES - BIZEN BLUEPRINT
 */

export const lessonLaAuditoriaDeSupervivenciaSteps: LessonStep[] = [
  { id: "aud-1-1", stepType: "billy_talks", body: "Bienvenidos a la fase final del Tema 1. Hemos visto las reglas, el flujo, el registro y el valor del tiempo. Es momento de auditar tu supervivencia técnica.", fullScreen: true,
    data: { glossary: [{ word: "Auditoría de Supervivencia", definition: "Revisión cuantitativa de la robustez de un sistema financiero personal ante fallos externos." }, { word: "Criterio de Resiliencia", definition: "Capacidad de un sistema de mantenerse operativo sin entradas de capital externas durante un tiempo determinado." }] }
  },
  { id: "aud-1-2", stepType: "info", title: "El Umbral de Seguridad", body: "¿Cuánto tiempo podrías sobrevivir si HOY se apagan todos tus flujos de entrada? Si la respuesta es menos de 3 meses, tu sistema está en alerta crítica. El objetivo de la ingeniería BIZEN es llevarte a 12 meses de paz absoluta.", fullScreen: true,
    aiInsight: "La libertad financiera no es una cifra; es el tiempo de vida que tus ahorros pueden comprarte sin trabajar."
  },
  { id: "aud-1-3", stepType: "impulse_meter", instructions: "Mantén pulsado y siente la tranquilidad de la reserva completa. Respira seguridad de supervivencia.", item: { name: "Batería de Emergencia", price: "0.00", imageUrl: "/billy-breathing.png" }, holdTime: 6, fullScreen: true },
  { id: "aud-1-4", stepType: "mcq", question: "Si tus gastos son de $10,000 y tienes $5,000 ahorrados, ¿cuál es tu índice de supervivencia?", options: [{id:"o1", label:"50% del mes", isCorrect:false}, {id:"o2", label:"0.5 meses (15 días)", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "aud-1-5", stepType: "swipe_sorter", question: "¿Aumenta o Disminuye tu Supervivencia?", leftBucket: {label:"Aumenta (Safe)", color:"#10b981"}, rightBucket: {label:"Disminuye (Risk)", color:"#ef4444"}, items: [{id:"i1", label:"Eliminar una suscripción mensual", correctBucket:"left"}, {id:"i2", label:"Aumentar el límite de tarjeta", correctBucket:"right"}, {id:"i3", label:"Agregar $1,000 al fondo", correctBucket:"left"}, {id:"i4", label:"Comprar cena fuera 4 veces", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "aud-1-6", stepType: "info", title: "El Factor Estrés", body: "Tener una baja supervivencia genera cortisol, lo que nubla tu juicio para tomar decisiones de HVA y carrera. Invertir en tu fondo de emergencia es invertir en tu capacidad intelectual futura.", fullScreen: true },
  { id: "aud-1-7", stepType: "true_false", statement: "Es prudente invertir en la bolsa 'porque da buenos rendimientos' antes de tener el fondo de supervivencia completo.", correctValue: false, explanation: "Si el mercado cae y necesitas el dinero, venderás en pérdida. Primero el seguro de supervivencia, luego el crecimiento.", isAssessment:true, fullScreen: true },
  { id: "aud-1-8", stepType: "order", question: "Prioridades Post-Audit", items: [{id:"p1", label: "Cerrar todas las fugas detectadas", correctOrder: 1}, {id: "p2", label: "Construir 3 meses de supervivencia", correctOrder: 2}, {id: "p3", label: "Buscar la primera fuente de ingreso pasivo", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "aud-1-9", stepType: "blitz_challenge", question: "¿Qué mide la supervivencia real?", options: [{id:"o1", label:"Tus Activos Líquidos / Gastos Mensuales", isCorrect:true}, {id:"o2", label:"Tu sueldo", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "aud-1-10", stepType: "blitz_challenge", question: "¿Cuál es el objetivo mínimo BIZEN?", options: [{id:"o1", label:"3 a 6 meses de paz", isCorrect:true}, {id:"o2", label:"Pagar deudas mínimas", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "aud-1-11", stepType: "match", question: "Relaciona Situación", leftItems: [{id:"l1", label:"0 meses reserva"}, {id:"l2", label:"6 meses reserva"}, {id:"l3", label:"24 meses reserva"}], rightItems: [{id:"r1", label:"Fragilidad Total (Esclavo)"}, {id:"r2", label:"Solidez (Negociador)"}, {id:"r3", label:"Soberanía (Libre)"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}, {leftId:"l3", rightId:"r3"}], isAssessment: true, fullScreen: true },
  { id: "aud-1-12", stepType: "mindset_translator", question: "Refactoriza tu seguridad", beliefs: [{id: "b1", original: "El próximo mes veré cómo le hago.", healthyOptions: [{id: "h1", label: "Construiré un fondo que responda por mí; mi seguridad no es suerte, es diseño", isCorrect: true}, {id: "h2", label: "Dios dirá", isCorrect: false}]}] },
  { id: "aud-1-13", stepType: "narrative_check", question: "¿Qué acción técnica vas a ejecutar MAÑANA para iniciar o robustecer tu auditoría de supervivencia?", promptPlaceholder: "Mañana voy a ...", minChars: 15, billyResponse: "Nivel de integridad validado. No esperes a la crisis para tener el plan.", fullScreen: true },
  { id: "aud-1-14", stepType: "info", title: "Certificación de Bloque 1", body: "Has terminado la fase de ingeniería operativa. Has reclamado el territorio de tu dinero. Estás listo para dejar de ser un pasajero de tus finanzas y convertirte en el piloto.", fullScreen: true,
    aiInsight: "La paz mental financiera es el activo intelectual más valioso que un ser humano puede poseer."
  },
  { id: "aud-1-15", stepType: "summary", title: "Tema 1 Completado", body: "Felicidades, Ingeniero. Has dominado el Operativo BIZEN. Siguiente: Examen de Bloque.", fullScreen: true },
]
