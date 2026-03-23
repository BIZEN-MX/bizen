export interface Tema18Lesson {
  title: string
  slug: string
  level: "Básico" | "Intermedio" | "Avanzado"
}

export interface Tema18Subtema {
  title: string
  lessons: Tema18Lesson[]
}

export const TEMA18_TITLE = "Fraudes y seguridad financiera"

export const TEMA18_SUBTEMAS: Tema18Subtema[] = [
  {
    title: "Fraudes comunes",
    lessons: [
      { title: "Estafas típicas en redes (señales)", slug: "estafas-tipicas-en-redes-senales", level: "Básico" },
      { title: "Phishing: links falsos y mensajes urgentes", slug: "phishing-links-falsos-y-mensajes-urgentes", level: "Básico" },
      { title: "“Dinero rápido” y pirámides (red flags)", slug: "dinero-rapido-y-piramides-red-flags", level: "Intermedio" },
      { title: "Compras en línea falsas (cómo detectarlas)", slug: "compras-en-linea-falsas-como-detectarlas", level: "Intermedio" },
      { title: "Caso: identificar si un mensaje es fraude", slug: "caso-identificar-si-un-mensaje-es-fraude", level: "Avanzado" },
    ]
  },
  {
    title: "Protección",
    lessons: [
      { title: "Contraseñas seguras (sin complicar)", slug: "contrasenas-seguras-sin-complicar", level: "Básico" },
      { title: "2FA: qué es y por qué importa", slug: "2fa-que-es-y-por-que-importa", level: "Básico" },
      { title: "¿Qué hacer si te roban el celular (pasos)?", slug: "que-hacer-si-te-roban-el-celular-pasos", level: "Intermedio" },
      { title: "¿Qué hacer si caes en fraude (pasos)?", slug: "que-hacer-si-caes-en-fraude-pasos", level: "Intermedio" },
      { title: "Checklist de seguridad personal", slug: "checklist-de-seguridad-personal", level: "Avanzado" },
    ]
  },
  {
    title: "Prevención",
    lessons: [
      { title: "Regla de oro: nunca actuar con urgencia", slug: "regla-de-oro-nunca-actuar-con-urgencia", level: "Básico" },
      { title: "Verificar antes de pagar (pasos)", slug: "verificar-antes-de-pagar-pasos", level: "Básico" },
      { title: "Transferencias seguras (a quién sí y a quién no)", slug: "transferencias-seguras-a-quien-si-y-a-quien-no", level: "Intermedio" },
      { title: "Compras seguras (marketplaces, comprobantes)", slug: "compras-seguras-marketplaces-comprobantes", level: "Intermedio" },
      { title: "Mini simulación: compra segura vs riesgosa", slug: "mini-simulacion-compra-segura-vs-riesgosa", level: "Avanzado" },
    ]
  },
]
