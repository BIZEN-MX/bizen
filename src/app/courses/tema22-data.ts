export interface Tema22Lesson {
  title: string
  slug: string
  level: "Básico" | "Intermedio" | "Avanzado"
}

export interface Tema22Subtema {
  title: string
  lessons: Tema22Lesson[]
}

export const TEMA22_TITLE = "Ingresos y generación de dinero"

export const TEMA22_SUBTEMAS: Tema22Subtema[] = [
  {
    title: "Fundamentos",
    lessons: [
      { title: "¿Cómo se genera ingreso en el mundo real?", slug: "como-se-genera-ingreso-en-el-mundo-real", level: "Básico" },
      { title: "Ingreso activo vs variable (ejemplos reales)", slug: "ingreso-activo-vs-variable-ejemplos-reales", level: "Básico" },
      { title: "Habilidades que pagan (cómo elegir)", slug: "habilidades-que-pagan-como-elegir", level: "Intermedio" },
      { title: "Tiempo vs dinero (tradeoffs)", slug: "tiempo-vs-dinero-tradeoffs", level: "Intermedio" },
      { title: "Mini plan: cómo subir ingreso con habilidad", slug: "mini-plan-como-subir-ingreso-con-habilidad", level: "Avanzado" },
    ]
  },
  {
    title: "Valor y negociación",
    lessons: [
      { title: "¿Qué es “valor” en el mercado (simple)?", slug: "que-es-valor-en-el-mercado-simple", level: "Básico" },
      { title: "¿Cómo fijar un precio a tu trabajo (básico)?", slug: "como-fijar-un-precio-a-tu-trabajo-basico", level: "Básico" },
      { title: "¿Cómo pedir mejor pago sin pena (pasos)?", slug: "como-pedir-mejor-pago-sin-pena-pasos", level: "Intermedio" },
      { title: "Errores al negociar (y cómo evitarlos)", slug: "errores-al-negociar-y-como-evitarlos", level: "Intermedio" },
      { title: "Caso: negociar un pago por un servicio", slug: "caso-negociar-un-pago-por-un-servicio", level: "Avanzado" },
    ]
  },
  {
    title: "Crecimiento",
    lessons: [
      { title: "Escalar ingresos con habilidades (no solo trabajar más)", slug: "escalar-ingresos-con-habilidades-no-solo-trabajar-mas", level: "Básico" },
      { title: "Sistemas: repetir, no improvisar", slug: "sistemas-repetir-no-improvisar", level: "Básico" },
      { title: "Diferenciar esfuerzo de estrategia", slug: "diferenciar-esfuerzo-de-estrategia", level: "Intermedio" },
      { title: "Construir reputación (y por qué paga)", slug: "construir-reputacion-y-por-que-paga", level: "Intermedio" },
      { title: "Checkpoint: mi plan de crecimiento de ingresos", slug: "checkpoint-mi-plan-de-crecimiento-de-ingresos", level: "Avanzado" },
    ]
  },
]
