import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth/api-auth"

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (!authResult.success || !authResult.data?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { user } = authResult.data

    const watchlist = await (prisma as any).marketWatchlist.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "asc" }
    })

    return NextResponse.json(watchlist)
  } catch (error) {
    console.error("Error fetching watchlist:", error)
    return NextResponse.json({ error: "Failed to fetch watchlist" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (!authResult.success || !authResult.data?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { user } = authResult.data
    const { symbol } = await request.json()

    if (!symbol) return NextResponse.json({ error: "Symbol required" }, { status: 400 })

    const existing = await (prisma as any).marketWatchlist.findUnique({
      where: { userId_symbol: { userId: user.id, symbol } }
    })
    
    if (existing) return NextResponse.json(existing)

    const newWatchlist = await (prisma as any).marketWatchlist.create({
      data: { userId: user.id, symbol }
    })

    return NextResponse.json(newWatchlist)
  } catch (error) {
    console.error("Error adding to watchlist:", error)
    return NextResponse.json({ error: "Failed to add to watchlist" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (!authResult.success || !authResult.data?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { user } = authResult.data
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol')

    if (!symbol) return NextResponse.json({ error: "Symbol required" }, { status: 400 })

    await (prisma as any).marketWatchlist.deleteMany({
      where: { userId: user.id, symbol }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing from watchlist:", error)
    return NextResponse.json({ error: "Failed to remove from watchlist" }, { status: 500 })
  }
}
