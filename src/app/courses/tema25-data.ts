export type LessonLevel = "Básico" | "Intermedio" | "Avanzado"

export interface Tema25Lesson {
  title: string
  level: LessonLevel
  slug: string
}

export interface Tema25Subtema {
  title: string
  lessons: Tema25Lesson[]
}

export const TEMA25_SUBTEMAS: Tema25Subtema[] = [
  {
    title: "Qué es escalar",
    lessons: [
      { title: "Qué significa escalar", level: "Básico", slug: "que-significa-escalar" },
      { title: "Crecer vs escalar", level: "Intermedio", slug: "crecer-vs-escalar" },
      { title: "Cuándo es buen momento para escalar", level: "Intermedio", slug: "cuando-es-buen-momento-para-escalar" },
    ],
  },
  {
    title: "Prepararse para crecer",
    lessons: [
      { title: "Ordenar procesos", level: "Intermedio", slug: "ordenar-procesos" },
      { title: "Medir resultados", level: "Intermedio", slug: "medir-resultados" },
      { title: "Construir bases sólidas", level: "Avanzado", slug: "construir-bases-solidas" },
    ],
  },
  {
    title: "Escalar con control",
    lessons: [
      { title: "Contratar personas", level: "Avanzado", slug: "contratar-personas" },
      { title: "Delegar responsabilidades", level: "Avanzado", slug: "delegar-responsabilidades" },
      { title: "Mantener calidad", level: "Avanzado", slug: "mantener-calidad" },
    ],
  },
  {
    title: "Riesgos al escalar",
    lessons: [
      { title: "Crecer demasiado rápido", level: "Avanzado", slug: "crecer-demasiado-rapido" },
      { title: "Perder control del negocio", level: "Avanzado", slug: "perder-control-del-negocio" },
      { title: "Errores comunes al escalar", level: "Avanzado", slug: "errores-comunes-al-escalar" },
    ],
  },
  {
    title: "Reflexión y cierre",
    lessons: [
      { title: "Pensar a largo plazo", level: "Intermedio", slug: "pensar-a-largo-plazo" },
      { title: "Checkpoint: Mi visión de crecimiento", level: "Avanzado", slug: "checkpoint-mi-vision-de-crecimiento" },
    ],
  },
]
