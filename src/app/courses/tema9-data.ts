export interface Tema9Lesson {
  title: string
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
      { title: "¿Qué es la inflación?", slug: "que-es-la-inflacion" },
      { title: "¿Por qué existe la inflación?", slug: "por-que-existe-la-inflacion" },
      { title: "Inflación en la vida diaria", slug: "inflacion-en-la-vida-diaria" },
      { title: "Mitos sobre la inflación", slug: "mitos-sobre-la-inflacion" },
      { title: "Cambiar la forma de ver la inflación", slug: "cambiar-la-forma-de-ver-la-inflacion" },
    ],
  },
  {
    title: "¿Cómo afecta mi dinero?",
    lessons: [
      { title: "¿Qué es el poder adquisitivo?", slug: "que-es-el-poder-adquisitivo" },
      { title: "¿Por qué el dinero pierde valor?", slug: "por-que-el-dinero-pierde-valor" },
      { title: "Aumentos de precios con el tiempo", slug: "aumentos-de-precios-con-el-tiempo" },
      { title: "Inflación y ahorro", slug: "inflacion-y-ahorro" },
      { title: "Inflación y deudas", slug: "inflacion-y-deudas" },
    ],
  },
  {
    title: "Inflación y decisiones personales",
    lessons: [
      { title: "Ajustar gastos en inflación", slug: "ajustar-gastos-en-inflacion" },
      { title: "Ajustar ingresos en inflación", slug: "ajustar-ingresos-en-inflacion" },
      { title: "Errores comunes en épocas inflacionarias", slug: "errores-comunes-en-epocas-inflacionarias" },
      { title: "Protegerme de la inflación", slug: "protegerme-de-la-inflacion" },
    ],
  },
  {
    title: "Inflación y economía",
    lessons: [
      { title: "Inflación moderada vs alta", slug: "inflacion-moderada-vs-alta" },
      { title: "Inflación y crecimiento económico", slug: "inflacion-y-crecimiento-economico" },
      { title: "¿Qué pasa en crisis inflacionarias?", slug: "que-pasa-en-crisis-inflacionarias" },
      { title: "Ejemplos históricos de inflación", slug: "ejemplos-historicos-de-inflacion" },
    ],
  },
  {
    title: "Prepararme para la inflación",
    lessons: [
      { title: "Pensar a largo plazo", slug: "pensar-a-largo-plazo" },
      { title: "Tomar decisiones con visión futura", slug: "tomar-decisiones-con-vision-futura" },
      { title: "Prepararme para invertir", slug: "prepararme-para-invertir" },
    ],
  },
  {
    title: "Reflexión y cierre",
    lessons: [
      { title: "Entender la inflación sin miedo", slug: "entender-la-inflacion-sin-miedo" },
      { title: "Usar la inflación en mi planeación financiera", slug: "usar-la-inflacion-en-mi-planeacion-financiera" },
      { title: "Checkpoint: Mi dinero frente a la inflación", slug: "checkpoint-mi-dinero-frente-a-la-inflacion" },
    ],
  },
]
