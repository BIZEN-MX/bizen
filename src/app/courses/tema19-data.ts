export type LessonLevel = "Básico" | "Intermedio" | "Avanzado"

export interface Tema19Lesson {
  title: string
  level: LessonLevel
  slug: string
}

export interface Tema19Subtema {
  title: string
  lessons: Tema19Lesson[]
}

export const TEMA19_SUBTEMAS: Tema19Subtema[] = [
  {
    title: "Qué es un modelo de negocio",
    lessons: [
      { title: "Qué es un modelo de negocio", level: "Básico", slug: "que-es-un-modelo-de-negocio" },
      { title: "Por qué un negocio necesita modelo", level: "Básico", slug: "por-que-un-negocio-necesita-modelo" },
      { title: "Producto vs negocio", level: "Básico", slug: "producto-vs-negocio" },
      { title: "Mitos sobre modelos de negocio", level: "Intermedio", slug: "mitos-sobre-modelos-de-negocio" },
    ],
  },
  {
    title: "Componentes del modelo",
    lessons: [
      { title: "Propuesta de valor", level: "Intermedio", slug: "propuesta-de-valor" },
      { title: "Cliente objetivo", level: "Intermedio", slug: "cliente-objetivo" },
      { title: "Canales de venta", level: "Intermedio", slug: "canales-de-venta" },
      { title: "Fuentes de ingreso", level: "Intermedio", slug: "fuentes-de-ingreso" },
      { title: "Estructura de costos", level: "Intermedio", slug: "estructura-de-costos" },
    ],
  },
  {
    title: "Tipos de modelos de negocio",
    lessons: [
      { title: "Venta de productos", level: "Básico", slug: "venta-de-productos" },
      { title: "Venta de servicios", level: "Básico", slug: "venta-de-servicios" },
      { title: "Suscripciones", level: "Intermedio", slug: "suscripciones" },
      { title: "Plataformas y marketplaces", level: "Intermedio", slug: "plataformas-y-marketplaces" },
      { title: "Modelos digitales", level: "Intermedio", slug: "modelos-digitales" },
    ],
  },
  {
    title: "Modelo en la vida real",
    lessons: [
      { title: "Modelos simples que funcionan", level: "Intermedio", slug: "modelos-simples-que-funcionan" },
      { title: "Errores comunes en modelos de negocio", level: "Avanzado", slug: "errores-comunes-en-modelos-de-negocio" },
      { title: "Ajustar el modelo con el tiempo", level: "Avanzado", slug: "ajustar-el-modelo-con-el-tiempo" },
    ],
  },
  {
    title: "Viabilidad del modelo",
    lessons: [
      { title: "Saber si el modelo es viable", level: "Avanzado", slug: "saber-si-el-modelo-es-viable" },
      { title: "Relación entre ingresos y costos", level: "Avanzado", slug: "relacion-entre-ingresos-y-costos" },
      { title: "Pensar en escalabilidad", level: "Avanzado", slug: "pensar-en-escalabilidad" },
    ],
  },
  {
    title: "Reflexión y cierre",
    lessons: [
      { title: "Entender cómo gana dinero mi negocio", level: "Intermedio", slug: "entender-como-gana-dinero-mi-negocio" },
      { title: "Prepararme para las finanzas del negocio", level: "Intermedio", slug: "prepararme-para-las-finanzas-del-negocio" },
      { title: "Checkpoint: Mi modelo de negocio", level: "Avanzado", slug: "checkpoint-mi-modelo-de-negocio" },
    ],
  },
]
