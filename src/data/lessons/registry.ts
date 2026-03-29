import type { LessonStep } from "@/types/lessonTypes"

/**
 * BIZEN LESSON REGISTRY
 * Re-architected to "Get to the point" (Practical Theme 1)
 */

// --- TEMA 1: Operativo BIZEN (The System) ---
import { lessonLasRulesDelSistemaFinancieroSteps } from "./lesson-las-reglas-del-sistema-financiero"
import { lessonQueEsElDineroDeudaVsEnergiaSteps } from "./lesson-que-es-el-dinero-deuda-vs-energia"
import { lessonTuPrimerEstadoDeResultadosPersonalSteps } from "./lesson-tu-primer-estado-de-resultados-personal"
import { lessonElRegistroDeGuerraPorQueTrackearTodoSteps } from "./lesson-el-registro-de-guerra-por-que-trackear-todo"
import { lessonGastosFijosVsVariablesSteps } from "./tema4-clasificacion"
import { lessonQueSonYPorQueImportanSteps } from "./tema4-gastos-hormiga"
import { lessonElValorDeTuTiempoCalculoRealSteps } from "./lesson-el-valor-de-tu-tiempo-calculo-real"
import { lessonCostoDeOportunidadElegirEsRenunciarSteps } from "./lesson-costo-de-oportunidad-elegir-es-renunciar"
import { lessonLaPausaDeLas24HorasMecanicaSteps } from "./lesson-la-pausa-de-las-24-horas-mecanica"
import { lessonElCriterioDeRealidadSteps } from "./lesson-el-criterio-de-realidad-datos-vs-opinion"
import { lessonElMapaDelTesoroSteps } from "./lesson-el-mapa-del-tesoro-encontrando-el-flujo"
import { lessonElBlindajeDeCuentaSteps } from "./lesson-el-blindaje-de-cuenta-cero-comisiones"
import { lessonElFiltroDeValorSteps } from "./lesson-el-filtro-de-valor-gasto-vs-inversion"
import { lessonElSalarioDeTuYoDelFuturoSteps } from "./lesson-el-salario-de-tu-yo-del-futuro"
import { lessonLaAuditoriaDeSupervivenciaSteps } from "./lesson-la-auditoria-de-supervivencia"

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
  "evaluacion-bloque-1": lessonEvaluacionBloque1Steps,

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
  "evaluacion-bloque-2": lessonEvaluacionBloque2Steps,

  // --- TEMA 3 ---
  "como-me-hace-sentir-el-dinero": lessonComoMeHaceSentirElDineroSteps,
  "senales-de-emocion-dominando-una-decision": lessonSenalesDeEmocionDominandoUnaDecisionSteps,
  "culpa-y-ansiedad-financiera-como-se-forman": lessonCulpaYAnsiedadFinancieraSteps,
  "emocion-vs-decision-casos-reales": lessonEmocionVsDecisionCasosRealesSteps,
  "psicologia-de-la-deuda-por-que-duele-pagar": lessonPsicologiaDeLaDeudaSteps,
  "mis-primeras-creencias-sobre-el-dinero": lessonMisPrimerasCreenciasSobreElDineroSteps,
  "expectativas-vs-realidad-financiera": lessonExpectativasVsRealidadFinancieraSteps,
  "frases-heredadas-que-me-limitan": lessonFrasesHeredadasQueMeLimitanSteps,
  "como-cuestionar-una-creencia-con-evidencia": lessonComoCuestionarUnaCreenciaConEvidenciaSteps,
  "mi-nuevo-manual-de-reglas-financieras": lessonMiNuevoManualDeReglasFinancierasSteps,
  "que-es-un-trigger-de-compra": lessonQueEsUnTriggerDeCompraSteps,
  "redes-comparacion-y-presion": lessonRedesComparacionYPresionSteps,
  "comprar-por-estatus-vs-por-valor": lessonComprarPorEstatusVsPorValorSteps,
  "regla-personal-anti-estatus": lessonReglaPersonalAntiEstatusSteps,
  "el-ego-en-el-consumo-digital": lessonElEgoEnElConsumoDigitalSteps,
  "publicidad-como-te-manipula": lessonPublicidadComoTeManipulaSteps,
  "compras-por-aburrimiento-vs-necesidad": lessonComprasPorAburrimientoVsNecesidadSteps,
  "detectar-mis-triggers-casos": lessonDetectarMisTriggersCasosSteps,
  "evaluacion-bloque-3": lessonEvaluacionBloque3Steps,

  // --- TEMA 4 ---
  "necesidad-vs-deseo": lessonNecesidadVsDeseoSteps,
  "gastos-discrecionales-lo-que-si-eliges": lessonGastosDiscrecionalesLoQueSiEligesSteps,
  "costo-real-gasto-extras": lessonCostoRealGastoExtrasSteps,
  "clasificar-mis-gastos-ejercicio-completo": lessonClasificarMisGastosEjercicioCompletoSteps,
  "auditoria-de-micro-seguros-ocultos": lessonAuditoriaDeMicroSegurosOcultosSteps,
  "detectar-3-gastos-hormiga-personales": lessonDetectar3GastosHormigaPersonalesSteps,
  "recorte-inteligente-sin-sufrir": lessonRecorteInteligenteSinSufrirSteps,
  "sustituciones-barato-saludable-util": lessonSustitucionesBaratoSaludableUtilSteps,
  "reto-semana-sin-gasto-hormiga": lessonRetoSemanaSinGastoHormigaSteps,
  "sustitucion-de-marcas-estrategica": lessonSustitucionDeMarcasEstrategicaSteps,
  "comisiones-y-fugas-bancarias": lessonComisionesYFugasBancariasSteps,
  "membresias-y-suscripciones-olvidadas": lessonMembresiasYSuscripcionesOlvidadasSteps,
  "el-costo-del-interes-deuda-mala": lessonElCostoDelInteresDeudaMalaSteps,
  "descuentos-que-salen-caros": lessonDescuentosQueSalenCarosSteps,
  "auditoria-360-de-mis-salidas": lessonAuditoria360DeMisSalidasSteps,
}

export function getStepsForLesson(lessonId: string | undefined): LessonStep[] {
  if (!lessonId) return []
  return lessonRegistry[lessonId] ?? []
}
