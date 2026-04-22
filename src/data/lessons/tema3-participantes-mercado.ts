import type { LessonStep } from "@/types/lessonTypes"

// ---------------------------------------------------------------------------
// LECCIÓN 4: ¿Quiénes son los inversionistas?
// Slug: "inversionistas"
// ---------------------------------------------------------------------------
export const lessonInversionistasSteps: LessonStep[] = [
  {
    id: "inversores-1",
    stepType: "billy_talks",
    title: "Los Jugadores del Mercado",
    body: "La bolsa no es solo números; es un ecosistema de personas y máquinas. Para ganar, necesitas saber quién está al otro lado de la pantalla. Bienvenido a la ingeniería de participantes.",
    data: {
      glossary: [
        { word: "Minorista", definition: "Inversionista individual que opera con su propio capital, usualmente en montos pequeños." },
        { word: "Institucional", definition: "Grandes entidades como bancos o fondos que mueven capital masivo del público." }
      ]
    }
  },
  {
    id: "inversores-2",
    stepType: "info",
    title: "Tú: El Inversionista Minorista",
    aiInsight: "La gran ventaja del minorista no es el dinero, es que no tiene que darle explicaciones a un jefe cada trimestre.",
    body: "Como [[Minorista|Inversionista individual o 'retail']], tienes la agilidad que los gigantes envidian. Puedes comprar y vender en segundos sin mover el precio del mercado. Eres el componente más libre del sistema.",
    imageUrl: "/lessons/bi-retail.png"
  },
  {
    id: "inversores-3",
    stepType: "impulse_meter",
    item: {
      name: "Noticia Sensacionalista",
      price: "'El mercado colapsará mañana'",
    },
    instructions: "Ves un encabezado alarmista en redes sociales. Sientes que debes actuar rápido. ¿Qué tanto controlas ese impulso?",
    data: {
      minLabel: "Ignoro el ruido",
      maxLabel: "Cierro sesiones",
      targetValue: 2
    }
  },
  {
    id: "inversores-4",
    stepType: "mcq",
    question: "¿Cuál es la característica principal de un inversionista Institucional?",
    options: [
      { id: "1", label: "Invierte solo su propio dinero", isCorrect: false },
      { id: "2", label: "Gestiona capital masivo de terceros (fondos, seguros)", isCorrect: true, explanation: "Correcto. Mueven el dinero de millones de personas a la vez." },
      { id: "3", label: "Solo invierte en empresas de tecnología", isCorrect: false }
    ]
  },
  {
    id: "inversores-5",
    stepType: "info",
    title: "Las Ballenas: Inversionistas Institucionales",
    body: "Los [[Institucionales|Bancos, AFOREs, Fondos de Inversión]] son los que realmente mueven los precios. Sus órdenes son tan grandes que tardan días en ejecutarse. Ellos proveen la liquidez que tú usas para entrar y salir.",
    imageUrl: "/lessons/bi-whale.png"
  },
  {
    id: "inversores-6",
    stepType: "swipe_sorter",
    question: "Clasifica al participante",
    leftBucket: { label: "Minorista", color: "#3b82f6" },
    rightBucket: { label: "Institucional", color: "#6366f1" },
    items: [
      { id: "1", label: "Tú comprando 2 acciones", correctBucket: "left" },
      { id: "2", label: "BlackRock gestionando trillones", correctBucket: "right" },
      { id: "3", label: "Un fondo de pensiones (AFORE)", correctBucket: "right" },
      { id: "4", label: "Un estudiante con $100 pesos", correctBucket: "left" }
    ]
  },
  {
    id: "inversores-7",
    stepType: "true_false",
    statement: "Los algoritmos de alta frecuencia (bots) realizan la mayoría de las transacciones hoy en día.",
    correctValue: true,
    explanation: "Más del 70% del volumen en Wall Street es ejecutado por software especializado, no por humanos."
  },
  {
    id: "inversores-8",
    stepType: "blitz_challenge",
    question: "¿Quién provee la mayor parte de la liquidez en el mercado?",
    options: [
      { id: "1", label: "Inversionistas individuales", isCorrect: false },
      { id: "2", label: "Inversionistas institucionales", isCorrect: true },
      { id: "3", label: "El banco central", isCorrect: false }
    ],
    timeLimit: 12
  },
  {
    id: "inversores-9",
    stepType: "order",
    question: "Ordena por VOLUMEN de capital gestionado (Menor a Mayor)",
    items: [
      { id: "1", label: "Inversionista Novato", correctOrder: 1 },
      { id: "2", label: "Inversionista Profesional (Retail)", correctOrder: 2 },
      { id: "3", label: "Hedge Fund (Fondo de cobertura)", correctOrder: 3 },
      { id: "4", label: "Administrador de Activos (BlackRock)", correctOrder: 4 }
    ]
  },
  {
    id: "inversores-10",
    stepType: "match",
    question: "Relaciona la ventaja con el jugador",
    leftItems: [
      { id: "l1", label: "Agilidad" },
      { id: "l2", label: "Volumen" },
      { id: "l3", label: "Velocidad (ms)" }
    ],
    rightItems: [
      { id: "r1", label: "Minorista (Retail)" },
      { id: "r2", label: "Institucional" },
      { id: "r3", label: "Algoritmos (HFT)" }
    ],
    correctPairs: [
      { leftId: "l1", rightId: "r1" },
      { leftId: "l2", rightId: "r2" },
      { leftId: "l3", rightId: "r3" }
    ]
  },
  {
    id: "inversores-11",
    stepType: "mindset_translator",
    question: "Traduce la paradoja del retail",
    beliefs: [
      {
        id: "b1",
        original: "No puedo ganar porque los grandes bancos controlan todo.",
        healthyOptions: [
          { id: "h1", label: "Los bancos mueven los barcos, pero yo elijo la ruta de largo plazo.", isCorrect: true },
          { id: "h2", label: "Necesito ser millonario para que el mercado me respete.", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: "inversores-12",
    stepType: "blitz_challenge",
    question: "¿Qué es el 'Retail' en finanzas?",
    options: [
      { id: "1", label: "Venta de ropa", isCorrect: false },
      { id: "2", label: "Inversionistas individuales", isCorrect: true },
      { id: "3", label: "Bancos centrales", isCorrect: false }
    ],
    timeLimit: 10
  },
  {
    id: "inversores-13",
    stepType: "narrative_check",
    question: "Reflexión Estratégica",
    body: "Si sabes que las ballenas (institucionales) mueven los precios, ¿por qué es mejor quedarte quieto en lugar de intentar predecir sus movimientos todos los días?",
    placeholder: "Es mejor quedarme quieto porque...",
    minChars: 30
  },
  {
    id: "inversores-14",
    stepType: "summary",
    title: "Conoce a tu competencia",
    body: "Has identificado quiénes son los actores. Recuerda: No compites contra ellos, usas la infraestructura que ellos mantienen para construir tu propio sistema.",
    aiInsight: "En la bolsa, los impacientes le pagan el sueldo a los pacientes."
  },
  {
    id: "inversores-15",
    stepType: "billy_talks",
    body: "¡Bien hecho! Ahora que conocemos a los jugadores, vamos a ver qué papel juegan las piezas clave: Las Empresas Listadas.",
    mood: "happy"
  }
];

// ---------------------------------------------------------------------------
// LECCIÓN 5: ¿Qué papel juegan las empresas listadas?
// Slug: "empresas-listadas"
// ---------------------------------------------------------------------------
export const lessonEmpresasListadasSteps: LessonStep[] = [
  {
    id: "empresas-1",
    stepType: "billy_talks",
    title: "El Alma del Mercado",
    body: "Sin empresas, la bolsa sería un desierto. Vamos a entender por qué una compañía decide compartir su propiedad contigo y qué responsabilidad tiene ahora.",
    data: {
      glossary: [
        { word: "IPO", definition: "Oferta Pública Inicial: El momento en que una empresa privada se vuelve pública por primera vez." },
        { word: "Accionista", definition: "Persona o entidad que posee al menos una acción de una empresa, siendo socio legal de la misma." }
      ]
    }
  },
  {
    id: "empresas-2",
    stepType: "info",
    title: "Privada vs. Pública",
    aiInsight: "Una empresa pública no tiene un dueño, tiene millones de jefes llamados accionistas.",
    body: "Una [[Empresa Privada|Controlada por fundadores o pocos socios]] tiene total libertad pero capital limitado. Una [[Empresa Pública|Listada en bolsa]] tiene capital infinito pero debe ser totalmente transparente con sus finanzas.",
    imageUrl: "/lessons/bi-company-types.png"
  },
  {
    id: "empresas-3",
    stepType: "impulse_meter",
    item: {
      name: "Reporte de Ganancias",
      price: "-2% después del reporte",
    },
    instructions: "Tu empresa favorita reporta ganancias sólidas pero el precio cae 2% porque 'no fue lo esperado'. ¿Cómo reaccionas?",
    data: {
      minLabel: "Confío en los datos",
      maxLabel: "Dudo de la empresa",
      targetValue: 2
    }
  },
  {
    id: "empresas-4",
    stepType: "mcq",
    question: "¿Por qué una empresa decide salir a bolsa (IPO)?",
    options: [
      { id: "1", label: "Para ya no trabajar tanto", isCorrect: false },
      { id: "2", label: "Para obtener capital masivo y expandirse sin generar deuda", isCorrect: true, explanation: "Correcto. Es la forma más eficiente de financiar el crecimiento a escala global." },
      { id: "3", label: "Para regalar sus productos gratis", isCorrect: false }
    ]
  },
  {
    id: "empresas-5",
    stepType: "info",
    title: "Transparencia Obligatoria",
    body: "Al ser pública, una empresa debe publicar sus 'EEFF' (Estados Financieros) cada trimestre. Esto permite que el sistema BIZEN evalúe si la empresa es sana o si está quemando capital ineficientemente.",
    imageUrl: "/lessons/bi-transparency.png"
  },
  {
    id: "empresas-6",
    stepType: "swipe_sorter",
    question: "Clasifica el estatus corporativo",
    leftBucket: { label: "Pública (Bolsa)", color: "#10b981" },
    rightBucket: { label: "Privada", color: "#6b7280" },
    items: [
      { id: "1", label: "Apple Inc.", correctBucket: "left" },
      { id: "2", label: "La taquería de la esquina", correctBucket: "right" },
      { id: "3", label: "Microsoft", correctBucket: "left" },
      { id: "4", label: "Una startup nueva de 3 amigos", correctBucket: "right" }
    ]
  },
  {
    id: "empresas-7",
    stepType: "true_false",
    statement: "Al comprar una acción, te conviertes legalmente en copropietario de la empresa.",
    correctValue: true,
    explanation: "Eres dueño de una fracción proporcional de sus activos y derechos de voto en asambleas."
  },
  {
    id: "empresas-8",
    stepType: "blitz_challenge",
    question: "¿Qué significa que una empresa sea 'Transparente'?",
    options: [
      { id: "1", label: "Que no tiene paredes", isCorrect: false },
      { id: "2", label: "Que publica sus finanzas al público", isCorrect: true },
      { id: "3", label: "Que regala sus acciones", isCorrect: false }
    ],
    timeLimit: 12
  },
  {
    id: "empresas-9",
    stepType: "order",
    question: "Jerarquía de importancia en una empresa pública",
    items: [
      { id: "1", label: "Accionistas (Dueños)", correctOrder: 1 },
      { id: "2", label: "Consejo de Administración", correctOrder: 2 },
      { id: "3", label: "CEO (Director General)", correctOrder: 3 },
      { id: "4", label: "Empleados Operativos", correctOrder: 4 }
    ]
  },
  {
    id: "empresas-10",
    stepType: "match",
    question: "Conecta el evento con su efecto",
    leftItems: [
      { id: "l1", label: "Reporte de utilidades" },
      { id: "l2", label: "IPO" },
      { id: "l3", label: "Dividendo" }
    ],
    rightItems: [
      { id: "r1", label: "Corte de caja público" },
      { id: "r2", label: "Nacimiento en bolsa" },
      { id: "r3", label: "Reparto de ganancias" }
    ],
    correctPairs: [
      { leftId: "l1", rightId: "r1" },
      { leftId: "l2", rightId: "r2" },
      { leftId: "l3", rightId: "r3" }
    ]
  },
  {
    id: "empresas-11",
    stepType: "mindset_translator",
    question: "Traduce la visión de 'Dueño'",
    beliefs: [
      {
        id: "b1",
        original: "Solo soy un número en una aplicación de inversión.",
        healthyOptions: [
          { id: "h1", label: "Soy socio de las empresas que mueven la economía mundial.", isCorrect: true },
          { id: "h2", label: "Mi capital es insignificante para estas empresas.", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: "empresas-12",
    stepType: "blitz_challenge",
    question: "¿Cómo se llama el evento donde una empresa reparte utilidades?",
    options: [
      { id: "1", label: "Pago de intereses", isCorrect: false },
      { id: "2", label: "Pago de dividendos", isCorrect: true },
      { id: "3", label: "Reembolso de gastos", isCorrect: false }
    ],
    timeLimit: 10
  },
  {
    id: "empresas-13",
    stepType: "narrative_check",
    question: "Auditando el Valor",
    body: "Si pudieras ser dueño de solo una empresa pública en el mundo, ¿cuál elegirías basándote en su utilidad para la humanidad y no solo en su precio? ¿Por qué?",
    placeholder: "Elegiría a... porque...",
    minChars: 30
  },
  {
    id: "empresas-14",
    stepType: "summary",
    title: "Socio de Gigantes",
    body: "Ahora entiendes que las empresas no son entidades lejanas, son motores de producción de los que tú puedes ser socio. La bolsa es la herramienta que te da ese derecho legal.",
    aiInsight: "Invertir es comprar el trabajo productivo de otros."
  },
  {
    id: "empresas-15",
    stepType: "billy_talks",
    body: "Increíble. Ya tenemos a los jugadores y a las piezas. Solo nos falta el intermediario que conecta todo: El Broker. ¡Vamos!",
    mood: "thinking"
  }
];

// ---------------------------------------------------------------------------
// LECCIÓN 6: ¿Qué son los intermediarios corporativos?
// Slug: "intermediarios-casas-bolsa"
// ---------------------------------------------------------------------------
export const lessonIntermediariosCasasBolsaSteps: LessonStep[] = [
  {
    id: "brokers-1",
    stepType: "billy_talks",
    title: "El Puente Tecnológico",
    body: "No puedes simplemente ir a las oficinas de Facebook y dejarles un fajo de billetes. Necesitas un [[Broker|Intermediario regulado que ejecuta tus órdenes]]. Vamos a ver cómo elegir el correcto.",
    data: {
      glossary: [
        { word: "Broker / Casa de Bolsa", definition: "Intermediario financiero que tiene autorización legal para operar en el mercado de valores." },
        { word: "Regulación", definition: "Conjunto de leyes y normas supervisadas por el gobierno para proteger al inversionista." }
      ]
    }
  },
  {
    id: "brokers-2",
    stepType: "info",
    title: "Tu mejor aliado: El Broker",
    aiInsight: "Un buen broker no es el que tiene más colores, es el que tiene las regulaciones más sólidas y las comisiones más claras.",
    body: "El broker es el software que conecta tu dinero con el motor de la bolsa. En México, estas instituciones se llaman Casas de Bolsa y están supervisadas por la CNBV.",
    imageUrl: "/lessons/bi-broker.png"
  },
  {
    id: "brokers-3",
    stepType: "impulse_meter",
    item: {
      name: "App Nueva de Inversión",
      price: "'Sin comisiones y bonos de regalo'",
    },
    instructions: "Aparece una app nueva que promete ganancias rápidas pero no mencionan regulaciones. ¿Qué tanto confías?",
    data: {
      minLabel: "Cero confianza (Huyo)",
      maxLabel: "Me registro (Hype)",
      targetValue: 1
    }
  },
  {
    id: "brokers-4",
    stepType: "mcq",
    question: "¿Qué es lo primero que debes revisar en un broker?",
    options: [
      { id: "1", label: "Que la aplicación sea bonita", isCorrect: false },
      { id: "2", label: "Que esté regulado por autoridades oficiales (CNBV, SEC, etc)", isCorrect: true, explanation: "Correcto. La regulación es lo único que protege legalmente tu capital." },
      { id: "3", label: "Que me den una tarjeta de crédito", isCorrect: false }
    ]
  },
  {
    id: "brokers-5",
    stepType: "info",
    title: "Regulación vs. Estafa",
    body: "Un sistema real BIZEN no opera en el limbo. Si no encuentras el registro de la institución en el gobierno de tu país, probablemente sea un 'casino' disfrazado de inversión. Busca siempre brokers con respaldo legal.",
    imageUrl: "/lessons/bi-shield-check.png"
  },
  {
    id: "brokers-6",
    stepType: "swipe_sorter",
    question: "Diferencia el tipo de entidad",
    leftBucket: { label: "Broker Real", color: "#10b981" },
    rightBucket: { label: "Esquema Dudoso", color: "#ef4444" },
    items: [
      { id: "1", label: "Casa de Bolsa Regulada", correctBucket: "left" },
      { id: "2", label: "Plataforma de 'Opciones Binarias'", correctBucket: "right" },
      { id: "3", label: "App que garantiza 10% semanal", correctBucket: "right" },
      { id: "4", label: "Institución con seguro de depósito", correctBucket: "left" }
    ]
  },
  {
    id: "brokers-7",
    stepType: "true_false",
    statement: "El broker es dueño de tus acciones y puede usarlas como quiera.",
    correctValue: false,
    explanation: "El broker es solo un custodio. Tú eres el dueño legal y tus títulos están registrados a tu nombre en instituciones centrales."
  },
  {
    id: "brokers-8",
    stepType: "blitz_challenge",
    question: "¿Quién regula a las casas de bolsa en México?",
    options: [
      { id: "1", label: "El banco central", isCorrect: false },
      { id: "2", label: "La CNBV", isCorrect: true },
      { id: "3", label: "Protección civil", isCorrect: false }
    ],
    timeLimit: 12
  },
  {
    id: "brokers-9",
    stepType: "order",
    question: "Camino de tu dinero hacia la inversión",
    items: [
      { id: "1", label: "Transferencia de tu banco al Broker", correctOrder: 1 },
      { id: "2", label: "Dinero aparece listo en el Broker", correctOrder: 2 },
      { id: "3", label: "Ejecución de orden de compra", correctOrder: 3 },
      { id: "4", label: "Registro de títulos en el Indeval", correctOrder: 4 }
    ]
  },
  {
    id: "brokers-10",
    stepType: "match",
    question: "Conecta el intermediario con su activo",
    leftItems: [
      { id: "l1", label: "Casa de Bolsa" },
      { id: "l2", label: "Banco" },
      { id: "l3", label: "Afore" }
    ],
    rightItems: [
      { id: "r1", label: "Acciones y ETFs" },
      { id: "r2", label: "Cuentas y Préstamos" },
      { id: "r3", label: "Fondo para el Retiro" }
    ],
    correctPairs: [
      { leftId: "l1", rightId: "r1" },
      { leftId: "l2", rightId: "r2" },
      { leftId: "l3", rightId: "r3" }
    ]
  },
  {
    id: "brokers-11",
    stepType: "mindset_translator",
    question: "Traduce la visión sobre comisiones",
    beliefs: [
      {
        id: "b1",
        original: "No quiero pagar comisiones, prefiero lo 'gratis'.",
        healthyOptions: [
          { id: "h1", label: "Prefiero comisiones transparentes que garanticen mi seguridad legal.", isCorrect: true },
          { id: "h2", label: "Si es gratis, yo soy el producto que venden.", isCorrect: true }
        ]
      }
    ]
  },
  {
    id: "brokers-12",
    stepType: "blitz_challenge",
    question: "¿Qué es el 'Spread' en una operación?",
    options: [
      { id: "1", label: "La ganancia del broker", isCorrect: false },
      { id: "2", label: "Diferencia entre precio de compra y venta", isCorrect: true },
      { id: "3", label: "Un tipo de mermelada financiera", isCorrect: false }
    ],
    timeLimit: 10
  },
  {
    id: "brokers-13",
    stepType: "narrative_check",
    question: "Auditando el Acceso",
    body: "Si encontraras una plataforma que te promete rendimientos garantizados sin regulación visible, ¿cuál sería tu primera red flag?",
    placeholder: "Mi primera red flag sería...",
    minChars: 30
  },
  {
    id: "brokers-14",
    stepType: "summary",
    title: "El Intermediario de Confianza",
    body: "Has entendido que el broker no es un obstáculo, es tu seguro de vida financiero. Elegir uno regulado es la primera gran decisión de ingeniería de tu portafolio.",
    aiInsight: "En finanzas, lo barato sale caro si no hay regulación de por medio."
  },
  {
    id: "brokers-15",
    stepType: "billy_talks",
    body: "¡Felicidades! Has completado el bloque de participantes. Ahora conoces a los jugadores, las piezas y el tablero. Estás listo para los Conceptos Básicos de Inversión.",
    mood: "mascot"
  }
];
