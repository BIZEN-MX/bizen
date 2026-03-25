import type { LessonStep } from "@/types/lessonTypes"

/**
 * Subtema B: Emociones
 * 
 * Lessons are now expanded to 15 slides each following the UPDATED BIZEN Blueprint (2 Blitz, 2+ AI Insights).
 */

// ==============================================================================
// LECCIÓN 1: ¿Cómo me hace sentir el dinero? (Relación emocional) - 15 SLIDES
// ==============================================================================
export const lessonComoMeHaceSentirElDineroSteps: LessonStep[] = [
  { id: "emo-1-1", stepType: "billy_talks", body: "Tus estados de cuenta no son números; son un diario de tus emociones. ¿Qué sientes al mirar tu saldo?", fullScreen: true,
    data: { glossary: [{ word: "Inteligencia Emocional Financiera", definition: "Capacidad de reconocer y gestionar emociones para tomar mejores decisiones monetarias." }, { word: "Etiquetado Emocional", definition: "Técnica de nombrar una emoción para reducir su intensidad reactiva." }] }
  },
  { id: "emo-1-2", stepType: "info", title: "El Termómetro del Estrés", body: "Si mirar tu cuenta te da taquicardia o ganas de llorar, tu sistema emocional está en cortocircuito. Un Ingeniero del Dinero busca la neutralidad técnica frente al dato.", fullScreen: true,
    aiInsight: "La ansiedad financiera es el resultado de no tener un sistema, no de no tener dinero."
  },
  { id: "emo-1-3", stepType: "impulse_meter", instructions: "Mantén pulsado para 'calmar' la taquicardia financiera. Respira y observa el dato sin juicio.", item: { name: "Calibrador Emocional", price: "Neutralidad", imageUrl: "/billy-breathing.png" }, holdTime: 5, fullScreen: true },
  { id: "emo-1-4", stepType: "mcq", question: "¿Cuál es la emoción predominante cuando gastas más de lo que tienes?", options: [{id:"o1", label:"Culpa post-gasto", isCorrect:true}, {id:"o2", label:"Excitación momentánea (Dopamina)", isCorrect:true}, {id:"o3", label: "Paz profunda", isCorrect: false}], isAssessment: false, fullScreen: true },
  { id: "emo-1-5", stepType: "swipe_sorter", question: "¿Es una Emoción que Genera Gasto o Ahorro?", leftBucket: {label:"Gasto (Calienta)", color:"#ef4444"}, rightBucket: {label:"Ahorro (Enfría)", color:"#10b981"}, items: [{id:"i1", label:"Aburrimiento", correctBucket:"left"}, {id:"i2", label:"Confianza en mi plan", correctBucket: "right"}, {id:"i3", label:"Miedo al futuro", correctBucket:"left"}, {id:"i4", label:"Orgullo por mi fondo de reserva", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "emo-1-6", stepType: "info", title: "Etiquetar para Controlar", body: "Si dices: 'Estoy sintiendo envidia de ese auto nuevo', tu cerebro racional recupera el mando. Poner nombre a la emoción es como poner un arnés a un animal salvaje.", fullScreen: true },
  { id: "emo-1-7", stepType: "true_false", statement: "Es posible tomar una decisión financiera 100% lógica sin ninguna emoción involucrada.", correctValue: false, explanation: "Somos seres biológicos; la meta no es eliminar la emoción, es GESTIONARLA para que no maneje el timón.", isAssessment:true, fullScreen: true },
  { id: "emo-1-8", stepType: "order", question: "Ciclo de una emoción financiera", items: [{id:"p1", label: "Estímulo externo (Un anuncio)", correctOrder: 1}, {id: "p2", label: "Respuesta Corporal (Impulso)", correctOrder: 2}, {id: "p3", label: "Racionalización posterior", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "emo-1-9", stepType: "blitz_challenge", question: "¿Qué sucede al etiquetar una emoción?", options: [{id:"o1", label:"Aumenta su poder", isCorrect:false}, {id:"o2", label:"Pierde intensidad reactiva", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "emo-1-10", stepType: "blitz_challenge", question: "¿Cual es el objetivo de un Ingeniero?", options: [{id:"o1", label:"Ser un robot", isCorrect:false}, {id:"o2", label:"Neutralidad técnica", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "emo-1-11", stepType: "match", question: "Relaciona Emoción con Gasto", leftItems: [{id:"l1", label:"Tristeza"}, {id:"l2", label:"Enojo"}, {id:"l3", label:"Euforia"}], rightItems: [{id:"r1", label:"Consuelo momentáneo"}, {id:"r2", label:"Gasto de 'Venganza'"}, {id:"r3", label:"Inversión impulsiva arriesgada"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}, {leftId:"l3", rightId:"r3"}], isAssessment: true, fullScreen: true },
  { id: "emo-1-12", stepType: "mindset_translator", question: "Refactoriza tu estado", beliefs: [{id: "b1", original: "Tengo miedo de mi propia cuenta bancaria.", healthyOptions: [{id: "h1", label: "Mis datos financieros son el mapa de mi libertad futura", isCorrect: true}, {id: "h2", label: "Ignorar mis gastos me protege del dolor", isCorrect: false}]}] },
  { id: "emo-1-13", stepType: "narrative_check", question: "¿A qué emoción le echas la culpa de tus últimos gastos innecesarios?", promptPlaceholder: "Me sentía ...", minChars: 10, billyResponse: "Anotado. Detectar el patrón es el inicio de tu ingeniería financiera.", fullScreen: true },
  { id: "emo-1-14", stepType: "info", title: "Alerta importante", body: "No tomes decisiones financieras con hambre, sueño o enojo. Tu sistema 2 (Racional) está apagado en esos momentos.", fullScreen: true,
    aiInsight: "Tomar decisiones cansado reduce tu capacidad de autocontrol en un 40%."
  },
  { id: "emo-1-15", stepType: "summary", title: "Emociones Mapeadas", body: "Has visto el termómetro. Siguiente: Señales de Emoción.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 2: Señales de Emoción Dominando Decisiones - 15 SLIDES
// ==============================================================================
export const lessonSenalesDeEmocionDominandoUnaDecisionSteps: LessonStep[] = [
  { id: "emo-2-1", stepType: "billy_talks", body: "Tu cuerpo te avisa ANTES de que saques la tarjeta. ¿Sabes leer tu propio hardware emocional?", fullScreen: true,
    data: { glossary: [{ word: "Somatización", definition: "Proceso por el cual el estrés emocional se manifiesta como síntomas físicos." }, { word: "Cerebro Límbico", definition: "Parte primitiva involucrada en las respuestas emocionales inmediatas." }] }
  },
  { id: "emo-2-2", stepType: "influence_detective", scenario: "Ves una oferta de 'última oportunidad' y sientes un nudo en el estómago y calor en la cara. ¿Qué está pasando?", options: [{id:"o1", label:"Es una oportunidad del destino", isCorrect:false}, {id:"o2", label:"Mi sistema límbico está bajo secuestro publicitario", isCorrect:true}], isAssessment: true, fullScreen: true,
    aiInsight: "El 'nudo en el estómago' es una señal ancestral de alerta ante la pérdida percibida."
  },
  { id: "emo-2-3", stepType: "info", title: "El 'Nudo' de la Escasez", body: "La ansiedad financiera se siente como presión en el pecho. Si no la identificas, comprarás algo solo para 'quitarte' esa sensación. No es amor al objeto, es alivio a la presión.", fullScreen: true },
  { id: "emo-2-4", stepType: "impulse_meter", instructions: "Mantén pulsado y detecta dónde sientes la presión ahora. Libérala con una exhalación larga.", item: { name: "Escáner Bio", price: "0.00", imageUrl: "/billy-breathing.png" }, holdTime: 5, fullScreen: true },
  { id: "emo-2-5", stepType: "swipe_sorter", question: "¿Señal de Alerta o de Calma?", leftBucket: {label:"Alerta (STOP)", color:"#ef4444"}, rightBucket: {label:"Calma (GO)", color:"#10b981"}, items: [{id:"i1", label:"Manos sudorosas", correctBucket:"left"}, {id:"i2", label:"Respiración lenta y profunda", correctBucket:"right"}, {id:"i3", label:"Ganas de gritar '¡Sí!'", correctBucket:"left"}, {id:"i4", label:"Silencio mental absoluto", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "emo-2-6", stepType: "info", title: "Visión de Túnel", body: "Cuando la emoción domina, dejas de ver alternativas. Solo ves 'EL' objeto. Un Ingeniero del Dinero amplía el campo de visión para ver el costo de oportunidad.", fullScreen: true },
  { id: "emo-2-7", stepType: "true_false", statement: "Las señales físicas de estrés desaparecen si ignoro el problema bancario.", correctValue: false, explanation: "El estrés financiero se acumula internamente. Solo el enfrentamiento técnico con los datos reales lo disipa.", isAssessment:true, fullScreen: true },
  { id: "emo-2-8", stepType: "order", question: "Reacción ante un impulso físico", items: [{id:"p1", label: "Notar la taquicardia/sudor", correctOrder: 1}, {id: "p2", label: "Beber un vaso de agua (Pausa)", correctOrder: 2}, {id: "p3", label: "Cerrar la app de compras", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "emo-2-9", stepType: "blitz_challenge", question: "¿Qué parte del cerebro busca el placer rápido?", options: [{id:"o1", label:"Neo-córtex", isCorrect:false}, {id:"o2", label:"Sistema Límbico", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "emo-2-10", stepType: "blitz_challenge", question: "¿Es posible ignorar las señales bio?", options: [{id:"o1", label:"Mala idea (Drena)", isCorrect:true}, {id:"o2", label:"Sí, soy de acero", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "emo-2-11", stepType: "match", question: "Relaciona Señal con Significado", leftItems: [{id:"l1", label:"Calor en la cara"}, {id:"l2", label:"Nudo en el estómago"}], rightItems: [{id:"r1", label:"Vergüenza o Enojo"}, {id:"r2", label:"Miedo o Ansiedad"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}], isAssessment: true, fullScreen: true },
  { id: "emo-2-12", stepType: "mindset_translator", question: "Sintoniza tu hardware", beliefs: [{id: "b1", original: "No puedo controlar lo que siento.", healthyOptions: [{id: "h1", label: "Puedo controlar mi RESPUESTA ante lo que siento", isCorrect: true}, {id: "h2", label: "Mis nervios deciden mi presupuesto", isCorrect: false}]}] },
  { id: "emo-2-13", stepType: "narrative_check", question: "¿Qué sientes físicamente exactamente ANTES de hacer una compra compulsiva?", promptPlaceholder: "Siento que ...", minChars: 10, billyResponse: "Aprende a reconocer eso. Es tu sistema de alarma.", fullScreen: true },
  { id: "emo-2-14", stepType: "info", title: "Alerta importante", body: "Si sientes que el corazón se te sale al pagar, estás sobrepasando tu límite técnico. Respeta tu propio hardware.", fullScreen: true,
    aiInsight: "El registro físico de las emociones es la telemetría más rápida de tu sistema financiero."
  },
  { id: "emo-2-15", stepType: "summary", title: "Señales Identificadas", body: "Ya sabes qué mirar en tí. Siguiente: Pausa Financiera y reglas anti-impulso.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 3: Pausa Financiera (Reglas anti-impulso) - 15 SLIDES
// ==============================================================================
export const lessonPausaFinancieraSteps: LessonStep[] = [
  { id: "emo-3-1", stepType: "billy_talks", body: "Entre el impulso y la acción hay un espacio. En ese espacio reside tu libertad. Vamos a ensancharlo con la Pausa BIZEN.", fullScreen: true,
    data: { glossary: [{ word: "Pausa Táctica", definition: "Periodo de tiempo pre-acordado antes de ejecutar una decisión de alto impacto." }, { word: "Barrera de Entrada", definition: "Obstáculo consciente puesto para dificultar una mala decisión." }] }
  },
  { id: "emo-3-2", stepType: "info", title: "La Regla de las 48 Horas", body: "Cualquier gasto innecesario > $500 debe esperar 48 horas. Si tras 2 días todavía lo quieres y tienes el capital, evalúalo. El 90% de los deseos mueren solos en 48h.", fullScreen: true,
    aiInsight: "El enfriamiento emocional reduce el deseo de compra impulsiva en un 85% tras 48 horas."
  },
  { id: "emo-3-3", stepType: "mcq", question: "Ves una 'oferta relámpago' de 30 minutos. ¿Qué haces según tu plan?", options: [{id:"o1", label:"Comprar rápido antes de que se acabe", isCorrect:false}, {id:"o2", label:"Ignorar; si es real volverá, mi regla de 48h es sagrada", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "emo-3-4", stepType: "swipe_sorter", question: "¿Acción de Pausa o de Aceleración?", leftBucket: {label:"Aceleración (Gasto)", color:"#ef4444"}, rightBucket: {label:"Pausa (Estrategia)", color:"#10b981"}, items: [{id:"i1", label:"Borrar tarjeta de la app", correctBucket:"right"}, {id:"i2", label:"Click en 'Comprar en un paso'", correctBucket:"left"}, {id:"i3", label:"Consultar con mi mentor", correctBucket:"right"}, {id:"i4", label:"Ver el anuncio 5 veces", correctBucket:"left"}], isAssessment: true, fullScreen: true },
  { id: "emo-3-5", stepType: "info", title: "Enfriamiento de Deseo", body: "El deseo es calor. La lógica es fría. Si le das tiempo al deseo, se enfría y desaparece. Si le das acción, se quema tu cuenta.", fullScreen: true },
  { id: "emo-3-6", stepType: "true_false", statement: "Tener la tarjeta de crédito guardada en el navegador ayuda a ahorrar dinero.", correctValue: false, explanation: "Elimina la FRICCIÓN, lo que hace que gastes sin pensar. Debes poner barreras difíciles.", isAssessment:true, fullScreen: true },
  { id: "emo-3-7", stepType: "order", question: "Ejecución de la Pausa BIZEN", items: [{id:"p1", label: "Sentir el impulso de compra", correctOrder: 1}, {id: "p2", label: "Cerrar la pestaña/local (STOP)", correctOrder: 2}, {id: "p3", label: "Reevaluar en 2-7 días", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "emo-3-8", stepType: "blitz_challenge", question: "¿Qué mata el impulso instantáneo?", options: [{id:"o1", label:"La Pausa", isCorrect:true}, {id:"o2", label:"La Rabia", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "emo-3-9", stepType: "blitz_challenge", question: "¿Para qué sirve borrar la tarjeta de Amazon?", options: [{id:"o1", label:"Generar fricción", isCorrect:true}, {id:"o2", label:"Perder tiempo", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "emo-3-10", stepType: "match", question: "Relaciona Obstáculo con Beneficio", leftItems: [{id:"l1", label:"No llevar tarjeta"}, {id:"l2", label:"Borrar Apps de compras"}], rightItems: [{id:"r1", label:"Impedir compra impulsiva"}, {id:"r2", label:"Reducir triggers visuales"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}], isAssessment: true, fullScreen: true },
  { id: "emo-3-11", stepType: "mindset_translator", question: "Refactoriza tu rapidez", beliefs: [{id: "b1", original: "Tengo que decidir YA porque se agota.", healthyOptions: [{id: "h1", label: "Si se agota, mi capital permanece en mi bolsillo para una mejor opción", isCorrect: true}, {id: "h2", label: "Lo que es para mí, me esperará 48 horas", isCorrect: true}]}] },
  { id: "emo-3-12", stepType: "impulse_meter", instructions: "Mantén pulsado para sellar tu compromiso con la Pausa de 48h. Respira calma.", item: { name: "Ancla de Tiempo", price: "0.00", imageUrl: "/billy-breathing.png" }, holdTime: 6, fullScreen: true },
  { id: "emo-3-13", stepType: "narrative_check", question: "¿Cuál será tu primera acción cuando sientas el próximo impulso de compra?", promptPlaceholder: "Voy a ... para pausar.", minChars: 15, billyResponse: "Perfecto. Ese es el sello del Ingeniero.", fullScreen: true },
  { id: "emo-3-14", stepType: "info", title: "Alerta importante", body: "No confíes en tu fuerza de voluntad; es limitada. Confía en tus REGLAS; son eternas.", fullScreen: true,
    aiInsight: "Los sistemas de 'un solo clic' están diseñados para evitar que tu parte lógica despierte."
  },
  { id: "emo-3-15", stepType: "summary", title: "Reglas Instaladas", body: "Ya tienes defensas. Siguiente: Culpa y Ansiedad Financiera.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 4: Culpa y ansiedad financiera (Cómo se forman) - 15 SLIDES
// ==============================================================================
export const lessonCulpaYAnsiedadFinancieraSteps: LessonStep[] = [
  { id: "emo-4-1", stepType: "billy_talks", body: "La 'Resaca Financiera' es la culpa que sientes después de gastar. No es útil; la ingeniería busca lecciones, no castigos.", fullScreen: true,
    data: { glossary: [{ word: "Resaca Financiera", definition: "Estado emocional de culpa y estrés tras un gasto descontrolado." }, { word: "Retroalimentación Positiva", definition: "Uso de errores pasados para ajustar el sistema futuro." }] }
  },
  { id: "emo-4-2", stepType: "info", title: "El Ciclo de la Vergüenza", body: "Gastas por estrés -> Sientes culpa -> Te estresas por la culpa -> Gastas más para calmarte. Debes romper el ciclo con INFORMACIÓN REAL.", fullScreen: true,
    aiInsight: "La culpa drena tu capacidad de decisión. Confrontar el dato la detiene en seco."
  },
  { id: "emo-4-3", stepType: "mcq", question: "Amas el café pero te culpas cada vez que compras uno. ¿Cuál es el error?", options: [{id:"o1", label:"El café es el problema", isCorrect:false}, {id:"o2", label:"No tener un presupuesto de placer asignado (Sistema)", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "emo-4-4", stepType: "swipe_sorter", question: "¿Genera Culpa o Genera Paz?", leftBucket: {label:"Culpa (Fuga)", color:"#ef4444"}, rightBucket: {label:"Paz (Dato)", color:"#10b981"}, items: [{id:"i1", label:"Esconder los tickets", correctBucket:"left"}, {id:"i2", label:"Registrar cada peso", correctBucket:"right"}, {id:"i3", label:"Evitar ver la app del banco", correctBucket:"left"}, {id:"i4", label:"Consultar mi plan anual", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "emo-4-5", stepType: "info", title: "El Dato mata a la Culpa", body: "La culpa vive en la oscuridad. Cuando abres tu estado de cuenta y dices: 'Gasté $5,000 extra, este es el plan para recuperarlo', la culpa desaparece y se vuelve PROYECTO.", fullScreen: true },
  { id: "emo-4-6", stepType: "true_false", statement: "Decirme a mí mismo que 'soy un desastre' ayuda a que no vuelva a gastar.", correctValue: false, explanation: "El auto-insulto drena tu energía. El Ingeniero analiza el error de código y lo corrige sin dramas.", isAssessment:true, fullScreen: true },
  { id: "emo-4-7", stepType: "order", question: "Pasos tras un error financiero", items: [{id:"p1", label: "Aceptar el gasto ya hecho", correctOrder: 1}, {id: "p2", label: "Analizar qué disparó el impulso", correctOrder: 2}, {id: "p3", label: "Actualizar la regla del sistema", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "emo-4-8", stepType: "blitz_challenge", question: "¿Cómo se cura la resaca financiera?", options: [{id:"o1", label:"Llorando", isCorrect:false}, {id:"o2", label:"Confrontando el dato", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "emo-4-9", stepType: "blitz_challenge", question: "¿Es útil el auto-castigo?", options: [{id:"o1", label:"No (Ineficiente)", isCorrect:true}, {id:"o2", label:"Sí (Para aprender)", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "emo-4-10", stepType: "match", question: "Relaciona Emoción con Acción", leftItems: [{id:"l1", label:"Culpa"}, {id:"l2", label:"Responsabilidad"}], rightItems: [{id:"r1", label:"Inmovilidad"}, {id:"r2", label:"Ajuste de Sistema"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}], isAssessment: true, fullScreen: true },
  { id: "emo-4-11", stepType: "mindset_translator", question: "Refactoriza tu diálogo", beliefs: [{id: "b1", original: "Ya lo arruiné todo, mejor sigo gastando.", healthyOptions: [{id: "h1", label: "Cada transacción es una nueva oportunidad de control", isCorrect: true}, {id: "h2", label: "Mi valor no depende de mi error de hoy", isCorrect: true}]}] },
  { id: "emo-4-12", stepType: "impulse_meter", instructions: "Mantén pulsado para perdonar tu último gasto y pasar a la acción. Respira renovación.", item: { name: "Borrador de Culpa", price: "0.00", imageUrl: "/billy-breathing.png" }, holdTime: 5, fullScreen: true },
  { id: "emo-4-13", stepType: "narrative_check", question: "¿De qué gasto reciente te arrepientes?", promptPlaceholder: "Me arrepiento de ...", minChars: 15, billyResponse: "Aceptado. Ahora transfórmalo en dato para tu sistema.", fullScreen: true },
  { id: "emo-4-14", stepType: "info", title: "Alerta importante", body: "No eres tus gastos pasados. Eres las decisiones que tomas en el presente con la información que tienes.", fullScreen: true,
    aiInsight: "El perdón táctico a uno mismo es clave para evitar el 'gasto por rebeldía' posterior."
  },
  { id: "emo-4-15", stepType: "summary", title: "Ansiedad Gestionada", body: "Ya no tienes miedo al ticket. Siguiente: Emoción vs Decisión (Casos reales).", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 5: Emoción vs decisión (casos reales) - 15 SLIDES
// ==============================================================================
export const lessonEmocionVsDecisionCasosRealesSteps: LessonStep[] = [
  { id: "emo-5-1", stepType: "billy_talks", body: "Pongamos a prueba tus nuevos algoritmos. Simularemos casos donde la emoción te pondrá a prueba.", fullScreen: true,
    data: { glossary: [{ word: "Simulación de Crisis", definition: "Práctica mental de toma de decisiones bajo presión controlada." }, { word: "Criterio Técnico", definition: "Uso de reglas pre-establecidas para decidir sin sesgos." }] }
  },
  { id: "emo-5-2", stepType: "info", title: "Caso: La 'Ocasión Única'", body: "Ves una oferta del 50% en un gadget que querías hace tiempo, pero no estaba en tu presupuesto mensual. ¿Qué activas?", fullScreen: true,
    aiInsight: "Si no lo pensabas comprar hace 5 minutos, el 50% de descuento es en realidad un 50% de gasto innecesario."
  },
  { id: "emo-5-3", stepType: "impulse_meter", instructions: "Mantén pulsado para rechazar el brillo del descuento fácil. Manten el pulso firme.", item: { name: "Escudo de Resistencia", price: "Ahorro", imageUrl: "/billy-breathing.png" }, holdTime: 5, fullScreen: true },
  { id: "emo-5-4", stepType: "mcq", question: "En el caso del gadget, ¿qué es lo más BIZEN?", options: [{id:"o1", label:"Comprarlo porque 'ahorras' el 50%", isCorrect:false}, {id:"o2", label:"Ignorar la oferta porque no estaba planeada", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "emo-5-5", stepType: "swipe_sorter", question: "¿Es una Decisión de Sistema o de Impulso?", leftBucket: {label:"Sistema (Plan)", color:"#0f172a"}, rightBucket: {label:"Impulso (Gancho)", color:"#f43f5e"}, items: [{id:"i1", label:"Gastar para celebrar ascenso", correctBucket:"right"}, {id:"i2", label:"Seguir el plan de inversión", correctBucket: "left"}, {id:"i3", label:"Comprar ropa por aburrimiento", correctBucket:"right"}, {id:"i4", label:"Revisar la meta anual", correctBucket:"left"}], isAssessment: true, fullScreen: true },
  { id: "emo-5-6", stepType: "info", title: "Caso 2: Presión Social", body: "Tus amigos van a un viaje costoso. Tu fondo de seguridad está listo, pero el viaje lo vaciaría. ¿Seguridad o Estatus?", fullScreen: true },
  { id: "emo-5-7", stepType: "true_false", statement: "Decir que 'no' a un plan social para proteger tu libertad financiera es señal de madurez técnica.", correctValue: true, explanation: "La libertad real cuesta incómodas conversaciones temporales.", isAssessment:true, fullScreen: true },
  { id: "emo-5-8", stepType: "order", question: "Prioridad en crisis emocional", items: [{id:"p1", label: "Cerrar canales de pago", correctOrder: 1}, {id: "p2", label: "Hablar con un mentor/amigo racional", correctOrder: 2}, {id: "p3", label: "Revisar el impacto en la libertad a 5 años", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "emo-5-9", stepType: "blitz_challenge", question: "¿Qué es más difícil?", options: [{id:"o1", label:"Tener dinero", isCorrect:false}, {id:"o2", label:"Controlar impulsos", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "emo-5-10", stepType: "blitz_challenge", question: "¿Cual es tu mejor protección?", options: [{id:"o1", label:"La suerte", isCorrect:false}, {id:"o2", label:"Reglas Pre-acordadas", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "emo-5-11", stepType: "match", question: "Relaciona Perfil con Resolución", leftItems: [{id:"l1", label:"Presión de Grupo"}, {id:"l2", label:"Impulso Personal"}], rightItems: [{id:"r1", label:"Decir No Amablemente"}, {id:"r2", label:"Pausa de 48 horas"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}], isAssessment: true, fullScreen: true },
  { id: "emo-5-12", stepType: "mindset_translator", question: "Refuerzo final", beliefs: [{id: "b1", original: "Tengo que ser igual que los demás para encajar.", healthyOptions: [{id: "h1", label: "Mi diferenciación financiera me dará libertad única", isCorrect: true}, {id: "h2", label: "Mi valor depende de mi consumo visible", isCorrect: false}]}] },
  { id: "emo-5-13", stepType: "billy_talks", body: "Cada vez que vences una emoción destructiva, instalas un parche de seguridad en tu sistema. ¡Estás listo!", mood: "celebrating", fullScreen: true },
  { id: "emo-5-14", stepType: "narrative_check", question: "Describe una situación donde la emoción casi te hace gastar y cómo la evitaste o evitarás hoy.", promptPlaceholder: "Evitaré gastar cuando ...", minChars: 20, billyResponse: "Dominar ese momento específico te hará invencible.", fullScreen: true,
    aiInsight: "La simulación mental de crisis te entrena para que cuando la emoción sea real, tu respuesta sea automática."
  },
  { id: "emo-5-15", stepType: "summary", title: "Entrenamiento Finalizado", body: "Has superado las pruebas. Tema 1 completado. ¡Prepárate para crecer!", fullScreen: true },
]
