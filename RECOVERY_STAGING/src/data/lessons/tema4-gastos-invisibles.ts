import type { LessonStep } from "@/types/lessonTypes"

/**
 * Tema 4: Tipos de Gastos (Subtema C: Gastos Invisibles)
 * 
 * Sigue el BIZEN Lesson Blueprint (15 slides por lección, 2 Blitz, 2+ AI Insights, No emojis).
 */

// ==============================================================================
// LECCIÓN 11: Comisiones y fugas bancarias - 15 SLIDES
// ==============================================================================
export const lessonComisionesYFugasBancariasSteps: LessonStep[] = [
  { id: "inv-1-1", stepType: "billy_talks", body: "Los gastos invisibles son aquellos que no pasan por tus manos. Son deducciones automáticas, comisiones y recargos que el sistema te cobra por 'distracción'.", fullScreen: true,
    data: { glossary: [{ word: "Comisión Bancaria", definition: "Cargo que realiza una entidad financiera por la prestación de un servicio o mantenimiento de cuenta." }, { word: "Fuga Pasiva", definition: "Dinero que sale de tu patrimonio sin una acción de compra consciente de tu parte." }] }
  },
  { id: "inv-1-2", stepType: "info", title: "El Impuesto a la Desidia", body: "Retirar en cajeros de otros bancos, no mantener el saldo mínimo, pagar anualidades de tarjetas que no usas... Son micro-mordidas que desangran tu flujo mensualmente.", fullScreen: true,
    aiInsight: "Las instituciones financieras generan hasta un 20% de sus utilidades anuales solamente a través de comisiones por manejo de cuenta y recargos por morosidad."
  },
  { id: "inv-1-3", stepType: "mcq", question: "Retiras $1,000 en un cajero ajeno y te cobran $35 de comisión. ¿Qué porcentaje de tu dinero perdiste al instante?", options: [{id:"o1", label:"0.35%", isCorrect:false}, {id:"o2", label:"3.5%", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "inv-1-4", stepType: "swipe_sorter", question: "¿Es un Gasto Visible (Tú lo pagas) o Invisible (Te lo quitan)?", leftBucket: {label:"Visible (Compra)", color:"#fbbf24"}, rightBucket: {label:"Invisible (Fuga)", color:"#ef4444"}, items: [{id:"s1", label:"Pago de despensa", correctBucket:"left"}, {id:"s2", label:"Anualidad de tarjeta", correctBucket:"right"}, {id:"s3", label:"Compra de zapatos", correctBucket:"left"}, {id:"s4", label:"Comisión por SPEI/Transferencia", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "inv-1-5", stepType: "info", title: "Blindaje de Cuenta", body: "Revisa siempre las 'letras chiquitas'. Muchos bancos cobran por 'seguros' que no pediste. Llama y cancela todo lo que no te genere un valor activo comprobable.", fullScreen: true },
  { id: "inv-1-6", stepType: "true_false", statement: "Es normal y aceptable pagar comisiones por manejo de cuenta en la era digital.", correctValue: false, explanation: "Existen decenas de opciones de banca digital sin comisiones. Pagar por 'tener tu dinero guardado' es una ineficiencia técnica.", isAssessment: true, fullScreen: true },
  { id: "inv-1-7", stepType: "order", question: "Protocolo de Limpieza Bancaria", items: [{id:"p1", label: "Descargar estado de cuenta mensual", correctOrder: 1}, {id: "p2", label: "Resaltar cada cargo que no sea una compra tuya", correctOrder: 2}, {id: "p3", label: "Llamar al banco para aclarar o cancelar cargos", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "inv-1-8", stepType: "match", question: "Relaciona la Fuga", leftItems: [{id:"l1", label:"Sobregiro"}, {id:"l2", label:"Anualidad"}, {id:"l3", label:"Seguro Oculto"}], rightItems: [{id:"r1", label:"Gastar más de lo que hay"}, {id:"r2", label:"Costo por 'derecho' a crédito"}, {id:"r3", label:"Cargo por protección no solicitada"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}, {leftId:"l3", rightId:"r3"}], isAssessment: true, fullScreen: true },
  { id: "inv-1-9", stepType: "blitz_challenge", question: "¿Cómo se llama el costo por no usar cajeros propios?", options: [{id:"o1", label:"Comisión Interbancaria", isCorrect:true}, {id:"o2", label:"Impuesto de Salida", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "inv-1-10", stepType: "blitz_challenge", question: "¿Qué debe ser tu meta con las comisiones?", options: [{id:"o1", label:"Pagar menos", isCorrect:false}, {id:"o2", label:"Pagar CERO", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "inv-1-11", stepType: "mindset_translator", question: "Eficiencia Bancaria", beliefs: [{id: "b1", original: "Todos los bancos cobran lo mismo, no vale la pena cambiar.", healthyOptions: [{id: "h1", label: "Moveré mi capital a donde no me cobren por existir; yo mando en mi dinero", isCorrect: true}, {id: "h2", label: "Soy leal a mi banco aunque me robe", isCorrect: false}]}] },
  { id: "inv-1-12", stepType: "impulse_meter", instructions: "Mantén pulsado y visualiza los cargos invisibles de tu app bancaria desvaneciéndose. Respira ahorro pasivo.", item: { name: "Escudo Anti-Comisiones", price: "0.00", imageUrl: "/billy-breathing.png" }, holdTime: 6, fullScreen: true },
  { id: "inv-1-13", stepType: "narrative_check", question: "¿Cuándo fue la última vez que revisaste renglón por renglón tu estado de cuenta?", promptPlaceholder: "No lo reviso hace ...", minChars: 10, billyResponse: "Hazlo hoy mismo. Te aseguro que encontrarás al menos una fuga.", fullScreen: true },
  { id: "inv-1-14", stepType: "info", title: "Fuga por Inflación", body: "Dato Técnico: Tener dinero estancado en una cuenta que no da intereses es también un Gasto Invisible (Costo de Oportunidad). La inflación se come tu valor.", fullScreen: true,
    aiInsight: "Un 2% de inflación anual significa que cada 10 años tu dinero estancado vale un 20% menos."
  },
  { id: "inv-1-15", stepType: "summary", title: "Fugas Detectadas", body: "Has visto lo invisible. Siguiente: Membresías y suscripciones olvidadas.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 12: Membresías y suscripciones olvidadas - 15 SLIDES
// ==============================================================================
export const lessonMembresiasYSuscripcionesOlvidadasSteps: LessonStep[] = [
  { id: "inv-2-1", stepType: "billy_talks", body: "¿Sabes cuántas apps están 'succionando' $100 pesos de tu cuenta cada mes mientras duermes? Vamos a limpiar el jardín de suscripciones.", fullScreen: true,
    data: { glossary: [{ word: "Economía de Suscripción", definition: "Modelo de negocio donde el cliente paga una cuota recurrente por el acceso a un producto o servicio." }, { word: "Churn Pasivo", definition: "Cuando un usuario deja de usar un servicio pero olvida cancelar el pago." }] }
  },
  { id: "inv-2-2", stepType: "info", title: "El Olvido es un Negocio", body: "Las empresas aman el 'Set and Forget'. Saben que si el monto es bajo, no te tomarás la molestia de cancelarlo aunque no lo uses. Es la 'hormiga' más peligrosa porque es 100% automática.", fullScreen: true,
    aiInsight: "El usuario promedio tiene 3 suscripciones que no ha abierto en los últimos 90 días."
  },
  { id: "inv-2-3", stepType: "mcq", question: "Tienes 4 servicios de streaming ($200 c/u) pero solo ves uno con frecuencia. ¿Cuánto estás tirando al año en 'olvido'?", options: [{id:"o1", label:"$2,400 pesos", isCorrect:false}, {id:"o2", label:"$7,200 pesos", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "inv-2-4", stepType: "swipe_sorter", question: "¿Mantener o Cancelar (Basado en Uso)?", leftBucket: {label:"Mantener (Activo)", color:"#10b981"}, rightBucket: {label:"Cancelar (Pasivo)", color:"#ef4444"}, items: [{id:"s1", label:"App de ejercicio que usas diario", correctBucket:"left"}, {id:"s2", label:"Membresía premium de sitio de noticias que no lees", correctBucket:"right"}, {id:"s3", label:"Almacenamiento en la nube lleno", correctBucket:"left"}, {id:"s4", label:"Suscripción a canal de cocina de hace 1 año", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "inv-2-5", stepType: "info", title: "La Táctica del 'Unsubscribe'", body: "Hoy mismo ve a tu Apple ID o Google Play. Si no has abierto la app en 30 días, CANCÉLALA. No 'perderás' nada; siempre puedes volver a contratar si realmente te hace falta.", fullScreen: true },
  { id: "inv-2-6", stepType: "true_false", statement: "Es mejor pagar la suscripción anual porque 'sale más barato' por mes.", correctValue: false, explanation: "Solo si estás SEGURO de usarla los 12 meses. Si la dejas de usar al mes 3, el 'ahorro' anual fue una pérdida masiva.", isAssessment: true, fullScreen: true },
  { id: "inv-2-7", stepType: "order", question: "Purga de Suscripciones", items: [{id:"p1", label: "Listar todos los cargos recurrentes", correctOrder: 1}, {id: "p2", label: "Clasificar por 'Frecuencia de Uso'", correctOrder: 2}, {id: "p3", label: "Eliminar las que no pasaron el filtro de 30 días", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "inv-2-8", stepType: "match", question: "Relaciona el Valor", leftItems: [{id:"l1", label:"Gimnasio"}, {id:"l2", label:"TV Streaming"}, {id:"l3", label:"Educación"}], rightItems: [{id:"r1", label:"Valor si vas 3+ veces/semana"}, {id:"r2", label:"Valor si ves 10+ horas/mes"}, {id:"r3", label:"Valor si aplicas lo aprendido"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}, {leftId:"l3", rightId:"r3"}], isAssessment: true, fullScreen: true },
  { id: "inv-2-9", stepType: "blitz_challenge", question: "¿Qué periodo de uso define si algo es útil?", options: [{id:"o1", label:"Los últimos 30 días", isCorrect:true}, {id:"o2", label:"Lo que pienso usar el próximo año", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "inv-2-10", stepType: "blitz_challenge", question: "¿Cuál es la 'trampa' del mes gratuito?", options: [{id:"o1", label:"Que te guste el producto", isCorrect:false}, {id:"o2", label:"Que olvides cancelarlo", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "inv-2-11", stepType: "mindset_translator", question: "Arquitecto de Consumo", beliefs: [{id: "b1", original: "No la cancelo por si la llego a necesitar.", healthyOptions: [{id: "h1", label: "Si la necesito, la contrato de nuevo en 30 segundos; mientras tanto, mi dinero se queda conmigo", isCorrect: true}, {id: "h2", label: "Prefiero perder dinero que perder un acceso hipotético", isCorrect: false}]}] },
  { id: "inv-2-12", stepType: "impulse_meter", instructions: "Mantén pulsado y visualiza al botón de 'Cancelar Suscripción'. Siente la liberación de capital. Respira limpieza.", item: { name: "Limpiador de Apps", price: "0.00", imageUrl: "/billy-breathing.png" }, holdTime: 6, fullScreen: true },
  { id: "inv-2-13", stepType: "narrative_check", question: "¿Cuántas suscripciones crees que tienes activas ahora mismo, contando apps, gimnasio, clubs, etc?", promptPlaceholder: "Tengo aproximadamente ...", minChars: 1, billyResponse: "Anota el número y luego ve a contarlas. Te apuesto a que son más de las que crees.", fullScreen: true },
  { id: "inv-2-14", stepType: "info", title: "Costo de Retención", body: "Las empresas gastan millones en hacer que el botón de 'cancelar' sea difícil de encontrar. No dejes que su diseño gane sobre tu voluntad.", fullScreen: true,
    aiInsight: "Las personas que revisan sus suscripciones cada 3 meses ahorran un promedio de $5,000 pesos anuales extras."
  },
  { id: "inv-2-15", stepType: "summary", title: "Suscripciones Depuradas", body: "Has limpiado la maleza de tu cuenta. Siguiente: El costo del interés (Deuda Mala).", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 13: El costo del interés (Deuda mala) - 15 SLIDES
// ==============================================================================
export const lessonElCostoDelInteresDeudaMalaSteps: LessonStep[] = [
  { id: "inv-3-1", stepType: "billy_talks", body: "El interés es el Gasto Invisible más masivo de la historia. Es pagarle a alguien más por el privilegio de usar dinero que no tienes para comprar cosas que no necesitas.", fullScreen: true,
    data: { glossary: [{ word: "Tasa de Interés", definition: "Precio a pagar por utilizar una cantidad de dinero durante un tiempo determinado." }, { word: "Interés Compuesto Negativo", definition: "Cuando la deuda genera intereses sobre intereses, creando una bola de nieve que te aplasta." }] }
  },
  { id: "inv-3-2", stepType: "info", title: "El Precio x 2", body: "Si compras una TV de $10,000 a 12 meses con intereses del 40%, la TV no te costó $10,000. Te costó $14,000. Ese 'pequeño cargo' de $4,000 es puro dinero invisible que regalaste.", fullScreen: true,
    aiInsight: "El costo de los intereses en tarjetas de crédito en México puede superar el 70% anual, uno de los más altos del mundo."
  },
  { id: "inv-3-3", stepType: "mcq", question: "Pagas solo el 'mínimo' de tu tarjeta cada mes. ¿Qué está pasando con tu deuda real?", options: [{id:"o1", label:"Se está pagando poco a poco", isCorrect:false}, {id:"o2", label:"Se está expandiendo por el interés acumulado", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "inv-3-4", stepType: "swipe_sorter", question: "¿Es Deuda Buena (Produce) o Deuda Mala (Consume)?", leftBucket: {label:"Deuda Buena (Activo)", color:"#10b981"}, rightBucket: {label:"Deuda Mala (Pasivo)", color:"#ef4444"}, items: [{id:"s1", label:"Préstamo para mercancía de negocio", correctBucket:"left"}, {id:"s2", label:"Viaje a meses con intereses", correctBucket:"right"}, {id:"s3", label:"Crédito Hipotecario (Bien ubicado)", correctBucket:"left"}, {id:"s4", label:"Ropa nueva a crédito", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "inv-3-5", stepType: "info", title: "La Trampa del Pago Mínimo", body: "El banco ama el pago mínimo. Está diseñado para que nunca termines de pagar y seas un cliente 'rentable' para ellos por décadas.", fullScreen: true },
  { id: "inv-3-6", stepType: "true_false", statement: "Los Meses Sin Intereses (MSI) son siempre dinero gratis.", correctValue: false, explanation: "Solo si eres 100% disciplinado. Si fallas un pago, el interés se vuelve retroactivo y carísimo sobre el total.", isAssessment: true, fullScreen: true },
  { id: "inv-3-7", stepType: "order", question: "Estrategia Bola de Nieve (Pagos)", items: [{id:"p1", label: "Hacer lista de todas las deudas y sus tasas", correctOrder: 1}, {id: "p2", label: "Pagar el mínimo en todas excepto en la de tasa más alta", correctOrder: 2}, {id: "p3", label: "Lanzar todo el excedente a la deuda más cara hasta eliminarla", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "inv-3-8", stepType: "match", question: "Relaciona el Monstruo", leftItems: [{id:"l1", label:"CAT"}, {id:"l2", label:"Interés Moratorio"}, {id:"l3", label:"Amortización"}], rightItems: [{id:"r1", label:"Costo Anual Total (Todo incluido)"}, {id:"r2", label:"Multa por pagar tarde"}, {id:"r3", label:"Reducción gradual de la deuda"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}, {leftId:"l3", rightId:"r3"}], isAssessment: true, fullScreen: true },
  { id: "inv-3-9", stepType: "blitz_challenge", question: "¿Qué parte del pago no baja la deuda principal?", options: [{id:"o1", label:"El Interés", isCorrect:true}, {id:"o2", label:"El Abono a Capital", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "inv-3-10", stepType: "blitz_challenge", question: "¿Quién se hace rico con tu deuda mala?", options: [{id:"o1", label:"Tú", isCorrect:false}, {id:"o2", label:"El banco", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "inv-3-11", stepType: "mindset_translator", question: "Libertad de Deuda", beliefs: [{id: "b1", original: "Tener deudas es normal, todo el mundo las tiene.", healthyOptions: [{id: "h1", label: "La deuda de consumo es esclavitud moderna; yo compro con mi propio esfuerzo, no con el de mi yo del futuro", isCorrect: true}, {id: "h2", label: "Si todos deben, yo también", isCorrect: false}]}] },
  { id: "inv-3-12", stepType: "impulse_meter", instructions: "Mantén pulsado y quema tus contratos de deuda mala. Respira solvencia total.", item: { name: "Extintor de Deuda", price: "Libertad", imageUrl: "/billy-breathing.png" }, holdTime: 6, fullScreen: true },
  { id: "inv-3-13", stepType: "narrative_check", question: "¿Cuál es la tasa de interés (CAT) de tu tarjeta principal? Si no la sabes, ¿por qué permites que te cobren algo que no conoces?", promptPlaceholder: "Mi CAT es ... / No lo sé porque ...", minChars: 10, billyResponse: "Investigarlo es tu tarea de hoy. El conocimiento detiene la hemorragia.", fullScreen: true },
  { id: "inv-3-14", stepType: "info", title: "El Poder de Invertir", body: "Si en lugar de pagar 40% de interés, lo GANARAS invirtiendo, estarías en el 1% de la población más rica. Es el mismo mecanismo, pero a tu favor.", fullScreen: true,
    aiInsight: "La deuda de tarjetas de crédito es el principal obstáculo para que la generación Millennial logre comprar una propiedad."
  },
  { id: "inv-3-15", stepType: "summary", title: "Interés Identificado", body: "Ya no eres una presa del crédito fácil. Siguiente: Descuentos que salen caros.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 14: Descuentos que salen caros - 15 SLIDES
// ==============================================================================
export const lessonDescuentosQueSalenCarosSteps: LessonStep[] = [
  { id: "inv-4-1", stepType: "billy_talks", body: "Nada es más caro que aquello que compras 'solo porque estaba en oferta'. El descuento es el Gasto Invisible más irónico de todos.", fullScreen: true,
    data: { glossary: [{ word: "Ahorro Ficticio", definition: "Dinero que crees haber ganado al comprar algo rebajado, olvidando que igual salió de tu bolsillo." }, { word: "Gasto de Llenado", definition: "Comprar extras para alcanzar un monto de 'envío gratis' o una promoción específica." }] }
  },
  { id: "inv-4-2", stepType: "info", title: "La Matemáticas del 3x2", body: "Si necesitas 1 jugo y compras 3 'porque es 3x2', acabas de gastar DINERO EXTRA que no tenías planeado. No ahorraste 1, gastaste 2 que no necesitabas.", fullScreen: true,
    aiInsight: "El 60% de los productos comprados en rebajas tipo 'Black Friday' terminan en la basura o sin usar en menos de 6 meses."
  },
  { id: "inv-4-3", stepType: "mcq", question: "Algo cuesta $1,000. Tiene 50% de descuento. Si NO lo necesitabas y lo compras, ¿cuánto ahorraste?", options: [{id:"o1", label:"$500 pesos", isCorrect:false}, {id:"o2", label:"$0 pesos (Gastaste $500)", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "inv-4-4", stepType: "swipe_sorter", question: "¿Es Ganancia Real o Trampa de Descuento?", leftBucket: {label:"Ganancia (Planeado)", color:"#10b981"}, rightBucket: {label:"Trampa (Impulso)", color:"#ef4444"}, items: [{id:"s1", label:"Comprar abrigo en verano (planeado)", correctBucket:"left"}, {id:"s2", label:"'Llévese el segundo a mitad de precio'", correctBucket:"right"}, {id:"s3", label:"Aprovechar oferta en producto que consumes diario", correctBucket:"left"}, {id:"s4", label:"'Solo por hoy: 70% en lujos'", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "inv-4-5", stepType: "info", title: "El Envío Gratis que Cuesta caro", body: "Te faltan $100 para el envío gratis de $200. Compras algo de $150 para 'ahorrar'. Acabas de regalar $150 al negocio a cambio de nada.", fullScreen: true },
  { id: "inv-4-6", stepType: "true_false", statement: "Gastar para ahorrar es una estrategia financiera sólida para gastos hormiga.", correctValue: false, explanation: "Gastar nunca es ahorrar. Ahorrar es NO gastar. El lenguaje del marketing te confunde a propósito.", isAssessment: true, fullScreen: true },
  { id: "inv-4-7", stepType: "order", question: "Filtro Anti-Oferta", items: [{id:"p1", label: "¿Lo iba a comprar a precio completo ayer?", correctOrder: 1}, {id: "p2", label: "¿Tengo el capital destinado para esto?", correctOrder: 2}, {id: "p3", label: "¿El valor que recibo es mayor al costo?", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "inv-4-8", stepType: "match", question: "Relaciona la Oferta", leftItems: [{id:"l1", label:"3x2"}, {id:"l2", label:"Liquidación"}, {id:"l3", label:"Últimas piezas"}], rightItems: [{id:"r1", label:"Incentivo al volumen"}, {id:"r2", label:"Limpieza de stock viejo"}, {id:"r3", label:"Fuerza de escasez (Miedo)"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}, {leftId:"l3", rightId:"r3"}], isAssessment: true, fullScreen: true },
  { id: "inv-4-9", stepType: "blitz_challenge", question: "¿Cuál es el ahorro si no compras?", options: [{id:"o1", label:"100%", isCorrect:true}, {id:"o2", label:"50%", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "inv-4-10", stepType: "blitz_challenge", question: "¿Qué busca un descuento?", options: [{id:"o1", label:"Tu beneficio", isCorrect:false}, {id:"o2", label:"Acelerar la venta", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "inv-4-11", stepType: "mindset_translator", question: "Consumo Crítico", beliefs: [{id: "b1", original: "Es una oportunidad única, no volverá a ese precio.", healthyOptions: [{id: "h1", label: "El mercado siempre tiene ofertas; mi oportunidad real es conservar mi capital hoy", isCorrect: true}, {id: "h2", label: "Tengo que comprarlo o pierdo dinero", isCorrect: false}]}] },
  { id: "inv-4-12", stepType: "impulse_meter", instructions: "Mantén pulsado y visualiza la oferta como un anzuelo de pesca. Respira distancia.", item: { name: "Escudo Anti-Anzuelos", price: "0.00", imageUrl: "/billy-breathing.png" }, holdTime: 6, fullScreen: true },
  { id: "inv-4-13", stepType: "narrative_check", question: "¿Qué ha sido lo más inútil que has comprado solo porque estaba en rebaja?", promptPlaceholder: "Compré una ... porque estaba rebajada.", minChars: 15, billyResponse: "Aprender del error es la única forma de que esa compra 'valga' algo.", fullScreen: true },
  { id: "inv-4-14", stepType: "info", title: "Costo de Almacenamiento", body: "Comprar mucho de algo solo por barato ocupa ESPACIO y energía. Un hogar lleno de 'gangas' es un hogar pesado y desorganizado.", fullScreen: true,
    aiInsight: "La desorganización física en el hogar se correlaciona con un 20% más de gastos impulsivos."
  },
  { id: "inv-4-15", stepType: "summary", title: "Trampas Desactivadas", body: "Has dominado el arte de no morder el anzuelo. Siguiente: Auditoría 360 de mis salidas.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 15: Auditoría 360 de mis salidas - 15 SLIDES
// ==============================================================================
export const lessonAuditoria360DeMisSalidasSteps: LessonStep[] = [
  { id: "inv-5-1", stepType: "billy_talks", body: "Finalizamos el Tema 4. Es momento de integrar todo: Fijos, Variables, Hormigas e Invisibles en un solo sistema de control de ingeniería.", fullScreen: true,
    data: { glossary: [{ word: "Auditoría 360", definition: "Revisión exhaustiva de todas las entradas y salidas de capital sin excepciones." }, { word: "Eficiencia de Flujo", definition: "Porcentaje de tus ingresos que logras retener e invertir tras cubrir gastos." }] }
  },
  { id: "inv-5-2", stepType: "influence_detective", scenario: "Después de este bloque nocturno, te sientes cansado. Mañana tienes que ir al banco a cancelar esa anualidad. ¿Cuál es tu compromiso?", options: [{id:"o1", label:"Lo hago la próxima semana", emotion:"Procrastinación", isCorrect:false}, {id:"o2", label:"Mañana a las 9am es mi prioridad real", emotion:"Compromiso BIZEN", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "inv-5-3", stepType: "info", title: "El Tablero de Control", body: "Tu dinero es energía. Si hay fugas, la máquina no avanza. Tu tarea no es ganar más (por ahora), es dejar de PERDER lo que ya tienes.", fullScreen: true,
    aiInsight: "Un ajuste del 10% en gastos invisibles equivale a un aumento salarial del 15% debido a la falta de impuestos en el ahorro."
  },
  { id: "inv-5-4", stepType: "swipe_sorter", question: "¿En qué cuadrante está este gasto?", leftBucket: {label:"Hormiga/Invisible (Fuga)", color:"#ef4444"}, rightBucket: {label:"Fijo/Variable (Estructura)", color:"#3b82f6"}, items: [{id:"s1", label:"Comisión por pago tardío", correctBucket:"left"}, {id:"s2", label:"Renta mensual", correctBucket:"right"}, {id:"s3", label:"Suscripción olvidada", correctBucket:"left"}, {id:"s4", label:"Compra de comida semanal", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "inv-5-5", stepType: "info", title: "La Regla del 1%", body: "Si un gasto no mejora tu vida al menos un 1% de forma directa, cuestiónalo. ¿Para qué está ahí? ¿A quién beneficia realmente?", fullScreen: true },
  { id: "inv-5-6", stepType: "true_false", statement: "El objetivo de BIZEN es que dejes de gastar en todo lo que te gusta.", correctValue: false, explanation: "El objetivo es que gastes en lo que REALMENTE te importa y elimines la basura que el sistema te impone por inercia.", isAssessment: true, fullScreen: true },
  { id: "inv-5-7", stepType: "order", question: "Tu Nueva Rutina Mensual", items: [{id:"p1", label: "Día 1: Revisión de extractos y cancelación de fugas", correctOrder: 1}, {id: "p2", label: "Día 5: Asignación de presupuesto por categoría", correctOrder: 2}, {id: "p3", label: "Día 30: Medición de ahorro logrado", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "inv-5-8", stepType: "match", question: "Relaciona el Logro", leftItems: [{id:"l1", label:"Consciencia"}, {id:"l2", label:"Sustitución"}, {id:"l3", label:"Eficiencia"}], rightItems: [{id:"r1", label:"Detectar Hormigas"}, {id:"r2", label:"Cambiar Deseo por Valor"}, {id:"r3", label:"Eliminar Invisibles"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}, {leftId:"l3", rightId:"r3"}], isAssessment: true, fullScreen: true },
  { id: "inv-5-9", stepType: "blitz_challenge", question: "¿Qué hemos matado en este tema?", options: [{id:"o1", label:"La inercia de gasto", isCorrect:true}, {id:"o2", label:"Toda nuestra diversión", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "inv-5-10", stepType: "blitz_challenge", question: "¿Qué eres ahora?", options: [{id:"o1", label:"Un consumidor pasivo", isCorrect:false}, {id:"o2", label:"Un Ingeniero de su Propio Flujo", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "inv-5-11", stepType: "mindset_translator", question: "Manifestación Final", beliefs: [{id: "b1", original: "No tengo el control total de mi dinero.", healthyOptions: [{id: "h1", label: "Soy el único responsable de cada centavo que entra y sale; domino mi sistema", isCorrect: true}, {id: "h2", label: "El destino decide mi presupuesto", isCorrect: false}]}] },
  { id: "inv-5-12", stepType: "impulse_meter", instructions: "Mantén pulsado y sella tu maestría sobre los Tipos de Gastos. Respira dominio absoluto.", item: { name: "Certificación de Control", price: "0.00", imageUrl: "/billy-breathing.png" }, holdTime: 7, fullScreen: true },
  { id: "inv-5-13", stepType: "narrative_check", question: "¿Cuál es la cifra total mensual que calculas que vas a rescatar tras este tema?", promptPlaceholder: "Rescataré ... mensuales.", minChars: 10, billyResponse: "Cualquier número es una victoria. Multiplícalo por 12 y ese es tu aumento salarial auto-gestionado.", fullScreen: true },
  { id: "inv-5-14", stepType: "info", title: "Certificación de Bloque", body: "Has completado el Tema 4. Tienes las herramientas para limpiar tu flujo. Estás listo para el siguiente nivel: Flujo de Dinero y Balance Estratégico.", fullScreen: true,
    aiInsight: "La paz mental financiera no viene de ganar más, sino de saber exactamente a dónde va cada moneda."
  },
  { id: "inv-5-15", stepType: "summary", title: "Tema 4 Completado", body: "Felicidades, Ingeniero. Has reclamado tu territorio. Siguiente: Tema 5 - Flujo de Dinero.", fullScreen: true },
]
