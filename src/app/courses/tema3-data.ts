export interface Tema3Lesson {
  title: string
  slug: string
  level: "Básico" | "Intermedio" | "Avanzado"
}

export interface Tema3Subtema {
  title: string
  lessons: Tema3Lesson[]
}

export const TEMA3_TITLE = "Psicología & Hacks de Comportamiento"

export const TEMA3_SUBTEMAS: Tema3Subtema[] = [
  {
    title: "Sesgos y Decisiones",
    lessons: [
      { title: "¿Cómo me hace sentir el dinero?", slug: "como-me-hace-sentir-el-dinero", level: "Básico" },
      { title: "Señales de emoción en una decisión", slug: "senales-de-emocion-dominando-una-decision", level: "Básico" },
      { title: "Culpa y ansiedad financiera", slug: "culpa-y-ansiedad-financiera-como-se-forman", level: "Intermedio" },
      { title: "Emoción vs decisiones reales", slug: "emocion-vs-decision-casos-reales", level: "Avanzado" },
      { title: "Psicología de la Deuda", slug: "psicologia-de-la-deuda-por-que-duele-pagar", level: "Intermedio" },
    ]
  },
  {
    title: "El Código Mental (Creencias)",
    lessons: [
      { title: "Mis primeras creencias sobre el dinero", slug: "mis-primeras-creencias-sobre-el-dinero", level: "Básico" },
      { title: "Expectativas vs realidad financiera", slug: "expectativas-vs-realidad-financiera", level: "Básico" },
      { title: "Frases heredadas que me limitan", slug: "frases-heredadas-que-me-limitan", level: "Intermedio" },
      { title: "Cómo cuestionar una creencia", slug: "como-cuestionar-una-creencia-con-evidencia", level: "Intermedio" },
      { title: "Mi nuevo manual de reglas BIZEN", slug: "mi-nuevo-manual-de-reglas-financieras", level: "Avanzado" },
    ]
  },
  {
    title: "Psicología del Consumo",
    lessons: [
      { title: "¿Qué es un trigger de compra?", slug: "que-es-un-trigger-de-compra", level: "Básico" },
      { title: "Redes: comparación y presión", slug: "redes-comparacion-y-presion", level: "Intermedio" },
      { title: "Comprar por estatus vs por valor", slug: "comprar-por-estatus-vs-por-valor", level: "Básico" },
      { title: "Regla personal anti-estatus", slug: "regla-personal-anti-estatus", level: "Avanzado" },
      { title: "El Ego en el Consumo Digital", slug: "el-ego-en-el-consumo-digital", level: "Intermedio" },
    ]
  },
  {
    title: "Certificación Psicológica",
    lessons: [
      { title: "Examen de Comportamiento (Evaluación)", slug: "evaluacion-bloque-3", level: "Avanzado" },
    ]
  },
]
