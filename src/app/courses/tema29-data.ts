export type LessonLevel = "Básico" | "Intermedio" | "Avanzado"

export interface Tema29Lesson {
  title: string
  level: LessonLevel
  slug: string
}

export interface Tema29Subtema {
  title: string
  lessons: Tema29Lesson[]
}

export const TEMA29_SUBTEMAS: Tema29Subtema[] = [
  {
    title: "Dinero y emociones",
    lessons: [
      { title: "Estrés financiero", level: "Básico", slug: "estres-financiero" },
      { title: "Ansiedad por dinero", level: "Intermedio", slug: "ansiedad-por-dinero" },
    ],
  },
  {
    title: "Impacto del dinero en mi vida",
    lessons: [
      { title: "Dinero y salud mental", level: "Intermedio", slug: "dinero-y-salud-mental" },
      { title: "Dinero y relaciones personales", level: "Intermedio", slug: "dinero-y-relaciones-personales" },
    ],
  },
  {
    title: "Manejar el estrés financiero",
    lessons: [
      { title: "Orden financiero y calma", level: "Intermedio", slug: "orden-financiero-y-calma" },
      { title: "Tomar control reduce el estrés", level: "Avanzado", slug: "tomar-control-reduce-el-estres" },
    ],
  },
  {
    title: "Bienestar integral",
    lessons: [
      { title: "Equilibrio entre dinero y vida", level: "Avanzado", slug: "equilibrio-entre-dinero-y-vida" },
      { title: "Priorizar bienestar sobre estatus", level: "Avanzado", slug: "priorizar-bienestar-sobre-estatus" },
    ],
  },
  {
    title: "Reflexión y cierre",
    lessons: [
      { title: "Cuidar mi bienestar financiero", level: "Intermedio", slug: "cuidar-mi-bienestar-financiero" },
      { title: "Checkpoint: Mi relación entre dinero y bienestar", level: "Avanzado", slug: "checkpoint-mi-relacion-entre-dinero-y-bienestar" },
    ],
  },
]
