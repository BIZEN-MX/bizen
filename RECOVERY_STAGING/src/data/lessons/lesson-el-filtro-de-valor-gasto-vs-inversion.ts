import type { LessonStep } from "@/types/lessonTypes"

/**
 * TEMA 1: Lección 10 - El Filtro de Valor (Gasto vs Inversión)
 * 15 SLIDES - BIZEN BLUEPRINT
 */

export const lessonElFiltroDeValorSteps: LessonStep[] = [
  { id: "fil-1-1", stepType: "billy_talks", body: "No todo lo que sale de tu bolsillo es malo. El problema es cuando tratas a un gasto como inversión y a una inversión como gasto. Vamos a instalar tu Filtro de Valor.", fullScreen: true,
    data: { glossary: [{ word: "Gasto de Consumo", definition: "Salida de dinero para un bien o servicio que pierde valor o no genera retorno directo (comida, ropa, ocio)." }, { word: "Inversión Técnica", definition: "Salida de dinero para un bien o servicio que aumenta tu capacidad de generar más valor futuro (formación, herramientas, activos)." }] }
  },
  { id: "fil-1-2", stepType: "info", title: "La Regla de Retorno", body: "Antes de pagar, pregunta: ¿Esto me hará más rico, más sabio o más libre en el futuro? Si la respuesta es NO, es un Gasto. Si la respuesta es SÍ, es Capital de Trabajo. Aprender una habilidad técnica es la mejor inversión del mundo.", fullScreen: true,
    aiInsight: "El mayor multiplicador de riqueza no es el ahorro, sino la inversión estratégica en el desarrollo de Habilidades de Alto Valor."
  },
  { id: "fil-1-3", stepType: "mcq", question: "Inviertes $1,000 en un curso de Excel Pro. Esto te ahorra 5 horas a la semana que valoras en $500. ¿Esto fue?", options: [{id:"o1", label:"Un Gasto (Menos dinero hoy)", isCorrect:false}, {id:"o2", label:"Una Inversión (Más tiempo y valor mañana)", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "fil-1-4", stepType: "swipe_sorter", question: "¿Es una Inversión o un Gasto?", leftBucket: {label:"Inversión (Suma)", color:"#10b981"}, rightBucket: {label:"Gasto (Resta)", color:"#fbbf24"}, items: [{id:"i1", label:"Suscripción a Netflix", correctBucket:"right"}, {id:"i2", label:"Certificación en Ciberseguridad", correctBucket:"left"}, {id:"i3", label:"Compra de TV 4K", correctBucket:"right"}, {id:"i4", label:"Compra de libros técnicos", correctBucket:"left"}], isAssessment: true, fullScreen: true },
  { id: "fil-1-5", stepType: "info", title: "Costo de No-Hacer", body: "A veces, NO gastar dinero en lo correcto es el gasto más caro de todos. El costo de oportunidad de ignorar una habilidad clave se mide en cientos de miles de dólares a largo plazo.", fullScreen: true },
  { id: "fil-1-6", stepType: "true_false", statement: "Todo lo que diga 'educación' es una buena inversión por naturaleza.", correctValue: false, explanation: "Solo es inversión si tiene utilidad proyectada. Estudiar algo que no usarás nunca es un Gasto de Entretenimiento Académico.", isAssessment:true, fullScreen: true },
  { id: "fil-1-7", stepType: "order", question: "Pasos del Filtro de Valor", items: [{id:"p1", label: "¿Cuál es el beneficio proyectado?", correctOrder: 1}, {id: "p2", label: "¿Cuál es el costo de no realizarlo?", correctOrder: 2}, {id: "p3", label: "¿Tengo los recursos para ejecutar lo aprendido?", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "fil-1-8", stepType: "match", question: "Relaciona Segmento con Objetivo", leftItems: [{id:"l1", label:"Ocio"}, {id:"l2", label:"Activo Financiero"}, {id:"l3", label:"Activo Intelectual"}], rightItems: [{id:"r1", label:"Recuperar energía"}, {id:"r2", label:"Generar dividendo"}, {id:"r3", label:"Generar habilidad"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}, {leftId:"l3", rightId:"r3"}], isAssessment: true, fullScreen: true },
  { id: "fil-1-9", stepType: "blitz_challenge", question: "¿Cómo se llama el dinero que trabaja para ti?", options: [{id:"o1", label:"Activo", isCorrect:true}, {id:"o2", label:"Pasivo", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "fil-1-10", stepType: "blitz_challenge", question: "¿Cual tiene el ROI más rápido?", options: [{id:"o1", label:"La bolsa de valores", isCorrect:false}, {id:"o2", label:"Tu propio conocimiento", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "fil-1-11", stepType: "impulse_meter", instructions: "Mantén pulsado para filtrar tus pensamientos. Siente la diferencia entre el valor y el brillo. Respira lógica.", item: { name: "Separador de Valor", price: "0.00", imageUrl: "/billy-breathing.png" }, holdTime: 6, fullScreen: true },
  { id: "fil-1-12", stepType: "mindset_translator", question: "Refactoriza tu banco personal", beliefs: [{id: "b1", original: "No tengo el dinero para ese curso.", healthyOptions: [{id: "h1", label: "No tengo dinero precisamente por no invertir en el conocimiento que lo multiplicaría; haré el esfuerzo hoy", isCorrect: true}, {id: "h2", label: "Ahorrar es más seguro que arriesgar", isCorrect: false}]}] },
  { id: "fil-1-13", stepType: "narrative_check", question: "¿Qué inversión en tí mismo has pospuesto 'porque no tienes dinero'?", promptPlaceholder: "He pospuesto ...", minChars: 10, billyResponse: "Rompe ese ciclo. La falta de inversión hoy garantiza la falta de dinero mañana.", fullScreen: true },
  { id: "fil-1-14", stepType: "info", title: "Alerta importante", body: "No trates al ocio como un pecado. Es necesario para operar. Pero llámalo por su nombre: Gasto de Mantenimiento Personal, no inversión de vida.", fullScreen: true,
    aiInsight: "Las personas que destinan el 10% de sus ingresos a formación técnica superan en riqueza al resto en menos de 7 años."
  },
  { id: "fil-1-15", stepType: "summary", title: "Filtro Instalado", body: "Ya sabes qué es que. Siguiente: El Salario de tu 'Yo del Futuro'.", fullScreen: true },
]
