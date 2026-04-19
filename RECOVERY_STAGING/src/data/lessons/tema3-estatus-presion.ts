import type { LessonStep } from "@/types/lessonTypes"

/**
 * Subtema 3C: Estatus y Presión Social
 * 
 * Lessons are now expanded to 15 slides each following the UPDATED BIZEN Blueprint (2 Blitz, 2+ AI Insights).
 */

// ==============================================================================
// LECCIÓN 1: Comprar por estatus vs por valor (La trampa social) - 15 SLIDES
// ==============================================================================
export const lessonComprarPorEstatusVsPorValorSteps: LessonStep[] = [
  { id: "est-1-1", stepType: "billy_talks", body: "Gastamos dinero que no tenemos, para comprar cosas que no necesitamos, para impresionar a gente a la que no le importamos. Vamos a romper la trampa del Estatus.", fullScreen: true,
    data: { glossary: [{ word: "Estatus Percebido", definition: "Valoración social subjetiva basada en la posesión de bienes visibles." }, { word: "Valor Intrínseco", definition: "Utilidad real y duradera de un objeto o servicio independientemente de la opinión ajena." }] }
  },
  { id: "est-1-2", stepType: "info", title: "La Señal vs La Riqueza", body: "Si compras un auto de lujo para 'parecer' rico, en realidad acabas de volverte más pobre por el valor del auto. La riqueza real es invisible.", fullScreen: true,
    aiInsight: "La necesidad de validación externa es la causa del 70% de la deuda de consumo en adultos jóvenes."
  },
  { id: "est-1-3", stepType: "impulse_meter", instructions: "Mantén pulsado y visualiza tu valor interno Brillando sin necesidad de objetos. Respira orgullo real.", item: { name: "Brillo Interno", price: "0.00", imageUrl: "/billy-breathing.png" }, holdTime: 5, fullScreen: true },
  { id: "est-1-4", stepType: "mcq", question: "¿Cuál es el motivo más inteligente para comprar algo según BIZEN?", options: [{id:"o1", label:"Porque me hará ver exitoso ante mi familia", isCorrect:false}, {id:"o2", label:"Porque resuelve un problema técnico eficiente en mi vida", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "est-1-5", stepType: "swipe_sorter", question: "¿Es una Compra de Estatus o de Valor?", leftBucket: {label:"Estatus (Fachada)", color:"#ef4444"}, rightBucket: {label:"Valor (Utilidad)", color:"#10b981"}, items: [{id:"i1", label:"Logo de marca gigante", correctBucket:"left"}, {id:"i2", label:"Silla ergonómica de calidad", correctBucket:"right"}, {id:"i3", label:"Reloj de oro para eventos", correctBucket:"left"}, {id:"i4", label:"Laptop para mi HVA técnica", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "est-1-6", stepType: "info", title: "El Costo de la Opinión Ajena", body: "Si vives para los demás, ellos son los dueños de tu presupuesto. Recupera el mando del sistema: lo que PIENSAN los demás vale exactamente $0 en tu cuenta.", fullScreen: true },
  { id: "est-1-7", stepType: "true_false", statement: "Parecer una persona de éxito ayuda a que las oportunidades lleguen más rápido.", correctValue: false, explanation: "Es mejor SER exitoso que PARECERLO. La sustancia técnica siempre vence a la fachada superficial.", isAssessment:true, fullScreen: true },
  { id: "est-1-8", stepType: "order", question: "Evolución hacia la Libertad de Estatus", items: [{id:"p1", label: "Compararse con el vecino (Escasez)", correctOrder: 1}, {id: "p2", label: "Enfocarse en la utilidad propia", correctOrder: 2}, {id: "p3", label: "Indiferencia ante la admiración ajena", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "est-1-9", stepType: "blitz_challenge", question: "¿Qué sucede al comprar marcas solo por el logo?", options: [{id:"o1", label:"Pagas el Impuesto al Estatus", isCorrect:true}, {id:"o2", label:"Inviertes a futuro", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "est-1-10", stepType: "blitz_challenge", question: "¿Cómo se llama la riqueza que no se ve?", options: [{id:"o1", label:"Pobreza oculta", isCorrect:false}, {id:"o2", label:"Patrimonio Neto Reall", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "est-1-11", stepType: "match", question: "Relaciona Perfil", leftItems: [{id:"l1", label:"Busca Aprobación"}, {id:"l2", label:"Busca Libertad"}], rightItems: [{id:"r1", label:"Gasta en lo visible"}, {id:"r2", label:"Invierte en lo invisible"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}], isAssessment: true, fullScreen: true },
  { id: "est-1-12", stepType: "mindset_translator", question: "Refactoriza tu fachada", beliefs: [{id: "b1", original: "Si no tengo cosas caras, pensarán que soy un fracasado.", healthyOptions: [{id: "h1", label: "Mi éxito se mide en mi capacidad de disponer de mi tiempo, no en mis marcas", isCorrect: true}, {id: "h2", label: "La ropa define mi valor", isCorrect: false}]}] },
  { id: "est-1-13", stepType: "narrative_check", question: "¿Qué has comprado solo para que alguien más lo viera?", promptPlaceholder: "Compré un/a ... para que ...", minChars: 15, billyResponse: "Libérate de esa carga. Tu sistema no necesita aplausos vacíos.", fullScreen: true },
  { id: "est-1-14", stepType: "info", title: "Alerta importante", body: "No entres en una carrera que no puedes ganar: siempre habrá alguien con un logo más grande. Mejor gana el juego de la libertad.", fullScreen: true,
    aiInsight: "La autonomía emocional frente al estatus es el mayor ahorrador mensual en la ingeniería financiera."
  },
  { id: "est-1-15", stepType: "summary", title: "Estatus Enfrentado", body: "Has visto la ilusión. Siguiente: Apariencia vs Realidad.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 2: Apariencia de riqueza vs riqueza real - 15 SLIDES
// ==============================================================================
export const lessonAparienciaDeRiquezaVsRiquezaRealSteps: LessonStep[] = [
  { id: "est-2-1", stepType: "billy_talks", body: "¿Sabias que muchos millonarios manejan autos usados y visten ropa sin marcas? La riqueza real prefiere el silencio y el crecimiento.", fullScreen: true,
    data: { glossary: [{ word: "Millonario de al Lado", definition: "Concepto de personas con gran patrimonio que mantienen un estilo de vida austero y discreto." }, { word: "Riqueza Invisible", definition: "Activos intangibles como paz mental, tiempo libre y autonomía de decisión." }] }
  },
  { id: "est-2-2", stepType: "info", title: "La Cuenta Bancaria vs El Instagram", body: "La foto muestra el gasto de $30,000 en un viaje; la cuenta bancaria muestra el resto. El que gasta $30,000 tiene $30,000 MENOS de libertad.", fullScreen: true,
    aiInsight: "Las personas con mayor patrimonio neto real suelen consumir menos marcas de lujo visibles que la clase media aspiracional."
  },
  { id: "est-2-3", stepType: "impulse_meter", instructions: "Mantén pulsado y visualiza tu cuenta bancaria creciendo en modo invisible. Respira riqueza sólida.", item: { name: "Caja Fuerte Mental", price: "Patrimonio", imageUrl: "/billy-breathing.png" }, holdTime: 6, fullScreen: true },
  { id: "est-2-4", stepType: "mcq", question: "¿Qué indicador es señal de Riqueza Real (BIZEN)?", options: [{id:"o1", label: "Tener el celular más nuevo", isCorrect: false}, {id:"o2", label: "Poder vivir 2 años sin ingresos activos", isCorrect: true}], isAssessment: true, fullScreen: true },
  { id: "est-2-5", stepType: "swipe_sorter", question: "¿Es Apariencia o Realidad?", leftBucket: {label:"Apariencia (Ruido)", color:"#ef4444"}, rightBucket: {label:"Realidad (Señal)", color:"#10b981"}, items: [{id:"i1", label:"Coche financiado a 5 años", correctBucket:"left"}, {id:"i2", label:"Portafolio de ETFs", correctBucket:"right"}, {id:"i3", label:"Reloj de diseñador", correctBucket:"left"}, {id:"i4", label:"Cuenta de ahorro para emergencia", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "est-2-6", stepType: "info", title: "El Síndrome del Pobre con un Mercedes", body: "Vivir al límite de tu salario para mantener un estatus te hace esclavo de tu sueldo. Eres un prisionero de lujo.", fullScreen: true },
  { id: "est-2-7", stepType: "true_false", statement: "Gastar en experiencias caras es siempre mejor que comprar objetos caros.", correctValue: false, explanation: "Si la experiencia es solo para 'parecer' aventurero, sigue siendo gasto de estatus. La intención lo es todo.", isAssessment:true, fullScreen: true },
  { id: "est-2-8", stepType: "order", question: "Prioridades de un Ingeniero", items: [{id:"p1", label: "Estabilidad (Fondo de Seguridad)", correctOrder: 1}, {id: "p2", label: "Crecimiento (Inversiones)", correctOrder: 2}, {id: "p3", label: "Disfrute visible (Lujos)", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "est-2-9", stepType: "blitz_challenge", question: "¿Cuál es el objetivo final?", options: [{id:"o1", label:"Tener más cosas", isCorrect:false}, {id:"o2", label:"Tener más Tiempo propio", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "est-2-10", stepType: "blitz_challenge", question: "¿Un pasivo es?", options: [{id:"o1", label:"Algo que saca dinero de tu bolsillo", isCorrect:true}, {id:"o2", label:"Un coche", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "est-2-11", stepType: "match", question: "Relaciona el Atractivo", leftItems: [{id:"l1", label:"Fachada"}, {id:"l2", label:"Estructura"}], rightItems: [{id:"r1", label:"Brilla ahora, quiebra mañana"}, {id:"r2", label:"Humilde ahora, libre mañana"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}], isAssessment: true, fullScreen: true },
  { id: "est-2-12", stepType: "mindset_translator", question: "Refactoriza tu imagen", beliefs: [{id: "b1", original: "Tengo que estrenar ropa para esta fiesta.", healthyOptions: [{id: "h1", label: "Mi presencia física y mi mente son mi mejor carta de presentación", isCorrect: true}, {id: "h2", label: "Mi ropa es mi valor real", isCorrect: false}]}] },
  { id: "est-2-13", stepType: "billy_talks", body: "No dejes que los anuncios te digan qué es el éxito. El éxito es despertarse un martes y no tener que ir a donde no quieres.", mood: "thinking", fullScreen: true },
  { id: "est-2-14", stepType: "narrative_check", question: "¿Qué cambio harías hoy para que tu riqueza invisible sea mayor que la visible?", promptPlaceholder: "Empezaré a ...", minChars: 15, billyResponse: "Buen plan. La invisibilidad es el superpoder del ahorro.", fullScreen: true,
    aiInsight: "La discreción financiera es la mejor protección contra estafas y presiones familiares."
  },
  { id: "est-2-15", stepType: "summary", title: "Realidad Elegida", body: "Has visto la base. Siguiente: Presión Social.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 3: Presión social en decisiones (Escenarios) - 15 SLIDES
// ==============================================================================
export const lessonPresionSocialEnDecisionesEscenariosSteps: LessonStep[] = [
  { id: "est-3-1", stepType: "billy_talks", body: "Tus amigos dicen: 'Vamos, solo se vive una vez'. Pero tú sabes que vas a vivir mucho tiempo y necesitas libertad. Vamos a navegar estos escenarios.", fullScreen: true,
    data: { glossary: [{ word: "YOLO (You Only Live Once)", definition: "Acronimo usado para justificar decisiones financieras de corto plazo basadas en la impulsividad." }, { word: "FOMO (Fear Of Missing Out)", definition: "Miedo a perderse un evento social o una oportunidad percibida." }] }
  },
  { id: "est-3-2", stepType: "info", title: "El Costo de 'Ir al Rimo'", body: "Si tus amigos ganan el doble que tú y tú tratas de llevar su ritmo de gasto, estás cavando un hoyo técnico en tu balance. Respeta TU sistema.", fullScreen: true,
    aiInsight: "La presión de grupo influye un 80% más en las decisiones de gasto recreativo que cualquier publicidad."
  },
  { id: "est-3-3", stepType: "mcq", question: "Tus amigos planean una cena de $2,000. Tú solo tienes $500 presupuestados. ¿Qué es lo más BIZEN?", options: [{id:"o1", label: "Ir y pagar con tarjeta (Pasivo)", isCorrect: false}, {id:"o2", label: "Proponer otro plan o ir solo a beber algo ajustado", isCorrect: true}, {id:"o3", label: "No comer un mes para compensar", isCorrect: false}], isAssessment: true, fullScreen: true },
  { id: "est-3-4", stepType: "swipe_sorter", question: "¿Es una Decisión Social o Financiera?", leftBucket: {label:"Social (Aceptación)", color:"#fbbf24"}, rightBucket: {label:"Financiera (Libertad)", color:"#10b981"}, items: [{id:"i1", label:"Ir a la boda de destino carísima", correctBucket:"left"}, {id:"i2", label:"Decir 'no' al regalo grupal caro", correctBucket:"right"}, {id:"i3", label:"Cenar en casa antes de salir", correctBucket:"right"}, {id:"i4", label:"Comprar el shot para todos", correctBucket:"left"}], isAssessment: true, fullScreen: true },
  { id: "est-3-5", stepType: "info", title: "Amistades de Presupuesto", body: "Los amigos reales respetan tus metas financieras. Los 'amigos de gasto' solo respetan tu capacidad de pagar la cuenta.", fullScreen: true },
  { id: "est-3-6", stepType: "true_false", statement: "Decir 'no' a un plan social porque estás ahorrando es motivo de vergüenza.", correctValue: false, explanation: "Es motivo de ORGULLO TÉCNICO. Estás protegiendo tu arquitectura de futuro.", isAssessment:true, fullScreen: true },
  { id: "est-3-7", stepType: "order", question: "Pasos para navegar una invitación cara", items: [{id:"p1", label: "Consultar mi saldo de 'Placer' del mes", correctOrder: 1}, {id: "p2", label: "Evaluar el valor real de la conexión humana", correctOrder: 2}, {id: "p3", label: "Decisión basada en balance, no en FOMO", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "est-3-8", stepType: "blitz_challenge", question: "¿Qué significa YOLO en ingeniería financiera?", options: [{id:"o1", label:"Libertad", isCorrect:false}, {id:"o2", label:"Gasto Irracional sin Plan", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "est-3-9", stepType: "blitz_challenge", question: "¿Cómo se llama el miedo a quedar fuera?", options: [{id:"o1", label:"FOMO", isCorrect:true}, {id:"o2", label:"Lógica", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "est-3-10", stepType: "match", question: "Relaciona Situación", leftItems: [{id:"l1", label:"Cena Grupal"}, {id:"l2", label:"Viaje sorpresa"}], rightItems: [{id:"r1", label:"Cuidado con el Churn de amigos"}, {id:"r2", label:"Peligro de fuga masiva"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}], isAssessment: true, fullScreen: true },
  { id: "est-3-11", stepType: "mindset_translator", question: "Refactoriza tu aceptación", beliefs: [{id: "b1", original: "Van a pensar que soy un codo (tacaño).", healthyOptions: [{id: "h1", label: "Soy una persona con un plan maestro y metas claras", isCorrect: true}, {id: "h2", label: "Mi valor depende de lo que pago en la mesa", isCorrect: false}]}] },
  { id: "est-3-12", stepType: "impulse_meter", instructions: "Mantén pulsado para rechazar el FOMO. Respira autonomía social.", item: { name: "Escudo Social", price: "0.00", imageUrl: "/billy-breathing.png" }, holdTime: 5, fullScreen: true },
  { id: "est-3-13", stepType: "narrative_check", question: "¿Cuándo fue la última vez que gastaste dinero solo por 'no decir que no' a tus amigos?", promptPlaceholder: "Gasté en ...", minChars: 15, billyResponse: "No volverá a pasar. Tú eres el arquitecto de tus límites.", fullScreen: true },
  { id: "est-3-14", stepType: "info", title: "Alerta importante", body: "Si tus amigos no te apoyan en tu camino a la libertad, tal vez necesitas amigos que ya sean libres.", fullScreen: true,
    aiInsight: "Eres el promedio de las metas financieras de las 5 personas con las que más pasas el tiempo."
  },
  { id: "est-3-15", stepType: "summary", title: "Presión Controlada", body: "Siguiente: Cómo decir que NO sin sentirte menos.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 4: Cómo decir que NO sin sentirte menos (Protocolo) - 15 SLIDES
// ==============================================================================
export const lessonNoEstatusSteps: LessonStep[] = [
  { id: "est-4-1", stepType: "billy_talks", body: "Decir 'no' es el comando más potente de tu sistema. No es rechazo al otro; es afirmación de TÍ mismo.", fullScreen: true,
    data: { glossary: [{ word: "Asertividad Financiera", definition: "Capacidad de comunicar tus límites económicos de forma clara, directa y sin culpa." }, { word: "Priorización de Capital", definition: "Elección consciente de dónde poner tus recursos según tus metas maestras." }] }
  },
  { id: "est-4-2", stepType: "info", title: "El 'No' Elegante", body: "No necesitas dar mil explicaciones. 'No está en mis metas actuales' o 'Tengo otros planes para ese capital este mes' son frases de poder técnico.", fullScreen: true,
    aiInsight: "La honestidad sobre tus metas financieras suele generar RESPETO, no burla, en entornos profesionales."
  },
  { id: "est-4-3", stepType: "mcq", question: "Un amigo te invita a un concierto caro y no tienes presupuesto. ¿Qué frase usas?", options: [{id:"o1", label: "'No tengo dinero' (Señal de escasez)", isCorrect: false}, {id:"o2", label: "'No es una prioridad financiera para mí ahora' (Señal de poder)", isCorrect: true}], isAssessment: true, fullScreen: true },
  { id: "est-4-4", stepType: "swipe_sorter", question: "¿Es una Frase de Poder o de Debilidad?", leftBucket: {label:"Debilidad (Pena)", color:"#94a3b8"}, rightBucket: {label:"Poder (BIZEN)", color:"#10b981"}, items: [{id:"i1", label:"'Lo siento, estoy quebrado'", correctBucket:"left"}, {id:"i2", label:"'Esas son mis reglas de inversión'", correctBucket:"right"}, {id:"i3", label:"'Mejor luego, ahorita no puedo'", correctBucket:"left"}, {id:"i4", label:"'Gracias, mi presupuesto de placer ya se agotó'", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "est-4-5", stepType: "info", title: "El 'No' Tácito", body: "A veces decir no significa proponer una alternativa. 'No puedo cenar ahí, pero vamos por un café después'. El vínculo se mantiene, el capital se protege.", fullScreen: true },
  { id: "est-4-6", stepType: "true_false", statement: "La gente deja de quererte si dejas de gastar dinero con ellos.", correctValue: false, explanation: "Si te quieren por tu dinero, no eran amigos. Los vínculos reales trascienden el menú de la cena.", isAssessment:true, fullScreen: true },
  { id: "est-4-7", stepType: "order", question: "Protocolo del No", items: [{id:"p1", label: "Agradecer la invitación", correctOrder: 1}, {id: "p2", label: "Establecer el límite (No es prioridad)", correctOrder: 2}, {id: "p3", label: "Ofrecer alternativa o despedida honesta", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "est-4-8", stepType: "blitz_challenge", question: "¿Qué proyecta un 'no' asertivo?", options: [{id:"o1", label:"Miseria", isCorrect:false}, {id:"o2", label:"Autodisciplina y Liderazgo", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "est-4-9", stepType: "blitz_challenge", question: "¿Cuál es la causa del 'sí' culposo?", options: [{id:"o1", label:"El miedo a no pertenecer", isCorrect:true}, {id:"o2", label:"La generosidad pura", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "est-4-10", stepType: "match", question: "Relaciona Respuesta", leftItems: [{id:"l1", label:"Asertivo"}, {id:"l2", label:"Pasivo"}], rightItems: [{id:"r1", label:"Controla el entorno"}, {id:"r2", label:"Es controlado por el entorno"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}], isAssessment: true, fullScreen: true },
  { id: "est-4-11", stepType: "mindset_translator", question: "Refactoriza tu respuesta", beliefs: [{id: "b1", original: "Tengo que ir para que no me olviden.", healthyOptions: [{id: "h1", label: "Mi valor social proviene de mi persona, no de mi asistencia a cada evento caro", isCorrect: true}, {id: "h2", label: "Si no voy, no existo", isCorrect: false}]}] },
  { id: "est-4-12", stepType: "impulse_meter", instructions: "Mantén pulsado y di un NO firme en tu mente. Siente el alivio de la libertad. Respira poder.", item: { name: "Ancla de Mando", price: "0.00", imageUrl: "/billy-breathing.png" }, holdTime: 6, fullScreen: true },
  { id: "est-4-13", stepType: "narrative_check", question: "¿Cómo vas a decir que no la próxima vez que te inviten a algo que no quieres pagar?", promptPlaceholder: "Diré: ...", minChars: 10, billyResponse: "Perfecto. Ensáyalo, es tu mejor herramienta de defensa.", fullScreen: true },
  { id: "est-4-14", stepType: "info", title: "Alerta de Ingeniería", body: "Tu sistema financiero es como un servidor: si lo dejas abierto a cualquier petición externa, se va a caer. Ponle un firewall de asertividad.", fullScreen: true,
    aiInsight: "La asertividad reduce el estrés social en un 40% después de la primera semana de práctica."
  },
  { id: "est-4-15", stepType: "summary", title: "No Programado", body: "Ya sabes rechazar el ruido. Siguiente: Regla Personal Anti-Estatus.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 5: Regla personal anti-estatus (Compromiso final) - 15 SLIDES
// ==============================================================================
export const lessonReglaPersonalAntiEstatusSteps: LessonStep[] = [
  { id: "est-5-1", stepType: "billy_talks", body: "Última lección del Tema 3. Vamos a sellar tus reglas sagradas. Una regla personal es una ley que no se discute. ¿Cual es la tuya?", fullScreen: true,
    data: { glossary: [{ word: "Regla Sagrada", definition: "Principio innegociable que rige el comportamiento financiero sin necesidad de deliberación." }, { word: "Integridad de Sistema", definition: "Estado en el que tus acciones diarias coinciden con tus reglas pre-diseñadas." }] }
  },
  { id: "est-5-2", stepType: "info", title: "Ejemplos de Reglas", body: "Regla: 'Nunca compro marcas con logos visibles'. Regla: 'No gasto más de $X en cenas'. Regla: 'Mis activos siempre se pagan antes que mi ropa'.", fullScreen: true,
    aiInsight: "Tener reglas pre-acordadas elimina la fatiga de decisión y la duda emocional."
  },
  { id: "est-5-3", stepType: "mcq", question: "¿Qué garantiza que tus reglas se cumplan?", options: [{id:"o1", label: "La buena suerte", isCorrect: false}, {id:"o2", label: "Tu integridad técnica y financiera", isCorrect: true}], isAssessment: true, fullScreen: true },
  { id: "est-5-4", stepType: "impulse_meter", instructions: "Mantén pulsado para sellar tu Regla Anti-Estatus. Siente el clic de la libertad. Respira soberanía.", item: { name: "Sello de Integridad", price: "Invaluable", imageUrl: "/billy-breathing.png" }, holdTime: 6, fullScreen: true },
  { id: "est-5-5", stepType: "swipe_sorter", question: "¿Es una Regla de la Manada o una Regla BIZEN?", leftBucket: {label:"Manada (Miedo)", color:"#fbbf24"}, rightBucket: {label:"BIZEN (Diseño)", color:"#6366f1"}, items: [{id:"i1", label:"Gastar para encajar", correctBucket:"left"}, {id:"i2", label:"Inversión invisible primero", correctBucket:"right"}, {id:"i3", label:"Validación por marcas", correctBucket:"left"}, {id:"i4", label:"Asertividad en el no", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "est-5-6", stepType: "info", title: "La Paz del Ingeniero", body: "Al final del día, lo que importa es el dato de tu libertad, no el aplauso de tu círculo. Has ganado el juego de la percepción.", fullScreen: true },
  { id: "est-5-7", stepType: "true_false", statement: "Vivir bajo tus propias reglas me hará una persona solitaria y aburrida.", correctValue: false, explanation: "Te hará una persona INTERESANTE y LIBRE. Los líderes reales no siguen modas, las ignoran.", isAssessment:true, fullScreen: true },
  { id: "est-5-8", stepType: "order", question: "Ciclo de Dominio Social", items: [{id:"p1", label: "Definir mis valores centrales", correctOrder: 1}, {id: "p2", label: "Instalar reglas de gasto coherentes", correctOrder: 2}, {id: "p3", label: "Disfrutar la paz de la autonomía", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "est-5-9", stepType: "blitz_challenge", question: "¿Qué es la regla anti-estatus?", options: [{id:"o1", label:"Un escudo contra la envidia ajena", isCorrect:true}, {id:"o2", label:"Una forma de ser pobre", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "est-5-10", stepType: "blitz_challenge", question: "¿A quién le rindes cuentas?", options: [{id:"o1", label:"A tu versión futura", isCorrect:true}, {id:"o2", label:"Al vendedor", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "est-5-11", stepType: "match", question: "Relaciona tu Poder", leftItems: [{id:"l1", label:"Fachada de Riqueza"}, {id:"l2", label:"Sistema de Riqueza"}], rightItems: [{id:"r1", label:"Drena tu energia"}, {id:"r2", label:"Genera tu tiempo"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}], isAssessment: true, fullScreen: true },
  { id: "est-5-12", stepType: "mindset_translator", question: "Declaración Final", beliefs: [{id: "b1", original: "Tengo miedo de no ser suficiente.", healthyOptions: [{id: "h1", label: "Soy el origen de mi propio valor y mi sistema financiero es mi obra maestra", isCorrect: true}, {id: "h2", label: "Mis cosas me hacen valer", isCorrect: false}]}] },
  { id: "est-5-13", stepType: "billy_talks", mood: "celebrating", body: "Misión Cumplida. Has terminado el Tema 3. Tu psicología del consumo está oficialmente hackeada para la libertad.", fullScreen: true },
  { id: "est-5-14", stepType: "narrative_check", question: "¿Cual es tu regla de oro definitiva para no volver a caer en el juego del estatus?", promptPlaceholder: "Mi regla es ...", minChars: 15, billyResponse: "Anotada en tu código de honor. Eres un Ingeniero del Dinero.", fullScreen: true,
    aiInsight: "La coherencia entre tus reglas y tus actos es la fuente máxima de autoestima económica."
  },
  { id: "est-5-15", stepType: "summary", title: "Tema 3: Finalizado", body: "Has dominado el Consumo. Has terminado el bloque Mentalidad. ¡Felicidades! Estás listo para el siguiente horizonte.", fullScreen: true },
]
