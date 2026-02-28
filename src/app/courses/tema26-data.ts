export interface Tema26Lesson {
  title: string
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
      { title: "¿Qué es el estilo de vida?", slug: "que-es-el-estilo-de-vida" },
      { title: "Relación entre dinero y estilo de vida", slug: "relacion-entre-dinero-y-estilo-de-vida" },
      { title: "Estilo de vida consciente vs automático", slug: "estilo-de-vida-consciente-vs-automatico" },
    ],
  },
  {
    title: "Decisiones de consumo",
    lessons: [
      { title: "Consumir por necesidad", slug: "consumir-por-necesidad" },
      { title: "Consumir por deseo", slug: "consumir-por-deseo" },
      { title: "Estilo de vida y gastos", slug: "estilo-de-vida-y-gastos" },
      { title: "Evitar el sobreconsumo", slug: "evitar-el-sobreconsumo" },
    ],
  },
  {
    title: "Ajustar mi estilo de vida",
    lessons: [
      { title: "Vivir por debajo de mis posibilidades", slug: "vivir-por-debajo-de-mis-posibilidades" },
      { title: "Subir ingresos sin subir gastos", slug: "subir-ingresos-sin-subir-gastos" },
      { title: "Elegir en qué sí gastar", slug: "elegir-en-que-si-gastar" },
    ],
  },
  {
    title: "Estilo de vida y bienestar",
    lessons: [
      { title: "Dinero y tranquilidad mental", slug: "dinero-y-tranquilidad-mental" },
      { title: "Menos estrés financiero", slug: "menos-estres-financiero" },
      { title: "Calidad de vida vs apariencia", slug: "calidad-de-vida-vs-apariencia" },
    ],
  },
  {
    title: "Reflexión y cierre",
    lessons: [
      { title: "Diseñar mi estilo de vida", slug: "disenar-mi-estilo-de-vida" },
      { title: "Checkpoint: Mi estilo de vida financiero", slug: "checkpoint-mi-estilo-de-vida-financiero" },
    ],
  },
]
