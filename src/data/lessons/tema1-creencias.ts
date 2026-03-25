import type { LessonStep } from "@/types/lessonTypes"

/**
 * Subtema C: Creencias
 * 
 * Lessons are now expanded to 15 slides each following the UPDATED BIZEN Blueprint (2 Blitz, 2+ AI Insights).
 */

// ==============================================================================
// LECCIÓN 1: Creencias limitantes (su origen) - 15 SLIDES
// ==============================================================================
export const lessonMisPrimerasCreenciasSobreElDineroSteps: LessonStep[] = [
  { id: "cre-1-1", stepType: "billy_talks", mood: "thinking", body: "Tus ideas sobre el dinero no son tuyas. Son programas instalados por tus padres, la escuela y la sociedad. ¿Qué software corre en tu mente?", fullScreen: true,
    data: { glossary: [{ word: "Software Mental", definition: "Conjunto de creencias y sesgos que dictan tu comportamiento." }, { word: "Origen Social", definition: "Influencia del entorno cercano en tu formación de identidad." }] }
  },
  { id: "cre-1-2", stepType: "info", title: "El Código Heredado", body: "Si escuchaste que 'el dinero es sucio' o 'el dinero no crece en los árboles', tienes un archivo corrupto en tu sistema de abundancia.", fullScreen: true,
    aiInsight: "El 90% de nuestras creencias financieras se forman antes de los 7 años por observación directa."
  },
  { id: "cre-1-3", stepType: "impulse_meter", instructions: "Mantén pulsado para 'borrar' una creencia limitante antigua. Respira vaciando tu mente.", item: { name: "Borrador de Código", price: "Libertad", imageUrl: "/billy-breathing.png" }, holdTime: 4, fullScreen: true },
  { id: "cre-1-4", stepType: "mcq", question: "¿Qué frase escuchabas más en casa?", options: [{id:"o1", label: "'No hay dinero para eso'", isCorrect: true}, {id:"o2", label: "'El dinero se gana con sudor'", isCorrect: true}, {id:"o3", label: "'Somos pobres pero honrados'", isCorrect: true}], isAssessment: false, fullScreen: true },
  { id: "cre-1-5", stepType: "swipe_sorter", question: "¿Es una Creencia Potenciadora o Limitante?", leftBucket: {label:"Limitante (Miedo)", color:"#ef4444"}, rightBucket: {label:"Potenciadora (Dato)", color:"#10b981"}, items: [{id:"i1", label:"'El dinero es difícil de ganar'", correctBucket:"left"}, {id:"i2", label:"'Soy capaz de crear valor'", correctBucket:"right"}, {id:"i3", label:"'Los ricos son malas personas'", correctBucket:"left"}, {id:"i4", label:"'El dinero es una herramienta'", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "cre-1-6", stepType: "info", title: "El Techo de Cristal", body: "Tus creencias ponen un tope a tus ingresos. No ganarás más de lo que crees que 'mereces' ganar.", fullScreen: true },
  { id: "cre-1-7", stepType: "true_false", statement: "Las creencias sobre el dinero se pueden cambiar radicalmente mediante el análisis técnico.", correctValue: true, explanation: "Al confrontar una creencia falsa con datos y lógica (ingeniería), el cerebro la descarta por ineficiente.", isAssessment:true, fullScreen: true },
  { id: "cre-1-8", stepType: "order", question: "Deconstrucción de una creencia", items: [{id:"p1", label:"Identificar el origen del miedo", correctOrder: 1}, {id:"p2", label:"Cuestionarla con datos reales", correctOrder: 2}, {id:"p3", label:"Sustituirla por una regla lógica", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "cre-1-9", stepType: "blitz_challenge", question: "¿De quién suelen venir tus primeras creencias?", options: [{id:"o1", label:"De libros", isCorrect:false}, {id:"o2", label:"De tu entorno cercano (Familia)", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "cre-1-10", stepType: "blitz_challenge", question: "¿Se puede reescribir el código mental?", options: [{id:"o1", label:"Sí, es ingeniería mental", isCorrect:true}, {id:"o2", label:"No, así nací", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "cre-1-11", stepType: "match", question: "Relaciona Frase con Impacto", leftItems: [{id:"l1", label:"'No puedo pagarlo'"}, {id:"l2", label:"'¿Cómo puedo pagarlo?'"}], rightItems: [{id:"r1", label:"Cierras el cerebro a soluciones"}, {id:"r2", label:"Activas el cerebro operativo"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}], isAssessment: true, fullScreen: true },
  { id: "cre-1-12", stepType: "mindset_translator", question: "Refactoriza tu código mental", beliefs: [{id: "b1", original: "Tengo que matarme trabajando para tener algo.", healthyOptions: [{id: "h1", label: "Tengo que diseñar sistemas de valor eficientes", isCorrect: true}, {id: "h2", label: "El sufrimiento es la única vía del éxito", isCorrect: false}]}] },
  { id: "cre-1-13", stepType: "narrative_check", question: "¿Qué te decía tu familia sobre los ricos?", promptPlaceholder: "Me decían que ...", minChars: 15, billyResponse: "Casi todos heredamos historias de escasez. Hoy empezamos a escribir de abundancia.", fullScreen: true },
  { id: "cre-1-14", stepType: "info", title: "Herederos de Datos", body: "No eres culpable de lo que te enseñaron, pero sí responsable de los algoritmos que decides usar hoy.", fullScreen: true,
    aiInsight: "Cambiar una creencia limitante tiene un impacto directo del 30% en tu capacidad de negociación futura."
  },
  { id: "cre-1-15", stepType: "summary", title: "Origen Identificado", body: "Has visto la fuente del código. Siguiente: Miedo a la Escasez.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 2: Escasez vs abundancia (definiciones técnicas) - 15 SLIDES
// ==============================================================================
export const lessonExpectativasVsRealidadFinancieraSteps: LessonStep[] = [
  { id: "cre-2-1", stepType: "billy_talks", body: "¿Sientes que el pastel es pequeño y te quitarán tu rebanada? Eso es escasez. ¿Sientes que puedes hornear más pasteles? Eso es abundancia.", fullScreen: true,
    data: { glossary: [{ word: "Suma Cero", definition: "Creencia de que para que uno gane, otro debe perder." }, { word: "Mentalidad de Creador", definition: "Visión de que el valor se puede generar infinitamente." }] }
  },
  { id: "cre-2-2", stepType: "info", title: "Suma Cero vs Win-Win", body: "La escasez asume que el dinero es finito (Suma Cero). La abundancia analítica comprende que el valor es expandible (Ingeniería de Valor).", fullScreen: true,
    aiInsight: "La economía moderna es un juego de Suma No Cero: el valor se crea de la nada mediante el ingenio."
  },
  { id: "cre-2-3", stepType: "impulse_meter", instructions: "Mantén pulsado y visualiza cómo el valor se expande bajo tu presión. Siente la fuerza creadora.", item: { name: "Generador de Abundancia", price: "Infinito", imageUrl: "/billy-breathing.png" }, holdTime: 5, fullScreen: true },
  { id: "cre-2-4", stepType: "mcq", question: "Ves a alguien con un auto de lujo. ¿Qué piensas?", options: [{id:"o1", label: "'Ojalá yo tuviera eso' (Envidia)", isCorrect: false}, {id:"o2", label: "'¿Cómo lo hizo? Quiero aprender' (Curiosidad)", isCorrect: true}, {id:"o3", label: "'Seguro hizo algo ilegal' (Resentimiento)", isCorrect: false}], isAssessment: true, fullScreen: true },
  { id: "cre-2-5", stepType: "swipe_sorter", question: "¿Es una Acción de Escasez o de Abundancia?", leftBucket: {label:"Escasez (Pobreza)", color:"#ef4444"}, rightBucket: {label:"Abundancia (Riqueza)", color:"#10b981"}, items: [{id:"i1", label:"Acaparar por miedo", correctBucket:"left"}, {id:"i2", label:"Invertir en formación", correctBucket:"right"}, {id:"i3", label:"Culpar al gobierno", correctBucket:"left"}, {id:"i4", label:"Colaborar con competidores", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "cre-2-6", stepType: "info", title: "El Costo de la Escasez", body: "El miedo a perder $10 te impide ganar $1,000. Eso se llama **[[Aversión Extrema al Riesgo|Sesgo emocional que prioriza la no-pérdida sobre la ganancia lógica]]**.", fullScreen: true },
  { id: "cre-2-7", stepType: "true_false", statement: "La abundancia significa gastar dinero como si no se fuera a acabar nunca.", correctValue: false, explanation: "Eso es imprudencia. La abundancia real es saber que tienes la CAPACIDAD de generar más mediante sistemas.", isAssessment:true, fullScreen: true },
  { id: "cre-2-8", stepType: "order", question: "Evolución hacia la mentalidad de abundancia", items: [{id:"p1", label: "Ahorro por miedo (Supervivencia)", correctOrder: 1}, {id: "p2", label: "Ahorro para invertir (Crecimiento)", correctOrder: 2}, {id: "p3", label: "Inversión para impactar (Abundancia)", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "cre-2-9", stepType: "blitz_challenge", question: "¿Qué sucede en un juego de suma cero?", options: [{id:"o1", label:"Todos ganan", isCorrect:false}, {id:"o2", label:"Si uno gana, otro pierde", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "cre-2-10", stepType: "blitz_challenge", question: "¿Qué mentalidad activa la colaboración?", options: [{id:"o1", label:"Escasez", isCorrect:false}, {id:"o2", label:"Abundancia", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "cre-2-11", stepType: "match", question: "Relaciona Pensamiento con Realidad", leftItems: [{id:"l1", label:"'No hay suficiente'"}, {id:"l2", label:"'Yo creo el valor'"}], rightItems: [{id:"r1", label:"Dependencia Externa"}, {id:"r2", label:"Autonomía Radical"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}], isAssessment: true, fullScreen: true },
  { id: "cre-2-12", stepType: "mindset_translator", question: "Traduce la escasez", beliefs: [{id: "b1", original: "Tengo que ganarles a todos para ser exitoso.", healthyOptions: [{id: "h1", label: "Crearé mi propio mercado donde yo ponga las reglas", isCorrect: true}, {id: "h2", label: "La guerra comercial es la única vía", isCorrect: false}]}] },
  { id: "cre-2-13", stepType: "billy_talks", body: "No compitas por una rebanada. Aprende a ser el dueño de la panadería.", mood: "happy", fullScreen: true },
  { id: "cre-2-14", stepType: "narrative_check", question: "¿Qué área de tu vida hoy se rige por la escasez?", promptPlaceholder: "Me da miedo que se acabe ...", minChars: 15, billyResponse: "Cambiaremos ese algoritmo. El valor no se acaba, se transforma.", fullScreen: true,
    aiInsight: "La mentalidad de abundancia es un multiplicador de red: atrae a personas con la misma visión."
  },
  { id: "cre-2-15", stepType: "summary", title: "Abundancia Hackeada", body: "Has visto la amplitud del sistema. Siguiente: Miedo al Éxito.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 3: El miedo al éxito (post-creencias) - 15 SLIDES
// ==============================================================================
export const lessonFrasesHeredadasQueMeLimitanSteps: LessonStep[] = [
  { id: "cre-3-1", stepType: "billy_talks", body: "A veces no nos asusta ser pobres, nos asusta la responsabilidad de ser ricos. ¿Estás listo para el éxito?", fullScreen: true,
    data: { glossary: [{ word: "Auto-Sabotaje", definition: "Acciones inconscientes para evitar un cambio positivo por miedo a lo desconocido." }, { word: "Zona de Confort", definition: "Estado mental de seguridad percibida que detiene el crecimiento." }] }
  },
  { id: "cre-3-2", stepType: "info", title: "El Síndrome del Impostor", body: "Creer que 'no mereces' el éxito te hará gastar todo el dinero que ganes para 'regresar' a tu zona conocida de escasez.", fullScreen: true,
    aiInsight: "El miedo al éxito es a menudo miedo a la soledad: tememos dejar atrás a nuestro entorno actual."
  },
  { id: "cre-3-3", stepType: "impulse_meter", instructions: "Mantén pulsado y acepta tu futura versión exitosa. No parpadees. Sostén tu visión.", item: { name: "Aceptador de Éxito", price: "Responsabilidad", imageUrl: "/billy-breathing.png" }, holdTime: 6, fullScreen: true },
  { id: "cre-3-4", stepType: "mcq", question: "Si mañana te vuelves el doble de rico, ¿cuál es tu mayor miedo?", options: [{id:"o1", label: "Que mis amigos me pidan dinero", isCorrect: true}, {id:"o2", label: "No saber manejarlo y perderlo", isCorrect: true}, {id:"o3", label: "Que me juzguen por tener dinero", isCorrect: true}], isAssessment: false, fullScreen: true },
  { id: "cre-3-5", stepType: "swipe_sorter", question: "¿Es una Acción de Auto-Sabotaje o de Crecimiento?", leftBucket: {label:"Sabotaje (Miedo)", color:"#ef4444"}, rightBucket: {label:"Crecimiento (Poder)", color:"#10b981"}, items: [{id:"i1", label:"Gastar el bono antes de cobrarlo", correctBucket:"left"}, {id:"i2", label:"Contratar a un asesor financiero", correctBucket:"right"}, {id:"i3", label:"Retrasar una venta por miedo al sí", correctBucket:"left"}, {id:"i4", label:"Automatizar cuentas de inversión", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "cre-3-6", stepType: "info", title: "La Terapia del Núcleo", body: "El éxito requiere una nueva identidad. Tienes que dejar de ser 'el que sobrevive' para ser 'el que diseña'.", fullScreen: true },
  { id: "cre-3-7", stepType: "true_false", statement: "El éxito financiero me alejará de mis valores y de mi gente.", correctValue: false, explanation: "El dinero solo AMPLIFICA quien ya eres. Si eres bueno, serás un gran filántropo/líder.", isAssessment:true, fullScreen: true },
  { id: "cre-3-8", stepType: "order", question: "Pasos para aceptar el éxito", items: [{id:"p1", label: "Aceptación del merecimiento", correctOrder: 1}, {id: "p2", label: "Construcción del sistema de soporte", correctOrder: 2}, {id: "p3", label: "Escalabilidad total", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "cre-3-9", stepType: "blitz_challenge", question: "¿Qué hace el auto-sabotador?", options: [{id:"o1", label:"Se esfuerza más", isCorrect:false}, {id:"o2", label:"Se pone zancadillas inconscientes", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "cre-3-10", stepType: "blitz_challenge", question: "¿El dinero cambia a la gente?", options: [{id:"o1", label:"Sí, los vuelve malos", isCorrect:false}, {id:"o2", label:"No, solo los AMPLIFICA", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "cre-3-11", stepType: "match", question: "Consecuencias del miedo", leftItems: [{id:"l1", label:"Gastos fantasmas"}, {id:"l2", label:"Procrastinación"}], rightItems: [{id:"r1", label:"Deshacerse del capital 'quemante'"}, {id:"r2", label:"No abrir puertas al ingreso mayor"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}], isAssessment: true, fullScreen: true },
  { id: "cre-3-12", stepType: "mindset_translator", question: "Refactoriza tu merecimiento", beliefs: [{id: "b1", original: "Tener dinero me hará una mala persona.", healthyOptions: [{id: "h1", label: "Mi capital me dará herramientas para ayudar a miles", isCorrect: true}, {id: "h2", label: "Voy a convertirme en un villano", isCorrect: false}]}] },
  { id: "cre-3-13", stepType: "billy_talks", mood: "celebrating", body: "Brilla sin miedo. El mundo no se beneficia de que tú seas pequeño.", fullScreen: true },
  { id: "cre-3-14", stepType: "narrative_check", question: "¿Cómo te verías a ti mismo con 10 veces más capital hoy?", promptPlaceholder: "Me vería como un ...", minChars: 15, billyResponse: "Cree esa imagen. Es la brújula de tu sistema.", fullScreen: true,
    aiInsight: "La visualización técnica del éxito reduce la fricción emocional al recibir grandes sumas de capital."
  },
  { id: "cre-3-15", stepType: "summary", title: "Éxito Aceptado", body: "Has liberado el freno de mano. Siguiente: Mitos del Dinero.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 4: Mitos comunes vs realidad de ingeniería - 15 SLIDES
// ==============================================================================
export const lessonComoCuestionarUnaCreenciaConEvidenciaSteps: LessonStep[] = [
  { id: "cre-4-1", stepType: "billy_talks", body: "La mayoría de la gente repite mitos financieros como loros. Vamos a usar datos para demolerlos.", fullScreen: true,
    data: { glossary: [{ word: "Mito Financiero", definition: "Creencia popular sin base técnica o científica." }, { word: "Realidad Operativa", definition: "Hecho demostrable mediante flujos y resultados." }] }
  },
  { id: "cre-4-2", stepType: "info", title: "Mito: 'El dinero es escaso'", body: "Realidad: Se imprimen billones cada día. El dinero no falta, lo que falta es tu capacidad de atraerlo mediante valor.", fullScreen: true,
    aiInsight: "El capital global crece a una tasa superior a la población; el problema es de distribución y valor, no de falta física."
  },
  { id: "cre-4-3", stepType: "impulse_meter", instructions: "Mantén pulsado para 'destruir' un mito. Respira y siente la claridad de los datos.", item: { name: "Demoledor de Mitos", price: "Verdad", imageUrl: "/billy-breathing.png" }, holdTime: 4, fullScreen: true },
  { id: "cre-4-4", stepType: "mcq", question: "¿Cuál de estos mitos te crees más todavía?", options: [{id:"o1", label: "'Necesito dinero para hacer dinero'", isCorrect: true}, {id:"o2", label: "'Invertir es solo para genios'", isCorrect: true}, {id:"o3", label: "'Mi casa es mi mejor inversión'", isCorrect: true}], isAssessment: false, fullScreen: true },
  { id: "cre-4-5", stepType: "swipe_sorter", question: "¿Es un Mito o una Realidad de Ingeniería?", leftBucket: {label:"Mito (Falso)", color:"#ef4444"}, rightBucket: {label:"Realidad (Verdad)", color:"#3b82f6"}, items: [{id:"i1", label:"'La suerte hace al rico'", correctBucket:"left"}, {id:"i2", label:"'Sistemas generan libertad'", correctBucket:"right"}, {id:"i3", label:"'Comprar auto nuevo es invertir'", correctBucket:"left"}, {id:"i4", label:"'Apalancamiento acelera metas'", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "cre-4-6", stepType: "info", title: "Mito: 'Invertir es arriesgado'", body: "Realidad: NO invertir es el riesgo mayor, porque aseguras la pérdida de poder adquisitivo por inflación.", fullScreen: true },
  { id: "cre-4-7", stepType: "true_false", statement: "El ahorro es la única forma de acumular riqueza infinita.", correctValue: false, explanation: "El ahorro solo preserva; la inversión y la creación de valor son las que multiplican.", isAssessment:true, fullScreen: true },
  { id: "cre-4-8", stepType: "order", question: "Deuda Buena vs Deuda Mala (Criterio)", items: [{id:"p1", label: "Analizar si genera flujo positivo (ROI)", correctOrder: 1}, {id: "p2", label: "Comparar tasa de interés vs rendimiento", correctOrder: 2}, {id: "p3", label: "Decisión basada en balance", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "cre-4-9", stepType: "blitz_challenge", question: "¿Qué sucede con el dinero guardado bajo el colchón?", options: [{id:"o1", label:"Se multiplica", isCorrect:false}, {id:"o2", label:"Pierde valor por inflación", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "cre-4-10", stepType: "blitz_challenge", question: "¿Qué hace a un activo 'bueno'?", options: [{id:"o1", label:"Que sea bonito", isCorrect:false}, {id:"o2", label:"Que ponga dinero en tu bolsillo (ROI+)", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "cre-4-11", stepType: "match", question: "Realidad de la casa", leftItems: [{id:"l1", label:"Mito: 'Mi casa es inversión'"}, {id:"l2", label:"Realidad de la casa"}], rightItems: [{id:"r1", label:"A menudo es un pasivo de mantenimiento"}, {id:"r2", label:"Solo es activo si te paga renta"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}], isAssessment: true, fullScreen: true },
  { id: "cre-4-12", stepType: "mindset_translator", question: "Limpia los mitos", beliefs: [{id: "b1", original: "El dinero se acaba si lo gasto en mi educación.", healthyOptions: [{id: "h1", label: "Mi cerebro es el activo con mayor ROI posible", isCorrect: true}, {id: "h2", label: "La ignorancia es más barata", isCorrect: false}]}] },
  { id: "cre-4-13", stepType: "billy_talks", body: "No sigas a la manada. La manada suele estar quebrada. Sigue a los datos.", fullScreen: true },
  { id: "cre-4-14", stepType: "narrative_check", question: "¿Qué mito financiero te ha costado más dinero en la vida?", promptPlaceholder: "Me costó dinero creer que ...", minChars: 15, billyResponse: "Lección aprendida, dinero recuperado en el futuro.", fullScreen: true,
    aiInsight: "Cuestionar mitos heredados es la forma más rápida de encontrar ineficiencias en tu sistema personal."
  },
  { id: "cre-4-15", stepType: "summary", title: "Niebla Despejada", body: "Has limpiado los mitos. Siguiente: Tu Nueva Programación.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 5: Reprogramación: Mi nuevo código financiero - 15 SLIDES
// ==============================================================================
export const lessonMiNuevoManualDeReglasFinancierasSteps: LessonStep[] = [
  { id: "cre-5-1", stepType: "billy_talks", body: "Has borrado el software viejo. Instalemos el BIZEN OS 1.0. Tu nueva identidad comienza hoy.", fullScreen: true,
    data: { glossary: [{ word: "Programación Financiera", definition: "Proceso consciente de re-diseñar tus reglas internas de dinero." }, { word: "Metas de Ingeniería", definition: "Objetivos cuantificables, realistas y escalables." }] }
  },
  { id: "cre-5-2", stepType: "info", title: "Instalando Reglas Lógicas", body: "Regla 1: Cada peso es un soldado. Regla 2: Mi tiempo vale más que mi dinero. Regla 3: El valor es la fuente.", fullScreen: true,
    aiInsight: "Un manual de reglas personal reduce la fatiga de decisión en un 60% diario."
  },
  { id: "cre-5-3", stepType: "impulse_meter", instructions: "Mantén pulsado para confirmar la installation de tu nuevo sistema. Siente el clic mental.", item: { name: "Instalador BIZEN", price: "0.00", imageUrl: "/billy-breathing.png" }, holdTime: 5, fullScreen: true },
  { id: "cre-5-4", stepType: "mcq", question: "Ante un gasto inesperado, ¿cuál es tu nuevo comando automático?", options: [{id:"o1", label: "'¿Cómo me afecta el sistema de libertad?'", isCorrect: true}, {id:"o2", label: "'No importa, mañana gano más'", isCorrect: false}, {id:"o3", label: "'Ayúdame Dios mío'", isCorrect: false}], isAssessment: true, fullScreen: true },
  { id: "cre-5-5", stepType: "swipe_sorter", question: "¿Esta frase es de tu NUEVO sistema?", leftBucket: {label:"Legacy (Viejo)", color:"#94a3b8"}, rightBucket: {label:"Modern (Nuevo)", color:"#6366f1"}, items: [{id:"i1", label:"'Debo ahorrar por si acaso'", correctBucket:"left"}, {id:"i2", label:"'Diseño mi independencia'", correctBucket:"right"}, {id:"i3", label:"'Gasto para encajar'", correctBucket:"left"}, {id:"i4", label:"'El mercado paga por mi rareza'", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "cre-5-6", stepType: "info", title: "Autonomía de Datos", body: "Tus decisiones ahora se basan en tu Tablero de Control, no en tus estados de ánimo.", fullScreen: true },
  { id: "cre-5-7", stepType: "true_false", statement: "La reprogramación financiera es un evento de una única vez.", correctValue: false, explanation: "Es un mantenimiento continuo; el software viejo siempre intentará reinstalarse.", isAssessment:true, fullScreen: true },
  { id: "cre-5-8", stepType: "order", question: "Rutina del nuevo sistema", items: [{id:"p1", label: "Checkup matutino de visión", correctOrder: 1}, {id: "p2", label: "Ejecución disciplinada del plan", correctOrder: 2}, {id: "p3", label: "Revisión nocturna de gratitud/avance", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "cre-5-9", stepType: "blitz_challenge", question: "¿Qué regla BIZEN es vital?", options: [{id:"o1", label:"Gastar todo", isCorrect:false}, {id:"o2", label:"Tu tiempo > Tu dinero", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "cre-5-10", stepType: "blitz_challenge", question: "¿Quién manda ahora?", options: [{id:"o1", label:"El miedo", isCorrect:false}, {id:"o2", label:"Tu Arquitectura de Datos", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "cre-5-11", stepType: "match", question: "Identidad", leftItems: [{id:"l1", label:"Antes eras:"}, {id:"l2", label:"Ahora eres:"}], rightItems: [{id:"r1", label:"Reactivo al entorno"}, {id:"r2", label:"Proactivo con el sistema"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}], isAssessment: true, fullScreen: true },
  { id: "cre-5-12", stepType: "mindset_translator", question: "Declaración final", beliefs: [{id: "b1", original: "Ojalá el sistema cambie para que yo esté bien.", healthyOptions: [{id: "h1", label: "Yo soy el sistema y mi bienestar depende de mi ingeniería", isCorrect: true}, {id: "h2", label: "Votaré por alguien que me dé todo gratis", isCorrect: false}]}] },
  { id: "cre-5-13", stepType: "billy_talks", mood: "happy", body: "Bienvenido a la minoría que entiende el juego. Estás listo para dejar atrás el Tema 1.", fullScreen: true },
  { id: "cre-5-14", stepType: "narrative_check", question: "Escribe tu nuevo 'Algoritmo de Vida' (ej: Si X sucede, yo actuo con Y porque valoro Z).", promptPlaceholder: "Mi algoritmo es ...", minChars: 25, billyResponse: "Algoritmo instalado y compilado. ¡Felicidades, Ingeniero del Dinero!", fullScreen: true,
    aiInsight: "Compilar tu algoritmo de vida es el paso final para alcanzar la neutralidad ante los triggers externos."
  },
  { id: "cre-5-15", stepType: "summary", title: "Tema 1: Concluido", body: "Has terminado la Mentalidad. Has borrado el código viejo. Siguiente: Tema 2 - Ingeniería del Ingreso. ¡A por ello!", fullScreen: true },
]
