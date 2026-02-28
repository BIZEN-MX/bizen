export interface Tema18Lesson {
  title: string
  slug: string
}

export interface Tema18Subtema {
  title: string
  lessons: Tema18Lesson[]
}

export const TEMA18_SUBTEMAS: Tema18Subtema[] = [
  {
    title: "¿Qué es validar?",
    lessons: [
      { title: "¿Qué es validar una idea?", slug: "que-es-validar-una-idea" },
      { title: "¿Por qué validar antes de invertir?", slug: "por-que-validar-antes-de-invertir" },
      { title: "Mitos sobre la validación", slug: "mitos-sobre-la-validacion" },
      { title: "Errores por no validar", slug: "errores-por-no-validar" },
    ],
  },
  {
    title: "Validar el problema",
    lessons: [
      { title: "Confirmar que el problema existe", slug: "confirmar-que-el-problema-existe" },
      { title: "Hablar con personas reales", slug: "hablar-con-personas-reales" },
      { title: "Escuchar sin vender", slug: "escuchar-sin-vender" },
      { title: "Señales de un problema real", slug: "senales-de-un-problema-real" },
    ],
  },
  {
    title: "Validar la solución",
    lessons: [
      { title: "Explicar la solución de forma simple", slug: "explicar-la-solucion-de-forma-simple" },
      { title: "Validar interés sin producto", slug: "validar-interes-sin-producto" },
      { title: "Feedback real vs opiniones", slug: "feedback-real-vs-opiniones" },
      { title: "Ajustar la idea según feedback", slug: "ajustar-la-idea-segun-feedback" },
    ],
  },
  {
    title: "Validar el pago",
    lessons: [
      { title: "Saber si alguien pagaría", slug: "saber-si-alguien-pagaria" },
      { title: "Pruebas de intención de pago", slug: "pruebas-de-intencion-de-pago" },
      { title: "Diferencia entre interés y dinero", slug: "diferencia-entre-interes-y-dinero" },
    ],
  },
  {
    title: "Aprender rápido",
    lessons: [
      { title: "Fallar rápido y barato", slug: "fallar-rapido-y-barato" },
      { title: "Aprender antes de construir", slug: "aprender-antes-de-construir" },
      { title: "Decidir si seguir o cambiar", slug: "decidir-si-seguir-o-cambiar" },
    ],
  },
  {
    title: "Reflexión y cierre",
    lessons: [
      { title: "Validar sin miedo", slug: "validar-sin-miedo" },
      { title: "Prepararme para el modelo de negocio", slug: "prepararme-para-el-modelo-de-negocio" },
      { title: "Checkpoint: Mi idea validada", slug: "checkpoint-mi-idea-validada" },
    ],
  },
]
