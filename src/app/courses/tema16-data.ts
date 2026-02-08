export type LessonLevel = "Básico" | "Intermedio" | "Avanzado"

export interface Tema16Lesson {
  title: string
  level: LessonLevel
  slug: string
}

export interface Tema16Subtema {
  title: string
  lessons: Tema16Lesson[]
}

export const TEMA16_SUBTEMAS: Tema16Subtema[] = [
  {
    title: "Qué es emprender",
    lessons: [
      { title: "Qué es emprender", level: "Básico", slug: "que-es-emprender" },
      { title: "Diferencia entre empleado, autoempleado y emprendedor", level: "Básico", slug: "diferencia-entre-empleado-autoempleado-y-emprendedor" },
      { title: "Por qué la gente emprende", level: "Básico", slug: "por-que-la-gente-emprende" },
      { title: "Mitos sobre emprender", level: "Básico", slug: "mitos-sobre-emprender" },
      { title: "Cambiar la forma de ver el emprendimiento", level: "Intermedio", slug: "cambiar-la-forma-de-ver-el-emprendimiento" },
    ],
  },
  {
    title: "Forma de pensar del emprendedor",
    lessons: [
      { title: "Pensar en soluciones", level: "Intermedio", slug: "pensar-en-soluciones" },
      { title: "Ver problemas como oportunidades", level: "Intermedio", slug: "ver-problemas-como-oportunidades" },
      { title: "Tolerar la incertidumbre", level: "Intermedio", slug: "tolerar-la-incertidumbre" },
      { title: "Aprender del error", level: "Intermedio", slug: "aprender-del-error" },
    ],
  },
  {
    title: "Responsabilidad y riesgo",
    lessons: [
      { title: "Tomar riesgos calculados", level: "Intermedio", slug: "tomar-riesgos-calculados" },
      { title: "Responsabilidad total del resultado", level: "Intermedio", slug: "responsabilidad-total-del-resultado" },
      { title: "Diferencia entre riesgo y imprudencia", level: "Avanzado", slug: "diferencia-entre-riesgo-y-imprudencia" },
      { title: "Aceptar la posibilidad de fracaso", level: "Avanzado", slug: "aceptar-la-posibilidad-de-fracaso" },
    ],
  },
  {
    title: "Hábitos del emprendedor",
    lessons: [
      { title: "Disciplina diaria", level: "Intermedio", slug: "disciplina-diaria" },
      { title: "Priorizar lo importante", level: "Intermedio", slug: "priorizar-lo-importante" },
      { title: "Gestión del tiempo", level: "Intermedio", slug: "gestion-del-tiempo" },
      { title: "Constancia a largo plazo", level: "Avanzado", slug: "constancia-a-largo-plazo" },
    ],
  },
  {
    title: "Emprender en la vida real",
    lessons: [
      { title: "Emprender sin dinero", level: "Intermedio", slug: "emprender-sin-dinero" },
      { title: "Emprender mientras estudio o trabajo", level: "Intermedio", slug: "emprender-mientras-estudio-o-trabajo" },
      { title: "Errores comunes al emprender", level: "Avanzado", slug: "errores-comunes-al-emprender" },
      { title: "Saber cuándo no emprender", level: "Avanzado", slug: "saber-cuando-no-emprender" },
    ],
  },
  {
    title: "Reflexión y cierre",
    lessons: [
      { title: "Pensar como emprendedor", level: "Intermedio", slug: "pensar-como-emprendedor" },
      { title: "Prepararme para crear un negocio", level: "Intermedio", slug: "prepararme-para-crear-un-negocio" },
      { title: "Checkpoint: Mi mentalidad emprendedora", level: "Avanzado", slug: "checkpoint-mi-mentalidad-emprendedora" },
    ],
  },
]
