export type LessonLevel = "Básico" | "Intermedio" | "Avanzado"

export interface Tema6Lesson {
  title: string
  level: LessonLevel
  slug: string
}

export interface Tema6Subtema {
  title: string
  lessons: Tema6Lesson[]
}

export const TEMA6_SUBTEMAS: Tema6Subtema[] = [
  {
    title: "Entender la deuda",
    lessons: [
      { title: "Qué es la deuda", level: "Básico", slug: "que-es-la-deuda" },
      { title: "Por qué existe la deuda", level: "Básico", slug: "por-que-existe-la-deuda" },
      { title: "Por qué la gente usa deuda", level: "Básico", slug: "por-que-la-gente-usa-deuda" },
      { title: "Mitos sobre la deuda", level: "Básico", slug: "mitos-sobre-la-deuda" },
      { title: "Deuda como herramienta vs problema", level: "Intermedio", slug: "deuda-como-herramienta-vs-problema" },
    ],
  },
  {
    title: "Tipos de deuda",
    lessons: [
      { title: "Deuda buena y deuda mala", level: "Básico", slug: "deuda-buena-y-deuda-mala" },
      { title: "Deuda de corto plazo", level: "Básico", slug: "deuda-de-corto-plazo" },
      { title: "Deuda de largo plazo", level: "Básico", slug: "deuda-de-largo-plazo" },
      { title: "Deuda personal vs deuda de negocio", level: "Intermedio", slug: "deuda-personal-vs-deuda-de-negocio" },
      { title: "Riesgos de la deuda", level: "Intermedio", slug: "riesgos-de-la-deuda" },
    ],
  },
  {
    title: "Crédito en la vida real",
    lessons: [
      { title: "Qué es el crédito", level: "Básico", slug: "que-es-el-credito" },
      { title: "Cómo funcionan las tarjetas de crédito", level: "Básico", slug: "como-funcionan-las-tarjetas-de-credito" },
      { title: "Intereses y CAT explicados fácil", level: "Intermedio", slug: "intereses-y-cat-explicados-facil" },
      { title: "Pagos mínimos y consecuencias", level: "Intermedio", slug: "pagos-minimos-y-consecuencias" },
      { title: "Errores comunes con tarjetas", level: "Avanzado", slug: "errores-comunes-con-tarjetas" },
    ],
  },
  {
    title: "Manejar la deuda",
    lessons: [
      { title: "Saber cuánto debo realmente", level: "Intermedio", slug: "saber-cuanto-debo-realmente" },
      { title: "Priorizar deudas", level: "Intermedio", slug: "priorizar-deudas" },
      { title: "Refinanciar deudas", level: "Avanzado", slug: "refinanciar-deudas" },
      { title: "Salir de deudas paso a paso", level: "Avanzado", slug: "salir-de-deudas-paso-a-paso" },
      { title: "Evitar volver a endeudarme", level: "Avanzado", slug: "evitar-volver-a-endeudarme" },
    ],
  },
  {
    title: "Deuda y emociones",
    lessons: [
      { title: "Estrés por deudas", level: "Intermedio", slug: "estres-por-deudas" },
      { title: "Vergüenza y deuda", level: "Intermedio", slug: "verguenza-y-deuda" },
      { title: "Negación financiera", level: "Intermedio", slug: "negacion-financiera" },
      { title: "Tomar control sin culpa", level: "Avanzado", slug: "tomar-control-sin-culpa" },
    ],
  },
  {
    title: "Reflexión y cierre",
    lessons: [
      { title: "Usar la deuda con conciencia", level: "Intermedio", slug: "usar-la-deuda-con-conciencia" },
      { title: "Prepararme para el sistema financiero", level: "Intermedio", slug: "prepararme-para-el-sistema-financiero" },
      { title: "Checkpoint: Mi relación con la deuda", level: "Avanzado", slug: "checkpoint-mi-relacion-con-la-deuda" },
    ],
  },
]
