import type { LessonStep } from "@/types/lessonTypes"

/**
 * TEMA 1: Lección 4 - El Criterio de Realidad (Datos vs Opinión)
 * 15 SLIDES - BIZEN BLUEPRINT
 */

export const lessonElCriterioDeRealidadSteps: LessonStep[] = [
  { id: "real-1-1", stepType: "billy_talks", body: "En finanzas, tu opinión no vale nada; lo que importa es lo que los datos pueden probar. Bienvenido al entrenamiento de Criterio de Realidad.", fullScreen: true,
    data: { glossary: [{ word: "Criterio de Realidad", definition: "Capacidad de basar decisiones en hechos comprobables y datos duros, ignorando suposiciones o emociones." }, { word: "Sesgo de Confirmación", definition: "Tendencia a buscar información que valide lo que ya creemos, ignorando la evidencia contraria." }] }
  },
  { id: "real-1-2", stepType: "info", title: "El Mapa NO es el Territorio", body: "Creer que eres 'ahorrador' porque no compras café es una opinión. Revisar tu extracto y ver que gastas el 40% en suscripciones es un DATO. La ingeniería financiera solo opera con datos.", fullScreen: true,
    aiInsight: "El 80% de los inversionistas novatos basan sus decisiones en noticias o intuición, no en balances reales."
  },
  { id: "real-1-3", stepType: "impulse_meter", instructions: "Mantén pulsado para filtrar tus pensamientos. Separa la opinión del dato real. Siente la claridad.", item: { name: "Filtro de Verdad", price: "Claridad", imageUrl: "/billy-breathing.png" }, holdTime: 5, fullScreen: true },
  { id: "real-1-4", stepType: "mcq", question: "Si alguien dice: 'El oro siempre sube', ¿esto es un Dato o una Opinión?", options: [{id:"o1", label:"Dato (Es un hecho)", isCorrect:false}, {id:"o2", label:"Opinión (Es una predicción basada en el pasado)", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "real-1-5", stepType: "swipe_sorter", question: "¿Dato (Comprobable) u Opinión (Personal)?", leftBucket: {label:"Dato (Hecho)", color:"#10b981"}, rightBucket: {label:"Opinión (Creencia)", color:"#ef4444"}, items: [{id:"i1", label:"Saldo actual en cuenta", correctBucket:"left"}, {id:"i2", label:"'La economía va a mejorar'", correctBucket:"right"}, {id:"i3", label:"Tasa de interés del préstamo", correctBucket:"left"}, {id:"i4", label:"'Esa inversión parece segura'", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "real-1-6", stepType: "info", title: "Verificación de Fuente", body: "Antes de actuar, pregunta: ¿Esto es un número que puedo sumar en Excel o es un sentimiento? Si no es un número, deséchalo de tu modelo de decisión.", fullScreen: true },
  { id: "real-1-7", stepType: "true_false", statement: "Un 'Dato' puede cambiar con el tiempo sin dejar de ser un hecho en el momento presente.", correctValue: true, explanation: "El saldo de hoy es un dato, aunque mañana cambie. La opinión, en cambio, suele ser inmutable frente a la evidencia.", isAssessment:true, fullScreen: true },
  { id: "real-1-8", stepType: "order", question: "Proceso de Auditoría de Pensamiento", items: [{id:"p1", label: "Recibir información (Consejo/Noticia)", correctOrder: 1}, {id: "p2", label: "Buscar la métrica o dato duro que la sustenta", correctOrder: 2}, {id: "p3", label: "Tomar decisión basada exclusivamente en el dato", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "real-1-9", stepType: "blitz_challenge", question: "¿Qué herramienta es mejor para el Criterio de Realidad?", options: [{id:"o1", label:"El Horóscopo", isCorrect:false}, {id:"o2", label:"La Hoja de Cálculo", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "real-1-10", stepType: "blitz_challenge", question: "¿Cómo se llama ignorar la evidencia incómoda?", options: [{id:"o1", label:"Sesgo de Confirmación", isCorrect:true}, {id:"o2", label:"Ser optimista", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "real-1-11", stepType: "match", question: "Relaciona Fuente con Calidad", leftItems: [{id:"l1", label:"Estado de Cuenta"}, {id:"l2", label:"Video de YouTube"}, {id:"l3", label:"Sentimiento de miedo"}], rightItems: [{id:"r1", label:"Dato Maestro"}, {id:"r2", label:"Opinión Externa"}, {id:"r3", label:"Interferencia Emocional"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}, {leftId:"l3", rightId:"r3"}], isAssessment: true, fullScreen: true },
  { id: "real-1-12", stepType: "mindset_translator", question: "Refactoriza tu proceso", beliefs: [{id: "b1", original: "Tengo un presentimiento sobre este negocio.", healthyOptions: [{id: "h1", label: "Analizaré los flujos de caja y la rentabilidad histórica antes de mover un peso", isCorrect: true}, {id: "h2", label: "Seguiré mi instinto", isCorrect: false}]}] },
  { id: "real-1-13", stepType: "narrative_check", question: "¿Cuál es el 'dato' más aterrador de tu cuenta bancaria hoy (que prefieres no ver)?", promptPlaceholder: "El dato es que ...", minChars: 10, billyResponse: "Mirarlo con calma es el primer paso para dominar tu sistema.", fullScreen: true },
  { id: "real-1-14", stepType: "info", title: "Alerta importante", body: "Los datos son mudos si no los analizas. No solo recolectes números; busca patrones de ineficiencia.", fullScreen: true,
    aiInsight: "Las empresas más exitosas del mundo operan bajo el lema: 'En Dios confiamos, todos los demás traigan datos'."
  },
  { id: "real-1-15", stepType: "summary", title: "Criterio Validado", body: "Ya sabes distinguir el ruido de la señal. Siguiente: El Mapa del Tesoro.", fullScreen: true },
]
