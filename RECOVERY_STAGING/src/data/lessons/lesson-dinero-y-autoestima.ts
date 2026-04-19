import type { LessonStep } from "@/types/lessonTypes"

/**
 * Lección 3: Lo que creo que el dinero dice de mí
 * Tema: Mi relación con el dinero
 * Nivel: Introductorio–Intermedio
 * Slides: 15
 * Regla: Sin imágenes. Solo texto.
 */

export const lessonDineroYAutoestimaSteps: LessonStep[] = [
  // Slide 1 — Flashcard (Teoría)
  {
    id: "cms-l3-s1",
    stepType: "billy_talks",
    mood: "thinking",
    body: "A veces el dinero parece decir algo sobre nosotros. \"Si tengo más valgo más\" o \"si tengo menos valgo menos\".\n\nEsa idea es peligrosa porque mezcla tu situación económica con tu valor personal. ¡Vamos a desarmar esa etiqueta!",
    continueLabel: "¡Empecemos!",
    fullScreen: true,
  },

  // Slide 2 — Diagnóstico (No calificado)
  {
    id: "cms-l3-s2",
    stepType: "mcq",
    question: "¿Qué tan seguido te comparas por dinero o cosas materiales?",
    options: [
      { id: "s2-nunca", label: "Casi nunca", isCorrect: true },
      { id: "s2-aveces", label: "A veces", isCorrect: true },
      { id: "s2-seguido", label: "Seguido", isCorrect: true },
      { id: "s2-nose", label: "No estoy seguro", isCorrect: true },
    ],
    isAssessment: false,
    recordIncorrect: false,
    continueLabel: "Continuar",
    fullScreen: true,
    description: "No hay respuestas correctas, solo estamos conociendo tu punto de partida.",
  },

  // Slide 3 — Flashcard (Teoría con criterio)
  {
    id: "cms-l3-s3",
    stepType: "info",
    title: "Señales de mezcla",
    description: "Dinero vs Autoestima",
    body: "Estás mezclando dinero con autoestima cuando aparecen señales como:\n\n• Sentirte menos por no poder pagar algo.\n• Sentirte más por comprar algo caro.\n• Creer que tu valor cambia según tu saldo.\n• Gastar para sentirte aceptado.\n\nEsto no es debilidad, ¡es presión social!",
    aiInsight: "¡Recuerda que tu valor es constante, el saldo es variable!",
    continueLabel: "Entendido",
    fullScreen: true,
  },

  // Slide 4 — Ejercicio (Calificado) Verdadero o Falso
  {
    id: "cms-l3-s4",
    stepType: "true_false",
    statement: "Mi valor como persona no depende de cuánto dinero tengo.",
    correctValue: true,
    explanation: "El dinero cambia condiciones, pero no tu valor personal.",
    isAssessment: true,
    continueLabel: "Siguiente",
    fullScreen: true,
  },

  // Slide 5 — Ejercicio (Calificado) -> Blitz Challenge (1/2)
  {
    id: "cms-l3-s5",
    stepType: "blitz_challenge",
    title: "Reto Relámpago",
    description: "Alex piensa: \"No puedo comprar lo mismo que mis amigos, entonces soy menos\".",
    question: "¿Qué está mezclando Alex?",
    options: [
      { id: "s5-valor", label: "Valor personal con dinero", isCorrect: true, explanation: "Está ligando su autoestima a su capacidad de gasto." },
      { id: "s5-ahorro", label: "Ahorro con inversión", isCorrect: false },
      { id: "s5-meta", label: "Meta con presupuesto", isCorrect: false },
      { id: "s5-ingreso", label: "Ingreso con deuda", isCorrect: false },
    ],
    timeLimit: 15,
    isAssessment: true,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // Slide 6 — Flashcard (Teoría aplicada)
  {
    id: "cms-l3-s6",
    stepType: "billy_talks",
    mood: "happy",
    body: "Dos personas pueden tener recursos distintos y seguir teniendo el mismo valor.\n\nCuando el dinero se vuelve etiqueta, aparecen vergüenza, presión, comparación y... ¡malas decisiones!",
    continueLabel: "Anotado",
    fullScreen: true,
  },

  // Slide 7 — Ejercicio (Calificado) Matching
  {
    id: "cms-l3-s7",
    stepType: "match",
    question: "Relaciona cada frase con lo que realmente expresa",
    description: "Elige la opción más lógica según el contexto.",
    leftItems: [
      { id: "l1", label: "Si compro esto me verán mejor" },
      { id: "l2", label: "No tengo dinero entonces no valgo" },
      { id: "l3", label: "No puedo pagarlo hoy pero sigo teniendo valor" },
      { id: "l4", label: "El dinero me ayuda pero no me define" },
    ],
    rightItems: [
      { id: "r1", label: "Dinero como estatus" },
      { id: "r2", label: "Confusión valor-dinero" },
      { id: "r3", label: "Límite con autoestima sana" },
      { id: "r4", label: "Autoestima separada" },
    ],
    correctPairs: [
      { leftId: "l1", rightId: "r1" },
      { leftId: "l2", rightId: "r2" },
      { leftId: "l3", rightId: "r3" },
      { leftId: "l4", rightId: "r4" },
    ],
    isAssessment: true,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // Slide 8 — Ejercicio (Calificado) Escenario decisión sana
  {
    id: "cms-l3-s8",
    stepType: "mcq",
    question: "Daniela es invitada a un plan caro. No le alcanza y le da pena decir que no por miedo a verse \"menos\". ¿Cuál sería la decisión más sana?",
    options: [
      { id: "s8-endeudarse", label: "Endeudarse para no sentirse menos", isCorrect: false },
      { id: "s8-ir", label: "Ir aunque no le alcance y luego ver cómo paga", isCorrect: false },
      { id: "s8-no", label: "Decir que no con tranquilidad y proponer un plan barato", isCorrect: true, explanation: "Poner límites financieros sin ligar tu valor al dinero es madurez financiera." },
      { id: "s8-gastar", label: "Gastar su ahorro para una meta importante", isCorrect: false },
    ],
    isAssessment: true,
    continueLabel: "Siguiente",
    fullScreen: true,
  },

  // Slide 9 — Flashcard (Teoría)
  {
    id: "cms-l3-s9",
    stepType: "info",
    title: "Beneficios de separar",
    description: "Finanzas Conscientes",
    body: "Cuando separas dinero de autoestima, pasa esto:\n\n• Te comparas menos.\n• Tomas decisiones más frías e inteligentes.\n• No compras para probar algo a los demás.\n• Proteges tus metas reales.",
    aiInsight: "¡Tu cerebro financiero funciona mejor cuando tu ego no está en juego!",
    continueLabel: "Entendido",
    fullScreen: true,
  },

  // Slide 10 — Ejercicio (Calificado) Multi select
  {
    id: "cms-l3-s10",
    stepType: "multi_select",
    question: "¿Cuáles señales muestran que alguien mide su valor con dinero?",
    description: "Selecciona todas las correctas.",
    options: [
      { id: "s10-inferior", label: "Sentirse inferior por no poder comprar algo", isCorrect: true },
      { id: "s10-importante", label: "Comprar para sentirse importante", isCorrect: true },
      { id: "s10-comparar", label: "Compararse todo el tiempo con otros", isCorrect: true },
      { id: "s10-saldo", label: "Pensar que su valor cambia según su saldo", isCorrect: true },
    ],
    isAssessment: true,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // Slide 11 — Flashcard (Key idea)
  {
    id: "cms-l3-s11",
    stepType: "billy_talks",
    mood: "mascot",
    body: "El dinero puede decir algo sobre una situación financiera actual. ¡Pero no dice quién eres!\n\nTu saldo puede cambiar, pero tu valor personal no debería depender de eso jamás.",
    continueLabel: "Anotado",
    fullScreen: true,
  },

  // Slide 12 — Ejercicio (Calificado) Ordenar proceso saludable
  {
    id: "cms-l3-s12",
    stepType: "order",
    question: "Ordena una forma sana de responder cuando te comparas por dinero",
    items: [
      { id: "o-comparar", label: "Compararme con alguien", correctOrder: 1 },
      { id: "o-sentir", label: "Identificar lo que siento", correctOrder: 2 },
      { id: "o-valor", label: "Recordar que mi valor no depende del dinero", correctOrder: 3 },
      { id: "o-accion", label: "Decidir una acción realista", correctOrder: 4 },
    ],
    isAssessment: true,
    continueLabel: "¡Listo!",
    fullScreen: true,
  },

  // Slide 13 — Ejercicio (Calificado) -> Blitz Challenge (2/2)
  {
    id: "cms-l3-s13",
    stepType: "blitz_challenge",
    title: "Reto Relámpago",
    description: "Leo piensa: \"Si no puedo comprarlo hoy, voy mal en la vida\".",
    question: "¿Cuál es el error principal?",
    options: [
      { id: "s13-error", label: "Confunde un límite temporal con su valor personal", isCorrect: true, explanation: "No poder hoy no define tu valor ni tu éxito futuro." },
      { id: "s13-planeacion", label: "Está haciendo planeación a largo plazo", isCorrect: false },
      { id: "s13-inversion", label: "Está analizando una inversión", isCorrect: false },
      { id: "s13-precios", label: "Está comparando precios", isCorrect: false },
    ],
    timeLimit: 15,
    isAssessment: true,
    continueLabel: "¡Entendido!",
    fullScreen: true,
  },

  // Slide 14 — Diagnóstico (No calificado)
  {
    id: "cms-l3-s14",
    stepType: "mcq",
    question: "Hoy, ¿el dinero en tu mente se parece más a?",
    options: [
      { id: "s14-herramienta", label: "Una herramienta", isCorrect: true },
      { id: "s14-presion", label: "Una presión social", isCorrect: true },
      { id: "s14-medida", label: "Una medida de valor", isCorrect: true },
      { id: "s14-portunidad", label: "Una oportunidad", isCorrect: true },
    ],
    isAssessment: false,
    recordIncorrect: false,
    continueLabel: "Finalizar lección",
    fullScreen: true,
    description: "Estamos registrando tu evolución mental.",
  },

  // Slide 15 — Cierre (Progreso)
  {
    id: "cms-l3-s15",
    stepType: "summary",
    title: "¡Lección completada!",
    body: "Ahora entiendes una idea clave: el dinero influye en tu vida pero no define tu valor. ¡Sigue así!",
    isAssessment: false,
    continueLabel: "Siguiente lección",
    fullScreen: true,
  },
]
