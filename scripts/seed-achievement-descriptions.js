/**
 * BIZEN — Seed Achievement Descriptions
 * run: node scripts/seed-achievement-descriptions.js
 */
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

// Descriptions indexed by exact title (most reliable match)
const DESCRIPTIONS_BY_TITLE = {
  // ── Aprendizaje (learning / lesson) ──────────────────────────────────────
  "Primeros Pasos":        "Completa tu primera lección en BIZEN. ¡El primer paso siempre es el más valioso!",
  "Primer Paso":           "Completa tu primera lección en BIZEN. ¡El primer paso siempre es el más valioso!",
  "Estudiante":            "Completa al menos una lección. Tú que empiezas hoy, superas a quien nunca intentó.",
  "Dedicado":              "Sigue completando lecciones de forma consistente para demostrar tu dedicación.",
  "Experto":               "Completa 10 o más lecciones. Tu conocimiento financiero está creciendo rápidamente.",
  "Maestro BIZEN":         "Completa 25 o más lecciones. Estás en el top de los usuarios más comprometidos.",
  "Estudiante Constante":  "Completa 5 lecciones. Estás construyendo el hábito más poderoso: aprender a diario.",
  "Erudito Financiero":    "Completa 10 lecciones en BIZEN. ¡Ya eres un estudiante serio del dinero!",
  "Maestro del Dinero":    "Completa 25 lecciones. Tu dedicación te pone por encima del 90% de los usuarios BIZEN.",

  // ── Rachas (streak) ───────────────────────────────────────────────────────
  "Racha Inicial":             "Mantén 3 días seguidos de actividad. Consejo: pon una alarma diaria para no olvidarlo.",
  "Fuego Interior":            "Mantén 7 días consecutivos activo. ¡Una semana completa aprendiendo!",
  "Imparable":                 "Mantén 14 días de racha sin interrupciones. La constancia es tu superpoder.",
  "Leyenda de la Constancia":  "Mantén 30 días seguidos activo en BIZEN. Solo los más disciplinados llegan aquí.",
  "Leyenda":                   "Alcanza el logro máximo de racha. Eres una verdadera leyenda de la constancia.",

  // ── Nivel (level) ─────────────────────────────────────────────────────────
  "Nivel 5":   "Alcanza el Nivel 5 acumulando XP. Completa lecciones, ejercicios y retos diarios para subir.",
  "Nivel 10":  "Alcanza el Nivel 10. Estás en la cima — muy pocos usuarios llegan hasta aquí.",

  // ── Monedas (coins) ───────────────────────────────────────────────────────
  "Inversor":   "Acumula Bizcoins completando lecciones y actividades. Úsalos para comprar artículos en la tienda.",
  "Ahorrador":  "Demuestra que sabes acumular: gana Bizcoins sin gastarlos todos de inmediato. ¡El ahorro paga!",

  // ── Cursos (course) ───────────────────────────────────────────────────────
  "Primer Curso":       "Completa tu primer curso completo en BIZEN. ¡Es el inicio de un gran camino!",
  "Especialista":       "Completa 3 cursos en BIZEN. Ya tienes una visión integral de las finanzas personales.",
  "Gurú Financiero":    "Completa 5 cursos. Eres un gurú: dominas ahorro, inversión, crédito y más.",

  // ── Retos diarios (reto) ──────────────────────────────────────────────────
  "Primer Reto":        "Completa tu primer Reto Diario. Cada reto te da XP extra y mantiene tu mente activa.",
  "Cazador de Retos":   "Completa 7 retos diarios. ¡Tienes una disciplina envidiable!",
  "Maestro de Retos":   "Completa 30 retos diarios en total. Eres el maestro de la consistencia.",

  // ── Social / Comunidad ────────────────────────────────────────────────────
  "Pionero":             "Crea tu primera publicación en el foro y empieza a conectar con la comunidad BIZEN.",
  "Voz de la Comunidad": "Participa activamente en el foro con 5 o más publicaciones. Tu perspectiva importa.",
  "Líder de Opinión":    "Crea 20 publicaciones en el foro. Eres un referente y pilar de la comunidad BIZEN.",

  // ── Tienda (store) ────────────────────────────────────────────────────────
  "Cazador de Ofertas":  "Realiza tu primera compra en la tienda BIZEN usando tus Bizcoins. ¡Mereces recompensas!",
  "Coleccionista VIP":   "Acumula 5 artículos en tu inventario. Eres un verdadero coleccionista BIZEN.",

  // ── Financiero / Cashflow ─────────────────────────────────────────────────
  "Rey del Cashflow":    "Domina el simulador de flujo de caja y demuestra que entiendes cómo fluye el dinero real.",

  // ── Consistencia general ──────────────────────────────────────────────────
  "Imparable":           "Demuestra que nada te detiene: sé activo 14 días consecutivos en BIZEN.",
}

async function main() {
  console.log("🏆 Seeding achievement descriptions...")

  const all = await prisma.$queryRawUnsafe(
    `SELECT id, title, category, threshold FROM public.achievements ORDER BY category, threshold`
  )

  console.log(`Found ${all.length} achievements in DB\n`)

  let updated = 0
  let skipped = 0

  for (const achievement of all) {
    const desc = DESCRIPTIONS_BY_TITLE[achievement.title]
    if (!desc) {
      console.log(`  ⚠️  No description for: "${achievement.title}" (${achievement.category}/${achievement.threshold})`)
      skipped++
      continue
    }

    await prisma.$executeRawUnsafe(
      `UPDATE public.achievements SET description = $1 WHERE id = $2`,
      desc,
      achievement.id
    )
    console.log(`  ✅  "${achievement.title}"`)
    updated++
  }

  // Fallback for any still-empty
  await prisma.$executeRawUnsafe(
    `UPDATE public.achievements 
     SET description = 'Sigue usando BIZEN regularmente para desbloquear este logro.'
     WHERE description IS NULL OR description = ''`
  )

  console.log(`\n✨ Done: ${updated} updated, ${skipped} skipped.`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
