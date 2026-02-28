export interface Tema5Lesson {
  title: string
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
      { title: "¿Qué es ahorrar?", slug: "que-es-ahorrar" },
      { title: "¿Para qué sirve el ahorro?", slug: "para-que-sirve-el-ahorro" },
      { title: "Mitos sobre el ahorro", slug: "mitos-sobre-el-ahorro" },
      { title: "¿Por qué cuesta ahorrar?", slug: "por-que-cuesta-ahorrar" },
      { title: "Cambiar la forma de ver el ahorro", slug: "cambiar-la-forma-de-ver-el-ahorro" },
    ],
  },
  {
    title: "Tipos de ahorro",
    lessons: [
      { title: "Ahorro a corto plazo", slug: "ahorro-a-corto-plazo" },
      { title: "Ahorro a mediano plazo", slug: "ahorro-a-mediano-plazo" },
      { title: "Ahorro a largo plazo", slug: "ahorro-a-largo-plazo" },
      { title: "Ahorro con objetivos", slug: "ahorro-con-objetivos" },
      { title: "Priorizar objetivos de ahorro", slug: "priorizar-objetivos-de-ahorro" },
    ],
  },
  {
    title: "Fondo de emergencia",
    lessons: [
      { title: "¿Qué es un fondo de emergencia?", slug: "que-es-un-fondo-de-emergencia" },
      { title: "¿Para qué sirve un fondo de emergencia?", slug: "para-que-sirve-un-fondo-de-emergencia" },
      { title: "¿Cuánto debería tener?", slug: "cuanto-deberia-tener" },
      { title: "¿Cómo construirlo poco a poco?", slug: "como-construirlo-poco-a-poco" },
      { title: "Errores comunes con el fondo de emergencia", slug: "errores-comunes-con-el-fondo-de-emergencia" },
    ],
  },
  {
    title: "¿Cómo ahorrar en la vida real?",
    lessons: [
      { title: "Separar ahorro y gasto", slug: "separar-ahorro-y-gasto" },
      { title: "Ahorrar cuando gano poco", slug: "ahorrar-cuando-gano-poco" },
      { title: "Ahorrar con ingresos variables", slug: "ahorrar-con-ingresos-variables" },
      { title: "Evitar sabotear mi ahorro", slug: "evitar-sabotear-mi-ahorro" },
      { title: "Automatizar el ahorro", slug: "automatizar-el-ahorro" },
    ],
  },
  {
    title: "Ahorro y emociones",
    lessons: [
      { title: "Ahorro y ansiedad", slug: "ahorro-y-ansiedad" },
      { title: "Culpa por no ahorrar", slug: "culpa-por-no-ahorrar" },
      { title: "Compararme con otros al ahorrar", slug: "compararme-con-otros-al-ahorrar" },
      { title: "Mantener constancia en el ahorro", slug: "mantener-constancia-en-el-ahorro" },
    ],
  },
  {
    title: "Reflexión y cierre",
    lessons: [
      { title: "El ahorro como decisión personal", slug: "el-ahorro-como-decision-personal" },
      { title: "Prepararme para la deuda y la inversión", slug: "prepararme-para-la-deuda-y-la-inversion" },
      { title: "Checkpoint: Mi sistema de ahorro", slug: "checkpoint-mi-sistema-de-ahorro" },
    ],
  },
]
