export interface Tema27Lesson {
  title: string
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
      { title: "Decisiones financieras importantes", slug: "decisiones-financieras-importantes" },
      { title: "Pensar antes de decidir", slug: "pensar-antes-de-decidir" },
    ],
  },
  {
    title: "Estudios y carrera",
    lessons: [
      { title: "Decidir qué estudiar", slug: "decidir-que-estudiar" },
      { title: "Educación y retorno financiero", slug: "educacion-y-retorno-financiero" },
    ],
  },
  {
    title: "Trabajo y cambios",
    lessons: [
      { title: "Cambiar de trabajo", slug: "cambiar-de-trabajo" },
      { title: "Emprender o no emprender", slug: "emprender-o-no-emprender" },
    ],
  },
  {
    title: "Vida personal",
    lessons: [
      { title: "Mudarse", slug: "mudarse" },
      { title: "Independizarse", slug: "independizarse" },
      { title: "Decisiones de pareja", slug: "decisiones-de-pareja" },
    ],
  },
  {
    title: "Reflexión y cierre",
    lessons: [
      { title: "Decidir con visión de largo plazo", slug: "decidir-con-vision-de-largo-plazo" },
      { title: "Checkpoint: Mis decisiones importantes", slug: "checkpoint-mis-decisiones-importantes" },
    ],
  },
]
