import type { LessonStep } from "@/types/lessonTypes"

/** Lesson 1 – Historia del dinero (l1-1) */
export const lesson1Steps: LessonStep[] = [
  {
    id: "l1-1-intro",
    stepType: "info",
    title: "Historia del dinero",
    body: "En esta lección verás por qué el dinero existe y cómo ha cambiado a lo largo del tiempo. Entender su historia te ayuda a tomar mejores decisiones con tu dinero hoy.",
    isAssessment: false,
  },
  {
    id: "l1-1-why",
    stepType: "info",
    title: "¿Para qué sirve el dinero?",
    body: "El dinero cumple tres funciones principales: es un medio de intercambio (compras y ventas), una unidad de cuenta (medir valor) y un depósito de valor (guardar para después). Sin dinero, tendríamos que intercambiar cosas directamente, lo que hace muy difícil el comercio.",
    isAssessment: false,
  },
  {
    id: "l1-1-q1",
    stepType: "mcq",
    question: "¿Cuál es una función principal del dinero?",
    options: [
      {
        id: "opt-1",
        label: "Ser un medio de intercambio",
        isCorrect: true,
        explanation: "Correcto. El dinero nos permite intercambiar bienes y servicios sin tener que truequear directamente.",
      },
      {
        id: "opt-2",
        label: "Solo guardarse bajo el colchón",
        isCorrect: false,
        explanation: "Guardar es una forma de uso, pero la función principal es facilitar el intercambio y medir el valor.",
      },
      {
        id: "opt-3",
        label: "Reemplazar el trabajo",
        isCorrect: false,
        explanation: "El dinero no reemplaza el trabajo; es una herramienta para intercambiar el valor del trabajo y las cosas.",
      },
      {
        id: "opt-4",
        label: "Ser más importante que la educación",
        isCorrect: false,
        explanation: "El dinero es una herramienta. La educación y las decisiones que tomas son lo que le dan sentido.",
      },
    ],
    isAssessment: true,
    recordIncorrect: true,
  },
  {
    id: "l1-1-q2",
    stepType: "mcq",
    question: "Antes del dinero, las personas intercambiaban bienes directamente. ¿Cómo se llama eso?",
    options: [
      {
        id: "opt-1",
        label: "Trueque",
        isCorrect: true,
        explanation: "Correcto. El trueque es el intercambio directo de bienes o servicios sin usar dinero.",
      },
      {
        id: "opt-2",
        label: "Ahorro",
        isCorrect: false,
        explanation: "El ahorro es guardar algo para después; no describe el intercambio directo de bienes.",
      },
      {
        id: "opt-3",
        label: "Inversión",
        isCorrect: false,
        explanation: "Inversión es usar dinero o recursos con la idea de obtener más a futuro; no es intercambio directo.",
      },
      {
        id: "opt-4",
        label: "Préstamo",
        isCorrect: false,
        explanation: "Un préstamo es cuando alguien te da algo (o dinero) y esperas devolverlo después; no es trueque.",
      },
    ],
    isAssessment: true,
    recordIncorrect: true,
  },
  {
    id: "l1-1-summary",
    stepType: "summary",
    title: "¡Bien hecho!",
    body: "Ya conoces un poco la historia y las funciones del dinero. En la siguiente lección verás cómo el dinero gana valor y por qué eso importa en tu día a día.",
    isAssessment: false,
  },
]
