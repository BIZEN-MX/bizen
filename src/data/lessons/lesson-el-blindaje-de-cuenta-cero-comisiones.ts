import type { LessonStep } from "@/types/lessonTypes"

/**
 * TEMA 1: Lección 9 - El Blindaje de Cuenta (Cero comisiones)
 * 15 SLIDES - BIZEN BLUEPRINT
 */

export const lessonElBlindajeDeCuentaSteps: LessonStep[] = [
  { id: "bli-1-1", stepType: "billy_talks", body: "Pagarle al banco por 'tener' tu dinero es una ineficiencia técnica inaceptable. Vamos a blindar tu cuenta para que el flujo sea 100% puro.", fullScreen: true,
    data: { glossary: [{ word: "Comisión de Mantenimiento", definition: "Cargo recurrente que algunos bancos cobran por la administración de una cuenta activa." }, { word: "Banca Digital (Neobancos)", definition: "Entidades financieras que operan sin sucursales físicas, eliminando costos operativos y comisiones al usuario." }] }
  },
  { id: "bli-1-2", stepType: "info", title: "La Trampa de las Anualidades", body: "Muchas tarjetas de crédito cobran por el simple hecho de existir en tu cartera. Si no usas los beneficios de esa tarjeta para generar más dinero que el costo de la anualidad, tienes una fuga de energía masiva.", fullScreen: true,
    aiInsight: "Las comisiones bancarias 'pequeñas' pueden sumar más de $5,000 pesos anuales en un perfil promedio distraído."
  },
  { id: "bli-1-3", stepType: "impulse_meter", instructions: "Mantén pulsado y visualiza tu cuenta bancaria sin una sola fuga. Respira eficiencia financiera.", item: { name: "Escudo Bancario", price: "0.00", imageUrl: "/billy-breathing.png" }, holdTime: 5, fullScreen: true },
  { id: "bli-1-4", stepType: "mcq", question: "¿Cuál es la mejor comisión que deberías pagar por una cuenta de débito?", options: [{id:"o1", label:"$10 pesos al mes", isCorrect:false}, {id:"o2", label:"Cero absoluto (0.00)", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "bli-1-5", stepType: "swipe_sorter", question: "¿Es una Cuenta Blindada o una Cuenta con Fugas?", leftBucket: {label:"Blindada (Cero)", color:"#10b981"}, rightBucket: {label:"Fuga (Comisiones)", color:"#ef4444"}, items: [{id:"i1", label:"Sin saldo mínimo requerido", correctBucket:"left"}, {id:"i2", label:"Cobro por manejo de cuenta", correctBucket:"right"}, {id:"i3", label:"Transferencias SPEI gratis", correctBucket:"left"}, {id:"i4", label:"Comisión por retiro en cajero propio", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "bli-1-6", stepType: "info", title: "El Poder de la Portabilidad", body: "Tú eres el cliente. Si tu banco te cobra por respirar, cámbiate. La portabilidad de nómina o de cuenta es un derecho técnico que debes ejercer para optimizar tu sistema.", fullScreen: true },
  { id: "bli-1-7", stepType: "true_false", statement: "Los bancos tradicionales siempre son más seguros que los neobancos digitales.", correctValue: false, explanation: "La seguridad depende de la regulación (IPAB) y la tecnología de encriptación, no de tener sucursales de mármol.", isAssessment:true, fullScreen: true },
  { id: "bli-1-8", stepType: "order", question: "Protocolo de Blindaje", items: [{id:"p1", label: "Auditar estados de cuenta buscando comisiones", correctOrder: 1}, {id: "p2", label: "Comparar con opciones de banca digital sin costo", correctOrder: 2}, {id: "p3", label: "Migrar el capital a la cuenta más eficiente", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "bli-1-9", stepType: "blitz_challenge", question: "¿Qué representa una comisión bancaria en BIZEN?", options: [{id:"o1", label:"Un Gasto Invisible", isCorrect:true}, {id:"o2", label:"Un aporte social", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "bli-1-10", stepType: "blitz_challenge", question: "¿Cual es el arma definitiva contra las comisiones?", options: [{id:"o1", label:"Lamentarse", isCorrect:false}, {id:"o2", label:"La Cancelación de servicios ineficientes", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "bli-1-11", stepType: "match", question: "Relaciona Cargo con Solución", leftItems: [{id:"l1", label:"Anualidad Cara"}, {id:"l2", label:"Retiro en cajero ajeno"}, {id:"l3", label:"Comisión por saldo bajo"}], rightItems: [{id:"r1", label:"Cambiar a tarjeta sin costo"}, {id:"r2", label:"Usar app para retiro sin tarjeta"}, {id:"r3", label:"Migrar a banco digital"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}, {leftId:"l3", rightId:"r3"}], isAssessment: true, fullScreen: true },
  { id: "bli-1-12", stepType: "mindset_translator", question: "Refactoriza tu lealtad", beliefs: [{id: "b1", original: "Llevo 10 años en este banco, me da pena irme.", healthyOptions: [{id: "h1", label: "Mi lealtad es con mi libertad financiera, no con una institución que me cobra por mi propio dinero", isCorrect: true}, {id: "h2", label: "Ellos me cuidan", isCorrect: false}]}] },
  { id: "bli-1-13", stepType: "narrative_check", question: "¿Cuánto pagaste de comisiones totales el mes pasado (incluyendo anualidades prorrateadas)?", promptPlaceholder: "Pagué aproximadamente $ ...", minChars: 1, billyResponse: "Si es más de cero, tienes tarea. Blindar esa cuenta es prioridad.", fullScreen: true },
  { id: "bli-1-14", stepType: "info", title: "Alerta de Ingeniería", body: "No solo mires el costo mensual; mira el costo a 10 años. $200 de comisión mensual son $24,000 en una década. Eso es el precio de unas vacaciones regalado al banco.", fullScreen: true,
    aiInsight: "La migración masiva a fintechs está forzando a los bancos tradicionales a eliminar comisiones para sobrevivir."
  },
  { id: "bli-1-15", stepType: "summary", title: "Blindaje Sella", body: "Has protegido tu flujo. Siguiente: El Filtro de Valor.", fullScreen: true },
]
