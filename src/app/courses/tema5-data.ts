export type LessonLevel = "Básico" | "Intermedio" | "Avanzado"

export interface Tema5Lesson {
  title: string
  level: LessonLevel
  slug: string
}

export interface Tema5Subtema {
  title: string
  lessons: Tema5Lesson[]
}

export const TEMA5_SUBTEMAS: Tema5Subtema[] = [
  {
    title: "Entender el ahorro",
    lessons: [
      { title: "Qué es ahorrar", level: "Básico", slug: "que-es-ahorrar" },
      { title: "Para qué sirve el ahorro", level: "Básico", slug: "para-que-sirve-el-ahorro" },
      { title: "Mitos sobre el ahorro", level: "Básico", slug: "mitos-sobre-el-ahorro" },
      { title: "Por qué cuesta ahorrar", level: "Intermedio", slug: "por-que-cuesta-ahorrar" },
      { title: "Cambiar la forma de ver el ahorro", level: "Intermedio", slug: "cambiar-la-forma-de-ver-el-ahorro" },
    ],
  },
  {
    title: "Tipos de ahorro",
    lessons: [
      { title: "Ahorro a corto plazo", level: "Básico", slug: "ahorro-a-corto-plazo" },
      { title: "Ahorro a mediano plazo", level: "Básico", slug: "ahorro-a-mediano-plazo" },
      { title: "Ahorro a largo plazo", level: "Básico", slug: "ahorro-a-largo-plazo" },
      { title: "Ahorro con objetivos", level: "Intermedio", slug: "ahorro-con-objetivos" },
      { title: "Priorizar objetivos de ahorro", level: "Intermedio", slug: "priorizar-objetivos-de-ahorro" },
    ],
  },
  {
    title: "Fondo de emergencia",
    lessons: [
      { title: "Qué es un fondo de emergencia", level: "Básico", slug: "que-es-un-fondo-de-emergencia" },
      { title: "Para qué sirve un fondo de emergencia", level: "Básico", slug: "para-que-sirve-un-fondo-de-emergencia" },
      { title: "Cuánto debería tener", level: "Intermedio", slug: "cuanto-deberia-tener" },
      { title: "Cómo construirlo poco a poco", level: "Intermedio", slug: "como-construirlo-poco-a-poco" },
      { title: "Errores comunes con el fondo de emergencia", level: "Avanzado", slug: "errores-comunes-con-el-fondo-de-emergencia" },
    ],
  },
  {
    title: "Cómo ahorrar en la vida real",
    lessons: [
      { title: "Separar ahorro y gasto", level: "Intermedio", slug: "separar-ahorro-y-gasto" },
      { title: "Ahorrar cuando gano poco", level: "Intermedio", slug: "ahorrar-cuando-gano-poco" },
      { title: "Ahorrar con ingresos variables", level: "Intermedio", slug: "ahorrar-con-ingresos-variables" },
      { title: "Evitar sabotear mi ahorro", level: "Avanzado", slug: "evitar-sabotear-mi-ahorro" },
      { title: "Automatizar el ahorro", level: "Avanzado", slug: "automatizar-el-ahorro" },
    ],
  },
  {
    title: "Ahorro y emociones",
    lessons: [
      { title: "Ahorro y ansiedad", level: "Intermedio", slug: "ahorro-y-ansiedad" },
      { title: "Culpa por no ahorrar", level: "Intermedio", slug: "culpa-por-no-ahorrar" },
      { title: "Compararme con otros al ahorrar", level: "Intermedio", slug: "compararme-con-otros-al-ahorrar" },
      { title: "Mantener constancia en el ahorro", level: "Avanzado", slug: "mantener-constancia-en-el-ahorro" },
    ],
  },
  {
    title: "Reflexión y cierre",
    lessons: [
      { title: "El ahorro como decisión personal", level: "Intermedio", slug: "el-ahorro-como-decision-personal" },
      { title: "Prepararme para la deuda y la inversión", level: "Intermedio", slug: "prepararme-para-la-deuda-y-la-inversion" },
      { title: "Checkpoint: Mi sistema de ahorro", level: "Avanzado", slug: "checkpoint-mi-sistema-de-ahorro" },
    ],
  },
]
