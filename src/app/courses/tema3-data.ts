export interface Tema3Lesson {
  title: string
  slug: string
  level: "Básico" | "Intermedio" | "Avanzado"
}

export interface Tema3Subtema {
  title: string
  lessons: Tema3Lesson[]
}

export const TEMA3_TITLE = "Psicología del consumo"

export const TEMA3_SUBTEMAS: Tema3Subtema[] = [
  {
    title: "Triggers",
    lessons: [
      { title: "¿Qué es un trigger de compra?", slug: "que-es-un-trigger-de-compra", level: "Básico" },
      { title: "Publicidad: cómo te manipula", slug: "publicidad-como-te-manipula", level: "Básico" },
      { title: "Redes: comparación y presión", slug: "redes-comparacion-y-presion", level: "Intermedio" },
      { title: "Compras por aburrimiento vs necesidad", slug: "compras-por-aburrimiento-vs-necesidad", level: "Intermedio" },
      { title: "Detectar mis triggers (casos)", slug: "detectar-mis-triggers-casos", level: "Avanzado" },
    ]
  },
  {
    title: "Compras impulsivas",
    lessons: [
      { title: "Señales de compra impulsiva", slug: "senales-de-compra-impulsiva", level: "Básico" },
      { title: "Antes de pagar: checklist de decisión", slug: "antes-de-pagar-checklist-de-decision", level: "Básico" },
      { title: "Micro-hábitos para evitar impulsos", slug: "micro-habitos-para-evitar-impulsos", level: "Intermedio" },
      { title: "Post-compra: culpa y aprendizaje", slug: "post-compra-culpa-y-aprendizaje", level: "Intermedio" },
      { title: "Caso: “gasto por emoción” paso a paso", slug: "caso-gasto-por-emocion-paso-a-paso", level: "Avanzado" },
    ]
  },
  {
    title: "Estatus",
    lessons: [
      { title: "Comprar por estatus vs por valor", slug: "comprar-por-estatus-vs-por-valor", level: "Básico" },
      { title: "“Apariencia de riqueza” vs riqueza real", slug: "apariencia-de-riqueza-vs-riqueza-real", level: "Básico" },
      { title: "Presión social en decisiones (escenarios)", slug: "presion-social-en-decisiones-escenarios", level: "Intermedio" },
      { title: "¿Cómo decir que no sin sentirte menos?", slug: "como-decir-que-no-sin-sentirte-menos", level: "Intermedio" },
      { title: "Regla personal anti-estatus", slug: "regla-personal-anti-estatus", level: "Avanzado" },
    ]
  },
]
