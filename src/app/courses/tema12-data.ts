export interface Tema12Lesson {
  title: string
  slug: string
}

export interface Tema12Subtema {
  title: string
  lessons: Tema12Lesson[]
}

export const TEMA12_SUBTEMAS: Tema12Subtema[] = [
  {
    title: "Emociones al invertir",
    lessons: [
      { title: "Emociones y dinero invertido", slug: "emociones-y-dinero-invertido" },
      { title: "Miedo a perder", slug: "miedo-a-perder" },
      { title: "Euforia y exceso de confianza", slug: "euforia-y-exceso-de-confianza" },
      { title: "Estrés al ver pérdidas", slug: "estres-al-ver-perdidas" },
    ],
  },
  {
    title: "Sesgos mentales",
    lessons: [
      { title: "¿Qué son los sesgos mentales?", slug: "que-son-los-sesgos-mentales" },
      { title: "Sesgo de confirmación", slug: "sesgo-de-confirmacion" },
      { title: "Sesgo de aversión a la pérdida", slug: "sesgo-de-aversion-a-la-perdida" },
      { title: "Seguir a la multitud", slug: "seguir-a-la-multitud" },
      { title: "Reconocer mis sesgos", slug: "reconocer-mis-sesgos" },
    ],
  },
  {
    title: "Comportamientos comunes",
    lessons: [
      { title: "Comprar caro y vender barato", slug: "comprar-caro-y-vender-barato" },
      { title: "Reaccionar a noticias", slug: "reaccionar-a-noticias" },
      { title: "Sobreoperar", slug: "sobreoperar" },
      { title: "Falta de paciencia", slug: "falta-de-paciencia" },
    ],
  },
  {
    title: "Manejar pérdidas",
    lessons: [
      { title: "Aceptar pérdidas", slug: "aceptar-perdidas" },
      { title: "Diferencia entre pérdida temporal y real", slug: "diferencia-entre-perdida-temporal-y-real" },
      { title: "Aprender de una mala inversión", slug: "aprender-de-una-mala-inversion" },
      { title: "Controlar emociones en crisis", slug: "controlar-emociones-en-crisis" },
    ],
  },
  {
    title: "Construir disciplina",
    lessons: [
      { title: "Disciplina al invertir", slug: "disciplina-al-invertir" },
      { title: "Seguir un plan", slug: "seguir-un-plan" },
      { title: "Constancia a largo plazo", slug: "constancia-a-largo-plazo" },
      { title: "Evitar decisiones impulsivas", slug: "evitar-decisiones-impulsivas" },
    ],
  },
  {
    title: "Reflexión y cierre",
    lessons: [
      { title: "La mente como herramienta de inversión", slug: "la-mente-como-herramienta-de-inversion" },
      { title: "Prepararme para construir patrimonio", slug: "prepararme-para-construir-patrimonio" },
      { title: "Checkpoint: Mi psicología como inversionista", slug: "checkpoint-mi-psicologia-como-inversionista" },
    ],
  },
]
