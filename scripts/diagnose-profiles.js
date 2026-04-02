const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkPhantoms() {
  console.log("🔍 Analizando perfiles en la base de datos...");
  
  try {
    const totalProfiles = await prisma.profile.count();
    console.log(`📊 Total de perfiles encontrados: ${totalProfiles}`);

    // 1. Buscar perfiles con nombres genéricos o incompletos
    const genericProfiles = await prisma.profile.findMany({
      where: {
        OR: [
          { fullName: { equals: 'Usuario' } },
          { fullName: { equals: 'Estudiante' } },
          { fullName: { equals: '' } },
          { fullName: { equals: 'null' } }
        ]
      },
      select: { userId: true, fullName: true, createdAt: true, xp: true, role: true }
    });

    console.log(`👻 Perfiles con nombres genéricos ("fantasmas"): ${genericProfiles.length}`);
    if (genericProfiles.length > 0) {
      console.log("Muestra de fantasmas detectados:");
      console.table(genericProfiles.slice(0, 5));
    }

    // 2. Buscar posibles huérfanos (si Prisma tiene acceso a auth.users)
    // Nota: Esto depende de si el usuario de la DB tiene permisos sobre el esquema auth.
    try {
      const orphans = await prisma.$queryRaw`
        SELECT p.user_id, p.full_name 
        FROM public.profiles p 
        LEFT JOIN auth.users u ON p.user_id = u.id 
        WHERE u.id IS NULL
      `;
      console.log(`⚠️ Perfiles huérfanos (sin cuenta en Auth): ${orphans.length}`);
      if (orphans.length > 0) console.table(orphans);
    } catch (e) {
      console.log("ℹ️ No se pudo verificar huérfanos directamente (esquema auth protegido).");
    }

    // 3. Buscar usernames duplicados (antes de aplicar el índice UNIQUE)
    const duplicates = await prisma.$queryRaw`
      SELECT username, COUNT(*) 
      FROM public.profiles 
      WHERE username IS NOT NULL 
      GROUP BY username 
      HAVING COUNT(*) > 1
    `;
    console.log(`👯 Grupos de usernames duplicados: ${duplicates.length}`);
    if (duplicates.length > 0) console.table(duplicates);

  } catch (error) {
    console.error("❌ Error en el diagnóstico:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPhantoms();
