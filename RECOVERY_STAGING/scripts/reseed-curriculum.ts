import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const curriculum = [
  {
    "topic": "1) Relación con el dinero",
    "subthemes": [
      {
        "title": "Subtema A: Percepción",
        "lessons": [
          "Qué es el dinero para mí",
          "Qué espero del dinero",
          "Dinero como seguridad vs libertad",
          "Dinero como presión vs oportunidad",
          "Identificar mi “definición personal” del dinero"
        ]
      },
      {
        "title": "Subtema B: Emoción",
        "lessons": [
          "Cómo me hace sentir el dinero",
          "Señales de emoción dominando una decisión",
          "Pausa financiera (reglas anti-impulso)",
          "Culpa y ansiedad financiera (cómo se forman)",
          "Emoción vs decisión (casos reales)"
        ]
      },
      {
        "title": "Subtema C: Creencias",
        "lessons": [
          "Mis primeras creencias sobre el dinero",
          "Expectativas vs realidad financiera",
          "Frases heredadas que me limitan",
          "Cómo cuestionar una creencia con evidencia",
          "Reescribir creencias en reglas útiles"
        ]
      },
      {
        "title": "Evaluación Final",
        "lessons": [
          "Evaluación de Bloque 1"
        ]
      }
    ]
  },
  {
    "topic": "2) Ingeniería del Ingreso",
    "subthemes": [
      {
        "title": "Naturaleza del Dinero y el Valor",
        "lessons": [
          "¿Por qué el mercado paga lo que paga?",
          "Ingreso Activo vs Pasivo: La Realidad",
          "El Triángulo del Valor (Habilidad, Escala, Rareza)",
          "Ingreso de Portafolio: Dinero que genera dinero",
          "Evaluación: ¿Cómo se ve tu flujo de entrada hoy?"
        ]
      },
      {
        "title": "El Capital de tus Habilidades",
        "lessons": [
          "Habilidades de Alto Valor (High-Income Skills)",
          "Escalabilidad: ¿Tu tiempo tiene techo?",
          "Invertir en ti: El ROI de tu educación",
          "Soft Skills: El multiplicador invisible de ingresos",
          "Diseño de Carrera: De Operativo a Estratégico"
        ]
      },
      {
        "title": "Optimización de la Riqueza",
        "lessons": [
          "Capital Intelectual vs Capital Financiero",
          "El costo de no saber: Impuesto a la ignorancia",
          "Apalancamiento: Hacer más con menos",
          "Ingresos Recurrentes: Tu ejército de centavos",
          "Plan de Acción: Duplicar tu valor de mercado"
        ]
      },
      {
        "title": "Evaluación Final",
        "lessons": [
          "Evaluación de Bloque 2"
        ]
      }
    ]
  },
  {
    "topic": "3) Psicología del consumo",
    "subthemes": [
      {
        "title": "Subtema A: Triggers",
        "lessons": [
          "Qué es un trigger de compra",
          "Publicidad: cómo te manipula",
          "Redes: comparación y presión",
          "Compras por aburrimiento vs necesidad",
          "Detectar mis triggers (casos)"
        ]
      },
      {
        "title": "Subtema B: Compras impulsivas",
        "lessons": [
          "Señales de compra impulsiva",
          "Antes de pagar: checklist de decisión",
          "Micro-hábitos para evitar impulsos",
          "Post-compra: culpa y aprendizaje",
          "Caso: “gasto por emoción” paso a paso"
        ]
      },
      {
        "title": "Subtema C: Estatus",
        "lessons": [
          "Comprar por estatus vs por valor",
          "“Apariencia de riqueza” vs riqueza real",
          "Presión social en decisiones (escenarios)",
          "Cómo decir que no sin sentirte menos",
          "Regla personal anti-estatus"
        ]
      },
      {
        "title": "Evaluación Final",
        "lessons": [
          "Evaluación de Bloque 3"
        ]
      }
    ]
  },
  {
    "topic": "4) Tipos de gastos",
    "subthemes": [
      {
        "title": "Subtema A: Clasificación",
        "lessons": [
          "Gastos fijos vs variables",
          "Necesidad vs deseo",
          "Gastos discrecionales (lo que sí eliges)",
          "Costo real: gasto + extras",
          "Clasificar mis gastos (ejercicio completo)"
        ]
      },
      {
        "title": "Subtema B: Gastos hormiga",
        "lessons": [
          "Qué son y por qué importan",
          "Detectar 3 gastos hormiga personales",
          "Recorte inteligente (sin “sufrir”)",
          "Sustituciones (barato, saludable, útil)",
          "Reto: semana sin gasto hormiga"
        ]
      },
      {
        "title": "Subtema C: Gastos invisibles",
        "lessons": [
          "Suscripciones y “cobros fantasma”",
          "Comisiones bancarias comunes",
          "Envíos, propinas, recargos",
          "Costos por pagar tarde",
          "Limpieza: cancelar y optimizar"
        ]
      }
    ]
  },
  {
    "topic": "5) Flujo de dinero",
    "subthemes": [
      {
        "title": "Subtema A: Entradas",
        "lessons": [
          "De dónde entra mi dinero hoy",
          "Ingresos fijos vs variables",
          "Ingresos irregulares (cómo manejarlos)",
          "Aumentar ingresos sin “trabajar más”",
          "Detectar mi fuente principal de riesgo"
        ]
      },
      {
        "title": "Subtema B: Salidas",
        "lessons": [
          "Acondo se va mi dinero",
          "Fugas de dinero (las 3 típicas)",
          "Gastar más de lo que entra (señales)",
          "Ajuste rápido de salidas (plan 7 días)",
          "Caso: recuperar control del mes"
        ]
      },
      {
        "title": "Subtema C: Balance",
        "lessons": [
          "Balance simple (entra/sale)",
          "Qué pasa si siempre quedo en 0",
          "Cómo crear margen",
          "Margen como hábito (no accidente)",
          "Semana de balance: seguimiento real"
        ]
      }
    ]
  },
  {
    "topic": "6) Presupuesto personal",
    "subthemes": [
      {
        "title": "Subtema A: Base",
        "lessons": [
          "Qué es un presupuesto real",
          "Errores típicos al presupuestar",
          "Presupuesto flexible (vida real)",
          "Presupuesto por categorías",
          "Elegir el tipo correcto para mí"
        ]
      },
      {
        "title": "Subtema B: Construcción",
        "lessons": [
          "Armar presupuesto paso a paso",
          "Prioridades: qué va primero",
          "Ajustar sin rendirme",
          "Qué hacer si tengo ingresos variables",
          "Caso: presupuesto con imprevisto"
        ]
      },
      {
        "title": "Subtema C: Uso real",
        "lessons": [
          "Cómo seguirlo día a día",
          "Qué hacer cuando me salgo",
          "Revisar semanalmente",
          "Ajustar el siguiente mes",
          "Presupuesto sostenible (no perfecto)"
        ]
      }
    ]
  },
  {
    "topic": "7) Hábitos financieros",
    "subthemes": [
      {
        "title": "Subtema A: Hábitos clave",
        "lessons": [
          "Registrar gastos (método simple)",
          "Revisar semanal (10 min)",
          "Separar ahorro primero",
          "Regla de compras (pausa)",
          "Hábito de “cierre mensual”"
        ]
      },
      {
        "title": "Subtema B: Constancia",
        "lessons": [
          "Motivación vs disciplina",
          "Cómo sostener hábitos 30 días",
          "Recaídas: cómo volver sin culpa",
          "Hábito mínimo (cuando no tienes ganas)",
          "Sistema de recompensas (sin gastar)"
        ]
      },
      {
        "title": "Subtema C: Sistema personal",
        "lessons": [
          "Diseñar mi rutina financiera",
          "Mi checklist semanal",
          "Mi checklist mensual",
          "Mi regla de “no deuda mala”",
          "Mi sistema completo (resumen)"
        ]
      }
    ]
  },
  {
    "topic": "8) Ahorro",
    "subthemes": [
      {
        "title": "Subtema A: Fundamentos",
        "lessons": [
          "Ahorrar no es guardar lo que sobra",
          "Pagarte a ti primero",
          "Separar ahorro y gasto (físico o digital)",
          "Ahorrar con ingresos variables",
          "Errores comunes al ahorrar"
        ]
      },
      {
        "title": "Subtema B: Fondo de emergencia",
        "lessons": [
          "Qué es y por qué existe",
          "Cuánto necesito (simple)",
          "Cómo empezar con poco",
          "Cuándo se usa y cuándo no",
          "Reconstruir el fondo después"
        ]
      },
      {
        "title": "Subtema C: Ahorro constante",
        "lessons": [
          "Automatizar ahorro (simulado)",
          "Ahorro por metas",
          "Micro-ahorros diarios",
          "Ahorro en crisis",
          "Mantener constancia 3 meses"
        ]
      }
    ]
  },
  {
    "topic": "9) Metas financieras",
    "subthemes": [
      {
        "title": "Subtema A: Metas claras",
        "lessons": [
          "Meta específica y medible",
          "Tiempo y monto diario/semanal",
          "Meta realista vs fantasía",
          "Romper una meta en pasos",
          "Caso: meta 7 días / 30 días"
        ]
      },
      {
        "title": "Subtema B: Prioridades",
        "lessons": [
          "Elegir metas sin saturarme",
          "Meta vs antojos (decisión)",
          "1 meta principal + 1 secundaria",
          "Cambiar prioridades sin abandonar",
          "Caso: dos metas en conflicto"
        ]
      },
      {
        "title": "Subtema C: Seguimiento",
        "lessons": [
          "Medir avance simple",
          "Ajustar si voy atrasado",
          "Evitar abandonar a mitad",
          "Recompensas sanas por avance",
          "Cierre de meta y siguiente meta"
        ]
      }
    ]
  },
  {
    "topic": "10) Planeación financiera (básica)",
    "subthemes": [
      {
        "title": "Subtema A: 1 mes",
        "lessons": [
          "Plan de 30 días",
          "Prever gastos del mes",
          "Imprevistos y colchón",
          "Plan de recorte si me paso",
          "Cierre mensual (qué aprendí)"
        ]
      },
      {
        "title": "Subtema B: 3 meses",
        "lessons": [
          "Plan trimestral simple",
          "Escenarios: gano menos",
          "Escenarios: gasto más",
          "Ajustar metas al trimestre",
          "Revisar y corregir a mitad"
        ]
      },
      {
        "title": "Subtema C: Reglas",
        "lessons": [
          "Reglas personales de gasto",
          "Regla de prioridades",
          "Regla de compras grandes",
          "Regla de ahorro mínimo",
          "Manual personal de dinero (versión 1)"
        ]
      }
    ]
  },
  {
    "topic": "11) Sistema financiero básico",
    "subthemes": [
      {
        "title": "Subtema A: Qué es y para qué sirve",
        "lessons": [
          "Qué es el sistema financiero (en corto y claro)",
          "Qué hace un banco con tu dinero (sin humo)",
          "Productos financieros: qué son y cómo se comparan",
          "Comisiones: por qué existen y cómo te afectan",
          "Señales de un producto “malo” para ti"
        ]
      },
      {
        "title": "Subtema B: Cuentas y servicios",
        "lessons": [
          "Débito vs ahorro vs nómina (cuándo usar cada una)",
          "CLABE, tarjeta, número de cuenta (no confundirse)",
          "Transferencias SPEI: cómo funcionan",
          "Errores comunes al transferir (y cómo evitarlos)",
          "Reglas básicas para manejar tu cuenta sin problemas"
        ]
      },
      {
        "title": "Subtema C: Decisiones en el sistema",
        "lessons": [
          "Cómo elegir banco o cuenta (criterios simples)",
          "Costos ocultos (saldo mínimo, anualidad, comisiones)",
          "Qué revisar antes de firmar/aceptar algo",
          "Diferencia entre “promoción” y “condición real”",
          "Mini caso: elegir la mejor cuenta para un estudiante"
        ]
      }
    ]
  },
  {
    "topic": "12) Crédito y tarjetas",
    "subthemes": [
      {
        "title": "Subtema A: Fundamentos del crédito",
        "lessons": [
          "Qué es crédito y cuándo sí conviene",
          "Crédito bueno vs malo (con ejemplos reales)",
          "Qué significa “capacidad de pago”",
          "Costo real del crédito (idea sin fórmula)",
          "Señales de que NO debes pedir crédito"
        ]
      },
      {
        "title": "Subtema B: Tarjetas de crédito",
        "lessons": [
          "Cómo funciona una tarjeta (ciclo de pago)",
          "Fecha de corte vs fecha límite (sin confundirse)",
          "Pago mínimo vs pago para no generar intereses",
          "Anualidad, comisiones y cargos comunes",
          "Regla de oro: cómo usar tarjeta sin caer en deuda"
        ]
      },
      {
        "title": "Subtema C: Uso responsable",
        "lessons": [
          "Límites personales: cuánto sí gastar con tarjeta",
          "Tarjeta para construir historial (estrategia segura)",
          "Errores típicos (meses sin intereses mal usados)",
          "Qué hacer si ya te estás atorando",
          "Mini caso: tarjeta bien usada vs mal usada"
        ]
      }
    ]
  },
  {
    "topic": "13) Historial crediticio",
    "subthemes": [
      {
        "title": "Subtema A: Qué es y por qué importa",
        "lessons": [
          "Qué es historial crediticio (en simple)",
          "Qué cosas lo suben y qué cosas lo bajan",
          "Puntaje: qué significa y qué NO significa",
          "Mitos del buró (lo que la gente cree mal)",
          "Por qué el historial afecta renta, créditos y más"
        ]
      },
      {
        "title": "Subtema B: Cómo se construye",
        "lessons": [
          "Cómo se crea historial desde cero (opciones reales)",
          "Comportamientos que ayudan (pagos a tiempo)",
          "Utilización: por qué no conviene usar todo tu límite",
          "Antigüedad: por qué el tiempo importa",
          "Mini plan de 90 días para construir historial"
        ]
      },
      {
        "title": "Subtema C: Recuperación",
        "lessons": [
          "Qué pasa si te atrasas (impacto real)",
          "Cómo arreglar un atraso sin empeorar todo",
          "Negociar con el banco (qué pedir)",
          "Errores que hunden más el historial",
          "Caso: reconstrucción paso a paso"
        ]
      }
    ]
  },
  {
    "topic": "14) Deuda",
    "subthemes": [
      {
        "title": "Subtema A: Entender la deuda",
        "lessons": [
          "Tipos de deuda (personal, consumo, educativa)",
          "Señales de deuda saludable vs peligrosa",
          "Endeudarte por necesidad vs por impulso",
          "El “costo emocional” de la deuda",
          "Diagnóstico: mi nivel de riesgo de deuda"
        ]
      },
      {
        "title": "Subtema B: Control y prioridades",
        "lessons": [
          "Lista real de deudas (cómo organizarla)",
          "Priorizar: qué pagar primero y por qué",
          "Método bola de nieve (motivación)",
          "Método avalancha (matemática)",
          "Elegir método según tu situación"
        ]
      },
      {
        "title": "Subtema C: Salir y no volver",
        "lessons": [
          "Plan para salir de deuda en 30/60/90 días",
          "Cortar la causa (no solo pagar)",
          "Refinanciar: cuándo sí y cuándo no",
          "Evitar volver a caer (reglas personales)",
          "Caso: salir de deudas con ingresos limitados"
        ]
      }
    ]
  },
  {
    "topic": "15) Intereses",
    "subthemes": [
      {
        "title": "Subtema A: Conceptos base",
        "lessons": [
          "Qué es interés (en 1 minuto)",
          "Interés simple vs compuesto (con ejemplo)",
          "Interés a tu favor vs en tu contra",
          "Por qué el tiempo es el factor más fuerte",
          "Mini práctica: identificar si algo “cobra interés”"
        ]
      },
      {
        "title": "Subtema B: Costo real",
        "lessons": [
          "CAT explicado con ejemplo real",
          "Pago mínimo: por qué es trampa",
          "Intereses moratorios (pagar tarde sale caro)",
          "Cuándo conviene adelantar pagos",
          "Comparar 2 créditos: cuál es más caro y por qué"
        ]
      },
      {
        "title": "Subtema C: Decisiones con intereses",
        "lessons": [
          "Meses sin intereses: cuándo conviene y cuándo no",
          "Interés en tarjetas: cómo evitarlo siempre",
          "Interés en deudas: estrategia para reducirlo",
          "Interés compuesto en ahorro/inversión (idea)",
          "Caso: decisión inteligente con intereses"
        ]
      }
    ]
  },
  {
    "topic": "16) Protección financiera (seguros)",
    "subthemes": [
      {
        "title": "Subtema A: Riesgo",
        "lessons": [
          "Qué es riesgo financiero (con ejemplos)",
          "Riesgos típicos en jóvenes (salud, robo, accidente)",
          "Probabilidad vs impacto (lo importante)",
          "Qué riesgos se previenen con hábitos",
          "Checklist de riesgos personales básico"
        ]
      },
      {
        "title": "Subtema B: Seguros",
        "lessons": [
          "Qué es un seguro y cómo funciona",
          "Deducible, prima, cobertura (simple)",
          "Seguro útil vs seguro innecesario (criterios)",
          "Errores comunes al contratar",
          "Caso: elegir una cobertura básica correcta"
        ]
      },
      {
        "title": "Subtema C: Prevención + colchón",
        "lessons": [
          "Fondo de emergencia vs seguro (diferencia)",
          "Qué conviene primero según tu situación",
          "Evitar gastos catastróficos (reglas)",
          "Plan básico de protección personal",
          "Caso: imprevisto y qué herramienta usar"
        ]
      }
    ]
  },
  {
    "topic": "17) Impuestos básicos",
    "subthemes": [
      {
        "title": "Subtema A: Lo esencial",
        "lessons": [
          "Por qué existen los impuestos (sin política)",
          "IVA explicado fácil (en tu vida diaria)",
          "ISR explicado simple (idea general)",
          "Impuestos visibles e invisibles",
          "Por qué a ti te importa aunque seas joven"
        ]
      },
      {
        "title": "Subtema B: Vida real",
        "lessons": [
          "Ticket vs factura (diferencias)",
          "Para qué sirve una factura realmente",
          "Errores típicos (no pedir factura, datos mal)",
          "Multas, recargos y “por qué pagar tarde pega”",
          "Caso: leer un ticket y detectar IVA"
        ]
      },
      {
        "title": "Subtema C: Decisiones e ingresos",
        "lessons": [
          "Ingresos y obligaciones (concepto)",
          "Qué cambia si trabajas formal vs informal (simple)",
          "Deducciones: qué son (sin complicar)",
          "Buenas prácticas básicas (orden)",
          "Mini simulación: ingreso + impuesto (simple)"
        ]
      }
    ]
  },
  {
    "topic": "18) Fraudes y seguridad financiera",
    "subthemes": [
      {
        "title": "Subtema A: Fraudes comunes",
        "lessons": [
          "Estafas típicas en redes (señales)",
          "Phishing: links falsos y mensajes urgentes",
          "“Dinero rápido” y pirámides (red flags)",
          "Compras en línea falsas (cómo detectarlas)",
          "Caso: identificar si un mensaje es fraude"
        ]
      },
      {
        "title": "Subtema B: Protección",
        "lessons": [
          "Contraseñas seguras (sin complicar)",
          "2FA: qué es y por qué importa",
          "Qué hacer si te roban el celular (pasos)",
          "Qué hacer si caes en fraude (pasos)",
          "Checklist de seguridad personal"
        ]
      },
      {
        "title": "Subtema C: Prevención",
        "lessons": [
          "Regla de oro: nunca actuar con urgencia",
          "Verificar antes de pagar (pasos)",
          "Transferencias seguras (a quién sí y a quién no)",
          "Compras seguras (marketplaces, comprobantes)",
          "Mini simulación: compra segura vs riesgosa"
        ]
      }
    ]
  },
  {
    "topic": "19) Educación financiera digital",
    "subthemes": [
      {
        "title": "Subtema A: Herramientas",
        "lessons": [
          "Apps para registrar gastos (qué deben tener)",
          "Apps para metas y ahorro (cómo usarlas)",
          "Alertas bancarias (qué activar)",
          "Control de suscripciones (herramientas)",
          "Armar tu “stack” financiero digital básico"
        ]
      },
      {
        "title": "Subtema B: Banca digital",
        "lessons": [
          "Transferencias, límites y horarios (vida real)",
          "Comisiones digitales comunes (cuidado)",
          "Tarjetas digitales/virtuales (qué son)",
          "Cómo evitar errores en banca móvil",
          "Caso: configurar banca digital de forma segura"
        ]
      },
      {
        "title": "Subtema C: Hábitos digitales",
        "lessons": [
          "Rutina semanal (10 min) en apps",
          "Rutina mensual (20 min) en apps",
          "Orden digital de recibos/tickets",
          "Evitar compras impulsivas online (reglas)",
          "Mini reto: semana con control digital"
        ]
      }
    ]
  },
  {
    "topic": "20) Inflación",
    "subthemes": [
      {
        "title": "Subtema A: Concepto",
        "lessons": [
          "Qué es inflación (sin tecnicismos)",
          "Por qué suben precios (causas simples)",
          "Inflación vs “que todo está caro”",
          "Diferencia entre inflación baja y alta",
          "Caso: precios hoy vs hace 2 años"
        ]
      },
      {
        "title": "Subtema B: Impacto personal",
        "lessons": [
          "Cómo afecta tu ahorro",
          "Cómo afecta tu salario o mesada",
          "Errores comunes en inflación (compras impulsivas)",
          "Ajustar presupuesto en inflación",
          "Mini simulación: inflación y poder de compra"
        ]
      },
      {
        "title": "Subtema C: Estrategia",
        "lessons": [
          "Protegerte sin pánico (reglas)",
          "Qué decisiones ayudan (ahorro, gasto, ingresos)",
          "Inflación y deuda (qué conviene)",
          "Inflación e inversión (idea base)",
          "Plan simple para “épocas caras”"
        ]
      }
    ]
  },
  {
    "topic": "21) Activos vs pasivos",
    "subthemes": [
      {
        "title": "Subtema A: Concepto",
        "lessons": [
          "Qué es un activo (simple y medible)",
          "Qué es un pasivo (simple y medible)",
          "Cómo distinguirlos en 10 segundos",
          "Activos/pasivos en tu vida diaria (prepa)",
          "Mini práctica: clasificar 10 ejemplos"
        ]
      },
      {
        "title": "Subtema B: Vida real",
        "lessons": [
          "Ejemplos típicos de jóvenes (lo que confunde)",
          "“Esto parece activo pero no lo es” (casos)",
          "El costo total de un pasivo (más allá del precio)",
          "Activo que requiere mantenimiento (realidad)",
          "Caso: elegir entre 2 decisiones (activo vs pasivo)"
        ]
      },
      {
        "title": "Subtema C: Decisiones",
        "lessons": [
          "Reglas para comprar sin destruir tu patrimonio",
          "Convertir gasto en inversión (cuando sí se puede)",
          "Priorizar activos antes de lujos (sin moralina)",
          "Errores comunes al “querer verse bien”",
          "Checkpoint: mis reglas personales activos/pasivos"
        ]
      }
    ]
  },
  {
    "topic": "22) Ingresos y generación de dinero",
    "subthemes": [
      {
        "title": "Subtema A: Fundamentos",
        "lessons": [
          "Cómo se genera ingreso en el mundo real",
          "Ingreso activo vs variable (ejemplos reales)",
          "Habilidades que pagan (cómo elegir)",
          "Tiempo vs dinero (tradeoffs)",
          "Mini plan: cómo subir ingreso con habilidad"
        ]
      },
      {
        "title": "Subtema B: Valor y negociación",
        "lessons": [
          "Qué es “valor” en el mercado (simple)",
          "Cómo fijar un precio a tu trabajo (básico)",
          "Cómo pedir mejor pago sin pena (pasos)",
          "Errores al negociar (y cómo evitarlos)",
          "Caso: negociar un pago por un servicio"
        ]
      },
      {
        "title": "Subtema C: Crecimiento",
        "lessons": [
          "Escalar ingresos con habilidades (no solo trabajar más)",
          "Sistemas: repetir, no improvisar",
          "Diferenciar esfuerzo de estrategia",
          "Construir reputación (y por qué paga)",
          "Checkpoint: mi plan de crecimiento de ingresos"
        ]
      }
    ]
  },
  {
    "topic": "23) Ingresos pasivos",
    "subthemes": [
      {
        "title": "Subtema A: Realidad (sin humo)",
        "lessons": [
          "Qué sí es ingreso pasivo",
          "Qué NO es ingreso pasivo (mitos)",
          "“Pasivo” casi siempre requiere trabajo antes",
          "Tiempo, capital y riesgo en ingresos pasivos",
          "Señales de estafa del “pasivo rápido”"
        ]
      },
      {
        "title": "Subtema B: Bases",
        "lessons": [
          "Primero activo, luego ingreso pasivo",
          "Capital: de dónde sale en la vida real",
          "Reglas para no caer en promesas falsas",
          "Pasivo pequeño vs pasivo grande",
          "Caso: evaluar una propuesta “pasiva”"
        ]
      },
      {
        "title": "Subtema C: Ejemplos realistas",
        "lessons": [
          "Ejemplos simples (bajo riesgo)",
          "Ejemplos moderados (más riesgo)",
          "Ejemplos digitales (con trabajo previo)",
          "Errores comunes al intentar pasivos",
          "Checkpoint: distinguir pasivo real vs mito"
        ]
      }
    ]
  },
  {
    "topic": "24) Inversión básica",
    "subthemes": [
      {
        "title": "Subtema A: Conceptos",
        "lessons": [
          "Ahorrar vs invertir (criterio claro)",
          "Horizonte de inversión (tiempo)",
          "Rendimiento esperado vs realidad",
          "Liquidez: cuándo importa",
          "Mini práctica: elegir ahorro vs inversión en 5 casos"
        ]
      },
      {
        "title": "Subtema B: Instrumentos base",
        "lessons": [
          "Renta fija vs renta variable (simple)",
          "ETFs y fondos (concepto general)",
          "Acciones: qué son (sin trading)",
          "Diversificación dentro de un instrumento",
          "Caso: elegir instrumento según objetivo"
        ]
      },
      {
        "title": "Subtema C: Empezar",
        "lessons": [
          "Cómo empezar con poco sin improvisar",
          "Errores del principiante (comunes)",
          "Consistencia: aportar cada mes (idea)",
          "Plan de inversión simple (reglas)",
          "Checkpoint: mi estrategia inicial de inversión"
        ]
      }
    ]
  },
  {
    "topic": "25) Riesgo financiero",
    "subthemes": [
      {
        "title": "Subtema A: Tipos de riesgo",
        "lessons": [
          "Riesgo de mercado (concepto simple)",
          "Riesgo personal (deuda, ingresos, emergencias)",
          "Riesgo de liquidez (no poder sacar dinero)",
          "Riesgo de estafa (seguridad)",
          "Mini práctica: identificar riesgos en escenarios"
        ]
      },
      {
        "title": "Subtema B: Perfil y tolerancia",
        "lessons": [
          "Perfil conservador/moderado/agresivo",
          "Qué pasa cuando tu perfil no coincide con tu inversión",
          "Riesgo vs recompensa (sin fórmula)",
          "Pérdidas: cómo se ven y cómo se manejan",
          "Caso: elegir inversión según perfil"
        ]
      },
      {
        "title": "Subtema C: Control del riesgo",
        "lessons": [
          "Riesgos que sí controlas (hábitos)",
          "Diversificación como control (idea)",
          "Evitar decisiones impulsivas (regla)",
          "No apostar todo a una sola jugada",
          "Checkpoint: mi regla personal de riesgo"
        ]
      }
    ]
  },
  {
    "topic": "26) Diversificación",
    "subthemes": [
      {
        "title": "Subtema A: Concepto",
        "lessons": [
          "Qué es diversificar y por qué funciona",
          "No poner todo en uno (casos reales)",
          "Diversificar no es comprar “de todo”",
          "Correlación simple (sin tecnicismos)",
          "Mini práctica: detectar mala diversificación"
        ]
      },
      {
        "title": "Subtema B: Cómo diversificar",
        "lessons": [
          "Diversificar por instrumento",
          "Diversificar por sector/tema (idea simple)",
          "Diversificar por tiempo (entradas escalonadas)",
          "Diversificar por objetivo (corto vs largo)",
          "Caso: mejorar una cartera mal diversificada"
        ]
      },
      {
        "title": "Subtema C: Errores comunes",
        "lessons": [
          "“Tengo muchas cosas” ≠ diversificado",
          "Diversificar sin entender qué compras",
          "Cambiar cartera cada semana (error)",
          "Sobrediversificación (también pasa)",
          "Checkpoint: reglas simples para diversificar"
        ]
      }
    ]
  },
  {
    "topic": "27) Construcción de patrimonio",
    "subthemes": [
      {
        "title": "Subtema A: Base",
        "lessons": [
          "Qué es patrimonio neto (simple)",
          "Cómo medirlo sin complicarte",
          "Activos, pasivos y patrimonio (conexión)",
          "Patrimonio vs ingreso (diferencia)",
          "Mini práctica: calcular patrimonio neto básico"
        ]
      },
      {
        "title": "Subtema B: Crecimiento",
        "lessons": [
          "Hábitos que construyen patrimonio",
          "Decisiones que destruyen patrimonio",
          "Reinvertir vs gastar ganancias",
          "Aumentar patrimonio con consistencia",
          "Caso: dos caminos, dos patrimonios"
        ]
      },
      {
        "title": "Subtema C: Largo plazo",
        "lessons": [
          "Pensar en décadas sin volverte loco",
          "Evitar “crecer y gastar todo”",
          "Reglas de protección del patrimonio",
          "Plan anual de patrimonio (simple)",
          "Checkpoint: mi mapa patrimonial"
        ]
      }
    ]
  },
  {
    "topic": "28) Estrategia financiera personal",
    "subthemes": [
      {
        "title": "Subtema A: Diseño",
        "lessons": [
          "Mis prioridades reales (orden)",
          "Mis reglas de gasto (claras)",
          "Mis reglas de ahorro (mínimos)",
          "Mis reglas de deuda (límites)",
          "Checkpoint: mi manual de dinero v1"
        ]
      },
      {
        "title": "Subtema B: Plan 12 meses",
        "lessons": [
          "Plan anual simple (metas)",
          "Escenarios: si gano más",
          "Escenarios: si gano menos",
          "Ajustes trimestrales (sin drama)",
          "Caso: corregir un plan que falló"
        ]
      },
      {
        "title": "Subtema C: Seguimiento",
        "lessons": [
          "Métricas personales (3 indicadores)",
          "Revisión mensual (20 min)",
          "Revisión trimestral (1 hora)",
          "Automatizar decisiones (menos estrés)",
          "Checkpoint: mi sistema de seguimiento"
        ]
      }
    ]
  },
  {
    "topic": "29) Libertad financiera",
    "subthemes": [
      {
        "title": "Subtema A: Definición real",
        "lessons": [
          "Qué es libertad financiera (realista)",
          "Qué NO es (lujo, fama, “dinero infinito”)",
          "Libertad vs apariencia de libertad",
          "Libertad como margen y opciones",
          "Mini práctica: identificar libertad real en escenarios"
        ]
      },
      {
        "title": "Subtema B: Camino",
        "lessons": [
          "Control → crecimiento → patrimonio (ruta)",
          "Errores que retrasan libertad (deuda, impulsos)",
          "Aumentar margen sin aumentar estrés",
          "Reglas para sostener el camino",
          "Caso: plan realista hacia libertad"
        ]
      },
      {
        "title": "Subtema C: Medición",
        "lessons": [
          "Métrica simple de avance (sin complicar)",
          "Tiempo: cuánto te falta (estimación)",
          "Ajustar estrategia sin abandonar",
          "Mantener hábitos cuando ya te va bien",
          "Checkpoint: mi indicador de libertad"
        ]
      }
    ]
  },
  {
    "topic": "30) Emprendimiento financiero",
    "subthemes": [
      {
        "title": "Subtema A: Números del negocio",
        "lessons": [
          "Ingresos, costos y utilidad (negocio)",
          "Costos fijos vs variables (negocio)",
          "Margen: por qué importa",
          "Flujo de efectivo del negocio (oxígeno)",
          "Caso: negocio con ventas pero sin dinero"
        ]
      },
      {
        "title": "Subtema B: Precio",
        "lessons": [
          "Precio vs valor (sin pena cobrar)",
          "Cómo poner precio (3 métodos simples)",
          "Errores al cobrar barato",
          "Subir precio sin perder clientes (idea)",
          "Caso: ajustar precio para ser rentable"
        ]
      },
      {
        "title": "Subtema C: Crecer",
        "lessons": [
          "Reinvertir vs sacar ganancias (decisión clave)",
          "Separar finanzas personales y del negocio",
          "Escalar sin morir de flujo",
          "Indicadores básicos (ventas, margen, flujo)",
          "Checkpoint: plan financiero de mi negocio"
        ]
      }
    ]
  }
];

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

async function main() {
  console.log('🗑️  Truncating lesson/course/topic tables...');
  
  // We need to clear in order due to foreign keys
  // Progress and other relations might need cleaning too
  await prisma.progress.deleteMany({});
  await prisma.enrollment.deleteMany({});
  await prisma.schoolTopic.deleteMany({});
  await prisma.lessonStep.deleteMany({});
  await prisma.option.deleteMany({});
  await prisma.question.deleteMany({});
  await prisma.quiz.deleteMany({});
  await prisma.lesson.deleteMany({});
  await prisma.section.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.topic.deleteMany({});

  console.log('🌱 Seeding new curriculum...');

  const iconMap: Record<string, string> = {
    "1": "Wallet", "2": "Brain", "3": "Zap", "4": "Coins", "5": "RefreshCw",
    "6": "Calculator", "7": "Target", "8": "PiggyBank", "9": "Rocket", "10": "Layout",
    "11": "Landmark", "12": "CreditCard", "13": "FileText", "14": "AlertTriangle", "15": "TrendingUp",
    "16": "ShieldCheck", "17": "Receipt", "18": "ShieldAlert", "19": "Smartphone", "20": "Coins",
    "21": "Briefcase", "22": "Presentation", "23": "BarChart4", "24": "LineChart", "25": "ShieldAlert",
    "26": "PieChart", "27": "Layers", "28": "Settings", "29": "Star", "30": "Lightbulb"
  };

  const levelMap: Record<string, string> = {
    "1": "Fundamentos", "2": "Mentalidad", "3": "Psicología", "4": "Gastos", "5": "Flujo",
    "6": "Presupuesto", "7": "Hábitos", "8": "Ahorro", "9": "Metas", "10": "Planeación",
    "11": "Sistema", "12": "Crédito", "13": "Historial", "14": "Deuda", "15": "Intereses",
    "16": "Seguros", "17": "Impuestos", "18": "Seguridad", "19": "Digital", "20": "Economía",
    "21": "Patrimonio", "22": "Ingresos", "23": "Inversión", "24": "Fundamentos", "25": "Riesgo",
    "26": "Estrategia", "27": "Futuro", "28": "Bienestar", "29": "Libertad", "30": "Emprender"
  };

  for (let i = 0; i < curriculum.length; i++) {
    const topicData = curriculum[i];
    const topicIdx = i + 1;
    const rawTopicTitle = topicData.topic.replace(/^\d+\)\s*/, '');
    const topicTitle = (rawTopicTitle.toLowerCase().startsWith('qué') || 
                        rawTopicTitle.toLowerCase().startsWith('cómo') || 
                        rawTopicTitle.toLowerCase().startsWith('cuándo') || 
                        rawTopicTitle.toLowerCase().startsWith('a dónde') || 
                        rawTopicTitle.toLowerCase().startsWith('de dónde') || 
                        rawTopicTitle.toLowerCase().startsWith('por qué') ||
                        rawTopicTitle.toLowerCase().startsWith('cuánto')) && !rawTopicTitle.includes('?') 
                        ? `¿${rawTopicTitle}?` : rawTopicTitle;
    
    console.log(`Creating Topic ${topicIdx}: ${topicTitle}`);
    
    const topic = await prisma.topic.create({
      data: {
        id: `tema-${topicIdx.toString().padStart(2, '0')}`,
        title: topicTitle,
        description: `Contenido educativo nivel ${topicIdx}`,
        level: levelMap[topicIdx.toString()] || "General",
        isActive: true,
        displayOrder: topicIdx,
        icon: iconMap[topicIdx.toString()] || "BookOpen"
      }
    });

    for (let j = 0; j < topicData.subthemes.length; j++) {
      const subthemeData = topicData.subthemes[j];
      const course = await prisma.course.create({
        data: {
          id: `course-${topicIdx}-${j+1}`,
          topicId: topic.id,
          title: subthemeData.title.replace(/^Subtema\s+[A-Z]:\s*/i, ''),
          order: j + 1,
          isLocked: false
        }
      });

      for (let k = 0; k < subthemeData.lessons.length; k++) {
        const rawLessonTitle = subthemeData.lessons[k];
        const lessonTitle = (rawLessonTitle.toLowerCase().startsWith('qué') || 
                             rawLessonTitle.toLowerCase().startsWith('cómo') || 
                             rawLessonTitle.toLowerCase().startsWith('cuándo') || 
                             rawLessonTitle.toLowerCase().startsWith('qué') || 
                             rawLessonTitle.toLowerCase().startsWith('a dónde') || 
                             rawLessonTitle.toLowerCase().startsWith('de dónde') || 
                             rawLessonTitle.toLowerCase().startsWith('por qué') ||
                             rawLessonTitle.toLowerCase().startsWith('cuánto')) && !rawLessonTitle.includes('?') 
                             ? `¿${rawLessonTitle}?` : rawLessonTitle;
        const slug = slugify(lessonTitle);
        
        await prisma.lesson.create({
          data: {
            id: slug,
            courseId: course.id,
            title: lessonTitle,
            contentType: 'reading',
            order: k + 1,
            xpReward: 50
          }
        });
      }
    }
  }

  // Also enable all topics for the demo school if it exists
  const demoSchoolId = 'demo-school-1';
  const school = await prisma.school.findUnique({ where: { id: demoSchoolId } });
  if (school) {
    console.log(`Enabling all topics for ${school.name}...`);
    const allTopics = await prisma.topic.findMany();
    for (const t of allTopics) {
      await prisma.schoolTopic.upsert({
        where: { schoolId_topicId: { schoolId: demoSchoolId, topicId: t.id } },
        update: { isEnabled: true },
        create: { schoolId: demoSchoolId, topicId: t.id, isEnabled: true }
      });
    }
  }

  console.log('✅ Curriculum re-seeded successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
