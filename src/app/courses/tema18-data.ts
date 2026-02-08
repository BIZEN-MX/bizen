export type LessonLevel = "Básico" | "Intermedio" | "Avanzado"

export interface Tema18Lesson {
  title: string
  level: LessonLevel
  slug: string
}

export interface Tema18Subtema {
  title: string
  lessons: Tema18Lesson[]
}

export const TEMA18_SUBTEMAS: Tema18Subtema[] = [
  {
    title: "Qué es validar",
    lessons: [
      { title: "Qué es validar una idea", level: "Básico", slug: "que-es-validar-una-idea" },
      { title: "Por qué validar antes de invertir", level: "Básico", slug: "por-que-validar-antes-de-invertir" },
      { title: "Mitos sobre la validación", level: "Básico", slug: "mitos-sobre-la-validacion" },
      { title: "Errores por no validar", level: "Intermedio", slug: "errores-por-no-validar" },
    ],
  },
  {
    title: "Validar el problema",
    lessons: [
      { title: "Confirmar que el problema existe", level: "Intermedio", slug: "confirmar-que-el-problema-existe" },
      { title: "Hablar con personas reales", level: "Intermedio", slug: "hablar-con-personas-reales" },
      { title: "Escuchar sin vender", level: "Intermedio", slug: "escuchar-sin-vender" },
      { title: "Señales de un problema real", level: "Avanzado", slug: "senales-de-un-problema-real" },
    ],
  },
  {
    title: "Validar la solución",
    lessons: [
      { title: "Explicar la solución de forma simple", level: "Intermedio", slug: "explicar-la-solucion-de-forma-simple" },
      { title: "Validar interés sin producto", level: "Intermedio", slug: "validar-interes-sin-producto" },
      { title: "Feedback real vs opiniones", level: "Intermedio", slug: "feedback-real-vs-opiniones" },
      { title: "Ajustar la idea según feedback", level: "Avanzado", slug: "ajustar-la-idea-segun-feedback" },
    ],
  },
  {
    title: "Validar el pago",
    lessons: [
      { title: "Saber si alguien pagaría", level: "Intermedio", slug: "saber-si-alguien-pagaria" },
      { title: "Pruebas de intención de pago", level: "Avanzado", slug: "pruebas-de-intencion-de-pago" },
      { title: "Diferencia entre interés y dinero", level: "Avanzado", slug: "diferencia-entre-interes-y-dinero" },
    ],
  },
  {
    title: "Aprender rápido",
    lessons: [
      { title: "Fallar rápido y barato", level: "Intermedio", slug: "fallar-rapido-y-barato" },
      { title: "Aprender antes de construir", level: "Avanzado", slug: "aprender-antes-de-construir" },
      { title: "Decidir si seguir o cambiar", level: "Avanzado", slug: "decidir-si-seguir-o-cambiar" },
    ],
  },
  {
    title: "Reflexión y cierre",
    lessons: [
      { title: "Validar sin miedo", level: "Intermedio", slug: "validar-sin-miedo" },
      { title: "Prepararme para el modelo de negocio", level: "Intermedio", slug: "prepararme-para-el-modelo-de-negocio" },
      { title: "Checkpoint: Mi idea validada", level: "Avanzado", slug: "checkpoint-mi-idea-validada" },
    ],
  },
]
