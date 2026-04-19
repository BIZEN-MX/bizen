import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth/api-auth"

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    
    if (!authResult.success || !authResult.data?.user) {
      return authResult.response || NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { user } = authResult.data

    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query") || ""

    if (!query || query.length < 3) {
      return NextResponse.json({ users: [] })
    }

    const users = await prisma.profile.findMany({
      where: {
        AND: [
          { userId: { not: user.id } }, // Exclude self
          {
            OR: [
              { fullName: { contains: query, mode: "insensitive" } },
              { nickname: { contains: query, mode: "insensitive" } }
            ]
          }
        ]
      },
      select: {
        userId: true,
        fullName: true,
        nickname: true,
        avatar: true,
        level: true,
        settings: true
      },
      take: 40 // Fetch a bit more to accommodate filtering
    })

    // Filter out users who have set their profile to private
    const visibleUsers = users.filter((u: any) => {
      if (u.settings && u.settings.privacy && u.settings.privacy.profileVisibility === 'private') {
        return false;
      }
      return true;
    });

    // Ensure uniqueness by userId (just in case)
    const uniqueUsers = Array.from(new Map(visibleUsers.map(u => [u.userId, u])).values()).slice(0, 20);

    // Sanitize output (don't leak settings)
    const sanitizedUsers = uniqueUsers.map(u => {
      const { settings, ...safeUser } = u;
      return safeUser;
    });

    return NextResponse.json({ users: sanitizedUsers })
  } catch (error) {
    console.error("Error in user search:", error)
    return NextResponse.json({ error: "Failed to search users" }, { status: 500 })
  }
}
