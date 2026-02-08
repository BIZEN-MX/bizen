export type LessonLevel = "Básico" | "Intermedio" | "Avanzado"

export interface Tema23Lesson {
  title: string
  level: LessonLevel
  slug: string
}

export interface Tema23Subtema {
  title: string
  lessons: Tema23Lesson[]
}

export const TEMA23_SUBTEMAS: Tema23Subtema[] = [
  {
    title: "Entender la contabilidad",
    lessons: [
      { title: "Qué es la contabilidad", level: "Básico", slug: "que-es-la-contabilidad" },
      { title: "Para qué sirve la contabilidad", level: "Básico", slug: "para-que-sirve-la-contabilidad" },
      { title: "Mitos sobre la contabilidad", level: "Básico", slug: "mitos-sobre-la-contabilidad" },
      { title: "Contabilidad para tomar decisiones", level: "Intermedio", slug: "contabilidad-para-tomar-decisiones" },
    ],
  },
  {
    title: "Estados financieros",
    lessons: [
      { title: "Qué es un estado de resultados", level: "Intermedio", slug: "que-es-un-estado-de-resultados" },
      { title: "Qué es un balance general", level: "Intermedio", slug: "que-es-un-balance-general" },
      { title: "Ingresos, gastos y utilidad", level: "Intermedio", slug: "ingresos-gastos-y-utilidad" },
    ],
  },
  {
    title: "Leer números",
    lessons: [
      { title: "Interpretar resultados del negocio", level: "Intermedio", slug: "interpretar-resultados-del-negocio" },
      { title: "Detectar problemas en los números", level: "Avanzado", slug: "detectar-problemas-en-los-numeros" },
      { title: "Errores comunes al leer estados", level: "Avanzado", slug: "errores-comunes-al-leer-estados" },
    ],
  },
  {
    title: "Contabilidad en la vida real",
    lessons: [
      { title: "Ordenar las finanzas del negocio", level: "Intermedio", slug: "ordenar-las-finanzas-del-negocio" },
      { title: "Separar finanzas personales y del negocio", level: "Intermedio", slug: "separar-finanzas-personales-y-del-negocio" },
      { title: "Errores contables comunes", level: "Avanzado", slug: "errores-contables-comunes" },
    ],
  },
  {
    title: "Reflexión y cierre",
    lessons: [
      { title: "Usar la contabilidad como herramienta", level: "Intermedio", slug: "usar-la-contabilidad-como-herramienta" },
      { title: "Checkpoint: Entender mis números", level: "Avanzado", slug: "checkpoint-entender-mis-numeros" },
    ],
  },
]
