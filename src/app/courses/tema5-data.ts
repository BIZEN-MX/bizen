export interface Tema5Lesson {
  title: string
  slug: string
  level: "Básico" | "Intermedio" | "Avanzado"
}

export interface Tema5Subtema {
  title: string
  lessons: Tema5Lesson[]
}

export const TEMA5_TITLE = "Flujo de dinero"

export const TEMA5_SUBTEMAS: Tema5Subtema[] = [
  {
    title: "Entradas",
    lessons: [
      { title: "¿De dónde entra mi dinero hoy?", slug: "de-donde-entra-mi-dinero-hoy", level: "Básico" },
      { title: "Ingresos fijos vs variables", slug: "ingresos-fijos-vs-variables", level: "Básico" },
      { title: "Ingresos irregulares (cómo manejarlos)", slug: "ingresos-irregulares-como-manejarlos", level: "Intermedio" },
      { title: "Aumentar ingresos sin “trabajar más”", slug: "aumentar-ingresos-sin-trabajar-mas", level: "Intermedio" },
      { title: "Detectar mi fuente principal de riesgo", slug: "detectar-mi-fuente-principal-de-riesgo", level: "Avanzado" },
    ]
  },
  {
    title: "Salidas",
    lessons: [
      { title: "Acondo se va mi dinero", slug: "acondo-se-va-mi-dinero", level: "Básico" },
      { title: "Fugas de dinero (las 3 típicas)", slug: "fugas-de-dinero-las-3-tipicas", level: "Básico" },
      { title: "Gastar más de lo que entra (señales)", slug: "gastar-mas-de-lo-que-entra-senales", level: "Intermedio" },
      { title: "Ajuste rápido de salidas (plan 7 días)", slug: "ajuste-rapido-de-salidas-plan-7-dias", level: "Intermedio" },
      { title: "Caso: recuperar control del mes", slug: "caso-recuperar-control-del-mes", level: "Avanzado" },
    ]
  },
  {
    title: "Balance",
    lessons: [
      { title: "Balance simple (entra/sale)", slug: "balance-simple-entrasale", level: "Básico" },
      { title: "¿Qué pasa si siempre quedo en 0?", slug: "que-pasa-si-siempre-quedo-en-0", level: "Básico" },
      { title: "¿Cómo crear margen?", slug: "como-crear-margen", level: "Intermedio" },
      { title: "Margen como hábito (no accidente)", slug: "margen-como-habito-no-accidente", level: "Intermedio" },
      { title: "Semana de balance: seguimiento real", slug: "semana-de-balance-seguimiento-real", level: "Avanzado" },
    ]
  },
]
