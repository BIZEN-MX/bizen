export interface Tema15Lesson {
  title: string
  slug: string
  level: "Básico" | "Intermedio" | "Avanzado"
}

export interface Tema15Subtema {
  title: string
  lessons: Tema15Lesson[]
}

export const TEMA15_TITLE = "Intereses"

export const TEMA15_SUBTEMAS: Tema15Subtema[] = [
  {
    title: "Conceptos base",
    lessons: [
      { title: "¿Qué es interés (en 1 minuto)?", slug: "que-es-interes-en-1-minuto", level: "Básico" },
      { title: "Interés simple vs compuesto (con ejemplo)", slug: "interes-simple-vs-compuesto-con-ejemplo", level: "Básico" },
      { title: "Interés a tu favor vs en tu contra", slug: "interes-a-tu-favor-vs-en-tu-contra", level: "Intermedio" },
      { title: "¿Por qué el tiempo es el factor más fuerte?", slug: "por-que-el-tiempo-es-el-factor-mas-fuerte", level: "Intermedio" },
      { title: "Mini práctica: identificar si algo “cobra interés”", slug: "mini-practica-identificar-si-algo-cobra-interes", level: "Avanzado" },
    ]
  },
  {
    title: "Costo real",
    lessons: [
      { title: "CAT explicado con ejemplo real", slug: "cat-explicado-con-ejemplo-real", level: "Básico" },
      { title: "Pago mínimo: por qué es trampa", slug: "pago-minimo-por-que-es-trampa", level: "Básico" },
      { title: "Intereses moratorios (pagar tarde sale caro)", slug: "intereses-moratorios-pagar-tarde-sale-caro", level: "Intermedio" },
      { title: "¿Cuándo conviene adelantar pagos?", slug: "cuando-conviene-adelantar-pagos", level: "Intermedio" },
      { title: "Comparar 2 créditos: cuál es más caro y por qué", slug: "comparar-2-creditos-cual-es-mas-caro-y-por-que", level: "Avanzado" },
    ]
  },
  {
    title: "Decisiones con intereses",
    lessons: [
      { title: "Meses sin intereses: cuándo conviene y cuándo no", slug: "meses-sin-intereses-cuando-conviene-y-cuando-no", level: "Básico" },
      { title: "Interés en tarjetas: cómo evitarlo siempre", slug: "interes-en-tarjetas-como-evitarlo-siempre", level: "Básico" },
      { title: "Interés en deudas: estrategia para reducirlo", slug: "interes-en-deudas-estrategia-para-reducirlo", level: "Intermedio" },
      { title: "Interés compuesto en ahorro/inversión (idea)", slug: "interes-compuesto-en-ahorroinversion-idea", level: "Intermedio" },
      { title: "Caso: decisión inteligente con intereses", slug: "caso-decision-inteligente-con-intereses", level: "Avanzado" },
    ]
  },
]
