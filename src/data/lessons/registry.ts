import type { LessonStep } from "@/types/lessonTypes"

/**
 * BIZEN LESSON REGISTRY
 * Re-architected to "Get to the point" (Practical Theme 1)
 */

import { lessonQueEsElDineroParaMiSteps } from "@/data/lessons/lesson-que-es-el-dinero-para-mi"
import { lessonLasRulesDelSistemaFinancieroSteps } from "@/data/lessons/lesson-las-reglas-del-sistema-financiero"
import { lessonQueEsElDineroDeudaVsEnergiaSteps } from "@/data/lessons/lesson-que-es-el-dinero-deuda-vs-energia"
import { lessonTuPrimerEstadoDeResultadosPersonalSteps } from "@/data/lessons/lesson-tu-primer-estado-de-resultados-personal"
import { lessonElRegistroDeGuerraPorQueTrackearTodoSteps } from "@/data/lessons/lesson-el-registro-de-guerra-por-que-trackear-todo"
import { lessonGastosFijosVsVariablesSteps } from "@/data/lessons/tema4-clasificacion"
import { lessonQueSonYPorQueImportanSteps } from "@/data/lessons/tema4-gastos-hormiga"
import { lessonElValorDeTuTiempoCalculoRealSteps } from "@/data/lessons/lesson-el-valor-de-tu-tiempo-calculo-real"
import { lessonCostoDeOportunidadElegirEsRenunciarSteps } from "@/data/lessons/lesson-costo-de-oportunidad-elegir-es-renunciar"
import { lessonLaPausaDeLas24HorasMecanicaSteps } from "@/data/lessons/lesson-la-pausa-de-las-24-horas-mecanica"
import { lessonElCriterioDeRealidadSteps } from "@/data/lessons/lesson-el-criterio-de-realidad-datos-vs-opinion"
import { lessonElMapaDelTesoroSteps } from "@/data/lessons/lesson-el-mapa-del-tesoro-encontrando-el-flujo"
import { lessonElBlindajeDeCuentaSteps } from "@/data/lessons/lesson-el-blindaje-de-cuenta-cero-comisiones"
import { lessonElFiltroDeValorSteps } from "@/data/lessons/lesson-el-filtro-de-valor-gasto-vs-inversion"
import { lessonElSalarioDeTuYoDelFuturoSteps } from "@/data/lessons/lesson-el-salario-de-tu-yo-del-futuro"
import { lessonLaAuditoriaDeSupervivenciaSteps } from "@/data/lessons/lesson-la-auditoria-de-supervivencia"

// --- TEMA 2: Ingeniería del Ingreso (Existing) ---
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

// --- TEMA 3: Psicología & Hacks de Comportamiento (Rebranded) ---
import {
  lessonComoMeHaceSentirElDineroSteps,
  lessonSenalesDeEmocionDominandoUnaDecisionSteps,
  lessonCulpaYAnsiedadFinancieraSteps,
  lessonEmocionVsDecisionCasosRealesSteps,
  lessonPsicologiaDeLaDeudaSteps
} from "./tema1-emocion"

import {
  lessonMisPrimerasCreenciasSobreElDineroSteps,
  lessonExpectativasVsRealidadFinancieraSteps,
  lessonFrasesHeredadasQueMeLimitanSteps,
  lessonComoCuestionarUnaCreenciaConEvidenciaSteps,
  lessonMiNuevoManualDeReglasFinancierasSteps
} from "./tema1-creencias"

import {
  lessonQueEsUnTriggerDeCompraSteps,
  lessonPublicidadComoTeManipulaSteps,
  lessonRedesComparacionYPresionSteps,
  lessonComprasPorAburrimientoVsNecesidadSteps,
  lessonDetectarMisTriggersCasosSteps,
  lessonElEgoEnElConsumoDigitalSteps
} from "./tema3-triggers-compra"

import {
  lessonComprarPorEstatusVsPorValorSteps,
  lessonReglaPersonalAntiEstatusSteps
} from "./tema3-estatus-presion"

// --- TEMA 4: Tipos de Gastos (Revised) ---
import {
  lessonNecesidadVsDeseoSteps,
  lessonGastosDiscrecionalesLoQueSiEligesSteps,
  lessonCostoRealGastoExtrasSteps,
  lessonClasificarMisGastosEjercicioCompletoSteps,
  lessonAuditoriaDeMicroSegurosOcultosSteps
} from "./tema4-clasificacion"

import {
  lessonDetectar3GastosHormigaPersonalesSteps,
  lessonRecorteInteligenteSinSufrirSteps,
  lessonSustitucionesBaratoSaludableUtilSteps,
  lessonRetoSemanaSinGastoHormigaSteps,
  lessonSustitucionDeMarcasEstrategicaSteps
} from "./tema4-gastos-hormiga"

import {
  lessonComisionesYFugasBancariasSteps,
  lessonMembresiasYSuscripcionesOlvidadasSteps,
  lessonElCostoDelInteresDeudaMalaSteps,
  lessonDescuentosQueSalenCarosSteps,
  lessonAuditoria360DeMisSalidasSteps
} from "./tema4-gastos-invisibles"

// --- EVALUACIONES ---
import {
  lessonEvaluacionBloque1Steps,
  lessonEvaluacionBloque2Steps,
  lessonEvaluacionBloque3Steps
} from "./evaluaciones"

export const lessonRegistry: Record<string, LessonStep[]> = {
  // --- TEMA 1 ---
  "las-reglas-del-sistema-financiero": lessonLasRulesDelSistemaFinancieroSteps,
  "que-es-el-dinero-deuda-vs-energia": lessonQueEsElDineroDeudaVsEnergiaSteps,
  "tu-primer-estado-de-resultados-personal": lessonTuPrimerEstadoDeResultadosPersonalSteps,
  "el-registro-de-guerra-por-que-trackear-todo": lessonElRegistroDeGuerraPorQueTrackearTodoSteps,
  "gastos-fijos-vs-variables": lessonGastosFijosVsVariablesSteps,
  "que-son-y-por-que-importan": lessonQueSonYPorQueImportanSteps,
  "el-valor-de-tu-tiempo-calculo-real": lessonElValorDeTuTiempoCalculoRealSteps,
  "costo-de-oportunidad-elegir-es-renunciar": lessonCostoDeOportunidadElegirEsRenunciarSteps,
  "la-pausa-de-las-24-horas-mecanica": lessonLaPausaDeLas24HorasMecanicaSteps,
  "el-criterio-de-realidad-datos-vs-opinion": lessonElCriterioDeRealidadSteps,
  "el-mapa-del-tesoro-encontrando-el-flujo": lessonElMapaDelTesoroSteps,
  "el-blindaje-de-cuenta-cero-comisiones": lessonElBlindajeDeCuentaSteps,
  "el-filtro-de-valor-gasto-vs-inversion": lessonElFiltroDeValorSteps,
  "el-salario-de-tu-yo-del-futuro": lessonElSalarioDeTuYoDelFuturoSteps,
  "la-auditoria-de-supervivencia": lessonLaAuditoriaDeSupervivenciaSteps,
  "encontrando-el-flujo-maestro": lessonElMapaDelTesoroSteps,
  "la-pausa-de-las-24-horas": lessonLaPausaDeLas24HorasMecanicaSteps,
  "evaluacion-de-bloque-1": lessonEvaluacionBloque1Steps,
  "evaluacion-bloque-1": lessonEvaluacionBloque1Steps,
  
  // Legacy slugs from Topic 1 (Old Seed)
  "que-es-el-dinero-para-mi-hoy": lessonQueEsElDineroParaMiSteps,
  "que-es-el-dinero-para-mi": lessonQueEsElDineroParaMiSteps,
  "que-espero-del-dinero": lessonQueEsElDineroParaMiSteps,
  "identificar-mi-definicion-personal-del-dinero": lessonQueEsElDineroParaMiSteps,
  "dinero-como-seguridad-vs-libertad": lessonQueEsElDineroDeudaVsEnergiaSteps,
  "dinero-como-presion-vs-oportunidad": lessonQueEsElDineroDeudaVsEnergiaSteps,
  "pausa-financiera-reglas-anti-impulso": lessonLaPausaDeLas24HorasMecanicaSteps,
  "culpa-y-ansiedad-financiera-como-se-forman": lessonCulpaYAnsiedadFinancieraSteps,
  "emocion-vs-decision-casos-reales": lessonEmocionVsDecisionCasosRealesSteps,
  "mis-primeras-creencias-sobre-el-dinero": lessonMisPrimerasCreenciasSobreElDineroSteps,
  "expectativas-vs-realidad-financiera": lessonExpectativasVsRealidadFinancieraSteps,
  "frases-heredadas-que-me-limitan": lessonFrasesHeredadasQueMeLimitanSteps,
  "como-cuestionar-una-creencia-con-evidencia": lessonComoCuestionarUnaCreenciaConEvidenciaSteps,
  "reescribir-creencias-en-reglas-utiles": lessonMiNuevoManualDeReglasFinancierasSteps,
  "checkpoint-mi-manual-de-dinero-v1": lessonMiNuevoManualDeReglasFinancierasSteps,

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
  "evaluacion-de-bloque-2": lessonEvaluacionBloque2Steps,
  "evaluacion-bloque-2": lessonEvaluacionBloque2Steps,

  // --- TEMA 3 ---
  "como-me-hace-sentir-el-dinero": lessonComoMeHaceSentirElDineroSteps,
  "sesgos-cognitivos-y-dinero": lessonComoMeHaceSentirElDineroSteps,
  "senales-de-emocion-dominando-una-decision": lessonSenalesDeEmocionDominandoUnaDecisionSteps,
  "mis-creencias-limitantes-heredadas": lessonMisPrimerasCreenciasSobreElDineroSteps,
  "psicologia-de-la-deuda-por-que-duele-pagar": lessonPsicologiaDeLaDeudaSteps,
  "mi-nuevo-manual-de-reglas-financieras": lessonMiNuevoManualDeReglasFinancierasSteps,
  "que-es-un-trigger-de-compra": lessonQueEsUnTriggerDeCompraSteps,
  "apariencia-de-riqueza-vs-riqueza-real": lessonElEgoEnElConsumoDigitalSteps,
  "presion-social-en-decisiones-escenarios": lessonRedesComparacionYPresionSteps,
  "como-decir-que-no-sin-sentirte-menos": lessonReglaPersonalAntiEstatusSteps,
  "evaluacion-de-bloque-3": lessonEvaluacionBloque3Steps,
  "evaluacion-bloque-3": lessonEvaluacionBloque3Steps,

  // --- TEMA 4 ---
  "gastos-fijos-los-no-negociables": lessonGastosFijosVsVariablesSteps,
  "que-hacer-con-el-ocio": lessonSustitucionesBaratoSaludableUtilSteps,
  "auditoria-de-mi-gasto-personal": lessonClasificarMisGastosEjercicioCompletoSteps,
  "el-blindaje-de-cuenta-fijos": lessonAuditoriaDeMicroSegurosOcultosSteps,
  "suscripciones-y-cobros-fantasma": lessonMembresiasYSuscripcionesOlvidadasSteps,
  "comisiones-bancarias-comunes": lessonComisionesYFugasBancariasSteps,
  "envios-propinas-recargos": lessonDescuentosQueSalenCarosSteps,
  "costos-por-pagar-tarde": lessonElCostoDelInteresDeudaMalaSteps,
  "limpieza-cancelar-y-optimizar": lessonAuditoria360DeMisSalidasSteps,
  "auditoria-360-de-mis-salidas": lessonAuditoria360DeMisSalidasSteps,
}

export function getStepsForLesson(lessonId: string | undefined): LessonStep[] {
  if (!lessonId) return []
  return lessonRegistry[lessonId] ?? []
}
