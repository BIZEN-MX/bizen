export type QuizOption = {
  value: "A" | "B" | "C" | "D"
  text: string
}

export type QuizQuestion = {
  id: string
  label: string
  question: string
  options: QuizOption[]
  answer: QuizOption["value"]
}

export const diagnosticQuiz: QuizQuestion[] = [
  {
    id: "diag-1",
    label: "Educación",
    question: "¿Quién te enseñó sobre el dinero?",
    options: [
      { value: "A", text: "Mi familia — me lo enseñaron en casa desde chico" },
      { value: "B", text: "La escuela — lo aprendí en clases o talleres" },
      { value: "C", text: "Internet o redes sociales — lo fui buscando yo solo" },
      { value: "D", text: "Nadie — el dinero es un tema que nadie me explicó" },
    ],
    answer: "A",
  },
  {
    id: "diag-2",
    label: "Ahorro",
    question: "¿A qué edad empezaste a ahorrar?",
    options: [
      { value: "A", text: "Antes de los 8 años — tenía alcancía o guardadito" },
      { value: "B", text: "Entre 9 y 14 años — en la primaria o secundaria" },
      { value: "C", text: "Entre 15 y 18 años — en la prepa o al salir" },
      { value: "D", text: "Todavía no he empezado a ahorrar de verdad" },
    ],
    answer: "A",
  },
  {
    id: "diag-3",
    label: "Mentalidad",
    question: "¿Qué sientes cuando te hablan de dinero?",
    options: [
      { value: "A", text: "Angustia — el dinero siempre me genera estrés" },
      { value: "B", text: "Aburrimiento — no es un tema que me llame la atención" },
      { value: "C", text: "Curiosidad — quiero entender cómo funciona de verdad" },
      { value: "D", text: "Motivación — me emociona y quiero saber más" },
    ],
    answer: "A",
  },
  {
    id: "diag-4",
    label: "Objetivos",
    question: "¿Para qué quieres aprender a manejar tu dinero?",
    options: [
      { value: "A", text: "Para tener seguridad — que nunca me falte nada" },
      { value: "B", text: "Para lograr algo grande — casa, negocio o libertad" },
      { value: "C", text: "Para salir de deudas y dejar de vivir al límite" },
      { value: "D", text: "Para entender algo que nadie me enseñó bien" },
    ],
    answer: "A",
  },
  {
    id: "diag-5",
    label: "Deuda",
    question: "¿Te has endeudado alguna vez?",
    options: [
      { value: "A", text: "No — nunca he tenido deudas de ningún tipo" },
      { value: "B", text: "Solo deudas pequeñas con amigos o familia" },
      { value: "C", text: "Sí — tarjeta, abonos o algún crédito formal" },
      { value: "D", text: "Sí, y todavía las estoy pagando ahorita" },
    ],
    answer: "A",
  },
  {
    id: "diag-6",
    label: "Entorno",
    question: "¿En tu casa se habla del dinero?",
    options: [
      { value: "A", text: "Sí — lo hablamos con naturalidad y sin drama" },
      { value: "B", text: "Solo cuando hay problemas o hay pleito" },
      { value: "C", text: "No — es tema prohibido o muy incómodo" },
      { value: "D", text: "Los adultos lo manejan solos, yo no me entero" },
    ],
    answer: "A",
  },
  {
    id: "diag-7",
    label: "Crédito",
    question: "¿Tienes tarjeta de crédito?",
    options: [
      { value: "A", text: "No tengo y tampoco quiero tener una" },
      { value: "B", text: "No tengo, pero me gustaría saber cómo usarla bien" },
      { value: "C", text: "Sí tengo, pero me cuesta trabajo controlarla" },
      { value: "D", text: "Sí tengo y la manejo sin problema — la pago completa cada mes" },
    ],
    answer: "A",
  },
  {
    id: "diag-8",
    label: "Aprendizaje",
    question: "¿Cómo prefieres aprender sobre el dinero?",
    options: [
      { value: "A", text: "Videos cortos — veo, entiendo y sigo" },
      { value: "B", text: "Jugando — aprendo practicando y compitiendo" },
      { value: "C", text: "Leyendo — prefiero leer con calma y tomar notas" },
      { value: "D", text: "Con alguien — que me explique y pueda preguntar" },
    ],
    answer: "A",
  },
  {
    id: "diag-9",
    label: "Gastos",
    question: "¿En qué has gastado dinero y te arrepentiste?",
    options: [
      { value: "A", text: "Ropa, tenis o cosas de moda que casi no usé" },
      { value: "B", text: "Apps, suscripciones o juegos que olvidé cancelar" },
      { value: "C", text: "Comida rápida o antojos que no necesitaba" },
      { value: "D", text: "Regalos o salidas para quedar bien con alguien" },
    ],
    answer: "A",
  },
  {
    id: "diag-10",
    label: "Gestión",
    question: "¿Qué haces cuando recibes dinero?",
    options: [
      { value: "A", text: "Lo gasto — me recompenso primero que nada" },
      { value: "B", text: "Pago lo que debo — deudas y compromisos primero" },
      { value: "C", text: "Lo guardo — primero ahorro y lo que sobra lo gasto" },
      { value: "D", text: "Pienso cómo hacer que ese dinero crezca" },
    ],
    answer: "A",
  },
]

