export type LessonLevel = "Básico" | "Intermedio" | "Avanzado"

export interface Tema20Lesson {
  title: string
  level: LessonLevel
  slug: string
}

export interface Tema20Subtema {
  title: string
  lessons: Tema20Lesson[]
}

export const TEMA20_SUBTEMAS: Tema20Subtema[] = [
  {
    title: "Entender el dinero del negocio",
    lessons: [
      { title: "Qué son los ingresos de un negocio", level: "Básico", slug: "que-son-los-ingresos-de-un-negocio" },
      { title: "Qué son los costos", level: "Básico", slug: "que-son-los-costos" },
      { title: "Qué es la utilidad", level: "Básico", slug: "que-es-la-utilidad" },
      { title: "Ingresos no son ganancias", level: "Básico", slug: "ingresos-no-son-ganancias" },
    ],
  },
  {
    title: "Tipos de costos",
    lessons: [
      { title: "Costos fijos", level: "Básico", slug: "costos-fijos" },
      { title: "Costos variables", level: "Básico", slug: "costos-variables" },
      { title: "Costos directos", level: "Intermedio", slug: "costos-directos" },
      { title: "Costos indirectos", level: "Intermedio", slug: "costos-indirectos" },
    ],
  },
  {
    title: "Calcular utilidad",
    lessons: [
      { title: "Cómo calcular la utilidad", level: "Intermedio", slug: "como-calcular-la-utilidad" },
      { title: "Margen de utilidad", level: "Intermedio", slug: "margen-de-utilidad" },
      { title: "Errores comunes al calcular", level: "Avanzado", slug: "errores-comunes-al-calcular" },
    ],
  },
  {
    title: "Decisiones con números",
    lessons: [
      { title: "Subir o bajar precios", level: "Intermedio", slug: "subir-o-bajar-precios" },
      { title: "Reducir costos sin afectar valor", level: "Intermedio", slug: "reducir-costos-sin-afectar-valor" },
      { title: "Aumentar utilidad", level: "Avanzado", slug: "aumentar-utilidad" },
    ],
  },
  {
    title: "Reflexión y cierre",
    lessons: [
      { title: "Pensar en términos de utilidad", level: "Intermedio", slug: "pensar-en-terminos-de-utilidad" },
      { title: "Checkpoint: Entender el dinero del negocio", level: "Avanzado", slug: "checkpoint-entender-el-dinero-del-negocio" },
    ],
  },
]
