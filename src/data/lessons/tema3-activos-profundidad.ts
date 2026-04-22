import type { LessonStep } from "@/types/lessonTypes"

// ---------------------------------------------------------------------------
// LECCIÓN 5.1: ¿Qué es una acción?
// Slug: "accion-definicion"
// ---------------------------------------------------------------------------
export const lessonAccionDefinicionSteps: LessonStep[] = [
  {
    id: "acc-def-1",
    stepType: "billy_talks",
    title: "El Átomo del Capital",
    body: "Bienvenido a la profundidad de las acciones. Una acción no es un ticket de lotería; es un contrato legal que te hace dueño. Vamos a diseccionarlo.",
    data: {
      glossary: [
        { word: "Acción Ordinaria", definition: "Título que otorga propiedad y derecho a voto en una empresa." },
        { word: "Capital Social", definition: "Suma de las aportaciones de los socios que forman el patrimonio de la empresa." }
      ]
    }
  },
  {
    id: "acc-def-2",
    stepType: "info",
    title: "Unidad de Propiedad",
    aiInsight: "Invertir en acciones es la forma más pura de capturar el ingenio humano a escala global.",
    body: "Si una empresa tiene 1,000 acciones y tú compras 1, eres legalmente dueño del 0.1% de todo: sus oficinas, sus patentes y sus ganancias futuras.",
    imageUrl: "/lessons/bi-ownership-slice.png"
  },
  {
    id: "acc-def-3",
    stepType: "impulse_meter",
    item: {
      name: "Caída del 10%",
      price: "En tu empresa favorita",
    },
    instructions: "Eres dueño de la empresa pero el mercado dice que hoy vale 10% menos. ¿Sientes que tu propiedad es menos valiosa?",
    data: {
      minLabel: "Sigo siendo dueño",
      maxLabel: "Quiero vender",
      targetValue: 2
    }
  },
  {
    id: "acc-def-4",
    stepType: "mcq",
    question: "¿Qué recibes legalmente al comprar una acción?",
    options: [
      { id: "1", label: "Un contrato de deuda", isCorrect: false },
      { id: "2", label: "Derechos de propiedad y participación en utilidades", isCorrect: true, explanation: "Correcto. Eres un socio capitalista con derechos legales." },
      { id: "3", label: "Un descuento vitalicio en productos", isCorrect: false }
    ]
  },
  {
    id: "acc-def-5",
    stepType: "info",
    title: "Responsabilidad Limitada",
    body: "Una de las grandes ventajas de las acciones es la [[Responsabilidad Limitada|Solo arriesgas el capital invertido]]. Si la empresa se endeuda masivamente, los acreedores no pueden ir por tu casa o tus ahorros personales.",
    imageUrl: "/lessons/bi-shield-legal.png"
  },
  {
    id: "acc-def-6",
    stepType: "swipe_sorter",
    question: "Clasifica el derecho del accionista",
    leftBucket: { label: "Derecho Real", color: "#10b981" },
    rightBucket: { label: "Mito", color: "#6b7280" },
    items: [
      { id: "1", label: "Votar en asambleas", correctBucket: "left" },
      { id: "2", label: "Entrar gratis a la fábrica", correctBucket: "right" },
      { id: "3", label: "Recibir reportes financieros", correctBucket: "left" },
      { id: "4", label: "Llevarse equipo de oficina", correctBucket: "right" }
    ]
  },
  {
    id: "acc-def-7",
    stepType: "true_false",
    statement: "El valor de una acción en bolsa siempre refleja exactamente el valor real de la empresa.",
    correctValue: false,
    explanation: "El mercado fluctúa por emociones y expectativas a corto plazo. El valor real se demuestra con utilidades a largo plazo."
  },
  {
    id: "acc-def-8",
    stepType: "blitz_challenge",
    question: "¿Qué es el 'Capital Social'?",
    options: [
      { id: "1", label: "Dinero para fiestas", isCorrect: false },
      { id: "2", label: "Suma de aportaciones de socios", isCorrect: true },
      { id: "3", label: "Un club de inversionistas", isCorrect: false }
    ],
    timeLimit: 12
  },
  {
    id: "acc-def-9",
    stepType: "order",
    question: "Prioridad al liquidar una empresa (quiebra)",
    items: [
      { id: "1", label: "Empleados y Salarios", correctOrder: 1 },
      { id: "2", label: "Acreedores y Bonos", correctOrder: 2 },
      { id: "3", label: "Accionistas Preferentes", correctOrder: 3 },
      { id: "4", label: "Accionistas Ordinarios (Tú)", correctOrder: 4 }
    ]
  },
  {
    id: "acc-def-10",
    stepType: "match",
    question: "Relaciona el tipo de acción",
    leftItems: [
      { id: "l1", label: "Ordinaria" },
      { id: "l2", label: "Preferente" },
      { id: "l3", label: "Tesorería" }
    ],
    rightItems: [
      { id: "r1", label: "Voto y dividendos variables" },
      { id: "r2", label: "Prioridad en pago, sin voto" },
      { id: "r3", label: "Acciones en manos de la empresa" }
    ],
    correctPairs: [
      { leftId: "l1", rightId: "r1" },
      { leftId: "l2", rightId: "r2" },
      { leftId: "l3", rightId: "r3" }
    ]
  },
  {
    id: "acc-def-11",
    stepType: "mindset_translator",
    question: "Traduce la visión de 'Comprador'",
    beliefs: [
      {
        id: "b1",
        original: "Compro acciones para ver si suben mañana.",
        healthyOptions: [
          { id: "h1", label: "Adquiero activos productivos para ser socio de su crecimiento histórico.", isCorrect: true },
          { id: "h2", label: "Soy un especulador de precios a corto plazo.", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: "acc-def-12",
    stepType: "blitz_challenge",
    question: "¿Qué es el 'Flotante' (Free Float)?",
    options: [
      { id: "1", label: "Acciones que flotan en el agua", isCorrect: false },
      { id: "2", label: "Acciones disponibles para el público", isCorrect: true },
      { id: "3", label: "Acciones de empresas de cruceros", isCorrect: false }
    ],
    timeLimit: 10
  },
  {
    id: "acc-def-13",
    stepType: "narrative_check",
    question: "Visión de Socio",
    body: "Si mañana te dieran 1 acción de cada empresa en el mundo, ¿cómo cambiaría tu forma de ver cada negocio que ves en la calle?",
    placeholder: "Los vería como... porque...",
    minChars: 30
  },
  {
    id: "acc-def-14",
    stepType: "summary",
    title: "Copropietario Global",
    body: "Has entendido que una acción es la unidad básica de la libertad financiera. No es papel, es propiedad protegida por la ley corporativa internacional.",
    aiInsight: "La acción es el puente entre el trabajo y el capital."
  },
  {
    id: "acc-def-15",
    stepType: "billy_talks",
    body: "¡Felicidades! Ya eres un experto en el concepto. Ahora vamos a ver cómo ese concepto se convierte en dinero frío: Dividendos y Plusvalía.",
    mood: "happy"
  }
];

// ---------------------------------------------------------------------------
// LECCIÓN 5.2: ¿Cómo se gana dinero con ellas?
// Slug: "dividendos-y-plusvalia"
// ---------------------------------------------------------------------------
export const lessonDividendosYPlusvaliaSteps: LessonStep[] = [
  {
    id: "div-plu-1",
    stepType: "billy_talks",
    title: "Los Motores del Retorno",
    body: "En la bolsa no hay magia, solo hay dos formas fundamentales de extraer valor de tu propiedad. Vamos a dominar la plusvalía y los dividendos.",
    data: {
      glossary: [
        { word: "Dividend Yield", definition: "Porcentaje de rendimiento que representa el dividendo anual frente al precio de la acción." },
        { word: "Recompras", definition: "Cuando la empresa compra sus propias acciones para aumentar el valor de las restantes." }
      ]
    }
  },
  {
    id: "div-plu-2",
    stepType: "info",
    title: "Plusvalía: El Crecimiento",
    aiInsight: "La plusvalía es el reflejo del optimismo y el éxito futuro de la empresa.",
    body: "La [[Plusvalía|Ganancia de capital]] ocurre cuando compras una acción a $100 y el mercado decide que ahora vale $150. Ganas por la apreciación del valor del negocio.",
    imageUrl: "/lessons/bi-growth-chart.png"
  },
  {
    id: "div-plu-3",
    stepType: "impulse_meter",
    item: {
      name: "Ganancia de Papel",
      price: "+30% en tu portafolio",
    },
    instructions: "Tu inversión ha subido 30%. Sientes el impulso de vender para 'asegurar' la ganancia. ¿Qué tanto te dominas?",
    data: {
      minLabel: "Dejo correr ganancias",
      maxLabel: "Vendo por miedo",
      targetValue: 2
    }
  },
  {
    id: "div-plu-4",
    stepType: "mcq",
    question: "¿Qué es un dividendo?",
    options: [
      { id: "1", label: "Un préstamo que te hace la empresa", isCorrect: false },
      { id: "2", label: "La parte de las utilidades que la empresa reparte en efectivo a socios", isCorrect: true, explanation: "Correcto. Es dinero depositado directamente en tu cuenta de inversión." },
      { id: "3", label: "Un descuento en sus próximas acciones", isCorrect: false }
    ]
  },
  {
    id: "div-plu-5",
    stepType: "info",
    title: "Dividendos: La Renta Pasiva",
    body: "Hay empresas maduras (como Coca-Cola o P&G) que ya no necesitan reinvertir todo su dinero. Prefieren premiar al dueño con [[Dividendos|Reparto de cash]]. Es el sueldo del inversionista.",
    imageUrl: "/lessons/bi-dividend-rain.png"
  },
  {
    id: "div-plu-6",
    stepType: "swipe_sorter",
    question: "Identifica el motor de ganancia",
    leftBucket: { label: "Plusvalía", color: "#3b82f6" },
    rightBucket: { label: "Dividendo", color: "#10b981" },
    items: [
      { id: "1", label: "Acción sube de $50 a $70", correctBucket: "left" },
      { id: "2", label: "Depósito de $2 por cada acción", correctBucket: "right" },
      { id: "3", label: "Empresa vale más en el mercado", correctBucket: "left" },
      { id: "4", label: "Distribución trimestral de utilidades", correctBucket: "right" }
    ]
  },
  {
    id: "div-plu-7",
    stepType: "true_false",
    statement: "Si una empresa no paga dividendos, es una mala inversión.",
    correctValue: false,
    explanation: "Falso. Empresas como Amazon o Google reinvierten todo para crecer más rápido, generando mucha plusvalía en lugar de dividendos."
  },
  {
    id: "div-plu-8",
    stepType: "blitz_challenge",
    question: "¿Qué es el 'Dividend Yield'?",
    options: [
      { id: "1", label: "El precio de la acción", isCorrect: false },
      { id: "2", label: "El % de retorno vía dividendo", isCorrect: true },
      { id: "3", label: "La velocidad de la empresa", isCorrect: false }
    ],
    timeLimit: 12
  },
  {
    id: "div-plu-9",
    stepType: "order",
    question: "Pasos para cobrar un dividendo",
    items: [
      { id: "1", label: "Anuncio de dividendos por la empresa", correctOrder: 1 },
      { id: "2", label: "Fecha Ex-Dividendo (Límite para comprar)", correctOrder: 2 },
      { id: "3", label: "Fecha de Registro", correctOrder: 3 },
      { id: "4", label: "Fecha de Pago (Cash en cuenta)", correctOrder: 4 }
    ]
  },
  {
    id: "div-plu-10",
    stepType: "match",
    question: "Relaciona la estrategia con el objetivo",
    leftItems: [
      { id: "l1", label: "Crecimiento (Growth)" },
      { id: "l2", label: "Valor (Value)" },
      { id: "l3", label: "Dividendos (Income)" }
    ],
    rightItems: [
      { id: "r1", label: "Busca máxima plusvalía" },
      { id: "r2", label: "Busca empresas sólidas baratas" },
      { id: "r3", label: "Busca flujo de caja constante" }
    ],
    correctPairs: [
      { leftId: "l1", rightId: "r1" },
      { leftId: "l2", rightId: "r2" },
      { leftId: "l3", rightId: "r3" }
    ]
  },
  {
    id: "div-plu-11",
    stepType: "mindset_translator",
    question: "Traduce la visión de 'Ingreso'",
    beliefs: [
      {
        id: "b1",
        original: "Solo gano dinero si vendo mis inversiones.",
        healthyOptions: [
          { id: "h1", label: "Puedo vivir de los dividendos sin tocar mi capital principal.", isCorrect: true },
          { id: "h2", label: "La bolsa es para comprar y vender rápido.", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: "div-plu-12",
    stepType: "blitz_challenge",
    question: "Misión: ¿Qué es la ganancia de capital?",
    options: [
      { id: "1", label: "Un préstamo bancario", isCorrect: false },
      { id: "2", label: "La diferencia positiva entre compra y venta", isCorrect: true },
      { id: "3", label: "El sueldo de un capitalista", isCorrect: false }
    ],
    timeLimit: 10
  },
  {
    id: "div-plu-13",
    stepType: "narrative_check",
    question: "Análisis de Elección",
    body: "Si tuvieras un millón de pesos para invertir, ¿preferirías una empresa que sube mucho de precio pero no te da nada hoy, o una que sube poco pero te deposita cada mes?",
    placeholder: "Yo elegiría... porque...",
    minChars: 30
  },
  {
    id: "div-plu-14",
    stepType: "summary",
    title: "Cosechando el Capital",
    body: "Has entendido cómo fluye el dinero desde las arcas corporativas hacia tu bolsillo. La plusvalía construye tu futuro; los dividendos financian tu presente.",
    aiInsight: "La reinversión de dividendos es el acelerador secreto de la riqueza."
  },
  {
    id: "div-plu-15",
    stepType: "billy_talks",
    body: "¡Espectacular! Ahora que sabemos cómo pagan, vamos a entender el ecosistema donde viven: Las Empresas Públicas.",
    mood: "happy"
  }
];

// ---------------------------------------------------------------------------
// LECCIÓN 5.3: ¿Qué son las empresas públicas?
// Slug: "empresas-publicas"
// ---------------------------------------------------------------------------
export const lessonEmpresasPublicasSteps: LessonStep[] = [
  {
    id: "emp-pub-1",
    stepType: "billy_talks",
    title: "La Pecera de Cristal",
    body: "Una empresa 'Pública' no es del gobierno. Es una empresa que decidió abrir sus libros al mundo a cambio de capital global. Bienvenido al estándar máximo de transparencia.",
    data: {
      glossary: [
        { word: "10-K", definition: "Reporte anual detallado que toda empresa pública en EE.UU. debe presentar ante la SEC." },
        { word: "Consejo de Administración", definition: "Grupo de expertos que vigilan al CEO para proteger los intereses de los accionistas." }
      ]
    }
  },
  {
    id: "emp-pub-2",
    stepType: "info",
    title: "Transparencia por Ley",
    aiInsight: "En la empresa privada hay secretos; en la pública hay auditorías.",
    body: "Al ser pública, una empresa debe reportar cada centavo que entra y sale cada tres meses. Esta transparencia es lo que permite que el sistema BIZEN confíe en los datos y no en las promesas.",
    imageUrl: "/lessons/bi-audit-check.png"
  },
  {
    id: "emp-pub-3",
    stepType: "impulse_meter",
    item: {
      name: "Crisis Mediática",
      price: "'Elon Musk tuiteó algo raro'",
    },
    instructions: "Ves una noticia que asusta a todos sobre una empresa. La gráfica se vuelve loca. ¿Buscas el reporte oficial o vendes por miedo?",
    data: {
      minLabel: "Busco los datos reales",
      maxLabel: "Vendo por pánico",
      targetValue: 2
    }
  },
  {
    id: "emp-pub-4",
    stepType: "mcq",
    question: "¿Quién vigila que las empresas públicas no mientan en sus reportes?",
    options: [
      { id: "1", label: "Un grupo de YouTubers", isCorrect: false },
      { id: "2", label: "Autoridades regulatorias (SEC en USA, CNBV en México)", isCorrect: true, explanation: "Correcto. El gobierno supervisa la veracidad de la información para proteger al público." },
      { id: "3", label: "Nadie, es por honor", isCorrect: false }
    ]
  },
  {
    id: "emp-pub-5",
    stepType: "info",
    title: "La Meritocracia Corporativa",
    body: "Si un CEO gasta dinero en lujos innecesarios y la empresa pierde valor, los accionistas pueden votar para despedirlo. Es un sistema de incentivos alineado con la rentabilidad.",
    imageUrl: "/lessons/bi-meritocracy.png"
  },
  {
    id: "emp-pub-6",
    stepType: "swipe_sorter",
    question: "Clasifica la responsabilidad",
    leftBucket: { label: "Empresa Pública", color: "#10b981" },
    rightBucket: { label: "Empresa Privada", color: "#6b7280" },
    items: [
      { id: "1", label: "Reportes trimestrales mandatorios", correctBucket: "left" },
      { id: "2", label: "Finanzas ocultas a la competencia", correctBucket: "right" },
      { id: "3", label: "Dueños eligen qué reportar", correctBucket: "right" },
      { id: "4", label: "Auditoría externa obligatoria", correctBucket: "left" }
    ]
  },
  {
    id: "emp-pub-7",
    stepType: "true_false",
    statement: "Una empresa puede 'deslistarse' de la bolsa y volver a ser privada si alguien compra todas sus acciones.",
    correctValue: true,
    explanation: "Cierto. Se le llama 'Privatización' o 'Going Private'. Ej: Twitter tras ser comprada por Elon Musk."
  },
  {
    id: "emp-pub-8",
    stepType: "blitz_challenge",
    question: "¿Cómo se llama el reporte trimestral en USA?",
    options: [
      { id: "1", label: "10-Q", isCorrect: true },
      { id: "2", label: "10-K", isCorrect: false },
      { id: "3", label: "Q-Reports", isCorrect: false }
    ],
    timeLimit: 12
  },
  {
    id: "emp-pub-9",
    stepType: "order",
    question: "Jerarquía de poder en la empresa pública",
    items: [
      { id: "1", label: "Accionistas (Dueños)", correctOrder: 1 },
      { id: "2", label: "Consejo de Administración", correctOrder: 2 },
      { id: "3", label: "CEO y Directivos", correctOrder: 3 },
      { id: "4", label: "Gerentes y Empleados", correctOrder: 4 }
    ]
  },
  {
    id: "emp-pub-10",
    stepType: "match",
    question: "Relaciona el término con su función",
    leftItems: [
      { id: "l1", label: "Proxy Vote" },
      { id: "l2", label: "Earnings Call" },
      { id: "l3", label: "Delisting" }
    ],
    rightItems: [
      { id: "r1", label: "Voto a distancia para socios" },
      { id: "r2", label: "Llamada para explicar resultados" },
      { id: "r3", label: "Salida de la bolsa de valores" }
    ],
    correctPairs: [
      { leftId: "l1", rightId: "r1" },
      { leftId: "l2", rightId: "r2" },
      { leftId: "l3", rightId: "r3" }
    ]
  },
  {
    id: "emp-pub-11",
    stepType: "mindset_translator",
    question: "Traduce la desconfianza institucional",
    beliefs: [
      {
        id: "b1",
        original: "Las empresas medianas son más confiables porque conozco al dueño.",
        healthyOptions: [
          { id: "h1", label: "Confío en la auditoría pública obligatoria por encima de las relaciones personales.", isCorrect: true },
          { id: "h2", label: "En bolsa todos mienten y no hay supervisión.", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: "emp-pub-12",
    stepType: "blitz_challenge",
    question: "Misión: ¿Cuál es el beneficio de la 'Liquidez' en una empresa pública?",
    options: [
      { id: "1", label: "Poder vender tus acciones en segundos", isCorrect: true },
      { id: "2", label: "Que la empresa tenga dinero en efectivo", isCorrect: false },
      { id: "3", label: "Que el precio sea siempre bajo", isCorrect: false }
    ],
    timeLimit: 10
  },
  {
    id: "emp-pub-13",
    stepType: "narrative_check",
    question: "Auditando el Sector",
    body: "Si pudieras revisar los libros contables de cualquier empresa en el mundo hoy, ¿cuál elegirías y qué dato buscarías primero para saber si es un negocio sano?",
    placeholder: "Revisaría a... y buscaría...",
    minChars: 30
  },
  {
    id: "emp-pub-14",
    stepType: "summary",
    title: "El Poder de la Transparencia",
    body: "Has dominado el ecosistema público. Ahora sabes que al invertir en bolsa, estás operando en el nivel más alto de regulación y seguridad civil-financiera que existe.",
    aiInsight: "Invertir en empresas públicas es delegar el trabajo a los mejores."
  },
  {
    id: "emp-pub-15",
    stepType: "billy_talks",
    body: "¡Brillante! Has concluido el bloque de Acciones. Ahora vamos a sumergirnos en la canasta más eficiente: Los ETFs.",
    mood: "mascot"
  }
];

// ---------------------------------------------------------------------------
// LECCIÓN 6.1: ¿Qué son los ETFs?
// Slug: "etfs-definicion"
// ---------------------------------------------------------------------------
export const lessonEtfsDefinicionSteps: LessonStep[] = [
  {
    id: "etf-def-1",
    stepType: "billy_talks",
    title: "El Super-Activo",
    body: "Un ETF es la evolución de la inversión. Es una canasta de cientos de activos que se opera como si fuera una sola acción. Bienvenido a la eficiencia total.",
    data: {
      glossary: [
        { word: "Indexado", definition: "Fondo que replica exactamente la composición de un índice de mercado." },
        { word: "Vanguard/BlackRock", definition: "Las mayores gestoras de ETFs en el mundo." }
      ]
    }
  },
  {
    id: "etf-def-2",
    stepType: "info",
    title: "La canasta inteligente",
    aiInsight: "El ETF es el único almuerzo gratis en Wall Street: diversificación sin costo extra.",
    body: "Invertir en un solo activo es apostar. Invertir en un [[ETF|Canasta de activos]] es apostar por una industria, un país o el mundo entero. Si una naranja se pudre, la canasta sigue intacta.",
    imageUrl: "/lessons/bi-basket.png"
  },
  {
    id: "etf-def-3",
    stepType: "swipe_sorter",
    question: "Clasifica el activo",
    leftBucket: { label: "ETF (Canasta)", color: "#8b5cf6" },
    rightBucket: { label: "Acción (Uno solo)", color: "#3b82f6" },
    items: [
      { id: "1", label: "IVV (S&P 500)", correctBucket: "left" },
      { id: "2", label: "Microsoft (MSFT)", correctBucket: "right" },
      { id: "3", label: "Global Tech ETF", correctBucket: "left" },
      { id: "4", label: "Tesla (TSLA)", correctBucket: "right" }
    ]
  },
  {
    id: "etf-def-4",
    stepType: "mcq",
    question: "¿Qué estás comprando realmente con un ETF del S&P 500?",
    options: [
      { id: "1", label: "Un préstamo a 500 bancos", isCorrect: false },
      { id: "2", label: "Un pedazo de las 500 empresas más grandes de EE.UU.", isCorrect: true, explanation: "Correcto. Diversificas tu capital automáticamente entre los líderes de la economía." },
      { id: "3", label: "Un billete de lotería", isCorrect: false }
    ]
  },
  {
    id: "etf-def-5",
    stepType: "info",
    title: "Liquidación en Segundos",
    body: "A diferencia de los fondos de inversión tradicionales que tardan días en devolverte tu dinero, los ETFs se venden en la bolsa al instante. Tienes el control total de tu liquidez.",
    imageUrl: "/lessons/bi-fast-liquidity.png"
  },
  {
    id: "etf-def-6",
    stepType: "impulse_meter",
    item: {
      name: "Noticia de Crisis",
      price: "-2% en S&P 500",
    },
    instructions: "El mercado completo baja 2%. Todo el mundo dice que es el fin. ¿Qué tanto controlas tu dedo para no vender?",
    data: {
      minLabel: "DCA (Compro más)",
      maxLabel: "Vendo (Pánico)",
      targetValue: 2
    }
  },
  {
    id: "etf-def-7",
    stepType: "true_false",
    statement: "Un ETF puede contener no solo acciones, sino también bonos, oro o materias primas.",
    correctValue: true,
    explanation: "Efectivamente. Hay ETFs para casi cualquier activo financiero en el planeta."
  },
  {
    id: "etf-def-8",
    stepType: "blitz_challenge",
    question: "¿Qué significa ETF?",
    options: [
      { id: "1", label: "Every Time Fast", isCorrect: false },
      { id: "2", label: "Exchange Traded Fund", isCorrect: true },
      { id: "3", label: "Electronic Trade Fund", isCorrect: false }
    ],
    timeLimit: 12
  },
  {
    id: "etf-def-9",
    stepType: "order",
    question: "Estructura de un ETF (Interno)",
    items: [
      { id: "1", label: "Activos subyacentes (Acciones reales)", correctOrder: 1 },
      { id: "2", label: "El Fondo que los agrupa", correctOrder: 2 },
      { id: "3", label: "El título de ETF que tú compras", correctOrder: 3 }
    ]
  },
  {
    id: "etf-def-10",
    stepType: "match",
    question: "Relaciona el ETF con su índice",
    leftItems: [
      { id: "l1", label: "VOO" },
      { id: "l2", label: "QQQ" },
      { id: "l3", label: "VGT" }
    ],
    rightItems: [
      { id: "r1", label: "S&P 500" },
      { id: "r2", label: "Nasdaq 100" },
      { id: "r3", label: "Sector Tecnología" }
    ],
    correctPairs: [
      { leftId: "l1", rightId: "r1" },
      { leftId: "l2", rightId: "r2" },
      { leftId: "l3", rightId: "r3" }
    ]
  },
  {
    id: "etf-def-11",
    stepType: "mindset_translator",
    question: "Traduce la falsa complejidad",
    beliefs: [
      {
        id: "b1",
        original: "Invertir es para gente que sabe elegir qué acción va a subir mañana.",
        healthyOptions: [
          { id: "h1", label: "Invierto en el éxito del mercado entero mediante ETFs; no necesito adivinar ganancias.", isCorrect: true },
          { id: "h2", label: "Necesito un doctorado para comprar un ETF.", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: "etf-def-12",
    stepType: "blitz_challenge",
    question: "Misión: ¿Cuál es el peor error con un ETF?",
    options: [
      { id: "1", label: "Venderlo en una caída temporal", isCorrect: true },
      { id: "2", label: "Comprarlo y olvidarlo", isCorrect: false },
      { id: "3", label: "Recibir sus dividendos", isCorrect: false }
    ],
    timeLimit: 10
  },
  {
    id: "etf-def-13",
    stepType: "narrative_check",
    question: "Diseño de Portafolio",
    body: "Si solo pudieras tener 2 canastas (ETFs) para el resto de tu vida, ¿qué sectores o regiones elegirías para asegurar tu retiro?",
    placeholder: "Elegiría el sector de... porque...",
    minChars: 30
  },
  {
    id: "etf-def-14",
    stepType: "summary",
    title: "La canasta de la abundancia",
    body: "Has entendido que no necesitas ser un genio de las finanzas para ganar como uno. Los ETFs son tu vehículo de paz mental y crecimiento imparable.",
    aiInsight: "Invertir es aburrido, pero los resultados son emocionantes."
  },
  {
    id: "etf-def-15",
    stepType: "billy_talks",
    body: "¡Fantástico! Ya sabemos qué son. Ahora vamos a ver cómo funciona esa maquinaria por dentro.",
    mood: "happy"
  }
];

// ---------------------------------------------------------------------------
// LECCIÓN 6.2: ¿Cómo funcionan los ETFs?
// Slug: "etfs-funcionamiento"
// ---------------------------------------------------------------------------
export const lessonEtfsFuncionamientoSteps: LessonStep[] = [
  {
    id: "etf-fun-1",
    stepType: "billy_talks",
    title: "El Motor del Fondo",
    body: "Un ETF parece una acción, pero por dentro es una maquinaria compleja de arbitraje y balances. Vamos a desarmarlo.",
    data: {
      glossary: [
        { word: "NAV", definition: "Net Asset Value: El valor real de los activos que tiene el fondo dividido entre sus títulos." },
        { word: "Arbitraje", definition: "Aprovechar pequeñas diferencias de precio para equilibrar el mercado." }
      ]
    }
  },
  {
    id: "etf-fun-2",
    stepType: "info",
    title: "Sincronía de Precios",
    aiInsight: "El precio del ETF no flota al azar; está anclado a la realidad de las acciones que posee.",
    body: "Existe un mecanismo llamado [[Arbitraje|Equilibrio de mercado]] que asegura que si las acciones de la canasta suben, el precio del ETF suba proporcionalmente. No hay lugar para el error.",
    imageUrl: "/lessons/bi-gears.png"
  },
  {
    id: "etf-fun-3",
    stepType: "impulse_meter",
    item: {
      name: "Gap de Apertura",
      price: "ETF abre +1% arriba",
    },
    instructions: "Ves que el ETF subió antes de que pudieras comprar. ¿Te apresuras a comprar por miedo a que se escape?",
    data: {
      minLabel: "Espero mi precio",
      maxLabel: "Compro ya (A mercado)",
      targetValue: 2
    }
  },
  {
    id: "etf-fun-4",
    stepType: "mcq",
    question: "¿Qué pasa si las 500 empresas del S&P 500 cambian de valor?",
    options: [
      { id: "1", label: "El ETF se queda igual", isCorrect: false },
      { id: "2", label: "El ETF ajusta su precio automáticamente siguiendo el NAV", isCorrect: true, explanation: "Correcto. El ETF es un espejo del valor de lo que contiene." },
      { id: "3", label: "Hay que llamar al banco para que lo cambie", isCorrect: false }
    ]
  },
  {
    id: "etf-fun-5",
    stepType: "info",
    title: "Gestión Pasiva vs Activa",
    body: "La mayoría de los ETFs son 'Pasivos': simplemente copian un índice usando algoritmos. No hay humanos cobrando bonos millonarios para elegir acciones, lo que reduce tus costos a casi cero.",
    imageUrl: "/lessons/bi-algo-trading.png"
  },
  {
    id: "etf-fun-6",
    stepType: "swipe_sorter",
    question: "Identifica el proceso",
    leftBucket: { label: "Gestión Pasiva", color: "#10b981" },
    rightBucket: { label: "Gestión Activa", color: "#ef4444" },
    items: [
      { id: "1", label: "Copiar el S&P 500 exactamente", correctBucket: "left" },
      { id: "2", label: "Un gestor elige qué comprar hoy", correctBucket: "right" },
      { id: "3", label: "Comisiones de 0.03% anual", correctBucket: "left" },
      { id: "4", label: "Comisiones de 2% anual", correctBucket: "right" }
    ]
  },
  {
    id: "etf-fun-7",
    stepType: "true_false",
    statement: "El gestor del ETF (ej. Vanguard) puede fugarse con las acciones que están dentro del fondo.",
    correctValue: false,
    explanation: "Los activos están bajo custodia de instituciones terceras y reguladas. Vanguard solo administra el índice."
  },
  {
    id: "etf-fun-8",
    stepType: "blitz_challenge",
    question: "¿Qué significa NAV?",
    options: [
      { id: "1", label: "Nuevo Activo Valioso", isCorrect: false },
      { id: "2", label: "Net Asset Value (Valor Liquidativo)", isCorrect: true },
      { id: "3", label: "No Hay Valor", isCorrect: false }
    ],
    timeLimit: 12
  },
  {
    id: "etf-fun-9",
    stepType: "order",
    question: "Proceso de equilibrio de un ETF",
    items: [
      { id: "1", label: "Precio de acciones subyacentes cambia", correctOrder: 1 },
      { id: "2", label: "Se detecta diferencia con el precio del ETF", correctOrder: 2 },
      { id: "3", label: "Aparecen árbitros comprando/vendiendo", correctOrder: 3 },
      { id: "4", label: "Precios se equilibran al instante", correctOrder: 4 }
    ]
  },
  {
    id: "etf-fun-10",
    stepType: "match",
    question: "Relaciona el rol con la acción",
    leftItems: [
      { id: "l1", label: "Gestora" },
      { id: "l2", label: "Custodio" },
      { id: "l3", label: "Inversionista" }
    ],
    rightItems: [
      { id: "r1", label: "Define y opera el índice" },
      { id: "r2", label: "Guarda los títulos físicamente" },
      { id: "r3", label: "Compra el título del fondo" }
    ],
    correctPairs: [
      { leftId: "l1", rightId: "r1" },
      { leftId: "l2", rightId: "r2" },
      { leftId: "l3", rightId: "r3" }
    ]
  },
  {
    id: "etf-fun-11",
    stepType: "mindset_translator",
    question: "Traduce la desconfianza técnica",
    beliefs: [
      {
        id: "b1",
        original: "Si el mercado cae, el ETF se va a quedar congelado y no podré vender.",
        healthyOptions: [
          { id: "h1", label: "Un ETF es tan líquido como las acciones que tiene; siempre hay mercado.", isCorrect: true },
          { id: "h2", label: "El ETF es un sistema cerrado que solo funciona si sube.", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: "etf-fun-12",
    stepType: "blitz_challenge",
    question: "Misión: ¿Cuál es el gasto más importante en un ETF?",
    options: [
      { id: "1", label: "El precio del título", isCorrect: false },
      { id: "2", label: "El Expense Ratio (Comisión anual)", isCorrect: true },
      { id: "3", label: "El logo de la gestora", isCorrect: false }
    ],
    timeLimit: 10
  },
  {
    id: "etf-fun-13",
    stepType: "narrative_check",
    question: "Análisis de Mecanismo",
    body: "Si pudieras automatizar tu inversión para que compre el ETF cada vez que el precio baja, ¿qué ventaja tendrías sobre alguien que intenta decidirlo manualmente?",
    placeholder: "Tendría ventaja porque...",
    minChars: 30
  },
  {
    id: "etf-fun-14",
    stepType: "summary",
    title: "Relojería Financiera",
    body: "Has entendido que el ETF no es magia, es ingeniería pura. Un sistema robusto, automático y transparente que trabaja para ti 24/7.",
    aiInsight: "Un sistema automático vence a una voluntad cansada."
  },
  {
    id: "etf-fun-15",
    stepType: "billy_talks",
    body: "¡Increíble! Ahora que desarmamos el motor, vamos a ver las ventajas principales que te harán elegir ETFs sobre cualquier otra cosa.",
    mood: "happy"
  }
];

// ---------------------------------------------------------------------------
// LECCIÓN 6.3: ¿Cuáles son sus ventajas principales?
// Slug: "etfs-ventajas"
// ---------------------------------------------------------------------------
export const lessonEtfsVentajasSteps: LessonStep[] = [
  {
    id: "etf-ven-1",
    stepType: "billy_talks",
    title: "La Ventaja BIZEN",
    body: "Ya sabes qué son y cómo funcionan. Ahora vamos a ver por qué los ETFs son la kriptonita de la banca tradicional y tu mejor arma secreta.",
    data: {
      glossary: [
        { word: "Interés Compuesto", definition: "Ganar intereses sobre los intereses ya ganados." },
        { word: "Eficiencia Fiscal", definition: "Capacidad de generar ganancias pagando el mínimo de impuestos legalmente." }
      ]
    }
  },
  {
    id: "etf-ven-2",
    stepType: "info",
    title: "Costos Microscópicos",
    aiInsight: "Lo que no le pagas al banco en comisiones se queda en tu cuenta generando interés compuesto.",
    body: "Un fondo bancario te cobra 2% anual. Un ETF de vanguardia cobra 0.03%. Esa diferencia parece pequeña, pero en 30 años se traduce en un 40% más de dinero para TI.",
    imageUrl: "/lessons/bi-fees-comparison.png"
  },
  {
    id: "etf-ven-3",
    stepType: "impulse_meter",
    item: {
      name: "Oferta Bancaria",
      price: "'Invierta con un experto real'",
    },
    instructions: "Un asesor te ofrece un fondo que promete superar al mercado pero cobra 2% de comisión. ¿Qué tanto te convence?",
    data: {
      minLabel: "Cero (Elijo eficiencia)",
      maxLabel: "Me convence (Estatus)",
      targetValue: 1
    }
  },
  {
    id: "etf-ven-4",
    stepType: "mcq",
    question: "¿Cuál es la ventaja más importante de la diversificación en un ETF?",
    options: [
      { id: "1", label: "Que no pagas impuestos", isCorrect: false },
      { id: "2", label: "Que el riesgo de pérdida total desaparece (a menos que el mundo entero se acabe)", isCorrect: true, explanation: "Correcto. Es casi imposible que 500 o 2,000 empresas quiebren al mismo tiempo." },
      { id: "3", label: "Que el precio nunca baja", isCorrect: false }
    ]
  },
  {
    id: "etf-ven-5",
    stepType: "info",
    title: "Eficiencia Fiscal Real",
    body: "Los ETFs incurren en menos transacciones internas que los fondos mutuos, lo que significa que generan menos hechos imponibles. Pagas impuestos solo cuando tú decides vender.",
    imageUrl: "/lessons/bi-tax-shield.png"
  },
  {
    id: "etf-ven-6",
    stepType: "swipe_sorter",
    question: "Identifica la ventaja del ETF",
    leftBucket: { label: "Ventaja ETF", color: "#10b981" },
    rightBucket: { label: "Fondo Tradicional", color: "#6b7280" },
    items: [
      { id: "1", label: "Bajo costo anual (0.03%)", correctBucket: "left" },
      { id: "2", label: "Comisiones de 2% anual", correctBucket: "right" },
      { id: "3", label: "Transparencia absoluta diaria", correctBucket: "left" },
      { id: "4", label: "Finanzas opacas de la gestión", correctBucket: "right" }
    ]
  },
  {
    id: "etf-ven-7",
    stepType: "true_false",
    statement: "Al comprar un ETF diversificado, estás contratando a las 500 mejores mentes corporativas para trabajar para ti.",
    correctValue: true,
    explanation: "Sí, eres dueño del resultado de su trabajo, innovación y utilidades."
  },
  {
    id: "etf-ven-8",
    stepType: "blitz_challenge",
    question: "¿Qué es el 'Expense Ratio'?",
    options: [
      { id: "1", label: "El precio de la acción", isCorrect: false },
      { id: "2", label: "El costo anual de administración", isCorrect: true },
      { id: "3", label: "La velocidad de compra", isCorrect: false }
    ],
    timeLimit: 12
  },
  {
    id: "etf-ven-9",
    stepType: "order",
    question: "Ordena los costos de MENOR a MAYOR (Eficiencia)",
    items: [
      { id: "1", label: "ETF Indexado del S&P 500", correctOrder: 1 },
      { id: "2", label: "Fondo de Inversión Tecnológico", correctOrder: 2 },
      { id: "3", label: "Fondo Mutuo de un Banco", correctOrder: 3 },
      { id: "4", label: "Hedge Fund (Gestión agresiva)", correctOrder: 4 }
    ]
  },
  {
    id: "etf-ven-10",
    stepType: "match",
    question: "Relaciona el beneficio con el concepto",
    leftItems: [
      { id: "l1", label: "Diversificación" },
      { id: "l2", label: "Costo Bajo" },
      { id: "l3", label: "Liquidez" }
    ],
    rightItems: [
      { id: "r1", label: "No dependes de una sola empresa" },
      { id: "r2", label: "Más dinero para tu interés compuesto" },
      { id: "r3", label: "Puedes vender en cualquier momento" }
    ],
    correctPairs: [
      { leftId: "l1", rightId: "r1" },
      { leftId: "l2", rightId: "r2" },
      { leftId: "l3", rightId: "r3" }
    ]
  },
  {
    id: "etf-ven-11",
    stepType: "mindset_translator",
    question: "Traduce la complejidad innecesaria",
    beliefs: [
      {
        id: "b1",
        original: "Necesito pagarle a un experto para que gestione mi capital.",
        healthyOptions: [
          { id: "h1", label: "Yo soy el gestor de mi libertad usando herramientas eficientes como ETFs.", isCorrect: true },
          { id: "h2", label: "El experto sabe cosas que yo nunca sabré.", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: "etf-ven-12",
    stepType: "blitz_challenge",
    question: "Misión: ¿Qué es la 'Gestión Pasiva'?",
    options: [
      { id: "1", label: "No hacer nada nunca", isCorrect: false },
      { id: "2", label: "Seguir un índice automáticamente", isCorrect: true },
      { id: "3", label: "Guardar dinero en el colchón", isCorrect: false }
    ],
    timeLimit: 10
  },
  {
    id: "etf-ven-13",
    stepType: "narrative_check",
    question: "Visión de Ganancia",
    body: "Si el mercado sube 10% y tu fondo te cobra 2% de comisión, solo ganaste 8%. ¿Cómo te sientes respecto a regalarle el 20% de tu ganancia al banco por un servicio que un algoritmo hace mejor?",
    placeholder: "Me siento... porque...",
    minChars: 30
  },
  {
    id: "etf-ven-14",
    stepType: "summary",
    title: "El Arma Definitiva",
    body: "Has descubierto por qué los ETFs son el vehículo preferido de la ingeniería financiera BIZEN. Simplicidad, bajo costo y resultados matemáticos.",
    aiInsight: "Invertir no tiene por qué ser emocionante, solo tiene que ser rentable."
  },
  {
    id: "etf-ven-15",
    stepType: "billy_talks",
    body: "¡Espectacular! Hemos terminado el bloque de ETFs. Ahora vamos a ver el ancla de todo portafolio: Los Bonos.",
    mood: "happy"
  }
];

// ---------------------------------------------------------------------------
// LECCIÓN 7.1: ¿Qué son los bonos?
// Slug: "bonos-definition" -> Wait, mapping in registry is "bonos-definicion"
// ---------------------------------------------------------------------------
export const lessonBonosDefinicionSteps: LessonStep[] = [
  {
    id: "bon-def-1",
    stepType: "billy_talks",
    title: "El Contrato de Deuda",
    body: "Un Bono es un instrumento donde tú eres el banco. Le prestas dinero a un gobierno o empresa y ellos te pagan intereses. Vamos a entender por qué son vitales.",
    data: {
      glossary: [
        { word: "Emisor", definition: "Entidad que pide el dinero (Gobierno, Empresa o Municipio)." },
        { word: "Tasa de Cupón", definition: "El interés fijo que el emisor se compromete a pagar." }
      ]
    }
  },
  {
    id: "bon-def-2",
    stepType: "info",
    title: "Renta Fija Total",
    aiInsight: "Los bonos son el refugio cuando la bolsa se vuelve ruidosa.",
    body: "A diferencia de las acciones, con los [[Bono|Instrumento de deuda]] sabes exactamente cuánto dinero recibirás y en qué fechas. Es predecible, es estable, es tu ancla financiera.",
    imageUrl: "/lessons/bi-anchor.png"
  },
  {
    id: "bon-def-3",
    stepType: "impulse_meter",
    item: {
      name: "Tasa de Cetes alta",
      price: "11% anual garantizado",
    },
    instructions: "Los bonos pagan muy bien hoy. Sientes la tentación de dejar de invertir en bolsa para ir a lo seguro. ¿Cómo recalibras tu sistema?",
    data: {
      minLabel: "Mantengo mi balance",
      maxLabel: "Todo a bonos (Miedo)",
      targetValue: 2
    }
  },
  {
    id: "bon-def-4",
    stepType: "mcq",
    question: "¿Cuál es el riesgo principal de un bono del gobierno?",
    options: [
      { id: "1", label: "Que la empresa quiebre", isCorrect: false },
      { id: "2", label: "Que el país entre en impago (default)", isCorrect: true, explanation: "Correcto. Es el riesgo más bajo, pues un país tiene el poder de cobrar impuestos para pagar sus deudas." },
      { id: "3", label: "Que el precio cambie cada segundo", isCorrect: false }
    ]
  },
  {
    id: "bon-def-5",
    stepType: "info",
    title: "Preservación del Poder Adquisitivo",
    body: "Los bonos gubernamentales (como CETES) suelen pagar un poco más que la inflación. No son para volverse millonario, son para que tu 'Fondo de Emergencia' no pierda valor con el tiempo.",
    imageUrl: "/lessons/bi-preservation.png"
  },
  {
    id: "bon-def-6",
    stepType: "swipe_sorter",
    question: "Identifica la característica del Bono",
    leftBucket: { label: "Bono (Deuda)", color: "#10b981" },
    rightBucket: { label: "Acción (Capital)", color: "#3b82f6" },
    items: [
      { id: "1", label: "Recibes interés fijo", correctBucket: "left" },
      { id: "2", label: "Eres acreedor del emisor", correctBucket: "left" },
      { id: "3", label: "Eres socio del negocio", correctBucket: "right" },
      { id: "4", label: "Voto en asambleas", correctBucket: "right" }
    ]
  },
  {
    id: "bon-def-7",
    stepType: "true_false",
    statement: "Un bono siempre te devuelve el 100% de tu inversión al final del plazo, pase lo que pase con el mercado.",
    correctValue: true,
    explanation: "Correcto, siempre y cuando el emisor no quiebre. El contrato legal garantiza la devolución del valor nominal."
  },
  {
    id: "bon-def-8",
    stepType: "blitz_challenge",
    question: "¿Cómo se llama el bono más seguro en México?",
    options: [
      { id: "1", label: "Peso-Bono", isCorrect: false },
      { id: "2", label: "Cetes", isCorrect: true },
      { id: "3", label: "Udis", isCorrect: false }
    ],
    timeLimit: 12
  },
  {
    id: "bon-def-9",
    stepType: "order",
    question: "Ordena por seguridad (Mayor a Menor)",
    items: [
      { id: "1", label: "Cetes (Gobierno Federal)", correctOrder: 1 },
      { id: "2", label: "Bono de Banco Grande", correctOrder: 2 },
      { id: "3", label: "Bono de Empresa Multinacional", correctOrder: 3 },
      { id: "4", label: "Bono de Empresa PyME", correctOrder: 4 }
    ]
  },
  {
    id: "bon-def-10",
    stepType: "match",
    question: "Relaciona el término con su significado",
    leftItems: [
      { id: "l1", label: "Vencimiento" },
      { id: "l2", label: "Principal" },
      { id: "l3", label: "Default" }
    ],
    rightItems: [
      { id: "r1", label: "Fecha final del contrato" },
      { id: "r2", label: "Monto prestado original" },
      { id: "r3", label: "Incumplimiento de pago" }
    ],
    correctPairs: [
      { leftId: "l1", rightId: "r1" },
      { leftId: "l2", rightId: "r2" },
      { leftId: "l3", rightId: "r3" }
    ]
  },
  {
    id: "bon-def-11",
    stepType: "mindset_translator",
    question: "Traduce el miedo a la deuda",
    beliefs: [
      {
        id: "b1",
        original: "La deuda es mala y nunca debería participar en ella.",
        healthyOptions: [
          { id: "h1", label: "Ser el acreedor es una posición de poder y estabilidad financiera.", isCorrect: true },
          { id: "h2", label: "Solo debo tener mi dinero en efectivo.", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: "bon-def-12",
    stepType: "blitz_challenge",
    question: "Misión: ¿Qué es la 'Renta Fija'?",
    options: [
      { id: "1", label: "Rentar una casa fija", isCorrect: false },
      { id: "2", label: "Saber exactamente cuánto ganarás", isCorrect: true },
      { id: "3", label: "Que el precio no se mueva nunca", isCorrect: false }
    ],
    timeLimit: 10
  },
  {
    id: "bon-def-13",
    stepType: "narrative_check",
    question: "Análisis de Estabilidad",
    body: "Si el mercado de acciones cae 30%, ¿cómo te ayudaría tener la mitad de tu dinero en bonos del gobierno?",
    placeholder: "Me ayudaría a... porque...",
    minChars: 30
  },
  {
    id: "bon-def-14",
    stepType: "summary",
    title: "El Ancla de Hierro",
    body: "Has entendido que un bono es la calma necesaria para la tormenta. No te hará rico hoy, pero evitará que el pánico destruya tu futuro.",
    aiInsight: "Un portafolio equilibrado tiene motor y tiene ancla."
  },
  {
    id: "bon-def-15",
    stepType: "billy_talks",
    body: "¡Impresionante! Ahora vamos a ver cómo esos bonos generan su magia mes tras mes.",
    mood: "happy"
  }
];

// ---------------------------------------------------------------------------
// LECCIÓN 7.2: ¿Cómo generan rendimientos los bonos?
// Slug: "bonos-rendimiento"
// ---------------------------------------------------------------------------
export const lessonBonosRendimientoSteps: LessonStep[] = [
  {
    id: "bon-ren-1",
    stepType: "billy_talks",
    title: "La Mecánica del Cupón",
    body: "El dinero de los bonos no cae del cielo; viene por contrato. Vamos a entender cómo cobrar intereses y por qué el precio del bono puede cambiar en el mercado.",
    data: {
      glossary: [
        { word: "Cupón", definition: "Pago de intereses periódico que recibe el poseedor de un bono." },
        { word: "Sobre la Par", definition: "Cuando un bono cotiza por encima de su valor original." }
      ]
    }
  },
  {
    id: "bon-ren-2",
    stepType: "info",
    title: "Intereses y Vencimiento",
    aiInsight: "El rendimiento de un bono es una promesa legal, no una expectativa de mercado.",
    body: "Al comprar un bono, recibes [[Cupones|Pagos de interés]] cada cierto tiempo (ej. mensual o semestral) y al final te devuelven tu capital íntegro. Es la forma más predecible de ganar.",
    imageUrl: "/lessons/bi-coupon-stream.png"
  },
  {
    id: "bon-ren-3",
    stepType: "impulse_meter",
    item: {
      name: "Subida de Tasas",
      price: "Bonos nuevos pagan más",
    },
    instructions: "Ves que ahora hay bonos que pagan más de lo que paga el tuyo. ¿Sientes que el tuyo vale 'menos' hoy?",
    data: {
      minLabel: "Espero al vencimiento",
      maxLabel: "Vendo para cambiar",
      targetValue: 2
    }
  },
  {
    id: "bon-ren-4",
    stepType: "mcq",
    question: "¿Qué pasa con el precio de un bono viejo si las tasas de interés suben?",
    options: [
      { id: "1", label: "El precio sube también", isCorrect: false },
      { id: "2", label: "El precio baja porque los bonos nuevos son más atractivos", isCorrect: true, explanation: "Correcto. Es la relación inversa fundamental de la renta fija." },
      { id: "3", label: "El precio se queda igual por ley", isCorrect: false }
    ]
  },
  {
    id: "bon-ren-5",
    stepType: "info",
    title: "Relación Inversa: La Balanza",
    body: "Regla BIZEN: Tasas Arriba = Precios de Bonos Abajo. Esto solo te afecta si decides VENDER el bono antes de que termine su plazo. Si te quedas hasta el final, recibirás tu dinero pactado.",
    imageUrl: "/lessons/bi-seesaw.png"
  },
  {
    id: "bon-ren-6",
    stepType: "swipe_sorter",
    question: "Identifica el componente del rendimiento",
    leftBucket: { label: "Afecta Rendimiento", color: "#ef4444" },
    rightBucket: { label: "No Afecta Real", color: "#94a3b8" },
    items: [
      { id: "1", label: "Tasa de interés de Banxico", correctBucket: "left" },
      { id: "2", label: "Inflación del país", correctBucket: "left" },
      { id: "3", label: "Color del certificado", correctBucket: "right" },
      { id: "4", label: "Nombre del intermediario", correctBucket: "right" }
    ]
  },
  {
    id: "bon-ren-7",
    stepType: "true_false",
    statement: "Un bono 'Cupón Cero' no paga intereses mensuales, sino que se compra más barato que su valor final.",
    correctValue: true,
    explanation: "Cierto. Así funcionan los CETES. Compras a $9.80 y te devuelven $10.00. Esos 20 centavos son tu interés."
  },
  {
    id: "bon-ren-8",
    stepType: "blitz_challenge",
    question: "¿Cómo se llama el pago periódico de intereses?",
    options: [
      { id: "1", label: "Sueldo", isCorrect: false },
      { id: "2", label: "Cupón", isCorrect: true },
      { id: "3", label: "Comisión", isCorrect: false }
    ],
    timeLimit: 12
  },
  {
    id: "bon-ren-9",
    stepType: "order",
    question: "Proceso de ganancia en Bonos",
    items: [
      { id: "1", label: "Compra del título (Inversión inicial)", correctOrder: 1 },
      { id: "2", label: "Acumulación diaria de intereses", correctOrder: 2 },
      { id: "3", label: "Pago periódico de cupones (opcional)", correctOrder: 3 },
      { id: "4", label: "Vencimiento y devolución de capital", correctOrder: 4 }
    ]
  },
  {
    id: "bon-ren-10",
    stepType: "match",
    question: "Relaciona el escenario",
    leftItems: [
      { id: "l1", label: "Tasa sube" },
      { id: "l2", label: "Tasa baja" },
      { id: "l3", label: "Tasa igual" }
    ],
    rightItems: [
      { id: "r1", label: "Precio de bono cae" },
      { id: "r2", label: "Precio de bono sube" },
      { id: "r3", label: "Precio se mantiene" }
    ],
    correctPairs: [
      { leftId: "l1", rightId: "r1" },
      { leftId: "l2", rightId: "r2" },
      { leftId: "l3", rightId: "r3" }
    ]
  },
  {
    id: "bon-ren-11",
    stepType: "mindset_translator",
    question: "Traduce la confusión de mercado",
    beliefs: [
      {
        id: "b1",
        original: "Mi bono bajó de precio hoy, estoy perdiendo dinero real.",
        healthyOptions: [
          { id: "h1", label: "La fluctuación de precio solo importa si vendo; mi contrato de pago sigue intacto.", isCorrect: true },
          { id: "h2", label: "Debo vender antes de que valga cero.", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: "bon-ren-12",
    stepType: "blitz_challenge",
    question: "Misión: ¿Qué es el 'Vencimiento'?",
    options: [
      { id: "1", label: "Cuando el bono caduca y no vale nada", isCorrect: false },
      { id: "2", label: "Cuando te devuelven tu capital original", isCorrect: true },
      { id: "3", label: "Cuando pierdes la paciencia", isCorrect: false }
    ],
    timeLimit: 10
  },
  {
    id: "bon-ren-13",
    stepType: "narrative_check",
    question: "Análisis de Inversión",
    body: "Si un bono te paga 10% anual pero la inflación es del 8%, ¿cuál es tu ganancia real y para qué te sirve ese excedente?",
    placeholder: "Mi ganancia real es... y me sirve para...",
    minChars: 30
  },
  {
    id: "bon-ren-14",
    stepType: "summary",
    title: "Rendimiento Bajo Control",
    body: "Has desentramado el motor de la renta fija. Ahora sabes que los bonos son contratos de honor y ley que aseguran que tu capital trabaje sin sobresaltos.",
    aiInsight: "La paciencia en bonos es una virtud matemática."
  },
  {
    id: "bon-ren-15",
    stepType: "billy_talks",
    body: "¡Brillante! Has concluido el bloque de activos a profundidad. Ahora estás listo para aprender cómo abrir tu cuenta y empezar a invertir de verdad.",
    mood: "happy"
  }
];
