export type LessonLevel = "Básico" | "Intermedio" | "Avanzado"

export interface Tema8Lesson {
  title: string
  level: LessonLevel
  slug: string
}

export interface Tema8Subtema {
  title: string
  lessons: Tema8Lesson[]
}

export const TEMA8_SUBTEMAS: Tema8Subtema[] = [
  {
    title: "Entender los impuestos",
    lessons: [
      { title: "Qué son los impuestos", level: "Básico", slug: "que-son-los-impuestos" },
      { title: "Para qué sirven los impuestos", level: "Básico", slug: "para-que-sirven-los-impuestos" },
      { title: "Por qué todos pagamos impuestos", level: "Básico", slug: "por-que-todos-pagamos-impuestos" },
      { title: "Mitos sobre los impuestos", level: "Básico", slug: "mitos-sobre-los-impuestos" },
      { title: "Cambiar la forma de ver los impuestos", level: "Intermedio", slug: "cambiar-la-forma-de-ver-los-impuestos" },
    ],
  },
  {
    title: "Impuestos en mi vida diaria",
    lessons: [
      { title: "Impuestos incluidos en productos y servicios", level: "Básico", slug: "impuestos-incluidos-en-productos-y-servicios" },
      { title: "IVA explicado fácil", level: "Básico", slug: "iva-explicado-facil" },
      { title: "ISR explicado simple", level: "Intermedio", slug: "isr-explicado-simple" },
      { title: "Impuestos visibles e invisibles", level: "Intermedio", slug: "impuestos-visibles-e-invisibles" },
      { title: "Cómo afectan mi poder de compra", level: "Intermedio", slug: "como-afectan-mi-poder-de-compra" },
    ],
  },
  {
    title: "Personas físicas",
    lessons: [
      { title: "Qué es una persona física", level: "Básico", slug: "que-es-una-persona-fisica" },
      { title: "Por qué debo declarar", level: "Intermedio", slug: "por-que-debo-declarar" },
      { title: "Ingresos gravables", level: "Intermedio", slug: "ingresos-gravables" },
      { title: "Deducciones personales", level: "Intermedio", slug: "deducciones-personales" },
      { title: "Errores comunes al declarar", level: "Avanzado", slug: "errores-comunes-al-declarar" },
    ],
  },
  {
    title: "Cumplimiento y consecuencias",
    lessons: [
      { title: "Qué pasa si no pago impuestos", level: "Intermedio", slug: "que-pasa-si-no-pago-impuestos" },
      { title: "Multas y recargos", level: "Intermedio", slug: "multas-y-recargos" },
      { title: "Problemas fiscales comunes", level: "Avanzado", slug: "problemas-fiscales-comunes" },
      { title: "Regularizar mi situación fiscal", level: "Avanzado", slug: "regularizar-mi-situacion-fiscal" },
    ],
  },
  {
    title: "Impuestos y decisiones financieras",
    lessons: [
      { title: "Impuestos al ahorrar", level: "Intermedio", slug: "impuestos-al-ahorrar" },
      { title: "Impuestos al invertir", level: "Intermedio", slug: "impuestos-al-invertir" },
      { title: "Impuestos al emprender", level: "Intermedio", slug: "impuestos-al-emprender" },
      { title: "Planear mis decisiones considerando impuestos", level: "Avanzado", slug: "planear-mis-decisiones-considerando-impuestos" },
    ],
  },
  {
    title: "Reflexión y cierre",
    lessons: [
      { title: "Entender impuestos sin miedo", level: "Intermedio", slug: "entender-impuestos-sin-miedo" },
      { title: "Usar los impuestos como parte de mi planeación", level: "Intermedio", slug: "usar-los-impuestos-como-parte-de-mi-planeacion" },
      { title: "Checkpoint: Mis impuestos en la vida real", level: "Avanzado", slug: "checkpoint-mis-impuestos-en-la-vida-real" },
    ],
  },
]
