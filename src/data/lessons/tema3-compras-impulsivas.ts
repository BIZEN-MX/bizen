import type { LessonStep } from "@/types/lessonTypes"

/**
 * Subtema 3B: Compras Impulsivas
 * 
 * Lessons are now expanded to 15 slides each following the UPDATED BIZEN Blueprint (2 Blitz, 2+ AI Insights).
 */

// ==============================================================================
// LECCIÓN 1: Señales de compra impulsiva (Reconocimiento) - 15 SLIDES
// ==============================================================================
export const lessonSenalesDeCompraImpulsivaSteps: LessonStep[] = [
  { id: "imp-1-1", stepType: "billy_talks", body: "La compra impulsiva es una fuga de energía en tu sistema. Se detiene reconociendo la señal física antes de que llegue a la tarjeta.", fullScreen: true,
    data: { glossary: [{ word: "Impulsividad Financiera", definition: "Tendencia a realizar compras rápidas sin evaluar el impacto en el plan a largo plazo." }, { word: "Secuestro de la Amígdala", definition: "Estado emocional donde la parte lógica del cerebro es anulada por una respuesta instintiva." }] }
  },
  { id: "imp-1-2", stepType: "info", title: "El Micro-Instante de Decisión", body: "Hay un segundo exacto donde pasas de 'mirar' a 'comprar'. Si aprendes a detectar ese segundo, recuperas el control de tu destino.", fullScreen: true,
    aiInsight: "La mayoría de los compradores impulsivos reportan un estado de semi-trance durante el proceso de pago."
  },
  { id: "imp-1-3", stepType: "impulse_meter", instructions: "Mantén pulsado y detecta el 'calor' de la compra impulsiva. Suéltalo y respira frío analítico.", item: { name: "Detector de Impulsos", price: "0.00", imageUrl: "/billy-breathing.png" }, holdTime: 5, fullScreen: true },
  { id: "imp-1-4", stepType: "mcq", question: "¿Qué sientes físicamente justo antes de una compra impulsiva?", options: [{id:"o1", label:"Calma y claridad absoluta", isCorrect:false}, {id:"o2", label:"Urgencia, ansiedad o taquicardia leve", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "imp-1-5", stepType: "swipe_sorter", question: "¿Es una Compra Impulsiva o Planeada?", leftBucket: {label:"Impulsiva (Fuga)", color:"#ef4444"}, rightBucket: {label:"Planeada (Inversion)", color:"#10b981"}, items: [{id:"i1", label:"Chicles en la caja", correctBucket:"left"}, {id:"i2", label:"Gasto de súper con lista", correctBucket:"right"}, {id:"i3", label:"Gadget por 'oferta' de FB", correctBucket:"left"}, {id:"i4", label:"Aportación a cuenta de inversión", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "imp-1-6", stepType: "info", title: "La Trampa de las 2:00 AM", body: "El autocontrol se agota durante el día. Comprar de noche en el celular es la receta perfecta para el desastre financiero.", fullScreen: true },
  { id: "imp-1-7", stepType: "true_false", statement: "La compra impulsiva es una falta de carácter o moral.", correctValue: false, explanation: "Es una ineficiencia biológica en el procesamiento de recompensa. Se cura con ingeniería de entorno, no con latigazos.", isAssessment:true, fullScreen: true },
  { id: "imp-1-8", stepType: "order", question: "Anatomía del Impulso", items: [{id:"p1", label: "Estímulo visual (Publicidad)", correctOrder: 1}, {id: "p2", label: "Pico de dopamina (Anticipación)", correctOrder: 2}, {id: "p3", label: "Acción de pago (Arrepentimiento)", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "imp-1-9", stepType: "blitz_challenge", question: "¿Qué neurotransmisor manda en el impulso?", options: [{id:"o1", label:"Serotonina", isCorrect:false}, {id:"o2", label:"Dopamina", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "imp-1-10", stepType: "blitz_challenge", question: "¿Cómo se llama el estrés post-gasto?", options: [{id:"o1", label:"Resaca Financiera", isCorrect:true}, {id:"o2", label:"Paz mental", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "imp-1-11", stepType: "match", question: "Relaciona Disparador con Sensación", leftItems: [{id:"l1", label:"Escasez"}, {id:"l2", label:"Estatus"}], rightItems: [{id:"r1", label:"Miedo a perderse algo"}, {id:"r2", label:"Deseo de ser visto"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}], isAssessment: true, fullScreen: true },
  { id: "imp-1-12", stepType: "mindset_translator", question: "Refactoriza tu impulso", beliefs: [{id: "b1", original: "Tengo que comprarlo ahora o se acaba.", healthyOptions: [{id: "h1", label: "Si no estaba en mi plan, que se acabe es un ahorro para mi sistema", isCorrect: true}, {id: "h2", label: "Mi valor depende de esta oferta", isCorrect: false}]}] },
  { id: "imp-1-13", stepType: "narrative_check", question: "¿En qué app o sitio web sueles caer más seguido en compras impulsivas?", promptPlaceholder: "Suelo caer en ...", minChars: 10, billyResponse: "Identificar el lugar es el primer paso para instalar un cortafuegos.", fullScreen: true },
  { id: "imp-1-14", stepType: "info", title: "Alerta importante", body: "No vayas a 'ver' tiendas cuando estés triste o aburrido. Tu sistema de defensa está en mínimos históricos.", fullScreen: true,
    aiInsight: "El aburrimiento es el factor número uno de micro-compras digitales improductivas."
  },
  { id: "imp-1-15", stepType: "summary", title: "Señales Detectadas", body: "Has visto la alarma. Siguiente: El Checklist de Decisión.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 2: Antes de pagar (Checklist de decisión) - 15 SLIDES
// ==============================================================================
export const lessonAntesDePagarChecklistDeDecisionSteps: LessonStep[] = [
  { id: "imp-2-1", stepType: "billy_talks", body: "Antes de soltar un solo peso, pasa el gasto por este filtro de ingeniería. Si sobrevive, adelante. Si no, bórralo.", fullScreen: true,
    data: { glossary: [{ word: "Costo de Oportunidad", definition: "Lo que dejas de hacer o comprar por elegir la opción actual." }, { word: "Criterio de Necesidad Real", definition: "Validación de que un objeto resuelve un problema técnico en tu vida." }] }
  },
  { id: "imp-2-2", stepType: "info", title: "La Pregunta de los $500", body: "¿Si me dieran el dinero en efectivo en lugar del objeto, qué preferiría? Si prefieres el dinero, NO compres el objeto.", fullScreen: true,
    aiInsight: "Nuestro cerebro sobrevalora los objetos físicos frente al dinero líquido por sesgo de posesión."
  },
  { id: "imp-2-3", stepType: "mcq", question: "¿Qué pregunta es parte del Checklist BIZEN?", options: [{id:"o1", label: "¿Lo quiero ya?", isCorrect: false}, {id:"o2", label: "¿Estaría dispuesto a trabajar 10 horas extra solo por esto?", isCorrect: true}], isAssessment: true, fullScreen: true },
  { id: "imp-2-4", stepType: "swipe_sorter", question: "¿Pasa el Filtro de Ingeniería?", leftBucket: {label:"Rechazado (Gasto)", color:"#ef4444"}, rightBucket: {label:"Aprobado (Dato)", color:"#10b981"}, items: [{id:"i1", label:"Aumenta mi capacidad de ingreso", correctBucket:"right"}, {id:"i2", label:"Es una imitación de estatus", correctBucket:"left"}, {id:"i3", label:"Lo necesito para una función vital", correctBucket:"right"}, {id:"i4", label:"Solo está rebajado 50%", correctBucket:"left"}], isAssessment: true, fullScreen: true },
  { id: "imp-2-5", stepType: "info", title: "La Regla de las Horas de Vida", body: "Divide el precio entre lo que ganas por hora. ¿Vale este objeto 40 horas de tu vida sentado en la oficina?", fullScreen: true },
  { id: "imp-2-6", stepType: "true_false", statement: "Si un objeto te va a hacer 'feliz' por mucho tiempo, el checklist deja de importar.", correctValue: false, explanation: "La felicidad material es volátil. El checklist es técnico y protege tu estructura de largo plazo.", isAssessment:true, fullScreen: true },
  { id: "imp-2-7", stepType: "order", question: "Flujo de Validación", items: [{id:"p1", label: "Verificar si está en el presupuesto mensual", correctOrder: 1}, {id: "p2", label: "Comparar con metas anuales (Costo Oportunidad)", correctOrder: 2}, {id: "p3", label: "Ejecutar pago (Si pasa)", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "imp-2-8", stepType: "blitz_challenge", question: "¿Qué es más importante?", options: [{id:"o1", label:"El descuento percibido", isCorrect:false}, {id:"o2", label:"La utilidad real en tu vida", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "imp-2-9", stepType: "blitz_challenge", question: "¿El objeto te ayuda a ganar más dinero?", options: [{id:"o1", label:"Si no, es un pasivo", isCorrect:true}, {id:"o2", label:"No importa", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "imp-2-10", stepType: "match", question: "Relaciona Prueba", leftItems: [{id:"l1", label:"Prueba del Dinero"}, {id:"l2", label:"Prueba de las 48h"}], rightItems: [{id:"r1", label:"Dato vs Objeto"}, {id:"r2", label:"Tiempo vs Emoción"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}], isAssessment: true, fullScreen: true },
  { id: "imp-2-11", stepType: "mindset_translator", question: "Refactoriza tu valoración", beliefs: [{id: "b1", original: "Me lo merezco por haber trabajado duro.", healthyOptions: [{id: "h1", label: "Me merezco un sistema financiero sólido que me libere del trabajo duro", isCorrect: true}, {id: "h2", label: "Gastar es mi premio", isCorrect: false}]}] },
  { id: "imp-2-12", stepType: "impulse_meter", instructions: "Mantén pulsado y visualiza el objeto desapareciendo. Siente la paz de NO gastar.", item: { name: "Anulador de Gasto", price: "Libertad", imageUrl: "/billy-breathing.png" }, holdTime: 5, fullScreen: true },
  { id: "imp-2-13", stepType: "narrative_check", question: "¿Qué objeto estuviste a punto de comprar ayer y que hoy sabes que no necesitas?", promptPlaceholder: "Casi compro ...", minChars: 10, billyResponse: "Bien hecho. Acabas de ganar ese capital para tu libertad.", fullScreen: true },
  { id: "imp-2-14", stepType: "info", title: "Alerta importante", body: "Un checklist solo funciona si lo aplicas SIEMPRE. Sin excepciones, eres un Ingeniero de tu dinero.", fullScreen: true,
    aiInsight: "La disciplina táctica en micro-compras suma miles de dólares a largo plazo."
  },
  { id: "imp-2-15", stepType: "summary", title: "Checklist Guardado", body: "Ya tienes el filtro. Siguiente: Micro-hábitos anti-impulso.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 3: Micro-hábitos para evitar impulsos - 15 SLIDES
// ==============================================================================
export const lessonMicroHabitosParaEvitarImpulsosSteps: LessonStep[] = [
  { id: "imp-3-1", stepType: "billy_talks", body: "No pelees contra los impulsos; diseña un entorno donde no puedan ocurrir. Vamos a instalar parches en tu comportamiento.", fullScreen: true,
    data: { glossary: [{ word: "Arquitectura de Opciones", definition: "Diseño del entorno para que la opción correcta sea la más fácil de tomar." }, { word: "Fricción Financiera", definition: "Introducción consciente de pasos extra para dificultar un gasto." }] }
  },
  { id: "imp-3-2", stepType: "info", title: "Borrar el 'Un Click'", body: "La comodidad operativa del sistema es tu enemiga. Borra tus tarjetas de Amazon, Uber y MercadoLibre. Introduce **[[Fricción Financiera|Pasos extra que le dan tiempo a tu cerebro lógico para despertar]]**.", fullScreen: true,
    aiInsight: "Escribir los datos de la tarjeta manualmente reduce las compras impulsivas en un 50%."
  },
  { id: "imp-3-3", stepType: "mcq", question: "¿Qué micro-hábito es más potente contra el gasto digital?", options: [{id:"o1", label:"Tener notificaciones de ofertas encendidas", isCorrect:false}, {id:"o2", label:"Desuscribirse de correos de marcas", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "imp-3-4", stepType: "swipe_sorter", question: "¿Crea Fricción (Bueno) o Facilidad (Peligro)?", leftBucket: {label:"Fricción (Paz)", color:"#10b981"}, rightBucket: {label:"Facilidad (Gasto)", color:"#ef4444"}, items: [{id:"i1", label:"Dejar la tarjeta en casa", correctBucket:"left"}, {id:"i2", label:"Tarjeta guardada en Chrome", correctBucket:"right"}, {id:"i3", label:"App de banco con clave larga", correctBucket:"left"}, {id:"i4", label:"Comprar en 1 step", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "imp-3-5", stepType: "info", title: "La Regla de la Agua", body: "Cada vez que sientas el impulso de comprar algo online, bebe un vaso de agua grande antes de hacer clic. Hidratación = Oxigenación cerebral = Lógica.", fullScreen: true },
  { id: "imp-3-6", stepType: "true_false", statement: "Tener una cuenta de ahorro separada 'invisible' en tu app es un micro-hábito efectivo.", correctValue: true, explanation: "Ojos que no ven, corazón que no gasta. La invisibilidad técnica protege el ahorro inicial.", isAssessment:true, fullScreen: true },
  { id: "imp-3-7", stepType: "order", question: "Diseño de Entorno Anti-Gasto", items: [{id:"p1", label: "Silenciar notificaciones comerciales", correctOrder: 1}, {id: "p2", label: "Eliminar métodos de pago guardados", correctOrder: 2}, {id: "p3", label: "Configurar ahorro automático al recibir el pago", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "imp-3-8", stepType: "blitz_challenge", question: "¿Qué es la fricción en finanzas?", options: [{id:"o1", label:"Tu mejor aliada", isCorrect:true}, {id:"o2", label:"Un problema de lentitud", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "imp-3-9", stepType: "blitz_challenge", question: "¿Para qué sirve el ahorro automático?", options: [{id:"o1", label:"Para no tener que decidir", isCorrect:true}, {id:"o2", label:"Para perder dinero", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "imp-3-10", stepType: "match", question: "Relaciona Hábito", leftItems: [{id:"l1", label:"Lista de súper"}, {id:"l2", label:"No abrir apps de noche"}], rightItems: [{id:"r1", label:"Evitar compra no planeada"}, {id:"r2", label:"Proteger el cansancio mental"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}], isAssessment: true, fullScreen: true },
  { id: "imp-3-11", stepType: "mindset_translator", question: "Refactoriza tu entorno", beliefs: [{id: "b1", original: "Tengo que ser fuerte para no gastar.", healthyOptions: [{id: "h1", label: "Mi entorno está diseñado para que gastar sea difícil e ineficiente", isCorrect: true}, {id: "h2", label: "Mi voluntad es infinita", isCorrect: false}]}] },
  { id: "imp-3-12", stepType: "impulse_meter", instructions: "Mantén pulsado para 'instalar' estos micro-hábitos en tu sistema. Respira disciplina.", item: { name: "Reparador de Hábitos", price: "0.00", imageUrl: "/billy-breathing.png" }, holdTime: 6, fullScreen: true },
  { id: "imp-3-13", stepType: "narrative_check", question: "¿Qué app vas a desinstalar o limitar hoy para proteger tu dinero?", promptPlaceholder: "Limitaré mi uso de ...", minChars: 10, billyResponse: "Acción de ingeniería pura. Tu cuenta te lo agradecerá mañana.", fullScreen: true },
  { id: "imp-3-14", stepType: "info", title: "Alerta importante", body: "Los hábitos son el interés compuesto del comportamiento. Pequeños cambios hoy = Gran libertad mañana.", fullScreen: true,
    aiInsight: "La automatización del ahorro elimina la necesidad de fuerza de voluntad mensual."
  },
  { id: "imp-3-15", stepType: "summary", title: "Hábitos Anclados", body: "Ya tienes la armadura. Siguiente: Post-compra y aprendizaje.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 4: Post-compra: Culpa y aprendizaje - 15 SLIDES
// ==============================================================================
export const lessonPostCompraCulpaYAprendizajeSteps: LessonStep[] = [
  { id: "imp-4-1", stepType: "billy_talks", body: "¿Ya caíste? No te castigues. El castigo genera más estrés y más gasto. Vamos a auditar el error como un Ingeniero.", fullScreen: true,
    data: { glossary: [{ word: "Post-Audit", definition: "Análisis técnico de una decisión fallida para encontrar la causa raíz." }, { word: "Causa Raíz", definition: "Factor fundamental que desencadenó el fallo del sistema (ej: Hambre, Estrés social)." }] }
  },
  { id: "imp-4-2", stepType: "info", title: "Analiza el Disparador", body: "¿Compré porque estaba triste? ¿Porque quería impresionar a X? El objeto no importa; lo que importa es el vacío que intentaste llenar. Busca la **[[Causa Raíz|El disparador emocional o de entorno que venció tus defensas]]**.", fullScreen: true,
    aiInsight: "Identificar la emoción previa al gasto reduce la probabilidad de repetición en un 30%."
  },
  { id: "imp-4-3", stepType: "mcq", question: "Acabas de gastar $2,000 en algo inútil. ¿Cuál es el primer paso BIZEN?", options: [{id:"o1", label:"Esconder el ticket y llorar", isCorrect:false}, {id:"o2", label:"Mirar el dato, aceptarlo y buscar por qué sucedió", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "imp-4-4", stepType: "swipe_sorter", question: "¿Es una Reacción de Culpa o de Aprendizaje?", leftBucket: {label:"Culpa (Castigo)", color:"#ef4444"}, rightBucket: {label:"Aprendizaje (Dato)", color:"#10b981"}, items: [{id:"i1", label:"'Soy un desastre financiero'", correctBucket:"left"}, {id:"i2", label:"'Falló mi regla de las 48h'", correctBucket:"right"}, {id:"i3", label:"No mirar la banca en una semana", correctBucket:"left"}, {id:"i4", label:"Escribir el error en mi diario BIZEN", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "imp-4-5", stepType: "info", title: "La Táctica del Perdón Técnico", body: "Perdónate rápido para poder actuar rápido. Si te quedas en la culpa, sigues paralizado. Un sistema que falla se repara, no se insulta.", fullScreen: true },
  { id: "imp-4-6", stepType: "true_false", statement: "Devolver el producto si aún es posible es una señal de debilidad.", correctValue: false, explanation: "Es una señal de alta competencia administrativa. Corregir el flujo de caja es prioridad.", isAssessment:true, fullScreen: true },
  { id: "imp-4-7", stepType: "order", question: "Protocolo de Recuperación", items: [{id:"p1", label: "Aceptación del dato (Mirar el saldo)", correctOrder: 1}, {id: "p2", label: "Intentar la devolución (Recovery)", correctOrder: 2}, {id: "p3", label: "Reforzar el micro-hábito que falló", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "imp-4-8", stepType: "blitz_challenge", question: "¿Cuál es el objetivo de un post-audit?", options: [{id:"o1", label:"Para no volver a fallar por lo mismo", isCorrect:true}, {id:"o2", label:"Para sentirse mal", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "imp-4-9", stepType: "blitz_challenge", question: "¿Qué es más importante tras gastar?", options: [{id:"o1", label:"La recuperación técnica", isCorrect:true}, {id:"o2", label:"La disculpa emocional", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "imp-4-10", stepType: "match", question: "Relaciona Sentimiento", leftItems: [{id:"l1", label:"Arrepentimiento"}, {id:"l2", label:"Acción Técnica"}], rightItems: [{id:"r1", label:"Señal de alerta de valor"}, {id:"r2", label:"Solución al flujo de caja"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}], isAssessment: true, fullScreen: true },
  { id: "imp-4-11", stepType: "mindset_translator", question: "Refactoriza tu caída", beliefs: [{id: "b1", original: "Ya gasté, ya no importa nada este mes.", healthyOptions: [{id: "h1", label: "Detendré el sangrado de capital ahora mismo para salvar el resto del mes", isCorrect: true}, {id: "h2", label: "El mes ya está perdido", isCorrect: false}]}] },
  { id: "imp-4-12", stepType: "impulse_meter", instructions: "Mantén pulsado para 'limpiar' tu pantalla financiera de culpas inútiles. Respira objetividad.", item: { name: "Borrador de Fallos", price: "0.00", imageUrl: "/billy-breathing.png" }, holdTime: 5, fullScreen: true },
  { id: "imp-4-13", stepType: "narrative_check", question: "¿Qué lección técnica sacas de tu última compra impulsiva?", promptPlaceholder: "Aprendí que si ... entonces ...", minChars: 15, billyResponse: "Esa regla es ahora parte de tu código. Eres más fuerte hoy.", fullScreen: true },
  { id: "imp-4-14", stepType: "info", title: "Alerta importante", body: "No dejes que un error de un día destruya el progreso de un año. El sistema es resiliente por diseño.", fullScreen: true,
    aiInsight: "La resiliencia financiera se construye manejando pequeños fallos sin colapsar el sistema completo."
  },
  { id: "imp-4-15", stepType: "summary", title: "Lección Integrada", body: "Has analizado el error. Siguiente: Caso práctico paso a paso.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 5: Caso: Gasto por emoción paso a paso - 15 SLIDES
// ==============================================================================
export const lessonCasoGastoPorEmocionPasoAPasoSteps: LessonStep[] = [
  { id: "imp-5-1", stepType: "billy_talks", body: "Examen final. Vamos a navegar una crisis de consumo real. Tú eres el piloto del sistema.", fullScreen: true,
    data: { glossary: [{ word: "Navegación Táctica", definition: "Gestión consciente de una situación de alto riesgo emocional." }, { word: "Cierre de Flujo", definition: "Acción de detener cualquier salida de capital de forma inmediata." }] }
  },
  { id: "imp-5-2", stepType: "influence_detective", scenario: "Es tu cumpleaños, estás solo y ves un reloj de $5,000 que 'completaría' tu felicidad. ¿Qué haces?", options: [{id:"o1", label:"Dármelo como regalo porque 'me lo merezco'", isCorrect:false}, {id:"o2", label:"Reconocer la soledad como disparador y llamar a un amigo", isCorrect:true}], isAssessment: true, fullScreen: true,
    aiInsight: "Las fechas especiales disparan autorizaciones de gastos irracionales bajo la capa del 'merecimiento'."
  },
  { id: "imp-5-3", stepType: "info", title: "El Momento del 'Clic'", body: "Tienes el dedo en el botón. Sientes el pulso acelerado. Sabes que es un error. Esa es la pelea real de la ingeniería financiera.", fullScreen: true },
  { id: "imp-5-4", stepType: "impulse_meter", instructions: "Mantén pulsado para resistir el clic fatal. Respira integridad tecnológica.", item: { name: "Botón de Seguridad", price: "Neutral", imageUrl: "/billy-breathing.png" }, holdTime: 6, fullScreen: true },
  { id: "imp-5-5", stepType: "swipe_sorter", question: "¿Es una Decisión de Arquitecto o de Pasajero?", leftBucket: {label:"Arquitecto (BIZEN)", color:"#0f172a"}, rightBucket: {label:"Pasajero (Emoción)", color:"#f43f5e"}, items: [{id:"i1", label:"Cerrar la pestaña ante el impulso", correctBucket:"left"}, {id:"i2", label:"Gastar para no sentirme triste", correctBucket:"right"}, {id:"i3", label:"Consultar mi presupuesto base", correctBucket:"left"}, {id:"i4", label:"Comprar para 'aprovechar' el cupón", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "imp-5-6", stepType: "info", title: "La Victoria de Hoy", body: "Cada vez que dices que NO a un impulso, estás diciendo que SÍ a tu libertad de mañana. No es una prohibición, es una elección de poder.", fullScreen: true },
  { id: "imp-5-7", stepType: "true_false", statement: "Un Ingeniero del Dinero nunca vuelve a sentir impulsos de compra.", correctValue: false, explanation: "Los seguimos sintiendo; lo que cambia es nuestra RESPUESTA técnica a ellos.", isAssessment:true, fullScreen: true },
  { id: "imp-5-8", stepType: "order", question: "Tu jerarquía de poder hoy", items: [{id:"p1", label: "Control de Entorno (Micro-hábitos)", correctOrder: 1}, {id: "p2", label: "Control físico (Respiración/Pausa)", correctOrder: 2}, {id: "p3", label: "Visión a largo plazo (Metas)", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "imp-5-9", stepType: "blitz_challenge", question: "¿Quién es el dueño de tu dinero?", options: [{id:"o1", label:"El Marketing", isCorrect:false}, {id:"o2", label:"Tú y tu Sistema", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "imp-5-10", stepType: "blitz_challenge", question: "¿Cual es el arma definitiva?", options: [{id:"o1", label:"La Autonomía Técnica", isCorrect:true}, {id:"o2", label:"La Suerte", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "imp-5-11", stepType: "match", question: "Relaciona el Perfil", leftItems: [{id:"l1", label:"Consumidor Reactivo"}, {id:"l2", label:"Ingeniero Financiero"}], rightItems: [{id:"r1", label:"Actúa por impulso"}, {id:"r2", label:"Actúa por diseño"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}], isAssessment: true, fullScreen: true },
  { id: "imp-5-12", stepType: "mindset_translator", question: "Declaración Final de Control", beliefs: [{id: "b1", original: "No sé si pueda resistirme la próxima vez.", healthyOptions: [{id: "h1", label: "He diseñado mi vida para que mi libertad sea más atractiva que cualquier objeto", isCorrect: true}, {id: "h2", label: "Soy débil ante los anuncios", isCorrect: false}]}] },
  { id: "imp-5-13", stepType: "billy_talks", mood: "happy", body: "Felicidades. Has dominado el bloque de Compras Impulsivas. Estás listo para el bloque final: Estatus y Presión Social.", fullScreen: true },
  { id: "imp-5-14", stepType: "narrative_check", question: "¿Qué palabra vas a recordar la próxima vez que el pulso se te acelere frente a una oferta?", promptPlaceholder: "Recordaré ...", minChars: 5, billyResponse: "Potente. Úsala como tu clave de seguridad.", fullScreen: true,
    aiInsight: "Un mantra de una sola palabra puede detener el secuestro de la amígdala en milisegundos."
  },
  { id: "imp-5-15", stepType: "summary", title: "Subtema Terminado", body: "Has concluido el entrenamiento anti-impulsos. ¡Excelente trabajo, Piloto!", fullScreen: true },
]
