const { createClient } = require('@supabase/supabase-js');
const { PrismaClient } = require('@prisma/client');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; 

const prisma = new PrismaClient();
const supabase = createClient(supabaseUrl, supabaseKey);

async function purgePhantoms() {
  console.log("🕯️ Iniciando purga de perfiles fantasma...");
  
  try {
    const profiles = await prisma.profile.findMany();
    console.log(`📡 Analizando ${profiles.length} perfiles en total...`);

    let purgedCount = 0;
    let syncedCount = 0;

    for (const profile of profiles) {
      // Intentar obtener el usuario de Supabase Auth
      const { data: userData, error: authError } = await supabase.auth.admin.getUserById(profile.userId);

      if (authError && authError.status === 404) {
        // PERFIL FANTASMA DETECTADO: El usuario no existe en Auth
        console.log(`👻 GHOST DETECTED: Eliminando perfil de ${profile.fullName} (${profile.userId}) - Razón: No existe en Auth.`);
        await prisma.profile.delete({ where: { userId: profile.userId } });
        purgedCount++;
      } else if (userData && userData.user) {
        // USUARIO VÁLIDO: Sincronizar nombre por si acaso
        if (userData.user.user_metadata?.full_name !== profile.fullName) {
          console.log(`🔄 SYNCING: ${profile.fullName} -> Actualizando metadatos de sesión...`);
          await supabase.auth.admin.updateUserById(profile.userId, {
            user_metadata: { full_name: profile.fullName }
          });
        }
        syncedCount++;
      } else {
        console.warn(`⚠️ OMITIENDO: ${profile.fullName} - Error desconocido en Auth: ${authError?.message}`);
      }
    }

    console.log("\n✨ RESULTADOS DE LA LIMPIEZA:");
    console.log(`✅ Perfiles válidos sincronizados: ${syncedCount}`);
    console.log(`🗑️ Perfiles fantasma eliminados: ${purgedCount}`);

  } catch (error) {
    console.error("💥 Error fatal en la purga:", error);
  } finally {
    await prisma.$disconnect();
  }
}

purgePhantoms();
