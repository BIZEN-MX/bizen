export interface Tema5Lesson {
  title: string
  slug: string
  level: "Básico" | "Intermedio" | "Avanzado"
}

export interface Tema5Subtema {
  title: string
  lessons: Tema5Lesson[]
}

export const TEMA5_TITLE = "Ahorro Inteligente: Ingeniería de Acumulación"

export const TEMA5_SUBTEMAS: Tema5Subtema[] = [
  {
    title: "1. La física del ahorro",
    lessons: [
      { title: "¿Qué es el ahorro BIZEN?", slug: "ahorro-bizen-no-es-guardar-es-acumular", level: "Básico" },
      { title: "¿Cómo construir un fondo de emergencia sólido?", slug: "fondo-de-emergencia-de-acero", level: "Básico" },
      { title: "¿Cómo automatizar tus ahorros?", slug: "sistemas-de-automatizacion-friccion-cero", level: "Intermedio" },
      { title: "¿Cómo funciona el ahorro por objetivos?", slug: "ahorro-por-objetivos-bucket-system", level: "Intermedio" },
      { title: "¿Qué es la tasa de ahorro?", slug: "la-tasa-de-ahorro-tu-indicador-maestro", level: "Avanzado" },
    ]
  },
  {
    title: "2. Estrategias de retención",
    lessons: [
      { title: "¿En qué consiste el reto de los 30 días?", slug: "reto-de-los-30-dias", level: "Básico" },
      { title: "¿Qué es el micro-ahorro?", slug: "micro-ahorro-el-poder-de-lo-pequeno", level: "Básico" },
      { title: "¿Cómo afecta la inflación a tus ahorros?", slug: "inflacion-el-enemigo-invisible", level: "Intermedio" },
      { title: "¿Qué es el ahorro hedónico?", slug: "ahorro-hedonico-no-te-prives-optimiza", level: "Intermedio" },
      { title: "¿Cómo realizar una auditoría de suscripciones?", slug: "auditoria-de-suscripciones-maestras", level: "Avanzado" },
    ]
  },
  {
    title: "3. Hacia la inversión",
    lessons: [
      { title: "¿Cuál es la diferencia entre ahorro e inversión?", slug: "ahorro-vs-inversion-el-salto-cuantico", level: "Básico" },
      { title: "¿Qué son las cuentas de alto rendimiento?", slug: "cuentas-de-alto-rendimiento-efectivo-inteligente", level: "Básico" },
      { title: "¿Cuál es el costo de la inacción?", slug: "el-costo-de-la-inaccion", level: "Intermedio" },
      { title: "¿Cómo protegerte contra la devaluación?", slug: "proteccion-contra-devaluacion", level: "Intermedio" },
      { title: "¿Estás listo para el examen de maestría?", slug: "examen-maestria-acumulacion", level: "Avanzado" },
    ]
  },
]
