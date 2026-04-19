import { LessonStep } from "@/types/lessonTypes";

export const lessonElDineroYLasFinanzasSteps: LessonStep[] = [
  // SLIDE 1: Intro + Glosario
  {
    id: "t1l1-s1",
    stepType: "info",
    title: "El Dinero y las Finanzas",
    description: "Dominando la unidad básica del sistema",
    body: "Bienvenido a tu primer paso en BIZEN. Aquí no solo aprenderás a 'ahorrar', aprenderás a entender el [[Dinero|Medio de intercambio aceptado que facilita transacciones y sirve como unidad de valor.]] como una herramienta de ingeniería para construir tu futuro.",
    imageUrl: "/billy_hero_welcome_1776193486679.png",
    data: {
      glossary: [
        { word: "Dinero", definition: "Medio de intercambio aceptado que facilita transacciones y sirve como unidad de valor." },
        { word: "Finanzas", definition: "La disciplina que administra el dinero y los recursos financieros." },
        { word: "Divisa", definition: "Moneda extranjera utilizada en el comercio internacional." },
        { word: "Ingreso", definition: "Recursos que recibes por trabajo, inversiones u otras fuentes." },
        { word: "Dinero Fiduciario", definition: "Dinero establecido como de curso legal por decreto gubernamental, respaldado por confianza." },
        { word: "Dinero Mercancía", definition: "Dinero que tiene valor por el material del que está hecho (como el oro o la sal)." },
        { word: "Banco Central", definition: "Institución con mayor influencia en un país, encargada de imprimir dinero y su política monetaria." },
        { word: "Valor Intrínseco", definition: "El valor que tiene algo por sí mismo y por su utilidad natural." },
        { word: "Oferta y Demanda", definition: "Ley económica donde la escasez eleva el valor y la sobreproducción lo reduce." }
      ]
    }
  },

  // SLIDE 2: Definición de Dinero (MCQ - Q1)
  {
    id: "t1l1-s2",
    stepType: "mcq",
    question: "¿Qué es el dinero y cuál es su función principal en la economía según tu perfil BIZEN?",
    isAssessment: true,
    options: [
      { id: "s2-a", label: "Un metal precioso utilizado para fabricar joyas", isCorrect: false },
      { id: "s2-b", label: "Un medio de intercambio aceptado que facilita transacciones y reserva de valor", isCorrect: true, explanation: "Exacto. El dinero es la sangre del sistema económico." },
      { id: "s2-c", label: "Un documento emitido únicamente por bancos privados", isCorrect: false },
      { id: "s2-d", label: "Una forma de contrato entre dos personas", isCorrect: false }
    ],
    aiInsight: "El dinero no es el fin, es el medio. Sin él, volveríamos al trueque de gallinas por zapatos."
  },

  // SLIDE 3: Impulse Meter (Control de Dopamina)
  {
    id: "t1l1-s3",
    stepType: "impulse_meter",
    item: {
      name: "Suscripción Premium 'Innecesaria'",
      price: "$199/mes",
    },
    instructions: "Mantén presionado para ANALIZAR el valor real antes de que el impulso te domine.",
    holdTime: 3
  },

  // SLIDE 4: Tipos de Dinero (Match - Q2, Q5, Q7)
  {
    id: "t1l1-s4",
    stepType: "match",
    question: "Relaciona cada tecnología monetaria con su naturaleza técnica.",
    leftItems: [
      { id: "l1", label: "Dinero Fiduciario" },
      { id: "l2", label: "Dinero Mercancía" },
      { id: "l3", label: "Dinero Bancario" },
      { id: "l4", label: "Dinero Digital" }
    ],
    rightItems: [
      { id: "r1", label: "Basado en confianza (Fiat)" },
      { id: "r2", label: "Valor por su material (Oro)" },
      { id: "r3", label: "Depósitos y transferencias" },
      { id: "r4", label: "Formato electrónico (Cripto)" }
    ],
    correctPairs: [
      { leftId: "l1", rightId: "r1" },
      { leftId: "l2", rightId: "r2" },
      { leftId: "l3", rightId: "r3" },
      { leftId: "l4", rightId: "r4" }
    ],
    isAssessment: true
  },

  // SLIDE 5: Billy Insight (aiInsight splash)
  {
    id: "t1l1-s5",
    stepType: "billy_talks",
    mood: "thinking",
    body: "Históricamente, el dinero era sal, granos de cacao o pieles. Hoy es solo confianza. Si todos dejamos de creer en el peso, el peso vale lo que el papel en que está impreso. A esto se le conoce como [[Dinero Fiduciario|Dinero respaldado únicamente por la confianza y el decreto gubernamental]].",
    aiInsight: "El [[valor intrínseco|El valor que tiene algo por sí mismo y por su utilidad natural]] es lo que algo vale por sí mismo, como un kilo de arroz que te alimenta."
  },

  // SLIDE 6: Dinero Representativo (True/False - Q6, Q8)
  {
    id: "t1l1-s6",
    stepType: "true_false",
    statement: "El valor intrínseco se refiere al valor propio de un bien por sus características físicas, independientemente de su precio de mercado.",
    correctValue: true,
    explanation: "Correcto. El oro tiene [[Dinero Mercancía|valor intrínseco (tiene valor por su propio material)]]; un billete de 500 solo tiene valor extrínseco (confianza).",
    isAssessment: true
  },

  // SLIDE 7: Blitz Challenge 1 (Q3, Q4)
  {
    id: "t1l1-s7",
    stepType: "blitz_challenge",
    question: "¿Los depósitos bancarios y transferencias digitales cuentan como dinero bancario?",
    options: [
      { id: "s7-y", label: "Verdadero", isCorrect: true },
      { id: "s7-n", label: "Falso", isCorrect: false }
    ],
    timeLimit: 10,
    ghostName: "Billy Veloz",
    ghostScore: "0:04",
    isAssessment: true
  },

  // SLIDE 8: Divisas (MCQ - Q9)
  {
    id: "t1l1-s8",
    stepType: "mcq",
    question: "En el gran tablero del comercio mundial, ¿qué es exactamente una \"Divisa\"?",
    options: [
      { id: "s8-a", label: "Una criptomoneda sin respaldo", isCorrect: false },
      { id: "s8-b", label: "La [[Divisa|Moneda extranjera utilizada en el comercio internacional]] utilizada en transacciones internacionales", isCorrect: true },
      { id: "s8-c", label: "Un préstamo del [[Banco Central|Institución encargada de la política monetaria y emisión de dinero]]", isCorrect: false },
      { id: "s8-d", label: "Un billete de alta denominación", isCorrect: false }
    ],
    isAssessment: true
  },

  // SLIDE 9: Ordenar influencia (Order - Q10)
  {
    id: "t1l1-s9",
    stepType: "order",
    question: "Ordena los agentes de MAYOR a MENOR influencia en la determinación del valor del dinero.",
    items: [
      { id: "item-1", label: "Banco Central", correctOrder: 1 },
      { id: "item-2", label: "Gobierno Nacional", correctOrder: 2 },
      { id: "item-3", label: "Mercados Financieros", correctOrder: 3 },
      { id: "item-4", label: "Consumidores Individuales", correctOrder: 4 }
    ],
    isAssessment: true
  },

  // SLIDE 10: Oferta y Demanda (Match - Q11, Q12)
  {
    id: "t1l1-s10",
    stepType: "match",
    question: "Relaciona el factor económico con su efecto en el precio.",
    leftItems: [
      { id: "f1", label: "Escasez del bien" },
      { id: "f2", label: "Sobreproducción" },
      { id: "f3", label: "Alta demanda" },
      { id: "f4", label: "Baja demanda" }
    ],
    rightItems: [
      { id: "e1", label: "Eleva el valor" },
      { id: "e2", label: "Reduce el valor" },
      { id: "e3", label: "Incrementa el precio" },
      { id: "e4", label: "Presiona a la baja" }
    ],
    correctPairs: [
      { leftId: "f1", rightId: "e1" },
      { leftId: "f2", rightId: "e2" },
      { leftId: "f3", rightId: "e3" },
      { leftId: "f4", rightId: "e4" }
    ],
    isAssessment: true
  },

  // SLIDE 11: Billy Insight (aiInsight splash)
  {
    id: "t1l1-s11",
    stepType: "billy_talks",
    mood: "mascot",
    body: "Si hay 100 personas queriendo comprar el mismo par de tenis, pero solo hay 1 par, el precio subirá al cielo. Eso es la [[Ley de Oferta y Demanda|Principio económico donde la escasez eleva el valor y la sobreproducción lo reduce]] en acción.",
    aiInsight: "Cuando la oferta disminuye y la demanda se mantiene, el precio sube por escasez."
  },

  // SLIDE 12: Mindset Translator (Q14)
  {
    id: "t1l1-s12",
    stepType: "mindset_translator",
    question: "Traduce esta creencia común al lenguaje de Ingeniería Financiera.",
    beliefs: [
      {
        id: "b1",
        original: "Gastar dinero es siempre algo malo para mi economía.",
        healthyOptions: [
          { id: "o1", label: "El gasto es una salida de energía que debe ser optimizada para generar valor.", isCorrect: true },
          { id: "o2", label: "Nunca debo comprar nada para ser libre.", isCorrect: false },
          { id: "o3", label: "Gastar es inevitable y no se puede controlar.", isCorrect: false }
        ]
      }
    ],
    isAssessment: true
  },

  // SLIDE 13: Definición de Ingreso (MCQ - Q13)
  {
    id: "t1l1-s13",
    stepType: "mcq",
    question: "¿Qué es el \"Ingreso\" en el contexto de las finanzas personales BIZEN?",
    options: [
      { id: "s13-a", label: "Total de deudas acumuladas", isCorrect: false },
      { id: "s13-b", label: "Dinero o recursos que recibes por trabajo o inversiones", isCorrect: true },
      { id: "s13-c", label: "Impuestos obligatorios", isCorrect: false },
      { id: "s13-d", label: "Presupuesto de gastos fijos", isCorrect: false }
    ],
    isAssessment: true
  },

  // SLIDE 14: Blitz Challenge 2 (Q15)
  {
    id: "t1l1-s14",
    stepType: "blitz_challenge",
    question: "¿El ingreso pasivo se genera mediante trabajo o esfuerzo directo?",
    options: [
      { id: "s14-y", label: "Verdadero", isCorrect: false },
      { id: "s14-n", label: "Falso", isCorrect: true, explanation: "¡No! El pasivo es el que trabaja para ti mientras duermes." }
    ],
    timeLimit: 8,
    ghostName: "Mente Maestra",
    ghostScore: "0:03",
    isAssessment: true
  },

  // SLIDE 15: Swipe Sorter (Q16 / Strategy)
  {
    id: "t1l1-s15",
    stepType: "swipe_sorter",
    question: "Clasifica estas acciones según su impacto estructural.",
    leftBucket: { label: "Impulso / Corto Plazo", color: "#ef4444" },
    rightBucket: { label: "Estrategia / Patrimonio", color: "#10b981" },
    items: [
      { id: "sw-1", label: "Comprar ropa por aburrimiento", correctBucket: "left" },
      { id: "sw-2", label: "Planeación financiera anual", correctBucket: "right" },
      { id: "sw-3", label: "Suscripción olvidada", correctBucket: "left" },
      { id: "sw-4", label: "Estrategia de inversión", correctBucket: "right" },
      { id: "sw-5", label: "Compra emocional de divisas", correctBucket: "left" }
    ],
    isAssessment: true
  }
];
