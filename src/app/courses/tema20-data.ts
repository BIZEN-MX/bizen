export interface Tema20Lesson {
  title: string
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
      { title: "¿Qué son los ingresos de un negocio?", slug: "que-son-los-ingresos-de-un-negocio" },
      { title: "¿Qué son los costos?", slug: "que-son-los-costos" },
      { title: "¿Qué es la utilidad?", slug: "que-es-la-utilidad" },
      { title: "Ingresos no son ganancias", slug: "ingresos-no-son-ganancias" },
    ],
  },
  {
    title: "Tipos de costos",
    lessons: [
      { title: "Costos fijos", slug: "costos-fijos" },
      { title: "Costos variables", slug: "costos-variables" },
      { title: "Costos directos", slug: "costos-directos" },
      { title: "Costos indirectos", slug: "costos-indirectos" },
    ],
  },
  {
    title: "Calcular utilidad",
    lessons: [
      { title: "¿Cómo calcular la utilidad?", slug: "como-calcular-la-utilidad" },
      { title: "Margen de utilidad", slug: "margen-de-utilidad" },
      { title: "Errores comunes al calcular", slug: "errores-comunes-al-calcular" },
    ],
  },
  {
    title: "Decisiones con números",
    lessons: [
      { title: "Subir o bajar precios", slug: "subir-o-bajar-precios" },
      { title: "Reducir costos sin afectar valor", slug: "reducir-costos-sin-afectar-valor" },
      { title: "Aumentar utilidad", slug: "aumentar-utilidad" },
    ],
  },
  {
    title: "Reflexión y cierre",
    lessons: [
      { title: "Pensar en términos de utilidad", slug: "pensar-en-terminos-de-utilidad" },
      { title: "Checkpoint: Entender el dinero del negocio", slug: "checkpoint-entender-el-dinero-del-negocio" },
    ],
  },
]
