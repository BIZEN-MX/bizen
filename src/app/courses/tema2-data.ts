export type LessonLevel = "Básico" | "Intermedio" | "Avanzado"

export interface Tema2Lesson {
  title: string
  level: LessonLevel
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
      { title: "Cómo intercambiaban las personas antes del dinero", level: "Básico", slug: "como-intercambiaban-antes-del-dinero" },
      { title: "Qué es el trueque", level: "Básico", slug: "que-es-el-trueque" },
      { title: "Problemas del trueque", level: "Básico", slug: "problemas-del-trueque" },
      { title: "Por qué el trueque no funcionaba bien", level: "Intermedio", slug: "por-que-el-trueque-no-funcionaba-bien" },
      { title: "La necesidad de una solución común", level: "Intermedio", slug: "la-necesidad-de-una-solucion-comun" },
    ],
  },
  {
    title: "Nace el dinero",
    lessons: [
      { title: "Qué es el dinero", level: "Básico", slug: "que-es-el-dinero" },
      { title: "Por qué el dinero facilita el intercambio", level: "Básico", slug: "por-que-el-dinero-facilita-el-intercambio" },
      { title: "Primeras formas de dinero", level: "Básico", slug: "primeras-formas-de-dinero" },
      { title: "Quién decide el valor del dinero", level: "Intermedio", slug: "quien-decide-el-valor-del-dinero" },
      { title: "Confianza y aceptación social", level: "Intermedio", slug: "confianza-y-aceptacion-social" },
    ],
  },
  {
    title: "El dinero y el poder",
    lessons: [
      { title: "Quién controla el dinero", level: "Intermedio", slug: "quien-controla-el-dinero" },
      { title: "El papel del Estado en el dinero", level: "Intermedio", slug: "el-papel-del-estado-en-el-dinero" },
      { title: "Por qué existen los impuestos", level: "Intermedio", slug: "por-que-existen-los-impuestos" },
      { title: "Control, confianza y reglas", level: "Intermedio", slug: "control-confianza-y-reglas" },
      { title: "Qué pasa cuando se abusa del poder del dinero", level: "Avanzado", slug: "que-pasa-cuando-se-abusa-del-poder-del-dinero" },
    ],
  },
  {
    title: "El dinero moderno",
    lessons: [
      { title: "Qué es el dinero fiduciario", level: "Básico", slug: "que-es-el-dinero-fiduciario" },
      { title: "Por qué el dinero ya no vale por sí mismo", level: "Intermedio", slug: "por-que-el-dinero-ya-no-vale-por-si-mismo" },
      { title: "El rol de los bancos", level: "Intermedio", slug: "el-rol-de-los-bancos" },
      { title: "Cómo se crea el dinero hoy", level: "Avanzado", slug: "como-se-crea-el-dinero-hoy" },
      { title: "Inflación explicada de forma simple", level: "Avanzado", slug: "inflacion-explicada-de-forma-simple" },
    ],
  },
  {
    title: "El dinero hoy",
    lessons: [
      { title: "Qué es el dinero digital", level: "Básico", slug: "que-es-el-dinero-digital" },
      { title: "Tarjetas, transferencias y pagos electrónicos", level: "Básico", slug: "tarjetas-transferencias-y-pagos-electronicos" },
      { title: "Qué son las criptomonedas", level: "Intermedio", slug: "que-son-las-criptomonedas" },
      { title: "Diferencia entre dinero físico y digital", level: "Intermedio", slug: "diferencia-entre-dinero-fisico-y-digital" },
      { title: "El futuro del dinero", level: "Avanzado", slug: "el-futuro-del-dinero" },
    ],
  },
  {
    title: "Reflexión y cierre",
    lessons: [
      { title: "El dinero como acuerdo social", level: "Intermedio", slug: "el-dinero-como-acuerdo-social" },
      { title: "El dinero cambia con el tiempo", level: "Intermedio", slug: "el-dinero-cambia-con-el-tiempo" },
      { title: "Adaptarse a nuevas reglas del dinero", level: "Avanzado", slug: "adaptarse-a-nuevas-reglas-del-dinero" },
      { title: "Checkpoint: Entender el dinero", level: "Avanzado", slug: "checkpoint-entender-el-dinero" },
    ],
  },
]
