export interface Tema12Lesson {
  title: string
  slug: string
  level: "Básico" | "Intermedio" | "Avanzado"
}

export interface Tema12Subtema {
  title: string
  lessons: Tema12Lesson[]
}

export const TEMA12_TITLE = "Crédito y tarjetas"

export const TEMA12_SUBTEMAS: Tema12Subtema[] = [
  {
    title: "Fundamentos del crédito",
    lessons: [
      { title: "¿Qué es crédito y cuándo sí conviene?", slug: "que-es-credito-y-cuando-si-conviene", level: "Básico" },
      { title: "Crédito bueno vs malo (con ejemplos reales)", slug: "credito-bueno-vs-malo-con-ejemplos-reales", level: "Básico" },
      { title: "¿Qué significa “capacidad de pago”?", slug: "que-significa-capacidad-de-pago", level: "Intermedio" },
      { title: "Costo real del crédito (idea sin fórmula)", slug: "costo-real-del-credito-idea-sin-formula", level: "Intermedio" },
      { title: "Señales de que NO debes pedir crédito", slug: "senales-de-que-no-debes-pedir-credito", level: "Avanzado" },
    ]
  },
  {
    title: "Tarjetas de crédito",
    lessons: [
      { title: "¿Cómo funciona una tarjeta (ciclo de pago)?", slug: "como-funciona-una-tarjeta-ciclo-de-pago", level: "Básico" },
      { title: "Fecha de corte vs fecha límite (sin confundirse)", slug: "fecha-de-corte-vs-fecha-limite-sin-confundirse", level: "Básico" },
      { title: "Pago mínimo vs pago para no generar intereses", slug: "pago-minimo-vs-pago-para-no-generar-intereses", level: "Intermedio" },
      { title: "Anualidad, comisiones y cargos comunes", slug: "anualidad-comisiones-y-cargos-comunes", level: "Intermedio" },
      { title: "Regla de oro: cómo usar tarjeta sin caer en deuda", slug: "regla-de-oro-como-usar-tarjeta-sin-caer-en-deuda", level: "Avanzado" },
    ]
  },
  {
    title: "Uso responsable",
    lessons: [
      { title: "Límites personales: cuánto sí gastar con tarjeta", slug: "limites-personales-cuanto-si-gastar-con-tarjeta", level: "Básico" },
      { title: "Tarjeta para construir historial (estrategia segura)", slug: "tarjeta-para-construir-historial-estrategia-segura", level: "Básico" },
      { title: "Errores típicos (meses sin intereses mal usados)", slug: "errores-tipicos-meses-sin-intereses-mal-usados", level: "Intermedio" },
      { title: "¿Qué hacer si ya te estás atorando?", slug: "que-hacer-si-ya-te-estas-atorando", level: "Intermedio" },
      { title: "Mini caso: tarjeta bien usada vs mal usada", slug: "mini-caso-tarjeta-bien-usada-vs-mal-usada", level: "Avanzado" },
    ]
  },
]
