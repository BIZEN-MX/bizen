export interface Tema21Lesson {
  title: string
  slug: string
  level: "Básico" | "Intermedio" | "Avanzado"
}

export interface Tema21Subtema {
  title: string
  lessons: Tema21Lesson[]
}

export const TEMA21_TITLE = "Activos vs pasivos"

export const TEMA21_SUBTEMAS: Tema21Subtema[] = [
  {
    title: "Concepto",
    lessons: [
      { title: "¿Qué es un activo (simple y medible)?", slug: "que-es-un-activo-simple-y-medible", level: "Básico" },
      { title: "¿Qué es un pasivo (simple y medible)?", slug: "que-es-un-pasivo-simple-y-medible", level: "Básico" },
      { title: "¿Cómo distinguirlos en 10 segundos?", slug: "como-distinguirlos-en-10-segundos", level: "Intermedio" },
      { title: "Activos/pasivos en tu vida diaria (prepa)", slug: "activospasivos-en-tu-vida-diaria-prepa", level: "Intermedio" },
      { title: "Mini práctica: clasificar 10 ejemplos", slug: "mini-practica-clasificar-10-ejemplos", level: "Avanzado" },
    ]
  },
  {
    title: "Vida real",
    lessons: [
      { title: "Ejemplos típicos de jóvenes (lo que confunde)", slug: "ejemplos-tipicos-de-jovenes-lo-que-confunde", level: "Básico" },
      { title: "“Esto parece activo pero no lo es” (casos)", slug: "esto-parece-activo-pero-no-lo-es-casos", level: "Básico" },
      { title: "El costo total de un pasivo (más allá del precio)", slug: "el-costo-total-de-un-pasivo-mas-alla-del-precio", level: "Intermedio" },
      { title: "Activo que requiere mantenimiento (realidad)", slug: "activo-que-requiere-mantenimiento-realidad", level: "Intermedio" },
      { title: "Caso: elegir entre 2 decisiones (activo vs pasivo)", slug: "caso-elegir-entre-2-decisiones-activo-vs-pasivo", level: "Avanzado" },
    ]
  },
  {
    title: "Decisiones",
    lessons: [
      { title: "Reglas para comprar sin destruir tu patrimonio", slug: "reglas-para-comprar-sin-destruir-tu-patrimonio", level: "Básico" },
      { title: "Convertir gasto en inversión (cuando sí se puede)", slug: "convertir-gasto-en-inversion-cuando-si-se-puede", level: "Básico" },
      { title: "Priorizar activos antes de lujos (sin moralina)", slug: "priorizar-activos-antes-de-lujos-sin-moralina", level: "Intermedio" },
      { title: "Errores comunes al “querer verse bien”", slug: "errores-comunes-al-querer-verse-bien", level: "Intermedio" },
      { title: "Checkpoint: mis reglas personales activos/pasivos", slug: "checkpoint-mis-reglas-personales-activospasivos", level: "Avanzado" },
    ]
  },
]
