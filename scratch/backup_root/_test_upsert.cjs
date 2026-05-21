const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const userId = "test_user_for_onboarding";
  const trimmedUser = "testuser";
  const safeFullName = "Test User";
  const safeBio = "Bio";
  const parsedBirthDate = new Date("2000-01-01");
  const schoolId = null;
  const safeAvatar = "Sin Diagnosticar";

  try {
    const result = await prisma.profile.upsert({
      where: { userId },
      update: {
          nickname: trimmedUser,
          fullName: safeFullName,
          bio: safeBio,
          birthDate: parsedBirthDate,
          schoolId: schoolId || null,
          dnaProfile: safeAvatar
      },
      create: {
          userId,
          fullName: safeFullName,
          nickname: trimmedUser,
          xp: 0,
          bizcoins: 0,
          role: 'particular',
          bio: safeBio,
          birthDate: parsedBirthDate,
          schoolId: schoolId || null,
          dnaProfile: safeAvatar
      }
    });
    console.log("SUCCESS:", result.userId);
  } catch (dbError) {
    console.error("DB FAILED:", dbError.message);
  } finally {
    await prisma.$disconnect();
  }
}

run();
