export interface Tema11Lesson {
  title: string
  slug: string
  level: "Básico" | "Intermedio" | "Avanzado"
}

export interface Tema11Subtema {
  title: string
  lessons: Tema11Lesson[]
}

export const TEMA11_TITLE = "Sistema financiero básico"

export const TEMA11_SUBTEMAS: Tema11Subtema[] = [
  {
    title: "¿Qué es y para qué sirve?",
    lessons: [
      { title: "¿Qué es el sistema financiero (en corto y claro)?", slug: "que-es-el-sistema-financiero-en-corto-y-claro", level: "Básico" },
      { title: "¿Qué hace un banco con tu dinero (sin humo)?", slug: "que-hace-un-banco-con-tu-dinero-sin-humo", level: "Básico" },
      { title: "Productos financieros: qué son y cómo se comparan", slug: "productos-financieros-que-son-y-como-se-comparan", level: "Intermedio" },
      { title: "Comisiones: por qué existen y cómo te afectan", slug: "comisiones-por-que-existen-y-como-te-afectan", level: "Intermedio" },
      { title: "Señales de un producto “malo” para ti", slug: "senales-de-un-producto-malo-para-ti", level: "Avanzado" },
    ]
  },
  {
    title: "Cuentas y servicios",
    lessons: [
      { title: "Débito vs ahorro vs nómina (cuándo usar cada una)", slug: "debito-vs-ahorro-vs-nomina-cuando-usar-cada-una", level: "Básico" },
      { title: "CLABE, tarjeta, número de cuenta (no confundirse)", slug: "clabe-tarjeta-numero-de-cuenta-no-confundirse", level: "Básico" },
      { title: "Transferencias SPEI: cómo funcionan", slug: "transferencias-spei-como-funcionan", level: "Intermedio" },
      { title: "Errores comunes al transferir (y cómo evitarlos)", slug: "errores-comunes-al-transferir-y-como-evitarlos", level: "Intermedio" },
      { title: "Reglas básicas para manejar tu cuenta sin problemas", slug: "reglas-basicas-para-manejar-tu-cuenta-sin-problemas", level: "Avanzado" },
    ]
  },
  {
    title: "Decisiones en el sistema",
    lessons: [
      { title: "¿Cómo elegir banco o cuenta (criterios simples)?", slug: "como-elegir-banco-o-cuenta-criterios-simples", level: "Básico" },
      { title: "Costos ocultos (saldo mínimo, anualidad, comisiones)", slug: "costos-ocultos-saldo-minimo-anualidad-comisiones", level: "Básico" },
      { title: "¿Qué revisar antes de firmar/aceptar algo?", slug: "que-revisar-antes-de-firmaraceptar-algo", level: "Intermedio" },
      { title: "Diferencia entre “promoción” y “condición real”", slug: "diferencia-entre-promocion-y-condicion-real", level: "Intermedio" },
      { title: "Mini caso: elegir la mejor cuenta para un estudiante", slug: "mini-caso-elegir-la-mejor-cuenta-para-un-estudiante", level: "Avanzado" },
    ]
  },
]
