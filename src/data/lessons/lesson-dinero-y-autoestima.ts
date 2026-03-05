import type { LessonStep } from "@/types/lessonTypes"

/**
 * Lesson 3: Lo que creo que el dinero dice de mí
 * Theme: Mi relación con el dinero
 * Lesson ID: dinero-y-autoestima
 * Difficulty: Introductory–Intermediate
 * Slides: 15
 */

export const lessonDineroYAutoestimaSteps: LessonStep[] = [
    // SLIDE 1 — FLASHCARD (Intro Theory)
    {
        id: "dya-slide-1",
        stepType: "info",
        title: "El dinero y yo",
        body: "A veces el dinero parece decir algo sobre nosotros.\n\nAlgunas personas sienten que tener más dinero las hace “valer más”. O que tener menos dinero las hace “valer menos”.\n\nEsa idea afecta la autoestima y las decisiones.",
        isAssessment: false,
        continueLabel: "Continuar",
        fullScreen: true,
    },

    // SLIDE 2 — Diagnostic Reflection (non-graded)
    {
        id: "dya-slide-2",
        stepType: "mcq",
        question: "¿Cuando piensas en dinero, sientes que puede cambiar cómo te perciben los demás?",
        options: [
            { id: "opt-mucho", label: "Sí, mucho", isCorrect: true },
            { id: "opt-aveces", label: "A veces", isCorrect: true },
            { id: "opt-casi-no", label: "Casi no", isCorrect: true },
            { id: "opt-no-seguro", label: "No estoy seguro/a", isCorrect: true },
        ],
        isAssessment: false,
        recordIncorrect: false,
        continueLabel: "Continuar",
        fullScreen: true,
    },

    // SLIDE 3 — FLASHCARD (Theory)
    {
        id: "dya-slide-3",
        stepType: "info",
        title: "Valor vs. Dinero",
        body: "El dinero puede influir en tu comodidad, en tus opciones o en tus oportunidades.\n\nPero eso **NO** define tu valor como persona.\n\nValor personal y situación financiera no son lo mismo.",
        isAssessment: false,
        continueLabel: "Continuar",
        fullScreen: true,
    },

    // SLIDE 4 — Guided True / False (graded)
    {
        id: "dya-slide-4",
        stepType: "true_false",
        statement: "Tener más dinero significa automáticamente que una persona vale más que otra.",
        correctValue: false,
        explanation: "El dinero puede cambiar condiciones de vida, pero no define el valor humano de una persona.",
        isAssessment: true,
        continueLabel: "Continuar",
        fullScreen: true,
    },

    // SLIDE 5 — Guided Classification (graded)
    {
        id: "dya-slide-5",
        stepType: "mcq",
        title: "Identificando la mezcla",
        description: "Una persona dice: “Si no puedo comprar lo mismo que mis amigos, entonces soy menos”.",
        question: "¿Qué está mezclando esa persona?",
        options: [
            { id: "opt-presupuesto", label: "Presupuesto con ahorro", isCorrect: false },
            { id: "opt-valor", label: "Valor personal con dinero", isCorrect: true, explanation: "Está usando el dinero como medida de su valor personal, y eso distorsiona su autoestima." },
            { id: "opt-metas", label: "Metas con disciplina", isCorrect: false },
            { id: "opt-ingreso", label: "Ingreso con inversión", isCorrect: false },
        ],
        isAssessment: true,
        continueLabel: "Continuar",
        fullScreen: true,
    },

    // SLIDE 6 — FLASHCARD (Example Theory)
    {
        id: "dya-slide-6",
        stepType: "info",
        title: "Mismo valor, distintos recursos",
        body: "Dos estudiantes pueden tener recursos distintos\ny seguir teniendo el mismo valor como personas.\n\nComparar dinero con valor personal crea presión innecesaria.",
        isAssessment: false,
        continueLabel: "Continuar",
        fullScreen: true,
    },

    // SLIDE 7 — Match Concepts (graded)
    {
        id: "dya-slide-7",
        stepType: "match",
        question: "Relaciona cada frase con la idea que representa.",
        leftItems: [
            { id: "frase-1", label: "“No tengo dinero, entonces no valgo”" },
            { id: "frase-2", label: "“Tener dinero me ayuda, pero no me define”" },
            { id: "frase-3", label: "“Si compro esto, me verán mejor”" },
            { id: "frase-4", label: "“No puedo pagar eso ahora, pero sigo teniendo valor”" },
        ],
        rightItems: [
            { id: "idea-1", label: "Confusión entre valor personal y dinero" },
            { id: "idea-2", label: "Autoestima separada del dinero" },
            { id: "idea-3", label: "Dinero como estatus" },
            { id: "idea-4", label: "Límite financiero con autoestima sana" },
        ],
        correctPairs: [
            { leftId: "frase-1", rightId: "idea-1" },
            { leftId: "frase-2", rightId: "idea-2" },
            { leftId: "frase-3", rightId: "idea-3" },
            { leftId: "frase-4", rightId: "idea-4" },
        ],
        isAssessment: true,
        continueLabel: "Continuar",
        fullScreen: true,
    },

    // SLIDE 8 — Scenario Decision (graded)
    {
        id: "dya-slide-8",
        stepType: "mcq",
        title: "El caso de Daniela",
        description: "A Daniela la invitan a un plan caro. No le alcanza, pero piensa en ir de todos modos para no sentirse “menos”.",
        question: "¿Cuál sería la decisión MÁS sana en este caso?",
        options: [
            { id: "opt-gastar", label: "Gastar aunque no pueda, para no sentirse menos", isCorrect: false },
            { id: "opt-rechazar-menos", label: "Rechazar el plan y pensar que no vale lo mismo que los demás", isCorrect: false },
            { id: "opt-limite", label: "Reconocer su límite y buscar una alternativa sin ligar su valor al dinero", isCorrect: true, explanation: "Poner límites financieros sin afectar tu autoestima es una señal de madurez financiera." },
            { id: "opt-endeudarse", label: "Endeudarse para “mantener su imagen”", isCorrect: false },
        ],
        isAssessment: true,
        continueLabel: "Continuar",
        fullScreen: true,
    },

    // SLIDE 9 — FLASHCARD (Theory)
    {
        id: "dya-slide-9",
        stepType: "info",
        title: "La trampa de la medida",
        body: "Cuando el dinero se convierte en “medida de valor”, aparecen comparaciones, vergüenza o presión.\n\nSeparar dinero de autoestima ayuda a decidir mejor.",
        isAssessment: false,
        continueLabel: "Continuar",
        fullScreen: true,
    },

    // SLIDE 10 — Multiple Select (graded)
    {
        id: "dya-slide-10",
        stepType: "multi_select",
        title: "Señales de alerta",
        description: "Una persona está mezclando autoestima con dinero cuando interpreta el dinero como una “prueba” de su valor. Selecciona todas las correctas.",
        question: "¿Cuáles de estas señales pueden mostrar esa mezcla?",
        options: [
            { id: "opt-inferior", label: "Sentirse inferior por no poder comprar algo", isCorrect: true },
            { id: "opt-importante", label: "Buscar compras para sentirse más importante", isCorrect: true },
            { id: "opt-comparar", label: "Compararse todo el tiempo por lo que otros tienen", isCorrect: true },
            { id: "opt-cambia", label: "Pensar que su valor cambia según su saldo", isCorrect: true },
        ],
        isAssessment: true,
        continueLabel: "Continuar",
        fullScreen: true,
        // Feedback: Cuando el dinero se usa para medir valor personal, suelen aparecer varias de estas señales al mismo tiempo.
    },

    // SLIDE 11 — FLASHCARD (Key Idea)
    {
        id: "dya-slide-11",
        stepType: "info",
        title: "Tú no eres tu saldo",
        body: "El dinero puede decir algo sobre una situación. No dice quién eres.\n\nTu saldo cambia. Tu valor personal no debería depender de eso.",
        isAssessment: false,
        continueLabel: "Continuar",
        fullScreen: true,
    },

    // SLIDE 12 — Order by Logic (graded)
    {
        id: "dya-slide-12",
        stepType: "order",
        question: "Ordena una forma más sana de responder cuando te comparas por dinero.",
        items: [
            { id: "step-4", label: "Decidir una acción realista (ajustar, ahorrar o esperar)", correctOrder: 4 },
            { id: "step-2", label: "Identificar lo que siento", correctOrder: 2 },
            { id: "step-3", label: "Recordar que mi valor no depende del dinero", correctOrder: 3 },
            { id: "step-1", label: "Compararme con alguien", correctOrder: 1 },
        ],
        isAssessment: true,
        continueLabel: "Continuar",
        fullScreen: true,
        // Feedback: Primero reconoces lo que pasó, luego corriges la idea y finalmente decides mejor.
    },

    // SLIDE 13 — Error Diagnosis (graded)
    {
        id: "dya-slide-13",
        stepType: "mcq",
        title: "El pensamiento de Leo",
        description: "Leo piensa: “Si no puedo comprarlo hoy, significa que voy mal en la vida”.",
        question: "¿Cuál es el error principal en ese pensamiento?",
        options: [
            { id: "opt-limite-v-valor", label: "Confunde un límite temporal con su valor personal", isCorrect: true, explanation: "No poder comprar algo hoy no define quién eres ni tu valor como persona." },
            { id: "opt-largo-plazo", label: "Está haciendo una planeación a largo plazo", isCorrect: false },
            { id: "opt-inversion", label: "Está analizando una inversión", isCorrect: false },
            { id: "opt-prioridades", label: "Está considerando prioridades", isCorrect: false },
        ],
        isAssessment: true,
        continueLabel: "Continuar",
        fullScreen: true,
    },

    // SLIDE 14 — Diagnostic Reflection (non-graded)
    {
        id: "dya-slide-14",
        stepType: "mcq",
        question: "Hoy, el dinero en tu mente se parece más a:",
        options: [
            { id: "opt-herramienta", label: "Una herramienta", isCorrect: true },
            { id: "opt-presion", label: "Una presión social", isCorrect: true },
            { id: "opt-medida", label: "Una medida de valor", isCorrect: true },
            { id: "opt-oportunidad", label: "Una oportunidad", isCorrect: true },
        ],
        isAssessment: false,
        recordIncorrect: false,
        continueLabel: "Continuar",
        fullScreen: true,
    },

    // SLIDE 15 — Progress Feedback
    {
        id: "dya-slide-15",
        stepType: "summary",
        title: "¡Lección completada!",
        body: "Ahora entiendes una idea clave: el dinero puede influir en tu vida, pero no define tu valor como persona.",
        isAssessment: false,
        continueLabel: "Siguiente lección",
        fullScreen: true,
    },
]
