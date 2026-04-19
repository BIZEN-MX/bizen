export interface Tema15Lesson {
  title: string
  slug: string
  level: "Básico" | "Intermedio" | "Avanzado"
}

export interface Tema15Subtema {
  title: string
  lessons: Tema15Lesson[]
}

export const TEMA15_TITLE = "¿Cómo funcionan los Intereses?"

export const TEMA15_SUBTEMAS: Tema15Subtema[] = [
  {
    title: "Conceptos base",
    lessons: [
      { title: "¿Qué es el interés (en 1 minuto)?", slug: "que-es-interes-en-1-minuto", level: "Básico" },
      { title: "¿Cuál es la diferencia entre interés simple y compuesto?", slug: "interes-simple-vs-compuesto-con-ejemplo", level: "Básico" },
      { title: "¿Cómo funciona el interés a tu favor y en tu contra?", slug: "interes-a-tu-favor-vs-en-tu-contra", level: "Intermedio" },
      { title: "¿Por qué el tiempo es el factor más determinante?", slug: "por-que-el-tiempo-es-el-factor-mas-fuerte", level: "Intermedio" },
      { title: "Práctica: ¿Cómo saber si algo te cobra intereses?", slug: "mini-practica-identificar-si-algo-cobra-interes", level: "Avanzado" },
    ]
  },
  {
    title: "Costo real",
    lessons: [
      { title: "¿Qué es el CAT y cómo entenderlo?", slug: "cat-explicado-con-ejemplo-real", level: "Básico" },
      { title: "¿Por qué el pago mínimo es una trampa?", slug: "pago-minimo-por-que-es-trampa", level: "Básico" },
      { title: "¿Qué son los intereses moratorios?", slug: "intereses-moratorios-pagar-tarde-sale-caro", level: "Intermedio" },
      { title: "¿Cuándo conviene adelantar pagos?", slug: "cuando-conviene-adelantar-pagos", level: "Intermedio" },
      { title: "¿Cómo comparar créditos para saber cuál es más caro?", slug: "comparar-2-creditos-cual-es-mas-caro-y-por-que", level: "Avanzado" },
    ]
  },
  {
    title: "Decisiones con intereses",
    lessons: [
      { title: "Meses sin intereses: ¿Cuándo convienen realmente?", slug: "meses-sin-intereses-cuando-conviene-y-cuando-no", level: "Básico" },
      { title: "¿Cómo evitar siempre los intereses en tus tarjetas?", slug: "interes-en-tarjetas-como-evitarlo-siempre", level: "Básico" },
      { title: "¿Cómo reducir los intereses de tus deudas?", slug: "interes-en-deudas-estrategia-para-reducirlo", level: "Intermedio" },
      { title: "¿Cómo aprovechar el interés compuesto al ahorrar?", slug: "interes-compuesto-en-ahorroinversion-idea", level: "Intermedio" },
      { title: "Caso práctico: ¿Cómo tomar una decisión inteligente?", slug: "caso-decision-inteligente-con-intereses", level: "Avanzado" },
    ]
  },
]
