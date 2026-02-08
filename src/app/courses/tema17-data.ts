export type LessonLevel = "Básico" | "Intermedio" | "Avanzado"

export interface Tema17Lesson {
  title: string
  level: LessonLevel
  slug: string
}

export interface Tema17Subtema {
  title: string
  lessons: Tema17Lesson[]
}

export const TEMA17_SUBTEMAS: Tema17Subtema[] = [
  {
    title: "Ver problemas",
    lessons: [
      { title: "Qué es un problema", level: "Básico", slug: "que-es-un-problema" },
      { title: "Problemas reales vs aparentes", level: "Básico", slug: "problemas-reales-vs-aparentes" },
      { title: "Por qué los problemas valen dinero", level: "Intermedio", slug: "por-que-los-problemas-valen-dinero" },
      { title: "Pensar desde el punto de vista del cliente", level: "Intermedio", slug: "pensar-desde-el-punto-de-vista-del-cliente" },
    ],
  },
  {
    title: "Observar el entorno",
    lessons: [
      { title: "Observar mi entorno cotidiano", level: "Básico", slug: "observar-mi-entorno-cotidiano" },
      { title: "Detectar necesidades no resueltas", level: "Intermedio", slug: "detectar-necesidades-no-resueltas" },
      { title: "Quejas comunes como oportunidades", level: "Intermedio", slug: "quejas-comunes-como-oportunidades" },
      { title: "Errores al interpretar problemas", level: "Intermedio", slug: "errores-al-interpretar-problemas" },
    ],
  },
  {
    title: "Generar ideas",
    lessons: [
      { title: "Convertir problemas en ideas", level: "Intermedio", slug: "convertir-problemas-en-ideas" },
      { title: "Ideas simples vs ideas complejas", level: "Intermedio", slug: "ideas-simples-vs-ideas-complejas" },
      { title: "No todas las ideas son negocios", level: "Intermedio", slug: "no-todas-las-ideas-son-negocios" },
      { title: "Priorizar ideas", level: "Avanzado", slug: "priorizar-ideas" },
    ],
  },
  {
    title: "Evaluar oportunidades",
    lessons: [
      { title: "Tamaño del problema", level: "Intermedio", slug: "tamano-del-problema" },
      { title: "Quién pagaría por la solución", level: "Intermedio", slug: "quien-pagaria-por-la-solucion" },
      { title: "Diferenciar oportunidad de ocurrencia", level: "Avanzado", slug: "diferenciar-oportunidad-de-ocurrencia" },
      { title: "Riesgos de la oportunidad", level: "Avanzado", slug: "riesgos-de-la-oportunidad" },
    ],
  },
  {
    title: "Elegir una oportunidad",
    lessons: [
      { title: "Elegir una idea para trabajar", level: "Avanzado", slug: "elegir-una-idea-para-trabajar" },
      { title: "Enfocarse en una sola oportunidad", level: "Avanzado", slug: "enfocarse-en-una-sola-oportunidad" },
      { title: "Decidir con criterio", level: "Avanzado", slug: "decidir-con-criterio" },
    ],
  },
  {
    title: "Reflexión y cierre",
    lessons: [
      { title: "Pensar como creador de valor", level: "Intermedio", slug: "pensar-como-creador-de-valor" },
      { title: "Prepararme para validar ideas", level: "Intermedio", slug: "prepararme-para-validar-ideas" },
      { title: "Checkpoint: Mi primera oportunidad", level: "Avanzado", slug: "checkpoint-mi-primera-oportunidad" },
    ],
  },
]
