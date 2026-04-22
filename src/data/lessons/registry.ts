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
import { 
  lessonGastosFijosVsVariablesSteps, 
  lessonNecesidadVsDeseoSteps, 
  lessonGastosDiscrecionalesLoQueSiEligesSteps, 
  lessonCostoRealGastoExtrasSteps, 
  lessonClasificarMisGastosEjercicioCompletoSteps,
  lessonAuditoriaDeMicroSegurosOcultosSteps
} from "@/data/lessons/tema4-clasificacion"
import { 
  lessonQueSonYPorQueImportanSteps,
  lessonDetectar3GastosHormigaPersonalesSteps,
  lessonRecorteInteligenteSinSufrirSteps,
  lessonSustitucionesBaratoSaludableUtilSteps,
  lessonRetoSemanaSinGastoHormigaSteps
} from "@/data/lessons/tema4-gastos-hormiga"
import { lessonElValorDeTuTiempoCalculoRealSteps } from "@/data/lessons/lesson-el-valor-de-tu-tiempo-calculo-real"
import { lessonCostoDeOportunidadElegirEsRenunciarSteps } from "@/data/lessons/lesson-costo-de-oportunidad-elegir-es-renunciar"
import { lessonLaPausaDeLas24HorasMecanicaSteps } from "@/data/lessons/lesson-la-pausa-de-las-24-horas-mecanica"
import { lessonElCriterioDeRealidadSteps } from "@/data/lessons/lesson-el-criterio-de-realidad-datos-vs-opinion"
import { lessonElMapaDelTesoroSteps } from "@/data/lessons/lesson-el-mapa-del-tesoro-encontrando-el-flujo"
import { lessonElBlindajeDeCuentaSteps } from "@/data/lessons/lesson-el-blindaje-de-cuenta-cero-comisiones"
import { lessonElFiltroDeValorSteps } from "@/data/lessons/lesson-el-filtro-de-valor-gasto-vs-inversion"
import { lessonElSalarioDeTuYoDelFuturoSteps } from "@/data/lessons/lesson-el-salario-de-tu-yo-del-futuro"
import { lessonLaAuditoriaDeSupervivenciaSteps } from "@/data/lessons/lesson-la-auditoria-de-supervivencia"
import { lessonQueSonFinanzasPersonalesSteps } from "@/data/lessons/tema2-que-son-finanzas-personales"
import { lessonIngresosYGastosSteps, lessonFlujoDeDineroSteps } from "@/data/lessons/tema2-administracion-dinero"

// --- TEMA 2: Finanzas Personales ---
import { lessonQueEsUnPresupuestoSteps, lessonPasosPresupuestoSteps, lessonAjustePresupuestoSteps } from "@/data/lessons/tema2-presupuesto"
import { lessonRegla503020Steps, lessonRegla602020Steps } from "@/data/lessons/tema2-metodos-presupuesto"
import { lessonAppsFinancierasSteps, lessonExcelFinancieroSteps, lessonMetodosManualesSteps } from "@/data/lessons/tema2-herramientas-control"
import { lessonQueEsElAhorroSteps, lessonImportanciaAhroSteps, lessonMetasAhorroSteps } from "@/data/lessons/tema2-ahorro"
import { lessonQueEsFondoEmergenciaSteps, lessonCuantoAhorrarEmergenciaSteps, lessonDondeGuardarFondoSteps } from "@/data/lessons/tema2-fondo-emergencia"
import { lessonQueEsLaDeudaSteps, lessonDeudaBuenaVsMalaSteps, lessonMetodosPagarDeudasSteps } from "@/data/lessons/tema2-deudas"
import { lessonBancosTradicionalesSteps, lessonSofiposSteps, lessonFintechSteps } from "@/data/lessons/tema2-instituciones"
import { lessonMetasFinancierasPersonalesSteps, lessonOrganizacionDineroSteps, lessonHabitosFinancierosSteps } from "@/data/lessons/tema2-planeacion"

// --- TEMA 3: Finanzas Bursátiles ---
import { lessonRiesgoYDiversificacionSteps, lessonBolsaParaQueSteps, lessonBolsaComoFuncionaSteps } from "@/data/lessons/tema3-introduccion-bolsa"
import { lessonInversionistasSteps, lessonEmpresasListadasSteps, lessonIntermediariosCasasBolsaSteps } from "@/data/lessons/tema3-participantes-mercado"
import { lessonQueEsInvertirSteps, lessonAhorroVsInversionSteps, lessonRendimientoYRiesgoSteps } from "@/data/lessons/tema3-conceptos-inversion"
import { lessonInstrumentosAccionesSteps, lessonInstrumentosEtfsSteps, lessonInstrumentosBonosSteps, lessonInstrumentosFondosSteps } from "@/data/lessons/tema3-tipos-instrumentos"
import {
  lessonAccionDefinicionSteps,
  lessonDividendosYPlusvaliaSteps,
  lessonEmpresasPublicasSteps,
  lessonEtfsDefinicionSteps,
  lessonEtfsFuncionamientoSteps,
  lessonEtfsVentajasSteps,
  lessonBonosDefinicionSteps,
  lessonBonosRendimientoSteps
} from "@/data/lessons/tema3-activos-profundidad"
import {
  lessonAbrirCuentaInversionSteps,
  lessonElegirPlataformaSteps,
  lessonPrimerosPasosInversionSteps,
  lessonCompraVentaBolsaSteps,
  lessonOrdenesBasicasSteps,
  lessonRendimientoQueEsSteps,
  lessonCalculoRendimientoSteps
} from "@/data/lessons/tema3-operativa-bursatil"
import {
  lessonRiesgoFinancieroSteps,
  lessonTiposDeRiesgoSteps,
  lessonRelacionRiesgoRendimientoSteps,
  lessonDiversificacionQueEsSteps,
  lessonImportanciaDiversificacionSteps,
  lessonEjemplosDiversificacionSteps,
  lessonCortoPlazoSteps,
  lessonMedianoPlazoSteps,
  lessonLargoPlazoSteps
} from "@/data/lessons/tema3-riesgo-estrategico"
import {
  lessonEstrategiaLargoPlazoSteps,
  lessonTradingBasicoSteps,
  lessonInversionPeriodicaSteps,
  lessonGraficasQueSonSteps,
  lessonTendenciasMercadoSteps,
  lessonNoticiasFinancierasSteps,
  lessonGraficasLineasSteps,
  lessonVelasJaponesasSteps,
  lessonInterpretacionGraficasSteps,
  lessonPortafolioDefinicionSteps,
  lessonConstruccionPortafolioSteps,
  lessonBalanceoPortafolioSteps
} from "@/data/lessons/tema3-analisis-y-portafolio"
import {
  lessonEmocionesInversionSteps,
  lessonErroresPsicologicosSteps,
  lessonDisciplinaFinancieraSteps,
  lessonNoDiversificarSteps,
  lessonInvertirSinConocimientoSteps,
  lessonSeguirModasSteps,
  lessonFraudesInversionSteps,
  lessonPlataformasConfiablesSteps,
  lessonProteccionUsuarioSteps
} from "@/data/lessons/tema3-psicologia-y-seguridad"

import {
  lessonRetencionFidelizacionSteps,
  lessonTiposIngresosNegocioSteps,
  lessonProyeccionIngresosSteps,
  lessonQueSonCostosNegocioSteps,
  lessonCostosFijosSteps,
  lessonCostosVariablesSteps
} from "@/data/lessons/tema4-ingresos-costos"
import {
  lessonCalculoCostosNegocioSteps,
  lessonCostoTotalSteps,
  lessonCostoUnitarioSteps,
  lessonFijacionPreciosSteps,
  lessonRelacionCostoPrecioSteps,
  lessonMargenGananciaSteps,
  lessonDefinirSueldosSteps,
  lessonCostosEmpleadosSteps,
  lessonNominaBasicaSteps,
  lessonPuntoEquilibrioQueEsSteps,
  lessonCalculoPuntoEquilibrioSteps,
  lessonFlujoEfectivoNegocioSteps,
  lessonControlEfectivoSteps
} from "@/data/lessons/tema4-precios-y-punto-equilibrio"
import {
  lessonCrecimientoEscalableSteps,
  lessonInversionNegocioSteps,
  lessonVentaNegocioSteps,
  lessonLibertadFinancieraNegocioSteps
} from "@/data/lessons/tema4-finanzas-avanzadas"
import {
  lessonSituacionFinancieraSteps,
  lessonLiquidezSteps,
  lessonRentabilidadSteps,
  lessonTiposFinanciamientoSteps,
  lessonRiesgosCreditosNegocioSteps
} from "@/data/lessons/tema4-analisis-y-credito"
import {
  lessonInterpretarIngresosGastosSteps,
  lessonUtilidadYPerdidasSteps,
  lessonRazonesFinancierasIntroSteps,
  lessonFinanciamientoQueEsSteps,
  lessonCuandoUsarFinanciamientoSteps,
  lessonCreditosNegocioTiposSteps,
  lessonFuncionamientoCreditosNegocioSteps,
  lessonQueEsResicoSteps,
  lessonQuienPuedeUsarloSteps,
  lessonBeneficiosResicoSteps,
  lessonEvaluacionRentabilidadSteps,
  lessonEvaluacionCrecimientoSteps,
  lessonViabilidadNegocioSteps,
  lessonSegurosNegocioSteps,
  lessonProteccionLegalSteps,
  lessonManejoRiesgosNegocioSteps,
  lessonQueEsReinversionSteps,
  lessonImportanciaReinversionSteps,
  lessonEstrategiasReinversionSteps,
  lessonAnalisisOpcionesSteps,
  lessonOptimizacionRecursosSteps
} from "@/data/lessons/tema4-stubs"
import {
  lessonFundamentosNegocioSteps,
  lessonActivosNegocioSteps,
  lessonPasivosNegocioSteps,
  lessonPatrimonioNegocioSteps,
  lessonQueEsEmpresaSteps,
  lessonTiposEmprendimientoSteps,
  lessonModelosNegocioSteps,
  lessonPropuestaValorSteps,
  lessonSegmentacionClientesSteps,
  lessonCanalesVentaSteps
} from "@/data/lessons/tema4-fundamentos-negocio"

import {
  lessonEvaluacionBloque1Steps,
  lessonEvaluacionBloque2Steps,
  lessonEvaluacionBloque3Steps,
  lessonEvaluacionBloque4Steps
} from "./evaluaciones"
import { lessonElDineroYLasFinanzasSteps, lessonQueSonLasFinanzasSteps, lessonImportanciaDeLasFinanzasSteps } from "@/data/lessons/tema1-conceptos-basicos"
import { lessonQueEsLaEconomiaSteps, lessonEconomiaVidaDiariaSteps } from "@/data/lessons/tema1-conceptos-economia"
import { lessonQueEsElDineroSteps, lessonFuncionesDelDineroSteps, lessonEvolucionDelDineroSteps } from "@/data/lessons/tema1-el-dinero"
import { lessonEscasezSteps, lessonRecursosSteps, lessonTomaDecisionesSteps } from "@/data/lessons/tema1-principios-economicos"
import { lessonQueEsLaOfertaSteps, lessonQueEsLaDemandaSteps, lessonComoSeDeterminaElPrecioSteps } from "@/data/lessons/tema1-oferta-demanda"
import { lessonQueEsUnMercadoSteps, lessonTiposDeMercadoSteps } from "@/data/lessons/tema1-el-mercado"
import { lessonQueEsLaInflacionSteps, lessonAumentoPreciosSteps, lessonPoderAdquisitivoSteps } from "@/data/lessons/tema1-inflacion"
import { lessonQueEsCostoOportunidadSteps, lessonImportanciaSistemasFinancieroSteps } from "@/data/lessons/tema1-costo-oportunidad"
import { lessonQueEsEducacionFinancieraSteps, lessonImportanciaEducacionFinancieraSteps } from "@/data/lessons/tema1-educacion-financiera"
import { lessonBanxicoSteps, lessonCondusefSteps, lessonIpabSteps, lessonFuncionesInstitucionesSteps } from "@/data/lessons/tema1-sistema-financiero-mexico"

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

// import { lessonRiesgoDiversificacionSteps } from "./tema3-riesgo-y-diversificacion"

// --- TEMA 4: Tipos de Gastos (Revised) ---
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
  lessonAhorroVsInversionSmartSteps,
  lessonCuentasAltoRendimientoSteps,
  lessonCostoInaccionSteps,
  lessonProteccionDevaluacionSteps,
  lessonExamenMaestriaAcumulacionSteps
} from "./tema5-ahorro-inteligente"
import { lessonIntroFinanzasEmpresarialesSteps as lessonIntroFinanzasEmpresarialesOldSteps } from "./tema4-intro-finanzas-empresariales"

export const lessonRegistry: Record<string, LessonStep[]> = {
  // --- TEMA 1 ---
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
  "el-dinero-y-las-finanzas": lessonElDineroYLasFinanzasSteps,
  "que-son-las-finanzas": lessonQueSonLasFinanzasSteps,
  "importancia-de-las-finanzas": lessonImportanciaDeLasFinanzasSteps,
  
  // Tema 1 - Subtema 2: Conceptos básicos de economía
  "que-es-la-economia": lessonQueEsLaEconomiaSteps,
  "economia-y-vida-diaria": lessonEconomiaVidaDiariaSteps,
  
  // Tema 1 - Subtema 3: El dinero
  "que-es-el-dinero": lessonQueEsElDineroSteps,
  "funciones-del-dinero": lessonFuncionesDelDineroSteps,
  "evolucion-del-dinero": lessonEvolucionDelDineroSteps,
  
  // Tema 1 - Subtema 4: Principios económicos
  "principio-escasez": lessonEscasezSteps,
  "recursos-economicos": lessonRecursosSteps,
  "toma-de-decisiones": lessonTomaDecisionesSteps,

  // Tema 1 - Subtema 5: Oferta y demanda
  "que-es-la-oferta": lessonQueEsLaOfertaSteps,
  "que-es-la-demanda": lessonQueEsLaDemandaSteps,
  "determinacion-del-precio": lessonComoSeDeterminaElPrecioSteps,

  // Tema 1 - Subtema 6: El mercado
  "que-es-el-mercado": lessonQueEsUnMercadoSteps,
  "tipos-de-mercado": lessonTiposDeMercadoSteps,

  // Tema 1 - Subtema 7: Inflación
  "que-es-la-inflacion": lessonQueEsLaInflacionSteps,
  "aumento-de-precios": lessonAumentoPreciosSteps,
  "poder-adquisitivo": lessonPoderAdquisitivoSteps,

  // Tema 1 - Subtema 8: Costo de oportunidad
  "que-es-costo-oportunidad": lessonQueEsCostoOportunidadSteps,
  "importancia-costo-oportunidad": lessonImportanciaSistemasFinancieroSteps,

  // Tema 1 - Subtema 9: Educación financiera
  "que-es-educacion-financiera": lessonQueEsEducacionFinancieraSteps,
  "importancia-educacion-financiera": lessonImportanciaEducacionFinancieraSteps,

  // Tema 1 - Subtema 10: Sistema financiero en México
  "banxico": lessonBanxicoSteps,
  "condusef": lessonCondusefSteps,
  "ipab": lessonIpabSteps,
  "funciones-instituciones-financieras": lessonFuncionesInstitucionesSteps,
  
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
  // Subtema 1
  "que-son-finanzas-personales": lessonQueSonFinanzasPersonalesSteps,
  "importancia-personales": lessonQueSonFinanzasPersonalesSteps, // Map both to first lesson for now
  // Subtema 2
  "ingresos-y-gastos": lessonIngresosYGastosSteps,
  "flujo-de-dinero": lessonFlujoDeDineroSteps,
  // Subtema 3
  "que-es-presupuesto": lessonQueEsUnPresupuestoSteps,
  "pasos-presupuesto": lessonPasosPresupuestoSteps,
  "ajuste-presupuesto": lessonAjustePresupuestoSteps,
  // Subtema 4
  "regla-50-30-20": lessonRegla503020Steps,
  "regla-60-20-20": lessonRegla602020Steps,
  // Subtema 5
  "apps-financieras": lessonAppsFinancierasSteps,
  "excel-financiero": lessonExcelFinancieroSteps,
  "metodos-manuales": lessonMetodosManualesSteps,
  // Subtema 6
  "que-es-ahorro": lessonQueEsElAhorroSteps,
  "importancia-ahorro": lessonImportanciaAhroSteps,
  "metas-ahorro": lessonMetasAhorroSteps,
  // Subtema 7
  "fondo-emergencia-definicion": lessonQueEsFondoEmergenciaSteps,
  "utilidad-fondo": lessonQueEsFondoEmergenciaSteps, // Merged
  "calculo-fondo": lessonCuantoAhorrarEmergenciaSteps,
  "tipos-inversion-emergencia": lessonDondeGuardarFondoSteps,
  // Subtema 8
  "que-es-credito": lessonQueEsLaDeudaSteps,
  "funcionamiento-credito": lessonDeudaBuenaVsMalaSteps,
  "uso-responsable-credito": lessonMetodosPagarDeudasSteps,
  // Subtema 9
  "bancos-tradicionales": lessonBancosTradicionalesSteps,
  "sofipos": lessonSofiposSteps,
  "fintech": lessonFintechSteps,
  "otras-instituciones": lessonFintechSteps, // Merged
  // Subtema 10
  "que-son-prestamos": lessonQueEsLaDeudaSteps,
  "tipos-prestamos": lessonDeudaBuenaVsMalaSteps,
  "riesgos-prestamos": lessonMetodosPagarDeudasSteps,
  // Subtema 11
  "metas-financieras-personales": lessonMetasFinancierasPersonalesSteps,
  "organizacion-dinero": lessonOrganizacionDineroSteps,
  "habitos-financieros": lessonHabitosFinancierosSteps,

  // --- TEMA 3: Finanzas Bursátiles ---
  // Subtema 1
  "riesgo-y-diversificacion": lessonRiesgoYDiversificacionSteps,
  "bolsa-para-que": lessonBolsaParaQueSteps,
  "bolsa-como-funciona": lessonBolsaComoFuncionaSteps,
  // Subtema 2
  "inversionistas": lessonInversionistasSteps,
  "empresas-listadas": lessonEmpresasListadasSteps,
  "intermediarios-casas-bolsa": lessonIntermediariosCasasBolsaSteps,
  // Subtema 3
  "que-es-invertir": lessonQueEsInvertirSteps,
  "ahorro-vs-inversion": lessonAhorroVsInversionSteps,
  "rendimiento-y-riesgo": lessonRendimientoYRiesgoSteps,
  // Subtema 4
  "instrumentos-acciones": lessonInstrumentosAccionesSteps,
  "instrumentos-etfs": lessonInstrumentosEtfsSteps,
  "instrumentos-bonos": lessonInstrumentosBonosSteps,
  "instrumentos-fondos": lessonInstrumentosFondosSteps,
  // Subtema 5
  "accion-definicion": lessonAccionDefinicionSteps,
  "dividendos-y-plusvalia": lessonDividendosYPlusvaliaSteps,
  "empresas-publicas": lessonEmpresasPublicasSteps,
  // Subtema 6
  "etfs-definicion": lessonEtfsDefinicionSteps,
  "etfs-funcionamiento": lessonEtfsFuncionamientoSteps,
  "etfs-ventajas": lessonEtfsVentajasSteps,
  // Subtema 7
  "bonos-definicion": lessonBonosDefinicionSteps,
  "bonos-rendimiento": lessonBonosRendimientoSteps,
  // Subtema 8
  "abrir-cuenta-inversion": lessonAbrirCuentaInversionSteps,
  "elegir-plataforma": lessonElegirPlataformaSteps,
  "primeros-pasos-inversion": lessonPrimerosPasosInversionSteps,
  // Subtema 9
  "compra-venta-bolsa": lessonCompraVentaBolsaSteps,
  "ordenes-basicas": lessonOrdenesBasicasSteps,
  // Subtema 10
  "rendimiento-que-es": lessonRendimientoQueEsSteps,
  "calculo-rendimiento": lessonCalculoRendimientoSteps,
  // Subtema 11
  "riesgo-financiero": lessonRiesgoFinancieroSteps,
  "tipos-de-riesgo": lessonTiposDeRiesgoSteps,
  "relacion-riesgo-rendimiento": lessonRelacionRiesgoRendimientoSteps,
  // Subtema 12
  "diversificacion-que-es": lessonDiversificacionQueEsSteps,
  "importancia-diversificacion": lessonImportanciaDiversificacionSteps,
  "ejemplos-diversificacion": lessonEjemplosDiversificacionSteps,
  // Subtema 13
  "corto-plazo": lessonCortoPlazoSteps,
  "mediano-plazo": lessonMedianoPlazoSteps,
  "largo-plazo": lessonLargoPlazoSteps,
  // Subtema 14
  "estrategia-largo-plazo": lessonEstrategiaLargoPlazoSteps,
  "trading-basico": lessonTradingBasicoSteps,
  "inversion-periodica": lessonInversionPeriodicaSteps,
  // Subtema 15
  "graficas-que-son": lessonGraficasQueSonSteps,
  "tendencias-mercado": lessonTendenciasMercadoSteps,
  "noticias-financieras": lessonNoticiasFinancierasSteps,
  // Subtema 16
  "graficas-lineas": lessonGraficasLineasSteps,
  "velas-japonesas": lessonVelasJaponesasSteps,
  "interpretacion-graficas": lessonInterpretacionGraficasSteps,
  // Subtema 17
  "portafolio-definicion": lessonPortafolioDefinicionSteps,
  "construccion-portafolio": lessonConstruccionPortafolioSteps,
  "balanceo-portafolio": lessonBalanceoPortafolioSteps,
  // Subtema 18
  "emociones-inversion": lessonEmocionesInversionSteps,
  "errores-psicologicos": lessonErroresPsicologicosSteps,
  "disciplina-financiera": lessonDisciplinaFinancieraSteps,
  // Subtema 19
  "no-diversificar": lessonNoDiversificarSteps,
  "invertir-sin-conocimiento": lessonInvertirSinConocimientoSteps,
  "seguir-modas": lessonSeguirModasSteps,
  // Subtema 20
  "fraudes-inversion": lessonFraudesInversionSteps,
  "plataformas-confiables": lessonPlataformasConfiablesSteps,
  "proteccion-usuario": lessonProteccionUsuarioSteps,

  // --- TEMA 4: Finanzas para mi Negocio ---
  // Subtema 1
  "intro-finanzas-empresariales": lessonFundamentosNegocioSteps,
  "importancia-negocio": lessonFundamentosNegocioSteps,
  // Subtema 2
  "que-es-modelo-negocio": lessonModelosNegocioSteps,
  "generacion-ingresos": lessonModelosNegocioSteps,
  "tipos-modelo-negocio": lessonModelosNegocioSteps,
  // Subtema 3
  "business-model-canvas": lessonModelosNegocioSteps,
  "roadmap-negocio": lessonFundamentosNegocioSteps,
  "propuesta-de-valor": lessonPropuestaValorSteps,
  // Subtema 4
  "que-es-crm": lessonSegmentacionClientesSteps,
  "importancia-clientes": lessonSegmentacionClientesSteps,
  "retencion-fidelizacion": lessonSegmentacionClientesSteps,
  // Subtema 5
  "tipos-ingresos-negocio": lessonTiposIngresosNegocioSteps,
  "proyeccion-ingresos": lessonProyeccionIngresosSteps,
  // Subtema 6
  "que-son-costos-negocio": lessonQueSonCostosNegocioSteps,
  "costos-fijos": lessonCostosFijosSteps,
  "costos-variables": lessonCostosVariablesSteps,
  // Subtema 7
  "calculo-costos-negocio": lessonCalculoCostosNegocioSteps,
  "costo-total": lessonCostoTotalSteps,
  "costo-unitario": lessonCostoUnitarioSteps,
  // Subtema 8
  "fijacion-precios": lessonFijacionPreciosSteps,
  "relacion-costo-precio": lessonRelacionCostoPrecioSteps,
  "margen-ganancia": lessonMargenGananciaSteps,
  // Subtema 9
  "definir-sueldos": lessonDefinirSueldosSteps,
  "costos-empleados": lessonCostosEmpleadosSteps,
  "nomina-basica": lessonNominaBasicaSteps,
  // Subtema 10
  "punto-equilibrio-que-es": lessonPuntoEquilibrioQueEsSteps,
  "calculo-punto-equilibrio": lessonCalculoPuntoEquilibrioSteps,
  "importancia-punto-equilibrio": lessonCalculoPuntoEquilibrioSteps,
  // Subtema 11
  "flujo-efectivo-negocio": lessonFlujoEfectivoNegocioSteps,
  "control-efectivo": lessonControlEfectivoSteps,
  "importancia-flujo": lessonFlujoEfectivoNegocioSteps,
  // Subtema 12
  "que-son-estados-financieros": lessonInterpretarIngresosGastosSteps,
  "estado-resultados": lessonUtilidadYPerdidasSteps,
  "balance-general": lessonSituacionFinancieraSteps,
  // Subtema 13
  "interpretar-ingresos-gastos": lessonInterpretarIngresosGastosSteps,
  "utilidad-y-perdidas": lessonUtilidadYPerdidasSteps,
  "situacion-financiera": lessonSituacionFinancieraSteps,
  // Subtema 14
  "razones-financieras-intro": lessonRazonesFinancierasIntroSteps,
  "liquidez": lessonLiquidezSteps,
  "rentabilidad": lessonRentabilidadSteps,
  "endeudamiento": lessonRazonesFinancierasIntroSteps,
  // Subtema 15
  "financiamiento-que-es": lessonFinanciamientoQueEsSteps,
  "tipos-financiamiento": lessonTiposFinanciamientoSteps,
  "cuando-usar-financiamiento": lessonCuandoUsarFinanciamientoSteps,
  // Subtema 16
  "creditos-negocio-tipos": lessonCreditosNegocioTiposSteps,
  "funcionamiento-creditos-negocio": lessonFuncionamientoCreditosNegocioSteps,
  "riesgos-creditos-negocio": lessonRiesgosCreditosNegocioSteps,
  // Subtema 17
  "que-es-resico": lessonQueEsResicoSteps,
  "quien-puede-usarlo": lessonQuienPuedeUsarloSteps,
  "beneficios-resico": lessonBeneficiosResicoSteps,
  // Subtema 18
  "evaluacion-rentabilidad": lessonEvaluacionRentabilidadSteps,
  "evaluacion-crecimiento": lessonEvaluacionCrecimientoSteps,
  "viabilidad-negocio": lessonViabilidadNegocioSteps,
  // Subtema 19
  "seguros-negocio": lessonSegurosNegocioSteps,
  "proteccion-legal": lessonProteccionLegalSteps,
  "manejo-riesgos-negocio": lessonManejoRiesgosNegocioSteps,
  // Subtema 20
  "que-es-reinversion": lessonQueEsReinversionSteps,
  "importancia-reinversion": lessonImportanciaReinversionSteps,
  "estrategias-reinversion": lessonEstrategiasReinversionSteps,
  // Subtema 21
  "analisis-opciones": lessonAnalisisOpcionesSteps,
  "optimizacion-recursos": lessonOptimizacionRecursosSteps,

  // --- TEMA 4: Finanzas Avanzadas (Nuevas) ---
  "crecimiento-escalable": lessonCrecimientoEscalableSteps,
  "inversion-negocio": lessonInversionNegocioSteps,
  "venta-negocio": lessonVentaNegocioSteps,
  "libertad-financiera-negocio": lessonLibertadFinancieraNegocioSteps,

  // --- TEMA 4: Fundamentos de Negocio (Nuevas) ---
  "fundamentos-negocio": lessonFundamentosNegocioSteps,
  "activos-negocio": lessonActivosNegocioSteps,
  "pasivos-negocio": lessonPasivosNegocioSteps,
  "patrimonio-negocio": lessonPatrimonioNegocioSteps,
  "que-es-empresa": lessonQueEsEmpresaSteps,
  "tipos-emprendimiento": lessonTiposEmprendimientoSteps,
  "modelos-negocio": lessonModelosNegocioSteps,
  "propuesta-valor": lessonPropuestaValorSteps,
  "segmentacion-clientes": lessonSegmentacionClientesSteps,
  "canales-venta": lessonCanalesVentaSteps,

  // --- TEMA 5: Tema 5 --- (Si es que hay más)

  "intro-finanzas-empresariales": lessonFundamentosNegocioSteps,
  "evaluacion-de-bloque-3": lessonEvaluacionBloque3Steps,
  "evaluacion-bloque-3": lessonEvaluacionBloque3Steps,
  "evaluacion-bloque-4": lessonEvaluacionBloque4Steps,

  // --- TEMA 4: Optimización de Egresos ---
  "gastos-fijos-vs-variables": lessonGastosFijosVsVariablesSteps,
  "necesidad-vs-deseo": lessonNecesidadVsDeseoSteps,
  "gastos-discrecionales-lo-que-si-eliges": lessonGastosDiscrecionalesLoQueSiEligesSteps,
  "costo-real-gasto-extras": lessonCostoRealGastoExtrasSteps,
  "clasificar-mis-gastos-ejercicio-completo": lessonClasificarMisGastosEjercicioCompletoSteps,
  "auditoria-de-micro-seguros-ocultos": lessonAuditoriaDeMicroSegurosOcultosSteps,
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
  "ahorro-vs-inversion-el-salto-cuantico": lessonAhorroVsInversionSmartSteps,
  "cuentas-de-alto-rendimiento-efectivo-inteligente": lessonCuentasAltoRendimientoSteps,
  "el-costo-de-la-inaccion": lessonCostoInaccionSteps,
  "proteccion-contra-devaluacion": lessonProteccionDevaluacionSteps,
  "examen-maestria-acumulacion": lessonExamenMaestriaAcumulacionSteps,
}

export function getStepsForLesson(lessonId: string | undefined): LessonStep[] {
  if (!lessonId) return []
  return lessonRegistry[lessonId] ?? []
}
