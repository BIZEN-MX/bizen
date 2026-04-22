import type { LessonStep } from "@/types/lessonTypes"

// ---------------------------------------------------------------------------
// LECCIÓN 8.1: ¿Cómo abrir una cuenta?
// Slug: "abrir-cuenta-inversion"
// ---------------------------------------------------------------------------
export const lessonAbrirCuentaInversionSteps: LessonStep[] = [
  {
    id: "abrir-cuenta-1",
    stepType: "billy_talks",
    title: "El Umbral del Inversor",
    body: "Hasta hace poco, invertir era exclusivo de los trajes caros. Hoy, el [[Broker Digital|Plataforma que conecta a inversionistas con el mercado de valores]] está en tu celular. Vamos a abrir la puerta.",
    data: {
      glossary: [
        { word: "Broker", definition: "Intermediario financiero que ejecuta órdenes de compra y venta por cuenta de sus clientes." },
        { word: "KYC", definition: "Know Your Customer: Proceso de verificación de identidad obligatorio por ley." }
      ]
    }
  },
  {
    id: "abrir-cuenta-2",
    stepType: "info",
    title: "Requisitos de Ley",
    aiInsight: "Un broker regulado siempre te pedirá identificación; si no lo hace, es una estafa.",
    body: "Para abrir tu cuenta necesitas: 1. Identificación Oficial (INE), 2. Comprobante de Domicilio y 3. Tu RFC/CURP. Es un proceso legal para proteger tu capital.",
    imageUrl: "/lessons/bi-onboarding.png"
  },
  {
    id: "abrir-cuenta-3",
    stepType: "impulse_meter",
    item: {
      name: "App de 'Trading' Fácil",
      price: "Promesa de 100% ganancia",
    },
    instructions: "Ves una publicidad de una app que no te pide documentos y promete hacerte rico. ¿Qué dice tu filtro de seguridad?",
    data: {
      minLabel: "Es Fraude (Bloqueo)",
      maxLabel: "Me registro (Fácil)",
      targetValue: 1
    }
  },
  {
    id: "abrir-cuenta-4",
    stepType: "mcq",
    question: "¿Qué es el proceso KYC?",
    options: [
      { id: "1", label: "Un tipo de criptomoneda", isCorrect: false },
      { id: "2", label: "El proceso obligatorio de verificación de identidad del cliente", isCorrect: true, explanation: "Correcto. Sirve para prevenir fraude y lavado de dinero." },
      { id: "3", label: "Una oferta de bienvenida", isCorrect: false }
    ]
  },
  {
    id: "abrir-cuenta-5",
    stepType: "info",
    title: "La Cuenta CLABE Bursátil",
    body: "Una vez aprobada tu cuenta, se te asignará una CLABE única. Para fondearla, simplemente haces un SPEI desde tu app bancaria. Es tan seguro como transferirle a un amigo.",
    imageUrl: "/lessons/bi-transfer-safe.png"
  },
  {
    id: "abrir-cuenta-6",
    stepType: "swipe_sorter",
    question: "Identifica la acción de seguridad",
    leftBucket: { label: "Seguro (Broker Real)", color: "#10b981" },
    rightBucket: { label: "Peligro (Estafa)", color: "#ef4444" },
    items: [
      { id: "1", label: "Te piden tu INE y RFC", correctBucket: "left" },
      { id: "2", label: "Te piden depositar en OXXO a una persona", correctBucket: "right" },
      { id: "3", label: "Te piden un comprobante de domicilio", correctBucket: "left" },
      { id: "4", label: "Te garantizan rendimientos fijos altísimos", correctBucket: "right" }
    ]
  },
  {
    id: "abrir-cuenta-7",
    stepType: "true_false",
    statement: "Al abrir una cuenta en un broker regulado, el dinero que depositas está protegido por autoridades financieras.",
    correctValue: true,
    explanation: "Cierto. Los brokers regulados deben cumplir con leyes estrictas de protección al inversionista."
  },
  {
    id: "abrir-cuenta-8",
    stepType: "blitz_challenge",
    question: "¿Quién regula los brokers en México?",
    options: [
      { id: "1", label: "La policía local", isCorrect: false },
      { id: "2", label: "La CNBV y Banxico", isCorrect: true },
      { id: "3", label: "El club de comercio", isCorrect: false }
    ],
    timeLimit: 12
  },
  {
    id: "abrir-cuenta-9",
    stepType: "order",
    question: "Flujo de apertura de cuenta",
    items: [
      { id: "1", label: "Descarga de la App oficial", correctOrder: 1 },
      { id: "2", label: "Registro de datos y carga de INE", correctOrder: 2 },
      { id: "3", label: "Firma digital del contrato", correctOrder: 3 },
      { id: "4", label: "Asignación de CLABE bursátil", correctOrder: 4 }
    ]
  },
  {
    id: "abrir-cuenta-10",
    stepType: "match",
    question: "Relaciona el dato con su uso",
    leftItems: [
      { id: "l1", label: "RFC" },
      { id: "l2", label: "Beneficiarios" },
      { id: "l3", label: "Contrato" }
    ],
    rightItems: [
      { id: "r1", label: "Para temas fiscales" },
      { id: "r2", label: "Quién cobra si tú faltas" },
      { id: "r3", label: "Términos legales del servicio" }
    ],
    correctPairs: [
      { leftId: "l1", rightId: "r1" },
      { leftId: "l2", rightId: "r2" },
      { leftId: "l3", rightId: "r3" }
    ]
  },
  {
    id: "abrir-cuenta-11",
    stepType: "mindset_translator",
    question: "Traduce la barrera de entrada",
    beliefs: [
      {
        id: "b1",
        original: "Tengo que ir a una oficina en Reforma para abrir mi cuenta.",
        healthyOptions: [
          { id: "h1", label: "Abro mi portal al mercado global desde mi sillón en 10 minutos.", isCorrect: true },
          { id: "h2", label: "Si no hay oficina física, no es confiable.", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: "abrir-cuenta-12",
    stepType: "blitz_challenge",
    question: "Misión: ¿Cuál es el primer paso tras abrir la cuenta?",
    options: [
      { id: "1", label: "Comprar todo de golpe", isCorrect: false },
      { id: "2", label: "Hacer un fondeo de prueba (ej. $100)", isCorrect: true },
      { id: "3", label: "Cerrar la app", isCorrect: false }
    ],
    timeLimit: 10
  },
  {
    id: "abrir-cuenta-13",
    stepType: "narrative_check",
    question: "Compromiso de Seguridad",
    body: "Si un 'experto' te contacta por WhatsApp diciendo que trabaja para tu broker y necesita tu contraseña para 'configurar' tu cuenta, ¿qué haces?",
    placeholder: "Yo haría... porque...",
    minChars: 30
  },
  {
    id: "abrir-cuenta-14",
    stepType: "summary",
    title: "Puerta Abierta",
    body: "Has cruzado el umbral. Ahora posees un vehículo de inversión real y legal. Estás oficialmente en el juego del 1% global.",
    aiInsight: "La cuenta de inversión es tu gimnasio financiero."
  },
  {
    id: "abrir-cuenta-15",
    stepType: "billy_talks",
    body: "¡Felicidades! Ahora vamos a ver cómo elegir la mejor plataforma entre tantas opciones.",
    mood: "happy"
  }
];

// ---------------------------------------------------------------------------
// LECCIÓN 8.2: ¿Cuál plataforma elegir?
// Slug: "elegir-plataforma"
// ---------------------------------------------------------------------------
export const lessonElegirPlataformaSteps: LessonStep[] = [
  {
    id: "elegir-plat-1",
    stepType: "billy_talks",
    title: "Tu Cuartel General",
    body: "No todos los brokers son iguales. Algunos son casinos disfrazados; otros son herramientas de ingeniería seria. Vamos a elegir tu cuartel.",
    data: {
      glossary: [
        { word: "Comisión de Transacción", definition: "Costo que el broker te cobra por cada compra o venta de acciones." },
        { word: "Custodia", definition: "Servicio de resguardar tus títulos valores de forma segura." }
      ]
    }
  },
  {
    id: "elegir-plat-2",
    stepType: "info",
    title: "El Filtro de Calidad",
    aiInsight: "Busca una plataforma que te haga la vida fácil, no que te llene de luces y apuestas.",
    body: "Para BIZEN, una buena plataforma debe ser: 1. Regulada, 2. Con bajas comisiones y 3. Con acceso al [[SIC|Sistema Internacional de Cotizaciones: Donde compras acciones mundiales en México]].",
    imageUrl: "/lessons/bi-platform-choice.png"
  },
  {
    id: "elegir-plat-3",
    stepType: "impulse_meter",
    item: {
      name: "Plataforma de 'Trading' Gamificada",
      price: "Con luces y emojis en cada clic",
    },
    instructions: "La app se siente como un juego de casino. Te invita a operar cada segundo. ¿Qué tanta desconfianza te genera?",
    data: {
      minLabel: "Huyo (Busco seriedad)",
      maxLabel: "Me encanta (Divertido)",
      targetValue: 1
    }
  },
  {
    id: "elegir-plat-4",
    stepType: "mcq",
    question: "¿Cuál es el factor más importante al elegir broker?",
    options: [
      { id: "1", label: "Que los colores sean bonitos", isCorrect: false },
      { id: "2", label: "Que esté regulado por las autoridades financieras locales", isCorrect: true, explanation: "Correcto. Sin regulación, no tienes ninguna garantía legal sobre tu dinero." },
      { id: "3", label: "Que me regalen una acción de $10 pesos", isCorrect: false }
    ]
  },
  {
    id: "elegir-plat-5",
    stepType: "info",
    title: "Comisiones: El Enemigo Silencioso",
    body: "Pagar 1% de comisión por cada compra devora tu rendimiento a largo plazo. Busca brokers con comisiones bajas (ej. 0.25% o menos). Cada peso cuenta.",
    imageUrl: "/lessons/bi-fees-drain.png"
  },
  {
    id: "elegir-plat-6",
    stepType: "swipe_sorter",
    question: "Identifica la plataforma ganadora",
    leftBucket: { label: "Elegir (BIZEN)", color: "#10b981" },
    rightBucket: { label: "Descartar", color: "#ef4444" },
    items: [
      { id: "1", label: "Regulada por la CNBV", correctBucket: "left" },
      { id: "2", label: "Broker extranjero sin registro en mi país", correctBucket: "right" },
      { id: "3", label: "Comisiones transparentes y bajas", correctBucket: "left" },
      { id: "4", label: "Te prometen duplicar dinero en forex", correctBucket: "right" }
    ]
  },
  {
    id: "elegir-plat-7",
    stepType: "true_false",
    statement: "Un broker aburrido con pocos botones suele ser mejor para un inversionista serio que uno lleno de noticias y gráficos.",
    correctValue: true,
    explanation: "Efectivamente. Menos ruido visual significa menos decisiones emocionales y más enfoque en tu estrategia."
  },
  {
    id: "elegir-plat-8",
    stepType: "blitz_challenge",
    question: "¿Qué es el SIC?",
    options: [
      { id: "1", label: "Sistema de Impuestos", isCorrect: false },
      { id: "2", label: "Sistema Internacional de Cotizaciones", isCorrect: true },
      { id: "3", label: "Sociedad de Inversión Civil", isCorrect: false }
    ],
    timeLimit: 12
  },
  {
    id: "elegir-plat-9",
    stepType: "order",
    question: "Checklist de elección",
    items: [
      { id: "1", label: "Verificar regulación gubernamental", correctOrder: 1 },
      { id: "2", label: "Comparar tabla de comisiones", correctOrder: 2 },
      { id: "3", label: "Revisar disponibilidad de ETFs", correctOrder: 3 },
      { id: "4", label: "Probar facilidad de la interfaz", correctOrder: 4 }
    ]
  },
  {
    id: "elegir-plat-10",
    stepType: "match",
    question: "Relaciona la plataforma con su fuerte",
    leftItems: [
      { id: "l1", label: "GBM+ (México)" },
      { id: "l2", label: "Interactive Brokers" },
      { id: "l3", label: "CetesDirecto" }
    ],
    rightItems: [
      { id: "r1", label: "Acceso fácil a bolsa nacional/global" },
      { id: "r2", label: "Trader profesional global" },
      { id: "r3", label: "Inversión directa en deuda de gobierno" }
    ],
    correctPairs: [
      { leftId: "l1", rightId: "r1" },
      { leftId: "l2", rightId: "r2" },
      { leftId: "l3", rightId: "r3" }
    ]
  },
  {
    id: "elegir-plat-11",
    stepType: "mindset_translator",
    question: "Traduce la flojera de comparar",
    beliefs: [
      {
        id: "b1",
        original: "Usaré la app que usa mi influencer favorito porque se ve 'cool'.",
        healthyOptions: [
          { id: "h1", label: "Elijo la plataforma basada en costos, seguridad y acceso real a mercados.", isCorrect: true },
          { id: "h2", label: "La estética es lo más importante en finanzas.", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: "elegir-plat-12",
    stepType: "blitz_challenge",
    question: "Misión: ¿Cuál es el gasto anual ideal de comisión?",
    options: [
      { id: "1", label: "0%", isCorrect: true },
      { id: "2", label: "5%", isCorrect: false },
      { id: "3", label: "Nadie cobra 0%", isCorrect: false }
    ],
    timeLimit: 10
  },
  {
    id: "elegir-plat-13",
    stepType: "narrative_check",
    question: "Criterio de Selección",
    body: "Si encontraras una plataforma que cobra 0 comisiones pero su dueño es desconocido y no está regulada, ¿invertirías ahí tu patrimonio? ¿Por qué?",
    placeholder: "No invertiría porque... o Sí invertiría porque...",
    minChars: 30
  },
  {
    id: "elegir-plat-14",
    stepType: "summary",
    title: "Herramienta Seleccionada",
    body: "Has aprendido a distinguir entre una herramienta de construcción de riqueza y una trampa marketera. Tu cuartel está listo para la acción.",
    aiInsight: "Tu broker es tu aliado táctico, elígelo con la mente, no con el impulso."
  },
  {
    id: "elegir-plat-15",
    stepType: "billy_talks",
    body: "¡Magnífico! Ya tenemos la cuenta y la plataforma. Ahora vamos a dar los primeros pasos prácticos.",
    mood: "happy"
  }
];

// ---------------------------------------------------------------------------
// LECCIÓN 8.3: Primeros pasos prácticos
// Slug: "primeros-pasos-inversion"
// ---------------------------------------------------------------------------
export const lessonPrimerosPasosInversionSteps: LessonStep[] = [
  {
    id: "prim-pasos-1",
    stepType: "billy_talks",
    title: "Iniciación al Fuego",
    body: "Ya tienes el auto, ahora vamos a encender el motor. Perder el miedo es el primer paso para dominar el sistema financiero.",
    data: {
      glossary: [
        { word: "Fondeo", definition: "Acción de transferir dinero desde tu cuenta bancaria hacia tu cuenta de inversión." },
        { word: "Orden de Compra", definition: "Instrucción formal que le das al broker para adquirir un activo." }
      ]
    }
  },
  {
    id: "prim-pasos-2",
    stepType: "info",
    title: "Paso 1: El Fondeo de Prueba",
    aiInsight: "No necesitas miles de pesos para empezar; necesitas el hábito de transferir.",
    body: "Transfiere tus primeros $100 MXN vía SPEI. Ver que el dinero llega a tu broker es el momento donde la teoría se vuelve realidad tangible.",
    imageUrl: "/lessons/bi-first-transfer.png"
  },
  {
    id: "prim-pasos-3",
    stepType: "impulse_meter",
    item: {
      name: "Tus primeros $100",
      price: "Ya en la cuenta del broker",
    },
    instructions: "Sientes el impulso de gastarlos o simplemente dejarlos ahí sin hacer nada. ¿Qué tan rápido quieres verlos trabajar?",
    data: {
      minLabel: "Calculo y ejecuto",
      maxLabel: "Los dejo en efectivo",
      targetValue: 2
    }
  },
  {
    id: "prim-pasos-4",
    stepType: "mcq",
    question: "¿Qué pasa si solo transfieres dinero al broker pero no compras nada?",
    options: [
      { id: "1", label: "Tu dinero ya está invertido", isCorrect: false },
      { id: "2", label: "Tu dinero está en efectivo y no genera rendimientos (está ocioso)", isCorrect: true, explanation: "Correcto. El broker es solo el estacionamiento; comprar el activo es lo que lo pone a trabajar." },
      { id: "3", label: "El broker te castiga con multas", isCorrect: false }
    ]
  },
  {
    id: "prim-pasos-5",
    stepType: "info",
    title: "Paso 2: Tu Primera Compra",
    body: "Busca un activo de bajo costo o una fracción. Comprar tu primer pedazo de empresa o ETF es el rito de pasaje del Inversionista BIZEN. Nada vuelve a ser igual.",
    imageUrl: "/lessons/bi-first-buy.png"
  },
  {
    id: "prim-pasos-6",
    stepType: "swipe_sorter",
    question: "Identifica el orden correcto",
    leftBucket: { label: "Correcto", color: "#10b981" },
    rightBucket: { label: "Incorrecto", color: "#ef4444" },
    items: [
      { id: "1", label: "Fondear -> Análisis -> Comprar", correctBucket: "left" },
      { id: "2", label: "Comprar -> Fondear -> Análisis", correctBucket: "right" },
      { id: "3", label: "Análisis -> Fondear -> Comprar", correctBucket: "left" },
      { id: "4", label: "Rezar -> Comprar -> Esperar", correctBucket: "right" }
    ]
  },
  {
    id: "prim-pasos-7",
    stepType: "true_false",
    statement: "Puedes empezar a invertir con menos de lo que cuesta una cena en un restaurante.",
    correctValue: true,
    explanation: "Totalmente cierto. Hay activos y acciones fraccionadas desde $20 pesos."
  },
  {
    id: "prim-pasos-8",
    stepType: "blitz_challenge",
    question: "¿Qué es el 'Capital Ocioso'?",
    options: [
      { id: "1", label: "Dinero en vacaciones", isCorrect: false },
      { id: "2", label: "Dinero en efectivo sin invertir", isCorrect: true },
      { id: "3", label: "Dinero que se perdió", isCorrect: false }
    ],
    timeLimit: 12
  },
  {
    id: "prim-pasos-9",
    stepType: "order",
    question: "Tus primeras 24 horas como Inversor",
    items: [
      { id: "1", label: "Fondeo vía SPEI", correctOrder: 1 },
      { id: "2", label: "Búsqueda del Ticker (ej. VOO)", correctOrder: 2 },
      { id: "3", label: "Ejecución de orden de compra", correctOrder: 3 },
      { id: "4", label: "Ver tu portafolio actualizado", correctOrder: 4 }
    ]
  },
  {
    id: "prim-pasos-10",
    stepType: "match",
    question: "Relaciona la acción con su resultado",
    leftItems: [
      { id: "l1", label: "Clic en 'Comprar'" },
      { id: "l2", label: "Clic en 'Vender'" },
      { id: "l3", label: "Mantener (Hold)" }
    ],
    rightItems: [
      { id: "r1", label: "Adquieres la propiedad" },
      { id: "r2", label: "Liquidamos la propiedad" },
      { id: "r3", label: "Dejamos que el tiempo trabaje" }
    ],
    correctPairs: [
      { leftId: "l1", rightId: "r1" },
      { leftId: "l2", rightId: "r2" },
      { leftId: "l3", rightId: "r3" }
    ]
  },
  {
    id: "prim-pasos-11",
    stepType: "mindset_translator",
    question: "Traduce el miedo a equivocarse",
    beliefs: [
      {
        id: "b1",
        original: "Si aprieto un botón mal, voy a perder todos mis ahorros.",
        healthyOptions: [
          { id: "h1", label: "Empiezo con poco para aprender la mecánica sin poner en riesgo mi paz mental.", isCorrect: true },
          { id: "h2", label: "Mejor no toco nada hasta que sepa todo.", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: "prim-pasos-12",
    stepType: "blitz_challenge",
    question: "Misión: ¿Cuál es el mejor día para empezar?",
    options: [
      { id: "1", label: "Mañana", isCorrect: false },
      { id: "2", label: "Hoy mismo", isCorrect: true },
      { id: "3", label: "Cuando el mercado baje", isCorrect: false }
    ],
    timeLimit: 10
  },
  {
    id: "prim-pasos-13",
    stepType: "narrative_check",
    question: "Primeras Sensaciones",
    body: "Describe cómo te sentirás cuando veas que en tu celular aparece que eres dueño de un pedazo de la economía mundial. ¿Qué le dirías a tu 'yo' del pasado?",
    placeholder: "Me sentiré... Le diría...",
    minChars: 30
  },
  {
    id: "prim-pasos-14",
    stepType: "summary",
    title: "Inversor Activo",
    body: "Has salido de la banca y estás en la cancha. El primer paso es el más difícil; los que siguen son puro sistema y disciplina.",
    aiInsight: "La acción vence a la perfección."
  },
  {
    id: "prim-pasos-15",
    stepType: "billy_talks",
    body: "¡Impresionante! Ya eres un operador. Ahora vamos a profundizar en la mecánica de compra y venta y los tipos de órdenes.",
    mood: "happy"
  }
];

// ---------------------------------------------------------------------------
// LECCIÓN 9.1: ¿Cómo se compra y vende en bolsa?
// Slug: "compra-venta-bolsa"
// ---------------------------------------------------------------------------
export const lessonCompraVentaBolsaSteps: LessonStep[] = [
  {
    id: "compra-venta-1",
    stepType: "billy_talks",
    title: "El Mercado Abierto",
    body: "La bolsa no es un lugar físico lleno de gente gritando; es una red global de computadoras. Vamos a ver cómo viaja tu orden al otro lado del mundo.",
    data: {
      glossary: [
        { word: "Mercado Secundario", definition: "Donde los inversores compran y venden activos ya emitidos entre ellos." },
        { word: "Liquidez", definition: "Facilidad con la que un activo se puede comprar o vender sin afectar su precio." }
      ]
    }
  },
  {
    id: "compra-venta-2",
    stepType: "info",
    title: "La Oferta y la Demanda",
    aiInsight: "El precio es simplemente un acuerdo temporal entre alguien que quiere salir y alguien que quiere entrar.",
    body: "Cuando das clic en comprar, el sistema busca en milisegundos a alguien que quiera vender ese mismo activo al precio que tú ofreces. Es un baile digital constante.",
    imageUrl: "/lessons/bi-order-match.png"
  },
  {
    id: "compra-venta-3",
    stepType: "impulse_meter",
    item: {
      name: "Precio subiendo rápido",
      price: "+1% en 10 minutos",
    },
    instructions: "Ves que el precio sube mientras intentas comprar. Sientes que 'te está dejando el tren'. ¿Qué haces?",
    data: {
      minLabel: "Mantengo mi estrategia",
      maxLabel: "Persigo el precio",
      targetValue: 2
    }
  },
  {
    id: "compra-venta-4",
    stepType: "mcq",
    question: "¿Qué sucede físicamente cuando compras una acción?",
    options: [
      { id: "1", label: "Te mandan un diploma a casa", isCorrect: false },
      { id: "2", label: "Se registra electrónicamente tu propiedad en una institución de custodia (ej. Indeval)", isCorrect: true, explanation: "Correcto. Ya no existen los títulos de papel; todo es digital y seguro." },
      { id: "3", label: "Le das el dinero al dueño de la empresa", isCorrect: false }
    ]
  },
  {
    id: "compra-venta-5",
    stepType: "info",
    title: "Horarios del Mercado",
    body: "La bolsa tiene horarios. En México, suele operar de 8:30 AM a 3:00 PM. Fuera de ese horario, las órdenes se quedan 'en espera' hasta la apertura del día siguiente.",
    imageUrl: "/lessons/bi-market-hours.png"
  },
  {
    id: "compra-venta-6",
    stepType: "swipe_sorter",
    question: "Identifica el rol",
    leftBucket: { label: "Comprador (Tú)", color: "#10b981" },
    rightBucket: { label: "Vendedor", color: "#ef4444" },
    items: [
      { id: "1", label: "Ofrece dinero por el título", correctBucket: "left" },
      { id: "2", label: "Entrega el título por dinero", correctBucket: "right" },
      { id: "3", label: "Busca plusvalía futura", correctBucket: "left" },
      { id: "4", label: "Busca liquidez inmediata", correctBucket: "right" }
    ]
  },
  {
    id: "compra-venta-7",
    stepType: "true_false",
    statement: "Si vendes una acción hoy, el dinero está disponible para retirarlo a tu banco en ese mismo instante.",
    correctValue: false,
    explanation: "El mercado tiene un periodo de liquidación (T+2). Tarda 48 horas hábiles en 'asentarse' antes de que puedas retirarlo físicamente."
  },
  {
    id: "compra-venta-8",
    stepType: "blitz_challenge",
    question: "¿Cómo se llama la facilidad de vender rápido?",
    options: [
      { id: "1", label: "Solvencia", isCorrect: false },
      { id: "2", label: "Liquidez", isCorrect: true },
      { id: "3", label: "Volatilidad", isCorrect: false }
    ],
    timeLimit: 12
  },
  {
    id: "compra-venta-9",
    stepType: "order",
    question: "Vida de una orden",
    items: [
      { id: "1", label: "Emisión de la instrucción en la App", correctOrder: 1 },
      { id: "2", label: "Transmisión a la bolsa de valores", correctOrder: 2 },
      { id: "3", label: "Matching con una contraparte", correctOrder: 3 },
      { id: "4", label: "Liquidación y registro de propiedad", correctOrder: 4 }
    ]
  },
  {
    id: "compra-venta-10",
    stepType: "match",
    question: "Relaciona el término técnico",
    leftItems: [
      { id: "l1", label: "Ticker" },
      { id: "l2", label: "Volumen" },
      { id: "l3", label: "Spread" }
    ],
    rightItems: [
      { id: "r1", label: "Símbolo de la acción (ej. AAPL)" },
      { id: "r2", label: "Cantidad de acciones operadas hoy" },
      { id: "r3", label: "Diferencia entre compra y venta" }
    ],
    correctPairs: [
      { leftId: "l1", rightId: "r1" },
      { leftId: "l2", rightId: "r2" },
      { leftId: "l3", rightId: "r3" }
    ]
  },
  {
    id: "compra-venta-11",
    stepType: "mindset_translator",
    question: "Traduce la impaciencia",
    beliefs: [
      {
        id: "b1",
        original: "Tengo que estar pegado a la pantalla viendo cómo se mueve el precio.",
        healthyOptions: [
          { id: "h1", label: "Confío en mi orden automatizada; el mercado trabaja para mí, no yo para él.", isCorrect: true },
          { id: "h2", label: "Si no miro, mi inversión va a desaparecer.", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: "compra-venta-12",
    stepType: "blitz_challenge",
    question: "Misión: ¿Qué es el Indeval?",
    options: [
      { id: "1", label: "Un banco", isCorrect: false },
      { id: "2", label: "Institución que guarda los títulos digitales", isCorrect: true },
      { id: "3", label: "Un tipo de impuesto", isCorrect: false }
    ],
    timeLimit: 10
  },
  {
    id: "compra-venta-13",
    stepType: "narrative_check",
    question: "Análisis de Mercado",
    body: "Si quieres vender una acción pero nadie en el mundo quiere comprarla en ese momento, ¿qué crees que pasaría con el precio y por qué es importante la liquidez?",
    placeholder: "El precio... y la liquidez es importante porque...",
    minChars: 30
  },
  {
    id: "compra-venta-14",
    stepType: "summary",
    title: "Maquinaria Sincronizada",
    body: "Has entendido el engranaje del mercado mundial. Comprar y vender es la parte física; mantener la calma es la parte espiritual del inversionista.",
    aiInsight: "La bolsa es una máquina de transferir dinero del impaciente al paciente."
  },
  {
    id: "compra-venta-15",
    stepType: "billy_talks",
    body: "¡Excelente! Ahora vamos a dominar el armamento: Los tipos de órdenes para comprar al mejor precio.",
    mood: "happy"
  }
];

// ---------------------------------------------------------------------------
// LECCIÓN 9.2: ¿Qué tipos de órdenes existen?
// Slug: "ordenes-basicas"
// ---------------------------------------------------------------------------
export const lessonOrdenesBasicasSteps: LessonStep[] = [
  {
    id: "ordenes-bas-1",
    stepType: "billy_talks",
    title: "El Control de tu Precio",
    body: "No siempre tienes que comprar al precio que el mercado dice hoy. Vamos a aprender a usar órdenes inteligentes para dominar el tablero.",
    data: {
      glossary: [
        { word: "Orden Limitada", definition: "Instrucción de comprar o vender solo a un precio específico o mejor." },
        { word: "Orden de Mercado", definition: "Instrucción de comprar o vender inmediatamente al mejor precio disponible." }
      ]
    }
  },
  {
    id: "ordenes-bas-2",
    stepType: "info",
    title: "Orden a Mercado (¡Ya!)",
    aiInsight: "Usa la orden a mercado cuando la rapidez es más importante que el último centavo.",
    body: "La [[Orden a Mercado|Comprar al precio actual]] garantiza que tendrás el activo al instante. Es ideal para activos muy líquidos como los ETFs grandes.",
    imageUrl: "/lessons/bi-market-order.png"
  },
  {
    id: "ordenes-bas-3",
    stepType: "impulse_meter",
    item: {
      name: "Volatilidad matutina",
      price: "Precio oscilando 2%",
    },
    instructions: "El precio se mueve mucho. Sientes el impulso de lanzar una orden a mercado sin ver. ¿Qué tanto te detienes?",
    data: {
      minLabel: "Uso orden limitada",
      maxLabel: "Compro ya a lo que sea",
      targetValue: 2
    }
  },
  {
    id: "ordenes-bas-4",
    stepType: "mcq",
    question: "¿Qué garantiza una Orden Limitada?",
    options: [
      { id: "1", label: "Que comprarás el activo sí o sí", isCorrect: false },
      { id: "2", label: "Que no pagarás más del precio que tú estableciste", isCorrect: true, explanation: "Correcto. Te protege de pagar de más, aunque corres el riesgo de que la orden no se ejecute si el precio no llega ahí." },
      { id: "3", label: "Que el precio subirá mañana", isCorrect: false }
    ]
  },
  {
    id: "ordenes-bas-5",
    stepType: "info",
    title: "La Estrategia BIZEN: DCA",
    body: "Al usar órdenes sistemáticas mes tras mes ([[DCA|Dollar Cost Averaging: Comprar siempre la misma cantidad]]), el tipo de orden importa menos que la constancia. El promedio es tu mejor aliado.",
    imageUrl: "/lessons/bi-dca-chart.png"
  },
  {
    id: "ordenes-bas-6",
    stepType: "swipe_sorter",
    question: "Identifica la orden",
    leftBucket: { label: "Mercado (Velocidad)", color: "#3b82f6" },
    rightBucket: { label: "Limitada (Precio)", color: "#10b981" },
    items: [
      { id: "1", label: "'Cómprame VOO al precio que esté ahorita'", correctBucket: "left" },
      { id: "2", label: "'Solo compra Apple si baja a $150'", correctBucket: "right" },
      { id: "3", label: "'Vende mis acciones rápido para salir'", correctBucket: "left" },
      { id: "4", label: "'Vende solo si el precio sube a $200'", correctBucket: "right" }
    ]
  },
  {
    id: "ordenes-bas-7",
    stepType: "true_false",
    statement: "Una orden limitada puede quedarse sin ejecutarse por días si el precio nunca llega a tu objetivo.",
    correctValue: true,
    explanation: "Cierto. Es el precio de querer controlar el costo: podrías quedarte fuera de la jugada."
  },
  {
    id: "ordenes-bas-8",
    stepType: "blitz_challenge",
    question: "¿Cuál orden garantiza la ejecución?",
    options: [
      { id: "1", label: "Limitada", isCorrect: false },
      { id: "2", label: "A Mercado", isCorrect: true },
      { id: "3", label: "Ninguna", isCorrect: false }
    ],
    timeLimit: 12
  },
  {
    id: "ordenes-bas-9",
    stepType: "order",
    question: "Pasos para poner una orden limitada",
    items: [
      { id: "1", label: "Seleccionar Ticker", correctOrder: 1 },
      { id: "2", label: "Elegir 'Tipo: Limitada'", correctOrder: 2 },
      { id: "3", label: "Definir precio máximo a pagar", correctOrder: 3 },
      { id: "4", label: "Establecer vigencia de la orden", correctOrder: 4 }
    ]
  },
  {
    id: "ordenes-bas-10",
    stepType: "match",
    question: "Relaciona el botón con su efecto",
    leftItems: [
      { id: "l1", label: "Buy Limit" },
      { id: "l2", label: "Sell Limit" },
      { id: "l3", label: "Stop Loss" }
    ],
    rightItems: [
      { id: "r1", label: "Comprar barato (abajo)" },
      { id: "r2", label: "Vender caro (arriba)" },
      { id: "r3", label: "Vender para frenar pérdidas" }
    ],
    correctPairs: [
      { leftId: "l1", rightId: "r1" },
      { leftId: "l2", rightId: "r2" },
      { leftId: "l3", rightId: "r3" }
    ]
  },
  {
    id: "ordenes-bas-11",
    stepType: "mindset_translator",
    question: "Traduce la obsesión por el precio",
    beliefs: [
      {
        id: "b1",
        original: "Si pago 10 centavos de más, mi inversión está arruinada.",
        healthyOptions: [
          { id: "h1", label: "A largo plazo, el tiempo en el mercado es más importante que el precio exacto de hoy.", isCorrect: true },
          { id: "h2", label: "Debo ser el mejor negociador de centavos del mundo.", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: "ordenes-bas-12",
    stepType: "blitz_challenge",
    question: "Misión: ¿Qué es el 'Slippage'?",
    options: [
      { id: "1", label: "Error de la app", isCorrect: false },
      { id: "2", label: "Diferencia entre el precio que pediste y el que recibiste", isCorrect: true },
      { id: "3", label: "Un tipo de acción", isCorrect: false }
    ],
    timeLimit: 10
  },
  {
    id: "ordenes-bas-13",
    stepType: "narrative_check",
    question: "Criterio de Orden",
    body: "Si tienes que comprar tu inversión mensual pero el mercado está muy volátil, ¿preferirías asegurar la compra hoy o arriesgarte a que suba más mientras esperas tu precio?",
    placeholder: "Preferiría... porque...",
    minChars: 30
  },
  {
    id: "ordenes-bas-14",
    stepType: "summary",
    title: "Táctico del Tablero",
    body: "Has dominado los controles de la nave. Ahora sabes cuándo ser rápido y cuándo ser preciso. Eres dueño de tu operativa.",
    aiInsight: "El mejor tipo de orden es la que te permite dormir tranquilo."
  },
  {
    id: "ordenes-bas-15",
    stepType: "billy_talks",
    body: "¡Impresionante! Has terminado el bloque operativo. Ahora vamos a ver cómo medir si todo esto está funcionando: Rendimiento.",
    mood: "happy"
  }
];

// ---------------------------------------------------------------------------
// LECCIÓN 10.1: ¿Qué es el rendimiento?
// Slug: "rendimiento-que-es"
// ---------------------------------------------------------------------------
export const lessonRendimientoQueEsSteps: LessonStep[] = [
  {
    id: "rend-quees-1",
    stepType: "billy_talks",
    title: "La Cosecha del Capital",
    body: "Invertir es sembrar energía hoy para cosechar mañana. El [[Rendimiento|Ganancia neta expresada en porcentaje]] es la medida de ese fruto. Vamos a aprender a pesarlo.",
    data: {
      glossary: [
        { word: "Rendimiento Nominal", definition: "Ganancia porcentual sin ajustar por inflación." },
        { word: "Rendimiento Real", definition: "Ganancia porcentual restando la inflación del periodo." }
      ]
    }
  },
  {
    id: "rend-quees-2",
    stepType: "info",
    title: "La Ilusión de los Números",
    aiInsight: "Un 10% de ganancia con 12% de inflación es, en realidad, una pérdida de poder adquisitivo.",
    body: "No te dejes engañar por los números grandes. Si tu cuenta sube $1,000 pero el súper sube $1,200, eres más pobre. El [[Rendimiento Real|Rendimiento neto de inflación]] es la única métrica de verdad.",
    imageUrl: "/lessons/bi-real-return.png"
  },
  {
    id: "rend-quees-3",
    stepType: "impulse_meter",
    item: {
      name: "Ganancia de Papel",
      price: "+5% esta mañana",
    },
    instructions: "Ves que tu cuenta subió 5% hoy. Sientes que ya 'ganaste' y quieres gastarlo. ¿Qué tanto te controlas?",
    data: {
      minLabel: "Es ilusión (A largo plazo)",
      maxLabel: "Ya soy rico (Gasto)",
      targetValue: 2
    }
  },
  {
    id: "rend-quees-4",
    stepType: "mcq",
    question: "¿Cómo se calcula el rendimiento real?",
    options: [
      { id: "1", label: "Sumando la inflación al rendimiento nominal", isCorrect: false },
      { id: "2", label: "Restando la inflación al rendimiento nominal", isCorrect: true, explanation: "Correcto. Es la única forma de saber cuánto creció realmente tu poder de compra." },
      { id: "3", label: "Dividiendo entre dos", isCorrect: false }
    ]
  },
  {
    id: "rend-quees-5",
    stepType: "info",
    title: "Plusvalía vs Dividendos",
    body: "Tu rendimiento total es la suma de: 1. Lo que subió el precio (Plusvalía) + 2. Lo que te pagaron en efectivo (Dividendo). Esa es la foto completa de tu éxito.",
    imageUrl: "/lessons/bi-total-return.png"
  },
  {
    id: "rend-quees-6",
    stepType: "swipe_sorter",
    question: "Identifica el tipo de rendimiento",
    leftBucket: { label: "Real (Poder de compra)", color: "#10b981" },
    rightBucket: { label: "Nominal (Espejismo)", color: "#6b7280" },
    items: [
      { id: "1", label: "Ganancia neta tras inflación", correctBucket: "left" },
      { id: "2", label: "Número que sale en la App", correctBucket: "right" },
      { id: "3", label: "Crecimiento de riqueza verdadera", correctBucket: "left" },
      { id: "4", label: "Saldo bruto de la cuenta", correctBucket: "right" }
    ]
  },
  {
    id: "rend-quees-7",
    stepType: "true_false",
    statement: "Si la inflación es del 6% y ganaste el 6%, en realidad no ganaste nada de poder adquisitivo.",
    correctValue: true,
    explanation: "Exacto. Estás en el punto de equilibrio o 'Break Even'. Solo protegiste tu dinero, no lo creciste."
  },
  {
    id: "rend-quees-8",
    stepType: "blitz_challenge",
    question: "¿Qué es el 'Rendimiento Histórico'?",
    options: [
      { id: "1", label: "Lo que gané ayer", isCorrect: false },
      { id: "2", label: "El promedio de ganancia en años pasados", isCorrect: true },
      { id: "3", label: "Lo que voy a ganar mañana", isCorrect: false }
    ],
    timeLimit: 12
  },
  {
    id: "rend-quees-9",
    stepType: "order",
    question: "La ruta de la riqueza real",
    items: [
      { id: "1", label: "Inversión inicial", correctOrder: 1 },
      { id: "2", label: "Obtención de rendimiento nominal", correctOrder: 2 },
      { id: "3", label: "Descuento de impuestos e inflación", correctOrder: 3 },
      { id: "4", label: "Acumulación de Rendimiento Real", correctOrder: 4 }
    ]
  },
  {
    id: "rend-quees-10",
    stepType: "match",
    question: "Relaciona el escenario",
    leftItems: [
      { id: "l1", label: "Ganancia 10%, Inflación 4%" },
      { id: "l2", label: "Ganancia 5%, Inflación 8%" },
      { id: "l3", label: "Ganancia 10%, Inflación 10%" }
    ],
    rightItems: [
      { id: "r1", label: "Rendimiento Real +6%" },
      { id: "r2", label: "Rendimiento Real -3% (Pérdida)" },
      { id: "r3", label: "Punto de Equilibrio (0%)" }
    ],
    correctPairs: [
      { leftId: "l1", rightId: "r1" },
      { leftId: "l2", rightId: "r2" },
      { leftId: "l3", rightId: "r3" }
    ]
  },
  {
    id: "rend-quees-11",
    stepType: "mindset_translator",
    question: "Traduce la euforia numérica",
    beliefs: [
      {
        id: "b1",
        original: "Gané $5,000 pesos en una semana, soy un genio de las finanzas.",
        healthyOptions: [
          { id: "h1", label: "Analizo mi porcentaje real a largo plazo; una semana es ruido, un año es dato.", isCorrect: true },
          { id: "h2", label: "Debo renunciar a mi trabajo hoy mismo.", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: "rend-quees-12",
    stepType: "blitz_challenge",
    question: "Misión: ¿Cuál es el promedio histórico del S&P 500?",
    options: [
      { id: "1", label: "50% anual", isCorrect: false },
      { id: "2", label: "Entre 8% y 10% anual (nominal)", isCorrect: true },
      { id: "3", label: "Siempre pierde dinero", isCorrect: false }
    ],
    timeLimit: 10
  },
  {
    id: "rend-quees-13",
    stepType: "narrative_check",
    question: "Visión de Crecimiento",
    body: "Si pudieras elegir entre ganar $10,000 pesos fijos hoy, o tener una inversión que rinde 7% real anual de por vida, ¿qué elegirías y por qué?",
    placeholder: "Elegiría... porque...",
    minChars: 30
  },
  {
    id: "rend-quees-14",
    stepType: "summary",
    title: "Métrica de Poder",
    body: "Has aprendido a ver a través de la niebla de los números. Ahora sabes que el único rendimiento que importa es el que te permite comprar más cosas mañana de las que puedes hoy.",
    aiInsight: "El rendimiento real es la medida de tu libertad futura."
  },
  {
    id: "rend-quees-15",
    stepType: "billy_talks",
    body: "¡Magistral! Ahora vamos a aprender a calcularlo paso a paso para que nadie te engañe con cuentos chinos.",
    mood: "happy"
  }
];

// ---------------------------------------------------------------------------
// LECCIÓN 10.2: Cálculo de rendimiento
// Slug: "calculo-rendimiento"
// ---------------------------------------------------------------------------
export const lessonCalculoRendimientoSteps: LessonStep[] = [
  {
    id: "calc-rend-1",
    stepType: "billy_talks",
    title: "La Ecuación del Éxito",
    body: "No necesitas un doctorado en física para saber cuánto estás ganando. Vamos a dominar la fórmula matemática que todo Inversionista BIZEN debe conocer.",
    data: {
      glossary: [
        { word: "Costo Promedio", definition: "El precio medio pagado por todas tus acciones compradas en diferentes momentos." },
        { word: "ROI", definition: "Return On Investment: Retorno sobre la inversión inicial." }
      ]
    }
  },
  {
    id: "calc-rend-2",
    stepType: "info",
    title: "La Fórmula Básica (ROI)",
    aiInsight: "El ROI te dice qué tan eficiente fue tu capital.",
    body: "La fórmula es: [[ROI|((Valor Final - Valor Inicial) / Valor Inicial) * 100]]. Si invertiste $1,000 y ahora tienes $1,200, tu rendimiento es del 20%.",
    imageUrl: "/lessons/bi-formula.png"
  },
  {
    id: "calc-rend-3",
    stepType: "impulse_meter",
    item: {
      name: "Calculadora de Ganancias",
      price: "Haciendo cuentas hoy",
    },
    instructions: "Sientes el impulso de calcular tu rendimiento cada hora. ¿Qué tanta paz te quita esto?",
    data: {
      minLabel: "Calculo cada trimestre",
      maxLabel: "Calculo cada minuto",
      targetValue: 2
    }
  },
  {
    id: "calc-rend-4",
    stepType: "mcq",
    question: "Si invertiste $5,000 y vendiste en $6,000, ¿cuál fue tu rendimiento porcentual?",
    options: [
      { id: "1", label: "10%", isCorrect: false },
      { id: "2", label: "20%", isCorrect: true, explanation: "Correcto. (6000-5000)/5000 = 0.20, que es el 20%." },
      { id: "3", label: "50%", isCorrect: false }
    ]
  },
  {
    id: "calc-rend-5",
    stepType: "info",
    title: "Rendimiento Anualizado",
    body: "No es lo mismo ganar 20% en un mes que en cinco años. El rendimiento anualizado te permite comparar manzanas con manzanas entre diferentes inversiones.",
    imageUrl: "/lessons/bi-annualized.png"
  },
  {
    id: "calc-rend-6",
    stepType: "swipe_sorter",
    question: "Identifica qué entra en el cálculo",
    leftBucket: { label: "Suma al Rendimiento", color: "#10b981" },
    rightBucket: { label: "Resta al Rendimiento", color: "#ef4444" },
    items: [
      { id: "1", label: "Plusvalía de la acción", correctBucket: "left" },
      { id: "2", label: "Dividendos recibidos", correctBucket: "left" },
      { id: "3", label: "Comisiones del broker", correctBucket: "right" },
      { id: "4", label: "Impuestos por venta", correctBucket: "right" }
    ]
  },
  {
    id: "calc-rend-7",
    stepType: "true_false",
    statement: "El interés compuesto significa que el rendimiento del segundo año se calcula sobre tu inversión inicial más la ganancia del primer año.",
    correctValue: true,
    explanation: "Exacto. Es la famosa 'bola de nieve' que crea riqueza masiva con el tiempo."
  },
  {
    id: "calc-rend-8",
    stepType: "blitz_challenge",
    question: "¿Qué es el 'Drawdown'?",
    options: [
      { id: "1", label: "La ganancia máxima", isCorrect: false },
      { id: "2", label: "La mayor caída desde un pico", isCorrect: true },
      { id: "3", label: "El nombre de un broker", isCorrect: false }
    ],
    timeLimit: 12
  },
  {
    id: "calc-rend-9",
    stepType: "order",
    question: "Orden de cálculo para inversión total",
    items: [
      { id: "1", label: "Sumar todo el capital aportado", correctOrder: 1 },
      { id: "2", label: "Sumar dividendos y plusvalía", correctOrder: 2 },
      { id: "3", label: "Restar comisiones y costos", correctOrder: 3 },
      { id: "4", label: "Dividir entre el capital inicial", correctOrder: 4 }
    ]
  },
  {
    id: "calc-rend-10",
    stepType: "match",
    question: "Relaciona el término con su esencia",
    leftItems: [
      { id: "l1", label: "Principal" },
      { id: "l2", label: "Yield" },
      { id: "l3", label: "Benchmark" }
    ],
    rightItems: [
      { id: "r1", label: "Tu dinero original" },
      { id: "r2", label: "El % de ganancia" },
      { id: "r3", label: "Contra qué te comparas (ej. S&P 500)" }
    ],
    correctPairs: [
      { leftId: "l1", rightId: "r1" },
      { leftId: "l2", rightId: "r2" },
      { leftId: "l3", rightId: "r3" }
    ]
  },
  {
    id: "calc-rend-11",
    stepType: "mindset_translator",
    question: "Traduce la pereza matemática",
    beliefs: [
      {
        id: "b1",
        original: "No necesito calcular nada, con que vea que el número sube está bien.",
        healthyOptions: [
          { id: "h1", label: "Llevo un registro riguroso para saber si mi capital es eficiente o si debo optimizar.", isCorrect: true },
          { id: "h2", label: "Los números son solo para contadores.", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: "calc-rend-12",
    stepType: "blitz_challenge",
    question: "Misión: ¿Qué es el Interés Compuesto?",
    options: [
      { id: "1", label: "Un interés muy caro", isCorrect: false },
      { id: "2", label: "Ganar intereses sobre intereses", isCorrect: true },
      { id: "3", label: "Un tipo de préstamo", isCorrect: false }
    ],
    timeLimit: 10
  },
  {
    id: "calc-rend-13",
    stepType: "narrative_check",
    question: "Análisis de Proyección",
    body: "Si promedias 10% anual, tu dinero se duplica cada 7 años aproximadamente. ¿Dónde estarás financieramente tras 3 ciclos de duplicación?",
    placeholder: "Estaré... porque...",
    minChars: 30
  },
  {
    id: "calc-rend-14",
    stepType: "summary",
    title: "Matemática de la Riqueza",
    body: "Has dominado la brújula del inversionista. Ya no dependes de lo que otros te digan; sabes medir tu propio éxito con precisión de ingeniería.",
    aiInsight: "Lo que no se mide, no se puede mejorar."
  },
  {
    id: "calc-rend-15",
    stepType: "billy_talks",
    body: "¡Brillante! Has concluido el bloque operativo y de medición. Ahora vamos a sumergirnos en el mundo del Riesgo Financiero.",
    mood: "mascot"
  }
];
