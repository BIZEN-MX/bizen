import type { LessonStep } from "@/types/lessonTypes"

import { lessonQueEsElDineroDeudaVsEnergiaSteps } from "./lesson-que-es-el-dinero-deuda-vs-energia"
import { lessonElValorDeTuTiempoCalculoRealSteps } from "./lesson-el-valor-de-tu-tiempo-calculo-real"
import { lessonCostoDeOportunidadElegirEsRenunciarSteps } from "./lesson-costo-de-oportunidad-elegir-es-renunciar"
import { lessonTuNumeroDeLibertadInicialSteps } from "./lesson-tu-numero-de-libertad-inicial"
import { lessonLasRulesDelSistemaFinancieroSteps } from "./lesson-las-reglas-del-sistema-financiero"

import { lessonSesgoDeComparacionElCostoDeQuedarBienSteps } from "./lesson-sesgo-de-comparacion-el-costo-de-quedar-bien"
import { lessonSesgoDeConfirmacionEnElConsumoSteps } from "./lesson-sesgo-de-confirmacion-en-el-consumo"
import { lessonAversionALaPerdidaVsMiedoACrecerSteps } from "./lesson-aversion-a-la-perdida-vs-miedo-a-crecer"
import { lessonElEfectoDunningKrugerEnTusFinanzasSteps } from "./lesson-el-efecto-dunning-kruger-en-tus-finanzas"
import { lessonCasoRealPlacerDeHoyVsLibertadDeMananaSteps } from "./lesson-caso-real-placer-de-hoy-vs-libertad-de-manana"
import { lessonLaPausaDeLas24HorasMecanicaSteps } from "./lesson-la-pausa-de-las-24-horas-mecanica"
import { lessonElRegistroDeGuerraPorQueTrackearTodoSteps } from "./lesson-el-registro-de-guerra-por-que-trackear-todo"
import { lessonMicroHabitosDeAhorroAutomatizadoSteps } from "./lesson-micro-habitos-de-ahorro-automatizado"
import { lessonElRitualDelDomingoRevisionSemanalSteps } from "./lesson-el-ritual-del-domingo-revision-semanal"
import { lessonTuPrimerEstadoDeResultadosPersonalSteps } from "./lesson-tu-primer-estado-de-resultados-personal"
import { lessonQueEsElDineroParaMiSteps } from "./lesson-que-es-el-dinero-para-mi"
import { lessonComoMeHaceSentirElDineroSteps } from "./lesson-como-me-hace-sentir-el-dinero"
import { lessonMisPrimerasCreenciasSobreElDineroSteps } from "./lesson-mis-primeras-creencias-sobre-el-dinero"
import { lessonExpectativasVsRealidadFinancieraSteps } from "./lesson-expectativas-vs-realidad-financiera"

// Tema 2: Ingeniería del Ingreso
import { 
  lessonPorQueElMercadoPagaLoQuePagaSteps,
  lessonIngresoActivoVsPasivoLaRealidadSteps,
  lessonElTrianguloDelValorSteps,
  lessonIngresoDePortafolioDineroQueGeneraDineroSteps,
  lessonEvaluacionFlujoDeEntradaHoySteps 
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

// Tema 3: Psicología del consumo
import {
  lessonQueEsUnTriggerDeCompraSteps,
  lessonPublicidadComoTeManipulaSteps,
  lessonRedesComparacionYPresionSteps,
  lessonComprasPorAburrimientoVsNecesidadSteps,
  lessonDetectarMisTriggersCasosSteps
} from "./tema3-triggers-compra"

import {
  lessonSenalesDeCompraImpulsivaSteps,
  lessonAntesDePagarChecklistDeDecisionSteps,
  lessonMicroHabitosParaEvitarImpulsosSteps,
  lessonPostCompraCulpaYAprendizajeSteps,
  lessonCasoGastoPorEmocionPasoAPasoSteps
} from "./tema3-compras-impulsivas"

// Refresh build cache
import {
  lessonComprarPorEstatusVsPorValorSteps,
  lessonAparienciaDeRiquezaVsRiquezaRealSteps,
  lessonPresionSocialEnDecisionesEscenariosSteps,
  lessonNoEstatusSteps,
  lessonReglaPersonalAntiEstatusSteps
} from "./tema3-estatus-presion"


/**
 * Maps lesson ID to steps. Add entries when you add lesson content.
 * Lesson ID should match the slug used in course tema data.
 */
export const lessonRegistry: Record<string, LessonStep[]> = {
  "que-es-el-dinero-deuda-vs-energia": lessonQueEsElDineroDeudaVsEnergiaSteps,
  "el-valor-de-tu-tiempo-calculo-real": lessonElValorDeTuTiempoCalculoRealSteps,
  "costo-de-oportunidad-elegir-es-renunciar": lessonCostoDeOportunidadElegirEsRenunciarSteps,
  "tu-numero-de-libertad-inicial": lessonTuNumeroDeLibertadInicialSteps,
  "las-reglas-del-sistema-financiero": lessonLasRulesDelSistemaFinancieroSteps,
  "sesgo-de-comparacion-el-costo-de-quedar-bien": lessonSesgoDeComparacionElCostoDeQuedarBienSteps,
  "sesgo-de-confirmacion-en-el-consumo": lessonSesgoDeConfirmacionEnElConsumoSteps,
  "aversion-a-la-perdida-vs-miedo-a-crecer": lessonAversionALaPerdidaVsMiedoACrecerSteps,
  "el-efecto-dunning-kruger-en-tus-finanzas": lessonElEfectoDunningKrugerEnTusFinanzasSteps,
  "caso-real-placer-de-hoy-vs-libertad-de-manana": lessonCasoRealPlacerDeHoyVsLibertadDeMananaSteps,
  "la-pausa-de-las-24-horas-mecanica": lessonLaPausaDeLas24HorasMecanicaSteps,
  "el-registro-de-guerra-por-que-trackear-todo": lessonElRegistroDeGuerraPorQueTrackearTodoSteps,
  "micro-habitos-de-ahorro-automatizado": lessonMicroHabitosDeAhorroAutomatizadoSteps,
  "el-ritual-del-domingo-revision-semanal": lessonElRitualDelDomingoRevisionSemanalSteps,
  "tu-primer-estado-de-resultados-personal": lessonTuPrimerEstadoDeResultadosPersonalSteps,

  // Tema 1: Relación con el dinero (Nuevos Slugs)
  "que-es-el-dinero-para-mi": lessonQueEsElDineroParaMiSteps,
  "como-me-hace-sentir-el-dinero": lessonComoMeHaceSentirElDineroSteps,
  "mis-primeras-creencias-sobre-el-dinero": lessonMisPrimerasCreenciasSobreElDineroSteps,
  "expectativas-vs-realidad-financiera": lessonExpectativasVsRealidadFinancieraSteps,

  // Tema 2
  "por-que-el-mercado-paga-lo-que-paga": lessonPorQueElMercadoPagaLoQuePagaSteps,
  "ingreso-activo-vs-pasivo-la-realidad": lessonIngresoActivoVsPasivoLaRealidadSteps,
  "el-triangulo-del-valor-habilidad-escala-rareza": lessonElTrianguloDelValorSteps,
  "ingreso-de-portafolio-dinero-que-genera-dinero": lessonIngresoDePortafolioDineroQueGeneraDineroSteps,
  "evaluacion-como-se-ve-tu-flujo-de-entrada-hoy": lessonEvaluacionFlujoDeEntradaHoySteps,
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

  // Tema 3
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
}

/** Get steps for a lesson ID. Returns empty array if none. */
export function getStepsForLesson(lessonId: string | undefined): LessonStep[] {
  if (!lessonId) return []
  return lessonRegistry[lessonId] ?? []
}
