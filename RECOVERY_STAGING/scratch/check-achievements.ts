import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const achievements = await prisma.achievement.findMany({
      orderBy: { id: 'asc' }
    });
    
    console.log('--- LOGROS EN LA BASE DE DATOS ---');
    if (achievements.length === 0) {
      console.log('La tabla está VACÍA.');
    } else {
      achievements.forEach(a => {
        console.log(`[${a.rarity.toUpperCase()}] ${a.title}: ${a.description} (XP: ${a.xpReward})`);
      });
    }
  } catch (error) {
    console.error('Error al consultar:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
