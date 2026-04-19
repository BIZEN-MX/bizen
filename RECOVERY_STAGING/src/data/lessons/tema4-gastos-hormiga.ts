import type { LessonStep } from "@/types/lessonTypes"

/**
 * Tema 4: Tipos de Gastos (Subtema B: Gastos Hormiga)
 * 
 * Sigue el BIZEN Lesson Blueprint (15 slides por lección, 2 Blitz, 2+ AI Insights, No emojis).
 */

// ==============================================================================
// LECCIÓN 6: ¿Qué son y por qué importan? - 15 SLIDES
// ==============================================================================
export const lessonQueSonYPorQueImportanSteps: LessonStep[] = [
  { id: "hor-1-1", stepType: "billy_talks", body: "Los gastos hormiga son pequeñas fugas de capital que parecen insignificantes en el día a día, pero que sumadas pueden devorar tu libertad financiera.", fullScreen: true,
    data: { glossary: [{ word: "Gasto Hormiga", definition: "Consumo diario de bajo costo que se realiza por impulso o hábito sin ser estrictamente necesario." }, { word: "Efecto Acumulado", definition: "El impacto masivo de pequeñas acciones repetidas a lo largo de un gran periodo de tiempo." }] }
  },
  { id: "hor-1-2", stepType: "info", title: "La Trampa de los $20 pesos", body: "Un café extra, un chicle, una propina innecesaria... $20 pesos al día parecen nada. En un año son $7,300. En 10 años, con interés, son una fortuna.", fullScreen: true,
    aiInsight: "El promedio de una persona gasta entre el 10% y el 15% de su ingreso anual en gastos hormiga sin darse cuenta."
  },
  { id: "hor-1-3", stepType: "info", title: "Psicología de la Hormiga", body: "Tu cerebro no activa el 'alerta de gasto' porque el monto es bajo. Es una técnica de marketing: bajar la barrera de dolor para que el dinero salga libremente.", fullScreen: true },
  { id: "hor-1-4", stepType: "mcq", question: "Si compras una botella de agua todos los días en la calle en lugar de llevar tu termo, ¿qué tipo de gasto es?", options: [{id:"o1", label:"Gasto de Operación Necesario", isCorrect:false}, {id:"o2", label:"Gasto Hormiga", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "hor-1-5", stepType: "swipe_sorter", question: "¿Es un Gasto Hormiga (Fuga) o un Gasto Justificado (Valor)?", leftBucket: {label:"Hormiga (Peligro)", color:"#ef4444"}, rightBucket: {label:"Justificado (Lógica)", color:"#10b981"}, items: [{id:"s1", label:"Cafetería diaria", correctBucket:"left"}, {id:"s2", label:"Pago de luz", correctBucket:"right"}, {id:"s3", label:"Snack de tienda de conveniencia", correctBucket:"left"}, {id:"s4", label:"Compra de libros de estudio", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "hor-1-6", stepType: "true_false", statement: "Los gastos hormiga son fáciles de detectar a fin de mes en el estado de cuenta.", correctValue: false, explanation: "Suelen ser en efectivo o micro-transacciones que 'se pierden' entre los gastos grandes.", isAssessment: true, fullScreen: true },
  { id: "hor-1-7", stepType: "info", title: "El Costo de Oportunidad de la Hormiga", body: "Esos $7,300 anuales podrían ser tu primer paso para invertir en Cetes o Bitcoin. Estás intercambiando tu libertad futura por un placer de 5 minutos.", fullScreen: true },
  { id: "hor-1-8", stepType: "order", question: "Impacto del Gasto Hormiga", items: [{id:"p1", label: "Pequeño placer momentáneo", correctOrder: 1}, {id: "p2", label: "Fuga invisible de capital semanal", correctOrder: 2}, {id: "p3", label: "Retraso de metas financieras anuales", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "hor-1-9", stepType: "blitz_challenge", question: "¿Qué animal representa estas fugas?", options: [{id:"o1", label:"Elefante", isCorrect:false}, {id:"o2", label:"Hormiga", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "hor-1-10", stepType: "blitz_challenge", question: "¿Cómo se combaten?", options: [{id:"o1", label:"Con registro y consciencia", isCorrect:true}, {id:"o2", label:"Ganando más dinero para que no importen", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "hor-1-11", stepType: "match", question: "Relaciona la Hormiga", leftItems: [{id:"l1", label:"Hormiga Física"}, {id:"l2", label:"Hormiga Digital"}, {id:"l3", label:"Hormiga Social"}], rightItems: [{id:"r1", label:"Snacks y Refrescos"}, {id:"r2", label:"Apps premium no usadas"}, {id:"r3", label:"Propinas por presión"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}, {leftId:"l3", rightId:"r3"}], isAssessment: true, fullScreen: true },
  { id: "hor-1-12", stepType: "mindset_translator", question: "Cambio de Lente", beliefs: [{id: "b1", original: "Solo son $10 pesos, no pasa nada.", healthyOptions: [{id: "h1", label: "Son $10 pesos que multiplico por 365 días; es una fuga de mi seguridad", isCorrect: true}, {id: "h2", label: "El dinero pequeño no vale nada", isCorrect: false}]}] },
  { id: "hor-1-13", stepType: "narrative_check", question: "¿Qué es lo primero que compras casi todos los días 'por inercia'?", promptPlaceholder: "Compro casi siempre ...", minChars: 10, billyResponse: "Nombrar a la hormiga es el primer paso para capturarla.", fullScreen: true },
  { id: "hor-1-14", stepType: "info", title: "Alerta de Ingeniería", body: "En ingeniería, una micro-fractura constante destruye un puente. En finanzas, la micro-fuga constante destruye tu patrimonio.", fullScreen: true,
    aiInsight: "El promedio de una persona gasta entre el 10% y el 15% de su ingreso anual en gastos hormiga sin darse cuenta."
  },
  { id: "hor-1-15", stepType: "summary", title: "Hormiguero Detectado", body: "Has entendido el peligro de lo pequeño. Siguiente: Detectar tus 3 hormigas personales.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 7: Detectar 3 gastos hormiga personales - 15 SLIDES
// ==============================================================================
export const lessonDetectar3GastosHormigaPersonalesSteps: LessonStep[] = [
  { id: "hor-2-1", stepType: "billy_talks", body: "No podemos pelear contra lo que no vemos. Vamos a hacer un escaneo profundo de tus últimas 72 horas para encontrar a las culpables.", fullScreen: true },
  { id: "hor-2-2", stepType: "influence_detective", scenario: "Revisas tu aplicación bancaria y ves cuatro cargos de $35 pesos en la misma tienda esta semana. Ni siquiera recuerdas qué compraste. ¿Qué haces?", options: [{id:"o1", label:"Lo ignoro, es poco dinero", emotion:"Negación", isCorrect:false}, {id:"o2", label:"Anoto 'Hormiga Tienda' y analizo el trigger", emotion:"Lógica BIZEN", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "hor-2-3", stepType: "info", title: "Técnica del Ticket de Guerra", body: "Durante 3 días, guarda CADA ticket, por pequeño que sea. Al final del día, sepáralos: ¿Fue valor o fue hormiga?", fullScreen: true,
    aiInsight: "El 40% de los gastos hormiga ocurren por aburrimiento o estrés, no por hambre o necesidad."
  },
  { id: "hor-2-4", stepType: "swipe_sorter", question: "¿Hormiga o Necesidad?", leftBucket: {label:"Hormiga", color:"#ef4444"}, rightBucket: {label:"Necesidad", color:"#10b981"}, items: [{id:"s1", label:"Comisión por retirar en cajero ajeno", correctBucket:"left"}, {id:"s2", label:"Compra de jabón para ropa", correctBucket:"right"}, {id:"s3", label:"Refresco en la comida", correctBucket:"left"}, {id:"s4", label:"Pago de transporte público", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "hor-2-5", stepType: "info", title: "Las 3 Reinas Hormiga", body: "1. Comida/Bebida fuera. 2. Comisiones/Recargos. 3. Suscripciones/Apps. ¿Cuál de estas domina tu cuenta?", fullScreen: true },
  { id: "hor-2-6", stepType: "true_false", statement: "Es posible tener gastos hormiga incluso si no sales de casa.", correctValue: true, explanation: "Las compras 'in-app', suscripciones de juegos o servicios de delivery son hormigas digitales potentes.", isAssessment: true, fullScreen: true },
  { id: "hor-2-7", stepType: "order", question: "Proceso de Auditoría Hormiga", items: [{id:"p1", label: "Recolectar evidencia (Tickets/App)", correctOrder: 1}, {id: "p2", label: "Sumar el gasto total semanal de esa hormiga", correctOrder: 2}, {id: "p3", label: "Sentir el 'dolor' de la suma total", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "hor-2-8", stepType: "match", question: "Relaciona el Costo Oculto", leftItems: [{id:"l1", label:"Café $50/día"}, {id:"l2", label:"Uber $80/día"}, {id:"l3", label:"Lunch $100/día"}], rightItems: [{id:"r1", label:"$1,500/Mes"}, {id:"r2", label:"$2,400/Mes"}, {id:"r3", label:"$3,000/Mes"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}, {leftId:"l3", rightId:"r3"}], isAssessment: true, fullScreen: true },
  { id: "hor-2-9", stepType: "blitz_challenge", question: "¿Qué herramienta es mejor para detectar hormigas?", options: [{id:"o1", label:"La memoria", isCorrect:false}, {id:"o2", label:"El registro escrito", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "hor-2-10", stepType: "blitz_challenge", question: "¿Cuándo es mejor registrar el gasto?", options: [{id:"o1", label:"Al final del mes", isCorrect:false}, {id:"o2", label:"En el momento que sucede", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "hor-2-11", stepType: "mindset_translator", question: "Detective de Capital", beliefs: [{id: "b1", original: "No tengo fugas, soy muy cuidadoso.", healthyOptions: [{id: "h1", label: "Auditaré mis gastos pequeños porque sé que las fugas son por naturaleza invisibles", isCorrect: true}, {id: "h2", label: "Mi mente nunca se equivoca con el dinero", isCorrect: false}]}] },
  { id: "hor-2-12", stepType: "impulse_meter", instructions: "Mantén pulsado y escanea tus gastos de ayer. Identifica la hormiga reina. Respira verdad.", item: { name: "Escáner Hormiga", price: "$$$", imageUrl: "/billy-breathing.png" }, holdTime: 6, fullScreen: true },
  { id: "hor-2-13", stepType: "narrative_check", question: "De tu auditoría mental rápida: ¿Cual es la hormiga que más te sorprendió por su frecuencia?", promptPlaceholder: "Me sorprendió que gasto mucho en ...", minChars: 15, billyResponse: "Ese es tu objetivo primordial de cacería. Prepárate.", fullScreen: true },
  { id: "hor-2-14", stepType: "info", title: "Alerta de Fugas Digitales", body: "Cuidado con las 'Pruebas Gratuitas' que no cancelas. Es la hormiga más inteligente: se alimenta de tu olvido.", fullScreen: true,
    aiInsight: "Las empresas de suscripción ganan un 30% más gracias a personas que olvidan cancelar su periodo de prueba."
  },
  { id: "hor-2-15", stepType: "summary", title: "Objetivos Localizados", body: "Has mapeado el campo de batalla. Siguiente: Recorte inteligente (Sin sufrir).", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 8: Recorte inteligente (Sin “sufrir”) - 15 SLIDES
// ==============================================================================
export const lessonRecorteInteligenteSinSufrirSteps: LessonStep[] = [
  { id: "hor-3-1", stepType: "billy_talks", body: "Muchos fallan al intentar dejar todos sus gastos hormiga de golpe. Eso no funciona; es como una dieta extrema. Vamos a usar la Ingeniería de Sustitución.", fullScreen: true,
    data: { glossary: [{ word: "Sustitución de Hábito", definition: "Cambiar un gasto irracional por uno racional que ofrezca el mismo placer o beneficio." }, { word: "Gasto de Compensación", definition: "Compra pequeña para sentir que mereces algo tras trabajar duro." }] }
  },
  { id: "hor-3-2", stepType: "info", title: "El Alivio No se Corta, se Cambia", body: "Si compras un café diario por el 'escape mental', busca otro alivio gratuito: una caminata, una charla o preparar tu propio café artesanal por una fracción del costo.", fullScreen: true,
    aiInsight: "Las personas que llevan comida de casa al trabajo ahorran hasta $30,000 pesos anuales en promedio."
  },
  { id: "hor-3-3", stepType: "mcq", question: "Si compras algo cada vez que estás estresado, ¿qué debes atacar primero?", options: [{id:"o1", label:"El precio de la compra", isCorrect:false}, {id:"o2", label:"La fuente del estrés (Trigger)", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "hor-3-4", stepType: "swipe_sorter", question: "¿Acción de Recorte Inteligente o Accion de Sufrimiento?", leftBucket: {label:"Inteligente (Táctica)", color:"#10b981"}, rightBucket: {label:"Sufrimiento (Falla)", color:"#ef4444"}, items: [{id:"s1", label:"Llevar termo con agua fría", correctBucket:"left"}, {id:"s2", label:"No comer nada en todo el día", correctBucket:"right"}, {id:"s3", label:"Cancelar app que no usas nunca", correctBucket:"left"}, {id:"s4", label:"Trabajar 15 horas sin descanso", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "hor-3-5", stepType: "info", title: "Frecuencia sobre Monto", body: "Es más fácil bajar la FRECUENCIA que eliminarlo. De diario a 3 veces por semana ahorra el 40% de inmediato sin sentir la carencia total.", fullScreen: true },
  { id: "hor-3-6", stepType: "true_false", statement: "El gasto hormiga es una recompensa justa por mi esfuerzo diario.", correctValue: false, explanation: "Es una trampa emocional. Una verdadera recompensa es tener capital para tu LIBERTAD, no un café de sobreprecio.", isAssessment: true, fullScreen: true },
  { id: "hor-3-7", stepType: "order", question: "Pasos para el Recorte", items: [{id:"p1", label: "Contar cuántas veces lo haces al mes", correctOrder: 1}, {id: "p2", label: "Reducir la frecuencia a la mitad", correctOrder: 2}, {id: "p3", label: "Invertir la diferencia al instante", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "hor-3-8", stepType: "match", question: "Relaciona Estrategia", leftItems: [{id:"l1", label:"Prep-Day"}, {id:"l2", label:"Auto-Débito"}, {id:"l3", label:"Pausa Técnica"}], rightItems: [{id:"r1", label:"Preparar lunches los domingos"}, {id:"r2", label:"Ahorro automático al recibir nómina"}, {id:"r3", label:"Esperar 1 hora antes del antojo"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}, {leftId:"l3", rightId:"r3"}], isAssessment: true, fullScreen: true },
  { id: "hor-3-9", stepType: "blitz_challenge", question: "¿Qué es mejor: reducir o eliminar?", options: [{id:"o1", label:"Reducir primero (Sostenible)", isCorrect:true}, {id:"o2", label:"Eliminar todo ya", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "hor-3-10", stepType: "blitz_challenge", question: "¿Qué mata el recorte?", options: [{id:"o1", label:"La nostalgia de la hormiga", isCorrect:false}, {id:"o2", label:"La inercia de no planear", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "hor-3-11", stepType: "mindset_translator", question: "Refinar Placeres", beliefs: [{id: "b1", original: "Si no gasto en esto, mi vida es aburrida.", healthyOptions: [{id: "h1", label: "Mis experiencias no dependen de micro-transacciones; disfruto mi ahorro con propósito", isCorrect: true}, {id: "h2", label: "Solo comprando soy feliz", isCorrect: false}]}] },
  { id: "hor-3-12", stepType: "impulse_meter", instructions: "Mantén pulsado y siente la gratificación retrasada. Respira paciencia.", item: { name: "Poder de Decisión", price: "0.00", imageUrl: "/billy-breathing.png" }, holdTime: 6, fullScreen: true },
  { id: "hor-3-13", stepType: "narrative_check", question: "¿A qué frecuencia vas a bajar tu hormiga principal a partir de mañana?", promptPlaceholder: "Bajaré a ... veces por semana.", minChars: 15, billyResponse: "Concreto y accionable. Ese es el camino de un Ingeniero.", fullScreen: true },
  { id: "hor-3-14", stepType: "info", title: "Alerta de Resultados", body: "No se trata de privarte, se trata de OPTIMIZAR. ¿Compras el agua por sed o por comodidad? Compra el termo y optimiza el flujo.", fullScreen: true,
    aiInsight: "Registrar tus ahorros logrados (visualizar cuánto NO gastaste) libera casi la misma dopamina que el gasto mismo."
  },
  { id: "hor-3-15", stepType: "summary", title: "Recorte Diseñado", body: "Ya no sufres, ahora operas con frialdad técnica. Siguiente: Sustituciones Inteligentes.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 9: Sustituciones (Barato, Saludable, Útil) - 15 SLIDES
// ==============================================================================
export const lessonSustitucionesBaratoSaludableUtilSteps: LessonStep[] = [
  { id: "hor-4-1", stepType: "billy_talks", body: "Para cada gasto hormiga existe una alternativa de ALTO VALOR y BAJO COSTO. La clave está en la preparación previa.", fullScreen: true,
    data: { glossary: [{ word: "Gasto de Alto Valor", definition: "Aquel que tiene un impacto positivo duradero en tu salud, finanzas o carrera." }, { word: "Costo de Conveniencia", definition: "El precio extra que pagas por no estar preparado (ej. pagar $40 pesos por un chocolate que en el súper cuesta $15)." }] }
  },
  { id: "hor-4-2", stepType: "info", title: "La Táctica del Granel", body: "Si compras snacks todos los días en la tienda de conveniencia, pagas un 200% de sobreprecio. Compra el paquete grande en el súper y sepáralo. Misma comida, mitad de precio.", fullScreen: true,
    aiInsight: "Las tiendas de conveniencia están diseñadas psicológicamente para que entres por una cosa y salgas con 3 hormigas más."
  },
  { id: "hor-4-3", stepType: "mcq", question: "Te da hambre a las 4pm. No tienes nada. ¿Qué eliges para ser BIZEN?", options: [{id:"o1", label:"Máquina de snacks de la oficina ($25)", isCorrect:false}, {id:"o2", label:"Llevar mi fruta de casa ($5)", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "hor-4-4", stepType: "swipe_sorter", question: "¿Sustitución Exitosa o Ineficiencia?", leftBucket: {label:"Sustitución (Valor)", color:"#10b981"}, rightBucket: {label:"Ineficiencia (Hormiga)", color:"#ef4444"}, items: [{id:"s1", label:"Termo con café de casa", correctBucket:"left"}, {id:"s2", label:"Comedor de la empresa", correctBucket:"left"}, {id:"s3", label:"Uber Eats por flojera", correctBucket:"right"}, {id:"s4", label:"Comisiones por cajero Red", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "hor-4-5", stepType: "info", title: "Invertir en Equipamiento", body: "A veces necesitas gastar para ahorrar. Un buen termo, una lonchera térmica o un filtro de agua son las MEJORES inversiones para matar hormigas para siempre.", fullScreen: true },
  { id: "hor-4-6", stepType: "true_false", statement: "Comprar marcas genéricas de productos básicos es una sustitución inteligente.", correctValue: true, explanation: "Muchos productos genéricos tienen la misma calidad técnica que los de marca, pero sin el costo de marketing.", isAssessment: true, fullScreen: true },
  { id: "hor-4-7", stepType: "order", question: "Proceso de Sustitución", items: [{id:"p1", label: "Identificar necesidad real (Hambre/Sed)", correctOrder: 1}, {id: "p2", label: "Tener el equipo listo (Termo/Lunch)", correctOrder: 2}, {id: "p3", label: "Evitar el entorno de trigger (Tiendas)", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "hor-4-8", stepType: "match", question: "Relaciona el Cambio", leftItems: [{id:"l1", label:"Cafetería Sirena"}, {id:"l2", label:"Agua en botella"}, {id:"l3", label:"Snack de tienda"}], rightItems: [{id:"r1", label:"Prensa francesa en casa"}, {id:"r2", label:"Termo inoxidable"}, {id:"r3", label:"Mix de nueces a granel"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}, {leftId:"l3", rightId:"r3"}], isAssessment: true, fullScreen: true },
  { id: "hor-4-9", stepType: "blitz_challenge", question: "¿Cómo se llama el costo de 'no estar listo'?", options: [{id:"o1", label:"Conveniencia", isCorrect:true}, {id:"o2", label:"Oportunidad", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "hor-4-10", stepType: "blitz_challenge", question: "¿Qué objeto es el 'serial killer' de hormigas?", options: [{id:"o1", label:"El termo", isCorrect:true}, {id:"o2", label:"La billetera", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "hor-4-11", stepType: "mindset_translator", question: "Logística BIZEN", beliefs: [{id: "b1", original: "Me da flojera preparar mi comida.", healthyOptions: [{id: "h1", label: "Dedico 20 min a preparar para ahorrar $500/semana; mi tiempo vale oro", isCorrect: true}, {id: "h2", label: "Mi flojera es más cara que mi libertad", isCorrect: false}]}] },
  { id: "hor-4-12", stepType: "impulse_meter", instructions: "Mantén pulsado para 'instalar' el hábito de preparación. Respira logística.", item: { name: "Kit Prep", price: "0.00", imageUrl: "/billy-breathing.png" }, holdTime: 5, fullScreen: true },
  { id: "hor-4-13", stepType: "narrative_check", question: "¿Cuál es la primera sustitución que harás mañana por la mañana?", promptPlaceholder: "Voy a sustituir ... por ...", minChars: 15, billyResponse: "Simple y potente. Empieza pequeño, gana grande.", fullScreen: true },
  { id: "hor-4-14", stepType: "info", title: "Impacto en Salud", body: "Dato Extra: Casi todas las sustituciones de gastos hormiga (agua de casa vs refresco, fruta vs galletas) también mejoran tu SALUD. Doble ganancia.", fullScreen: true,
    aiInsight: "Reducir el azúcar refinado de los gastos hormiga aumenta la productividad laboral en un 12% promedio."
  },
  { id: "hor-4-15", stepType: "summary", title: "Arsenal de Sustitución", body: "Has transformado tus fugas en eficiencia. Siguiente: El Reto de 7 Días.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 10: Reto: Semana sin Gasto Hormiga - 15 SLIDES
// ==============================================================================
export const lessonRetoSemanaSinGastoHormigaSteps: LessonStep[] = [
  { id: "hor-5-1", stepType: "billy_talks", body: "Llegó la hora de la práctica de campo. Vamos a declararle la guerra a las hormigas por 7 días seguidos. ¿Aceptas el desafío?", fullScreen: true,
    data: { glossary: [{ word: "Gasto Cero", definition: "Día en el que solo realizas tus gastos fijos y variables necesarios, sin un solo centavo de hormiga." }, { word: "Cazador de Fugaz", definition: "Estado mental de alerta ante cualquier micro-transacción." }] }
  },
  { id: "hor-5-2", stepType: "influence_detective", scenario: "Es jueves, vas por la calle y huele a pan recién horneado. Tienes hambre. Acabas de comer pero el antojo es fuerte. ¿Estrategia?", options: [{id:"o1", label:"Me compro solo uno", emotion:"Debilidad", isCorrect:false}, {id:"o2", label:"Bebo agua de mi termo y sigo caminando", emotion:"Acero BIZEN", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "hor-5-3", stepType: "info", title: "Reglas del Reto", body: "1. No compras micro-snacks. 2. No pides delivery si puedes cocinar. 3. No compras bebidas en la calle. 4. Registras cada victory en tu mente.", fullScreen: true,
    aiInsight: "Completar 7 días de un hábito nuevo reduce la barrera de resistencia cerebral en un 60% para la siguiente semana."
  },
  { id: "hor-5-4", stepType: "swipe_sorter", question: "¿Es Acción de Guerra contra Hormigas o Rendición?", leftBucket: {label:"Guerra (Victoria)", color:"#10b981"}, rightBucket: {label:"Rendición (Fuga)", color:"#ef4444"}, items: [{id:"s1", label:"Lavar mi auto en casa", correctBucket:"left"}, {id:"s2", label:"Cena fuera porque estoy cansado", correctBucket:"right"}, {id:"s3", label:"Ver película en casa", correctBucket:"left"}, {id:"s4", label:"Comisión por pago de luz en tienda", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "hor-5-5", stepType: "info", title: "Tu Diario de Guerra", body: "Anota cada vez que dijiste 'No'. Cada NO es un depósito en tu cuenta de libertad. Al final de la semana, suma lo que NO gastaste.", fullScreen: true },
  { id: "hor-5-6", stepType: "true_false", statement: "Si fallas un día, el reto se cancela por completo.", correctValue: false, explanation: "No buscamos perfección, buscamos progreso. Si caes, levántate en el siguiente gasto. No es excusa para rendirse.", isAssessment: true, fullScreen: true },
  { id: "hor-5-7", stepType: "order", question: "Kit de Supervivencia Semanal", items: [{id:"p1", label: "Llenar termo de agua por la mañana", correctOrder: 1}, {id: "p2", label: "Revisar agenda de comidas", correctOrder: 2}, {id: "p3", label: "Dejar tarjeta de crédito en casa (usa solo efectivo/débito controlado)", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "hor-5-8", stepType: "match", question: "Relaciona Situación", leftItems: [{id:"l1", label:"Aburrimiento"}, {id:"l2", label:"Estrés"}, {id:"l3", label:"Sociedad"}], rightItems: [{id:"r1", label:"Leer un fragmento de BIZEN"}, {id:"r2", label:"Respiración 4-7-8"}, {id:"r3", label:"Proponer plan gratuito (Parque)"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}, {leftId:"l3", rightId:"r3"}], isAssessment: true, fullScreen: true },
  { id: "hor-5-9", stepType: "blitz_challenge", question: "¿Qué es un día de Gasto Cero?", options: [{id:"o1", label:"No gastar nada en hormigas", isCorrect:true}, {id:"o2", label:"No comer nada", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "hor-5-10", stepType: "blitz_challenge", question: "¿Cuál es el premio del reto?", options: [{id:"o1", label:"Tu propia autonomía", isCorrect:true}, {id:"o2", label:"Una medalla física", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "hor-5-11", stepType: "mindset_translator", question: "Grito de Guerra", beliefs: [{id: "b1", original: "No sé si puedo aguantar 7 días.", healthyOptions: [{id: "h1", label: "Soy el dueño de mis impulsos y domino mi entorno por una semana de prueba", isCorrect: true}, {id: "h2", label: "Mis impulsos son más fuertes que yo", isCorrect: false}]}] },
  { id: "hor-5-12", stepType: "impulse_meter", instructions: "Mantén pulsado y sella tu compromiso con el reto de 7 días. Respira victoria.", item: { name: "Sello de Compromiso", price: "0.00", imageUrl: "/billy-breathing.png" }, holdTime: 6, fullScreen: true },
  { id: "hor-5-13", stepType: "narrative_check", question: "¿Qué día de la próxima semana crees que será el más difícil del reto y por qué?", promptPlaceholder: "El día será ... porque ...", minChars: 15, billyResponse: "Anticipar la crisis es la mejor forma de vencerla. Estaré contigo.", fullScreen: true },
  { id: "hor-5-14", stepType: "info", title: "Cierre del Bloque", body: "Has dominado el arte de detectar y exterminar hormigas. Tu flujo de capital acaba de ganar una presión extra que antes se fugaba.", fullScreen: true,
    aiInsight: "La confianza ganada al vencer pequeños impulsos se transfiere a decisiones financieras grandes (inversión y negocios)."
  },
  { id: "hor-5-15", stepType: "summary", title: "Cacería Terminada", body: "Has visto dónde se fugaba tu capital. ¡Actúa hoy!", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 6: Sustitución de Marcas Estratégica - 15 SLIDES
// ==============================================================================
export const lessonSustitucionDeMarcasEstrategicaSteps: LessonStep[] = [
  { id: "sus-1-1", stepType: "billy_talks", body: "Pagar por el logo en lugar de por el producto es una ineficiencia que tu Yo del Futuro no puede permitirse. Vamos a aplicar ingeniería de sustitución.", fullScreen: true,
    data: { glossary: [{ word: "Marca Blanca (Genérica)", definition: "Productos fabricados por grandes empresas pero comercializados bajo la marca del distribuidor, ofreciendo calidad similar a menor precio." }, { word: "Costo por Logotipo", definition: "Diferencia de precio entre un producto de marca reconocida y uno genérico con la misma composición técnica." }] }
  },
  { id: "sus-1-2", stepType: "info", title: "La Trampa del Branding", body: "En categorías como medicamentos, limpieza del hogar o alimentos básicos, la diferencia técnica suele ser nula, pero la diferencia de precio es de hasta el 400%. Un Ingeniero BIZEN compra moléculas y materiales, no historias de marketing.", fullScreen: true,
    aiInsight: "Sustituir solo los 10 productos de limpieza y despensa más comunes por marcas blancas ahorra un promedio de $800 pesos mensuales."
  },
  { id: "sus-1-3", stepType: "impulse_meter", instructions: "Mantén pulsado y visualiza la misma calidad a una fracción del costo. Siente la eficiencia.", item: { name: "Sustituto Estratégico", price: "-40%", imageUrl: "/billy-breathing.png" }, holdTime: 5, fullScreen: true },
  { id: "sus-1-4", stepType: "mcq", question: "¿Qué compras cuando eliges el medicamento genérico certificado?", options: [{id:"o1", label:"Un producto de menor calidad", isCorrect:false}, {id:"o2", label:"La misma molécula activa por un precio justo", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "sus-1-5", stepType: "swipe_sorter", question: "¿Marca Reconocida o Sustituto Inteligente?", leftBucket: {label:"Reconocida (Caro)", color:"#fbbf24"}, rightBucket: {label:"Sustituto (Eficiente)", color:"#10b981"}, items: [{id:"i1", label:"Cloro de marca líder", correctBucket:"left"}, {id:"i2", label:"Cloro genérico de supermercado", correctBucket:"right"}, {id:"i3", label:"Arroz con empaque de lujo", correctBucket:"left"}, {id:"i4", label:"Arroz a granel o marca blanca", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "sus-1-6", stepType: "info", title: "El Blind Test Mental", body: "Si te dieran el producto en un envase blanco, ¿podrías notar la diferencia? Si la respuesta es no, estás pagando por el estatus de tener ese envase en tu basura después. Detén la fuga.", fullScreen: true },
  { id: "sus-1-7", stepType: "true_false", statement: "Las marcas blancas siempre son 'peores' para la salud.", correctValue: false, explanation: "Muchos genéricos son fabricados en las mismas plantas que las marcas líderes, solo cambia el empaque y el presupuesto de marketing.", isAssessment:true, fullScreen: true },
  { id: "sus-1-8", stepType: "order", question: "Pasos para optimizar tu alacena", items: [{id:"p1", label: "Identificar los 5 productos más caros de uso recurrente", correctOrder: 1}, {id: "p2", label: "Comprar una unidad de la marca blanca para prueba técnica", correctOrder: 2}, {id: "p3", label: "Hacer el cambio permanente si la calidad es aceptable", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "sus-1-9", stepType: "blitz_challenge", question: "¿Cómo se llama el ahorro por marca genérica?", options: [{id:"o1", label:"Eficiencia de Compra", isCorrect:true}, {id:"o2", label:"Tacañería", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "sus-1-10", stepType: "blitz_challenge", question: "¿Qué industria tiene el mayor margen por marca?", options: [{id:"o1", label:"Farmacéutica y Cosmética", isCorrect:true}, {id:"o2", label:"Alimentos frescos", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "sus-1-11", stepType: "match", question: "Relaciona Categoría", leftItems: [{id:"l1", label:"Líquidos limpieza"}, {id:"l2", label:"Granos básicos"}, {id:"l3", label:"Medicamentos"}], rightItems: [{id:"r1", label:"Sustituir Siempre"}, {id:"r2", label:"Sustituir Siempre"}, {id:"r3", label:"Sustituir (con aval médico)"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}, {leftId:"l3", rightId:"r3"}], isAssessment: true, fullScreen: true },
  { id: "sus-1-12", stepType: "mindset_translator", question: "Refactoriza tu estatus", beliefs: [{id: "b1", original: "Me da pena que vean marcas baratas en mi carrito.", healthyOptions: [{id: "h1", label: "Mi riqueza se mide por mi balance bancario, no por las marcas que tiro a la basura", isCorrect: true}, {id: "h2", label: "Consumir caro me hace ver importante", isCorrect: false}]}] },
  { id: "sus-1-13", stepType: "narrative_check", question: "¿Qué producto de marca 'líder' vas a dejar de comprar para probar el genérico esta semana?", promptPlaceholder: "Voy a sustituir ...", minChars: 10, billyResponse: "Nivel de soberanía aumentando. El ahorro empieza en las pequeñas decisiones.", fullScreen: true },
  { id: "sus-1-14", stepType: "info", title: "Alerta importante", body: "No sacrifiques calidad vital (como calzado deportivo o herramientas de trabajo esenciales), pero optimiza lo que es un 'commodity' (sal, detergente, azúcar).", fullScreen: true,
    aiInsight: "El consumidor inteligente ahorra un 20% anual en supermercado solo mediante sustitución estratégica."
  },
  { id: "sus-1-15", stepType: "summary", title: "Sustitución Completada", body: "Has dominado la cacería de marcas. Siguiente: Gastos Invisibles.", fullScreen: true },
]
