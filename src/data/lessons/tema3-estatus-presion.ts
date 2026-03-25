import { LessonStep } from "@/types/lessonTypes";

// 11. Comprar por estatus vs por valor
export const lessonComprarPorEstatusVsPorValorSteps: LessonStep[] = [
  {
    id: "t3-l11-s1",
    stepType: "billy_talks",
    title: "El Dilema del Reloj",
    body: "¿Por qué un reloj de $10,000 dice la misma hora que uno de $10? Si compras el de $10,000, estás pagando por lo que los DEMÁS piensan de ti.",
    mood: "thinking",
  },
  {
    id: "t3-l11-s2",
    stepType: "match",
    title: "Valor vs Estatus",
    question: "Identifica si la compra es por valor real o por estatus social:",
    leftItems: [
      { id: "v1", label: "Curso de inglés online" },
      { id: "v2", label: "Camiseta con logo gigante de $200" },
      { id: "v3", label: "Fondo de inversión (S&P 500)" },
      { id: "v4", label: "Botella de champaña en antro" },
    ],
    rightItems: [
      { id: "r1", label: "Valor Real" },
      { id: "r2", label: "Estatus Social" },
    ],
    correctPairs: [
      { leftId: "v1", rightId: "r1" },
      { leftId: "v2", rightId: "r2" },
      { leftId: "v3", rightId: "r1" },
      { leftId: "v4", rightId: "r2" }
    ],
  }
];

// 12. “Apariencia de riqueza” vs riqueza real
export const lessonAparienciaDeRiquezaVsRiquezaRealSteps: LessonStep[] = [
  {
    id: "t3-l12-s1",
    stepType: "mindset_translator",
    title: "Traductor de Riqueza",
    question: "Traduce la acción a su impacto real en la riqueza:",
    beliefs: [
      {
        id: "b1",
        original: "Ves a alguien con un coche lujoso de leasing ($2,000/mes) que no tiene casa propia.",
        healthyOptions: [
          { id: "o1", label: "Está comprando apariencia de éxito con deuda", isCorrect: true, explanation: "Es una ilusión que drena su riqueza real cada mes." },
          { id: "o2", label: "Está invirtiendo en su propia comodidad", isCorrect: false },
        ]
      }
    ],
  },
  {
    id: "t3-l12-s2",
    stepType: "mcq",
    title: "La Riqueza es Invisible",
    question: "¿Dónde reside la verdadera riqueza según los millonarios silenciosos?",
    options: [
      { id: "r1", label: "En lo que NO se ve (Cuentas, Activos, Tiempo)", isCorrect: true, explanation: "Correcto. La verdadera riqueza se mide en el tiempo que puedes vivir sin trabajar." },
      { id: "r2", label: "En la ropa de marca y cenas de lujo", isCorrect: false },
    ],
  }
];

// 13. Presión social en decisiones (escenarios)
export const lessonPresionSocialEnDecisionesEscenariosSteps: LessonStep[] = [
  {
    id: "t3-l13-s1",
    stepType: "influence_detective",
    title: "Escenario: La Cena en Grupo",
    scenario: "Tus 5 amigos piden los platos más caros y vino 'para todos'. Tú solo querías una ensalada y no tienes presupuesto para gastar tanto hoy.",
    options: [
      { id: "p1", label: "El qué dirán (Ostracismo social)", emotion: "Miedo", isCorrect: true },
      { id: "p2", label: "El hambre emocional", emotion: "Fisiológico", isCorrect: false },
      { id: "p3", label: "Falta de educación", emotion: "Ignorancia", isCorrect: false },
    ],
    explanation: "Es el miedo ancestral a ser expulsado del grupo por ser 'diferente' o 'pobre'.",
  },
  {
    id: "t3-l13-s2",
    stepType: "billy_talks",
    body: "Si tus amigos te juzgan por cuidar tu futuro, tal vez necesitas mejores amigos (o más cínicos en su consumo).",
    mood: "worried",
  }
];

// 14. ¿Cómo decir que no sin sentirte menos?
export const lessonNoEstatusSteps: LessonStep[] = [
  {
    id: "t3-l14-s1",
    stepType: "fill_blanks",
    title: "El Poder de la Prioridad",
    question: "Cambia tu narrativa interna:",
    textParts: [
      { type: "text", content: "No digas 'No tengo dinero', di 'No está en mis " },
      { type: "blank", id: "b1", correctOptionId: "opt-pri" },
      { type: "text", content: " ahora mismo'. Esto cambia la narrativa de " },
      { type: "blank", id: "b2", correctOptionId: "opt-pob" },
      { type: "text", content: " a una decisión consciente y poderosa." }
    ],
    options: [
      { id: "opt-pri", label: "prioridades", isCorrect: true },
      { id: "opt-pob", label: "pobreza", isCorrect: true },
      { id: "opt-mes", label: "gastos del mes", isCorrect: false },
    ],
  },
  {
    id: "t3-l14-s2",
    stepType: "mcq",
    title: "La Regla de la Transparencia",
    question: "¿Es saludable ser honesto con tu círculo sobre tus objetivos de ahorro?",
    options: [
      { id: "o1", label: "Sí, reduce la presión social desde el inicio", isCorrect: true, explanation: "Muchos amigos te admirarán por tu disciplina." },
      { id: "o2", label: "No, te verán como alguien tacaño", isCorrect: false },
    ],
  }
];

// 15. Regla personal anti-estatus
export const lessonReglaPersonalAntiEstatusSteps: LessonStep[] = [
  {
    id: "t3-l15-s1",
    stepType: "mcq", // Better than narrative_check for the automated engine
    title: "Tu Nueva Regla",
    question: "De ahora en adelante, ¿cuál será tu regla de oro para no comprar por estatus?",
    options: [
      { id: "r1", label: "Esperar 48 horas para cualquier consumo de lujo", isCorrect: true, explanation: "Filtro de Tiempo." },
      { id: "r2", label: "No comprar nada que solo sirva para mostrar en redes", isCorrect: true, explanation: "Filtro de Propósito." },
      { id: "r3", label: "Comprar solo si mejorará mi habilidad o tiempo", isCorrect: true, explanation: "Filtro de Inversión." },
    ],
  },
  {
    id: "t3-l15-s2",
    stepType: "billy_talks",
    title: "¡Tema 3 Completado!",
    body: "Has blindado tu mente contra la psicología del consumo masivo. Ya sabes identificar gatillos y resistir la presión de grupo. Siguiente fase: Tu Estructura de Gastos.",
    mood: "celebrating",
  }
];
