export interface Tema6Lesson {
  title: string
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
      { title: "¿Qué es la deuda?", slug: "que-es-la-deuda" },
      { title: "¿Por qué existe la deuda?", slug: "por-que-existe-la-deuda" },
      { title: "¿Por qué la gente usa deuda?", slug: "por-que-la-gente-usa-deuda" },
      { title: "Mitos sobre la deuda", slug: "mitos-sobre-la-deuda" },
      { title: "Deuda como herramienta vs problema", slug: "deuda-como-herramienta-vs-problema" },
    ],
  },
  {
    title: "Tipos de deuda",
    lessons: [
      { title: "Deuda buena y deuda mala", slug: "deuda-buena-y-deuda-mala" },
      { title: "Deuda de corto plazo", slug: "deuda-de-corto-plazo" },
      { title: "Deuda de largo plazo", slug: "deuda-de-largo-plazo" },
      { title: "Deuda personal vs deuda de negocio", slug: "deuda-personal-vs-deuda-de-negocio" },
      { title: "Riesgos de la deuda", slug: "riesgos-de-la-deuda" },
    ],
  },
  {
    title: "Crédito en la vida real",
    lessons: [
      { title: "¿Qué es el crédito?", slug: "que-es-el-credito" },
      { title: "¿Cómo funcionan las tarjetas de crédito?", slug: "como-funcionan-las-tarjetas-de-credito" },
      { title: "Intereses y CAT explicados fácil", slug: "intereses-y-cat-explicados-facil" },
      { title: "Pagos mínimos y consecuencias", slug: "pagos-minimos-y-consecuencias" },
      { title: "Errores comunes con tarjetas", slug: "errores-comunes-con-tarjetas" },
    ],
  },
  {
    title: "Manejar la deuda",
    lessons: [
      { title: "Saber cuánto debo realmente", slug: "saber-cuanto-debo-realmente" },
      { title: "Priorizar deudas", slug: "priorizar-deudas" },
      { title: "Refinanciar deudas", slug: "refinanciar-deudas" },
      { title: "Salir de deudas paso a paso", slug: "salir-de-deudas-paso-a-paso" },
      { title: "Evitar volver a endeudarme", slug: "evitar-volver-a-endeudarme" },
    ],
  },
  {
    title: "Deuda y emociones",
    lessons: [
      { title: "Estrés por deudas", slug: "estres-por-deudas" },
      { title: "Vergüenza y deuda", slug: "verguenza-y-deuda" },
      { title: "Negación financiera", slug: "negacion-financiera" },
      { title: "Tomar control sin culpa", slug: "tomar-control-sin-culpa" },
    ],
  },
  {
    title: "Reflexión y cierre",
    lessons: [
      { title: "Usar la deuda con conciencia", slug: "usar-la-deuda-con-conciencia" },
      { title: "Prepararme para el sistema financiero", slug: "prepararme-para-el-sistema-financiero" },
      { title: "Checkpoint: Mi relación con la deuda", slug: "checkpoint-mi-relacion-con-la-deuda" },
    ],
  },
]
