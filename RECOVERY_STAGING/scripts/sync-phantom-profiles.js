const { createClient } = require('@supabase/supabase-js');
const { PrismaClient } = require('@prisma/client');

// NOTE: These should be provided by environment variables in a real run, 
// but for this direct task we assume the environment has them.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; 

const prisma = new PrismaClient();
const supabase = createClient(supabaseUrl, supabaseKey);

async function syncAllProfiles() {
  console.log("🛠️ Iniciando sincronización masiva de perfiles...");
  
  try {
    const profiles = await prisma.profile.findMany();
    console.log(`📡 Procesando ${profiles.length} perfiles...`);

    for (const profile of profiles) {
      console.log(`🔄 Sincronizando: ${profile.fullName} (${profile.userId})`);

      // 1. Sincronizar hacia Supabase Auth para que la sesión sea idéntica a la DB
      try {
        const { error: authError } = await supabase.auth.admin.updateUserById(
          profile.userId,
          { user_metadata: { full_name: profile.fullName } }
        );
        if (authError) console.error(`   ❌ Error en Auth para ${profile.userId}:`, authError.message);
      } catch (e) {
        console.error(`   ❌ Error de red en Auth:`, e.message);
      }

      // 2. Limpiar usernames duplicados o inexistentes si es necesario
      if (!profile.username) {
        const defaultUsername = profile.fullName.toLowerCase().replace(/\s/g, '_') + '_' + Math.floor(Math.random() * 100);
        await prisma.profile.update({
          where: { userId: profile.userId },
          data: { username: defaultUsername }
        });
        console.log(`   📝 Asignado username: ${defaultUsername}`);
      }
    }

    console.log("✅ Limpieza completada.");

  } catch (error) {
    console.error("💥 Error fatal en la sincronización:", error);
  } finally {
    await prisma.$disconnect();
  }
}

syncAllProfiles();
