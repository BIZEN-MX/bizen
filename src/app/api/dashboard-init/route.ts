import { NextRequest, NextResponse } from "next/server"
export const dynamic = 'force-dynamic'
import { prisma } from "@/lib/prisma"
import { calculateLevel, xpInCurrentLevel, totalXpForNextLevel, xpForNextLevel, calculateCurrentStreak } from "@/lib/xp"
import { requireAuth } from "@/lib/auth/api-auth"

export async function GET(request: NextRequest) {
  try {
    console.log("[dashboard-init] Starting authentication check...")
    const authResult = await requireAuth(request)
    if (!authResult.success) {
      console.warn("[dashboard-init] Auth failed:", authResult.error || "Unknown reason")
      return authResult.response
    }
    const { user } = authResult.data
    console.log(`[dashboard-init] User authenticated: ${user.id} (${user.email})`)

    // Parallel fetch with independent error handling for resilience
    console.log("[dashboard-init] Fetching data components...")
    
    const fetchSafe = async (promise: Promise<any>, label: string) => {
      try {
        return await promise;
      } catch (err: any) {
        console.warn(`[dashboard-init] Soft error in ${label}:`, err.message);
        return null;
      }
    };

    const [profile, topics, progress, diagnostic, transactions] = await Promise.all([
      fetchSafe(prisma.profile.findUnique({ where: { userId: user.id } }), "Profile"),
      fetchSafe(prisma.topic.findMany({
        where: { isActive: true },
        include: {
          courses: { orderBy: { order: 'asc' } },
          _count: { select: { courses: true } }
        },
        orderBy: { displayOrder: 'asc' }
      }), "Topics"),
      fetchSafe(prisma.progress.findMany({ where: { userId: user.id } }), "Progress"),
      fetchSafe(prisma.diagnosticResult.findFirst({
        where: { email: { equals: user.email || "", mode: 'insensitive' } },
        orderBy: { createdAt: 'desc' }
      }), "Diagnostic"),
      fetchSafe(prisma.walletTransaction.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 10
      }), "Transactions")
    ]);

    if (!profile) {
      console.log(`[dashboard-init] Profile missing for user ${user.id}, creating ephemeral state...`)
      return NextResponse.json({
        stats: {
          xp: 0, level: 1, xpInCurrentLevel: 0, xpNeeded: 100, xpToNextLevel: 100,
          lessonsCompleted: 0, coursesEnrolled: 0, currentStreak: 0,
          certificatesCount: 0, bizcoins: 0, inventory: [], weeklyActiveDays: [],
        },
        topics: topics || [],
        progress: [],
        diagnostic: { exists: false },
        profile: {
          userId: user.id,
          fullName: user.fullName || "Usuario",
          role: 'particular',
          xp: 0, bizcoins: 0, level: 1
        },
        transactions: []
      })
    }

    console.log("[dashboard-init] Calculating user stats...")
    // Calculate Stats
    const currentXp = profile.xp || 0
    const currentLevel = calculateLevel(currentXp)
    const currentStreakCount = calculateCurrentStreak(profile.lastActive, profile.currentStreak || 0)

    console.log("[dashboard-init] Fetching counts...")
    // Secondary data (counts)
    const [lessonsCompleted, coursesEnrolled, certificatesCount, inventoryResults] = await Promise.all([
      prisma.progress.count({ where: { userId: user.id, percent: 100 } }),
      prisma.enrollment.count({ where: { userId: user.id } }),
      prisma.certificate.count({ where: { userId: user.id } }),
      prisma.userInventoryItem.findMany({ where: { userId: user.id }, select: { productId: true } })
    ]).catch(err => {
      console.warn("[dashboard-init] Soft error fetching counts:", err.message)
      return [0, 0, 0, []]
    })

    const inventoryItems = Array.isArray(inventoryResults) ? inventoryResults : []

    // Weekly activity
    const now = new Date()
    const sunday = new Date(now)
    sunday.setDate(now.getDate() - now.getDay())
    sunday.setHours(0, 0, 0, 0)
    const weekRange = { gte: sunday }

    const weeklyActivity = await prisma.progress.findMany({
      where: { userId: user.id, completedAt: weekRange },
      select: { completedAt: true }
    }).catch(() => [])

    const activeDatesSet = new Set<string>()
    weeklyActivity.forEach((p: any) => {
      if (p.completedAt) activeDatesSet.add(new Date(p.completedAt).toISOString().split("T")[0])
    })

    console.log("[dashboard-init] Success. Returning payload.")
    return NextResponse.json({
      stats: {
        xp: currentXp,
        level: currentLevel,
        xpInCurrentLevel: xpInCurrentLevel(currentXp),
        xpNeeded: totalXpForNextLevel(currentXp),
        xpToNextLevel: xpForNextLevel(currentXp),
        lessonsCompleted,
        coursesEnrolled,
        currentStreak: currentStreakCount,
        certificatesCount,
        bizcoins: profile.bizcoins || 0,
        inventory: inventoryItems.map((i:any) => i.productId),
        weeklyActiveDays: Array.from(activeDatesSet),
      },
      topics,
      progress: progress.map(p => p.lessonId || (p as any).slug).filter(Boolean),
      diagnostic: diagnostic ? { exists: true, adnProfile: diagnostic.dnaProfile } : { exists: false },
      profile: {
          ...profile,
          adnProfile: profile.dnaProfile || diagnostic?.dnaProfile
      },
      transactions: transactions || []
    })

  } catch (error: any) {
    console.error("[dashboard-init] FATAL CRASH:", error.message || error)
    
    // Safety Fallback for local development or DB outages
    const host = request.headers.get("host") || "";
    if (host.includes("localhost") || host.includes("127.0.0.1")) {
      console.log("[dashboard-init] Localhost detected during crash. Serving rescue mock data.")
      return NextResponse.json({
        stats: {
          xp: 1250, level: 5, xpInCurrentLevel: 250, xpNeeded: 1000, xpToNextLevel: 750,
          lessonsCompleted: 10, coursesEnrolled: 3, currentStreak: 5,
          certificatesCount: 2, bizcoins: 8500, inventory: [], weeklyActiveDays: ["Mon", "Tue", "Wed"]
        },
        topics: [], progress: [], diagnostic: { exists: false },
        profile: { userId: "dev_user_id", nickname: "Diego BIZEN (Local)", xp: 1250, bizcoins: 8500 },
        transactions: []
      })
    }

    return NextResponse.json({ 
      error: "Internal Server Error", 
      details: error.message || "Unknown error" 
    }, { status: 500 })
  }
}
