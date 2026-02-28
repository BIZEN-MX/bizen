export interface Tema25Lesson {
  title: string
  slug: string
}

export interface Tema25Subtema {
  title: string
  lessons: Tema25Lesson[]
}

export const TEMA25_SUBTEMAS: Tema25Subtema[] = [
  {
    title: "¿Qué es escalar?",
    lessons: [
      { title: "¿Qué significa escalar?", slug: "que-significa-escalar" },
      { title: "Crecer vs escalar", slug: "crecer-vs-escalar" },
      { title: "¿Cuándo es buen momento para escalar?", slug: "cuando-es-buen-momento-para-escalar" },
    ],
  },
  {
    title: "Prepararse para crecer",
    lessons: [
      { title: "Ordenar procesos", slug: "ordenar-procesos" },
      { title: "Medir resultados", slug: "medir-resultados" },
      { title: "Construir bases sólidas", slug: "construir-bases-solidas" },
    ],
  },
  {
    title: "Escalar con control",
    lessons: [
      { title: "Contratar personas", slug: "contratar-personas" },
      { title: "Delegar responsabilidades", slug: "delegar-responsabilidades" },
      { title: "Mantener calidad", slug: "mantener-calidad" },
    ],
  },
  {
    title: "Riesgos al escalar",
    lessons: [
      { title: "Crecer demasiado rápido", slug: "crecer-demasiado-rapido" },
      { title: "Perder control del negocio", slug: "perder-control-del-negocio" },
      { title: "Errores comunes al escalar", slug: "errores-comunes-al-escalar" },
    ],
  },
  {
    title: "Reflexión y cierre",
    lessons: [
      { title: "Pensar a largo plazo", slug: "pensar-a-largo-plazo" },
      { title: "Checkpoint: Mi visión de crecimiento", slug: "checkpoint-mi-vision-de-crecimiento" },
    ],
  },
]
