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
import { lessonElDineroYLasFinanzasSteps } from "@/data/lessons/tema1-dinero-finanzas"
import { lessonQueSonFinanzasPersonalesSteps } from "@/data/lessons/tema2-que-son-finanzas-personales"

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

import { lessonRiesgoDiversificacionSteps } from "./tema3-riesgo-y-diversificacion"

import { lessonIntroFinanzasEmpresarialesSteps } from "./tema4-intro-finanzas-empresariales"

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

// --- TEMA 5: Ahorro Inteligente ---
import {
  lessonAhorroNoEsGuardarEsAcumularSteps,
  lessonFondoDeEmergenciaDeAceroSteps,
  lessonSistemasDeAutomatizacionSteps,
  lessonAhorroPorObjetivosSteps,
  lessonLaTasaDeAhorroSteps,
  lessonReto30DiasSteps,
  lessonMicroAhorroSteps,
  lessonInflacionSteps,
  lessonAhorroHedonicoSteps,
  lessonAuditoriaSuscripcionesSteps,
  lessonAhorroVsInversionSteps,
  lessonCuentasAltoRendimientoSteps,
  lessonCostoInaccionSteps,
  lessonProteccionDevaluacionSteps,
  lessonExamenMaestriaAcumulacionSteps
} from "./tema5-ahorro-inteligente"

// --- EVALUACIONES ---
import {
  lessonEvaluacionBloque1Steps,
  lessonEvaluacionBloque2Steps,
  lessonEvaluacionBloque3Steps
} from "./evaluaciones"

export const lessonRegistry: Record<string, LessonStep[]> = {
  // --- TEMA 1 ---
  "el-dinero-y-las-finanzas": lessonElDineroYLasFinanzasSteps,
  "las-reglas-del-sistema-financiero": lessonLasRulesDelSistemaFinancieroSteps,
  "que-es-el-dinero-deuda-vs-energia": lessonQueEsElDineroDeudaVsEnergiaSteps,
  "tu-primer-estado-de-resultados-personal": lessonTuPrimerEstadoDeResultadosPersonalSteps,
  "el-registro-de-guerra-por-que-trackear-todo": lessonElRegistroDeGuerraPorQueTrackearTodoSteps,
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
  
  // Tema 1 - Subtema 1: Conceptos básicos de finanzas
  "que-son-las-finanzas": lessonElDineroYLasFinanzasSteps,
  "importancia-de-las-finanzas": lessonElDineroYLasFinanzasSteps,
  
  // Tema 1 - Subtema 2: Conceptos básicos de economía
  "que-es-la-economia": lessonElDineroYLasFinanzasSteps,
  "economia-y-vida-diaria": lessonElDineroYLasFinanzasSteps,
  
  // Tema 1 - Subtema 3: El dinero
  "que-es-el-dinero": lessonQueEsElDineroDeudaVsEnergiaSteps,
  "funciones-del-dinero": lessonQueEsElDineroDeudaVsEnergiaSteps,
  "evolucion-del-dinero": lessonQueEsElDineroDeudaVsEnergiaSteps,
  
  // Tema 1 - Subtema 4: Principios económicos
  "principio-escasez": lessonQueEsElDineroDeudaVsEnergiaSteps,
  "recursos-economicos": lessonQueEsElDineroDeudaVsEnergiaSteps,
  "toma-de-decisiones": lessonQueEsElDineroDeudaVsEnergiaSteps,

  // Tema 1 - Subtema 5: Oferta y demanda
  "que-es-la-oferta": lessonElDineroYLasFinanzasSteps,
  "que-es-la-demanda": lessonElDineroYLasFinanzasSteps,
  "determinacion-del-precio": lessonElDineroYLasFinanzasSteps,

  // Tema 1 - Subtema 6: El mercado
  "que-es-el-mercado": lessonElDineroYLasFinanzasSteps,
  "tipos-de-mercado": lessonElDineroYLasFinanzasSteps,

  // Tema 1 - Subtema 7: Inflación
  "que-es-la-inflacion": lessonElDineroYLasFinanzasSteps,
  "aumento-de-precios": lessonElDineroYLasFinanzasSteps,
  "poder-adquisitivo": lessonElDineroYLasFinanzasSteps,

  // Tema 1 - Subtema 8: Costo de oportunidad
  "que-es-costo-oportunidad": lessonCostoDeOportunidadElegirEsRenunciarSteps,
  "importancia-costo-oportunidad": lessonCostoDeOportunidadElegirEsRenunciarSteps,

  // Tema 1 - Subtema 9: Educación financiera
  "que-es-educacion-financiera": lessonElDineroYLasFinanzasSteps,
  "importancia-educacion-financiera": lessonElDineroYLasFinanzasSteps,

  // Tema 1 - Subtema 10: Sistema financiero en México
  "banxico": lessonLasRulesDelSistemaFinancieroSteps,
  "condusef": lessonLasRulesDelSistemaFinancieroSteps,
  "ipab": lessonLasRulesDelSistemaFinancieroSteps,
  "funciones-instituciones-financieras": lessonLasRulesDelSistemaFinancieroSteps,
  
  // Legacy slugs from Topic 1 (Old Seed)
  "que-es-el-dinero-para-mi-hoy": lessonQueEsElDineroParaMiSteps,
  "que-es-el-dinero-para-mi": lessonQueEsElDineroParaMiSteps,
  "que-espero-del-dinero": lessonQueEsElDineroParaMiSteps,
  "identificar-mi-definicion-personal-del-dinero": lessonQueEsElDineroParaMiSteps,
  "dinero-como-seguridad-vs-libertad": lessonQueEsElDineroDeudaVsEnergiaSteps,
  "dinero-como-presion-vs-oportunidad": lessonQueEsElDineroDeudaVsEnergiaSteps,
  "pausa-financiera-reglas-anti-impulso": lessonLaPausaDeLas24HorasMecanicaSteps,
  "reescribir-creencias-en-reglas-utiles": lessonMiNuevoManualDeReglasFinancierasSteps,
  "checkpoint-mi-manual-de-dinero-v1": lessonMiNuevoManualDeReglasFinancierasSteps,

  // --- TEMA 2 (Finanzas Personales) ---
  "que-son-finanzas-personales": lessonQueSonFinanzasPersonalesSteps,

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

  // --- TEMA 3: Psicología & Hacks de Comportamiento ---
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
  "riesgo-y-diversificacion": lessonRiesgoDiversificacionSteps,
  "intro-finanzas-empresariales": lessonIntroFinanzasEmpresarialesSteps,
  "evaluacion-de-bloque-3": lessonEvaluacionBloque3Steps,
  "evaluacion-bloque-3": lessonEvaluacionBloque3Steps,

  // --- TEMA 4: Optimización de Egresos ---
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
  "auditoria-de-micro-seguros-ocultos": lessonAuditoriaDeMicroSegurosOcultosSteps,
  "comisiones-y-fugas-bancarias": lessonComisionesYFugasBancariasSteps,
  "membresias-y-suscripciones-olvidadas": lessonMembresiasYSuscripcionesOlvidadasSteps,
  "el-costo-del-interes-deuda-mala": lessonElCostoDelInteresDeudaMalaSteps,
  "auditoria-360-de-mis-salidas": lessonAuditoria360DeMisSalidasSteps,

  // --- TEMA 5 ---
  "ahorro-bizen-no-es-guardar-es-acumular": lessonAhorroNoEsGuardarEsAcumularSteps,
  "fondo-de-emergencia-de-acero": lessonFondoDeEmergenciaDeAceroSteps,
  "sistemas-de-automatizacion-friccion-cero": lessonSistemasDeAutomatizacionSteps,
  "ahorro-por-objetivos-bucket-system": lessonAhorroPorObjetivosSteps,
  "la-tasa-de-ahorro-tu-indicador-maestro": lessonLaTasaDeAhorroSteps,
  "reto-de-los-30-dias": lessonReto30DiasSteps,
  "micro-ahorro-el-poder-de-lo-pequeno": lessonMicroAhorroSteps,
  "inflacion-el-enemigo-invisible": lessonInflacionSteps,
  "ahorro-hedonico-no-te-prives-optimiza": lessonAhorroHedonicoSteps,
  "auditoria-de-suscripciones-maestras": lessonAuditoriaSuscripcionesSteps,
  "ahorro-vs-inversion-el-salto-cuantico": lessonAhorroVsInversionSteps,
  "cuentas-de-alto-rendimiento-efectivo-inteligente": lessonCuentasAltoRendimientoSteps,
  "el-costo-de-la-inaccion": lessonCostoInaccionSteps,
  "proteccion-contra-devaluacion": lessonProteccionDevaluacionSteps,
  "examen-maestria-acumulacion": lessonExamenMaestriaAcumulacionSteps,
}

export function getStepsForLesson(lessonId: string | undefined): LessonStep[] {
  if (!lessonId) return []
  return lessonRegistry[lessonId] ?? []
}
