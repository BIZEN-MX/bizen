export type LessonLevel = "Básico" | "Intermedio" | "Avanzado"

export interface Tema24Lesson {
  title: string
  level: LessonLevel
  slug: string
}

export interface Tema24Subtema {
  title: string
  lessons: Tema24Lesson[]
}

export const TEMA24_SUBTEMAS: Tema24Subtema[] = [
  {
    title: "Errores al iniciar",
    lessons: [
      { title: "Empezar sin plan", level: "Básico", slug: "empezar-sin-plan" },
      { title: "No conocer al cliente", level: "Básico", slug: "no-conocer-al-cliente" },
      { title: "Gastar antes de validar", level: "Intermedio", slug: "gastar-antes-de-validar" },
    ],
  },
  {
    title: "Errores financieros",
    lessons: [
      { title: "No controlar ingresos y gastos", level: "Intermedio", slug: "no-controlar-ingresos-y-gastos" },
      { title: "No separar cuentas", level: "Intermedio", slug: "no-separar-cuentas" },
      { title: "Ignorar el flujo de efectivo", level: "Avanzado", slug: "ignorar-el-flujo-de-efectivo" },
    ],
  },
  {
    title: "Errores de mentalidad",
    lessons: [
      { title: "Querer crecer demasiado rápido", level: "Intermedio", slug: "querer-crecer-demasiado-rapido" },
      { title: "No pedir ayuda", level: "Intermedio", slug: "no-pedir-ayuda" },
      { title: "Miedo a cambiar", level: "Avanzado", slug: "miedo-a-cambiar" },
    ],
  },
  {
    title: "Corregir errores",
    lessons: [
      { title: "Reconocer errores", level: "Intermedio", slug: "reconocer-errores" },
      { title: "Ajustar el rumbo", level: "Avanzado", slug: "ajustar-el-rumbo" },
      { title: "Aprender del fracaso", level: "Avanzado", slug: "aprender-del-fracaso" },
    ],
  },
  {
    title: "Reflexión y cierre",
    lessons: [
      { title: "El error como parte del proceso", level: "Intermedio", slug: "el-error-como-parte-del-proceso" },
      { title: "Checkpoint: Mis errores como emprendedor", level: "Avanzado", slug: "checkpoint-mis-errores-como-emprendedor" },
    ],
  },
]
