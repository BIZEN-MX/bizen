export interface Tema2Lesson {
  title: string
  slug: string
}

export interface Tema2Subtema {
  title: string
  lessons: Tema2Lesson[]
}

export const TEMA2_SUBTEMAS: Tema2Subtema[] = [
  {
    title: "Antes del dinero",
    lessons: [
      { title: "¿Cómo intercambiaban las personas antes del dinero?", slug: "como-intercambiaban-antes-del-dinero" },
      { title: "¿Qué es el trueque?", slug: "que-es-el-trueque" },
      { title: "Problemas del trueque", slug: "problemas-del-trueque" },
      { title: "¿Por qué el trueque no funcionaba bien?", slug: "por-que-el-trueque-no-funcionaba-bien" },
      { title: "La necesidad de una solución común", slug: "la-necesidad-de-una-solucion-comun" },
    ],
  },
  {
    title: "Nace el dinero",
    lessons: [
      { title: "¿Qué es el dinero?", slug: "que-es-el-dinero" },
      { title: "¿Por qué el dinero facilita el intercambio?", slug: "por-que-el-dinero-facilita-el-intercambio" },
      { title: "Primeras formas de dinero", slug: "primeras-formas-de-dinero" },
      { title: "¿Quién decide el valor del dinero?", slug: "quien-decide-el-valor-del-dinero" },
      { title: "Confianza y aceptación social", slug: "confianza-y-aceptacion-social" },
    ],
  },
  {
    title: "El dinero y el poder",
    lessons: [
      { title: "¿Quién controla el dinero?", slug: "quien-controla-el-dinero" },
      { title: "El papel del Estado en el dinero", slug: "el-papel-del-estado-en-el-dinero" },
      { title: "¿Por qué existen los impuestos?", slug: "por-que-existen-los-impuestos" },
      { title: "Control, confianza y reglas", slug: "control-confianza-y-reglas" },
      { title: "¿Qué pasa cuando se abusa del poder del dinero?", slug: "que-pasa-cuando-se-abusa-del-poder-del-dinero" },
    ],
  },
  {
    title: "El dinero moderno",
    lessons: [
      { title: "¿Qué es el dinero fiduciario?", slug: "que-es-el-dinero-fiduciario" },
      { title: "¿Por qué el dinero ya no vale por sí mismo?", slug: "por-que-el-dinero-ya-no-vale-por-si-mismo" },
      { title: "El rol de los bancos", slug: "el-rol-de-los-bancos" },
      { title: "¿Cómo se crea el dinero hoy?", slug: "como-se-crea-el-dinero-hoy" },
      { title: "Inflación explicada de forma simple", slug: "inflacion-explicada-de-forma-simple" },
    ],
  },
  {
    title: "El dinero hoy",
    lessons: [
      { title: "¿Qué es el dinero digital?", slug: "que-es-el-dinero-digital" },
      { title: "Tarjetas, transferencias y pagos electrónicos", slug: "tarjetas-transferencias-y-pagos-electronicos" },
      { title: "¿Qué son las criptomonedas?", slug: "que-son-las-criptomonedas" },
      { title: "Diferencia entre dinero físico y digital", slug: "diferencia-entre-dinero-fisico-y-digital" },
      { title: "El futuro del dinero", slug: "el-futuro-del-dinero" },
    ],
  },
  {
    title: "Reflexión y cierre",
    lessons: [
      { title: "El dinero como acuerdo social", slug: "el-dinero-como-acuerdo-social" },
      { title: "El dinero cambia con el tiempo", slug: "el-dinero-cambia-con-el-tiempo" },
      { title: "Adaptarse a nuevas reglas del dinero", slug: "adaptarse-a-nuevas-reglas-del-dinero" },
      { title: "Checkpoint: Entender el dinero", slug: "checkpoint-entender-el-dinero" },
    ],
  },
]
