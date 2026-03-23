export interface Tema9Lesson {
  title: string
  slug: string
  level: "Básico" | "Intermedio" | "Avanzado"
}

export interface Tema9Subtema {
  title: string
  lessons: Tema9Lesson[]
}

export const TEMA9_TITLE = "Metas financieras"

export const TEMA9_SUBTEMAS: Tema9Subtema[] = [
  {
    title: "Metas claras",
    lessons: [
      { title: "Meta específica y medible", slug: "meta-especifica-y-medible", level: "Básico" },
      { title: "Tiempo y monto diario/semanal", slug: "tiempo-y-monto-diariosemanal", level: "Básico" },
      { title: "Meta realista vs fantasía", slug: "meta-realista-vs-fantasia", level: "Intermedio" },
      { title: "Romper una meta en pasos", slug: "romper-una-meta-en-pasos", level: "Intermedio" },
      { title: "Caso: meta 7 días / 30 días", slug: "caso-meta-7-dias-30-dias", level: "Avanzado" },
    ]
  },
  {
    title: "Prioridades",
    lessons: [
      { title: "Elegir metas sin saturarme", slug: "elegir-metas-sin-saturarme", level: "Básico" },
      { title: "Meta vs antojos (decisión)", slug: "meta-vs-antojos-decision", level: "Básico" },
      { title: "1 meta principal + 1 secundaria", slug: "1-meta-principal-1-secundaria", level: "Intermedio" },
      { title: "Cambiar prioridades sin abandonar", slug: "cambiar-prioridades-sin-abandonar", level: "Intermedio" },
      { title: "Caso: dos metas en conflicto", slug: "caso-dos-metas-en-conflicto", level: "Avanzado" },
    ]
  },
  {
    title: "Seguimiento",
    lessons: [
      { title: "Medir avance simple", slug: "medir-avance-simple", level: "Básico" },
      { title: "Ajustar si voy atrasado", slug: "ajustar-si-voy-atrasado", level: "Básico" },
      { title: "Evitar abandonar a mitad", slug: "evitar-abandonar-a-mitad", level: "Intermedio" },
      { title: "Recompensas sanas por avance", slug: "recompensas-sanas-por-avance", level: "Intermedio" },
      { title: "Cierre de meta y siguiente meta", slug: "cierre-de-meta-y-siguiente-meta", level: "Avanzado" },
    ]
  },
]
