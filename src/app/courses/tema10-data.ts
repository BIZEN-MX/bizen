export interface Tema10Lesson {
  title: string
  slug: string
  level: "Básico" | "Intermedio" | "Avanzado"
}

export interface Tema10Subtema {
  title: string
  lessons: Tema10Lesson[]
}

export const TEMA10_TITLE = "Planeación financiera (básica)"

export const TEMA10_SUBTEMAS: Tema10Subtema[] = [
  {
    title: "1 mes",
    lessons: [
      { title: "Plan de 30 días", slug: "plan-de-30-dias", level: "Básico" },
      { title: "Prever gastos del mes", slug: "prever-gastos-del-mes", level: "Básico" },
      { title: "Imprevistos y colchón", slug: "imprevistos-y-colchon", level: "Intermedio" },
      { title: "Plan de recorte si me paso", slug: "plan-de-recorte-si-me-paso", level: "Intermedio" },
      { title: "Cierre mensual (qué aprendí)", slug: "cierre-mensual-que-aprendi", level: "Avanzado" },
    ]
  },
  {
    title: "3 meses",
    lessons: [
      { title: "Plan trimestral simple", slug: "plan-trimestral-simple", level: "Básico" },
      { title: "Escenarios: gano menos", slug: "escenarios-gano-menos", level: "Básico" },
      { title: "Escenarios: gasto más", slug: "escenarios-gasto-mas", level: "Intermedio" },
      { title: "Ajustar metas al trimestre", slug: "ajustar-metas-al-trimestre", level: "Intermedio" },
      { title: "Revisar y corregir a mitad", slug: "revisar-y-corregir-a-mitad", level: "Avanzado" },
    ]
  },
  {
    title: "Reglas",
    lessons: [
      { title: "Reglas personales de gasto", slug: "reglas-personales-de-gasto", level: "Básico" },
      { title: "Regla de prioridades", slug: "regla-de-prioridades", level: "Básico" },
      { title: "Regla de compras grandes", slug: "regla-de-compras-grandes", level: "Intermedio" },
      { title: "Regla de ahorro mínimo", slug: "regla-de-ahorro-minimo", level: "Intermedio" },
      { title: "Manual personal de dinero (versión 1)", slug: "manual-personal-de-dinero-version-1", level: "Avanzado" },
    ]
  },
]
