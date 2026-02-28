export interface Tema4Lesson {
  title: string
  slug: string
}

export interface Tema4Subtema {
  title: string
  lessons: Tema4Lesson[]
}

export const TEMA4_SUBTEMAS: Tema4Subtema[] = [
  {
    title: "¿Qué es un presupuesto?",
    lessons: [
      { title: "¿Qué es un presupuesto?", slug: "que-es-un-presupuesto" },
      { title: "¿Para qué sirve un presupuesto?", slug: "para-que-sirve-un-presupuesto" },
      { title: "Mitos sobre el presupuesto", slug: "mitos-sobre-el-presupuesto" },
      { title: "¿Por qué muchas personas odian presupuestar?", slug: "por-que-muchas-personas-odian-presupuestar" },
      { title: "Cambiar la forma de ver el presupuesto", slug: "cambiar-la-forma-de-ver-el-presupuesto" },
    ],
  },
  {
    title: "Tipos de presupuesto",
    lessons: [
      { title: "Presupuesto simple", slug: "presupuesto-simple" },
      { title: "Presupuesto por categorías", slug: "presupuesto-por-categorias" },
      { title: "Presupuesto mensual", slug: "presupuesto-mensual" },
      { title: "Presupuesto flexible", slug: "presupuesto-flexible" },
      { title: "Elegir el presupuesto correcto para mí", slug: "elegir-el-presupuesto-correcto-para-mi" },
    ],
  },
  {
    title: "Construir mi presupuesto",
    lessons: [
      { title: "Identificar mis ingresos reales", slug: "identificar-mis-ingresos-reales" },
      { title: "Listar mis gastos reales", slug: "listar-mis-gastos-reales" },
      { title: "Priorizar gastos", slug: "priorizar-gastos" },
      { title: "Ajustar sin frustrarme", slug: "ajustar-sin-frustrarme" },
      { title: "Crear mi primer presupuesto", slug: "crear-mi-primer-presupuesto" },
    ],
  },
  {
    title: "Usar el presupuesto en la vida real",
    lessons: [
      { title: "Seguir un presupuesto día a día", slug: "seguir-un-presupuesto-dia-a-dia" },
      { title: "¿Qué hacer cuando no se cumple?", slug: "que-hacer-cuando-no-se-cumple" },
      { title: "Ajustar el presupuesto con el tiempo", slug: "ajustar-el-presupuesto-con-el-tiempo" },
      { title: "Errores comunes al presupuestar", slug: "errores-comunes-al-presupuestar" },
      { title: "Aprender del error sin rendirse", slug: "aprender-del-error-sin-rendirse" },
    ],
  },
  {
    title: "Presupuesto y libertad",
    lessons: [
      { title: "Presupuesto no es restricción", slug: "presupuesto-no-es-restriccion" },
      { title: "Usar el presupuesto para cumplir metas", slug: "usar-el-presupuesto-para-cumplir-metas" },
      { title: "Presupuesto y tranquilidad mental", slug: "presupuesto-y-tranquilidad-mental" },
      { title: "Diseñar un presupuesto sostenible", slug: "disenar-un-presupuesto-sostenible" },
    ],
  },
  {
    title: "Reflexión y cierre",
    lessons: [
      { title: "El presupuesto como herramienta personal", slug: "el-presupuesto-como-herramienta-personal" },
      { title: "Prepararme para ahorrar", slug: "prepararme-para-ahorrar" },
      { title: "Checkpoint: Mi presupuesto personal", slug: "checkpoint-mi-presupuesto-personal" },
    ],
  },
]
