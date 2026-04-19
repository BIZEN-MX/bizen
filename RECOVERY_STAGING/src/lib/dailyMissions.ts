import { prisma } from "@/lib/prisma"
import { awardXp } from "@/lib/rewards"
import { checkAndAwardAchievements } from "@/lib/achievements"

/**
 * Motor central de eventos para misiones autocompletables.
 * Busca la misión de HOY. Si coincide con la acción (ej: "buy_stock")
 * y el usuario no la ha completado, simula un post en el foro de evidencia y le da XP.
 * No crashea si algo falla (fail-safe).
 */
export async function triggerAutoMission(userId: string, actionType: string) {
    try {
        // 1. Determinar el rango de HOY (Tiempo CDMX aprox o UTC estándar adaptado)
        const mxFormatter = new Intl.DateTimeFormat("en-US", {
            timeZone: "America/Mexico_City",
            year: "numeric", month: "2-digit", day: "2-digit",
        })
        const parts = mxFormatter.formatToParts(new Date())
        const y = parts.find(p => p.type === "year")?.value
        const m = parts.find(p => p.type === "month")?.value
        const d = parts.find(p => p.type === "day")?.value

        const todayStr = `${y}-${m}-${d}`;
        const startDate = new Date(`${todayStr}T00:00:00Z`);
        const endDate = new Date(`${todayStr}T23:59:59Z`);

        // 2. Buscar la misión del día
        const challenge = await prisma.dailyChallenge.findFirst({
            where: {
                activeDate: { gte: startDate, lte: endDate }
            }
        });

        if (!challenge) {
            return; // No hay misión explícita cargada para hoy
        }

        // 3. Verificamos si esta misión admite autocompletado y matchear la acción
        // El formato esperado si se crea en DB: challengeType="simulator", payload={"action": "buy_stock"}
        const payload = challenge.payload as Record<string, any>;
        
        // Verificamos si el payload especifica esta acción exacta
        const requiresAction = payload && typeof payload === 'object' && payload.action === actionType;
        
        if (!requiresAction) {
            return; // Esta misión no reacciona a este disparador
        }

        // 4. Verificamos si ya la completó
        const existing = await prisma.evidencePost.findFirst({
            where: {
                dailyChallengeId: challenge.id,
                authorUserId: userId
            }
        });

        if (existing) {
            return; // Ya cobró la XP
        }

        // 5. Inyectamos la recompensa a la vena (Auto-completar simulando evidencia)
        const profile = await prisma.profile.findUnique({
            where: { userId },
            select: { schoolId: true }
        });

        let smartGoal = "🎯 ¡Misión cumplida en automático!";
        let didToday = `🚀 Accioné el disparador '${actionType}' dentro de la plataforma BIZEN de forma exitosa.`;
        
        if (actionType === "buy_stock") {
            smartGoal = "🎯 Invertir en el simulador bursátil";
            didToday = "🚀 He analizado el mercado y he realizado una orden de compra exitosamente.";
        }

        await prisma.evidencePost.create({
            data: {
                dailyChallengeId: challenge.id,
                authorUserId: userId,
                schoolId: profile?.schoolId ?? null,
                smartGoal,
                didToday,
                learned: "A tomar acción práctica en mi portafolio impulsado por BIZEN.",
                changeTomorrow: "Seguiré buscando oportunidades.",
            }
        });

        // 6. Entregar XP
        const xpToAward = challenge.xpReward ?? 50;
        await awardXp(userId, xpToAward, {
            category: "daily_mission_reward",
            description: `Misión automática (${actionType}): ${challenge.title}`
        });

        // 7. Evaluar Logros de fondo (Fire and Forget)
        const retosCompleted = await prisma.evidencePost.count({ where: { authorUserId: userId } }).catch(() => 0);
        const profileStats = await prisma.profile.findUnique({ where: { userId }, select: { currentStreak: true, level: true, bizcoins: true } }).catch(() => null);
        
        checkAndAwardAchievements(userId, {
            retosCompleted,
            currentStreak: profileStats?.currentStreak ?? 0,
            level:         profileStats?.level         ?? 1,
            bizcoins:      profileStats?.bizcoins      ?? 0,
        }).catch(() => {});

        console.log(`✅ [DailyMissions] Auto-misión '${actionType}' completada para el usuario ${userId}`);

    } catch (error) {
        console.error("❌ [DailyMissions] Falla silenciosa en triggerAutoMission:", error);
    }
}
