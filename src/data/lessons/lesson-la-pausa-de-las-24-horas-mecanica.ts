import type { LessonStep } from "@/types/lessonTypes"

/**
 * Lesson: La Pausa de las 24 Horas (Mecánica)
 * Theme: Operativo BIZEN
 * Lesson ID: la-pausa-de-las-24-horas-mecanica
 */

export const lessonLaPausaDeLas24HorasMecanicaSteps: LessonStep[] = [
  {
    id: "p24-1",
    stepType: "billy_talks",
    mood: "happy",
    body: "¡Bien hecho, estratega! Ya conoces cuánto vale tu vida, ahora vamos a protegerla.\n\nLa herramienta más poderosa contra el marketing es el **tiempo**. Hoy aprenderás la **[[Regla de las 24 Horas|Hábito de esperar un día completo antes de ejecutar cualquier gasto no vital]]**: el muro que protege tu dinero de tus impulsos.",
    data: { 
      glossary: [
        { word: "Pausa de las 24H", definition: "Técnica de control de impulsos que consiste en posponer una compra para permitir que la lógica reemplace a la emoción." },
        { word: "Dopamina", definition: "Neurotransmisor responsable de la sensación de placer y recompensa; principal motor de las compras compulsivas." }
      ] 
    },
    fullScreen: true,
  },
  {
    id: "p24-2",
    stepType: "info",
    title: "La Química del Deseo",
    body: "Cuando ves algo que te atrae, tu cerebro libera **Dopamina**. Es una señal química de '¡Cómpralo ahora o morirás!'. \n\nPero la dopamina es volátil: desaparece en unas horas. Si esperas, el deseo baja y la **Razón** toma el mando.",
    aiInsight: "El 80% de las compras de las que nos arrepentimos después fueron realizadas bajo un pico de dopamina que duró menos de 30 minutos.",
    fullScreen: true,
  },
  {
    id: "p24-3",
    stepType: "mcq",
    question: "Han pasado 24 horas desde que viste esos tenis de $3,000. Hoy ya no sientes el 'corazón acelerado' al verlos. ¿Qué significa?",
    options: [
      { id: "o1", label: "Que ya no me interesan (Era un capricho)", isCorrect: true, explanation: "Felicidades, acabas de ahorrar $3,000 solo con esperar. No era una necesidad, era un pico químico." },
      { id: "o2", label: "Que se me olvidó ser feliz", isCorrect: false }
    ],
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "p24-4",
    stepType: "blitz_challenge",
    question: "¿A partir de qué porcentaje de tu sueldo mensual DEBES aplicar esta regla?",
    options: [
      { id: "o1", label: "1% de mi ingreso", isCorrect: true },
      { id: "o2", label: "50% de mi ingreso", isCorrect: false }
    ],
    timeLimit: 12,
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "p24-5",
    stepType: "swipe_sorter",
    question: "¿Esto necesita una Pausa de 24 Horas?",
    leftBucket: { label: "Pausa ¡YA!", color: "#ef4444" },
    rightBucket: { label: "Compra Libre", color: "#10b981" },
    items: [
      { id: "i1", label: "Gadget tecnológico nuevo", correctBucket: "left" },
      { id: "i2", label: "Comida básica del día", correctBucket: "right" },
      { id: "i3", label: "Ropa en oferta 'flash'", correctBucket: "left" },
      { id: "i4", label: "Medicinas necesarias", correctBucket: "right" }
    ],
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "p24-6",
    stepType: "info",
    title: "Las Ofertas 'Flash' son Trampas",
    body: "Los contadores regresivos en las webs están diseñados para **anular tu corteza prefrontal** (la parte lógica). \n\nTe fuerzan a decidir bajo estrés. Un Ingeniero BIZEN sabe que si la 'oferta' desaparece en 24h, probablemente no era una buena oferta, sino un anzuelo.",
    aiInsight: "Las ofertas con límite de tiempo aumentan la tasa de conversión en un 200% al inducir ansiedad artificial.",
    fullScreen: true,
  },
  {
    id: "p24-7",
    stepType: "true_false",
    statement: "Si después de 24 horas todavía quiero el objeto, ¿significa que DEBO comprarlo?",
    correctValue: false,
    explanation: "No. Solo significa que superaste la primera barrera. Ahora debes evaluar el Costo de Oportunidad y tu Presupuesto.",
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "p24-8",
    stepType: "impulse_meter",
    instructions: "Mantén presionado para 'Cerrar la Pestaña' ante una oferta que parpadea. Siente el control.",
    item: { name: "Reloj $4,000 (¡Solo hoy!)", price: "Pérdida de Vida", imageUrl: "/billy-breathing.png" },
    holdTime: 5,
    fullScreen: true,
  },
  {
    id: "p24-9",
    stepType: "blitz_challenge",
    question: "¿Cuál es el 'enemigo' de la Pausa de las 24H?",
    options: [
      { id: "o1", label: "La Gratificación Instantánea", isCorrect: true },
      { id: "o2", label: "La Paciencia", isCorrect: false }
    ],
    timeLimit: 10,
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "p24-10",
    stepType: "order",
    question: "Mecánica de la Pausa",
    items: [
      { id: "p1", label: "Ves el objeto y sientes el impulso", correctOrder: 1 },
      { id: "p2", label: "Abandonas el carrito por un día", correctOrder: 2 },
      { id: "p3", label: "Evaluas con la mente fría", correctOrder: 3 }
    ],
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "p24-11",
    stepType: "match",
    question: "Relaciona el estado mental",
    leftItems: [
      { id: "l1", label: "Momento 0 (Dopamina)" },
      { id: "l2", label: "Hora 24 (Córtex)" }
    ],
    rightItems: [
      { id: "r1", label: "Emoción y Urgencia" },
      { id: "r2", label: "Lógica y Estrategia" }
    ],
    correctPairs: [
      { leftId: "l1", rightId: "r1" },
      { leftId: "l2", rightId: "r2" }
    ],
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "p24-12",
    stepType: "mindset_translator",
    question: "Refactoriza la 'Súper Oferta'",
    beliefs: [
      { 
        id: "b1", 
        original: "¡Es solo por hoy, si no lo compro pierdo dinero!", 
        healthyOptions: [
          { id: "h1", label: "Si no lo compro, ahorro el 100% del precio; la verdadera oferta es mi libertad", isCorrect: true },
          { id: "h2", label: "He ganado dinero comprando esto en oferta", isCorrect: false }
        ] 
      }
    ],
    fullScreen: true,
  },
  {
    id: "p24-13",
    stepType: "info",
    title: "El Carrito Abandonado",
    body: "En el mundo digital, dejar un carrito lleno y no comprar es una de las mayores victorias psicológicas. Entrena este músculo: llena carritos por diversión y **ciérralos** por disciplina.",
    aiInsight: "Las tiendas online usarán el 'Retargeting' para perseguirte con anuncios. Mantente firme en tu pausa.",
    fullScreen: true,
  },
  {
    id: "p24-14",
    stepType: "influence_detective",
    scenario: "Un influencer que sigues lanza un producto 'limitado' que se agota en 1 hora. Realmente te gusta. ¿Qué haces?",
    options: [
      { id: "o1", label: "Lo compro YA antes de que se acabe", emotion: "Fomo", isCorrect: false },
      { id: "o2", label: "Aplico mi regla: mi sistema vale más que su producto", emotion: "Soberanía", isCorrect: true }
    ],
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "p24-15",
    stepType: "summary",
    title: "Muro Construido",
    body: "Has instalado la defensa más barata y efectiva del mundo financiero. Nada entra a tu sistema sin pasar por la aduana de las 24 horas. ¡Felicidades!",
    fullScreen: true,
  },
]
