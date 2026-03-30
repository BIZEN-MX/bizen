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
    title: "La Física del Ahorro",
    lessons: [
      { title: "Ahorro BIZEN: No es guardar, es acumular energía", slug: "ahorro-bizen-no-es-guardar-es-acumular", level: "Básico" },
      { title: "El Fondo de Emergencia de Acero", slug: "fondo-de-emergencia-de-acero", level: "Básico" },
      { title: "Sistemas de Automatización (Fricción Cero)", slug: "sistemas-de-automatizacion-friccion-cero", level: "Intermedio" },
      { title: "Ahorro por Objetivos (Bucket System)", slug: "ahorro-por-objetivos-bucket-system", level: "Intermedio" },
      { title: "La Tasa de Ahorro: Tu indicador maestro", slug: "la-tasa-de-ahorro-tu-indicador-maestro", level: "Avanzado" },
    ]
  },
  {
    title: "Estrategias de Retención",
    lessons: [
      { title: "El Reto de los 30 Días", slug: "reto-de-los-30-dias", level: "Básico" },
      { title: "Micro-ahorro: El poder de lo pequeño", slug: "micro-ahorro-el-poder-de-lo-pequeno", level: "Básico" },
      { title: "Inflación: El enemigo invisible", slug: "inflacion-el-enemigo-invisible", level: "Intermedio" },
      { title: "Ahorro Hedónico: No te prives, optimiza", slug: "ahorro-hedonico-no-te-prives-optimiza", level: "Intermedio" },
      { title: "Auditoría de Suscripciones Maestras", slug: "auditoria-de-suscripciones-maestras", level: "Avanzado" },
    ]
  },
  {
    title: "Hacia la Inversión",
    lessons: [
      { title: "Ahorro vs Inversión: El salto cuántico", slug: "ahorro-vs-inversion-el-salto-cuantico", level: "Básico" },
      { title: "Cuentas de Alto Rendimiento (Efectivo Inteligente)", slug: "cuentas-de-alto-rendimiento-efectivo-inteligente", level: "Básico" },
      { title: "El Costo de la Inacción", slug: "el-costo-de-la-inaccion", level: "Intermedio" },
      { title: "Protección contra Devaluación", slug: "proteccion-contra-devaluacion", level: "Intermedio" },
      { title: "Examen de Maestría en Acumulación", slug: "examen-maestria-acumulacion", level: "Avanzado" },
    ]
  },
]
