import type { LessonStep } from "@/types/lessonTypes"

// ---------------------------------------------------------------------------
// LECCIÓN 1: ¿Qué es el dinero y las finanzas? 
// Slug: "el-dinero-y-las-finanzas"
// ---------------------------------------------------------------------------
export const lessonElDineroYLasFinanzasSteps: LessonStep[] = [
  {
    id: "dinero-finanzas-1",
    type: "story",
    title: "Sistemas de Valor Intercambiable",
    body: "La sociedad opera como un gran sistema termodinámico donde intercambiamos energía. El dinero es simplemente el conductor de esa energía. Las finanzas son las reglas de física que determinan hacia dónde fluye.\n\nSin comprender este [[Sistema Fiduciario|Red de confianza donde el valor del dinero se basa en la fe y el respaldo gubernamental, no en el oro.]], estás jugando un juego cuyas reglas desconoces.",
    data: {
      glossary: [
        { term: "Sistema Fiduciario", definition: "Red de confianza donde el valor del dinero se basa en la fe y el respaldo gubernamental, no en el oro." },
        { term: "Flujo de Efectivo", definition: "El movimiento neto de dinero que entra y sale de un sistema (tú) en un periodo de tiempo." }
      ]
    }
  },
  {
    id: "dinero-finanzas-2",
    type: "swipe_sorter",
    title: "Calibración Rápida",
    body: "¿Qué concepto representa a los sistemas que absorben energía (dinero) vs los que la inyectan?",
    data: {
      items: [
        { id: "1", text: "Tarjeta de crédito pagando intereses", category: "Absorbe Valor" },
        { id: "2", text: "Compra de certificados del tesoro (CETES)", category: "Inyecta Valor" },
        { id: "3", text: "Suscripciones no utilizadas", category: "Absorbe Valor" },
        { id: "4", text: "Mejorar tus habilidades de mercado (Soft Skills)", category: "Inyecta Valor" }
      ],
      categories: ["Absorbe Valor", "Inyecta Valor"]
    }
  },
  {
    id: "dinero-finanzas-3",
    type: "concept",
    title: "Arquitectura del Dinero",
    aiInsight: "El dinero moderno no es un pedazo de papel, es un sistema de bases de datos. Cuando te pagan, solo cambian números en el servidor de Banxico.",
    body: "El dinero cumple 3 parámetros estructurales obligatorios:\n\n1. **Medio de Cambio**: Facilita transacciones sin necesidad de trueque.\n2. **Unidad de Cuenta**: Estandariza cuánto vale la energía de otros.\n3. **Reserva de Valor**: Permite mover poder adquisitivo desde el presente hacia el futuro (siempre y cuando venza a la inflación)."
  },
  {
    id: "dinero-finanzas-4",
    type: "impulse_meter",
    title: "Medición de Ansiedad Operativa",
    body: "En una escala de reactividad, ¿qué tanta fricción e impaciencia sientes actualmente cuando piensas en revisar tus flujos de efectivo bancarios?",
    data: {
      minLabel: "Control Total",
      maxLabel: "Evasión Máxima (Ansiedad)",
      targetValue: 2,
      resultText: "Interesante. Esa evasión es la principal métrica de desconexión del sistema."
    }
  },
  {
    id: "dinero-finanzas-5",
    type: "story",
    title: "Cambiando la Perspectiva",
    body: "Observarlo con frialdad matemática: no importa cuánto ganes hoy. Lo que importa es el Delta (Δ), la diferencia neta entre la energía que generas y la energía que disipas en ineficiencias (gastos).\n\nAquí es donde entra la maestría del [[Flujo de Efectivo|El movimiento neto de dinero que entra y sale de un sistema (tú) en un periodo de tiempo.]]."
  },
  {
    id: "dinero-finanzas-6",
    type: "blitz_challenge",
    title: "Reacción Estructural I",
    body: "El dinero funciona principalmente para:",
    data: {
      timeLimit: 15,
      options: [
        { id: "1", text: "Garantizar estatus social en un entorno." },
        { id: "2", text: "Transferir energía de valor entre partes.", isCorrect: true },
        { id: "3", text: "Mantener el control inflacionario." }
      ],
      correctFeedback: "Exacto. Es un vector de transferencia de energía.",
      incorrectFeedback: "Error. Su naturaleza pura no es el estatus, es el intercambio."
    }
  },
  {
    id: "dinero-finanzas-7",
    type: "mindset_translator",
    title: "Desacoplando el Dinero",
    body: "Las estructuras fallan cuando la emoción dicta el flujo. Transforma esta creencia emocional en una regla estructural:",
    data: {
      limitingBelief: "El dinero es difícil de conseguir y rápido de perder.",
      options: [
        { id: "1", text: "El dinero se capta mediante sistemas de alto valor y se protege mediante auditorías de egreso.", isLogical: true },
        { id: "2", text: "El dinero se debe ahorrar debajo de un colchón.", isLogical: false },
        { id: "3", text: "Hay que trabajar 80 horas a la semana para retenerlo.", isLogical: false }
      ]
    }
  },
  {
    id: "dinero-finanzas-8",
    type: "concept",
    title: "El Origen de las Finanzas",
    body: "La palabra finanzas procede del latín 'finis' (terminar/pagar). En términos modernos, es la **ciencia de la optimización del valor en escalas temporales**.\n\nSignifica entender cuándo extraer liquidez hoy, versus inyectar capital para tener liquidez multiplicada mañana."
  },
  {
    id: "dinero-finanzas-9",
    type: "order_priority",
    title: "Cadena de Suministro del Valor",
    body: "Ordena los pasos lógicos del viaje de tu capital:",
    data: {
      items: [
        { id: "1", text: "Generación de ingreso por intercambio de habilidades" },
        { id: "2", text: "Poda y auditoría de salidas (gastos no estructurales)" },
        { id: "3", text: "Blindaje en reservas estratégicas (fondo emergencia)" },
        { id: "4", text: "Inyección de excedentes en activos productivos" }
      ]
    }
  },
  {
    id: "dinero-finanzas-10",
    type: "story",
    title: "Tú Eres un Micro-Estado",
    aiInsight: "Trata tu cuenta de banco como si fuera el Banco Central de tu propia República Autónoma. Tú decides las tasas de interés de tus deudas y en qué se invierte el PIB de tu persona.",
    body: "Las finanzas no son para los bancos de Wall Street, son las matemáticas detrás de tus decisiones de vida. Si no administras la entrada y salida de tu caja nacional, otros mercados corporativos vendrán a drenarla a nivel micro mediante suscripciones y consumos."
  },
  {
    id: "dinero-finanzas-11",
    type: "blitz_challenge",
    title: "Reacción Estructural II",
    body: "Una de las funciones principales de las finanzas es:",
    data: {
      timeLimit: 12,
      options: [
        { id: "1", text: "Hacer dinero rápido." },
        { id: "2", text: "Optimizar el valor a través del tiempo.", isCorrect: true },
        { id: "3", text: "Evadir el pago de responsabilidades fiscales." }
      ],
      correctFeedback: "Correcto. El tiempo es el multiplicador.",
      incorrectFeedback: "Falso. La velocidad sin estructura destruye el capital."
    }
  },
  {
    id: "dinero-finanzas-12",
    type: "concept",
    title: "Micro y Macro",
    body: "Un sistema se analiza desde adentro hacia afuera.\n\n**Finanzas Personales:** Cómo optimizas los flujos de un individuo.\n**Finanzas Corporativas:** Cómo escalar la infraestructura de valor de una empresa.\n**Finanzas Públicas:** Cómo un Estado decide dónde inyectar o extraer liquidez a la sociedad."
  },
  {
    id: "dinero-finanzas-13",
    type: "swipe_sorter",
    title: "Identificación de Ámbito",
    body: "Determina a qué categoría pertenecen estos flujos de decisiones:",
    data: {
      items: [
        { id: "1", text: "Reducción de consumo en plataformas de streaming", category: "Personal" },
        { id: "2", text: "Aumento de la tasa de interés base por parte de Banxico", category: "Pública" },
        { id: "3", text: "Auditoría de gastos recurrentes no esenciales", category: "Personal" },
        { id: "4", text: "Emisión de deuda gubernamental", category: "Pública" }
      ],
      categories: ["Personal", "Pública"]
    }
  },
  {
    id: "dinero-finanzas-14",
    type: "narrative_check",
    title: "Fallo o Eficiencia",
    body: "¿En qué etapa de la cadena de provisión financiera (Generar, Optimizar, Proteger, Inyectar) identificas la mayor ineficiencia en tu sistema actual y por qué?",
    data: {
      placeholder: "Actualmente tengo un déficit en Optimizar porque...",
      minChars: 30
    }
  },
  {
    id: "dinero-finanzas-15",
    type: "completion",
    title: "Protocolo 1 Establecido",
    body: "Has inicializado el framework conceptual. Dejas de ser un habitante aleatorio del mercado, para empezar a visualizar el dinero como una infraestructura de algoritmos que puedes operar a tu favor."
  }
];

// ---------------------------------------------------------------------------
// LECCIÓN 2: ¿Qué son las finanzas? 
// Slug: "que-son-las-finanzas"
// ---------------------------------------------------------------------------
export const lessonQueSonLasFinanzasSteps: LessonStep[] = [
  {
    id: "q-son-finanzas-1",
    type: "story",
    title: "Traduciendo el Lenguaje del Mercado",
    body: "A menudo se dice que las matemáticas son el lenguaje del universo. Bueno, las **finanzas** son el lenguaje del mercado humano.\n\nEs la rama de la economía dedicada puramente a observar cómo se mueven las unidades de valor ([[Capital|Recursos financieros, físicos o intelectuales que tienen un valor y se usan para generar más riqueza.]]) en entornos de incertidumbre.",
    data: {
      glossary: [
        { term: "Capital", definition: "Recursos financieros, físicos o intelectuales que tienen un valor y se usan para generar más riqueza." },
        { term: "Riesgo Sistemático", definition: "La probabilidad matemática de que una estructura pierda valor o colapse debido a factores inevitables del mercado local o global." }
      ]
    }
  },
  {
    id: "q-son-finanzas-2",
    type: "concept",
    title: "Dinámica vs Estática",
    body: "La contabilidad es estática: te dice dónde *estaba* tu dinero ayer. Es una autopsia financiera.\n\nLas finanzas son dinámicas y proyectivas: Utilizan probabilidades para definir y predecir hacia dónde *debería ir* tu capital hoy, para asegurarte un nivel de eficiencia óptimo en el punto T+5 (dentro de 5 años)."
  },
  {
    id: "q-son-finanzas-3",
    type: "swipe_sorter",
    title: "Contabilidad vs Finanzas",
    body: "Clasifica estas acciones como ejercicios Contables (pasado estático) o Financieros (futuro proyectivo).",
    data: {
      items: [
        { id: "1", text: "Registrar boletos de cine del mes pasado", category: "Contable" },
        { id: "2", text: "Calcular el interés compuesto en inversiones a 10 años", category: "Financiero" },
        { id: "3", text: "Evaluar el costo de oportunidad de comprar un coche hoy", category: "Financiero" },
        { id: "4", text: "Sumar los recibos de la luz anuales", category: "Contable" }
      ],
      categories: ["Contable", "Financiero"]
    }
  },
  {
    id: "q-son-finanzas-4",
    type: "impulse_meter",
    title: "Horizonte de Eventos Fiduciarios",
    body: "Se honesto: Cuando piensas en tus finanzas, ¿tu mente proyecta su estado actual en base a los últimos 30 días, o en proyecciones a 10 años?",
    data: {
      minLabel: "Corto Plazo (Supervivencia)",
      maxLabel: "Largo Plazo (Expansión)",
      targetValue: 8,
      resultText: "La madurez del operador se mide en la lejanía de su horizonte de cálculo."
    }
  },
  {
    id: "q-son-finanzas-5",
    type: "story",
    title: "El Elemento del Riesgo",
    aiInsight: "Casi nadie te dice esto: Las finanzas nacen principalmente para manejar y cuantificar el 'miedo' humano a la pérdida futura. Si supiéramos el futuro 100% seguro, las finanzas no existirían.",
    body: "No existe transferencia de valor en el tiempo sin enfrentar la fricción del mercado. Esa fricción se calcula y se nombra: [[Riesgo Sistemático|La probabilidad matemática de que una estructura pierda valor o colapse debido a factores inevitables del mercado local o global.]]. Las finanzas te enseñan a ponerle un precio a ese riesgo."
  },
  {
    id: "q-son-finanzas-6",
    type: "blitz_challenge",
    title: "Prueba Táctica Temporal",
    body: "La diferencia central entre contabilidad y finanzas es...",
    data: {
      timeLimit: 12,
      options: [
        { id: "1", text: "Contabilidad ignora el gasto, finanzas te obliga a ahorrar." },
        { id: "2", text: "Contabilidad mira al pasado (registro), finanzas proyecta al futuro (riesgo-retorno).", isCorrect: true },
        { id: "3", text: "Son literalmente la misma rama matemática." }
      ],
      correctFeedback: "Perfecto. Operas hacia el futuro.",
      incorrectFeedback: "Falso. La segunda proyecta comportamientos futuros."
    }
  },
  {
    id: "q-son-finanzas-7",
    type: "concept",
    title: "Mercados Financieros: La Infraestructura",
    body: "Si tienes excedente de energía comercial, la inyectas en el sistema. Si te falta liquidez para expandir tu infraestructura, la extraes. Ese teatro de operaciones se llama **Mercado Financiero**.\n\nSu labor es unir hiper-eficientemente a quienes tienen capital ocioso, con quienes tienen arquitecturas y proyectos de expansión activos."
  },
  {
    id: "q-son-finanzas-8",
    type: "order_priority",
    title: "Cadena de Agregación",
    body: "Ordena los pasos desde que observamos el dinero hasta que gestionamos el riesgo:",
    data: {
      items: [
        { id: "1", text: "Aceptación del medio de intercambio comercial (Moneda)" },
        { id: "2", text: "Registro estático de entradas y requerimientos (Contabilidad)" },
        { id: "3", text: "Acumulación de capital por margen positivo (Ahorro/Excedente)" },
        { id: "4", text: "Proyección, análisis de riesgo y reubicación (Finanzas)" }
      ]
    }
  },
  {
    id: "q-son-finanzas-9",
    type: "story",
    title: "Intermediarios Estructurales",
    body: "Existen interfaces encargadas de operar este riesgo llamado Instituciones Financieras (bancos, aseguradoras, bolsas de valores). Ellas son los servidores que dirigen los algoritmos para que no tengas que buscar manualmente en la calle a un inversor ni a un deudor."
  },
  {
    id: "q-son-finanzas-10",
    type: "mindset_translator",
    title: "El Riesgo Codificado",
    body: "Convierte esta visión de pánico en mentalidad analítica del riesgo:",
    data: {
      limitingBelief: "Invertir es apostar y prefiero no arriesgar mi dinero.",
      options: [
        { id: "1", text: "El dinero es sagrado y prefiero inmovilizarlo 40 años.", isLogical: false },
        { id: "2", text: "Las finanzas miden y mitigan riesgos; una inversión sin matemáticas es apuesta, con matemáticas es probabilidad.", isLogical: true },
        { id: "3", text: "Cualquier riesgo destruye el capital, por lo tanto huiré del mercado.", isLogical: false }
      ]
    }
  },
  {
    id: "q-son-finanzas-11",
    type: "blitz_challenge",
    title: "Identificación de Intermediarios",
    body: "¿Cuál es la función nuclear de un mercado financiero?",
    data: {
      timeLimit: 15,
      options: [
        { id: "1", text: "Conectar a entidades con liquidez ociosa con entidades que requieren inversión.", isCorrect: true },
        { id: "2", text: "Imprimir más billetes si la demanda es alta." },
        { id: "3", text: "Vender seguros de coche a los usuarios." }
      ],
      correctFeedback: "Exacto. Optimiza la conexión de capital.",
      incorrectFeedback: "Incorrecto. Se encarga de transferir excedentes a operativos."
    }
  },
  {
    id: "q-son-finanzas-12",
    type: "concept",
    title: "El Tiempo y su Valor de Caída",
    aiInsight: "Concepto TVM (Time Value of Money): Un peso hoy vale más que un peso dentro de 5 años. Si ignoras esta regla cardinal, las matemáticas de la inflación disolverán tu infraestructura lentamente.",
    body: "Esta ley impone urgencia operativa. Entender las finanzas significa que debes poner tu estructura a trabajar mucho antes de que la entropía (inflación y degradación del poder de compra) le reste poder adquisitivo."
  },
  {
    id: "q-son-finanzas-13",
    type: "narrative_check",
    title: "Reconociendo la Inflación del Tiempo",
    body: "En tus propias palabras de 'Ingeniero Financiero', ¿por qué el simple hecho de guardar billetes bajo el colchón o en cuenta inactiva a 10 años, es sistemáticamente equivalente a perder dinero?",
    data: {
      placeholder: "Por la pérdida progresiva de p...",
      minChars: 30
    }
  },
  {
    id: "q-son-finanzas-14",
    type: "swipe_sorter",
    title: "Decisiones Financieras",
    body: "Evalúa al vuelo: estas acciones revelan conocimiento del VTD (Valor del Tiempo) o ignorancia sistemática.",
    data: {
      items: [
        { id: "1", text: "Mantener 90% de ahorros en cuenta sin rendimientos (Nómina)", category: "Ignorancia" },
        { id: "2", text: "Pagar con TdC para ganar puntos e invertir el líquido por 30 días", category: "Dominio" },
        { id: "3", text: "Adelantar compras importadas necesarias si se avizora devaluación", category: "Dominio" },
        { id: "4", text: "Llevar solo contabilidad de gastos mensuales", category: "Ignorancia" }
      ],
      categories: ["Ignorancia", "Dominio"]
    }
  },
  {
    id: "q-son-finanzas-15",
    type: "completion",
    title: "Mecánica Desmitificada",
    body: "Ya sabes qué son. No es magia, no es azar ni es avaricia. Es optimización, control del tiempo y gestión del riesgo. Avanza asimilando al mercado y sus señales."
  }
];

// ---------------------------------------------------------------------------
// LECCIÓN 3: ¿Por qué son importantes las finanzas? 
// Slug: "importancia-de-las-finanzas"
// ---------------------------------------------------------------------------
export const lessonImportanciaDeLasFinanzasSteps: LessonStep[] = [
  {
    id: "importancia-finanzas-1",
    type: "story",
    title: "La Asimetría de la Ignorancia",
    body: "No jugar el juego financiero no te exime de sus consecuencias. Cuando alguien menciona la frase: 'Las finanzas no importan', está voluntariamente declarando que otros operarán la optimización en su nombre... llevándose el [[Margen de Rendimiento|Ganancia excedente tras cubrir los costos de fricción y riesgos.]].",
    data: {
      glossary: [
        { term: "Margen de Rendimiento", definition: "Ganancia excedente generada sobre una inversión inicial, tras cubrir los costos de fricción y riesgos." },
        { term: "Supervivencia Estructural", definition: "La capacidad de un sistema (o persona) para soportar impactos (ej. inflación, desempleo) sin que colapse su nivel de vida." }
      ]
    }
  },
  {
    id: "importancia-finanzas-2",
    type: "concept",
    title: "Por qué importan: Eje de Supervivencia",
    body: "Las finanzas dictan la **[[Supervivencia Estructural|La capacidad de un sistema (o persona) para soportar impactos sin colapsar su nivel de vida.]]** a largo plazo.\n\nSin planificación del consumo de hoy, se hipoteca automáticamente el rendimiento y bienestar del 'Tú' de dentro de 10 años. Si hoy disipas todo el flujo en recompensas instantáneas, destruyes tus variables operativas futuras."
  },
  {
    id: "importancia-finanzas-3",
    type: "impulse_meter",
    title: "Check de Vulnerabilidad",
    body: "Si a partir de las 00:00 horas de mañana se cancelara estructuralmente tu ingreso lineal de sueldo (asalariado), ¿qué tanta fricción e impacto severo sentiría el sistema en sus primeros tres meses?",
    data: {
      minLabel: "Sistemas Intactos (Reservas OK)",
      maxLabel: "Colapso Estructural Inmediato",
      targetValue: 3,
      resultText: "Esta vulnerabilidad es la principal razón para dominar las finanzas orgánicamente."
    }
  },
  {
    id: "importancia-finanzas-4",
    type: "story",
    title: "Eje del Crecimiento",
    aiInsight: "Los empresarios no generan millardos acumulando de a billete en billete mensual, lo logran apalancando estructuras que multiplican el rendimiento. Dominar finanzas es dominar el apalancamiento.",
    body: "Más allá de no morir de hambre, importan porque permiten **Expansión Modular**. Saber evaluar deudas te permite usar dinero ajeno para comprar activos que producen flujos, transformando de manera algorítmica pasivos aparentes en aceleradores de liquidez."
  },
  {
    id: "importancia-finanzas-5",
    type: "swipe_sorter",
    title: "Clasificando Estrategias Vitales",
    body: "Determina si el motivo descrito pertenece al Eje de Supervivencia (no morir financieramente) o al Eje de Expansión (crecer aceleradamente).",
    data: {
      items: [
        { id: "1", text: "Fondo de emergencia del 10% del flujo neto", category: "Supervivencia" },
        { id: "2", text: "Tomar crédito hipotecario para rentarlo a inquilinos y cobrar diferencial", category: "Expansión" },
        { id: "3", text: "Auditar fugas por comisiones atrasadas", category: "Supervivencia" },
        { id: "4", text: "Invertir en portafolio de acciones de alto riesgo y alta fricción", category: "Expansión" }
      ],
      categories: ["Supervivencia", "Expansión"]
    }
  },
  {
    id: "importancia-finanzas-6",
    type: "blitz_challenge",
    title: "Identificación Modular 1",
    body: "La ignorancia de las finanzas resulta sistemáticamente en:",
    data: {
      timeLimit: 14,
      options: [
        { id: "1", text: "Aseguramiento vitalicio garantizado por bancos." },
        { id: "2", text: "Pérdida invisible del poder adquisitivo o quiebra estructural a largo plazo.", isCorrect: true },
        { id: "3", text: "Una vida deslindada de responsabilidades." }
      ],
      correctFeedback: "Exacto. El no-saber cuesta caro y es cobrado diario.",
      incorrectFeedback: "Falso. La pasividad cede control a sistemas agresivos del entorno."
    }
  },
  {
    id: "importancia-finanzas-7",
    type: "mindset_translator",
    title: "Optimización Crítica",
    body: "Muta la siguiente expresión de víctima hacia mentalidad de ejecutor financiero:",
    data: {
      limitingBelief: "El dinero no compra la felicidad, la paz mental es mejor.",
      options: [
        { id: "1", text: "El dinero no es un garante emocional, pero estructuralmente optimiza las probabilidades de mitigar tragedias (hambre, crisis, salud).", isLogical: true },
        { id: "2", text: "Tener dinero hace que la gente de negocios se corrompa en el mercado.", isLogical: false },
        { id: "3", text: "Debe eliminarse toda moneda para ser enteramente espirituales.", isLogical: false }
      ]
    }
  },
  {
    id: "importancia-finanzas-8",
    type: "concept",
    title: "Eje Institucional y Nacional",
    body: "A gran escala, las finanzas deciden no solo tu destino personal, sino la prosperidad humana. Una mala métrica de finanzas públicas destruye estructuras de escuelas y transporte; las buenas inversiones potencian avances biológicos y tecnológicos. Tus impuestos fluyen por las redes financieras a nivel macro."
  },
  {
    id: "importancia-finanzas-9",
    type: "order_priority",
    title: "Construcción por Capas de Importancia",
    body: "Si no priorizas bien, el sistema se cae. Ordena qué debes proteger/gestionar primero financieramente:",
    data: {
      items: [
        { id: "1", text: "Supervivencia física y protección de necesidades base" },
        { id: "2", text: "Liquidación y auditoría de deudas opresivas y de alto interés" },
        { id: "3", text: "Escudo temporal mediante Fondo de Emergencia de liquidez pura" },
        { id: "4", text: "Inyección de excedente riesgoso a largo plazo (Bolsa/Negocios)" }
      ]
    }
  },
  {
    id: "importancia-finanzas-10",
    type: "story",
    title: "Despierta al Arquitecto",
    aiInsight: "Tu ignorancia es el producto más rentable del mercado financiero gris. Cada año pagas miles de créditos impagables y tarjetas revolving solo porque su ingeniería superó a tu falta de conocimiento.",
    body: "Saber finanzas no es opcional ni un simple 'lujo de emprendedores'. Es el manual de supervivencia del siglo 21. Entender la diferencia entre la Tasa de Interés Nominal y la Tasa Efectiva, evita que te drenen la vida a cuotas."
  },
  {
    id: "importancia-finanzas-11",
    type: "blitz_challenge",
    title: "Fallo de Estructura 2",
    body: "Desde una perspectiva estructural, quien domina las finanzas en su entorno...",
    data: {
      timeLimit: 14,
      options: [
        { id: "1", text: "Decide cómo se canalizan los recursos ajenos y ejerce control algorítmico sobre decisiones.", isCorrect: true },
        { id: "2", text: "Sufre de mayor ansiedad en la cadena operativa." },
        { id: "3", text: "Normalmente ahorra metiendo dinero en efectivo congelado." }
      ],
      correctFeedback: "Afirmativo. Quien lee el código impone el destino.",
      incorrectFeedback: "Totalmente incorrecto. El dominio conlleva al entendimiento."
    }
  },
  {
    id: "importancia-finanzas-12",
    type: "concept",
    title: "Libertad vs Seguridad",
    body: "Se subestima la capacidad liberadora de las finanzas. Optimizar permite algo más valioso que 'comprar casas de lujo': compra **Agencia**. Compra la libertad matemática de decir 'NO' a un trabajo abusivo o 'SÍ' a un riesgo medido sabiendo que tu red financiera soporta el impacto si caes."
  },
  {
    id: "importancia-finanzas-13",
    type: "swipe_sorter",
    title: "Costo de Apatía",
    body: "Al no usar las finanzas (Apatía / Miedo), determinas si las siguientes situaciones son consecuencia indirecta en la calidad de tus sistemas operativos:",
    data: {
      items: [
        { id: "1", text: "Obligado a mantener contrato/empleo destructivo de salud mental", category: "Consecuencia" },
        { id: "2", text: "Independencia para experimentar modelos de negocio por un año", category: "Control Financiero" },
        { id: "3", text: "Miedo paralizante a un despido repentino por falta de fondo protector", category: "Consecuencia" },
        { id: "4", text: "Capacidad de mitigar enfermedades o urgencias quirúrgicas en privado", category: "Control Financiero" }
      ],
      categories: ["Consecuencia", "Control Financiero"]
    }
  },
  {
    id: "importancia-finanzas-14",
    type: "narrative_check",
    title: "Compresión de Carga de Miedo",
    body: "¿Cuál ha sido el evento o factor en tu vida que ha hecho que la gestión y optimización financiera actual de repente tenga más urgencia o importancia para ti?",
    data: {
      placeholder: "Me di cuenta que no puedo...",
      minChars: 30
    }
  },
  {
    id: "importancia-finanzas-15",
    type: "completion",
    title: "Protocolo 3 Finalizado",
    body: "La ignorancia es el impuesto más caro. Ahora conoces la razón fundamental de la optimización del valor: Comprar Agencia y Libertad para tu sistema a futuro."
  }
];
