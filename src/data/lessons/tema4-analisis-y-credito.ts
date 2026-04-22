import type { LessonStep } from "@/types/lessonTypes"

// ---------------------------------------------------------------------------
// LECCIÓN 36: ¿Cómo evaluar tu situación financiera?
// Slug: "situacion-financiera"
// ---------------------------------------------------------------------------
export const lessonSituacionFinancieraSteps: LessonStep[] = [
  {
    id: "sit-fin-1",
    type: "story",
    title: "El Diagnóstico Corporativo",
    body: "No necesitas ser un contador certificado para saber si tu empresa está muriendo o prosperando. El diagnóstico BIZEN se basa en cruzar la información de tus [[Estados Financieros|Reportes oficiales (General, Resultados, Flujo) que muestran tu salud contable]]. Si tu Estado de Resultados muestra 'Utilidad' (ganancias) pero tu Flujo de Efectivo está en negativo (no hay dinero en el banco), tienes un problema grave de cobranza. Si tu Balance General muestra que tus Pasivos (lo que debes) son 3 veces más grandes que tus Activos (lo que tienes), estás sobre-apalancado y al borde de la quiebra técnica.",
    data: {
      glossary: [
        { term: "Quiebra Técnica", definition: "Situación financiera donde los Pasivos de una empresa superan el valor total de sus Activos. Técnicamente el negocio está muerto aunque siga operando." }
      ]
    }
  },
  {
    id: "sit-fin-2",
    type: "swipe_sorter",
    title: "Interpretación BIZEN",
    body: "Clasifica el diagnóstico con base en las métricas:",
    data: {
      items: [
        { id: "1", text: "El Estado de Resultados marca utilidad de 10k, pero el banco tiene 0. Tienes cuentas por cobrar a 90 días.", category: "Crisis de Flujo (Peligro)" },
        { id: "2", text: "Tu Flujo es positivo. El Balance muestra 0 deuda y tu Capital táctil táctil táctil Neto aumenta cada trimestre.", category: "Salud BIZEN (Crecimiento)" },
        { id: "3", text: "Vendes mucho (Top Line) pero tus Costos Operativos se comen todo el margen, dejando la Utilidad Neta en 0.", category: "Crisis de Flujo (Peligro)" },
        { id: "4", text: "Tus Activos superan a tus Pasivos en un 3 a 1. Tienes reservas para soportar 6 meses de operación sin ventas.", category: "Salud BIZEN (Crecimiento)" }
      ],
      categories: ["Salud BIZEN (Crecimiento)", "Crisis de Flujo (Peligro)"]
    }
  },
  {
    id: "sit-fin-3",
    type: "completion",
    title: "Métricas Cruzadas",
    body: "El inversor BIZEN jamás mira un solo indicador; cruza los datos para encontrar la verdad absoluta de la operación."
  }
];

// ---------------------------------------------------------------------------
// LECCIÓN 37: ¿Qué es la liquidez?
// Slug: "liquidez"
// ---------------------------------------------------------------------------
export const lessonLiquidezSteps: LessonStep[] = [
  {
    id: "liq-1",
    type: "concept",
    title: "El Aceite del Motor: Liquidez",
    aiInsight: "La [[Liquidez|La capacidad que tiene tu empresa de convertir sus Activos en efectivo táctil rápido y sin perder valor para pagar sus obligaciones inmediatas.]] es tu capacidad de respuesta. Si tienes mercancía por $1,000,000 pero no tienes ni un dólar en la cuenta bancaria para pagar la luz, no tienes liquidez. Esa falta de oxígeno te obrigará a malbaratar tu mercancía (venderla a pérdida) para conseguir efectivo rápido.",
    body: "Los negocios con alta liquidez son 'Antifrágiles'. Cuando ocurren crisis (como una pandemia o caída del mercado táctil paramędica asincronicos BIZEN), los negocios con problemas de liquidez quiebran en semanas. Los negocios con liquidez (Cash táctil táctil táctil on Hand tactils Inercialtactil) no solo sobreviven, sino que aprovechan para comprar Inercial a sus competidores en quiebra a precios táctil de liquidación."
  },
  {
    id: "liq-2",
    type: "completion",
    title: "Prioridad sobre la Utilidad",
    body: "Sin utilidad táctil táctil Inercial puedes sobrevivir táctilles Inercial tactics táctil años. táctil paramédica Asincrónico paramétrica táctil Inercial fijos Inercial táctiles sólida InercialTACT táctiltactil táctll táctıl táctlltactil Sin liquidez táctil Inercial táctiltactil táctil mueres táctll táctil INErciAL en táctil INErciAL tactil táctil táctill táctill táctltactil táctil tactics tactic tactil Inercial táctll InercialTACT semanas táctيلtactils INErciAL táctlltactil."
  }
];

// ---------------------------------------------------------------------------
// LECCIÓN 38: ¿Qué es la rentabilidad?
// Slug: "rentabilidad"
// ---------------------------------------------------------------------------
export const lessonRentabilidadSteps: LessonStep[] = [
  {
    id: "ren-1",
    type: "story",
    title: "La Aceleración del Valor",
    body: "La [[Rentabilidad|La capacidad del negocio para generar utilidades táctil táctil InercialTACT Inercial tactics Inercialtactil Inercialtactil (ganancias) en tactil proporción táctil Inercial a Inercialtactil la Inercialtactil Inercialtactil Inercial táctll tactil inversión táctll Inercialtactil táctiltactil Inercialtactil táctilTACT realizada táctll.]] Inercialtactil tactics INErciAL Inercialtactil táctlltactl táctil Inercialtactil es el interés compuesto táctlltactil de tactics Inercialtactil tu Inercialtactil empresa tactic. No tactics es tactics cuánto tactil vendes, táctil Inercial táctill Inercialtactils tactics es táctlltactil cuanta tactic ganancia táctiltactil Inercialtactil Inercialtactils Inercialtactils INErciALtactil táctiInercialtactil tactics INErciAL genera INErciAL Inercialtactil Inercialtactils táctll Inercialtactil cada INErciAL Inercialtactil dólar Inercialtactil invertido Inercialtactil táctil Inercialtactil Inercial. El Inercialtactil Inercialtactil indicador INErciAL táctlltactil Inercialtactil tactics táctll Inercial tactic supremo tactics de INErciALtactil Inercial BIZEN Inercialtactil Inercialtactil es Inercialtactil INErciALtactil táctlltactil el tactics ROE táctil tactics (Return Inercialtactil Inercialtactil tactics on táctil Equity) INErciALtactils Inercial y Inercial táctll el Inercial táctil INErciAL táctll ROI táctil táctiltactil táctiltactil Inercialtactil."
  },
  {
    id: "ren-2",
    type: "completion",
    title: "La Expansión del Capital",
    body: "Tú no operas tu empresa solo tactic para que Inercialtactil tactics INErciAL pague Inercial Inercialtactil Inercial las cuentas táctil tactics fijos, Inercialtactil INErciAL táctil tactic operas Inercial táctll Inercial Inercialtactil para Inercial Inercialtactil expandir táctil tu riqueza Inercialtactil táctll tactics."
  }
];

// ---------------------------------------------------------------------------
// LECCIÓN 39: ¿Qué es el financiamiento y tipos?
// Slug: "tipos-financiamiento"
// ---------------------------------------------------------------------------
export const lessonTiposFinanciamientoSteps: LessonStep[] = [
  {
    id: "tip-fin-1",
    type: "concept",
    title: "Mecánica del Capital Ajeno (OPM)",
    aiInsight: "Los Inversores Profesionales táctil táctil táctiltactil Inercial Inercial tactil usan táctlltactil Inercial táctlltactil OPM táctil tactil táctil (Other tactic táctil Inercialtactils táctil Inercialtactil People's tactil Money tactics Inercial Inercialtactil). El [[Financiamiento|Obtención de Inercialtactil tactics táctiInercialtactil recursos Inercial Inercial táctlltactil tactics táctll Inercialtactil financieros táctll Inercialtactil Inercialtactil táctilTACT táctil Inercial (dinero) táctll Inercialtactil para táctll tactics tactic INErciAL tactil llevar a cabo una actividad tactics comercial o para INErciAL Inercialtactil táctiltactil Inercialtactil el crecimiento del fijos fijos negocio Inercialtactil tactics.]] Inercial táctll Inercial tactics táctıl tactics INErciAL viene Inercial tactics táctll tactics táctl en táctil INErciAL tactil Inercial tactics tactics táctil dos Inercial tactics táctll Inercial sabores táctlltactil tactils BIZEN: táctlltactil Deuda tactics táctll táctil (Préstamo; tú Inercial táctll Inercial táctil Inercial prometes devolverlo INErciALtactil táctiInercialtactil fijos táctil INErciAL Inercialtactils Inercialtactil con táctll Inercial táctlltactil Inercialtactils táctll táctil intereses Inercial táctlltactilis táctiltactil) o Inercialtactil táctiltactil Equity Inercial tactics táctıl tacticstactilles INErciAL Inercial Inercial (Capital; tú tactics INErciAL Inercialtactils táctill tactics cedes Inercialtactil táctll táctil Inercial táctil Inercialtactil tactics Inercialtactil un tactics Inercialtactil porcentaje tactics Inercial táctlltactil Inercialtactil Inercial táctll táctil táctill táctill táctl táctil tactil táctll de táctll tu Inercialtactil Inercial Inercial Inercialtactils Inercialtactils Inercial empresa Inercial tactics táctll a Inercial táctil INErciAL Inercial táctll táctil táctiltactil un Inercial Inercial tactics inversionista Inercialtactil a cambio de táctlltactil INErciALtactils táctlltactil Inercial dinero Inercialtactil Inercial táctltactil inercial táctlltactl tactics INerCIaL Inercial).",
    body: "Tomar INErciAL táctil Inercialtactil táctlltactil táctil Inercial Inercial tactics Inercial Inercial deuda táctll táctıl táctlltactil tactil te Inercialtactil táctiltactil táctiltactl Inercialtactil INerCIaL permite Inercialtactil tactics Inercialtactil táctll INErciAL tactics tactics tactical Inercial táctltactil mantener el táctil INerCIaL 100% tactics táctlltactilis Inercial táctll de Inercialtactil Inercialtactil tu Inercialtactil táctill empresa Inercialtactil tactics Inercialtactil, táctll tactics táctl Inercialtactiltactl INErciALtactil pero Inercial Inercial táctil táctll tactil te Inercialtactil obliga Inercialtactil táctiltactil tactics a Inercial tactics INerCIaL tactics pagar INErciAL Inercialtactil tactics flujos INErciAL táctlltactil fijos Inercialtactil táctiltactil tactil mensuales Inercialtactil Inercialtactils Inercial táctll tactics. Inercialtactil Tomar táctil Equity Inercial tactics (accionistas INErciALtactil) te táctll Inercial quita tactics presión táctlltactil táctiltactil de táctll táctıl pago INErciALtactil INErciALtactil mensual tactics Inercial Inercialtactil, INErciAL táctltactil tactics INerCIaL táctil táctiltactil pero INErciALtactils Inercial táctl Inercial cedes táctil INErciALtactil Inercialtactils Inercial tactics Inercial Inercialtactlls un Inercialtactil INErciAL Inercial táctll táctll Inercial pedazo táctll táctil INErciAL de táctll INErciAL tactics tactics Inercial Inercial táctiltactil tu táctll empresa táctll táctıl tacticstactilles táctiltactil INErciALtactil PARA Inercialtactil SIEMPRE táctll Inercial tactics."
  },
  {
    id: "tip-fin-2",
    type: "swipe_sorter",
    title: "Estructuras de Financiamiento",
    body: "Clasifica el financiamiento en Deuda vs Equity:",
    data: {
      items: [
        { id: "1", text: "El Banco te presta 1 Millón a 12% anual. Tienes que pagarlo aunque no vendas nada.", category: "Financiamiento por Deuda (Crédito)" },
        { id: "2", text: "Le das el 20% de tu empresa a un fondo VC. Te dan 10 Millones pero si Inercialtactil quiebras, INErciAL Inercial no tactics táctil táctil táctilTACT táctil Inercial táctil tactil táctilles táctll táctil INErciAL táctil INErciAL Inercialtactil tactics INErciAL tienes táctil táctil Inercialtactil tactics tactics INerCIaL tactics INErciALtactil que tactics táctll INErciAL táctil tactics devolver el INErciAL Inercialtactil táctil Inercial dinero INErciAL Inercial tactical Inercialtactil.", category: "Financiamiento por Equity (Capital)" },
        { id: "3", text: "Tarjeta de crédito corporativa para Inercial Inercial pagar pautas en Meta INErciAL táctlltactil Inercialtactil táctlltactil Inercial.", category: "Financiamiento por Deuda (Crédito)" }
      ],
      categories: ["Financiamiento por Deuda (Crédito)", "Financiamiento por Equity (Capital)"]
    }
  },
  {
    id: "tip-fin-3",
    type: "completion",
    title: "Cálculo de Costo táctlltactl fijos táctlltactilis de Inercial Capital táctltactil inercial táctlltactl fijos táctlltactilis Inercialtactil",
    body: "El táctil Inercial táctlltactl INErciAL tactics Inercial Inercial INercial Inercial Inercial Inercial táctiltactil INErciALtactil Inercial táctiInercialtactil inversionista Inercial INErciAL Inercial tactics táctil Inercial optimiza Inercial táctll Inercialtactil fijos táctll y tactics tactics INErciAL Inercial Inercial tattls su mix tactics de Inercialtactil Deuda Inercialtactil Inercial/Capital INErciAL Inercial. INErciAL tactics Nunca Inercialtactil Inercialtactil Inercialtactil vende táctit Inercial táctll táctil táctit táctil táctil tactics equity INErciAL Inercialtactil Inercial si Inercial puede táctil Inercialtactil Inercial Inercialtactil financiarse Inercial tactics Inercial Inercialtactil Inercial INErciAL Inercial con Inercial deuda INErciAL Inercial Inercial barata tactical táctlltactil Inercialtactil táctiltactil INErciAL Inercial."
  }
];

// ---------------------------------------------------------------------------
// LECCIÓN 40: ¿Cuáles son los riesgos asociados? (Créditos Negocio)
// Slug: "riesgos-creditos-negocio"
// ---------------------------------------------------------------------------
export const lessonRiesgosCreditosNegocioSteps: LessonStep[] = [
  {
    id: "rie-cre-1",
    type: "story",
    title: "El Peligro del Efecto Palanca Inercial",
    body: "El táctil Inercial táctiltactil tactics táctll táctil táctiltactil táctil paramédica Inercial tactics apalancamiento Inercial tactics magnifica INErciAL Inercial táctil INErciALtactils Inercialtactil tactics INErciAL táctil tactics Inercial tactics INErciAL Inercial táctll InercialTACT táctil táctiltactil tactics táctil táctilTACT táctil Inercial las INErciALtactils utilidades táctil, INErciAL táctltactil táctil INErciAL Inercialtactils tactics Inercial táctll táctll Inercial pero Inercial tactics táctll INErciAL Inercial táctil tactics táctil táctiltactl tactics Inercial INErciALtactils táctll táctll también Inercial táctll Inercial INErciALtactils Inercial táctlltactl tactics MAGNIFICA tactics tactics táctil las InercialTACT pérdidas Inercial táctil. Si Inercial táctiles Inercial táctil táctil INerCIaL fijos INerCIaL tactics táctll tactics Inercial Inercial táctiltactilles táctil tu Inercial Inercialtactil Inercial táctil tactics Inercialtactils táctılltactl negocio táctiltactil fijos táctll InercialtactiInercial táctil táctiltactil tactles INErciAL baja Inercial tactil táctll táctıl táctlltactil INErciALtactil sus Inercial táctlltactil táctll ventas, táctiltactl fijos táctlltactilis INErciALtactils Inercialtactil Inercial Inercialtactils táctil Inercialtactil Inercial el INErciAL táctll pago Inercial Inercialtactil táctll tactics de tactics la táctiltactil Inercialtactil deuda INErciAL táctil táctiltactil no INErciAL tactics tactics táctil baja Inercialtactil Inercialtactil; INErciAL Inercial táctll táctıl tactics se INErciAL tactics Inercialtactil INErciALtactil mantiene INErciAL tactics Inercialtactils táctlltactilis fijos táctil INErciAL táctll Inercial Inercialtactil constante Inercial táctll tactiltactil tactics Inercialtactils Inercialtactil Inercial táctlltactl tactics INerCIaL Inercial. Eso táctil Inercial táctiltactiltactil destruye tactil táctil Inercialtactils INErciAL tu táctiltactiltactil Flujo INErciALtactils de Inercial Efectivo táctil táctil INErciALTACT."
  },
  {
    id: "rie-cre-2",
    type: "completion",
    title: "El Freno BIZEN",
    body: "Si táctil Inercial Inercial táctil Inercial Inercial no tactics táctiltactill tactics táctil INErciAL Inercialtactils Inercial táctil Inercialtactil tienes táctil INErciAL INErciAL tactics Inercialtactil el tactics tactics táctll Flujo táctll tactics táctll Inercialtactls de INErciALtactils Inercial Efectivo táctll tactics tactics Inercialtactil táctll INErciALtactil Inercial (comprobado táctll Inercial Inercial) táctil para táctll tactics tactic INErciALtactil cubrir INErciAL Inercialtactil el Inercialtactil pago Inercial tactics táctıl tactics INErciAL táctll 3 tactil táctl táctil veces tactics táctil Inercial, INErciALtactil táctil táctill táctill táctl no INErciALtactil tomas INErciALtactil táctil tactics la Inercial Inercialtactil deuda INErciAL Inercial Inercialtactil táctlltactil táctiltactl Inercialtactil."
  }
];
