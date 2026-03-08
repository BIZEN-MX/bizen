import { NextRequest, NextResponse } from "next/server"
export const dynamic = 'force-dynamic'
import { createSupabaseServer } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { calculateLevel, xpInCurrentLevel, totalXpForNextLevel, xpForNextLevel, calculateCurrentStreak } from "@/lib/xp"

export async function GET() {
  let user: any = null

  try {
    const supabase = await createSupabaseServer()

    // Get current user
    const { data: { user: supabaseUser }, error: authError } = await supabase.auth.getUser()
    user = supabaseUser

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Use try-catch for each DB query to pinpoint the failure
    let profile: any = null;
    try {
      profile = await prisma.profile.findUnique({
        where: { userId: user.id },
        select: {
          xp: true,
          bizcoins: true,
          level: true,
          createdAt: true,
          currentStreak: true,
          lastActive: true,
          schoolId: true
        }
      })
    } catch (e: any) {
      console.warn("API User Stats Warning - DB profile fetch failed, using fallback:", e.message);
      // Do not throw, leaving profile = null
    }

    if (!profile) {
      // Instead of 404, return default empty stats so the client doesn't crash.
      // The actual profile creation usually happens in /api/profiles or auth callback.
      return NextResponse.json({
        xp: 0,
        level: 1,
        xpInCurrentLevel: 0,
        xpNeeded: 100,
        xpToNextLevel: 100,
        lessonsCompleted: 0,
        coursesEnrolled: 0,
        currentStreak: 0,
        certificatesCount: 0,
        totalPoints: 0,
        bizcoins: 0,
        inventory: [],
        weeklyActiveDays: [],
      })
    }

    // Optional stats (if they fail, we can still return basic stats)
    let lessonsCompleted = 0;
    try {
      lessonsCompleted = await prisma.progress.count({
        where: {
          userId: user.id,
          percent: 100,
          completedAt: { not: null }
        }
      });
    } catch (e: any) { console.warn("Failed count (lessonsCompleted):", e.message); }

    let coursesEnrolled = 0;
    try {
      coursesEnrolled = await prisma.enrollment.count({
        where: { userId: user.id }
      });
    } catch (e: any) { console.warn("Failed count (coursesEnrolled):", e.message); }

    let certificatesCount = 0;
    try {
      certificatesCount = await prisma.certificate.count({
        where: { userId: user.id }
      });
    } catch (e: any) { console.warn("Failed count (certificatesCount):", e.message); }

    const inventoryItems: any[] = await prisma.userInventoryItem.findMany({
      where: { userId: user.id },
      select: { productId: true }
    }).catch(() => []);

    // Streaks & Stats
    const currentXp = profile.xp || 0;
    const currentLevel = calculateLevel(currentXp);
    const xpInLevel = xpInCurrentLevel(currentXp);
    const totalXpNeeded = totalXpForNextLevel(currentXp);
    const xpRemaining = xpForNextLevel(currentXp);
    const currentStreakCount = calculateCurrentStreak(profile.lastActive, profile.currentStreak || 0);

    // Sync level/streak if needed
    if (currentLevel !== profile.level || currentStreakCount !== (profile.currentStreak || 0)) {
      prisma.profile.update({
        where: { userId: user.id },
        data: { level: currentLevel, currentStreak: currentStreakCount }
      }).catch(e => console.warn("Sync update failed:", e.message));
    }

    // Weekly activity
    const now = new Date();
    const dayOfWeek = now.getDay()
    const sunday = new Date(now)
    sunday.setDate(now.getDate() - dayOfWeek)
    sunday.setHours(0, 0, 0, 0)
    const saturday = new Date(sunday)
    saturday.setDate(sunday.getDate() + 6)
    saturday.setHours(23, 59, 59, 999)

    const [weeklyEvidence, weeklyProgress] = await Promise.all([
      prisma.evidencePost.findMany({
        where: { authorUserId: user.id, createdAt: { gte: sunday, lte: saturday } },
        select: { createdAt: true }
      }).catch(() => []),
      prisma.progress.findMany({
        where: { userId: user.id, completedAt: { gte: sunday, lte: saturday } },
        select: { completedAt: true }
      }).catch(() => [])
    ]);

    const activeDatesSet = new Set<string>()
    for (const e of (weeklyEvidence as any[])) {
      if (e.createdAt) activeDatesSet.add(new Date(e.createdAt).toISOString().split("T")[0])
    }
    for (const p of (weeklyProgress as any[])) {
      if (p.completedAt) activeDatesSet.add(new Date(p.completedAt).toISOString().split("T")[0])
    }

    return NextResponse.json({
      xp: currentXp,
      level: currentLevel,
      xpInCurrentLevel: xpInLevel,
      xpNeeded: totalXpNeeded,
      xpToNextLevel: xpRemaining,
      lessonsCompleted,
      coursesEnrolled,
      currentStreak: currentStreakCount,
      certificatesCount,
      totalPoints: profile.bizcoins || 0,
      bizcoins: profile.bizcoins || 0,
      inventory: inventoryItems.map(i => i.productId),
      weeklyActiveDays: Array.from(activeDatesSet),
    })

  } catch (error: any) {
    console.error("FATAL: Error in /api/user/stats:", error)
    return NextResponse.json({
      error: "Failed to fetch stats",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
