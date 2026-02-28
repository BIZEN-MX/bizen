export interface Tema22Lesson {
  title: string
  slug: string
}

export interface Tema22Subtema {
  title: string
  lessons: Tema22Lesson[]
}

export const TEMA22_SUBTEMAS: Tema22Subtema[] = [
  {
    title: "Entender el precio",
    lessons: [
      { title: "¿Qué es el precio?", slug: "que-es-el-precio" },
      { title: "Precio vs valor", slug: "precio-vs-valor" },
      { title: "¿Por qué cobrar bien es importante?", slug: "por-que-cobrar-bien-es-importante" },
    ],
  },
  {
    title: "¿Cómo definir precios?",
    lessons: [
      { title: "Costear correctamente", slug: "costear-correctamente" },
      { title: "Precio basado en costos", slug: "precio-basado-en-costos" },
      { title: "Precio basado en mercado", slug: "precio-basado-en-mercado" },
    ],
  },
  {
    title: "Psicología del precio",
    lessons: [
      { title: "Precio psicológico", slug: "precio-psicologico" },
      { title: "Miedo a cobrar", slug: "miedo-a-cobrar" },
      { title: "Subir precios", slug: "subir-precios" },
    ],
  },
  {
    title: "Ajustar precios",
    lessons: [
      { title: "¿Cuándo subir precios?", slug: "cuando-subir-precios" },
      { title: "¿Cuándo bajar precios?", slug: "cuando-bajar-precios" },
      { title: "Errores comunes al poner precios", slug: "errores-comunes-al-poner-precios" },
    ],
  },
  {
    title: "Reflexión y cierre",
    lessons: [
      { title: "Cobrar con seguridad", slug: "cobrar-con-seguridad" },
      { title: "Checkpoint: Mis precios y valor", slug: "checkpoint-mis-precios-y-valor" },
    ],
  },
]
