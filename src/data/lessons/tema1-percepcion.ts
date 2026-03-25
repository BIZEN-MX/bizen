import type { LessonStep } from "@/types/lessonTypes"

/**
 * Subtema A: Percepción
 */

/**
 * Lección 1: ¿Qué es el dinero para mí?
 */
export const lessonQueEsElDineroParaMiSteps: LessonStep[] = [
  {
    id: "per-1-1",
    stepType: "billy_talks",
    body: "Para algunos, el dinero es un puntaje; para otros, es una fuente de ansiedad. Antes de ver el banco, mira tu mente. ¿Qué es el dinero para ti?",
    fullScreen: true,
  },
  {
    id: "per-1-2",
    stepType: "match",
    question: "Conecta la 'Metáfora' con lo que el dinero significa para esa persona:",
    leftItems: [
        { id: "l1", label: "Dinero es un Martillo" },
        { id: "l2", label: "Dinero es una Sombra" },
        { id: "l3", label: "Dinero es un Boleto" },
    ],
    rightItems: [
        { id: "r1", label: "Herramienta (sirve para construir algo)" },
        { id: "r2", label: "Miedo (persigue y no puedes escapar)" },
        { id: "r3", label: "Pase (sirve para tener experiencias)" },
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
    id: "per-1-3",
    stepType: "summary",
    title: "Primera introspección",
    body: "Acabas de dar el primer paso: dejar de ver billetes y empezar a ver lo que significan.",
    fullScreen: true,
  },
]

/**
 * Lección 2: ¿Qué espero del dinero?
 */
export const lessonQueEsperoDelDineroSteps: LessonStep[] = [
  {
    id: "per-2-1",
    stepType: "billy_talks",
    body: "Mucha gente dice 'quiero dinero', pero si les das un millón de pesos hoy, se los gastan en 20 minutos. El problema es que no saben qué esperan del dinero.",
    fullScreen: true,
  },
  {
    id: "per-2-2",
    stepType: "mcq",
    question: "¿Cuál de estos sueños necesita MÁS dinero para mantenerse funcionando?",
    options: [
      { id: "o1", label: "Viajar de mochilero por un año", isCorrect: false },
      { id: "o2", label: "Vivir en una mansión con 5 autos de lujo", isCorrect: true, explanation: "Un estilo de vida de lujo tiene un costo recurrente altísimo (gasolina, mantenimiento, impuestos)." },
    ],
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "per-2-3",
    stepType: "narrative_check",
    question: "Si tuvieras todo el dinero del mundo, ¿qué harías MAÑANA al despertar?",
    promptPlaceholder: "Mañana me despertaría para ...",
    minChars: 20,
    billyResponse: "¡Interesante! Eso que mencionas es lo que realmente valoras, no el papel moneda.",
    fullScreen: true,
  },
  {
    id: "per-2-4",
    stepType: "summary",
    title: "Expectativas claras",
    body: "Si no sabes qué esperas del dinero, el dinero te manejará a ti. Sigamos explorando.",
    fullScreen: true,
  },
]

/**
 * Lección 3: Dinero como seguridad vs libertad
 */
export const lessonDineroComoSeguridadVsLibertadSteps: LessonStep[] = [
  {
    id: "per-3-1",
    stepType: "billy_talks",
    mood: "thinking",
    body: "Aquí hay dos caminos. Algunos quieren dinero para 'dormir tranquilos' (Seguridad). Otros para 'hacer lo que quieran' (Libertad). ¿Ves la diferencia?",
    fullScreen: true,
  },
  {
    id: "per-3-2",
    stepType: "order",
    question: "Ordena estas metas de la más enfocada en SEGURIDAD a la más enfocada en LIBERTAD:",
    items: [
      { id: "s1", label: "Tener un fondo de emergencia para 12 meses", correctOrder: 1 },
      { id: "s2", label: "Comprar una casa propia pagada al 100%", correctOrder: 2 },
      { id: "s3", label: "Invertir en un negocio para viajar por el mundo", correctOrder: 3 },
    ],
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "per-3-3",
    stepType: "true_false",
    statement: "Tener libertad financiera total es imposible si primero no tienes un nivel base de seguridad financiera.",
    correctValue: true,
    explanation: "Sin un piso firme, el riesgo de caer es demasiado alto para sentirte libre.",
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "per-3-4",
    stepType: "summary",
    title: "Tu balance personal",
    body: "Hoy sabes si te motiva más el miedo a la falta (seguridad) o el deseo de opciones (libertad).",
    fullScreen: true,
  },
]

/**
 * Lección 4: Dinero como presión vs oportunidad
 */
export const lessonDineroComoPresionVsOportunidadSteps: LessonStep[] = [
  {
    id: "per-4-1",
    stepType: "billy_talks",
    body: "¿Tener dinero te da pesadillas (presión por no perderlo) o te da alas (oportunidad)? \n\nVamos a descubrir si el dinero es tu jefe o tu empleado.",
    fullScreen: true,
  },
  {
    id: "per-4-2",
    stepType: "mcq",
    question: "Tus padres te regalan $5,000 para tu graduación. ¿Qué te hace sentir más 'presionado'?",
    options: [
      { id: "o1", label: "Gastarlos por miedo a que se me acaben", isCorrect: true, explanation: "El miedo al fin del dinero genera una presión constante." },
      { id: "o2", label: "Ahorrarlos para invertirlos después", isCorrect: false },
    ],
    isAssessment: false,
    fullScreen: true,
  },
  {
    id: "per-4-3",
    stepType: "summary",
    title: "El cambio de chip",
    body: "Cuando dejas de ver deuda y empiezas a ver inversión, la presión desaparece.",
    fullScreen: true,
  },
]

/**
 * Lección 5: Identificar mi “definición personal” del dinero
 */
export const lessonIdentificarMiDefinicionPersonalDelDineroSteps: LessonStep[] = [
  {
    id: "per-5-1",
    stepType: "billy_talks",
    mood: "celebrating",
    body: "¡Felicidades! Has navegado tus percepciones. Ahora vamos a escribir TU definición de hoy.",
    fullScreen: true,
  },
  {
    id: "per-5-2",
    stepType: "fill_blanks",
    question: "Completa tu nueva verdad:",
    textParts: [
        { type: "text", content: "Para mí, el dinero de hoy en adelante será una" },
        { type: "blank", id: "b1", correctOptionId: "opt-herramienta" },
        { type: "text", content: "que usaré para lograr" },
        { type: "blank", id: "b2", correctOptionId: "opt-libertad" },
    ],
    options: [
        { id: "opt-herramienta", label: "Herramienta", isCorrect: true },
        { id: "opt-libertad", label: "Libertad", isCorrect: true },
        { id: "opt-carga", label: "Carga", isCorrect: false },
    ],
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "per-5-3",
    stepType: "summary",
    title: "Módulo Finalizado",
    body: "Has definido tu relación con el dinero. Ahora vamos a ver cómo las **emociones** entran en juego.",
    continueLabel: "Ir a Subtema B: Emociones",
    fullScreen: true,
  },
]
