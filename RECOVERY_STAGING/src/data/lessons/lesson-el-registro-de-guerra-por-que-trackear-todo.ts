import type { LessonStep } from "@/types/lessonTypes"

/**
 * Lesson: El Registro de Guerra: Por qué trackear todo
 * Theme: Operativo BIZEN
 * Lesson ID: el-registro-de-guerra-por-que-trackear-todo
 */

export const lessonElRegistroDeGuerraPorQueTrackearTodoSteps: LessonStep[] = [
  {
    id: "rdg-1",
    stepType: "billy_talks",
    mood: "happy",
    body: "¡Bien hecho, estratega! Ya conoces las reglas, ahora vamos a tomar el control del flujo.\n\nEl dinero no desaparece, es que tú no estás mirando. Hoy aprenderás a llevar un **[[Registro de Guerra|La bitácora diaria donde anotas cada centavo que sale de tu sistema]]**.",
    data: { 
      glossary: [
        { word: "Registro de Guerra", definition: "Hábito de documentar gastos en tiempo real para eliminar la invisibilidad financiera." },
        { word: "Fuga de Capital", definition: "Dinero que sale de tu cuenta en pequeñas cantidades sin un propósito consciente." }
      ] 
    },
    fullScreen: true,
  },
  {
    id: "rdg-2",
    stepType: "info",
    title: "La Invisibilidad del Gasto",
    body: "Nuestros cerebros no están diseñados para sumar pequeñas cantidades. Pensamos en 'miles', pero perdemos en 'pesos'. \n\nEl Registro de Guerra le quita el camuflaje a las fugas que están hundiendo tu barco financiero.",
    aiInsight: "El 40% de la capacidad de ahorro de una persona promedio se pierde en gastos menores a $50 que no fueron registrados.",
    fullScreen: true,
  },
  {
    id: "rdg-3",
    stepType: "mcq",
    question: "Memo llega a fin de mes y dice: '¡No sé en qué se me fue el dinero!'. ¿Qué le está pasando realmente?",
    options: [
      { id: "o1", label: "Le falta un aumento de sueldo", isCorrect: false },
      { id: "o2", label: "Tiene fugas invisibles por falta de registro", isCorrect: true, explanation: "Sin registro, el cerebro 'borra' los gastos pequeños para evitar dolor, creando un agujero negro financiero." }
    ],
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "rdg-4",
    stepType: "blitz_challenge",
    question: "Si gastas $155 diarios en 'cositas' (café, propinas, snacks), ¿cuánto pierdes al mes?",
    options: [
      { id: "o1", label: "$4,650 (Casi media renta)", isCorrect: true },
      { id: "o2", label: "$1,500 (Unos cuantos gustos)", isCorrect: false }
    ],
    timeLimit: 12,
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "rdg-5",
    stepType: "swipe_sorter",
    question: "¿Esto se anota en el Registro de Guerra?",
    leftBucket: { label: "No Registrar", color: "#64748b" },
    rightBucket: { label: "Registrar ¡YA!", color: "#2563eb" },
    items: [
      { id: "i1", label: "Café de la mañana ($25)", correctBucket: "right" },
      { id: "i2", label: "Propina al repartidor ($20)", correctBucket: "right" },
      { id: "i3", label: "Dinero que moviste de cuenta", correctBucket: "left" },
      { id: "i4", label: "El chicle en el semáforo ($5)", correctBucket: "right" }
    ],
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "rdg-6",
    stepType: "info",
    title: "Control vs Culpabilidad",
    body: "Muchos no anotan porque les da miedo 'sentirse mal' por gastar. \n\nError. El registro no es para castigarte, es para darte **PODER**. El que tiene los datos, tiene la capacidad de decidir qué fugas tapar y qué lujos conservar conscientemente.",
    aiInsight: "Anotar un gasto reduce el impulso de compra futuro en un 20% debido al efecto de 'atención consciente'.",
    fullScreen: true,
  },
  {
    id: "rdg-7",
    stepType: "true_false",
    statement: "Es mejor anotar todos los gastos el domingo en la noche repasando el estado de cuenta.",
    correctValue: false,
    explanation: "El efectivo y los gastos pequeños no aparecen en el estado de cuenta. El registro debe ser en TIEMPO REAL.",
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "rdg-8",
    stepType: "impulse_meter",
    instructions: "Mantén presionado para 'Detectar la Fuga' y sellarla mentalmente.",
    item: { name: "Audit de Gastos", price: "Libertad", imageUrl: "/billy-breathing.png" },
    holdTime: 4,
    fullScreen: true,
  },
  {
    id: "rdg-9",
    stepType: "blitz_challenge",
    question: "¿Cuál es el mejor momento para registrar un gasto?",
    options: [
      { id: "o1", label: "Al pagar (En la caja)", isCorrect: true },
      { id: "o2", label: "Al final del día", isCorrect: false }
    ],
    timeLimit: 10,
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "rdg-10",
    stepType: "order",
    question: "Ritual de un Gasto BIZEN",
    items: [
      { id: "p1", label: "Pausar la emoción", correctOrder: 1 },
      { id: "p2", label: "Ejecutar el pago", correctOrder: 2 },
      { id: "p3", label: "Anotar en el Registro de Guerra", correctOrder: 3 }
    ],
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "rdg-11",
    stepType: "match",
    question: "Categoriza el Gasto",
    leftItems: [
      { id: "l1", label: "Netflix / Spotify" },
      { id: "l2", label: "Mantenimiento auto" }
    ],
    rightItems: [
      { id: "r1", label: "Suscripciones (Nube)" },
      { id: "r2", label: "Gasto Variable (Tierra)" }
    ],
    correctPairs: [
      { leftId: "l1", rightId: "r1" },
      { leftId: "l2", rightId: "r2" }
    ],
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "rdg-12",
    stepType: "mindset_translator",
    question: "Refactoriza el 'Ahorro'",
    beliefs: [
      { 
        id: "b1", 
        original: "No registro porque son solo 10 pesos.", 
        healthyOptions: [
          { id: "h1", label: "Cada peso es un soldado; si no sé dónde están mis soldados, perderé la guerra", isCorrect: true },
          { id: "h2", label: "Diez pesos no cambian nada mi balance final", isCorrect: false }
        ] 
      }
    ],
    fullScreen: true,
  },
  {
    id: "rdg-13",
    stepType: "info",
    title: "La Regla del 'Peso es Peso'",
    body: "Para el sistema BIZEN, $1 y $1,000,000 se tratan con el mismo respeto algorítmico. Si eres capaz de ignorar un peso, eventualmente ignorarás un millón. La disciplina se construye en lo pequeño.",
    aiInsight: "Las empresas más rentables del mundo trackean hasta los clips de papel. Tú debes ser el CEO de tu vida.",
    fullScreen: true,
  },
  {
    id: "rdg-14",
    stepType: "narrative_check",
    question: "¿Qué herramienta vas a usar hoy mismo para tu Registro de Guerra (App, Nota en Cel, Libreta)?",
    promptPlaceholder: "Usaré...",
    minChars: 10,
    billyResponse: "¡Excelente elección! La mejor herramienta es la que SIEMPRE llevas contigo.",
    fullScreen: true,
  },
  {
    id: "rdg-15",
    stepType: "summary",
    title: "Vigilancia Activada",
    body: "Acabas de instalar el radar en tu sistema. Ya nada es invisible. Siguiente: Clasificación de Gastos (Fijos vs Variables).",
    fullScreen: true,
  },
]
