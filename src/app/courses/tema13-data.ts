export interface Tema13Lesson {
  title: string
  slug: string
  level: "Básico" | "Intermedio" | "Avanzado"
}

export interface Tema13Subtema {
  title: string
  lessons: Tema13Lesson[]
}

export const TEMA13_TITLE = "Historial crediticio"

export const TEMA13_SUBTEMAS: Tema13Subtema[] = [
  {
    title: "¿Qué es y por qué importa?",
    lessons: [
      { title: "¿Qué es historial crediticio (en simple)?", slug: "que-es-historial-crediticio-en-simple", level: "Básico" },
      { title: "¿Qué cosas lo suben y qué cosas lo bajan?", slug: "que-cosas-lo-suben-y-que-cosas-lo-bajan", level: "Básico" },
      { title: "Puntaje: qué significa y qué NO significa", slug: "puntaje-que-significa-y-que-no-significa", level: "Intermedio" },
      { title: "Mitos del buró (lo que la gente cree mal)", slug: "mitos-del-buro-lo-que-la-gente-cree-mal", level: "Intermedio" },
      { title: "¿Por qué el historial afecta renta, créditos y más?", slug: "por-que-el-historial-afecta-renta-creditos-y-mas", level: "Avanzado" },
    ]
  },
  {
    title: "¿Cómo se construye?",
    lessons: [
      { title: "¿Cómo se crea historial desde cero (opciones reales)?", slug: "como-se-crea-historial-desde-cero-opciones-reales", level: "Básico" },
      { title: "Comportamientos que ayudan (pagos a tiempo)", slug: "comportamientos-que-ayudan-pagos-a-tiempo", level: "Básico" },
      { title: "Utilización: por qué no conviene usar todo tu límite", slug: "utilizacion-por-que-no-conviene-usar-todo-tu-limite", level: "Intermedio" },
      { title: "Antigüedad: por qué el tiempo importa", slug: "antiguedad-por-que-el-tiempo-importa", level: "Intermedio" },
      { title: "Mini plan de 90 días para construir historial", slug: "mini-plan-de-90-dias-para-construir-historial", level: "Avanzado" },
    ]
  },
  {
    title: "Recuperación",
    lessons: [
      { title: "¿Qué pasa si te atrasas (impacto real)?", slug: "que-pasa-si-te-atrasas-impacto-real", level: "Básico" },
      { title: "¿Cómo arreglar un atraso sin empeorar todo?", slug: "como-arreglar-un-atraso-sin-empeorar-todo", level: "Básico" },
      { title: "Negociar con el banco (qué pedir)", slug: "negociar-con-el-banco-que-pedir", level: "Intermedio" },
      { title: "Errores que hunden más el historial", slug: "errores-que-hunden-mas-el-historial", level: "Intermedio" },
      { title: "Caso: reconstrucción paso a paso", slug: "caso-reconstruccion-paso-a-paso", level: "Avanzado" },
    ]
  },
]
