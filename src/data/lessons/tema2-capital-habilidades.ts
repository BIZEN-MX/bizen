import type { LessonStep } from "@/types/lessonTypes"

/**
 * Lesson: Habilidades de Alto Valor (High-Income Skills)
 * Theme: El Capital de tus Habilidades
 */
export const lessonHabilidadesDeAltoValorSteps: LessonStep[] = [
  {
    id: "hiv-1",
    stepType: "billy_talks",
    mood: "celebrating",
    body: "No todas las horas valen lo mismo. Un experto en ventas industriales puede ganar lo que un cocinero junior gana en un año.\n\nEso se llama **Habilidad de Alto Valor** (HAV).",
    fullScreen: true,
  },
  {
    id: "hiv-2",
    stepType: "match",
    question: "Conecta la Habilidad con su potencial de ingreso",
    leftItems: [
        { id: "l1", label: "Experto en Ciberseguridad" },
        { id: "l2", label: "Limpieza básica" },
        { id: "l3", label: "Ventas B2B" },
    ],
    rightItems: [
        { id: "r1", label: "Muy Alto (Rareza extrema)" },
        { id: "r2", label: "Bajo (Alta oferta)" },
        { id: "r3", label: "Alto (Generación directa)" },
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
    id: "hiv-3",
    stepType: "mindset_translator",
    question: "Traduce este pensamiento limitante:",
    beliefs: [
        {
            id: "b1",
            original: "Un curso de $5,000 es carísimo. Mejor me compro un par de tenis.",
            healthyOptions: [
                { id: "h1", label: "Un curso de $5,000 que me enseñe una habilidad de $50,000 es la mejor compra de mi vida.", isCorrect: true },
                { id: "h2", label: "Los tenis me durarán más que el conocimiento.", isCorrect: false },
            ]
        }
    ],
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "hiv-4",
    stepType: "true_false",
    statement: "Una HAV es cualquier cosa en la que seas bueno, aunque nadie esté dispuesto a pagar por ello.",
    correctValue: false,
    explanation: "Si el mercado no lo necesita, no es una habilidad de alto valor, es un hobby muy caro.",
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "hiv-5",
    stepType: "summary",
    title: "Tu Inventario",
    body: "Hoy sabes que para subir tu ingreso neto, necesitas subir tu valor neto. Es hora de elegir qué habilidad vas a dominar.",
    fullScreen: true,
  },
]

/**
 * Lesson: Escalabilidad: ¿Tu tiempo tiene techo?
 */
export const lessonEscalabilidadTuTiempoTieneTechoSteps: LessonStep[] = [
  {
    id: "esc-1",
    stepType: "billy_talks",
    mood: "thinking",
    body: "Imagina que eres el mejor masajista del mundo. Solo puedes dar 8 masajes al día. Tu ingreso tiene un **TECHO**.\n\nPara ser rico, necesitas ESCALA.",
    fullScreen: true,
  },
  {
    id: "esc-2",
    stepType: "order",
    question: "Ordena estos perfiles de MENOR a MAYOR escalabilidad de ingresos:",
    items: [
      { id: "e1", label: "Contador trabajando por hora (Solo 24h/día)", correctOrder: 1 },
      { id: "e2", label: "Dueño de Despacho (Tiene empleados)", correctOrder: 2 },
      { id: "e3", label: "Desarrollador de App (Vende millones de copias)", correctOrder: 3 },
    ],
    isAssessment: true,
    fullScreen: true,
    aiInsight: "Billy dice: Si no encuentras la forma de ganar dinero mientras duermes, trabajarás hasta que te mueras.",
  },
  {
    id: "esc-3",
    stepType: "mcq",
    question: "Si hoy te dieran un aumento del 20%, ¿seguirías teniendo un techo en tus ingresos dentro de un año?",
    options: [
      { id: "o1", label: "No, con un aumento soy libre", isCorrect: false },
      { id: "o2", label: "Sí, porque sigo vendiendo mi tiempo, aunque sea a mejor precio", isCorrect: true, explanation: "Un sueldo mejor es un techo más alto, pero sigue habiendo un techo." },
    ],
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "esc-4",
    stepType: "summary",
    title: "La Trampa del Sueldo",
    body: "Moverse de 'Tiempo por Dinero' a 'Valor x Escala' es el cambio más difícil pero más rentable que harás.",
    fullScreen: true,
  },
]

/**
 * Lesson: Invertir en ti: El ROI de tu educación
 */
export const lessonRoiDeTuEducacionSteps: LessonStep[] = [
  {
    id: "roi-1",
    stepType: "billy_talks",
    mood: "celebrating",
    body: "¿Sabes cuál es la mejor inversión del mundo? No es Cetes, ni Bitcoin. Es lo que tienes entre las orejas.\n\nROI = (Ganancia Extra / Inversión en Educación) x 100.",
    fullScreen: true,
  },
  {
    id: "roi-2",
    stepType: "fill_blanks",
    question: "Calcula el ROI educativo:",
    textParts: [
        { type: "text", content: "Si inviertes $2,000 en un curso y gracias a eso ganas $2,000 extras CADA MES por un año ($24,000), tu ROI anual es del" },
        { type: "blank", id: "b1", correctOptionId: "opt-1100" },
        { type: "text", content: "por ciento." },
    ],
    options: [
        { id: "opt-1100", label: "1100", isCorrect: true },
        { id: "opt-100", label: "100", isCorrect: false },
    ],
    isAssessment: true,
    fullScreen: true,
    aiInsight: "Billy dice: Ningún banco te dará un ROI del 1,100%. Tu cerebro sí.",
  },
  {
    id: "roi-3",
    stepType: "true_false",
    statement: "Comprar libros es un gasto porque es dinero que ya no tienes en efectivo.",
    correctValue: false,
    explanation: "Es una transferencia de activos: de efectivo a capital intelectual.",
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "roi-4",
    stepType: "summary",
    title: "Tu propio Banco",
    body: "Tu educación es el único activo que nadie te puede embargar y que nunca se deprecia.",
    fullScreen: true,
  },
]

/**
 * Lesson: Soft Skills: El multiplicador invisible de ingresos
 */
export const lessonSoftSkillsMultiplicadorIngresosSteps: LessonStep[] = [
  {
    id: "soft-1",
    stepType: "billy_talks",
    mood: "worried",
    body: "Conozco programadores brillantes que ganan poco porque no saben hablar en una junta. \n\nLas **Soft Skills** (habilidades blandas) multiplican tus ingresos.",
    fullScreen: true,
  },
  {
    id: "soft-2",
    stepType: "match",
    question: "Conecta la Soft Skill con cómo te hace ganar dinero:",
    leftItems: [
        { id: "l1", label: "Comunicación Asertiva" },
        { id: "l2", label: "Liderazgo" },
        { id: "l3", label: "Gestión del tiempo" },
    ],
    rightItems: [
        { id: "r1", label: "Mejores aumentos y cierres" },
        { id: "r2", label: "Cargos de mayor responsabilidad" },
        { id: "r3", label: "Mayor productividad personal" },
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
    id: "soft-3",
    stepType: "influence_detective",
    scenario: "Tu jefe siempre le asigna los mejores proyectos a Lucía, aunque tú eres técnicamente mejor.",
    options: [
      { id: "i1", label: "Es favoritismo injusto", emotion: "Frustración", isCorrect: false },
      { id: "i2", label: "Lucía sabe vender el valor de su trabajo y tú no", emotion: "Realidad", isCorrect: true },
      { id: "i3", label: "Necesitas otro curso técnico", emotion: "Escape", isCorrect: false },
    ],
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "soft-4",
    stepType: "summary",
    title: "El Combo Ganador",
    body: "Habilidad Técnica + Soft Skills = Ingresos Exponenciales.",
    fullScreen: true,
  },
]

/**
 * Lesson: Diseño de Carrera: De Operativo a Estratégico
 */
export const lessonDisenoDeCarreraOperativoAEstrategicoSteps: LessonStep[] = [
  {
    id: "car-1",
    stepType: "billy_talks",
    mood: "thinking",
    body: "Hacer las cosas bien se llama Operación. Decidir qué cosas deben hacerse se llama Estrategia.\n\nLos administradores siempre ganan más que los operadores. Es hora de moverte de bando.",
    fullScreen: true,
  },
  {
    id: "car-2",
    stepType: "order",
    question: "Ordena los roles por nivel de RESPONSABILIDAD (y de sueldo potencial):",
    items: [
      { id: "r1", label: "Ejecutor de tareas", correctOrder: 1 },
      { id: "r2", label: "Supervisor de grupo", correctOrder: 2 },
      { id: "r3", label: "Director Nacional de Estrategia", correctOrder: 3 },
    ],
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "car-3",
    stepType: "narrative_check",
    question: "¿Qué paso vas a dar en los próximos 6 meses para subir de nivel operativo a estratégico en tu trabajo actual?",
    promptPlaceholder: "Delegaré mis tareas de ... para enfocarme en ...",
    minChars: 25,
    billyResponse: "¡Eso es ver el bosque, no solo los árboles! Vamos por ese ascenso.",
    fullScreen: true,
  },
  {
    id: "car-4",
    stepType: "summary",
    title: "Diseñador de Riqueza",
    body: "Terminaste el segundo bloque. Ya no ves un sueldo, ves una infraestructura de habilidades que puedes mejorar a voluntad.\n\nSiguiente bloque: **Optimización de la Riqueza**.",
    fullScreen: true,
  },
]
