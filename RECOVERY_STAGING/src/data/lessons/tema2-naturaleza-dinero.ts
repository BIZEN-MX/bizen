import type { LessonStep } from "@/types/lessonTypes"

/**
 * Subtema 2A: Naturaleza del Dinero
 * 
 * Lessons are now expanded to 15 slides each following the UPDATED BIZEN Blueprint (2 Blitz, 2+ AI Insights).
 */

// ==============================================================================
// LECCIÓN 1: ¿Por qué el mercado paga lo que paga? (Valor de mercado) - 15 SLIDES
// ==============================================================================
export const lessonPorQueElMercadoPagaLoQuePagaSteps: LessonStep[] = [
  { id: "nat-1-1", stepType: "billy_talks", body: "El mercado no es un jefe; es un sistema de oferta y demanda que detecta la rareza de lo que ofreces. Si eres común, tu precio es bajo.", fullScreen: true,
    data: { glossary: [{ word: "Valor de Mercado", definition: "Precio que el mercado está dispuesto a pagar por una habilidad o recurso." }, { word: "Escalabilidad de Valor", definition: "Capacidad de aumentar el impacto sin aumentar linealmente el esfuerzo." }] }
  },
  { id: "nat-1-2", stepType: "info", title: "La Fórmula del Ingreso", body: "Ingreso = Valor x Escala x Rareza. Si quieres ganar más, aumenta uno de estos factores, no tus horas extras.", fullScreen: true,
    aiInsight: "El mercado no paga por el esfuerzo, paga por la dificultad de encontrarte en el mercado."
  },
  { id: "nat-1-3", stepType: "impulse_meter", instructions: "Mantén pulsado para medir tu 'rareza' actual. Siente la fuerza del valor estratégico.", item: { name: "Medidor de Rareza", price: "Valor", imageUrl: "/billy-breathing.png" }, holdTime: 5, fullScreen: true },
  { id: "nat-1-4", stepType: "mcq", question: "Si un cirujano gana mucho más que un barrendero, ¿proviene esto de que el cirujano es 'mejor persona'?", options: [{id:"o1", label:"No, proviene de la rareza técnica de su oferta", isCorrect:true}, {id:"o2", label:"No, es simple favoritismo", isCorrect:false}], isAssessment: true, fullScreen: true },
  { id: "nat-1-5", stepType: "swipe_sorter", question: "¿Es una Habilidad Rara (Valiosa) o Común (Barata)?", leftBucket: {label:"Común (Commodity)", color:"#ef4444"}, rightBucket: {label:"Rara (Ingeniería)", color:"#10b981"}, items: [{id:"i1", label:"Inglés básico", correctBucket:"left"}, {id:"i2", label:"Diseño de Algoritmos Financieros", correctBucket:"right"}, {id:"i3", label:"Captura de datos", correctBucket:"left"}, {id:"i4", label:"Gestión de Crisis de Alto Nivel", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "nat-1-6", stepType: "info", title: "El Problema del Esfuerzo", body: "Trabajar duro en algo que miles ya hacen es ineficiente. La meta no es sudar más, sino resolver problemas que otros no pueden tocar.", fullScreen: true },
  { id: "nat-1-7", stepType: "true_false", statement: "El mercado siempre paga lo justo según las necesidades del trabajador.", correctValue: false, explanation: "El mercado es indiferente a tu necesidad; solo responde a tu utilidad percibida.", isAssessment:true, fullScreen: true },
  { id: "nat-1-8", stepType: "order", question: "Escalera de valor de mercado", items: [{id:"p1", label:"Mano de Obra (Intercambio físico)", correctOrder: 1}, {id: "p2", label:"Conocimiento Especializado", correctOrder: 2}, {id: "p3", label:"Sistemas y Redes de Impacto", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "nat-1-9", stepType: "blitz_challenge", question: "¿Qué factor determina tu precio si hay mucha gente haciendo lo mismo?", options: [{id:"o1", label:"La bondad", isCorrect:false}, {id:"o2", label:"La competencia a la baja", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "nat-1-10", stepType: "blitz_challenge", question: "¿Cómo se llama cuando una habilidad es única?", options: [{id:"o1", label:"Rareza de Mercado", isCorrect:true}, {id:"o2", label:"Ser egocéntrico", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "nat-1-11", stepType: "match", question: "Relaciona Factor con Resultado", leftItems: [{id:"l1", label:"Más Rareza"}, {id:"l2", label:"Más Escala"}], rightItems: [{id:"r1", label:"Más margen (Precio alto)"}, {id:"r2", label:"Más volumen (Más personas)"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}], isAssessment: true, fullScreen: true },
  { id: "nat-1-12", stepType: "mindset_translator", question: "Refactoriza tu carrera", beliefs: [{id: "b1", original: "Tengo que trabajar 15 horas al día para ser rico.", healthyOptions: [{id: "h1", label: "Debo elevar mi rareza técnica para que mi hora valga 10 veces más", isCorrect: true}, {id: "h2", label: "El cansancio es prueba de mi valor", isCorrect: false}]}] },
  { id: "nat-1-13", stepType: "narrative_check", question: "¿Qué habilidad tienes que NADIE más en tu oficina/entorno tiene?", promptPlaceholder: "Soy el único que sabe ...", minChars: 10, billyResponse: "En ese rincón de rareza es donde empezarás a crecer de verdad.", fullScreen: true },
  { id: "nat-1-14", stepType: "info", title: "Alerta importante", body: "Si dejas de aprender, empiezas a morir financieramente. El mercado actual se actualiza cada 18 meses.", fullScreen: true,
    aiInsight: "La obsolescencia de habilidades técnicas es del 50% cada 5 años en la era de la IA."
  },
  { id: "nat-1-15", stepType: "summary", title: "Valor Dinamizado", body: "Has visto la fórmula. Siguiente: Ingreso Activo vs Pasivo.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 2: Ingreso activo vs pasivo (La realidad operativa) - 15 SLIDES
// ==============================================================================
export const lessonIngresoActivoVsPasivoLaRealidadSteps: LessonStep[] = [
  { id: "nat-2-1", stepType: "billy_talks", body: "¿Eres el motor (Activo) o eres el dueño del sistema (Pasivo)? Diferenciarlos te dará la llave de tu tiempo.", fullScreen: true,
    data: { glossary: [{ word: "Ingreso Activo", definition: "Dinero ganado mediante el intercambio directo de tiempo y esfuerzo (sueldos, honorarios)." }, { word: "Ingreso Pasivo", definition: "Dinero ganado a través de activos que no requieren presencia constante (rentas, dividendos, regalías)." }] }
  },
  { id: "nat-2-2", stepType: "info", title: "La Trampa del Intercambio", body: "El ingreso activo tiene un techo: el número de horas que puedes estar despierto. El ingreso pasivo es infinito en potencial.", fullScreen: true,
    aiInsight: "La libertad financiera ocurre cuando tus ingresos pasivos igualan a tus gastos de vida."
  },
  { id: "nat-2-3", stepType: "impulse_meter", instructions: "Mantén pulsado y visualiza tus activos trabajando mientras duermes. Siente la calma de la paz financiera.", item: { name: "Visualizador de Flujo", price: "0.00", imageUrl: "/billy-breathing.png" }, holdTime: 6, fullScreen: true },
  { id: "nat-2-4", stepType: "mcq", question: "¿Cuál es el mayor riesgo de depender 100% de ingresos activos?", options: [{id:"o1", label:"Si dejas de trabajar por enfermedad, el ingreso muere", isCorrect:true}, {id:"o2", label:"Tener demasiado tiempo libre", isCorrect:false}], isAssessment: true, fullScreen: true },
  { id: "nat-2-5", stepType: "swipe_sorter", question: "¿Es un Flujo Activo o Pasivo?", leftBucket: {label:"Activo (Tiempo)", color:"#ef4444"}, rightBucket: {label:"Pasivo (Sistemas)", color:"#10b981"}, items: [{id:"i1", label:"Sueldo de Contador", correctBucket:"left"}, {id:"i2", label:"Regalías de un libro", correctBucket:"right"}, {id:"i3", label:"Comisiones por venta directa", correctBucket:"left"}, {id:"i4", label:"Renta de departamento", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "nat-2-6", stepType: "info", title: "La Mentira del Pasivo 'Fácil'", body: "Todo ingreso pasivo requiere un esfuerzo ACTIVO masivo al principio (Escribir el libro, construir el fondo). Es esfuerzo diferido.", fullScreen: true },
  { id: "nat-2-7", stepType: "true_false", statement: "El ingreso pasivo es solo para gente que ya es millonaria.", correctValue: false, explanation: "Se construye desde el primer ahorro de un activo. Un dividendo de $1 es un ingreso pasivo.", isAssessment:true, fullScreen: true },
  { id: "nat-2-8", stepType: "order", question: "Evolución de un inversionista", items: [{id:"p1", label: "Dependencia Total (Activo)", correctOrder: 1}, {id: "p2", label: "Capitalización (Activo + Inicio Pasivo)", correctOrder: 2}, {id: "p3", label: "Libertad (Preponderancia Pasivo)", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "nat-2-9", stepType: "blitz_challenge", question: "¿Qué intercambias en el ingreso activo?", options: [{id:"o1", label:"Habilidades", isCorrect:false}, {id:"o2", label:"Tiempo (Tu Vida)", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "nat-2-10", stepType: "blitz_challenge", question: "¿Cual es la divisa del ingreso pasivo?", options: [{id:"o1", label:"El sudor", isCorrect:false}, {id:"o2", label:"La Propiedad (Activos)", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "nat-2-11", stepType: "match", question: "Relaciona Perfil con Resultado", leftItems: [{id:"l1", label:"Empleado"}, {id:"l2", label:"Inversionista"}], rightItems: [{id:"r1", label:"Vende horas"}, {id:"r2", label:"Alquila capital/ideas"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}], isAssessment: true, fullScreen: true },
  { id: "nat-2-12", stepType: "mindset_translator", question: "Refactoriza tu retiro", beliefs: [{id: "b1", original: "Tengo que trabajar 40 años para jubilarme.", healthyOptions: [{id: "h1", label: "Tengo que construir suficientes activos para no depender de la jubilación estatal", isCorrect: true}, {id: "h2", label: "El gobierno cuidará de mí", isCorrect: false}]}] },
  { id: "nat-2-13", stepType: "narrative_check", question: "¿Qué activo tienes hoy que te daría dinero aunque dejes de trabajar un mes?", promptPlaceholder: "Tengo ...", minChars: 10, billyResponse: "Si es cero, nuestro trabajo es construir el primero lo antes posible.", fullScreen: true },
  { id: "nat-2-14", stepType: "info", title: "Alerta de Ingeniería", body: "No busques dinero, busca ACTIVOS que generen dinero. Cambia tu enfoque de 'ganar sueldo' a 'acumular motores'.", fullScreen: true,
    aiInsight: "La capacidad de diferir la gratificación hoy es el motor principal de la libertad mañana."
  },
  { id: "nat-2-15", stepType: "summary", title: "Naturaleza Entendida", body: "Has visto la diferencia. Siguiente: El Triángulo del Valor.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 3: El triángulo del valor (Habilidades, Capital, Sistemas) - 15 SLIDES
// ==============================================================================
export const lessonElTrianguloDelValorSteps: LessonStep[] = [
  { id: "nat-3-1", stepType: "billy_talks", body: "Para ganar dinero necesitas tres patas: Habilidades (Tus herramientas), Capital (Tu combustible) y Sistemas (Tu motor).", fullScreen: true,
    data: { glossary: [{ word: "Sistemas", definition: "Procesos automatizados o semi-automatizados que producen resultados constantes." }, { word: "Apalancamiento", definition: "Uso de herramientas externas (deuda, gente, tecnología) para multiplicar resultados." }] }
  },
  { id: "nat-3-2", stepType: "info", title: "La pata de las Habilidades", body: "Lo primero es lo que SABES hacer. Sin habilidades, el capital se quema y el sistema nunca corre. Invierte en TÍ antes que en la bolsa.", fullScreen: true,
    aiInsight: "El ROI de una formación de alto valor puede superar el 1,000% anual en tus ingresos."
  },
  { id: "nat-3-3", stepType: "mcq", question: "¿Cuál es la pata más importante cuando empiezas desde cero?", options: [{id:"o1", label:"Capital (Pedir prestado)", isCorrect:false}, {id:"o2", label:"Habilidades de Alto Valor (HVA)", isCorrect:true}], isAssessment: true, fullScreen: true },
  { id: "nat-3-4", stepType: "swipe_sorter", question: "¿A qué pata del triángulo pertenece?", leftBucket: {label:"Habilidades", color:"#3b82f6"}, rightBucket: {label:"Sistemas/Capital", color:"#10b981"}, items: [{id:"i1", label:"Saber programar", correctBucket:"left"}, {id:"i2", label:"Un fondo de inversión", correctBucket:"right"}, {id:"i3", label:"Protocolo de ventas", correctBucket:"right"}, {id:"i4", label:"Dominio de la oratoria", correctBucket:"left"}], isAssessment: true, fullScreen: true },
  { id: "nat-3-5", stepType: "info", title: "La pata del Capital", body: "El capital es dinero que trabaja. Pero no solo es dinero: es reputación, red de contactos y marca personal.", fullScreen: true },
  { id: "nat-3-6", stepType: "true_false", statement: "Un sistema automático puede funcionar con éxito total sin que nadie tenga habilidades para mantenerlo.", correctValue: false, explanation: "Todo sistema de ingeniería requiere supervisión de alto nivel. La habilidad sigue siendo la base.", isAssessment:true, fullScreen: true },
  { id: "nat-3-7", stepType: "order", question: "Construcción del Triángulo", items: [{id:"p1", label: "Desarrollar Habilidad (Generas flujo)", correctOrder: 1}, {id: "p2", label: "Inyectar Capital (Escalas flujo)", correctOrder: 2}, {id: "p3", label: "Automatizar Sistema (Liberas tiempo)", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "nat-3-8", stepType: "blitz_challenge", question: "¿Qué sucede si solo tienes Habilidades pero no Sistemas?", options: [{id:"o1", label:"Eres libre", isCorrect:false}, {id:"o2", label:"Te vuelves esclavo de tu propia tarea (Autoempleo)", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "nat-3-9", stepType: "blitz_challenge", question: "¿Cual es el componente del triángulo que 'libera' tiempo?", options: [{id:"o1", label:"El Capital", isCorrect:false}, {id:"o2", label: "Los Sistemas", isCorrect: true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "nat-3-10", stepType: "match", question: "Relaciona el Recurso con su Pata", leftItems: [{id:"l1", label:"Tu marca personal"}, {id:"l2", label:"Inversiones ETF"}, {id:"l3", label:"Tu capacidad analítica"}], rightItems: [{id:"r1", label:"Sistemas"}, {id:"r2", label:"Capital"}, {id:"r3", label:"Habilidades"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}, {leftId:"l3", rightId:"r3"}], isAssessment: true, fullScreen: true },
  { id: "nat-3-11", stepType: "mindset_translator", question: "Refactoriza tu empresa personal", beliefs: [{id: "b1", original: "Solo necesito ganar la lotería para estar bien.", healthyOptions: [{id: "h1", label: "Necesito equilibrar mis habilidades con sistemas para que el capital no se esfume", isCorrect: true}, {id: "h2", label: "El azar es mi estrategia", isCorrect: false}]}] },
  { id: "nat-3-12", stepType: "impulse_meter", instructions: "Mantén pulsado para equilibrar tu triángulo personal. Respira estabilidad.", item: { name: "Equilibrador Tri", price: "0.00", imageUrl: "/billy-breathing.png" }, holdTime: 5, fullScreen: true },
  { id: "nat-3-13", stepType: "narrative_check", question: "¿Cuál de las 3 patas (Habilidad, Capital, Sistemas) es la más débil en tu vida hoy?", promptPlaceholder: "Mi pata débil es ...", minChars: 10, billyResponse: "Enfócate en esa. Es el cuello de botella de tu riqueza.", fullScreen: true },
  { id: "nat-3-14", stepType: "info", title: "Alerta importante", body: "Si creces en capital pero no en sistemas, el dinero te robará tu paz. Diseña primero el sistema.", fullScreen: true,
    aiInsight: "Un negocio sin sistemas es solo un trabajo con un nombre elegante."
  },
  { id: "nat-3-15", stepType: "summary", title: "Estructura Base", body: "Has visto el triángulo. Siguiente: Dinero que genera Dinero.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 4: Dinero que genera dinero (Interés compuesto) - 15 SLIDES
// ==============================================================================
export const lessonIngresoDePortafolioDineroQueGeneraDineroSteps: LessonStep[] = [
  { id: "nat-4-1", stepType: "billy_talks", body: "Einstein lo llamó la octava maravilla del mundo. Vamos a usar la ingeniería para ver por qué el Interés Compuesto es imparable.", fullScreen: true,
    data: { glossary: [{ word: "Interés Compuesto", definition: "Beneficio que se suma al capital inicial y genera nuevos intereses en el siguiente periodo." }, { word: "Costo de No-Invertir", definition: "Valor potencial perdido por dejar el dinero quieto u ocioso." }] }
  },
  { id: "nat-4-2", stepType: "info", title: "El Factor Nieve", body: "Al principio la bola de nieve es pequeña. Casi no se nota. Pero tras 15-20 años, se vuelve una avalancha que te retira.", fullScreen: true,
    aiInsight: "El mayor beneficio del interés compuesto ocurre en el último cuarto del periodo total."
  },
  { id: "nat-4-3", stepType: "mcq", question: "¿Qué recompensa es mayor según la ingeniería financiera?", options: [{id:"o1", label: "$1 Millón hoy mismo", isCorrect: false}, {id:"o2", label: "Un centavo que se duplica cada día por un mes", isCorrect: true}], isAssessment: true, fullScreen: true },
  { id: "nat-4-4", stepType: "swipe_sorter", question: "¿Qué acelera o frena el Compuesto?", leftBucket: {label:"Frenado (Pérdida)", color:"#ef4444"}, rightBucket: {label:"Acelerado (Ingeniería)", color:"#10b981"}, items: [{id:"i1", label:"Sacar los intereses", correctBucket:"left"}, {id:"i2", label:"Reinvertir dividendos", correctBucket:"right"}, {id:"i3", label:"Altas comisiones bancarias", correctBucket:"left"}, {id:"i4", label:"Aportación mensual constante", correctBucket:"right"}], isAssessment: true, fullScreen: true },
  { id: "nat-4-5", stepType: "info", title: "El Tiempo es la Variable Clave", body: "El compuesto necesita tiempo. Empezar a los 20 es mucho más fácil que a los 40. Si tienes 40, tu mejor momento para empezar es HOY.", fullScreen: true },
  { id: "nat-4-6", stepType: "true_false", statement: "Es mejor esperar a tener mucho dinero para empezar a invertir.", correctValue: false, explanation: "Esperar mata el activo más valioso: el TIEMPO. Empieza con $1 si es necesario, pero activa el motor ya.", isAssessment:true, fullScreen: true },
  { id: "nat-4-7", stepType: "order", question: "Efecto de la Reinversión", items: [{id:"p1", label: "Generar rendimiento base", correctOrder: 1}, {id: "p2", label: "Sumar rendimiento al capital", correctOrder: 2}, {id: "p3", label: "Generar rendimiento sobre el nuevo total", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "nat-4-8", stepType: "blitz_challenge", question: "¿Cuál es el enemigo principal del interés compuesto?", options: [{id:"o1", label:"Los bancos", isCorrect:false}, {id:"o2", label:"Interrumpir el ciclo (Gastar)", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "nat-4-9", stepType: "blitz_challenge", question: "¿Qué componente tiene más impacto a largo plazo?", options: [{id:"o1", label:"La Tasa de interés", isCorrect:false}, {id:"o2", label: "El Tiempo de exposición", isCorrect: true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "nat-4-10", stepType: "match", question: "Relaciona Estrategia", leftItems: [{id:"l1", label:"Aportar constante"}, {id:"l2", label:"Reinvertir todo"}], rightItems: [{id:"r1", label:"Mayor aceleración"}, {id:"r2", label:"Crecimiento geométrico"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}], isAssessment: true, fullScreen: true },
  { id: "nat-4-11", stepType: "mindset_translator", question: "Refactoriza tu paciencia", beliefs: [{id: "b1", original: "Quiero ser rico el próximo mes.", healthyOptions: [{id: "h1", label: "Diseñaré un sistema que me haga rico de forma inevitable con el tiempo", isCorrect: true}, {id: "h2", label: "La prisa es mi mejor aliada", isCorrect: false}]}] },
  { id: "nat-4-12", stepType: "impulse_meter", instructions: "Mantén pulsado y visualiza décadas de crecimiento constante. Respira paciencia estratégica.", item: { name: "Acelerador Temporal", price: "Tiempo", imageUrl: "/billy-breathing.png" }, holdTime: 6, fullScreen: true },
  { id: "nat-4-13", stepType: "narrative_check", question: "¿Cuánto dinero podrías separar HOY al mes para no tocarlo en 20 años?", promptPlaceholder: "Puedo separar $ ...", minChars: 10, billyResponse: "No importa si es poco; importa que el ciclo comience hoy.", fullScreen: true },
  { id: "nat-4-14", stepType: "info", title: "Alerta importante", body: "La inflación es el interés compuesto trabajando EN TU CONTRA. No invertir es elegir perder dinero cada día.", fullScreen: true,
    aiInsight: "Una inflación del 5% anual reduce tu poder adquisitivo a la mitad en solo 14 años."
  },
  { id: "nat-4-15", stepType: "summary", title: "Octava Maravilla", body: "Has visto el motor del tiempo. Siguiente: Evaluación final.", fullScreen: true },
]

// ==============================================================================
// LECCIÓN 5: Evaluación: ¿Cómo se ve tu flujo hoy? (Diagnóstico) - 15 SLIDES
// ==============================================================================
export const lessonEvaluacionComoSeVeTuFlujoDeEntradaHoySteps: LessonStep[] = [
  { id: "nat-5-1", stepType: "billy_talks", body: "Terminemos este bloque auditando tu motor actual. Sin mentiras, solo datos. ¿Qué tan robusto es tu flujo?", fullScreen: true,
    data: { glossary: [{ word: "Análisis de Flujo", definition: "Evaluación cuantitativa de las entradas y salidas de capital de un sistema." }, { word: "Robustez Financiera", definition: "Capacidad de un sistema de mantenerse operativo ante fallos en una fuente de ingreso." }] }
  },
  { id: "nat-5-2", stepType: "mcq", question: "Diagnóstico: Si hoy dejas de trabajar, ¿cuánto tiempo sobrevive tu sistema?", options: [{id:"o1", label:"Menos de una semana", isCorrect:false}, {id:"o2", label:"De 1 a 3 meses", isCorrect:false}, {id:"o3", label: "Más de 6 meses (Criterio BIZEN)", isCorrect: true}], isAssessment: true, fullScreen: true,
    aiInsight: "El 50% de la población mundial vive a menos de 30 días de la insolvencia total."
  },
  { id: "nat-5-3", stepType: "swipe_sorter", question: "¿Cómo calificarías tu entrada de dinero actual?", leftBucket: {label:"Frágil (1 sola vía)", color:"#ef4444"}, rightBucket: {label:"Antifrágil (Multi-vía)", color:"#10b981"}, items: [{id:"i1", label:"Sueldo como única fuente", correctBucket:"left"}, {id:"i2", label:"Varios clientes independientes", correctBucket:"right"}, {id:"i3", label:"Sueldo + Renta", correctBucket:"right"}, {id:"i4", label:"Dependencia de un solo bono anual", correctBucket:"left"}], isAssessment: true, fullScreen: true },
  { id: "nat-5-4", stepType: "info", title: "El Objetivo: Libertad Técnica", body: "No buscamos 'ser ricos' para presumir; buscamos que NADIE sea dueño de nuestras mañanas. Eso es libertad.", fullScreen: true },
  { id: "nat-5-5", stepType: "impulse_meter", instructions: "Mantén pulsado para sellar tu diagnóstico y pasar a la acción. Respira honestidad radical.", item: { name: "Sello de Diagnóstico", price: "Dato", imageUrl: "/billy-breathing.png" }, holdTime: 5, fullScreen: true },
  { id: "nat-5-6", stepType: "true_false", statement: "Mi situación financiera actual define mi potencial de ingreso a 10 años.", correctValue: false, explanation: "Tu situación actual solo define tu PUNTO DE PARTIDA. Con ingeniería, el punto de llegada es diseño puro.", isAssessment:true, fullScreen: true },
  { id: "nat-5-7", stepType: "order", question: "Prioridad Post-Diagnóstico", items: [{id:"p1", label: "Asegurar primera fuente (Activa)", correctOrder: 1}, {id: "p2", label: "Crear fondo de emergencia (Seguridad)", correctOrder: 2}, {id: "p3", label: "Primer activo pasivo (Libertad)", correctOrder: 3}], isAssessment: true, fullScreen: true },
  { id: "nat-5-8", stepType: "blitz_challenge", question: "¿Qué determina la salud de tu sistema?", options: [{id:"o1", label:"Lo que ganas", isCorrect:false}, {id:"o2", label:"La diferencia entre lo que ganas y gastas (Margen)", isCorrect:true}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "nat-5-9", stepType: "blitz_challenge", question: "¿Cual es el primer paso del cambio?", options: [{id:"o1", label:"El Diagnóstico Honesto", isCorrect:true}, {id:"o2", label:"Tener suerte", isCorrect:false}], timeLimit: 12, isAssessment: true, fullScreen: true },
  { id: "nat-5-10", stepType: "match", question: "Status Quo", leftItems: [{id:"l1", label:"Fragilidad"}, {id:"l2", label:"Solidez"}], rightItems: [{id:"r1", label:"1 Fuente, 0 Ahorro"}, {id:"r2", label:"Multi-fuente, 6 meses Ahorro"}], correctPairs: [{leftId:"l1", rightId:"r1"}, {leftId:"l2", rightId:"r2"}], isAssessment: true, fullScreen: true },
  { id: "nat-5-11", stepType: "mindset_translator", question: "Refactoriza tu futuro", beliefs: [{id: "b1", original: "Estoy atrapado en este nivel de ingresos.", healthyOptions: [{id: "h1", label: "Tengo un sistema temporalmente ineficiente que voy a optimizar", isCorrect: true}, {id: "h2", label: "Mi destino está sellado", isCorrect: false}]}] },
  { id: "nat-5-12", stepType: "billy_talks", mood: "celebrating", body: "Has terminado la Naturaleza del Dinero. Ahora vamos a construir tu Capital de Habilidades.", fullScreen: true },
  { id: "nat-5-13", stepType: "narrative_check", question: "¿Qué número de ingreso mensual te daría paz total HOY?", promptPlaceholder: "Me daría paz ganar $ ...", minChars: 10, billyResponse: "Anota ese número. Es nuestra primera meta de ingeniería.", fullScreen: true },
  { id: "nat-5-14", stepType: "info", title: "Alerta importante", body: "Los datos no mienten, pero el diagnóstico sin acción es solo entretenimiento. Vamos al siguiente bloque.", fullScreen: true,
    aiInsight: "La brecha entre tu realidad actual y tu meta es el espacio donde ocurre tu crecimiento técnico."
  },
  { id: "nat-5-15", stepType: "summary", title: "Subtema Terminado", body: "Has dominado la Naturaleza del Dinero. Siguiente bloque: Capital de Habilidades.", fullScreen: true },
]
