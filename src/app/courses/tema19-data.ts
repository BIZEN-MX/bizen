export interface Tema19Lesson {
  title: string
  slug: string
}

export interface Tema19Subtema {
  title: string
  lessons: Tema19Lesson[]
}

export const TEMA19_SUBTEMAS: Tema19Subtema[] = [
  {
    title: "¿Qué es un modelo de negocio?",
    lessons: [
      { title: "¿Qué es un modelo de negocio?", slug: "que-es-un-modelo-de-negocio" },
      { title: "¿Por qué un negocio necesita modelo?", slug: "por-que-un-negocio-necesita-modelo" },
      { title: "Producto vs negocio", slug: "producto-vs-negocio" },
      { title: "Mitos sobre modelos de negocio", slug: "mitos-sobre-modelos-de-negocio" },
    ],
  },
  {
    title: "Componentes del modelo",
    lessons: [
      { title: "Propuesta de valor", slug: "propuesta-de-valor" },
      { title: "Cliente objetivo", slug: "cliente-objetivo" },
      { title: "Canales de venta", slug: "canales-de-venta" },
      { title: "Fuentes de ingreso", slug: "fuentes-de-ingreso" },
      { title: "Estructura de costos", slug: "estructura-de-costos" },
    ],
  },
  {
    title: "Tipos de modelos de negocio",
    lessons: [
      { title: "Venta de productos", slug: "venta-de-productos" },
      { title: "Venta de servicios", slug: "venta-de-servicios" },
      { title: "Suscripciones", slug: "suscripciones" },
      { title: "Plataformas y marketplaces", slug: "plataformas-y-marketplaces" },
      { title: "Modelos digitales", slug: "modelos-digitales" },
    ],
  },
  {
    title: "Modelo en la vida real",
    lessons: [
      { title: "Modelos simples que funcionan", slug: "modelos-simples-que-funcionan" },
      { title: "Errores comunes en modelos de negocio", slug: "errores-comunes-en-modelos-de-negocio" },
      { title: "Ajustar el modelo con el tiempo", slug: "ajustar-el-modelo-con-el-tiempo" },
    ],
  },
  {
    title: "Viabilidad del modelo",
    lessons: [
      { title: "Saber si el modelo es viable", slug: "saber-si-el-modelo-es-viable" },
      { title: "Relación entre ingresos y costos", slug: "relacion-entre-ingresos-y-costos" },
      { title: "Pensar en escalabilidad", slug: "pensar-en-escalabilidad" },
    ],
  },
  {
    title: "Reflexión y cierre",
    lessons: [
      { title: "Entender cómo gana dinero mi negocio", slug: "entender-como-gana-dinero-mi-negocio" },
      { title: "Prepararme para las finanzas del negocio", slug: "prepararme-para-las-finanzas-del-negocio" },
      { title: "Checkpoint: Mi modelo de negocio", slug: "checkpoint-mi-modelo-de-negocio" },
    ],
  },
]
