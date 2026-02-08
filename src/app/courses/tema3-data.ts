export type LessonLevel = "Básico" | "Intermedio" | "Avanzado"

export interface Tema3Lesson {
  title: string
  level: LessonLevel
  slug: string
}

export interface Tema3Subtema {
  title: string
  lessons: Tema3Lesson[]
}

export const TEMA3_SUBTEMAS: Tema3Subtema[] = [
  {
    title: "Entender mis ingresos",
    lessons: [
      { title: "Qué es un ingreso", level: "Básico", slug: "que-es-un-ingreso" },
      { title: "Ingresos activos", level: "Básico", slug: "ingresos-activos" },
      { title: "Ingresos pasivos", level: "Básico", slug: "ingresos-pasivos" },
      { title: "Ingresos fijos e ingresos variables", level: "Básico", slug: "ingresos-fijos-e-ingresos-variables" },
      { title: "Por qué no todos los ingresos son iguales", level: "Intermedio", slug: "por-que-no-todos-los-ingresos-son-iguales" },
    ],
  },
  {
    title: "Mis fuentes de ingreso",
    lessons: [
      { title: "De dónde viene mi dinero hoy", level: "Básico", slug: "de-donde-viene-mi-dinero-hoy" },
      { title: "Trabajo, becas y apoyos", level: "Básico", slug: "trabajo-becas-y-apoyos" },
      { title: "Ingresos ocasionales", level: "Intermedio", slug: "ingresos-ocasionales" },
      { title: "Tener más de una fuente de ingreso", level: "Intermedio", slug: "tener-mas-de-una-fuente-de-ingreso" },
      { title: "Riesgos de depender de una sola fuente", level: "Intermedio", slug: "riesgos-de-depender-de-una-sola-fuente" },
    ],
  },
  {
    title: "Entender mis gastos",
    lessons: [
      { title: "Qué es un gasto", level: "Básico", slug: "que-es-un-gasto" },
      { title: "Gastos fijos", level: "Básico", slug: "gastos-fijos" },
      { title: "Gastos variables", level: "Básico", slug: "gastos-variables" },
      { title: "Gastos hormiga", level: "Básico", slug: "gastos-hormiga" },
      { title: "Gastos invisibles", level: "Intermedio", slug: "gastos-invisibles" },
    ],
  },
  {
    title: "Cómo gasto mi dinero",
    lessons: [
      { title: "En qué se va mi dinero", level: "Básico", slug: "en-que-se-va-mi-dinero" },
      { title: "Gastar por necesidad vs por deseo", level: "Intermedio", slug: "gastar-por-necesidad-vs-por-deseo" },
      { title: "Compras impulsivas", level: "Intermedio", slug: "compras-impulsivas" },
      { title: "Influencia de la publicidad y redes", level: "Intermedio", slug: "influencia-de-la-publicidad-y-redes" },
      { title: "Patrones de gasto personales", level: "Avanzado", slug: "patrones-de-gasto-personales" },
    ],
  },
  {
    title: "Balance personal",
    lessons: [
      { title: "Qué es un balance entre ingresos y gastos", level: "Básico", slug: "que-es-un-balance-entre-ingresos-y-gastos" },
      { title: "Qué pasa cuando gasto más de lo que gano", level: "Intermedio", slug: "que-pasa-cuando-gasto-mas-de-lo-que-gano" },
      { title: "Qué pasa cuando gasto menos de lo que gano", level: "Intermedio", slug: "que-pasa-cuando-gasto-menos-de-lo-que-gano" },
      { title: "Identificar fugas de dinero", level: "Avanzado", slug: "identificar-fugas-de-dinero" },
      { title: "Tomar control del flujo personal", level: "Avanzado", slug: "tomar-control-del-flujo-personal" },
    ],
  },
  {
    title: "Reflexión y cierre",
    lessons: [
      { title: "Ver mi dinero con claridad", level: "Intermedio", slug: "ver-mi-dinero-con-claridad" },
      { title: "Dejar de adivinar y empezar a medir", level: "Intermedio", slug: "dejar-de-adivinar-y-empezar-a-medir" },
      { title: "Prepararme para el presupuesto", level: "Avanzado", slug: "prepararme-para-el-presupuesto" },
      { title: "Checkpoint: Mi flujo de dinero", level: "Avanzado", slug: "checkpoint-mi-flujo-de-dinero" },
    ],
  },
]
