export type LessonLevel = "Básico" | "Intermedio" | "Avanzado"

export interface Tema7Lesson {
  title: string
  level: LessonLevel
  slug: string
}

export interface Tema7Subtema {
  title: string
  lessons: Tema7Lesson[]
}

export const TEMA7_SUBTEMAS: Tema7Subtema[] = [
  {
    title: "Qué es el sistema financiero",
    lessons: [
      { title: "Qué es el sistema financiero", level: "Básico", slug: "que-es-el-sistema-financiero" },
      { title: "Para qué sirve el sistema financiero", level: "Básico", slug: "para-que-sirve-el-sistema-financiero" },
      { title: "Quién participa en el sistema financiero", level: "Básico", slug: "quien-participa-en-el-sistema-financiero" },
      { title: "Por qué es importante entenderlo", level: "Intermedio", slug: "por-que-es-importante-entenderlo" },
      { title: "Cómo me afecta en la vida diaria", level: "Intermedio", slug: "como-me-afecta-en-la-vida-diaria" },
    ],
  },
  {
    title: "Bancos",
    lessons: [
      { title: "Qué es un banco", level: "Básico", slug: "que-es-un-banco" },
      { title: "Para qué sirve un banco", level: "Básico", slug: "para-que-sirve-un-banco" },
      { title: "Qué hacen los bancos con mi dinero", level: "Intermedio", slug: "que-hacen-los-bancos-con-mi-dinero" },
      { title: "Tipos de bancos", level: "Intermedio", slug: "tipos-de-bancos" },
      { title: "Riesgos y beneficios de los bancos", level: "Intermedio", slug: "riesgos-y-beneficios-de-los-bancos" },
    ],
  },
  {
    title: "Cuentas y productos bancarios",
    lessons: [
      { title: "Cuenta de débito", level: "Básico", slug: "cuenta-de-debito" },
      { title: "Cuenta de ahorro", level: "Básico", slug: "cuenta-de-ahorro" },
      { title: "Cuenta de nómina", level: "Básico", slug: "cuenta-de-nomina" },
      { title: "Comisiones y cargos", level: "Intermedio", slug: "comisiones-y-cargos" },
      { title: "Elegir la cuenta correcta", level: "Intermedio", slug: "elegir-la-cuenta-correcta" },
    ],
  },
  {
    title: "Crédito y financiamiento",
    lessons: [
      { title: "Qué es el crédito", level: "Básico", slug: "que-es-el-credito" },
      { title: "Cómo se otorga un crédito", level: "Intermedio", slug: "como-se-otorga-un-credito" },
      { title: "Historial crediticio", level: "Intermedio", slug: "historial-crediticio" },
      { title: "Buró de crédito explicado fácil", level: "Intermedio", slug: "buro-de-credito-explicado-facil" },
      { title: "Cómo cuidar mi historial", level: "Avanzado", slug: "como-cuidar-mi-historial" },
    ],
  },
  {
    title: "Seguridad financiera",
    lessons: [
      { title: "Riesgos financieros comunes", level: "Intermedio", slug: "riesgos-financieros-comunes" },
      { title: "Fraudes y estafas", level: "Intermedio", slug: "fraudes-y-estafas" },
      { title: "Seguridad en banca digital", level: "Intermedio", slug: "seguridad-en-banca-digital" },
      { title: "Proteger mi información financiera", level: "Avanzado", slug: "proteger-mi-informacion-financiera" },
    ],
  },
  {
    title: "Reflexión y cierre",
    lessons: [
      { title: "Usar el sistema financiero a mi favor", level: "Intermedio", slug: "usar-el-sistema-financiero-a-mi-favor" },
      { title: "Tomar decisiones informadas", level: "Intermedio", slug: "tomar-decisiones-informadas" },
      { title: "Checkpoint: Entender el sistema financiero", level: "Avanzado", slug: "checkpoint-entender-el-sistema-financiero" },
    ],
  },
]
