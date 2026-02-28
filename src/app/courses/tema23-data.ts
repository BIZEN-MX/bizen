export interface Tema23Lesson {
  title: string
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
      { title: "¿Qué es la contabilidad?", slug: "que-es-la-contabilidad" },
      { title: "¿Para qué sirve la contabilidad?", slug: "para-que-sirve-la-contabilidad" },
      { title: "Mitos sobre la contabilidad", slug: "mitos-sobre-la-contabilidad" },
      { title: "Contabilidad para tomar decisiones", slug: "contabilidad-para-tomar-decisiones" },
    ],
  },
  {
    title: "Estados financieros",
    lessons: [
      { title: "¿Qué es un estado de resultados?", slug: "que-es-un-estado-de-resultados" },
      { title: "¿Qué es un balance general?", slug: "que-es-un-balance-general" },
      { title: "Ingresos, gastos y utilidad", slug: "ingresos-gastos-y-utilidad" },
    ],
  },
  {
    title: "Leer números",
    lessons: [
      { title: "Interpretar resultados del negocio", slug: "interpretar-resultados-del-negocio" },
      { title: "Detectar problemas en los números", slug: "detectar-problemas-en-los-numeros" },
      { title: "Errores comunes al leer estados", slug: "errores-comunes-al-leer-estados" },
    ],
  },
  {
    title: "Contabilidad en la vida real",
    lessons: [
      { title: "Ordenar las finanzas del negocio", slug: "ordenar-las-finanzas-del-negocio" },
      { title: "Separar finanzas personales y del negocio", slug: "separar-finanzas-personales-y-del-negocio" },
      { title: "Errores contables comunes", slug: "errores-contables-comunes" },
    ],
  },
  {
    title: "Reflexión y cierre",
    lessons: [
      { title: "Usar la contabilidad como herramienta", slug: "usar-la-contabilidad-como-herramienta" },
      { title: "Checkpoint: Entender mis números", slug: "checkpoint-entender-mis-numeros" },
    ],
  },
]
