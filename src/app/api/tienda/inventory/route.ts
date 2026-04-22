import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth/api-auth"

export async function GET(request: NextRequest) {
    try {
        const authResult = await requireAuth(request)

        if (!authResult.success) {
            return authResult.response
        }

        const { user } = authResult.data

        const inventoryItems = await prisma.userInventoryItem.findMany({
            where: { userId: user.id },
            select: { productId: true }
        })

        return NextResponse.json({
            inventory: inventoryItems.map(item => item.productId)
        })

    } catch (error: any) {
        console.error("Fetch inventory error:", error)
        return NextResponse.json({ error: "Error fetching inventory" }, { status: 500 })
    }
}
