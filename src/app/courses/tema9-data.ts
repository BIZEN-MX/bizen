export type LessonLevel = "Básico" | "Intermedio" | "Avanzado"

export interface Tema9Lesson {
  title: string
  level: LessonLevel
  slug: string
}

export interface Tema9Subtema {
  title: string
  lessons: Tema9Lesson[]
}

export const TEMA9_SUBTEMAS: Tema9Subtema[] = [
  {
    title: "Entender la inflación",
    lessons: [
      { title: "Qué es la inflación", level: "Básico", slug: "que-es-la-inflacion" },
      { title: "Por qué existe la inflación", level: "Básico", slug: "por-que-existe-la-inflacion" },
      { title: "Inflación en la vida diaria", level: "Básico", slug: "inflacion-en-la-vida-diaria" },
      { title: "Mitos sobre la inflación", level: "Básico", slug: "mitos-sobre-la-inflacion" },
      { title: "Cambiar la forma de ver la inflación", level: "Intermedio", slug: "cambiar-la-forma-de-ver-la-inflacion" },
    ],
  },
  {
    title: "Cómo afecta mi dinero",
    lessons: [
      { title: "Qué es el poder adquisitivo", level: "Básico", slug: "que-es-el-poder-adquisitivo" },
      { title: "Por qué el dinero pierde valor", level: "Básico", slug: "por-que-el-dinero-pierde-valor" },
      { title: "Aumentos de precios con el tiempo", level: "Intermedio", slug: "aumentos-de-precios-con-el-tiempo" },
      { title: "Inflación y ahorro", level: "Intermedio", slug: "inflacion-y-ahorro" },
      { title: "Inflación y deudas", level: "Intermedio", slug: "inflacion-y-deudas" },
    ],
  },
  {
    title: "Inflación y decisiones personales",
    lessons: [
      { title: "Ajustar gastos en inflación", level: "Intermedio", slug: "ajustar-gastos-en-inflacion" },
      { title: "Ajustar ingresos en inflación", level: "Intermedio", slug: "ajustar-ingresos-en-inflacion" },
      { title: "Errores comunes en épocas inflacionarias", level: "Avanzado", slug: "errores-comunes-en-epocas-inflacionarias" },
      { title: "Protegerme de la inflación", level: "Avanzado", slug: "protegerme-de-la-inflacion" },
    ],
  },
  {
    title: "Inflación y economía",
    lessons: [
      { title: "Inflación moderada vs alta", level: "Intermedio", slug: "inflacion-moderada-vs-alta" },
      { title: "Inflación y crecimiento económico", level: "Intermedio", slug: "inflacion-y-crecimiento-economico" },
      { title: "Qué pasa en crisis inflacionarias", level: "Avanzado", slug: "que-pasa-en-crisis-inflacionarias" },
      { title: "Ejemplos históricos de inflación", level: "Avanzado", slug: "ejemplos-historicos-de-inflacion" },
    ],
  },
  {
    title: "Prepararme para la inflación",
    lessons: [
      { title: "Pensar a largo plazo", level: "Intermedio", slug: "pensar-a-largo-plazo" },
      { title: "Tomar decisiones con visión futura", level: "Avanzado", slug: "tomar-decisiones-con-vision-futura" },
      { title: "Prepararme para invertir", level: "Avanzado", slug: "prepararme-para-invertir" },
    ],
  },
  {
    title: "Reflexión y cierre",
    lessons: [
      { title: "Entender la inflación sin miedo", level: "Intermedio", slug: "entender-la-inflacion-sin-miedo" },
      { title: "Usar la inflación en mi planeación financiera", level: "Intermedio", slug: "usar-la-inflacion-en-mi-planeacion-financiera" },
      { title: "Checkpoint: Mi dinero frente a la inflación", level: "Avanzado", slug: "checkpoint-mi-dinero-frente-a-la-inflacion" },
    ],
  },
]
