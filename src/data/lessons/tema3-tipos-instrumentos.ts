import type { LessonStep } from "@/types/lessonTypes"

// ---------------------------------------------------------------------------
// LECCIÓN 10: ¿Qué son las acciones?
// Slug: "instrumentos-acciones"
// ---------------------------------------------------------------------------
export const lessonInstrumentosAccionesSteps: LessonStep[] = [
  {
    id: "acciones-1",
    stepType: "billy_talks",
    title: "Títulos de Propiedad",
    body: "Imagina ser dueño de un pedazo de cada iPhone que se vende. Eso no es un sueño, es una [[Acción|Título que representa la propiedad de una fracción de una empresa]]. Vamos a ver cómo funcionan.",
    data: {
      glossary: [
        { word: "Acción", definition: "Unidad de propiedad en una corporación que da derechos sobre sus activos y utilidades." },
        { word: "Plusvalía", definition: "Aumento del valor de una acción sobre el precio al que fue comprada." }
      ]
    }
  },
  {
    id: "acciones-2",
    stepType: "info",
    title: "Copropietario de Imperios",
    aiInsight: "Un accionista no es un cliente, es un socio. Si la empresa gana, tú también ganas.",
    body: "Al comprar una acción, tienes dos formas de ganar: 1. [[Plusvalía|Vender más caro de lo que compraste]] y 2. [[Dividendos|Reparos de utilidades en efectivo]]. Es el activo de crecimiento por excelencia.",
    imageUrl: "/lessons/bi-stock-growth.png"
  },
  {
    id: "acciones-3",
    stepType: "impulse_meter",
    item: {
      name: "Acción de Moda",
      price: "+20% esta semana",
    },
    instructions: "Todos en internet hablan de una empresa nueva. El precio sube sin parar. ¿Qué tanto te gana la emoción de comprar?",
    data: {
      minLabel: "Analizo frialdad",
      maxLabel: "Compro todo (FOMO)",
      targetValue: 2
    }
  },
  {
    id: "acciones-4",
    stepType: "mcq",
    question: "¿Qué representa legalmente poseer una acción?",
    options: [
      { id: "1", label: "Que la empresa te debe dinero", isCorrect: false },
      { id: "2", label: "Que eres dueño proporcional de la empresa", isCorrect: true, explanation: "Correcto. Eres socio con derechos legales sobre la compañía." },
      { id: "3", label: "Un cupón de descuento en sus tiendas", isCorrect: false }
    ]
  },
  {
    id: "acciones-5",
    stepType: "info",
    title: "El Riesgo de Empresa",
    body: "Invertir en una sola acción es arriesgado. Si la empresa toma malas decisiones o quiebra, tu capital puede irse a cero. Por eso en BIZEN nunca 'apostamos' a una sola ficha.",
    imageUrl: "/lessons/bi-risk-warning.png"
  },
  {
    id: "acciones-6",
    stepType: "swipe_sorter",
    question: "Identifica la forma de ganar con acciones",
    leftBucket: { label: "Ganancia real", color: "#10b981" },
    rightBucket: { label: "Costo/Riesgo", color: "#6b7280" },
    items: [
      { id: "1", label: "Recibir Dividendos", correctBucket: "left" },
      { id: "2", label: "Volatilidad de precio", correctBucket: "right" },
      { id: "3", label: "Plusvalía por venta", correctBucket: "left" },
      { id: "4", label: "Quiebra de la empresa", correctBucket: "right" }
    ]
  },
  {
    id: "acciones-7",
    stepType: "true_false",
    statement: "Poseer acciones de Apple te da derecho a ir a sus oficinas y pedir un iPhone gratis.",
    correctValue: false,
    explanation: "Eres dueño del capital, no de los productos físicos. Los dividendos son tu forma de recibir beneficios."
  },
  {
    id: "acciones-8",
    stepType: "blitz_challenge",
    question: "¿Cómo se llama el pago de utilidades a los accionistas?",
    options: [
      { id: "1", label: "Salario", isCorrect: false },
      { id: "2", label: "Dividendo", isCorrect: true },
      { id: "3", label: "Interés", isCorrect: false }
    ],
    timeLimit: 12
  },
  {
    id: "acciones-9",
    stepType: "order",
    question: "Proceso para volverte accionista",
    items: [
      { id: "1", label: "Abrir cuenta en Broker", correctOrder: 1 },
      { id: "2", label: "Fondear cuenta con SPEI", correctOrder: 2 },
      { id: "3", label: "Seleccionar Ticker (ej. AAPL)", correctOrder: 3 },
      { id: "4", label: "Confirmar orden de compra", correctOrder: 4 }
    ]
  },
  {
    id: "acciones-10",
    stepType: "match",
    question: "Relaciona el término con su función",
    leftItems: [
      { id: "l1", label: "Ticker" },
      { id: "l2", label: "Market Cap" },
      { id: "l3", label: "Lote" }
    ],
    rightItems: [
      { id: "r1", label: "Abreviatura de la empresa (ej. TSLA)" },
      { id: "r2", label: "Valor total de la empresa" },
      { id: "r3", label: "Conjunto de acciones" }
    ],
    correctPairs: [
      { leftId: "l1", rightId: "r1" },
      { leftId: "l2", rightId: "r2" },
      { leftId: "l3", rightId: "r3" }
    ]
  },
  {
    id: "acciones-11",
    stepType: "mindset_translator",
    question: "Traduce la visión de 'Trader'",
    beliefs: [
      {
        id: "b1",
        original: "Debo vender en cuanto gane 5% para no perder mi dinero.",
        healthyOptions: [
          { id: "h1", label: "La riqueza real se genera dejando que las empresas crezcan por años.", isCorrect: true },
          { id: "h2", label: "Solo los que venden rápido ganan en bolsa.", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: "acciones-12",
    stepType: "blitz_challenge",
    question: "Misión: ¿Cuál es la mayor ventaja de las acciones a largo plazo?",
    options: [
      { id: "1", label: "Poder presumir que soy dueño", isCorrect: false },
      { id: "2", label: "Crecimiento del capital e interés compuesto", isCorrect: true },
      { id: "3", label: "Tener descuentos en la empresa", isCorrect: false }
    ],
    timeLimit: 10
  },
  {
    id: "acciones-13",
    stepType: "narrative_check",
    question: "Análisis de Dueño",
    body: "Si fueras dueño de una cadena de hoteles, ¿qué te importaría más: el precio de venta de los hoteles hoy, o cuántas personas se hospedan y pagan cada noche?",
    placeholder: "Me importaría más... porque...",
    minChars: 30
  },
  {
    id: "acciones-14",
    stepType: "summary",
    title: "Dueño de la Maquinaria",
    body: "Has entendido que una acción es poder real. Es la herramienta para capturar el valor del trabajo ajeno de forma legal y productiva.",
    aiInsight: "Las acciones son el motor, pero necesitamos un chasis seguro: Los ETFs."
  },
  {
    id: "acciones-15",
    stepType: "billy_talks",
    body: "¡Excelente! Ahora vamos a ver cómo comprar cientos de acciones de un solo golpe con los ETFs.",
    mood: "happy"
  }
];

// ---------------------------------------------------------------------------
// LECCIÓN 11: ¿Qué son los ETFs?
// Slug: "instrumentos-etfs"
// ---------------------------------------------------------------------------
export const lessonInstrumentosEtfsSteps: LessonStep[] = [
  {
    id: "etfs-1",
    stepType: "billy_talks",
    title: "La Canasta Inteligente",
    body: "Si las acciones son soldados, los [[ETF|Exchange Traded Funds: Fondos que cotizan en bolsa y contienen muchos activos]] son ejércitos completos. Vamos a ver por qué son los favoritos de BIZEN.",
    data: {
      glossary: [
        { word: "ETF", definition: "Fondo que se negocia en bolsa y permite invertir en una canasta de valores de forma diversificada." },
        { word: "Índice", definition: "Referencia que mide el valor de un mercado o sector (ej. S&P 500)." }
      ]
    }
  },
  {
    id: "etfs-2",
    stepType: "info",
    title: "Diversificación Instantánea",
    aiInsight: "Un ETF es la forma más barata y eficiente de comprar el mundo entero sin tener que elegir ganadores.",
    body: "Un solo ETF puede contener acciones de las 500 empresas más grandes de EE.UU. ([[S&P 500|Las 500 empresas públicas más grandes de EE.UU.]]). Si una quiebra, las otras 499 sostienen tu sistema.",
    imageUrl: "/lessons/bi-etf-basket.png"
  },
  {
    id: "etfs-3",
    stepType: "impulse_meter",
    item: {
      name: "ETF del Sector Tech",
      price: "-5% tras noticia de IA",
    },
    instructions: "Tu ETF de tecnología baja 5% en un día. Sientes la necesidad de 'hacer algo'. ¿Qué tan fuerte es tu impulso?",
    data: {
      minLabel: "Nada por hacer (Sistema)",
      maxLabel: "Vender/Cambiar estrategia",
      targetValue: 2
    }
  },
  {
    id: "etfs-4",
    stepType: "mcq",
    question: "¿Cuál es la principal ventaja de un ETF sobre comprar acciones individuales?",
    options: [
      { id: "1", label: "Que las acciones brillan más en el ETF", isCorrect: false },
      { id: "2", label: "Reducción drástica del riesgo mediante diversificación automática", isCorrect: true, explanation: "Correcto. Diluyes el riesgo de que una sola empresa arruine tu portafolio." },
      { id: "3", label: "Que no pagan impuestos nunca", isCorrect: false }
    ]
  },
  {
    id: "etfs-5",
    stepType: "info",
    title: "Bajos Costos, Gran Alcance",
    body: "Los ETFs son gestionados de forma pasiva (en su mayoría), lo que significa que sus comisiones son minúsculas comparadas con los fondos bancarios tradicionales. Son la herramienta de eficiencia máxima.",
    imageUrl: "/lessons/bi-low-fees.png"
  },
  {
    id: "etfs-6",
    stepType: "swipe_sorter",
    question: "Identifica si es un ETF o una Acción",
    leftBucket: { label: "ETF (Canasta)", color: "#8b5cf6" },
    rightBucket: { label: "Acción (Individual)", color: "#3b82f6" },
    items: [
      { id: "1", label: "VOO (S&P 500)", correctBucket: "left" },
      { id: "2", label: "Tesla (TSLA)", correctBucket: "right" },
      { id: "3", label: "VT (Todo el mundo)", correctBucket: "left" },
      { id: "4", label: "Netflix (NFLX)", correctBucket: "right" }
    ]
  },
  {
    id: "etfs-7",
    stepType: "true_false",
    statement: "Al comprar un ETF del S&P 500, estás invirtiendo indirectamente en empresas como Apple, Google y Microsoft.",
    correctValue: true,
    explanation: "Efectivamente, el fondo posee esas acciones y tú posees un pedazo del fondo."
  },
  {
    id: "etfs-8",
    stepType: "blitz_challenge",
    question: "¿Qué significa ETF?",
    options: [
      { id: "1", label: "Easy Trade Fund", isCorrect: false },
      { id: "2", label: "Exchange Traded Fund", isCorrect: true },
      { id: "3", label: "Every Time Fast", isCorrect: false }
    ],
    timeLimit: 12
  },
  {
    id: "etfs-9",
    stepType: "order",
    question: "Ordena los ETFs de MENOR a MAYOR riesgo geográfico",
    items: [
      { id: "1", label: "ETF Global (Todo el mundo)", correctOrder: 1 },
      { id: "2", label: "ETF de Mercado Desarrollado (EE.UU.)", correctOrder: 2 },
      { id: "3", label: "ETF de Mercado Emergente (México/Brasil)", correctOrder: 3 },
      { id: "4", label: "ETF de un solo Sector (Cripto/Cannabis)", correctOrder: 4 }
    ]
  },
  {
    id: "etfs-10",
    stepType: "match",
    question: "Relaciona el ETF con su objetivo",
    leftItems: [
      { id: "l1", label: "S&P 500" },
      { id: "l2", label: "NASDAQ 100" },
      { id: "l3", label: "Fibras" }
    ],
    rightItems: [
      { id: "r1", label: "Las 500 más grandes de EE.UU." },
      { id: "r2", label: "Sector tecnológico y crecimiento" },
      { id: "r3", label: "Bienes raíces y rentas" }
    ],
    correctPairs: [
      { leftId: "l1", rightId: "r1" },
      { leftId: "l2", rightId: "r2" },
      { leftId: "l3", rightId: "r3" }
    ]
  },
  {
    id: "etfs-11",
    stepType: "mindset_translator",
    question: "Traduce la flojera de investigar",
    beliefs: [
      {
        id: "b1",
        original: "No tengo tiempo de investigar cada empresa, por eso no invierto.",
        healthyOptions: [
          { id: "h1", label: "Uso ETFs para comprar el mercado completo y dejar que los mejores ganen por mí.", isCorrect: true },
          { id: "h2", label: "Si no investigo, mejor guardo mi dinero en el banco.", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: "etfs-12",
    stepType: "blitz_challenge",
    question: "Misión: ¿Qué es un 'Índice' financiero?",
    options: [
      { id: "1", label: "Un dedo de la mano", isCorrect: false },
      { id: "2", label: "Una lista de referencia del mercado", isCorrect: true },
      { id: "3", label: "El precio de una sola acción", isCorrect: false }
    ],
    timeLimit: 10
  },
  {
    id: "etfs-13",
    stepType: "narrative_check",
    question: "Estrategia Global",
    body: "Si pudieras comprar 'Toda la Economía Mundial' con un solo clic, ¿crees que el mundo será más productivo en 20 años de lo que es hoy? ¿Por qué?",
    placeholder: "Creo que el mundo será... porque...",
    minChars: 30
  },
  {
    id: "etfs-14",
    stepType: "summary",
    title: "El Ejército a tu mando",
    body: "Has descubierto la herramienta definitiva del inversionista inteligente. Los ETFs eliminan la necesidad de ser un genio y te permiten ganar con el crecimiento colectivo del mundo.",
    aiInsight: "Invertir en ETFs es apostar por el progreso de la humanidad."
  },
  {
    id: "etfs-15",
    stepType: "billy_talks",
    body: "¡Brillante! Pero un portafolio no solo necesita motor, necesita frenos y estabilidad. Vamos a ver los Bonos.",
    mood: "thinking"
  }
];

// ---------------------------------------------------------------------------
// LECCIÓN 12: ¿Qué son los bonos?
// Slug: "instrumentos-bonos"
// ---------------------------------------------------------------------------
export const lessonInstrumentosBonosSteps: LessonStep[] = [
  {
    id: "bonos-1",
    stepType: "billy_talks",
    title: "El Contrato de Préstamo",
    body: "Invertir en [[Bonos|Instrumentos donde prestas dinero a cambio de un interés fijo]] te convierte en el prestamista del gobierno o empresas. Vamos a ver por qué son tu ancla.",
    data: {
      glossary: [
        { word: "Bono", definition: "Título de deuda mediante el cual el emisor se compromete a devolver el capital más intereses." },
        { word: "Cetes", definition: "Certificados de la Tesorería: La inversión más segura en México." }
      ]
    }
  },
  {
    id: "bonos-2",
    stepType: "info",
    title: "Renta Fija: Sabes lo que ganarás",
    aiInsight: "Los bonos no te harán millonario, pero evitarán que dejes de serlo en las crisis.",
    body: "A diferencia de las acciones, con los bonos sabes exactamente cuánto recibirás y cuándo. Es [[Renta Fija|Ingreso predecible]]. Ideales para tu fondo de emergencia.",
    imageUrl: "/lessons/bi-fixed-income.png"
  },
  {
    id: "bonos-3",
    stepType: "impulse_meter",
    item: {
      name: "Tasa de Cetes al 11%",
      price: "Sin riesgo bursátil",
    },
    instructions: "Los bonos pagan muy bien hoy. Sientes la tentación de sacar todo de la bolsa para meterlo ahí. ¿Qué haces?",
    data: {
      minLabel: "Mantengo mi balance",
      maxLabel: "Todo a bonos (Miedo)",
      targetValue: 2
    }
  },
  {
    id: "bonos-4",
    stepType: "mcq",
    question: "¿Cuál es el riesgo principal de un bono gubernamental (ej. Cetes)?",
    options: [
      { id: "1", label: "Que la empresa quiebre", isCorrect: false },
      { id: "2", label: "Que el país entero entre en quiebra o default", isCorrect: true, explanation: "Correcto. Es el riesgo más bajo del mercado, pues un país tiene el poder de cobrar impuestos e imprimir para pagar." },
      { id: "3", label: "Que el broker se quede con los intereses", isCorrect: false }
    ]
  },
  {
    id: "bonos-5",
    stepType: "info",
    title: "El Escudo contra la Inflación",
    body: "Los bonos gubernamentales suelen pagar un poco más que la inflación. No es para 'crecer' masivamente, sino para 'proteger' tu poder adquisitivo mientras esperas a usar ese dinero.",
    imageUrl: "/lessons/bi-shield-protect.png"
  },
  {
    id: "bonos-6",
    stepType: "swipe_sorter",
    question: "Identifica la característica",
    leftBucket: { label: "Bonos (Deuda)", color: "#10b981" },
    rightBucket: { label: "Acciones (Capital)", color: "#3b82f6" },
    items: [
      { id: "1", label: "Eres prestamista", correctBucket: "left" },
      { id: "2", label: "Eres socio/dueño", correctBucket: "right" },
      { id: "3", label: "Pago de Intereses fijos", correctBucket: "left" },
      { id: "4", label: "Dividendos variables", correctBucket: "right" }
    ]
  },
  {
    id: "bonos-7",
    stepType: "true_false",
    statement: "Si compras un bono a 1 año, puedes retirar tu dinero mañana mismo sin penalización.",
    correctValue: false,
    explanation: "Los bonos tienen un plazo. Algunos permiten venta anticipada, pero podrías recibir menos de lo pactado si lo haces a destiempo."
  },
  {
    id: "bonos-8",
    stepType: "blitz_challenge",
    question: "¿Cómo se llama el 'bono' más famoso en México?",
    options: [
      { id: "1", label: "Dólares", isCorrect: false },
      { id: "2", label: "Cetes", isCorrect: true },
      { id: "3", label: "Tandas", isCorrect: false }
    ],
    timeLimit: 12
  },
  {
    id: "bonos-9",
    stepType: "order",
    question: "Ordena los emisores de MAYOR a MENOR seguridad percibida",
    items: [
      { id: "1", label: "Gobierno de EE.UU.", correctOrder: 1 },
      { id: "2", label: "Gobierno de México", correctOrder: 2 },
      { id: "3", label: "Empresa Multinacional (Apple)", correctOrder: 3 },
      { id: "4", label: "Startup Tecnológica", correctOrder: 4 }
    ]
  },
  {
    id: "bonos-10",
    stepType: "match",
    question: "Conecta el término con su significado",
    leftItems: [
      { id: "l1", label: "Vencimiento" },
      { id: "l2", label: "Cupón" },
      { id: "l3", label: "Valor Nominal" }
    ],
    rightItems: [
      { id: "r1", label: "Fecha en que te devuelven el capital" },
      { id: "r2", label: "Interés que te pagan periódicamente" },
      { id: "r3", label: "Precio base del título" }
    ],
    correctPairs: [
      { leftId: "l1", rightId: "r1" },
      { leftId: "l2", rightId: "r2" },
      { leftId: "l3", rightId: "r3" }
    ]
  },
  {
    id: "bonos-11",
    stepType: "mindset_translator",
    question: "Traduce la obsesión por ganar más",
    beliefs: [
      {
        id: "b1",
        original: "No quiero bonos porque pagan muy poquito, quiero todo en acciones del momento.",
        healthyOptions: [
          { id: "h1", label: "Los bonos son mi ancla de supervivencia para que la tormenta no me hunda.", isCorrect: true },
          { id: "h2", label: "Solo los que no saben invertir usan bonos.", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: "bonos-12",
    stepType: "blitz_challenge",
    question: "Misión: ¿Cuál es la función del ancla (bonos)?",
    options: [
      { id: "1", label: "Hacer el portafolio pesado", isCorrect: false },
      { id: "2", label: "Reducir la volatilidad del portafolio", isCorrect: true },
      { id: "3", label: "Gritar 'Tierra a la vista'", isCorrect: false }
    ],
    timeLimit: 10
  },
  {
    id: "bonos-13",
    stepType: "narrative_check",
    question: "Análisis de Plazo",
    body: "Si sabes que el dinero de la renta lo necesitas el próximo lunes, ¿por qué sería un error de ingeniería meterlo a la bolsa hoy hoy mismo?",
    placeholder: "Sería un error porque...",
    minChars: 30
  },
  {
    id: "bonos-14",
    stepType: "summary",
    title: "Estabilidad Estructural",
    body: "Has entendido que los bonos son la base sólida de tu edificio financiero. Te dan la paz mental necesaria para dejar que tus acciones y ETFs crezcan sin pánico.",
    aiInsight: "Un buen inversionista duerme tranquilo gracias a sus bonos."
  },
  {
    id: "bonos-15",
    stepType: "billy_talks",
    body: "¡Magnífico! Ya conoces los instrumentos principales. Ahora vamos a ver la diferencia entre el Bizen Indexing y los Fondos de Inversión tradicionales.",
    mood: "happy"
  }
];

// ---------------------------------------------------------------------------
// LECCIÓN 13: ¿Qué son los fondos de inversión?
// Slug: "instrumentos-fondos"
// ---------------------------------------------------------------------------
export const lessonInstrumentosFondosSteps: LessonStep[] = [
  {
    id: "fondos-1",
    stepType: "billy_talks",
    title: "La Apuesta Tradicional",
    body: "Antes de los ETFs existían (y existen) los [[Fondos de Inversión|Pooled capital gestionado por profesionales]]. Pero no todos son iguales. Vamos a detectar las trampas de comisiones.",
    data: {
      glossary: [
        { word: "Fondos Mutuos", definition: "Fondos de gestión activa donde un gestor elige qué comprar y vender." },
        { word: "Comisión de Gestión", definition: "Porcentaje que el fondo te cobra cada año solo por existir, ganes o pierdas." }
      ]
    }
  },
  {
    id: "fondos-2",
    stepType: "info",
    title: "Gestión Activa vs Pasiva",
    aiInsight: "En el 90% de los casos, pagarle a un 'experto' para que elija acciones sale más caro que simplemente copiar al mercado con un ETF.",
    body: "Un [[Fondo de Inversión Activo|Buscando ganarle al mercado]] te cobra comisiones altas (2% o más). Un fondo pasivo (ETF) cobra casi nada (0.03%). Con el tiempo, esa diferencia es de cientos de miles de pesos.",
    imageUrl: "/lessons/bi-active-vs-passive.png"
  },
  {
    id: "fondos-3",
    stepType: "impulse_meter",
    item: {
      name: "Asesor del Banco",
      price: "'Invierta en nuestro fondo exclusivo'",
    },
    instructions: "Tu banco te ofrece un fondo que promete ganarle a Wall Street pero cobra 3% de comisión. ¿Qué tanto te convence su traje?",
    data: {
      minLabel: "Cero (Leo las letras chiquitas)",
      maxLabel: "Me convence (Confianza)",
      targetValue: 1
    }
  },
  {
    id: "fondos-4",
    stepType: "mcq",
    question: "¿Qué pasa con tu dinero si un fondo te cobra 2% anual y inviertes a 30 años?",
    options: [
      { id: "1", label: "No pasa nada, es solo el 2%", isCorrect: false },
      { id: "2", label: "Puedes perder casi el 40% de tu ganancia potencial solo en comisiones", isCorrect: true, explanation: "Correcto. El interés compuesto inverso de las comisiones es devastador." },
      { id: "3", label: "El banco te lo devuelve al final", isCorrect: false }
    ]
  },
  {
    id: "fondos-5",
    stepType: "info",
    title: "La democratización del capital",
    body: "Gracias a la tecnología BIZEN, hoy tú tienes acceso a los mismos instrumentos que los millonarios sin tener que pagarle a intermediarios costosos. Eres tu propio gestor mediante ETFs.",
    imageUrl: "/lessons/bi-freedom.png"
  },
  {
    id: "fondos-6",
    stepType: "swipe_sorter",
    question: "Identifica la ventaja",
    leftBucket: { label: "Gestión Pasiva (ETF)", color: "#10b981" },
    rightBucket: { label: "Gestión Activa (Fondo)", color: "#6b7280" },
    items: [
      { id: "1", label: "Bajísimas comisiones", correctBucket: "left" },
      { id: "2", label: "Promesa de ganarle al mercado", correctBucket: "right" },
      { id: "3", label: "Copiar un índice (ej. S&P500)", correctBucket: "left" },
      { id: "4", label: "Un humano decide qué comprar", correctBucket: "right" }
    ]
  },
  {
    id: "fondos-7",
    stepType: "true_false",
    statement: "La mayoría de los fondos de inversión bancarios logran ganarle al S&P 500 a largo plazo.",
    correctValue: false,
    explanation: "Las estadísticas muestran que más del 90% de los gestores activos pierden contra el mercado simple después de 10 años."
  },
  {
    id: "fondos-8",
    stepType: "blitz_challenge",
    question: "¿Qué es el 'Gasto de Administración'?",
    options: [
      { id: "1", label: "La luz de la oficina", isCorrect: false },
      { id: "2", label: "La comisión anual del fondo", isCorrect: true },
      { id: "3", label: "El sueldo del CEO", isCorrect: false }
    ],
    timeLimit: 12
  },
  {
    id: "fondos-9",
    stepType: "order",
    question: "Ordena los costos de MENOR a MAYOR (Eficiencia)",
    items: [
      { id: "1", label: "ETF Indexado (ej. VOO)", correctOrder: 1 },
      { id: "2", label: "Fondo de Inversión Digital", correctOrder: 2 },
      { id: "3", label: "Fondo de Inversión Bancario", correctOrder: 3 },
      { id: "4", label: "Hedge Fund (Fondo de Cobertura)", correctOrder: 4 }
    ]
  },
  {
    id: "fondos-10",
    stepType: "match",
    question: "Relaciona el beneficio con el fondo",
    leftItems: [
      { id: "l1", label: "ETF" },
      { id: "l2", label: "Fondo Mutuo" },
      { id: "l3", label: "REITs" }
    ],
    rightItems: [
      { id: "r1", label: "Eficiencia y Transparencia" },
      { id: "r2", label: "Gestión Humana y Sesgos" },
      { id: "r3", label: "Exposición a Bienes Raíces" }
    ],
    correctPairs: [
      { leftId: "l1", rightId: "r1" },
      { leftId: "l2", rightId: "r2" },
      { leftId: "l3", rightId: "r3" }
    ]
  },
  {
    id: "fondos-11",
    stepType: "mindset_translator",
    question: "Traduce la confianza ciega",
    beliefs: [
      {
        id: "b1",
        original: "Confío en mi banco porque ellos son los expertos en finanzas.",
        healthyOptions: [
          { id: "h1", label: "Confío en los datos y la eficiencia; los bancos venden productos, no siempre resultados.", isCorrect: true },
          { id: "h2", label: "Si el banco lo dice, debe ser lo mejor para mí.", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: "fondos-12",
    stepType: "blitz_challenge",
    question: "Misión: ¿Cuál es el factor X del éxito del Berkshire Hathaway (Warren Buffett)?",
    options: [
      { id: "1", label: "Suerte", isCorrect: false },
      { id: "2", label: "Interés compuesto y visión de décadas", isCorrect: true },
      { id: "3", label: "Tener información secreta", isCorrect: false }
    ],
    timeLimit: 10
  },
  {
    id: "fondos-13",
    stepType: "narrative_check",
    question: "Análisis de Costos",
    body: "Si dos fondos rinden 10% anual, pero uno cobra 0.1% y el otro 2%, ¿cuál será la diferencia real en tu cuenta tras 20 años de inversión constante?",
    placeholder: "La diferencia será... porque...",
    minChars: 30
  },
  {
    id: "fondos-14",
    stepType: "summary",
    title: "Control Total",
    body: "Has aprendido a diferenciar entre valor y marketing. No necesitas pagarle a nadie para que gestione tu futuro; las herramientas están en tus manos.",
    aiInsight: "En la bolsa, menos es más: menos comisiones es más dinero para ti."
  },
  {
    id: "fondos-15",
    stepType: "billy_talks",
    body: "¡Extraordinario! Has dominado los tipos de instrumentos. Ahora estamos listos para profundizar en cada uno, empezando por las Acciones.",
    mood: "mascot"
  }
];
