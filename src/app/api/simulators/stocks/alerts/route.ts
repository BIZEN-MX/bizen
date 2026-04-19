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

    const alerts = await (prisma as any).marketPriceAlert.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "asc" }
    })

    return NextResponse.json(alerts)
  } catch (error) {
    console.error("Error fetching alerts:", error)
    return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (!authResult.success || !authResult.data?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { user } = authResult.data
    const { symbol, targetPrice, direction } = await request.json()

    if (!symbol || !targetPrice || !direction) return NextResponse.json({ error: "Missing fields" }, { status: 400 })

    const newAlert = await (prisma as any).marketPriceAlert.create({
      data: { userId: user.id, symbol, targetPrice: parseFloat(targetPrice), direction }
    })

    return NextResponse.json(newAlert)
  } catch (error) {
    console.error("Error creating alert:", error)
    return NextResponse.json({ error: "Failed to create alert" }, { status: 500 })
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
    const alertId = searchParams.get('id')

    if (!alertId) return NextResponse.json({ error: "Alert ID required" }, { status: 400 })

    // Check ownership
    const alert = await (prisma as any).marketPriceAlert.findUnique({ where: { id: alertId } })
    if (!alert || alert.userId !== user.id) {
        return NextResponse.json({ error: "Alert not found" }, { status: 404 })
    }

    await (prisma as any).marketPriceAlert.delete({
      where: { id: alertId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing alert:", error)
    return NextResponse.json({ error: "Failed to remove alert" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (!authResult.success || !authResult.data?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { user } = authResult.data
    const { searchParams } = new URL(request.url)
    const alertId = searchParams.get('id')

    if (!alertId) return NextResponse.json({ error: "Alert ID required" }, { status: 400 })

    const alert = await (prisma as any).marketPriceAlert.findUnique({ where: { id: alertId } })
    if (!alert || alert.userId !== user.id) {
        return NextResponse.json({ error: "Alert not found" }, { status: 404 })
    }

    if (alert.triggered) return NextResponse.json({ success: true, message: "Already triggered" })

    // Update alert to triggered
    await (prisma as any).marketPriceAlert.update({
      where: { id: alertId },
      data: { triggered: true }
    })

    // CREATE NOTIFICATION IN BIZEN GLOBAL CENTER
    const dirTxt = alert.direction === "above" ? "superó" : "cayó por debajo de";
    await (prisma as any).notification.create({
      data: {
        userId: user.id,
        title: "Alerta de Precio: " + alert.symbol,
        message: `El precio de ${alert.symbol} ${dirTxt} bz ${alert.targetPrice.toFixed(0)} en BIZEN Market.`,
        type: "system",
        priority: "high",
        link: "/simulators/stocks"
      }
    });

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error triggering alert:", error)
    return NextResponse.json({ error: "Failed to trigger alert" }, { status: 500 })
  }
}

