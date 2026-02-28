export interface Tema8Lesson {
  title: string
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
      { title: "¿Qué son los impuestos?", slug: "que-son-los-impuestos" },
      { title: "¿Para qué sirven los impuestos?", slug: "para-que-sirven-los-impuestos" },
      { title: "¿Por qué todos pagamos impuestos?", slug: "por-que-todos-pagamos-impuestos" },
      { title: "Mitos sobre los impuestos", slug: "mitos-sobre-los-impuestos" },
      { title: "Cambiar la forma de ver los impuestos", slug: "cambiar-la-forma-de-ver-los-impuestos" },
    ],
  },
  {
    title: "Impuestos en mi vida diaria",
    lessons: [
      { title: "Impuestos incluidos en productos y servicios", slug: "impuestos-incluidos-en-productos-y-servicios" },
      { title: "IVA explicado fácil", slug: "iva-explicado-facil" },
      { title: "ISR explicado simple", slug: "isr-explicado-simple" },
      { title: "Impuestos visibles e invisibles", slug: "impuestos-visibles-e-invisibles" },
      { title: "¿Cómo afectan mi poder de compra?", slug: "como-afectan-mi-poder-de-compra" },
    ],
  },
  {
    title: "Personas físicas",
    lessons: [
      { title: "¿Qué es una persona física?", slug: "que-es-una-persona-fisica" },
      { title: "¿Por qué debo declarar?", slug: "por-que-debo-declarar" },
      { title: "Ingresos gravables", slug: "ingresos-gravables" },
      { title: "Deducciones personales", slug: "deducciones-personales" },
      { title: "Errores comunes al declarar", slug: "errores-comunes-al-declarar" },
    ],
  },
  {
    title: "Cumplimiento y consecuencias",
    lessons: [
      { title: "¿Qué pasa si no pago impuestos?", slug: "que-pasa-si-no-pago-impuestos" },
      { title: "Multas y recargos", slug: "multas-y-recargos" },
      { title: "Problemas fiscales comunes", slug: "problemas-fiscales-comunes" },
      { title: "Regularizar mi situación fiscal", slug: "regularizar-mi-situacion-fiscal" },
    ],
  },
  {
    title: "Impuestos y decisiones financieras",
    lessons: [
      { title: "Impuestos al ahorrar", slug: "impuestos-al-ahorrar" },
      { title: "Impuestos al invertir", slug: "impuestos-al-invertir" },
      { title: "Impuestos al emprender", slug: "impuestos-al-emprender" },
      { title: "Planear mis decisiones considerando impuestos", slug: "planear-mis-decisiones-considerando-impuestos" },
    ],
  },
  {
    title: "Reflexión y cierre",
    lessons: [
      { title: "Entender impuestos sin miedo", slug: "entender-impuestos-sin-miedo" },
      { title: "Usar los impuestos como parte de mi planeación", slug: "usar-los-impuestos-como-parte-de-mi-planeacion" },
      { title: "Checkpoint: Mis impuestos en la vida real", slug: "checkpoint-mis-impuestos-en-la-vida-real" },
    ],
  },
]
