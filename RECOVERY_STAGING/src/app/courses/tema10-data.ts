export interface Tema10Lesson {
  title: string
  slug: string
  level: "Básico" | "Intermedio" | "Avanzado"
}

export interface Tema10Subtema {
  title: string
  lessons: Tema10Lesson[]
}

export const TEMA10_TITLE = "Planeación Financiera Básica"

export const TEMA10_SUBTEMAS: Tema10Subtema[] = [
  {
    title: "1 mes",
    lessons: [
      { title: "¿Cómo crear un plan de 30 días?", slug: "plan-de-30-dias", level: "Básico" },
      { title: "¿Cómo prever los gastos del mes?", slug: "prever-gastos-del-mes", level: "Básico" },
      { title: "¿Qué son los imprevistos y el colchón financiero?", slug: "imprevistos-y-colchon", level: "Intermedio" },
      { title: "¿Qué hacer si te pasas de tu presupuesto?", slug: "plan-de-recorte-si-me-paso", level: "Intermedio" },
      { title: "¿Cómo realizar un cierre mensual?", slug: "cierre-mensual-que-aprendi", level: "Avanzado" },
    ]
  },
  {
    title: "3 meses",
    lessons: [
      { title: "¿Cómo armar un plan trimestral simple?", slug: "plan-trimestral-simple", level: "Básico" },
      { title: "¿Qué hacer si ganas menos de lo esperado?", slug: "escenarios-gano-menos", level: "Básico" },
      { title: "¿Qué hacer si gastas más de lo planeado?", slug: "escenarios-gasto-mas", level: "Intermedio" },
      { title: "¿Cómo ajustar tus metas al trimestre?", slug: "ajustar-metas-al-trimestre", level: "Intermedio" },
      { title: "¿Cómo revisar y corregir a mitad del trimestre?", slug: "revisar-y-corregir-a-mitad", level: "Avanzado" },
    ]
  },
  {
    title: "Reglas",
    lessons: [
      { title: "¿Cómo definir tus propias reglas de gasto?", slug: "reglas-personales-de-gasto", level: "Básico" },
      { title: "¿Qué es la regla de prioridades?", slug: "regla-de-prioridades", level: "Básico" },
      { title: "¿Cómo manejar la regla de compras grandes?", slug: "regla-de-compras-grandes", level: "Intermedio" },
      { title: "¿Qué es la regla de ahorro mínimo?", slug: "regla-de-ahorro-minimo", level: "Intermedio" },
      { title: "¿Cómo crear tu primer manual personal de dinero?", slug: "manual-personal-de-dinero-version-1", level: "Avanzado" },
    ]
  },
]
