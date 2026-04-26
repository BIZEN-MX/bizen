import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const SYSTEM_CONFIG_ID = "GLOBAL_CONFIG_SYSTEM"
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: SYSTEM_CONFIG_ID }
    });

    const currentSettings = (profile?.settings as any) || {};
    
    await prisma.profile.upsert({
      where: { userId: SYSTEM_CONFIG_ID },
      update: { 
        settings: { 
          ...currentSettings,
          maintenanceMode: false 
        } 
      },
      create: {
        userId: SYSTEM_CONFIG_ID,
        fullName: "System General Config",
        role: "system",
        settings: { maintenanceMode: false }
      }
    })
    console.log("✅ MANTENIMIENTO DESACTIVADO");
  } catch (e) {
    console.error("❌ ERROR:", e);
  } finally {
    await prisma.$disconnect()
  }
}

main()
