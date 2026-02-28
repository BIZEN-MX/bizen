export interface Tema17Lesson {
  title: string
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
      { title: "¿Qué es un problema?", slug: "que-es-un-problema" },
      { title: "Problemas reales vs aparentes", slug: "problemas-reales-vs-aparentes" },
      { title: "¿Por qué los problemas valen dinero?", slug: "por-que-los-problemas-valen-dinero" },
      { title: "Pensar desde el punto de vista del cliente", slug: "pensar-desde-el-punto-de-vista-del-cliente" },
    ],
  },
  {
    title: "Observar el entorno",
    lessons: [
      { title: "Observar mi entorno cotidiano", slug: "observar-mi-entorno-cotidiano" },
      { title: "Detectar necesidades no resueltas", slug: "detectar-necesidades-no-resueltas" },
      { title: "Quejas comunes como oportunidades", slug: "quejas-comunes-como-oportunidades" },
      { title: "Errores al interpretar problemas", slug: "errores-al-interpretar-problemas" },
    ],
  },
  {
    title: "Generar ideas",
    lessons: [
      { title: "Convertir problemas en ideas", slug: "convertir-problemas-en-ideas" },
      { title: "Ideas simples vs ideas complejas", slug: "ideas-simples-vs-ideas-complejas" },
      { title: "No todas las ideas son negocios", slug: "no-todas-las-ideas-son-negocios" },
      { title: "Priorizar ideas", slug: "priorizar-ideas" },
    ],
  },
  {
    title: "Evaluar oportunidades",
    lessons: [
      { title: "Tamaño del problema", slug: "tamano-del-problema" },
      { title: "¿Quién pagaría por la solución?", slug: "quien-pagaria-por-la-solucion" },
      { title: "Diferenciar oportunidad de ocurrencia", slug: "diferenciar-oportunidad-de-ocurrencia" },
      { title: "Riesgos de la oportunidad", slug: "riesgos-de-la-oportunidad" },
    ],
  },
  {
    title: "Elegir una oportunidad",
    lessons: [
      { title: "Elegir una idea para trabajar", slug: "elegir-una-idea-para-trabajar" },
      { title: "Enfocarse en una sola oportunidad", slug: "enfocarse-en-una-sola-oportunidad" },
      { title: "Decidir con criterio", slug: "decidir-con-criterio" },
    ],
  },
  {
    title: "Reflexión y cierre",
    lessons: [
      { title: "Pensar como creador de valor", slug: "pensar-como-creador-de-valor" },
      { title: "Prepararme para validar ideas", slug: "prepararme-para-validar-ideas" },
      { title: "Checkpoint: Mi primera oportunidad", slug: "checkpoint-mi-primera-oportunidad" },
    ],
  },
]
