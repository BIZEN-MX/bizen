import type { LessonStep } from "@/types/lessonTypes"

// ---------------------------------------------------------------------------
// LECCIÓN 1: ¿Qué es el riesgo y diversificación?
// Slug: "riesgo-y-diversificacion"
// ---------------------------------------------------------------------------
export const lessonRiesgoYDiversificacionSteps: LessonStep[] = [
  {
    id: "riesgo-div-1",
    stepType: "billy_talks",
    title: "El Fuego del Capital",
    body: "Bienvenido al Tema 3. Aquí dejamos de ahorrar para empezar a construir. Pero para entrar, debes entender el [[Riesgo Bursátil|La volatilidad o fluctuación de precios de un activo en el mercado]]. No es peligro, es el costo de la oportunidad.",
    data: {
      glossary: [
        { word: "Riesgo Bursátil", definition: "La medida de incertidumbre sobre los rendimientos futuros de una inversión debido a la volatilidad del mercado." },
        { word: "Diversificación", definition: "Estrategia de distribuir el capital en diferentes activos para reducir la exposición a un solo riesgo." }
      ]
    }
  },
  {
    id: "riesgo-div-2",
    stepType: "info",
    title: "La Volatilidad no es Pérdida",
    aiInsight: "Un inversionista BIZEN no teme a la volatilidad, la usa como su principal herramienta de acumulación.",
    body: "En el mundo bursátil, la diferencia entre una pérdida real y una fluctuación es la PACIENCIA. Si el precio de una [[Acción|Título que representa la propiedad de una fracción de una empresa]] baja 5%, no has perdido nada... a menos que decidas vender.",
    imageUrl: "/lessons/bi-chart-down.png"
  },
  {
    id: "riesgo-div-3",
    stepType: "impulse_meter",
    item: {
      name: "Pánico de Mercado",
      price: "-15% en tu portafolio",
    },
    instructions: "Tu portafolio cae 15% en un día por un rumor geopolítico. ¿Qué tan fuerte es tu impulso de vender todo?",
    data: {
      minLabel: "Inercia Total (Compro más)",
      maxLabel: "Pánico Absoluto (Vender todo)",
      targetValue: 2
    }
  },
  {
    id: "riesgo-div-4",
    stepType: "mcq",
    question: "¿Cuándo se convierte una caída de mercado en una pérdida real?",
    options: [
      { id: "1", label: "Cuando la gráfica se pone roja", isCorrect: false, explanation: "Eso es solo información visual de mercado." },
      { id: "2", label: "Cuando decides vender tu posición", isCorrect: true, explanation: "Correcto. La pérdida solo se 'realiza' en el momento del intercambio." },
      { id: "3", label: "Cuando las noticias hablan de crisis", isCorrect: false, explanation: "Las noticias son ruido; el precio es la señal." }
    ]
  },
  {
    id: "riesgo-div-5",
    stepType: "info",
    title: "Diversificación: El Escudo Táctico",
    body: "La [[Diversificación|Repartir huevos en varias canastas]] es la única forma de reducir el riesgo sin sacrificar necesariamente el retorno. Si inviertes en 100 empresas y una quiebra, tu sistema sobrevive. Si inviertes en una y quiebra, tu sistema colapsa.",
    imageUrl: "/lessons/bi-shield.png"
  },
  {
    id: "riesgo-div-6",
    stepType: "swipe_sorter",
    question: "Clasifica según el nivel de riesgo sistémico",
    leftBucket: { label: "Riesgo Bajo", color: "#10b981" },
    rightBucket: { label: "Riesgo Alto", color: "#ef4444" },
    items: [
      { id: "1", label: "Bonos del Gobierno", correctBucket: "left" },
      { id: "2", label: "Acciones de Startups", correctBucket: "right" },
      { id: "3", label: "ETFs Diversificados", correctBucket: "left" },
      { id: "4", label: "Criptomonedas nuevas", correctBucket: "right" }
    ]
  },
  {
    id: "riesgo-div-7",
    stepType: "true_false",
    statement: "Invertir sin riesgo es posible si eliges las empresas correctas.",
    correctValue: false,
    explanation: "Todo rendimiento es un premio por aceptar un riesgo. Sin riesgo, no hay crecimiento por encima de la inflación."
  },
  {
    id: "riesgo-div-8",
    stepType: "blitz_challenge",
    question: "Misión: Identifica la herramienta de protección",
    options: [
      { id: "1", label: "Apostar todo a una opción", isCorrect: false },
      { id: "2", label: "Diversificación estratégica", isCorrect: true },
      { id: "3", label: "Esperar a que no haya riesgo", isCorrect: false }
    ],
    timeLimit: 12
  },
  {
    id: "riesgo-div-9",
    stepType: "order",
    question: "Ordena los activos de MENOR a MAYOR riesgo esperado",
    items: [
      { id: "1", label: "Efectivo (Bajo un colchón)", correctOrder: 1 },
      { id: "2", label: "Bonos Soberanos (Cetes)", correctOrder: 2 },
      { id: "3", label: "Acciones de Blue Chips", correctOrder: 3 },
      { id: "4", label: "Derivados Financieros", correctOrder: 4 }
    ]
  },
  {
    id: "riesgo-div-10",
    stepType: "match",
    question: "Conecta el concepto con su función táctica",
    leftItems: [
      { id: "l1", label: "Volatilidad" },
      { id: "l2", label: "Diversificación" },
      { id: "l3", label: "Retorno" }
    ],
    rightItems: [
      { id: "r1", label: "El 'ruido' de los precios" },
      { id: "r2", label: "El escudo ante quiebras" },
      { id: "r3", label: "El premio por el riesgo" }
    ],
    correctPairs: [
      { leftId: "l1", rightId: "r1" },
      { leftId: "l2", rightId: "r2" },
      { leftId: "l3", rightId: "r3" }
    ]
  },
  {
    id: "riesgo-div-11",
    stepType: "mindset_translator",
    question: "Traduce la creencia de 'Miedo al Mercado'",
    beliefs: [
      {
        id: "b1",
        original: "La bolsa es un casino y voy a perder todo mi dinero.",
        healthyOptions: [
          { id: "h1", label: "La bolsa es un sistema de propiedad productiva diversificada.", isCorrect: true },
          { id: "h2", label: "Solo los expertos ganan en el casino bursátil.", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: "riesgo-div-12",
    stepType: "blitz_challenge",
    question: "¿Qué factor reduce drásticamente el riesgo de pérdida en bolsa?",
    options: [
      { id: "1", label: "El color del logo de la empresa", isCorrect: false },
      { id: "2", label: "El horizonte de tiempo largo", isCorrect: true },
      { id: "3", label: "Comprar solo lo más barato", isCorrect: false }
    ],
    timeLimit: 10
  },
  {
    id: "riesgo-div-13",
    stepType: "narrative_check",
    question: "Reflexión Táctica",
    body: "Si hoy tuvieras $10,000 extra, ¿cómo los distribuirías para que tu 'Escudo de Diversificación' fuera efectivo? Explica tu lógica.",
    placeholder: "Yo dividiría mi capital en...",
    minChars: 30
  },
  {
    id: "riesgo-div-14",
    stepType: "summary",
    title: "Misión Cumplida: El Riesgo Dominado",
    body: "Has entendido que el riesgo no se evita, se gestiona. La diversificación es tu mejor herramienta en esta nueva etapa bursátil.",
    aiInsight: "Recuerda: En el mercado, el tiempo es el mejor filtro para el riesgo."
  },
  {
    id: "riesgo-div-15",
    stepType: "billy_talks",
    body: "¡Excelente inicio! Estás listo para entender para qué sirve este gran motor llamado Bolsa de Valores. Nos vemos en la próxima lección.",
    mood: "celebrating"
  }
];

// ---------------------------------------------------------------------------
// LECCIÓN 2: ¿Para qué sirve la bolsa?
// Slug: "bolsa-para-que"
// ---------------------------------------------------------------------------
export const lessonBolsaParaQueSteps: LessonStep[] = [
  {
    id: "bolsa-que-1",
    stepType: "billy_talks",
    title: "El Motor del Capitalismo",
    body: "La [[Bolsa de Valores|Mercado donde se compran y venden acciones y otros títulos]] no es una caja negra. Es el lugar donde las empresas buscan capital y tú buscas crecimiento.",
    data: {
      glossary: [
        { word: "Bolsa de Valores", definition: "Institución donde se realizan transacciones de compra y venta de valores inmobiliarios." },
        { word: "Capitalización", definition: "El valor total de mercado de todas las acciones en circulación de una empresa." }
      ]
    }
  },
  {
    id: "bolsa-que-2",
    stepType: "info",
    title: "Financiamiento vs. Inversión",
    aiInsight: "Las empresas no van a la bolsa a apostar, van a vender pedazos de su futuro para construir su presente.",
    body: "Cuando una empresa necesita dinero para construir una nueva fábrica, puede pedir un préstamo al banco o puede 'salir a bolsa' y vender acciones. Esto último le da capital sin generar deuda por intereses.",
    imageUrl: "/lessons/bi-factory.png"
  },
  {
    id: "bolsa-que-3",
    stepType: "swipe_sorter",
    question: "Identifica la función de la bolsa",
    leftBucket: { label: "Función Real", color: "#10b981" },
    rightBucket: { label: "Mito", color: "#ef4444" },
    items: [
      { id: "1", label: "Financiar innovación", correctBucket: "left" },
      { id: "2", label: "Regalar dinero rápido", correctBucket: "right" },
      { id: "3", label: "Dar liquidez a inversionistas", correctBucket: "left" },
      { id: "4", label: "Controlar el clima", correctBucket: "right" }
    ]
  },
  {
    id: "bolsa-que-4",
    stepType: "mcq",
    question: "¿Qué obtiene un inversionista al comprar una acción?",
    options: [
      { id: "1", label: "Un préstamo que la empresa le debe", isCorrect: false },
      { id: "2", label: "Un pedazo de la propiedad de la empresa", isCorrect: true, explanation: "Correcto. Eres socio-propietario proporcional." },
      { id: "3", label: "Una garantía de ganancias semanales", isCorrect: false }
    ]
  },
  {
    id: "bolsa-que-5",
    stepType: "info",
    title: "El Mercado Secundario",
    body: "La mayor parte de lo que llamamos 'invertir en bolsa' sucede en el [[Mercado Secundario|Donde los inversionistas compran y venden entre sí, no a la empresa]]. Es como una reventa masiva que da valor constante a las empresas.",
    imageUrl: "/lessons/bi-exchange.png"
  },
  {
    id: "bolsa-que-6",
    stepType: "impulse_meter",
    item: {
      name: "Oferta Pública Inicial (IPO)",
      price: "Acciones nuevas",
    },
    instructions: "Una empresa famosa sale a bolsa hoy. Todo el mundo está comprando. ¿Qué tanto te dejas llevar por el hype?",
    data: {
      minLabel: "Analizo frialdad",
      maxLabel: "Compro por el logo",
      targetValue: 3
    }
  },
  {
    id: "bolsa-que-7",
    stepType: "true_false",
    statement: "Sin la bolsa, no podrías comprar una fracción de empresas como Apple o Amazon.",
    correctValue: true,
    explanation: "La bolsa democratiza el acceso a la propiedad de las empresas más productivas del mundo."
  },
  {
    id: "bolsa-que-8",
    stepType: "blitz_challenge",
    question: "¿Cómo se llama el valor total de una empresa en bolsa?",
    options: [
      { id: "1", label: "Riqueza neta", isCorrect: false },
      { id: "2", label: "Capitalización de mercado", isCorrect: true },
      { id: "3", label: "Saldo en caja", isCorrect: false }
    ],
    timeLimit: 12
  },
  {
    id: "bolsa-que-9",
    stepType: "order",
    question: "Proceso de una empresa hacia la bolsa",
    items: [
      { id: "1", label: "Idea y fundación privada", correctOrder: 1 },
      { id: "2", label: "Crecimiento con capital propio", correctOrder: 2 },
      { id: "3", label: "Preparación de la IPO", correctOrder: 3 },
      { id: "4", label: "Listado en el mercado público", correctOrder: 4 }
    ]
  },
  {
    id: "bolsa-que-10",
    stepType: "match",
    question: "Relaciona el participante con su rol",
    leftItems: [
      { id: "l1", label: "Empresa" },
      { id: "l2", label: "Inversionista" },
      { id: "l3", label: "Bolsa" }
    ],
    rightItems: [
      { id: "r1", label: "Busca capital para crecer" },
      { id: "r2", label: "Busca poner su dinero a trabajar" },
      { id: "r3", label: "Brinda el lugar para el intercambio" }
    ],
    correctPairs: [
      { leftId: "l1", rightId: "r1" },
      { leftId: "l2", rightId: "r2" },
      { leftId: "l3", rightId: "r3" }
    ]
  },
  {
    id: "bolsa-que-11",
    stepType: "mindset_translator",
    question: "Traduce el concepto de 'Socios'",
    beliefs: [
      {
        id: "b1",
        original: "Solo los ricos pueden ser dueños de grandes empresas.",
        healthyOptions: [
          { id: "h1", label: "Cualquier persona puede ser copropietaria vía la bolsa.", isCorrect: true },
          { id: "h2", label: "La bolsa es un club privado para bancos.", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: "bolsa-que-12",
    stepType: "blitz_challenge",
    question: "Misión: ¿Cuál es el principal beneficio de la liquidez en la bolsa?",
    options: [
      { id: "1", label: "Poder vender tus acciones rápido", isCorrect: true },
      { id: "2", label: "Que las acciones brillen más", isCorrect: false },
      { id: "3", label: "No pagar impuestos", isCorrect: false }
    ],
    timeLimit: 10
  },
  {
    id: "bolsa-que-13",
    stepType: "narrative_check",
    question: "Visión Empresarial",
    body: "Si fueras dueño de una empresa de tecnología, ¿por qué preferirías salir a bolsa en lugar de pedir un crédito bancario? Analiza el costo.",
    placeholder: "Preferiría la bolsa porque...",
    minChars: 30
  },
  {
    id: "bolsa-que-14",
    stepType: "summary",
    title: "Propiedad Distribuida",
    body: "Has aprendido que la bolsa es la infraestructura que permite que tú seas dueño del trabajo productivo de miles de personas. Es un salto de empleado a propietario.",
    aiInsight: "La bolsa es el puente entre el ahorro pasivo y el capital productivo."
  },
  {
    id: "bolsa-que-15",
    stepType: "billy_talks",
    body: "Ahora que sabes para qué sirve, es hora de ver CÓMO funciona esa maquinaria por dentro. ¡Acompáñame!",
    mood: "happy"
  }
];

// ---------------------------------------------------------------------------
// LECCIÓN 3: ¿Cómo funciona de forma general?
// Slug: "bolsa-como-funciona"
// ---------------------------------------------------------------------------
export const lessonBolsaComoFuncionaSteps: LessonStep[] = [
  {
    id: "como-funciona-1",
    stepType: "billy_talks",
    title: "La Maquinaria de Precios",
    body: "Entender la bolsa es entender una subasta gigante. Pero en lugar de arte, subastamos el futuro de la economía. Vamos a desarmar el sistema.",
    data: {
      glossary: [
        { word: "Broker", definition: "Intermediario financiero que ejecuta órdenes de compra y venta por cuenta de sus clientes." },
        { word: "Bid / Ask", definition: "Precio de oferta (compra) y precio de demanda (venta) en el mercado." }
      ]
    }
  },
  {
    id: "como-funciona-2",
    stepType: "info",
    title: "Oferta y Demanda en Tiempo Real",
    aiInsight: "El precio de una acción no lo decide una oficina, lo decide la inteligencia colectiva del mercado cada segundo.",
    body: "Si hay más personas queriendo comprar ([[Demanda|Gente con dinero buscando activos]]) que personas queriendo vender ([[Oferta|Gente con activos buscando dinero]]), el precio sube. Así de simple y así de potente.",
    imageUrl: "/lessons/bi-bidask.png"
  },
  {
    id: "como-funciona-3",
    stepType: "impulse_meter",
    item: {
      name: "Gráfica en Vertical",
      price: "+5% en 10 minutos",
    },
    instructions: "Ves una acción subir verticalmente. Sientes que te estás perdiendo la oportunidad de tu vida (FOMO). ¿Qué haces?",
    data: {
      minLabel: "Sigo mi sistema",
      maxLabel: "Compro impulsivamente",
      targetValue: 2
    }
  },
  {
    id: "como-funciona-4",
    stepType: "mcq",
    question: "¿Quién es el encargado de ejecutar tus órdenes en la bolsa?",
    options: [
      { id: "1", label: "El gobierno directamente", isCorrect: false },
      { id: "2", label: "Un Broker (Casa de Bolsa)", isCorrect: true, explanation: "Correcto. El broker es tu puente tecnológico al mercado." },
      { id: "3", label: "El banco donde guardas tu nómina", isCorrect: false }
    ]
  },
  {
    id: "como-funciona-5",
    stepType: "info",
    title: "El Diferencial (Spread)",
    body: "Entre el precio al que alguien quiere comprar ([[Bid|Precio más alto de compra]]) y el que alguien quiere vender ([[Ask|Precio más bajo de venta]]) hay una pequeña brecha llamada Spread. En mercados sanos, esta brecha es casi invisible.",
    imageUrl: "/lessons/bi-spread.png"
  },
  {
    id: "como-funciona-6",
    stepType: "swipe_sorter",
    question: "Clasifica el tipo de orden bursátil",
    leftBucket: { label: "Orden de Mercado", color: "#3b82f6" },
    rightBucket: { label: "Orden Limitada", color: "#8b5cf6" },
    items: [
      { id: "1", label: "Comprar YA al precio actual", correctBucket: "left" },
      { id: "2", label: "Comprar solo si baja a $100", correctBucket: "right" },
      { id: "3", label: "Vender al mejor precio disponible", correctBucket: "left" },
      { id: "4", label: "Vender solo si sube a $120", correctBucket: "right" }
    ]
  },
  {
    id: "como-funciona-7",
    stepType: "true_false",
    statement: "La bolsa de Nueva York y la de México cierran en fines de semana y días festivos.",
    correctValue: true,
    explanation: "A diferencia de las criptomonedas, la bolsa tiene horarios institucionales fijos."
  },
  {
    id: "como-funciona-8",
    stepType: "blitz_challenge",
    question: "Misión: ¿Qué sucede si la Demanda supera a la Oferta?",
    options: [
      { id: "1", label: "El precio baja", isCorrect: false },
      { id: "2", label: "El precio sube", isCorrect: true },
      { id: "3", label: "El mercado se apaga", isCorrect: false }
    ],
    timeLimit: 12
  },
  {
    id: "como-funciona-9",
    stepType: "order",
    question: "Camino de una orden de compra",
    items: [
      { id: "1", label: "Usuario da clic en 'Comprar'", correctOrder: 1 },
      { id: "2", label: "Broker recibe y valida fondos", correctOrder: 2 },
      { id: "3", label: "Orden llega al motor de la Bolsa", correctOrder: 3 },
      { id: "4", label: "Intercambio ejecutado (Match)", correctOrder: 4 }
    ]
  },
  {
    id: "como-funciona-10",
    stepType: "match",
    question: "Une el concepto con su definición",
    leftItems: [
      { id: "l1", label: "Titulización" },
      { id: "l2", label: "Match" },
      { id: "l3", label: "Liquidación" }
    ],
    rightItems: [
      { id: "r1", label: "Convertir activos en acciones" },
      { id: "r2", label: "Encontrar comprador y vendedor" },
      { id: "r3", label: "Intercambio final de dinero/títulos" }
    ],
    correctPairs: [
      { leftId: "l1", rightId: "r1" },
      { leftId: "l2", rightId: "r2" },
      { leftId: "l3", rightId: "r3" }
    ]
  },
  {
    id: "como-funciona-11",
    stepType: "mindset_translator",
    question: "Traduce la visión de 'Timing'",
    beliefs: [
      {
        id: "b1",
        original: "Debo esperar al momento perfecto para que el precio esté bajo.",
        healthyOptions: [
          { id: "h1", label: "El tiempo en el mercado vence a intentar adivinar el mercado.", isCorrect: true },
          { id: "h2", label: "Debo ser el más rápido del oeste comprando.", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: "como-funciona-12",
    stepType: "blitz_challenge",
    question: "¿Cómo se llama la diferencia entre Bid y Ask?",
    options: [
      { id: "1", label: "Ganancia del broker", isCorrect: false },
      { id: "2", label: "Spread", isCorrect: true },
      { id: "3", label: "Comisión fija", isCorrect: false }
    ],
    timeLimit: 10
  },
  {
    id: "como-funciona-13",
    stepType: "narrative_check",
    question: "Análisis de Sistema",
    body: "Si pudieras automatizar tu inversión para que se ejecute todos los lunes sin que tú intervengas, ¿qué beneficio psicológico crees que obtendrías?",
    placeholder: "Eliminaría el estrés de...",
    minChars: 30
  },
  {
    id: "como-funciona-14",
    stepType: "summary",
    title: "Sistema en Marcha",
    body: "Has desarmado el reloj bursátil. Ahora sabes que detrás de cada gráfica hay millones de decisiones humanas procesadas por tecnología de punta.",
    aiInsight: "Operar un sistema es mejor que operar una emoción."
  },
  {
    id: "como-funciona-15",
    stepType: "billy_talks",
    body: "¡Felicidades! Has completado el primer bloque de Finanzas Bursátiles. Estás un paso más cerca de la ingeniería financiera total.",
    mood: "mascot"
  }
];
