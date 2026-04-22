import type { LessonStep } from "@/types/lessonTypes"

// ---------------------------------------------------------------------------
// LECCIÓN 11.1: ¿Qué es el riesgo financiero?
// Slug: "riesgo-financiero"
// ---------------------------------------------------------------------------
export const lessonRiesgoFinancieroSteps: LessonStep[] = [
  {
    id: "riesgo-fin-1",
    stepType: "billy_talks",
    title: "El Costo de la Riqueza",
    body: "Muchos videntes dicen que invertir es peligroso. En BIZEN sabemos que el verdadero riesgo es no hacer nada y dejar que la inflación devore tus ahorros. Vamos a redefinir el riesgo.",
    data: {
      glossary: [
        { word: "Riesgo Financiero", definition: "Probabilidad de que el rendimiento real de una inversión sea diferente al esperado." },
        { word: "Volatilidad", definition: "Variación drástica de los precios de un activo en un periodo corto." }
      ]
    }
  },
  {
    id: "riesgo-fin-2",
    stepType: "info",
    title: "Volatilidad NO es Pérdida",
    aiInsight: "La volatilidad es el precio que pagas por los rendimientos superiores del mercado.",
    body: "Si el precio de tu ETF baja un 10% hoy, no has perdido dinero a menos que vendas. Esa fluctuación es [[Volatilidad|Variación de precio]]. La pérdida solo es real si materializas la venta en rojo.",
    imageUrl: "/lessons/bi-volatility.png"
  },
  {
    id: "riesgo-fin-3",
    stepType: "impulse_meter",
    item: {
      name: "Portafolio en rojo",
      price: "-15% este mes",
    },
    instructions: "Abres tu app y ves que todo está en rojo. Sientes una opresión en el pecho y quieres 'salvar' lo que queda. ¿Qué tan fuerte es tu disciplina?",
    data: {
      minLabel: "Mantengo el plan",
      maxLabel: "Vendo todo (Pánico)",
      targetValue: 2
    }
  },
  {
    id: "riesgo-fin-4",
    stepType: "mcq",
    question: "¿Cuándo se convierte el riesgo en una pérdida real?",
    options: [
      { id: "1", label: "Cuando el mercado baja", isCorrect: false },
      { id: "2", label: "Cuando decides vender el activo a un precio menor al que lo compraste", isCorrect: true, explanation: "Exacto. Mientras no vendas, solo tienes una 'pérdida de papel' que puede recuperarse con el tiempo." },
      { id: "3", label: "Cuando el broker cierra", isCorrect: false }
    ]
  },
  {
    id: "riesgo-fin-5",
    stepType: "info",
    title: "El Riesgo de No Invertir",
    body: "Tener dinero bajo el colchón tiene un riesgo del 100%: perder poder adquisitivo cada año por la inflación. El riesgo financiero es una herramienta; el riesgo de inacción es una condena.",
    imageUrl: "/lessons/bi-zero-risk-myth.png"
  },
  {
    id: "riesgo-fin-6",
    stepType: "swipe_sorter",
    question: "Identifica el concepto",
    leftBucket: { label: "Volatilidad (Temporal)", color: "#3b82f6" },
    rightBucket: { label: "Riesgo (Permanente)", color: "#ef4444" },
    items: [
      { id: "1", label: "El precio sube y baja hoy", correctBucket: "left" },
      { id: "2", label: "La empresa quiebra definitivamente", correctBucket: "right" },
      { id: "3", label: "Miedo por noticias de corto plazo", correctBucket: "left" },
      { id: "4", label: "Fraude total del emisor", correctBucket: "right" }
    ]
  },
  {
    id: "riesgo-fin-7",
    stepType: "true_false",
    statement: "Un inversionista BIZEN prefiere la volatilidad controlada sobre la seguridad estancada.",
    correctValue: true,
    explanation: "Correcto. Entendemos que sin movimiento no hay crecimiento."
  },
  {
    id: "riesgo-fin-8",
    stepType: "blitz_challenge",
    question: "¿Qué mide la desviación estándar en finanzas?",
    options: [
      { id: "1", label: "La ganancia fija", isCorrect: false },
      { id: "2", label: "La volatilidad del activo", isCorrect: true },
      { id: "3", label: "El nombre del CEO", isCorrect: false }
    ],
    timeLimit: 12
  },
  {
    id: "riesgo-fin-9",
    stepType: "order",
    question: "Ciclo emocional del riesgo",
    items: [
      { id: "1", label: "Inversión inicial (Euforia)", correctOrder: 1 },
      { id: "2", label: "Caída del mercado (Miedo)", correctOrder: 2 },
      { id: "3", label: "Punto más bajo (Pánico)", correctOrder: 3 },
      { id: "4", label: "Recuperación prolongada (Alivio)", correctOrder: 4 }
    ]
  },
  {
    id: "riesgo-fin-10",
    stepType: "match",
    question: "Relaciona el riesgo con su origen",
    leftItems: [
      { id: "l1", label: "Riesgo de Mercado" },
      { id: "l2", label: "Riesgo de Crédito" },
      { id: "l3", label: "Riesgo de Liquidez" }
    ],
    rightItems: [
      { id: "r1", label: "Que todo el mercado baje" },
      { id: "r2", label: "Que quien te debe no te pague" },
      { id: "r3", label: "Que no puedas vender rápido" }
    ],
    correctPairs: [
      { leftId: "l1", rightId: "r1" },
      { leftId: "l2", rightId: "r2" },
      { leftId: "l3", rightId: "r3" }
    ]
  },
  {
    id: "riesgo-fin-11",
    stepType: "mindset_translator",
    question: "Traduce el miedo al riesgo",
    beliefs: [
      {
        id: "b1",
        original: "Solo invierto en cosas que nunca bajen de precio.",
        healthyOptions: [
          { id: "h1", label: "Acepto que el precio oscilará mientras el valor real de los activos crezca a largo plazo.", isCorrect: true },
          { id: "h2", label: "Prefiero enterrar mi dinero en el patio.", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: "riesgo-fin-12",
    stepType: "blitz_challenge",
    question: "Misión: ¿Qué es el 'Riesgo de Oportunidad'?",
    options: [
      { id: "1", label: "Invertir en una estafa", isCorrect: false },
      { id: "2", label: "Perder ganancias por miedo a entrar al mercado", isCorrect: true },
      { id: "3", label: "Cerrar la cuenta", isCorrect: false }
    ],
    timeLimit: 10
  },
  {
    id: "riesgo-fin-13",
    stepType: "narrative_check",
    question: "Filosofía de Control",
    body: "Si pudieras eliminar todo el riesgo de tus inversiones pero a cambio tu rendimiento fuera de 0% para siempre, ¿lo harías? Justifica tu respuesta desde la visión BIZEN.",
    placeholder: "No lo haría porque... o Sí porque...",
    minChars: 30
  },
  {
    id: "riesgo-fin-14",
    stepType: "summary",
    title: "Mente Blindada",
    body: "Has reconfigurado tu cerebro. El riesgo ya no es un monstruo, sino una variable matemática que puedes gestionar a tu favor.",
    aiInsight: "El riesgo es el fuego que cocina tu riqueza; solo debes saber controlarlo."
  },
  {
    id: "riesgo-fin-15",
    stepType: "billy_talks",
    body: "¡Brillante! Ahora vamos a desglosar los tipos de riesgo para que sepas exactamente a qué te enfrentas.",
    mood: "happy"
  }
];

// ---------------------------------------------------------------------------
// LECCIÓN 11.2: ¿Cuáles son los tipos de riesgo?
// Slug: "tipos-de-riesgo"
// ---------------------------------------------------------------------------
export const lessonTiposDeRiesgoSteps: LessonStep[] = [
  {
    id: "tipos-ries-1",
    stepType: "billy_talks",
    title: "El Bestiario Financiero",
    body: "Para domar al riesgo, primero hay que ponerle nombre. Vamos a identificar a los diferentes tipos de 'monstruos' que pueden afectar tu capital.",
    data: {
      glossary: [
        { word: "Riesgo Sistemático", definition: "Riesgo que afecta a todo el mercado y no se puede eliminar diversificando (ej. una pandemia)." },
        { word: "Riesgo No Sistemático", definition: "Riesgo que afecta a una empresa o industria específica y se puede eliminar diversificando." }
      ]
    }
  },
  {
    id: "tipos-ries-2",
    stepType: "info",
    title: "Sistemático vs No Sistemático",
    aiInsight: "Invirtiendo en ETFs eliminas el riesgo de que una sola empresa quiebre y arrastre tu dinero.",
    body: "El [[Riesgo No Sistemático|Riesgo individual]] es el que corres si solo compras una acción. El [[Riesgo Sistemático|Riesgo general]] es el que corre el mundo entero. BIZEN se especializa en neutralizar el primero.",
    imageUrl: "/lessons/bi-risk-types.png"
  },
  {
    id: "tipos-ries-3",
    stepType: "impulse_meter",
    item: {
      name: "Noticia: Quiebra de Banco X",
      price: "Pánico en el sector",
    },
    instructions: "Escuchas que un banco importante quebró. No tienes acciones de ese banco, pero tienes un ETF de todo el mercado. ¿Qué tan seguro te sientes?",
    data: {
      minLabel: "Seguro (Estoy diversificado)",
      maxLabel: "Asustado (Todo va a caer)",
      targetValue: 2
    }
  },
  {
    id: "tipos-ries-4",
    stepType: "mcq",
    question: "¿Qué tipo de riesgo se elimina al comprar todas las empresas de la bolsa?",
    options: [
      { id: "1", label: "El riesgo sistemático", isCorrect: false },
      { id: "2", label: "El riesgo no sistemático (individual)", isCorrect: true, explanation: "Correcto. Al tener cientos de empresas, si una falla, las demás compensan la pérdida." },
      { id: "3", label: "Ningún riesgo", isCorrect: false }
    ]
  },
  {
    id: "tipos-ries-5",
    stepType: "info",
    title: "Riesgo de Inflación y Divisa",
    body: "Incluso si tus acciones suben, puedes perder si la inflación es mayor o si tu moneda local se devalúa frente al dólar. Son riesgos 'invisibles' que siempre debemos monitorear.",
    imageUrl: "/lessons/bi-invisible-risks.png"
  },
  {
    id: "tipos-ries-6",
    stepType: "swipe_sorter",
    question: "Clasifica el riesgo",
    leftBucket: { label: "Sistemático (Global)", color: "#ef4444" },
    rightBucket: { label: "No Sistemático (Local)", color: "#fbbf24" },
    items: [
      { id: "1", label: "Guerra mundial", correctBucket: "left" },
      { id: "2", label: "El CEO de Apple renuncia", correctBucket: "right" },
      { id: "3", label: "Subida de tasas de interés global", correctBucket: "left" },
      { id: "4", label: "Huelga en una fábrica de autos", correctBucket: "right" }
    ]
  },
  {
    id: "tipos-ries-7",
    stepType: "true_false",
    statement: "El riesgo de divisa solo te afecta si inviertes en activos que no están en tu moneda local.",
    correctValue: true,
    explanation: "Cierto. Si inviertes en dólares y tu moneda local se fortalece, podrías ver una 'pérdida' al convertir a tu moneda."
  },
  {
    id: "tipos-ries-8",
    stepType: "blitz_challenge",
    question: "¿Cómo llamamos al riesgo de no poder vender un activo?",
    options: [
      { id: "1", label: "Riesgo de inflación", isCorrect: false },
      { id: "2", label: "Riesgo de liquidez", isCorrect: true },
      { id: "3", label: "Riesgo político", isCorrect: false }
    ],
    timeLimit: 12
  },
  {
    id: "tipos-ries-9",
    stepType: "order",
    question: "Prioridad de mitigación de riesgos",
    items: [
      { id: "1", label: "Eliminar riesgo de estafa (Regulación)", correctOrder: 1 },
      { id: "2", label: "Eliminar riesgo individual (Diversificación)", correctOrder: 2 },
      { id: "3", label: "Gestionar riesgo de mercado (Horizonte temporal)", correctOrder: 3 },
      { id: "4", label: "Aceptar riesgo sistemático", correctOrder: 4 }
    ]
  },
  {
    id: "tipos-ries-10",
    stepType: "match",
    question: "Relaciona el riesgo con su antídoto",
    leftItems: [
      { id: "l1", label: "Riesgo Individual" },
      { id: "l2", label: "Riesgo de Inflación" },
      { id: "l3", label: "Riesgo de Estafa" }
    ],
    rightItems: [
      { id: "r1", label: "Diversificar (ETFs)" },
      { id: "r2", label: "Invertir en Activos Reales" },
      { id: "r3", label: "Usar Brokers Regulados" }
    ],
    correctPairs: [
      { leftId: "l1", rightId: "r1" },
      { leftId: "l2", rightId: "r2" },
      { leftId: "l3", rightId: "r3" }
    ]
  },
  {
    id: "tipos-ries-11",
    stepType: "mindset_translator",
    question: "Traduce la falsa seguridad",
    beliefs: [
      {
        id: "b1",
        original: "Mi tío me dijo que una empresa petrolera es segura porque siempre habrá petróleo.",
        healthyOptions: [
          { id: "h1", label: "Ninguna empresa es invencible; prefiero ser dueño de toda la industria que de una sola ficha.", isCorrect: true },
          { id: "h2", label: "Si mi tío lo dice, meto todos mis ahorros ahí.", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: "tipos-ries-12",
    stepType: "blitz_challenge",
    question: "Misión: ¿Qué es el 'Riesgo Político'?",
    options: [
      { id: "1", label: "Votar mal", isCorrect: false },
      { id: "2", label: "Cambios en leyes que afectan tus inversiones", isCorrect: true },
      { id: "3", label: "Hablar de política", isCorrect: false }
    ],
    timeLimit: 10
  },
  {
    id: "tipos-ries-13",
    stepType: "narrative_check",
    question: "Identificación de Riesgos",
    body: "Si invirtieras todo tu dinero en una sola empresa de tecnología de tu propio país, ¿qué tipos de riesgo estarías concentrando involuntariamente?",
    placeholder: "Estaría concentrando riesgo de... y también...",
    minChars: 30
  },
  {
    id: "tipos-ries-14",
    stepType: "summary",
    title: "Conocimiento Defensivo",
    body: "Has mapeado el terreno. Ahora sabes que el riesgo no es una masa amorfa, sino piezas específicas que puedes neutralizar con inteligencia.",
    aiInsight: "La ignorancia es el mayor riesgo de todos."
  },
  {
    id: "tipos-ries-15",
    stepType: "billy_talks",
    body: "¡Magnífico! Ahora vamos a ver la ley más sagrada de las finanzas: La relación entre el riesgo y el rendimiento.",
    mood: "happy"
  }
];

// ---------------------------------------------------------------------------
// LECCIÓN 11.3: Relación riesgo-rendimiento
// Slug: "relacion-riesgo-rendimiento"
// ---------------------------------------------------------------------------
export const lessonRelacionRiesgoRendimientoSteps: LessonStep[] = [
  {
    id: "rel-ries-rend-1",
    stepType: "billy_talks",
    title: "La Balanza Eterna",
    body: "En finanzas, no hay almuerzos gratis. Si quieres ganar mucho, debes estar dispuesto a tolerar movimiento. Vamos a entender el equilibrio.",
    data: {
      glossary: [
        { word: "Prima de Riesgo", definition: "Rendimiento adicional que un inversor exige por elegir un activo con riesgo sobre uno seguro (ej. Cetes)." },
        { word: "Asset Allocation", definition: "Distribución de activos en tu portafolio para equilibrar riesgo y potencial de ganancia." }
      ]
    }
  },
  {
    id: "rel-ries-rend-2",
    stepType: "info",
    title: "A mayor riesgo, mayor rendimiento (esperado)",
    aiInsight: "Nadie te daría un 20% si pudiera conseguir el mismo resultado con 0 riesgo en el banco central.",
    body: "Es una ley física: Para que alguien acepte un activo volátil, este debe ofrecer una promesa de mayor ganancia futura ([[Prima de Riesgo|Premio por arriesgar]]). Si alguien te ofrece mucho rendimiento sin riesgo, corre: es una estafa.",
    imageUrl: "/lessons/bi-risk-reward.png"
  },
  {
    id: "rel-ries-rend-3",
    stepType: "impulse_meter",
    item: {
      name: "Inversión 'Garantizada'",
      price: "15% mensual sin riesgo",
    },
    instructions: "Te ofrecen una inversión que rompe la ley del riesgo-rendimiento. Prometen ganancias de cripto con seguridad de banco central. ¿Qué dice tu lógica?",
    data: {
      minLabel: "Es un fraude matemático",
      maxLabel: "Tal vez descubrieron un truco",
      targetValue: 1
    }
  },
  {
    id: "rel-ries-rend-4",
    stepType: "mcq",
    question: "¿Por qué las acciones rinden más que los bonos de gobierno a largo plazo?",
    options: [
      { id: "1", label: "Porque son más bonitas", isCorrect: false },
      { id: "2", label: "Porque tienen mayor riesgo y el mercado debe compensar al inversionista con mayores ganancias", isCorrect: true, explanation: "Exacto. El 'premio' existe precisamente porque el camino es más turbulento." },
      { id: "3", label: "Porque las empresas son caritativas", isCorrect: false }
    ]
  },
  {
    id: "rel-ries-rend-5",
    stepType: "info",
    title: "El Espectro de Activos",
    body: "Desde el efectivo (riesgo 0, rendimiento 0 real) hasta el capital de riesgo (riesgo 100, rendimiento potencial masivo). Tu trabajo es encontrar el punto dulce que te permita dormir pero también crecer.",
    imageUrl: "/lessons/bi-asset-spectrum.png"
  },
  {
    id: "rel-ries-rend-6",
    stepType: "swipe_sorter",
    question: "Clasifica por potencial",
    leftBucket: { label: "Bajo Riesgo / Bajo Rendimiento", color: "#60a5fa" },
    rightBucket: { label: "Alto Riesgo / Alto Rendimiento", color: "#f43f5e" },
    items: [
      { id: "1", label: "Cetes o Bonos de Gobierno", correctBucket: "left" },
      { id: "2", label: "Acciones de tecnología emergente", correctBucket: "right" },
      { id: "3", label: "Cuentas de ahorro bancarias", correctBucket: "left" },
      { id: "4", label: "Criptomonedas nuevas", correctBucket: "right" }
    ]
  },
  {
    id: "rel-ries-rend-7",
    stepType: "true_false",
    statement: "Es posible obtener rendimientos del 50% anual de forma consistente y segura.",
    correctValue: false,
    explanation: "Falso. Ni los mejores inversionistas del mundo logran eso de forma consistente. Mantener esa promesa es señal clara de poco profesionalismo o fraude."
  },
  {
    id: "rel-ries-rend-8",
    stepType: "blitz_challenge",
    question: "¿Qué es el 'Perfil de Inversionista'?",
    options: [
      { id: "1", label: "Tu foto de perfil", isCorrect: false },
      { id: "2", label: "Tu capacidad psicológica y financiera de soportar caídas", isCorrect: true },
      { id: "3", label: "Tu saldo bancario", isCorrect: false }
    ],
    timeLimit: 12
  },
  {
    id: "rel-ries-rend-9",
    stepType: "order",
    question: "Evolución de la balanza",
    items: [
      { id: "1", label: "Aceptación de mayor volatilidad", correctOrder: 1 },
      { id: "2", label: "Exigencia de mayor prima de riesgo", correctOrder: 2 },
      { id: "3", label: "Selección de activos de renta variable", correctOrder: 3 },
      { id: "4", label: "Cosecha de rendimientos superiores en el tiempo", correctOrder: 4 }
    ]
  },
  {
    id: "rel-ries-rend-10",
    stepType: "match",
    question: "Relaciona el perfil con su inversión",
    leftItems: [
      { id: "l1", label: "Conservador (Miedo al riesgo)" },
      { id: "l2", label: "Moderado (Equilibrio)" },
      { id: "l3", label: "Agresivo (Busca crecimiento)" }
    ],
    rightItems: [
      { id: "r1", label: "90% Bonos, 10% Acciones" },
      { id: "r2", label: "50% Bonos, 50% Acciones" },
      { id: "r3", label: "10% Bonos, 90% Acciones" }
    ],
    correctPairs: [
      { leftId: "l1", rightId: "r1" },
      { leftId: "l2", rightId: "r2" },
      { leftId: "l3", rightId: "r3" }
    ]
  },
  {
    id: "rel-ries-rend-11",
    stepType: "mindset_translator",
    question: "Traduce la ambición desmedida",
    beliefs: [
      {
        id: "b1",
        original: "Quiero hacerme millonario en 3 meses sin arriesgar mis ahorros.",
        healthyOptions: [
          { id: "h1", label: "Entiendo que la riqueza se construye con tiempo y una gestión inteligente del riesgo.", isCorrect: true },
          { id: "h2", label: "Voy a buscar el billete de lotería financiero.", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: "rel-ries-rend-12",
    stepType: "blitz_challenge",
    question: "Misión: ¿Qué es el 'Rendimiento Libre de Riesgo'?",
    options: [
      { id: "1", label: "Cero ganancia", isCorrect: false },
      { id: "2", label: "Lo que pagan los bonos de gobierno más seguros", isCorrect: true },
      { id: "3", label: "Un mito", isCorrect: false }
    ],
    timeLimit: 10
  },
  {
    id: "rel-ries-rend-13",
    stepType: "narrative_check",
    question: "Tolerancia Personal",
    body: "Si tu portafolio de $100,000 bajara a $70,000 en una semana por una crisis global, ¿podrías dormir tranquilo sabiendo que es algo temporal? Describe tu reacción.",
    placeholder: "Reaccionaría... porque entiendo que...",
    minChars: 30
  },
  {
    id: "rel-ries-rend-14",
    stepType: "summary",
    title: "Ley Inquebrantable",
    body: "Has comprendido el motor de las finanzas. Ya no pides milagros; exiges compensación justa por el riesgo que decides asumir. Eres un profesional.",
    aiInsight: "El riesgo no es malo; lo malo es no recibir el pago adecuado por él."
  },
  {
    id: "rel-ries-rend-15",
    stepType: "billy_talks",
    body: "¡Impresionante! Ahora vamos a dominar la mejor arma para domar al riesgo: La Diversificación.",
    mood: "happy"
  }
];

// ---------------------------------------------------------------------------
// LECCIÓN 12.1: ¿Qué es la diversificación?
// Slug: "diversificacion-que-es"
// ---------------------------------------------------------------------------
export const lessonDiversificacionQueEsSteps: LessonStep[] = [
  {
    id: "div-que-es-1",
    stepType: "billy_talks",
    title: "El Escudo del Inversor",
    body: "Si pones todos tus huevos en una canasta y esta se cae, te quedas sin cena. La [[Diversificación|Estrategia de distribuir el capital en diferentes activos]] es tu seguro de vida financiero.",
    data: {
      glossary: [
        { word: "Diversificación", definition: "Técnica de gestión de riesgos que mezcla una variedad de inversiones dentro de un portafolio." },
        { word: "Correlación", definition: "Medida en la que dos activos se mueven en la misma dirección." }
      ]
    }
  },
  {
    id: "div-que-es-2",
    stepType: "info",
    title: "No es Cantidad, es Calidad",
    aiInsight: "Diversificar no es tener 20 cuentas de banco; es tener activos que no dependan entre sí.",
    body: "Tener acciones de 5 bancos diferentes no es diversificar, es concentrarse en el sector financiero. Diversificación real es tener tecnología, salud, energía y bienes raíces al mismo tiempo.",
    imageUrl: "/lessons/bi-diversification-basics.png"
  },
  {
    id: "div-que-es-3",
    stepType: "impulse_meter",
    item: {
      name: "Acción de moda (Hype)",
      price: "Promesa de subir 1000%",
    },
    instructions: "Sientes el impulso de meter todo tu capital a esa acción 'ganadora' de la que todos hablan. ¿Qué tanto te detiene tu escudo?",
    data: {
      minLabel: "Solo meto un 5% (Diversifico)",
      maxLabel: "Todo adentro (Concentro)",
      targetValue: 1
    }
  },
  {
    id: "div-que-es-4",
    stepType: "mcq",
    question: "¿Cuál es el objetivo principal de la diversificación?",
    options: [
      { id: "1", label: "Ganar el doble de dinero", isCorrect: false },
      { id: "2", label: "Reducir la volatilidad y el riesgo de pérdida total", isCorrect: true, explanation: "Correcto. Al no depender de un solo punto de falla, tu portafolio es mucho más robusto." },
      { id: "3", label: "Tener muchos logotipos en mi app", isCorrect: false }
    ]
  },
  {
    id: "div-que-es-5",
    stepType: "info",
    title: "La Magia de los ETFs",
    body: "Un solo ETF como el VOO te da propiedad en 500 empresas de 11 sectores distintos. Con un solo clic, logras una diversificación que antes tomaba años y millones construir.",
    imageUrl: "/lessons/bi-etf-diversified.png"
  },
  {
    id: "div-que-es-6",
    stepType: "swipe_sorter",
    question: "Identifica la acción diversificadora",
    leftBucket: { label: "Diversificado", color: "#10b981" },
    rightBucket: { label: "Concentrado", color: "#ef4444" },
    items: [
      { id: "1", label: "Comprar un ETF global", correctBucket: "left" },
      { id: "2", label: "Comprar solo acciones de Tesla", correctBucket: "right" },
      { id: "3", label: "Tener Cetes y Acciones Mundiales", correctBucket: "left" },
      { id: "4", label: "Invertir todo en la empresa de mi primo", correctBucket: "right" }
    ]
  },
  {
    id: "div-que-es-7",
    stepType: "true_false",
    statement: "Diversificar demasiado puede limitar tus ganancias potenciales máximas.",
    correctValue: true,
    explanation: "Cierto. Si diversificas mucho, nunca perderás todo, pero tampoco te harás rico de la noche a mañana con una sola acción 'cohete'. Es el precio de la seguridad."
  },
  {
    id: "div-que-es-8",
    stepType: "blitz_challenge",
    question: "¿Qué es 'Cisne Negro'?",
    options: [
      { id: "1", label: "Un pájaro raro", isCorrect: false },
      { id: "2", label: "Un evento impredecible con impacto masivo", isCorrect: true },
      { id: "3", label: "Un tipo de bono", isCorrect: false }
    ],
    timeLimit: 12
  },
  {
    id: "div-que-es-9",
    stepType: "order",
    question: "Escalones de diversificación",
    items: [
      { id: "1", label: "Diversificar entre empresas (ETFs)", correctOrder: 1 },
      { id: "2", label: "Diversificar entre sectores (Tecnología, Salud...)", correctOrder: 2 },
      { id: "3", label: "Diversificar entre países (Global)", correctOrder: 3 },
      { id: "4", label: "Diversificar entre clases de activos (Bonos, Oro...)", correctOrder: 4 }
    ]
  },
  {
    id: "div-que-es-10",
    stepType: "match",
    question: "Relaciona el sector",
    leftItems: [
      { id: "l1", label: "Tecnología" },
      { id: "l2", label: "Consumo Básico" },
      { id: "l3", label: "Energía" }
    ],
    rightItems: [
      { id: "r1", label: "Software y Microchips" },
      { id: "r2", label: "Comida y Papel Higiénico" },
      { id: "r3", label: "Petróleo y Renovables" }
    ],
    correctPairs: [
      { leftId: "l1", rightId: "r1" },
      { leftId: "l2", rightId: "r2" },
      { leftId: "l3", rightId: "r3" }
    ]
  },
  {
    id: "div-que-es-11",
    stepType: "mindset_translator",
    question: "Traduce la obsesión por 'la ganadora'",
    beliefs: [
      {
        id: "b1",
        original: "Tengo que encontrar la próxima Amazon para retirarme rico.",
        healthyOptions: [
          { id: "h1", label: "Soy dueño de todas las potenciales ganadoras del mundo a través de un índice; no necesito adivinar.", isCorrect: true },
          { id: "h2", label: "Mejor paso todo el día leyendo rumores en Reddit.", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: "div-que-es-12",
    stepType: "blitz_challenge",
    question: "Misión: ¿Cuántas empresas tiene el S&P 500?",
    options: [
      { id: "1", label: "5", isCorrect: false },
      { id: "2", label: "500", isCorrect: true },
      { id: "3", label: "Todas las del mundo", isCorrect: false }
    ],
    timeLimit: 10
  },
  {
    id: "div-que-es-13",
    stepType: "narrative_check",
    question: "Propósito de Blindaje",
    body: "Imagina que el sector tecnológico tiene una caída del 40% este año. Si estás bien diversificado, ¿por qué tu portafolio no caería ese mismo 40%?",
    placeholder: "No caería igual porque tengo otros sectores como...",
    minChars: 30
  },
  {
    id: "div-que-es-14",
    stepType: "summary",
    title: "Blindaje de Portafolio",
    body: "Has entendido que la diversificación es la única 'comida gratis' en Wall Street. Te permite reducir el riesgo sin sacrificar necesariamente todo el rendimiento.",
    aiInsight: "Diversificar es el arte de no tener razón siempre, pero nunca estar totalmente equivocado."
  },
  {
    id: "div-que-es-15",
    stepType: "billy_talks",
    body: "¡Magistral! Ya sabemos qué es. Ahora vamos a ver por qué es tan importante para sobrevivir a largo plazo.",
    mood: "happy"
  }
];

// ---------------------------------------------------------------------------
// LECCIÓN 12.2: Importancia de diversificar
// Slug: "importancia-diversificacion"
// ---------------------------------------------------------------------------
export const lessonImportanciaDiversificacionSteps: LessonStep[] = [
  {
    id: "imp-div-1",
    stepType: "billy_talks",
    title: "Sobrevivir al Apocalipsis",
    body: "La diversificación no es para los días soleados; es para las tormentas que nadie vio venir. Vamos a ver por qué es tu mejor defensa contra lo impredecible.",
    data: {
      glossary: [
        { word: "Riesgo de Concentración", definition: "Peligro de perder una gran parte del capital por depender de un solo activo o sector." },
        { word: "Rebalanceo", definition: "Ajustar periódicamente los pesos de tus activos para mantener tu nivel de riesgo deseado." }
      ]
    }
  },
  {
    id: "imp-div-2",
    stepType: "info",
    title: "El Fantasma de las Quiebras",
    aiInsight: "Incluso las empresas más grandes pueden desaparecer (ej. Nokia, Blockbuster o Lehman Brothers).",
    body: "Si hubieras invertido todo en la empresa 'segura' del momento en el año 2000, podrías haber perdido el 100%. La diversificación te protege contra la extinción individual de activos.",
    imageUrl: "/lessons/bi-extinction-risk.png"
  },
  {
    id: "imp-div-3",
    stepType: "impulse_meter",
    item: {
      name: "Empresa local estrella",
      price: "Parece invencible",
    },
    instructions: "Te invitan a meter todos tus ahorros a la empresa más exitosa de tu ciudad. Prometen que nunca fallarán. ¿Qué dice tu radar de sobreviviente?",
    data: {
      minLabel: "Radar en rojo (No diversificado)",
      maxLabel: "Confío ciegamente",
      targetValue: 1
    }
  },
  {
    id: "imp-div-4",
    stepType: "mcq",
    question: "¿Qué nos enseña la historia sobre las empresas 'invencibles'?",
    options: [
      { id: "1", label: "Que siempre serán líderes", isCorrect: false },
      { id: "2", label: "Que los mercados cambian y cualquier empresa puede caer", isCorrect: true, explanation: "Exacto. La innovación y la competencia no perdonan. Diversificar es aceptar que no podemos predecir el futuro." },
      { id: "3", label: "Que los CEOs son genios infalibles", isCorrect: false }
    ]
  },
  {
    id: "imp-div-5",
    stepType: "info",
    title: "Dormir Tranquilo",
    body: "La mayor importancia de diversificar es psicológica. Si una empresa quiebra pero solo representa el 0.1% de tu portafolio, tu vida sigue igual. Si representa el 50%, tu vida se arruina. Tú eliges.",
    imageUrl: "/lessons/bi-sleep-well.png"
  },
  {
    id: "imp-div-6",
    stepType: "swipe_sorter",
    question: "Identifica la amenaza",
    leftBucket: { label: "Protegido por Diversificación", color: "#10b981" },
    rightBucket: { label: "Amenaza de Muerte", color: "#ef4444" },
    items: [
      { id: "1", label: "Escándalo de fraude en 1 empresa", correctBucket: "left" },
      { id: "2", label: "Quiebra de tu único sector de inversión", correctBucket: "right" },
      { id: "3", label: "Mala década para una industria", correctBucket: "left" },
      { id: "4", label: "Apostar todo al precio del petróleo", correctBucket: "right" }
    ]
  },
  {
    id: "imp-div-7",
    stepType: "true_false",
    statement: "La diversificación es la única defensa efectiva contra un 'Cisne Negro' financiero.",
    correctValue: true,
    explanation: "Correcto. Como no sabemos cuándo vendrá el próximo gran desastre, estar repartidos es la única forma de no ser borrados del mapa."
  },
  {
    id: "imp-div-8",
    stepType: "blitz_challenge",
    question: "¿Cómo se llama tener activos que no se mueven igual?",
    options: [
      { id: "1", label: "Desconcentración", isCorrect: false },
      { id: "2", label: "Descorrelación", isCorrect: true },
      { id: "3", label: "Distorsión", isCorrect: false }
    ],
    timeLimit: 12
  },
  {
    id: "imp-div-9",
    stepType: "order",
    question: "Prioridad de un portafolio BIZEN",
    items: [
      { id: "1", label: "Protección del Capital (No morir)", correctOrder: 1 },
      { id: "2", label: "Crecimiento sistemático", correctOrder: 2 },
      { id: "3", label: "Optimización de costos", correctOrder: 3 },
      { id: "4", label: "Búsqueda de alfa (Ganancia extra)", correctOrder: 4 }
    ]
  },
  {
    id: "imp-div-10",
    stepType: "match",
    question: "Relaciona la catástrofe con el escudo",
    leftItems: [
      { id: "l1", label: "Pandemia Global" },
      { id: "l2", label: "Devaluación Moneda Local" },
      { id: "l3", label: "Crisis Tecnológica" }
    ],
    rightItems: [
      { id: "r1", label: "Diversificación por Países" },
      { id: "r2", label: "Diversificación por Divisas (Dólar)" },
      { id: "r3", label: "Diversificación por Sectores" }
    ],
    correctPairs: [
      { leftId: "l1", rightId: "r1" },
      { leftId: "l2", rightId: "r2" },
      { leftId: "l3", rightId: "r3" }
    ]
  },
  {
    id: "imp-div-11",
    stepType: "mindset_translator",
    question: "Traduce el miedo a 'perderse la subida'",
    beliefs: [
      {
        id: "b1",
        original: "Si diversifico, mis ganancias van a ser mediocres comparadas con el que apostó todo a Nvidia.",
        healthyOptions: [
          { id: "h1", label: "Prefiero una riqueza segura y constante que una apuesta que tiene 90% de probabilidad de dejarme en la calle.", isCorrect: true },
          { id: "h2", label: "Si no arriesgo todo, no soy un verdadero inversor.", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: "imp-div-12",
    stepType: "blitz_challenge",
    question: "Misión: ¿Cuál es la 'comida gratis' en Wall Street?",
    options: [
      { id: "1", label: "Los cupones", isCorrect: false },
      { id: "2", label: "La diversificación", isCorrect: true },
      { id: "3", label: "Las propinas", isCorrect: false }
    ],
    timeLimit: 10
  },
  {
    id: "imp-div-13",
    stepType: "narrative_check",
    question: "Análisis de Robustez",
    body: "Describe cómo te sentirías mentalmente si tuvieras todo tu dinero en una sola empresa y esta reportara pérdidas hoy, vs si esa misma empresa fuera solo el 1% de tu portafolio global.",
    placeholder: "En el primer caso... En el segundo...",
    minChars: 30
  },
  {
    id: "imp-div-14",
    stepType: "summary",
    title: "Sobrevivencia Garantizada",
    body: "Has entendido que invertir es un juego de supervivencia. Al diversificar, te aseguras de seguir en la mesa de juego pase lo que pase en el mundo exterior.",
    aiInsight: "No ganes hoy lo que te haga perder mañana."
  },
  {
    id: "imp-div-15",
    stepType: "billy_talks",
    body: "¡Espectacular! Ahora vamos a ver ejemplos reales de cómo se ve una buena y una mala diversificación.",
    mood: "happy"
  }
];

// ---------------------------------------------------------------------------
// LECCIÓN 12.3: Ejemplos de Diversificación
// Slug: "ejemplos-diversificacion"
// ---------------------------------------------------------------------------
export const lessonEjemplosDiversificacionSteps: LessonStep[] = [
  {
    id: "eje-div-1",
    stepType: "billy_talks",
    title: "De la Teoría a la Práctica",
    body: "Vamos a ver portafolios reales. Aprenderás a detectar a simple vista un portafolio frágil de uno robusto y profesional.",
    data: {
      glossary: [
        { word: "Sobre-diversificación", definition: "Tener tantos activos que las ganancias se diluyen y el costo de gestión aumenta sin beneficio real." },
        { word: "Core & Satellite", definition: "Estrategia de tener un núcleo sólido diversificado (ETFs) y pequeñas apuestas individuales (Satélites)." }
      ]
    }
  },
  {
    id: "eje-div-2",
    stepType: "info",
    title: "El Portafolio 'Casino' (Fragilidad)",
    aiInsight: "Muchos principiantes confunden 'tener muchas cosas' con diversificar.",
    body: "Ejemplo Malo: 10 criptomonedas diferentes, 3 acciones de tecnología y 1 fondo de innovación. Resultado: Todo está correlacionado. Si la tecnología cae, todo tu portafolio cae un 80%. Eso no es diversificar.",
    imageUrl: "/lessons/bi-bad-portfolio.png"
  },
  {
    id: "eje-div-3",
    stepType: "impulse_meter",
    item: {
      name: "Tu Portafolio actual",
      price: "Analizando sectores",
    },
    instructions: "Te das cuenta de que el 80% de tu dinero depende de que a las empresas tech les vaya bien. ¿Qué tanto te urge corregir?",
    data: {
      minLabel: "Lo corrijo ya (Equilibrio)",
      maxLabel: "Lo dejo así (Me gusta el riesgo)",
      targetValue: 1
    }
  },
  {
    id: "eje-div-4",
    stepType: "mcq",
    question: "Un portafolio con 10 tipos de criptomonedas diferentes, ¿está bien diversificado?",
    options: [
      { id: "1", label: "Sí, porque son muchas monedas", isCorrect: false },
      { id: "2", label: "No, porque todas dependen del mismo factor de riesgo (sector cripto)", isCorrect: true, explanation: "Exacto. Estás diversificando en número de activos, pero no en fuentes de riesgo." },
      { id: "3", label: "Depende de cuál sea la más cara", isCorrect: false }
    ]
  },
  {
    id: "eje-div-5",
    stepType: "info",
    title: "El Portafolio BIZEN (Resiliencia)",
    body: "Ejemplo Bueno: 60% ETF Mundial (VOO/VT), 20% Bonos de Gobierno, 10% Bienes Raíces (FIBRAS) y 10% Efectivo. Resultado: Si la bolsa cae, tus bonos y efectivo te sostienen. Si la bolsa sube, tu 60% captura el crecimiento.",
    imageUrl: "/lessons/bi-good-portfolio.png"
  },
  {
    id: "eje-div-6",
    stepType: "swipe_sorter",
    question: "Identifica el nivel de riesgo",
    leftBucket: { label: "Portafolio Equilibrado", color: "#10b981" },
    rightBucket: { label: "Portafolio Explosivo", color: "#ef4444" },
    items: [
      { id: "1", label: "Mezcla de Bonos, ETFs y Fibras", correctBucket: "left" },
      { id: "2", label: "100% acciones de inteligencia artificial", correctBucket: "right" },
      { id: "3", label: "Fondo de emergencia + Índice Global", correctBucket: "left" },
      { id: "4", label: "Ahorros invertidos en una sola startup", correctBucket: "right" }
    ]
  },
  {
    id: "eje-div-7",
    stepType: "true_false",
    statement: "Tener un ETF global es como tener un equipo de fútbol con jugadores de todos los países y posiciones.",
    correctValue: true,
    explanation: "Gran analogía. Tienes defensa (bonos), mediocampo (dividendos) y delanteros (crecimiento)."
  },
  {
    id: "eje-div-8",
    stepType: "blitz_challenge",
    question: "¿Qué pasa si diversificas en 1,000 empresas malas?",
    options: [
      { id: "1", label: "Se vuelven buenas", isCorrect: false },
      { id: "2", label: "Sigues teniendo un portafolio malo", isCorrect: true },
      { id: "3", label: "La bolsa te regala dinero", isCorrect: false }
    ],
    timeLimit: 12
  },
  {
    id: "eje-div-9",
    stepType: "order",
    question: "Construcción de un portafolio BIZEN",
    items: [
      { id: "1", label: "Definir fondo de emergencia (Efectivo)", correctOrder: 1 },
      { id: "2", label: "Asignar core del portafolio (ETFs Globales)", correctOrder: 2 },
      { id: "3", label: "Agregar protección (Renta Fija)", correctOrder: 3 },
      { id: "4", label: "Añadir satélites (Opcional)", correctOrder: 4 }
    ]
  },
  {
    id: "eje-div-10",
    stepType: "match",
    question: "Relaciona el activo con su función",
    leftItems: [
      { id: "l1", label: "S&P 500 (Acciones)" },
      { id: "l2", label: "Bonos del Tesoro" },
      { id: "l3", label: "Efectivo (Cuenta banco)" }
    ],
    rightItems: [
      { id: "r1", label: "Crecimiento de Capital" },
      { id: "r2", label: "Estabilidad y Protección" },
      { id: "r3", label: "Liquidez Inmediata" }
    ],
    correctPairs: [
      { leftId: "l1", rightId: "r1" },
      { leftId: "l2", rightId: "r2" },
      { leftId: "l3", rightId: "r3" }
    ]
  },
  {
    id: "eje-div-11",
    stepType: "mindset_translator",
    question: "Traduce el miedo al aburrimiento",
    beliefs: [
      {
        id: "b1",
        original: "Mi portafolio diversificado es muy aburrido, no se mueve nada.",
        healthyOptions: [
          { id: "h1", label: "El aburrimiento es señal de una estrategia sólida; busco libertad, no adrenalina.", isCorrect: true },
          { id: "h2", label: "Voy a vender todo para comprar algo que suba 50% mañana.", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: "eje-div-12",
    stepType: "blitz_challenge",
    question: "Misión: ¿Qué es el 'DCA'?",
    options: [
      { id: "1", label: "Comprar barato", isCorrect: false },
      { id: "2", label: "Invertir la misma cantidad periódicamente", isCorrect: true },
      { id: "3", label: "Un tipo de moneda", isCorrect: false }
    ],
    timeLimit: 10
  },
  {
    id: "eje-div-13",
    stepType: "narrative_check",
    question: "Diseño de Portafolio",
    body: "Si tuvieras $10,000 para invertir hoy, ¿cómo los repartirías entre Acciones Mundiales, Bonos y Efectivo para sentirte seguro pero ver crecimiento?",
    placeholder: "Pondría $... en... porque...",
    minChars: 30
  },
  {
    id: "eje-div-14",
    stepType: "summary",
    title: "Arquitecto de Riqueza",
    body: "Has pasado de ser un apostador a ser un arquitecto. Sabes diseñar estructuras que aguantan terremotos financieros y crecen con el tiempo.",
    aiInsight: "No busques el activo perfecto, busca la combinación perfecta."
  },
  {
    id: "eje-div-15",
    stepType: "billy_talks",
    body: "¡Fabuloso! Hemos terminado el bloque de diversificación. Ahora vamos a sumergirnos en la dimensión más importante: El Tiempo.",
    mood: "happy"
  }
];

// ---------------------------------------------------------------------------
// LECCIÓN 13.1: ¿Qué es el corto plazo?
// Slug: "corto-plazo"
// ---------------------------------------------------------------------------
export const lessonCortoPlazoSteps: LessonStep[] = [
  {
    id: "cor-pla-1",
    stepType: "billy_talks",
    title: "El Horizonte Inmediato",
    body: "El tiempo es la variable más poderoza en finanzas. En el [[Corto Plazo|Periodo de 0 a 3 años]], las reglas son muy diferentes. Vamos a ver dónde poner este dinero.",
    data: {
      glossary: [
        { word: "Corto Plazo", definition: "Horizonte de tiempo que abarca desde hoy hasta los 3 años." },
        { word: "Renta Fija", definition: "Inversiones donde conoces el rendimiento aproximado de antemano (ej. Cetes)." }
      ]
    }
  },
  {
    id: "cor-pla-2",
    stepType: "info",
    title: "La Trampa de la Bolsa",
    aiInsight: "Invertir dinero de la renta en la bolsa es una receta para el desastre.",
    body: "En el corto plazo, el mercado es una moneda al aire. Si necesitas dinero para tu boda en 6 meses, la bolsa es el peor lugar. El corto plazo exige seguridad y [[Liquidez|Disponibilidad inmediata del dinero]].",
    imageUrl: "/lessons/bi-short-term-danger.png"
  },
  {
    id: "cor-pla-3",
    stepType: "impulse_meter",
    item: {
      name: "Dinero para las vacaciones",
      price: "Diciembre (en 4 meses)",
    },
    instructions: "Tienes el dinero de tus vacaciones y ves que la bolsa está subiendo. Sientes el impulso de 'multiplicarlo' rápido. ¿Qué tanto respetas tu horizonte?",
    data: {
      minLabel: "Lo dejo en Cetes (Seguro)",
      maxLabel: "Lo meto a la bolsa (Arriesgo)",
      targetValue: 1
    }
  },
  {
    id: "cor-pla-4",
    stepType: "mcq",
    question: "¿Cuál es el activo ideal para el corto plazo?",
    options: [
      { id: "1", label: "Acciones tecnológicas volátiles", isCorrect: false },
      { id: "2", label: "Bonos gubernamentales o cuentas de ahorro seguras", isCorrect: true, explanation: "Exacto. Necesitas la certeza de que tu dinero estará ahí completo cuando lo necesites." },
      { id: "3", label: "Colección de NFTs", isCorrect: false }
    ]
  },
  {
    id: "cor-pla-5",
    stepType: "info",
    title: "Fondo de Emergencia",
    body: "El fondo de emergencia es el rey del corto plazo. Debe estar en un lugar que pague algo de interés (para vencer la inflación) pero que puedas retirar en 24 horas. Esa es tu paz mental.",
    imageUrl: "/lessons/bi-emergency-fund.png"
  },
  {
    id: "cor-pla-6",
    stepType: "swipe_sorter",
    question: "Identifica la meta",
    leftBucket: { label: "Corto Plazo (Renta Fija)", color: "#10b981" },
    rightBucket: { label: "Largo Plazo (Bolsa)", color: "#3b82f6" },
    items: [
      { id: "1", label: "Enganche para casa en 2 años", correctBucket: "left" },
      { id: "2", label: "Dinero para mi jubilación en 30 años", correctBucket: "right" },
      { id: "3", label: "Mantenimiento del auto el próximo mes", correctBucket: "left" },
      { id: "4", label: "Fondo para la universidad de mi bebé", correctBucket: "right" }
    ]
  },
  {
    id: "cor-pla-7",
    stepType: "true_false",
    statement: "En el corto plazo, la volatilidad es tu enemiga número uno.",
    correctValue: true,
    explanation: "Cierto. No tienes tiempo para esperar a que el mercado se recupere de una caída."
  },
  {
    id: "cor-pla-8",
    stepType: "blitz_challenge",
    question: "¿Qué es el 'Costo de Oportunidad'?",
    options: [
      { id: "1", label: "El precio de una oferta", isCorrect: false },
      { id: "2", label: "Lo que pierdes por elegir una opción sobre otra", isCorrect: true },
      { id: "3", label: "Un impuesto", isCorrect: false }
    ],
    timeLimit: 12
  },
  {
    id: "cor-pla-9",
    stepType: "order",
    question: "Pasos para gestionar corto plazo",
    items: [
      { id: "1", label: "Identificar meta y fecha exacta", correctOrder: 1 },
      { id: "2", label: "Calcular monto necesario", correctOrder: 2 },
      { id: "3", label: "Seleccionar instrumento de renta fija", correctOrder: 3 },
      { id: "4", label: "Programar aportaciones", correctOrder: 4 }
    ]
  },
  {
    id: "cor-pla-10",
    stepType: "match",
    question: "Relaciona la meta con el plazo",
    leftItems: [
      { id: "l1", label: "Seguro de gastos médicos" },
      { id: "l2", label: "Viaje de fin de año" },
      { id: "l3", label: "Regalo de cumpleaños" }
    ],
    rightItems: [
      { id: "r1", label: "Anual (Corto)" },
      { id: "r2", label: "Meses (Muy Corto)" },
      { id: "r3", label: "Inmediato (Días)" }
    ],
    correctPairs: [
      { leftId: "l1", rightId: "r1" },
      { leftId: "l2", rightId: "r2" },
      { leftId: "l3", rightId: "r3" }
    ]
  },
  {
    id: "cor-pla-11",
    stepType: "mindset_translator",
    question: "Traduce la impaciencia de ganar",
    beliefs: [
      {
        id: "b1",
        original: "Gano muy poco en Cetes, mejor meto lo de la renta a la bolsa para duplicarlo.",
        healthyOptions: [
          { id: "h1", label: "El dinero de mis compromisos inmediatos no se arriesga; su función es estar listo, no crecer agresivamente.", isCorrect: true },
          { id: "h2", label: "El que no arriesga la renta, no gana.", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: "cor-pla-12",
    stepType: "blitz_challenge",
    question: "Misión: ¿Cuál es el horizonte de corto plazo?",
    options: [
      { id: "1", label: "1 semana", isCorrect: false },
      { id: "2", label: "0 a 3 años", isCorrect: true },
      { id: "3", label: "10 años", isCorrect: false }
    ],
    timeLimit: 10
  },
  {
    id: "cor-pla-13",
    stepType: "narrative_check",
    question: "Estrategia Segura",
    body: "Si tuvieras que ahorrar para un compromiso en 18 meses, ¿qué herramienta usarías y por qué no usarías el mercado de valores?",
    placeholder: "Usaría... No usaría bolsa porque...",
    minChars: 30
  },
  {
    id: "cor-pla-14",
    stepType: "summary",
    title: "Guardia del Capital",
    body: "Has dominado la gestión del presente. Sabes que la riqueza se construye sobre una base sólida de dinero seguro para tus necesidades inmediatas.",
    aiInsight: "El corto plazo es para dormir; el largo plazo es para soñar."
  },
  {
    id: "cor-pla-15",
    stepType: "billy_talks",
    body: "¡Fantástico! Ahora vamos a subir un escalón: El Mediano Plazo.",
    mood: "happy"
  }
];

// ---------------------------------------------------------------------------
// LECCIÓN 13.2: ¿Qué es el mediano plazo?
// Slug: "mediano-plazo"
// ---------------------------------------------------------------------------
export const lessonMedianoPlazoSteps: LessonStep[] = [
  {
    id: "med-pla-1",
    stepType: "billy_talks",
    title: "El Puente Financiero",
    body: "El [[Mediano Plazo|Periodo de 4 a 10 años]] es donde empezamos a mezclar seguridad con crecimiento. Es la zona ideal para grandes metas de vida.",
    data: {
      glossary: [
        { word: "Mediano Plazo", definition: "Horizonte de tiempo que abarca de los 4 a los 10 años." },
        { word: "Crecimiento de Capital", definition: "Aumento del valor de una inversión a lo largo del tiempo." }
      ]
    }
  },
  {
    id: "med-pla-2",
    stepType: "info",
    title: "Metas de Transformación",
    aiInsight: "A 5 años, la probabilidad de que la bolsa esté en positivo es mucho mayor que a 1 año.",
    body: "El mediano plazo es para comprar una casa, iniciar un negocio o pagar una maestría. Aquí ya puedes permitirte tener una parte en la bolsa (ETFs) porque tienes tiempo para recuperarte de caídas leves.",
    imageUrl: "/lessons/bi-medium-term.png"
  },
  {
    id: "med-pla-3",
    stepType: "impulse_meter",
    item: {
      name: "Enganche para casa",
      price: "En 5 años",
    },
    instructions: "Tienes 5 años para juntar el dinero. Sientes que vas lento. ¿Qué tanta 'gasolina' (riesgo) le pones a tu motor?",
    data: {
      minLabel: "50% Bonos, 50% Bolsa",
      maxLabel: "100% Bolsa (Arriesgado)",
      targetValue: 2
    }
  },
  {
    id: "med-pla-4",
    stepType: "mcq",
    question: "¿Qué estrategia es común para el mediano plazo?",
    options: [
      { id: "1", label: "Todo al colchón", isCorrect: false },
      { id: "2", label: "Una mezcla equilibrada de renta fija y renta variable (bolsa)", isCorrect: true, explanation: "Correcto. Buscas capturar el crecimiento del mercado sin arriesgarte a una caída total cerca de tu meta." },
      { id: "3", label: "Apostar en el casino", isCorrect: false }
    ]
  },
  {
    id: "med-pla-5",
    stepType: "info",
    title: "El Poder de la Paciencia",
    body: "A mediano plazo, el interés compuesto empieza a notarse. Tu dinero ya no solo se protege, empieza a trabajar de verdad. Es el momento donde el 'hábito' se convierte en 'patrimonio'.",
    imageUrl: "/lessons/bi-patient-growth.png"
  },
  {
    id: "med-pla-6",
    stepType: "swipe_sorter",
    question: "Identifica la meta de mediano plazo",
    leftBucket: { label: "Mediano Plazo (4-10 años)", color: "#10b981" },
    rightBucket: { label: "Otros Plazos", color: "#6b7280" },
    items: [
      { id: "1", label: "Cambiar de auto en 5 años", correctBucket: "left" },
      { id: "2", label: "Comprar pan hoy", correctBucket: "right" },
      { id: "3", label: "Enganche de departamento en 7 años", correctBucket: "left" },
      { id: "4", label: "Inversión para el retiro en 35 años", correctBucket: "right" }
    ]
  },
  {
    id: "med-pla-7",
    stepType: "true_false",
    statement: "En el mediano plazo, puedes ignorar las caídas diarias del mercado.",
    correctValue: true,
    explanation: "Cierto. Tienes varios años por delante para que el mercado siga su tendencia alcista histórica."
  },
  {
    id: "med-pla-8",
    stepType: "blitz_challenge",
    question: "¿Qué es el 'Rebalanceo'?",
    options: [
      { id: "1", label: "Cerrar la cuenta", isCorrect: false },
      { id: "2", label: "Regresar tu portafolio a los porcentajes originales", isCorrect: true },
      { id: "3", label: "Hacer ejercicio", isCorrect: false }
    ],
    timeLimit: 12
  },
  {
    id: "med-pla-9",
    stepType: "order",
    question: "Gestión de una meta de 5 años",
    items: [
      { id: "1", label: "Inversión agresiva al inicio", correctOrder: 1 },
      { id: "2", label: "Aportaciones recurrentes (DCA)", correctOrder: 2 },
      { id: "3", label: "Rebalanceo anual", correctOrder: 3 },
      { id: "4", label: "Mover a renta fija al acercarse el año 5", correctOrder: 4 }
    ]
  },
  {
    id: "med-pla-10",
    stepType: "match",
    question: "Relaciona el porcentaje de bolsa sugerido",
    leftItems: [
      { id: "l1", label: "A 4 años de la meta" },
      { id: "l2", label: "A 8 años de la meta" },
      { id: "l3", label: "A 1 año de la meta" }
    ],
    rightItems: [
      { id: "r1", label: "40% - 50% Bolsa" },
      { id: "r2", label: "70% - 80% Bolsa" },
      { id: "r3", label: "0% - 10% Bolsa" }
    ],
    correctPairs: [
      { leftId: "l1", rightId: "r1" },
      { leftId: "l2", rightId: "r2" },
      { leftId: "l3", rightId: "r3" }
    ]
  },
  {
    id: "med-pla-11",
    stepType: "mindset_translator",
    question: "Traduce el miedo al 'estancamiento'",
    beliefs: [
      {
        id: "b1",
        original: "Si no saco todo mi dinero ahora que bajó la bolsa, voy a perder mi casa en 5 años.",
        healthyOptions: [
          { id: "h1", label: "El tiempo está a mi favor; los ciclos económicos duran menos que mi proyecto de vida.", isCorrect: true },
          { id: "h2", label: "Mejor vendo todo y guardo el efectivo bajo la cama.", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: "med-pla-12",
    stepType: "blitz_challenge",
    question: "Misión: ¿Cuál es el horizonte de mediano plazo?",
    options: [
      { id: "1", label: "5 minutos", isCorrect: false },
      { id: "2", label: "4 a 10 años", isCorrect: true },
      { id: "3", label: "Toda la vida", isCorrect: false }
    ],
    timeLimit: 10
  },
  {
    id: "med-pla-13",
    stepType: "narrative_check",
    question: "Visión de Transición",
    body: "Si tuvieras una meta a 7 años, ¿cómo irías cambiando tu inversión conforme pasen los años? ¿Por qué es importante ser más conservador al final?",
    placeholder: "Empezaría con... y terminaría con... porque...",
    minChars: 30
  },
  {
    id: "med-pla-14",
    stepType: "summary",
    title: "Constructor de Sueños",
    body: "Has aprendido a usar el tiempo como un catalizador. El mediano plazo es la zona donde las grandes metas de vida se vuelven financieramente posibles.",
    aiInsight: "El tiempo reduce el riesgo y aumenta la recompensa."
  },
  {
    id: "med-pla-15",
    stepType: "billy_talks",
    body: "¡Impresionante! Ahora vamos a entrar a la dimensión definitiva: El Largo Plazo.",
    mood: "happy"
  }
];

// ---------------------------------------------------------------------------
// LECCIÓN 13.3: ¿Qué es el largo plazo?
// Slug: "largo-plazo"
// ---------------------------------------------------------------------------
export const lessonLargoPlazoSteps: LessonStep[] = [
  {
    id: "lar-pla-1",
    stepType: "billy_talks",
    title: "El Reino del Infinito",
    body: "El [[Largo Plazo|Periodo superior a 10 años]] es donde ocurren los milagros financieros. Aquí es donde se construye la verdadera libertad.",
    data: {
      glossary: [
        { word: "Largo Plazo", definition: "Horizonte de tiempo superior a los 10 años." },
        { word: "Interés Compuesto", definition: "El fenómeno donde las ganancias de tu inversión generan sus propias ganancias." }
      ]
    }
  },
  {
    id: "lar-pla-2",
    stepType: "info",
    title: "La Invencibilidad Estadística",
    aiInsight: "En periodos de 20 años, la bolsa de EE.UU. jamás ha tenido un retorno negativo en su historia.",
    body: "A largo plazo, la volatilidad diaria es ruido. Aquí puedes ser 100% agresivo (ETF Mundial) porque el tiempo borrará cualquier caída temporal. Es el dominio de la [[Libertad Financiera|Vivir de tus inversiones]].",
    imageUrl: "/lessons/bi-long-term-magic.png"
  },
  {
    id: "lar-pla-3",
    stepType: "impulse_meter",
    item: {
      name: "Tu Retiro",
      price: "En 30 años",
    },
    instructions: "Ves que la bolsa cae un 20% este año. Tienes 30 años por delante. ¿Qué haces con tus aportaciones mensuales?",
    data: {
      minLabel: "Invierto MÁS (Compro barato)",
      maxLabel: "Dejo de invertir (Miedo)",
      targetValue: 1
    }
  },
  {
    id: "lar-pla-4",
    stepType: "mcq",
    question: "¿Cuál es el mejor aliado del inversionista a largo plazo?",
    options: [
      { id: "1", label: "La buena suerte", isCorrect: false },
      { id: "2", label: "El interés compuesto y el tiempo", isCorrect: true, explanation: "Exacto. El tiempo permite que la bola de nieve crezca de forma exponencial hasta volverse imparable." },
      { id: "3", label: "Tener el mejor broker", isCorrect: false }
    ]
  },
  {
    id: "lar-pla-5",
    stepType: "info",
    title: "La Curva Exponencial",
    body: "La mayor parte de tu riqueza no vendrá de tu ahorro, sino de los rendimientos sobre rendimientos. Al final del camino, tu capital trabajará más duro que tú. Ese es el objetivo BIZEN.",
    imageUrl: "/lessons/bi-compounding-power.png"
  },
  {
    id: "lar-pla-6",
    stepType: "swipe_sorter",
    question: "Identifica el activo de largo plazo",
    leftBucket: { label: "Ideal Largo Plazo (10+ años)", color: "#3b82f6" },
    rightBucket: { label: "No Recomendado", color: "#6b7280" },
    items: [
      { id: "1", label: "ETF de las 500 empresas más grandes", correctBucket: "left" },
      { id: "2", label: "Efectivo guardado en el cajón", correctBucket: "right" },
      { id: "3", label: "ETF de acciones globales", correctBucket: "left" },
      { id: "4", label: "Ahorro bancario de 0.1% interés", correctBucket: "right" }
    ]
  },
  {
    id: "lar-pla-7",
    stepType: "true_false",
    statement: "A largo plazo, lo más peligroso es NO estar invertido en bolsa.",
    correctValue: true,
    explanation: "Correcto. El riesgo de inflación y de no alcanzar tus metas es mucho mayor que el riesgo de una caída temporal de la bolsa."
  },
  {
    id: "lar-pla-8",
    stepType: "blitz_challenge",
    question: "¿Qué porcentaje de acciones suele tener un portafolio a 30 años?",
    options: [
      { id: "1", label: "10%", isCorrect: false },
      { id: "2", label: "80% - 100%", isCorrect: true },
      { id: "3", label: "0%", isCorrect: false }
    ],
    timeLimit: 12
  },
  {
    id: "lar-pla-9",
    stepType: "order",
    question: "Evolución de tu riqueza",
    items: [
      { id: "1", label: "Aportación constante inicial", correctOrder: 1 },
      { id: "2", label: "Primera década de crecimiento lineal", correctOrder: 2 },
      { id: "3", label: "Segunda década de aceleración", correctOrder: 3 },
      { id: "4", label: "Tercera década de explosión exponencial", correctOrder: 4 }
    ]
  },
  {
    id: "lar-pla-10",
    stepType: "match",
    question: "Relaciona el personaje con su éxito",
    leftItems: [
      { id: "l1", label: "Inversor Constante" },
      { id: "l2", label: "Inversor Impaciente" },
      { id: "l3", label: "No Inversor" }
    ],
    rightItems: [
      { id: "r1", label: "Libertad financiera exponencial" },
      { id: "r2", label: "Patrimonio mediocre por comisiones" },
      { id: "r3", label: "Dependencia infinita del trabajo" }
    ],
    correctPairs: [
      { leftId: "l1", rightId: "r1" },
      { leftId: "l2", rightId: "r2" },
      { leftId: "l3", rightId: "r3" }
    ]
  },
  {
    id: "lar-pla-11",
    stepType: "mindset_translator",
    question: "Traduce la visión a corto plazo",
    beliefs: [
      {
        id: "b1",
        original: "La bolsa bajó hoy 2%, voy a perder todo mi retiro.",
        healthyOptions: [
          { id: "h1", label: "Hoy es solo un píxel en una película de 40 años; sigo comprando con descuento.", isCorrect: true },
          { id: "h2", label: "Mejor vendo ahora que solo perdí un poco.", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: "lar-pla-12",
    stepType: "blitz_challenge",
    question: "Misión: ¿Cuál es el horizonte de largo plazo?",
    options: [
      { id: "1", label: "Mañana", isCorrect: false },
      { id: "2", label: "Más de 10 años", isCorrect: true },
      { id: "3", label: "3 semanas", isCorrect: false }
    ],
    timeLimit: 10
  },
  {
    id: "lar-pla-13",
    stepType: "narrative_check",
    question: "Visión de Futuro",
    body: "Describe cómo imaginas que será tu vida si hoy decides ser fiel a tu estrategia de largo plazo. ¿Qué estarás haciendo dentro de 25 años gracias a esta decisión?",
    placeholder: "Estaré haciendo... sentiré...",
    minChars: 30
  },
  {
    id: "lar-pla-14",
    stepType: "summary",
    title: "Legado y Libertad",
    body: "Has alcanzado el nivel máximo de conciencia financiera. El tiempo ya no es algo que se te escapa, sino una herramienta que construye tu legado paso a paso.",
    aiInsight: "El mejor momento para plantar un árbol fue hace 20 años; el segundo mejor momento es hoy."
  },
  {
    id: "lar-pla-15",
    stepType: "billy_talks",
    body: "¡Increíble! Hemos terminado todo el bloque estratégico de riesgo y plazos. Estás listo para tomar las riendas de tu vida financiera.",
    mood: "mascot"
  }
];
