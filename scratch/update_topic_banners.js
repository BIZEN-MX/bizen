const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const updates = [
    {
      id: 'tema-01',
      bannerUrl: '/courses-banners/economia.png'
    },
    {
      id: 'tema-02',
      bannerUrl: '/courses-banners/finanzas-personales.png'
    },
    {
      id: 'tema-03',
      bannerUrl: '/courses-banners/finanzas-bursatiles.png'
    },
    {
      id: 'tema-04',
      bannerUrl: '/courses-banners/finanzas-negocio.png'
    }
  ];

  for (const update of updates) {
    try {
      console.log(`Updating topic ${update.id} with banner: ${update.bannerUrl}`);
      await prisma.topic.update({
        where: { id: update.id },
        data: { bannerUrl: update.bannerUrl }
      });
      console.log(`✅ Topic ${update.id} updated.`);
    } catch (e) {
      console.log(`⚠️ Error updating topic ${update.id}: ${e.message}`);
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
