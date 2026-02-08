import type { LessonStep } from "@/types/lessonTypes"

/** Lesson 2 – ¿Cómo gana valor el dinero? (l1-2) – 16 slides, same format/layout as Lesson 1 */
export const lesson2Steps: LessonStep[] = [
  // SLIDE 1
  {
    id: "l1-2-intro",
    stepType: "info",
    title: "¿Cómo gana valor el dinero?",
    description: "Lesson 2",
    body: "Todos usamos dinero\n\nPero pocas veces pensamos\npor qué vale lo que vale\n\nHoy voy a entender eso",
    isAssessment: false,
    continueLabel: "Iniciar misión",
    fullScreen: true,
  },
  // SLIDE 2 – Objetivo de la lección
  {
    id: "l1-2-objetivo",
    stepType: "info",
    title: "Objetivo de la lección",
    body: "En esta lección voy a aprender\nPor qué el dinero tiene valor\nQué hace que valga más o menos\nPor qué a veces alcanza\ny a veces no\n\nAl final voy a poder explicarlo\ncon mis propias palabras",
    isAssessment: false,
    continueLabel: "Continuar",
    fullScreen: true,
  },
  // SLIDE 3 – Pregunta inicial
  {
    id: "l1-2-pregunta-inicial",
    stepType: "mcq",
    question: "Si tengo un billete en la mano ¿por qué crees que vale algo?",
    options: [
      { id: "opt-a", label: "Porque está hecho de papel especial", isCorrect: false, explanation: "Correcto. El valor empieza con la confianza." },
      { id: "opt-b", label: "Porque todos confiamos en él", isCorrect: true, explanation: "Correcto. El valor empieza con la confianza." },
      { id: "opt-c", label: "Porque es antiguo", isCorrect: false, explanation: "Correcto. El valor empieza con la confianza." },
    ],
    isAssessment: true,
    recordIncorrect: true,
    continueLabel: "Continuar",
    fullScreen: true,
  },
  // SLIDE 4 – La confianza
  {
    id: "l1-2-confianza",
    stepType: "info",
    title: "La confianza",
    body: "El dinero gana valor\nporque confiamos en él\n\nConfiamos en que\nOtras personas lo van a aceptar\nPodré usarlo después\nNo perderá su valor de un día a otro\n\nSin confianza\nel dinero no sirve",
    isAssessment: false,
    continueLabel: "Seguir",
    fullScreen: true,
  },
  // SLIDE 5 – Ejemplo sencillo
  {
    id: "l1-2-ejemplo",
    stepType: "info",
    title: "Ejemplo sencillo",
    body: "Si mañana nadie acepta pesos\nLos billetes serían solo papel\n\nEl dinero funciona\nporque todos creemos en él\nal mismo tiempo\n\nEso lo hace poderoso",
    isAssessment: false,
    continueLabel: "Continuar",
    fullScreen: true,
  },
  // SLIDE 6 – ¿Quién respalda el dinero?
  {
    id: "l1-2-respaldo",
    stepType: "info",
    title: "¿Quién respalda el dinero?",
    body: "El dinero está respaldado por\nEl gobierno\nLas instituciones\nLa economía del país\n\nCuando un país es estable\nSu dinero suele ser más fuerte\n\nCuando hay problemas\nEl dinero pierde valor",
    isAssessment: false,
    continueLabel: "Avanzar",
    fullScreen: true,
  },
  // SLIDE 7 – Pregunta rápida
  {
    id: "l1-2-pregunta-confianza",
    stepType: "mcq",
    question: "¿Qué pasa con el dinero si la gente deja de confiar en el gobierno?",
    options: [
      { id: "opt-a", label: "Gana más valor", isCorrect: false, explanation: "Exacto. Sin confianza el valor cae." },
      { id: "opt-b", label: "Se vuelve más caro", isCorrect: false, explanation: "Exacto. Sin confianza el valor cae." },
      { id: "opt-c", label: "Pierde valor", isCorrect: true, explanation: "Exacto. Sin confianza el valor cae." },
    ],
    isAssessment: true,
    recordIncorrect: true,
    continueLabel: "Continuar",
    fullScreen: true,
  },
  // SLIDE 8 – Oferta y demanda
  {
    id: "l1-2-oferta-demanda",
    stepType: "info",
    title: "Oferta y demanda",
    body: "El dinero también gana valor\npor oferta y demanda\n\nSi hay poco dinero\nsuele valer más\n\nSi hay demasiado dinero\nsuele valer menos\n\nEsto aplica igual que con productos",
    isAssessment: false,
    continueLabel: "Continuar",
    fullScreen: true,
  },
  // SLIDE 9 – Ejemplo
  {
    id: "l1-2-ejemplo-boletos",
    stepType: "info",
    title: "Ejemplo",
    body: "Si en una escuela\nsolo hay 5 boletos para un evento\ny todos los quieren\n\nEl valor sube\n\nSi hay boletos para todos\nel valor baja\n\nCon el dinero pasa lo mismo",
    isAssessment: false,
    continueLabel: "Seguir",
    fullScreen: true,
  },
  // SLIDE 10 – Inflación
  {
    id: "l1-2-inflacion",
    stepType: "info",
    title: "Inflación",
    body: "La inflación pasa\ncuando el dinero pierde valor\n\nCon el mismo dinero\npuedo comprar menos cosas\n\nEjemplo\nAntes con $100 compraba más\nHoy compro menos\n\nEso es inflación",
    isAssessment: false,
    continueLabel: "Continuar",
    fullScreen: true,
  },
  // SLIDE 11 – Pregunta interactiva
  {
    id: "l1-2-pregunta-inflacion",
    stepType: "mcq",
    question: "¿Qué significa inflación?",
    options: [
      { id: "opt-a", label: "Que el dinero rinde más", isCorrect: false, explanation: "Bien. La inflación reduce lo que puedo comprar." },
      { id: "opt-b", label: "Que los precios bajan", isCorrect: false, explanation: "Bien. La inflación reduce lo que puedo comprar." },
      { id: "opt-c", label: "Que el dinero pierde poder de compra", isCorrect: true, explanation: "Bien. La inflación reduce lo que puedo comprar." },
    ],
    isAssessment: true,
    recordIncorrect: true,
    continueLabel: "Continuar",
    fullScreen: true,
  },
  // SLIDE 12 – Producción y economía
  {
    id: "l1-2-produccion",
    stepType: "info",
    title: "Producción y economía",
    body: "El dinero gana valor\ncuando un país produce\n\nMás productos\nMás servicios\nMás empleo\n\nUna economía fuerte\nsuele tener una moneda más fuerte",
    isAssessment: false,
    continueLabel: "Avanzar",
    fullScreen: true,
  },
  // SLIDE 13 – Comparación
  {
    id: "l1-2-comparacion",
    stepType: "info",
    title: "Comparación",
    body: "País que produce poco\nDinero débil\n\nPaís que produce mucho\nDinero más fuerte\n\nNo es magia\nEs economía real",
    isAssessment: false,
    continueLabel: "Continuar",
    fullScreen: true,
  },
  // SLIDE 14 – Resumen clave
  {
    id: "l1-2-resumen",
    stepType: "info",
    title: "Resumen clave",
    body: "El dinero gana valor por\nConfianza\nRespaldo del gobierno\nOferta y demanda\nProducción económica\n\nCuando estos factores fallan\nel dinero pierde valor",
    isAssessment: false,
    continueLabel: "Seguir",
    fullScreen: true,
  },
  // SLIDE 15 – Pregunta final
  {
    id: "l1-2-pregunta-final",
    stepType: "mcq",
    question: "¿Cuál es el factor más importante para que el dinero tenga valor?",
    options: [
      { id: "opt-a", label: "El material del billete", isCorrect: false, explanation: "Correcto. Sin confianza no hay dinero." },
      { id: "opt-b", label: "La confianza de las personas", isCorrect: true, explanation: "Correcto. Sin confianza no hay dinero." },
      { id: "opt-c", label: "El color del dinero", isCorrect: false, explanation: "Correcto. Sin confianza no hay dinero." },
    ],
    isAssessment: true,
    recordIncorrect: true,
    continueLabel: "Continuar",
    fullScreen: true,
  },
  // SLIDE 16 – Cierre de la misión
  {
    id: "l1-2-cierre",
    stepType: "summary",
    title: "Cierre de la misión",
    body: "Ahora entiendo\nQue el dinero no vale por sí solo\nVale porque confiamos en él\n\nY ese valor\npuede subir\no bajar\n\nPróxima lección\n¿Para qué sirve el dinero en la vida diaria?",
    isAssessment: false,
    continueLabel: "Completar misión",
    fullScreen: true,
  },
]
