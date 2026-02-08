export type LessonLevel = "Básico" | "Intermedio" | "Avanzado"

export interface Tema13Lesson {
  title: string
  level: LessonLevel
  slug: string
}

export interface Tema13Subtema {
  title: string
  lessons: Tema13Lesson[]
}

export const TEMA13_SUBTEMAS: Tema13Subtema[] = [
  {
    title: "Qué es el patrimonio",
    lessons: [
      { title: "Qué es el patrimonio", level: "Básico", slug: "que-es-el-patrimonio" },
      { title: "Patrimonio vs ingresos", level: "Básico", slug: "patrimonio-vs-ingresos" },
      { title: "Patrimonio neto explicado fácil", level: "Básico", slug: "patrimonio-neto-explicado-facil" },
      { title: "Pensar en el largo plazo", level: "Intermedio", slug: "pensar-en-el-largo-plazo" },
    ],
  },
  {
    title: "Activos y pasivos",
    lessons: [
      { title: "Qué es un activo", level: "Básico", slug: "que-es-un-activo" },
      { title: "Qué es un pasivo", level: "Básico", slug: "que-es-un-pasivo" },
      { title: "Diferencia entre activos y pasivos", level: "Básico", slug: "diferencia-entre-activos-y-pasivos" },
      { title: "Cómo se construyen los activos", level: "Intermedio", slug: "como-se-construyen-los-activos" },
      { title: "Errores comunes al adquirir pasivos", level: "Intermedio", slug: "errores-comunes-al-adquirir-pasivos" },
    ],
  },
  {
    title: "Estrategias de crecimiento",
    lessons: [
      { title: "Crecer patrimonio poco a poco", level: "Intermedio", slug: "crecer-patrimonio-poco-a-poco" },
      { title: "Reinvertir ganancias", level: "Intermedio", slug: "reinvertir-ganancias" },
      { title: "Diversificar patrimonio", level: "Intermedio", slug: "diversificar-patrimonio" },
      { title: "Paciencia y consistencia", level: "Avanzado", slug: "paciencia-y-consistencia" },
    ],
  },
  {
    title: "Protección del patrimonio",
    lessons: [
      { title: "Riesgos que afectan el patrimonio", level: "Intermedio", slug: "riesgos-que-afectan-el-patrimonio" },
      { title: "No poner todo en un solo lugar", level: "Intermedio", slug: "no-poner-todo-en-un-solo-lugar" },
      { title: "Importancia del largo plazo", level: "Avanzado", slug: "importancia-del-largo-plazo" },
      { title: "Proteger lo que ya construí", level: "Avanzado", slug: "proteger-lo-que-ya-construi" },
    ],
  },
  {
    title: "Patrimonio y decisiones de vida",
    lessons: [
      { title: "Patrimonio y estilo de vida", level: "Intermedio", slug: "patrimonio-y-estilo-de-vida" },
      { title: "Priorizar hoy para el futuro", level: "Intermedio", slug: "priorizar-hoy-para-el-futuro" },
      { title: "Evitar decisiones que dañan el patrimonio", level: "Avanzado", slug: "evitar-decisiones-que-danan-el-patrimonio" },
    ],
  },
  {
    title: "Reflexión y cierre",
    lessons: [
      { title: "Pensar como constructor de patrimonio", level: "Intermedio", slug: "pensar-como-constructor-de-patrimonio" },
      { title: "Prepararme para errores y ajustes", level: "Intermedio", slug: "prepararme-para-errores-y-ajustes" },
      { title: "Checkpoint: Mi estrategia patrimonial", level: "Avanzado", slug: "checkpoint-mi-estrategia-patrimonial" },
    ],
  },
]
