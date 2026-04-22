import type { LessonStep } from "@/types/lessonTypes"

// ---------------------------------------------------------------------------
// LECCIÓN 7: ¿Qué es invertir?
// Slug: "que-es-invertir"
// ---------------------------------------------------------------------------
export const lessonQueEsInvertirSteps: LessonStep[] = [
  {
    id: "que-es-invertir-1",
    stepType: "billy_talks",
    title: "La Definicion de Poder",
    body: "Invertir no es 'guardar dinero'. Es poner a trabajar tu capital para que otros creen valor. Vamos a desmitificar este acto de ingeniería financiera.",
    data: {
      glossary: [
        { word: "Inversión", definition: "Asignación de capital a un activo con la expectativa de obtener un beneficio futuro (rendimiento)." },
        { word: "Costo de Oportunidad", definition: "Lo que dejas de ganar al elegir una opción sobre otra." }
      ]
    }
  },
  {
    id: "que-es-invertir-2",
    stepType: "info",
    title: "¿Qué es realmente invertir?",
    aiInsight: "Invertir es comprar una parte del futuro. No estás gastando, estás sembrando energía financiera.",
    body: "En términos de ingeniería, [[Invertir|Poner capital en movimiento]] es transferir tu poder de compra de hoy hacia el futuro, esperando que ese poder crezca mediante el trabajo productivo.",
    imageUrl: "/lessons/bi-seed.png"
  },
  {
    id: "que-es-invertir-3",
    stepType: "impulse_meter",
    item: {
      name: "Compra de Gadget vs Inversión",
      price: "$10,000 MXN",
    },
    instructions: "Tienes la opción de comprar el último smartphone o invertir esa cantidad en un ETF. ¿A dónde se va tu impulso?",
    data: {
      minLabel: "Inversión (Largo plazo)",
      maxLabel: "Gadget (Dopamina hoy)",
      targetValue: 2
    }
  },
  {
    id: "que-es-invertir-4",
    stepType: "mcq",
    question: "¿Cuál es el objetivo principal de una inversión?",
    options: [
      { id: "1", label: "Gastar el dinero en algo bonito", isCorrect: false },
      { id: "2", label: "Generar un rendimiento que supere la inflación y aumente tu riqueza", isCorrect: true, explanation: "Correcto. Si no superas la inflación, estás perdiendo poder adquisitivo." },
      { id: "3", label: "Tener el dinero guardado bajo el colchón", isCorrect: false }
    ]
  },
  {
    id: "que-es-invertir-5",
    stepType: "info",
    title: "El Costo de Oportunidad",
    body: "Cada peso que gastas en una cena de lujo es un peso que deja de generar [[Interés Compuesto|Ganancia sobre ganancia]]. Ese es el verdadero [[Costo de Oportunidad|Lo que sacrificas por elegir algo]].",
    imageUrl: "/lessons/bi-opportunity-cost.png"
  },
  {
    id: "que-es-invertir-6",
    stepType: "swipe_sorter",
    question: "Identifica el acto de inversión",
    leftBucket: { label: "Inversión", color: "#10b981" },
    rightBucket: { label: "Gasto", color: "#ef4444" },
    items: [
      { id: "1", label: "Comprar acciones de una empresa", correctBucket: "left" },
      { id: "2", label: "Comprar un auto de lujo a crédito", correctBucket: "right" },
      { id: "3", label: "Pagar un curso de especialización", correctBucket: "left" },
      { id: "4", label: "Comprar ropa de marca que no necesitas", correctBucket: "right" }
    ]
  },
  {
    id: "que-es-invertir-7",
    stepType: "true_false",
    statement: "Toda inversión conlleva un riesgo, por pequeño que sea.",
    correctValue: true,
    explanation: "En finanzas, el riesgo CERO no existe. Incluso el efectivo tiene riesgo de inflación."
  },
  {
    id: "que-es-invertir-8",
    stepType: "blitz_challenge",
    question: "Misión: ¿Qué es el Costo de Oportunidad?",
    options: [
      { id: "1", label: "El precio de un boleto", isCorrect: false },
      { id: "2", label: "Lo que dejas de ganar por elegir otra cosa", isCorrect: true },
      { id: "3", label: "La comisión del broker", isCorrect: false }
    ],
    timeLimit: 12
  },
  {
    id: "que-es-invertir-9",
    stepType: "order",
    question: "Etapas de una Inversión Exitosa",
    items: [
      { id: "1", label: "Análisis y elección del activo", correctOrder: 1 },
      { id: "2", label: "Asignación de capital (Compra)", correctOrder: 2 },
      { id: "3", label: "Tiempo de espera (Maduración)", correctOrder: 3 },
      { id: "4", label: "Cosecha de rendimientos", correctOrder: 4 }
    ]
  },
  {
    id: "que-es-invertir-10",
    stepType: "match",
    question: "Relaciona el término con su esencia",
    leftItems: [
      { id: "l1", label: "Pasivo" },
      { id: "l2", label: "Activo" },
      { id: "l3", label: "Patrimonio" }
    ],
    rightItems: [
      { id: "r1", label: "Saca dinero de tu bolsa" },
      { id: "r2", label: "Mete dinero a tu bolsa" },
      { id: "r3", label: "Tu riqueza neta total" }
    ],
    correctPairs: [
      { leftId: "l1", rightId: "r1" },
      { leftId: "l2", rightId: "r2" },
      { leftId: "l3", rightId: "r3" }
    ]
  },
  {
    id: "que-es-invertir-11",
    stepType: "mindset_translator",
    question: "Traduce la visión de 'Inversión'",
    beliefs: [
      {
        id: "b1",
        original: "Solo debería invertir cuando me sobre mucho dinero.",
        healthyOptions: [
          { id: "h1", label: "Invierto para que me sobre dinero; es la semilla, no el fruto.", isCorrect: true },
          { id: "h2", label: "Invertir es solo para los que ya son ricos.", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: "que-es-invertir-12",
    stepType: "blitz_challenge",
    question: "Misión: ¿Cuál es el peor enemigo de un inversionista?",
    options: [
      { id: "1", label: "El mercado", isCorrect: false },
      { id: "2", label: "Sus propias emociones", isCorrect: true },
      { id: "3", label: "El broker", isCorrect: false }
    ],
    timeLimit: 10
  },
  {
    id: "que-es-invertir-13",
    stepType: "narrative_check",
    question: "Análisis de Futuro",
    body: "Si inviertes hoy $100 pesos, en 20 años podrían ser $700 sin que hagas nada adicional. ¿En qué prefieres gastar esos $100 hoy sabiendo su valor futuro?",
    placeholder: "Prefiero invertirlos en... porque...",
    minChars: 30
  },
  {
    id: "que-es-invertir-14",
    stepType: "summary",
    title: "Capital en Movimiento",
    body: "Invertir es la única forma de escapar de la carrera de la rata. Has entendido que tu dinero es una herramienta de producción, no solo un medio de consumo.",
    aiInsight: "Un inversionista ve el mundo en activos, no en objetos."
  },
  {
    id: "que-es-invertir-15",
    stepType: "billy_talks",
    body: "¡Impresionante! Ahora que sabes qué es invertir, vamos a compararlo con su hermano conservador: El Ahorro.",
    mood: "happy"
  }
];

// ---------------------------------------------------------------------------
// LECCIÓN 8: ¿Cuál es la diferencia entre ahorrar e invertir?
// Slug: "ahorro-vs-inversion"
// ---------------------------------------------------------------------------
export const lessonAhorroVsInversionSteps: LessonStep[] = [
  {
    id: "ahorro-vs-inv-1",
    stepType: "billy_talks",
    title: "Escudo vs. Espada",
    body: "Ahorrar e invertir no son lo mismo. El ahorro te protege hoy; la inversión construye tu mañana. Vamos a entender cuándo usar cada uno.",
    data: {
      glossary: [
        { word: "Inflación", definition: "Aumento generalizado de los precios que reduce el valor real del dinero." },
        { word: "Liquidez", definition: "Disponibilidad inmediata de efectivo." }
      ]
    }
  },
  {
    id: "ahorro-vs-inv-2",
    stepType: "info",
    title: "El Ahorro es Estático",
    aiInsight: "Ahorrar sin invertir es como tener un coche sin motor: te protege de la lluvia pero no te lleva a ningún lado.",
    body: "El [[Ahorro|Guardar excedente]] es fundamental para emergencias. Es seguro, pero tiene un enemigo mortal: la [[Inflación|El ladrón invisible de poder adquisitivo]]. Si ahorras bajo el colchón, pierdes dinero cada año.",
    imageUrl: "/lessons/bi-piggybank.png"
  },
  {
    id: "ahorro-vs-inv-3",
    stepType: "impulse_meter",
    item: {
      name: "Fondo de Emergencia",
      price: "3 meses de tus gastos",
    },
    instructions: "Tienes tu fondo de emergencia completo. Te sobran $5,000. ¿Qué tanto te pica la mano por gastarlos en lugar de invertirlos?",
    data: {
      minLabel: "Invierto de inmediato",
      maxLabel: "Me doy un lujo",
      targetValue: 2
    }
  },
  {
    id: "ahorro-vs-inv-4",
    stepType: "mcq",
    question: "¿Cuál es la función principal del ahorro?",
    options: [
      { id: "1", label: "Hacerse rico rápidamente", isCorrect: false },
      { id: "2", label: "Brindar seguridad y liquidez inmediata para emergencias", isCorrect: true, explanation: "Correcto. El ahorro es tu red de seguridad." },
      { id: "3", label: "Superar el rendimiento de la bolsa", isCorrect: false }
    ]
  },
  {
    id: "ahorro-vs-inv-5",
    stepType: "info",
    title: "La Inversión es Dinámica",
    body: "La [[Inversión|Asignación productiva]] busca vencer a la inflación. Aceptas el riesgo de fluctuación a cambio de un premio: el crecimiento de tu capital a largo plazo.",
    imageUrl: "/lessons/bi-investment-growth.png"
  },
  {
    id: "ahorro-vs-inv-6",
    stepType: "swipe_sorter",
    question: "Clasifica la acción financiera",
    leftBucket: { label: "Ahorro (Escudo)", color: "#3b82f6" },
    rightBucket: { label: "Inversión (Espada)", color: "#8b5cf6" },
    items: [
      { id: "1", label: "Fondo de emergencia en el banco", correctBucket: "left" },
      { id: "2", label: "Comprar un ETF diversificado", correctBucket: "right" },
      { id: "3", label: "Dinero para la renta en 3 días", correctBucket: "left" },
      { id: "4", label: "Bienes raíces para rentar", correctBucket: "right" }
    ]
  },
  {
    id: "ahorro-vs-inv-7",
    stepType: "true_false",
    statement: "Invertir el dinero que necesitas para comer el próximo mes es una buena estrategia.",
    correctValue: false,
    explanation: "Regla BIZEN: Nunca inviertas dinero que necesites en el corto plazo (menos de 1 año)."
  },
  {
    id: "ahorro-vs-inv-8",
    stepType: "blitz_challenge",
    question: "¿Quién es el enemigo del ahorro estático?",
    options: [
      { id: "1", label: "El broker", isCorrect: false },
      { id: "2", label: "La inflación", isCorrect: true },
      { id: "3", label: "El vecino", isCorrect: false }
    ],
    timeLimit: 12
  },
  {
    id: "ahorro-vs-inv-9",
    stepType: "order",
    question: "Orden de construcción financiera",
    items: [
      { id: "1", label: "Eliminar deudas tóxicas", correctOrder: 1 },
      { id: "2", label: "Construir fondo de emergencia (Ahorro)", correctOrder: 2 },
      { id: "3", label: "Invertir excedente constante", correctOrder: 3 },
      { id: "4", label: "Disfrutar libertad financiera", correctOrder: 4 }
    ]
  },
  {
    id: "ahorro-vs-inv-10",
    stepType: "match",
    question: "Relaciona la meta con la herramienta",
    leftItems: [
      { id: "l1", label: "Paz mental inmediata" },
      { id: "l2", label: "Retiro millonario" },
      { id: "l3", label: "Gasto en 2 semanas" }
    ],
    rightItems: [
      { id: "r1", label: "Ahorro" },
      { id: "r2", label: "Inversión" },
      { id: "r3", label: "Liquidez (Efectivo)" }
    ],
    correctPairs: [
      { leftId: "l1", rightId: "r1" },
      { leftId: "l2", rightId: "r2" },
      { leftId: "l3", rightId: "r3" }
    ]
  },
  {
    id: "ahorro-vs-inv-11",
    stepType: "mindset_translator",
    question: "Traduce la confusión de términos",
    beliefs: [
      {
        id: "b1",
        original: "Ahorrar es suficiente para ser financieramente libre.",
        healthyOptions: [
          { id: "h1", label: "Ahorrar es el combustible, invertir es el motor de mi libertad.", isCorrect: true },
          { id: "h2", label: "Solo debo ahorrar si la bolsa baja.", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: "ahorro-vs-inv-12",
    stepType: "blitz_challenge",
    question: "Misión: ¿Qué buscas al invertir?",
    options: [
      { id: "1", label: "Cero volatilidad", isCorrect: false },
      { id: "2", label: "Rendimiento real (arriba de inflación)", isCorrect: true },
      { id: "3", label: "Gastar todo rápido", isCorrect: false }
    ],
    timeLimit: 10
  },
  {
    id: "ahorro-vs-inv-13",
    stepType: "narrative_check",
    question: "Diseño de Sistema",
    body: "Si hoy tuvieras que explicarle a un niño la diferencia entre una semilla (inversión) y un muro (ahorro), ¿cómo lo harías?",
    placeholder: "La semilla es... y el muro es...",
    minChars: 30
  },
  {
    id: "ahorro-vs-inv-14",
    stepType: "summary",
    title: "El Equilibrio Táctico",
    body: "Has entendido que necesitas ambos. El ahorro te da la calma para no vender tus inversiones en pánico cuando el mercado fluctúa. Son un equipo.",
    aiInsight: "Sin fondo de emergencia, la inversión es una apuesta arriesgada."
  },
  {
    id: "ahorro-vs-inv-15",
    stepType: "billy_talks",
    body: "¡Perfecto! Ya tienes el mapa mental claro. Ahora vamos al corazón de la decisión: La relación entre Rendimiento y Riesgo.",
    mood: "thinking"
  }
];

// ---------------------------------------------------------------------------
// LECCIÓN 9: ¿Qué es el rendimiento y el riesgo?
// Slug: "rendimiento-y-riesgo"
// ---------------------------------------------------------------------------
export const lessonRendimientoYRiesgoSteps: LessonStep[] = [
  {
    id: "rend-riesgo-1",
    stepType: "billy_talks",
    title: "La Balanza de Hierro",
    body: "En finanzas no hay magia. Todo rendimiento tiene un costo oculto: el riesgo. Vamos a aprender a pesarlos en nuestra balanza de ingeniería.",
    data: {
      glossary: [
        { word: "Rendimiento", definition: "Ganancia o pérdida neta de una inversión durante un periodo determinado." },
        { word: "Relación Riesgo-Retorno", definition: "Principio que dicta que a mayor potencial de beneficio, mayor es la probabilidad de pérdida." }
      ]
    }
  },
  {
    id: "rend-riesgo-2",
    stepType: "info",
    title: "¿Qué es el Rendimiento?",
    aiInsight: "El rendimiento no es solo el número final, es lo que queda después de descontar comisiones e inflación.",
    body: "El [[Rendimiento|Ganancia neta]] es el premio que te da el mercado por poner tu capital al servicio de la producción. Puede ser vía dividendos o aumento de precio de la acción.",
    imageUrl: "/lessons/bi-yield.png"
  },
  {
    id: "rend-riesgo-3",
    stepType: "impulse_meter",
    item: {
      name: "Inversión 'Garantizada'",
      price: "'50% mensual sin riesgo'",
    },
    instructions: "Alguien te ofrece un rendimiento altísimo jurando que no hay riesgo. ¿Qué dice tu alarma de sistemas?",
    data: {
      minLabel: "Es una estafa (Huyo)",
      maxLabel: "Suena increíble (Entro)",
      targetValue: 1
    }
  },
  {
    id: "rend-riesgo-4",
    stepType: "mcq",
    question: "¿Cuál es la regla de oro de la Balanza de Hierro?",
    options: [
      { id: "1", label: "A mayor rendimiento, menor riesgo", isCorrect: false },
      { id: "2", label: "A mayor potencial de rendimiento, mayor riesgo implícito", isCorrect: true, explanation: "Correcto. El mercado cobra una 'tarifa' de incertidumbre por los altos rendimientos." },
      { id: "3", label: "El riesgo se puede eliminar por completo con suerte", isCorrect: false }
    ]
  },
  {
    id: "rend-riesgo-5",
    stepType: "info",
    title: "¿Qué es el Riesgo?",
    body: "El [[Riesgo|Incertidumbre de retorno]] en bolsa se mide principalmente con la volatilidad. Es la posibilidad de que el precio de tu activo baje justo cuando necesitas el dinero. Es un componente natural del sistema.",
    imageUrl: "/lessons/bi-volatility.png"
  },
  {
    id: "rend-riesgo-6",
    stepType: "swipe_sorter",
    question: "Nivel de riesgo esperado",
    leftBucket: { label: "Riesgo Bajo", color: "#10b981" },
    rightBucket: { label: "Riesgo Alto", color: "#ef4444" },
    items: [
      { id: "1", label: "Cetes o Bonos de Gobierno", correctBucket: "left" },
      { id: "2", label: "Criptomonedas nuevas", correctBucket: "right" },
      { id: "3", label: "Cuenta de ahorros bancaria", correctBucket: "left" },
      { id: "4", label: "Invertir en una sola empresa nueva", correctBucket: "right" }
    ]
  },
  {
    id: "rend-riesgo-7",
    stepType: "true_false",
    statement: "Si una inversión te promete más de lo que rinde el mercado (ej. más de 12% anual) sin riesgo, es altamente probable que sea un fraude.",
    correctValue: true,
    explanation: "Las leyes matemáticas financieras no perdonan. No existen rendimientos altos sin riesgo alto."
  },
  {
    id: "rend-riesgo-8",
    stepType: "blitz_challenge",
    question: "¿Cómo se llama el retorno arriba de la inflación?",
    options: [
      { id: "1", label: "Rendimiento nominal", isCorrect: false },
      { id: "2", label: "Rendimiento real", isCorrect: true },
      { id: "3", label: "Saldo bruto", isCorrect: false }
    ],
    timeLimit: 12
  },
  {
    id: "rend-riesgo-9",
    stepType: "order",
    question: "Ordena los activos de MAYOR a MENOR rendimiento histórico",
    items: [
      { id: "1", label: "Acciones (Bolsa)", correctOrder: 1 },
      { id: "2", label: "Bienes Raíces", correctOrder: 2 },
      { id: "3", label: "Bonos de Gobierno", correctOrder: 3 },
      { id: "4", label: "Efectivo", correctOrder: 4 }
    ]
  },
  {
    id: "rend-riesgo-10",
    stepType: "match",
    question: "Relaciona el perfil con la inversión",
    leftItems: [
      { id: "l1", label: "Conservador" },
      { id: "l2", label: "Moderado" },
      { id: "l3", label: "Agresivo" }
    ],
    rightItems: [
      { id: "r1", label: "Mayoria en Bonos (Cetes)" },
      { id: "r2", label: "Balance entre Bonos y Acciones" },
      { id: "r3", label: "Mayoría en Acciones y ETFs" }
    ],
    correctPairs: [
      { leftId: "l1", rightId: "r1" },
      { leftId: "l2", rightId: "r2" },
      { leftId: "l3", rightId: "r3" }
    ]
  },
  {
    id: "rend-riesgo-11",
    stepType: "mindset_translator",
    question: "Traduce la fobia al riesgo",
    beliefs: [
      {
        id: "b1",
        original: "Tengo miedo de que la bolsa baje y mi dinero desaparezca.",
        healthyOptions: [
          { id: "h1", label: "Acepto la volatilidad temporal para obtener crecimiento real a largo plazo.", isCorrect: true },
          { id: "h2", label: "Solo invertiré si me garantizan que no bajará nunca.", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: "rend-riesgo-12",
    stepType: "blitz_challenge",
    question: "Misión: ¿Qué es la volatilidad?",
    options: [
      { id: "1", label: "La pérdida total de dinero", isCorrect: false },
      { id: "2", label: "El movimiento de precios arriba y abajo", isCorrect: true },
      { id: "3", label: "Un tipo de interés fijo", isCorrect: false }
    ],
    timeLimit: 10
  },
  {
    id: "rend-riesgo-13",
    stepType: "narrative_check",
    question: "Calibración Personal",
    body: "Si ves que tu inversión baja 10% en un mes, pero confías en la empresa a 10 años, ¿cuál sería tu respuesta lógica en términos de ingeniería?",
    placeholder: "Mi respuesta sería... porque...",
    minChars: 30
  },
  {
    id: "rend-riesgo-14",
    stepType: "summary",
    title: "Inversionista Calibrado",
    body: "Has dominado la balanza. Ahora sabes que el riesgo no es algo malo, es el precio que pagas por el crecimiento. Quien no arriesga, se queda estancado por la inflación.",
    aiInsight: "El mayor riesgo es no tomar ningún riesgo."
  },
  {
    id: "rend-riesgo-15",
    stepType: "billy_talks",
    body: "¡Felicidades! Has completado el tercer subtema. Ahora tienes los fundamentos básicos. En el siguiente bloque veremos el armamento: Los tipos de instrumentos.",
    mood: "mascot"
  }
];
