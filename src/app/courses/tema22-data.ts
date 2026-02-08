export type LessonLevel = "Básico" | "Intermedio" | "Avanzado"

export interface Tema22Lesson {
  title: string
  level: LessonLevel
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
      { title: "Qué es el precio", level: "Básico", slug: "que-es-el-precio" },
      { title: "Precio vs valor", level: "Básico", slug: "precio-vs-valor" },
      { title: "Por qué cobrar bien es importante", level: "Intermedio", slug: "por-que-cobrar-bien-es-importante" },
    ],
  },
  {
    title: "Cómo definir precios",
    lessons: [
      { title: "Costear correctamente", level: "Intermedio", slug: "costear-correctamente" },
      { title: "Precio basado en costos", level: "Intermedio", slug: "precio-basado-en-costos" },
      { title: "Precio basado en mercado", level: "Intermedio", slug: "precio-basado-en-mercado" },
    ],
  },
  {
    title: "Psicología del precio",
    lessons: [
      { title: "Precio psicológico", level: "Intermedio", slug: "precio-psicologico" },
      { title: "Miedo a cobrar", level: "Intermedio", slug: "miedo-a-cobrar" },
      { title: "Subir precios", level: "Avanzado", slug: "subir-precios" },
    ],
  },
  {
    title: "Ajustar precios",
    lessons: [
      { title: "Cuándo subir precios", level: "Avanzado", slug: "cuando-subir-precios" },
      { title: "Cuándo bajar precios", level: "Avanzado", slug: "cuando-bajar-precios" },
      { title: "Errores comunes al poner precios", level: "Avanzado", slug: "errores-comunes-al-poner-precios" },
    ],
  },
  {
    title: "Reflexión y cierre",
    lessons: [
      { title: "Cobrar con seguridad", level: "Intermedio", slug: "cobrar-con-seguridad" },
      { title: "Checkpoint: Mis precios y valor", level: "Avanzado", slug: "checkpoint-mis-precios-y-valor" },
    ],
  },
]
