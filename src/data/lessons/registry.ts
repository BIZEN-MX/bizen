import type { LessonStep } from "@/types/lessonTypes"

// Tema 1: El Tablero del Juego (Mentalidad)
import {
  lessonQueEsElDineroParaMiSteps,
  lessonQueEsperoDelDineroSteps,
  lessonDineroComoSeguridadVsLibertadSteps,
  lessonDineroComoPresionVsOportunidadSteps,
  lessonIdentificarMiDefinicionPersonalDelDineroSteps
} from "./tema1-percepcion"

import {
  lessonComoMeHaceSentirElDineroSteps,
  lessonSenalesDeEmocionDominandoUnaDecisionSteps,
  lessonPausaFinancieraSteps,
  lessonCulpaYAnsiedadFinancieraSteps,
  lessonEmocionVsDecisionCasosRealesSteps
} from "./tema1-emocion"

import {
  lessonMisPrimerasCreenciasSobreElDineroSteps,
  lessonExpectativasVsRealidadFinancieraSteps,
  lessonFrasesHeredadasQueMeLimitanSteps,
  lessonComoCuestionarUnaCreenciaConEvidenciaSteps,
  lessonMiNuevoManualDeReglasFinancierasSteps
} from "./tema1-creencias"

// Tema 2: Ingeniería del Ingreso
import { 
  lessonPorQueElMercadoPagaLoQuePagaSteps,
  lessonIngresoActivoVsPasivoLaRealidadSteps,
  lessonElTrianguloDelValorSteps,
  lessonIngresoDePortafolioDineroQueGeneraDineroSteps,
  lessonEvaluacionComoSeVeTuFlujoDeEntradaHoySteps 
} from "./tema2-naturaleza-dinero"

import {
  lessonHabilidadesDeAltoValorSteps,
  lessonEscalabilidadTuTiempoTieneTechoSteps,
  lessonRoiDeTuEducacionSteps,
  lessonSoftSkillsMultiplicadorIngresosSteps,
  lessonDisenoDeCarreraOperativoAEstrategicoSteps
} from "./tema2-capital-habilidades"

import {
  lessonCapitalIntelectualVsFinancieroSteps,
  lessonImpuestoALaIgnoranciaSteps,
  lessonApalancamientoHacerMasConMenosSteps,
  lessonIngresosRecurrentesTuEjercitoSteps,
  lessonPlanAccionDuplicarValorMercadoSteps
} from "./tema2-optimizacion-riqueza"

// Tema 3: Psicología del Consumo
import {
  lessonQueEsUnTriggerDeCompraSteps,
  lessonPublicidadComoTeManipulaSteps,
  lessonRedesComparacionYPresionSteps,
  lessonComprasPorAburrimientoVsNecesidadSteps,
  lessonDetectarMisTriggersCasosSteps
} from "./tema3-triggers-compra"

import {
  lessonEvaluacionBloque1Steps,
  lessonEvaluacionBloque2Steps,
  lessonEvaluacionBloque3Steps
} from "./evaluaciones"


import {
  lessonSenalesDeCompraImpulsivaSteps,
  lessonAntesDePagarChecklistDeDecisionSteps,
  lessonMicroHabitosParaEvitarImpulsosSteps,
  lessonPostCompraCulpaYAprendizajeSteps,
  lessonCasoGastoPorEmocionPasoAPasoSteps
} from "./tema3-compras-impulsivas"

import {
  lessonComprarPorEstatusVsPorValorSteps,
  lessonAparienciaDeRiquezaVsRiquezaRealSteps,
  lessonPresionSocialEnDecisionesEscenariosSteps,
  lessonNoEstatusSteps,
  lessonReglaPersonalAntiEstatusSteps
} from "./tema3-estatus-presion"

import {
  lessonGastosFijosVsVariablesSteps,
  lessonNecesidadVsDeseoSteps,
  lessonGastosDiscrecionalesLoQueSiEligesSteps,
  lessonCostoRealGastoExtrasSteps,
  lessonClasificarMisGastosEjercicioCompletoSteps
} from "./tema4-clasificacion"

import {
  lessonQueSonYPorQueImportanSteps,
  lessonDetectar3GastosHormigaPersonalesSteps,
  lessonRecorteInteligenteSinSufrirSteps,
  lessonSustitucionesBaratoSaludableUtilSteps,
  lessonRetoSemanaSinGastoHormigaSteps
} from "./tema4-gastos-hormiga"

import {
  lessonComisionesYFugasBancariasSteps,
  lessonMembresiasYSuscripcionesOlvidadasSteps,
  lessonElCostoDelInteresDeudaMalaSteps,
  lessonDescuentosQueSalenCarosSteps,
  lessonAuditoria360DeMisSalidasSteps
} from "./tema4-gastos-invisibles"


/**
 * Maps lesson ID to steps.
 * Lesson ID must match the slug used in course data files.
 */
export const lessonRegistry: Record<string, LessonStep[]> = {
  // --- TEMA 1 ---
  "que-es-el-dinero-para-mi": lessonQueEsElDineroParaMiSteps,
  "que-espero-del-dinero": lessonQueEsperoDelDineroSteps,
  "dinero-como-seguridad-vs-libertad": lessonDineroComoSeguridadVsLibertadSteps,
  "dinero-como-presion-vs-oportunidad": lessonDineroComoPresionVsOportunidadSteps,
  "identificar-mi-definicion-personal-del-dinero": lessonIdentificarMiDefinicionPersonalDelDineroSteps,
  
  "como-me-hace-sentir-el-dinero": lessonComoMeHaceSentirElDineroSteps,
  "senales-de-emocion-dominando-una-decision": lessonSenalesDeEmocionDominandoUnaDecisionSteps,
  "pausa-financiera-reglas-anti-impulso": lessonPausaFinancieraSteps,
  "culpa-y-ansiedad-financiera-como-se-forman": lessonCulpaYAnsiedadFinancieraSteps,
  "emocion-vs-decision-casos-reales": lessonEmocionVsDecisionCasosRealesSteps,
  
  "mis-primeras-creencias-sobre-el-dinero": lessonMisPrimerasCreenciasSobreElDineroSteps,
  "expectativas-vs-realidad-financiera": lessonExpectativasVsRealidadFinancieraSteps,
  "frases-heredadas-que-me-limitan": lessonFrasesHeredadasQueMeLimitanSteps,
  "como-cuestionar-una-creencia-con-evidencia": lessonComoCuestionarUnaCreenciaConEvidenciaSteps,
  "mi-nuevo-manual-de-reglas-financieras": lessonMiNuevoManualDeReglasFinancierasSteps,

  // --- TEMA 2 ---
  "por-que-el-mercado-paga-lo-que-paga": lessonPorQueElMercadoPagaLoQuePagaSteps,
  "ingreso-activo-vs-pasivo-la-realidad": lessonIngresoActivoVsPasivoLaRealidadSteps,
  "el-triangulo-del-valor-habilidad-escala-rareza": lessonElTrianguloDelValorSteps,
  "ingreso-de-portafolio-dinero-que-genera-dinero": lessonIngresoDePortafolioDineroQueGeneraDineroSteps,
  "evaluacion-como-se-ve-tu-flujo-de-entrada-hoy": lessonEvaluacionComoSeVeTuFlujoDeEntradaHoySteps,

  "habilidades-de-alto-valor-high-income-skills": lessonHabilidadesDeAltoValorSteps,
  "escalabilidad-tu-tiempo-tiene-techo": lessonEscalabilidadTuTiempoTieneTechoSteps,
  "invertir-en-ti-el-roi-de-tu-educacion": lessonRoiDeTuEducacionSteps,
  "soft-skills-el-multiplicador-invisible-de-ingresos": lessonSoftSkillsMultiplicadorIngresosSteps,
  "diseno-de-carrera-de-operativo-a-estrategico": lessonDisenoDeCarreraOperativoAEstrategicoSteps,

  "capital-intelectual-vs-capital-financiero": lessonCapitalIntelectualVsFinancieroSteps,
  "el-costo-de-no-saber-impuesto-a-la-ignorancia": lessonImpuestoALaIgnoranciaSteps,
  "apalancamiento-hacer-mas-con-menos": lessonApalancamientoHacerMasConMenosSteps,
  "ingresos-recurrentes-tu-ejercito-de-centavos": lessonIngresosRecurrentesTuEjercitoSteps,
  "plan-de-accion-duplicar-tu-valor-de-mercado": lessonPlanAccionDuplicarValorMercadoSteps,

  // --- TEMA 3 ---
  "que-es-un-trigger-de-compra": lessonQueEsUnTriggerDeCompraSteps,
  "publicidad-como-te-manipula": lessonPublicidadComoTeManipulaSteps,
  "redes-comparacion-y-presion": lessonRedesComparacionYPresionSteps,
  "compras-por-aburrimiento-vs-necesidad": lessonComprasPorAburrimientoVsNecesidadSteps,
  "detectar-mis-triggers-casos": lessonDetectarMisTriggersCasosSteps,

  "senales-de-compra-impulsiva": lessonSenalesDeCompraImpulsivaSteps,
  "antes-de-pagar-checklist-de-decision": lessonAntesDePagarChecklistDeDecisionSteps,
  "micro-habitos-para-evitar-impulsos": lessonMicroHabitosParaEvitarImpulsosSteps,
  "post-compra-culpa-y-aprendizaje": lessonPostCompraCulpaYAprendizajeSteps,
  "caso-gasto-por-emocion-paso-a-paso": lessonCasoGastoPorEmocionPasoAPasoSteps,

  "comprar-por-estatus-vs-por-valor": lessonComprarPorEstatusVsPorValorSteps,
  "apariencia-de-riqueza-vs-riqueza-real": lessonAparienciaDeRiquezaVsRiquezaRealSteps,
  "presion-social-en-decisiones-escenarios": lessonPresionSocialEnDecisionesEscenariosSteps,
  "como-decir-que-no-sin-sentirte-menos": lessonNoEstatusSteps,
  "regla-personal-anti-estatus": lessonReglaPersonalAntiEstatusSteps,

  // --- TEMA 4 ---
  "gastos-fijos-vs-variables": lessonGastosFijosVsVariablesSteps,
  "necesidad-vs-deseo": lessonNecesidadVsDeseoSteps,
  "gastos-discrecionales-lo-que-si-eliges": lessonGastosDiscrecionalesLoQueSiEligesSteps,
  "costo-real-gasto-extras": lessonCostoRealGastoExtrasSteps,
  "clasificar-mis-gastos-ejercicio-completo": lessonClasificarMisGastosEjercicioCompletoSteps,

  "que-son-y-por-que-importan": lessonQueSonYPorQueImportanSteps,
  "detectar-3-gastos-hormiga-personales": lessonDetectar3GastosHormigaPersonalesSteps,
  "recorte-inteligente-sin-sufrir": lessonRecorteInteligenteSinSufrirSteps,
  "sustituciones-barato-saludable-util": lessonSustitucionesBaratoSaludableUtilSteps,
  "reto-semana-sin-gasto-hormiga": lessonRetoSemanaSinGastoHormigaSteps,

  "comisiones-y-fugas-bancarias": lessonComisionesYFugasBancariasSteps,
  "membresias-y-suscripciones-olvidadas": lessonMembresiasYSuscripcionesOlvidadasSteps,
  "el-costo-del-interes-deuda-mala": lessonElCostoDelInteresDeudaMalaSteps,
  "descuentos-que-salen-caros": lessonDescuentosQueSalenCarosSteps,
  "auditoria-360-de-mis-salidas": lessonAuditoria360DeMisSalidasSteps,

  // --- EVALUACIONES DE BLOQUE ---
  "evaluacion-bloque-1": lessonEvaluacionBloque1Steps,
  "evaluacion-bloque-2": lessonEvaluacionBloque2Steps,
  "evaluacion-bloque-3": lessonEvaluacionBloque3Steps,
}


/** Get steps for a lesson ID. Returns empty array if none. */
export function getStepsForLesson(lessonId: string | undefined): LessonStep[] {
  if (!lessonId) return []
  return lessonRegistry[lessonId] ?? []
}
