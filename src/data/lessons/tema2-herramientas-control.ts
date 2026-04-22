import type { LessonStep } from "@/types/lessonTypes"

/**
 * Subtema 5: Herramientas de control
 * 
 * Lessons expanded to 15 slides following the BIZEN Blueprint.
 * Focus: Digital and manual tools for financial management.
 */

// ==============================================================================
// LECCIÓN 1: ¿Qué apps financieras existen? - 15 SLIDES
// ==============================================================================
export const lessonAppsFinancierasSteps: LessonStep[] = [
  { id: "her-1-1", stepType: "billy_talks", body: "Tu smartphone no es solo para redes sociales; es tu centro de comando financiero. Vamos a explorar las herramientas digitales que automatizan tu orden.", fullScreen: true,
    data: { glossary: [{ word: "Apps de Finanzas", definition: "Software móvil diseñado para rastrear ingresos, gastos y metas de ahorro." }, { word: "Sincronización Bancaria", definition: "Capacidad de una app para leer tus transacciones bancarias automáticamente vía API." }] }
  },
  { id: "her-1-2", stepType: "info", title: "El Poder de la Visualización", body: "Lo que se mide, se mejora. Las apps transforman números aburridos en gráficas claras. Ver que gastaste $2,000 en café este mes visualmente es un golpe de realidad necesario.", fullScreen: true,
    aiInsight: "Usar una app de control de gastos reduce el gasto impulsivo en un 15% simplemente por la conciencia de ser observado."
  },
  { id: "her-1-3", stepType: "impulse_meter", instructions: "Mantén pulsado y visualiza tus gastos organizados por colores. Siente la claridad. Respira control digital.", item: { name: "Dashboard Digital", price: "0.00", imageUrl: "/billy-breathing.png" }, holdTime: 5, fullScreen: true },
  { id: "her-1-4", stepType: "mcq", question: "¿Cuál es la mayor ventaja de una app con sincronización bancaria?", options: [{id:"o1", label:"Me da dinero gratis", isCorrect:false}, {id:"o2", label:"Elimina el error humano y la pereza de anotar gastos", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "her-1-5", stepType: "swipe_sorter", question: "¿Qué buscar en una App Financiera?", leftBucket: {label:"Esencial", color:"#3b82f6"}, rightBucket: {label:"Prescindible", color:"#94a3b8"}, items: [{id:"i1", label:"Categorías editables", correctBucket:"left"}, {id:"i2", label:"Publicidad de préstamos", correctBucket:"right"}, {id:"i3", label:"Reportes mensuales", correctBucket:"left"}, {id:"i4", label:"Juegos integrados", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "her-1-6", stepType: "info", title: "Opciones en el Mercado", body: "Existen apps como Bluecoins, Wallet, o YNAB. Cada una tiene su flujo. Lo importante no es la app perfecta, sino la que TÚ estés dispuesto a abrir cada día.", fullScreen: true },
  { id: "her-1-7", stepType: "true_false", statement: "Es peligroso conectar mi banco a una app de finanzas de buena reputación.", correctValue: false, explanation: "Apps líderes usan encriptación bancaria y acceso de 'solo lectura'. No pueden mover tu dinero, solo leerlo.", isAssessment:true, fullScreen: true },
  { id: "her-1-8", stepType: "order", question: "Pasos para Adoptar una App", items: [{id:"p1", label: "Descargar y Explorar", correctOrder: 1}, {id: "p2", label: "Configurar Categorías", correctOrder: 2}, {id: "p3", label: "Registrar Gastos 21 días", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "her-1-9", stepType: "blitz_challenge", question: "¿Cuál es la app más recomendada para Presupuesto Base Cero?", options: [{id:"o1", label:"YNAB (You Need A Budget)", isCorrect:true}, {id:"o2", label:"Instagram", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "her-1-10", stepType: "blitz_challenge", question: "¿Qué haces si olvidas anotar un gasto?", options: [{id:"o1", label:"Abandonar el mes", isCorrect:false}, {id:"o2", label:"Estimar y seguir adelante", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "her-1-11", stepType: "match", question: "Relaciona la App", leftItems: [{id:"l1", label:"Monefy"}, {id:"l2", label:"Wallet"}], rightItems: [{id:"r1", label:"Rápida y Visual"}, {id:"r2", label:"Robusta y Bancaria"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}], isAssessment: true, fullScreen: true },
  { id: "her-1-12", stepType: "mindset_translator", question: "Refactoriza tu tecnología", beliefs: [{id: "b1", original: "Tener una app me va a estresar.", healthyOptions: [{id: "h1", label: "Tener orden me quita el estrés de la incertidumbre", isCorrect: true}, {id: "h2", label: "La ignorancia es felicidad", isCorrect: false}]}] },
  { id: "her-1-13", stepType: "narrative_check", question: "¿Qué funcionalidad le pedirías a tu app ideal para que no la dejes de usar?", promptPlaceholder: "Me gustaría que ...", minChars: 15, billyResponse: "La sencillez suele ser la clave. Menos es más en el control diario.", fullScreen: true },
  { id: "her-1-14", stepType: "info", title: "Alerta de Ingeniería", body: "No instales 10 apps. Elige UNA y domínala. El exceso de herramientas causa parálisis. La herramienta es el medio, el control es el fin.", fullScreen: true,
    aiInsight: "Las personas que revisan su app de finanzas al menos una vez al día tienen un 30% menos de deudas de tarjeta de crédito."
  },
  { id: "her-1-15", stepType: "summary", title: "Apps Mapeadas", body: "Has visto el mundo digital. Siguiente: El poder de Excel.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 2: ¿Cómo usar Excel para tus finanzas? - 15 SLIDES
// ==============================================================================
export const lessonExcelFinancieroSteps: LessonStep[] = [
  { id: "her-2-1", stepType: "billy_talks", body: "Para los ingenieros del detalle, no hay nada como una hoja de cálculo. Flexibilidad total y poder de análisis puro. Vamos a dominar las celdas.", fullScreen: true,
    data: { glossary: [{ word: "Hoja de Cálculo", definition: "Software (Excel, Google Sheets) para organizar datos en tablas y aplicar fórmulas." }, { word: "Tabla Dinámica", definition: "Herramienta avanzada para resumir grandes cantidades de datos financieros rápidamente." }] }
  },
  { id: "her-2-2", stepType: "info", title: "Libertad de Diseño", body: "A diferencia de las apps, en Excel tú pones las reglas. Puedes crear fórmulas complejas, proyectar a 10 años y tener todo bajo una misma matriz que tú controlas.", fullScreen: true,
    aiInsight: "El 90% de las empresas Fortune 500 siguen usando Excel para su planeación financiera debido a su versatilidad inigualable."
  },
  { id: "her-2-3", stepType: "impulse_meter", instructions: "Mantén pulsado y visualiza las celdas calculando tu futuro. Siente el poder matemático. Respira exactitud.", item: { name: "Matriz Excel", price: "0.00", imageUrl: "/billy-breathing.png" }, holdTime: 6, fullScreen: true },
  { id: "her-2-4", stepType: "mcq", question: "¿Cuál es la mayor ventaja de Excel sobre una app móvil cerrada?", options: [{id:"o1", label:"Es más fácil de usar en el camión", isCorrect:false}, {id:"o2", label:"Es totalmente personalizable y permite análisis profundo", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "her-2-5", stepType: "swipe_sorter", question: "¿Qué incluir en tu Excel Financiero?", leftBucket: {label:"Indispensable", color:"#3b82f6"}, rightBucket: {label:"Opcional", color:"#94a3b8"}, items: [{id:"i1", label:"Columna de Fecha", correctBucket:"left"}, {id:"i2", label:"Gráficos 3D complejos", correctBucket:"right"}, {id:"i3", label:"Validación de Datos (Categorías)", correctBucket:"left"}, {id:"i4", label:"Fotos de los tickets", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "her-2-6", stepType: "info", title: "Google Sheets: La Nube", body: "Sheets es el compañero ideal. Puedes actualizarlo desde el móvil y consultarlo en la PC. Es gratis, colaborativo y se guarda solo. No hay excusa de 'perdí mi archivo'.", fullScreen: true },
  { id: "her-2-7", stepType: "true_false", statement: "Necesitas ser experto en macros para llevar tus finanzas en Excel.", correctValue: false, explanation: "Con sumas básicas y restas tienes el 95% de lo que necesitas. La simplicidad gana a la complejidad.", isAssessment:true, fullScreen: true },
  { id: "her-2-8", stepType: "order", question: "Arquitectura de tu Hoja", items: [{id:"p1", label: "Pestaña de Ingresos", correctOrder: 1}, {id: "p2", label: "Pestaña de Gastos", correctOrder: 2}, {id: "p3", label: "Pestaña de Dashboard (Gráficas)", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "her-2-9", stepType: "blitz_challenge", question: "¿Qué función suma tus gastos por categoría automáticamente?", options: [{id:"o1", label:"SUMAR.SI", isCorrect:true}, {id:"o2", label:"PROMEDIO", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "her-2-10", stepType: "blitz_challenge", question: "¿Cuál es el mejor formato para descargar tus movimientos del banco?", options: [{id:"o1", label:".CSV o .XLSX", isCorrect:true}, {id:"o2", label:".PDF", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "her-2-11", stepType: "match", question: "Relaciona Herramienta", leftItems: [{id:"l1", label:"Fórmula"}, {id:"l2", label:"Gráfico"}], rightItems: [{id:"r1", label:"Procesa Datos"}, {id:"r2", label:"Muestra Tendencias"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}], isAssessment: true, fullScreen: true },
  { id: "her-2-12", stepType: "mindset_translator", question: "Refactoriza tu planilla", beliefs: [{id: "b1", original: "Excel es muy aburrido.", healthyOptions: [{id: "h1", label: "Ver cómo crece mi patrimonio neto en Excel es mi actividad favorita", isCorrect: true}, {id: "h2", label: "Las tablas me dan sueño", isCorrect: false}]}] },
  { id: "her-2-13", stepType: "narrative_check", question: "¿Qué dato te daría miedo ver proyectado a 5 años en un Excel?", promptPlaceholder: "Me daría miedo ver ...", minChars: 15, billyResponse: "Enfrentar ese dato hoy es lo que te permite cambiar el resultado mañana.", fullScreen: true },
  { id: "her-2-14", stepType: "info", title: "Alerta de Ingeniería", body: "No reinventes la rueda. Busca una plantilla BIZEN o una estándar de Google Sheets para empezar. Ajusta sobre la marcha, no empieces desde cero absoluto.", fullScreen: true,
    aiInsight: "Tener un Excel actualizado semanalmente reduce los errores de planeación financiera en un 50% comparado con el seguimiento mental."
  },
  { id: "her-2-15", stepType: "summary", title: "Excel Dominado", body: "Has visto el poder del cálculo. Siguiente: Métodos Manuales.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 3: ¿Qué métodos manuales de control hay? - 15 SLIDES
// ==============================================================================
export const lessonMetodosManualesSteps: LessonStep[] = [
  { id: "her-3-1", stepType: "billy_talks", body: "A veces la mejor tecnología es un lápiz y papel. Si lo digital te distrae, lo analógico te centra. Vamos a ver los métodos de la vieja escuela que aún funcionan.", fullScreen: true,
    data: { glossary: [{ word: "Método de Sobres", definition: "Repartir efectivo en sobres físicos etiquetados por categoría de gasto." }, { word: "Kakebo", definition: "Método japonés de llevar cuentas a mano centrado en la reflexión consciente." }] }
  },
  { id: "her-3-2", stepType: "info", title: "El Dolor del Efectivo", body: "Pasar la tarjeta es indoloro. Entregar un billete físico genera una respuesta emocional de pérdida. Los métodos manuales aprovechan esta 'fricción' para frenar el gasto impulsivo.", fullScreen: true,
    aiInsight: "Estudios demuestran que las personas gastan entre un 15% y un 20% más cuando pagan con tarjeta o medios digitales que con efectivo físico."
  },
  { id: "her-3-3", stepType: "impulse_meter", instructions: "Mantén pulsado y siente la textura de tus billetes. Siente el peso de tu gasto. Respira consciencia manual.", item: { name: "Sobre Físico", price: "0.00", imageUrl: "/billy-breathing.png" }, holdTime: 6, fullScreen: true },
  { id: "her-3-4", stepType: "mcq", question: "¿Por qué el método de los sobres es tan efectivo?", options: [{id:"o1", label:"Porque deja de ser dinero", isCorrect:false}, {id:"o2", label:"Porque impone un límite físico infranqueable: si el sobre está vacío, no hay gasto", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "her-3-5", stepType: "swipe_sorter", question: "¿Qué método manual elegir?", leftBucket: {label:"Sobres", color:"#10b981"}, rightBucket: {label:"Libreta (Kakebo)", color:"#3b82f6"}, items: [{id:"i1", label:"Si gasto mucho en efectivo", correctBucket:"left"}, {id:"i2", label:"Si quiero reflexionar diario", correctBucket:"right"}, {id:"i3", label:"Para control semanal rígido", correctBucket:"left"}, {id:"i4", label:"Para ver mis sentimientos", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "her-3-6", stepType: "info", title: "Kakebo: El Arte del Diario", body: "No solo anotas el gasto. El Kakebo te pregunta: ¿Era necesario? ¿Me hizo feliz? Es meditación financiera. Ideal para quienes consumen por ansiedad o aburrimiento.", fullScreen: true },
  { id: "her-3-7", stepType: "true_false", statement: "Usar sobres físicos es el método más seguro contra robos digitales.", correctValue: true, explanation: "Un hacker no puede entrar en tu sobre de cartón. Sin embargo, el riesgo de pérdida física es mayor. Todo es un balance de riesgos.", isAssessment:true, fullScreen: true },
  { id: "her-3-8", stepType: "order", question: "Pasos del Método de Sobres", items: [{id:"p1", label: "Retirar efectivo quincenal", correctOrder: 1}, {id: "p2", label: "Distribuir en categorías", correctOrder: 2}, {id: "p3", label: "Gastar solo lo que hay dentro", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "her-3-9", stepType: "blitz_challenge", question: "¿Qué haces si el sobre de 'Diversión' se acaba temprano?", options: [{id:"o1", label:"Dejar de salir ese mes", isCorrect:true}, {id:"o2", label:"Sacar del sobre de 'Renta'", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "her-3-10", stepType: "blitz_challenge", question: "¿Cuál es el principal enemigo del método manual?", options: [{id:"o1", label:"Olvidar anotar", isCorrect:true}, {id:"o2", label:"El exceso de datos", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "her-3-11", stepType: "match", question: "Relaciona Método", leftItems: [{id:"l1", label:"Sobres"}, {id:"l2", label:"Kakebo"}], rightItems: [{id:"r1", label:"Límite Físico"}, {id:"r2", label:"Reflexión Mental"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}], isAssessment: true, fullScreen: true },
  { id: "her-3-12", stepType: "mindset_translator", question: "Refactoriza tu manual", beliefs: [{id: "b1", original: "Me da vergüenza usar efectivo.", healthyOptions: [{id: "h1", label: "Me da más orgullo tener mis cuentas bajo control absoluto", isCorrect: true}, {id: "h2", label: "La apariencia es más importante", isCorrect: false}]}] },
  { id: "her-1-13", stepType: "narrative_check", question: "¿En qué categoría de gasto crees que 'tocar' el dinero físico te ayudaría a gastar menos?", promptPlaceholder: "Me ayudaría en ...", minChars: 15, billyResponse: "Pruébalo un mes. Verás cómo cambia tu relación con cada billete.", fullScreen: true },
  { id: "her-3-14", stepType: "info", title: "Alerta de Ingeniería", body: "Puedes ser híbrido. Usa lo digital para lo grande y fijo (renta, nómina) y lo manual para lo que se te escapa de las manos (comidas, salidas, hormiga).", fullScreen: true,
    aiInsight: "Escribir a mano tus metas financieras aumenta la probabilidad de lograrlas en un 42% debido a la activación de la corteza prefrontal."
  },
  { id: "her-3-15", stepType: "summary", title: "Métodos Manuales Dominados", body: "Has visto el espectro completo de herramientas. Siguiente: El Ahorro.", fullScreen: true },
]
