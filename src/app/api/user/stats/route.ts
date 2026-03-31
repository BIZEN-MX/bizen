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
          schoolId: true,
          role: true
        }
      })
    } catch (e: any) {
      console.warn("API User Stats Warning - DB profile fetch failed, using fallback:", e.message);
      // Do not throw, leaving profile = null
    }

    const isAdminOrTeacher = profile?.role === 'school_admin' || profile?.role === 'teacher';

    if (!profile) {
      // If we cannot find a profile for an authenticated user, it's a database failure or a severe sync issue.
      // Do NOT return 0s as it causes UI flicker. Return 500 to indicate a retry is needed.
      return NextResponse.json({ error: "Profile not found for authenticated user" }, { status: 500 });
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

    // Sync level/streak if needed (SKIP FOR ADMINS)
    if (!isAdminOrTeacher && (currentLevel !== profile.level || currentStreakCount !== (profile.currentStreak || 0))) {
      prisma.profile.update({
        where: { userId: user.id },
        data: { level: currentLevel, currentStreak: currentStreakCount }
      }).catch(e => console.warn("Sync update failed:", e.message));
    }

    // Weekly activity — collect ALL meaningful activity types
    const now = new Date();
    const dayOfWeek = now.getDay()
    const sunday = new Date(now)
    sunday.setDate(now.getDate() - dayOfWeek)
    sunday.setHours(0, 0, 0, 0)
    const saturday = new Date(sunday)
    saturday.setDate(sunday.getDate() + 6)
    saturday.setHours(23, 59, 59, 999)

    const weekRange = { gte: sunday, lte: saturday }

    const [weeklyEvidence, weeklyProgress, weeklyForumPosts, weeklyForumComments] = await Promise.all([
      // 1. Daily Mission submissions
      prisma.evidencePost.findMany({
        where: { authorUserId: user.id, createdAt: weekRange },
        select: { createdAt: true }
      }).catch(() => []),
      // 2. Lesson completions
      prisma.progress.findMany({
        where: { userId: user.id, completedAt: weekRange },
        select: { completedAt: true }
      }).catch(() => []),
      // 3. Forum thread creation
      prisma.forumThread.findMany({
        where: { authorId: user.id, createdAt: weekRange },
        select: { createdAt: true }
      }).catch(() => []),
      // 4. Forum comments
      prisma.forumComment.findMany({
        where: { authorId: user.id, createdAt: weekRange },
        select: { createdAt: true }
      }).catch(() => []),
    ]);

    const activeDatesSet = new Set<string>()
    const addDate = (d: Date | null | undefined) => {
      if (d) activeDatesSet.add(new Date(d).toISOString().split("T")[0])
    }
    weeklyEvidence.forEach((e: any) => addDate(e.createdAt))
    weeklyProgress.forEach((p: any) => addDate(p.completedAt))
    weeklyForumPosts.forEach((p: any) => addDate(p.createdAt))
    weeklyForumComments.forEach((c: any) => addDate(c.createdAt))

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
