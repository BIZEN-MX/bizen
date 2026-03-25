import type { LessonStep } from "@/types/lessonTypes"

/**
 * Lesson: El Registro de Guerra: Por qué trackear todo
 * Theme: El Tablero del Juego (Mentalidad)
 * Lesson ID: el-registro-de-guerra-por-que-trackear-todo
 * Difficulty: Básico / Práctico
 */

export const lessonElRegistroDeGuerraPorQueTrackearTodoSteps: LessonStep[] = [
  {
    id: "rdg-slide-1",
    stepType: "billy_talks",
    mood: "happy",
    body: "¡Bien hecho, estratega! Ya sabes cómo pausar, ahora vamos a ver cómo controlar el flujo.\n\nEl dinero no desaparece, es que tú no estás mirando. Hoy aprenderás a llevar un **Registro de Guerra**: la bitácora que le quita la invisibilidad a tus gastos.",
    continueLabel: "Aprender el registro",
    fullScreen: true,
  },
  {
    id: "rdg-slide-2",
    stepType: "info",
    title: "¿Qué es el Registro de Guerra?",
    description: "La bitácora de combate",
    body: "Es la disciplina de anotar **CADA PESO** que sale de tu bolsillo o cuenta al momento de gastarlo. \n\nNo es para ser tacaño, es para ser el **Dueño** de tu dinero. Si no sabes dónde se fuga el agua, no puedes tapar el hoyo.",
    continueLabel: "Ver ejemplo",
    fullScreen: true,
  },
  {
    id: "rdg-slide-3",
    stepType: "mcq",
    title: "El Caso de Memo",
    description: "Memo llega a fin de mes y dice: '¡No sé en qué me gasté los $2,000 que me sobraban!'. Se siente frustrado porque cree que 'el dinero vuela'.",
    question: "¿Qué es lo que realmente le falta a Memo?",
    options: [
      { id: "opt-1", label: "Ganar más dinero", isCorrect: false },
      { id: "opt-2", label: "Tener un sistema de registro diario que haga visibles sus hormigas financieras", isCorrect: true, explanation: "Memo tiene fugas de capital invisibles que solo se detectan anotando cada gasto." },
      { id: "opt-3", label: "Un banco que no le cobre manejo de cuenta", isCorrect: false },
    ],
    isAssessment: true,
    fullScreen: true,
    aiInsight: "Billy dice: Los gastos hormiga son como termitas financieras: destrozan tu cuenta sin que te des cuenta.",
  },
  {
    id: "rdg-slide-4",
    stepType: "blitz_challenge",
    title: "Reto Relámpago",
    description: "Gastos hormiga comunes: $20 propina, $15 chicles, $80 café, $40 estacionamiento.",
    question: "Si Memo los anota todos los días, ¿cuánto dinero REALMENTE gasta al mes (30 días) en estos 'detalles' invisibles?",
    options: [
      { id: "opt-1", label: "$1,500", isCorrect: false },
      { id: "opt-2", label: "$4,650", isCorrect: true, explanation: "$20+15+80+40 = $155 diarios x 30 días = $4,650. Equivale a casi media renta." },
      { id: "opt-3", label: "$3,000", isCorrect: false },
    ],
    timeLimit: 20,
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "rdg-slide-5",
    stepType: "swipe_sorter",
    question: "¿Cuál de estos gastos debe ir en tu Registro de Guerra?",
    leftBucket: { label: "No Registrar", color: "#64748b" },
    rightBucket: { label: "Registrar ¡YA!", color: "#2563eb" },
    items: [
      { id: "s-1", label: "Café Oxxo", amount: "$22", correctBucket: "right" },
      { id: "s-2", label: "Propina repartidor", amount: "$30", correctBucket: "right" },
      { id: "s-3", label: "Renta depa", amount: "$6,500", correctBucket: "right" },
      { id: "s-4", label: "Dinero que sacaste del cajero pero no has gastado", amount: "$500", correctBucket: "left" },
    ],
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "rdg-slide-6",
    stepType: "true_false",
    statement: "Al anotar todos tus gastos, te sientes más culpable y dejas de disfrutar de la vida por completo.",
    correctValue: false,
    explanation: "Falso. Al anotar, te sientes con CONTROL. Decides gastar en lo que te importa y dejar de tirar el dinero en lo que no.",
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "rdg-slide-7",
    stepType: "impulse_meter",
    item: {
      name: "Suscripción que olvidaste cancelar",
      price: "$199",
    },
    description: "Tu Registro de Guerra te avisa que hoy se cobraron $199 de una app que ya no usas. ¡Gracias al registro, lo detectaste!",
    instructions: "Mantén presionado para cancelar la suscripción y evitar que vuelva a pasar el próximo mes.",
    holdTime: 3.5,
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "rdg-slide-8",
    stepType: "narrative_check",
    question: "¿Cuál es tu mejor método para anotar tus gastos todos los días? (App, Libreta, Notas del cel, Excel diario)",
    promptPlaceholder: "Mi método favorito es...",
    minChars: 15,
    billyResponse: "¡No importa cuál elijas, lo que importa es que lo hagas CADA VEZ que gastes un peso!",
    isAssessment: false,
    fullScreen: true,
  },
  {
    id: "rdg-slide-9",
    stepType: "summary",
    title: "Vigilante del Tesoro",
    body: "Has aprendido que la información es poder. En la siguiente lección, veremos cómo usar micro-hábitos para que tu dinero se salve solo, sin que tú tengas que pensar en ello.",
    continueLabel: "Finalizar Lección",
    fullScreen: true,
  },
]
