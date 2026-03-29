import type { LessonStep } from "@/types/lessonTypes"

/**
 * Tema 3: Triggers de Compra (Subtema A)
 * 
 * Expanded to 15 slides per lesson following the UPDATED BIZEN Blueprint (2 Blitz, 2+ AI Insights).
 */

// ==============================================================================
// LECCIÓN 1: ¿Qué es un Trigger de compra? - 15 SLIDES
// ==============================================================================
export const lessonQueEsUnTriggerDeCompraSteps: LessonStep[] = [
  { id: "tri-1-1", stepType: "billy_talks", mood: "thinking", body: "Un trigger o 'disparador' es el chip mental que activa tu compra sin que tu razón lo note. No es racional, es reactivo e instintivo.", fullScreen: true,
    data: { glossary: [{ word: "Trigger de Compra", definition: "Estímulo interno o externo que desencadena el deseo impulsivo de adquirir algo." }, { word: "Respuesta Límbica", definition: "Reacción del cerebro emocional que prioriza el placer inmediato." }] }
  },
  { id: "tri-1-2", stepType: "info", title: "Disparadores Externos", body: "Un olor, una música, un color rojo de oferta... Tu entorno está lleno de ganchos diseñados por expertos para jalar tu cartera.", fullScreen: true,
    aiInsight: "El 70% de las compras en centros comerciales no estaban planeadas al entrar."
  },
  { id: "tri-1-3", stepType: "mcq", question: "Ves a alguien que te cae mal con algo nuevo y caro. Sientes envidia. ¿Qué tipo de trigger es?", options: [{id:"o1", label:"Trigger Externo (Entorno)", isCorrect:false}, {id:"o2", label:"Trigger Interno (Emocional)", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "tri-1-4", stepType: "swipe_sorter", question: "¿Es un Disparador Externo o Interno?", leftBucket: {label:"Externo (Mundo)", color:"#ef4444"}, rightBucket: {label:"Interno (Mente)", color:"#10b981"}, items: [{id:"s1", label:"Anuncio en Instagram", correctBucket:"left"}, {id:"s2", label:"Miedo al futuro", correctBucket:"right"}, {id:"s3", label:"Aburrimiento", correctBucket:"right"}, {id:"s4", label:"Cartelera de cine", correctBucket:"left"}], isAssessment: true, fullScreen: true },
  { id: "tri-1-5", stepType: "info", title: "El Circuito del Deseo", body: "El trigger activa la DOPAMINA mucho antes de que compres. Disfrutas la IMAGEN de tener el objeto más que el objeto mismo.", fullScreen: true },
  { id: "tri-1-6", stepType: "true_false", statement: "Es posible eliminar todos los triggers de compra de tu vida mediante fuerza de voluntad.", correctValue: false, explanation: "Vivimos en una sociedad de consumo; el truco no es eliminarlos, es aprender a IGNORARLOS.", isAssessment: true, fullScreen: true },
  { id: "tri-1-7", stepType: "order", question: "Secuencia de un Trigger", items: [{id:"p1", label: "Exposición al estímulo (Visual/Auditivo)", correctOrder: 1}, {id: "p2", label: "Respuesta límbica (Anticipación)", correctOrder: 2}, {id: "p3", label: "Justificación lógica (Después del deseo)", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "tri-1-8", stepType: "match", question: "Relaciona Trigger con su Fuerza", leftItems: [{id:"l1", label:"Escasez"}, {id:"l2", label:"Autoridad"}, {id:"l3", label:"Social"}], rightItems: [{id:"r1", label:"'¡Solo hoy!'"}, {id:"r2", label:"'Recomendado por expertos'"}, {id:"r3", label:"'Todos lo tienen'"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}, {leftId:"l3", rightId:"r3"}], isAssessment: true, fullScreen: true },
  { id: "tri-1-9", stepType: "blitz_challenge", question: "¿Qué neurotransmisor se activa con un trigger?", options: [{id:"o1", label:"Serotonina", isCorrect:false}, {id:"o2", label:"Dopamina", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "tri-1-10", stepType: "blitz_challenge", question: "¿Cual es el mejor antídoto contra un trigger vivo?", options: [{id:"o1", label:"Ignorarlo", isCorrect:false}, {id:"o2", label: "Consciencia y Pausa", isCorrect: true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "tri-1-11", stepType: "mindset_translator", question: "Neutraliza el gancho", beliefs: [{id: "b1", original: "Lo necesito porque está en rebaja.", healthyOptions: [{id: "h1", label: "Si no lo necesito, cualquier precio es caro (Costo Cero)", isCorrect: true}, {id: "h2", label: "Ahorraré si compro diez", isCorrect: false}]}] },
  { id: "tri-1-12", stepType: "impulse_meter", instructions: "Mantén pulsado para 'identificar' un trigger en tu mente. Respira y obsérvalo sin actuar.", item: { name: "Escáner de Triggers", price: "0.00", imageUrl: "/billy-breathing.png" }, holdTime: 5, fullScreen: true },
  { id: "tri-1-13", stepType: "narrative_check", question: "¿Qué objeto te jala más el ojo cuando vas a un centro comercial y te hace 'picar'?", promptPlaceholder: "Me jalan los ...", minChars: 15, billyResponse: "Detectarlo es la mitad de la batalla. Ahora lo verás distinto.", fullScreen: true },
  { id: "tri-1-14", stepType: "info", title: "Alerta importante", body: "Los centros comerciales están diseñados como laberintos de triggers. No vayas a 'ver', ve con una lista o no vayas.", fullScreen: true,
    aiInsight: "Las tiendas ponen los artículos básicos al fondo para que recorras todos los triggers posibles en el camino."
  },
  { id: "tri-1-15", stepType: "summary", title: "Trigger Detectado", body: "Has aprendido a ver los hilos. Siguiente: La ciencia de la dopamina y el consumo.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 2: Dopamina y consumo (La ciencia del deseo) - 15 SLIDES
// ==============================================================================
export const lessonPublicidadComoTeManipulaSteps: LessonStep[] = [
  { id: "tri-2-1", stepType: "billy_talks", body: "La publicidad no vende productos, vende DOPAMINA. Te vende la versión mejorada de tí mismo que 'serías' si compraras eso.", fullScreen: true,
    data: { glossary: [{ word: "Dopamina", definition: "Neurotransmisor del placer anticipatorio y la búsqueda de recompensa." }, { word: "Publicidad Aspiracional", definition: "Técnica que asocia un producto con un estatus o estilo de vida superior." }] }
  },
  { id: "tri-2-2", stepType: "info", title: "Asociación Neuronal", body: "Si ves a gente feliz tomando un refresco en la playa, tu cerebro graba: Refresco = Felicidad + Verano.", fullScreen: true,
    aiInsight: "Tu cerebro no distingue entre una imagen de publicidad y una realidad futura si la emoción es fuerte."
  },
  { id: "tri-2-3", stepType: "mcq", question: "¿Qué busca un anuncio que muestra a un experto con traje de doctor recomendando un lujo?", options: [{id:"o1", label:"Dar datos técnicos reales", isCorrect:false}, {id:"o2", label:"Generar Confianza y Autoridad inmediata", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "tri-2-4", stepType: "swipe_sorter", question: "¿Qué técnica publicitaria hay detrás?", leftBucket: {label:"Miedo/Escasez", color:"#ef4444"}, rightBucket: {label:"Pertenencia/Aspiración", color:"#10b981"}, items: [{id:"s1", label:"'No te quedes fuera del grupo'", correctBucket:"right"}, {id:"s2", label:"'¡Solo hoy 50% de descuento!'", correctBucket:"left"}, {id:"s3", label:"'Siéntete como un rey'", correctBucket:"right"}, {id:"s4", label:"'Tu familia está en riesgo'", correctBucket:"left"}], isAssessment: true, fullScreen: true },
  { id: "tri-2-5", stepType: "info", title: "El Placer de la Anticipación", body: "Sientes más placer AL COMPRAR (clic) que AL RECIBIR el objeto. La dopamina cae en cuanto tienes el objeto en tus manos.", fullScreen: true },
  { id: "tri-2-6", stepType: "true_false", statement: "Los comerciales de perfumes realmente intentan venderte el olor del producto.", correctValue: false, explanation: "Venden seducción, estatus y poder; el olor es solo el vehículo para la narrativa.", isAssessment: true, fullScreen: true },
  { id: "tri-2-7", stepType: "order", question: "El Ciclo de la Adicción al Consumo", items: [{id:"p1", label: "Sentir insatisfacción o aburrimiento", correctOrder: 1}, {id: "p2", label: "Ver anuncio aspiracional", correctOrder: 2}, {id: "p3", label: "Compra rápida (Pico de dopamina)", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "tri-2-8", stepType: "match", question: "Relaciona Técnica con Objetivo", leftItems: [{id:"l1", label:"Prueba Social"}, {id:"l2", label:"Personalización"}, {id:"l3", label:"Nostalgia"}], rightItems: [{id:"r1", label:"'5,000 personas lo aman'"}, {id:"r2", label:"'Sugerencias para TÍ'"}, {id:"r3", label:"'Como en casa de mamá'"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}, {leftId:"l3", rightId:"r3"}], isAssessment: true, fullScreen: true },
  { id: "tri-2-9", stepType: "blitz_challenge", question: "¿Qué técnica usa el '¡Solo por hoy!'?", options: [{id:"o1", label:"Autoridad", isCorrect:false}, {id:"o2", label:"Escasez", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "tri-2-10", stepType: "blitz_challenge", question: "¿Quién es el responsable de que un anuncio funcione?", options: [{id:"o1", label:"El modelo", isCorrect:false}, {id:"o2", label:"Tu propia carencia interna", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "tri-2-11", stepType: "mindset_translator", question: "Resiste el gancho", beliefs: [{id: "b1", original: "Esa crema me hará ver más joven y exitoso.", healthyOptions: [{id: "h1", label: "Mi valor es independiente de los productos que uso", isCorrect: true}, {id: "h2", label: "Comprar esto me dará felicidad eterna", isCorrect: false}]}] },
  { id: "tri-2-12", stepType: "impulse_meter", instructions: "Mantén pulsado y visualiza el anuncio desvaneciéndose. Respira y siente tu integridad física.", item: { name: "Filtro de Verdad", price: "Libre", imageUrl: "/billy-breathing.png" }, holdTime: 5, fullScreen: true },
  { id: "tri-2-13", stepType: "narrative_check", question: "¿Qué anuncio de TV o redes recuerdas más hoy?", promptPlaceholder: "Recuerdo el de ...", minChars: 10, billyResponse: "Si lo recuerdas, el publicista ganó esa ronda. La próxima será tuya.", fullScreen: true },
  { id: "tri-2-14", stepType: "info", title: "Alerta importante", body: "Los anunciantes estudian neurociencia. No es una pelea justa; necesitas tu propia ingeniería de defensa.", fullScreen: true,
    aiInsight: "Las grandes tecnológicas usan algoritmos para predecir cuándo eres más vulnerable emocionalmente y lanzarte el anuncio en ese momento."
  },
  { id: "tri-2-15", stepType: "summary", title: "Dopamina Desarmada", body: "Ya sabes por qué sientes urgencia. Siguiente: Redes Sociales y la comparación social.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 3: Redes Sociales y comparación social - 15 SLIDES
// ==============================================================================
export const lessonRedesComparacionYPresionSteps: LessonStep[] = [
  { id: "tri-3-1", stepType: "billy_talks", body: "Instagram no es la vida real; es una galería de los mejores momentos de los demás diseñada para que tú te sientas insuficiente.", fullScreen: true,
    data: { glossary: [{ word: "FOMO (Fear Of Missing Out)", definition: "Miedo a perderse un evento o experiencia social que otros están disfrutando." }, { word: "Comparación Ascendente", definition: "Compararse con personas que parecen tener más estatus o recursos, causando infelicidad." }] }
  },
  { id: "tri-3-2", stepType: "info", title: "La Trampa del Algoritmo", body: "El algoritmo te muestra lo que NO tienes para que sientas envidia y compres.", fullScreen: true,
    aiInsight: "Ver fotos de gente 'mejor' que nosotros dispara las mismas áreas del cerebro que el dolor físico."
  },
  { id: "tri-3-3", stepType: "mcq", question: "¿Qué efecto tiene en tí ver las vacaciones de lujo de tus conocidos?", options: [{id:"o1", label:"Inspiración profunda (Raro)", isCorrect:false}, {id:"o2", label:"Ansiedad por mi falta de estatus (FOMO)", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "tri-3-4", stepType: "swipe_sorter", question: "¿Redes: Generan Valor o Generan Gasto?", leftBucket: {label:"Generan Gasto (Miedo)", color:"#ef4444"}, rightBucket: {label:"Generan Valor (Paz)", color:"#10b981"}, items: [{id:"s1", label:"Seguir a influencers de lujo", correctBucket:"left"}, {id:"s2", label:"Taller de finanzas en vivo", correctBucket:"right"}, {id:"s3", label:"Scroll de compras nocturno", correctBucket:"left"}, {id:"s4", label:"Podcast de inversión estratégica", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "tri-3-5", stepType: "info", title: "El Marketing de Urgencia Falsa", body: "En redes abundan los 'Lanzamientos únicos' y 'Solo por 24 horas'.", fullScreen: true },
  { id: "tri-3-6", stepType: "true_false", statement: "Tener las notificaciones de redes apagadas te ayuda a ahorrar dinero indirectamente.", correctValue: true, explanation: "Eliminas los micro-triggers visuales constantes.", isAssessment: true, fullScreen: true },
  { id: "tri-3-7", stepType: "order", question: "Ciclo del FOMO en redes", items: [{id:"p1", label: "Ver post de éxito ajeno", correctOrder: 1}, {id: "p2", label: "Sentir carencia material inmediata", correctOrder: 2}, {id: "p3", label: "Gastar en algo similar para 'equilibrar'", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "tri-3-8", stepType: "match", question: "Relaciona Concepto con Solución", leftItems: [{id:"l1", label:"Deseo por ver lo nuevo"}, {id:"l2", label:"Envida visual"}, {id:"l3", label:"Presión de grupo"}], rightItems: [{id:"r1", label:"Silenciar cuentas tóxicas"}, {id:"r2", label:"Practicar gratitud técnica"}, {id:"r3", label:"Definir mi propia meta de éxito"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}, {leftId:"l3", rightId:"r3"}], isAssessment: true, fullScreen: true },
  { id: "tri-3-9", stepType: "blitz_challenge", question: "¿Qué significa FOMO?", options: [{id:"o1", label:"Fear Of My Options", isCorrect:false}, {id:"o2", label:"Fear Of Missing Out", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "tri-3-10", stepType: "blitz_challenge", question: "¿Qué es más importante para tu cuenta?", options: [{id:"o1", label:"Parecer exitoso", isCorrect:false}, {id:"o2", label:"Ser libre de la opinión ajena", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "tri-3-11", stepType: "mindset_translator", question: "Refactoriza tu Feed", beliefs: [{id: "b1", original: "Tengo que ir a esa fiesta/lugar para ser alguien.", healthyOptions: [{id: "h1", label: "Yo decido dónde gasto mi energía según mi plan maestro", isCorrect: true}, {id: "h2", label: "Mi valor depende de mis fotos publicadas", isCorrect: false}]}] },
  { id: "tri-3-12", stepType: "impulse_meter", instructions: "Mantén pulsado y visualiza tu vida libre de la opinión ajena. Respira autonomía.", item: { name: "Escudo de Autonomía", price: "Paz", imageUrl: "/billy-breathing.png" }, holdTime: 6, fullScreen: true },
  { id: "tri-3-13", stepType: "narrative_check", question: "¿Qué cuenta de redes sociales vas a silenciar hoy porque te hace sentir 'pobre'?", promptPlaceholder: "Silenciaré a ...", minChars: 10, billyResponse: "Hazlo. Es una inversión masiva en tu salud mental y financiera.", fullScreen: true },
  { id: "tri-3-14", stepType: "info", title: "Alerta importante", body: "Los influencers viven de que tú consumas. Ellos cobran por tu clic. No seas el producto de su negocio.", fullScreen: true,
    aiInsight: "El scroll infinito está diseñado con la misma psicología que las máquinas tragamonedas de Las Vegas."
  },
  { id: "tri-3-15", stepType: "summary", title: "Redes Controladas", body: "Has dominado el mundo digital. Siguiente: El efecto anclaje en tus decisiones.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 4: El efecto anclaje en tus decisiones - 15 SLIDES
// ==============================================================================
export const lessonComprasPorAburrimientoVsNecesidadSteps: LessonStep[] = [
  { id: "tri-4-1", stepType: "billy_talks", body: "Muchas compras ocurren solo porque tu cerebro se quedó 'pegado' a un número que no es real. Bienvenidos al Anclaje.", fullScreen: true,
    data: { glossary: [{ word: "Efecto Anclaje", definition: "Sesgo cognitivo que ocurre cuando la primera información que recibimos domina nuestro juicio posterior." }, { word: "Precio de Referencia", definition: "Primer precio visto que usamos para decidir si algo es caro o barato." }] }
  },
  { id: "tri-4-2", stepType: "info", title: "La Trampa del 'Antes $599'", body: "Cuando ves un precio tachado, tu cerebro 'se ancla' al precio alto.", fullScreen: true,
    aiInsight: "Incluso números irrelevantes (como el final de tu seguro social) pueden anclar tu percepción de cuánto deberías pagar por algo."
  },
  { id: "tri-4-3", stepType: "mcq", question: "Ves una televisión de $2,000 'rebajada' a $1,200. ¿Qué acaba de pasar?", options: [{id:"o1", label:"Gané $800", isCorrect:false}, {id:"o2", label:"Gasté $1,200 en un objeto anclado", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "tri-4-4", stepType: "swipe_sorter", question: "¿Es una Oferta Real o un Anclaje Psicológico?", leftBucket: {label:"Anclaje (Truco)", color:"#ef4444"}, rightBucket: {label:"Valor Real (Dato)", color:"#10b981"}, items: [{id:"s1", label:"'Precio original: $10,000'", correctBucket:"left"}, {id:"s2", label:"Costo marginal de producción", correctBucket:"right"}, {id:"s3", label:"'Liquidación de última hora'", correctBucket:"left"}, {id:"s4", label:"Precio promedio de mercado", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "tri-4-5", stepType: "info", title: "El Señuelo (The Decoy)", body: "A veces las marcas ponen una opción absurdamente cara solo para que la opción 'media' te parezca barata.", fullScreen: true },
  { id: "tri-4-6", stepType: "true_false", statement: "Un descuento del 50% significa que estoy ahorrando la mitad de mi dinero.", correctValue: false, explanation: "Solo ahorras si lo IBAS a comprar de todos modos.", isAssessment: true, fullScreen: true },
  { id: "tri-4-7", stepType: "order", question: "Cómo evitar el Anclaje", items: [{id:"p1", label: "Ignorar el precio 'tachado'", correctOrder: 1}, {id: "p2", label: "Comparar precios en 3 sitios distintos", correctOrder: 2}, {id: "p3", label: "Decidir según mi presupuesto base", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "tri-4-8", stepType: "match", question: "Relaciona Engaño con Realidad", leftItems: [{id:"l1", label:"Ganga"}, {id:"l2", label:"Oferta"}, {id:"l3", label:"Exclusivo"}], rightItems: [{id:"r1", label:"Deshacerse de inventario"}, {id:"r2", label:"Bajar barrera psicológica"}, {id:"r3", label:"Aumentar margen percibido"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}, {leftId:"l3", rightId:"r3"}], isAssessment: true, fullScreen: true },
  { id: "tri-4-9", stepType: "blitz_challenge", question: "¿Cómo se llama el sesgo de quedarse pegado a un número?", options: [{id:"o1", label:"Anclaje", isCorrect:true}, {id:"o2", label:"Gravitación", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "tri-4-10", stepType: "blitz_challenge", question: "¿Qué precio es el único que importa?", options: [{id:"o1", label:"El descuento", isCorrect:false}, {id:"o2", label:"El precio final neto", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "tri-4-11", stepType: "mindset_translator", question: "Corta los hilos", beliefs: [{id: "b1", original: "No puedo dejar pasar este 3x2.", healthyOptions: [{id: "h1", label: "No compraré 3 de algo que no necesito hoy", isCorrect: true}, {id: "h2", label: "El ahorro en volumen me hará rico", isCorrect: false}]}] },
  { id: "tri-4-12", stepType: "impulse_meter", instructions: "Mantén pulsado y borra el precio 'falso' de tu mente. Respira objetividad pura.", item: { name: "Borrador de Anclas", price: "Dato", imageUrl: "/billy-breathing.png" }, holdTime: 5, fullScreen: true },
  { id: "tri-4-13", stepType: "narrative_check", question: "¿Cuál ha sido la 'oferta' que más te dolió haber comprado luego?", promptPlaceholder: "Me arrepiento de comprar ...", minChars: 15, billyResponse: "Casi todos hemos caído en el ancla. Hoy ya tienes el radar encendido.", fullScreen: true },
  { id: "tri-4-14", stepType: "info", title: "Alerta importante", body: "Las promociones no existen para ayudarte, existen para acelerar el ciclo de venta del negocio.", fullScreen: true,
    aiInsight: "El 'Precio Sugerido' es casi siempre un ancla ficticia inflada para que sientas que ganas al recibir un descuento."
  },
  { id: "tri-4-15", stepType: "summary", title: "Anclaje Neutralizado", body: "Has visto el truco de magia. Siguiente: Cómo desactivar un trigger en vivo.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 5: Cómo desactivar un trigger en vivo - 15 SLIDES
// ==============================================================================
export const lessonDetectarMisTriggersCasosSteps: LessonStep[] = [
  { id: "tri-5-1", stepType: "billy_talks", body: "Terminemos este bloque con un examen final. Vamos a practicar la desactivación de bombas de consumo en tiempo real.", fullScreen: true,
    data: { glossary: [{ word: "Pausa de Seguridad", definition: "Técnica de detenerse físicamente 48 horas antes de una compra mayor." }, { word: "Checklist de Desactivación", definition: "Pasos mentales para validar si una compra es necesaria." }] }
  },
  { id: "tri-5-2", stepType: "influence_detective", scenario: "Es Cyber Monday. Recibes un correo de tu marca favorita con '40% DE DESCUENTO SOLO HOY'. ¿Qué haces?", options: [{id:"o1", label:"Lo abro para ver qué hay", emotion:"Tentación", isCorrect:false}, {id:"o2", label:"Borro el correo; es un trigger de escasez", emotion:"Lógica", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "tri-5-3", stepType: "info", title: "Tu Mapa de Riesgo", body: "Cada persona tiene triggers distintos. ¿Cuál es tu criptonita financiera?", fullScreen: true,
    aiInsight: "Las personas que duermen menos de 7 horas son un 30% más propensas a caer en triggers de compra impulsiva."
  },
  { id: "tri-5-4", stepType: "swipe_sorter", question: "¿Cuál es tu zona de mayor riesgo operativo?", leftBucket: {label:"Zona de Riesgo (Caigo)", color:"#ef4444"}, rightBucket: {label:"Zona de Control (Paz)", color:"#10b981"}, items: [{id:"s1", label:"Gadgets tecnológicos", correctBucket:"left"}, {id:"s2", label:"Ropa de temporada", correctBucket:"left"}, {id:"s3", label:"Libros de inversión", correctBucket:"right"}, {id:"s4", label:"Cursos de mi carrera", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "tri-5-5", stepType: "info", title: "La Táctica de las 48 Horas", body: "Si el trigger es fuerte, dile: 'Mañana te compro'. 24-48 horas después, el 90% de los deseos desaparecen.", fullScreen: true },
  { id: "tri-5-6", stepType: "true_false", statement: "Si un trigger es muy potente, lo mejor es luchar contra él con pura fuerza de voluntad.", correctValue: false, explanation: "La fuerza de voluntad se agota.", isAssessment: true, fullScreen: true },
  { id: "tri-5-7", stepType: "order", question: "Pasos para desactivar un Trigger en vivo", items: [{id:"p1", label: "Reconocer la sensación física (Taquicardia)", correctOrder: 1}, {id: "p2", label: "Beber agua / Respirar", correctOrder: 2}, {id: "p3", label: "Cerrar la pestaña o alejarse", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "tri-5-8", stepType: "match", question: "Relaciona Refuerzo con Antídoto", leftItems: [{id:"l1", label:"Envidia"}, {id:"l2", label:"Cansancio"}, {id:"l3", label:"Aburrimiento"}], rightItems: [{id:"r1", label:"Apagar pantallas"}, {id:"r2", label:"Dormir"}, {id:"r3", label:"Actividad gratuita (Parque)"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}, {leftId:"l3", rightId:"r3"}], isAssessment: true, fullScreen: true },
  { id: "tri-5-9", stepType: "blitz_challenge", question: "¿Qué regla de tiempo mata el impulso?", options: [{id:"o1", label:"30 minutos", isCorrect:false}, {id:"o2", label:"48 horas", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "tri-5-10", stepType: "blitz_challenge", question: "¿Cuál es tu arma principal ahora?", options: [{id:"o1", label:"Pagar a plazos", isCorrect:false}, {id:"o2", label:"Autonomía y Control de entorno", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "tri-5-11", stepType: "mindset_translator", question: "Promesa Final", beliefs: [{id: "b1", original: "No puedo controlar mis ganas de comprar.", healthyOptions: [{id: "h1", label: "Soy el arquitecto de mi entorno y decido sobre mis impulsos", isCorrect: true}, {id: "h2", label: "Soy un animal controlado por anuncios", isCorrect: false}]}] },
  { id: "tri-5-12", stepType: "impulse_meter", instructions: "Mantén pulsado para sellar tu capacidad de desactivación. Respira libertad pura.", item: { name: "Desactivador 3000", price: "0.00", imageUrl: "/billy-breathing.png" }, holdTime: 6, fullScreen: true },
  { id: "tri-5-13", stepType: "narrative_check", question: "¿Cuál será tu primera acción cuando sientas el próximo trigger de compra?", promptPlaceholder: "Voy a ... para no comprar.", minChars: 15, billyResponse: "¡Excelente! Ya no eres una presa, eres un Ingeniero.", fullScreen: true },
  { id: "tri-5-14", stepType: "info", title: "Alerta importante", body: "No te confíes. El sistema siempre querrá que vuelvas a gastar.", fullScreen: true,
    aiInsight: "La consciencia del trigger reduce su potencia emocional en un 50% de inmediato."
  },
  { id: "tri-5-15", stepType: "summary", title: "Bloque Terminado", body: "Has terminado el bloque de Triggers de Compra. ¡Felicidades!", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 6: El Ego en el Consumo Digital - 15 SLIDES
// ==============================================================================
export const lessonElEgoEnElConsumoDigitalSteps: LessonStep[] = [
  { id: "ego-1-1", stepType: "billy_talks", body: "En el mundo digital, el consumo no es para sobrevivir, es para alimentar una imagen. Vamos a hackear el ego que drena tu capital.", fullScreen: true,
    data: { glossary: [{ word: "Ego-Consumo", definition: "Hábito de comprar bienes o servicios digitales para proyectar éxito o pertenencia, sin utilidad real." }, { word: "Métrica de Vanidad Financiera", definition: "Indicador de éxito visible (ropa, gadgets) que no se traduce en patrimonio real." }] }
  },
  { id: "ego-1-2", stepType: "info", title: "La Trampa del 'Like'", body: "Las redes sociales han acelerado el ciclo de comparación. Compramos cosas que no necesitamos para impresionar a gente que no conocemos. Un Ingeniero BIZEN invierte en activos que NO se ven, pero SÍ se sienten en el patrimonio.", fullScreen: true,
    aiInsight: "La necesidad de estatus digital es la principal causa de sobre-endeudamiento en la Generación Z y Millennials."
  },
  { id: "ego-1-3", stepType: "impulse_meter", instructions: "Mantén pulsado y desinfla el globo del ego. Respira humildad estratégica. Siente la libertad de no tener que impresionar a nadie.", item: { name: "Reductor de Ego", price: "Libertad", imageUrl: "/billy-breathing.png" }, holdTime: 6, fullScreen: true },
  { id: "ego-1-4", stepType: "mcq", question: "¿Cuál es el costo real de comprar el nuevo iPhone 'solo para las fotos' si ya tienes uno funcional?", options: [{id:"o1", label:"El precio en la tienda", isCorrect:false}, {id:"o2", label:"El precio de la tienda + 10 años de interés compuesto perdido", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "ego-1-5", stepType: "swipe_sorter", question: "¿Es para mi Utilidad o para mi Ego?", leftBucket: {label:"Utilidad (Valor)", color:"#10b981"}, rightBucket: {label:"Ego (Vanidad)", color:"#fbbf24"}, items: [{id:"i1", label:"Suscripción a herramienta de trabajo", correctBucket:"left"}, {id:"i2", label:"Suscribirse a OF o contenido de ocio caro", correctBucket:"right"}, {id:"i3", label:"Curso de especialización", correctBucket:"left"}, {id:"i4", label:"Avatar o skin digital de $50 USD", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "ego-1-6", stepType: "info", title: "Soberanía sobre la Audiencia", body: "Si dejas de postear lo que compras, ¿seguirías comprándolo? Si la respuesta es NO, tu gasto es un costo de marketing personal ineficiente. El verdadero lujo es la discreción y el flujo libre.", fullScreen: true },
  { id: "ego-1-7", stepType: "true_false", statement: "Gastar en estatus es una inversión porque 'abre puertas'.", correctValue: false, explanation: "El estatus falso abre puertas a círculos de consumo, no a círculos de riqueza. La riqueza real busca valor, no brillo.", isAssessment:true, fullScreen: true },
  { id: "ego-1-8", stepType: "order", question: "Filtro Anti-Ego", items: [{id:"p1", label: "¿Usaré esto en privado sin contárselo a nadie?", correctOrder: 1}, {id: "p2", label: "¿Mejorará mi productividad o ingresos?", correctOrder: 2}, {id: "p3", label: "¿Puedo pagarlo sin comprometer mi fondo de paz?", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "ego-1-9", stepType: "blitz_challenge", question: "¿Qué drena el ego digital?", options: [{id:"o1", label:"Tu Capital", isCorrect:true}, {id:"o2", label:"Tu tiempo solamente", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "ego-1-10", stepType: "blitz_challenge", question: "¿Cual es el antídoto contra la comparación?", options: [{id:"o1", label:"Comprar más", isCorrect:false}, {id:"o2", label:"Tener metas propias claras", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "ego-1-11", stepType: "match", question: "Relaciona Perfil", leftItems: [{id:"l1", label:"Poseedor de Activos"}, {id:"l2", label:"Poseedor de Objetos"}], rightItems: [{id:"r1", label:"Busca Libertad"}, {id:"r2", label:"Busca Validación"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}], isAssessment: true, fullScreen: true },
  { id: "ego-1-12", stepType: "mindset_translator", question: "Refactoriza tu imagen", beliefs: [{id: "b1", original: "Tengo que verme exitoso para ser exitoso.", healthyOptions: [{id: "h1", label: "Tengo que TENER éxito real (patrimonio) para SENTIRME exitoso de verdad", isCorrect: true}, {id: "h2", label: "Las apariencias lo son todo", isCorrect: false}]}] },
  { id: "ego-1-13", stepType: "narrative_check", question: "¿Qué compra digital hiciste recientemente solo para 'sentirte parte' de algo?", promptPlaceholder: "Compré ...", minChars: 10, billyResponse: "Honestidad nivel ingeniero. El primer paso para el control.", fullScreen: true },
  { id: "ego-1-14", stepType: "info", title: "Alerta importante", body: "El ego es el impuesto de la inseguridad. Entre menos necesites validación externa, menos capital desperdiciarás en el camino.", fullScreen: true,
    aiInsight: "Las celebridades que más ostentan en redes suelen tener el patrimonio más frágil debido a sus altos costos de mantenimiento de ego."
  },
  { id: "ego-1-15", stepType: "summary", title: "Ego Hackeado", body: "Ahora tienes el control de tu imagen y de tu cartera. ¡Felicidades!", fullScreen: true },
]
