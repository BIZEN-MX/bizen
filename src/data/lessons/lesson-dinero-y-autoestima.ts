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
        stepType: "billy_talks",
        mood: "thinking",
        body: "A veces el dinero parece decir algo sobre nosotros. ¿Sientes que tener más dinero te hace “valer más”?\n\nEsa idea afecta tu autoestima y tus decisiones. ¡Vamos a separar tu valor personal de tu cuenta bancaria!",
        continueLabel: "¡Empecemos!",
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
        title: "Tu valor real",
        description: "Dinero vs Identidad",
        body: "El dinero influye en tu comodidad y opciones, pero **NO** define quién eres.\n\nValor personal y situación financiera son cosas totalmente distintas. ¡Nunca lo olvides!",
        continueLabel: "Entendido",
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
        stepType: "blitz_challenge",
        title: "Reto Relámpago",
        description: "Una persona dice: “Si no puedo comprar lo mismo que mis amigos, entonces soy menos”.",
        question: "¿Qué mezcla aquí?",
        options: [
            { id: "opt-valor", label: "Valor personal con dinero", isCorrect: true, explanation: "Mezcla su valor como persona con su capacidad de gasto." },
            { id: "opt-metas", label: "Metas con disciplina", isCorrect: false },
            { id: "opt-presupuesto", label: "Presupuesto con ahorro", isCorrect: false },
        ],
        timeLimit: 20,
        isAssessment: true,
        continueLabel: "Continuar",
        fullScreen: true,
    },

    // SLIDE 6 — FLASHCARD (Example Theory)
    {
        id: "dya-slide-6",
        stepType: "billy_talks",
        mood: "happy",
        body: "Comparar dinero con valor personal crea presión innecesaria.\n\nDos personas con recursos distintos siguen valiendo exactamente lo mismo. ¡La billetera no es el termómetro del alma!",
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
        title: "Percepción social",
        description: "Límites y autoestima",
        body: "Cuando el dinero es tu “medida”, aparece la vergüenza o la presión social.\n\n¡Separar estos conceptos te ayuda a decidir con la cabeza fría!",
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
        stepType: "billy_talks",
        mood: "happy",
        body: "Idea clave: **Tú no eres tu saldo**.\n\nTu saldo puede subir o bajar como una montaña rusa, ¡pero tu valor personal se queda arriba!",
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
        stepType: "blitz_challenge",
        title: "Reto Relámpago",
        description: "Leo piensa: “Si no puedo comprarlo hoy, significa que voy mal en la vida”.",
        question: "¿Cuál es el error principal?",
        options: [
            { id: "opt-limite-v-valor", label: "Confundir límite con valor", isCorrect: true, explanation: "No poder comprar algo hoy no define quién eres." },
            { id: "opt-prioridades", label: "Ajustar prioridades", isCorrect: false },
        ],
        timeLimit: 20,
        isAssessment: true,
        continueLabel: "¡Lo tengo!",
        fullScreen: true,
    },
    {
        id: "dya-slide-13-mindset",
        stepType: "mindset_translator",
        question: "¿Cómo lo dirías mejor?",
        beliefs: [
            {
                id: "belief-valia",
                original: "Si mi tarjeta es rechazada, me siento menos que los demás.",
                healthyOptions: [
                    { id: "hv-1", label: "Mi valor no depende de una transacción fallida; es solo un tema técnico o de presupuesto", isCorrect: true },
                    { id: "hv-2", label: "Tengo que trabajar más para que nunca me vuelva a pasar", isCorrect: false },
                ]
            }
        ],
        isAssessment: true,
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
