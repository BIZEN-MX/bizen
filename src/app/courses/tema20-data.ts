export interface Tema20Lesson {
  title: string
  slug: string
  level: "Básico" | "Intermedio" | "Avanzado"
}

export interface Tema20Subtema {
  title: string
  lessons: Tema20Lesson[]
}

export const TEMA20_TITLE = "Inflación"

export const TEMA20_SUBTEMAS: Tema20Subtema[] = [
  {
    title: "Concepto",
    lessons: [
      { title: "¿Qué es inflación (sin tecnicismos)?", slug: "que-es-inflacion-sin-tecnicismos", level: "Básico" },
      { title: "¿Por qué suben precios (causas simples)?", slug: "por-que-suben-precios-causas-simples", level: "Básico" },
      { title: "Inflación vs “que todo está caro”", slug: "inflacion-vs-que-todo-esta-caro", level: "Intermedio" },
      { title: "Diferencia entre inflación baja y alta", slug: "diferencia-entre-inflacion-baja-y-alta", level: "Intermedio" },
      { title: "Caso: precios hoy vs hace 2 años", slug: "caso-precios-hoy-vs-hace-2-anos", level: "Avanzado" },
    ]
  },
  {
    title: "Impacto personal",
    lessons: [
      { title: "¿Cómo afecta tu ahorro?", slug: "como-afecta-tu-ahorro", level: "Básico" },
      { title: "¿Cómo afecta tu salario o mesada?", slug: "como-afecta-tu-salario-o-mesada", level: "Básico" },
      { title: "Errores comunes en inflación (compras impulsivas)", slug: "errores-comunes-en-inflacion-compras-impulsivas", level: "Intermedio" },
      { title: "Ajustar presupuesto en inflación", slug: "ajustar-presupuesto-en-inflacion", level: "Intermedio" },
      { title: "Mini simulación: inflación y poder de compra", slug: "mini-simulacion-inflacion-y-poder-de-compra", level: "Avanzado" },
    ]
  },
  {
    title: "Estrategia",
    lessons: [
      { title: "Protegerte sin pánico (reglas)", slug: "protegerte-sin-panico-reglas", level: "Básico" },
      { title: "¿Qué decisiones ayudan (ahorro, gasto, ingresos)?", slug: "que-decisiones-ayudan-ahorro-gasto-ingresos", level: "Básico" },
      { title: "Inflación y deuda (qué conviene)", slug: "inflacion-y-deuda-que-conviene", level: "Intermedio" },
      { title: "Inflación e inversión (idea base)", slug: "inflacion-e-inversion-idea-base", level: "Intermedio" },
      { title: "Plan simple para “épocas caras”", slug: "plan-simple-para-epocas-caras", level: "Avanzado" },
    ]
  },
]
