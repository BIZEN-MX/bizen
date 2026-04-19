import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const achievements = [
  // --- 📚 APRENDIZAJE (10) ---
  { id: 'app_start', title: 'Primer Paso', description: 'Iniciaste tu camino en Bizen', rarity: 'común', xpReward: 10, icon: 'Flag' },
  { id: 'first_lesson', title: 'Explorador Novato', description: 'Completaste tu primera lección', rarity: 'común', xpReward: 15, icon: 'Map' },
  { id: 'course_master_1', title: 'Graduado BIZEN', description: 'Completaste tu primer curso completo', rarity: 'épico', xpReward: 100, icon: 'GraduationCap' },
  { id: 'module_complete', title: 'Cerebro Financiero', description: 'Terminaste un módulo completo sin errores', rarity: 'poco común', xpReward: 30, icon: 'Brain' },
  { id: 'quiz_hero', title: 'Mente Brillante', description: 'Obtuviste 100% en 5 exámenes seguidos', rarity: 'raro', xpReward: 50, icon: 'Lightbulb' },
  { id: 'night_owl', title: 'Búho Financiero', description: 'Completaste una lección después de medianoche', rarity: 'poco común', xpReward: 25, icon: 'Moon' },
  { id: 'bibliotecario', title: 'Ratón de Biblioteca', description: 'Leíste 10 temas educativos opcionales', rarity: 'poco común', xpReward: 20, icon: 'Book' },
  { id: 'fast_learner', title: 'Velocidad de la Luz', description: 'Completaste un curso en menos de 24 horas', rarity: 'raro', xpReward: 40, icon: 'Zap' },
  { id: 'perfeccionista', title: 'Perfeccionista', description: 'Repetiste una lección para obtener el puntaje máximo', rarity: 'común', xpReward: 10, icon: 'RotateCcw' },
  { id: 'enciclopedia_viviente', title: 'Enciclopedia Viviente', description: 'Desbloqueaste todos los términos del glosario', rarity: 'legendario', xpReward: 250, icon: 'Library' },

  // --- 📈 INVERSIONISTA / BIZEN MARKET (10) ---
  { id: 'first_trade', title: 'Lobo de Bizen', description: 'Realizaste tu primera inversión en el Market', rarity: 'común', xpReward: 20, icon: 'TrendingUp' },
  { id: 'profit_10', title: 'Primeras Ganancias', description: 'Obtuviste un 10% de retorno en una acción', rarity: 'poco común', xpReward: 30, icon: 'ArrowUpRight' },
  { id: 'buy_the_dip', title: 'Caza-Ofertas', description: 'Compraste una acción después de que bajara un 5%', rarity: 'poco común', xpReward: 25, icon: 'Target' },
  { id: 'diversificado', title: 'Inversionista Inteligente', description: 'Tuviste 5 acciones de diferentes sectores a la vez', rarity: 'raro', xpReward: 45, icon: 'PieChart' },
  { id: 'etf_fan', title: 'Visión de Largo Plazo', description: 'Invertiste en tu primer ETF (VOO o SPY)', rarity: 'común', xpReward: 20, icon: 'ShieldPath' },
  { id: 'market_expert', title: 'Analista Senior', description: 'Analizaste 10 gráficas diferentes en un día', rarity: 'poco común', xpReward: 20, icon: 'LineChart' },
  { id: 'big_win', title: 'Jackpot Financiero', description: 'Ganaste más de 5,000 Bizcoins en una sola operación', rarity: 'épico', xpReward: 120, icon: 'Coins' },
  { id: 'hodl', title: 'Manos de Diamante', description: 'Mantuviste una acción por más de 7 días', rarity: 'raro', xpReward: 60, icon: 'Gem' },
  { id: 'whaler', title: 'Ballena de Bizen', description: 'Tu portafolio superó los 50,000 Bizcoins', rarity: 'épico', xpReward: 150, icon: 'Waves' },
  { id: 'market_legend', title: 'Leyenda de Wall Street', description: 'Llegaste al puesto #1 del ranking global de inversión', rarity: 'legendario', xpReward: 500, icon: 'Crown' },

  // --- 💰 HÁBITOS Y AHORRO (10) ---
  { id: 'budget_first', title: 'Maestro del Orden', description: 'Creaste tu primer presupuesto personal', rarity: 'poco común', xpReward: 30, icon: 'ListChecks' },
  { id: 'saving_streak_1', title: 'Ahorrador Constante', description: 'Ahorraste Bizcoins durante 3 semanas seguidas', rarity: 'raro', xpReward: 55, icon: 'PiggyBank' },
  { id: 'emergency_fund', title: 'Muro de Contención', description: 'Creaste un fondo de emergencia virtual', rarity: 'raro', xpReward: 40, icon: 'ShieldCheck' },
  { id: 'no_debt', title: 'Libre de Deudas', description: 'Pagaste todos tus pasivos en el juego de Cashflow', rarity: 'épico', xpReward: 80, icon: 'Unlock' },
  { id: 'smart_spender', title: 'Comprador Consciente', description: 'Evitaste una compra impulsiva en el simulador', rarity: 'común', xpReward: 15, icon: 'ShoppingBag' },
  { id: 'interest_wizard', title: 'Mago del Interés Compuesto', description: 'Calculaste el crecimiento de una inversión a 10 años', rarity: 'raro', xpReward: 40, icon: 'Wand2' },
  { id: 'wealth_builder', title: 'Constructor de Riqueza', description: 'Tuviste activos que superaron a tus pasivos', rarity: 'poco común', xpReward: 35, icon: 'Building' },
  { id: 'financial_health', title: 'Salud Financiera', description: 'Mantuviste tus gastos por debajo del 50% de tus ingresos', rarity: 'épico', xpReward: 90, icon: 'HeartPulse' },
  { id: 'tax_payer', title: 'Ciudadano Responsable', description: 'Aprendiste cómo funcionan los impuestos en el simulador', rarity: 'común', xpReward: 15, icon: 'Building2' },
  { id: 'financial_freedom', title: 'Independencia Total', description: 'Tus ingresos pasivos cubren tus gastos totales', rarity: 'legendario', xpReward: 400, icon: 'Key' },

  // --- 🤝 COMUNIDAD Y SOCIAL (10) ---
  { id: 'first_comment', title: 'Pionero del Foro', description: 'Publicaste tu primer comentario en la comunidad', rarity: 'común', xpReward: 15, icon: 'MessageCircle' },
  { id: 'helpful_bizen', title: 'Mano Amiga', description: 'Recibiste 5 "me gusta" en un consejo financiero', rarity: 'poco común', xpReward: 30, icon: 'Heart' },
  { id: 'discussion_starter', title: 'Líder de Opinión', description: 'Iniciaste un debate con más de 10 respuestas', rarity: 'raro', xpReward: 50, icon: 'Megaphone' },
  { id: 'transfer_king', title: 'Corazón de Oro', description: 'Transferiste Bizcoins a un amigo por primera vez', rarity: 'común', xpReward: 10, icon: 'Send' },
  { id: 'mentor', title: 'Mentor BIZEN', description: 'Ayudaste a un nuevo usuario con una duda financiera', rarity: 'épico', xpReward: 100, icon: 'Stethoscope' },
  { id: 'social_star', title: 'Estrella Social', description: 'Tu perfil tiene más de 20 seguidores', rarity: 'raro', xpReward: 60, icon: 'Star' },
  { id: 'collaborator', title: 'Colaborador', description: 'Participaste en un reto grupal de ahorro', rarity: 'poco común', xpReward: 25, icon: 'Users' },
  { id: 'influencer', title: 'Voz Autorizada', description: 'Tu post fue destacado por un administrador', rarity: 'épico', xpReward: 150, icon: 'ShieldAlert' },
  { id: 'gift_giver', title: 'Generosidad', description: 'Regalaste un item de la tienda a otro usuario', rarity: 'poco común', xpReward: 30, icon: 'Gift' },
  { id: 'community_legend', title: 'Embajador BIZEN', description: 'Eres el usuario más activo de la comunidad este mes', rarity: 'legendario', xpReward: 350, icon: 'Medal' },

  // --- 🔥 DISCIPLINA Y RETOS (10) ---
  { id: 'streak_3', title: 'Fuego Inicial', description: 'Mantuviste una racha de 3 días aprendiendo', rarity: 'común', xpReward: 20, icon: 'Flame' },
  { id: 'streak_7', title: 'Hábito Formado', description: 'Llegaste a una racha de 7 días seguidos', rarity: 'poco común', xpReward: 40, icon: 'Calendar' },
  { id: 'streak_30', title: 'Disciplina de Hierro', description: '¡Racha de 30 días! No te detienes ante nada', rarity: 'épico', xpReward: 200, icon: 'Anchor' },
  { id: 'early_bird', title: 'A quien madruga...', description: 'Entraste a Bizen antes de las 7:00 AM', rarity: 'poco común', xpReward: 25, icon: 'Sunrise' },
  { id: 'weekend_warrior', title: 'Guerrero del finde', description: 'Estudiaste sábado y domingo seguidos', rarity: 'raro', xpReward: 45, icon: 'Sword' },
  { id: 'level_10', title: 'Nivel Diez', description: 'Alcanzaste el nivel 10 de experiencia', rarity: 'poco común', xpReward: 50, icon: 'Award' },
  { id: 'level_50', title: 'Veterano BIZEN', description: 'Alcanzaste el nivel 50', rarity: 'épico', xpReward: 200, icon: 'Trophy' },
  { id: 'achievement_hunter', title: 'Cazador de Logros', description: 'Desbloqueaste 20 logros diferentes', rarity: 'raro', xpReward: 80, icon: 'Search' },
  { id: 'perseverance', title: 'Resiliencia', description: 'Regresaste a Bizen después de una semana de racha perdida', rarity: 'común', xpReward: 15, icon: 'RefreshCw' },
  { id: 'bizen_god', title: 'Omnisciente Financiero', description: '¡Desbloqueaste el 100% de los logros de BIZEN!', rarity: 'legendario', xpReward: 1000, icon: 'Sparkles' },
]

async function main() {
  console.log('🚀 Iniciando carga masiva de logros (50 total)...')
  
  for (const ach of achievements) {
    await prisma.achievement.upsert({
      where: { id: ach.id },
      update: {
        title: ach.title,
        description: ach.description,
        rarity: ach.rarity,
        xpReward: ach.xpReward,
        icon: ach.icon
      },
      create: ach
    })
  }

  console.log('✨ ¡Éxito! 50 logros cargados correctamente.')
}

main()
  .catch((e) => {
    console.error('❌ Error al cargar logros:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
