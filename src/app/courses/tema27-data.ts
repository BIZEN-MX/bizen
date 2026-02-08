export type LessonLevel = "Básico" | "Intermedio" | "Avanzado"

export interface Tema27Lesson {
  title: string
  level: LessonLevel
  slug: string
}

export interface Tema27Subtema {
  title: string
  lessons: Tema27Lesson[]
}

export const TEMA27_SUBTEMAS: Tema27Subtema[] = [
  {
    title: "Decisiones que marcan",
    lessons: [
      { title: "Decisiones financieras importantes", level: "Básico", slug: "decisiones-financieras-importantes" },
      { title: "Pensar antes de decidir", level: "Intermedio", slug: "pensar-antes-de-decidir" },
    ],
  },
  {
    title: "Estudios y carrera",
    lessons: [
      { title: "Decidir qué estudiar", level: "Intermedio", slug: "decidir-que-estudiar" },
      { title: "Educación y retorno financiero", level: "Intermedio", slug: "educacion-y-retorno-financiero" },
    ],
  },
  {
    title: "Trabajo y cambios",
    lessons: [
      { title: "Cambiar de trabajo", level: "Intermedio", slug: "cambiar-de-trabajo" },
      { title: "Emprender o no emprender", level: "Avanzado", slug: "emprender-o-no-emprender" },
    ],
  },
  {
    title: "Vida personal",
    lessons: [
      { title: "Mudarse", level: "Intermedio", slug: "mudarse" },
      { title: "Independizarse", level: "Intermedio", slug: "independizarse" },
      { title: "Decisiones de pareja", level: "Avanzado", slug: "decisiones-de-pareja" },
    ],
  },
  {
    title: "Reflexión y cierre",
    lessons: [
      { title: "Decidir con visión de largo plazo", level: "Intermedio", slug: "decidir-con-vision-de-largo-plazo" },
      { title: "Checkpoint: Mis decisiones importantes", level: "Avanzado", slug: "checkpoint-mis-decisiones-importantes" },
    ],
  },
]
