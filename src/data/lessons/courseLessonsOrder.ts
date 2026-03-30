/**
 * Ordered lesson slugs per course (course number 1–30).
 * Used to redirect to the next lesson when completing a lesson.
 */
import { TEMA1_SUBTEMAS } from "@/app/courses/tema1-data"
import { TEMA2_SUBTEMAS } from "@/app/courses/tema2-data"
import { TEMA3_SUBTEMAS } from "@/app/courses/tema3-data"
import { TEMA4_SUBTEMAS } from "@/app/courses/tema4-data"
import { TEMA5_SUBTEMAS } from "@/app/courses/tema5-data"
import { TEMA6_SUBTEMAS } from "@/app/courses/tema6-data"
import { TEMA7_SUBTEMAS } from "@/app/courses/tema7-data"
import { TEMA8_SUBTEMAS } from "@/app/courses/tema8-data"
import { TEMA9_SUBTEMAS } from "@/app/courses/tema9-data"
import { TEMA10_SUBTEMAS } from "@/app/courses/tema10-data"
import { TEMA11_SUBTEMAS } from "@/app/courses/tema11-data"
import { TEMA12_SUBTEMAS } from "@/app/courses/tema12-data"
import { TEMA13_SUBTEMAS } from "@/app/courses/tema13-data"
import { TEMA14_SUBTEMAS } from "@/app/courses/tema14-data"
import { TEMA15_SUBTEMAS } from "@/app/courses/tema15-data"
import { TEMA16_SUBTEMAS } from "@/app/courses/tema16-data"
import { TEMA17_SUBTEMAS } from "@/app/courses/tema17-data"
import { TEMA18_SUBTEMAS } from "@/app/courses/tema18-data"
import { TEMA19_SUBTEMAS } from "@/app/courses/tema19-data"
import { TEMA20_SUBTEMAS } from "@/app/courses/tema20-data"
import { TEMA21_SUBTEMAS } from "@/app/courses/tema21-data"
import { TEMA22_SUBTEMAS } from "@/app/courses/tema22-data"
import { TEMA23_SUBTEMAS } from "@/app/courses/tema23-data"
import { TEMA24_SUBTEMAS } from "@/app/courses/tema24-data"
import { TEMA25_SUBTEMAS } from "@/app/courses/tema25-data"
import { TEMA26_SUBTEMAS } from "@/app/courses/tema26-data"
import { TEMA27_SUBTEMAS } from "@/app/courses/tema27-data"
import { TEMA28_SUBTEMAS } from "@/app/courses/tema28-data"
import { TEMA29_SUBTEMAS } from "@/app/courses/tema29-data"
import { TEMA30_SUBTEMAS } from "@/app/courses/tema30-data"

export const TOPIC_TITLES = [
  "Operativo BIZEN: El Sistema Financiero",
  "Ingeniería del ingreso",
  "Psicología & Hacks de Comportamiento",
  "Optimización de Egresos",
  "Ahorro Inteligente: Ingeniería de Acumulación",
  "Presupuesto personal",
  "Hábitos financieros",
  "Ahorro",
  "Metas financieras",
  "Planeación financiera (básica)",
  "Sistema financiero básico",
  "Crédito y tarjetas",
  "Historial crediticio",
  "Deuda",
  "Intereses",
  "Protección financiera (seguros)",
  "Impuestos básicos",
  "Fraudes y seguridad financiera",
  "Educación financiera digital",
  "Inflación",
  "Activos vs pasivos",
  "Ingresos y generación de dinero",
  "Ingresos pasivos",
  "Inversión básica",
  "Riesgo financiero",
  "Diversificación",
  "Construcción de patrimonio",
  "Estrategia financiera personal",
  "Libertad financiera",
  "Emprendimiento financiero",
]

export const SUBTEMAS_BY_COURSE: { lessons: { slug: string }[] }[][] = [
  TEMA1_SUBTEMAS,
  TEMA2_SUBTEMAS,
  TEMA3_SUBTEMAS,
  TEMA4_SUBTEMAS,
  TEMA5_SUBTEMAS,
  TEMA6_SUBTEMAS,
  TEMA7_SUBTEMAS,
  TEMA8_SUBTEMAS,
  TEMA9_SUBTEMAS,
  TEMA10_SUBTEMAS,
  TEMA11_SUBTEMAS,
  TEMA12_SUBTEMAS,
  TEMA13_SUBTEMAS,
  TEMA14_SUBTEMAS,
  TEMA15_SUBTEMAS,
  TEMA16_SUBTEMAS,
  TEMA17_SUBTEMAS,
  TEMA18_SUBTEMAS,
  TEMA19_SUBTEMAS,
  TEMA20_SUBTEMAS,
  TEMA21_SUBTEMAS,
  TEMA22_SUBTEMAS,
  TEMA23_SUBTEMAS,
  TEMA24_SUBTEMAS,
  TEMA25_SUBTEMAS,
  TEMA26_SUBTEMAS,
  TEMA27_SUBTEMAS,
  TEMA28_SUBTEMAS,
  TEMA29_SUBTEMAS,
  TEMA30_SUBTEMAS,
]

function getOrderedSlugsForCourse(courseNum: number): string[] {
  const oneBased = Math.max(1, Math.min(30, courseNum))
  const subtemas = SUBTEMAS_BY_COURSE[oneBased - 1]
  if (!subtemas) return []
  return subtemas.flatMap((s) => s.lessons.map((l) => l.slug))
}

/** Normalize courseId from URL (e.g. "course-1" or "1") to number 1–30. */
function courseIdToNumber(courseId: string): number {
  const s = String(courseId || "").trim()
  const match = s.match(/^course-(\d+)$/) || s.match(/^(\d+)$/)
  if (match) return Math.max(1, Math.min(30, parseInt(match[1], 10)))
  return 1
}

/**
 * Returns the next lesson slug in the same course/unit, or null if current is last or not found.
 */
export function getNextLessonSlug(
  courseId: string,
  _unitId: string,
  currentLessonId: string
): string | null {
  const courseNum = courseIdToNumber(courseId)
  const slugs = getOrderedSlugsForCourse(courseNum)
  const idx = slugs.indexOf(currentLessonId)
  if (idx === -1 || idx >= slugs.length - 1) return null
  return slugs[idx + 1] ?? null
}
