export interface Tema13Lesson {
  title: string
  slug: string
}

export interface Tema13Subtema {
  title: string
  lessons: Tema13Lesson[]
}

export const TEMA13_SUBTEMAS: Tema13Subtema[] = [
  {
    title: "¿Qué es el patrimonio?",
    lessons: [
      { title: "¿Qué es el patrimonio?", slug: "que-es-el-patrimonio" },
      { title: "Patrimonio vs ingresos", slug: "patrimonio-vs-ingresos" },
      { title: "Patrimonio neto explicado fácil", slug: "patrimonio-neto-explicado-facil" },
      { title: "Pensar en el largo plazo", slug: "pensar-en-el-largo-plazo" },
    ],
  },
  {
    title: "Activos y pasivos",
    lessons: [
      { title: "¿Qué es un activo?", slug: "que-es-un-activo" },
      { title: "¿Qué es un pasivo?", slug: "que-es-un-pasivo" },
      { title: "Diferencia entre activos y pasivos", slug: "diferencia-entre-activos-y-pasivos" },
      { title: "¿Cómo se construyen los activos?", slug: "como-se-construyen-los-activos" },
      { title: "Errores comunes al adquirir pasivos", slug: "errores-comunes-al-adquirir-pasivos" },
    ],
  },
  {
    title: "Estrategias de crecimiento",
    lessons: [
      { title: "Crecer patrimonio poco a poco", slug: "crecer-patrimonio-poco-a-poco" },
      { title: "Reinvertir ganancias", slug: "reinvertir-ganancias" },
      { title: "Diversificar patrimonio", slug: "diversificar-patrimonio" },
      { title: "Paciencia y consistencia", slug: "paciencia-y-consistencia" },
    ],
  },
  {
    title: "Protección del patrimonio",
    lessons: [
      { title: "Riesgos que afectan el patrimonio", slug: "riesgos-que-afectan-el-patrimonio" },
      { title: "No poner todo en un solo lugar", slug: "no-poner-todo-en-un-solo-lugar" },
      { title: "Importancia del largo plazo", slug: "importancia-del-largo-plazo" },
      { title: "Proteger lo que ya construí", slug: "proteger-lo-que-ya-construi" },
    ],
  },
  {
    title: "Patrimonio y decisiones de vida",
    lessons: [
      { title: "Patrimonio y estilo de vida", slug: "patrimonio-y-estilo-de-vida" },
      { title: "Priorizar hoy para el futuro", slug: "priorizar-hoy-para-el-futuro" },
      { title: "Evitar decisiones que dañan el patrimonio", slug: "evitar-decisiones-que-danan-el-patrimonio" },
    ],
  },
  {
    title: "Reflexión y cierre",
    lessons: [
      { title: "Pensar como constructor de patrimonio", slug: "pensar-como-constructor-de-patrimonio" },
      { title: "Prepararme para errores y ajustes", slug: "prepararme-para-errores-y-ajustes" },
      { title: "Checkpoint: Mi estrategia patrimonial", slug: "checkpoint-mi-estrategia-patrimonial" },
    ],
  },
]
