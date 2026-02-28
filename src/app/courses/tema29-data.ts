export interface Tema29Lesson {
  title: string
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
      { title: "Estrés financiero", slug: "estres-financiero" },
      { title: "Ansiedad por dinero", slug: "ansiedad-por-dinero" },
    ],
  },
  {
    title: "Impacto del dinero en mi vida",
    lessons: [
      { title: "Dinero y salud mental", slug: "dinero-y-salud-mental" },
      { title: "Dinero y relaciones personales", slug: "dinero-y-relaciones-personales" },
    ],
  },
  {
    title: "Manejar el estrés financiero",
    lessons: [
      { title: "Orden financiero y calma", slug: "orden-financiero-y-calma" },
      { title: "Tomar control reduce el estrés", slug: "tomar-control-reduce-el-estres" },
    ],
  },
  {
    title: "Bienestar integral",
    lessons: [
      { title: "Equilibrio entre dinero y vida", slug: "equilibrio-entre-dinero-y-vida" },
      { title: "Priorizar bienestar sobre estatus", slug: "priorizar-bienestar-sobre-estatus" },
    ],
  },
  {
    title: "Reflexión y cierre",
    lessons: [
      { title: "Cuidar mi bienestar financiero", slug: "cuidar-mi-bienestar-financiero" },
      { title: "Checkpoint: Mi relación entre dinero y bienestar", slug: "checkpoint-mi-relacion-entre-dinero-y-bienestar" },
    ],
  },
]
