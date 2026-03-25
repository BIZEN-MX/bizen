import type { LessonStep } from "@/types/lessonTypes"

/**
 * Lesson: El valor de tu tiempo (Cálculo real)
 * Theme: El Tablero del Juego (Mentalidad)
 * Lesson ID: el-valor-de-tu-tiempo-calculo-real
 * Difficulty: Básico / Analítico
 */

export const lessonElValorDeTuTiempoCalculoRealSteps: LessonStep[] = [
  // SLIDE 1 — Billy el Coach
  {
    id: "vdt-slide-1",
    stepType: "billy_talks",
    mood: "thinking",
    body: "La mayoría de la gente cree que sabe cuánto gana. Dicen: 'Gano $10,000 al mes'. Pero eso es mentira.\n\nPara el sistema financiero, tu sueldo real no es lo que dice tu recibo, sino lo que queda después de 'comprar' tu derecho a trabajar (transporte, comidas fuera, ropa). Hoy calcularemos tu **Salario Real por Hora**.",
    continueLabel: "Hacer los números",
    fullScreen: true,
  },

  // SLIDE 2 — Concepto: Salario Real (Info)
  {
    id: "vdt-slide-2",
    stepType: "info",
    title: "La Trampa del Sueldo Bruto",
    description: "Lo que entra vs. lo que se queda",
    body: "Si trabajas 40 horas a la semana pero haces 10 horas de tráfico, en realidad estás 'dedicando' 50 horas de tu vida.\n\nSi además gastas en gasolina o comidas que no harías si estuvieras en casa, ese dinero debe restarse de tu sueldo antes de decir 'cuánto ganas'.",
    continueLabel: "Entendido",
    fullScreen: true,
  },

  // SLIDE 3 — Ejercicio: El Detective de Gastos (MCQ)
  {
    id: "vdt-slide-3",
    stepType: "mcq",
    title: "Caso: El Consultor 'Exitoso'",
    description: "Andrés gana $20,000 al mes. Pero gasta $4,000 en gasolina/estacionamiento y $2,000 en comidas rápidas cerca de la oficina porque no tiene tiempo de cocinar.",
    question: "¿Cuál es el 'Sueldo Limpio' de Andrés antes de pagar su renta o luz?",
    options: [
      { id: "opt-1", label: "$20,000 (Es su sueldo)", isCorrect: false },
      { id: "opt-2", label: "$16,000 (Solo resta gasolina)", isCorrect: false },
      { id: "opt-3", label: "$14,000", isCorrect: true, explanation: "$20,000 - $4,000 (transporte) - $2,000 (comida forzada) = $14,000." },
      { id: "opt-4", label: "$18,000", isCorrect: false },
    ],
    isAssessment: true,
    continueLabel: "Calcular horas",
    fullScreen: true,
  },

  // SLIDE 4 — El Factor Tiempo (Info)
  {
    id: "vdt-slide-4",
    stepType: "info",
    title: "Las Horas Fantasma",
    description: "El tráfico también es trabajo",
    body: "Si Andrés dedica 8 horas al día al trabajo + 2 horas de tráfico, su día laboral es de 10 horas.\n\nAl mes (20 días), dedica **200 horas** de su vida para obtener esos $14,000 limpios.\n\n**Su Salario Real por Hora = $14,000 / 200 = $70 pesos por hora.**",
    continueLabel: "Ponerlo a prueba",
    fullScreen: true,
  },

  // SLIDE 5 — Blitz Challenge (Cálculo rápido)
  {
    id: "vdt-slide-5",
    stepType: "blitz_challenge",
    title: "Reto Relámpago",
    description: "Andrés quiere comprar unos tenis de $2,100 pesos. Su salario real es de $70/hora.",
    question: "¿Cuántas horas de vida 'limpias' le cuestan esos tenis?",
    options: [
      { id: "opt-1", label: "10 horas", isCorrect: false },
      { id: "opt-2", label: "21 horas", isCorrect: false },
      { id: "opt-3", label: "30 horas", isCorrect: true, explanation: "$2,100 / $70 = 30 horas. Casi 4 días enteros de trabajo solo por unos tenis." },
    ],
    timeLimit: 20,
    isAssessment: true,
    continueLabel: "Continuar",
    fullScreen: true,
  },

  // SLIDE 6 — Impulse Meter (Visual)
  {
    id: "vdt-slide-6",
    stepType: "impulse_meter",
    item: {
      name: "Cena de lujo con los amigos",
      price: "$1,400",
    },
    description: "Es viernes. Todos van a un lugar caro. Sabes que te costará 20 horas (2.5 días) de tu vida real. El grupo te presiona.",
    instructions: "Mantén presionado para decir 'No' y proteger tus 20 horas de libertad.",
    holdTime: 4,
    isAssessment: true,
    fullScreen: true,
  },

  // SLIDE 7 — True or False (Concepto)
  {
    id: "vdt-slide-7",
    stepType: "true_false",
    statement: "Vivir más cerca del trabajo, aunque la renta sea un poco más cara, puede subir tu Salario Real por Hora si ahorras tráfico y gasolina.",
    correctValue: true,
    explanation: "El tiempo es dinero. Ahorrar 2 horas de tráfico al día son 40 horas al mes que recuperas de tu vida.",
    isAssessment: true,
    continueLabel: "Avanzar",
    fullScreen: true,
  },

  // SLIDE 8 — Narrative Check (Compromiso)
  {
    id: "vdt-slide-8",
    stepType: "narrative_check",
    question: "Toma tu ingreso mensual, resta tus gastos de transporte/comida de trabajo y divídelo entre tus horas totales dedicadas. ¿Cuál crees que es tu salario real por hora aproximado?",
    promptPlaceholder: "Mi salario real es de aprox $... por hora.",
    minChars: 15,
    billyResponse: "¡Impactante, ¿verdad?! Ahora, cada vez que veas un precio, divídelo entre ese número. Esa es la verdad detrás de la etiqueta.",
    isAssessment: false,
    fullScreen: true,
  },

  // SLIDE 9 — Summary
  {
    id: "vdt-slide-9",
    stepType: "summary",
    title: "Ojos Abiertos",
    body: "Has hackeado la primera ilusión del sistema. Ya no ves precios en pesos, ves precios en tu propia vida. En la siguiente lección, aprenderemos a decidir qué sacrificios valen la pena.",
    continueLabel: "Finalizar",
    fullScreen: true,
  },
]
