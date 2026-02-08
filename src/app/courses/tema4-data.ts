export type LessonLevel = "Básico" | "Intermedio" | "Avanzado"

export interface Tema4Lesson {
  title: string
  level: LessonLevel
  slug: string
}

export interface Tema4Subtema {
  title: string
  lessons: Tema4Lesson[]
}

export const TEMA4_SUBTEMAS: Tema4Subtema[] = [
  {
    title: "Qué es un presupuesto",
    lessons: [
      { title: "Qué es un presupuesto", level: "Básico", slug: "que-es-un-presupuesto" },
      { title: "Para qué sirve un presupuesto", level: "Básico", slug: "para-que-sirve-un-presupuesto" },
      { title: "Mitos sobre el presupuesto", level: "Básico", slug: "mitos-sobre-el-presupuesto" },
      { title: "Por qué muchas personas odian presupuestar", level: "Intermedio", slug: "por-que-muchas-personas-odian-presupuestar" },
      { title: "Cambiar la forma de ver el presupuesto", level: "Intermedio", slug: "cambiar-la-forma-de-ver-el-presupuesto" },
    ],
  },
  {
    title: "Tipos de presupuesto",
    lessons: [
      { title: "Presupuesto simple", level: "Básico", slug: "presupuesto-simple" },
      { title: "Presupuesto por categorías", level: "Básico", slug: "presupuesto-por-categorias" },
      { title: "Presupuesto mensual", level: "Básico", slug: "presupuesto-mensual" },
      { title: "Presupuesto flexible", level: "Intermedio", slug: "presupuesto-flexible" },
      { title: "Elegir el presupuesto correcto para mí", level: "Intermedio", slug: "elegir-el-presupuesto-correcto-para-mi" },
    ],
  },
  {
    title: "Construir mi presupuesto",
    lessons: [
      { title: "Identificar mis ingresos reales", level: "Básico", slug: "identificar-mis-ingresos-reales" },
      { title: "Listar mis gastos reales", level: "Básico", slug: "listar-mis-gastos-reales" },
      { title: "Priorizar gastos", level: "Intermedio", slug: "priorizar-gastos" },
      { title: "Ajustar sin frustrarme", level: "Intermedio", slug: "ajustar-sin-frustrarme" },
      { title: "Crear mi primer presupuesto", level: "Avanzado", slug: "crear-mi-primer-presupuesto" },
    ],
  },
  {
    title: "Usar el presupuesto en la vida real",
    lessons: [
      { title: "Seguir un presupuesto día a día", level: "Intermedio", slug: "seguir-un-presupuesto-dia-a-dia" },
      { title: "Qué hacer cuando no se cumple", level: "Intermedio", slug: "que-hacer-cuando-no-se-cumple" },
      { title: "Ajustar el presupuesto con el tiempo", level: "Intermedio", slug: "ajustar-el-presupuesto-con-el-tiempo" },
      { title: "Errores comunes al presupuestar", level: "Avanzado", slug: "errores-comunes-al-presupuestar" },
      { title: "Aprender del error sin rendirse", level: "Avanzado", slug: "aprender-del-error-sin-rendirse" },
    ],
  },
  {
    title: "Presupuesto y libertad",
    lessons: [
      { title: "Presupuesto no es restricción", level: "Intermedio", slug: "presupuesto-no-es-restriccion" },
      { title: "Usar el presupuesto para cumplir metas", level: "Intermedio", slug: "usar-el-presupuesto-para-cumplir-metas" },
      { title: "Presupuesto y tranquilidad mental", level: "Avanzado", slug: "presupuesto-y-tranquilidad-mental" },
      { title: "Diseñar un presupuesto sostenible", level: "Avanzado", slug: "disenar-un-presupuesto-sostenible" },
    ],
  },
  {
    title: "Reflexión y cierre",
    lessons: [
      { title: "El presupuesto como herramienta personal", level: "Intermedio", slug: "el-presupuesto-como-herramienta-personal" },
      { title: "Prepararme para ahorrar", level: "Intermedio", slug: "prepararme-para-ahorrar" },
      { title: "Checkpoint: Mi presupuesto personal", level: "Avanzado", slug: "checkpoint-mi-presupuesto-personal" },
    ],
  },
]
