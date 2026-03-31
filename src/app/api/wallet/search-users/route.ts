import { NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

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
        level: true
      },
      take: 20
    })

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Error in user search:", error)
    return NextResponse.json({ error: "Failed to search users" }, { status: 500 })
  }
}
