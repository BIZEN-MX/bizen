export interface Tema24Lesson {
  title: string
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
      { title: "Empezar sin plan", slug: "empezar-sin-plan" },
      { title: "No conocer al cliente", slug: "no-conocer-al-cliente" },
      { title: "Gastar antes de validar", slug: "gastar-antes-de-validar" },
    ],
  },
  {
    title: "Errores financieros",
    lessons: [
      { title: "No controlar ingresos y gastos", slug: "no-controlar-ingresos-y-gastos" },
      { title: "No separar cuentas", slug: "no-separar-cuentas" },
      { title: "Ignorar el flujo de efectivo", slug: "ignorar-el-flujo-de-efectivo" },
    ],
  },
  {
    title: "Errores de mentalidad",
    lessons: [
      { title: "Querer crecer demasiado rápido", slug: "querer-crecer-demasiado-rapido" },
      { title: "No pedir ayuda", slug: "no-pedir-ayuda" },
      { title: "Miedo a cambiar", slug: "miedo-a-cambiar" },
    ],
  },
  {
    title: "Corregir errores",
    lessons: [
      { title: "Reconocer errores", slug: "reconocer-errores" },
      { title: "Ajustar el rumbo", slug: "ajustar-el-rumbo" },
      { title: "Aprender del fracaso", slug: "aprender-del-fracaso" },
    ],
  },
  {
    title: "Reflexión y cierre",
    lessons: [
      { title: "El error como parte del proceso", slug: "el-error-como-parte-del-proceso" },
      { title: "Checkpoint: Mis errores como emprendedor", slug: "checkpoint-mis-errores-como-emprendedor" },
    ],
  },
]
