import type { LessonStep } from "@/types/lessonTypes"

/**
 * Lesson: ¿Por qué el mercado paga lo que paga?
 */
export const lessonPorQueElMercadoPagaLoQuePagaSteps: LessonStep[] = [
  {
    id: "mkt-1",
    stepType: "billy_talks",
    body: "Bienvenido a Ingeniería del Ingreso. Olvida la frase 'trabajo duro'. El mercado no paga por sudor, paga por **VALOR**. \n\nHoy entenderás por qué un cirujano gana más que alguien que mueve cajas, y no, no es 'injusticia', es una regla del juego.",
    continueLabel: "Entender el valor",
    fullScreen: true,
  },
  {
    id: "mkt-2",
    stepType: "order",
    question: "Ordena estas profesiones de MENOR a MAYOR valor de mercado (según la dificultad de reemplazo)",
    items: [
      { id: "p1", label: "Repartidor de volantes (Cualquiera lo hace)", correctOrder: 1 },
      { id: "p2", label: "Contador especializado (Requiere estudio)", correctOrder: 2 },
      { id: "p3", label: "Ingeniero en IA (Muy pocos lo dominan)", correctOrder: 3 },
    ],
    isAssessment: true,
    fullScreen: true,
    aiInsight: "Billy dice: Mientras más fácil sea reemplazarte, menos te pagarán. Es la ley de la oferta y la demanda de habilidades.",
  },
  {
    id: "mkt-3",
    stepType: "true_false",
    statement: "Si trabajas 12 horas al día en algo que una máquina puede hacer, el mercado eventualmente te pagará lo mismo que cuesta la electricidad de esa máquina.",
    correctValue: true,
    explanation: "El mercado paga por resultados únicos, no por cansancio.",
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "mkt-4",
    stepType: "mcq",
    question: "¿A quién le pagará más el dueño del terreno por el hoyo terminado?",
    options: [
      { id: "o1", label: "A Pedro (por el esfuerzo)", isCorrect: false },
      { id: "o2", label: "A los dos lo mismo (el resultado es igual)", isCorrect: true, explanation: "Al mercado le importa el hoyo, no si sudaste o usaste una máquina." },
      { id: "o3", label: "A Juan (por ser eficiente)", isCorrect: false },
    ],
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "mkt-5",
    stepType: "summary",
    title: "Primera Verdad Aceptada",
    body: "Has entendido que el ingreso es proporcional al VALOR que aportas y qué tan DIFÍCIL es reemplazarte. \n\nPróxima lección: Romper el mito del 'Ingreso Pasivo'.",
    continueLabel: "Siguiente Lección",
    fullScreen: true,
  },
]

/**
 * Lesson: Ingreso Activo vs Pasivo: La Realidad
 */
export const lessonIngresoActivoVsPasivoLaRealidadSteps: LessonStep[] = [
  {
    id: "active-1",
    stepType: "billy_talks",
    mood: "worried",
    body: "Cuidado. Internet está lleno de gente vendiéndote 'Ingresos Pasivos' mientras ellos trabajan 20 horas al día grabándose. \n\nVamos a separar la fantasía de la ingeniería real.",
    fullScreen: true,
  },
  {
    id: "active-2",
    stepType: "match",
    question: "Conecta cada tipo de ingreso con su motor principal",
    leftItems: [
        { id: "l1", label: "Ingreso Activo" },
        { id: "l2", label: "Ingreso Pasivo" },
        { id: "l3", label: "Ingreso Híbrido" },
    ],
    rightItems: [
        { id: "r1", label: "Tu Tiempo (Presencia)" },
        { id: "r2", label: "Tu Capital o Sistemas" },
        { id: "r3", label: "Negocio con empleados" },
    ],
    correctPairs: [
        { leftId: "l1", rightId: "r1" },
        { leftId: "l2", rightId: "r2" },
        { leftId: "l3", rightId: "r3" },
    ],
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "active-3",
    stepType: "fill_blanks",
    question: "Completa la fórmula del Ingreso Activo:",
    textParts: [
        { type: "text", content: "Ingreso Activo =" },
        { type: "blank", id: "b1", correctOptionId: "opt-tiempo" },
        { type: "text", content: "x" },
        { type: "blank", id: "b2", correctOptionId: "opt-valor" },
    ],
    options: [
        { id: "opt-tiempo", label: "Tiempo", isCorrect: true },
        { id: "opt-valor", label: "Valor", isCorrect: true },
        { id: "opt-suerte", label: "Suerte", isCorrect: false },
    ],
    isAssessment: true,
    fullScreen: true,
    aiInsight: "Billy dice: En el ingreso activo, tu dinero tiene un techo físico: las 24 horas del día.",
  },
  {
    id: "active-4",
    stepType: "blitz_challenge",
    question: "¿Rentar un departamento es un ingreso...?",
    options: [
      { id: "o1", label: "Activo", isCorrect: false },
      { id: "o2", label: "Pasivo", isCorrect: true },
      { id: "o3", label: "Hormiga", isCorrect: false },
    ],
    timeLimit: 10,
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "active-5",
    stepType: "summary",
    title: "Lección de Realidad",
    body: "Todo ingreso pasivo nació de un ingreso activo (o capital) muy fuerte. No hay magia, hay construcción de sistemas.",
    continueLabel: "Sigamos construyendo",
    fullScreen: true,
  },
]

/**
 * Lesson: El Triángulo del Valor (Habilidad, Escala, Rareza)
 */
export const lessonElTrianguloDelValorSteps: LessonStep[] = [
  {
    id: "tri-1",
    stepType: "billy_talks",
    mood: "celebrating",
    body: "Aquí es donde la mayoría falla. Para ganar más, no necesitas 'más trabajo', necesitas optimizar tu **Triángulo del Valor**.\n\nHabilidades + Escala + Rareza.",
    fullScreen: true,
  },
  {
    id: "tri-2",
    stepType: "mcq",
    question: "¿Quién tiene más poder de negociación?",
    options: [
      { id: "o1", label: "El básico (hay más demanda)", isCorrect: false },
      { id: "o2", label: "El especialista (es más raro)", isCorrect: true },
    ],
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "tri-3",
    stepType: "order",
    question: "Ordena estos modelos de menor a mayor ESCALABILIDAD",
    items: [
      { id: "i1", label: "Dar clases particulares 1-a-1", correctOrder: 1 },
      { id: "i2", label: "Dar un curso a 50 alumnos", correctOrder: 2 },
      { id: "i3", label: "Vender un curso grabado a todo el mundo", correctOrder: 3 },
    ],
    isAssessment: true,
    fullScreen: true,
    aiInsight: "La escala es lo que separa a los ricos de los que solo están cómodos.",
  },
  {
    id: "tri-4",
    stepType: "true_false",
    statement: "Tener una habilidad muy rara que nadie necesita (ej. experto en dialéctica de caracoles) NO genera valor económico.",
    correctValue: true,
    explanation: "La rareza debe coincidir con una necesidad del mercado.",
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "tri-5",
    stepType: "summary",
    title: "Tu nuevo norte",
    body: "Busca ser RARO, ESCALABLE y ÚTIL. Ese es el secreto de la Ingeniería del Ingreso.",
    fullScreen: true,
  },
]

/**
 * Lesson: Ingreso de Portafolio: Dinero que genera dinero
 */
export const lessonIngresoDePortafolioDineroQueGeneraDineroSteps: LessonStep[] = [
  {
    id: "port-1",
    stepType: "billy_talks",
    mood: "thinking",
    body: "El ingreso de portafolio es el 'Santogrial'. Es cuando tus activos (acciones, bonos, cripto, dividendos) trabajan por ti.\n\nPero cuidado, sin educación, el portafolio es una apuesta, no un ingreso.",
    fullScreen: true,
  },
  {
    id: "port-2",
    stepType: "mcq",
    question: "Si compras una acción a $100 y la vendes a $150, ¿cómo se llama esa ganancia?",
    options: [
      { id: "o1", label: "Dividendo", isCorrect: false },
      { id: "o2", label: "Ganancia de Capital", isCorrect: true, explanation: "Es el aumento del valor del activo." },
      { id: "o3", label: "Interés simple", isCorrect: false },
    ],
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "port-3",
    stepType: "fill_blanks",
    question: "Identifica la diferencia:",
    textParts: [
        { type: "text", content: "El" },
        { type: "blank", id: "b1", correctOptionId: "opt-div" },
        { type: "text", content: "es el pago periódico por ser dueño de una parte de una empresa, mientras que el" },
        { type: "blank", id: "b2", correctOptionId: "opt-cap" },
        { type: "text", content: "es la ganancia por vender más caro de lo que compraste." },
    ],
    options: [
        { id: "opt-div", label: "Dividendo", isCorrect: true },
        { id: "opt-cap", label: "Capital", isCorrect: true },
        { id: "opt-imp", label: "Impuesto", isCorrect: false },
    ],
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "port-4",
    stepType: "true_false",
    statement: "Para vivir del ingreso de portafolio, necesitas tener un capital base considerable acumulado previamente.",
    correctValue: true,
    explanation: "No puedes vivir de dividendos de $10 pesos.",
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "port-5",
    stepType: "summary",
    title: "Inversor en formación",
    body: "Has entendido que el dinero puede sudar por ti. Veremos cómo acumular ese capital en los siguientes módulos.",
    fullScreen: true,
  },
]

/**
 * Lesson: Evaluación: ¿Cómo se ve tu flujo de entrada hoje?
 */
export const lessonEvaluacionFlujoDeEntradaHoySteps: LessonStep[] = [
  {
    id: "eval-1",
    stepType: "billy_talks",
    mood: "thinking",
    body: "Llegó el momento de la verdad. Nada de teoría, vamos a medir TU ingeniería de ingresos actual.",
    fullScreen: true,
  },
  {
    id: "eval-2",
    stepType: "mcq",
    question: "Hoy, ¿qué porcentaje de tus ingresos depende 100% de que tú estés presente físicamente?",
    options: [
      { id: "o1", label: "100% (Solo gano si trabajo)", isCorrect: true, explanation: "Estás en riesgo alto. Si te enfermas, tus ingresos mueren." },
      { id: "o2", label: "75-90%", isCorrect: true },
      { id: "o3", label: "Menos del 50% (Tengo otros motores)", isCorrect: true },
    ],
    isAssessment: false,
    fullScreen: true,
  },
  {
    id: "eval-3",
    stepType: "order",
    question: "Ordena tus fuentes de ingresos actuales de mayor a menor importancia económica:",
    items: [
      { id: "f1", label: "Sueldo Principal", correctOrder: 1 },
      { id: "f2", label: "Ventas / Negocios", correctOrder: 2 },
      { id: "f3", label: "Inversiones / Otros", correctOrder: 3 },
    ],
    isAssessment: false,
    fullScreen: true,
  },
  {
    id: "eval-4",
    stepType: "narrative_check",
    question: "Si pudieras clonar una de tus habilidades para que trabaje sin ti, ¿cuál sería y cómo la escalarías?",
    promptPlaceholder: "Convertiría mi conocimiento de ... en un ...",
    minChars: 30,
    billyResponse: "¡Eso es pensar como un Ingeniero! Ese es el camino a la libertad.",
    fullScreen: true,
  },
  {
    id: "eval-5",
    stepType: "summary",
    title: "Diagnóstico Finalizado",
    body: "Has terminado el primer bloque del Tema 2. Ahora sabes qué tipo de ingresos tienes y cuáles te faltan. \n\nPrepárate para el siguiente bloque: **El Capital de tus Habilidades**.",
    fullScreen: true,
  },
]
