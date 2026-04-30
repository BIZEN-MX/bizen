import { NextResponse, NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth/api-auth";
import { prisma } from "@/lib/prisma";

const TIER_NAMES: Record<number, string> = {
  1: "Novato",
  2: "Bronce",
  3: "Plata",
  4: "Oro",
  5: "Diamante",
  6: "Master BIZEN",
};

const TIER_COLORS: Record<number, string> = {
  1: "#94a3b8",
  2: "#cd7f32",
  3: "#9ca3af",
  4: "#f59e0b",
  5: "#06b6d4",
  6: "#8b5cf6",
};

function getWeekBounds() {
  const now = new Date();
  const dow = now.getDay(); // 0=Sun, 1=Mon...6=Sat
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((dow + 6) % 7));
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return { weekStart: monday, weekEnd: sunday };
}

export async function GET(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (!authResult.success) return authResult.response;
  const userId = authResult.data.user.id;
  const { weekStart, weekEnd } = getWeekBounds();

  try {
    // Find existing membership this week
    let membership = await prisma.leagueMember.findFirst({
      where: {
        userId,
        league: { weekStart: { gte: weekStart }, weekEnd: { lte: weekEnd } },
      },
      include: { league: true },
    });

    // Auto-enroll in Novato (tier 1) if not in a league yet this week
    if (!membership) {
      const profile = await prisma.profile.findUnique({ where: { userId }, select: { level: true } });
      const tier = Math.min(6, Math.max(1, Math.ceil((profile?.level ?? 1) / 3)));

      // Find or create an active league for this tier with room (<30 members)
      let league = await prisma.league.findFirst({
        where: { tier, isActive: true, weekStart: { gte: weekStart } },
        include: { _count: { select: { members: true } } },
        orderBy: { createdAt: "desc" },
      });

      if (!league || (league as any)._count.members >= 30) {
        league = await prisma.league.create({
          data: {
            name: `Liga ${TIER_NAMES[tier]}`,
            tier,
            weekStart,
            weekEnd,
            isActive: true,
          },
          include: { _count: { select: { members: true } } },
        });
      }

      membership = await prisma.leagueMember.create({
        data: { leagueId: league.id, userId, weeklyXp: 0 },
        include: { league: true },
      });
    }

    // Get all members of this league with their profiles
    const members = await prisma.leagueMember.findMany({
      where: { leagueId: membership.leagueId },
      orderBy: { weeklyXp: "desc" },
    });

    const profileIds = members.map((m) => m.userId);
    const profiles = await prisma.profile.findMany({
      where: { userId: { in: profileIds } },
      select: { userId: true, fullName: true, level: true, avatar: true },
    });
    const profileMap = Object.fromEntries(profiles.map((p) => [p.userId, p]));

    const rankedMembers = members.map((m, i) => ({
      userId: m.userId,
      weeklyXp: m.weeklyXp,
      rank: i + 1,
      isMe: m.userId === userId,
      fullName: profileMap[m.userId]?.fullName ?? "Usuario",
      level: profileMap[m.userId]?.level ?? 1,
    }));

    const myEntry = rankedMembers.find((m) => m.isMe);
    const daysLeft = Math.ceil((membership.league.weekEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

    return NextResponse.json({
      league: {
        id: membership.league.id,
        name: membership.league.name,
        tier: membership.league.tier,
        color: TIER_COLORS[membership.league.tier],
        tierName: TIER_NAMES[membership.league.tier],
        weekEnd: membership.league.weekEnd,
        daysLeft,
      },
      myRank: myEntry?.rank ?? members.length,
      myWeeklyXp: myEntry?.weeklyXp ?? 0,
      totalMembers: members.length,
      members: rankedMembers.slice(0, 10), // top 10 for the widget
      promotionZone: 5, // top 5 get promoted
      relegationZone: Math.max(members.length - 5, 6), // bottom 5 get demoted
    });
  } catch (err) {
    console.error("[/api/leagues/current] Error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
