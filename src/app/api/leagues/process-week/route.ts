import { NextResponse, NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth/api-auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

// This endpoint is called by a cron job or admin. It:
// 1. Closes active leagues whose weekEnd has passed
// 2. Promotes top 5, demotes bottom 5
// 3. Syncs weekly XP for all active members

async function isAdmin(req: Request) {
  const authHeader = (await headers()).get("authorization");
  return authHeader === `Bearer ${process.env.ADMIN_SECRET}`;
}

export async function POST(req: NextRequest) {
  // Allow admin token or super-admin user
  const authResult = await requireAuth(req);
  const adminAllowed = await isAdmin(req);
  const isAdminUser = authResult.success && authResult.data.user.email === "diego@bizen.mx";
  if (!adminAllowed && !isAdminUser) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const now = new Date();

  // Find leagues that ended and are still marked active
  const expiredLeagues = await prisma.league.findMany({
    where: { isActive: true, weekEnd: { lt: now } },
    include: {
      members: { orderBy: { weeklyXp: "desc" } },
    },
  });

  let processed = 0;

  for (const league of expiredLeagues) {
    const totalMembers = league.members.length;
    if (totalMembers === 0) {
      await prisma.league.update({ where: { id: league.id }, data: { isActive: false } });
      continue;
    }

    const promotionCount = Math.min(5, Math.floor(totalMembers * 0.2));
    const relegationCount = Math.min(5, Math.floor(totalMembers * 0.2));

    const updates = league.members.map((m, i) => {
      const rank = i + 1;
      const promoted = rank <= promotionCount && league.tier < 6;
      const demoted = rank > totalMembers - relegationCount && league.tier > 1;
      return prisma.leagueMember.update({
        where: { id: m.id },
        data: { rank, promoted, demoted },
      });
    });

    await Promise.all(updates);
    await prisma.league.update({ where: { id: league.id }, data: { isActive: false } });
    processed++;
  }

  return NextResponse.json({ ok: true, leaguesProcessed: processed });
}

// Endpoint to add XP to a user's current weekly league tally
// Called internally after XP-granting events (lesson complete, quiz, etc.)
export async function PATCH(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (!authResult.success) return authResult.response;
  const userId = authResult.data.user.id;

  const { xpAmount } = await req.json();
  if (!xpAmount || xpAmount <= 0) return NextResponse.json({ ok: true });

  const now = new Date();
  const membership = await prisma.leagueMember.findFirst({
    where: {
      userId,
      league: { isActive: true, weekEnd: { gte: now } },
    },
  });

  if (!membership) return NextResponse.json({ ok: true }); // Not in a league yet — will auto-enroll on next GET

  await prisma.leagueMember.update({
    where: { id: membership.id },
    data: { weeklyXp: { increment: xpAmount } },
  });

  return NextResponse.json({ ok: true });
}
