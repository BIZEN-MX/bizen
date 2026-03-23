export interface Tema2Lesson {
  title: string
  slug: string
  level: "Básico" | "Intermedio" | "Avanzado"
}

export interface Tema2Subtema {
  title: string
  lessons: Tema2Lesson[]
}

export const TEMA2_TITLE = "Mentalidad financiera (sesgos y decisiones)"

export const TEMA2_SUBTEMAS: Tema2Subtema[] = [
  {
    title: "Sesgos comunes",
    lessons: [
      { title: "¿Qué es un sesgo y por qué te afecta?", slug: "que-es-un-sesgo-y-por-que-te-afecta", level: "Básico" },
      { title: "Sesgo de comparación (redes)", slug: "sesgo-de-comparacion-redes", level: "Básico" },
      { title: "Sesgo de confirmación (solo veo lo que quiero)", slug: "sesgo-de-confirmacion-solo-veo-lo-que-quiero", level: "Intermedio" },
      { title: "Aversión a la pérdida (miedo a perder)", slug: "aversion-a-la-perdida-miedo-a-perder", level: "Intermedio" },
      { title: "¿Cómo detectar mis sesgos en compras reales?", slug: "como-detectar-mis-sesgos-en-compras-reales", level: "Avanzado" },
    ]
  },
  {
    title: "Impulsos",
    lessons: [
      { title: "Impulso vs plan (diferencia real)", slug: "impulso-vs-plan-diferencia-real", level: "Básico" },
      { title: "Gatillos: estrés, aburrimiento, presión", slug: "gatillos-estres-aburrimiento-presion", level: "Básico" },
      { title: "“Me lo merezco” como trampa mental", slug: "me-lo-merezco-como-trampa-mental", level: "Intermedio" },
      { title: "Frenos rápidos (reglas de 10 min / 24h)", slug: "frenos-rapidos-reglas-de-10-min-24h", level: "Intermedio" },
      { title: "Caso: compra impulsiva y consecuencia", slug: "caso-compra-impulsiva-y-consecuencia", level: "Avanzado" },
    ]
  },
  {
    title: "Largo plazo",
    lessons: [
      { title: "Paciencia financiera aplicada", slug: "paciencia-financiera-aplicada", level: "Básico" },
      { title: "Proceso real vs resultados rápidos", slug: "proceso-real-vs-resultados-rapidos", level: "Básico" },
      { title: "Interés compuesto como idea (sin instrumentos aún)", slug: "interes-compuesto-como-idea-sin-instrumentos-aun", level: "Intermedio" },
      { title: "Consistencia: hábitos > motivación", slug: "consistencia-habitos-motivacion", level: "Intermedio" },
      { title: "Plan mental de 30 días (largo plazo corto)", slug: "plan-mental-de-30-dias-largo-plazo-corto", level: "Avanzado" },
    ]
  },
]
