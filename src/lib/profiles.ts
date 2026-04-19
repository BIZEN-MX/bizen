import { prisma } from "./prisma";

/**
 * Ensures a user profile exists in the database.
 * Useful when migrating from Supabase to Clerk or for new users.
 */
export async function ensureProfile(userId: string, email?: string, fullName?: string) {
  try {
    const existing = await prisma.profile.findUnique({
      where: { userId }
    });

    if (existing) return existing;

    console.log(`[Profiles] Creating missing profile for user ${userId}`);
    
    return await prisma.profile.create({
      data: {
        userId,
        fullName: fullName || email || 'Estudiante BIZEN',
        role: 'particular',
        xp: 0,
        level: 1,
        bizcoins: 1000, // Initial welcome gift
      }
    });
  } catch (error: any) {
    console.error(`[Profiles] Error ensuring profile for ${userId}:`, error.message);
    return null;
  }
}
