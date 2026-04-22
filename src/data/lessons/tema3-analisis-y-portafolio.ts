import type { LessonStep } from "@/types/lessonTypes"

// Helper to generate a standardized 15-step lesson
const create15StepLesson = (
  slug: string, 
  title: string, 
  introBody: string, 
  conceptBody: string, 
  summaryBody: string,
  glossary: { word: string, definition: string }[],
  mcq: { question: string, options: { id: string, label: string, isCorrect: boolean, explanation?: string }[] },
  swipe: { question: string, left: string, right: string, items: { id: string, label: string, correctBucket: "left" | "right" }[] }
): LessonStep[] => [
  { id: `${slug}-1`, stepType: "billy_talks", title, body: introBody, data: { glossary } },
  { id: `${slug}-2`, stepType: "info", title: "El Concepto Clave", aiInsight: "Este es el cimiento de tu libertad.", body: conceptBody, imageUrl: `/lessons/${slug}-img1.png` },
  { id: `${slug}-3`, stepType: "impulse_meter", item: { name: title, price: "Decisión Crítica" }, instructions: "¿Cómo reaccionas ante la presión?", data: { minLabel: "Lógica BIZEN", maxLabel: "Emoción pura", targetValue: 1 } },
  { id: `${slug}-4`, stepType: "mcq", question: mcq.question, options: mcq.options },
  { id: `${slug}-5`, stepType: "info", title: "Profundizando", body: "La maestría financiera requiere repetición y comprensión profunda.", imageUrl: `/lessons/${slug}-img2.png` },
  { id: `${slug}-6`, stepType: "swipe_sorter", question: swipe.question, leftBucket: { label: swipe.left, color: "#3b82f6" }, rightBucket: { label: swipe.right, color: "#ef4444" }, items: swipe.items },
  { id: `${slug}-7`, stepType: "true_false", statement: "La disciplina vence al talento en el mercado financiero.", correctValue: true, explanation: "Correcto. El mercado premia la constancia." },
  { id: `${slug}-8`, stepType: "blitz_challenge", question: "¿Cuál es tu mejor aliado?", options: [{ id: "1", label: "Suerte", isCorrect: false }, { id: "2", label: "Tiempo", isCorrect: true }, { id: "3", label: "Noticias", isCorrect: false }], timeLimit: 10 },
  { id: `${slug}-9`, stepType: "order", question: "Pasos del Proceso", items: [{ id: "1", label: "Aprender", correctOrder: 1 }, { id: "2", label: "Planear", correctOrder: 2 }, { id: "3", label: "Ejecutar", correctOrder: 3 }, { id: "4", label: "Esperar", correctOrder: 4 }] },
  { id: `${slug}-10`, stepType: "match", question: "Relaciona conceptos", leftItems: [{ id: "l1", label: "Riesgo" }, { id: "l2", label: "Rendimiento" }], rightItems: [{ id: "r1", label: "Incertidumbre" }, { id: "r2", label: "Premio" }], correctPairs: [{ leftId: "l1", rightId: "r1" }, { leftId: "l2", rightId: "r2" }] },
  { id: `${slug}-11`, stepType: "mindset_translator", question: "Traduce tu miedo", beliefs: [{ id: "b1", original: "Es muy difícil.", healthyOptions: [{ id: "h1", label: "Es un proceso que puedo dominar paso a paso.", isCorrect: true }] }] },
  { id: `${slug}-12`, stepType: "blitz_challenge", question: "Misión: ¿Qué es BIZEN?", options: [{ id: "1", label: "Una app", isCorrect: false }, { id: "2", label: "Tu sistema de ingeniería financiera", isCorrect: true }], timeLimit: 8 },
  { id: `${slug}-13`, stepType: "narrative_check", question: "Tu compromiso", body: "¿Cómo aplicarás esto hoy mismo en tu vida?", placeholder: "Lo aplicaré...", minChars: 20 },
  { id: `${slug}-14`, stepType: "summary", title: "Resumen de Poder", body: summaryBody, aiInsight: "No te detengas ahora, el conocimiento es libertad." },
  { id: `${slug}-15`, stepType: "billy_talks", body: "¡Excelente avance! Vamos a la siguiente lección.", mood: "happy" }
]

// ---------------------------------------------------------------------------
// LECCIÓN 38: ¿Qué es la inversión a largo plazo?
// Slug: "estrategia-largo-plazo"
// ---------------------------------------------------------------------------
export const lessonEstrategiaLargoPlazoSteps = create15StepLesson(
  "estrategia-largo-plazo",
  "La Maratón de la Riqueza",
  "Invertir no es una carrera de 100 metros; es una maratón de 30 años. Vamos a aprender la estrategia de los titanes: Buy & Hold.",
  "El tiempo borra el riesgo. A corto plazo la bolsa es ruido; a largo plazo es una máquina de crecimiento exponencial.",
  "Has captado el secreto del 1%. La riqueza se construye permitiendo que el tiempo trabaje sin interrupciones.",
  [{ word: "Buy & Hold", definition: "Comprar y mantener activos de calidad indefinidamente." }],
  { question: "¿Cuál es el beneficio principal?", options: [{ id: "1", label: "Dinero rápido", isCorrect: false }, { id: "2", label: "Interés compuesto y menos comisiones", isCorrect: true }] },
  { question: "Identifica la acción", left: "Inversor BIZEN", right: "Especulador", items: [{ id: "1", label: "Comprar y esperar", correctBucket: "left" }, { id: "2", label: "Vender por pánico", correctBucket: "right" }] }
);

// ---------------------------------------------------------------------------
// LECCIÓN 39: ¿Qué es el trading básico?
// Slug: "trading-basico"
// ---------------------------------------------------------------------------
export const lessonTradingBasicoSteps = create15StepLesson(
  "trading-basico",
  "El Espejismo del Trading",
  "El trading se vende como lujo, pero la estadística dice que el 95% falla. Vamos a ver por qué.",
  "El trading es un trabajo de alto estrés, no una inversión. Compites contra máquinas de Wall Street.",
  "Has aprendido a distinguir entre ingeniería y azar. El trading es para brokers; la inversión es para ti.",
  [{ word: "Day Trading", definition: "Operar dentro del mismo día." }],
  { question: "¿Por qué falla la mayoría?", options: [{ id: "1", label: "Falta de suerte", isCorrect: false }, { id: "2", label: "Emociones, comisiones y competencia técnica", isCorrect: true }] },
  { question: "Clasifica la actividad", left: "Inversión", right: "Trading", items: [{ id: "1", label: "Meta a 20 años", correctBucket: "left" }, { id: "2", label: "Venta en 5 minutos", correctBucket: "right" }] }
);

// ---------------------------------------------------------------------------
// LECCIÓN 40: ¿Inversión periódica?
// Slug: "inversion-periodica"
// ---------------------------------------------------------------------------
export const lessonInversionPeriodicaSteps = create15StepLesson(
  "inversion-periodica",
  "El Piloto Automático (DCA)",
  "Nadie sabe cuándo el mercado subirá. Pero con DCA, no necesitas saberlo. Vamos a automatizar tu éxito.",
  "El DCA anula el miedo. Compras más cuando está barato y menos cuando está caro, promediando tu éxito.",
  "Has integrado el hábito más potente. Eres un engranaje constante que acumula riqueza mientras el mundo duerme.",
  [{ word: "DCA", definition: "Dollar Cost Averaging: Invertir lo mismo siempre." }],
  { question: "¿Cuál es la ventaja del DCA?", options: [{ id: "1", label: "Dobla ganancias", isCorrect: false }, { id: "2", label: "Elimina la parálisis por análisis", isCorrect: true }] },
  { question: "Estrategia", left: "DCA", right: "Adivinar", items: [{ id: "1", label: "Cada 15 de mes", correctBucket: "left" }, { id: "2", label: "Esperar la caída perfecta", correctBucket: "right" }] }
);

// ---------------------------------------------------------------------------
// LECCIÓN 41: ¿Qué son las gráficas?
// Slug: "graficas-que-son"
// ---------------------------------------------------------------------------
export const lessonGraficasQueSonSteps = create15StepLesson(
  "graficas-que-son",
  "El Mapa del Dinero",
  "Las gráficas son la biografía del valor. Vamos a aprender a leer el pulso de la economía.",
  "Precio en el eje Y, Tiempo en el eje X. Ver la foto completa nos da perspectiva histórica y calma.",
  "Ahora ves el mercado como un ingeniero. Las gráficas son tu brújula, no tu bola de cristal.",
  [{ word: "Eje Y", definition: "Representa el precio del activo." }],
  { question: "¿Para qué sirve una gráfica?", options: [{ id: "1", label: "Ver colores", isCorrect: false }, { id: "2", label: "Entender la tendencia histórica", isCorrect: true }] },
  { question: "Elemento", left: "Tiempo", right: "Precio", items: [{ id: "1", label: "Eje X", correctBucket: "left" }, { id: "2", label: "Eje Y", correctBucket: "right" }] }
);

// ---------------------------------------------------------------------------
// LECCIÓN 42: ¿Cómo identificar tendencias?
// Slug: "tendencias-mercado"
// ---------------------------------------------------------------------------
export const lessonTendenciasMercadoSteps = create15StepLesson(
  "tendencias-mercado",
  "Toros y Osos",
  "El mercado se mueve en ciclos. Vamos a identificar las señales de salud de la economía mundial.",
  "Bull Market es optimismo; Bear Market es oportunidad. Identificar la tendencia es clave para la calma.",
  "Eres un navegante de ciclos. No importa la estación; tú tienes un plan para cosechar riqueza.",
  [{ word: "Bear Market", definition: "Periodo de caída sostenida del mercado." }],
  { question: "¿Qué es un Bull Market?", options: [{ id: "1", label: "Muchos animales", isCorrect: false }, { id: "2", label: "Tendencia alcista y crecimiento", isCorrect: true }] },
  { question: "Tendencia", left: "Optimismo", right: "Miedo", items: [{ id: "1", label: "Bull Market", correctBucket: "left" }, { id: "2", label: "Bear Market", correctBucket: "right" }] }
);

// ---------------------------------------------------------------------------
// LECCIÓN 43: Noticias Financieras
// Slug: "noticias-financieras"
// ---------------------------------------------------------------------------
export const lessonNoticiasFinancierasSteps = create15StepLesson(
  "noticias-financieras",
  "Filtrando el Ruido",
  "El 90% de las noticias son ruido para asustarte. Vamos a blindar tu mente contra el sensacionalismo.",
  "Las noticias venden clicks, no riqueza. Tu plan de inversión debe ser inmune a los titulares de hoy.",
  "Ahora tienes un filtro profesional. La mejor noticia para un inversor es seguir el plan en silencio.",
  [{ word: "Ruido Táctico", definition: "Información irrelevante que genera ansiedad." }],
  { question: "¿Cuál es el objetivo de las noticias?", options: [{ id: "1", label: "Darte dinero", isCorrect: false }, { id: "2", label: "Atención y clics mediante el miedo", isCorrect: true }] },
  { question: "Información", left: "Señal (Datos)", right: "Ruido (Opinión)", items: [{ id: "1", label: "Reporte de ganancias", correctBucket: "left" }, { id: "2", label: "Titular apocalíptico", correctBucket: "right" }] }
);

// ---------------------------------------------------------------------------
// LECCIÓN 44: ¿Qué son las gráficas de líneas?
// Slug: "graficas-lineas"
// ---------------------------------------------------------------------------
export const lessonGraficasLineasSteps = create15StepLesson(
  "graficas-lineas",
  "Simplicidad y Claridad",
  "La gráfica de líneas es la representación más pura del crecimiento. Sin distracciones innecesarias.",
  "Une los puntos de cierre. Es ideal para ver la 'foto grande' de un activo en periodos largos.",
  "Has dominado la visualización básica. La línea sube porque el motor de la humanidad es el progreso.",
  [{ word: "Gráfica de Líneas", definition: "Visualización que une precios finales con una línea continua." }],
  { question: "¿Cuándo usar líneas?", options: [{ id: "1", label: "Para trading rápido", isCorrect: false }, { id: "2", label: "Para ver tendencias de largo plazo", isCorrect: true }] },
  { question: "Valor", left: "Tendencia", right: "Detalle", items: [{ id: "1", label: "Líneas", correctBucket: "left" }, { id: "2", label: "Velas", correctBucket: "right" }] }
);

// ---------------------------------------------------------------------------
// LECCIÓN 45: Velas Japonesas
// Slug: "velas-japonesas"
// ---------------------------------------------------------------------------
export const lessonVelasJaponesasSteps = create15StepLesson(
  "velas-japonesas",
  "El Detalle de la Batalla",
  "Las velas nos dicen quién ganó la batalla hoy. Es el lenguaje de la volatilidad intradiaria.",
  "Cuerpo, mechas, verde y rojo. Cada vela es una historia de oferta y demanda en un tiempo fijo.",
  "Has aprendido el lenguaje visual del mercado. Úsalo para entender el detalle, no para perderte en él.",
  [{ word: "Mecha", definition: "Línea que muestra el precio máximo o mínimo alcanzado." }],
  { question: "¿Qué indica una vela roja?", options: [{ id: "1", label: "Felicidad", isCorrect: false }, { id: "2", label: "Que el precio cerró por debajo de su apertura", isCorrect: true }] },
  { question: "Color", left: "Alcista", right: "Bajista", items: [{ id: "1", label: "Verde", correctBucket: "left" }, { id: "2", label: "Rojo", correctBucket: "right" }] }
);

// ---------------------------------------------------------------------------
// LECCIÓN 46: Interpretación de gráficas
// Slug: "interpretacion-graficas"
// ---------------------------------------------------------------------------
export const lessonInterpretacionGraficasSteps = create15StepLesson(
  "interpretacion-graficas",
  "El Ojo del Ingeniero",
  "No todos los dibujos dicen la verdad. Vamos a aprender a interpretar la data con rigor.",
  "Evita el 'análisis técnico' de gurú. Busca fundamentos, tendencias reales y soportes históricos.",
  "Ahora eres un analista BIZEN. La data es tu guía y tu disciplina es tu mayor fortaleza.",
  [{ word: "Soporte", definition: "Nivel de precio donde la caída tiende a frenarse." }],
  { question: "¿Qué es lo más importante?", options: [{ id: "1", label: "Dibujar líneas", isCorrect: false }, { id: "2", label: "Entender el contexto y la tendencia", isCorrect: true }] },
  { question: "Análisis", left: "Fundamental", right: "Especulativo", items: [{ id: "1", label: "Datos de empresa", correctBucket: "left" }, { id: "2", label: "Rayas en el aire", correctBucket: "right" }] }
);

// ---------------------------------------------------------------------------
// LECCIÓN 47: ¿Qué es el portafolio?
// Slug: "portafolio-definicion"
// ---------------------------------------------------------------------------
export const lessonPortafolioDefinicionSteps = create15StepLesson(
  "portafolio-definicion",
  "Tu Arca de Libertad",
  "Tu portafolio es la suma de todos tus esfuerzos. Vamos a darle una estructura de fortaleza.",
  "Es tu ejército financiero. Cada activo tiene una misión: proteger, crecer o dar liquidez.",
  "Has comprendido el concepto de unidad. Tu portafolio es tu legado y tu motor de libertad.",
  [{ word: "Activo", definition: "Bien con valor que genera un beneficio futuro." }],
  { question: "¿Qué es un portafolio?", options: [{ id: "1", label: "Una billetera", isCorrect: false }, { id: "2", label: "La suma organizada de todas tus inversiones", isCorrect: true }] },
  { question: "Activo", left: "Crecimiento", right: "Defensa", items: [{ id: "1", label: "Acciones", correctBucket: "left" }, { id: "2", label: "Bonos", correctBucket: "right" }] }
);

// ---------------------------------------------------------------------------
// LECCIÓN 48: ¿Cómo se construye un portafolio?
// Slug: "construccion-portafolio"
// ---------------------------------------------------------------------------
export const lessonConstruccionPortafolioSteps = create15StepLesson(
  "construccion-portafolio",
  "Arquitectura del Éxito",
  "No se compran activos al azar. Se construye una estructura basada en matemáticas y metas.",
  "Asset Allocation: El factor más determinante de tu éxito. Define tu riesgo según tu edad.",
  "Has diseñado tu puente al futuro. La estructura es lo que te mantendrá a salvo en la tormenta.",
  [{ word: "Asset Allocation", definition: "Asignación estratégica de capital por tipo de activo." }],
  { question: "¿Cuál es el mix estándar?", options: [{ id: "1", label: "Todo a una acción", isCorrect: false }, { id: "2", label: "80% Acciones / 20% Bonos", isCorrect: true }] },
  { question: "Asignación", left: "Agresivo", right: "Conservador", items: [{ id: "1", label: "90% Acciones", correctBucket: "left" }, { id: "2", label: "90% Bonos", correctBucket: "right" }] }
);

// ---------------------------------------------------------------------------
// LECCIÓN 49: ¿Qué es el rebalanceo?
// Slug: "balanceo-portafolio"
// ---------------------------------------------------------------------------
export const lessonBalanceoPortafolioSteps = create15StepLesson(
  "balanceo-portafolio",
  "Ajuste de Precisión",
  "El mercado mueve tus porcentajes. El rebalanceo vuelve a poner tu brújula en el norte.",
  "Vender lo que subió mucho y comprar lo que bajó. Disciplina pura sobre la avaricia.",
  "Has completado el ciclo de gestión. Tu portafolio ahora es una máquina que se autocorrige.",
  [{ word: "Rebalanceo", definition: "Restaurar las proporciones originales del portafolio." }],
  { question: "¿Cada cuánto rebalancear?", options: [{ id: "1", label: "Cada hora", isCorrect: false }, { id: "2", label: "Una o dos veces al año", isCorrect: true }] },
  { question: "Acción", left: "Rebalanceo", right: "Inercia", items: [{ id: "1", label: "Vender lo caro para comprar lo barato", correctBucket: "left" }, { id: "2", label: "Dejar que el riesgo suba solo", correctBucket: "right" }] }
);
