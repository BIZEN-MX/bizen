export interface Tema7Lesson {
  title: string
  slug: string
}

export interface Tema7Subtema {
  title: string
  lessons: Tema7Lesson[]
}

export const TEMA7_SUBTEMAS: Tema7Subtema[] = [
  {
    title: "¿Qué es el sistema financiero?",
    lessons: [
      { title: "¿Qué es el sistema financiero?", slug: "que-es-el-sistema-financiero" },
      { title: "¿Para qué sirve el sistema financiero?", slug: "para-que-sirve-el-sistema-financiero" },
      { title: "¿Quién participa en el sistema financiero?", slug: "quien-participa-en-el-sistema-financiero" },
      { title: "¿Por qué es importante entenderlo?", slug: "por-que-es-importante-entenderlo" },
      { title: "¿Cómo me afecta en la vida diaria?", slug: "como-me-afecta-en-la-vida-diaria" },
    ],
  },
  {
    title: "Bancos",
    lessons: [
      { title: "¿Qué es un banco?", slug: "que-es-un-banco" },
      { title: "¿Para qué sirve un banco?", slug: "para-que-sirve-un-banco" },
      { title: "¿Qué hacen los bancos con mi dinero?", slug: "que-hacen-los-bancos-con-mi-dinero" },
      { title: "Tipos de bancos", slug: "tipos-de-bancos" },
      { title: "Riesgos y beneficios de los bancos", slug: "riesgos-y-beneficios-de-los-bancos" },
    ],
  },
  {
    title: "Cuentas y productos bancarios",
    lessons: [
      { title: "Cuenta de débito", slug: "cuenta-de-debito" },
      { title: "Cuenta de ahorro", slug: "cuenta-de-ahorro" },
      { title: "Cuenta de nómina", slug: "cuenta-de-nomina" },
      { title: "Comisiones y cargos", slug: "comisiones-y-cargos" },
      { title: "Elegir la cuenta correcta", slug: "elegir-la-cuenta-correcta" },
    ],
  },
  {
    title: "Crédito y financiamiento",
    lessons: [
      { title: "¿Qué es el crédito?", slug: "que-es-el-credito" },
      { title: "¿Cómo se otorga un crédito?", slug: "como-se-otorga-un-credito" },
      { title: "Historial crediticio", slug: "historial-crediticio" },
      { title: "Buró de crédito explicado fácil", slug: "buro-de-credito-explicado-facil" },
      { title: "¿Cómo cuidar mi historial?", slug: "como-cuidar-mi-historial" },
    ],
  },
  {
    title: "Seguridad financiera",
    lessons: [
      { title: "Riesgos financieros comunes", slug: "riesgos-financieros-comunes" },
      { title: "Fraudes y estafas", slug: "fraudes-y-estafas" },
      { title: "Seguridad en banca digital", slug: "seguridad-en-banca-digital" },
      { title: "Proteger mi información financiera", slug: "proteger-mi-informacion-financiera" },
    ],
  },
  {
    title: "Reflexión y cierre",
    lessons: [
      { title: "Usar el sistema financiero a mi favor", slug: "usar-el-sistema-financiero-a-mi-favor" },
      { title: "Tomar decisiones informadas", slug: "tomar-decisiones-informadas" },
      { title: "Checkpoint: Entender el sistema financiero", slug: "checkpoint-entender-el-sistema-financiero" },
    ],
  },
]
