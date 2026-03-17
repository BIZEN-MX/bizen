
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const challenges = [
  {
    title: "Gasto Fantasma 24h",
    description: "Durante todo el día, registra cada gasto (aunque sea $5). Al final, clasifica cada uno como Necesario o Antojo. Objetivo: Detectar fugas de dinero.",
    challengeType: "task",
    xpReward: 50,
    estimatedTime: "5 min",
    expertAdvice: "A veces lo que más drena tu cartera no son los grandes gastos, sino los pequeños que no notas.",
    benefits: ["Consciencia financiera", "Control de impulsos"],
    payload: { type: "gastos_lista", min_items: 5 }
  },
  {
    title: "Regla de los 10 minutos",
    description: "Si sientes el impulso de comprar un antojo, detente. Pon un temporizador de 10 minutos. Si después de ese tiempo aún lo quieres, cómpralo; si no, habrás vencido un impulso.",
    challengeType: "task",
    xpReward: 50,
    estimatedTime: "10 min",
    expertAdvice: "La dopamina del cerebro dura poco. Al esperar 10 minutos, permites que tu parte racional retome el control.",
    benefits: ["Ahorro inmediato", "Disciplina"],
    payload: { type: "timer_check" }
  },
  {
    title: "Caza el gasto hormiga",
    description: "Identifica un gasto pequeño repetitivo (café, snacks, apps) y elíminalo por hoy. Registra cuánto evitaste gastar.",
    challengeType: "task",
    xpReward: 50,
    estimatedTime: "5 min",
    expertAdvice: "Un café de $50 al día son $1,500 al mes. ¡Ese es el poder del gasto hormiga!",
    benefits: ["Ahorro acumulado", "Identificación de patrones"],
    payload: { type: "hormiga_kill" }
  },
  {
    title: "Comparación rápida (2 precios)",
    description: "Antes de comprar algo hoy, busca el precio en 2 lugares diferentes (Tienda A vs B o Online vs Físico). Elige la mejor opción.",
    challengeType: "task",
    xpReward: 50,
    estimatedTime: "8 min",
    expertAdvice: "Comparar no es ser tacaño, es ser inteligente. El dinero que ahorras comparando es dinero que puedes invertir.",
    benefits: ["Criterio de compra", "Mejores tratos"],
    payload: { type: "comparison" }
  },
  {
    title: "Tope de gasto diario",
    description: "Define un monto máximo para gastar HOY (ej. $100). Registra tus gastos y confirma si lograste no pasarte.",
    challengeType: "task",
    xpReward: 50,
    estimatedTime: "5 min",
    expertAdvice: "Ponerte límites te obliga a priorizar lo que realmente importa.",
    benefits: ["Presupuesto a micro-escala", "Autocontrol"],
    payload: { type: "daily_limit" }
  },
  {
    title: "Ahorro primero",
    description: "Antes de realizar cualquier gasto hoy, separa una cantidad fija ($10, $20 o $50) para tu ahorro. No la toques hoy.",
    challengeType: "task",
    xpReward: 50,
    estimatedTime: "2 min",
    expertAdvice: "Págate a ti primero. Si esperas a fin de mes para ahorrar lo que sobre, nunca sobrará nada.",
    benefits: ["Hábito de ahorro", "Seguridad financiera"],
    payload: { type: "save_first" }
  },
  {
    title: "Costo semanal de un hábito",
    description: "Elige un hábito que te cueste dinero (ej. refresco diario). Multiplica su costo por 7 y registra el impacto semanal.",
    challengeType: "task",
    xpReward: 50,
    estimatedTime: "3 min",
    expertAdvice: "Ver el costo anual o semanal de un vicio suele ser el choque de realidad necesario para cambiarlo.",
    benefits: ["Visión a largo plazo", "Claridad numérica"],
    payload: { type: "habit_cost" }
  },
  {
    title: "Necesidad vs deseo (3 decisiones)",
    description: "En tus próximas 3 decisiones de compra, clasifica cada una: ¿Es Necesidad, Deseo o Impulso? Registra el monto de cada una.",
    challengeType: "task",
    xpReward: 50,
    estimatedTime: "5 min",
    expertAdvice: "Aprender a distinguir estas tres categorías es la base de la riqueza.",
    benefits: ["Clasificación mental", "Gasto consciente"],
    payload: { type: "need_vs_desire" }
  },
  {
    title: "Día sin compras impulsivas",
    description: "Hoy es un día de 'Cero Impulsos'. Si vas a comprar algo no planeado, debes esperar al menos 10 minutos. Registra cuántos impulsos evitaste.",
    challengeType: "task",
    xpReward: 50,
    estimatedTime: "Todo el día",
    expertAdvice: "La paz mental de no haber gastado en tonterías es mejor que cualquier objeto que compres por impulso.",
    benefits: ["Paz mental", "Ahorro"],
    payload: { type: "no_impulses" }
  },
  {
    title: "Meta express 7 días (Día 1)",
    description: "Define una meta de ahorro pequeña para una semana (ej. $140). Divide entre 7 y hoy separa el primer día.",
    challengeType: "task",
    xpReward: 50,
    estimatedTime: "5 min",
    expertAdvice: "Las grandes metas se logran con pasos pequeños pero constantes.",
    benefits: ["Visión de metas", "Ritmo de ahorro"],
    payload: { type: "meta_express" }
  }
]

async function main() {
  console.log('Seed: Iniciando siembra de retos diarios...')

  // Obtener fecha de hoy en CDMX sin tiempo
  const now = new Date();
  // Ajustar a medianoche UTC para evitar problemas de desfase en la DB (Prisma usa Date @db.Date)
  // Pero lo ideal es usar la lógica de CDMX
  
  for (let i = 0; i < challenges.length; i++) {
    const activeDate = new Date();
    activeDate.setDate(now.getDate() + i);
    activeDate.setHours(0, 0, 0, 0);

    const ch = challenges[i];

    await prisma.dailyChallenge.upsert({
      where: { activeDate },
      update: {
        title: ch.title,
        description: ch.description,
        challengeType: ch.challengeType,
        xpReward: ch.xpReward,
        estimatedTime: ch.estimatedTime,
        expertAdvice: ch.expertAdvice,
        benefits: ch.benefits as any,
        payload: ch.payload as any,
      },
      create: {
        title: ch.title,
        description: ch.description,
        challengeType: ch.challengeType,
        activeDate,
        xpReward: ch.xpReward,
        estimatedTime: ch.estimatedTime,
        expertAdvice: ch.expertAdvice,
        benefits: ch.benefits as any,
        payload: ch.payload as any,
      }
    })
    console.log(`Seed: Reto "${ch.title}" agendado para ${activeDate.toISOString().split('T')[0]}`)
  }

  console.log('Seed: ¡Retos sembrados con éxito!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
