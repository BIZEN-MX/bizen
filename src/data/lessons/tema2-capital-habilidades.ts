import type { LessonStep } from "@/types/lessonTypes"

/**
 * Subtema 2B: Capital de Habilidades
 * 
 * Lessons are now expanded to 15 slides each following the UPDATED BIZEN Blueprint (2 Blitz, 2+ AI Insights).
 */

// ==============================================================================
// LECCIÓN 1: Habilidades de Alto Valor (HVA) - 15 SLIDES
// ==============================================================================
export const lessonHabilidadesDeAltoValorSteps: LessonStep[] = [
  { id: "cap-1-1", stepType: "billy_talks", body: "Tus manos y tu mente son tus primeras máquinas de dinero. Pero no todas las habilidades valen lo mismo. Vamos a buscar tus HVA.", fullScreen: true,
    data: { glossary: [{ word: "HVA (High Value Skill)", definition: "Habilidad técnica o social por la que el mercado paga un premium debido a su rareza e impacto." }, { word: "Afectación de Bottom-Line", definition: "Habilidad que impacta directamente en las ganancias o ahorros de una empresa." }] }
  },
  { id: "cap-1-2", stepType: "info", title: "La Regla del Mercado", body: "Si lo que haces se puede aprender en 15 minutos, el mercado te pagará el mínimo. Si toma 5 años y es crítico, tienes una **[[HVA|Habilidad que el mercado valora por su impacto directo en resultados]]**.", fullScreen: true,
    aiInsight: "Las HVA suelen pagar entre 3 y 10 veces más que las habilidades operativas básicas."
  },
  { id: "cap-1-3", stepType: "impulse_meter", instructions: "Mantén pulsado y detecta tu HVA actual. Siente el poder de tu propia herramienta.", item: { name: "Detector HVA", price: "Talento", imageUrl: "/billy-breathing.png" }, holdTime: 5, fullScreen: true },
  { id: "cap-1-4", stepType: "mcq", question: "¿Qué habilidad es más probable que sea de Alto Valor hoy?", options: [{id:"o1", label:"Saber usar Word", isCorrect:false}, {id:"o2", label:"Cerrar tratos de venta complejos", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "cap-1-5", stepType: "swipe_sorter", question: "¿Es una HVA o una Habilidad Operativa?", leftBucket: {label:"Operativa (Bajo)", color:"#94a3b8"}, rightBucket: {label:"HVA (Alto)", color:"#6366f1"}, items: [{id:"i1", label:"Atender el teléfono", correctBucket:"left"}, {id:"i2", label:"Estrategia de Ciberseguridad", correctBucket:"right"}, {id:"i3", label:"Limpieza de oficina", correctBucket:"left"}, {id:"i4", label:"Arquitectura de Software", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "cap-1-6", stepType: "info", title: "Identificando Impacto", body: "Cualquier cosa que ayude a una empresa a GANAR más o AHORRAR más es una HVA. ¿En qué lado estás tú?", fullScreen: true },
  { id: "cap-1-7", stepType: "true_false", statement: "Las HVA son solo para genios de la tecnología.", correctValue: false, explanation: "Ventas, negociación, liderazgo y oratoria son HVA humanas que cualquier puede desarrollar con disciplina.", isAssessment:true, fullScreen: true },
  { id: "cap-1-8", stepType: "order", question: "Evolución hacia la HVA", items: [{id:"p1", label: "Aprender lo básico (Ejecución)", correctOrder: 1}, {id: "p2", label: "Especializarse en un nicho crítico", correctOrder: 2}, {id: "p3", label: "Aplicar la habilidad a grandes volúmenes", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "cap-1-9", stepType: "blitz_challenge", question: "¿Qué define a una HVA?", options: [{id:"o1", label:"El esfuerzo físico", isCorrect:false}, {id:"o2", label:"Su impacto en el sistema", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "cap-1-10", stepType: "blitz_challenge", question: "¿Un cocinero normal es HVA?", options: [{id:"o1", label:"A menudo es operativo", isCorrect:true}, {id:"o2", label:"Sí, siempre", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "cap-1-11", stepType: "match", question: "Relaciona Nicho", leftItems: [{id:"l1", label:"Ventas"}, {id:"l2", label:"Legal"}, {id:"l3", label:"Técnico"}], rightItems: [{id:"r1", label:"Atraer flujo de dinero"}, {id:"r2", label:"Evitar fugas de dinero"}, {id:"r3", label:"Construir motores de dinero"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}, {leftId:"l3", rightId:"r3"}], isAssessment: true, fullScreen: true },
  { id: "cap-1-12", stepType: "mindset_translator", question: "Refactoriza tu valor móvil", beliefs: [{id: "b1", original: "No sé hacer nada especial.", healthyOptions: [{id: "h1", label: "Mi meta es dedicar 1,000 horas a desarrollar una HVA que el mercado respete", isCorrect: true}, {id: "h2", label: "Mejor busco otro empleo similar", isCorrect: false}]}] },
  { id: "cap-1-13", stepType: "narrative_check", question: "¿Cuál va a ser tu HVA definitiva?", promptPlaceholder: "Me volveré un experto en ...", minChars: 10, billyResponse: "Enfócate. Una sola HVA bien dominada te hará libre.", fullScreen: true },
  { id: "cap-1-14", stepType: "info", title: "Alerta importante", body: "No serás libre si sigues haciendo lo que cualquiera puede aprender en una tarde. Incómodamente, debes ser difícil de reemplazar.", fullScreen: true,
    aiInsight: "La IA está automatizando primero las habilidades operativas; las HVA estratégicas son tu seguro de vida."
  },
  { id: "cap-1-15", stepType: "summary", title: "Capital Detectado", body: "Sabes qué buscar. Siguiente: Escalabilidad.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 2: Escalabilidad (Tu tiempo tiene techo) - 15 SLIDES
// ==============================================================================
export const lessonEscalabilidadTuTiempoTieneTechoSteps: LessonStep[] = [
  { id: "cap-2-1", stepType: "billy_talks", body: "Si solo ganas dinero cuando ESTÁS PRESENTE, tienes un problema de ingeniería. Vamos a buscar la ESCALABILIDAD.", fullScreen: true,
    data: { glossary: [{ word: "Escalabilidad", definition: "Propiedad de un sistema para manejar un crecimiento continuo de trabajo sin fallos de rendimiento o costos lineales." }, { word: "Desacoplo", definition: "Separar el tiempo invertido del resultado obtenido." }] }
  },
  { id: "cap-2-2", stepType: "info", title: "El límite de 24 horas", body: "Incluso el mejor médico tiene 24 horas. Si opera manos a manos, está acoplado. Si diseña un curso de cirugía, está **[[Escalado|Impactar a miles de personas simultáneamente sin presencia física]]**.", fullScreen: true,
    aiInsight: "Un producto digital no tiene costo marginal de reproducción; eso es escalabilidad pura."
  },
  { id: "cap-2-3", stepType: "impulse_meter", instructions: "Mantén pulsado para 'estirar' tu tiempo. Visualiza el impacto masivo.", item: { name: "Elástico Temporal", price: "Escala", imageUrl: "/billy-breathing.png" }, holdTime: 6, fullScreen: true },
  { id: "cap-2-4", stepType: "mcq", question: "¿Qué negocio es más ESCALABLE?", options: [{id:"o1", label:"Un restaurante de lujo (Local)", isCorrect:false}, {id:"o2", label:"Una APP de recetas (Global)", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "cap-2-5", stepType: "swipe_sorter", question: "¿Es una Actividad Acoplada o Escalada?", leftBucket: {label:"Acoplada (Lenta)", color:"#ef4444"}, rightBucket: {label:"Escalada (Veloz)", color:"#10b981"}, items: [{id:"i1", label:"Sesión de terapia 1 a 1", correctBucket:"left"}, {id:"i2", label:"Webinar grabado", correctBucket:"right"}, {id:"i3", label:"Clase en salón físico", correctBucket:"left"}, {id:"i4", label:"Ebook de finanzas", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "cap-2-6", stepType: "info", title: "Efecto de Red", body: "La escala no solo es vender más, es que cada nuevo usuario haga el sistema más fuerte. Eso es verdadera ingeniería de redes.", fullScreen: true },
  { id: "cap-2-7", stepType: "true_false", statement: "Todo trabajo de alta responsabilidad es escalable por naturaleza.", correctValue: false, explanation: "Un CEO puede tener mucha responsabilidad pero su tiempo sigue siendo finito. La escalabilidad es un DISEÑO.", isAssessment:true, fullScreen: true },
  { id: "cap-2-8", stepType: "order", question: "Cómo escalar una habilidad", items: [{id:"p1", label: "Dominio técnico de la HVA", correctOrder: 1}, {id: "p2", label: "Empaquetado (Software/Video/Libro)", correctOrder: 2}, {id: "p3", label: "Distribución masiva", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "cap-2-9", stepType: "blitz_challenge", question: "¿Qué factor mata el acoplamiento?", options: [{id:"o1", label:"El Código y el Contenido", isCorrect:true}, {id:"o2", label:"El Esfuerzo Físico", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "cap-2-10", stepType: "blitz_challenge", question: "¿Un buen sueldo es escalable?", options: [{id:"o1", label:"Casi nunca (Techo de tiempo)", isCorrect:true}, {id:"o2", label:"Sí, ilimitadamente", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "cap-2-11", stepType: "match", question: "Relaciona Perfil con Modelo", leftItems: [{id:"l1", label:"Maestro"}, {id:"l2", label:"Plataforma Virtual"}], rightItems: [{id:"r1", label:"Vende 1 hora por vez"}, {id:"r2", label:"Vende 1 hora a un millón"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}], isAssessment: true, fullScreen: true },
  { id: "cap-2-12", stepType: "mindset_translator", question: "Refactoriza tu tiempo", beliefs: [{id: "b1", original: "Tengo que estar cansado para sentir que gané dinero.", healthyOptions: [{id: "h1", label: "Mis sistemas deben generar valor mientras yo me recupero", isCorrect: true}, {id: "h2", label: "El agotamiento es mi trofeo", isCorrect: false}]}] },
  { id: "cap-2-13", stepType: "narrative_check", question: "¿Qué parte de tu trabajo de hoy podrías grabar o automatizar para no repetirlo nunca más?", promptPlaceholder: "Grabaría mi ...", minChars: 10, billyResponse: "Hazlo. Esa pequeña acción es la semilla de tu escala.", fullScreen: true },
  { id: "cap-2-14", stepType: "info", title: "Alerta importante", body: "Si no aprendes a escalar, estarás siempre a un mes de distancia de la quiebra personal. La escala es tu paracaídas de libertad.", fullScreen: true,
    aiInsight: "Aprender a delegar o automatizar es la meta última de todo profesional BIZEN."
  },
  { id: "cap-2-15", stepType: "summary", title: "Escala Diseñada", body: "Ya sabes cómo romper el techo. Siguiente: ROI Educativo.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 3: ROI de tu educación (Inversión en uno mismo) - 15 SLIDES
// ==============================================================================
export const lessonRoiDeTuEducacionSteps: LessonStep[] = [
  { id: "cap-3-1", stepType: "billy_talks", body: "No toda educación es igual. Ver una serie no es educarse. Aprender una técnica de ventas que te dé $1,000 extra al mes es una inversión masiva.", fullScreen: true,
    data: { glossary: [{ word: "ROI (Return On Investment)", definition: "Relación entre el beneficio obtenido y la inversión realizada." }, { word: "Costo de Oportunidad Educativo", definition: "Tiempo gastado en educación inútil que pudiste usar en algo valioso." }] }
  },
  { id: "cap-3-2", stepType: "info", title: "El Activo más Rentable", body: "En el S&P 500 ganas el 10% anual. En TÍ mismo, aprendiendo una HVA, puedes ganar un 300% de aumento de sueldo en un año. ¿Dónde pones el dinero?", fullScreen: true,
    aiInsight: "La educación técnica especializada es el único activo que no te pueden quitar, ni siquiera en una crisis."
  },
  { id: "cap-3-3", stepType: "mcq", question: "Inviertes $500 en un curso y eso te genera $100 extra al mes FIJOS. ¿Cual es tu ROI anual?", options: [{id:"o1", label: "20% (Lento)", isCorrect: false}, {id:"o2", label: "240% (Ingeniería pura)", isCorrect: true}], isAssessment: true, fullScreen: true },
  { id: "cap-3-4", stepType: "swipe_sorter", question: "¿Es Entretenimiento o Inversión en HVA?", leftBucket: {label:"Entretenimiento (Gasto)", color:"#ef4444"}, rightBucket: {label:"Inversión (ROI)", color:"#10b981"}, items: [{id:"i1", label:"Suscripción a Netflix", correctBucket:"left"}, {id:"i2", label:"Taller de Oratoria", correctBucket:"right"}, {id:"i3", label:"Video de gatitos", correctBucket:"left"}, {id:"i4", label:"Certificación en Cloud", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "cap-3-5", stepType: "info", title: "La Trampa del Título Sin Valor", body: "Tener un diploma no garantiza nada si el mercado no necesita ese cartón. Busca utilidad, no estatus académico.", fullScreen: true },
  { id: "cap-3-6", stepType: "true_false", statement: "Ir a la universidad es hoy la única vía de éxito financiero asegurado.", correctValue: false, explanation: "Es UNA vía, pero hoy el conocimiento libre y especializado tiene un ROI más rápido en muchos nichos.", isAssessment:true, fullScreen: true },
  { id: "cap-3-7", stepType: "order", question: "Evaluación de una Inversión Educativa", items: [{id:"p1", label: "Verificar demanda de la habilidad", correctOrder: 1}, {id: "p2", label: "Calidad de quien enseña (Resultados)", correctOrder: 2}, {id: "p3", label: "Ejecución inmediata de lo aprendido", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "cap-3-8", stepType: "blitz_challenge", question: "¿Qué educación tiene más ROI?", options: [{id:"o1", label:"La teórica general", isCorrect:false}, {id:"o2", label:"La técnica directa invocable", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "cap-3-9", stepType: "blitz_challenge", question: "¿El costo de un curso es?", options: [{id:"o1", label:"Un Gasto", isCorrect:false}, {id:"o2", label: "Capital de Trabajo", isCorrect: true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "cap-3-10", stepType: "match", question: "Relaciona el Tiempo", leftItems: [{id:"l1", label:"1 hora de Red Social"}, {id:"l2", label:"1 hora de Estudio HVA"}], rightItems: [{id:"r1", label:"Dopamina gratis, bolsillo vacío"}, {id:"r2", label:"Incomodidad hoy, riqueza mañana"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}], isAssessment: true, fullScreen: true },
  { id: "cap-3-11", stepType: "mindset_translator", question: "Refactoriza tu billetera", beliefs: [{id: "b1", original: "No tengo dinero para cursos.", healthyOptions: [{id: "h1", label: "No tengo dinero porque no he invertido en las habilidades que lo generan", isCorrect: true}, {id: "h2", label: "Ahorrar en educación me hará rico", isCorrect: false}]}] },
  { id: "cap-3-12", stepType: "impulse_meter", instructions: "Mantén pulsado y comprométete a estudiar 1 hora de HVA hoy. Respira poder intelectual.", item: { name: "Motor Cerebral", price: "Fuerza", imageUrl: "/billy-breathing.png" }, holdTime: 5, fullScreen: true },
  { id: "cap-3-13", stepType: "narrative_check", question: "¿Qué HVA te daría el mayor retorno si la aprendieras hoy mismo?", promptPlaceholder: "Me cambiaría la vida saber ...", minChars: 15, billyResponse: "Búscala ahora. El tiempo corre.", fullScreen: true },
  { id: "cap-3-14", stepType: "info", title: "Alerta importante", body: "Si dejas de estudiar, te vuelves irrelevante. En el mundo de la IA, el 'Aprender a Aprender' es tu mayor HVA.", fullScreen: true,
    aiInsight: "La formación continua es el mantenimiento obligatorio de tu motor financiero."
  },
  { id: "cap-3-15", stepType: "summary", title: "Inversión Sellada", body: "Has visto el ROI. Siguiente: Soft Skills.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 4: Soft Skills como multiplicador (La cara humana) - 15 SLIDES
// ==============================================================================
export const lessonSoftSkillsMultiplicadorIngresosSteps: LessonStep[] = [
  { id: "cap-4-1", stepType: "billy_talks", body: "Puedes ser el mejor programador o doctor, pero si no sabes hablar, negociar o liderar, tienes un multiplicador de x0.1.", fullScreen: true,
    data: { glossary: [{ word: "Soft Skills", definition: "Habilidades interpersonales y de comunicación que determinan cómo interactúas en un entorno profesional." }, { word: "Multiplicador de Valor", definition: "Habilidad que potencia los resultados de todas las demás habilidades técnicas." }] }
  },
  { id: "cap-4-2", stepType: "info", title: "El Factor Negociación", body: "Ganar $5,000 extra al año no solo es trabajar más; es saber PEDIRLO en una reunión de 15 minutos. Esa es una habilidad de ingeniería social.", fullScreen: true,
    aiInsight: "Las personas con altas habilidades de comunicación ganan, en promedio, un 20% más que sus pares técnicos iguales."
  },
  { id: "cap-4-3", stepType: "mcq", question: "Tienes una HVA técnica brillante pero odias hablar en público. ¿Cuál es tu limitante técnico?", options: [{id:"o1", label: "Mi Falta de Escala (No puedo influir a muchos)", isCorrect: true}, {id:"o2", label: "Falta de inteligencia", isCorrect: false}], isAssessment: true, fullScreen: true },
  { id: "cap-4-4", stepType: "swipe_sorter", question: "¿Es una Soft Skill o una Hard Skill?", leftBucket: {label:"Soft (Humana)", color:"#ef4444"}, rightBucket: {label:"Hard (Técnica)", color:"#3b82f6"}, items: [{id:"i1", label:"Resolución de Conflictos", correctBucket:"left"}, {id:"i2", label:"Análisis SQL", correctBucket:"right"}, {id:"i3", label:"Empatía Estratégica", correctBucket:"left"}, {id:"i4", label:"Configuración de Redes", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "cap-4-5", stepType: "info", title: "Liderazgo: Escala a través de otros", body: "Cuando lideras, tus manos ya no son 2; son 20, 200 o 2,000. El liderazgo es el mayor sistema de amplificación del mundo.", fullScreen: true },
  { id: "cap-4-6", stepType: "true_false", statement: "Las Soft Skills son innatas, no se pueden aprender si naciste tímido.", correctValue: false, explanation: "La comunicación es un protocolo. Como cualquier código, se puede aprender, depurar y mejorar.", isAssessment:true, fullScreen: true },
  { id: "cap-4-7", stepType: "order", question: "Pasos de una Negociación BIZEN", items: [{id:"p1", label: "Escucha Activa (Detectar necesidades)", correctOrder: 1}, {id: "p2", label: "Anclaje de Valor (Mostrar impacto)", correctOrder: 2}, {id: "p3", label: "Cierre de Beneficio Mutuo", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "cap-4-8", stepType: "blitz_challenge", question: "¿Qué soft skill es necesaria para vender?", options: [{id:"o1", label:"La Persuación Ética", isCorrect:true}, {id:"o2", label:"Saber matemáticas", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "cap-4-9", stepType: "blitz_challenge", question: "¿Sirve ser brillante si nadie te conoce?", options: [{id:"o1", label:"Invisible = Valor 0", isCorrect:true}, {id:"o2", label:"Sí, la calidad se nota sola", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "cap-4-10", stepType: "match", question: "Relaciona Skill con Resultado", leftItems: [{id:"l1", label:"Negociación"}, {id:"l2", label:"Liderazgo"}], rightItems: [{id:"r1", label:"Mejor margen propio"}, {id:"r2", label:"Multiplicación por otros"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}], isAssessment: true, fullScreen: true },
  { id: "cap-4-11", stepType: "mindset_translator", question: "Refactoriza tu silencio", beliefs: [{id: "b1", original: "Pena me da pedir un aumento.", healthyOptions: [{id: "h1", label: "Presentaré los datos de mi impacto positivo para recalibrar mi precio", isCorrect: true}, {id: "h2", label: "Esperaré a que me noten", isCorrect: false}]}] },
  { id: "cap-4-12", stepType: "impulse_meter", instructions: "Mantén pulsado para activar tu confianza social. Respira carisma técnico.", item: { name: "Voz de Mando", price: "0.00", imageUrl: "/billy-breathing.png" }, holdTime: 5, fullScreen: true },
  { id: "cap-4-13", stepType: "narrative_check", question: "¿Cuál es la conversación incómoda que sabes que necesitas tener para ganar más?", promptPlaceholder: "Tengo que hablar con ... sobre ...", minChars: 15, billyResponse: "Hazlo. Detrás de la incomodidad está tu libertad.", fullScreen: true },
  { id: "cap-4-14", stepType: "info", title: "Alerta de Ingeniería", body: "Las máquinas harán lo técnico. Lo humano (negociar, empatizar, liderar) será lo único que la IA no pueda devaluar.", fullScreen: true,
    aiInsight: "Las habilidades sociales son el último refugio de la ventaja competitiva humana."
  },
  { id: "cap-4-15", stepType: "summary", title: "Multiplicador Activo", body: "Has visto el poder social. Siguiente: Operativo a Estratégico.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 5: Diseño de carrera (Operativo a Estratégico) - 15 SLIDES
// ==============================================================================
export const lessonDisenoDeCarreraOperativoAEstrategicoSteps: LessonStep[] = [
  { id: "cap-5-1", stepType: "billy_talks", body: "Toda carrera tiene tres fases: Ejecutor (Tus manos), Manager (Tus ojos) y Estratega (Tu visión). ¿En qué piso estás hoy?", fullScreen: true,
    data: { glossary: [{ word: "Fase Estratégica", definition: "Etapa profesional donde el valor se genera por la toma de decisiones y la visión, no por la ejecución física." }, { word: "Costo de Estancamiento", definition: "Pérdida de ingresos por permanecer en la fase operativa más tiempo del necesario." }] }
  },
  { id: "cap-5-2", stepType: "info", title: "El Ascensor del Ingreso", body: "Un ejecutor gana x1. Un estratega gana x100. Debes diseñar tu salida de la 'operación' para entrar en la 'decisión'.", fullScreen: true,
    aiInsight: "La brecha salarial se dispara cuando pasas de 'cómo hacer algo' a 'qué es lo que hay que hacer'."
  },
  { id: "cap-5-3", stepType: "impulse_meter", instructions: "Mantén pulsado y suelta el teclado. Imagina liderar la visión completa. Respira altura.", item: { name: "Visión de Halcón", price: "Libre", imageUrl: "/billy-breathing.png" }, holdTime: 6, fullScreen: true },
  { id: "cap-5-4", stepType: "mcq", question: "¿Qué actividad es propia de la FASE ESTRATÉGICA?", options: [{id:"o1", label:"Responder correos rápido", isCorrect:false}, {id:"o2", label:"Decidir entrar en un nuevo mercado con datos", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "cap-5-5", stepType: "swipe_sorter", question: "¿Es una Tarea Operativa o Estratégica?", leftBucket: {label:"Operativa (Hacer)", color:"#94a3b8"}, rightBucket: {label:"Estratégica (Pensar)", color:"#6366f1"}, items: [{id:"i1", label:"Llenar hojas de cálculo", correctBucket:"left"}, {id:"i2", label:"Diseñar modelo de negocio", correctBucket:"right"}, {id:"i3", label:"Arreglar el código buggear", correctBucket:"left"}, {id:"i4", label:"Elegir a los socios del año", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "cap-5-6", stepType: "info", title: "Delegar o Morir", body: "Para subir al piso estratégico, debes soltar las tareas operativas. Si sigues haciendo café, no puedes diseñar la cafetería.", fullScreen: true },
  { id: "cap-5-7", stepType: "true_false", statement: "Un gran ejecutor será automáticamente un gran estratega cuando lo promuevan.", correctValue: false, explanation: "Son habilidades distintas (o incluso opuestas). Requieren entrenamiento diferente.", isAssessment:true, fullScreen: true },
  { id: "cap-5-8", stepType: "order", question: "Evolución de Carrera BIZEN", items: [{id:"p1", label: "Ejecutor Brillante (Consistencia)", correctOrder: 1}, {id: "p2", label: "Optimizador de Procesos (Manager)", correctOrder: 2}, {id: "p3", label: "Arquitecto de Valor (Estratega)", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "cap-5-9", stepType: "blitz_challenge", question: "¿Cuál es el riesgo de quedarse en el piso de Ejecución?", options: [{id:"o1", label:"La Automatización", isCorrect:true}, {id:"o2", label:"El Aburrimiento", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "cap-5-10", stepType: "blitz_challenge", question: "¿Qué necesita un estratega?", options: [{id:"o1", label:"Mucho café", isCorrect:false}, {id:"o2", label:"Capacidad de Síntesis y Visión", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "cap-5-11", stepType: "match", question: "Relaciona Nivel", leftItems: [{id:"l1", label:"Nivel Bajo"}, {id:"l2", label:"Nivel Alto"}], rightItems: [{id:"r1", label:"Uso de fuerza/tiempo"}, {id:"r2", label:"Uso de sistemas/capital"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}], isAssessment: true, fullScreen: true },
  { id: "cap-5-12", stepType: "mindset_translator", question: "Refactoriza tu puesto", beliefs: [{id: "b1", original: "Solo yo puedo hacer esto bien.", healthyOptions: [{id: "h1", label: "Entrenaré a otros o crearé un sistema para que esto ocurra sin mí", isCorrect: true}, {id: "h2", label: "Soy indispensable y eso me hace rico", isCorrect: false}]}] },
  { id: "cap-5-13", stepType: "narrative_check", question: "¿Qué porcentaje de tu día pasas 'HACIENDO' vs 'PENSANDO'?", promptPlaceholder: "Paso un ... % haciendo.", minChars: 10, billyResponse: "Aumenta el tiempo de pensamiento técnico. Ahí está el dinero.", fullScreen: true },
  { id: "cap-5-14", stepType: "info", title: "Alerta importante", body: "Felicidades. Has completado el bloque de Capital de Habilidades. Tu cerebro está oficialmente actualizado.", fullScreen: true,
    aiInsight: "El diseño de carrera es una meta-habilidad que orquestará todas tus demás fuentes de ingreso."
  },
  { id: "cap-5-15", stepType: "summary", title: "Subtema Concluido", body: "Has dominado el Capital de Habilidades. Siguiente bloque: Optimización de Riqueza.", fullScreen: true },
]
