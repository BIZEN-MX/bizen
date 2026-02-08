export type LessonLevel = "Básico" | "Intermedio" | "Avanzado"

export interface Tema26Lesson {
  title: string
  level: LessonLevel
  slug: string
}

export interface Tema26Subtema {
  title: string
  lessons: Tema26Lesson[]
}

export const TEMA26_SUBTEMAS: Tema26Subtema[] = [
  {
    title: "Dinero y forma de vivir",
    lessons: [
      { title: "Qué es el estilo de vida", level: "Básico", slug: "que-es-el-estilo-de-vida" },
      { title: "Relación entre dinero y estilo de vida", level: "Básico", slug: "relacion-entre-dinero-y-estilo-de-vida" },
      { title: "Estilo de vida consciente vs automático", level: "Intermedio", slug: "estilo-de-vida-consciente-vs-automatico" },
    ],
  },
  {
    title: "Decisiones de consumo",
    lessons: [
      { title: "Consumir por necesidad", level: "Básico", slug: "consumir-por-necesidad" },
      { title: "Consumir por deseo", level: "Básico", slug: "consumir-por-deseo" },
      { title: "Estilo de vida y gastos", level: "Intermedio", slug: "estilo-de-vida-y-gastos" },
      { title: "Evitar el sobreconsumo", level: "Intermedio", slug: "evitar-el-sobreconsumo" },
    ],
  },
  {
    title: "Ajustar mi estilo de vida",
    lessons: [
      { title: "Vivir por debajo de mis posibilidades", level: "Intermedio", slug: "vivir-por-debajo-de-mis-posibilidades" },
      { title: "Subir ingresos sin subir gastos", level: "Intermedio", slug: "subir-ingresos-sin-subir-gastos" },
      { title: "Elegir en qué sí gastar", level: "Avanzado", slug: "elegir-en-que-si-gastar" },
    ],
  },
  {
    title: "Estilo de vida y bienestar",
    lessons: [
      { title: "Dinero y tranquilidad mental", level: "Intermedio", slug: "dinero-y-tranquilidad-mental" },
      { title: "Menos estrés financiero", level: "Intermedio", slug: "menos-estres-financiero" },
      { title: "Calidad de vida vs apariencia", level: "Avanzado", slug: "calidad-de-vida-vs-apariencia" },
    ],
  },
  {
    title: "Reflexión y cierre",
    lessons: [
      { title: "Diseñar mi estilo de vida", level: "Intermedio", slug: "disenar-mi-estilo-de-vida" },
      { title: "Checkpoint: Mi estilo de vida financiero", level: "Avanzado", slug: "checkpoint-mi-estilo-de-vida-financiero" },
    ],
  },
]
