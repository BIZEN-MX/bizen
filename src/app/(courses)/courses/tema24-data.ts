export interface Tema24Lesson {
  title: string
  slug: string
  level: "Básico" | "Intermedio" | "Avanzado"
}

export interface Tema24Subtema {
  title: string
  lessons: Tema24Lesson[]
}

export const TEMA24_TITLE = "Inversión básica"

export const TEMA24_SUBTEMAS: Tema24Subtema[] = [
  {
    title: "Conceptos",
    lessons: [
      { title: "Ahorrar vs invertir (criterio claro)", slug: "ahorrar-vs-invertir-criterio-claro", level: "Básico" },
      { title: "Horizonte de inversión (tiempo)", slug: "horizonte-de-inversion-tiempo", level: "Básico" },
      { title: "Rendimiento esperado vs realidad", slug: "rendimiento-esperado-vs-realidad", level: "Intermedio" },
      { title: "Liquidez: cuándo importa", slug: "liquidez-cuando-importa", level: "Intermedio" },
      { title: "Mini práctica: elegir ahorro vs inversión en 5 casos", slug: "mini-practica-elegir-ahorro-vs-inversion-en-5-casos", level: "Avanzado" },
    ]
  },
  {
    title: "Instrumentos base",
    lessons: [
      { title: "Renta fija vs renta variable (simple)", slug: "renta-fija-vs-renta-variable-simple", level: "Básico" },
      { title: "ETFs y fondos (concepto general)", slug: "etfs-y-fondos-concepto-general", level: "Básico" },
      { title: "Acciones: qué son (sin trading)", slug: "acciones-que-son-sin-trading", level: "Intermedio" },
      { title: "Diversificación dentro de un instrumento", slug: "diversificacion-dentro-de-un-instrumento", level: "Intermedio" },
      { title: "Caso: elegir instrumento según objetivo", slug: "caso-elegir-instrumento-segun-objetivo", level: "Avanzado" },
    ]
  },
  {
    title: "Empezar",
    lessons: [
      { title: "¿Cómo empezar con poco sin improvisar?", slug: "como-empezar-con-poco-sin-improvisar", level: "Básico" },
      { title: "Errores del principiante (comunes)", slug: "errores-del-principiante-comunes", level: "Básico" },
      { title: "Consistencia: aportar cada mes (idea)", slug: "consistencia-aportar-cada-mes-idea", level: "Intermedio" },
      { title: "Plan de inversión simple (reglas)", slug: "plan-de-inversion-simple-reglas", level: "Intermedio" },
      { title: "Checkpoint: mi estrategia inicial de inversión", slug: "checkpoint-mi-estrategia-inicial-de-inversion", level: "Avanzado" },
    ]
  },
]
