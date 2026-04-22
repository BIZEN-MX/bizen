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
// LECCIÓN 50: ¿Cómo afectan tus emociones?
// Slug: "emociones-inversion"
// ---------------------------------------------------------------------------
export const lessonEmocionesInversionSteps = create15StepLesson(
  "emociones-inversion",
  "El Factor Humano",
  "La bolsa es un vector que transfiere dinero de los impacientes a los pacientes. Tus emociones son tu mayor enemigo o tu mejor aliado.",
  "La amígdala te grita 'huye' cuando el mercado cae. El inversor BIZEN usa lógica para anular el pánico y comprar en las rebajas.",
  "Has dominado tu biología. Ahora ves las caídas como descuentos y las subidas como validación, no como euforia.",
  [{ word: "Vector de Transferencia", definition: "Principio de Buffett: el mercado mueve riqueza de impacientes a pacientes." }],
  { question: "¿Qué hace un inversor emocional?", options: [{ id: "1", label: "Espera", isCorrect: false }, { id: "2", label: "Vende en pánico cuando el mercado baja", isCorrect: true }] },
  { question: "Identifica", left: "Lógica BIZEN", right: "Emoción", items: [{ id: "1", label: "Mantener el plan", correctBucket: "left" }, { id: "2", label: "Vender por miedo", correctBucket: "right" }] }
);

// ---------------------------------------------------------------------------
// LECCIÓN 51: Errores psicológicos
// Slug: "errores-psicologicos"
// ---------------------------------------------------------------------------
export const lessonErroresPsicologicosSteps = create15StepLesson(
  "errores-psicologicos",
  "Trampas Mentales",
  "Tu cerebro no está diseñado para invertir. Vamos a desprogramar los sesgos que destruyen portafolios.",
  "FOMO, Sesgo de Confirmación y Aversión a la Pérdida. Son virus mentales que te empujan a tomar decisiones erróneas.",
  "Has identificado tus puntos ciegos. Ser consciente de un sesgo es el primer paso para anular su efecto en tu dinero.",
  [{ word: "FOMO", definition: "Fear Of Missing Out: Miedo a quedarse fuera de una oportunidad." }],
  { question: "¿Qué es la aversión a la pérdida?", options: [{ id: "1", label: "Miedo a ganar", isCorrect: false }, { id: "2", label: "Sentir más dolor por perder que alegría por ganar la misma cantidad", isCorrect: true }] },
  { question: "Sesgo", left: "BIZEN", right: "Sesgo", items: [{ id: "1", label: "Analizar datos fríos", correctBucket: "left" }, { id: "2", label: "Seguir a la masa", correctBucket: "right" }] }
);

// ---------------------------------------------------------------------------
// LECCIÓN 52: ¿Por qué es vital la disciplina?
// Slug: "disciplina-financiera"
// ---------------------------------------------------------------------------
export const lessonDisciplinaFinancieraSteps = create15StepLesson(
  "disciplina-financiera",
  "La Fuerza de la Rutina",
  "La riqueza no es para los inteligentes, es para los disciplinados. Vamos a forjar tu carácter de inversor.",
  "Invertir es aburrido y eso es bueno. El éxito viene de hacer lo que planeaste, especialmente cuando no quieres hacerlo.",
  "Eres un robot financiero. Las emociones pasan, pero tus aportaciones mensuales son una ley inquebrantable.",
  [{ word: "Disciplina Táctica", definition: "Ejecución algorítmica de un plan sin importar el entorno." }],
  { question: "¿Qué dijo John Bogle?", options: [{ id: "1", label: "Compra oro", isCorrect: false }, { id: "2", label: "El tiempo es tu amigo, el impulso tu enemigo", isCorrect: true }] },
  { question: "Carácter", left: "Disciplinado", right: "Impulsivo", items: [{ id: "1", label: "DCA mensual", correctBucket: "left" }, { id: "2", label: "Invertir solo cuando sale el aguinaldo", correctBucket: "right" }] }
);

// ---------------------------------------------------------------------------
// LECCIÓN 53: ¿Por qué no diversificar es un error?
// Slug: "no-diversificar"
// ---------------------------------------------------------------------------
export const lessonNoDiversificarSteps = create15StepLesson(
  "no-diversificar",
  "El Pecado de la Apuesta",
  "Concentrar tu dinero en una sola ficha es jugar a la ruleta rusa. Vamos a entender el riesgo de la ruina absoluta.",
  "Ninguna empresa es invencible. Si apuestas todo a una y falla, tu capital va a cero y nunca se recupera.",
  "Has blindado tu fortuna. Entiendes que ser dueño de todo el mercado es mejor que depender de un solo destino.",
  [{ word: "Riesgo de Ruina", definition: "Posibilidad de perder el 100% del capital sin capacidad de recuperación." }],
  { question: "¿Por qué es un error no diversificar?", options: [{ id: "1", label: "Ganas menos", isCorrect: false }, { id: "2", label: "Dependes de un solo punto de falla total", isCorrect: true }] },
  { question: "Estructura", left: "Diversificado", right: "Concentrado", items: [{ id: "1", label: "ETF con 500 empresas", correctBucket: "left" }, { id: "2", label: "Solo acciones de Tesla", correctBucket: "right" }] }
);

// ---------------------------------------------------------------------------
// LECCIÓN 54: ¿Qué pasa al invertir sin saber?
// Slug: "invertir-sin-conocimiento"
// ---------------------------------------------------------------------------
export const lessonInvertirSinConocimientoSteps = create15StepLesson(
  "invertir-sin-conocimiento",
  "El Costo de la Ignorancia",
  "Si no sabes cómo funciona el juego, tú eres la ganancia de alguien más. Vamos a activar tu defensa intelectual.",
  "La ignorancia atrae comisiones ocultas y malas decisiones. Invertir sin fundamentos es regalar tu futuro a Wall Street.",
  "Ahora tienes el mapa. Tu conocimiento es el escudo que protege cada peso que pones a trabajar.",
  [{ word: "Comisiones Ocultas", definition: "Costos que no se declaran claramente pero merman tu rendimiento." }],
  { question: "¿Qué protege al inversor?", options: [{ id: "1", label: "Su buena fe", isCorrect: false }, { id: "2", label: "Su educación financiera y rigor técnico", isCorrect: true }] },
  { question: "Decisión", left: "Informada", right: "Ciega", items: [{ id: "1", label: "Analizar el Tema 3", correctBucket: "left" }, { id: "2", label: "Seguir un consejo de TikTok", correctBucket: "right" }] }
);

// ---------------------------------------------------------------------------
// LECCIÓN 55: ¿Por qué no debes seguir modas?
// Slug: "seguir-modas"
// ---------------------------------------------------------------------------
export const lessonSeguirModasSteps = create15StepLesson(
  "seguir-modas",
  "Burbujas y Espejismos",
  "Las modas financieras son fuegos artificiales: brillan rápido y dejan solo cenizas. BIZEN busca estrellas, no chispas.",
  "El Hype es el preludio del Crash. Cuando todos hablan de un activo en la peluquería, suele ser el fin de la subida.",
  "Eres inmune a la euforia. No compras modas, compras valor real respaldado por matemáticas.",
  [{ word: "Burbuja Financiera", definition: "Aumento de precio por euforia sin sustento real." }],
  { question: "¿Cuándo suele explotar una burbuja?", options: [{ id: "1", label: "Cuando nadie habla", isCorrect: false }, { id: "2", label: "Cuando el pánico reemplaza a la euforia masiva", isCorrect: true }] },
  { question: "Activo", left: "Valor Real", right: "Moda / Hype", items: [{ id: "1", label: "Índice S&P 500", correctBucket: "left" }, { id: "2", label: "Moneda de perrito del día", correctBucket: "right" }] }
);

// ---------------------------------------------------------------------------
// LECCIÓN 56: ¿Cómo evitar fraudes al invertir?
// Slug: "fraudes-inversion"
// ---------------------------------------------------------------------------
export const lessonFraudesInversionSteps = create15StepLesson(
  "fraudes-inversion",
  "Alarma de Estafa",
  "Si suena demasiado bueno para ser cierto, es porque no lo es. Vamos a identificar a los lobos con piel de oveja.",
  "Rendimientos garantizados del 10% mensual no existen. Si te piden depositar en OXXO o criptos desconocidas, huye.",
  "Tienes un radar anti-estafas. Sabes que la riqueza se construye con instituciones reguladas y tiempo real.",
  [{ word: "Ponzi", definition: "Esquema de fraude que paga a inversores viejos con dinero de los nuevos." }],
  { question: "¿Cuál es la señal de alerta roja?", options: [{ id: "1", label: "Poco interés", isCorrect: false }, { id: "2", label: "Promesa de alto rendimiento sin riesgo", isCorrect: true }] },
  { question: "Plataforma", left: "Regulada", right: "Fraude", items: [{ id: "1", label: "GBM+ (CNBV)", correctBucket: "left" }, { id: "2", label: "App de Telegram mágica", correctBucket: "right" }] }
);

// ---------------------------------------------------------------------------
// LECCIÓN 57: Elegir plataformas confiables
// Slug: "plataformas-confiables"
// ---------------------------------------------------------------------------
export const lessonPlataformasConfiablesSteps = create15StepLesson(
  "plataformas-confiables",
  "Tu Banco de Guerra",
  "No pones tus lingotes en una caja de cartón. Vamos a elegir instituciones de grado ingeniería.",
  "Busca el sello de la CNBV. En México, los brokers regulados tienen seguros y vigilancia estricta para tu capital.",
  "Tu dinero está blindado por leyes y seguros internacionales. Duerme tranquilo, tus activos son legalmente tuyos.",
  [{ word: "CNBV", definition: "Autoridad que regula y supervisa el sistema financiero en México." }],
  { question: "¿Qué institución protege tus depósitos?", options: [{ id: "1", label: "La policía", isCorrect: false }, { id: "2", label: "IPAB (hasta 400 mil UDIS)", isCorrect: true }] },
  { question: "Estatus", left: "Seguro", right: "Dudoso", items: [{ id: "1", label: "Broker con CNBV", correctBucket: "left" }, { id: "2", label: "Empresa de paraíso fiscal", correctBucket: "right" }] }
);

// ---------------------------------------------------------------------------
// LECCIÓN 58: Quién protege al inversionista
// Slug: "proteccion-usuario"
// ---------------------------------------------------------------------------
export const lessonProteccionUsuarioSteps = create15StepLesson(
  "proteccion-usuario",
  "Tu Escudo Legal",
  "Si algo sale mal, no estás solo. Tienes a la ley de tu lado. Vamos a conocer a tus abogados financieros.",
  "La CONDUSEF es tu defensor gratuito. Los sistemas financieros modernos tienen capas de protección para el usuario.",
  "Has terminado el bloque de seguridad. Ahora sabes que el sistema profesional tiene redes de seguridad para ti.",
  [{ word: "CONDUSEF", definition: "Organismo que protege y defiende los derechos de los usuarios financieros." }],
  { question: "¿A dónde acudir ante una irregularidad?", options: [{ id: "1", label: "A una red social", isCorrect: false }, { id: "2", label: "A la CONDUSEF", isCorrect: true }] },
  { question: "Entidad", left: "Protectora", right: "Reguladora", items: [{ id: "1", label: "CONDUSEF", correctBucket: "left" }, { id: "2", label: "CNBV", correctBucket: "right" }] }
);
