import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding achievements...');

  const achievements = [
    {
      title: "Primer Paso",
      description: "Completaste tu primera lección",
      icon: "zap",
      category: "learning",
      threshold: 1,
      xpReward: 100,
      rarity: "común"
    },
    {
      title: "Racha imparable",
      description: "Mantén una racha de 7 días",
      icon: "flame",
      category: "streak",
      threshold: 7,
      xpReward: 500,
      rarity: "raro"
    },
    {
      title: "Maestro del Ahorro",
      description: "Crea tu primer objetivo de ahorro",
      icon: "award",
      category: "wallet",
      threshold: 1,
      xpReward: 300,
      rarity: "épico"
    },
    {
      title: "Inversionista Junior",
      description: "Realiza tu primer stake de Bizcoins",
      icon: "star",
      category: "finance",
      threshold: 1,
      xpReward: 1000,
      rarity: "legendario"
    },
    {
      title: "Comunidad BIZEN",
      description: "Sigue a 5 compañeros",
      icon: "shield",
      category: "social",
      threshold: 5,
      xpReward: 200,
      rarity: "raro"
    }
  ];

  for (const ach of achievements) {
    await prisma.achievement.upsert({
      where: { id: ach.title.toLowerCase().replace(/ /g, '-') },
      update: ach,
      create: {
        id: ach.title.toLowerCase().replace(/ /g, '-'),
        ...ach
      }
    });
  }

  console.log('✅ Achievements seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
