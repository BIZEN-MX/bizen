export type LessonLevel = "Básico" | "Intermedio" | "Avanzado"

export interface Tema14Lesson {
  title: string
  level: LessonLevel
  slug: string
}

export interface Tema14Subtema {
  title: string
  lessons: Tema14Lesson[]
}

export const TEMA14_SUBTEMAS: Tema14Subtema[] = [
  {
    title: "Entender los errores",
    lessons: [
      { title: "Qué es un error financiero", level: "Básico", slug: "que-es-un-error-financiero" },
      { title: "Por qué todos cometemos errores", level: "Básico", slug: "por-que-todos-cometemos-errores" },
      { title: "Aprender del error", level: "Intermedio", slug: "aprender-del-error" },
      { title: "Evitar culparse en exceso", level: "Intermedio", slug: "evitar-culparse-en-exceso" },
    ],
  },
  {
    title: "Errores con el dinero personal",
    lessons: [
      { title: "Gastar más de lo que gano", level: "Básico", slug: "gastar-mas-de-lo-que-gano" },
      { title: "No llevar control del dinero", level: "Básico", slug: "no-llevar-control-del-dinero" },
      { title: "No ahorrar", level: "Básico", slug: "no-ahorrar" },
      { title: "Vivir al día", level: "Intermedio", slug: "vivir-al-dia" },
      { title: "Normalizar el desorden financiero", level: "Intermedio", slug: "normalizar-el-desorden-financiero" },
    ],
  },
  {
    title: "Errores con deuda e inversión",
    lessons: [
      { title: "Usar mal la deuda", level: "Intermedio", slug: "usar-mal-la-deuda" },
      { title: "Endeudarse sin plan", level: "Intermedio", slug: "endeudarse-sin-plan" },
      { title: "Invertir sin entender", level: "Intermedio", slug: "invertir-sin-entender" },
      { title: "Seguir consejos sin criterio", level: "Avanzado", slug: "seguir-consejos-sin-criterio" },
      { title: "Buscar ganancias rápidas", level: "Avanzado", slug: "buscar-ganancias-rapidas" },
    ],
  },
  {
    title: "Errores de mentalidad",
    lessons: [
      { title: "Pensar solo en el corto plazo", level: "Intermedio", slug: "pensar-solo-en-el-corto-plazo" },
      { title: "Creer que \"nunca es suficiente\"", level: "Intermedio", slug: "creer-que-nunca-es-suficiente" },
      { title: "Compararse constantemente", level: "Intermedio", slug: "compararse-constantemente" },
      { title: "Miedo a empezar", level: "Avanzado", slug: "miedo-a-empezar" },
    ],
  },
  {
    title: "Corregir errores",
    lessons: [
      { title: "Reconocer mis errores financieros", level: "Intermedio", slug: "reconocer-mis-errores-financieros" },
      { title: "Corregir sin empezar de cero", level: "Avanzado", slug: "corregir-sin-empezar-de-cero" },
      { title: "Ajustar mi camino financiero", level: "Avanzado", slug: "ajustar-mi-camino-financiero" },
    ],
  },
  {
    title: "Reflexión y cierre",
    lessons: [
      { title: "El error como parte del aprendizaje", level: "Intermedio", slug: "el-error-como-parte-del-aprendizaje" },
      { title: "Prepararme para decidir mejor", level: "Intermedio", slug: "prepararme-para-decidir-mejor" },
      { title: "Checkpoint: Mis errores financieros", level: "Avanzado", slug: "checkpoint-mis-errores-financieros" },
    ],
  },
]
