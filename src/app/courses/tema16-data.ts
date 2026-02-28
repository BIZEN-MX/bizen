export interface Tema16Lesson {
  title: string
  slug: string
}

export interface Tema16Subtema {
  title: string
  lessons: Tema16Lesson[]
}

export const TEMA16_SUBTEMAS: Tema16Subtema[] = [
  {
    title: "¿Qué es emprender?",
    lessons: [
      { title: "¿Qué es emprender?", slug: "que-es-emprender" },
      { title: "Diferencia entre empleado, autoempleado y emprendedor", slug: "diferencia-entre-empleado-autoempleado-y-emprendedor" },
      { title: "¿Por qué la gente emprende?", slug: "por-que-la-gente-emprende" },
      { title: "Mitos sobre emprender", slug: "mitos-sobre-emprender" },
      { title: "Cambiar la forma de ver el emprendimiento", slug: "cambiar-la-forma-de-ver-el-emprendimiento" },
    ],
  },
  {
    title: "Forma de pensar del emprendedor",
    lessons: [
      { title: "Pensar en soluciones", slug: "pensar-en-soluciones" },
      { title: "Ver problemas como oportunidades", slug: "ver-problemas-como-oportunidades" },
      { title: "Tolerar la incertidumbre", slug: "tolerar-la-incertidumbre" },
      { title: "Aprender del error", slug: "aprender-del-error" },
    ],
  },
  {
    title: "Responsabilidad y riesgo",
    lessons: [
      { title: "Tomar riesgos calculados", slug: "tomar-riesgos-calculados" },
      { title: "Responsabilidad total del resultado", slug: "responsabilidad-total-del-resultado" },
      { title: "Diferencia entre riesgo y imprudencia", slug: "diferencia-entre-riesgo-y-imprudencia" },
      { title: "Aceptar la posibilidad de fracaso", slug: "aceptar-la-posibilidad-de-fracaso" },
    ],
  },
  {
    title: "Hábitos del emprendedor",
    lessons: [
      { title: "Disciplina diaria", slug: "disciplina-diaria" },
      { title: "Priorizar lo importante", slug: "priorizar-lo-importante" },
      { title: "Gestión del tiempo", slug: "gestion-del-tiempo" },
      { title: "Constancia a largo plazo", slug: "constancia-a-largo-plazo" },
    ],
  },
  {
    title: "Emprender en la vida real",
    lessons: [
      { title: "Emprender sin dinero", slug: "emprender-sin-dinero" },
      { title: "Emprender mientras estudio o trabajo", slug: "emprender-mientras-estudio-o-trabajo" },
      { title: "Errores comunes al emprender", slug: "errores-comunes-al-emprender" },
      { title: "Saber cuándo no emprender", slug: "saber-cuando-no-emprender" },
    ],
  },
  {
    title: "Reflexión y cierre",
    lessons: [
      { title: "Pensar como emprendedor", slug: "pensar-como-emprendedor" },
      { title: "Prepararme para crear un negocio", slug: "prepararme-para-crear-un-negocio" },
      { title: "Checkpoint: Mi mentalidad emprendedora", slug: "checkpoint-mi-mentalidad-emprendedora" },
    ],
  },
]
