export interface Tema26Lesson {
  title: string
  slug: string
  level: "Básico" | "Intermedio" | "Avanzado"
}

export interface Tema26Subtema {
  title: string
  lessons: Tema26Lesson[]
}

export const TEMA26_TITLE = "Diversificación"

export const TEMA26_SUBTEMAS: Tema26Subtema[] = [
  {
    title: "Concepto",
    lessons: [
      { title: "¿Qué es diversificar y por qué funciona?", slug: "que-es-diversificar-y-por-que-funciona", level: "Básico" },
      { title: "No poner todo en uno (casos reales)", slug: "no-poner-todo-en-uno-casos-reales", level: "Básico" },
      { title: "Diversificar no es comprar “de todo”", slug: "diversificar-no-es-comprar-de-todo", level: "Intermedio" },
      { title: "Correlación simple (sin tecnicismos)", slug: "correlacion-simple-sin-tecnicismos", level: "Intermedio" },
      { title: "Mini práctica: detectar mala diversificación", slug: "mini-practica-detectar-mala-diversificacion", level: "Avanzado" },
    ]
  },
  {
    title: "¿Cómo diversificar?",
    lessons: [
      { title: "Diversificar por instrumento", slug: "diversificar-por-instrumento", level: "Básico" },
      { title: "Diversificar por sector/tema (idea simple)", slug: "diversificar-por-sectortema-idea-simple", level: "Básico" },
      { title: "Diversificar por tiempo (entradas escalonadas)", slug: "diversificar-por-tiempo-entradas-escalonadas", level: "Intermedio" },
      { title: "Diversificar por objetivo (corto vs largo)", slug: "diversificar-por-objetivo-corto-vs-largo", level: "Intermedio" },
      { title: "Caso: mejorar una cartera mal diversificada", slug: "caso-mejorar-una-cartera-mal-diversificada", level: "Avanzado" },
    ]
  },
  {
    title: "Errores comunes",
    lessons: [
      { title: "“Tengo muchas cosas” ≠ diversificado", slug: "tengo-muchas-cosas-diversificado", level: "Básico" },
      { title: "Diversificar sin entender qué compras", slug: "diversificar-sin-entender-que-compras", level: "Básico" },
      { title: "Cambiar cartera cada semana (error)", slug: "cambiar-cartera-cada-semana-error", level: "Intermedio" },
      { title: "Sobrediversificación (también pasa)", slug: "sobrediversificacion-tambien-pasa", level: "Intermedio" },
      { title: "Checkpoint: reglas simples para diversificar", slug: "checkpoint-reglas-simples-para-diversificar", level: "Avanzado" },
    ]
  },
]
