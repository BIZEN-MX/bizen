export interface Tema14Lesson {
  title: string
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
      { title: "¿Qué es un error financiero?", slug: "que-es-un-error-financiero" },
      { title: "¿Por qué todos cometemos errores?", slug: "por-que-todos-cometemos-errores" },
      { title: "Aprender del error", slug: "aprender-del-error" },
      { title: "Evitar culparse en exceso", slug: "evitar-culparse-en-exceso" },
    ],
  },
  {
    title: "Errores con el dinero personal",
    lessons: [
      { title: "Gastar más de lo que gano", slug: "gastar-mas-de-lo-que-gano" },
      { title: "No llevar control del dinero", slug: "no-llevar-control-del-dinero" },
      { title: "No ahorrar", slug: "no-ahorrar" },
      { title: "Vivir al día", slug: "vivir-al-dia" },
      { title: "Normalizar el desorden financiero", slug: "normalizar-el-desorden-financiero" },
    ],
  },
  {
    title: "Errores con deuda e inversión",
    lessons: [
      { title: "Usar mal la deuda", slug: "usar-mal-la-deuda" },
      { title: "Endeudarse sin plan", slug: "endeudarse-sin-plan" },
      { title: "Invertir sin entender", slug: "invertir-sin-entender" },
      { title: "Seguir consejos sin criterio", slug: "seguir-consejos-sin-criterio" },
      { title: "Buscar ganancias rápidas", slug: "buscar-ganancias-rapidas" },
    ],
  },
  {
    title: "Errores de mentalidad",
    lessons: [
      { title: "Pensar solo en el corto plazo", slug: "pensar-solo-en-el-corto-plazo" },
      { title: "Creer que \"nunca es suficiente\"", slug: "creer-que-nunca-es-suficiente" },
      { title: "Compararse constantemente", slug: "compararse-constantemente" },
      { title: "Miedo a empezar", slug: "miedo-a-empezar" },
    ],
  },
  {
    title: "Corregir errores",
    lessons: [
      { title: "Reconocer mis errores financieros", slug: "reconocer-mis-errores-financieros" },
      { title: "Corregir sin empezar de cero", slug: "corregir-sin-empezar-de-cero" },
      { title: "Ajustar mi camino financiero", slug: "ajustar-mi-camino-financiero" },
    ],
  },
  {
    title: "Reflexión y cierre",
    lessons: [
      { title: "El error como parte del aprendizaje", slug: "el-error-como-parte-del-aprendizaje" },
      { title: "Prepararme para decidir mejor", slug: "prepararme-para-decidir-mejor" },
      { title: "Checkpoint: Mis errores financieros", slug: "checkpoint-mis-errores-financieros" },
    ],
  },
]
