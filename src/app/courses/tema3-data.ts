export interface Tema3Lesson {
  title: string
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
      { title: "¿Qué es un ingreso?", slug: "que-es-un-ingreso" },
      { title: "Ingresos activos", slug: "ingresos-activos" },
      { title: "Ingresos pasivos", slug: "ingresos-pasivos" },
      { title: "Ingresos fijos e ingresos variables", slug: "ingresos-fijos-e-ingresos-variables" },
      { title: "¿Por qué no todos los ingresos son iguales?", slug: "por-que-no-todos-los-ingresos-son-iguales" },
    ],
  },
  {
    title: "Mis fuentes de ingreso",
    lessons: [
      { title: "¿De dónde viene mi dinero hoy?", slug: "de-donde-viene-mi-dinero-hoy" },
      { title: "Trabajo, becas y apoyos", slug: "trabajo-becas-y-apoyos" },
      { title: "Ingresos ocasionales", slug: "ingresos-ocasionales" },
      { title: "Tener más de una fuente de ingreso", slug: "tener-mas-de-una-fuente-de-ingreso" },
      { title: "Riesgos de depender de una sola fuente", slug: "riesgos-de-depender-de-una-sola-fuente" },
    ],
  },
  {
    title: "Entender mis gastos",
    lessons: [
      { title: "¿Qué es un gasto?", slug: "que-es-un-gasto" },
      { title: "Gastos fijos", slug: "gastos-fijos" },
      { title: "Gastos variables", slug: "gastos-variables" },
      { title: "Gastos hormiga", slug: "gastos-hormiga" },
      { title: "Gastos invisibles", slug: "gastos-invisibles" },
    ],
  },
  {
    title: "¿Cómo gasto mi dinero?",
    lessons: [
      { title: "¿En qué se va mi dinero?", slug: "en-que-se-va-mi-dinero" },
      { title: "Gastar por necesidad vs por deseo", slug: "gastar-por-necesidad-vs-por-deseo" },
      { title: "Compras impulsivas", slug: "compras-impulsivas" },
      { title: "Influencia de la publicidad y redes", slug: "influencia-de-la-publicidad-y-redes" },
      { title: "Patrones de gasto personales", slug: "patrones-de-gasto-personales" },
    ],
  },
  {
    title: "Balance personal",
    lessons: [
      { title: "¿Qué es un balance entre ingresos y gastos?", slug: "que-es-un-balance-entre-ingresos-y-gastos" },
      { title: "¿Qué pasa cuando gasto más de lo que gano?", slug: "que-pasa-cuando-gasto-mas-de-lo-que-gano" },
      { title: "¿Qué pasa cuando gasto menos de lo que gano?", slug: "que-pasa-cuando-gasto-menos-de-lo-que-gano" },
      { title: "Identificar fugas de dinero", slug: "identificar-fugas-de-dinero" },
      { title: "Tomar control del flujo personal", slug: "tomar-control-del-flujo-personal" },
    ],
  },
  {
    title: "Reflexión y cierre",
    lessons: [
      { title: "Ver mi dinero con claridad", slug: "ver-mi-dinero-con-claridad" },
      { title: "Dejar de adivinar y empezar a medir", slug: "dejar-de-adivinar-y-empezar-a-medir" },
      { title: "Prepararme para el presupuesto", slug: "prepararme-para-el-presupuesto" },
      { title: "Checkpoint: Mi flujo de dinero", slug: "checkpoint-mi-flujo-de-dinero" },
    ],
  },
]
