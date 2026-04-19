import type { LessonStep } from "@/types/lessonTypes"

/**
 * Lesson: El Efecto Dunning-Kruger en tus finanzas
 * Theme: El Tablero del Juego (Mentalidad)
 * Lesson ID: el-efecto-dunning-kruger-en-tus-finanzas
 * Difficulty: Intermedio / Psicológico-Analítico
 */

export const lessonElEfectoDunningKrugerEnTusFinanzasSteps: LessonStep[] = [
  {
    id: "dk-slide-1",
    stepType: "billy_talks",
    mood: "thinking",
    body: "Los que menos saben de finanzas suelen ser los que más creen que saben. Eso se llama **Efecto Dunning-Kruger**.\n\nHoy vamos a aprender a detectar cuándo nuestra confianza nos está metiendo en problemas por no querer admitir que nos falta aprender algo básico.",
    continueLabel: "Analizar el sesgo",
    fullScreen: true,
  },
  {
    id: "dk-slide-2",
    stepType: "info",
    title: "¿Qué es el Efecto Dunning-Kruger?",
    description: "La trampa de la sobreconfianza",
    body: "Es la tendencia de las personas con poca habilidad a **sobreestimar** su capacidad. \n\nCrees que invertir es fácil porque viste un video de un minuto, pero ignoras los riesgos reales. Eso es lo que te hace perder dinero rápido.",
    continueLabel: "Ver ejemplo",
    fullScreen: true,
  },
  {
    id: "dk-slide-3",
    stepType: "mcq",
    title: "El Caso de Ricardo",
    description: "Ricardo abre una cuenta de trading y mete todos sus ahorros en una criptomoneda nueva 'porque un amigo le dijo que va a subir'. Ricardo dice: 'Sé lo que estoy haciendo'.",
    question: "¿Qué es lo más peligroso para el dinero de Ricardo?",
    options: [
      { id: "opt-1", label: "La volatilidad de la moneda", isCorrect: false },
      { id: "opt-2", label: "Su propia sobreconfianza que le impide investigar los riesgos", isCorrect: true, explanation: "Ignora su propia ignorancia, por lo tanto no se protege contra la pérdida." },
      { id: "opt-3", label: "El mercado bajista", isCorrect: false },
    ],
    isAssessment: true,
    fullScreen: true,
    aiInsight: "Billy dice: Saber que no sabes es la mayor habilidad de un inversor inteligente.",
  },
  {
    id: "dk-slide-4",
    stepType: "blitz_challenge",
    title: "Reto Relámpago",
    description: "Lees un post que dice: '¡Gana 50% mensual sin riesgo!'. Te sientes tentado, pero te detienes a pensar.",
    question: "Si una inversión real segura da el 10-12% ANUAL, ¿cuál es la deducción más lógica sobre ese 50%?",
    options: [
      { id: "opt-1", label: "Que es una oportunidad única", isCorrect: false },
      { id: "opt-2", label: "Que es una estafa o tiene un riesgo desmesurado e invisible", isCorrect: true, explanation: "Los retornos irreales siempre esconden riesgos que un novato sobreconfiado no ve." },
      { id: "opt-3", label: "Que el banco te está engañando", isCorrect: false },
    ],
    timeLimit: 15,
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "dk-slide-5",
    stepType: "true_false",
    statement: "Un experto en finanzas suele ser más CAUTO que un novato, porque entiende todos los factores que podrían fallar.",
    correctValue: true,
    explanation: "A mayor conocimiento, mayor humildad ante la incertidumbre del mercado.",
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "dk-slide-6",
    stepType: "order",
    question: "Ordena los pasos de la Curva Dunning-Kruger",
    items: [
      { id: "dk-1", label: "Ignorancia total", correctOrder: 1 },
      { id: "dk-2", label: "Confianza máxima (Pico de la 'Estupidez')", correctOrder: 2 },
      { id: "dk-3", label: "Darse cuenta de lo complejo que es (Valle de la Desesperación)", correctOrder: 3 },
      { id: "dk-4", label: "Construcción de conocimiento sólido", correctOrder: 4 },
    ],
    isAssessment: true,
    fullScreen: true,
  },
  {
    id: "dk-slide-7",
    stepType: "narrative_check",
    question: "De todos los temas financieros (Ahorro, Inversión, Crédito, Impuestos), ¿cuál crees QUE YA SABES, pero no podrías explicarle a un niño de 10 años?",
    promptPlaceholder: "Creo que sé de ..., pero me falta profundidad.",
    minChars: 20,
    billyResponse: "¡Esa es la señal! Si no puedes explicarlo simple, aún no lo entiendes. ¡Vamos a estudiar más!",
    isAssessment: false,
    fullScreen: true,
  },
  {
    id: "dk-slide-8",
    stepType: "summary",
    title: "Investigador Formado",
    body: "Ahora tienes el superpoder de cuestionar tus propias certezas. Esto te salvará de estafas y de errores costosos. En la siguiente lección, veremos un caso real: Placer de hoy vs. Libertad de mañana.",
    continueLabel: "Finalizar Lección",
    fullScreen: true,
  },
]
