export interface Tema1Lesson {
  title: string
  slug: string
  level: "Básico" | "Intermedio" | "Avanzado"
}

export interface Tema1Subtema {
  title: string
  lessons: Tema1Lesson[]
}

export const TEMA1_TITLE = "Relación con el dinero"

export const TEMA1_SUBTEMAS: Tema1Subtema[] = [
  {
    title: "Percepción",
    lessons: [
      { title: "¿Qué es el dinero para mí?", slug: "que-es-el-dinero-para-mi", level: "Básico" },
      { title: "¿Qué espero del dinero?", slug: "que-espero-del-dinero", level: "Básico" },
      { title: "Dinero como seguridad vs libertad", slug: "dinero-como-seguridad-vs-libertad", level: "Intermedio" },
      { title: "Dinero como presión vs oportunidad", slug: "dinero-como-presion-vs-oportunidad", level: "Intermedio" },
      { title: "Identificar mi “definición personal” del dinero", slug: "identificar-mi-definicion-personal-del-dinero", level: "Avanzado" },
    ]
  },
  {
    title: "Emoción",
    lessons: [
      { title: "¿Cómo me hace sentir el dinero?", slug: "como-me-hace-sentir-el-dinero", level: "Básico" },
      { title: "Señales de emoción dominando una decisión", slug: "senales-de-emocion-dominando-una-decision", level: "Básico" },
      { title: "Pausa financiera (reglas anti-impulso)", slug: "pausa-financiera-reglas-anti-impulso", level: "Intermedio" },
      { title: "Culpa y ansiedad financiera (cómo se forman)", slug: "culpa-y-ansiedad-financiera-como-se-forman", level: "Intermedio" },
      { title: "Emoción vs decisión (casos reales)", slug: "emocion-vs-decision-casos-reales", level: "Avanzado" },
    ]
  },
  {
    title: "Creencias",
    lessons: [
      { title: "Mis primeras creencias sobre el dinero", slug: "mis-primeras-creencias-sobre-el-dinero", level: "Básico" },
      { title: "Expectativas vs realidad financiera", slug: "expectativas-vs-realidad-financiera", level: "Básico" },
      { title: "Frases heredadas que me limitan", slug: "frases-heredadas-que-me-limitan", level: "Intermedio" },
      { title: "¿Cómo cuestionar una creencia con evidencia?", slug: "como-cuestionar-una-creencia-con-evidencia", level: "Intermedio" },
      { title: "Reescribir creencias en reglas útiles", slug: "reescribir-creencias-en-reglas-utiles", level: "Avanzado" },
    ]
  },
]
