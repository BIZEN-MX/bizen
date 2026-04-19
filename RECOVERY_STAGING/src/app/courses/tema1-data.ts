export interface Tema1Lesson {
  title: string
  slug: string
  level: "Básico" | "Intermedio" | "Avanzado"
}

export interface Tema1Subtema {
  title: string
  lessons: Tema1Lesson[]
}

export const TEMA1_TITLE = "Introducción a las Finanzas y Economía"

export const TEMA1_SUBTEMAS: Tema1Subtema[] = [
  {
    title: "1. Conceptos básicos de finanzas",
    lessons: [
      { title: "¿Qué es el dinero y las finanzas?", slug: "el-dinero-y-las-finanzas", level: "Básico" },
      { title: "¿Qué son las finanzas?", slug: "que-son-las-finanzas", level: "Básico" },
      { title: "¿Por qué son importantes las finanzas?", slug: "importancia-de-las-finanzas", level: "Básico" },
    ]
  },
  {
    title: "2. Conceptos básicos de economía",
    lessons: [
      { title: "¿Qué es la economía?", slug: "que-es-la-economia", level: "Básico" },
      { title: "¿Cómo se relaciona la economía con tu vida diaria?", slug: "economia-y-vida-diaria", level: "Básico" },
    ]
  },
  {
    title: "3. El dinero",
    lessons: [
      { title: "¿Qué es el dinero?", slug: "que-es-el-dinero", level: "Básico" },
      { title: "¿Cuáles son las funciones del dinero?", slug: "funciones-del-dinero", level: "Básico" },
      { title: "¿Cómo ha evolucionado el dinero?", slug: "evolucion-del-dinero", level: "Básico" },
    ]
  },
  {
    title: "4. Principios económicos",
    lessons: [
      { title: "¿Qué es la escasez?", slug: "principio-escasez", level: "Básico" },
      { title: "¿Qué son los recursos económicos?", slug: "recursos-economicos", level: "Básico" },
      { title: "¿Cómo tomamos decisiones financieras?", slug: "toma-de-decisiones", level: "Básico" },
    ]
  },
  {
    title: "5. Oferta y demanda",
    lessons: [
      { title: "¿Qué es la oferta?", slug: "que-es-la-oferta", level: "Básico" },
      { title: "¿Qué es la demanda?", slug: "que-es-la-demanda", level: "Básico" },
      { title: "¿Cómo se determina el precio de las cosas?", slug: "determinacion-del-precio", level: "Intermedio" },
    ]
  },
  {
    title: "6. El mercado",
    lessons: [
      { title: "¿Qué es el mercado?", slug: "que-es-el-mercado", level: "Básico" },
      { title: "¿Qué tipos de mercado existen?", slug: "tipos-de-mercado", level: "Intermedio" },
    ]
  },
  {
    title: "7. Inflación",
    lessons: [
      { title: "¿Qué es la inflación?", slug: "que-es-la-inflacion", level: "Básico" },
      { title: "¿Por qué aumentan los precios?", slug: "aumento-de-precios", level: "Básico" },
      { title: "¿Qué es el poder adquisitivo?", slug: "poder-adquisitivo", level: "Intermedio" },
    ]
  },
  {
    title: "8. Costo de oportunidad",
    lessons: [
      { title: "¿Qué es el costo de oportunidad?", slug: "que-es-costo-oportunidad", level: "Básico" },
      { title: "¿Por qué es clave en tus decisiones?", slug: "importancia-costo-oportunidad", level: "Intermedio" },
    ]
  },
  {
    title: "9. Educación financiera",
    lessons: [
      { title: "¿Qué es la educación financiera?", slug: "que-es-educacion-financiera", level: "Básico" },
      { title: "¿Por qué es importante?", slug: "importancia-educacion-financiera", level: "Básico" },
    ]
  },
  {
    title: "10. Sistema financiero en México",
    lessons: [
      { title: "¿Qué es el Banco de México (Banxico)?", slug: "banxico", level: "Intermedio" },
      { title: "¿Qué es la CONDUSEF?", slug: "condusef", level: "Intermedio" },
      { title: "¿Qué es el IPAB?", slug: "ipab", level: "Intermedio" },
      { title: "¿Qué hace cada institución financiera?", slug: "funciones-instituciones-financieras", level: "Intermedio" },
    ]
  },
]
