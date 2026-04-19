import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth/api-auth"

export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAuth(req)
    
    if (!authResult.success || !authResult.data?.user) {
      return authResult.response || NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { user } = authResult.data

    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get("limit") || "20")

    const transactions = await prisma.walletTransaction.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: limit
    })

    return NextResponse.json({ transactions })
  } catch (error) {
    console.error("Error fetching wallet transactions:", error)
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
  }
}
