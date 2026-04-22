import type { LessonStep } from "@/types/lessonTypes"

// ---------------------------------------------------------------------------
// SUBTEMA 13
// ---------------------------------------------------------------------------
export const lessonInterpretarIngresosGastosSteps: LessonStep[] = [
  {
    id: "int-ing-gas-1",
    stepType: "billy_talks",
    title: "La Traducción del Dinero",
    aiInsight: "Interpretar tus ingresos y gastos no es ver si la cuenta de banco sube o baja. Es entender el comportamiento de tus usuarios. Si tus ingresos de suscripción bajan, significa que tu Producto está fallando. Si tus Gastos Variables suben desproporcionadamente, significa que tienes una fuga de eficiencia.",
    body: "Tus ingresos deben ser diversificados, tus gastos deben ser justificados."
  },
  {
    id: "int-ing-gas-2",
    stepType: "info",
    title: "Traducción Táctica",
    body: "Un gasto no es una pérdida, es una inversión táctil."
  }
];

export const lessonUtilidadYPerdidasSteps: LessonStep[] = [
  {
    id: "uti-per-1",
    stepType: "billy_talks",
    title: "La Lógica Binaria de la Supervivencia",
    body: "En BIZEN sólo existen dos estados operativos: Utilidad (Estás creciendo) o Pérdida (Estás muriendo). La [[Utilidad Neta|El monto real de dinero que queda en la empresa después de pagar ABSOLUTAMENTE TODO.]] es tu métrica de éxito. Si facturas $10 millones, pero tus gastos son $11 millones, tienes una pérdida de $1 millón, estás quemando pólvora y tu negocio está destinado al fracaso, por más que brille tu logo.",
    data: { glossary: [{ word: "Utilidad Neta", definition: "El monto real de dinero que le queda a la empresa después de pagar todos sus costos operativos, gastos directos e impuestos." }] }
  },
  {
    id: "uti-per-2",
    stepType: "info",
    title: "El Juez Final",
    body: "La Utilidad Neta es el único juez que importa en los negocios."
  }
];

// ---------------------------------------------------------------------------
// SUBTEMA 14
// ---------------------------------------------------------------------------
export const lessonRazonesFinancierasIntroSteps: LessonStep[] = [
  {
    id: "raz-fin-1",
    stepType: "billy_talks",
    title: "Métricas de Supervivencia (KPIs Financieros)",
    aiInsight: "Las [[Razones Financieras|Fórmulas que calculan una métrica clave comparando dos cuentas de tus estados financieros.]] son tu panel de control BIZEN. Los contadores hacen los Estados Financieros, pero los Analistas extraen Razones (Ratios) para entender si la empresa es sana. Quieres un dashboard que te diga si el ROE (Return on Equity) o el Margen Neto están por debajo del 5% o por encima del 20%.",
    body: "Un CEO que no sabe medir las métricas operativas de su nave, vuela a ciegas."
  },
  {
    id: "raz-fin-2",
    stepType: "info",
    title: "Radar Paramétrico",
    body: "Las razones financieras son el pulso cardíaco de tu modelo de negocio."
  }
];

// ---------------------------------------------------------------------------
// SUBTEMA 15
// ---------------------------------------------------------------------------
export const lessonFinanciamientoQueEsSteps: LessonStep[] = [
  {
    id: "fin-que-1",
    stepType: "billy_talks",
    title: "El Apalancamiento Sistémico",
    body: "El [[Financiamiento|Adquirir capital de terceros para acelerar el crecimiento.]] no es pedir dinero porque estás quebrado. Es inyectar gasolina de alto octanaje porque sabes matemáticamente que si inyectas $1 al motor, este te imprimirá $4 de regreso.",
    data: { glossary: [{ word: "Financiamiento", definition: "Obtención de fondos, a través de deuda o inversión de capital, para financiar operaciones estratégicas y expansiones." }] }
  },
  {
    id: "fin-que-2",
    stepType: "info",
    title: "Ignición Fáctica",
    body: "El Financiamiento BIZEN se usa exclusivamente para EXPANDIR el negocio, jamás para tapar hoyos financieros."
  }
];

export const lessonCuandoUsarFinanciamientoSteps: LessonStep[] = [
  {
    id: "cua-usa-1",
    type: "swipe_sorter",
    title: "El Disparador de Deuda",
    body: "Define cuándo es correcto pedir financiamiento:",
    data: {
      items: [
        { id: "1", text: "Tienes un ROI del 40%, y el banco cobra 15%. Pides crédito para invertir.", category: "Apalancamiento BIZEN" },
        { id: "2", text: "No tienes flujo para nómina, pides un préstamo exprés para pagarla.", category: "Ruina Inminente" },
        { id: "3", text: "Ventas limitadas por baja capacidad: Financiamiento para maquinaria.", category: "Apalancamiento BIZEN" }
      ],
      categories: ["Apalancamiento BIZEN", "Ruina Inminente"]
    }
  },
  {
    id: "cua-usa-2",
    type: "completion",
    title: "Condición de Entrada",
    body: "Solo te apalancas cuando tienes una máquina probada. Si tu negocio pierde dinero, el crédito lo destruirá más rápido."
  }
];

// ---------------------------------------------------------------------------
// SUBTEMA 16
// ---------------------------------------------------------------------------
export const lessonCreditosNegocioTiposSteps: LessonStep[] = [
  {
    id: "cre-neg-1",
    type: "concept",
    title: "Arsenal Crediticio",
    aiInsight: "El Crédito Simple (Pides 1M, lo pagas en meses). El Crédito Revolvente (Como tarjeta corporativa, línea de 500k, tomas, pagas y vuelves a tener disponible). Factoraje (Vendes tus facturas para que te liquiden HOY). Todos son válidos si reducen el CAC o financian operaciones de alto Margen.",
    body: "Selecciona tu instrumento según la necesidad. Maquinaria = Crédito Simple. Publicidad online de ciclo corto = Revolvente."
  },
  {
    id: "cre-neg-2",
    type: "completion",
    title: "Elección de Munición",
    body: "No financias activos de largo plazo con deuda de corto plazo."
  }
];

export const lessonFuncionamientoCreditosNegocioSteps: LessonStep[] = [
  {
    id: "fun-cre-1",
    type: "story",
    title: "El Termómetro Bancario (CAT)",
    body: "Los Inversores BIZEN nunca leen la 'tasa de interés anunciada'. Leen el [[CAT (Costo Anual Total)|Métrica que suma la tasa de interés pura + comisiones + seguros + cargos ocultos.]] Si el banco te dice 'Tasa del 10%' pero el CAT es del 21%, la deuda REAL te cuesta 21% anual. Siempre evalúa el CAT contra tu ROI.",
    data: { glossary: [{ term: "CAT (Costo Anual Total)", definition: "Un indicador estandarizado en México que refleja el costo real de un financiamiento, incluyendo tasas corporativas y penalizaciones estándar." }] }
  },
  {
    id: "fun-cre-2",
    type: "completion",
    title: "Tasa Mínima Táctica",
    body: "Nunca tomas deuda sin conocer el CAT (Costo Anual Total)."
  }
];

// ---------------------------------------------------------------------------
// SUBTEMA 17: Régimen Fiscal (RESICO)
// ---------------------------------------------------------------------------
export const lessonQueEsResicoSteps: LessonStep[] = [
  {
    id: "res-que-1",
    stepType: "billy_talks",
    title: "El Blindaje Fiscal",
    aiInsight: "El [[RESICO|Régimen Simplificado de Confianza, diseñado por el SAT para democratizar el cumplimiento fiscal con tasas de ISR del 1% al 2.5%.]] no es una evasión, es una optimización táctica permitida por la ley. En lugar de pagar 30% de ISR corporativo, un negocio estructurado aprovecha regímenes como el RESICO tributando apenas un máximo de 2.5% sobre sus ingresos facturados.",
    body: "Un Inversor BIZEN optimiza su carga corporativa. Cada centavo ahorrado en impuestos (de forma legal) es un centavo de Utilidad Neta que va directo a tu cuenta bancaria."
  },
  {
    id: "res-que-2",
    stepType: "info",
    title: "Asignación Táctica Impositiva",
    body: "La optimización fiscal tributaria es la primera línea de expansión de tu Flujo de Efectivo residual."
  }
];

export const lessonQuienPuedeUsarloSteps: LessonStep[] = [
  {
    id: "res-qui-1",
    type: "swipe_sorter",
    title: "Compatibilidad del Régimen",
    body: "Clasifica quién puede beneficiarse del RESICO:",
    data: {
      items: [
        { id: "1", text: "Persona Física con actividad empresarial y ventas de $2 Millones al año.", category: "Apto (Integración BIZEN)" },
        { id: "2", text: "Empresa gigantesca que factura $80 Millones anuales con socios extranjeros.", category: "No Apto (Topa los ingresos)" },
        { id: "3", text: "Socio accionista de múltiples empresas y corporativos bursátiles extranjeros.", category: "No Apto (Exclusiones de Socios)" }
      ],
      categories: ["Apto (Integración BIZEN)", "No Apto (Topa los ingresos)"]
    }
  },
  {
    id: "res-qui-2",
    type: "completion",
    title: "Filtrado Corporativo",
    body: "Todo Inversor BIZEN sabe que mantener las ventas bajo $3.5 Millones como Persona Física le otorga la victoria táctica del RESICO."
  }
];

export const lessonBeneficiosResicoSteps: LessonStep[] = [
  {
    id: "res-ben-1",
    type: "story",
    title: "El Diferencial del 27.5%",
    body: "El beneficio real no es la simplicidad, es la retención abismal de capital. Si facturas $1,000,000, un régimen tradicional te podría liquidar con $300,000 de ISR. El RESICO te cobra $25,000. Son $275,000 que inyectas directo en inversión publicitaria o Retorno sobre el Capital (ROE) para los accionistas. Ese es el diferencial financiero de un CFO avanzado.",
    data: { glossary: [] }
  },
  {
    id: "res-ben-2",
    type: "completion",
    title: "Retención Geométrica",
    body: "Un centavo ahorrado en el SAT legalmente es un retorno del 100% libre de riesgo."
  }
];

// ---------------------------------------------------------------------------
// SUBTEMA 18: Evaluación
// ---------------------------------------------------------------------------
export const lessonEvaluacionRentabilidadSteps: LessonStep[] = [
  {
    id: "eva-ren-1",
    type: "concept",
    title: "Auditoría de Retornos",
    aiInsight: "Evaluar la rentabilidad requiere confrontar tu margen neto contra el mercado de capitales (Cetes, S&P 500). Si el negocio que operaste con sangre todo el año te dio 8% de margen neto y Cetes da 11% sin riesgo, tu negocio es ineficiente y destruye valor corporativo de tu tiempo.",
    body: "La rentabilidad BIZEN se mide siempre superando la tasa libre de riesgo en un factor de 3x."
  },
  {
    id: "eva-ren-2",
    type: "completion",
    title: "Benchmark Inflexible",
    body: "Mi rentabilidad corporativa compite contra las mejores empresas del mundo en el S&P 500. No contra el puesto local."
  }
];

export const lessonEvaluacionCrecimientoSteps: LessonStep[] = [
  {
    id: "eva-cre-1",
    type: "story",
    title: "Compounding Comercial",
    body: "El crecimiento no es lineal. En el ecosistema institucional, buscamos MoM (Month over Month) growth. Si tu empresa crece 10% mensual, estarás triplicando tu tamaño (313%) al año gracias al interés compuesto operativo. Para eso necesitas que tu Coste de Adquisición (CAC) sea menor a tu margen de retención (LTV).",
    data: { glossary: [] }
  },
  {
    id: "eva-cre-2",
    type: "completion",
    title: "Trayectoria Acelerada",
    body: "Mido el crecimiento de forma parabólica y asimétrica, siempre priorizando el LTV."
  }
];

export const lessonViabilidadNegocioSteps: LessonStep[] = [
  {
    id: "via-neg-1",
    type: "swipe_sorter",
    title: "El Juicio de Inviabilidad",
    body: "Clasifica estos escenarios de viabilidad:",
    data: {
      items: [
        { id: "1", text: "Tu costo unitario es $50. El precio en el mercado es $45.", category: "Inviable (Destrucción de Valor)" },
        { id: "2", text: "Tu Margen Operativo es 60% y tus costos fijos se pagan en 3 días del mes.", category: "Viable (Crecimiento BIZEN)" },
        { id: "3", text: "Requieres reinversión de capital constante para mantener las luces encendidas.", category: "Inviable (Destrucción de Valor)" }
      ],
      categories: ["Viable (Crecimiento BIZEN)", "Inviable (Destrucción de Valor)"]
    }
  },
  {
    id: "via-neg-2",
    type: "completion",
    title: "Viabilidad Pura",
    body: "La verdadera Inviabilidad es operar sin ventajas paramétricas, confiando ciegamente en la suerte."
  }
];

// ---------------------------------------------------------------------------
// SUBTEMA 19: Seguros y Marco Legal
// ---------------------------------------------------------------------------
export const lessonSegurosNegocioSteps: LessonStep[] = [
  {
    id: "seg-neg-1",
    type: "concept",
    title: "Transferencia de Fricción Riesgosa",
    aiInsight: "Un seguro corporativo no es un gasto, es **blindaje asimétrico**. Pagas una fracción minúscula de capital para cubrirte de un riesgo que destruiría toda tu línea de Flujo de Efectivo operativo. Un incendio de tu bodega de $5 Millones se cubre con una prima anual de $50,000. Son matemáticas puras de probabilidad y contención del desastre.",
    body: "El Inversor BIZEN asegura todo activo letal para la operación; transfiere el riesgo a empresas aseguradoras y se enfoca únicamente en el crecimiento."
  },
  {
    id: "seg-neg-2",
    type: "completion",
    title: "Escudo Operativo",
    body: "Aseguro mis activos porque no arriesgaré millones para no pagar miles en mitigación de riesgos."
  }
];

export const lessonProteccionLegalSteps: LessonStep[] = [
  {
    id: "pro-leg-1",
    type: "story",
    title: "El Foso Económico Jurídico",
    body: "El registro de marca (IMPI), los contratos comerciales (NDA) o la Constitución del Acta Constitutiva son tu [[Moat Jurídico|Barrera defensiva legal que blinda tu propiedad intelectual y separa tu responsabilidad patrimonial personal de la corporativa.]]. Sin protección, eres sujeto pasivo ante demandas o robos corporativos de tus ideas y capital.",
    data: { glossary: [{ term: "Moat Jurídico", definition: "Estructura defensiva con la que los Inversores protegen sus operaciones frente a demandas o robo de propiedad intelectual." }] }
  },
  {
    id: "pro-leg-2",
    type: "completion",
    title: "Firma Contractual",
    body: "Mis negocios están respaldados por una fiera contención y legalidad corporativa."
  }
];

export const lessonManejoRiesgosNegocioSteps: LessonStep[] = [
  {
    id: "man-rie-1",
    type: "concept",
    title: "Diversificación de Amenazas",
    aiInsight: "Tu mayor riesgo no son los competidores. Es depender de: Un único proveedor importado, un único cliente que acapara el 80% de tus ingresos o un único canal comercial (como un algoritmo de Meta). BIZEN te exige desconcentrar tu matriz de riesgos dividiendo el ingreso, el código y la dependencia al menos por 3.",
    body: "Divide y conquistarás las crisis."
  },
  {
    id: "man-rie-2",
    type: "completion",
    title: "Descentralización Física",
    body: "Destruyo mi dependencia de un solo nodo de la cadena logística o un solo cliente VIP."
  }
];

// ---------------------------------------------------------------------------
// SUBTEMA 20 & 21: Reinversión y Cierre de Optimización
// ---------------------------------------------------------------------------
export const lessonQueEsReinversionSteps: LessonStep[] = [
  {
    id: "rei-que-1",
    type: "concept",
    title: "Capitalización en Frío",
    aiInsight: "La utilidad sobrante no es para comprar un auto nuevo al inicio de tu empresa corporativa. Es para ser reinvertida. El Retorno sobre Capital Invertido aumenta drásticamente cuando los dividendos son reutilizados para adquirir más clientes, más programadores, más inventario.",
    body: "Asume que el dinero extra es sagrado para expandir el moat táctico."
  },
  {
    id: "rei-que-2",
    type: "completion",
    title: "Reinversión Paramétrica",
    body: "Tomo las utilidades asimétricas y ejecuto reinversión sobre la línea que produzca el mayor ROI logístico."
  }
];

export const lessonImportanciaReinversionSteps: LessonStep[] = [
  { id: "imp-rei-1", type: "completion", title: "Crecimiento Logarítmico", body: "Reinvertir expande mi límite de producción de manera exponencial." }
];

export const lessonEstrategiasReinversionSteps: LessonStep[] = [
  { id: "est-rei-1", type: "completion", title: "Canales de Adquisición Extra", body: "Invierto directo en marketing RPO (Return on Ad Spend) o infraestructura escalable, no en lujos." }
];

export const lessonAnalisisOpcionesSteps: LessonStep[] = [
  { id: "ana-opc-1", type: "completion", title: "El Inversor BIZEN en Ejecución", body: "Toda decisión corporativa se evalúa contra la matriz del S&P 500 y el Costo Anual Total." }
];

export const lessonOptimizacionRecursosSteps: LessonStep[] = [
  {
    id: "opt-rec-1",
    type: "story",
    title: "Cierre Estructural: El Inversor Optimiza Todo",
    body: "Al optimizar recursos, mides los ratios financieros de rentabilidad (RoE). Utilizas los regímenes fiscales como el RESICO de contención tributaria y los préstamos simples (OPM) apalancados contra un seguro de protección de daños y un Moat asimétrico.",
    data: { glossary: [] }
  },
  {
    id: "opt-rec-2",
    type: "completion",
    title: "Alineación Final",
    body: "Mi modelo de negocios es BIZEN, una fiera estructura paramétrica y blindada para producir utilidad neta."
  }
];
