import type { LessonStep } from "@/types/lessonTypes"

/** Lesson 1 – Historia del dinero (l1-1) – 16 slides */
export const lesson1Steps: LessonStep[] = [
  // SLIDE 1
  {
    id: "l1-1-intro",
    stepType: "info",
    title: "Historia del dinero",
    description: "Antes de empezar, piensa esto:",
    body: "Usas dinero todos los días\n\nPero no siempre existió\n\nHoy voy a entender cómo empezó todo",
    isAssessment: false,
    fullScreen: true,
  },
  // SLIDE 2 – Objetivo de la lección
  {
    id: "l1-1-objetivo",
    stepType: "info",
    title: "Objetivo de la lección",
    body: "En esta lección voy a aprender\n\nQué es el dinero\nPor qué se creó\nCómo ha cambiado con el tiempo\n\nAl final voy a poder explicar\n\nPor qué el dinero de hoy es diferente al de antes",
    isAssessment: false,
    continueLabel: "Continuar",
    fullScreen: true,
  },
  // SLIDE 3 – Pregunta inicial
  {
    id: "l1-1-pregunta-inicial",
    stepType: "mcq",
    question: "Antes de existir el dinero, ¿cómo crees que las personas conseguían lo que necesitaban?",
    options: [
      { id: "opt-a", label: "Lo compraban con billetes", isCorrect: false, explanation: "Correcto. Antes del dinero existía el trueque." },
      { id: "opt-b", label: "Lo intercambiaban por otras cosas", isCorrect: true, explanation: "Correcto. Antes del dinero existía el trueque." },
      { id: "opt-c", label: "Lo pedían prestado al banco", isCorrect: false, explanation: "Correcto. Antes del dinero existía el trueque." },
    ],
    isAssessment: true,
    recordIncorrect: true,
    continueLabel: "Continuar",
    fullScreen: true,
  },
  // SLIDE 4 – El trueque
  {
    id: "l1-1-trueque",
    stepType: "info",
    title: "El trueque",
    body: "Al inicio no había dinero\nLas personas intercambiaban cosas\nA esto se le llama trueque\n\nYo daba algo que tenía\nY recibía algo que necesitaba\n\nEjemplo\nYo tenía maíz\nOtra persona tenía sal\nHacíamos un intercambio",
    isAssessment: false,
    continueLabel: "Seguir",
    fullScreen: true,
  },
  // SLIDE 5 – Problemas del trueque
  {
    id: "l1-1-problemas-trueque",
    stepType: "info",
    title: "Problemas del trueque",
    body: "El trueque no era perfecto\n\nProblemas\nNo siempre la otra persona quería lo que yo tenía\nEra difícil saber cuánto valía cada cosa\nNo se podía ahorrar para después\n\nEsto hacía lento el comercio",
    isAssessment: false,
    continueLabel: "Continuar",
    fullScreen: true,
  },
  // SLIDE 6 – Pregunta rápida
  {
    id: "l1-1-pregunta-trueque",
    stepType: "mcq",
    question: "¿Cuál era uno de los principales problemas del trueque?",
    options: [
      { id: "opt-a", label: "No había suficientes personas", isCorrect: false, explanation: "Exacto. El intercambio no siempre funcionaba." },
      { id: "opt-b", label: "No siempre coincidían las necesidades", isCorrect: true, explanation: "Exacto. El intercambio no siempre funcionaba." },
      { id: "opt-c", label: "Era ilegal", isCorrect: false, explanation: "Exacto. El intercambio no siempre funcionaba." },
    ],
    isAssessment: true,
    recordIncorrect: true,
    continueLabel: "Continuar",
    fullScreen: true,
  },
  // SLIDE 7 – Dinero mercancía
  {
    id: "l1-1-dinero-mercancia",
    stepType: "info",
    title: "Dinero mercancía",
    body: "Después del trueque\nLas personas empezaron a usar objetos como dinero\n\nEran cosas que todos valoraban\n\nEjemplos\nSal\nGranos\nGanado\nConchas\nMetales\n\nEsto facilitó un poco los intercambios",
    isAssessment: false,
    continueLabel: "Continuar",
    fullScreen: true,
  },
  // SLIDE 8 – Limitaciones del dinero mercancía
  {
    id: "l1-1-limitaciones-mercancia",
    stepType: "info",
    title: "Limitaciones del dinero mercancía",
    body: "Aunque ayudó\nSeguía teniendo problemas\n\nAlgunos objetos eran pesados\nOtros se dañaban\nNo todos eran fáciles de dividir\n\nSe necesitaba algo mejor",
    isAssessment: false,
    continueLabel: "Avanzar",
    fullScreen: true,
  },
  // SLIDE 9 – Las primeras monedas
  {
    id: "l1-1-primeras-monedas",
    stepType: "info",
    title: "Las primeras monedas",
    body: "Aquí aparecen las monedas\nHechas de oro, plata o cobre\n\nVentajas\nEran más fáciles de transportar\nTenían un valor más claro\nDuraban más tiempo\n\nEl gobierno garantizaba su valor\nEso generaba confianza",
    isAssessment: false,
    continueLabel: "Continuar",
    fullScreen: true,
  },
  // SLIDE 10 – Pregunta interactiva monedas
  {
    id: "l1-1-pregunta-monedas",
    stepType: "mcq",
    question: "¿Por qué las monedas fueron un gran avance?",
    options: [
      { id: "opt-a", label: "Porque eran bonitas", isCorrect: false, explanation: "Bien. El valor claro y la durabilidad lo cambiaron todo." },
      { id: "opt-b", label: "Porque duraban y tenían valor definido", isCorrect: true, explanation: "Bien. El valor claro y la durabilidad lo cambiaron todo." },
      { id: "opt-c", label: "Porque solo los ricos las usaban", isCorrect: false, explanation: "Bien. El valor claro y la durabilidad lo cambiaron todo." },
    ],
    isAssessment: true,
    recordIncorrect: true,
    continueLabel: "Continuar",
    fullScreen: true,
  },
  // SLIDE 11 – El dinero en papel
  {
    id: "l1-1-dinero-papel",
    stepType: "info",
    title: "El dinero en papel",
    body: "Más adelante apareció el dinero en papel\n\nEra más ligero\nMás fácil de transportar\nMás práctico\n\nAl inicio no valía por sí solo\nRepresentaba oro o plata\nEra una promesa",
    isAssessment: false,
    continueLabel: "Seguir",
    fullScreen: true,
  },
  // SLIDE 12 – Ejemplo sencillo
  {
    id: "l1-1-ejemplo-papel",
    stepType: "info",
    title: "Ejemplo sencillo",
    body: "Un billete decía\nEste papel equivale a cierta cantidad de oro\n\nEso permitió mover mucho dinero\nSin cargar metales pesados\n\nEl comercio creció más rápido",
    isAssessment: false,
    continueLabel: "Continuar",
    fullScreen: true,
  },
  // SLIDE 13 – El dinero actual
  {
    id: "l1-1-dinero-actual",
    stepType: "info",
    title: "El dinero actual",
    body: "Hoy el dinero ya no depende del oro\nSe llama dinero fiduciario\n\nVale porque confiamos en él\n\nLo uso en\nBilletes\nMonedas\nTarjetas\nTransferencias\nPagos digitales",
    isAssessment: false,
    continueLabel: "Avanzar",
    fullScreen: true,
  },
  // SLIDE 14 – Reflexión
  {
    id: "l1-1-reflexion",
    stepType: "info",
    title: "Reflexión",
    body: "El dinero ha cambiado\nPero su función es la misma\n\nFacilitar intercambios\nAhorrar valor\nMedir precios\n\nLa forma cambia\nLa idea no",
    isAssessment: false,
    continueLabel: "Continuar",
    fullScreen: true,
  },
  // SLIDE 15 – Pregunta final
  {
    id: "l1-1-pregunta-final",
    stepType: "mcq",
    question: "¿Por qué el dinero actual sigue funcionando aunque no esté respaldado por oro?",
    options: [
      { id: "opt-a", label: "Porque todos confiamos en él", isCorrect: true, explanation: "Correcto. La confianza es clave." },
      { id: "opt-b", label: "Porque es de papel especial", isCorrect: false, explanation: "Correcto. La confianza es clave." },
      { id: "opt-c", label: "Porque siempre fue así", isCorrect: false, explanation: "Correcto. La confianza es clave." },
    ],
    isAssessment: true,
    recordIncorrect: true,
    continueLabel: "Continuar",
    fullScreen: true,
  },
  // SLIDE 16 – Cierre de la misión
  {
    id: "l1-1-cierre",
    stepType: "summary",
    title: "Cierre de la misión",
    body: "Hoy entendí\nQue el dinero no siempre existió\nQue fue evolucionando\nQue sigue cambiando hoy\n\nEsto es solo el inicio",
    isAssessment: false,
    continueLabel: "Completar misión",
    fullScreen: true,
  },
]
