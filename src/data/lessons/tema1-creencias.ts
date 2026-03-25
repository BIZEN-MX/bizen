import type { LessonStep } from "@/types/lessonTypes"

/**
 * Subtema C: Creencias
 */

/**
 * Lección 1: Mis primeras creencias sobre el dinero
 */
export const lessonMisPrimerasCreenciasSobreElDineroSteps: LessonStep[] = [
  {
    id: "cre-1-1",
    stepType: "billy_talks",
    mood: "thinking",
    body: "Tus papás decían 'el dinero no crece en los árboles'. Sus papás también. Esas son tus creencias.",
    fullScreen: true,
  },
  {
    id: "cre-1-2",
    stepType: "mindset_translator",
    question: "Traduce esta creencia familiar:",
    beliefs: [
        {
            id: "fb1",
            original: "Los ricos son malas personas porque tienen mucho.",
            healthyOptions: [
                { id: "h1", label: "El dinero es un amplificador: amplifica lo bueno o lo malo que ya eres.", isCorrect: true },
                { id: "h2", label: "El éxito es algo de lo que hay que avergonzarse.", isCorrect: false },
            ]
        }
    ],
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "cre-1-3",
    stepType: "summary",
    title: "Cuestionando el pasado",
    body: "No eres responsable del pasado de tus creencias, pero sí eres responsable de su futuro.",
    fullScreen: true,
  },
]

/**
 * Lección 2: Expectativas vs realidad financiera
 */
export const lessonExpectativasVsRealidadFinancieraSteps: LessonStep[] = [
  {
    id: "cre-2-1",
    stepType: "billy_talks",
    body: "Internet nos dice que a los 20 serás millonario. La realidad es que a los 20 estarás aprendiendo a administrar $100 pesos. Eso está bien.",
    fullScreen: true,
  },
  {
    id: "cre-2-2",
    stepType: "mcq",
    question: "¿Qué genera más riqueza a largo plazo?",
    options: [
      { id: "o1", label: "Ganar una lotería una sola vez", isCorrect: false },
      { id: "o2", label: "Ahorrar e invertir por 30 años", isCorrect: true, explanation: "El interés compuesto es la octava maravilla del mundo físico." },
    ],
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "cre-2-3",
    stepType: "summary",
    title: "Realidad con visión",
    body: "No necesitas ser millonario hoy para ser libre mañana. Solo necesitas empezar.",
    fullScreen: true,
  },
]

/**
 * Lección 3: Frases heredadas que me limitan
 */
export const lessonFrasesHeredadasQueMeLimitanSteps: LessonStep[] = [
  {
    id: "cre-3-1",
    stepType: "billy_talks",
    mood: "worried",
    body: "Vamos a quemar estas frases: 'Dios proveerá', 'Soy pobre pero honrado', 'El dinero es sucio'. ¿Cuáles te han dicho más?",
    fullScreen: true,
  },
  {
    id: "cre-3-2",
    stepType: "match",
    question: "Conecta la frase con su consecuencia destructiva:",
    leftItems: [
        { id: "l1", label: "'El dinero es sucio'" },
        { id: "l2", label: "'El dinero se me va de las manos'" },
        { id: "l3", label: "'No soy bueno para los números'" },
    ],
    rightItems: [
        { id: "r1", label: "Te deshaces de él lo más rápido posible" },
        { id: "r2", label: "No lo controlas ni lo mides" },
        { id: "r3", label: "No aprendes a invertir ni administrar" },
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
    id: "cre-3-3",
    stepType: "summary",
    title: "Silenciando el ruido",
    body: "Tus frases ya no dictan tus decisiones. Ahora tienes la batuta.",
    fullScreen: true,
  },
]

/**
 * Lección 4: Cómo cuestionar una creencia con evidencia
 */
export const lessonComoCuestionarUnaCreenciaConEvidenciaSteps: LessonStep[] = [
  {
    id: "cre-4-1",
    stepType: "billy_talks",
    body: "Si crees que 'no eres bueno para los números', saca tu estado de cuenta. ¿Sumaste y restaste? ¡Felicidades! Eres capaz de administrar dinero.",
    fullScreen: true,
  },
  {
    id: "cre-4-2",
    stepType: "true_false",
    statement: "Un solo error financiero te define como alguien incapaz frente al dinero por el resto de tu vida.",
    correctValue: false,
    explanation: "Errar es aprender. Perder dinero es pagar una colegiatura en la universidad de la vida.",
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "cre-4-3",
    stepType: "summary",
    title: "Evidencia mata creencia",
    body: "Busca la prueba de que eres capaz y tu mente te seguirá.",
    fullScreen: true,
  },
]

/**
 * Lección 5: Reescribir creencias en reglas útiles
 */
export const lessonReescribirCreenciasEnReglasUtilesSteps: LessonStep[] = [
  {
    id: "cre-5-1",
    stepType: "billy_talks",
    mood: "celebrating",
    body: "Vamos a terminar el primer gran tema de BIZEN. Reescribe tu mayor miedo en una regla poderosa.",
    fullScreen: true,
  },
  {
    id: "cre-5-2",
    stepType: "fill_blanks",
    question: "Convirtiendo miedo en reglas:",
    textParts: [
        { type: "text", content: "Antes creía que el dinero era una carga, ahora sé que es una" },
        { type: "blank", id: "b1", correctOptionId: "opt-aliado" },
        { type: "text", content: "y mi regla de oro será" },
        { type: "blank", id: "b2", correctOptionId: "opt-ahorrar" },
        { type: "text", content: "antes de gastar." },
    ],
    options: [
        { id: "opt-aliado", label: "Aliado", isCorrect: true },
        { id: "opt-ahorrar", label: "Ahorrar", isCorrect: true },
        { id: "opt-gastar", label: "Gastar", isCorrect: false },
    ],
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "cre-5-3",
    stepType: "summary",
    title: "¡Tema 1 Completado!",
    body: "Felicidades. Has excavado en tu mente. Tienes las bases sólidas para empezar la **Ingeniería del Ingreso**.",
    continueLabel: "Ir a Tema 2: Ingeniería del Ingreso",
    fullScreen: true,
  },
]
