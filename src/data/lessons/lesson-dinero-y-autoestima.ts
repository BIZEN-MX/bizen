import type { LessonStep } from "@/types/lessonTypes"

/** Lesson: Dinero y Autoestima – 12 slides */
export const lessonDineroYAutoestimaSteps: LessonStep[] = [
    // SLIDE 1 — FLASHCARD: Intro
    {
        id: "l-money-self-1-intro",
        stepType: "info",
        title: "Dinero y Autoestima",
        body: "A veces el dinero\nparece decir algo sobre nosotros.",
        imageUrl: "/generated-lesson-images/money-self-1.png",
        imageAlign: "right",
        isAssessment: false,
        fullScreen: true,
        continueLabel: "Continuar",
    },

    // SLIDE 2 — REFLECTION (Non-graded)
    {
        id: "l-money-self-2-reflection",
        stepType: "mcq",
        question: "Cuando pienso en dinero, siento que dice algo sobre mí.",
        options: [
            { id: "opt-1", label: "Sí", isCorrect: true },
            { id: "opt-2", label: "A veces", isCorrect: true },
            { id: "opt-3", label: "No estoy seguro", isCorrect: true },
        ],
        isAssessment: true,
        recordIncorrect: false, // Reflection, don't penalize
        continueLabel: "Continuar",
        fullScreen: true,
    },

    // SLIDE 3 — FLASHCARD: Theory
    {
        id: "l-money-self-3-theory",
        stepType: "info",
        title: "El valor personal",
        body: "Muchas personas creen que\nel dinero define su valor.",
        imageUrl: "/generated-lesson-images/money-self-2.png",
        imageAlign: "left",
        isAssessment: false,
        fullScreen: true,
        continueLabel: "Continuar",
    },

    // SLIDE 4 — KNOWLEDGE CHECK: True / False
    {
        id: "l-money-self-4-check",
        stepType: "true_false",
        statement: "La cantidad de dinero define cuánto valgo como persona.",
        correctValue: false,
        explanation: "Tu valor no depende del dinero que tienes.",
        isAssessment: true,
        recordIncorrect: true,
        continueLabel: "Continuar",
        fullScreen: true,
    },

    // SLIDE 5 — CONCEPT MAPPING: Match
    {
        id: "l-money-self-5-match",
        stepType: "match",
        question: "Relaciona la creencia con su consecuencia.",
        leftItems: [
            { id: "l1", label: "No tengo dinero" },
            { id: "l2", label: "Gano más" },
        ],
        rightItems: [
            { id: "r1", label: "No soy suficiente" },
            { id: "r2", label: "Valgo más" },
        ],
        correctPairs: [
            { leftId: "l1", rightId: "r1" },
            { leftId: "l2", rightId: "r2" },
        ],
        isAssessment: true,
        recordIncorrect: true,
        continueLabel: "Continuar",
        fullScreen: true,
    },

    // SLIDE 6 — FLASHCARD: Example
    {
        id: "l-money-self-6-example",
        stepType: "info",
        title: "Perspectiva",
        body: "Dos personas con el mismo dinero\npueden sentirse completamente distintas.\n\nLo que cambia es la creencia.",
        imageUrl: "/generated-lesson-images/money-self-3.png",
        imageAlign: "right",
        isAssessment: false,
        fullScreen: true,
        continueLabel: "Continuar",
    },

    // SLIDE 7 — SCENARIO (Decision / Reflection)
    {
        id: "l-money-self-7-scenario",
        stepType: "mcq",
        question: "Alguien presume lo que compra y tú no puedes hacerlo. ¿Qué pensamiento aparece primero?",
        options: [
            { id: "opt-1", label: "Comparación", isCorrect: true },
            { id: "opt-2", label: "Frustración", isCorrect: true },
            { id: "opt-3", label: "Indiferencia", isCorrect: true },
            { id: "opt-4", label: "Motivación", isCorrect: true },
        ],
        isAssessment: true,
        recordIncorrect: false,
        continueLabel: "Continuar",
        fullScreen: true,
    },

    // SLIDE 8 — STRUCTURING: Order
    {
        id: "l-money-self-8-order",
        stepType: "order",
        question: "Ordena lo que más influye en cómo me siento conmigo mismo.",
        items: [
            { id: "item-1", label: "Mi forma de pensar", correctOrder: 1 },
            { id: "item-2", label: "Opinión de otros", correctOrder: 2 },
            { id: "item-3", label: "Cantidad de dinero", correctOrder: 3 },
        ],
        isAssessment: true,
        recordIncorrect: true,
        continueLabel: "Continuar",
        fullScreen: true,
    },

    // SLIDE 9 — FLASHCARD: Key Idea
    {
        id: "l-money-self-9-key-idea",
        stepType: "info",
        title: "Autoestima",
        body: "Creer que el dinero define quién eres\npuede afectar tu autoestima.",
        imageUrl: "/generated-lesson-images/money-self-4.png",
        imageAlign: "left",
        isAssessment: false,
        fullScreen: true,
        continueLabel: "Continuar",
    },

    // SLIDE 10 — QUIZ: Multiple Choice
    {
        id: "l-money-self-10-quiz",
        stepType: "mcq",
        question: "¿Qué es lo más sano respecto al dinero?",
        options: [
            { id: "opt-1", label: "Dejar que defina mi valor", isCorrect: false },
            { id: "opt-2", label: "Compararme constantemente", isCorrect: false },
            { id: "opt-3", label: "Separar dinero de autoestima", isCorrect: true, explanation: "Tu valor no depende del dinero." },
            { id: "opt-4", label: "Ignorarlo por completo", isCorrect: false },
        ],
        isAssessment: true,
        recordIncorrect: true,
        continueLabel: "Continuar",
        fullScreen: true,
    },

    // SLIDE 11 — FLASHCARD: Closure Reflection
    {
        id: "l-money-self-11-closure-reflection",
        stepType: "info",
        title: "Conclusión",
        body: "El dinero es una herramienta.\nNo es una etiqueta.",
        imageUrl: "/generated-lesson-images/money-self-5.png",
        imageAlign: "right",
        isAssessment: false,
        fullScreen: true,
        continueLabel: "Continuar",
    },

    // SLIDE 12 — CLOSURE: Summary
    {
        id: "l-money-self-12-end",
        stepType: "summary",
        title: "Lección completada",
        body: "Ahora entiendes mejor lo que el dinero NO dice de ti.",
        imageUrl: "/Lección completada.png",
        isAssessment: false,
        fullScreen: true,
        continueLabel: "Siguiente lección",
    },
]
