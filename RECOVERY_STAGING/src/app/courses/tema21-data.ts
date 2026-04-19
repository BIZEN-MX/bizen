export interface Tema21Lesson {
  title: string
  slug: string
  level: "Básico" | "Intermedio" | "Avanzado"
}

export interface Tema21Subtema {
  title: string
  lessons: Tema21Lesson[]
}

export const TEMA21_TITLE = "Activos vs. Pasivos"

export const TEMA21_SUBTEMAS: Tema21Subtema[] = [
  {
    title: "Concepto",
    lessons: [
      { title: "¿Qué es un activo (simple y medible)?", slug: "que-es-un-activo-simple-y-medible", level: "Básico" },
      { title: "¿Qué es un pasivo (simple y medible)?", slug: "que-es-un-pasivo-simple-y-medible", level: "Básico" },
      { title: "¿Cómo distinguirlos en 10 segundos?", slug: "como-distinguirlos-en-10-segundos", level: "Intermedio" },
      { title: "¿Cómo identificar activos y pasivos en tu vida diaria?", slug: "activospasivos-en-tu-vida-diaria-prepa", level: "Intermedio" },
      { title: "Práctica: ¿Cómo clasificar 10 ejemplos reales?", slug: "mini-practica-clasificar-10-ejemplos", level: "Avanzado" },
    ]
  },
  {
    title: "Vida real",
    lessons: [
      { title: "¿Cuáles son los activos y pasivos más comunes en jóvenes?", slug: "ejemplos-tipicos-de-jovenes-lo-que-confunde", level: "Básico" },
      { title: "¿Qué cosas parecen activos pero realmente no lo son?", slug: "esto-parece-activo-pero-no-lo-es-casos", level: "Básico" },
      { title: "¿Cuál es el costo real de un pasivo?", slug: "el-costo-total-de-un-pasivo-mas-alla-del-precio", level: "Intermedio" },
      { title: "¿Qué activos requieren mantenimiento constante?", slug: "activo-que-requiere-mantenimiento-realidad", level: "Intermedio" },
      { title: "Caso práctico: ¿Cómo elegir entre activo y pasivo?", slug: "caso-elegir-entre-2-decisiones-activo-vs-pasivo", level: "Avanzado" },
    ]
  },
  {
    title: "Decisiones",
    lessons: [
      { title: "¿Cómo comprar sin destruir tu patrimonio?", slug: "reglas-para-comprar-sin-destruir-tu-patrimonio", level: "Básico" },
      { title: "¿Se puede convertir un gasto en una inversión?", slug: "convertir-gasto-en-inversion-cuando-si-se-puede", level: "Básico" },
      { title: "¿Por qué priorizar activos sobre lujos?", slug: "priorizar-activos-antes-de-lujos-sin-moralina", level: "Intermedio" },
      { title: "¿Cuáles son los errores financieros al aparentar?", slug: "errores-comunes-al-querer-verse-bien", level: "Intermedio" },
      { title: "Checkpoint: ¿Cuáles son tus reglas personales?", slug: "checkpoint-mis-reglas-personales-activospasivos", level: "Avanzado" },
    ]
  },
]
